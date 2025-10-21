import React from 'react';
import { useFlipperInspector, ReactNativeInspectorOverlay, StoreProvider } from 'react-native-flipper-inspector';
import AxiosTest from './AxiosTest';

export default function App() {
  // ONE LINE SETUP! 🚀
  useFlipperInspector();

  return (
    <StoreProvider>
      <AxiosTest />
      <ReactNativeInspectorOverlay />
    </StoreProvider>
  );
}