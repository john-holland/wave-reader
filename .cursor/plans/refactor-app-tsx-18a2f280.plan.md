<!-- 18a2f280-861e-4948-a20c-9c82a5d73348 07744030-2b03-4167-a0d8-42c65e039bd1 -->
# Refactor app.tsx with Tome View Stack Architecture

## Overview

Transform the 3,619-line monolithic `app.tsx` into a modular architecture using routed Tome modules with a stateless view stack rendering pattern. This enables composed, reactive views with proper state management separation.

## Architecture Changes

### 1. View Stack Rendering Pattern

**Core Concept**: ViewStateMachine rendering builds up a view stack that can be composed and cleared, keeping rendering stateless.

**Implementation in log-view-machine**:

- Add `context.currentView` tracking to ViewStateMachine
- Add `context.lastViewCleared` timestamp tracking
- Implement `clear()` method to reset view stack
- Support view composition through append-only rendering

**Files to modify**:

- `log-view-machine` package (may need to update or patch)
- Create local view stack utilities if needed

### 1.5. Hierarchical Machine Routing Pattern

**Core Concept**: Use path-based routing for machine communication instead of direct references like `machine.parentMachine`.

**Routing Syntax**:

```typescript
// From child to sibling
send('./BackgroundProxyMachine', 'start')

// From child to parent
send('..', 'toggle-wave', { going: context.going })

// From parent to child
send('./WaveControlTome', 'update-selector', { selector: 'p' })

// To specific nested child
send('./AppTome/WaveControlTome', 'start')
```

**Implementation**:

- Wrap all Chrome extension API calls with ProxyMachine
- Create routing middleware that resolves paths to machine instances
- Each machine registers with parent using relative path
- Send function resolves paths: `.` = self, `..` = parent, `./name` = child

**Benefits**:

- Clear structural hierarchy
- No direct machine references needed
- Easy to reorganize machine tree
- Better testability with path mocking

### 2. Tome Observable Pattern

**React Integration Functions** to expose from Tome:

```typescript
// Tome API additions:
- getViewKey(): string  // Returns current view key
- observeViewKey(callback: (key: string) => void): () => void  // observer with unsubscribe
- render(): React.ReactNode  // existing, returns composed view
```

**Usage Pattern**:

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

### 3. Routed Tome Modules

Break monolithic app.tsx into separate Tome modules:

**Module Structure**:

```
src/
├── tomes/
│   ├── AppTome.ts              # Main orchestrator
│   ├── WaveControlTome.ts      # Wave start/stop controls
│   ├── SelectorTome.ts         # Selector management
│   ├── NavigationTome.ts       # Tab navigation
│   └── SyncTome.ts             # Data synchronization
├── machines/
│   ├── app-machine.ts          # Main app state machine
│   ├── wave-control-machine.ts # Wave control logic
│   ├── selector-machine.ts     # Selector logic
│   └── navigation-machine.ts   # Navigation logic
└── components/
    └── App.tsx                 # Clean React entry point
```

## Implementation Steps

### Phase 1: Core Infrastructure (Tome Enhancements)

**Files to create/modify**:

1. `src/tomes/base/TomeBase.ts` - Base class with observable pattern
2. `src/tomes/base/ViewStack.ts` - View stack management utilities
3. Update or wrap `log-view-machine` to support view stack

**Key Features**:

- View stack with `currentView` and `lastViewCleared` tracking
- Observable pattern for view key changes
- `clear()` method for stateless resets
- Subscriber management

### Phase 2: Extract State Machines

**From current app.tsx (lines 36-1500+)**, extract:

1. **App Machine** (`src/machines/app-machine.ts`)

   - Main application states: idle, initializing, ready, error
   - Context: viewModel, settings, machine references
   - Actions: initialize, sync, handle errors

2. **Wave Control Machine** (`src/machines/wave-control-machine.ts`)

   - States: idle, starting, waving, stopping, stopped
   - Context: going, selector, waveSettings
   - Actions: start wave, stop wave, handle shortcuts

3. **Selector Machine** (`src/machines/selector-machine.ts`)

   - States: idle, editing, validating, saved, error
   - Context: selector, selectors list, saved status
   - Actions: update selector, validate, save, load

4. **Navigation Machine** (`src/machines/navigation-machine.ts`)

   - States: how-to, settings, about, collapsed
   - Context: activeTab, isCollapsed
   - Actions: change tab, toggle collapse

### Phase 3: Create Tome Modules

**1. AppTome** (`src/tomes/AppTome.ts`)

- Orchestrates all sub-tomes
- Manages routing between modules
- Implements observable pattern
- Exposes `getViewKey()` and `observeViewKey()`

**2. WaveControlTome** (`src/tomes/WaveControlTome.ts`)

