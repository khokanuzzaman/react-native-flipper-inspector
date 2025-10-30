/**
 * Unified Network Interceptor Registry
 *
 * Ensures that fetch/XMLHttpRequest are patched at most once and allows
 * multiple systems (Flipper transport, floating overlay, etc.) to subscribe
 * to network traffic without stepping on each other.
 */

type NetworkCallback = (data: any) => void;

interface NetworkEvent {
  method: string;
  url: string;
  status?: number;
  duration: number;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: string;
  responseBody?: string;
  error?: string;
}

class InterceptorRegistry {
  private static instance: InterceptorRegistry;

  // Store original methods so we can restore them if needed.
  private originalFetch?: typeof fetch;
  private originalXHROpen?: any;
  private originalXHRSend?: any;

  private readonly isFetchAvailable: boolean;
  private readonly isXHRAvailable: boolean;

  private fetchPatched = false;
  private xhrPatched = false;

  private fetchCallbacks: Set<NetworkCallback> = new Set();
  private xhrCallbacks: Set<NetworkCallback> = new Set();

  private activeXHRRequests = new Map<any, any>();

  private constructor() {
    this.isFetchAvailable = typeof (globalThis as any).fetch === 'function';
    this.isXHRAvailable = typeof (globalThis as any).XMLHttpRequest === 'function';

    if (this.isFetchAvailable) {
      this.originalFetch = (globalThis as any).fetch;
    } else {
      console.warn('[InterceptorRegistry] Fetch API unavailable; fetch interception disabled');
    }

    if (this.isXHRAvailable) {
      const xhr = (globalThis as any).XMLHttpRequest;
      this.originalXHROpen = xhr?.prototype?.open;
      this.originalXHRSend = xhr?.prototype?.send;
    } else {
      console.warn('[InterceptorRegistry] XMLHttpRequest unavailable; XHR interception disabled');
    }

    console.log('[InterceptorRegistry] Registry initialized, originals stored');
  }

  static getInstance(): InterceptorRegistry {
    if (!InterceptorRegistry.instance) {
      InterceptorRegistry.instance = new InterceptorRegistry();
    }
    return InterceptorRegistry.instance;
  }

  /**
   * Register a callback for fetch events.
   */
  registerFetchCallback(callback: NetworkCallback): () => void {
    if (!this.isFetchAvailable || !this.originalFetch) {
      console.warn('[InterceptorRegistry] Fetch API unavailable; skipping fetch interception');
      return () => {};
    }

    this.fetchCallbacks.add(callback);
    console.log(`[InterceptorRegistry] Fetch callback registered (${this.fetchCallbacks.size} total)`);

    if (!this.fetchPatched) {
      this.patchFetch();
    }

    return () => {
      this.fetchCallbacks.delete(callback);
      console.log(`[InterceptorRegistry] Fetch callback unregistered (${this.fetchCallbacks.size} remaining)`);
    };
  }

  /**
   * Register a callback for XHR events.
   */
  registerXHRCallback(callback: NetworkCallback): () => void {
    if (!this.isXHRAvailable || !this.originalXHROpen || !this.originalXHRSend) {
      console.warn('[InterceptorRegistry] XMLHttpRequest unavailable; skipping XHR interception');
      return () => {};
    }

    this.xhrCallbacks.add(callback);
    console.log(`[InterceptorRegistry] XHR callback registered (${this.xhrCallbacks.size} total)`);

    if (!this.xhrPatched) {
      this.patchXHR();
    }

    return () => {
      this.xhrCallbacks.delete(callback);
      console.log(`[InterceptorRegistry] XHR callback unregistered (${this.xhrCallbacks.size} remaining)`);
    };
  }

