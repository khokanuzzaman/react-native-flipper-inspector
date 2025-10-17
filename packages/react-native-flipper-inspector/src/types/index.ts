/**
 * Core types for React Native Flipper Inspector
 */

export interface InspectorConfig {
  /** Whether the inspector is enabled (default: true in __DEV__) */
  enabled?: boolean;
  /** Batching configuration for performance optimization */
  batch?: {
    /** Interval in milliseconds to flush batched messages (default: 500) */
    intervalMs?: number;
    /** Maximum number of items to batch before forcing a flush (default: 50) */
    maxItems?: number;
  };
  /** Default tags to include with every record */
  tags?: Record<string, string>;
  /** Maximum size for serialized payloads in bytes (default: 10240) */
  maxPayloadSize?: number;
  /** Whether to enable network patching by default */
  networkEnabled?: boolean;
  /** Headers to redact from network requests */
  redactHeaders?: string[];
  /** Whether to redact request/response bodies */
  redactBody?: boolean;
}

export interface InspectorMessage {
  /** Message type identifier */
  type: MessageType;
  /** Timestamp in milliseconds */
  ts: number;
  /** Message data payload */
  data: Record<string, any>;
  /** Additional tags for filtering */
  tags?: Record<string, string>;
  /** Unique message ID */
  id?: string;
}

export type MessageType = 'log' | 'error' | 'metric' | 'state' | 'trace' | 'network';

export interface LogMessage {
  event: string;
  payload?: Record<string, any>;
}

export interface ErrorMessage {
  error: string;
  stack?: string;
  meta?: Record<string, any>;
}

export interface MetricMessage {
  name: string;
  value: number;
  unit?: string;
}

export interface StateMessage {
  section: string;
  action: 'update' | 'remove';
  data?: Record<string, any>;
  keys?: string[];
}

export interface TraceMessage {
  name: string;
  id?: string;
  action: 'start' | 'end';
  duration?: number;
  extra?: Record<string, any>;
}

export interface NetworkMessage {
  method: string;
  url: string;
  status?: number;
  duration?: number;
  requestSize?: number;
  responseSize?: number;
  headers?: Record<string, string>;
  body?: any;
  error?: string;
}

export interface Transport {
  send(message: InspectorMessage): void;
  isConnected(): boolean;
}

export interface TraceHandle {
  end(extra?: Record<string, any>): void;
}

export interface StateManager {
  update(section: string, data: Record<string, any>): void;
  remove(section: string, keys?: string[]): void;
  getState(): Record<string, any>;
}

export interface NetworkPatchOptions {
  enabled?: boolean;
  redactHeaders?: string[];
  redactBody?: boolean;
}

export interface ReduxOptions {
  whitelist?: string[];
  blacklist?: string[];
  serialize?: (state: any) => any;
}
