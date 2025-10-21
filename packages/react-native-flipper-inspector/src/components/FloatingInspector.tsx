import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
  Share,
  Alert,
  Clipboard,
  Platform,
} from 'react-native';
import { useStore } from './StoreProvider';

const { width, height } = Dimensions.get('window');

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

interface FloatingInspectorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: number;
  color?: string;
}

export const FloatingInspector: React.FC<FloatingInspectorProps> = ({
  position = 'bottom-right',
  size = 60,
  color = '#007bff',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);
  const [selectedCall, setSelectedCall] = useState<ApiCall | null>(null);

  const store = useStore();

  useEffect(() => {
    if (store) {
      // Update API calls when store state changes
      setApiCalls(store.state.apiCalls);
    }
  }, [store?.state.apiCalls]);

  const getPositionStyle = () => {
    const margin = 20;
    switch (position) {
      case 'top-right':
        return { top: margin + 50, right: margin };
      case 'top-left':
        return { top: margin + 50, left: margin };
      case 'bottom-right':
        return { bottom: margin + 100, right: margin };
      case 'bottom-left':
        return { bottom: margin + 100, left: margin };
      default:
        return { bottom: margin + 100, right: margin };
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setString(text);
      Alert.alert('Copied!', 'Content copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const generateCurl = (apiCall: ApiCall | null): string => {
    if (!apiCall) return 'curl';
    
    const method = apiCall.method || 'GET';
    let curl = `curl -X ${method}`;
    
    // Add headers
    if (apiCall.requestHeaders) {
      Object.entries(apiCall.requestHeaders).forEach(([key, value]) => {
        curl += ` \\\n  -H "${key}: ${value}"`;
      });
    }
    
    // Add body
    if (apiCall.requestBody && method !== 'GET') {
      curl += ` \\\n  -d '${apiCall.requestBody}'`;
    }
    
    curl += ` \\\n  "${apiCall.url || ''}"`;
    
    return curl;
  };

  const shareApiCall = async (apiCall: ApiCall) => {
    try {
      const curlCommand = generateCurl(apiCall);
      const shareContent = `API Call Details:
Method: ${apiCall.method}
URL: ${apiCall.url}
Status: ${apiCall.status || 'N/A'}
Duration: ${apiCall.duration}ms

Curl Command:
${curlCommand}

Response Body:
${apiCall.responseBody || 'N/A'}`;

      await Share.share({
        message: shareContent,
        title: 'API Call Details',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share API call details');
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getStatusColor = (status?: number) => {
    if (!status) return '#666';
    if (status >= 200 && status < 300) return '#28a745';
    if (status >= 400 && status < 500) return '#ffc107';
    if (status >= 500) return '#dc3545';
    return '#666';
  };

  const ApiCallDetail = ({ apiCall }: { apiCall: ApiCall | null }) => {
    if (!apiCall) return null;
    
    return (
      <Modal
        visible={!!selectedCall}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>API Call Details</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedCall(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Request</Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Method: </Text>
                {apiCall.method || 'GET'}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>URL: </Text>
                {apiCall.url || ''}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Time: </Text>
                {formatTimestamp(apiCall.timestamp || Date.now())}
              </Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Response</Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Status: </Text>
                <Text style={{ color: getStatusColor(apiCall.status) }}>
                  {apiCall.status || 'N/A'}
                </Text>
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Duration: </Text>
                {apiCall.duration || 0}ms
              </Text>
            </View>

            {apiCall && apiCall.responseBody && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Response Body</Text>
                <ScrollView style={styles.jsonContainer}>
                  <Text style={styles.jsonText}>{apiCall.responseBody}</Text>
                </ScrollView>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => copyToClipboard(apiCall.responseBody || '')}
                >
                  <Text style={styles.actionButtonText}>📋 Copy Response</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Actions</Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => copyToClipboard(generateCurl(apiCall))}
              >
                <Text style={styles.actionButtonText}>📋 Copy cURL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => shareApiCall(apiCall)}
              >
                <Text style={styles.actionButtonText}>📤 Share</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.floatingButton,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            ...getPositionStyle(),
          },
        ]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[styles.floatingButtonText, { fontSize: size * 0.3 }]}>
          🔍
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>🔍 API Inspector</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{apiCalls.length}</Text>
              <Text style={styles.statLabel}>Total Calls</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {apiCalls.filter(call => call && call.status && call.status >= 200 && call.status < 300).length}
              </Text>
              <Text style={styles.statLabel}>Success</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {apiCalls.filter(call => call && call.status && call.status >= 400).length}
              </Text>
              <Text style={styles.statLabel}>Errors</Text>
            </View>
          </View>

          <ScrollView style={styles.content}>
            {apiCalls.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No API calls detected yet.
                  {'\n'}Make some network requests to see them here!
                </Text>
              </View>
            ) : (
              apiCalls.map((call) => (
                <TouchableOpacity
                  key={call.id}
                  style={styles.apiCallItem}
                  onPress={() => setSelectedCall(call)}
                >
                  <View style={styles.apiCallHeader}>
                    <View style={styles.apiCallInfo}>
                      <Text style={styles.methodText}>{call?.method || 'GET'}</Text>
                      <Text style={styles.urlText} numberOfLines={1}>
                        {call?.url || ''}
                      </Text>
                    </View>
                    <View style={styles.apiCallMeta}>
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(call?.status) },
                        ]}
                      >
                        {call.status || 'Pending'}
                      </Text>
                      <Text style={styles.durationText}>{call?.duration || 0}ms</Text>
                    </View>
                  </View>
                  <Text style={styles.timestampText}>
                    {formatTimestamp(call?.timestamp || Date.now())}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>

      <ApiCallDetail apiCall={selectedCall} />
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 9999,
  },
  floatingButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#007bff',
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  apiCallItem: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  apiCallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  apiCallInfo: {
    flex: 1,
    marginRight: 12,
  },
  methodText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 4,
  },
  urlText: {
    fontSize: 12,
    color: '#333',
  },
  apiCallMeta: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#666',
  },
  timestampText: {
    fontSize: 10,
    color: '#999',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#007bff',
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  detailSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#666',
  },
  jsonContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 4,
    maxHeight: 200,
    marginBottom: 12,
  },
  jsonText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
