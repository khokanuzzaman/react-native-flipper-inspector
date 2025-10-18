# API Reference

Complete API documentation for React Native Flipper Inspector.

## Core Functions

### `init(config?: InspectorConfig)`

Initialize the inspector with configuration options.

```typescript
init({
  enabled: true,
  batch: { intervalMs: 500, maxItems: 50 },
  tags: { app: 'MyApp' },
  maxPayloadSize: 10240,
  networkEnabled: false,
  redactHeaders: ['authorization'],
  redactBody: false,
});
```

**Parameters:**
- `config` (optional): Configuration object

**Returns:** `void`

### `log(event: string, payload?: Record<string, any>)`

Log an event with optional payload.

```typescript
log('UserAction', { action: 'click', button: 'submit' });
log('AppState', { screen: 'Home', timestamp: Date.now() });
```

**Parameters:**
- `event`: Event name/identifier
- `payload` (optional): Additional data to include

**Returns:** `void`

### `error(err: Error | string, meta?: Record<string, any>)`

Log an error with optional metadata.

```typescript
error(new Error('Something went wrong'), { context: 'user-action' });
error('Network timeout', { url: '/api/users', timeout: 5000 });
```

**Parameters:**
- `err`: Error object or error message string
- `meta` (optional): Additional metadata

**Returns:** `void`

### `metric(name: string, value: number, tags?: Record<string, string>)`

Log a performance metric.

```typescript
metric('api_response_time', 250, { endpoint: '/users' });
metric('memory_usage', 45.2, { unit: 'MB' });
metric('user_count', 1250);
```

**Parameters:**
- `name`: Metric name
- `value`: Numeric value
- `tags` (optional): Additional tags for filtering

**Returns:** `void`

### `trace(name: string, id?: string)`

Start a performance trace.

```typescript
const trace = trace.start('api-call');
try {
  await fetch('/api/users');
} finally {
  trace.end({ success: true });
}
```

**Parameters:**
- `name`: Trace name
- `id` (optional): Custom trace ID

**Returns:** `TraceHandle` object with `end(extra?: Record<string, any>)` method

## State Management

### `state`

State management object with the following methods:

#### `state.update(section: string, data: Record<string, any>)`

Update state for a specific section.

```typescript
state.update('user', { id: '123', name: 'John' });
state.update('session', { isActive: true, startTime: Date.now() });
```

#### `state.remove(section: string, keys?: string[])`

Remove keys from a section or remove the entire section.

```typescript
state.remove('user', ['lastLogin']); // Remove specific keys
state.remove('temp'); // Remove entire section
```

#### `state.getState()`

Get the current state.

```typescript
const currentState = state.getState();
console.log(currentState.user);
```

## Network Monitoring

### `patchNetwork(options?: NetworkPatchOptions)`

Patch network requests to capture them.

```typescript
const unpatch = patchNetwork({
  enabled: true,
  redactHeaders: ['authorization', 'cookie'],
  redactBody: false,
});

// Later, to disable:
unpatch();
```

**Parameters:**
- `options` (optional): Network monitoring configuration

**Returns:** Function to unpatch network monitoring

## Redux Integration

### `attachRedux(store: any, options?: ReduxOptions)`

Attach Redux store to inspector.

```typescript
import { createStore } from 'redux';
import { attachRedux } from 'react-native-flipper-inspector';

const store = createStore(reducer);
const unattach = attachRedux(store, {
  whitelist: ['user', 'settings'],
  blacklist: ['sensitive'],
  serialize: (state) => state,
});

// Later, to detach:
unattach();
```

**Parameters:**
- `store`: Redux store object
- `options` (optional): Redux integration configuration

**Returns:** Function to detach Redux store

### `createReduxMiddleware(options?: ReduxOptions)`

Create Redux middleware for action tracking.

```typescript
import { createStore, applyMiddleware } from 'redux';
import { createReduxMiddleware } from 'react-native-flipper-inspector';

const middleware = createReduxMiddleware();
const store = createStore(reducer, applyMiddleware(middleware));
```

**Parameters:**
- `options` (optional): Redux integration configuration

**Returns:** Redux middleware function

## Utility Functions

### `isEnabled()`

Check if inspector is enabled.

```typescript
if (isEnabled()) {
  log('DebugMode', { enabled: true });
}
```

**Returns:** `boolean`

### `isConnected()`

Check if transport is connected to Flipper.

```typescript
if (isConnected()) {
  console.log('Connected to Flipper');
}
```

**Returns:** `boolean`

