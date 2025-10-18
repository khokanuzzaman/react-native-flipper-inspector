# Android Setup Guide

Complete guide for setting up React Native Flipper Inspector on Android.

## Installation

### 1. Install Package

```bash
npm install react-native-flipper-inspector
```

### 2. Android Auto-Setup

Good news! React Native automatically links the module. No additional setup required!

### 3. Basic Setup

In your App component:

```typescript
import { useFlipperInspector } from 'react-native-flipper-inspector';

export default function App() {
  useFlipperInspector(); // ✅ Auto-configured!
  return <YourApp />;
}
```

## Running on Android

### Using Emulator

```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd YourEmulatorName

# Then run
npx react-native run-android
```

### Using Physical Device

1. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging

2. Connect device via USB

3. Verify connection:
   ```bash
   adb devices
   ```

4. Run:
   ```bash
   npx react-native run-android
   ```

## Features Supported

✅ Event Logging - `log()`  
✅ Error Tracking - `error()`  
✅ Metrics - `metric()`  
✅ State Management - `state.update()`  
✅ Network Monitoring - `patchNetwork()`  
✅ Redux Integration - `attachRedux()`  
✅ Tracing - `trace.start/end()`  
✅ Inspector Overlay - Floating button UI (draggable!)  

## Native Features

The Android native implementation includes:

- Floating action button with draggable support
- Professional drag effects (shadow, color feedback)
- Haptic vibration feedback
- Touch detection (tap vs drag)
- Screen boundary protection
- API call inspection UI

## Troubleshooting

### Device Offline?

```bash
adb kill-server
adb start-server
adb devices
```

### Port Already in Use?

```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Then restart
npx react-native start
```

### Build Errors?

Clean and rebuild:

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Flipper Not Showing?

1. Check Flipper is running (desktop app)
2. Verify USB debugging enabled
3. Restart Flipper and app
4. Check connection:

```typescript
import { isConnected } from 'react-native-flipper-inspector';
console.log('Flipper connected:', isConnected());
```

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

## Floating Button Features

The draggable floating button provides:

- **Tap**: Opens API inspector (quick tap < 200ms)
- **Hold & Drag**: Moves button smoothly (hold > 200ms)
- **Haptic Feedback**: Vibration on drag start
- **Visual Effects**: Shadow increase, gradient change
- **Boundary Protection**: Stays on screen
- **Smooth Animation**: Professional feel

### Customization

The floating button is automatically added. To customize position in future versions, check the example app:

```
apps/example/android/app/src/main/java/.../MainActivity.java
```

## Performance

- **Bundle Size**: < 10KB gzipped
- **Runtime Overhead**: Minimal (batched messaging)
- **Memory**: Configurable limits (default 10KB payloads)
- **Native Code**: Only loads in debug builds

## Support

- 📖 [API Reference](./api-reference.md)
- 🆘 [Troubleshooting](./troubleshooting.md)
- 🐛 [GitHub Issues](https://github.com/khokanuzzman/react-native-flipper-inspector/issues)
