# 🌊 Log-View-Machine Architecture

## Overview

The Log-View-Machine Architecture is a comprehensive refactor of the Wave Reader extension that unifies all components under a consistent message system, state management, and logging framework. This architecture ensures tight integration between the frontend, content scripts, background scripts, and ML services.

## 🏗️ Architecture Components

### 1. Core Message System

#### Message Factory (`src/models/messages/log-view-messages.ts`)
- **Purpose**: Centralized message creation and management
- **Features**:
  - Creates typed message instances
  - Ensures consistent message structure
  - Provides legacy message aliases
  - Supports all venture states

#### Log-View Message Utility (`src/util/log-view-messages.ts`)
- **Purpose**: Message routing, validation, and history management
- **Features**:
  - Message validation against venture states
  - Routing between components
  - Message history tracking
  - Statistics and analytics
  - Component-specific message creation

### 2. Venture State Management

#### Venture States (`src/util/venture-states.ts`)
- **Purpose**: Defines all possible state transitions and operations
- **Categories**:
  - **Base Ventures**: `start`, `stop`, `update`
  - **Start Ventures**: `toggle start`, `start mouse`, `start-selection-choose`
  - **Stop Ventures**: `toggle stop`, `stop mouse`, `end-selection-choose`
  - **Waving Ventures**: `selection mode activate`, `selection made`, `selection mode deactivate`
  - **ML Ventures**: `ml-recommendation`, `settings-reset`, `behavior-pattern`
  - **Wave Reader Ventures**: `wave-reader-start`, `wave-reader-stop`, `wave-reader-update`
  - **Analytics Ventures**: `analytics`, `health-check`
  - **Extension Ventures**: `extension-install`, `extension-update`

### 3. Content Script Systems

#### Log-View Content System (`src/content-scripts/log-view-content-system.ts`)
- **Purpose**: Main content script for regular web pages
- **Features**:
  - Shadow DOM management
  - Wave animation control
  - ML service integration
  - State machine management
  - Message routing and logging

#### Log-View Shadow System (`src/content-scripts/log-view-shadow-system.ts`)
- **Purpose**: Specialized content script for shadow DOM operations
- **Features**:
  - Enhanced shadow DOM handling
  - Mouse-following wave animations
  - Advanced selector UI management
  - Performance-optimized rendering

### 4. Background System

#### Log-View Background System (`src/background-scripts/log-view-background-system.ts`)
- **Purpose**: Extension background script with ML integration
- **Features**:
  - Chrome extension event handling
  - Tab management and monitoring
  - ML service coordination
  - Message forwarding between components
  - Health monitoring and analytics

### 5. ML Service Integration

#### ML Settings Service (`src/services/ml-settings-service.ts`)
- **Purpose**: Machine learning-driven settings recommendations
- **Features**:
  - K-nearest neighbors algorithm
  - Heavily weighted artificial defaults
  - Statistical bounds enforcement
  - User behavior pattern learning
  - Domain-specific recommendations

## 🔄 Message Flow

### 1. Extension Initialization
```
Extension Load → Background System → ML Service Init → Content Scripts → State Machine Init
```

### 2. User Interaction Flow
```
User Action → Popup → Background → Content Script → State Machine → UI Update → Log Entry
```

### 3. ML Recommendation Flow
```
Content Script → ML Service → Statistical Bounds → Settings Application → Animation Update
```

## 🎯 Key Features

### 1. **Unified Message System**
- All components use the same message format
- Consistent naming conventions
- Type-safe message creation
- Comprehensive validation

### 2. **State Machine Integration**
- Every action updates the state machine
- Venture states align with message names
- State transitions are logged and tracked
- Consistent state management across components

### 3. **ML-Driven Intelligence**
- Automatic settings recommendations
- Domain-specific optimizations
- Statistical bounds enforcement
- User behavior learning

### 4. **Comprehensive Logging**
- All operations are logged with context
- Session-based message tracking
- Performance metrics collection
- Debug information in development

### 5. **Shadow DOM Support**
- Advanced shadow DOM management
- Mouse-following animations
- Isolated styling and components
- Performance optimization

## 🚀 Usage Examples

### Creating a Message
```typescript
import { MessageFactory } from '../models/messages/log-view-messages';

const message = MessageFactory.createMessage('start', 'popup', {
    timestamp: Date.now(),
    userId: 'user123'
});
```

### Routing a Message
```typescript
import { LogViewMessageUtility } from '../util/log-view-messages';

const route = LogViewMessageUtility.routeMessage(
    'popup',
    'content-script',
    message,
    sessionId
);
```

