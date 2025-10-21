/**
 * Unified Network Interceptor Registry
 * 
 * This singleton ensures that network methods (fetch, XHR) are patched only ONCE,
 * and allows multiple systems (Flipper, Overlay, etc.) to listen to network events
 * without conflicts or infinite recursion.
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
  
  // Store truly original methods (before any patching)
  private originalFetch: typeof fetch;
  private originalXHROpen: typeof XMLHttpRequest.prototype.open;
  private originalXHRSend: typeof XMLHttpRequest.prototype.send;
  
  // Track if methods are patched
  private fetchPatched = false;
  private xhrPatched = false;
  
  // Callbacks for network events
  private fetchCallbacks: Set<NetworkCallback> = new Set();
  private xhrCallbacks: Set<NetworkCallback> = new Set();
  
  // Active XHR requests
  private activeXHRRequests = new Map<XMLHttpRequest, any>();
  
  private constructor() {
    // Store originals immediately when registry is created
    this.originalFetch = (globalThis as any).fetch;
    this.originalXHROpen = XMLHttpRequest.prototype.open;
    this.originalXHRSend = XMLHttpRequest.prototype.send;
    
    console.log('[InterceptorRegistry] Registry initialized, originals stored');
  }
  
  static getInstance(): InterceptorRegistry {
    if (!InterceptorRegistry.instance) {
      InterceptorRegistry.instance = new InterceptorRegistry();
    }
    return InterceptorRegistry.instance;
  }
  
  /**
   * Register a callback for fetch events
   */
  registerFetchCallback(callback: NetworkCallback): () => void {
    this.fetchCallbacks.add(callback);
    console.log(`[InterceptorRegistry] Fetch callback registered (${this.fetchCallbacks.size} total)`);
    
    // Patch fetch if not already patched
    if (!this.fetchPatched) {
      this.patchFetch();
    }
    
    // Return unregister function
    return () => {
      this.fetchCallbacks.delete(callback);
      console.log(`[InterceptorRegistry] Fetch callback unregistered (${this.fetchCallbacks.size} remaining)`);
    };
  }
  
  /**
   * Register a callback for XHR events
   */
  registerXHRCallback(callback: NetworkCallback): () => void {
    this.xhrCallbacks.add(callback);
    console.log(`[InterceptorRegistry] XHR callback registered (${this.xhrCallbacks.size} total)`);
    
    // Patch XHR if not already patched
    if (!this.xhrPatched) {
      this.patchXHR();
    }
    
    // Return unregister function
    return () => {
      this.xhrCallbacks.delete(callback);
      console.log(`[InterceptorRegistry] XHR callback unregistered (${this.xhrCallbacks.size} remaining)`);
    };
  }
  
  /**
   * Notify all fetch callbacks
   */
  private notifyFetchCallbacks(data: NetworkEvent) {
    this.fetchCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('[InterceptorRegistry] Error in fetch callback:', error);
      }
    });
  }
  
  /**
   * Notify all XHR callbacks
   */
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
   * Patch fetch (only once)
   */
  private patchFetch() {
    if (this.fetchPatched) {
      console.warn('[InterceptorRegistry] Fetch already patched, skipping');
      return;
    }
    
    console.log('[InterceptorRegistry] Patching fetch...');
    
    const self = this;
    
    (globalThis as any).fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
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
        const response = await self.originalFetch(input, init);
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
        } catch (error) {
          responseBody = '[Failed to read response]';
        }
        
        const responseHeaders: Record<string, string> = {};
        try {
          (response.headers as any).forEach?.((value: string, key: string) => {
            responseHeaders[key] = value;
          });
        } catch (error) {
          // Ignore
        }
        
        // Notify all callbacks
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
        
        // Notify all callbacks about error
        self.notifyFetchCallbacks({
          method,
          url,
          duration,
          requestHeaders,
          requestBody,
          error: error.message || 'Network error',
        });
        
        throw error;
      }
    };
    
    this.fetchPatched = true;
    console.log('[InterceptorRegistry] ✅ Fetch patched successfully');
  }
  
  /**
   * Patch XMLHttpRequest (only once)
   */
  private patchXHR() {
    if (this.xhrPatched) {
      console.warn('[InterceptorRegistry] XHR already patched, skipping');
      return;
    }
    
    console.log('[InterceptorRegistry] Patching XHR...');
    
    const self = this;
    
    // Patch open
    XMLHttpRequest.prototype.open = function (
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
      
      return self.originalXHROpen.call(this, method, url.toString(), async ?? true, user, password);
    };
    
    // Patch send
    XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
      const request = self.activeXHRRequests.get(this);
      
      if (request) {
        // Capture request body
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
      
      // Add load event listener
      this.addEventListener('load', function() {
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
          } catch (error) {
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
          } catch (error) {
            // Ignore
          }
          
          // Notify all callbacks
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
      
      // Add error event listener
      this.addEventListener('error', function() {
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
      
      // Add timeout event listener
      this.addEventListener('timeout', function() {
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
      
      return self.originalXHRSend.call(this, body);
    };
    
    this.xhrPatched = true;
    console.log('[InterceptorRegistry] ✅ XHR patched successfully');
  }
  
  /**
   * Get status info
   */
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

// Export singleton instance
export const interceptorRegistry = InterceptorRegistry.getInstance();

