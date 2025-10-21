import { NetworkPatchOptions, InspectorMessage } from '../types';
import { getInspector } from '../api';
import { redactHeaders, truncateString } from '../core/serializer';

interface NetworkRequest {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: any;
  startTime: number;
  requestSize?: number;
}

// Store original fetch and XMLHttpRequest
let originalFetch: typeof fetch;
let originalXHROpen: typeof XMLHttpRequest.prototype.open;
let originalXHRSend: typeof XMLHttpRequest.prototype.send;

// Track active requests
const activeRequests = new Map<XMLHttpRequest | string, NetworkRequest>();

/**
 * Patch network requests to capture them for inspection
 */
export function patchNetwork(options: NetworkPatchOptions = {}): () => void {
  const {
    enabled = true,
    redactHeaders: headersToRedact = ['authorization', 'cookie', 'x-api-key'],
    redactBody = false,
  } = options;

  if (!enabled) {
    return () => {};
  }

  // Store original functions
  originalFetch = (globalThis as any).fetch;
  originalXHROpen = XMLHttpRequest.prototype.open;
  originalXHRSend = XMLHttpRequest.prototype.send;

  // Patch fetch
  (globalThis as any).fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const startTime = Date.now();
    const url = typeof input === 'string' ? input : input.toString();
    const httpMethod = init?.method || 'GET';

    try {
      const response = await originalFetch(input, init);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Capture response details
      const responseClone = response.clone();
      let responseBody: any = null;
      let responseSize = 0;

      try {
        const responseText = await responseClone.text();
        responseSize = new Blob([responseText]).size;
        responseBody = redactBody ? '[REDACTED]' : truncateString(responseText, 1000);
      } catch (error) {
        responseBody = '[Failed to read response body]';
      }

      // Send network message
      sendNetworkMessage({
        method: httpMethod,
        url,
        status: response.status,
        duration,
        requestSize: init?.body ? new Blob([init.body as BlobPart]).size : 0,
        responseSize,
        headers: redactHeaders(
          Object.fromEntries(Array.from((response.headers as any).entries())),
          headersToRedact
        ),
        body: responseBody,
      });

      return response;
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Send error message
      sendNetworkMessage({
        method: httpMethod,
        url,
        duration,
        requestSize: init?.body ? new Blob([init.body as BlobPart]).size : 0,
        error: error instanceof Error ? error.message : 'Network error',
      });

      throw error;
    }
  };

  // Patch XMLHttpRequest
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

    return originalXHROpen.call(this, method, url.toString(), async ?? true, user, password);
  };

  XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
    const requestKey = this;
    const request = activeRequests.get(requestKey);

    if (request) {
      request.body = body;
      request.requestSize = body ? new Blob([body as BlobPart]).size : 0;
    }

    // Add event listeners
    this.addEventListener('load', () => {
      if (request) {
        const endTime = Date.now();
        const duration = endTime - request.startTime;

        let responseBody: any = null;
        let responseSize = 0;

        try {
          responseBody = redactBody ? '[REDACTED]' : truncateString(this.responseText, 1000);
          responseSize = new Blob([this.responseText]).size;
        } catch (error) {
          responseBody = '[Failed to read response body]';
        }

        sendNetworkMessage({
          method: request.method,
          url: request.url,
          status: this.status,
          duration,
          requestSize: request.requestSize,
          responseSize,
          headers: redactHeaders(
            this.getAllResponseHeaders().split('\r\n').reduce((acc, header) => {
              const [key, value] = header.split(': ');
              if (key && value) acc[key] = value;
              return acc;
            }, {} as Record<string, string>),
            headersToRedact
          ),
          body: responseBody,
        });

        activeRequests.delete(requestKey);
      }
    });

    this.addEventListener('error', () => {
      if (request) {
        const endTime = Date.now();
        const duration = endTime - request.startTime;

        sendNetworkMessage({
          method: request.method,
          url: request.url,
          duration,
          requestSize: request.requestSize,
          error: 'Network request failed',
        });

        activeRequests.delete(requestKey);
      }
    });

    this.addEventListener('timeout', () => {
      if (request) {
        const endTime = Date.now();
        const duration = endTime - request.startTime;

        sendNetworkMessage({
          method: request.method,
          url: request.url,
          duration,
          requestSize: request.requestSize,
          error: 'Request timeout',
        });

        activeRequests.delete(requestKey);
      }
    });

    return originalXHRSend.call(this, body);
  };

  // Return unpatch function
  return () => {
    if (originalFetch) {
      (globalThis as any).fetch = originalFetch;
    }
    if (originalXHROpen) {
      XMLHttpRequest.prototype.open = originalXHROpen;
    }
    if (originalXHRSend) {
      XMLHttpRequest.prototype.send = originalXHRSend;
    }
    activeRequests.clear();
  };
}

/**
 * Send a network message to the inspector
 */
function sendNetworkMessage(data: InspectorMessage['data']): void {
  try {
    const inspector = getInspector();
    inspector['sendMessage']({
      type: 'network',
      ts: Date.now(),
      data,
    });
  } catch (error) {
    // Silently handle errors to avoid breaking the app
    console.warn('Failed to send network message:', error);
  }
}

/**
 * Check if network patching is active
 */
export function isNetworkPatched(): boolean {
  return (globalThis as any).fetch !== originalFetch;
}
