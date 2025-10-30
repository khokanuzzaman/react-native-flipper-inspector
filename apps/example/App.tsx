import React, { useEffect } from 'react';
import { ReactNativeInspectorOverlay, init, patchNetwork } from 'react-native-flipper-inspector';
import AppModern from './src/AppModern';

const App = (): React.JSX.Element => {
  useEffect(() => {
    init({ enabled: __DEV__ });
    patchNetwork({ enabled: true });
  }, []);

  return (
    <>
      <AppModern />
      <ReactNativeInspectorOverlay position="bottom-right" size={60} />
    </>
  );
};

export default App;
