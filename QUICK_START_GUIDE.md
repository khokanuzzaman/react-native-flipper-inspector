# React Native Flipper Inspector - Quick Start Guide

🚀 **Get API monitoring in your React Native app with ONE LINE of code!**

---

## Table of Contents

1. [Installation](#installation)
2. [Setup Methods](#setup-methods)
3. [Features](#features)
4. [Usage Examples](#usage-examples)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)
7. [API Reference](#api-reference)

---

## Installation

### Step 1: Install the Package

```bash
npm install react-native-flipper-inspector
# or
yarn add react-native-flipper-inspector
# or
pnpm add react-native-flipper-inspector
```

### Step 2: Choose Your Setup Method (Pick One)

---

## Setup Methods

### ⭐ **METHOD 1: ULTRA-EASY (Recommended)**

**One component wrapper - that's it!**

```typescript
// App.tsx
import { FlipperInspectorProvider } from 'react-native-flipper-inspector';

export default function App() {
  return (
    <FlipperInspectorProvider>
      <YourAppContent />
    </FlipperInspectorProvider>
  );
}
```

**Benefits:**
- ✅ Simplest setup - one component
- ✅ No additional code needed
- ✅ Automatic network monitoring
- ✅ Production safe (auto-disabled in release builds)
- ✅ All features enabled by default

---

### 🎯 **METHOD 2: EASY (Using Hook)**

**One hook call**

```typescript
// App.tsx
import { 
  useFlipperInspector, 
  ReactNativeInspectorOverlay, 
  StoreProvider 
} from 'react-native-flipper-inspector';

export default function App() {
  useFlipperInspector(); // ← One line!

  return (
    <StoreProvider>
      <YourAppContent />
      <ReactNativeInspectorOverlay />
    </StoreProvider>
  );
}
```

**Benefits:**
- ✅ One hook call
- ✅ Explicit component structure
- ✅ More control if needed

---

### 🔧 **METHOD 3: ADVANCED (Manual Setup)**

**Full control and configuration**

```typescript
// App.tsx
import { 
  init, 
  patchNetwork, 
  ReactNativeInspectorOverlay, 
  StoreProvider 
} from 'react-native-flipper-inspector';

// Initialize with custom config
init({
  enabled: __DEV__,
  batch: {
    intervalMs: 1000,
    maxItems: 50,
  },
});

// Enable network monitoring
patchNetwork();

export default function App() {
  return (
    <StoreProvider>
      <YourAppContent />
      <ReactNativeInspectorOverlay />
    </StoreProvider>
  );
}
```

**Benefits:**
- ✅ Full control
- ✅ Custom configuration
- ✅ Advanced use cases

---

## Features

Once you've added the setup, you automatically get:

### 🎨 **Professional UI**
- Modern gradient backgrounds
- Beautiful card layouts
- Dark theme with syntax highlighting
- Professional typography

### 🔍 **API Monitoring**
- Automatic fetch interception
- XMLHttpRequest monitoring
- Request/response capture
- Error tracking

### 🔎 **Search & Filter**
- Real-time search through API calls
- Filter by headers, URL, response
- Sticky search state
- Match highlighting and navigation

### 📋 **Copy Features**
- Copy as cURL command
- Copy endpoint
- Copy request/response body
- Copy headers
- Copy raw data
- Long-press to copy any text

### 📊 **Developer Tools**
- Response time tracking
- Status code display
- JSON syntax highlighting
- Network timing
- Request/response inspection

---

## Features Overview

### 📱 **Floating Button**
- Always accessible on screen
- Tap to open inspector
- Shows in bottom-right corner
- Only visible in debug builds

### 🌈 **JSON Highlighting**
- Gold: Object keys
- Green: String values
- Blue: Numbers
- Orange: Booleans
- Pink: Null values
- Purple: Structure (braces, brackets)

### 🎯 **Search & Navigation**
- Type to search API calls
- Previous/Next buttons to navigate
- Match count display
- Current match highlighted in orange
- Other matches in yellow

---

## Usage Examples

### 1. **Basic Setup** (Recommended)

```typescript
import { FlipperInspectorProvider } from 'react-native-flipper-inspector';

export default function App() {
  return (
    <FlipperInspectorProvider>
      <RootNavigator />
    </FlipperInspectorProvider>
  );
}
```

### 2. **With Navigation**

```typescript
import { FlipperInspectorProvider } from 'react-native-flipper-inspector';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <FlipperInspectorProvider>
      <NavigationContainer>
        <RootStack.Navigator>
          {/* Your screens */}
        </RootStack.Navigator>
      </NavigationContainer>
    </FlipperInspectorProvider>
  );
}
```

### 3. **Logging Events**

```typescript
import { log, error, metric } from 'react-native-flipper-inspector';

// Log an event
log('User logged in', { userId: 123, timestamp: Date.now() });

// Log an error
error('API call failed', { status: 500, endpoint: '/api/users' });

// Track a metric
metric('page_load_time', 1234, { page: 'home' });
```

### 4. **State Management**

```typescript
import { state } from 'react-native-flipper-inspector';

// Update state
state.update('user', { id: '123', name: 'John Doe', email: 'john@example.com' });

// Remove state
state.remove('user');

// View state
const allState = state.getState();
```

### 5. **Performance Tracing**

```typescript
import { trace } from 'react-native-flipper-inspector';

// Start a trace
const traceId = trace.start('api_call');

// ... do work ...

// End the trace with result data
trace.end(traceId, { success: true, dataSize: 1024 });
```

---

## Testing

### 1. **View the Floating Button**
- Look for 🔍 icon in bottom-right corner
- Tap to open the inspector

### 2. **Test Network Monitoring**
- Make fetch/XMLHttpRequest calls
- See them appear in the inspector
- Tap to view details

### 3. **Test Search**
- Type in the search box
- Filters API calls
- Previous/Next buttons work

### 4. **Test Copy Features**
- Tap "Copy as cURL" to copy command
- Tap other copy buttons for different data
- Long-press text to copy directly

### 5. **Test JSON Highlighting**
- Make an API call with JSON response
- View the beautifully highlighted JSON
- Different colors for different types

---

## Troubleshooting

### ❓ **Button Not Appearing**

**Problem:** The 🔍 floating button is not visible

**Solutions:**
- ✅ Make sure you're in a **debug build** (not release)
- ✅ Check that setup method is correctly installed
- ✅ Verify `<FlipperInspectorProvider>` or overlay is rendering
- ✅ Check console for errors

### ❓ **API Calls Not Showing**

**Problem:** No API calls appear in the inspector

**Solutions:**
- ✅ Verify you're making actual fetch/XMLHttpRequest calls
- ✅ Check that calls complete successfully
- ✅ Network monitoring is enabled by default
- ✅ Check console for network errors

### ❓ **Slow Performance**

**Problem:** App feels sluggish after adding inspector

**Solutions:**
- ✅ Inspector is optimized and shouldn't impact performance
- ✅ Default batching (1000ms) is very efficient
- ✅ Inspector has zero overhead in production builds
- ✅ Try closing the inspector while not debugging

### ❓ **Release Build Shows Inspector**

**Problem:** Inspector appears in release APK

**Solutions:**
- ✅ Set `enabled: __DEV__` (this is the default)
- ✅ Check that your build is actually a release build
- ✅ Rebuild after code changes

---

## API Reference

### **Core Functions**

#### `init(config?)`
Initialize the inspector with optional configuration

```typescript
init({
  enabled: __DEV__,
  batch: { intervalMs: 1000, maxItems: 50 }
});
```

#### `log(message, data?, tags?)`
Log a message with optional data

```typescript
log('User action', { userId: 123 });
```

#### `error(message, error?, tags?)`
Log an error

```typescript
error('API failed', apiError);
```

#### `metric(name, value, tags?)`
Track a metric

```typescript
metric('api_response_time', 250);
```

#### `state.update(key, data)`
Update state

```typescript
state.update('user', { id: 1, name: 'John' });
```

#### `state.remove(key)`
Remove state

```typescript
state.remove('user');
```

#### `trace.start(name)`
Start a performance trace

```typescript
const id = trace.start('operation');
```

#### `trace.end(id, data?)`
End a performance trace

```typescript
trace.end(id, { success: true });
```

---

## Components

### **FlipperInspectorProvider** (Recommended)

Wrap your app for automatic setup

```typescript
<FlipperInspectorProvider>
  <App />
</FlipperInspectorProvider>
```

### **ReactNativeInspectorOverlay**

Shows the floating button and inspector UI

```typescript
<ReactNativeInspectorOverlay />
```

### **StoreProvider**

Provides state management context

```typescript
<StoreProvider>
  <App />
</StoreProvider>
```

---

## Production Safety

✅ **Automatically disabled in release builds**

- Debug builds: All features enabled
- Release builds: Zero overhead, completely removed
- No performance impact
- No bundle size increase

---

## Best Practices

### ✅ Do

- Use `FlipperInspectorProvider` for simplest setup
- Log meaningful messages with context
- Use tags to organize logs
- Tag metrics with endpoint/page info
- Use tracing for performance tracking

### ❌ Don't

- Don't log sensitive user data
- Don't spam with too many logs
- Don't use in production (it auto-disables)
- Don't forget to wrap with StoreProvider/FlipperInspectorProvider

---

## Next Steps

1. **Install the package**: `npm install react-native-flipper-inspector`
2. **Add setup method** (choose one of the 3 methods above)
3. **Run your app**: `npm run android` or `npm run ios`
4. **Look for the 🔍 button** in bottom-right corner
5. **Make API calls** to see them in the inspector
6. **Explore the UI** - search, copy, view details

---

## Support

- **Documentation**: https://www.npmjs.com/package/react-native-flipper-inspector
- **GitHub**: https://github.com/khokanuzzman/react-native-flipper-inspector
- **Issues**: https://github.com/khokanuzzman/react-native-flipper-inspector/issues

---

**Happy debugging! 🚀**