### Getting Message History
```typescript
const history = LogViewMessageUtility.getMessageHistory();
const componentMessages = LogViewMessageUtility.getMessagesByComponent('popup');
const sessionMessages = LogViewMessageUtility.getMessagesBySession(sessionId);
```

### ML Service Integration
```typescript
import { MLSettingsService } from '../services/ml-settings-service';

const mlService = new MLSettingsService();
const recommendations = await mlService.getSettingsRecommendations(
    'example.com',
    '/page',
    'p, h1, h2'
);
```

## 🔧 Configuration

### Venture State Configuration
```typescript
// Add new venture states
export const CustomVentures: string[] = [
    'custom-action-1',
    'custom-action-2'
];

// Update AllVentures array
export const AllVentures: string[] = [
    ...BaseVentures,
    ...CustomVentures,
    // ... other ventures
];
```

### ML Service Configuration
```typescript
// Adjust statistical bounds
private maxStandardDeviations = 2; // Limit to 2 standard deviations

// Modify artificial weight multiplier
private artificialWeightMultiplier = 3; // 3x weight for artificial defaults
```

## 📊 Monitoring and Debugging

### Health Checks
```typescript
// Request health check from any component
chrome.runtime.sendMessage({
    from: 'popup',
    name: 'health-check'
});

// Health check response includes:
// - Component status
// - Message history length
// - State machine state
// - Service availability
// - Performance metrics
```

### Message Statistics
```typescript
const stats = LogViewMessageUtility.getMessageStats();
// Returns:
// - Total messages
// - Messages by component
// - Messages by type
// - Average response time
// - Error rates
```

## 🧪 Testing

### Unit Tests
```bash
# Test message system
npx jest test/util/log-view-messages.test.js

# Test ML service
npx jest test/services/ml-settings-service.test.ts

# Test venture states
npx jest test/util/venture-states.test.ts
```

### Integration Tests
```bash
# Test content system integration
npx jest test/content-scripts/

# Test background system integration
npx jest test/background-scripts/
```

## 🔒 Security Features

### 1. **Message Validation**
- All messages are validated against venture states
- Unknown message types are rejected
- Message routing is restricted to valid components

### 2. **Session Isolation**
- Each component has a unique session ID
- Messages are tracked per session
- Cross-session communication is logged

### 3. **URL Validation**
- Restricted URLs are blocked (chrome://, chrome-extension://)
- Content scripts only run on accessible pages
- Background script validates all tab operations

## 📈 Performance Optimizations

### 1. **Message Batching**
- Messages are processed in batches when possible
- History is limited to prevent memory leaks
- Efficient message routing algorithms

### 2. **State Machine Optimization**
- Lazy state initialization
- Efficient state transition lookups
- Minimal state effect execution

### 3. **ML Service Optimization**
- Cached recommendations
- Efficient pattern matching
- Statistical calculations are memoized

## 🚨 Error Handling

### 1. **Graceful Degradation**
- Components continue working if ML service fails
- Fallback to default settings
- Error logging without breaking functionality

### 2. **Error Recovery**
- Automatic retry mechanisms
- State machine rollback on errors
- Component reinitialization if needed

### 3. **User Feedback**
- Error messages are user-friendly
- Status indicators show component health
- Recovery suggestions are provided

## 🔄 Migration Guide

### From Old System
1. **Replace old content scripts** with new log-view systems
2. **Update message handling** to use MessageFactory
3. **Migrate state management** to venture states
4. **Integrate ML service** for intelligent defaults
5. **Update logging** to use new message system

### Benefits of Migration
- **Consistency**: All components use the same patterns
- **Maintainability**: Centralized message and state management
- **Intelligence**: ML-driven optimizations
- **Reliability**: Comprehensive error handling and logging
- **Performance**: Optimized message routing and state management

## 🎯 Future Enhancements

### 1. **Advanced ML Features**
- Deep learning models for better recommendations
- User preference learning over time
- Cross-domain pattern recognition

### 2. **Enhanced Analytics**
- Real-time performance monitoring
- User behavior analytics
- A/B testing framework

### 3. **Plugin System**
- Extensible venture states
- Custom message types
- Third-party integrations

## 📚 Related Documentation

- [ML Service Documentation](./ML_SERVICE_README.md)
- [Message System API](./MESSAGE_SYSTEM_API.md)
- [Venture States Reference](./VENTURE_STATES_REFERENCE.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

---

**🌊 Wave Reader Log-View-Machine Architecture** - Ensuring tight integration and intelligent operation across all components.
