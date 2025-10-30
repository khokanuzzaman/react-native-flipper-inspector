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
  private connection: {
    send(method: string, data: any): void;
  } | null = null;
  private connected: boolean = false;

  constructor() {
    void this.initializeFlipper();
  }

  private async initializeFlipper(): Promise<void> {
    try {
      // Dynamic import to avoid bundling react-native-flipper when not available
      const module = await import('react-native-flipper');
      const addPlugin =
        (module as any)?.addPlugin ?? (module as any)?.default?.addPlugin;

      if (typeof addPlugin !== 'function') {
        this.connected = false;
        return;
      }

      addPlugin({
        getId() {
          return 'react-native-flipper-inspector';
        },
        onConnect: (connection: { send(method: string, data: any): void }) => {
          this.connection = connection;
          this.connected = true;
        },
        onDisconnect: () => {
          this.connected = false;
          this.connection = null;
        },
        runInBackground() {
          return true;
        },
      });
    } catch (error) {
      // Flipper not available, stay disconnected
      this.connected = false;
      this.connection = null;
    }
  }

  send(message: InspectorMessage): void {
    if (!this.connected || !this.connection) {
      return;
    }

    try {
      this.connection.send('message', message);
    } catch (error) {
      // Silently handle transport errors
      console.warn('Flipper transport error:', error);
    }
  }

  isConnected(): boolean {
    return this.connected && !!this.connection;
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
