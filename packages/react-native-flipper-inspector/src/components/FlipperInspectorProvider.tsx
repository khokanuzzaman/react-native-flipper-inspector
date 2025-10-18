/**
 * FlipperInspectorProvider Component
 * 
 * The EASIEST way to setup Flipper Inspector
 * Just wrap your app and you're done! ✨
 * 
 * Usage:
 * export default function App() {
 *   return (
 *     <FlipperInspectorProvider>
 *       <YourApp />
 *     </FlipperInspectorProvider>
 *   );
 * }
 */

import React, { useEffect } from 'react';
import { init, patchNetwork } from '../api';
import { StoreProvider } from './StoreProvider';
import { ReactNativeInspectorOverlay } from '../overlay';

interface FlipperInspectorProviderProps {
  children: React.ReactNode;
}

/**
 * Wrap your app with this component for automatic setup
 * No hooks, no additional components needed!
 * 
 * @example
 * export default function App() {
 *   return (
 *     <FlipperInspectorProvider>
 *       <YourAppContent />
 *     </FlipperInspectorProvider>
 *   );
 * }
 */
export function FlipperInspectorProvider({ 
  children 
}: FlipperInspectorProviderProps): JSX.Element {
  useEffect(() => {
    // Initialize inspector with smart defaults
    init({
      enabled: __DEV__, // Auto-disabled in production
      batch: {
        intervalMs: 1000,
        maxItems: 50,
      },
    });

    // Automatically patch network for API monitoring
    patchNetwork();
  }, []);

  return (
    <StoreProvider>
      {children}
      <ReactNativeInspectorOverlay />
    </StoreProvider>
  );
}
