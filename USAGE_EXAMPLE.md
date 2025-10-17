# React Native Flipper Inspector - Overlay Usage

## 🎯 **Portable API Monitoring Overlay**

The React Native Flipper Inspector now provides a **portable overlay** that can be integrated into any React Native app to monitor API calls in real-time.

## 🚀 **Quick Start**

### 1. Install the Package
```bash
npm install react-native-flipper-inspector
```

### 2. Add the Overlay to Your App
```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ReactNativeInspectorOverlay } from 'react-native-flipper-inspector';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Your app content */}
      <YourAppContent />
      
      {/* API Inspector Overlay */}
      <ReactNativeInspectorOverlay
        enabled={true}
        position="bottom-right"
        size={60}
        color="#007bff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

## 🎨 **Customization Options**

```tsx
<ReactNativeInspectorOverlay
  enabled={__DEV__} // Only show in development
  position="bottom-left" // Position: top-right, top-left, bottom-right, bottom-left
  size={70} // Size of floating button
  color="#ff6b6b" // Custom color
/>
```

## 🔍 **Features**

### **Floating Action Button**
- 🔍 **Always visible** floating button
- 🎯 **Customizable position** (4 corners)
- 🎨 **Customizable size and color**
- ⚡ **Zero performance impact** when disabled

### **API Monitoring Screen**
- 📊 **Real-time API call tracking**
- 📈 **Statistics** (Total calls, Success rate, Errors)
- 📋 **Detailed call information**
- 🔄 **Auto-refresh** as new calls come in

### **API Call Details**
- 🌐 **Full request/response details**
- 📝 **Headers and body content**
- ⏱️ **Response time tracking**
- 🚨 **Error detection and reporting**

### **Actions Available**
- 📋 **Copy Response** - Copy response body to clipboard
- 📋 **Copy cURL** - Generate and copy cURL command
- 📤 **Share** - Share API call details via system share

## 📱 **Usage in Any App**

### **Basic Integration**
```tsx
import { ReactNativeInspectorOverlay } from 'react-native-flipper-inspector';

// Add anywhere in your app component tree
<ReactNativeInspectorOverlay />
```

### **Conditional Rendering**
```tsx
import { ReactNativeInspectorOverlay } from 'react-native-flipper-inspector';

function App() {
  const [showInspector, setShowInspector] = useState(__DEV__);
  
  return (
    <>
      <YourAppContent />
      {showInspector && (
        <ReactNativeInspectorOverlay
          position="bottom-right"
          color="#28a745"
        />
      )}
    </>
  );
}
```

### **Manual Control with Hook**
```tsx
import { useInspector } from 'react-native-flipper-inspector';

function App() {
  const { startMonitoring, stopMonitoring } = useInspector();
  
  useEffect(() => {
    // Start monitoring when component mounts
    startMonitoring();
    
    return () => {
      // Stop monitoring when component unmounts
      stopMonitoring();
    };
  }, []);
  
  return <YourAppContent />;
}
```

## 🎯 **Perfect For**

- 🔍 **API Development** - Monitor all network requests
- 🐛 **Debugging** - Track down API issues quickly
- 📊 **Performance** - Monitor response times
- 🧪 **Testing** - Verify API calls during development
- 📱 **Mobile Development** - See network activity on device
- 🔄 **Integration Testing** - Verify API integrations

## 🚀 **Example: E-commerce App**

```tsx
import React from 'react';
import { View } from 'react-native';
import { ReactNativeInspectorOverlay } from 'react-native-flipper-inspector';

// Your e-commerce app components
import ProductList from './ProductList';
import ShoppingCart from './ShoppingCart';
import UserProfile from './UserProfile';

export default function EcommerceApp() {
  return (
    <View style={{ flex: 1 }}>
      {/* Your app components */}
      <ProductList />
      <ShoppingCart />
      <UserProfile />
      
      {/* API Inspector - monitors all API calls */}
      <ReactNativeInspectorOverlay
        enabled={__DEV__}
        position="bottom-right"
        color="#e91e63"
      />
    </View>
  );
}
```

## 📊 **What You'll See**

### **Floating Button**
- 🔍 Icon that floats over your app
- Tapping opens the monitoring screen

### **Monitoring Screen**
- **Statistics**: Total calls, Success rate, Errors
- **API Call List**: All network requests with method, URL, status, duration
- **Tap any call** for detailed information

### **Detail Screen**
- **Request Details**: Method, URL, headers, body
- **Response Details**: Status, headers, body, duration
- **Actions**: Copy response, Copy cURL, Share

## 🎉 **Benefits**

✅ **Zero Setup** - Just add one component  
✅ **Non-intrusive** - Doesn't affect your app  
✅ **Real-time** - See API calls as they happen  
✅ **Portable** - Works in any React Native app  
✅ **Development-friendly** - Perfect for debugging  
✅ **Production-safe** - Easy to disable in production  

## 🔧 **Advanced Usage**

### **Custom Store Provider**
```tsx
import { StoreProvider } from 'react-native-flipper-inspector';

function App() {
  return (
    <StoreProvider>
      <YourAppContent />
      <ReactNativeInspectorOverlay />
    </StoreProvider>
  );
}
```

### **Multiple Inspectors**
```tsx
// You can even have multiple inspectors for different purposes
<ReactNativeInspectorOverlay position="bottom-right" color="#007bff" />
<ReactNativeInspectorOverlay position="bottom-left" color="#28a745" />
```

---

**🎯 The React Native Flipper Inspector overlay is the perfect tool for monitoring API calls in any React Native app!**
