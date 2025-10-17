import { ReduxOptions } from '../types';
import { getInspector } from '../api';

interface ReduxStore {
  getState(): any;
  subscribe(listener: () => void): () => void;
  dispatch(action: any): any;
}

/**
 * Attach Redux store to inspector for state tracking
 */
export function attachRedux(store: ReduxStore, options: ReduxOptions = {}): () => void {
  const {
    whitelist = [],
    blacklist = [],
    serialize = (state: any) => state,
  } = options;

  let isAttached = true;
  let lastState: any = null;

  // Function to check if a key should be included
  const shouldIncludeKey = (key: string): boolean => {
    // Check blacklist first
    if (blacklist.length > 0 && blacklist.includes(key)) {
      return false;
    }

    // Check whitelist
    if (whitelist.length > 0) {
      return whitelist.includes(key);
    }

    // If no filters, include everything
    return true;
  };

  // Function to filter state based on whitelist/blacklist
  const filterState = (state: any): any => {
    if (typeof state !== 'object' || state === null) {
      return state;
    }

    if (Array.isArray(state)) {
      return state.map(filterState);
    }

    const filtered: any = {};
    for (const [key, value] of Object.entries(state)) {
      if (shouldIncludeKey(key)) {
        filtered[key] = filterState(value);
      }
    }

    return filtered;
  };

  // Function to detect state changes
  const detectChanges = (oldState: any, newState: any, path: string = ''): Record<string, any> => {
    const changes: Record<string, any> = {};

    if (oldState === newState) {
      return changes;
    }

    if (typeof oldState !== typeof newState) {
      changes[path || 'root'] = { old: oldState, new: newState };
      return changes;
    }

    if (typeof oldState !== 'object' || oldState === null || newState === null) {
      if (oldState !== newState) {
        changes[path || 'root'] = { old: oldState, new: newState };
      }
      return changes;
    }

    if (Array.isArray(oldState) && Array.isArray(newState)) {
      if (oldState.length !== newState.length) {
        changes[path || 'root'] = { old: oldState, new: newState };
        return changes;
      }

      for (let i = 0; i < oldState.length; i++) {
        const itemChanges = detectChanges(oldState[i], newState[i], `${path}[${i}]`);
        Object.assign(changes, itemChanges);
      }
      return changes;
    }

    // Handle objects
    const allKeys = new Set([...Object.keys(oldState), ...Object.keys(newState)]);
    
    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (!(key in oldState)) {
        changes[currentPath] = { added: newState[key] };
      } else if (!(key in newState)) {
        changes[currentPath] = { removed: oldState[key] };
      } else {
        const keyChanges = detectChanges(oldState[key], newState[key], currentPath);
        Object.assign(changes, keyChanges);
      }
    }

    return changes;
  };

  // Subscribe to store changes
  const unsubscribe = store.subscribe(() => {
    if (!isAttached) {
      return;
    }

    try {
      const currentState = store.getState();
      const serializedState = serialize(currentState);
      const filteredState = filterState(serializedState);

      // Detect changes
      const changes = detectChanges(lastState, filteredState);

      // Only send if there are meaningful changes
      if (Object.keys(changes).length > 0) {
        const inspector = getInspector();
        inspector['sendMessage']({
          type: 'state',
          ts: Date.now(),
          data: {
            section: 'redux',
            action: 'update',
            data: filteredState,
            changes,
          },
        });
      }

      lastState = filteredState;
    } catch (error) {
      // Silently handle errors to avoid breaking the app
      console.warn('Failed to track Redux state:', error);
    }
  });

  // Send initial state
  try {
    const initialState = store.getState();
    const serializedState = serialize(initialState);
    const filteredState = filterState(serializedState);

    const inspector = getInspector();
    inspector['sendMessage']({
      type: 'state',
      ts: Date.now(),
      data: {
        section: 'redux',
        action: 'update',
        data: filteredState,
        initial: true,
      },
    });

    lastState = filteredState;
  } catch (error) {
    console.warn('Failed to send initial Redux state:', error);
  }

  // Return unattach function
  return () => {
    isAttached = false;
    unsubscribe();
  };
}

/**
 * Create a Redux middleware for action tracking
 */
export function createReduxMiddleware(options: ReduxOptions = {}): any {
  return (store: ReduxStore) => (next: any) => (action: any) => {
    const result = next(action);

    try {
      const inspector = getInspector();
      inspector['sendMessage']({
        type: 'log',
        ts: Date.now(),
        data: {
          event: 'redux_action',
          payload: {
            type: action.type,
            payload: action.payload,
            meta: action.meta,
          },
        },
      });
    } catch (error) {
      // Silently handle errors
      console.warn('Failed to track Redux action:', error);
    }

    return result;
  };
}
