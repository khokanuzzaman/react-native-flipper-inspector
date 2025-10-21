import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function NetworkTest() {
  const [status, setStatus] = useState('Ready');
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFetch = async () => {
    try {
      setStatus('Testing Fetch API...');
      addResult('Starting Fetch API test');
      
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const data = await response.json();
      
      addResult(`✅ Fetch API Success: ${data.title}`);
      setStatus('Fetch API test completed');
    } catch (error) {
      addResult(`❌ Fetch API Error: ${error.message}`);
      setStatus('Fetch API test failed');
    }
  };

  const testXMLHttpRequest = () => {
    setStatus('Testing XMLHttpRequest...');
    addResult('Starting XMLHttpRequest test');

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/2');
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        addResult(`✅ XMLHttpRequest Success: ${data.title}`);
        setStatus('XMLHttpRequest test completed');
      }
    };
    
    xhr.onerror = function() {
      addResult('❌ XMLHttpRequest Error');
      setStatus('XMLHttpRequest test failed');
    };
    
    xhr.send();
  };

  const testMultipleRequests = async () => {
    setStatus('Testing Multiple Requests...');
    addResult('Starting multiple requests test');

    try {
      const promises = [
        fetch('https://jsonplaceholder.typicode.com/posts/1'),
        fetch('https://jsonplaceholder.typicode.com/posts/2'),
        fetch('https://jsonplaceholder.typicode.com/posts/3'),
      ];

      const responses = await Promise.all(promises);
      addResult(`✅ Multiple Requests Success: ${responses.length} requests completed`);
      setStatus('Multiple requests test completed');
    } catch (error) {
      addResult(`❌ Multiple Requests Error: ${error.message}`);
      setStatus('Multiple requests test failed');
    }
  };

  const clearResults = () => {
    setResults([]);
    setStatus('Ready');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌐 Network Test</Text>
      <Text style={styles.status}>Status: {status}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={testFetch}>
          <Text style={styles.buttonText}>Test Fetch API</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testXMLHttpRequest}>
          <Text style={styles.buttonText}>Test XMLHttpRequest</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testMultipleRequests}>
          <Text style={styles.buttonText}>Test Multiple Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearResults}>
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Results:</Text>
        {results.length === 0 ? (
          <Text style={styles.noResults}>No results yet. Run a test!</Text>
        ) : (
          results.map((result, index) => (
            <Text key={index} style={styles.resultText}>
              {result}
            </Text>
          ))
        )}
      </ScrollView>

      <Text style={styles.hint}>
        💡 Tap the floating 🔍 button to view network details
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noResults: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  resultText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 5,
    lineHeight: 18,
  },
  hint: {
    fontSize: 12,
    color: '#007bff',
    textAlign: 'center',
    marginTop: 10,
  },
});

