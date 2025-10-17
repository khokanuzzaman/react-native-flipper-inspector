import React from 'react';
import { useStore } from '../store';
import { InspectorMessage } from '../types';
import { formatTimestamp, truncateText, getStatusColor, getMethodColor } from '../utils';

export const MessageTable: React.FC = () => {
  const { filteredMessages, selectedMessage, setSelectedMessage } = useStore();

  const renderMessageCell = (message: InspectorMessage, key: string) => {
    switch (key) {
      case 'timestamp':
        return formatTimestamp(message.ts);
      
      case 'type':
        return (
          <span style={{
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '10px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            backgroundColor: getTypeColor(message.type),
            color: '#fff'
          }}>
            {message.type}
          </span>
        );
      
      case 'event':
        return getEventName(message);
      
      case 'data':
        return truncateText(JSON.stringify(message.data), 100);
      
      case 'tags':
        return message.tags ? truncateText(JSON.stringify(message.tags), 50) : '';
      
      default:
        return '';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'log': return '#1890ff';
      case 'error': return '#ff4d4f';
      case 'metric': return '#52c41a';
      case 'state': return '#722ed1';
      case 'trace': return '#fa8c16';
      case 'network': return '#13c2c2';
      default: return '#666';
    }
  };

  const getEventName = (message: InspectorMessage): string => {
    switch (message.type) {
      case 'log':
        return message.data.event || '';
      case 'error':
        return message.data.error || '';
      case 'metric':
        return message.data.name || '';
      case 'state':
        return `${message.data.section} (${message.data.action})`;
      case 'trace':
        return `${message.data.name} (${message.data.action})`;
      case 'network':
        return `${message.data.method} ${truncateText(message.data.url, 30)}`;
      default:
        return '';
    }
  };

  const handleRowClick = (message: InspectorMessage) => {
    setSelectedMessage(message === selectedMessage ? null : message);
  };

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e8e8e8' }}>
            <th style={{ padding: '8px', textAlign: 'left', borderRight: '1px solid #e8e8e8' }}>Time</th>
            <th style={{ padding: '8px', textAlign: 'left', borderRight: '1px solid #e8e8e8' }}>Type</th>
            <th style={{ padding: '8px', textAlign: 'left', borderRight: '1px solid #e8e8e8' }}>Event</th>
            <th style={{ padding: '8px', textAlign: 'left', borderRight: '1px solid #e8e8e8' }}>Data</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Tags</th>
          </tr>
        </thead>
        <tbody>
          {filteredMessages.map((message) => (
            <tr
              key={message.id}
              onClick={() => handleRowClick(message)}
              style={{
                cursor: 'pointer',
                backgroundColor: message === selectedMessage ? '#e6f7ff' : 'transparent',
                borderBottom: '1px solid #f0f0f0',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLTableRowElement>) => {
                if (message !== selectedMessage) {
                  e.currentTarget.style.backgroundColor = '#fafafa';
                }
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLTableRowElement>) => {
                if (message !== selectedMessage) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <td style={{ padding: '8px', borderRight: '1px solid #f0f0f0' }}>
                {renderMessageCell(message, 'timestamp')}
              </td>
              <td style={{ padding: '8px', borderRight: '1px solid #f0f0f0' }}>
                {renderMessageCell(message, 'type')}
              </td>
              <td style={{ padding: '8px', borderRight: '1px solid #f0f0f0' }}>
                {renderMessageCell(message, 'event')}
              </td>
              <td style={{ padding: '8px', borderRight: '1px solid #f0f0f0' }}>
                {renderMessageCell(message, 'data')}
              </td>
              <td style={{ padding: '8px' }}>
                {renderMessageCell(message, 'tags')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredMessages.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#999',
          fontSize: '14px'
        }}>
          No messages found
        </div>
      )}
    </div>
  );
};
