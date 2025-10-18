/**
 * React Native Flipper Inspector
 * Production-ready debugging toolkit for React Native apps
 */

// Export all public API functions and types
export {
  init,
  log,
  error,
  metric,
  trace,
  state,
  patchNetwork,
  attachRedux,
  isEnabled,
  isConnected,
  flush,
  destroy,
} from './api';

// Export types
export type {
  InspectorConfig,
  TraceHandle,
  StateManager,
  NetworkPatchOptions,
  ReduxOptions,
  InspectorMessage,
  MessageType,
  LogMessage,
  ErrorMessage,
  MetricMessage,
  StateMessage,
  TraceMessage,
  NetworkMessage,
} from './types';

// Export integration utilities
export { createReduxMiddleware } from './integrations/redux';
export { isNetworkPatched } from './integrations/network';

// Export overlay components
export { ReactNativeInspectorOverlay, useInspector } from './overlay';
export { StoreProvider } from './components/StoreProvider';
export { FloatingInspector } from './components/FloatingInspector';
export { FlipperInspectorProvider } from './components/FlipperInspectorProvider';

// Export easy setup hook
export { useFlipperInspector } from './hooks/useFlipperInspector';
