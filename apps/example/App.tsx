import React from 'react';
import { useFlipperInspector, ReactNativeInspectorOverlay, StoreProvider } from 'react-native-flipper-inspector';
import SimpleTest from './SimpleTest';

export default function App() {
  // ONE LINE SETUP! 🚀
  useFlipperInspector();

  return (
    <StoreProvider>
      <SimpleTest />
      <ReactNativeInspectorOverlay />
    </StoreProvider>
  );
}