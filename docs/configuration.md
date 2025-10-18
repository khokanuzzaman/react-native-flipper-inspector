# Configuration Guide

Advanced configuration options for React Native Flipper Inspector.

## Inspector Configuration

### `init()` Options

```typescript
import { init } from 'react-native-flipper-inspector';

init({
  enabled: true,                    // Enable/disable inspector
  batch: {
    intervalMs: 500,                // Batching interval
    maxItems: 50                    // Max items per batch
  },
  tags: {                           // Default tags for all records
    app: 'MyApp',
    version: '1.0.0'
  },
  maxPayloadSize: 10240,            // Max payload size in bytes
  networkEnabled: false,             // Enable network monitoring
  redactHeaders: ['authorization'], // Headers to redact
  redactBody: false                 // Redact request/response bodies
});
```

### Default Values

| Option | Default | Description |
|--------|---------|-------------|
| `enabled` | `__DEV__` | Automatically disabled in production |
| `intervalMs` | 500 | Batch messages every 500ms |
| `maxItems` | 50 | Max 50 items per batch |
| `maxPayloadSize` | 10240 | 10KB max payload |
| `networkEnabled` | false | Don't patch network by default |
| `redactHeaders` | `[]` | No headers redacted by default |
| `redactBody` | false | Don't redact bodies by default |

## Network Patching

### Basic Setup

```typescript
import { patchNetwork } from 'react-native-flipper-inspector';

// Patch all network requests
patchNetwork();
```

### With Options

```typescript
const unpatch = patchNetwork({
  enabled: true,
  redactHeaders: [
    'authorization',
    'cookie',
    'x-api-key',
    'x-auth-token'
  ],
  redactBody: false
});

// Later, to stop patching:
unpatch();
```

### What Gets Captured

✅ **Fetch Requests**
```typescript
fetch('/api/users', {
  method: 'POST',
  headers: { 'authorization': 'Bearer ...' },
  body: JSON.stringify({ name: 'John' })
})
```

✅ **XMLHttpRequest**
```typescript
const xhr = new XMLHttpRequest();
xhr.open('POST', '/api/users');
xhr.send(JSON.stringify(data));
```

## Redux Integration

### Basic Setup

```typescript
import { attachRedux } from 'react-native-flipper-inspector';
import store from './store';

attachRedux(store);
```

### With Options

```typescript
const detach = attachRedux(store, {
  whitelist: ['user', 'settings', 'auth'],  // Only track these
  blacklist: ['sensitive', 'cache'],         // Exclude these
  serialize: (state) => state,               // Custom serializer
  actionSanitizer: (action) => action        // Sanitize actions
});

// Later, to detach:
detach();
```

### Tracks

✅ **Actions**: All Redux actions dispatched  
✅ **State**: State after each action  
✅ **Timing**: Action execution time  

## Tracing

### Basic Usage

```typescript
import { trace } from 'react-native-flipper-inspector';

// Start trace
const handle = trace.start('api_call');

// ... do something ...

// End trace (duration auto-calculated)
trace.end(handle);
```

### With Metadata

```typescript
const handle = trace.start('db_query', {
  query: 'SELECT * FROM users',
  timeout: 5000
});

// ... execute query ...

trace.end(handle, {
  rowCount: 100,
  executionTime: 45
});
```

## State Management

### Update State

```typescript
import { state } from 'react-native-flipper-inspector';

state.update('user', {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com'
});

state.update('session', {
  isActive: true,
  startTime: Date.now()
});
```

### Remove State

```typescript
state.remove('user');
state.remove('session');
```

## Production Hardening

### Enable Only in Dev

```typescript
import { init } from 'react-native-flipper-inspector';

init({
  enabled: __DEV__  // Automatically true in dev, false in production
});
```

### Size Limits

```typescript
init({
  maxPayloadSize: 5120  // Smaller limit for memory-constrained devices
});
```

### Privacy

```typescript
patchNetwork({
  redactHeaders: [
    'authorization',
    'cookie',
    'x-auth-token',
    'x-api-key',
    'x-csrf-token'
  ],
  redactBody: true  // Redact sensitive data in requests/responses
});
```

## Environment-Specific Config

### Development

```typescript
init({
  enabled: true,
  batch: { intervalMs: 500, maxItems: 50 },
  networkEnabled: true,
  redactHeaders: [] // Don't redact in dev
});
```

### Staging

```typescript
init({
  enabled: true,
  batch: { intervalMs: 1000, maxItems: 100 },
  networkEnabled: true,
  redactHeaders: ['authorization']
});
```

### Production

```typescript
init({
  enabled: false  // Disabled automatically with __DEV__
});
```

## Memory Management

### Control Batching

```typescript
init({
  batch: {
    intervalMs: 2000,   // Longer interval
    maxItems: 25        // Fewer items per batch
  }
});
```

### Limit Payload Size

```typescript
init({
  maxPayloadSize: 2048  // 2KB max per message
});
```

## Common Patterns

### API Monitoring

```typescript
import { log, patchNetwork } from 'react-native-flipper-inspector';

// Automatically capture all API calls
patchNetwork({
  redactHeaders: ['authorization']
});

// Also log important ones
fetch('/api/users')
  .then(res => log('UserAPISuccess', { status: res.status }))
  .catch(err => log('UserAPIError', { error: err.message }));
```

### Performance Tracking

```typescript
import { metric, trace } from 'react-native-flipper-inspector';

const timer = trace.start('screen_render');
// ... render code ...
trace.end(timer);

metric('render_time', Date.now() - startTime);
```

### Error Handling

```typescript
import { error, state } from 'react-native-flipper-inspector';

try {
  // ... code ...
} catch (err) {
  error('CriticalError', {
    message: err.message,
    stack: err.stack,
    context: 'UserLogin'
  });
  
  state.update('error', {
    type: 'CRITICAL',
    timestamp: Date.now(),
    message: err.message
  });
}
```

## Disable Inspector

### Runtime Disable

```typescript
import { init, destroy } from 'react-native-flipper-inspector';

// Disable
destroy();

// Re-enable
init();
```

### At Init

```typescript
init({
  enabled: false
});
```

## Next Steps

- 📖 [API Reference](./api-reference.md) - Complete API
- 🚨 [Troubleshooting](./troubleshooting.md) - Common issues
- 🔍 [Network Monitoring Details](./network-monitoring.md)
