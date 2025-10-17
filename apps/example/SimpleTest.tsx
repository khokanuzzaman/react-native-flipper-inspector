import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SimpleTest() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Simple Test</Text>
      <Text style={styles.subtitle}>If you can see this, the app is working!</Text>
      
      <View style={styles.testBox}>
        <Text style={styles.testText}>
          This is a basic React Native component.
        </Text>
        <Text style={styles.testText}>
          No external dependencies.
        </Text>
        <Text style={styles.testText}>
          Just pure React Native.
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
