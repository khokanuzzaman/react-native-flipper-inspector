# React Native Flipper Inspector Example App

This is a comprehensive example application demonstrating all features of the React Native Flipper Inspector library.

## Features Demonstrated

- ✅ **Basic Logging**: Event logging with payloads
- ✅ **Error Logging**: Error capture with stack traces and metadata
- ✅ **Metrics**: Performance metrics with tags
- ✅ **Tracing**: Performance tracing with timing
- ✅ **State Management**: Application state tracking
- ✅ **Network Monitoring**: HTTP request/response capture
- ✅ **Redux Integration**: Redux store tracking and action logging
- ✅ **Batching**: High-volume event generation to test batching
- ✅ **Real-time Updates**: Live monitoring in Flipper

## Getting Started

### Prerequisites

- Node.js 18+
- React Native development environment
- Android Studio (for Android)
- Xcode (for iOS)
- Flipper desktop app

### Installation

1. Install dependencies:
   ```bash
   cd apps/example
   pnpm install
   ```

2. For iOS, install pods:
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

#### Android
```bash
pnpm android
```

#### iOS
```bash
pnpm ios
```

### Using with Flipper

1. Start the React Native app in debug mode
2. Open Flipper desktop app
3. Look for the "RN Inspector" plugin in the sidebar
4. Click on it to open the debugging interface
5. Interact with the example app to see events in real-time

## App Sections

### Logging
- **Log Event**: Generates a log message with random payload
- **Log Error**: Simulates an error with stack trace
- **Log Metric**: Creates performance metrics with timing data

### Tracing
- **Start Trace**: Begins a performance trace that completes after a random delay

### State Management
- **Update State**: Updates application state with user data
- **Remove State Keys**: Demonstrates state key removal

### Network Monitoring
- **Toggle Network Monitoring**: Enables/disables network request capture
- **Make Network Request**: Performs a real HTTP request to demonstrate network monitoring

### Redux Integration
- **Increment Counter**: Updates Redux state through actions
- **Set User**: Adds user data to Redux store
- **Clear User**: Removes user data from Redux store

### Performance Testing
- **Generate Bulk Events**: Creates multiple events quickly to test batching

## What to Look For in Flipper

### Message Types
- **Log Messages** (Blue): General events and debugging info
- **Error Messages** (Red): Errors with stack traces
- **Metric Messages** (Green): Performance measurements
- **State Messages** (Purple): State changes and updates
- **Trace Messages** (Orange): Performance traces
- **Network Messages** (Teal): HTTP requests and responses

### Features to Test
1. **Real-time Updates**: Watch messages appear as you interact with the app
2. **Filtering**: Use the search and type filters to find specific messages
3. **Message Details**: Click on any message to see full details
4. **Export**: Export filtered data as CSV or JSON
5. **Live Mode**: Toggle between live and static modes
6. **Pause/Resume**: Pause live updates to inspect current state

## Troubleshooting

### Plugin Not Appearing
- Ensure the app is running in debug mode
- Check that Flipper is connected to the device/emulator
- Verify the plugin is properly installed

### No Messages Appearing
- Check the inspector status in the app logs
- Ensure the inspector is enabled and connected
- Try generating new events by interacting with the app

### Network Monitoring Not Working
- Enable network monitoring in the app first
- Check that the toggle shows as enabled
- Make a network request after enabling monitoring

## Code Examples

The example app demonstrates proper usage patterns:

```typescript
// Initialize the inspector
init({
  batch: { intervalMs: 500, maxItems: 20 },
  tags: { app: 'Example', version: '1.0.0' },
});

// Log events
log('ButtonClicked', { button: 'log-event', timestamp: Date.now() });

// Log errors
error(new Error('Something went wrong'), { context: 'user-action' });

// Log metrics
metric('api_response_time', 250, { endpoint: '/api/users' });

// Start traces
const trace = trace.start('user-interaction');
// ... do work ...
trace.end({ success: true });

// Update state
state.update('user', { id: '123', name: 'John Doe' });

// Enable network monitoring
patchNetwork({ redactHeaders: ['authorization'] });

// Attach Redux store
attachRedux(store, { whitelist: ['counter', 'user'] });
```

## License

MIT
