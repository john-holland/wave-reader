# 🌊 Wave Reader Structural System - Comprehensive Guide

## Overview

The Wave Reader Structural System provides a comprehensive state management and message routing solution using the `log-view-machine` framework. This system enables components to communicate seamlessly through structured state machines with automatic message routing, error handling, and performance monitoring.

## 🏗️ System Architecture

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
│                Structural System Integration                │ │
│              (log-view-machine framework)                  │ │
└─────────────────────────────────────────────────────────────┘
```

## 📚 Core Components

### 1. Tome Configurations

The system provides several pre-configured tomes that can be imported and used directly:

```tsx
import { 
  WaveReaderMainTome,
  WaveTabsTome, 
  WaveReaderTome, 
  GoButtonTome,
  SelectorInputTome,
  SettingsTome,
  AboutTome
} from './components/structural';
```

#### Main Application Tome
```tsx
// The main tome coordinates all components
const mainTome = WaveReaderMainTome.machines.mainApp;

// Access main app states
const mainStates = mainTome.xstateConfig.states;
const mainContext = mainTome.xstateConfig.context;
```

#### Component-Specific Tomes
```tsx
// Each component has its own state machine
const waveReaderTome = WaveReaderTome;
const goButtonTome = GoButtonTome;
const selectorInputTome = SelectorInputTome;
const settingsTome = SettingsTome;
const aboutTome = AboutTome;
```

### 2. Structural System Configuration

```tsx
import { WaveReaderStructuralConfig } from './components/structural';

// The structural config defines the entire system
const config = WaveReaderStructuralConfig;

// Access component mappings
const componentMappings = config.ComponentTomeMapping;
const routingConfig = config.RoutingConfig;
const messageRouting = config.MessageRouting;
```

### 3. Message Router

```tsx
import { 
  WaveReaderMessageRouter, 
  waveReaderMessageRouter 
} from './components/structural';

// Use the singleton instance
const messageRouter = waveReaderMessageRouter;

// Or create a new instance
const customRouter = new WaveReaderMessageRouter();
```

### 4. React Hook Integration

```tsx
import { useWaveReaderMessageRouter } from './components/structural';

const {
  isConnected,
  sendMessage,
  startWaveReader,
  stopWaveReader,
  messageStats
} = useWaveReaderMessageRouter({
  componentName: 'my-component'
});
```

## 🚀 Quick Start

### 1. Basic Component Integration

```tsx
import { useWaveReaderMessageRouter } from './components/structural';

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

### 2. Using Pre-configured Tomes

```tsx
import { 
  WaveReaderTome, 
  GoButtonTome,
  useWaveReaderMessageRouter 
} from './components/structural';

const WaveReaderComponent = () => {
  const { sendMessage } = useWaveReaderMessageRouter({
    componentName: 'wave-reader'
  });

  // Access tome configuration
  const waveReaderStates = WaveReaderTome.xstateConfig.states;
  const goButtonStates = GoButtonTome.xstateConfig.states;

  const handleStateTransition = async (newState: string) => {
    await sendMessage('STATE_TRANSITION', 'wave-reader', { 
      targetState: newState 
    });
  };

  return (
    <div>
      <h3>Wave Reader States</h3>
      <ul>
        {Object.keys(waveReaderStates).map(state => (
          <li key={state}>
            <button onClick={() => handleStateTransition(state)}>
              {state}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### 3. Advanced Message Routing

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

## 🎯 Implementation Examples

### Complete Component Example

```tsx
import React, { useEffect, useState } from 'react';
import { useWaveReaderMessageRouter } from './components/structural';

const WaveReaderControl = () => {
  const [isActive, setIsActive] = useState(false);
  const [selector, setSelector] = useState('');

  const {
    isConnected,
    startWaveReader,
    stopWaveReader,
    updateSelector,
    messageStats,
    lastError
  } = useWaveReaderMessageRouter({
    componentName: 'wave-reader-control',
    autoProcess: true,
    enableMetrics: true,
    onError: (error) => {
      console.error('Wave reader control error:', error);
    }
  });

  const handleStart = async () => {
    if (!isConnected || !selector.trim()) return;

    try {
      const result = await startWaveReader(selector);
      if (result.success) {
        setIsActive(true);
        console.log('Wave reader started successfully');
      }
    } catch (error) {
      console.error('Failed to start wave reader:', error);
    }
  };

  const handleStop = async () => {
    if (!isConnected) return;

    try {
      const result = await stopWaveReader();
      if (result.success) {
        setIsActive(false);
        console.log('Wave reader stopped successfully');
      }
    } catch (error) {
      console.error('Failed to stop wave reader:', error);
    }
  };

  const handleSelectorChange = async (newSelector: string) => {
    setSelector(newSelector);
    
    if (isConnected && newSelector.trim()) {
      try {
        await updateSelector(newSelector);
      } catch (error) {
        console.error('Failed to update selector:', error);
      }
    }
  };

  return (
    <div className="wave-reader-control">
      <h3>Wave Reader Control</h3>
      
      <div className="control-inputs">
        <input
          type="text"
          value={selector}
          onChange={(e) => handleSelectorChange(e.target.value)}
          placeholder="Enter CSS selector (e.g., .target-element)"
          disabled={!isConnected}
        />
        
        <button
          onClick={handleStart}
          disabled={!isConnected || !selector.trim() || isActive}
          className="start-button"
        >
          Start Reading
        </button>
        
        <button
          onClick={handleStop}
          disabled={!isConnected || !isActive}
          className="stop-button"
        >
          Stop Reading
        </button>
      </div>

      <div className="status-info">
        <div>Connection: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>
        <div>Status: {isActive ? '🟢 Active' : '⚪ Inactive'}</div>
        {lastError && <div className="error">Error: {lastError}</div>}
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <h4>Debug Information</h4>
          <div>Total Messages: {messageStats.totalMessages}</div>
          <div>Success Rate: {messageStats.successRate.toFixed(1)}%</div>
          <div>Average Processing Time: {messageStats.averageProcessingTime.toFixed(2)}ms</div>
          <div>Error Count: {messageStats.errorCount}</div>
        </div>
      )}
    </div>
  );
};

export default WaveReaderControl;
```

This comprehensive guide provides everything needed to integrate with the Wave Reader Structural System, using the pre-configured tomes and components that are exported from the structural directory.
