// Global function to add API calls - will be set by the store provider
let globalAddApiCall: ((apiCall: any) => void) | null = null;

export function setGlobalAddApiCall(fn: (apiCall: any) => void) {
  globalAddApiCall = fn;
}

function addApiCall(apiCall: any) {
  if (globalAddApiCall) {
    globalAddApiCall(apiCall);
  }
}

interface ApiCallData {
  method: string;
  url: string;
  status?: number;
  duration: number;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: string | undefined;
  responseBody?: string;
  error?: string;
}

interface NetworkRequest {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: any;
  startTime: number;
}

// Track active XMLHttpRequest requests
const activeRequests = new Map<XMLHttpRequest, NetworkRequest>();

class NetworkInterceptor {
  private originalFetch: typeof fetch;
  private originalXHROpen: typeof XMLHttpRequest.prototype.open;
  private originalXHRSend: typeof XMLHttpRequest.prototype.send;
  private isPatched: boolean = false;

  constructor() {
    this.originalFetch = (globalThis as any).fetch;
    this.originalXHROpen = XMLHttpRequest.prototype.open;
    this.originalXHRSend = XMLHttpRequest.prototype.send;
  }

  startIntercepting() {
    if (this.isPatched) return;
    
    this.patchFetch();
    this.patchXMLHttpRequest();
    this.isPatched = true;
  }

  stopIntercepting() {
    if (!this.isPatched) return;
    
    (globalThis as any).fetch = this.originalFetch;
    XMLHttpRequest.prototype.open = this.originalXHROpen;
    XMLHttpRequest.prototype.send = this.originalXHRSend;
    activeRequests.clear();
    this.isPatched = false;
  }

  private patchFetch() {
    (globalThis as any).fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const startTime = Date.now();
      const url = typeof input === 'string' ? input : input.toString();
      const httpMethod = init?.method || 'GET';
      
      let requestBody: string | undefined;
      let requestHeaders: Record<string, string> = {};

      // Extract request data
      if (init?.body) {
        if (typeof init.body === 'string') {
          requestBody = init.body;
        } else if (init.body instanceof FormData) {
          requestBody = '[FormData]';
        } else if (init.body instanceof ArrayBuffer) {
          requestBody = '[ArrayBuffer]';
        } else {
          requestBody = '[Binary Data]';
        }
      }

      if (init?.headers) {
        if (init.headers instanceof Headers) {
          // Convert Headers to object
          const headersObj: Record<string, string> = {};
          (init.headers as any).forEach?.((value: string, key: string) => {
            headersObj[key] = value;
          });
          requestHeaders = headersObj;
        } else if (Array.isArray(init.headers)) {
          requestHeaders = Object.fromEntries(init.headers);
        } else {
          requestHeaders = init.headers as Record<string, string>;
        }
      }

      try {
        const response = await this.originalFetch(input, init);
        const duration = Date.now() - startTime;
        
        // Clone response to read body without affecting original
        const clonedResponse = response.clone();
        let responseBody: string | undefined;
        
        try {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json') || contentType.includes('text/')) {
            responseBody = await clonedResponse.text();
          } else {
            responseBody = '[Binary Response]';
          }
        } catch (error) {
          responseBody = '[Failed to read response]';
        }

        const responseHeaders: Record<string, string> = {};
        try {
          // Convert response headers to object
          (response.headers as any).forEach?.((value: string, key: string) => {
            responseHeaders[key] = value;
          });
        } catch (error) {
          // Ignore header conversion errors
        }

        const apiCallData: ApiCallData = {
          method: httpMethod,
          url,
          status: response.status,
          duration,
          requestHeaders,
          responseHeaders,
          requestBody,
          responseBody,
        };

        addApiCall(apiCallData);
        return response;
      } catch (error: any) {
        const duration = Date.now() - startTime;
        
        const apiCallData: ApiCallData = {
          method: httpMethod,
          url,
          duration,
          requestHeaders,
          requestBody,
          error: error.message || 'Network error',
        };

        addApiCall(apiCallData);
        throw error;
      }
    };
  }

  private patchXMLHttpRequest() {
    const self = this;

    // Patch XMLHttpRequest.open
    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string | URL,
      async?: boolean,
      user?: string | null,
      password?: string | null
    ) {
      const requestKey = this;
      const urlString = url.toString();
      
      activeRequests.set(requestKey, {
        method,
        url: urlString,
        startTime: Date.now(),
      });

      return self.originalXHROpen.call(this, method, url.toString(), async ?? true, user, password);
    };

    // Patch XMLHttpRequest.send
    XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
      const requestKey = this;
      const request = activeRequests.get(requestKey);

      if (request) {
        // Capture request body and headers
        let requestBody: string | undefined;
        if (body) {
          if (typeof body === 'string') {
            requestBody = body;
          } else if (body instanceof FormData) {
            requestBody = '[FormData]';
          } else if (body instanceof ArrayBuffer) {
            requestBody = '[ArrayBuffer]';
          } else {
            requestBody = '[Binary Data]';
          }
        }
        request.body = requestBody;
      }

      // Add event listeners
      this.addEventListener('load', function() {
        if (request) {
          const endTime = Date.now();
          const duration = endTime - request.startTime;

          let responseBody: string | undefined;
          try {
            const contentType = this.getResponseHeader('content-type') || '';
            if (contentType.includes('application/json') || contentType.includes('text/')) {
              responseBody = this.responseText;
            } else {
              responseBody = '[Binary Response]';
            }
          } catch (error) {
            responseBody = '[Failed to read response]';
          }

          // Parse response headers
          const responseHeaders: Record<string, string> = {};
          try {
            const headersString = this.getAllResponseHeaders();
            headersString.split('\r\n').forEach(line => {
              const [key, value] = line.split(': ');
              if (key && value) {
                responseHeaders[key.toLowerCase()] = value;
              }
            });
          } catch (error) {
            // Ignore header parsing errors
          }

          const apiCallData: ApiCallData = {
            method: request.method,
            url: request.url,
            status: this.status,
            duration,
            ...(request.headers && { requestHeaders: request.headers }),
            responseHeaders,
            ...(request.body && { requestBody: request.body }),
            responseBody,
          };

          addApiCall(apiCallData);
          activeRequests.delete(requestKey);
        }
      });

      this.addEventListener('error', function() {
        if (request) {
          const endTime = Date.now();
          const duration = endTime - request.startTime;

          const apiCallData: ApiCallData = {
            method: request.method,
            url: request.url,
            duration,
            ...(request.headers && { requestHeaders: request.headers }),
            ...(request.body && { requestBody: request.body }),
            error: 'Network request failed',
          };

          addApiCall(apiCallData);
          activeRequests.delete(requestKey);
        }
      });

      this.addEventListener('timeout', function() {
        if (request) {
          const endTime = Date.now();
          const duration = endTime - request.startTime;

          const apiCallData: ApiCallData = {
            method: request.method,
            url: request.url,
            duration,
            ...(request.headers && { requestHeaders: request.headers }),
            ...(request.body && { requestBody: request.body }),
            error: 'Request timeout',
          };

          addApiCall(apiCallData);
          activeRequests.delete(requestKey);
        }
      });

      return self.originalXHRSend.call(this, body);
    };
  }
}

// Global instance
let networkInterceptor: NetworkInterceptor | null = null;

export function startNetworkInterception() {
  if (!networkInterceptor) {
    networkInterceptor = new NetworkInterceptor();
  }
  networkInterceptor.startIntercepting();
}

export function stopNetworkInterception() {
  if (networkInterceptor) {
    networkInterceptor.stopIntercepting();
  }
}

export { NetworkInterceptor };