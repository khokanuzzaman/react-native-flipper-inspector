import { interceptorRegistry } from './interceptorRegistry';

// Global function to add API calls - will be set by the store provider
let globalAddApiCall: ((apiCall: any) => void) | null = null;

export function setGlobalAddApiCall(fn: (apiCall: any) => void) {
  globalAddApiCall = fn;
}

function addApiCall(apiCall: any) {
  console.log('[NetworkInterceptor] addApiCall called:', apiCall.method, apiCall.url);
  if (globalAddApiCall) {
    console.log('[NetworkInterceptor] ✅ Calling globalAddApiCall');
    globalAddApiCall(apiCall);
  } else {
    console.warn('[NetworkInterceptor] ❌ globalAddApiCall not set! StoreProvider may not be initialized.');
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
  private unregisterFetch: (() => void) | undefined;
  private unregisterXHR: (() => void) | undefined;
  private isRegistered: boolean = false;

  constructor() {
    console.log('[NetworkInterceptor] Constructor - Using unified interceptor registry');
  }

  startIntercepting() {
    if (this.isRegistered) {
      console.warn('[NetworkInterceptor] Already registered, skipping...');
      return;
    }
    
    console.log('[NetworkInterceptor] Registering with interceptor registry...');
    
    // Register callbacks with the unified registry
    this.unregisterFetch = interceptorRegistry.registerFetchCallback((data) => {
      addApiCall(data);
    });
    console.log('[NetworkInterceptor] ✅ Fetch callback registered');
    
    this.unregisterXHR = interceptorRegistry.registerXHRCallback((data) => {
      addApiCall(data);
    });
    console.log('[NetworkInterceptor] ✅ XHR callback registered');
    
    this.isRegistered = true;
    
    const status = interceptorRegistry.getStatus();
    console.log('[NetworkInterceptor] ✅ Registration complete:', status);
    console.log('[NetworkInterceptor] 🎉 ALL network traffic (Fetch + XHR/Axios) will be captured!');
  }

  stopIntercepting() {
    if (!this.isRegistered) return;
    
    console.log('[NetworkInterceptor] Unregistering callbacks...');
    
    if (this.unregisterFetch) {
      this.unregisterFetch();
      this.unregisterFetch = undefined;
      console.log('[NetworkInterceptor] ✅ Fetch callback unregistered');
    }
    
    if (this.unregisterXHR) {
      this.unregisterXHR();
      this.unregisterXHR = undefined;
      console.log('[NetworkInterceptor] ✅ XHR callback unregistered');
    }
    
    this.isRegistered = false;
    console.log('[NetworkInterceptor] ✅ Unregistration complete');
  }
}

// Global instance
let networkInterceptor: NetworkInterceptor | null = null;
let isGloballyPatched = false;

export function startNetworkInterception() {
  if (isGloballyPatched) {
    console.warn('[NetworkInterceptor] Network interception already active globally');
    return;
  }
  
  if (!networkInterceptor) {
    console.log('[NetworkInterceptor] Creating new interceptor instance');
    networkInterceptor = new NetworkInterceptor();
  }
  
  networkInterceptor.startIntercepting();
  isGloballyPatched = true;
}

export function stopNetworkInterception() {
  if (networkInterceptor) {
    networkInterceptor.stopIntercepting();
    isGloballyPatched = false;
  }
}

export { NetworkInterceptor };

// NOTE: Old patching methods removed
// The NetworkInterceptor now uses the unified interceptorRegistry
// which prevents conflicts and ensures proper coordination between
// multiple systems (Flipper integration, Overlay, etc.)

