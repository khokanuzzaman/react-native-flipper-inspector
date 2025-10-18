# Setup & Run Guide - React Native Flipper Inspector

Complete step-by-step guide to set up and run the example application.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js** (v18+)
- ✅ **React Native CLI** (`npm install -g react-native-cli`)
- ✅ **Android Studio** (for Android) OR **Xcode** (for iOS)
- ✅ **Android Emulator** OR **iOS Simulator** (or physical device)
- ✅ **ADB** (Android Debug Bridge) installed

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd /Users/khokan/Desktop/npm\ packages/react-native-flipper-inspector
npm install
cd apps/example
npm install
```

### Step 2: Start Metro Bundler

```bash
npm start
```

Output should show:
```
Welcome to Metro!
Fast - Scalable - Integrated

To reload the app press r
To open developer menu press d
```

### Step 3: Run on Android (in another terminal)

```bash
# Make sure you're in apps/example directory
npm run android
```

**OR** Run on iOS:

```bash
npm run ios
```

### Step 4: Look for the 🔍 Button

- Wait for the app to load on your device/emulator
- Look for a **floating button** with 🔍 icon in the bottom-right corner
- Tap it to open the API Inspector

---

## 📱 Detailed Setup Guide

### For Android (Emulator or Device)

#### Option A: Using Android Emulator

```bash
# 1. Start Android Studio and open Device Manager
# 2. Create or start an Android emulator (API 28+)

# 3. Verify device connection
adb devices

# Output should show:
# List of attached devices
# emulator-5554          device

# 4. Start Metro bundler
npm start

# 5. In another terminal, run the app
cd apps/example
npm run android
```

#### Option B: Using Physical Android Device

```bash
# 1. Enable USB Debugging on your Android phone
#    Settings > Developer Options > USB Debugging

# 2. Connect your phone via USB cable

# 3. Verify connection
adb devices

# 4. Start Metro
npm start

# 5. Run the app
cd apps/example
npm run android
```

### For iOS (Simulator or Device)

#### Option A: Using iOS Simulator

```bash
# 1. Make sure Xcode is installed
xcode-select --install

# 2. Start Metro bundler
npm start

# 3. In another terminal, run the app
cd apps/example
npm run ios
```

#### Option B: Using Physical iPhone

```bash
# 1. Connect your iPhone via USB cable
# 2. Trust the computer on your iPhone

# 3. Start Metro
npm start

# 4. Run the app
cd apps/example
npm run ios --device

# 5. When prompted, select your connected device
```

---

## ✅ Verification Checklist

After starting the app, verify:

| Item | Check |
|------|-------|
| App launches without errors | ✅ App appears on screen |
| 🔍 button visible | ✅ Floating button in bottom-right |
| Button is tappable | ✅ Can tap and see response |
| Inspector UI opens | ✅ Shows API call interface |
| Can search | ✅ Search input field works |
| API calls appear | ✅ Make a network call to test |

---

## 🧪 Testing Features

### 1. **Test Floating Button**

```
Action: Tap the 🔍 button in bottom-right corner
Expected: Inspector overlay opens with full UI
```

### 2. **Test Network Monitoring**

```
Action: The app makes test API calls automatically
Expected: Calls appear in the API list with:
- URL
- Status code (200, 404, 500, etc.)
- Duration/timing
- Request method (GET, POST, etc.)
```

### 3. **Test Search**

```
Action: Type in the search box to filter API calls
Expected: List filters in real-time
```

### 4. **Test Copy Features**

```
Action: Tap an API call detail
Expected: Can see copy buttons for:
- Copy as cURL
- Copy Endpoint
- Copy Headers
- Copy Body
- Copy Raw Data
```

### 5. **Test JSON Highlighting**

```
Action: View a JSON response
Expected: JSON is beautifully highlighted:
- Keys in Gold
- Strings in Green
- Numbers in Blue
- Booleans in Orange
- Null in Pink
- Structure in Purple
```

---

## 🐛 Troubleshooting

### Problem: "Metro has encountered an error"

**Solution:**
```bash
# Clear cache and restart
npm start -- --reset-cache
```

### Problem: "Could not connect to development server"

**Solution:**
```bash
# Make sure Metro is running in another terminal
npm start

