import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

// Import the overlay component
import { ReactNativeInspectorOverlay } from 'react-native-flipper-inspector';

export default function WorkingOverlayTest() {
  const [isLoading, setIsLoading] = useState(false);

  const makeApiCall = async (url: string, method: string = 'GET') => {
    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'React-Native-Inspector-Test',
        },
      });
      
      const data = await response.json();
      Alert.alert('Success', `API call completed with status: ${response.status}`);
    } catch (error) {
      Alert.alert('Error', `API call failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>🔍 React Native Inspector</Text>
        <Text style={styles.subtitle}>Portable API Monitoring Overlay</Text>
        
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            This app demonstrates the React Native Flipper Inspector overlay.
            Look for the floating 🔍 button in the bottom-right corner!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test API Calls</Text>
          <Text style={styles.instructionText}>
            Tap the floating 🔍 button first to open the monitoring screen,
            then make API calls using the buttons below.
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
            style={[styles.button, styles.warningButton]}
            onPress={() => makeApiCall('https://jsonplaceholder.typicode.com/posts', 'POST')}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : '📝 Create Post (POST)'}
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
          <Text style={styles.sectionTitle}>Features</Text>
          <Text style={styles.featureText}>✅ Real-time API call monitoring</Text>
          <Text style={styles.featureText}>✅ Copy response body to clipboard</Text>
          <Text style={styles.featureText}>✅ Generate and copy cURL commands</Text>
          <Text style={styles.featureText}>✅ Share API call details</Text>
          <Text style={styles.featureText}>✅ View request/response headers</Text>
          <Text style={styles.featureText}>✅ Track response times</Text>
          <Text style={styles.featureText}>✅ Error detection and reporting</Text>
        </View>
      </ScrollView>

      {/* The portable overlay - this should show a floating button */}
      <ReactNativeInspectorOverlay
        enabled={true}
        position="bottom-right"
        size={60}
        color="#007bff"
      />
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
  description: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 14,
    color: '#1565c0',
    lineHeight: 20,
    textAlign: 'center',
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
  primaryButton: {
    backgroundColor: '#007bff',
  },
  successButton: {
    backgroundColor: '#28a745',
  },
  warningButton: {
    backgroundColor: '#ffc107',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
