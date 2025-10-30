# React Native Flipper Inspector – Example App

This project is a fresh React Native 0.82.1 app that demonstrates the floating inspector overlay shipped with `react-native-flipper-inspector`.

## 🚀 Quick Start

```bash
cd apps/example
npm install
npm run android   # or: npm run ios
```

Once the app launches you will see the modern demo screen plus the draggable 🔍 button rendered by `<ReactNativeInspectorOverlay />`. Tap the button to open the inspector; long-press + drag to reposition it.

## 🧪 Demo actions

| Button | Scenario |
| --- | --- |
| Single API Call | Fetches one JSONPlaceholder post |
| Batch Requests | Fires three requests in parallel |
| Error Scenario | Calls an endpoint that returns HTTP 500 |
| Slow Response | Adds a 2s delay to highlight timing |
| Show Success Toast | Quick confirmation dialog |

Each action writes to the on-screen log and to the inspector overlay so you can try filtering, searching, exporting, and viewing details.

## 🛠 Implementation notes

- `App.tsx` calls `useFlipperInspector()` and renders `<ReactNativeInspectorOverlay />`
- The UI lives in `src/AppModern.tsx`
- The example consumes the local package via `"react-native-flipper-inspector": "file:../../packages/react-native-flipper-inspector"`

## 📦 Useful scripts

```bash
npm start          # start Metro
npm run android    # build & run on Android
npm run ios        # build & run on iOS
npm run lint       # lint source files
npm test           # run Jest tests
```

Need a clean native build? Run `cd android && ./gradlew clean` or `cd ios && xcodebuild clean` inside this folder.

Enjoy debugging with the floating inspector! 🔍
