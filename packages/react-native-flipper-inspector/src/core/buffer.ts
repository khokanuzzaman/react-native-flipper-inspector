import { InspectorMessage } from '../types';

/**
 * Message buffer for batching and performance optimization
 */
export class MessageBuffer {
  private messages: InspectorMessage[] = [];
  private flushInterval: number;
  private maxItems: number;
  private flushCallback: (messages: InspectorMessage[]) => void;
  private intervalId?: NodeJS.Timeout | undefined;

  constructor(
    flushCallback: (messages: InspectorMessage[]) => void,
    intervalMs: number = 500,
    maxItems: number = 50
  ) {
    this.flushCallback = flushCallback;
    this.flushInterval = intervalMs;
    this.maxItems = maxItems;
    this.startFlushTimer();
  }

  /**
   * Add a message to the buffer
   */
  add(message: InspectorMessage): void {
    this.messages.push(message);

    // Force flush if we've reached the maximum number of items
    if (this.messages.length >= this.maxItems) {
      this.flush();
    }
  }

  /**
   * Immediately flush all buffered messages
   */
  flush(): void {
    if (this.messages.length === 0) {
      return;
    }

    const messagesToFlush = [...this.messages];
    this.messages = [];
    this.flushCallback(messagesToFlush);
  }

  /**
   * Start the periodic flush timer
   */
  private startFlushTimer(): void {
    this.intervalId = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Stop the flush timer and flush any remaining messages
   */
  destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.flush();
  }

  /**
   * Get the current number of buffered messages
   */
  size(): number {
    return this.messages.length;
  }

  /**
   * Clear all buffered messages without flushing
   */
  clear(): void {
    this.messages = [];
  }
}
