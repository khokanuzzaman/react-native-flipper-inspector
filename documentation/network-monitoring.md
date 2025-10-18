# Network Monitoring

Automatically capture and monitor all HTTP requests in your React Native app.

## Overview

The network monitoring feature automatically intercepts all network requests made through:
- ✅ Fetch API
- ✅ XMLHttpRequest
- ✅ Both Android and iOS

## Basic Usage

### Enable Network Monitoring

```typescript
import { patchNetwork } from 'react-native-flipper-inspector';

// Start monitoring all network requests
patchNetwork();
```

### Stop Monitoring

```typescript
const unpatch = patchNetwork();

// Later, to stop monitoring:
unpatch();
```

## Configuration

### Redact Sensitive Headers

```typescript
patchNetwork({
  redactHeaders: [
    'authorization',
    'cookie',
    'x-api-key',
    'x-auth-token',
    'x-csrf-token',
    'x-access-token'
  ]
});
```

### Redact Request/Response Bodies

```typescript
patchNetwork({
  redactBody: true  // Hide request and response bodies
});
```

### Complete Configuration

```typescript
const unpatch = patchNetwork({
  enabled: true,
  redactHeaders: ['authorization', 'cookie'],
  redactBody: false
});
```

## What Gets Captured

### Fetch Requests

```typescript
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token...'
  },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
})
```

**Captured Data:**
- ✅ URL
- ✅ Method (POST, GET, etc.)
- ✅ Headers (with redaction)
- ✅ Request body (with redaction)
- ✅ Response status
- ✅ Response headers
- ✅ Response body
- ✅ Timing information

### XMLHttpRequest

```typescript
const xhr = new XMLHttpRequest();
xhr.open('POST', 'https://api.example.com/data');
xhr.setRequestHeader('Authorization', 'Bearer token...');
xhr.send(JSON.stringify({ data: 'value' }));
```

**Fully Supported!** Same data as fetch is captured.

## Inspector UI

View all captured requests in the Flipper plugin:

### List View
- URL
- Method
- Status Code
- Response Time
- Timestamp

### Detail View
- Full request headers
- Request body (formatted)
- Full response headers
- Response body (formatted with colors)
- Status code
- Timing information

### Features
- ✅ Search across URL, headers, body
- ✅ Filter by status code
- ✅ Copy cURL command
- ✅ Copy request/response as JSON
- ✅ Export all requests
- ✅ Long-press to copy individual values

## Privacy & Security

### Automatic Redaction

Sensitive headers are automatically redacted:

```
Request Headers:
  Authorization: [REDACTED]
  Cookie: [REDACTED]
  X-API-Key: [REDACTED]
```

### Custom Redaction

Redact headers that contain sensitive information:

```typescript
patchNetwork({
  redactHeaders: [
    'x-custom-token',
    'x-internal-id',
    'x-secret'
  ]
});
```

### Body Redaction

Redact entire request and response bodies:

```typescript
patchNetwork({
  redactBody: true
});
```

Results in:
```
Request Body: [REDACTED]
Response Body: [REDACTED]
```

## Production

### Disable in Production

Network monitoring is automatically disabled when Flipper is not available:

```typescript
// Works in dev only (when Flipper is available)
patchNetwork();
```

### Manual Control

```typescript
import { isConnected } from 'react-native-flipper-inspector';

// Only enable if Flipper is connected
if (isConnected()) {
  patchNetwork();
}
```

## Integration with Other Features

### Combined with Logging

```typescript
import { log, patchNetwork } from 'react-native-flipper-inspector';

// Automatic capture
patchNetwork({ redactHeaders: ['authorization'] });

// Also log important events
fetch('/api/users')
  .then(res => {
    log('UserFetch', { status: res.status, time: Date.now() });
    return res.json();
  })
  .catch(err => log('UserFetchError', { error: err.message }));
```

### Combined with Metrics

```typescript
import { metric, patchNetwork } from 'react-native-flipper-inspector';

patchNetwork();

// Track API performance
const start = performance.now();
fetch('/api/data')
  .then(() => {
    metric('api_fetch_time', performance.now() - start, {
      endpoint: '/api/data'
    });
  });
```

### Combined with Error Tracking

```typescript
import { error, patchNetwork } from 'react-native-flipper-inspector';

patchNetwork();

fetch('/api/data')
  .catch(err => {
    error('APIRequestFailed', {
      endpoint: '/api/data',
      error: err.message,
      timestamp: Date.now()
    });
  });
```

## Best Practices

### 1. Redact Sensitive Data

```typescript
// ✅ DO: Redact authentication tokens
patchNetwork({
  redactHeaders: ['authorization', 'cookie']
});

// ❌ DON'T: Leave sensitive headers visible
patchNetwork({
  redactHeaders: []
});
```

### 2. Monitor Critical APIs

```typescript
// ✅ DO: Also log important events
const logRequest = async (url) => {
  try {
    const res = await fetch(url);
    log('APISuccess', { url, status: res.status });
    return res;
  } catch (err) {
    error('APIError', { url, error: err.message });
    throw err;
  }
};
```

### 3. Performance Considerations

```typescript
// ✅ DO: Clean up when done
const unpatch = patchNetwork();
// ... later ...
unpatch();
```

### 4. Batch with Other APIs

```typescript
import { init, patchNetwork } from 'react-native-flipper-inspector';

init({
  batch: { intervalMs: 1000, maxItems: 50 }
});

patchNetwork({
  redactHeaders: ['authorization']
});
```

## Troubleshooting

### Requests Not Showing?

1. Ensure Flipper desktop app is running
2. Check if inspector is connected:
   ```typescript
   import { isConnected } from 'react-native-flipper-inspector';
   console.log('Connected:', isConnected());
   ```

3. Verify `patchNetwork()` is called before making requests

### Too Many Requests?

Configure batching:

```typescript
init({
  batch: {
    intervalMs: 2000,    // Longer interval
    maxItems: 25        // Fewer items per batch
  }
});
```

### Memory Issues?

Limit payload size:

```typescript
init({
  maxPayloadSize: 2048  // 2KB max per message
});
```

## API Reference

### `patchNetwork(options?: NetworkPatchOptions): () => void`

Start monitoring network requests.

**Parameters:**
```typescript
interface NetworkPatchOptions {
  enabled?: boolean;              // default: true
  redactHeaders?: string[];       // Headers to redact
  redactBody?: boolean;           // Redact bodies
}
```

**Returns:** Function to stop patching

**Example:**
```typescript
const unpatch = patchNetwork({
  redactHeaders: ['authorization'],
  redactBody: false
});

// Later:
unpatch();
```

## Next Steps

- 📖 [API Reference](./api-reference.md) - Complete API documentation
- ⚙️ [Configuration](./configuration.md) - Advanced configuration
- 🆘 [Troubleshooting](./troubleshooting.md) - Common issues
