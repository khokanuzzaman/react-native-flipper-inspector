import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { setGlobalAddApiCall, startNetworkInterception, stopNetworkInterception } from '../core/networkInterceptor';

interface ApiCall {
  id: string;
  method: string;
  url: string;
  status?: number;
  duration: number;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: string;
  responseBody?: string;
  timestamp: number;
  error?: string;
}

interface AppState {
  apiCalls: ApiCall[];
  isEnabled: boolean;
}

type AppAction =
  | { type: 'ADD_API_CALL'; payload: ApiCall }
  | { type: 'CLEAR_API_CALLS' }
  | { type: 'SET_ENABLED'; payload: boolean };

const initialState: AppState = {
  apiCalls: [],
  isEnabled: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_API_CALL':
      return {
        ...state,
        apiCalls: [action.payload, ...state.apiCalls].slice(0, 100), // Keep last 100 calls
      };
    case 'CLEAR_API_CALLS':
      return {
        ...state,
        apiCalls: [],
      };
    case 'SET_ENABLED':
      return {
        ...state,
        isEnabled: action.payload,
      };
    default:
      return state;
  }
}

interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addApiCall: (apiCall: Omit<ApiCall, 'id' | 'timestamp'>) => void;
  clearApiCalls: () => void;
  setEnabled: (enabled: boolean) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

interface StoreProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children, enabled = true }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addApiCall = (apiCall: Omit<ApiCall, 'id' | 'timestamp'>) => {
    const newApiCall: ApiCall = {
      ...apiCall,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    dispatch({ type: 'ADD_API_CALL', payload: newApiCall });
  };

  const clearApiCalls = () => {
    dispatch({ type: 'CLEAR_API_CALLS' });
  };

  const setEnabled = (enabled: boolean) => {
    dispatch({ type: 'SET_ENABLED', payload: enabled });
  };

  // Set the global function for network interceptor and start interception
  useEffect(() => {
    console.log('[StoreProvider] Setting up network interception...');
    setGlobalAddApiCall(addApiCall);
    
    if (enabled) {
      console.log('[StoreProvider] Starting network interception...');
      startNetworkInterception();
    }

    return () => {
      if (enabled) {
        console.log('[StoreProvider] Stopping network interception...');
        stopNetworkInterception();
      }
    };
  }, [enabled]);

  const value: StoreContextType = {
    state,
    dispatch,
    addApiCall,
    clearApiCalls,
    setEnabled,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
