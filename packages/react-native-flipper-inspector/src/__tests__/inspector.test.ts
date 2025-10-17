import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Inspector } from '../core/inspector';

// Mock react-native-flipper
vi.mock('react-native-flipper', () => ({
  default: vi.fn().mockImplementation(() => ({
    addPlugin: vi.fn(),
    on: vi.fn(),
    send: vi.fn(),
  })),
}));

describe('Inspector', () => {
  let inspector: Inspector;

  beforeEach(() => {
    inspector = new Inspector({
      enabled: true,
      batch: { intervalMs: 0, maxItems: 10 },
    });
  });

  it('should initialize with default config', () => {
    const defaultInspector = new Inspector();
    expect(defaultInspector.isEnabled()).toBe(true);
  });

  it('should disable when enabled is false', () => {
    const disabledInspector = new Inspector({ enabled: false });
    expect(disabledInspector.isEnabled()).toBe(false);
  });

  it('should log events', () => {
    const logSpy = vi.spyOn(inspector as any, 'sendMessage');
    inspector.log('test-event', { key: 'value' });
    
    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'log',
        data: expect.objectContaining({
          event: 'test-event',
          payload: { key: 'value' },
        }),
      })
    );
  });

  it('should log errors', () => {
    const logSpy = vi.spyOn(inspector as any, 'sendMessage');
    const error = new Error('Test error');
    inspector.error(error, { context: 'test' });
    
    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        data: expect.objectContaining({
          error: 'Test error',
          stack: error.stack,
          meta: { context: 'test' },
        }),
      })
    );
  });

  it('should log metrics', () => {
    const logSpy = vi.spyOn(inspector as any, 'sendMessage');
    inspector.metric('test-metric', 42, { unit: 'ms' });
    
    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'metric',
        data: expect.objectContaining({
          name: 'test-metric',
          value: 42,
        }),
        tags: { unit: 'ms' },
      })
    );
  });

  it('should create traces', () => {
    const logSpy = vi.spyOn(inspector as any, 'sendMessage');
    const trace = inspector.trace('test-trace');
    
    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'trace',
        data: expect.objectContaining({
          name: 'test-trace',
          action: 'start',
        }),
      })
    );

    trace.end({ result: 'success' });
    
    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'trace',
        data: expect.objectContaining({
          name: 'test-trace',
          action: 'end',
          duration: expect.any(Number),
          extra: { result: 'success' },
        }),
      })
    );
  });

  it('should manage state', () => {
    const logSpy = vi.spyOn(inspector as any, 'sendMessage');
    
    inspector.state.update('test-section', { key1: 'value1' });
    
    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'state',
        data: expect.objectContaining({
          section: 'test-section',
          action: 'update',
          data: { key1: 'value1' },
        }),
      })
    );

    inspector.state.update('test-section', { key2: 'value2' });
    
    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'state',
        data: expect.objectContaining({
          section: 'test-section',
          action: 'update',
          data: { key1: 'value1', key2: 'value2' },
        }),
      })
    );
  });

  it('should flush buffered messages', () => {
    inspector.flush();
    // No error should be thrown
    expect(true).toBe(true);
  });

  it('should destroy and cleanup', () => {
    inspector.destroy();
    // No error should be thrown
    expect(true).toBe(true);
  });
});
