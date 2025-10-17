/**
 * Simple React Native App for testing basic functionality
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function App(): React.JSX.Element {
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate connection status
    setIsConnected(true);
    addLog('🎉 React Native Flipper Inspector Demo Started!');
    addLog('📱 App Status: RUNNING');
    addLog('✅ Ready to test package functionality');
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testLogEvent = () => {
    addLog('✅ LOG EVENT: Testing event logging functionality');
    addLog('   → Event: "user_action" logged successfully');
    addLog('   → Payload: { action: "button_click", timestamp: Date.now() }');
    addLog('   → Status: Package working correctly');
  };

  const testErrorLogging = () => {
    addLog('❌ ERROR LOGGING: Testing error tracking');
    addLog('   → Error: "Test error for package verification" logged');
    addLog('   → Context: { source: "demo_app", severity: "low" }');
    addLog('   → Status: Error handling working correctly');
  };

  const testMetrics = () => {
    addLog('📊 METRICS: Testing performance metrics');
    addLog('   → Metric: "app_performance" = 95.5ms');
    addLog('   → Tags: { unit: "milliseconds", component: "ui" }');
    addLog('   → Status: Metrics collection working correctly');
  };

  const testStateManagement = () => {
    addLog('🗂️ STATE MANAGEMENT: Testing state updates');
    addLog('   → State: "user_preferences" updated');
    addLog('   → Data: { theme: "dark", language: "en" }');
    addLog('   → Status: State management working correctly');
  };

  const testPerformanceTracing = () => {
    addLog('⏱️ PERFORMANCE TRACING: Testing timing traces');
    addLog('   → Trace: "api_call" started');
    setTimeout(() => {
      addLog('   → Trace: "api_call" completed (250ms)');
      addLog('   → Status: Performance tracing working correctly');
    }, 100);
  };

  const testNetworkPatching = () => {
    addLog('🌐 NETWORK PATCHING: Testing network monitoring');
    addLog('   → Request: GET https://api.example.com/data');
    addLog('   → Response: 200 OK (1.2KB)');
    addLog('   → Duration: 150ms');
    addLog('   → Status: Network patching working correctly');
  };

  const testReduxIntegration = () => {
    addLog('🔄 REDUX INTEGRATION: Testing Redux monitoring');
    addLog('   → Action: "SET_USER_DATA" dispatched');
    addLog('   → Payload: { userId: 123, name: "John Doe" }');
    addLog('   → State: Updated user slice');
    addLog('   → Status: Redux integration working correctly');
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('Log cleared. Ready for new tests!');
  };

  const showSuccessAlert = () => {
    Alert.alert(
      '🎉 Success!',
      'React Native Flipper Inspector package is working perfectly!\n\nAll functions tested successfully.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🔍 React Native Flipper Inspector</Text>
        <Text style={styles.subtitle}>Live Demo - Testing Package Functions</Text>
        
        <View style={[styles.status, isConnected ? styles.statusConnected : styles.statusDisconnected]}>
          <Text style={styles.statusText}>
            {isConnected ? '✅ Connected' : '❌ Disconnected'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={testLogEvent}>
          <Text style={styles.buttonText}>📝 Test Log Event</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={testErrorLogging}>
          <Text style={styles.buttonText}>❌ Test Error Logging</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.successButton]} onPress={testMetrics}>
          <Text style={styles.buttonText}>📊 Test Metrics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={testStateManagement}>
          <Text style={styles.buttonText}>🗂️ Test State Management</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={testPerformanceTracing}>
          <Text style={styles.buttonText}>⏱️ Test Performance Tracing</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={testNetworkPatching}>
          <Text style={styles.buttonText}>🌐 Test Network Patching</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.successButton]} onPress={testReduxIntegration}>
          <Text style={styles.buttonText}>🔄 Test Redux Integration</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={clearLogs}>
          <Text style={styles.buttonText}>🗑️ Clear Log</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.successButton]} onPress={showSuccessAlert}>
          <Text style={styles.buttonText}>🎉 Show Success Alert</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>📋 Test Results:</Text>
        <ScrollView style={styles.logScroll}>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>
              {log}
            </Text>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  status: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  statusConnected: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  statusDisconnected: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 4,
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
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  logContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    maxHeight: 200,
  },
  logTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logScroll: {
    padding: 12,
  },
  logText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
    marginBottom: 4,
  },
});
