import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';
import { jest, expect, describe, it, beforeEach } from '@jest/globals';

// Mock the inspector
const mockInspector = {
  init: jest.fn(),
  log: jest.fn(),
  error: jest.fn(),
  metric: jest.fn(),
  trace: jest.fn(() => ({ end: jest.fn() })),
  state: {
    update: jest.fn(),
    remove: jest.fn(),
    getState: jest.fn(() => ({})),
  },
  patchNetwork: jest.fn(() => jest.fn()),
  attachRedux: jest.fn(() => jest.fn()),
  isEnabled: jest.fn(() => true),
  isConnected: jest.fn(() => true),
};

jest.mock('react-native-flipper-inspector', () => mockInspector);

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Example App', () => {
  it('renders correctly', () => {
    const { getByText } = render(<App />);
    
    expect(getByText('React Native Flipper Inspector')).toBeTruthy();
    expect(getByText('Example App')).toBeTruthy();
  });

  it('has all main sections', () => {
    const { getByText } = render(<App />);
    
    expect(getByText('Logging')).toBeTruthy();
    expect(getByText('Tracing')).toBeTruthy();
    expect(getByText('State Management')).toBeTruthy();
    expect(getByText('Network Monitoring')).toBeTruthy();
    expect(getByText('Redux Integration')).toBeTruthy();
    expect(getByText('Performance Testing')).toBeTruthy();
  });

  it('can log events', () => {
    const { getByText } = render(<App />);
    
    fireEvent.press(getByText('Log Event'));
    
    expect(mockInspector.log).toHaveBeenCalledWith('ButtonClicked', expect.objectContaining({
      button: 'log-event',
    }));
  });

  it('can log errors', () => {
    const { getByText } = render(<App />);
    
    fireEvent.press(getByText('Log Error'));
    
    expect(mockInspector.error).toHaveBeenCalled();
  });

  it('can log metrics', () => {
    const { getByText } = render(<App />);
    
    fireEvent.press(getByText('Log Metric'));
    
    expect(mockInspector.metric).toHaveBeenCalledWith(
      'api_response_time',
      expect.any(Number),
      expect.objectContaining({
        endpoint: '/api/test',
        method: 'GET',
      })
    );
  });

  it('can start traces', () => {
    const { getByText } = render(<App />);
    
    fireEvent.press(getByText('Start Trace'));
    
    expect(mockInspector.trace).toHaveBeenCalledWith(
      'user-interaction',
      expect.any(String)
    );
  });

  it('can update state', () => {
    const { getByText } = render(<App />);
    
    fireEvent.press(getByText('Update State'));
    
    expect(mockInspector.state.update).toHaveBeenCalledWith('user', expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      lastLogin: expect.any(String),
    }));
  });

  it('can remove state keys', () => {
    const { getByText } = render(<App />);
    
    fireEvent.press(getByText('Remove State Keys'));
    
    expect(mockInspector.state.remove).toHaveBeenCalledWith('user', ['lastLogin']);
  });

  it('can toggle network monitoring', () => {
    const { getByText } = render(<App />);
    
    fireEvent.press(getByText('Enable Network Monitoring'));
    
    expect(mockInspector.patchNetwork).toHaveBeenCalledWith({
      redactHeaders: ['authorization'],
      redactBody: false,
    });
  });

  it('can generate bulk events', async () => {
    const { getByText } = render(<App />);
    
    fireEvent.press(getByText('Generate Bulk Events'));
    
    await waitFor(() => {
      expect(mockInspector.log).toHaveBeenCalledTimes(10);
    });
  });

  it('shows inspector status', () => {
    render(<App />);
    
    // The app should log inspector status on mount
    expect(mockInspector.log).toHaveBeenCalledWith('InspectorStatus', expect.objectContaining({
      enabled: true,
      connected: true,
    }));
  });
});
