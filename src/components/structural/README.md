# 🌊 Wave Reader Structural System

## Overview

The Wave Reader Structural System provides a comprehensive state management and message routing solution using the `log-view-machine` framework. This system enables components to communicate seamlessly through structured state machines with automatic message routing, error handling, and performance monitoring.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                Wave Reader Structural System                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │   Tome Configs     │    │   Message Router           │ │
│  │                     │    │                             │ │
│  │ • Main App Tome    │    │ • Priority-based routing   │ │
│  │ • Component Tomes  │    │ • Error handling           │ │
│  │ • State machines   │    │ • Performance monitoring   │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                Structural System Integration                │
│              (log-view-machine framework)                  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Basic Component Integration

```tsx
import { useWaveReaderMessageRouter } from './structural/useWaveReaderMessageRouter';

const MyComponent = () => {
  const {
    isConnected,
    startWaveReader,
    stopWaveReader,
    messageStats
  } = useWaveReaderMessageRouter({
    componentName: 'my-component',
    autoProcess: true,
    enableMetrics: true
  });

  const handleStart = async () => {
    if (isConnected) {
      const result = await startWaveReader();
      if (result.success) {
        console.log('Wave reader started successfully');
      }
    }
  };

  return (
    <div>
      <button onClick={handleStart} disabled={!isConnected}>
        Start Wave Reader
      </button>
      <div>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>
      <div>Messages: {messageStats.totalMessages}</div>
    </div>
  );
};
```

### 2. Advanced Message Routing

```tsx
const {
  sendMessage,
  sendMessageWithRetry,
  broadcastMessage
} = useWaveReaderMessageRouter({
  componentName: 'advanced-component'
});

// Send a custom message
await sendMessage('CUSTOM_EVENT', 'target-component', { data: 'value' }, 'high');

// Send with retry logic
await sendMessageWithRetry('IMPORTANT_EVENT', 'target-component', { data: 'value' }, 'critical', 5);

// Broadcast to multiple components
await broadcastMessage('NOTIFICATION', ['component1', 'component2'], { message: 'Hello' });
```

## 📚 Core Components

### 1. Tome Configurations

#### Main Application Tome
```tsx
import { WaveReaderMainTome } from './structural';

// The main tome coordinates all components
const mainTome = WaveReaderMainTome.machines.mainApp;
```

#### Component-Specific Tomes
```tsx
import { 
  WaveTabsTome, 
  WaveReaderTome, 
  GoButtonTome,
  SelectorInputTome,
  SettingsTome,
  AboutTome
} from './structural';

// Each component has its own state machine
const waveReaderTome = WaveReaderTome;
const goButtonTome = GoButtonTome;
```

### 2. Message Router

#### Direct Usage
```tsx
import { waveReaderMessageRouter } from './structural';

// Send a message directly
const result = await waveReaderMessageRouter.sendMessage({
  type: 'WAVE_READER_START',
  source: 'my-component',
  target: 'wave-reader',
  priority: 'high',
  data: { selector: '.target-element' }
});
```

#### React Hook Usage
```tsx
const {
  sendMessage,
  routeMessage,
  messageStats
} = useWaveReaderMessageRouter({
  componentName: 'my-component'
});

// The hook provides convenient methods
await sendMessage('WAVE_READER_START', 'wave-reader', { selector: '.target' });
```

### 3. Structural System

#### System Configuration
```tsx
import { WaveReaderStructuralConfig } from './structural';

// The structural config defines the entire system
const config = WaveReaderStructuralConfig;
```

## 🔄 Message Flow Examples

### 1. Starting Wave Reader

```tsx
// 1. Go Button sends start message
await sendMessage('WAVE_READER_START', 'wave-reader', { selector: '.target' }, 'high');

// 2. Message router routes to wave-reader component
// 3. Wave reader state machine transitions to 'starting' state
// 4. Wave reader initializes and sends 'START_COMPLETE' event
// 5. State machine transitions to 'reading' state
// 6. Wave animation begins
```

### 2. Tab Navigation

```tsx
// 1. User clicks tab
await sendMessage('TAB_CHANGE', 'wave-tabs', { tabId: 'settings' }, 'normal');

// 2. Message router routes to wave-tabs component
// 3. Tab state machine transitions to 'tabSelected' state
// 4. Tab component updates UI
// 5. Navigation occurs
// 6. 'TAB_SELECTION_COMPLETE' event sent
```

### 3. Settings Update

```tsx
// 1. Settings component sends update
await sendMessage('SETTING_CHANGE', 'settings', { 
  waveSpeed: 1500,
  waveColor: '#ff6b6b'
}, 'normal');

// 2. Message router routes to settings component
// 3. Settings state machine transitions to 'modified' state
// 4. Settings are updated
// 5. 'SETTINGS_SAVED' event sent to main app
```

## 🎯 Priority Levels

### Message Priorities

- **`critical`**: Immediate processing, 1s timeout, 3 retries
- **`high`**: High priority, 2s timeout, 2 retries  
- **`normal`**: Standard priority, 5s timeout, 1 retry
- **`low`**: Low priority, 10s timeout, no retries

