import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MessageBuffer } from '../core/buffer';
import { InspectorMessage } from '../types';

describe('MessageBuffer', () => {
  let buffer: MessageBuffer;
  let flushCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    flushCallback = vi.fn();
    buffer = new MessageBuffer(flushCallback, 1000, 3);
  });

  afterEach(() => {
    buffer.destroy();
    vi.useRealTimers();
  });

  it('should add messages to buffer', () => {
    const message: InspectorMessage = {
      type: 'log',
      ts: Date.now(),
      data: { event: 'test' }
    };

    buffer.add(message);
    expect(buffer.size()).toBe(1);
  });

  it('should flush when max items reached', () => {
    const messages = [
      { type: 'log', ts: Date.now(), data: { event: 'test1' } },
      { type: 'log', ts: Date.now(), data: { event: 'test2' } },
      { type: 'log', ts: Date.now(), data: { event: 'test3' } },
    ];

    messages.forEach(msg => buffer.add(msg));

    expect(flushCallback).toHaveBeenCalledWith(messages);
    expect(buffer.size()).toBe(0);
  });

  it('should flush after interval', () => {
    const message: InspectorMessage = {
      type: 'log',
      ts: Date.now(),
      data: { event: 'test' }
    };

    buffer.add(message);
    expect(flushCallback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(flushCallback).toHaveBeenCalledWith([message]);
  });

  it('should flush immediately when flush called', () => {
    const message: InspectorMessage = {
      type: 'log',
      ts: Date.now(),
      data: { event: 'test' }
    };

    buffer.add(message);
    buffer.flush();

    expect(flushCallback).toHaveBeenCalledWith([message]);
    expect(buffer.size()).toBe(0);
  });

  it('should clear buffer without flushing', () => {
    const message: InspectorMessage = {
      type: 'log',
      ts: Date.now(),
      data: { event: 'test' }
    };

    buffer.add(message);
    buffer.clear();

    expect(buffer.size()).toBe(0);
    expect(flushCallback).not.toHaveBeenCalled();
  });

  it('should destroy and flush remaining messages', () => {
    const message: InspectorMessage = {
      type: 'log',
      ts: Date.now(),
      data: { event: 'test' }
    };

    buffer.add(message);
    buffer.destroy();

    expect(flushCallback).toHaveBeenCalledWith([message]);
    expect(buffer.size()).toBe(0);
  });

  it('should handle multiple flush calls gracefully', () => {
    buffer.flush();
    buffer.flush();
    buffer.flush();

    // Should not throw errors
    expect(buffer.size()).toBe(0);
  });

  it('should stop timer after destroy', () => {
    const message: InspectorMessage = {
      type: 'log',
      ts: Date.now(),
      data: { event: 'test' }
    };

    buffer.add(message);
    buffer.destroy();

    // Advance timers - should not trigger flush since buffer is destroyed
    vi.advanceTimersByTime(1000);
    
    // flushCallback should only be called once (from destroy)
    expect(flushCallback).toHaveBeenCalledTimes(1);
  });
});
