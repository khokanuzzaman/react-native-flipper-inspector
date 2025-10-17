import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

export default function DebugOverlayTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  const makeApiCall = async (url: string, method: string = 'GET') => {
    setIsLoading(true);
    try {
      console.log(`Making API call: ${method} ${url}`);
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'React-Native-Inspector-Test',
        },
      });
      
      const data = await response.json();
      console.log('API call successful:', response.status, data);
      Alert.alert('Success', `API call completed with status: ${response.status}`);
    } catch (error) {
      console.log('API call failed:', error);
      Alert.alert('Error', `API call failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testOverlayImport = () => {
    try {
      // Try to import the overlay component
      const { ReactNativeInspectorOverlay } = require('react-native-flipper-inspector');
      console.log('Overlay component imported successfully:', ReactNativeInspectorOverlay);
      Alert.alert('Success', 'Overlay component imported successfully!');
    } catch (error) {
      console.log('Failed to import overlay component:', error);
      Alert.alert('Error', `Failed to import overlay: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>🔍 Debug Overlay Test</Text>
        <Text style={styles.subtitle}>Testing React Native Inspector Overlay</Text>
        
        <View style={styles.debugSection}>
          <Text style={styles.sectionTitle}>Debug Actions</Text>
          
          <TouchableOpacity
            style={[styles.button, styles.debugButton]}
            onPress={testOverlayImport}
          >
            <Text style={styles.buttonText}>🔧 Test Overlay Import</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.debugButton]}
            onPress={() => {
              console.log('Toggle overlay visibility');
              setOverlayVisible(!overlayVisible);
            }}
          >
            <Text style={styles.buttonText}>
              {overlayVisible ? '👁️ Hide Overlay' : '👁️ Show Overlay'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test API Calls</Text>
          <Text style={styles.instructionText}>
            Make some API calls to test network monitoring.
            Check the console for logs.
          </Text>
          
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => makeApiCall('https://jsonplaceholder.typicode.com/users')}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : '📋 Get Users (GET)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.successButton]}
            onPress={() => makeApiCall('https://jsonplaceholder.typicode.com/posts/1')}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : '📄 Get Post (GET)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={() => makeApiCall('https://httpstat.us/404')}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : '❌ Test 404 Error'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <Text style={styles.statusText}>
            Overlay Visible: {overlayVisible ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.statusText}>
            Loading: {isLoading ? 'Yes' : 'No'}
          </Text>
        </View>
      </ScrollView>

      {/* Simple floating button for testing */}
      {overlayVisible && (
        <View style={styles.floatingButton}>
          <TouchableOpacity
            style={styles.floatingButtonInner}
            onPress={() => {
              console.log('Floating button pressed');
              Alert.alert('Floating Button', 'You tapped the floating button!');
            }}
          >
            <Text style={styles.floatingButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  debugSection: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  debugButton: {
    backgroundColor: '#6c757d',
  },
  primaryButton: {
    backgroundColor: '#007bff',
  },
  successButton: {
    backgroundColor: '#28a745',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
