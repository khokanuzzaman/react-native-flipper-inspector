# React Native Flipper Inspector

[![CI](https://github.com/khokanuzzman/react-native-flipper-inspector/workflows/CI/badge.svg)](https://github.com/khokanuzzman/react-native-flipper-inspector/actions)
[![npm version](https://badge.fury.io/js/react-native-flipper-inspector.svg)](https://badge.fury.io/js/react-native-flipper-inspector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful debugging toolkit for React Native apps with a beautiful floating inspector UI. Monitor API calls, network requests, and debug your app with an intuitive interface that works alongside Flipper.

**Current Version: 1.0.15** - Fixed package building and minification issues. Improved compatibility and documentation.

## ✨ Key Features

- **🔍 Floating Inspector UI**: Always-accessible floating button with beautiful modal interface
- **🌐 Network Monitoring**: Automatic HTTP request/response capture with real-time filtering
- **📊 API Call Tracking**: Complete request/response details with status codes and timing
- **🎨 Modern Design**: Professional UI with dark theme and smooth animations
- **📱 Cross-Platform**: Works on both Android and iOS
- **⚡ Zero Config**: Works out of the box with most HTTP libraries
- **🛡️ Production Safe**: Automatically disabled in production builds

## 🚀 Quick Installation

### 1. Install the Package

```bash
npm install react-native-flipper-inspector
# or
yarn add react-native-flipper-inspector
```

### 2. iOS Setup

Add to your `ios/Podfile`:

```ruby
pod 'react-native-flipper-inspector', :path => '../node_modules/react-native-flipper-inspector'
```

Then run:

```bash
cd ios && pod install
```

### 3. Android Setup

No additional setup required! The library auto-registers with React Native.

### 4. Add to Your App

**Recommended Setup** (Manual Control):

```typescript
import React, { useEffect } from 'react';
import { View } from 'react-native';
import {
  ReactNativeInspectorOverlay,
  init,
  patchNetwork,
} from 'react-native-flipper-inspector';

export default function App() {
  useEffect(() => {
    // Initialize inspector
    init({ enabled: __DEV__ });
    
    // Enable network monitoring
    patchNetwork({ enabled: true });
  }, []);

  return (
    <>
      <View style={{ flex: 1 }}>
        {/* Your app content */}
      </View>

      <ReactNativeInspectorOverlay position="bottom-right" size={60} />
    </>
  );
}
```

That's it! 🎉 The floating inspector will appear on your screen.

## 🎯 How to Use

### Basic Usage

The floating inspector automatically captures all network requests. Just tap the floating button to see:

- **API Calls**: All HTTP requests with status codes and timing
- **Request Details**: Headers, body, and response data
- **Search & Filter**: Find specific requests quickly
- **Export Options**: Copy as cURL, share, or export data

### Customization

```typescript
import { ReactNativeInspectorOverlay } from 'react-native-flipper-inspector';

<ReactNativeInspectorOverlay
  position="top-left"   // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  size={72}             // Floating button size in pixels
  color="#6366f1"       // Floating button color
  enabled={true}        // Enable/disable the inspector
/>;
```

> **Note**: The `ReactNativeInspectorOverlay` component includes built-in `StoreProvider` and handles network interception setup automatically.

### Advanced Configuration

```typescript
import { init, patchNetwork } from 'react-native-flipper-inspector';

// Initialize with custom settings
init({
  enabled: __DEV__, // Only in development
  batch: { intervalMs: 500 },
  tags: { app: 'MyApp' },
});

// Enable network monitoring
patchNetwork({
  redactHeaders: ['authorization', 'cookie'],
  redactBody: false,
});
```

## 📸 Screenshots

<div align="center">
  <img src="https://raw.githubusercontent.com/khokanuzzman/react-native-flipper-inspector/main/packages/react-native-flipper-inspector/screenshots/api-list.jpeg" width="280" alt="API Inspector List">
  <img src="https://raw.githubusercontent.com/khokanuzzman/react-native-flipper-inspector/main/packages/react-native-flipper-inspector/screenshots/api-details.jpeg" width="280" alt="API Call Details">
</div>

<div align="center">
  <p><strong>API Call List</strong> | <strong>API Call Details</strong></p>
</div>

## 🎯 Example App

Try the example app to see all features in action:

```bash
cd apps/example
npm install
npm run android  # or npm run ios
```

The example includes:
- Network request examples
- API call demonstrations
- Floating inspector in action
- Real-time debugging features


## 🔧 Configuration Options

### FloatingInspector Props

```typescript
interface FloatingInspectorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  color?: string;
  enabled?: boolean;
}
```

### Advanced Settings

```typescript
import { init, patchNetwork } from 'react-native-flipper-inspector';

// Initialize with custom settings
init({
  enabled: __DEV__, // Only in development
  batch: { intervalMs: 500 },
  tags: { app: 'MyApp' },
});

// Configure network monitoring
patchNetwork({
  redactHeaders: ['authorization', 'cookie'],
  redactBody: false,
});
```

## 🔒 Privacy & Security

- **Header Redaction**: Automatically redact sensitive headers
- **Body Redaction**: Option to redact request/response bodies
- **Production Safety**: Automatically disabled in production builds
- **Zero Runtime Cost**: No overhead when disabled

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 📞 Support

- [GitHub Issues](https://github.com/khokanuzzman/react-native-flipper-inspector/issues)
- [Discussions](https://github.com/khokanuzzman/react-native-flipper-inspector/discussions)

---

Made with ❤️ for the React Native community
