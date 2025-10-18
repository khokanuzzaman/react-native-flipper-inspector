# Documentation

Complete documentation for React Native Flipper Inspector.

## Getting Started

📖 **[Quick Start Guide](./quick-start.md)** - Get up and running in 5 minutes  
It's the fastest way to start using the inspector. One-line setup with hooks!

## Platform-Specific Setup

🤖 **[Android Setup](./android-setup.md)** - Complete Android guide  
Includes running on emulator/device, native features, and troubleshooting.

🍎 **[iOS Setup](./ios-setup.md)** - Complete iOS guide  
Includes Podfile setup, running on simulator/device, and troubleshooting.

## API & Configuration

📚 **[API Reference](./api-reference.md)** - Complete API documentation  
All functions, parameters, return types, and examples for every API.

⚙️ **[Configuration Guide](./configuration.md)** - Advanced configuration  
Batching, network patching, Redux integration, performance tuning, and more.

## Features & Integration

🔍 **[Network Monitoring](./network-monitoring.md)** - HTTP request/response capture  
Automatic fetch and XMLHttpRequest interception with privacy controls.

## Troubleshooting

🆘 **[Troubleshooting Guide](./troubleshooting.md)** - Common issues and solutions  
Device offline, Flipper not connecting, build errors, and more.

## Quick Reference

### Installation

```bash
npm install react-native-flipper-inspector
```

### Ultra-Simple Setup

```typescript
import { useFlipperInspector } from 'react-native-flipper-inspector';

export default function App() {
  useFlipperInspector();
  return <YourApp />;
}
```

### Core APIs

```typescript
// Logging
log('EventName', { data: 'value' });
error('ErrorName', errorObject);

// Metrics
metric('operation_time', 500, { operation: 'save' });

// State Management
state.update('user', { id: '123', name: 'John' });
state.remove('user');

// Network Monitoring
patchNetwork({ redactHeaders: ['authorization'] });

// Redux Integration
attachRedux(store, { whitelist: ['user'] });

// Tracing
const trace = trace.start('operation');
trace.end(trace);
```

## Documentation Structure

```
docs/
├── README.md                    (this file)
├── quick-start.md              Quick setup guide
├── api-reference.md            Complete API docs
├── configuration.md            Configuration options
├── ios-setup.md               iOS-specific guide
├── android-setup.md           Android-specific guide
├── network-monitoring.md       Network features
└── troubleshooting.md         Problem solving
```

## Platform Support Matrix

| Feature | Android | iOS |
|---------|---------|-----|
| Event Logging | ✅ | ✅ |
| Error Tracking | ✅ | ✅ |
| Metrics | ✅ | ✅ |
| State Management | ✅ | ✅ |
| Network Monitoring | ✅ | ✅ |
| Redux Integration | ✅ | ✅ |
| Tracing | ✅ | ✅ |
| Inspector Overlay | ✅ | ✅ |
| Floating Button | ✅ | ✅ |

## Common Tasks

### Monitor All API Calls

See [Network Monitoring](./network-monitoring.md)

```typescript
import { patchNetwork } from 'react-native-flipper-inspector';
patchNetwork();
```

### Track Redux Actions

See [Configuration Guide](./configuration.md#redux-integration)

```typescript
import { attachRedux } from 'react-native-flipper-inspector';
attachRedux(store, { whitelist: ['user', 'auth'] });
```

### Measure Performance

See [Configuration Guide](./configuration.md#performance-tracking)

```typescript
import { metric, trace } from 'react-native-flipper-inspector';
const t = trace.start('operation');
// ... code ...
trace.end(t);
metric('operation_time', Date.now() - start);
```

### Debug Errors

See [Configuration Guide](./configuration.md#error-handling)

```typescript
import { error, state } from 'react-native-flipper-inspector';
error('CriticalError', { context: 'UserLogin', error });
state.update('error', { type: 'CRITICAL', message: error.message });
```

## Need Help?

- 🐛 [GitHub Issues](https://github.com/khokanuzzman/react-native-flipper-inspector/issues)
- 💬 [GitHub Discussions](https://github.com/khokanuzzman/react-native-flipper-inspector/discussions)
- 📧 Email support available

## Version Info

- **Latest Version**: Check [npm](https://www.npmjs.com/package/react-native-flipper-inspector)
- **React Native**: 0.71+
- **Node**: 16+
- **iOS**: 12.0+
- **Android**: API 21+

## What's New?

See [CHANGELOG](../CHANGELOG.md) for latest updates.

## Contributing

Contributions are welcome! See [Contributing Guide](../CONTRIBUTING.md)

## License

MIT License - see [LICENSE](../LICENSE)
