# Wave Reader Tomes Refactoring

This document describes the refactoring of the wave-reader project to use the Tomes and robotcopy pattern from log-view-machine, similar to the node-example implementation.

## Overview

The refactoring transforms the wave-reader from a traditional React component with manual state management to a connected routed component system using:

- **Tomes**: Server-side rendering and routing system
- **RobotCopy**: Client communication and state management
- **ViewStateMachine**: Component state machine integration
- **XState**: State machine orchestration

## Architecture Changes

### Before (Traditional React)
- Single `App.tsx` component with complex state management
- Manual state machine implementation in `state-machine.ts`
- Direct Chrome extension messaging
- Inline state logic mixed with UI components

### After (Tomes + RobotCopy)
- **Tome Server**: Server-side rendering and API endpoints
- **Component Templates**: Reusable component definitions with routing
- **State Machines**: XState-based state management
- **RobotCopy**: Structured client communication
- **ViewStateMachine**: Component lifecycle management

## New File Structure

```
src/
├── tome-server.js                           # Tomes server for SSR
├── app-tomes.tsx                           # New Tomes-based React app
├── component-middleware/
│   └── wave-reader/
│       ├── templates/
│       │   └── wave-reader-component/
│       │       ├── index.js                # Component template
│       │       ├── styles.css              # Component styles
│       │       └── template.html           # HTML template
│       └── robotcopy-pact-config.js        # RobotCopy configuration
└── config/
    └── robotcopy.ts                        # Legacy robotcopy config
```

## Key Components

### 1. Tome Server (`src/tome-server.js`)

The Tomes server provides:
- Server-side rendering of wave-reader pages
- API endpoints for wave-reader operations
- State machine simulation on the server
- Trace context management

**Features:**
- `/wave-reader` - SSR wave reader page
- `/wave-reader-client` - Client-side template
- `/api/wave-reader/start` - Start wave reader
- `/api/wave-reader/stop` - Stop wave reader

### 2. Component Template (`src/component-middleware/wave-reader/templates/wave-reader-component/`)

The component template defines:
- Component configuration and dependencies
- State machine integration
- View rendering for different states
- Routing between component views

**States:**
- `idle` - Ready to start
- `waving` - Active wave reading
- `settings` - Configuration view
- `selector-selection` - Element selection mode
- `error` - Error handling

### 3. RobotCopy Configuration (`src/component-middleware/wave-reader/robotcopy-pact-config.js`)

RobotCopy provides:
- Client communication infrastructure
- PACT testing integration
- State machine actions and transitions
- Chrome extension messaging

**Configuration:**
- Chrome extension URLs
- Content script communication
- Background script integration
- PACT test client setup

### 4. New React App (`src/app-tomes.tsx`)

The refactored React app:
- Uses the Tomes state machine
- Integrates with RobotCopy
- Provides clean separation of concerns
- Supports multiple view states

## State Machine Integration

### XState Configuration

```javascript
const createWaveReaderStateMachine = () => {
  return createViewStateMachine({
    machineId: 'wave-reader',
    xstateConfig: {
      id: 'wave-reader',
      initial: 'idle',
      context: {
        selector: 'p',
        selectors: ['p', 'h1', 'h2', 'h3'],
        going: false,
        options: { /* wave settings */ }
      },
      states: {
        idle: { /* idle state logic */ },
        waving: { /* active state logic */ },
        settings: { /* settings state logic */ }
      }
    }
  });
};
```

### State Transitions

- `INITIALIZE_WAVE_READER` → `idle`
- `START_WAVE_READER` → `waving`
- `STOP_WAVE_READER` → `idle`
- `SHOW_SETTINGS` → `settings`
- `GO_BACK` → `idle`

## Benefits of Refactoring

### 1. **Separation of Concerns**
- UI components separate from business logic
- State management isolated in state machines
- Communication logic abstracted in RobotCopy

### 2. **Reusability**
- Component templates can be reused
- State machines are composable
- RobotCopy configurations are portable

### 3. **Testability**
- PACT testing integration
- State machine testing
- Component isolation

### 4. **Maintainability**
- Clear component boundaries
- Structured state transitions
- Consistent communication patterns

### 5. **Scalability**
- Easy to add new components
- State machines can be composed
- RobotCopy supports multiple clients

## Migration Guide

### 1. **Install Dependencies**

```bash
npm install log-view-machine xstate
```

### 2. **Update Package.json**

Add the new dependencies:
```json
{
  "dependencies": {
    "log-view-machine": "^0.0.3",
    "xstate": "^4.38.2"
  }
}
```

### 3. **Replace App Component**

Replace the old `App.tsx` with `app-tomes.tsx`:
```typescript
// Old import
import App from './app';

// New import
import AppTomes from './app-tomes';
```

### 4. **Start Tome Server**

Run the Tomes server for SSR support:
```bash
node src/tome-server.js
```

### 5. **Update Build Configuration**

Ensure webpack can handle the new file structure and ES modules.

## Testing

### PACT Testing

The RobotCopy configuration includes PACT testing:
```javascript
const pactClient = new PactTestClient(PACT_CONFIG);
await pactClient.setup();
await pactClient.addInteraction(interaction);
await pactClient.verify();
```

### State Machine Testing

Test state transitions:
```javascript
const machine = createWaveReaderStateMachine();
await machine.send({ type: 'START_WAVE_READER' });
expect(machine.getSnapshot().value).toBe('waving');
```

## Future Enhancements

### 1. **Additional Components**
- Wave animation component
- Settings management component
- Selector library component

### 2. **Advanced Routing**
- Deep linking support
- History management
- Route guards

### 3. **Performance Optimization**
- Component lazy loading
- State machine optimization
- Caching strategies

### 4. **Integration Features**
- GraphQL support
- Real-time updates
- Offline capabilities

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure log-view-machine is properly installed
2. **State Machine Errors**: Check XState configuration syntax
3. **RobotCopy Errors**: Verify Chrome extension URLs
4. **Template Errors**: Check component template structure

### Debug Mode

Enable debug logging:
```javascript
const ROBOTCOPY_CONFIG = {
  enableTracing: true,
  enableDataDog: true
};
```

## Conclusion

The Tomes and robotcopy refactoring provides a modern, scalable architecture for the wave-reader project. It separates concerns, improves testability, and creates a foundation for future enhancements while maintaining the existing functionality.

The new architecture follows established patterns from log-view-machine and provides a clear path for continued development and maintenance.
