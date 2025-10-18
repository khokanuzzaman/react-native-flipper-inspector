# iOS Setup Guide

Complete guide for setting up React Native Flipper Inspector on iOS.

## Installation

### 1. Install Package

```bash
npm install react-native-flipper-inspector
```

### 2. iOS Pod Installation

Update your `ios/Podfile`:

```ruby
target 'YourApp' do
  # ... other pods ...
  
  pod 'react-native-flipper-inspector', :path => '../node_modules/react-native-flipper-inspector'
end
```

Then install pods:

```bash
cd ios && pod install && cd ..
```

### 3. Basic Setup

In your App component:

```typescript
import { useFlipperInspector } from 'react-native-flipper-inspector';

export default function App() {
  useFlipperInspector(); // ✅ Auto-configured!
  return <YourApp />;
}
```

## Running on iOS

### Using Xcode

1. Open `ios/YourApp.xcworkspace` in Xcode
2. Select your target device or simulator
3. Press `Cmd + R` to run

### Using CLI

```bash
npx react-native run-ios
```

With specific device:

```bash
npx react-native run-ios --simulator="iPhone 15"
```

## Features Supported

✅ Event Logging - `log()`  
✅ Error Tracking - `error()`  
✅ Metrics - `metric()`  
✅ State Management - `state.update()`  
✅ Network Monitoring - `patchNetwork()`  
✅ Redux Integration - `attachRedux()`  
✅ Tracing - `trace.start/end()`  
✅ Inspector Overlay - Floating button UI  

## Native Module Features

The iOS native module provides:

- Device information (model, OS version, memory)
- Flipper availability detection
- App information (bundle ID, version)
- Automatic error handling

These are used internally by the JavaScript API.

## Troubleshooting

### Pods not installing?

```bash
# Clean and reinstall
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Flipper not showing?

1. Ensure Flipper desktop app is running
2. Check `isConnected()`:

```typescript
import { isConnected } from 'react-native-flipper-inspector';
console.log('Flipper connected:', isConnected());
```

3. Restart both app and Flipper

### Build errors?

Update Deployment Target:

1. Open Xcode
2. Select target
3. General tab → Minimum Deployments
4. Set to iOS 12.0 or higher

## Advanced Configuration

### Custom Batching

```typescript
import { init } from 'react-native-flipper-inspector';

init({
  batch: {
    intervalMs: 1000,
    maxItems: 50
  }
});
```

### Network Monitoring

```typescript
import { patchNetwork } from 'react-native-flipper-inspector';

patchNetwork({
  redactHeaders: ['authorization', 'cookie'],
  redactBody: false
});
```

### Redux Integration

```typescript
import { attachRedux } from 'react-native-flipper-inspector';

attachRedux(store, {
  whitelist: ['user', 'settings']
});
```

## Performance

- **Bundle Size**: < 10KB gzipped
- **Runtime Overhead**: Minimal (batched messaging)
- **Memory**: Configurable limits (default 10KB payloads)

## Support

- 📖 [API Reference](./api-reference.md)
- 🆘 [Troubleshooting](./troubleshooting.md)
- 🐛 [GitHub Issues](https://github.com/khokanuzzman/react-native-flipper-inspector/issues)
