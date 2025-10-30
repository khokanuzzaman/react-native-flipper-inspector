import React from 'react';
import { Text, View } from 'react-native';
import type { ApiCall } from './types';

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const formatTimestamp = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString();

export const getStatusColor = (status?: number) => {
  if (!status) return '#6c757d';
  if (status >= 200 && status < 300) return '#1eae55';
  if (status >= 400 && status < 500) return '#f7af1d';
  if (status >= 500) return '#e14c4c';
  return '#6c757d';
};

export const tryFormatJson = (value?: string): string => {
  if (!value) {
    return '';
  }

  try {
    const parsed = JSON.parse(value);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return value;
  }
};

export const createCurlCommand = (call: ApiCall | null): string => {
  if (!call) {
    return '';
  }

  let curl = `curl -X ${call.method || 'GET'} "${call.url ?? ''}"`;

  Object.entries(call.requestHeaders ?? {}).forEach(([key, value]) => {
    curl += ` \\\n  -H "${key}: ${value}"`;
  });

  if (call.requestBody) {
    curl += ` \\\n  --data '${call.requestBody}'`;
  }

  return curl;
};

export const renderHeaders = (headers?: Record<string, string>, styles?: any) => {
  if (!headers || Object.keys(headers).length === 0) {
    return (
      <Text style={styles?.metaTextMuted}>
        No headers captured for this request.
      </Text>
    );
  }

  return Object.entries(headers).map(([key, value]) => (
    <View key={key} style={styles?.headerRow}>
      <Text style={styles?.headerKey}>{key}</Text>
      <Text style={styles?.headerValue}>{value}</Text>
    </View>
  ));
};

export const renderJsonWithHighlight = (value?: string, styles?: any) => {
  const formatted = tryFormatJson(value);
  const tokens =
    formatted.match(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|\b-?\d+\.?\d*\b|[\{\}\[\],])/g
    ) ?? [];

  if (tokens.length === 0) {
    return <Text style={styles?.jsonPlainText}>{formatted}</Text>;
  }

  return (
    <Text style={styles?.jsonPlainText}>
      {tokens.map((token, index) => {
        const color =
          /^"/.test(token) && /:$/.test(token)
            ? '#569CD6'
            : /^"/.test(token)
            ? '#9CDCFE'
            : /\btrue\b|\bfalse\b/.test(token)
            ? '#C586C0'
            : /\bnull\b/.test(token)
            ? '#C586C0'
            : /-?\d+\.?\d*/.test(token)
            ? '#B5CEA8'
            : '#D4D4D4';

        return (
          <Text key={`${token}-${index}`} style={{ color }}>
            {token}
          </Text>
        );
      })}
    </Text>
  );
};
