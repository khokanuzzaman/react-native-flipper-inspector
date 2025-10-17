/**
 * Utility functions for the Flipper plugin
 */

import { InspectorMessage, AnyMessage } from '../types';

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }) + '.' + String(date.getMilliseconds()).padStart(3, '0');
}

/**
 * Format duration in milliseconds
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  
  const seconds = Math.floor(ms / 1000);
  const remainingMs = ms % 1000;
  
  if (seconds < 60) {
    return `${seconds}.${remainingMs.toString().padStart(3, '0')}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Get status color for network requests
 */
export function getStatusColor(status?: number): string {
  if (!status) return '#666';
  
  if (status >= 200 && status < 300) return '#4CAF50'; // Green
  if (status >= 300 && status < 400) return '#FF9800'; // Orange
  if (status >= 400 && status < 500) return '#F44336'; // Red
  if (status >= 500) return '#9C27B0'; // Purple
  
  return '#666';
}

/**
 * Get method color for HTTP methods
 */
export function getMethodColor(method: string): string {
  switch (method.toUpperCase()) {
    case 'GET': return '#4CAF50';
    case 'POST': return '#2196F3';
    case 'PUT': return '#FF9800';
    case 'DELETE': return '#F44336';
    case 'PATCH': return '#9C27B0';
    default: return '#666';
  }
}

/**
 * Safe JSON stringify with error handling
 */
export function safeStringify(obj: any, space?: number): string {
  try {
    return JSON.stringify(obj, null, space);
  } catch (error) {
    return `[Error stringifying: ${error instanceof Error ? error.message : 'Unknown error'}]`;
  }
}

/**
 * Parse JSON safely
 */
export function safeParse(json: string): any {
  try {
    return JSON.parse(json);
  } catch (error) {
    return { error: 'Parse Error', message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Export messages to CSV format
 */
export function exportToCSV(messages: AnyMessage[]): string {
  const headers = ['Timestamp', 'Type', 'Event/Name', 'Data', 'Tags'];
  const rows = messages.map(msg => [
    formatTimestamp(msg.ts),
    msg.type,
    getEventName(msg),
    safeStringify(msg.data),
    msg.tags ? safeStringify(msg.tags) : '',
  ]);

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

/**
 * Export messages to JSON format
 */
export function exportToJSON(messages: AnyMessage[]): string {
  return safeStringify(messages, 2);
}

/**
 * Get event name from message
 */
function getEventName(msg: AnyMessage): string {
  switch (msg.type) {
    case 'log':
      return msg.data.event || '';
    case 'error':
      return msg.data.error || '';
    case 'metric':
      return msg.data.name || '';
    case 'state':
      return `${msg.data.section} (${msg.data.action})`;
    case 'trace':
      return `${msg.data.name} (${msg.data.action})`;
    case 'network':
      return `${msg.data.method} ${msg.data.url}`;
    default:
      return '';
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}
