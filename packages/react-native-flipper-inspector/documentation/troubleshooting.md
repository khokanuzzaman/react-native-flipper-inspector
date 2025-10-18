# Troubleshooting

Common issues and solutions when using React Native Flipper Inspector.

## Plugin Not Detected

### Issue
The "RN Inspector" plugin doesn't appear in Flipper.

### Solutions

1. **Check Flipper Installation**
   ```bash
   # Ensure Flipper is installed and running
   # Download from: https://fbflipper.com/
   ```

2. **Verify App is in Debug Mode**
   ```typescript
   // Check if inspector is enabled
   import { isEnabled, isConnected } from 'react-native-flipper-inspector';
   
   console.log('Inspector enabled:', isEnabled());
   console.log('Inspector connected:', isConnected());
   ```

3. **Check React Native Flipper Integration**
   ```bash
   # Ensure react-native-flipper is installed
   npm install react-native-flipper
   
   # For iOS, ensure pods are installed
   cd ios && pod install && cd ..
   ```

4. **Restart Flipper**
   - Close Flipper completely
   - Restart your React Native app
   - Reopen Flipper

5. **Check Plugin Installation**
   ```bash
   # Verify the plugin is properly linked
   cd packages/flipper-plugin-rn-inspector
   pnpm build
   ```

## No Events Appearing

### Issue
The plugin appears but no events are showing up.

### Solutions

1. **Check Inspector Initialization**
   ```typescript
   import { init, isEnabled, isConnected } from 'react-native-flipper-inspector';
   
   // Ensure initialization
   init({
     enabled: true, // Explicitly enable
     batch: { intervalMs: 100 }, // Reduce batch interval for faster updates
   });
   
   console.log('Enabled:', isEnabled());
   console.log('Connected:', isConnected());
   ```

2. **Test Basic Logging**
   ```typescript
   import { log } from 'react-native-flipper-inspector';
   
   // Add this to test
   log('TestEvent', { timestamp: Date.now() });
   ```

3. **Check Production Mode**
   ```typescript
   // Inspector is disabled by default in production
   // Force enable if needed (not recommended for production)
   init({ enabled: true });
   ```

4. **Verify Message Batching**
   ```typescript
   import { flush } from 'react-native-flipper-inspector';
   
   // Force flush buffered messages
   flush();
   ```

## Network Monitoring Not Working

### Issue
Network requests are not being captured.

### Solutions

1. **Enable Network Monitoring**
   ```typescript
   import { patchNetwork } from 'react-native-flipper-inspector';
   
   // Enable network monitoring
   const unpatch = patchNetwork({
     enabled: true,
     redactHeaders: ['authorization'],
   });
   ```

2. **Check Network Patching**
   ```typescript
   import { isNetworkPatched } from 'react-native-flipper-inspector';
   
   console.log('Network patched:', isNetworkPatched());
   ```

3. **Test Network Requests**
   ```typescript
   // Make a test request
   fetch('https://jsonplaceholder.typicode.com/posts/1')
     .then(response => response.json())
     .then(data => console.log('Network test:', data));
   ```

4. **Check for Conflicts**
   ```typescript
   // Ensure no other network interceptors are conflicting
   // Check for other debugging tools or network libraries
   ```

## Redux Integration Issues

### Issue
Redux state changes are not being tracked.

### Solutions

1. **Verify Redux Store Attachment**
   ```typescript
   import { attachRedux } from 'react-native-flipper-inspector';
   
   const unattach = attachRedux(store, {
     whitelist: ['user', 'settings'], // Specify which reducers to track
     blacklist: ['sensitive'], // Exclude sensitive reducers
   });
   ```

2. **Check Redux Store Structure**
   ```typescript
   // Ensure your store has the expected methods
   console.log('Store methods:', {
     getState: typeof store.getState,
     subscribe: typeof store.subscribe,
     dispatch: typeof store.dispatch,
   });
   ```

3. **Use Redux Middleware**
   ```typescript
   import { createReduxMiddleware } from 'react-native-flipper-inspector';
   
   const middleware = createReduxMiddleware();
   const store = createStore(reducer, applyMiddleware(middleware));
   ```

## Performance Issues

### Issue
App performance is degraded after adding the inspector.

### Solutions