  private notifyFetchCallbacks(data: NetworkEvent) {
    this.fetchCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('[InterceptorRegistry] Error in fetch callback:', error);
      }
    });
  }

  private notifyXHRCallbacks(data: NetworkEvent) {
    this.xhrCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('[InterceptorRegistry] Error in XHR callback:', error);
      }
    });
  }

  /**
   * Patch fetch (only once).
   */
  private patchFetch() {
    if (!this.isFetchAvailable || !this.originalFetch) {
      console.warn('[InterceptorRegistry] Fetch API unavailable; cannot patch fetch');
      return;
    }

    if (this.fetchPatched) {
      console.warn('[InterceptorRegistry] Fetch already patched, skipping');
      return;
    }

    console.log('[InterceptorRegistry] Patching fetch...');

    const originalFetch = this.originalFetch;
    const self = this;

    (globalThis as any).fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const startTime = Date.now();
      const url = typeof input === 'string' ? input : input.toString();
      const method = init?.method || 'GET';

      let requestBody: string | undefined;
      let requestHeaders: Record<string, string> = {};

      if (init?.body) {
        if (typeof init.body === 'string') {
          requestBody = init.body;
        } else if (typeof FormData !== 'undefined' && init.body instanceof FormData) {
          requestBody = '[FormData]';
        } else if (typeof ArrayBuffer !== 'undefined' && init.body instanceof ArrayBuffer) {
          requestBody = '[ArrayBuffer]';
        } else {
          requestBody = '[Binary Data]';
        }
      }

      if (init?.headers) {
        if (init.headers instanceof Headers) {
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
        const response = await originalFetch(input, init);
        const duration = Date.now() - startTime;

        const clonedResponse = response.clone();
        let responseBody: string | undefined;

        try {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json') || contentType.includes('text/')) {
            responseBody = await clonedResponse.text();
          } else {
            responseBody = '[Binary Response]';
          }
        } catch {
          responseBody = '[Failed to read response]';
        }

        const responseHeaders: Record<string, string> = {};
        try {
          (response.headers as any).forEach?.((value: string, key: string) => {
            responseHeaders[key] = value;
          });
        } catch {
          // ignore header extraction errors
        }

        self.notifyFetchCallbacks({
          method,
          url,
          status: response.status,
          duration,
          requestHeaders,
          responseHeaders,
          requestBody,
          responseBody,
        });

        return response;
      } catch (error: any) {
        const duration = Date.now() - startTime;

        self.notifyFetchCallbacks({
          method,
          url,
          duration,
          requestHeaders,
          requestBody,
          error: error?.message || 'Network error',
        });

        throw error;
      }
    };

    this.fetchPatched = true;
    console.log('[InterceptorRegistry] ✅ Fetch patched successfully');
  }

  /**
   * Patch XMLHttpRequest (only once).
   */
  private patchXHR() {
    if (!this.isXHRAvailable || !this.originalXHROpen || !this.originalXHRSend) {
      console.warn('[InterceptorRegistry] XMLHttpRequest unavailable; cannot patch XHR');
      return;
    }

    if (this.xhrPatched) {
      console.warn('[InterceptorRegistry] XHR already patched, skipping');
      return;
    }

    console.log('[InterceptorRegistry] Patching XHR...');

    const XMLHttpRequestGlobal = (globalThis as any).XMLHttpRequest;
    const originalOpen = this.originalXHROpen;
    const originalSend = this.originalXHRSend;
    const self = this;

    XMLHttpRequestGlobal.prototype.open = function (
      method: string,
      url: string | URL,
      async?: boolean,
      user?: string | null,
      password?: string | null
    ) {
      self.activeXHRRequests.set(this, {
        method,
        url: url.toString(),
        startTime: Date.now(),
      });

      return originalOpen.call(this, method, url.toString(), async ?? true, user, password);
    };

    XMLHttpRequestGlobal.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
      const request = self.activeXHRRequests.get(this);

      if (request) {
        if (body) {
          if (typeof body === 'string') {
            request.body = body;
          } else if (typeof FormData !== 'undefined' && body instanceof FormData) {
            request.body = '[FormData]';
          } else if (typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer) {
            request.body = '[ArrayBuffer]';
          } else {
            request.body = '[Binary Data]';
          }
        }
      }

      this.addEventListener('load', function () {
        if (request) {
          const duration = Date.now() - request.startTime;

          let responseBody: string | undefined;
          try {
            const contentType = this.getResponseHeader('content-type') || '';
            if (contentType.includes('application/json') || contentType.includes('text/')) {
              responseBody = this.responseText;
            } else {
              responseBody = '[Binary Response]';
            }
          } catch {
            responseBody = '[Failed to read response]';
          }

          const responseHeaders: Record<string, string> = {};
          try {
            const headersString = this.getAllResponseHeaders();
            headersString.split('\r\n').forEach(line => {
              const [key, value] = line.split(': ');
              if (key && value) {
                responseHeaders[key.toLowerCase()] = value;
              }
            });
          } catch {
            // ignore header extraction errors
          }

          self.notifyXHRCallbacks({
            method: request.method,
            url: request.url,
            status: this.status,
            duration,
            requestHeaders: request.headers,
            responseHeaders,
            requestBody: request.body,
            responseBody,
          });

          self.activeXHRRequests.delete(this);
        }
      });

      this.addEventListener('error', function () {
        if (request) {
          const duration = Date.now() - request.startTime;

          self.notifyXHRCallbacks({
            method: request.method,
            url: request.url,
            duration,
            requestHeaders: request.headers,
            requestBody: request.body,
            error: 'Network request failed',
          });

          self.activeXHRRequests.delete(this);
        }
      });

      this.addEventListener('timeout', function () {
        if (request) {
          const duration = Date.now() - request.startTime;

          self.notifyXHRCallbacks({
            method: request.method,
            url: request.url,
            duration,
            requestHeaders: request.headers,
            requestBody: request.body,
            error: 'Request timeout',
          });

          self.activeXHRRequests.delete(this);
        }
      });

      return originalSend.call(this, body);
    };

    this.xhrPatched = true;
    console.log('[InterceptorRegistry] ✅ XHR patched successfully');
  }

  getStatus() {
    return {
      fetchPatched: this.fetchPatched,
      xhrPatched: this.xhrPatched,
      fetchCallbacks: this.fetchCallbacks.size,
      xhrCallbacks: this.xhrCallbacks.size,
      activeXHRRequests: this.activeXHRRequests.size,
    };
  }
}

export const interceptorRegistry = InterceptorRegistry.getInstance();
