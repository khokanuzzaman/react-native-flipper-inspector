# 🚀 Release Notes - Version 1.0.9

**Release Date:** October 21, 2025

## 📦 Overview

Version 1.0.9 brings full Android SDK 36 support and important build system updates for modern React Native projects using Android Gradle Plugin 8.0+.

## 🎯 What's New

### Android SDK 36 Support

**Full support for Android 15 (SDK 36):**
- ✅ Added namespace declaration for Android Gradle Plugin 8.0+
- ✅ Updated compileSdk to 36 for latest Android support
- ✅ Modern Gradle DSL syntax (compileSdk, minSdk, targetSdk)
- ✅ Backward compatible with older Android versions

### Build System Updates

**Modern Gradle Configuration:**
```gradle
android {
    namespace "com.reactnativeflipperinspector"
    compileSdk 36
    
    defaultConfig {
        minSdk 21
        targetSdk 36
    }
}
```

## 🔧 Technical Changes

### Android Build Configuration

**Before (v1.0.8):**
```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 34
    }
}
```

**After (v1.0.9):**
```gradle
android {
    namespace "com.reactnativeflipperinspector"
    compileSdk 36
    
    defaultConfig {
        minSdk 21
        targetSdk 36
    }
}
```

### What Changed

1. **Namespace Declaration**: Added explicit namespace to comply with AGP 8.0+ requirements
2. **Modern Gradle DSL**: Updated to use `compileSdk` instead of deprecated `compileSdkVersion`
3. **SDK Update**: Bumped to Android SDK 36 (Android 15)
4. **Backward Compatibility**: Still supports Android SDK 21+ (Android 5.0+)

## 🎁 Who Benefits

### Projects Using Android SDK 36
If your project uses `compileSdk 36` or `compileSdkVersion 36`, this update resolves namespace-related build warnings and errors.

### Modern React Native Projects
Projects using:
- Android Gradle Plugin 8.0+
- React Native 0.73+
- Latest Android toolchain

### All Projects
Even if you're not on Android SDK 36 yet, this version maintains full backward compatibility while preparing your codebase for future updates.

## 📝 Previous Fixes (v1.0.8)

For reference, v1.0.8 fixed a critical "method property" error:
- ✅ Fixed "Cannot read property 'method' of undefined" error
- ✅ Resolved variable naming conflict in minified code
- ✅ Enhanced compatibility with older React Native versions
- ✅ Improved globalThis support

## 🚀 Upgrade Instructions

### For Existing Users

**Step 1: Update Package**
```bash
# npm
npm install react-native-flipper-inspector@1.0.9

# yarn
yarn upgrade react-native-flipper-inspector@1.0.9

# pnpm
pnpm update react-native-flipper-inspector@1.0.9
```

**Step 2: Clean Build (Android)**
```bash
cd android
./gradlew clean
cd ..
```

**Step 3: Rebuild**
```bash
npx react-native run-android
```

### For New Users

**Installation:**
```bash
npm install react-native-flipper-inspector@1.0.9
```

**Basic Setup:**
```typescript
import { useFlipperInspector } from 'react-native-flipper-inspector';

export default function App() {
  useFlipperInspector();
  return <YourApp />;
}
```

## ✅ Compatibility

### Supported Versions

| Component | Version Range |
|-----------|--------------|
| React Native | 0.60+ |
| Android SDK | 21-36 (Android 5.0 - Android 15) |
| Android Gradle Plugin | 7.0+ and 8.0+ |
| iOS | 11.0+ |
| Node.js | 14+ |

### Tested Configurations

- ✅ React Native 0.73.x + Android SDK 36
- ✅ React Native 0.72.x + Android SDK 34
- ✅ React Native 0.71.x + Android SDK 33
- ✅ Android Gradle Plugin 8.0.1
- ✅ Android Gradle Plugin 7.4.2

## 🐛 Fixed Issues

### Namespace Declaration Warning

**Issue:**
```
package="..." found in source AndroidManifest.xml is no longer supported
Setting the namespace via the package attribute is ignored
```

**Resolution:** Added explicit namespace declaration in `build.gradle`

### Deprecated Gradle API

**Issue:**
```
compileSdkVersion is deprecated. Use compileSdk instead.
```

**Resolution:** Updated to modern Gradle DSL syntax

## 📚 Documentation Updates

All documentation has been updated to reflect v1.0.9:
- ✅ Quick Start Guide
- ✅ Android Setup Guide
- ✅ Troubleshooting Guide
- ✅ API Reference
- ✅ README files

## 🔍 Verification

### Test the Update

After upgrading, verify everything works:

```typescript
import { useFlipperInspector } from 'react-native-flipper-inspector';

function App() {
  useFlipperInspector();
  
  // Test network monitoring
  fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(res => res.json())
    .then(data => console.log('✅ Working!', data))
    .catch(err => console.error('❌ Error:', err));
  
  return <YourApp />;
}
```

**Expected Results:**
- ✅ No build warnings about namespace
- ✅ No "method property" errors
- ✅ Network requests are captured
- ✅ Floating inspector button appears
- ✅ App runs smoothly

## 🎯 Migration Notes

### From v1.0.8 to v1.0.9

**No Code Changes Required!**

This is a drop-in replacement. Simply update the package version and rebuild.

**What You Get:**
- Automatic namespace declaration
- Modern Gradle API usage
- Android SDK 36 support
- No breaking changes

### From Older Versions

If you're upgrading from v1.0.7 or earlier:
1. Update to v1.0.9 directly
2. Clean your build folders
3. Rebuild your app
4. Test network monitoring

All fixes from v1.0.8 are included in v1.0.9.

## 📈 Performance

No performance changes in this release. The update focuses on build system compatibility.

## 🔐 Security

No security issues addressed in this release.

## 🌟 What's Next

### Planned Features

- Enhanced UI components
- Performance optimizations
- Additional network protocols support
- WebSocket monitoring improvements

### Feedback Welcome

We're constantly improving! Share your feedback:
- 🐛 [Report bugs](https://github.com/khokanuzzman/react-native-flipper-inspector/issues)
- 💡 [Request features](https://github.com/khokanuzzman/react-native-flipper-inspector/discussions)
- ⭐ [Star the project](https://github.com/khokanuzzman/react-native-flipper-inspector)

## 📞 Support

Need help?

- 📖 [Documentation](https://github.com/khokanuzzman/react-native-flipper-inspector/tree/main/docs)
- 🐛 [Issue Tracker](https://github.com/khokanuzzman/react-native-flipper-inspector/issues)
- 💬 [Discussions](https://github.com/khokanuzzman/react-native-flipper-inspector/discussions)
- 📧 [Email Support](mailto:khokanuzzman@gmail.com)

## 🙏 Acknowledgments

Thank you to all users who reported build issues with Android SDK 36. Your feedback helps us improve!

## 📜 License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Version:** 1.0.9  
**Release Date:** October 21, 2025  
**Tag:** [v1.0.9](https://github.com/khokanuzzman/react-native-flipper-inspector/releases/tag/v1.0.9)

Happy debugging! 🚀

