import { InspectorConfig, InspectorMessage, TraceHandle, StateManager } from '../types';
import { Transport, createTransport } from './transport';
import { MessageBuffer } from './buffer';
import { InspectorStateManager } from './state';
import { safeStringify } from './serializer';

/**
 * Main inspector class that coordinates all debugging functionality
 */
export class Inspector {
  private config: Required<InspectorConfig>;
  private transport: Transport;
  private buffer?: MessageBuffer;
  private stateManager: StateManager;
  private traces: Map<string, number> = new Map();
  private defaultTags: Record<string, string> = {};

  constructor(config: InspectorConfig = {}) {
    this.config = this.mergeConfig(config);
    this.transport = createTransport();
    this.stateManager = new InspectorStateManager(this.sendMessage.bind(this));

    // Initialize batching if enabled
    if (this.config.batch.intervalMs! > 0) {
      this.buffer = new MessageBuffer(
        this.flushMessages.bind(this),
        this.config.batch.intervalMs!,
        this.config.batch.maxItems!
      );
    }

    this.defaultTags = this.config.tags;
  }

  /**
   * Send a message through the transport layer
   */
  private sendMessage(message: InspectorMessage): void {
    if (!this.config.enabled) {
      return;
    }

    // Add default tags
    if (this.defaultTags && Object.keys(this.defaultTags).length > 0) {
      message.tags = { ...this.defaultTags, ...message.tags };
    }

    // Add unique ID if not present
    if (!message.id) {
      message.id = this.generateId();
    }

    if (this.buffer) {
      this.buffer.add(message);
    } else {
      this.transport.send(message);
    }
  }

  /**
   * Flush batched messages
   */
  private flushMessages(messages: InspectorMessage[]): void {
    for (const message of messages) {
      this.transport.send(message);
    }
  }

  /**
   * Log an event with optional payload
   */
  log(event: string, payload?: Record<string, any>): void {
    this.sendMessage({
      type: 'log',
      ts: Date.now(),
      data: {
        event,
        payload: payload ? this.sanitizePayload(payload) : undefined,
      },
    });
  }

  /**
   * Log an error with optional metadata
   */
  error(error: Error | string, meta?: Record<string, any>): void {
    const errorData = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'object' ? error.stack : undefined;

    this.sendMessage({
      type: 'error',
      ts: Date.now(),
      data: {
        error: errorData,
        stack,
        meta: meta ? this.sanitizePayload(meta) : undefined,
      },
    });
  }

  /**
   * Log a metric with value and optional tags
   */
  metric(name: string, value: number, tags?: Record<string, string>): void {
    const message: InspectorMessage = {
      type: 'metric',
      ts: Date.now(),
      data: {
        name,
        value,
      },
    };
    
    if (tags) {
      message.tags = tags;
    }
    
    this.sendMessage(message);
  }

  /**
   * Start a performance trace
   */
  trace(name: string, id?: string): TraceHandle {
    const traceId = id || this.generateId();
    const startTime = Date.now();
    this.traces.set(traceId, startTime);

    this.sendMessage({
      type: 'trace',
      ts: startTime,
      data: {
        name,
        id: traceId,
        action: 'start',
      },
    });

    return {
      end: (extra?: Record<string, any>) => {
        const endTime = Date.now();
        const startTime = this.traces.get(traceId);
        this.traces.delete(traceId);

        const duration = startTime ? endTime - startTime : undefined;

        this.sendMessage({
          type: 'trace',
          ts: endTime,
          data: {
            name,
            id: traceId,
            action: 'end',
            duration,
            extra: extra ? this.sanitizePayload(extra) : undefined,
          },
        });
      },
    };
  }

  /**
   * Get the state manager
   */
  get state(): StateManager {
    return this.stateManager;
  }

  /**
   * Check if inspector is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Check if transport is connected
   */
  isConnected(): boolean {
    return this.transport.isConnected();
  }

  /**
   * Force flush any buffered messages
   */
  flush(): void {
    if (this.buffer) {
      this.buffer.flush();
    }
  }

  /**
   * Destroy the inspector and cleanup resources
   */
  destroy(): void {
    if (this.buffer) {
      this.buffer.destroy();
    }
    this.traces.clear();
  }

  /**
   * Merge user config with defaults
   */
  private mergeConfig(config: InspectorConfig): Required<InspectorConfig> {
    const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false;

    return {
      enabled: config.enabled ?? isDev,
      batch: {
        intervalMs: config.batch?.intervalMs ?? 500,
        maxItems: config.batch?.maxItems ?? 50,
      },
      tags: config.tags ?? {},
      maxPayloadSize: config.maxPayloadSize ?? 10240,
      networkEnabled: config.networkEnabled ?? false,
      redactHeaders: config.redactHeaders ?? ['authorization', 'cookie', 'x-api-key'],
      redactBody: config.redactBody ?? false,
    };
  }

  /**
   * Sanitize payload to ensure it's within size limits and safe to serialize
   */
  private sanitizePayload(payload: Record<string, any>): Record<string, any> {
    try {
      const serialized = safeStringify(payload, {
        maxSize: this.config.maxPayloadSize,
      });

      if (serialized.includes('[Size Limit Reached]')) {
        return {
          ...payload,
          _truncated: true,
          _size: serialized.length,
        };
      }

      return payload;
    } catch (error) {
      return {
        error: 'Payload serialization failed',
        originalKeys: Object.keys(payload),
      };
    }
  }

  /**
   * Generate a unique ID for messages
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