### `flush()`

Force flush any buffered messages.

```typescript
flush(); // Immediately send all buffered messages
```

**Returns:** `void`

### `destroy()`

Destroy the inspector and cleanup resources.

```typescript
destroy(); // Cleanup and reset inspector
```

**Returns:** `void`

## Type Definitions

### `InspectorConfig`

```typescript
interface InspectorConfig {
  enabled?: boolean;              // default: true in __DEV__
  batch?: {
    intervalMs?: number;          // default: 500
    maxItems?: number;           // default: 50
  };
  tags?: Record<string, string>;  // default tags for every record
  maxPayloadSize?: number;        // default: 10240 (10KB)
  networkEnabled?: boolean;       // default: false
  redactHeaders?: string[];       // headers to redact
  redactBody?: boolean;          // default: false
}
```

### `TraceHandle`

```typescript
interface TraceHandle {
  end(extra?: Record<string, any>): void;
}
```

### `NetworkPatchOptions`

```typescript
interface NetworkPatchOptions {
  enabled?: boolean;
  redactHeaders?: string[];
  redactBody?: boolean;
}
```

### `ReduxOptions`

```typescript
interface ReduxOptions {
  whitelist?: string[];
  blacklist?: string[];
  serialize?: (state: any) => any;
}
```

## Message Types

All messages sent to Flipper have the following structure:

```typescript
interface InspectorMessage {
  id?: string;
  type: MessageType;
  ts: number;
  data: Record<string, any>;
  tags?: Record<string, string>;
}

type MessageType = 'log' | 'error' | 'metric' | 'state' | 'trace' | 'network';
```

### Log Messages

```typescript
interface LogMessage extends InspectorMessage {
  type: 'log';
  data: {
    event: string;
    payload?: Record<string, any>;
  };
}
```

### Error Messages

```typescript
interface ErrorMessage extends InspectorMessage {
  type: 'error';
  data: {
    error: string;
    stack?: string;
    meta?: Record<string, any>;
  };
}
```

### Metric Messages

```typescript
interface MetricMessage extends InspectorMessage {
  type: 'metric';
  data: {
    name: string;
    value: number;
    unit?: string;
  };
}
```

### State Messages

```typescript
interface StateMessage extends InspectorMessage {
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
```

### Trace Messages

```typescript
interface TraceMessage extends InspectorMessage {
  type: 'trace';
  data: {
    name: string;
    id?: string;
    action: 'start' | 'end';
    duration?: number;
    extra?: Record<string, any>;
  };
}
```

### Network Messages

```typescript
interface NetworkMessage extends InspectorMessage {
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
```

## Best Practices

### 1. Initialize Early

```typescript
// In your app's entry point (index.js or App.tsx)
import { init } from 'react-native-flipper-inspector';

init({
  tags: { app: 'MyApp', version: '1.0.0' },
});
```

### 2. Use Meaningful Event Names

```typescript
// Good
log('UserLogin', { userId: '123', method: 'email' });
log('ScreenView', { screen: 'Profile', userId: '123' });

// Avoid
log('Event1', { data: 'something' });
log('Debug', { info: 'test' });
```

### 3. Include Context in Errors

```typescript
// Good
error(new Error('API request failed'), {
  endpoint: '/api/users',
  method: 'GET',
  status: 500,
  userId: '123',
});

// Avoid
error(new Error('Something went wrong'));
```

### 4. Use Tags for Filtering

```typescript
// Good
metric('response_time', 250, { endpoint: '/api/users', method: 'GET' });
log('UserAction', { action: 'click' }, { screen: 'Home', userId: '123' });

// This allows filtering by endpoint, method, screen, etc. in Flipper
```

### 5. Be Mindful of Payload Size

```typescript
// Good - small payloads
log('UserAction', { action: 'click', button: 'submit' });

// Avoid - large payloads that might be truncated
log('LargeData', { data: hugeObject }); // Might be truncated
```

### 6. Use Traces for Performance

```typescript
// Good - measure performance
const trace = trace.start('api-call');
try {
  const response = await fetch('/api/users');
  trace.end({ success: true, status: response.status });
} catch (err) {
  trace.end({ success: false, error: err.message });
}
```

### 7. Clean Up Resources

```typescript
// In your app's cleanup
import { destroy, patchNetwork } from 'react-native-flipper-inspector';

// Store unpatch functions
const unpatchNetwork = patchNetwork();

// Cleanup when needed
const cleanup = () => {
  unpatchNetwork();
  destroy();
};
```
