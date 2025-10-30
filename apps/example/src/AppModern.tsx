import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DemoAction = {
  title: string;
  subtitle: string;
  tone: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  action: () => Promise<void> | void;
};

const AppModern = (): React.JSX.Element => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    addLog('🚀 Demo booted. Floating inspector ready for action.');
    addLog('🤖 Tip: tap to open, long-press to drag the floating button.');
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 12));
  };

  const runNetworkRequest = async (url: string, label: string) => {
    addLog(`${label} → fetching ${url}`);
    try {
      const started = Date.now();
      const response = await fetch(url);
      const duration = Date.now() - started;
      addLog(`${label} → ${response.status} (${duration}ms)`);
      return response;
    } catch (error) {
      addLog(`${label} → request failed: ${error}`);
      throw error;
    }
  };

  const actions: DemoAction[] = useMemo(
    () => [
      {
        title: 'Single API Call',
        subtitle: 'Fetch a placeholder post and inspect request payload.',
        tone: 'primary',
        action: async () => {
          const response = await runNetworkRequest(
            'https://jsonplaceholder.typicode.com/posts/1',
            'Single call',
          );
          const json = await response.json();
          addLog(`Single call → body preview: ${JSON.stringify(json).slice(0, 60)}...`);
        },
      },
      {
        title: 'Batch Requests',
        subtitle: 'Trigger three calls to showcase filtering and search.',
        tone: 'success',
        action: async () => {
          const urls = [1, 2, 3].map(n => `https://jsonplaceholder.typicode.com/posts/${n}`);
          await Promise.all(
            urls.map((url, index) => runNetworkRequest(url, `Batch call ${index + 1}`)),
          );
          addLog('Batch requests completed.');
        },
      },
      {
        title: 'Error Scenario',
        subtitle: 'Capture a 500 response to test error highlighting.',
        tone: 'warning',
        action: async () => {
          const response = await runNetworkRequest('https://httpstat.us/500', 'Error call');
          addLog(`Error call → status text: ${response.statusText}`);
        },
      },
      {
        title: 'Slow Response',
        subtitle: 'Adds a 2 second delay — great for duration tracking.',
        tone: 'danger',
        action: async () => {
          await runNetworkRequest('https://httpstat.us/200?sleep=2000', 'Slow call');
          addLog('Slow call completed after delay.');
        },
      },
      {
        title: 'Show Success Toast',
        subtitle: 'Quick manual sanity check for the floating overlay.',
        tone: 'neutral',
        action: () =>
          Alert.alert(
            '🎉 All Set!',
            'The floating inspector is live. Tap the button to open the overlay or hold + drag to move it.',
          ),
      },
    ],
    [],
  );

  const handleActionPress = async (demoAction: DemoAction) => {
    try {
      await demoAction.action();
    } catch (error) {
      addLog(`⚠️ ${demoAction.title} failed. Check the inspector for details.`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>React Native Flipper Inspector</Text>
        <Text style={styles.heroSubtitle}>
          Monitor API traffic with the floating overlay. Tap the 🔍 button to open the panel or
          long-press to reposition it.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quick Actions</Text>
          <Text style={styles.sectionDescription}>
            Fire different HTTP scenarios to explore filters, search, copying, and export options
            inside the floating inspector.
          </Text>

          <View style={styles.actionGrid}>
            {actions.map(action => (
              <TouchableOpacity
                key={action.title}
                style={[styles.actionCard, styles[`tone_${action.tone}`]]}
                onPress={() => handleActionPress(action)}
                activeOpacity={0.88}
              >
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Live Console</Text>
          <Text style={styles.sectionDescription}>
            Recent demo events appear here (newest first). They are also captured in the inspector
            with full metadata.
          </Text>

          <View style={styles.logPanel}>
            {logs.length === 0 ? (
              <Text style={styles.logPlaceholder}>Trigger an action above to start logging.</Text>
            ) : (
              logs.map((log, index) => (
                <Text key={index} style={styles.logLine}>
                  {log}
                </Text>
              ))
            )}
          </View>

          <TouchableOpacity
            style={[styles.actionCard, styles.clearButton]}
            onPress={() => setLogs([])}
            activeOpacity={0.88}
          >
            <Text style={styles.clearTitle}>Clear Local Log</Text>
            <Text style={styles.clearSubtitle}>
              This resets the list above. Network history stays available inside the inspector until
              you clear it there.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const baseCard = {
  borderRadius: 18,
  paddingVertical: 18,
  paddingHorizontal: 20,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    backgroundColor: '#111c37',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(148, 163, 184, 0.25)',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    backgroundColor: '#0f172a',
  },
  section: {
    marginTop: 24,
  },
  sectionLabel: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  actionGrid: {
    gap: 12,
  },
  actionCard: {
    ...baseCard,
    backgroundColor: 'rgba(30, 58, 138, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  actionTitle: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  actionSubtitle: {
    color: '#9ca3af',
    fontSize: 13,
    lineHeight: 18,
  },
  tone_primary: {
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
    borderColor: 'rgba(129, 140, 248, 0.45)',
  },
  tone_success: {
    backgroundColor: 'rgba(74, 222, 128, 0.22)',
    borderColor: 'rgba(34, 197, 94, 0.45)',
  },
  tone_warning: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderColor: 'rgba(251, 191, 36, 0.45)',
  },
  tone_danger: {
    backgroundColor: 'rgba(248, 113, 113, 0.22)',
    borderColor: 'rgba(248, 113, 113, 0.45)',
  },
  tone_neutral: {
    backgroundColor: 'rgba(148, 163, 184, 0.18)',
    borderColor: 'rgba(148, 163, 184, 0.4)',
  },
  logPanel: {
    ...baseCard,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    gap: 10,
  },
  logPlaceholder: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
  },
  logLine: {
    color: '#e2e8f0',
    fontSize: 12,
    fontFamily: 'Menlo',
  },
  clearButton: {
    marginTop: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  clearTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  clearSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 16,
  },
});

export default AppModern;
