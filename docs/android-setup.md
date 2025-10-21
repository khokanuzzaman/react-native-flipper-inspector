# Android Setup Guide

Complete guide for setting up React Native Flipper Inspector on Android.

> **✅ v1.0.9 Update:** Full Android SDK 36 support with namespace declaration for AGP 8.0+

## Installation

### 1. Install Package

```bash
npm install react-native-flipper-inspector@1.0.9
```

### 2. Android Auto-Setup

Good news! React Native automatically links the module. No additional setup required!

**Supported Configurations:**
- ✅ Android SDK 21-36 (Android 5.0 - Android 15)
- ✅ Android Gradle Plugin 7.0+ and 8.0+
- ✅ React Native 0.60+
- ✅ Modern Gradle DSL

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

## Features in Action

<div align="center">
  <img src="../screenshots/floating-button.jpeg" width="300" alt="Floating Button">
  <img src="../screenshots/api-inspector-list.jpeg" width="300" alt="API Inspector">
</div>

## Features Supported

✅ Event Logging - `log()`