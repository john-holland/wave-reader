# 🌊 Wave Reader Structural System

This directory contains the structural system integration for Wave Reader, connecting existing component middleware tomes with enhanced message routing and state management.

## 🏗️ Architecture Overview

The Wave Reader Structural System provides a **bridge** between two state management systems:

1. **Existing System**: RobotProxy ProxyStateMachines (component middleware)
2. **New System**: Enhanced structural system with priority-based message routing

## 🔗 Key Components

### 1. **Tome Integration Bridge** (`tome-integration-bridge.ts`)
Connects existing component middleware tomes with the new structural system:

```typescript
import { TomeIntegrationBridge } from './components/structural';

const bridge = new TomeIntegrationBridge(messageRouter);

// Create bridge for a component
await bridge.createBridge({
  componentName: 'go-button',
  existingTomePath: '../component-middleware/go-button/GoButtonTomes.tsx',
  structuralTomeConfig: WaveReaderMainTome.machines.goButton,
  messageRouter: messageRouter
});
```

### 2. **Wave Reader Tome Config** (`wave-reader-tome-config.ts`)
Defines the state machine configurations and message routing for all components:

```typescript
import { WaveReaderMainTome, GoButtonTome } from './components/structural';

// Access individual tome configurations
const goButtonConfig = GoButtonTome.xstateConfig;
const mainAppConfig = WaveReaderMainTome.machines.mainApp.xstateConfig;
```

### 3. **Message Router** (`wave-reader-message-router.ts`)
Enhanced message routing with priority queuing, retry logic, and performance monitoring:

```typescript
import { useWaveReaderMessageRouter } from './components/structural';

const {
  isConnected,
  startWaveReader,
  stopWaveReader,
  messageStats
} = useWaveReaderMessageRouter({
  componentName: 'go-button',
  autoProcess: true,
  enableMetrics: true
});
```

## 🚀 Usage Examples

### **Basic Component Integration**

```tsx
import React from 'react';
import { useWaveReaderMessageRouter } from './components/structural';

const MyComponent = () => {
  const { isConnected, sendMessage } = useWaveReaderMessageRouter({
    componentName: 'my-component',
    autoProcess: true
  });

  const handleAction = async () => {
    if (isConnected) {
      const result = await sendMessage('ACTION_TYPE', 'target-component', { data: 'value' });
      console.log('Message sent:', result);
    }
  };

  return (
    <button onClick={handleAction} disabled={!isConnected}>
      Send Message
    </button>
  );
};
```

### **Dual System Integration**

```tsx
import React, { useState, useEffect } from 'react';
import { useWaveReaderMessageRouter, TomeIntegrationBridge } from './components/structural';

const EnhancedComponent = () => {
  const [tomeBridge, setTomeBridge] = useState(null);
  const { isConnected } = useWaveReaderMessageRouter({
    componentName: 'enhanced-component'
  });

  useEffect(() => {
    if (isConnected) {
      const bridge = new TomeIntegrationBridge(messageRouter);
      
      bridge.createBridge({
        componentName: 'enhanced-component',
        existingTomePath: '../component-middleware/enhanced/EnhancedTomes.tsx',
        structuralTomeConfig: WaveReaderMainTome.machines.enhanced,
        messageRouter: messageRouter
      }).then(() => {
        setTomeBridge(bridge);
      });
    }
  }, [isConnected]);

  const handleAction = async (event) => {
    if (tomeBridge) {
      // Send through both systems
      const result = await tomeBridge.sendMessage('enhanced-component', event);
      console.log('Dual system result:', result);
    }
  };

  return (
    <div>
      <div>Bridge Status: {tomeBridge ? '🟢 Active' : '🔴 Inactive'}</div>
      <button onClick={() => handleAction({ type: 'TEST_ACTION' })}>
        Test Dual System
      </button>
    </div>
  );
};
```

## 🔄 Message Flow

### **Single System (Structural)**
```
Component → Message Router → Priority Queue → Target Component
```

