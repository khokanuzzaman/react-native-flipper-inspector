# Flipper Plugin for React Native Inspector

Desktop plugin for Flipper that provides a comprehensive debugging interface for React Native Flipper Inspector.

## Features

- 📊 **Real-time Monitoring**: Live view of logs, errors, metrics, traces, and state changes
- 🔍 **Advanced Filtering**: Search, filter by type, time range, and custom tags
- 📋 **Data Export**: Export filtered data as CSV or JSON
- 🎯 **Detailed Inspection**: Click any message to view full details and data
- ⚡ **Performance Optimized**: Efficient rendering and memory management
- 🎨 **Clean UI**: Intuitive interface designed for developer productivity

## Installation

### Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   cd packages/flipper-plugin-rn-inspector
   pnpm install
   ```

3. Build the plugin:
   ```bash
   pnpm build
   ```

4. Link the plugin to Flipper:
   ```bash
   # Create a symlink in your Flipper plugins directory
   ln -s $(pwd)/dist ~/.flipper/plugins/react-native-flipper-inspector
   ```

### Production Installation

The plugin will be automatically detected by Flipper when the React Native app is running and connected.

## Usage

1. Start your React Native app in debug mode
2. Open Flipper
3. The "RN Inspector" plugin should appear in the sidebar
4. Click on it to open the debugging interface

## Interface Overview

### Toolbar
- **Live Mode Toggle**: Switch between live monitoring and static view
- **Pause/Resume**: Pause live updates to inspect current state
- **Search**: Filter messages by content
- **Type Filter**: Filter by message type (logs, errors, metrics, etc.)
- **Export**: Export filtered data as CSV or JSON
- **Clear**: Clear all messages

### Message Table
- **Timestamp**: When the message was created
- **Type**: Message type with color coding
- **Event**: Event name or identifier
- **Data**: Truncated preview of message data
- **Tags**: Associated tags

### Detail Panel
- **Full Message Details**: Complete message data in JSON format
- **Tags**: All associated tags
- **Metadata**: Timestamp, ID, and other metadata

## Message Types

### Log Messages
- **Purpose**: General application events and debugging information
- **Color**: Blue
- **Data**: Event name and optional payload

### Error Messages
- **Purpose**: Application errors and exceptions
- **Color**: Red
- **Data**: Error message, stack trace, and metadata

### Metric Messages
- **Purpose**: Performance metrics and measurements
- **Color**: Green
- **Data**: Metric name, value, and optional unit

### State Messages
- **Purpose**: Application state changes
- **Color**: Purple
- **Data**: State section, action, and data

### Trace Messages
- **Purpose**: Performance tracing and timing
- **Color**: Orange
- **Data**: Trace name, duration, and extra information

### Network Messages
- **Purpose**: HTTP requests and responses
- **Color**: Teal
- **Data**: Method, URL, status, timing, and size information

## Keyboard Shortcuts

- `Ctrl/Cmd + F`: Focus search input
- `Ctrl/Cmd + E`: Export current view
- `Ctrl/Cmd + K`: Clear all messages
- `Space`: Pause/Resume live mode

## Development

### Building
```bash
pnpm build
```

### Development Mode
```bash
pnpm dev
```

### Linting
```bash
pnpm lint
pnpm lint:fix
```

## Architecture

The plugin is built using:
- **React**: UI framework
- **Zustand**: State management
- **TypeScript**: Type safety
- **Webpack**: Bundling

### Key Components

- `App.tsx`: Main application component
- `Toolbar.tsx`: Top toolbar with controls and filters
- `MessageTable.tsx`: Table view of messages
- `MessageDetail.tsx`: Detailed view of selected message
- `store/index.ts`: Zustand store for state management
- `utils/index.ts`: Utility functions for formatting and export

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT
