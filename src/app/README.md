# Wave Reader App Architecture

## Overview

This directory contains the refactored Wave Reader application using the **Tome View Stack Architecture**. The monolithic `app.tsx` (3,619 lines) has been transformed into a clean, modular system with clear separation of concerns.

## Architecture Principles

### 1. **View Stack Rendering Pattern**

The Tome architecture uses a stateless view stack that can be composed and cleared:

```typescript
// Views are appended to a stack
viewStack.append('ready', renderReadyView(context));

// Stack can be cleared for stateless rendering
viewStack.clear();

// Views are composed into a single React element
return viewStack.compose();
```

**Key Features:**
- `context.currentView` - Tracks the current view state
- `context.lastViewCleared` - Timestamp of last clear operation
- `clear()` - Resets view stack to empty state
- Stateless XState view rendering

### 2. **Observable Pattern for React**

Tomes expose an observable pattern for React integration:

```typescript
const AppComponent = () => {
  const [currentViewKey, setCurrentViewKey] = useState(AppTome.getViewKey());
  
  useEffect(() => {
    const unsubscribe = AppTome.observeViewKey(setCurrentViewKey);
    return unsubscribe;
  }, []);
  
  return AppTome.render() || <div>Loading...</div>;
};
```

**API Methods:**
- `getViewKey()` - Returns current view key as string
- `observeViewKey(callback)` - Subscribe to view changes, returns unsubscribe function
- `render()` - Returns composed React view

### 3. **Hierarchical Machine Routing**

Machines communicate using path-based routing instead of direct references:

```typescript
// Future enhancement: Path-based routing
// send('./BackgroundProxyMachine', 'START')  // Child
// send('..', 'TOGGLE_COMPLETE', data)        // Parent
// send('./AppTome/WaveControlTome', 'start') // Nested child

// Current implementation: Via parent machine
const bgProxy = machine.parentMachine?.getSubMachine?.('background-proxy-machine');
const response = await bgProxy?.send?.('START');
```

**Benefits:**
- Clear structural hierarchy
- Easier to reorganize machine tree
- Better testability

## Directory Structure

```
src/app/
├── README.md                       # This file
├── components/
│   └── App.tsx                     # Clean React entry point (~100 lines)
├── machines/
│   ├── app-machine.ts              # Main application state machine
│   └── background-proxy-machine.ts # Chrome extension API wrapper
└── tomes/
    ├── base/
    │   ├── index.ts                # Base exports
    │   ├── TomeBase.ts             # Base class with observable pattern
    │   └── ViewStack.ts            # View stack management
    └── AppTome.ts                  # Main orchestrator tome
```

## Components

### `components/App.tsx`

Clean React component that:
- Uses the observable pattern to track view changes
- Initializes AppTome on mount
- Renders the composed view from AppTome
- Handles cleanup on unmount

**Size:** ~100 lines (vs. 3,619 lines original)

### `tomes/base/ViewStack.ts`

Manages the view stack:
- `append(key, component)` - Add view to stack
- `clear()` - Reset stack
- `compose()` - Compose all views into React fragment
- `getCurrentView()` - Get current view key
- `getLastViewCleared()` - Get last clear timestamp

### `tomes/base/TomeBase.ts`

Base class for all Tome modules:
- Observable pattern implementation
- View stack integration
- Machine router for hierarchical communication
- Child tome registration
- Lifecycle management (initialize, cleanup)

### `tomes/AppTome.ts`

Main orchestrator:
- Creates and manages app machine
- Creates and manages background proxy machine
- Registers machines with router
- Implements view rendering for each state
- Provides singleton instance

**States Rendered:**
- `idle` - Initial state with basic controls
- `initializing` - Loading state during initialization
- `ready` - Fully initialized with all controls
- `waving` - Active waving state
- `error` - Error state with retry/reset options

### `machines/app-machine.ts`

Main application state machine:

**States:**
- `idle` - Initial state
- `initializing` - Performing initialization and sync
- `ready` - Ready for operations
- `starting` - Starting wave
- `waving` - Wave active
- `toggling` - Toggling wave state
- `keyboardToggling` - Handling keyboard shortcuts
- `stopping` - Stopping wave
- `selectorUpdating` - Updating CSS selector
- `settingsUpdating` - Updating settings
- `error` - Error state

**Actions:**
- Initialization with comprehensive sync
- Start/stop/toggle wave operations
- Selector and settings management
- Tab navigation and collapse
- State refresh and heartbeat sync
- Error handling

### `machines/background-proxy-machine.ts`

Wraps all Chrome extension API communications:

**States:**
- `idle` - Waiting for commands
- `initializing` - Initializing connection
- `starting` - Processing start command
- `stopping` - Processing stop command
- `toggling` - Processing toggle command
- `error` - Error state

**Actions:**
- Chrome extension messaging
- Background script communication
- Status and health checks
- Ping/pong heartbeat

## Data Flow

```
User Interaction
    ↓
React Component (App.tsx)
    ↓
AppTome (orchestrator)
    ↓
App Machine (business logic)
    ↓
Background Proxy Machine (Chrome API wrapper)
    ↓
Chrome Extension APIs
    ↓
Background/Content Scripts
```

## State Management

### View Model

The viewModel in context contains all application state:

