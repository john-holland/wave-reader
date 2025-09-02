# LogViewContentSystem Refactoring to Tome Architecture

## Overview
The `LogViewContentSystem` has been refactored to use a **Tome** and **TomeConnector** architecture, aligning it with the overarching state machine pattern used throughout the Wave Reader extension.

## What Was Refactored

### 1. **LogViewContentSystemTome** (`src/content-scripts/log-view-content-system-tome.ts`)
- **Purpose**: Defines the state machine configuration and view rendering logic
- **Structure**: Follows the established Tome pattern with XState configuration
- **States**: 
  - `idle` → `initializing` → `ready` → `starting` → `waving`
  - `stopping` → `toggling` → `selection-mode` → `processing-ml` → `error`
- **Views**: Each state renders appropriate UI components with priority and timestamp

### 2. **LogViewContentSystemConnector** (`src/content-scripts/log-view-content-system-connector.ts`)
- **Purpose**: Connects the Tome to the actual content system implementation
- **Responsibilities**:
  - Manages DOM elements (shadow root, style elements)
  - Handles message routing between popup, background, and content scripts
  - Maintains backward compatibility with existing state machine
  - Bridges Tome events to legacy message handlers

## Architecture Benefits

### **Separation of Concerns**
- **Tome**: Pure state machine logic and view definitions
- **Connector**: DOM manipulation, message handling, and service integration
- **Clear boundaries** between state management and implementation

### **State Management**
- **XState-based** state machine with clear transitions
- **Event-driven** architecture with typed actions
- **Context management** for system state and configuration

### **View Rendering**
- **Component-based** view system with priority and timestamp
- **Reactive updates** based on state changes
- **Consistent interface** across all system states

### **Message Routing**
- **Dual routing**: Messages go to both Tome and legacy handlers
- **Event mapping**: Maps message names to Tome events
- **Backward compatibility**: Existing functionality preserved

## Key Features

### **State Transitions**
```typescript
// Example state transition
idle: {
    on: {
        INITIALIZE: { target: 'initializing', actions: ['initializeSystem'] },
        START: { target: 'starting', actions: ['prepareStart'] }
    }
}
```

### **View Rendering**
```typescript
function renderWavingView(context: any) {
    return {
        type: 'content',
        component: 'ContentSystemWaving',
        props: {
            status: 'waving',
            message: 'Wave animation active',
            waveAnimation: context.contentSystem.waveAnimation,
            options: context.latestOptions
        },
        priority: 4,
        timestamp: Date.now()
    };
}
```

### **Message Event Mapping**
```typescript
const messageToTomeEvent: { [key: string]: string } = {
    'start': 'START',
    'stop': 'STOP',
    'toggle-wave-reader': 'TOGGLE',
    'selection-made': 'SELECTION-MADE',
    // ... more mappings
};
```

## Migration Path

### **Phase 1: Tome Integration** ✅
- [x] Create Tome configuration
- [x] Implement TomeConnector
- [x] Maintain backward compatibility
- [x] Add dual message routing

### **Phase 2: State Migration** (Future)
- [ ] Gradually migrate state logic to Tome
- [ ] Remove legacy state machine
- [ ] Implement Tome actions and guards
- [ ] Add state persistence

### **Phase 3: View Integration** (Future)
- [ ] Connect Tome views to React components
- [ ] Implement view state synchronization
- [ ] Add view transitions and animations
- [ ] Create view debugging tools

## Usage Examples

### **Creating the System**
```typescript
// Old way
const contentSystem = new LogViewContentSystem();

// New way
const contentSystem = new LogViewContentSystemConnector();
const tome = contentSystem.getTome();
```

### **Sending Events**
```typescript
// Send event to Tome
tome.send({ type: 'START', payload: { options: waveOptions } });

// Legacy way still works
chrome.runtime.sendMessage(new StartMessage({ options: waveOptions }));
```

### **State Monitoring**
```typescript
// Get current Tome state
const currentState = tome.context?.currentState;

// Get legacy state
const legacyState = contentSystem.getCurrentState();
```

## Testing and Debugging

### **Tome State Inspection**
```typescript
// Check Tome state
console.log('Tome state:', tome.context?.currentState);
console.log('Tome context:', tome.context);

// Check legacy state
console.log('Legacy state:', contentSystem.getCurrentState());
```

### **Message Flow Debugging**
```typescript
// Enable detailed logging
contentSystem.logMessage('debug', 'Message flow', { 
    tomeState: tome.context?.currentState,
    legacyState: contentSystem.getCurrentState(),
    message: messageData 
});
```

## Performance Considerations

### **Dual Processing**
- Messages are processed by both Tome and legacy handlers
- Minimal performance impact due to lightweight Tome processing
- Future optimization: Remove legacy handlers once migration is complete

### **State Synchronization**
- Tome and legacy state machines run independently
- State consistency maintained through shared context
- No blocking operations during state transitions

## Future Enhancements

### **Advanced State Management**
- **Nested states** for complex workflows
- **State persistence** across page reloads
- **State history** and rollback capabilities
- **State validation** and error recovery

### **View System Improvements**
- **Dynamic view loading** based on state
- **View composition** and nesting
- **View transitions** and animations
- **View debugging** and inspection tools

### **Integration Features**
- **Cross-tab state synchronization**
- **Background script integration**
- **Popup state synchronization**
- **Analytics and monitoring**

## Compatibility Notes

### **Backward Compatibility**
- All existing message handlers continue to work
- DOM manipulation and service integration unchanged
- State machine behavior preserved
- No breaking changes to external APIs

### **Gradual Migration**
- Can run both systems simultaneously
- Tome can be disabled without affecting functionality
- Legacy code can be removed incrementally
- Testing and validation at each step

## Conclusion

The refactoring to Tome architecture provides:
- **Better separation of concerns**
- **Improved state management**
- **Enhanced debugging capabilities**
- **Future extensibility**
- **Maintained backward compatibility**

This refactoring positions the content system for future enhancements while preserving all existing functionality.
