import { create } from 'zustand';
import { InspectorMessage, UIState, FilterState, MessageType } from '../types';

interface PluginStore extends UIState {
  messages: InspectorMessage[];
  filteredMessages: InspectorMessage[];
  
  // Actions
  addMessage: (message: InspectorMessage) => void;
  clearMessages: () => void;
  setSelectedTab: (tab: MessageType) => void;
  setLiveMode: (enabled: boolean) => void;
  setPaused: (paused: boolean) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSelectedMessage: (message: InspectorMessage | null) => void;
  setColumnVisibility: (column: string, visible: boolean) => void;
  applyFilters: () => void;
}

const defaultFilters: FilterState = {
  search: '',
  messageType: 'all',
  timeRange: null,
  tags: {},
};

export const useStore = create<PluginStore>((set: any, get: any) => ({
  messages: [],
  filteredMessages: [],
  selectedTab: 'log',
  isLiveMode: true,
  isPaused: false,
  filters: defaultFilters,
  selectedMessage: null,
  columnVisibility: {
    timestamp: true,
    type: true,
    data: true,
    tags: false,
  },

  addMessage: (message: InspectorMessage) => {
    const { messages, isLiveMode, isPaused, applyFilters } = get();
    
    // Add timestamp if not present
    if (!message.ts) {
      message.ts = Date.now();
    }
    
    // Add unique ID if not present
    if (!message.id) {
      message.id = `${message.type}-${message.ts}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const newMessages = [...messages, message];
    
    set({ messages: newMessages });
    
    // Apply filters if not paused and in live mode
    if (isLiveMode && !isPaused) {
      applyFilters();
    }
  },

  clearMessages: () => {
    set({ messages: [], filteredMessages: [] });
  },

  setSelectedTab: (selectedTab: MessageType) => {
    set({ selectedTab });
    get().applyFilters();
  },

  setLiveMode: (isLiveMode: boolean) => {
    set({ isLiveMode });
    if (isLiveMode) {
      get().applyFilters();
    }
  },

  setPaused: (isPaused: boolean) => {
    set({ isPaused });
    if (!isPaused && get().isLiveMode) {
      get().applyFilters();
    }
  },

  setFilters: (newFilters: Partial<FilterState>) => {
    const { filters } = get();
    const updatedFilters = { ...filters, ...newFilters };
    set({ filters: updatedFilters });
    get().applyFilters();
  },

  setSelectedMessage: (selectedMessage: InspectorMessage | null) => {
    set({ selectedMessage });
  },

  setColumnVisibility: (column: string, visible: boolean) => {
    const { columnVisibility } = get();
    set({
      columnVisibility: {
        ...columnVisibility,
        [column]: visible,
      },
    });
  },

  applyFilters: () => {
    const { messages, filters, selectedTab } = get();
    
    let filtered = messages;

    // Filter by message type (tab selection takes precedence)
    const messageType = selectedTab === 'all' ? filters.messageType : selectedTab;
    if (messageType !== 'all') {
      filtered = filtered.filter((msg: InspectorMessage) => msg.type === messageType);
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((msg: InspectorMessage) => {
        const searchableText = [
          JSON.stringify(msg.data),
          JSON.stringify(msg.tags),
          msg.type,
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchLower);
      });
    }

    // Filter by time range
    if (filters.timeRange) {
      filtered = filtered.filter((msg: InspectorMessage) => {
        return msg.ts >= filters.timeRange!.start && msg.ts <= filters.timeRange!.end;
      });
    }

    // Filter by tags
    if (Object.keys(filters.tags).length > 0) {
      filtered = filtered.filter((msg: InspectorMessage) => {
        if (!msg.tags) return false;
        
        return Object.entries(filters.tags).every(([key, value]) => {
          return msg.tags![key] === value;
        });
      });
    }

    // Sort by timestamp (newest first)
    filtered.sort((a: InspectorMessage, b: InspectorMessage) => b.ts - a.ts);

    set({ filteredMessages: filtered });
  },
}));