- Wraps wave control machine
- Renders wave control UI
- Handles start/stop events

**3. SelectorTome** (`src/tomes/SelectorTome.ts`)

- Manages selector state
- Renders selector input
- Handles validation and saving

**4. NavigationTome** (`src/tomes/NavigationTome.ts`)

- Manages tab navigation
- Renders tab UI
- Handles collapse/expand

**5. SyncTome** (`src/tomes/SyncTome.ts`)

- Wraps existing SyncSystem
- Handles background sync
- Manages Chrome storage

### Phase 4: Refactor App Component

**New App.tsx** (clean, ~50-100 lines):

```typescript
import React, { useEffect, useState } from 'react';
import { AppTome } from '../tomes/AppTome';
import { ErrorBoundary } from './error-boundary';
import { ModalContainer } from './styled/AppStyles';

const AppComponent: FunctionComponent = () => {
  const [currentViewKey, setCurrentViewKey] = AppTome.getViewKey();
  
  useEffect(() => {
    // Subscribe to view changes
    const unsubscribe = AppTome.observeViewKey(setCurrentViewKey);
    
    // Initialize the tome
    AppTome.initialize().catch(console.error);
    
    return () => {
      unsubscribe();
      AppTome.cleanup();
    };
  }, []);
  
  return (
    <ErrorBoundary>
      <ModalContainer>
        {AppTome.render() || <div>Loading...</div>}
      </ModalContainer>
    </ErrorBoundary>
  );
};

export default AppComponent;
```

### Phase 5: View Stack Implementation

**ViewStack utility** (`src/tomes/base/ViewStack.ts`):

```typescript
interface ViewStackEntry {
  key: string;
  component: React.ReactNode;
  timestamp: number;
}

class ViewStack {
  private stack: ViewStackEntry[] = [];
  private currentView: string = '';
  private lastViewCleared: number = 0;
  
  append(key: string, component: React.ReactNode): void
  clear(): void
  compose(): React.ReactNode
  getCurrentView(): string
  getLastViewCleared(): number
}
```

### Phase 6: Integration and Testing

1. Update webpack/build configuration
2. Test each Tome module independently
3. Test composed views with view stack
4. Verify Chrome extension integration
5. Test state synchronization
6. Verify all existing functionality works

## Key Benefits

1. **Separation of Concerns**: Business logic in machines, presentation in tomes, React in components
2. **Stateless Rendering**: View stack clears and rebuilds, no stale state
3. **Reactive Updates**: Observable pattern triggers React re-renders only when needed
4. **Composability**: Tomes can be nested and routed
5. **Testability**: Each module can be tested independently
6. **Maintainability**: Clear boundaries, single responsibility

## Files to Modify

**Core files**:

- `src/app.tsx` → Becomes `src/components/App.tsx` (simplified)
- `src/app-refactored.tsx` → delete

**Extract from app.tsx**:

- Interfaces → `src/types/interfaces.ts` (already done)
- Adapters → `src/adapters/machine-adapters.ts` (already done)
- Sync → `src/systems/sync.ts` (already done)
- Styles → `src/components/styled/AppStyles.ts` (already done)
- State machines → `src/machines/*.ts` (new)
- Tome modules → `src/tomes/*.ts` (new)

## Dependencies

- `log-view-machine` (may need version update or local patches)
- `xstate` (existing)
- `react` (existing)
- `styled-components` (existing)

## Success Criteria

- [ ] View stack pattern working with clear() and compose()
- [ ] Observable pattern enables React reactivity
- [ ] All Tome modules created and integrated
- [ ] App.tsx reduced to <100 lines
- [ ] All existing functionality preserved
- [ ] Chrome extension still works
- [ ] Tests pass

### To-dos

- [ ] Create ViewStack utility with currentView, lastViewCleared tracking and clear() method
- [ ] Implement Tome observable pattern with getViewKey() and observeViewKey() methods
- [ ] Extract main app state machine from app.tsx to machines/app-machine.ts
- [ ] Extract wave control state machine to machines/wave-control-machine.ts
- [ ] Extract selector state machine to machines/selector-machine.ts
- [ ] Extract navigation state machine to machines/navigation-machine.ts
- [ ] Create TomeBase class with observable pattern and view stack integration
- [ ] Create AppTome module that orchestrates all sub-tomes with routing
- [ ] Create WaveControlTome module for wave start/stop functionality
- [ ] Create SelectorTome module for selector management
- [ ] Create NavigationTome module for tab navigation
- [ ] Create SyncTome module wrapping existing SyncSystem
- [ ] Refactor App.tsx to clean component using observable pattern and AppTome.render()
- [ ] Test integrated system with view stack, routing, and Chrome extension