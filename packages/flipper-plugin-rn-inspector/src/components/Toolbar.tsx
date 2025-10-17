import React from 'react';
import { useStore } from '../store';
import { exportToCSV, exportToJSON, copyToClipboard } from '../utils';

// Simple input and select components since we don't have antd
const Search = ({ placeholder, onSearch, allowClear, style, ...props }: any) => (
  <input
    type="text"
    placeholder={placeholder}
    style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: '4px', ...style }}
    onChange={(e) => onSearch && onSearch(e.target.value)}
    {...props}
  />
);

const Select = ({ value, onChange, children, style, size, ...props }: any) => (
  <select
    value={value}
    onChange={(e) => onChange && onChange(e.target.value)}
    style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: '4px', ...style }}
    {...props}
  >
    {children}
  </select>
);

const Option = ({ value, children }: any) => (
  <option value={value}>{children}</option>
);

const Button = ({ type, size, onClick, children, danger, ...props }: any) => {
  const styles: React.CSSProperties = {
    padding: '4px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    backgroundColor: type === 'primary' ? '#1890ff' : danger ? '#ff4d4f' : '#fff',
    color: type === 'primary' || danger ? '#fff' : '#000',
    borderColor: type === 'primary' ? '#1890ff' : danger ? '#ff4d4f' : '#d9d9d9',
  };
  
  return (
    <button style={styles} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export const Toolbar: React.FC = () => {
  const {
    isLiveMode,
    isPaused,
    filters,
    messages,
    filteredMessages,
    setLiveMode,
    setPaused,
    setFilters,
    clearMessages,
  } = useStore();

  const handleSearch = (value: string) => {
    setFilters({ search: value });
  };

  const handleMessageTypeFilter = (type: string) => {
    setFilters({ messageType: type as any });
  };

  const handleExportCSV = async () => {
    // TODO: Implement CSV export
    console.log('CSV export not yet implemented');
  };

  const handleExportJSON = async () => {
    // TODO: Implement JSON export
    console.log('JSON export not yet implemented');
  };

  const handleClear = () => {
    clearMessages();
  };

  return (
    <div style={{ 
      padding: '12px', 
      borderBottom: '1px solid #e8e8e8',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap'
    }}>
      {/* Live Mode Toggle */}
      <Button
        type={isLiveMode ? 'primary' : 'default'}
        size="small"
        onClick={() => setLiveMode(!isLiveMode)}
      >
        {isLiveMode ? '🔴 Live' : '⚪ Static'}
      </Button>

      {/* Pause Toggle */}
      {isLiveMode && (
        <Button
          type={isPaused ? 'default' : 'primary'}
          size="small"
          onClick={() => setPaused(!isPaused)}
        >
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </Button>
      )}

      {/* Search */}
      <Search
        placeholder="Search messages..."
        size="small"
        style={{ width: 200 }}
        onSearch={handleSearch}
        allowClear
      />

      {/* Message Type Filter */}
      <Select
        value={filters.messageType}
        size="small"
        style={{ width: 120 }}
        onChange={handleMessageTypeFilter}
      >
        <Option value="all">All Types</Option>
        <Option value="log">Logs</Option>
        <Option value="error">Errors</Option>
        <Option value="metric">Metrics</Option>
        <Option value="state">State</Option>
        <Option value="trace">Traces</Option>
        <Option value="network">Network</Option>
      </Select>

      {/* Stats */}
      <span style={{ fontSize: '12px', color: '#666' }}>
        {filteredMessages.length} / {messages.length} messages
      </span>

      {/* Actions */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
        <Button size="small" onClick={handleExportCSV}>
          Export CSV
        </Button>
        <Button size="small" onClick={handleExportJSON}>
          Export JSON
        </Button>
        <Button size="small" danger onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  );
};
