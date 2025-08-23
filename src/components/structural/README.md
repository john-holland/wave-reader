# Wave Reader Structural System

This directory contains the structural components and configuration that define the hierarchical organization of the Wave Reader application, including routing, component nesting, and tome integration.

## Overview

The structural system provides:

- **Component Hierarchy**: Clear organization of how components are nested
- **Routing Configuration**: Declarative routing with nested routes
- **Tome Integration**: Mapping between UI components and log-view-machine tomes
- **Navigation**: Built-in navigation with breadcrumbs and sidebar

## Directory Structure

```
src/components/structural/
├── app-structure.js          # Main structure configuration
├── AppRouter.tsx            # Router component with navigation
├── TomeConnector.tsx        # Connector for log-view-machine integration
├── index.ts                 # Export file
└── README.md                # This file
```

## Component Hierarchy

The application follows this nested structure:

```
wave-tabs (navigation)
├── wave-reader (main content)
│   ├── go-button (control)
│   └── selector-input (input)
├── settings (configuration)
└── about (information)

background (services)
└── interchange (communication)

content (scripts)
└── wave-reader-content
    └── selector-hierarchy (content control)
```

## Usage

### 1. Basic Router Setup

```tsx
import { AppRouter } from './components/structural';

function App() {
  return (
    <AppRouter 
      initialRoute="/wave-tabs"
      onRouteChange={(route) => console.log('Route changed to:', route)}
    />
  );
}
```

### 2. Using Tome Connector

```tsx
import { TomeConnector } from './components/structural';

function GoButton() {
  return (
    <TomeConnector 
      componentName="go-button"
      initialModel={{ displayText: 'go!' }}
      onStateChange={(state, model) => console.log('State:', state, 'Model:', model)}
    >
      <button>Go!</button>
    </TomeConnector>
  );
}
```

### 3. Using Router Hook

```tsx
import { useRouter } from './components/structural';

function NavigationComponent() {
  const { currentRoute, navigate, goBack } = useRouter();
  
  return (
    <div>
      <p>Current route: {currentRoute}</p>
      <button onClick={() => navigate('/wave-tabs/settings')}>
        Go to Settings
      </button>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
}
```

### 4. Using Tome Connector Hook

```tsx
import { useTomeConnector } from './components/structural';

function ComponentWithTome() {
  const { currentState, model, sendEvent, updateModel } = useTomeConnector('go-button');
  
  const handleClick = () => {
    sendEvent({ type: 'GO' });
  };
  
  const updateText = (newText: string) => {
    updateModel({ displayText: newText });
  };
  
  return (
    <div>
      <p>State: {currentState}</p>
      <p>Text: {model.displayText}</p>
      <button onClick={handleClick}>Go</button>
      <button onClick={() => updateText('new text')}>Update Text</button>
    </div>
  );
}
```

## Configuration

### Adding New Components

1. **Update `app-structure.js`**:
   ```javascript
   // Add to ComponentTomeMapping
   'new-component': {
     componentPath: 'src/components/new-component.tsx',
     tomePath: 'src/component-middleware/new-component/NewComponentTomes.tsx',
     templatePath: 'src/component-middleware/new-component/templates/new-component-component/'
   }
   
   // Add to RoutingConfig.routes
   {
     path: '/wave-tabs/new-component',
     component: 'new-component'
   }
   
   // Add to TomeConfig.tomes
   'new-component-tome': {
     machineId: 'new-component',
     description: 'Description of new component',
     states: ['idle', 'active'],
     events: ['ACTIVATE', 'DEACTIVATE']
   }
   ```

2. **Create the component** in `src/components/`
3. **Create the tome** in `src/component-middleware/`
4. **Create the template** in the component middleware directory

### Customizing Routes

Routes can be customized by modifying the `RoutingConfig.routes` array:

```javascript
{
  path: '/custom-path',
  component: 'component-name',
  children: [
    {
      path: '/custom-path/child',
      component: 'child-component'
    }
  ]
}
```

### Customizing Navigation

Navigation can be customized by modifying the `RoutingConfig.navigation` object:

```javascript
navigation: {
  primary: [
    {
      id: 'custom-nav',
      label: 'Custom Navigation',
      path: '/custom-path',
      icon: '🚀',
      children: [...]
    }
  ]
}
```

## Tome Integration

Each component can have an associated "tome" that provides:

- **State Management**: Using log-view-machine
- **Logging**: Built-in logging for debugging
- **Event Handling**: State machine events and transitions
- **View Rendering**: Dynamic view updates based on state

### Tome States

Tomes define their states in the `TomeConfig.tomes` configuration:

```javascript
'go-button-tome': {
  machineId: 'go-button',
  description: 'Go button control with wave animation',
  states: ['idle', 'going', 'stopping', 'loading', 'error'],
  events: ['GO', 'STOP', 'LOAD', 'ERROR']
}
```

### Tome Events

Events are sent to tomes using the `sendEvent` function:

```javascript
sendEvent({ type: 'GO', payload: { speed: 'fast' } });
```

## Styling

The structural components include CSS classes for styling:

- `.app-router` - Main router container
- `.router-header` - Header with title and breadcrumbs
- `.router-sidebar` - Navigation sidebar
- `.router-main` - Main content area
- `.router-footer` - Footer with back button
- `.tome-connector` - Tome connector container
- `.tome-header` - Tome header with state info
- `.tome-content` - Tome content area
- `.tome-footer` - Tome footer with logs

## Best Practices

1. **Component Naming**: Use kebab-case for component names and paths
2. **Route Structure**: Keep routes shallow and logical
3. **Tome States**: Define clear, descriptive state names
4. **Event Types**: Use UPPER_CASE for event types
5. **Error Handling**: Always handle errors in tome operations
6. **State Updates**: Use the `updateModel` function for state changes
7. **Navigation**: Use the `navigate` function for route changes

## Troubleshooting

### Common Issues

1. **Component not found**: Check `ComponentTomeMapping` and file paths
2. **Route not working**: Verify route configuration in `RoutingConfig.routes`
3. **Tome not initializing**: Check tome configuration in `TomeConfig.tomes`
4. **Import errors**: Ensure all paths in `ComponentTomeMapping` are correct

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
DEBUG=wave-reader:structural npm start
```

## Future Enhancements

- [ ] Parameter extraction from routes
- [ ] Route guards and authentication
- [ ] Lazy loading for components
- [ ] Route transitions and animations
- [ ] Deep linking support
- [ ] Route history management
- [ ] Breadcrumb customization
- [ ] Navigation menu customization
