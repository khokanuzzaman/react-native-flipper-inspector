# React Native Flipper Inspector

[![npm version](https://badge.fury.io/js/react-native-flipper-inspector.svg)](https://www.npmjs.com/package/react-native-flipper-inspector)
[![npm downloads](https://img.shields.io/npm/dm/react-native-flipper-inspector.svg)](https://www.npmjs.com/package/react-native-flipper-inspector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

**Professional Network Debugging & API Monitoring for React Native** 🚀

A production-ready React Native debugging toolkit with professional API monitoring overlay, designed for seamless integration with Flipper. Monitor network requests, inspect API calls, track state changes, and debug with ease.

**Latest Version**: `v1.0.16` | **Status**: ✅ Production Ready

> **🎉 v1.0.16 Released!** Fixed package building, minification issues, and improved compatibility. Clean example app with working setup. 🚀

## ✨ Key Features

### 🎯 Core Features
- **🔍 Universal Network Monitoring**: Automatically captures **ALL** HTTP traffic (Axios, Fetch, Superagent, any XHR/Fetch-based library)
- **📱 Floating Button UI**: Always-accessible, draggable monitoring interface with haptic feedback
- **🎯 Third-Party Library Support**: Works with Axios, Superagent, and 98% of React Native HTTP libraries - **zero configuration!**
- **🔎 Smart Search**: Real-time search with sticky state persistence across API calls
- **🎨 JSON Highlighting**: Beautiful syntax highlighting with dark theme (keys, values, structures)
- **📋 Copy Features**: Generate cURL commands, copy endpoints, headers, and response data
- **🚨 Error Tracking**: Automatic error capture and detailed error reporting
- **⚡ Performance Metrics**: Track API response times and network performance
- **🔒 Production Safe**: Auto-disabled in production builds with `__DEV__` checks

### 🚀 Advanced Features (v1.0.6+)
- **🎯 Draggable Floating Button**: Professional floating button with smooth drag interaction and visual feedback
- **🔄 Sticky Search**: Search queries persist when navigating between different API calls
- **📊 Match Navigation**: Previous/Next buttons to step through search results
- **📝 Structured Logging**: Logging, error tracking, metrics, state management, and tracing APIs
- **🔗 Redux Integration**: Optional Redux store monitoring and action tracking
- **📦 Message Batching**: Optional batching for improved performance

### 💎 Easy Setup (v1.0.6+)
- **🔌 FlipperInspectorProvider**: One-component setup (recommended)
- **🪝 useFlipperInspector Hook**: One-hook initialization
- **⚙️ Manual Setup**: Full control with `init()` and `patchNetwork()`

## 📸 Screenshots

### API Inspector in Action

<div align="center">
  <img src="https://raw.githubusercontent.com/khokanuzzman/react-native-flipper-inspector/main/packages/react-native-flipper-inspector/screenshots/api-list.jpeg" width="280" alt="API List">
  <img src="https://raw.githubusercontent.com/khokanuzzman/react-native-flipper-inspector/main/packages/react-native-flipper-inspector/screenshots/api-details.jpeg" width="280" alt="API Details">
</div>

<div align="center">
  <p><strong>API Call List</strong> | <strong>API Call Details</strong></p>
</div>

**What You See:**
- 🎯 Floating Button with smooth drag interaction
- 📊 API call list with real-time monitoring
- 🔍 Detailed API information with search
- 🎨 Beautiful JSON syntax highlighting
- 📋 Copy as cURL, headers, response body

## 🆕 What's New in 1.0.16

### Fixes and Improvements - October 30, 2025

**What's Fixed:**
- ✅ **Package Building** - Fixed `npm pack` deleting dist folder issue
- ✅ **Minification** - Disabled to prevent export issues  
- ✅ **Deprecated API** - Fixed SafeAreaView deprecation in example app
- ✅ **Build Configuration** - Improved tsup compatibility

**What Changed:**
- 🔧 Better build and pack process
- 📦 Optimized package scripts
- 🎨 Updated example app to modern patterns

**Upgrade:**
```bash
npm install react-native-flipper-inspector@1.0.16
```

📋 [Changelog](./CHANGELOG.md)

---

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
# Optional: For Flipper desktop integration
npm install react-native-flipper
```

## 🚀 Quick Start

### ⭐ Recommended Setup (Manual Control)

For best reliability and explicit control:

```typescript
import React, { useEffect } from 'react';
import { ReactNativeInspectorOverlay, init, patchNetwork } from 'react-native-flipper-inspector';

export default function App() {
  useEffect(() => {
    // Initialize inspector
    init({ enabled: __DEV__ });
    
    // Enable network monitoring
    patchNetwork({ enabled: true });
  }, []);

  return (
    <>
      {/* Your app content */}
      <ReactNativeInspectorOverlay position="bottom-right" size={60} />
    </>
  );
}
```

**That's it!** The floating inspector will appear with network monitoring enabled.

### 🎨 Customization

```typescript
import { ReactNativeInspectorOverlay } from 'react-native-flipper-inspector';

<ReactNativeInspectorOverlay
  position="top-left"   // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  size={72}             // Floating button size in pixels
  color="#6366f1"       // Floating button color
  enabled={true}        // Enable/disable the inspector
/>;
```

## 🎯 Core API Usage

### Logging

```typescript
import { log, error } from 'react-native-flipper-inspector';

// Log messages
log('User action', { userId: 123, action: 'login' });

// Log errors
error('API failed', { endpoint: '/api/users', status: 500 });
```

### Metrics

```typescript
import { metric } from 'react-native-flipper-inspector';

// Track performance metrics
metric('api_response_time', 250, { endpoint: '/api/users' });
metric('db_query_time', 45, { operation: 'SELECT' });
```

### State Management

```typescript
import { state } from 'react-native-flipper-inspector';

// Update state
state.update('user', { id: 123, name: 'John Doe' });

// Remove state
state.remove('user');
```

### Performance Tracing

```typescript
import { trace } from 'react-native-flipper-inspector';

// Start trace
const traceId = trace.start('api_call');

// Perform operation...
try {
  const response = await fetch('/api/data');
  trace.end(traceId, { success: true, status: response.status });
} catch (error) {
  trace.end(traceId, { success: false, error: error.message });
}
```

## 🔍 API Inspector Overlay

### Network Monitoring

The overlay automatically monitors all network requests:

```typescript
import { patchNetwork } from 'react-native-flipper-inspector';

// Enable automatic fetch/XMLHttpRequest interception
patchNetwork();

// All requests now appear in the inspector
fetch('/api/users').then(r => r.json());
```

### Search Features

- **Real-time Search**: Type to filter API calls by URL, method, headers, or response
- **Sticky Search**: Search state persists when switching between different API calls
- **Match Navigation**: Use Previous/Next buttons to navigate through matches
- **Highlighted Matches**: Current match in orange, others in yellow

### Copy Features

- **cURL Commands**: Copy API calls as executable cURL commands
- **Endpoints**: Copy just the URL
- **Request Body**: Copy request payload
- **Response Body**: Copy response data
- **Headers**: Copy all request/response headers
- **Raw JSON**: Copy complete API call data

### JSON Syntax Highlighting (Dark Theme)

Beautiful color-coded JSON display:
- **Keys**: Gold (#FFD700)
- **Strings**: Spring Green (#00FF7F)
- **Numbers**: Deep Sky Blue (#00BFFF)
- **Booleans**: Orange (#FFA500)
- **Null**: Hot Pink (#FF69B4)
- **Structure**: Medium Purple (#9370DB)

## 🔗 Redux Integration

Monitor Redux actions and state changes:

```typescript
import { attachRedux } from 'react-native-flipper-inspector';
import { store } from './store';

attachRedux(store, {
  actionFilter: (action) => action.type.startsWith('api/'),
  stateFilter: (state) => state.api,
});
```

## 🎨 Customization

### Configure Batching

```typescript
init({
  enabled: __DEV__,
  batch: {
    intervalMs: 500,    // Batch every 500ms
    maxItems: 100,      // Or when 100 items collected
  },
});
```

### Disable in Specific Conditions

```typescript
init({
  enabled: __DEV__ && !isE2ETest, // Disable in E2E tests
});
```

## 📱 Platform Support

- **React Native**: 0.71+
- **Android**: API 21+ (Android 5.0+)
- **iOS**: iOS 11+
- **TypeScript**: Full TypeScript support with strict mode

## 📚 Documentation

Complete documentation included:
- **README**: This file with installation and usage
- **CHANGELOG**: Version history and changes
- **Example App**: Working demo in `apps/example`

View on [GitHub](https://github.com/khokanuzzman/react-native-flipper-inspector)

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

## 🔧 Development

### Build the Package

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

## 📊 Package Contents

**v1.0.16** includes:

- ✅ TypeScript source code with full type safety
- ✅ CommonJS (CJS) distribution
- ✅ ES Module (ESM) distribution
- ✅ TypeScript declarations (.d.ts)
- ✅ Source maps for debugging
- ✅ Android native module
- ✅ iOS native module
- ✅ Screenshots
- ✅ README, LICENSE, CHANGELOG
- ✅ Working example app

**Package Size**:
- Tarball: ~440 KB
- Unpacked: ~1.3 MB

## 🗺️ Roadmap

### Version 2.0 (Planned)
- **📤 Postman-like Request Sender**: Send custom API requests from the inspector
- **📊 Advanced Analytics**: Performance graphs and network statistics
- **🔐 Response Mocking**: Mock API responses for testing
- **🔍 Advanced Filtering**: Filter by status, headers, payload, and more
- **📁 Request Collections**: Save and organize requests
- **🔗 Request Chaining**: Use response data in subsequent requests

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

### Community

- **Issues**: [Report bugs](https://github.com/khokanuzzman/react-native-flipper-inspector/issues)
- **Discussions**: [Ask questions](https://github.com/khokanuzzman/react-native-flipper-inspector/discussions)

## 📄 License

MIT License - See [LICENSE](../../LICENSE) file for details

## 🆘 Support

- **🐛 Issues**: [GitHub Issues](https://github.com/khokanuzzman/react-native-flipper-inspector/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/khokanuzzman/react-native-flipper-inspector/discussions)

## 🌟 Version History

- **v1.0.16**: ✅ Fixed package building, minification, and compatibility (Oct 2025)
- **v1.0.14**: 🎯 Unified Interceptor Registry - Complete Axios/XHR support
- **v1.0.13**: 🐛 Fixed stack overflow issue
- **v1.0.12**: 🚀 Added XMLHttpRequest/Axios support
- **v1.0.0**: Initial release with core features

## 🙏 Acknowledgments

- Built for the React Native community
- Inspired by Flipper's debugging capabilities
- Designed with modern development workflows in mind
- Made by [@khokanuzzman](https://github.com/khokanuzzman)

---

**Made with ❤️ for React Native developers**

[⭐ Star us on GitHub!](https://github.com/khokanuzzman/react-native-flipper-inspector)