### Usage Examples

```tsx
// Critical: Error handling
await sendMessage('ERROR', 'main-app', { error: 'Critical failure' }, 'critical');

// High: Wave reader control
await sendMessage('WAVE_READER_START', 'wave-reader', {}, 'high');

// Normal: Settings updates
await sendMessage('SETTING_CHANGE', 'settings', { theme: 'dark' }, 'normal');

// Low: Analytics events
await sendMessage('ANALYTICS', 'analytics', { event: 'user_action' }, 'low');
```

## 📊 Monitoring and Health

### Health Checks

```tsx
const { healthCheck } = useWaveReaderMessageRouter({
  componentName: 'my-component'
});

const health = await healthCheck();
console.log('System Status:', health.status);
console.log('Message:', health.message);
console.log('Metrics:', health.metrics);
```

### Performance Metrics

```tsx
const { messageStats } = useWaveReaderMessageRouter({
  componentName: 'my-component'
});

console.log('Total Messages:', messageStats.totalMessages);
console.log('Success Rate:', messageStats.successRate.toFixed(1) + '%');
console.log('Average Processing Time:', messageStats.averageProcessingTime + 'ms');
console.log('Error Count:', messageStats.errorCount);
console.log('Queue Sizes:', messageStats.queueSizes);
```

## 🛠️ Error Handling

### Automatic Error Handling

```tsx
const { sendMessageWithRetry } = useWaveReaderMessageRouter({
  componentName: 'my-component'
});

try {
  // Send with automatic retry
  const result = await sendMessageWithRetry(
    'WAVE_READER_START', 
    'wave-reader', 
    {}, 
    'high', 
    3
  );
} catch (error) {
  console.error('Failed after retries:', error);
}
```

### Custom Error Handling

```tsx
const { sendMessage } = useWaveReaderMessageRouter({
  componentName: 'my-component',
  onError: (error) => {
    console.error('Message router error:', error);
    // Handle error (show notification, retry, etc.)
  }
});
```

## 🔧 Configuration

### Component Configuration

```tsx
const {
  isConnected,
  messageStats
} = useWaveReaderMessageRouter({
  componentName: 'my-component',
  autoProcess: true,        // Auto-process queued messages
  enableMetrics: true,      // Enable performance metrics
  onMessageReceived: (message) => {
    console.log('Message received:', message);
  },
  onError: (error) => {
    console.error('Error occurred:', error);
  }
});
```

### System Configuration

The system is configured through `WaveReaderStructuralConfig` which includes:

- **Component Tome Mapping**: Maps components to their state machines
- **Routing Configuration**: Defines application routes and navigation
- **Message Routing**: Configures message flow between components
- **Performance Settings**: Defines timeouts, queue sizes, and monitoring
- **Error Handling**: Configures retry strategies and recovery mechanisms

## 📝 Best Practices

### 1. Component Design

- Use descriptive component names for message routing
- Implement proper error handling and fallbacks
- Use appropriate priority levels for different message types
- Monitor message statistics for performance insights

### 2. Message Design

- Use consistent message type naming conventions
- Include necessary data in message payloads
- Set appropriate priority levels based on urgency
- Handle message failures gracefully

### 3. State Management

- Keep component state machines simple and focused
- Use the structural system for cross-component communication
- Implement proper state transitions and error states
- Monitor state machine performance

### 4. Performance

- Use message batching for multiple updates
- Monitor queue sizes and processing times
- Implement appropriate timeouts and retry strategies
- Use health checks for system monitoring

## 🚨 Troubleshooting

### Common Issues

1. **Message Router Not Connected**
   - Check if `log-view-machine` is properly installed
   - Verify structural system initialization
   - Check console for connection errors

2. **Messages Not Being Routed**
   - Verify component names match configuration
   - Check message type routing rules
   - Ensure target components exist

3. **Performance Issues**
   - Monitor message queue sizes
   - Check processing times and success rates
   - Review priority level usage

4. **State Machine Errors**
   - Verify tome configurations
   - Check state transition definitions
   - Review event handling logic

### Debug Mode

Enable debug mode for detailed logging:

```tsx
const { messageStats, lastError } = useWaveReaderMessageRouter({
  componentName: 'my-component',
  enableMetrics: true
});

// Debug information is available in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('Message Stats:', messageStats);
  console.log('Last Error:', lastError);
}
```

## 🔮 Future Enhancements

- **Real-time Metrics Dashboard**: WebSocket-based real-time monitoring
- **Advanced Routing Rules**: Conditional routing based on message content
- **Message Persistence**: Store and replay message history
- **Load Balancing**: Distribute messages across multiple instances
- **Plugin System**: Extensible message routing and processing

## 📚 Additional Resources

- [log-view-machine Documentation](../README.md)
- [Structural System Architecture](./STRUCTURAL_SYSTEM_INTEGRATION_README.md)
- [Tome Metadata System](./TOME_METADATA_SYSTEM_SUMMARY.md)
- [Component Integration Examples](./StructuralExample.tsx)
