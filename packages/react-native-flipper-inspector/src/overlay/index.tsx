import React, { useEffect } from 'react';
import { FloatingInspector } from '../components/FloatingInspector';
import { StoreProvider } from '../components/StoreProvider';
import { startNetworkInterception, stopNetworkInterception } from '../core/networkInterceptor';

interface ReactNativeInspectorOverlayProps {
  enabled?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: number;
  color?: string;
}

/**
 * React Native Flipper Inspector Overlay Component
 * 
 * This component provides a floating action button that shows an API monitoring screen.
 * Features:
 * - Real-time API call monitoring
 * - Response copying
 * - cURL generation
 * - Sharing capabilities
 * - Network request/response details
 */
export const ReactNativeInspectorOverlay: React.FC<ReactNativeInspectorOverlayProps> = ({
  enabled = true,
  position = 'bottom-right',
  size = 60,
  color = '#007bff',
}) => {
  if (!enabled) {
    return null;
  }

  return (
    <StoreProvider enabled={enabled}>
      <FloatingInspector
        position={position}
        size={size}
        color={color}
      />
    </StoreProvider>
  );
};

/**
 * Hook to manually control the inspector
 */
export function useInspector() {
  useEffect(() => {
    startNetworkInterception();
    return () => stopNetworkInterception();
  }, []);

  return {
    startMonitoring: startNetworkInterception,
    stopMonitoring: stopNetworkInterception,
  };
}

export default ReactNativeInspectorOverlay;