### **Dual System (Bridge)**
```
Component → TomeIntegrationBridge → [Existing System + Structural System]
                                    ↓
                              Synchronized State
```

## 📊 Monitoring and Debugging

### **Message Statistics**
```typescript
const { messageStats } = useWaveReaderMessageRouter({
  componentName: 'my-component',
  enableMetrics: true
});

console.log('Total Messages:', messageStats.totalMessages);
console.log('Success Rate:', messageStats.successRate);
console.log('Average Processing Time:', messageStats.averageProcessingTime);
```

### **Health Checks**
```typescript
const { healthCheck } = useWaveReaderMessageRouter({
  componentName: 'my-component'
});

const health = await healthCheck();
console.log('Component Health:', health);
```

## 🎯 Best Practices

### **1. Component Naming**
Use consistent component names that match your tome configurations:
```typescript
const componentName = 'go-button'; // Matches GoButtonTome.id
```

### **2. Message Types**
Define clear message types for your events:
```typescript
// Good
sendMessage('WAVE_READER_START', 'wave-reader', { selector: '.wave' });

// Avoid
sendMessage('start', 'wr', { sel: '.wave' });
```

### **3. Error Handling**
Always handle connection states and errors:
```typescript
const { isConnected, lastError } = useWaveReaderMessageRouter({
  componentName: 'my-component',
  onError: (error) => console.error('Message router error:', error)
});

if (!isConnected) {
  return <div>Connecting to message system...</div>;
}

if (lastError) {
  return <div>Error: {lastError.message}</div>;
}
```

### **4. Bridge Initialization**
Initialize bridges only when the message router is connected:
```typescript
useEffect(() => {
  if (isConnected && !tomeBridge) {
    initializeBridge();
  }
}, [isConnected, tomeBridge]);
```

## 🔧 Configuration

### **Structural Config**
```typescript
import { WaveReaderStructuralConfig } from './components/structural';

// Use the pre-configured structural config
const structuralSystem = new StructuralSystem(WaveReaderStructuralConfig);
```

### **Custom Tome Configs**
```typescript
import { WaveReaderMainTome } from './components/structural';

// Extend or modify existing configs
const customConfig = {
  ...WaveReaderMainTome,
  machines: {
    ...WaveReaderMainTome.machines,
    customMachine: {
      // Your custom machine config
    }
  }
};
```

## 🚨 Troubleshooting

### **Common Issues**

1. **Bridge Not Initializing**
   - Check if message router is connected
   - Verify component name matches tome configuration
   - Check console for import errors

2. **Messages Not Routing**
   - Verify message types match routing configuration
   - Check if target components are registered
   - Ensure message router is connected

3. **State Synchronization Issues**
   - Use bridge.syncStates() to manually sync
   - Check if both systems are receiving events
   - Verify tome configurations match

### **Debug Mode**
Enable debug information in development:
```typescript
{process.env.NODE_ENV === 'development' && (
  <div className="debug-section">
    <h4>Debug Information</h4>
    <div>Connection: {isConnected ? '🟢' : '🔴'}</div>
    <div>Bridge: {tomeBridge ? '🟢' : '🔴'}</div>
    <div>Messages: {messageStats.totalMessages}</div>
  </div>
)}
```

## 📚 Related Documentation

- [Structural System Comprehensive Guide](../../markdown_documents/STRUCTURAL_SYSTEM_COMPREHENSIVE.md)
- [Message Router Documentation](./wave-reader-message-router.ts)
- [Tome Configuration](./wave-reader-tome-config.ts)
- [Component Integration Examples](./component-integration-example.tsx)

## 🎉 Getting Started

1. **Install Dependencies**: Ensure `log-view-machine` is properly installed
2. **Import Components**: Use the pre-configured structural components
3. **Create Bridges**: Connect existing tomes with the structural system
4. **Send Messages**: Use the enhanced message router for communication
5. **Monitor Performance**: Track message statistics and system health

The Wave Reader Structural System provides a powerful, flexible foundation for building complex state management applications while maintaining compatibility with existing systems! 🚀
