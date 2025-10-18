# React Native Flipper Inspector - Example App

This example app demonstrates how to use the React Native Flipper Inspector package with minimal setup.

## 🚀 **EASIEST SETUP - 3 Lines of Code!**

```typescript
import { useFlipperInspector, ReactNativeInspectorOverlay, StoreProvider } from 'react-native-flipper-inspector';

export default function App() {
  useFlipperInspector(); // ← That's it! 🎉

  return (
    <StoreProvider>
      <YourAppContent />
      <ReactNativeInspectorOverlay />
    </StoreProvider>
  );
}
```

## 📱 **Features Included**

After adding 3 lines, you get:

✅ **Floating Button** - Appears on screen (only in debug builds)  
✅ **API Monitoring** - Automatically monitors all fetch & XMLHttpRequest calls  
✅ **Network Patching** - Ready to capture network requests  
✅ **Professional UI** - Beautiful dark theme with JSON highlighting  
✅ **Search & Filter** - Real-time search through API calls  
✅ **Copy Features** - Copy cURL, headers, raw data, and more  
✅ **Zero Config** - Works out of the box!

## 🧪 **Testing the Inspector**

1. **Start the App**:
   ```bash
   npm start
   ```

2. **Run on Device/Emulator**:
   ```bash
   npm run android   # Android
   npm run ios       # iOS
   ```

3. **Look for the 🔍 Button**:
   - The floating button should appear in the bottom-right corner
   - Only visible in debug/dev builds
   - Tap to open the inspector

4. **Make API Calls**:
   - The example app makes test API calls
   - All calls appear in the floating button UI
   - Tap a call to see details

5. **Explore Features**:
   - Search through API calls
   - View JSON responses with syntax highlighting
   - Copy cURL commands
   - Copy headers, bodies, raw data

## 🔧 **Advanced Configuration (Optional)**

If you want more control, you can use the original setup:

```typescript
import { 
  init, 
  patchNetwork, 
  ReactNativeInspectorOverlay, 
  StoreProvider 
} from 'react-native-flipper-inspector';

export default function App() {
  // Manual setup (if you need custom config)
  init({
    enabled: __DEV__,
    batch: {
      intervalMs: 1000,
      maxItems: 50,
    },
  });
  patchNetwork();

  return (
    <StoreProvider>
      <YourAppContent />
      <ReactNativeInspectorOverlay />
    </StoreProvider>
  );
}
```

## 📊 **What Gets Monitored Automatically**

With just `useFlipperInspector()`, these are monitored:

- ✅ `fetch()` calls
- ✅ `XMLHttpRequest` calls
- ✅ All network requests
- ✅ Request headers
- ✅ Response data
- ✅ Error responses
- ✅ Timing information

## 🎯 **API Usage Examples**

### Logging

```typescript
import { log, error, metric } from 'react-native-flipper-inspector';

log('User logged in', { userId: 123 });
error('API failed', { status: 500 });
metric('page_load_time', 1234);
```

### State Management

```typescript
import { state } from 'react-native-flipper-inspector';

state.update('user', { name: 'John', id: 123 });
state.remove('user');
```

### Performance Tracing

```typescript
import { trace } from 'react-native-flipper-inspector';

const traceId = trace.start('api_call');
// ... do something
trace.end(traceId, { success: true });
```

## 🚫 **Production Safety**

The package is **automatically disabled in production**:

```typescript
useFlipperInspector(); // ← Only works in debug/dev builds
```

- ✅ Debug APK: Inspector works
- ❌ Release APK: Automatically disabled
- ✅ Development: Full features
- ✅ Production: Zero overhead

## 🐛 **Troubleshooting**

### Button not appearing?
- Make sure you're in a debug build
- Check that `<ReactNativeInspectorOverlay />` is in your component tree
- Make sure `<StoreProvider>` wraps the content

### API calls not showing?
- Verify `useFlipperInspector()` is called in your App component
- Check that you're making actual API calls
- Ensure calls are `fetch()` or `XMLHttpRequest`

### Performance issues?
- The default batching (1000ms) is optimized for most apps
- Inspector has minimal overhead in production (0 KB when disabled)

## 📚 **Full API Reference**

See the main package README for complete API documentation:
https://www.npmjs.com/package/react-native-flipper-inspector

## ✨ **Key Improvements**

This example demonstrates the easiest possible setup:

1. **One Hook**: `useFlipperInspector()` - Replaces 4+ function calls
2. **Auto Config**: Smart defaults, zero configuration needed
3. **Production Safe**: Automatically disabled in release builds
4. **Network Ready**: Network patching enabled out of the box
5. **Component Ready**: One-line integration

---

**That's it! Start with 3 lines of code and get a full debugging toolkit!** 🚀
