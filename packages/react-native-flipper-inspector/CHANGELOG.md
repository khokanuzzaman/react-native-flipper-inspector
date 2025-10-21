# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.14] - 2024-10-21

### Added
- 🎯 **PROPER FIX: Unified Interceptor Registry**
  - Created shared `interceptorRegistry` singleton
  - Both Flipper and Overlay now coordinate through registry
  - Network methods patched only ONCE, multiple listeners supported
  - NO conflicts, NO infinite recursion, NO limitations!

### Fixed
- ✅ **Complete Axios/XHR support restored in overlay**
  - Axios requests now appear in overlay ✅
  - XHR requests now appear in overlay ✅
  - Fetch requests still work ✅
  - No stack overflow ✅
  - Works alongside Flipper integration ✅

### Technical Details
- Created `src/core/interceptorRegistry.ts` - Unified interceptor system
- Registry stores truly original methods before any patching
- Multiple systems can register callbacks without conflicts
- Each system gets unregister function for cleanup
- Single patch point, multiple listeners architecture

### Result
- 🎉 **100% feature complete**
- 🎉 **No limitations**
- 🎉 **Proper architecture**
- 🎉 **Production ready**

## [1.0.13] - 2024-10-21

### Fixed
- 🐛 **CRITICAL: Maximum call stack size exceeded**
  - Fixed infinite recursion caused by conflicting XHR patches
  - Temporarily disabled XHR patching in overlay to prevent conflicts with Flipper integration
  - Added global patch guard to prevent double-patching
  - Added extensive console logging for debugging

### Changed
- ⚠️ **Overlay now only intercepts Fetch requests**
  - XHR/Axios interception temporarily disabled in overlay due to conflict
  - For Axios/XHR monitoring, use Flipper desktop client or `useFlipperInspector()` hook
  - This prevents the stack overflow but limits overlay functionality

### Technical Details
- Root cause: Both `patchNetwork()` (Flipper) and `networkInterceptor` (overlay) were patching XHR
- When overlay patched XHR, it stored already-patched methods as "originals"
- This created infinite recursion: patched → patched → patched → stack overflow
- Solution: Disabled XHR patching in overlay until proper coordination is implemented

### Note
- v1.0.12 XHR support is rolled back temporarily
- Full fix requires refactoring to coordinate between Flipper and overlay patching
- Or using only overlay without Flipper integration

## [1.0.12] - 2024-10-21

### Added
- 🎯 **XMLHttpRequest/Axios Support in Overlay**
  - Overlay now intercepts XMLHttpRequest in addition to fetch
  - Full support for Axios and any XHR-based HTTP libraries
  - Consistent network monitoring across all HTTP methods
  - Request/response capturing for XHR with headers and body

### Fixed
- 🔧 **Android Gradle Build Issue**
  - Fixed "Could not get unknown property 'release' for SoftwareComponent" error
  - Added safe component resolution in build.gradle for better compatibility
  - Improved support for different Android Gradle Plugin versions
  - Now checks for available components before publishing configuration

### Technical Details
- Updated `networkInterceptor.ts` to patch both fetch and XMLHttpRequest
- Added XHR lifecycle event listeners (load, error, timeout)
- Proper request/response body and header extraction for XHR
- Mirrors the comprehensive network patching from Flipper integration
- Updated Android library publishing configuration
- Added conditional component selection (release or java)
- Ensures compatibility across different AGP versions and build configurations

### Breaking Changes
None - this is a backward-compatible enhancement

## [1.0.0] - 2024-01-15

### Added
- 🎯 **Core Debugging APIs**
  - Structured logging with levels and tags
  - Comprehensive error tracking and reporting
  - Custom metrics with timing and counters
  - Key-value state management
  - Performance tracing with start/end markers

- 🔍 **Professional API Inspector Overlay**
  - Floating button with always-accessible monitoring interface
  - Modern UI with gradient backgrounds and professional card layouts
  - Real-time search through API calls, headers, and responses
  - Beautiful JSON syntax highlighting with dark theme
  - Comprehensive copy features (cURL, endpoints, headers, raw data)
  - Long press copy functionality for direct text copying

- 🚀 **Advanced Features**
  - Sticky search state that persists across different API calls
  - Match navigation with Previous/Next buttons for search results
  - Automatic network monitoring for fetch and XMLHttpRequest
  - Built-in Redux store monitoring and integration
  - Optional message batching for performance optimization
  - Production-safe with automatic no-op in production builds

- 📦 **Developer Experience**
  - Full TypeScript support with strict mode
  - Comprehensive test coverage
  - ESLint and Prettier configuration
  - Monorepo structure with pnpm workspaces
  - Build system with tsup for ESM/CJS outputs

### Features

#### Core APIs
- `log(message, data?, tags?)` - Structured logging
- `error(message, error?, tags?)` - Error tracking
- `metric(name, value, tags?)` - Custom metrics
- `state.update(key, value)` - State management
- `state.remove(key)` - State cleanup
- `trace.start(name)` - Performance tracing
- `trace.end(id, data?)` - End tracing

#### Overlay Components
- `<ReactNativeInspectorOverlay />` - Main overlay component
- `<StoreProvider>` - Context provider for state management

#### Network Integration
- `patchNetwork()` - Automatic fetch/XMLHttpRequest interception
- `attachRedux(store, options?)` - Redux store monitoring

