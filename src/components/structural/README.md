# 🌊 Wave Reader Structural System

This directory contains the structural system integration for Wave Reader. Component middleware uses the structural system for message routing and state management.

## 🏗️ Architecture Overview

The Wave Reader Structural System provides the foundation for component middleware:

**Component Middleware** → **Structural System** → **Foundation Services**

Component middleware (React components with UI and business logic) uses the structural system for:
- Message routing with priority queuing
- State management
- Performance monitoring
- Health checks

## 🔗 Key Components

### 1. **Message Router** (`wave-reader-message-router.ts`)
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

### 2. **Wave Reader Tome Config** (`wave-reader-tome-config.ts`)
Defines the state machine configurations and message routing for all components:

```typescript
import { WaveReaderMainTome, GoButtonTome } from './components/structural';

// Access individual tome configurations
const goButtonConfig = GoButtonTome.xstateConfig;
const mainAppConfig = WaveReaderMainTome.machines.mainApp.xstateConfig;
```

### 3. **Component Middleware Adapter** (`tome-integration-bridge.ts`)
Optional adapter for component middleware to use the structural system:

```typescript
import { ComponentMiddlewareAdapter } from './components/structural';

const adapter = new ComponentMiddlewareAdapter(messageRouter);

// Create adapter for a component
await adapter.createAdapter({
  componentName: 'go-button',
  structuralTomeConfig: WaveReaderMainTome.machines.goButton,
  messageRouter: messageRouter
});
```

## 🚀 Usage Examples

### **Basic Component Integration**

Component middleware uses the structural system directly via the message router hook:

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

### **Component with State Management**

```tsx
import React, { useState } from 'react';
import { useWaveReaderMessageRouter } from './components/structural';

const EnhancedComponent = () => {
  const [isActive, setIsActive] = useState(false);
  
  const { isConnected, startWaveReader, stopWaveReader, messageStats } = useWaveReaderMessageRouter({
    componentName: 'enhanced-component',
    autoProcess: true,
    enableMetrics: true
  });

  const handleStart = async () => {
    if (!isConnected) return;
    
    const result = await startWaveReader('.wave-selector');
    if (result.success) {
      setIsActive(true);
    }
  };

  const handleStop = async () => {
    if (!isConnected) return;
    
    const result = await stopWaveReader();
    if (result.success) {
      setIsActive(false);
    }
  };

  return (
    <div>
      <div>Connection: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>
      <div>Status: {isActive ? '🟢 Active' : '⚪ Inactive'}</div>
      <button onClick={handleStart} disabled={!isConnected || isActive}>
        Start
      </button>
      <button onClick={handleStop} disabled={!isConnected || !isActive}>
        Stop
      </button>
    </div>
  );
};
```

## 🔄 Message Flow

```
Component Middleware
    ↓
Message Router (Structural System)
    ↓
Priority Queue
    ↓
Target Component
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

1. **Messages Not Routing**
   - Verify message types match routing configuration
   - Check if target components are registered
   - Ensure message router is connected

2. **Connection Issues**
   - Check if structural system is initialized
   - Verify component name matches tome configuration
   - Check console for initialization errors

### **Debug Mode**
Enable debug information in development:
```typescript
{process.env.NODE_ENV === 'development' && (
  <div className="debug-section">
    <h4>Debug Information</h4>
    <div>Connection: {isConnected ? '🟢' : '🔴'}</div>
    <div>Messages: {messageStats.totalMessages}</div>
    <div>Success Rate: {messageStats.successRate.toFixed(1)}%</div>
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
3. **Use Message Router**: Component middleware uses the message router hook for communication
4. **Send Messages**: Use the enhanced message router for all component communication
5. **Monitor Performance**: Track message statistics and system health

The Wave Reader Structural System provides a powerful, flexible foundation for building complex state management applications! 🚀