```typescript
{
  selector: string,              // Current CSS selector
  saved: boolean,                // Whether state is saved
  going: boolean,                // Whether waving is active
  selectors: string[],           // Saved selectors
  currentView: string,           // Current view name
  isExtension: boolean,          // Running as extension
  settings: Options | null,      // Application settings
  showNotifications: boolean,    // Show notifications flag
  toggleKeys: {                  // Keyboard shortcut
    keyChord: string[]
  }
}
```

### Synchronization

The `SyncSystem` (from `src/systems/sync.ts`) handles:
- **Initialization Sync** - Gathers data from all sources (cache, content script, background)
- **Heartbeat Sync** - Lightweight sync for active tabs
- **Storage Persistence** - Saves state to Chrome sync storage

## Usage

### Using the Refactored App

```typescript
// In src/app-refactored.tsx
import AppComponent from './app/components/App';
export default AppComponent;
```

### Building Your Own Tome

```typescript
import { TomeBase } from './app/tomes/base';

class MyTome extends TomeBase {
  async initialize(): Promise<void> {
    // Create and configure machines
    this.machine = createMyMachine();
    
    // Attach view rendering
    this.attachViewRendering();
    
    // Start machine
    await this.machine.start();
  }

  private attachViewRendering(): void {
    this.machine.withState('myState', async ({context, clear, view}) => {
      clear();
      this.viewStack.clear();
      this.viewStack.append('myState', this.renderMyView(context));
      this.updateViewKey(`myState-${Date.now()}`);
    });
  }

  private renderMyView(context: any): React.ReactNode {
    return React.createElement('div', null, 'My View');
  }
}

export const MyTome = new MyTome();
```

### Observing View Changes

```typescript
// In your React component
const [viewKey, setViewKey] = useState(MyTome.getViewKey());

useEffect(() => {
  const unsubscribe = MyTome.observeViewKey(setViewKey);
  return unsubscribe;
}, []);

return MyTome.render();
```

## Benefits

1. **Separation of Concerns**
   - Business logic in machines
   - Presentation in tomes
   - React integration in components

2. **Stateless Rendering**
   - View stack clears and rebuilds
   - No stale state issues
   - Predictable rendering

3. **Reactive Updates**
   - Observable pattern
   - React re-renders only when needed
   - Efficient updates

4. **Composability**
   - Tomes can be nested
   - Machines can be routed
   - Modular architecture

5. **Testability**
   - Each module independently testable
   - Clear interfaces
   - Moc

kable dependencies

6. **Maintainability**
   - Clear boundaries
   - Single responsibility
   - Easy to understand and modify

## Testing

### Testing Machines

```typescript
import { createAppMachine } from './app/machines/app-machine';

test('app machine initializes', async () => {
  const machine = createAppMachine();
  await machine.start();
  
  machine.send('INITIALIZE');
  
  // Assert state transitions
  expect(machine.getState().value).toBe('initializing');
});
```

### Testing Tomes

```typescript
import { AppTome } from './app/tomes/AppTome';

test('AppTome renders correctly', async () => {
  await AppTome.initialize();
  
  const view = AppTome.render();
  
  expect(view).toBeDefined();
  
  AppTome.cleanup();
});
```

### Testing View Stack

```typescript
import { ViewStack } from './app/tomes/base/ViewStack';

test('view stack composes views', () => {
  const stack = new ViewStack();
  
  stack.append('view1', <div>View 1</div>);
  stack.append('view2', <div>View 2</div>);
  
  const composed = stack.compose();
  
  expect(stack.getStackSize()).toBe(2);
  expect(composed).toBeDefined();
});
```

## Migration Notes

### From Old app.tsx

The original `app.tsx` contained:
- ~3,619 lines of code
- Mixed concerns (UI, logic, state, API calls)
- Difficult to test and maintain
- Duplicated code and patterns

### To New Architecture

Now split into:
- **App.tsx**: ~100 lines (React integration)
- **AppTome**: ~300 lines (orchestration)
- **app-machine**: ~400 lines (business logic)
- **background-proxy-machine**: ~150 lines (API wrapper)
- **Base utilities**: ~300 lines (reusable infrastructure)

**Total**: ~1,250 lines (65% reduction) with better organization

## Future Enhancements

1. **Additional Tome Modules**
   - WaveControlTome - Wave start/stop controls
   - SelectorTome - Selector management
   - NavigationTome - Tab navigation
   - SyncTome - Data synchronization

2. **Enhanced Hierarchical Routing**
   - Full path-based routing implementation
   - Wildcard routing support
   - Routing middleware

3. **Performance Optimizations**
   - View memoization
   - Lazy loading of tomes
   - Efficient re-rendering strategies

4. **Developer Tools**
   - Tome debugger
   - State machine visualizer
   - View stack inspector

## Contributing

When adding new features:

1. Create machines for business logic
2. Create tomes for presentation
3. Use the observable pattern for React integration
4. Follow the view stack pattern for rendering
5. Write tests for all modules
6. Update this README

## References

- [XState Documentation](https://xstate.js.org/)
- [log-view-machine Package](../../node_modules/log-view-machine/)
- [Original app.tsx](../app.tsx) (for reference)
- [Component Refactoring Summary](../../markdown_documents/COMPONENT_REFACTORING_SUMMARY.md)

---

**Last Updated:** October 2025
**Architecture Version:** 1.0
**Status:** ✅ Initial Implementation Complete

