# Testing v1.0.13 - Stack Overflow Fix

## 🐛 What Was Fixed

**CRITICAL BUG:** Maximum call stack size exceeded (infinite recursion)

**Cause:** Multiple instances of the interceptor were patching XHR multiple times, causing infinite loops.

**Fix:** Added global patch guard to prevent double-patching.

---

## 🧪 How to Test

### Option 1: Test in Your Project (Recommended)

1. **Link the local package:**
```bash
cd /Users/jotnosqh/Desktop/npm-packages/react-native-flipper-inspector/packages/react-native-flipper-inspector

# Create a link
npm link

# Go to your project
cd /path/to/your/project

# Link the package
npm link react-native-flipper-inspector

# Or install directly from the local folder
npm install /Users/jotnosqh/Desktop/npm-packages/react-native-flipper-inspector/packages/react-native-flipper-inspector
```

2. **Clean and rebuild your project:**
```bash
# Clear React Native cache
npx react-native start --reset-cache

# Clean Android build
cd android && ./gradlew clean && cd ..

# Rebuild
npx react-native run-android
```

3. **Watch the console for debug logs:**
You should see:
```
[NetworkInterceptor] Constructor - stored original methods
[NetworkInterceptor] Creating new interceptor instance
[NetworkInterceptor] Starting interception...
[NetworkInterceptor] Interception started successfully
```

4. **Make a request with Axios:**
```javascript
import axios from 'axios';

axios.get('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => console.log('Success:', response.data))
  .catch(error => console.error('Error:', error));
```

5. **Expected Results:**
- ✅ No "Maximum call stack size exceeded" error
- ✅ Request appears in the floating inspector
- ✅ App doesn't crash
- ✅ Console shows interceptor logs (not warnings)

---

### Option 2: Test in Example App

1. **Update the example app to use local package:**
```bash
cd /Users/jotnosqh/Desktop/npm-packages/react-native-flipper-inspector/apps/example

# The example already uses the local package via:
# "react-native-flipper-inspector": "file:../../packages/react-native-flipper-inspector"

# So just reinstall
npm install
```

2. **Clean and run:**
```bash
# Clean
cd android && ./gradlew clean && cd ..

# Start Metro
npm start -- --reset-cache

# In another terminal, run Android
npm run android
```

3. **Test the buttons:**
- Tap "Test Axios GET"
- Tap "Test Axios POST"
- Check if requests appear without crashes

---

## 🔍 What to Look For

### ✅ Success Indicators:

1. **Console Logs (Good Signs):**
```
[NetworkInterceptor] Constructor - stored original methods
[NetworkInterceptor] Creating new interceptor instance
[NetworkInterceptor] Starting interception...
[NetworkInterceptor] Interception started successfully
```

2. **No Warnings:**
Should NOT see:
```
[NetworkInterceptor] Already intercepting, skipping...
[NetworkInterceptor] Network interception already active globally
```
(Unless you're mounting/unmounting the overlay multiple times)

3. **Requests Captured:**
- Axios requests appear in overlay
- No crashes
- Response data visible

### ❌ Failure Indicators:

1. **Still Getting Stack Overflow:**
```
RangeError: Maximum call stack size exceeded
```
→ The fix didn't work, more investigation needed

2. **Requests Not Appearing:**
```
"No API calls detected yet"
```
→ Interception not working

3. **App Crashes on Request:**
→ Another issue introduced

---

## 🔬 Detailed Testing Steps

### Test 1: Single Request
```javascript
import axios from 'axios';

// Make one request
axios.get('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => {
    console.log('✅ Request succeeded');
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('❌ Request failed:', error.message);
  });
```

**Expected:**
- ✅ Request succeeds
- ✅ Appears in overlay
- ✅ No stack overflow

### Test 2: Multiple Concurrent Requests
```javascript
import axios from 'axios';

// Make multiple requests at once
Promise.all([
  axios.get('https://jsonplaceholder.typicode.com/posts/1'),
  axios.get('https://jsonplaceholder.typicode.com/posts/2'),
  axios.get('https://jsonplaceholder.typicode.com/posts/3'),
  axios.post('https://jsonplaceholder.typicode.com/posts', { title: 'Test' }),
])
  .then(results => {
    console.log('✅ All requests succeeded');
    console.log('Results:', results.length);
  })
  .catch(error => {
    console.error('❌ Requests failed:', error.message);
  });
```

**Expected:**
- ✅ All requests succeed
- ✅ All 4 requests appear in overlay
- ✅ No stack overflow

### Test 3: Rapid Fire Requests
```javascript
import axios from 'axios';

// Make 10 requests in rapid succession
for (let i = 1; i <= 10; i++) {
  axios.get(`https://jsonplaceholder.typicode.com/posts/${i}`)
    .then(response => console.log(`✅ Request ${i} done`))
    .catch(error => console.error(`❌ Request ${i} failed:`, error.message));
}
```

**Expected:**
- ✅ All 10 requests succeed
- ✅ All appear in overlay
- ✅ No stack overflow
- ✅ No memory issues

### Test 4: Overlay Mount/Unmount
```javascript
import React, { useState } from 'react';
import { Button } from 'react-native';
import { ReactNativeInspectorOverlay } from 'react-native-flipper-inspector';

