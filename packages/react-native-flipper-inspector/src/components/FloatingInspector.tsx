import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Share,
  Alert,
  TextInput,
  FlatList,
  SafeAreaView,
  Platform,
} from 'react-native';
import { PanResponder, Animated } from 'react-native';
import { useStore } from './StoreProvider';
import { ApiDetailModal } from './overlay/ApiDetailModal';
import type { ApiCall, FilterKey } from './overlay/types';
import {
  clamp,
  escapeRegExp,
  formatTimestamp,
  getStatusColor,
  tryFormatJson,
} from './overlay/utils';
import { copyToClipboard } from '../utils/clipboard';

const { width, height } = Dimensions.get('window');
const DRAG_ACTIVATION_DISTANCE = 8;

interface FloatingInspectorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: number;
  color?: string;
}

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'success', label: 'Success' },
  { key: 'errors', label: 'Errors' },
  { key: 'pending', label: 'Pending' },
];

const isSearchMatch = (call: ApiCall, query: string): boolean => {
  const haystacks = [
    call.method,
    call.url,
    call.status?.toString() ?? '',
    call.requestBody ?? '',
    call.responseBody ?? '',
    JSON.stringify(call.requestHeaders ?? {}),
    JSON.stringify(call.responseHeaders ?? {}),
    call.error ?? '',
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystacks.includes(query.toLowerCase());
};

const filterCalls = (
  calls: ApiCall[],
  filter: FilterKey,
  query: string
): ApiCall[] => {
  const normalizedQuery = query.trim();

  return calls.filter((call) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'success' &&
        !!call.status &&
        call.status >= 200 &&
        call.status < 300) ||
      (filter === 'errors' && !!call.status && call.status >= 400) ||
      (filter === 'pending' && !call.status);

    if (!matchesFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return isSearchMatch(call, normalizedQuery);
  });
};

const highlightMatches = (text: string, query: string, style: any) => {
  if (!query.trim()) {
    return (
      <Text style={style} numberOfLines={1}>
        {text}
      </Text>
    );
  }

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'ig');
  const parts = text.split(regex);

  return (
    <Text style={style} numberOfLines={1}>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <Text key={`${part}-${index}`} style={styles.matchHighlight}>
            {part}
          </Text>
        ) : (
          <Text key={`${part}-${index}`}>{part}</Text>
        )
      )}
    </Text>
  );
};

