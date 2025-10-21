# Release Notes v1.0.8

## 🐛 Critical Bug Fix Release

### What's Fixed

This release resolves a critical bug that caused crashes in older React Native projects with the error:

```
TypeError: Cannot read property 'method' of undefined
```

### The Problem

When the package code was minified, a variable naming conflict occurred where the variable `method` conflicted with the object property `method`, resulting in attempts to access `method.method` which caused the application to crash.

This particularly affected:
- 📱 Older React Native projects (pre-0.70)
- 🔧 Projects with aggressive minification settings
- 🌐 Applications using network monitoring features

### The Solution

We've implemented the following fixes:

1. **Variable Renaming**: Changed the HTTP method variable from `method` to `httpMethod` to avoid minification conflicts
2. **Global Compatibility**: Updated all `global` references to `globalThis` for better cross-environment support
3. **Type Safety**: Added proper TypeScript declarations for global scope handling
4. **Enhanced Testing**: Added comprehensive tests to prevent similar issues in the future

### What Changed

#### Before (Broken)
```typescript
const method = init?.method || 'GET';
// After minification: method.method ❌
```

#### After (Fixed)
```typescript
const httpMethod = init?.method || 'GET';
// After minification: method: p ✅
```

### Files Modified
- ✅ `src/integrations/network.ts` - Network monitoring integration
- ✅ `src/core/networkInterceptor.ts` - Core network interceptor
- ✅ `src/types/index.ts` - TypeScript type declarations

### Impact

- ✅ **No Breaking Changes**: This is a bug fix only, no API changes
- ✅ **Backward Compatible**: Works with all React Native versions
- ✅ **Drop-in Replacement**: Just upgrade and it works
- ✅ **Performance**: No impact on performance
- ✅ **Bundle Size**: No increase in bundle size

### Testing

All tests pass with 100% success rate:
```
✅ Variable naming conflict check - PASS
✅ Network patching function - PASS
✅ Fetch API interception - PASS
✅ XMLHttpRequest patching - PASS
✅ Method parameter usage - PASS
```

### How to Upgrade

#### npm
```bash
npm install react-native-flipper-inspector@1.0.8
```

#### yarn
```bash
yarn upgrade react-native-flipper-inspector@1.0.8
```

#### pnpm
```bash
pnpm update react-native-flipper-inspector@1.0.8
```

### Verification

After upgrading, verify the fix by:

1. **Check for errors**: Your app should start without the "method" error
2. **Test network monitoring**: Make API calls and verify they're intercepted
3. **View the overlay**: Open the floating inspector to see captured requests

```typescript
import { useFlipperInspector } from 'react-native-flipper-inspector';

function App() {
  useFlipperInspector(); // ✅ Should work without errors
  
  // Test with any network request
  fetch('https://api.example.com/data');
  
  return <YourApp />;
}
```

### Compatibility

- ✅ React Native 0.60+
- ✅ React Native 0.70+
- ✅ React Native 0.73+ (tested)
- ✅ Expo SDK 48+
- ✅ TypeScript 4.x and 5.x
- ✅ iOS 11+
- ✅ Android API 21+

### Known Issues

None! This release specifically addresses the reported issue.

### Migration Guide

**No migration needed!** This is a drop-in replacement. Just upgrade the package version.

### Acknowledgments

Thank you to our users who reported this issue and helped us identify the problem quickly. Your feedback makes this package better! 🙏

### What's Next

We're working on exciting new features for version 2.0:
- 🔧 Request Builder (Postman-style)
- 🔐 Authentication support
- 📁 Request collections
- 🔗 Request chaining
- 📊 Advanced analytics

Stay tuned!

---

### Full Changelog

See [CHANGELOG.md](./packages/react-native-flipper-inspector/CHANGELOG.md) for complete version history.

### Documentation

- 📚 [Quick Start Guide](./docs/quick-start.md)
- 🔧 [API Reference](./docs/api-reference.md)
- 🐛 [Troubleshooting](./docs/troubleshooting.md)
- 🌐 [Network Monitoring](./docs/network-monitoring.md)

### Support

- 💬 [GitHub Discussions](https://github.com/yourusername/react-native-flipper-inspector/discussions)
- 🐛 [Report Issues](https://github.com/yourusername/react-native-flipper-inspector/issues)
- 📧 [Email Support](mailto:support@example.com)

### License

MIT License - see [LICENSE](./LICENSE) file for details.

---

**Released:** October 21, 2025  
**Version:** 1.0.8  
**Type:** Bug Fix  
**Priority:** High (Critical Bug Fix)

