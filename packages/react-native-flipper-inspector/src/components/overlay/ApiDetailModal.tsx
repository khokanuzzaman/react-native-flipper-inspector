import React, { useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import type { ApiCall } from './types';
import {
  formatTimestamp,
  getStatusColor,
  renderHeaders,
  renderJsonWithHighlight,
  tryFormatJson,
  createCurlCommand,
} from './utils';

type DetailTab = 'request' | 'response' | 'overview';

interface ApiDetailModalProps {
  visible: boolean;
  call: ApiCall | null;
  onClose: () => void;
  onCopy: (label: string, value?: string) => void;
  onShare: (call: ApiCall) => void;
}

export const ApiDetailModal: React.FC<ApiDetailModalProps> = ({
  visible,
  call,
  onClose,
  onCopy,
  onShare,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  const summaryItems = useMemo(
    () => [
      {
        label: '⚡ Method',
        value: call?.method ?? '—',
      },
      {
        label: '📊 Status',
        value: call?.status != null ? `${call.status}` : 'Pending',
        valueStyle: { color: getStatusColor(call?.status) },
      },
      {
        label: '⏱️ Duration',
        value: call ? `${call.duration ?? 0} ms` : '—',
      },
      {
        label: '🕐 Captured',
        value: call ? formatTimestamp(call.timestamp) : '—',
      },
    ],
    [call]
  );

  const renderTabButton = (tab: DetailTab, label: string) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        key={tab}
        style={[styles.tabButton, isActive && styles.tabButtonActive]}
        onPress={() => setActiveTab(tab)}
      >
        <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOverview = () => (
    <>
      <DetailSection title="📤 Request">
        <KeyValue label="🌐 URL" value={call?.url ?? '—'} selectable />
        <KeyValue label="⚡ Method" value={call?.method ?? '—'} />
        <KeyValue label="📋 Headers" value={`${Object.keys(call?.requestHeaders ?? {}).length}`} />
        <ActionRow
          actions={[
            {
              label: '📋 Copy headers',
              onPress: () =>
                onCopy(
                  'Request headers',
                  JSON.stringify(call?.requestHeaders ?? {}, null, 2)
                ),
            },
            {
              label: '📄 Copy body',
              onPress: () =>
                onCopy('Request body', tryFormatJson(call?.requestBody)),
            },
          ]}
        />
      </DetailSection>

      <DetailSection title="📥 Response">
        <KeyValue
          label="📊 Status"
          value={call?.status != null ? `${call.status}` : 'Pending'}
          valueStyle={{ color: getStatusColor(call?.status) }}
        />
        <KeyValue label="⏱️ Duration" value={call ? `${call.duration ?? 0} ms` : '—'} />
        <KeyValue label="📋 Headers" value={`${Object.keys(call?.responseHeaders ?? {}).length}`} />
        {call?.error ? (
          <KeyValue
            label="❌ Error"
            value={call.error}
            valueStyle={styles.errorValue}
            selectable
          />
        ) : null}
        <ActionRow
          actions={[
            {
              label: '📋 Copy headers',
              onPress: () =>
                onCopy(
                  'Response headers',
                  JSON.stringify(call?.responseHeaders ?? {}, null, 2)
                ),
            },
            {
              label: '📄 Copy body',
              onPress: () =>
                onCopy('Response body', tryFormatJson(call?.responseBody)),
            },
          ]}
        />
      </DetailSection>
    </>
  );

  const renderRequest = () => (
    <>
      <DetailSection title="📋 Headers">
        {renderHeaders(call?.requestHeaders, sectionStyles)}
      </DetailSection>
      <DetailSection title="📄 Body">
        <CodeBlock>{renderJsonWithHighlight(call?.requestBody, codeStyles)}</CodeBlock>
        <ActionRow
          actions={[
            {
              label: '📄 Copy body',
              onPress: () =>
                onCopy('Request body', tryFormatJson(call?.requestBody)),
            },
          ]}
        />
      </DetailSection>
    </>
  );

  const renderResponse = () => (
    <>
      <DetailSection title="📋 Headers">
        {renderHeaders(call?.responseHeaders, sectionStyles)}
      </DetailSection>
      <DetailSection title="📄 Body">
        <CodeBlock>{renderJsonWithHighlight(call?.responseBody, codeStyles)}</CodeBlock>
        <ActionRow
          actions={[
            {
              label: '📄 Copy body',
              onPress: () =>
                onCopy('Response body', tryFormatJson(call?.responseBody)),
            },
          ]}
        />
      </DetailSection>
      {call?.error ? (
        <DetailSection title="❌ Error">
          <CodeBlock>{call.error}</CodeBlock>
        </DetailSection>
      ) : null}
    </>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <View style={styles.methodBadge}>
              <Text style={styles.methodText}>{call?.method ?? '—'}</Text>
            </View>
            <Text style={styles.urlText} numberOfLines={2}>
              {call?.url ?? 'No URL captured'}
            </Text>
            <Text style={styles.timestampText}>
              {call ? formatTimestamp(call.timestamp) : '—'}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
        {summaryItems.map((item, index) => (
          <View
            key={item.label}
            style={[styles.summaryItem, index === summaryItems.length - 1 && styles.summaryItemLast]}
          >
            <Text style={styles.summaryLabel}>{item.label}</Text>
            <Text style={[styles.summaryValue, item.valueStyle]}>{item.value}</Text>
          </View>
        ))}
        </View>

        <View style={styles.tabRow}>
          {renderTabButton('overview', '📊 Overview')}
          {renderTabButton('request', '📤 Request')}
          {renderTabButton('response', '📥 Response')}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
          keyboardShouldPersistTaps="handled"
          bounces={true}
          scrollEventThrottle={16}
          contentInsetAdjustmentBehavior="automatic"
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'request' && renderRequest()}
          {activeTab === 'response' && renderResponse()}

          <View style={styles.footerActions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => onCopy('cURL command', createCurlCommand(call))}
            >
              <Text style={styles.primaryButtonText}>📋 Copy cURL</Text>
            </TouchableOpacity>
            {call ? (
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => onShare(call)}
              >
                <Text style={styles.outlineButtonText}>📤 Share</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

const DetailSection: React.FC<DetailSectionProps> = ({ title, children }) => (
  <View style={styles.sectionCard}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

interface KeyValueProps {
  label: string;
  value: string;
  valueStyle?: any;
  selectable?: boolean;
}

const KeyValue: React.FC<KeyValueProps> = ({ label, value, valueStyle, selectable }) => (
  <View style={styles.kvRow}>
    <Text style={styles.kvLabel}>{label}</Text>
    <Text style={[styles.kvValue, valueStyle]} selectable={selectable}>
      {value}
    </Text>
  </View>
);

interface ActionRowProps {
  actions: Array<{ label: string; onPress: () => void }>;
}

const ActionRow: React.FC<ActionRowProps> = ({ actions }) => (
  <View style={styles.actionRow}>
    {actions.map((action) => (
      <TouchableOpacity
        key={action.label}
        style={styles.secondaryButton}
        onPress={action.onPress}
      >
        <Text style={styles.secondaryButtonText}>{action.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.codeContainer}>
    <Text style={styles.codeText}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1120',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerInfo: {
    flex: 1,
    paddingRight: 16,
  },
  methodBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 6,
  },
  methodText: {
    color: '#60a5fa',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  urlText: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '600',
  },
  timestampText: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 12,
  },
  closeButton: {
    padding: 8,
    borderRadius: 24,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  },
  closeText: {
    fontSize: 20,
    color: '#f8fafc',
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  summaryItem: {
    flex: 1,
    paddingHorizontal: 8,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(148, 163, 184, 0.15)',
  },
  summaryItemLast: {
    borderRightWidth: 0,
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  summaryValue: {
    marginTop: 4,
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  tabButtonActive: {
    backgroundColor: '#2563eb',
  },
  tabButtonText: {
    color: '#60a5fa',
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#f8fafc',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 4,
    flexGrow: 1,
  },
  sectionCard: {
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#cbd5f5',
    marginBottom: 12,
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  kvLabel: {
    flex: 0.35,
    color: '#94a3b8',
    fontSize: 13,
  },
  kvValue: {
    flex: 0.65,
    color: '#e2e8f0',
    fontSize: 13,
    textAlign: 'right',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#cbd5f5',
    fontSize: 13,
    fontWeight: '600',
  },
  codeContainer: {
    borderRadius: 12,
    backgroundColor: '#091020',
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    maxHeight: 300,
  },
  codeText: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
    fontSize: 13,
    color: '#e2e8f0',
    lineHeight: 20,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '600',
  },
  outlineButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '600',
  },
  errorValue: {
    color: '#f87171',
  },
});

const sectionStyles = StyleSheet.create({
  headerRow: {
    marginBottom: 8,
  },
  headerKey: {
    fontSize: 13,
    color: '#60a5fa',
    fontWeight: '600',
  },
  headerValue: {
    fontSize: 12,
    color: '#cbd5f5',
    marginTop: 2,
  },
  metaTextMuted: {
    color: '#64748b',
    fontSize: 13,
  },
});

const codeStyles = StyleSheet.create({
  jsonPlainText: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
    fontSize: 13,
    color: '#e2e8f0',
    lineHeight: 20,
  },
});

export default ApiDetailModal;
