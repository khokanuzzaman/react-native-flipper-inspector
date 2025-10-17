import { Transport, InspectorMessage } from '../types';

/**
 * No-op transport that discards all messages
 * Used when Flipper is not available or in production
 */
export class NoopTransport implements Transport {
  send(_message: InspectorMessage): void {
    // Intentionally empty - no-op
  }

  isConnected(): boolean {
    return false;
  }
}

/**
 * Flipper transport that sends messages to the Flipper desktop app
 */
export class FlipperTransport implements Transport {
  private flipperClient: any;
  private connected: boolean = false;

  constructor() {
    this.initializeFlipper();
  }

  private async initializeFlipper(): Promise<void> {
    try {
      // Dynamic import to avoid bundling react-native-flipper when not available
      const FlipperClient = await import('react-native-flipper').then(
        (module) => module.default || module
      );

      this.flipperClient = new (FlipperClient as any)('react-native-flipper-inspector');
      
      this.flipperClient.addPlugin({
        getId() {
          return 'react-native-flipper-inspector';
        },
        onConnect() {
          this.connected = true;
        },
        onDisconnect() {
          this.connected = false;
        },
        runInBackground() {
          return true;
        },
      });

      // Handle connection state
      this.flipperClient.on('connected', () => {
        this.connected = true;
      });

      this.flipperClient.on('disconnected', () => {
        this.connected = false;
      });

    } catch (error) {
      // Flipper not available, stay disconnected
      this.connected = false;
    }
  }

  send(message: InspectorMessage): void {
    if (!this.connected || !this.flipperClient) {
      return;
    }

    try {
      this.flipperClient.send('react-native-flipper-inspector', message);
    } catch (error) {
      // Silently handle transport errors
      console.warn('Flipper transport error:', error);
    }
  }

  isConnected(): boolean {
    return this.connected && !!this.flipperClient;
  }
}

/**
 * Creates the appropriate transport based on environment
 */
export function createTransport(): Transport {
  // Check if we're in a React Native environment with Flipper available
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    try {
      // Try to create Flipper transport
      return new FlipperTransport();
    } catch (error) {
      // Fall back to no-op if Flipper is not available
      return new NoopTransport();
    }
  }

  // Production or no Flipper available
  return new NoopTransport();
}

// Export Transport interface
export type { Transport };
