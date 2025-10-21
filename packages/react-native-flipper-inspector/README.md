# React Native Flipper Inspector

[![npm version](https://badge.fury.io/js/react-native-flipper-inspector.svg)](https://www.npmjs.com/package/react-native-flipper-inspector)
[![npm downloads](https://img.shields.io/npm/dm/react-native-flipper-inspector.svg)](https://www.npmjs.com/package/react-native-flipper-inspector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

**Professional Network Debugging & API Monitoring for React Native** 🚀

A production-ready React Native debugging toolkit with professional API monitoring overlay, designed for seamless integration with Flipper. Monitor network requests, inspect API calls, track state changes, and debug with ease.

**Latest Version**: `v1.0.9` | **Status**: ✅ Production Ready | **[What's New →](#-whats-new-in-109)**

> **🎉 v1.0.9 Released!** Android SDK 36 support + namespace fix for modern projects. Fully compatible with latest React Native!

## ✨ Key Features

### 🎯 Core Features
- **🔍 Real-time API Monitoring**: Automatic interception of fetch and XMLHttpRequest calls
- **📱 Floating Button UI**: Always-accessible, draggable monitoring interface with haptic feedback
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
  <img src="https://raw.githubusercontent.com/khokanuzzman/react-native-flipper-inspector/main/screenshots/floating-button.jpeg" width="280" alt="Floating Button">
  <img src="https://raw.githubusercontent.com/khokanuzzman/react-native-flipper-inspector/main/screenshots/api-inspector-list.jpeg" width="280" alt="API Inspector">
  <img src="https://raw.githubusercontent.com/khokanuzzman/react-native-flipper-inspector/main/screenshots/api-details.jpeg" width="280" alt="API Details">
</div>

<div align="center">
  <p><strong>Draggable Floating Button</strong> | <strong>API Call List</strong> | <strong>Request Details</strong></p>
</div>

**What You See:**
- 🎯 Floating Button with smooth drag interaction
- 📊 API call list with real-time monitoring
- 🔍 Detailed API information with search
- 🎨 Beautiful JSON syntax highlighting
- 📋 Copy as cURL, headers, response body

See all screenshots: [Complete Screenshots Guide](../../documentation/screenshots.md)

## 🆕 What's New in 1.0.9

### 🚀 Android SDK 36 Support - October 21, 2025

Full support for the latest Android SDK and modern build tools!

**What's New:**
- 📦 **Android SDK 36** (Android 15) support
- 🔧 **Namespace Declaration** for AGP 8.0+
- 🔄 **Modern Gradle DSL** (compileSdk, minSdk, targetSdk)
- ✅ **Backward Compatible** with older projects

**Who Benefits:**
- 📱 Projects using Android SDK 36
- 🔧 Apps with Android Gradle Plugin 8.0+
- 🌐 Modern React Native projects
- ⚡ Latest React Native versions

**Upgrade:**
```bash
npm install react-native-flipper-inspector@1.0.9
```

**Previous Fixes (v1.0.8):**
- ✅ Fixed "method property" error
- ✅ Enhanced compatibility
- ✅ Improved minification handling

📖 [Full Release Notes](../../RELEASE_NOTES_v1.0.8.md) | 📋 [Changelog](./CHANGELOG.md)

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

### ⭐ Option 1: Ultra-Simple Setup (Recommended)

Use the new `FlipperInspectorProvider` component for zero-config setup:

```typescript
import { FlipperInspectorProvider } from 'react-native-flipper-inspector';

export default function App() {
  return (
    <FlipperInspectorProvider>
      <YourAppContent />
    </FlipperInspectorProvider>
  );
}
```

**That's it!** Everything is automatically initialized and enabled in dev builds.

### 🪝 Option 2: Hook-Based Setup

Use the `useFlipperInspector` hook for simple functional component setup:

```typescript
import { useFlipperInspector } from 'react-native-flipper-inspector';

export default function App() {
  useFlipperInspector(); // Auto-initializes in dev builds

  return <YourAppContent />;
}
```

### ⚙️ Option 3: Manual Setup (Full Control)

For complete customization:

```typescript
import { init, patchNetwork } from 'react-native-flipper-inspector';

// Initialize with custom config
init({
  enabled: __DEV__, // Auto-disabled in production
  batch: {
    intervalMs: 1000,
    maxItems: 50,
  },
});

// Patch network to intercept API calls
patchNetwork();

// Your app code here
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

Complete documentation included in package:

- **Quick Start Guide**: Get started in 5 minutes
- **API Reference**: Complete API documentation
- **Configuration Guide**: Configure for your needs
- **Android/iOS Setup**: Platform-specific setup guides
- **Network Monitoring**: Advanced network debugging
- **Troubleshooting**: Solutions to common issues
- **Screenshots Guide**: Visual guide to all features

View on [GitHub](https://github.com/khokanuzzman/react-native-flipper-inspector/tree/main/documentation)

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

**v1.0.6** includes:

- ✅ TypeScript source code with full type safety
- ✅ CommonJS (CJS) distribution
- ✅ ES Module (ESM) distribution
- ✅ TypeScript declarations (.d.ts)
- ✅ Source maps for debugging
- ✅ Android native module (Java)
- ✅ iOS native module (Objective-C)
- ✅ 4 Beautiful screenshots
- ✅ 8 Complete documentation guides
- ✅ README, LICENSE, CHANGELOG

**Package Size**:
- Tarball: 296.2 KB
- Unpacked: 686.3 KB

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
- **GitHub**: [View source](https://github.com/khokanuzzman/react-native-flipper-inspector)

## 📄 License

MIT License - See [LICENSE](../../LICENSE) file for details

## 🆘 Support

- **📚 Documentation**: Complete guides in the `documentation/` folder
- **🐛 Issues**: [GitHub Issues](https://github.com/khokanuzzman/react-native-flipper-inspector/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/khokanuzzman/react-native-flipper-inspector/discussions)
- **📖 Wiki**: [GitHub Wiki](https://github.com/khokanuzzman/react-native-flipper-inspector/wiki)

## 🌟 Version History

- **v1.0.9**: 🚀 Android SDK 36 support + namespace declaration (Oct 2025)
- **v1.0.8**: 🐛 Critical bug fix for "method" property error (Oct 2025)
- **v1.0.6**: Screenshots properly included in NPM package
- **v1.0.5**: Screenshots & documentation added to package
- **v1.0.4**: Complete documentation & example app
- **v1.0.3**: Draggable floating button & sticky search
- **v1.0.2**: JSON syntax highlighting & improvements
- **v1.0.1**: Bug fixes & stability improvements
- **v1.0.0**: Initial release with core features

## 🙏 Acknowledgments

- Built for the React Native community
- Inspired by Flipper's debugging capabilities
- Designed with modern development workflows in mind
- Made by [@khokanuzzman](https://github.com/khokanuzzman)

---

**Made with ❤️ for React Native developers**

[⭐ Star us on GitHub!](https://github.com/khokanuzzman/react-native-flipper-inspector)