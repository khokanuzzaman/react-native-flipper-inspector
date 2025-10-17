import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Simple test component without the overlay first
export default function SimpleOverlayTest() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 React Native Inspector Test</Text>
      <Text style={styles.subtitle}>Checking if overlay component loads...</Text>
      
      <View style={styles.testBox}>
        <Text style={styles.testText}>
          If you can see this text, the app is working!
        </Text>
        <Text style={styles.testText}>
          The floating overlay button should appear in the bottom-right corner.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  testBox: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  testText: {
    fontSize: 14,
    color: '#1565c0',
    marginBottom: 8,
    textAlign: 'center',
  },
});
