/**
 * useFlipperInspector Hook
 * 
 * Super easy one-line setup for Flipper Inspector
 * Automatically initializes inspector, patches network, and sets up everything
 * 
 * Usage:
 * function App() {
 *   useFlipperInspector();
 *   return <YourApp />;
 * }
 */

import { useEffect } from 'react';
import { init, patchNetwork } from '../api';

/**
 * Hook to setup Flipper Inspector with one line of code
 * 
 * @returns void
 * 
 * @example
 * // Minimal setup - just call it!
 * useFlipperInspector();
 */
export function useFlipperInspector(): void {
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
}
