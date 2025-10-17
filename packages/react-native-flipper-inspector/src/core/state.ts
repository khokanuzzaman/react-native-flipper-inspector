import { StateManager, InspectorMessage } from '../types';
import { safeStringify } from './serializer';

/**
 * State manager for tracking application state across sections
 */
export class InspectorStateManager implements StateManager {
  private state: Record<string, any> = {};
  private sendMessage: (message: InspectorMessage) => void;

  constructor(sendMessage: (message: InspectorMessage) => void) {
    this.sendMessage = sendMessage;
  }

  /**
   * Update state for a specific section
   */
  update(section: string, data: Record<string, any>): void {
    // Merge with existing state
    this.state[section] = {
      ...this.state[section],
      ...data,
    };

    // Send state update message
    this.sendMessage({
      type: 'state',
      ts: Date.now(),
      data: {
        section,
        action: 'update',
        data: this.state[section],
      },
    });
  }

  /**
   * Remove keys from a section or remove the entire section
   */
  remove(section: string, keys?: string[]): void {
    if (!keys || keys.length === 0) {
      // Remove entire section
      delete this.state[section];
    } else {
      // Remove specific keys
      if (this.state[section]) {
        for (const key of keys) {
          delete this.state[section][key];
        }
      }
    }

    // Send state removal message
    this.sendMessage({
      type: 'state',
      ts: Date.now(),
      data: {
        section,
        action: 'remove',
        keys,
      },
    });
  }

  /**
   * Get the current state
   */
  getState(): Record<string, any> {
    return { ...this.state };
  }

  /**
   * Get state for a specific section
   */
  getSection(section: string): any {
    return this.state[section] ? { ...this.state[section] } : undefined;
  }

  /**
   * Clear all state
   */
  clear(): void {
    this.state = {};
  }

  /**
   * Get state size in bytes (approximate)
   */
  getSize(): number {
    return safeStringify(this.state).length;
  }
}
