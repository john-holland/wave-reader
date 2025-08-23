# TomeConnector Improvements

## Overview

We've significantly improved the `TomeConnector` component to better integrate with log-view-machine and provide better performance and consistency.

## Key Improvements

### 1. **Copy logStates from Tome** ✅

**Before**: The connector used generic, basic logStates that didn't leverage the component's specific tome configuration.

**After**: The connector now copies logStates from the component's tome instance, ensuring:
- **Consistent Behavior**: Same state logic across different usage patterns
- **Rich Functionality**: Leverages the component's specific state handlers and view rendering
- **Better Integration**: Uses the component's actual state machine configuration

**Implementation**:
```typescript
// If we have a component instance, use its configuration
if (componentInstance) {
  // Use the component's existing machine if available
  if (componentInstance.machine) {
    machine = componentInstance.machine;
  } else {
    // Create machine using component's configuration
    machine = createViewStateMachine({
      machineId: tomeConfig.machineId,
      xstateConfig: componentInstance.xstateConfig || { /* fallback */ },
      // Copy logStates from the component instance if available
      logStates: componentInstance.logStates || createDefaultLogStates(componentName)
    });
  }
}
```

### 2. **Local Component Reference** ✅

**Before**: The connector didn't maintain a reference to the actual component instance.

**After**: The connector now maintains a local reference to the component instance, providing:
- **Performance**: Avoids recreating the tome on every render
- **State Persistence**: Maintains state across component updates
- **Event Handling**: Direct access to the component's event system
- **Method Access**: Can call component-specific methods

**Implementation**:
```typescript
// Create the component instance (local reference)
const componentInstance = useMemo(() => {
  if (!componentMapping) return null;
  
  try {
    // Dynamic import of the component's tome
    const ComponentTome = require(componentMapping.tomePath).default;
    if (ComponentTome && ComponentTome.create) {
      return ComponentTome.create(initialModel);
    }
  } catch (error) {
    console.warn(`Could not load tome for ${componentName}:`, error);
  }
  return null;
}, [componentName, componentMapping, initialModel]);

// Store component reference
useEffect(() => {
  componentRef.current = componentInstance;
}, [componentInstance]);
```

### 3. **Enhanced Hook Support** ✅

**Before**: The `useTomeConnector` hook provided basic functionality.

**After**: The hook now provides:
- **Component Instance Access**: Direct access to the wrapped component
- **Method Discovery**: Can find and call component-specific methods
- **Better State Management**: More comprehensive state handling

**Implementation**:
```typescript
export const useTomeConnector = (componentName: string) => {
  // ... existing state ...
  const [componentInstance, setComponentInstance] = useState<any>(null);

  const getComponentMethod = (methodName: string) => {
    if (componentInstance && typeof componentInstance[methodName] === 'function') {
      return componentInstance[methodName].bind(componentInstance);
    }
    return null;
  };

  return {
    // ... existing returns ...
    componentInstance,
    getComponentMethod,
    setComponentInstance
  };
};
```

## Benefits of These Improvements

### **For Developers**
1. **Better Integration**: Components work more consistently with their tomes
2. **Performance**: No unnecessary recreation of tome instances
3. **Flexibility**: Access to component-specific methods and functionality
4. **Debugging**: Better logging and state management

### **For Users**
1. **Consistent Behavior**: Components behave the same way regardless of how they're wrapped
2. **Better Performance**: Faster response times and smoother interactions
3. **Rich Functionality**: Access to all component features, not just basic ones

### **For Maintenance**
1. **Easier Debugging**: Better error handling and logging
2. **Clearer Architecture**: Explicit component relationships and dependencies
3. **Better Testing**: More predictable component behavior

## Usage Examples

### **Basic Usage with Enhanced Features**
```tsx
<TomeConnector
  componentName="go-button"
  initialModel={{ displayText: 'Start Waving!' }}
  onStateChange={(state, model) => console.log('State:', state, 'Model:', model)}
>
  <button>Go!</button>
</TomeConnector>
```

### **Using the Enhanced Hook**
```tsx
const { 
  currentState, 
  model, 
  sendEvent, 
  updateModel, 
  componentInstance,
  getComponentMethod 
} = useTomeConnector('go-button');

// Access component-specific methods
const customMethod = getComponentMethod('customMethod');
if (customMethod) {
  customMethod();
}
```

### **Component Method Access**
```tsx
// The connector can now access component-specific methods
const handleCustomAction = () => {
  const customMethod = getComponentMethod('handleCustomAction');
  if (customMethod) {
    customMethod();
  }
};
```

## Technical Details

### **logStates Copying Strategy**
1. **Primary**: Use `componentInstance.logStates` if available
2. **Fallback**: Use `createDefaultLogStates(componentName)` if not available
3. **Error Handling**: Graceful degradation with warning messages

### **Component Instance Management**
1. **Creation**: Uses `useMemo` to avoid unnecessary recreation
2. **Storage**: Maintains reference in `useRef` for stable access
3. **Cleanup**: Proper cleanup in `useEffect` dependencies

### **Performance Optimizations**
1. **Memoization**: Component instance creation is memoized
2. **Lazy Loading**: Dynamic imports only when needed
3. **Reference Stability**: Stable references prevent unnecessary re-renders

## Migration Guide

### **From Old TomeConnector**
1. **No Breaking Changes**: Existing code continues to work
2. **Enhanced Features**: New features are opt-in
3. **Better Performance**: Improved performance out of the box

### **To New Features**
1. **Component Methods**: Use `getComponentMethod()` to access component functionality
2. **Enhanced State**: Better state management and logging
3. **Performance**: Improved performance with local references

## Future Enhancements

### **Planned Features**
1. **Type Safety**: Better TypeScript support for component methods
2. **Plugin System**: Extensible tome connector system
3. **Advanced Logging**: Enhanced logging and monitoring capabilities

### **Performance Improvements**
1. **Lazy Loading**: More sophisticated lazy loading strategies
2. **Caching**: Intelligent caching of component instances
3. **Optimization**: Further performance optimizations

## Conclusion

These improvements make the `TomeConnector` much more powerful and efficient:

- ✅ **Better Integration**: Uses component-specific logStates
- ✅ **Local References**: Maintains component instances for performance
- ✅ **Enhanced Hooks**: More comprehensive hook functionality
- ✅ **Method Access**: Can call component-specific methods
- ✅ **Performance**: Better performance with stable references
- ✅ **Consistency**: More consistent behavior across components

The connector now provides a much richer integration experience while maintaining backward compatibility and improving performance.