function TestComponent() {
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <>
      <Button 
        title={showOverlay ? "Hide Overlay" : "Show Overlay"}
        onPress={() => setShowOverlay(!showOverlay)}
      />
      {showOverlay && <ReactNativeInspectorOverlay />}
    </>
  );
}
```

**Expected:**
- ✅ Can toggle overlay on/off
- ✅ Console shows warning on second mount (expected behavior)
- ✅ No stack overflow
- ✅ Requests still captured after remount

---

## 📊 Test Results Template

Copy this and fill it out:

```
## Test Results

**Date:** [Your date]
**Project:** [Your project name or "Example App"]
**React Native Version:** [e.g., 0.73.2]
**Android Version:** [e.g., SDK 36]

### Test 1: Single Request
- [ ] ✅ Request succeeded
- [ ] ✅ Appeared in overlay
- [ ] ✅ No stack overflow
- [ ] ❌ Failed (describe):

### Test 2: Multiple Concurrent Requests
- [ ] ✅ All requests succeeded
- [ ] ✅ All appeared in overlay
- [ ] ✅ No stack overflow
- [ ] ❌ Failed (describe):

### Test 3: Rapid Fire Requests
- [ ] ✅ All requests succeeded
- [ ] ✅ All appeared in overlay
- [ ] ✅ No performance issues
- [ ] ❌ Failed (describe):

### Test 4: Overlay Mount/Unmount
- [ ] ✅ Can toggle overlay
- [ ] ✅ Works after remount
- [ ] ✅ No stack overflow
- [ ] ❌ Failed (describe):

### Console Logs Observed:
```
[Paste console logs here]
```

### Stack Overflow?
- [ ] No (✅ FIX WORKS!)
- [ ] Yes (❌ still broken)

### Other Issues:
[Describe any other issues]
```

---

## 🚀 Quick Test Command

Run this in your project after linking:

```bash
# Clean everything
rm -rf node_modules package-lock.json
npm install
cd android && ./gradlew clean && cd ..

# Start fresh
npx react-native start --reset-cache &

# Wait 10 seconds, then run Android
sleep 10 && npx react-native run-android
```

Then make an Axios request and check if it works!

---

## 📝 If It Works

If the fix works:
1. ✅ Report back: "v1.0.13 fix works!"
2. ✅ Ready to publish to npm
3. ✅ Problem solved!

## 📝 If It Doesn't Work

If you still get stack overflow:
1. ❌ Share the full error
2. ❌ Share console logs
3. ❌ Share how you're initializing the overlay
4. ❌ We'll investigate deeper

---

## 🎯 Most Important Test

**The critical test is in YOUR project** where the error occurred:

```bash
# In your project
npm install /Users/jotnosqh/Desktop/npm-packages/react-native-flipper-inspector/packages/react-native-flipper-inspector

# Clean
rm -rf android/app/build
cd android && ./gradlew clean && cd ..

# Rebuild
npx react-native start --reset-cache
```

Then trigger the same Axios request that caused the stack overflow before.

**If it works now → FIX SUCCESS! ✅**
**If it still crashes → Need more investigation ❌**

