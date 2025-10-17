import React from 'react';
import { useStore } from '../store';
import { safeStringify } from '../utils';

export const MessageDetail: React.FC = () => {
  const { selectedMessage } = useStore();

  if (!selectedMessage) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#999',
        fontSize: '14px'
      }}>
        Select a message to view details
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>
        Message Details
      </h3>
      
      <div style={{ marginBottom: '16px' }}>
        <strong>Type:</strong> {selectedMessage.type}
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <strong>Timestamp:</strong> {new Date(selectedMessage.ts).toLocaleString()}
      </div>
      
      {selectedMessage.id && (
        <div style={{ marginBottom: '16px' }}>
          <strong>ID:</strong> {selectedMessage.id}
        </div>
      )}
      
      {selectedMessage.tags && Object.keys(selectedMessage.tags).length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <strong>Tags:</strong>
          <pre style={{
            backgroundColor: '#f5f5f5',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            margin: '8px 0 0 0',
            overflow: 'auto'
          }}>
            {safeStringify(selectedMessage.tags, 2)}
          </pre>
        </div>
      )}
      
      <div>
        <strong>Data:</strong>
        <pre style={{
          backgroundColor: '#f5f5f5',
          padding: '12px',
          borderRadius: '4px',
          fontSize: '12px',
          margin: '8px 0 0 0',
          overflow: 'auto',
          maxHeight: '400px'
        }}>
          {safeStringify(selectedMessage.data, 2)}
        </pre>
      </div>
    </div>
  );
};
