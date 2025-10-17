/**
 * Types for the Flipper plugin
 */

export interface InspectorMessage {
  id?: string;
  type: MessageType;
  ts: number;
  data: Record<string, any>;
  tags?: Record<string, string> | undefined;
}

export type MessageType = 'log' | 'error' | 'metric' | 'state' | 'trace' | 'network';

export interface LogMessage extends InspectorMessage {
  type: 'log';
  data: {
    event: string;
    payload?: Record<string, any>;
  };
}

export interface ErrorMessage extends InspectorMessage {
  type: 'error';
  data: {
    error: string;
    stack?: string;
    meta?: Record<string, any>;
  };
}

export interface MetricMessage extends InspectorMessage {
  type: 'metric';
  data: {
    name: string;
    value: number;
    unit?: string;
  };
}

export interface StateMessage extends InspectorMessage {
  type: 'state';
  data: {
    section: string;
    action: 'update' | 'remove';
    data?: Record<string, any>;
    keys?: string[];
    changes?: Record<string, any>;
    initial?: boolean;
  };
}

export interface TraceMessage extends InspectorMessage {
  type: 'trace';
  data: {
    name: string;
    id?: string;
    action: 'start' | 'end';
    duration?: number;
    extra?: Record<string, any>;
  };
}

export interface NetworkMessage extends InspectorMessage {
  type: 'network';
  data: {
    method: string;
    url: string;
    status?: number;
    duration?: number;
    requestSize?: number;
    responseSize?: number;
    headers?: Record<string, string>;
    body?: any;
    error?: string;
  };
}

export type AnyMessage = LogMessage | ErrorMessage | MetricMessage | StateMessage | TraceMessage | NetworkMessage;

export interface FilterState {
  search: string;
  messageType: MessageType | 'all';
  timeRange: {
    start: number;
    end: number;
  } | null;
  tags: Record<string, string>;
}

export interface UIState {
  selectedTab: MessageType;
  isLiveMode: boolean;
  isPaused: boolean;
  filters: FilterState;
  selectedMessage: InspectorMessage | null;
  columnVisibility: Record<string, boolean>;
}

export interface TableColumn {
  key: string;
  label: string;
  width?: number;
  sortable?: boolean;
  render?: (value: any, message: AnyMessage) => React.ReactNode;
}
