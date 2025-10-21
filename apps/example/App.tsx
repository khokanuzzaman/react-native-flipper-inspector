import React from 'react';
import { useFlipperInspector, ReactNativeInspectorOverlay, StoreProvider } from 'react-native-flipper-inspector';
import NetworkTest from './NetworkTest';

export default function App() {
  // ONE LINE SETUP! 🚀
  useFlipperInspector();

  return (
    <StoreProvider>
      <NetworkTest />
      <ReactNativeInspectorOverlay />
    </StoreProvider>
  );
}