# Or use specific IP
adb reverse tcp:8081 tcp:8081
```

### Problem: "App won't build / Gradle errors"

**Solution:**
```bash
# Clear Android build cache
cd apps/example/android
./gradlew clean

# Then rebuild
cd ..
npm run android
```

### Problem: "🔍 Button not appearing"

**Solution:**
- ✅ Make sure you're in a **debug build** (not release)
- ✅ Check console for errors: `npm run android -- --verbose`
- ✅ Verify `<ReactNativeInspectorOverlay />` is in App.tsx
- ✅ Check that setup hook is being called

### Problem: "API calls not showing"

**Solution:**
- ✅ Make sure app is actually making network calls
- ✅ Check that network monitoring is enabled (default: enabled)
- ✅ Try making a fetch call manually from console
- ✅ Check for CORS/network errors

---

## 📋 Project Structure

```
react-native-flipper-inspector/
├── packages/
│   └── react-native-flipper-inspector/    # Main package
│       ├── src/
│       │   ├── api/                        # Core APIs
│       │   ├── components/                 # React components
│       │   ├── hooks/                      # Custom hooks
│       │   ├── overlay/                    # Overlay UI
│       │   └── index.ts                    # Entry point
│       └── package.json
│
└── apps/
    └── example/                            # Example app
        ├── App.tsx                         # Setup (already done!)
        ├── SimpleTest.tsx                  # Example component
        ├── android/                        # Android native code
        ├── ios/                            # iOS native code
        └── package.json
```

---

## 🎯 Example App Code

The example app (`apps/example/App.tsx`) uses the **EASIEST setup**:

```typescript
import React from 'react';
import { useFlipperInspector, ReactNativeInspectorOverlay, StoreProvider } from 'react-native-flipper-inspector';
import SimpleTest from './SimpleTest';

export default function App() {
  // ONE LINE SETUP! 🚀
  useFlipperInspector();

  return (
    <StoreProvider>
      <SimpleTest />
      <ReactNativeInspectorOverlay />
    </StoreProvider>
  );
}
```

**That's it!** The entire setup is just 3 lines of React code.

---

## 🚀 Running Commands Reference

```bash
# Start Metro bundler (terminal 1)
npm start

# Run on Android (terminal 2)
npm run android

# Run on iOS (terminal 2)
npm run ios

# Lint code
npm run lint

# Run tests
npm test

# Audit packages
npm audit

# Clear cache
npm start -- --reset-cache
```

---

## 📊 What Happens When App Starts

1. **Metro bundler** bundles your React Native code
2. **React Native** loads the bundle on device/emulator
3. **App component** renders with `<FlipperInspectorProvider>`
4. **Setup hook** initializes the inspector automatically
5. **Floating button** appears on screen
6. **Network patching** starts intercepting API calls
7. **App is ready** to monitor API calls!

---

## ✨ Features Enabled by Default

Once the app starts, you automatically get:

| Feature | Status |
|---------|--------|
| 🎯 Floating Button | ✅ Enabled |
| 📊 Network Monitoring | ✅ Enabled |
| 🔍 Search & Filter | ✅ Enabled |
| 📋 Copy Features | ✅ Enabled |
| 🌈 JSON Highlighting | ✅ Enabled |
| ⚡ Auto Batching | ✅ Enabled |
| 🔒 Production Safe | ✅ Enabled |

---

## 📚 Next Steps

1. ✅ Run the example app
2. ✅ Explore the UI
3. ✅ Test the search feature
4. ✅ Test the copy buttons
5. ✅ Read `QUICK_START_GUIDE.md` for detailed API docs
6. ✅ Integrate into your own app

---

## 🤝 Need Help?

- Check the **Troubleshooting** section above
- Read `QUICK_START_GUIDE.md` for comprehensive documentation
- Visit GitHub: https://github.com/khokanuzzman/react-native-flipper-inspector
- Create an issue with error details

---

## 🎉 Ready to Debug?

**You're all set!** Start with:

```bash
npm start
```

Then in another terminal:

```bash
npm run android
# or
npm run ios
```

Look for the 🔍 button and tap to start debugging! 🚀

---

**Happy debugging!**