export const FloatingInspector: React.FC<FloatingInspectorProps> = ({
  position = 'bottom-right',
  size = 60,
  color = '#1e40af',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [selectedCall, setSelectedCall] = useState<ApiCall | null>(null);
  const [buttonPosition, setButtonPosition] = useState(() => {
    const margin = 20;
    switch (position) {
      case 'top-right':
        return { top: margin + 60, left: width - size - margin };
      case 'top-left':
        return { top: margin + 60, left: margin };
      case 'bottom-left':
        return { top: height - size - margin - 120, left: margin };
      case 'bottom-right':
      default:
        return { top: height - size - margin - 120, left: width - size - margin };
    }
  });
  const buttonPositionRef = useRef(buttonPosition);
  const gestureTracker = useRef({
    startX: 0,
    startY: 0,
    initialLeft: 0,
    initialTop: 0,
    moved: false,
  });

  const store = useStore();
  const listRef = useRef<FlatList<ApiCall> | null>(null);

  const apiCalls = store.state.apiCalls;

  const stats = useMemo(() => {
    const success = apiCalls.filter(
      (call) => call.status && call.status >= 200 && call.status < 300
    ).length;
    const errors = apiCalls.filter((call) => call.status && call.status >= 400).length;
    const pending = apiCalls.filter((call) => !call.status).length;

    return {
      total: apiCalls.length,
      success,
      errors,
      pending,
    };
  }, [apiCalls]);

  const getFilterCount = useCallback(
    (key: FilterKey) => {
      switch (key) {
        case 'success':
          return stats.success;
        case 'errors':
          return stats.errors;
        case 'pending':
          return stats.pending;
        case 'all':
        default:
          return stats.total;
      }
    },
    [stats.errors, stats.pending, stats.success, stats.total]
  );

  const filteredCalls = useMemo(
    () => filterCalls(apiCalls, activeFilter, searchQuery),
    [apiCalls, activeFilter, searchQuery]
  );

  useEffect(() => {
    if (!isVisible) {
      setSearchQuery('');
      setActiveFilter('all');
    }
  }, [isVisible]);

  useEffect(() => {
    buttonPositionRef.current = buttonPosition;
  }, [buttonPosition]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const { dx, dy } = gestureState;
          return Math.abs(dx) > 5 || Math.abs(dy) > 5;
        },
        onPanResponderGrant: (event) => {
          const { pageX, pageY } = event.nativeEvent;
          gestureTracker.current = {
            startX: pageX,
            startY: pageY,
            initialLeft: buttonPositionRef.current.left,
            initialTop: buttonPositionRef.current.top,
            moved: false,
          };
        },
        onPanResponderMove: (event, gestureState) => {
          const { pageX, pageY } = event.nativeEvent;
          const { dx, dy } = gestureState;
          const distance = Math.hypot(dx, dy);

          if (!gestureTracker.current.moved && distance > DRAG_ACTIVATION_DISTANCE) {
            gestureTracker.current.moved = true;
          }

          if (gestureTracker.current.moved) {
            const newLeft = clamp(pageX - size / 2, 12, width - size - 12);
            const newTop = clamp(pageY - size / 2, 80, height - size - 160);
            setButtonPosition({ top: newTop, left: newLeft });
          }
        },
        onPanResponderRelease: (event) => {
          const wasDragged = gestureTracker.current.moved;
          gestureTracker.current.moved = false;

          if (wasDragged) {
            const snapLeft = event.nativeEvent.pageX < width / 2 ? 12 : width - size - 12;
            setButtonPosition((prev) => ({
              ...prev,
              left: snapLeft,
            }));
          } else {
            // Only open modal if it was a tap (not a drag)
            setIsVisible(true);
          }
        },
        onPanResponderTerminate: () => {
          gestureTracker.current.moved = false;
        },
      }),
    [size]
  );

  const handleCopy = useCallback((label: string, value?: string) => {
    if (!value) {
      Alert.alert('Unavailable', `${label} is empty for this request.`);
      return;
    }

    copyToClipboard(value)
      .then(() => {
        Alert.alert('Copied', `${label} copied to clipboard.`);
      })
      .catch(error => {
        const message =
          error instanceof Error ? error.message : 'Unable to copy to clipboard.';
        Alert.alert('Error', message);
      });
  }, []);

  const handleShare = useCallback(async (call: ApiCall) => {
    try {
      const shareBody = [
        `Method: ${call.method}`,
        `URL: ${call.url}`,
        `Status: ${call.status ?? 'Pending'}`,
        `Duration: ${call.duration}ms`,
        '',
        'Request Headers:',
        JSON.stringify(call.requestHeaders ?? {}, null, 2),
        '',
        'Request Body:',
        tryFormatJson(call.requestBody),
        '',
        'Response Body:',
        tryFormatJson(call.responseBody),
      ].join('\n');

      await Share.share({
        title: 'API Call',
        message: shareBody,
      });
    } catch {
      Alert.alert('Error', 'Unable to share API call.');
    }
  }, []);

  const handleExport = useCallback(() => {
    if (filteredCalls.length === 0) {
      Alert.alert('Nothing to export', 'No API calls match the current view.');
      return;
    }

    const exportPayload = JSON.stringify(filteredCalls, null, 2);
    copyToClipboard(exportPayload)
      .then(() => {
        Alert.alert(
          'Exported',
          `${filteredCalls.length} API ${
            filteredCalls.length === 1 ? 'call' : 'calls'
          } copied as JSON.`,
        );
      })
      .catch(error => {
        const message =
          error instanceof Error ? error.message : 'Unable to export API calls.';
        Alert.alert('Error', message);
      });
  }, [filteredCalls]);

  const handleClear = useCallback(() => {
    if (apiCalls.length === 0) {
      return;
    }

    Alert.alert(
      'Clear captured calls?',
      'This will remove all captured API calls from the overlay.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => store.clearApiCalls(),
        },
      ]
    );
  }, [apiCalls.length, store]);

  const handleCallPress = useCallback((call: ApiCall) => {
    setSelectedCall(call);
  }, []);

  const onSearchNavigation = useCallback(
    (direction: 'next' | 'prev') => {
      if (filteredCalls.length === 0) {
        return;
      }

      const currentIndex = filteredCalls.findIndex(
        (call) => call.id === selectedCall?.id
      );

      const nextIndex =
        direction === 'next'
          ? (currentIndex + 1) % filteredCalls.length
          : (currentIndex - 1 + filteredCalls.length) % filteredCalls.length;

      const nextCall = filteredCalls[nextIndex] ?? filteredCalls[0] ?? null;
      setSelectedCall(nextCall);

      requestAnimationFrame(() => {
        try {
          listRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        } catch {
          // ignore scroll errors for out-of-range indices
        }
      });
    },
    [filteredCalls, selectedCall?.id]
  );

  const renderCallItem = useCallback(
    ({ item }: { item: ApiCall }) => {
      const isSelected = selectedCall?.id === item.id;

      return (
        <TouchableOpacity
          style={[styles.callCard, isSelected && styles.callCardSelected]}
          onPress={() => handleCallPress(item)}
        >
          <View style={styles.callHeader}>
            <View style={styles.methodSection}>
              <View style={styles.methodBadge}>
                <Text style={styles.methodText}>{item.method || 'GET'}</Text>
              </View>
              <Text
                style={[styles.statusText, { color: getStatusColor(item.status) }]}
              >
                {item.status ?? 'Pending'}
              </Text>
            </View>
            <View style={styles.metaSection}>
              <Text style={styles.durationText}>{item.duration ?? 0}ms</Text>
              <Text style={styles.timestampText}>
                {formatTimestamp(item.timestamp)}
              </Text>
            </View>
          </View>

          <View style={styles.urlSection}>
            {highlightMatches(item.url || '', searchQuery, styles.urlText)}
          </View>

          {item.error && (
            <View style={styles.errorSection}>
              <Text style={styles.errorText} numberOfLines={1}>
                {item.error}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [handleCallPress, searchQuery, selectedCall?.id]
  );

  const listHeader = useMemo(
    () => (
      <>
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search URL, headers, body..."
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchButton}
              >
                <Text style={styles.clearSearchText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.searchActions}>
            <TouchableOpacity onPress={handleExport} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClear} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.filterRow}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filterChip, activeFilter === filter.key && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Text
                style={[styles.filterLabel, activeFilter === filter.key && styles.filterLabelActive]}
              >
                {filter.label}
              </Text>
              <View style={styles.filterCountBadge}>
                <Text style={styles.filterCount}>{getFilterCount(filter.key)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {!!searchQuery && (
          <View style={styles.matchRow}>
            <Text style={styles.matchInfo}>
              {filteredCalls.length} match
              {filteredCalls.length === 1 ? '' : 'es'} for "{searchQuery}"
            </Text>
            <View style={styles.matchControls}>
              <TouchableOpacity
                onPress={() => onSearchNavigation('prev')}
                style={styles.matchButton}
                disabled={filteredCalls.length === 0}
              >
                <Text style={styles.matchButtonText}>◀</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onSearchNavigation('next')}
                style={styles.matchButton}
                disabled={filteredCalls.length === 0}
              >
                <Text style={styles.matchButtonText}>▶</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </>
    ),
    [
      activeFilter,
      filteredCalls.length,
      getFilterCount,
      handleClear,
      handleExport,
      onSearchNavigation,
      searchQuery,
    ]
  );

  return (
    <>
      <Animated.View
        style={[
          styles.floatingButton,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            top: buttonPosition.top,
            left: buttonPosition.left,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View
          style={[
            styles.floatingInner,
            {
              backgroundColor: color,
              borderRadius: size / 2,
            },
          ]}
        >
          <Animated.View style={[styles.floatingGlow, { borderRadius: size / 2 }]} />
          <View style={styles.floatingContent}>
            <Text style={[styles.floatingEmoji, { fontSize: size * 0.32 }]}>🔍</Text>
          </View>
        </View>
      </Animated.View>

      <Modal
        visible={isVisible}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
        statusBarTranslucent={false}
        hardwareAccelerated={Platform.OS === 'android'}
        supportedOrientations={['portrait', 'landscape']}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>API Inspector</Text>
              <Text style={styles.subtitle}>
                {stats.total} calls • {stats.success} success • {stats.errors} errors
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsVisible(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={listRef}
            data={filteredCalls}
            keyExtractor={(item) => item.id}
            renderItem={renderCallItem}
            ListHeaderComponent={listHeader}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>🔍</Text>
                <Text style={styles.emptyStateTitle}>No API calls captured yet</Text>
                <Text style={styles.emptyStateText}>
                  Trigger some network requests in your app to see detailed call logs,
                  filters, and shareable traces show up here in real-time.
                </Text>
                <View style={styles.emptyStateActions}>
                  <TouchableOpacity style={styles.emptyStateButton} onPress={() => setIsVisible(false)}>
                    <Text style={styles.emptyStateButtonText}>Hide inspector</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            initialNumToRender={15}
            getItemLayout={(data, index) => ({
              length: 68,
              offset: 68 * index,
              index,
            })}
          />
        </SafeAreaView>
      </Modal>

      <ApiDetailModal
        visible={!!selectedCall}
        call={selectedCall}
        onClose={() => setSelectedCall(null)}
        onCopy={handleCopy}
        onShare={handleShare}
      />
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    zIndex: 9999,
    elevation: 16,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  floatingInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  floatingGlow: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.6,
  },
  floatingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  floatingEmoji: {
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: Math.min(20, width * 0.05),
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
    height: 60,
  },
  headerContent: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
  },
  closeButton: {
    padding: 6,
    borderRadius: 24,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#f8fafc',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Math.min(20, width * 0.05),
    marginTop: 12,
    marginBottom: 8,
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    minHeight: 36,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    color: '#e2e8f0',
    fontSize: 14,
  },
  clearSearchButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
  },
  clearSearchText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  searchActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#f8fafc',
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Math.min(20, width * 0.05),
    paddingTop: 8,
    paddingBottom: 8,
    gap: Math.min(8, width * 0.02),
    flexWrap: 'wrap',
  },
  filterChip: {
    flex: width < 400 ? 0.48 : 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: Math.min(8, width * 0.02),
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
    minHeight: 40,
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginRight: 6,
  },
  filterLabelActive: {
    color: '#f8fafc',
  },
  filterCountBadge: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  filterCount: {
    fontSize: 11,
    color: '#cbd5f5',
    fontWeight: '600',
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.min(20, width * 0.05),
    paddingBottom: 8,
  },
  matchInfo: {
    fontSize: 12,
    color: '#94a3b8',
  },
  matchControls: {
    flexDirection: 'row',
    gap: 6,
  },
  matchButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchButtonText: {
    color: '#f8fafc',
    fontSize: 12,
  },
  listContent: {
    paddingBottom: 40,
    paddingHorizontal: Math.min(20, width * 0.05),
  },
  separator: {
    height: 8,
  },
  callCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    gap: 8,
  },
  callCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  methodBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.4)',
  },
  methodText: {
    color: '#60a5fa',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  metaSection: {
    alignItems: 'flex-end',
  },
  durationText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 2,
  },
  timestampText: {
    color: '#64748b',
    fontSize: 10,
  },
  urlSection: {
    marginBottom: 4,
  },
  urlText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
  },
  errorSection: {
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.2)',
  },
  errorText: {
    fontSize: 11,
    color: '#f87171',
    lineHeight: 14,
  },
  matchHighlight: {
    backgroundColor: 'rgba(37, 99, 235, 0.35)',
    color: '#f8fafc',
  },
  emptyState: {
    marginTop: Math.max(60, height * 0.1),
    alignItems: 'center',
    paddingHorizontal: Math.min(32, width * 0.08),
    paddingVertical: 20,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyStateTitle: {
    fontSize: 20,
    color: '#e2e8f0',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#94a3b8',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyStateActions: {
    alignItems: 'center',
  },
  emptyStateButton: {
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.3)',
  },
  emptyStateButtonText: {
    color: '#60a5fa',
    fontSize: 14,
    fontWeight: '600',
  },
});