#### Visual Features
- **JSON Syntax Highlighting**:
  - Keys: Gold (#FFD700)
  - Strings: Spring Green (#00FF7F)
  - Numbers: Deep Sky Blue (#00BFFF)
  - Booleans: Orange (#FFA500)
  - Null: Hot Pink (#FF69B4)
  - Structure: Medium Purple (#9370DB)

- **Copy Features**:
  - cURL command generation
  - Endpoint copying
  - Request/response body copying
  - Header copying
  - Raw data export

- **Search & Navigation**:
  - Real-time search filtering
  - Sticky search state
  - Match highlighting (orange for current, yellow for others)
  - Previous/Next navigation buttons

### Technical Details
- **Platform Support**: React Native 0.71+, Android API 21+, iOS 11+
- **Build System**: tsup with ESM/CJS outputs and TypeScript declarations
- **Testing**: Vitest with comprehensive test coverage
- **Linting**: ESLint with TypeScript support
- **Bundle Size**: Optimized for production use
- **Performance**: Optional batching and production-safe no-op

### Breaking Changes
- None (initial release)

### Migration Guide
- N/A (initial release)

---

## [1.0.11] - 2025-10-21

### Fixed
- 🐛 **Null Safety**: Added null checks for apiCall properties in FloatingInspector
- 🔒 **TypeError Fix**: Resolved "Cannot read property 'method' of null" error
- ✅ **Safe Access**: All apiCall properties now safely accessed with optional chaining
- 🛡️ **Defensive Code**: Added fallback values for all potentially null properties

### Changed
- ✅ Improved error handling in UI components
- ✅ Better null safety throughout the codebase
- ✅ More robust API call display

---

## [1.0.10] - 2025-10-21

### Fixed
- 🔧 **Android Namespace**: Added namespace declaration for Android Gradle Plugin 8.0+ compatibility
- 📦 **Build Compatibility**: Updated to compileSdk 36 and targetSdk 36 for latest Android support
- 🚀 **Gradle 8.0+**: Fixed build issues with newer Android Gradle Plugin versions
- 🔄 **Modern Gradle API**: Updated from deprecated `compileSdkVersion` to `compileSdk`

### Changed
- ✅ Full support for Android SDK 36 (Android 15)
- ✅ Compatible with Android Gradle Plugin 8.0+
- ✅ Proper namespace declaration in build.gradle
- ✅ Updated to modern Gradle DSL syntax (compileSdk, minSdk, targetSdk)
- ✅ Backward compatible with older projects

---

## [1.0.9] - 2025-10-21

### Fixed
- 🔧 **Android Namespace**: Added namespace declaration for Android Gradle Plugin 8.0+ compatibility
- 📦 **Build Compatibility**: Updated to compileSdk 36 and targetSdk 36 for latest Android support
- 🚀 **Gradle 8.0+**: Fixed build issues with newer Android Gradle Plugin versions
- 🔄 **Modern Gradle API**: Updated from deprecated `compileSdkVersion` to `compileSdk`

### Changed
- ✅ Full support for Android SDK 36 (Android 15)
- ✅ Compatible with Android Gradle Plugin 8.0+
- ✅ Proper namespace declaration in build.gradle
- ✅ Updated to modern Gradle DSL syntax (compileSdk, minSdk, targetSdk)
- ✅ Backward compatible with older projects

---

## [1.0.8] - 2025-10-21

### Fixed
- 🐛 **Critical Bug Fix**: Resolved "cannot read property 'method' of undefined" error
  - Fixed variable naming conflict in minified code that caused crashes in older React Native projects
  - Changed variable name from `method` to `httpMethod` to avoid minification conflicts
  - Updated global references from `global` to `globalThis` for better compatibility
  - Added proper TypeScript type declarations for global scope
  - Improved network interception reliability across different React Native versions
  
### Changed
- 🔧 **Improved Compatibility**: Enhanced compatibility with older React Native projects
- 📦 **Better Minification**: More robust code minification that avoids naming conflicts
- 🛡️ **Type Safety**: Enhanced TypeScript types for global scope handling

### Technical Details
- Files modified:
  - `src/integrations/network.ts`
  - `src/core/networkInterceptor.ts`
  - `src/types/index.ts`
- All tests passing
- No breaking changes

---

## [Unreleased]

### Planned for Version 2.0
- 🔧 **Request Builder**: Postman-style API request builder
- 🔐 **Authentication**: Bearer tokens, Basic auth, API keys
- 📁 **Collections**: Request collections and environment variables
- 🔗 **Request Chaining**: Use response data in subsequent requests
- 📊 **Analytics**: Request/response analytics and performance metrics
- 🌍 **iOS Support**: Full iOS platform support
- 📤 **Export Formats**: Additional export formats (XML, CSV, HAR)
- 🎨 **Themes**: Customizable UI themes
- 🔍 **Advanced Filtering**: Filter by status codes, methods, time ranges

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development
- Fork the repository
- Create a feature branch
- Make your changes
- Add tests
- Submit a pull request

### Reporting Issues
- Use GitHub Issues for bug reports
- Include reproduction steps
- Provide environment details
- Check existing issues first

---

## Support

- **Documentation**: [GitHub Wiki](https://github.com/react-native-flipper-inspector/react-native-flipper-inspector/wiki)
- **Issues**: [GitHub Issues](https://github.com/react-native-flipper-inspector/react-native-flipper-inspector/issues)
- **Discussions**: [GitHub Discussions](https://github.com/react-native-flipper-inspector/react-native-flipper-inspector/discussions)
