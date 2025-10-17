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

class NetworkInterceptor {
  private originalFetch: typeof fetch;
  private isPatched: boolean = false;

  constructor() {
    this.originalFetch = global.fetch;
  }

  startIntercepting() {
    if (this.isPatched) return;
    
    this.patchFetch();
    this.isPatched = true;
  }

  stopIntercepting() {
    if (!this.isPatched) return;
    
    global.fetch = this.originalFetch;
    this.isPatched = false;
  }

  private patchFetch() {
    global.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const startTime = Date.now();
      const url = typeof input === 'string' ? input : input.toString();
      const method = init?.method || 'GET';
      
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
          method,
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
          method,
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