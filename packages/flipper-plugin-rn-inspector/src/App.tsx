import React, { useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { MessageTable } from './components/MessageTable';
import { MessageDetail } from './components/MessageDetail';
import { useStore } from './store';
import { InspectorMessage } from './types';

export const App: React.FC = () => {
  const { addMessage } = useStore();

  // Simulate receiving messages from the React Native app
  useEffect(() => {
    // This would normally receive messages from Flipper
    // For now, we'll add some sample messages
    const sampleMessages: InspectorMessage[] = [
      {
        id: '1',
        type: 'log',
        ts: Date.now() - 5000,
        data: {
          event: 'AppStarted',
          payload: { version: '1.0.0' }
        },
        tags: { app: 'Demo' }
      },
      {
        id: '2',
        type: 'metric',
        ts: Date.now() - 4000,
        data: {
          name: 'api_response_time',
          value: 250
        },
        tags: { endpoint: '/users' }
      },
      {
        id: '3',
        type: 'error',
        ts: Date.now() - 3000,
        data: {
          error: 'Network timeout',
          stack: 'Error: Network timeout\n    at fetch (index.js:123:45)'
        }
      },
      {
        id: '4',
        type: 'state',
        ts: Date.now() - 2000,
        data: {
          section: 'user',
          action: 'update',
          data: { id: '123', name: 'John Doe' }
        }
      },
      {
        id: '5',
        type: 'network',
        ts: Date.now() - 1000,
        data: {
          method: 'GET',
          url: 'https://api.example.com/users',
          status: 200,
          duration: 150,
          requestSize: 0,
          responseSize: 1024
        }
      }
    ];

    // Add sample messages with delay
    sampleMessages.forEach((msg, index) => {
      setTimeout(() => {
        addMessage(msg);
      }, index * 1000);
    });
  }, [addMessage]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Toolbar */}
      <Toolbar />
      
      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Message Table */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <MessageTable />
        </div>
        
        {/* Message Detail Panel */}
        <div style={{
          width: '400px',
          borderLeft: '1px solid #e8e8e8',
          backgroundColor: '#fafafa',
          overflow: 'auto'
        }}>
          <MessageDetail />
        </div>
      </div>
    </div>
  );
};
