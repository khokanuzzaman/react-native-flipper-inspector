import { describe, it, expect, beforeEach, vi } from 'vitest';
import { init, log, error, metric, trace, state, isEnabled, isConnected } from '../api';

// Mock the inspector module
vi.mock('../core/inspector', () => ({
  Inspector: vi.fn().mockImplementation(() => ({
    log: vi.fn(),
    error: vi.fn(),
    metric: vi.fn(),
    trace: vi.fn().mockReturnValue({ end: vi.fn() }),
    state: {
      update: vi.fn(),
      remove: vi.fn(),
      getState: vi.fn().mockReturnValue({}),
    },
    isEnabled: vi.fn().mockReturnValue(true),
    isConnected: vi.fn().mockReturnValue(false),
    flush: vi.fn(),
    destroy: vi.fn(),
  })),
}));

describe('API', () => {
  beforeEach(() => {
    // Reset module state
    vi.resetModules();
  });

  it('should initialize inspector', () => {
    expect(() => init({ enabled: true })).not.toThrow();
  });

  it('should log events', () => {
    expect(() => log('test-event', { key: 'value' })).not.toThrow();
  });

  it('should log errors', () => {
    expect(() => error('test error')).not.toThrow();
    expect(() => error(new Error('test error'))).not.toThrow();
  });

  it('should log metrics', () => {
    expect(() => metric('test-metric', 42)).not.toThrow();
    expect(() => metric('test-metric', 42, { unit: 'ms' })).not.toThrow();
  });

  it('should create traces', () => {
    const traceHandle = trace('test-trace');
    expect(traceHandle).toBeDefined();
    expect(traceHandle.end).toBeDefined();
    expect(() => traceHandle.end({ result: 'success' })).not.toThrow();
  });

  it('should manage state', () => {
    expect(() => state.update('test-section', { key: 'value' })).not.toThrow();
    expect(() => state.remove('test-section', ['key'])).not.toThrow();
    expect(() => state.remove('test-section')).not.toThrow();
    
    const currentState = state.getState();
    expect(currentState).toBeDefined();
  });

  it('should check enabled status', () => {
    const enabled = isEnabled();
    expect(typeof enabled).toBe('boolean');
  });

  it('should check connection status', () => {
    const connected = isConnected();
    expect(typeof connected).toBe('boolean');
  });
});
