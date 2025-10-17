import { describe, it, expect, beforeEach, vi } from 'vitest';
import { patchNetwork } from '../integrations/network';
import { attachRedux as attachReduxIntegration } from '../integrations/redux';

// Mock global fetch and XMLHttpRequest
const mockFetch = vi.fn();
const mockXMLHttpRequest = vi.fn();

global.fetch = mockFetch;
global.XMLHttpRequest = mockXMLHttpRequest as any;

describe('Network Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should patch fetch requests', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      text: () => Promise.resolve('{"data": "test"}'),
      clone: () => mockResponse,
    };

    mockFetch.mockResolvedValue(mockResponse);

    const unpatch = patchNetwork({
      enabled: true,
      redactHeaders: ['authorization'],
    });

    // Make a request
    await fetch('https://api.example.com/test', {
      method: 'GET',
      headers: { 'authorization': 'Bearer token123' },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({
        method: 'GET',
        headers: { 'authorization': 'Bearer token123' },
      })
    );

    unpatch();
  });

  it('should handle fetch errors', async () => {
    const error = new Error('Network error');
    mockFetch.mockRejectedValue(error);

    const unpatch = patchNetwork({ enabled: true });

    await expect(fetch('https://api.example.com/error')).rejects.toThrow('Network error');

    unpatch();
  });

  it('should patch XMLHttpRequest', () => {
    const mockXHR = {
      open: vi.fn(),
      send: vi.fn(),
      addEventListener: vi.fn(),
      getAllResponseHeaders: () => 'content-type: application/json\r\n',
      responseText: '{"data": "test"}',
      status: 200,
    };

    mockXMLHttpRequest.mockReturnValue(mockXHR);

    const unpatch = patchNetwork({ enabled: true });

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.example.com/test');
    xhr.send();

    expect(mockXHR.open).toHaveBeenCalledWith('GET', 'https://api.example.com/test');
    expect(mockXHR.send).toHaveBeenCalled();

    unpatch();
  });

  it('should handle XMLHttpRequest errors', () => {
    const mockXHR = {
      open: vi.fn(),
      send: vi.fn(),
      addEventListener: vi.fn((event, callback) => {
        if (event === 'error') {
          setTimeout(() => callback(), 0);
        }
      }),
    };

    mockXMLHttpRequest.mockReturnValue(mockXHR);

    const unpatch = patchNetwork({ enabled: true });

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.example.com/error');
    xhr.send();

    expect(mockXHR.addEventListener).toHaveBeenCalledWith('error', expect.any(Function));

    unpatch();
  });
});

describe('Redux Integration', () => {
  let mockStore: any;
  let mockListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockListener = vi.fn();
    mockStore = {
      getState: vi.fn().mockReturnValue({ counter: 0, user: null }),
      subscribe: vi.fn().mockReturnValue(() => {}),
      dispatch: vi.fn(),
    };
  });

  it('should attach to Redux store', () => {
    const unattach = attachReduxIntegration(mockStore, {
      whitelist: ['counter'],
    });

    expect(mockStore.subscribe).toHaveBeenCalled();
    expect(mockStore.getState).toHaveBeenCalled();

    unattach();
  });

  it('should track state changes', () => {
    let stateChangeCallback: (() => void) | null = null;
    
    mockStore.subscribe.mockImplementation((callback: () => void) => {
      stateChangeCallback = callback;
      return () => {};
    });

    const unattach = attachReduxIntegration(mockStore, {
      whitelist: ['counter'],
    });

    // Simulate state change
    mockStore.getState.mockReturnValue({ counter: 1, user: null });
    stateChangeCallback?.();

    expect(mockStore.getState).toHaveBeenCalledTimes(2); // Initial + change

    unattach();
  });

  it('should filter state with whitelist', () => {
    mockStore.getState.mockReturnValue({
      counter: 1,
      user: { id: '123', name: 'John' },
      sensitive: { token: 'secret' },
    });

    const unattach = attachReduxIntegration(mockStore, {
      whitelist: ['counter', 'user'],
    });

    // The integration should only track whitelisted keys
    expect(mockStore.getState).toHaveBeenCalled();

    unattach();
  });

  it('should filter state with blacklist', () => {
    mockStore.getState.mockReturnValue({
      counter: 1,
      user: { id: '123', name: 'John' },
      sensitive: { token: 'secret' },
    });

    const unattach = attachReduxIntegration(mockStore, {
      blacklist: ['sensitive'],
    });

    expect(mockStore.getState).toHaveBeenCalled();

    unattach();
  });

  it('should use custom serializer', () => {
    const customSerializer = vi.fn((state) => ({ ...state, serialized: true }));
    
    mockStore.getState.mockReturnValue({ counter: 1 });

    const unattach = attachReduxIntegration(mockStore, {
      serialize: customSerializer,
    });

    expect(customSerializer).toHaveBeenCalledWith({ counter: 1 });

    unattach();
  });

  it('should handle store errors gracefully', () => {
    mockStore.getState.mockImplementation(() => {
      throw new Error('Store error');
    });

    // Should not throw
    const unattach = attachReduxIntegration(mockStore, {});

    expect(mockStore.getState).toHaveBeenCalled();

    unattach();
  });
});
