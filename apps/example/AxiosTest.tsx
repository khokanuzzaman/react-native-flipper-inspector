import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import superagent from 'superagent';

export default function AxiosTest() {
  const [status, setStatus] = useState('Ready to test');
  const [requestCount, setRequestCount] = useState(0);

  const testAxiosGet = async () => {
    try {
      setStatus('Testing Axios GET...');
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
      setStatus(`✅ Axios GET success: ${response.data.title}`);
      setRequestCount(prev => prev + 1);
    } catch (error: any) {
      setStatus(`❌ Axios GET failed: ${error.message}`);
    }
  };

  const testAxiosPost = async () => {
    try {
      setStatus('Testing Axios POST...');
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        title: 'Test Post from RN Flipper Inspector',
        body: 'Testing XMLHttpRequest interception',
        userId: 1,
      });
      setStatus(`✅ Axios POST success: Created post ${response.data.id}`);
      setRequestCount(prev => prev + 1);
    } catch (error: any) {
      setStatus(`❌ Axios POST failed: ${error.message}`);
    }
  };

  const testAxiosPut = async () => {
    try {
      setStatus('Testing Axios PUT...');
      const response = await axios.put('https://jsonplaceholder.typicode.com/posts/1', {
        id: 1,
        title: 'Updated title',
        body: 'Updated body',
        userId: 1,
      });
      setStatus(`✅ Axios PUT success: Updated post ${response.data.id}`);
      setRequestCount(prev => prev + 1);
    } catch (error: any) {
      setStatus(`❌ Axios PUT failed: ${error.message}`);
    }
  };

  const testAxiosDelete = async () => {
    try {
      setStatus('Testing Axios DELETE...');
      await axios.delete('https://jsonplaceholder.typicode.com/posts/1');
      setStatus('✅ Axios DELETE success');
      setRequestCount(prev => prev + 1);
    } catch (error: any) {
      setStatus(`❌ Axios DELETE failed: ${error.message}`);
    }
  };

  const testXHRDirect = () => {
    setStatus('Testing direct XMLHttpRequest...');
    const xhr = new XMLHttpRequest();
    
    xhr.onload = () => {
      setStatus(`✅ XHR Direct success: ${xhr.status}`);
      setRequestCount(prev => prev + 1);
    };
    
    xhr.onerror = () => {
      setStatus('❌ XHR Direct failed');
    };
    
    xhr.open('GET', 'https://jsonplaceholder.typicode.com/users/1');
    xhr.send();
  };

  const testFetchAPI = async () => {
    try {
      setStatus('Testing Fetch API...');
      const response = await fetch('https://jsonplaceholder.typicode.com/comments/1');
      const data = await response.json();
      setStatus(`✅ Fetch success: ${data.email}`);
      setRequestCount(prev => prev + 1);
    } catch (error: any) {
      setStatus(`❌ Fetch failed: ${error.message}`);
    }
  };

  const testSuperagent = async () => {
    try {
      setStatus('Testing Superagent GET...');
      const response = await superagent.get('https://jsonplaceholder.typicode.com/todos/1');
      setStatus(`✅ Superagent success: ${response.body.title}`);
      setRequestCount(prev => prev + 1);
    } catch (error: any) {
      setStatus(`❌ Superagent failed: ${error.message}`);
    }
  };

  const testMultipleRequests = async () => {
    setStatus('Testing multiple concurrent requests...');
    try {
      await Promise.all([
        axios.get('https://jsonplaceholder.typicode.com/posts/1'),
        axios.get('https://jsonplaceholder.typicode.com/posts/2'),
        superagent.get('https://jsonplaceholder.typicode.com/posts/3'),
        fetch('https://jsonplaceholder.typicode.com/posts/4'),
      ]);
      setStatus('✅ All concurrent requests succeeded (Axios + Superagent + Fetch)');
      setRequestCount(prev => prev + 4);
    } catch (error: any) {
      setStatus(`❌ Concurrent requests failed: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Network Interception Test</Text>
        <Text style={styles.subtitle}>Testing All HTTP Libraries</Text>
        <Text style={styles.counter}>Requests Made: {requestCount}</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Axios Tests (XMLHttpRequest)</Text>
        
        <TouchableOpacity style={styles.button} onPress={testAxiosGet}>
          <Text style={styles.buttonText}>Test Axios GET</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonPost]} onPress={testAxiosPost}>
          <Text style={styles.buttonText}>Test Axios POST</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonPut]} onPress={testAxiosPut}>
          <Text style={styles.buttonText}>Test Axios PUT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonDelete]} onPress={testAxiosDelete}>
          <Text style={styles.buttonText}>Test Axios DELETE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Direct XHR Test</Text>
        
        <TouchableOpacity style={styles.button} onPress={testXHRDirect}>
          <Text style={styles.buttonText}>Test XMLHttpRequest Direct</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other HTTP Libraries</Text>
        
        <TouchableOpacity style={styles.button} onPress={testFetchAPI}>
          <Text style={styles.buttonText}>Test Fetch API</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#17a2b8' }]} onPress={testSuperagent}>
          <Text style={styles.buttonText}>Test Superagent (XHR-based)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Concurrent Requests</Text>
        
        <TouchableOpacity style={[styles.button, styles.buttonMultiple]} onPress={testMultipleRequests}>
          <Text style={styles.buttonText}>Test Multiple Libraries Together</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>📋 Instructions:</Text>
        <Text style={styles.instructionsText}>
          1. Click any button to make requests{'\n'}
          2. Check the floating inspector button{'\n'}
          3. Verify ALL requests appear (Axios + Superagent + Fetch + XHR){'\n'}
          4. Inspect request/response details{'\n'}
          5. Confirm ALL third-party libraries are tracked!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 10,
  },
  counter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd700',
    marginTop: 10,
  },
  statusContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonPost: {
    backgroundColor: '#28a745',
  },
  buttonPut: {
    backgroundColor: '#ffc107',
  },
  buttonDelete: {
    backgroundColor: '#dc3545',
  },
  buttonMultiple: {
    backgroundColor: '#6f42c1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    backgroundColor: '#fff3cd',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 22,
  },
});