1. **Adjust Batching Settings**
   ```typescript
   init({
     batch: {
       intervalMs: 1000, // Increase interval
       maxItems: 100,    // Increase batch size
     },
   });
   ```

2. **Reduce Payload Size**
   ```typescript
   init({
     maxPayloadSize: 5000, // Reduce from default 10KB
   });
   ```

3. **Disable in Production**
   ```typescript
   init({
     enabled: __DEV__, // Only enable in development
   });
   ```

4. **Use Selective Logging**
   ```typescript
   // Only log important events
   if (__DEV__) {
     log('ImportantEvent', data);
   }
   ```

## Memory Issues

### Issue
App is consuming too much memory.

### Solutions

1. **Limit Message History**
   ```typescript
   // Clear old messages periodically
   import { destroy } from 'react-native-flipper-inspector';
   
   // Cleanup when needed
   destroy();
   ```

2. **Reduce Payload Size**
   ```typescript
   init({
     maxPayloadSize: 2048, // Reduce payload size
   });
   ```

3. **Enable Body Redaction**
   ```typescript
   patchNetwork({
     redactBody: true, // Don't capture request/response bodies
   });
   ```

## Build Issues

### Issue
Build failures or compilation errors.

### Solutions

1. **Check React Native Version**
   ```bash
   # Ensure compatible React Native version (0.71+)
   react-native --version
   ```

2. **Clean Build**
   ```bash
   # Clean and rebuild
   cd ios && pod install && cd ..
   cd android && ./gradlew clean && cd ..
   pnpm clean
   pnpm install
   pnpm build
   ```

3. **Check TypeScript Configuration**
   ```typescript
   // Ensure strict mode is enabled
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true
     }
   }
   ```

## Flipper Plugin Issues

### Issue
Flipper plugin is not working correctly.

### Solutions

1. **Rebuild Plugin**
   ```bash
   cd packages/flipper-plugin-rn-inspector
   pnpm build
   ```

2. **Check Plugin Registration**
   ```typescript
   // Ensure plugin is properly registered
   // Check Flipper logs for errors
   ```

3. **Update Flipper**
   ```bash
   # Ensure you're using a compatible Flipper version
   # Check package.json for flipper-plugin version
   ```

## Common Error Messages

### "Inspector not initialized"
```typescript
// Solution: Initialize the inspector
import { init } from 'react-native-flipper-inspector';
init();
```

### "Network patching failed"
```typescript
// Solution: Check for conflicts with other network libraries
// Ensure no other fetch/XMLHttpRequest patches are active
```

### "Redux store not found"
```typescript
// Solution: Ensure store is properly attached
const unattach = attachRedux(store, {});
```

### "Message too large"
```typescript
// Solution: Reduce payload size or increase limit
init({ maxPayloadSize: 20480 }); // Increase limit
// Or reduce data size
log('Event', { smallData: 'value' }); // Instead of large objects
```

## Debug Mode

Enable debug mode for more detailed logging:

```typescript
import { init } from 'react-native-flipper-inspector';

init({
  enabled: true,
  tags: { debug: 'true' },
});

// Add debug logging
console.log('Inspector debug info:', {
  enabled: isEnabled(),
  connected: isConnected(),
  networkPatched: isNetworkPatched(),
});
```

## Getting Help

If you're still experiencing issues:

1. **Check the Example App**: Run the example app to verify everything works
2. **Enable Debug Logging**: Add console.log statements to track execution
3. **Check Flipper Logs**: Look for errors in Flipper's console
4. **Create an Issue**: Report bugs with reproduction steps
5. **Join Discussions**: Ask questions in GitHub discussions

## Performance Monitoring

Monitor the inspector's impact on your app:

```typescript
import { metric } from 'react-native-flipper-inspector';

// Monitor inspector overhead
const startTime = Date.now();
// ... your code ...
metric('inspector_overhead', Date.now() - startTime);
```

## Best Practices for Troubleshooting

1. **Start Simple**: Begin with basic logging before adding complex features
2. **Test Incrementally**: Add one feature at a time
3. **Use the Example App**: Reference the example app for working code
4. **Check Logs**: Always check console logs and Flipper logs
5. **Verify Environment**: Ensure you're in debug mode with Flipper running
