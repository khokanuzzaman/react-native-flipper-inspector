/**
 * Public API for React Native Flipper Inspector
 */

import { Inspector } from '../core/inspector';
import { InspectorConfig, TraceHandle, StateManager, NetworkPatchOptions, ReduxOptions } from '../types';
import { patchNetwork as patchNetworkImpl } from '../integrations/network';
import { attachRedux as attachReduxImpl } from '../integrations/redux';

// Global inspector instance
let inspector: Inspector | null = null;

/**
 * Initialize the inspector with configuration
 */
export function init(config?: InspectorConfig): void {
  if (inspector) {
    inspector.destroy();
  }
  inspector = new Inspector(config);
}

/**
 * Get the current inspector instance
 */
export function getInspector(): Inspector {
  if (!inspector) {
    inspector = new Inspector();
  }
  return inspector;
}

/**
 * Log an event with optional payload
 */
export function log(event: string, payload?: Record<string, any>): void {
  getInspector().log(event, payload);
}

/**
 * Log an error with optional metadata
 */
export function error(err: Error | string, meta?: Record<string, any>): void {
  getInspector().error(err, meta);
}

/**
 * Log a metric with value and optional tags
 */
export function metric(name: string, value: number, tags?: Record<string, string>): void {
  getInspector().metric(name, value, tags);
}

/**
 * Start a performance trace
 */
export function trace(name: string, id?: string): TraceHandle {
  return getInspector().trace(name, id);
}

/**
 * State management API
 */
export const state: StateManager = {
  update(section: string, data: Record<string, any>): void {
    getInspector().state.update(section, data);
  },
  remove(section: string, keys?: string[]): void {
    getInspector().state.remove(section, keys);
  },
  getState(): Record<string, any> {
    return getInspector().state.getState();
  },
};

/**
 * Patch network requests to capture them
 */
export function patchNetwork(options?: NetworkPatchOptions): () => void {
  return patchNetworkImpl(options);
}

/**
 * Attach Redux store to inspector
 */
export function attachRedux(store: any, options?: ReduxOptions): () => void {
  return attachReduxImpl(store, options);
}

/**
 * Check if inspector is enabled
 */
export function isEnabled(): boolean {
  return getInspector().isEnabled();
}

/**
 * Check if transport is connected
 */
export function isConnected(): boolean {
  return getInspector().isConnected();
}

/**
 * Force flush any buffered messages
 */
export function flush(): void {
  getInspector().flush();
}

/**
 * Destroy the inspector and cleanup resources
 */
export function destroy(): void {
  if (inspector) {
    inspector.destroy();
    inspector = null;
  }
}

// Re-export types for convenience
export type { InspectorConfig, TraceHandle, StateManager, NetworkPatchOptions, ReduxOptions };
