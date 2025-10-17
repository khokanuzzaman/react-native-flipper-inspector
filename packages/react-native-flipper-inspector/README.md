# React Native Flipper Inspector

[![npm version](https://badge.fury.io/js/react-native-flipper-inspector.svg)](https://badge.fury.io/js/react-native-flipper-inspector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

A production-ready React Native debugging toolkit with professional API monitoring overlay, designed for seamless integration with Flipper.

## ✨ Features

### 🎯 Core Debugging APIs
- **📝 Logging**: Structured logging with levels and tags
- **🚨 Error Tracking**: Comprehensive error capture and reporting
- **📊 Metrics**: Custom metrics with timing and counters
- **🗂️ State Management**: Key-value state tracking and updates
- **⏱️ Tracing**: Performance tracing with start/end markers

### 🔍 Professional API Inspector Overlay
- **📱 Floating Button**: Always-accessible monitoring interface
- **🎨 Modern UI**: Professional design with gradients and cards
- **🔍 Real-time Search**: Search through API calls, headers, and responses
- **🌈 JSON Highlighting**: Beautiful syntax highlighting with dark theme
- **📋 Copy Features**: One-click copying of cURL, endpoints, headers, and raw data
- **🔗 Long Press Copy**: Direct text copying from any content area

### 🚀 Advanced Features
- **🔄 Sticky Search**: Search state persists across different API calls
- **🎯 Match Navigation**: Step through search results with Previous/Next buttons
- **📊 Network Monitoring**: Automatic fetch and XMLHttpRequest interception
- **⚡ Redux Integration**: Built-in Redux store monitoring
- **📦 Batching**: Optional message batching for performance
- **🔒 Production Safe**: Automatic no-op in production builds

## 📦 Installation

```bash
npm install react-native-flipper-inspector
# or
yarn add react-native-flipper-inspector
# or
pnpm add react-native-flipper-inspector
```

### Peer Dependencies

```bash
# For Flipper integration (optional)
npm install react-native-flipper
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { init, log, error, metric, state, trace } from 'react-native-flipper-inspector';

// Initialize the inspector
init({
  enabled: __DEV__, // Enable in development
  batch: {
    enabled: true,
    intervalMs: 1000,
    maxItems: 50,
  },
});

// Log messages
log('User logged in', { userId: 123, timestamp: Date.now() });
error('API request failed', { url: '/api/users', status: 500 });

// Track metrics
metric('api_response_time', 250, { endpoint: '/api/users' });

// Manage state
state.update('user', { id: 123, name: 'John Doe' });
state.remove('user');

// Performance tracing
const traceId = trace.start('api_call');
// ... perform API call
trace.end(traceId, { success: true });
```

### API Inspector Overlay

```typescript
import { ReactNativeInspectorOverlay, StoreProvider } from 'react-native-flipper-inspector';

function App() {
  return (
    <StoreProvider>
      <YourAppContent />
      <ReactNativeInspectorOverlay />
    </StoreProvider>
  );
}
```

### Network Monitoring

```typescript
import { patchNetwork } from 'react-native-flipper-inspector';

// Automatically intercept all fetch and XMLHttpRequest calls
patchNetwork();

// Now all network requests will appear in the inspector
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Redux Integration

```typescript
import { attachRedux } from 'react-native-flipper-inspector';
import { store } from './store';

// Monitor Redux state changes
attachRedux(store, {
  actionFilter: (action) => action.type.startsWith('api/'),
  stateFilter: (state) => state.api,
});
```

## 🎨 API Inspector Overlay Features

### 🔍 Search & Navigation
- **Real-time Search**: Type to filter API calls by URL, headers, or response data
- **Sticky Search**: Search state persists when switching between different API calls
- **Match Navigation**: Use Previous/Next buttons to step through search results
- **Highlighted Results**: Current match highlighted in orange, others in yellow

### 📋 Copy Features
- **📋 cURL**: Generate and copy cURL commands
- **🔗 Endpoint**: Copy just the API endpoint
- **📤 Request Body**: Copy request payload
- **📥 Response Body**: Copy response data
- **📋 Headers**: Copy all request/response headers
- **📄 Raw Data**: Copy complete API call information

### 🎨 Visual Design
- **Professional UI**: Modern gradient backgrounds and card layouts
- **JSON Syntax Highlighting**: Beautiful dark theme with color-coded elements
  - 🔑 **Keys**: Gold
  - 📝 **Strings**: Spring Green
  - 🔢 **Numbers**: Deep Sky Blue
  - ✅ **Booleans**: Orange
  - ❌ **Null**: Hot Pink
  - 🔗 **Structure**: Medium Purple

## 📚 API Reference

### Core Functions

#### `init(config?: InspectorConfig)`
Initialize the inspector with optional configuration.

```typescript
interface InspectorConfig {
  enabled?: boolean;
  batch?: {
    enabled: boolean;
    intervalMs: number;
    maxItems: number;
  };
}
```

#### `log(message: string, data?: any, tags?: Record<string, string>)`
Log a message with optional data and tags.

#### `error(message: string, error?: Error | any, tags?: Record<string, string>)`
Log an error with optional error object and tags.

#### `metric(name: string, value: number, tags?: Record<string, string>)`
Track a metric with optional tags.

#### `state`
State management object with `update(key, value)` and `remove(key)` methods.

#### `trace`
Tracing object with `start(name)` and `end(id, data?)` methods.

### Overlay Components

#### `<ReactNativeInspectorOverlay />`
The main overlay component that provides the floating button and monitoring interface.

#### `<StoreProvider>`
Context provider for managing API call state across the overlay.

## 🔧 Configuration

### Development vs Production

```typescript
import { init } from 'react-native-flipper-inspector';

init({
  enabled: __DEV__, // Automatically disabled in production
  batch: {
    enabled: true,
    intervalMs: 1000,
    maxItems: 50,
  },
});
```

### Custom Configuration

```typescript
init({
  enabled: true,
  batch: {
    enabled: false, // Disable batching for real-time updates
  },
});
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📱 Platform Support

- **React Native**: 0.71+
- **Android**: API 21+ (Android 5.0+)
- **iOS**: iOS 11+
- **TypeScript**: Full TypeScript support with strict mode

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/react-native-flipper-inspector/react-native-flipper-inspector.git

# Install dependencies
pnpm install

# Start development
pnpm dev

# Build package
pnpm build
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [GitHub Wiki](https://github.com/react-native-flipper-inspector/react-native-flipper-inspector/wiki)
- **Issues**: [GitHub Issues](https://github.com/react-native-flipper-inspector/react-native-flipper-inspector/issues)
- **Discussions**: [GitHub Discussions](https://github.com/react-native-flipper-inspector/react-native-flipper-inspector/discussions)

## 🗺️ Roadmap

### Version 2.0 (Planned)
- **🔧 Request Builder**: Postman-style API request builder
- **🔐 Authentication**: Bearer tokens, Basic auth, API keys
- **📁 Collections**: Request collections and environment variables
- **🔗 Request Chaining**: Use response data in subsequent requests
- **📊 Analytics**: Request/response analytics and performance metrics

## 🙏 Acknowledgments

- Built for the React Native community
- Inspired by Flipper's debugging capabilities
- Designed with modern development workflows in mind

---

Made with ❤️ for React Native developers