# Wave Reader Tomes Integration Guide

This guide provides step-by-step instructions for integrating the new Tomes-based wave-reader system into your existing project.

## Quick Start

### 1. **Start the Tomes Server**

```bash
# Start the server in the background
node src/tome-server.js &

# Or start it in the foreground to see logs
node src/tome-server.js
```

The server will start on port 3003.

### 2. **Test the Server**

```bash
# Health check
curl http://localhost:3003/health

# Test SSR page
curl http://localhost:3003/wave-reader

# Test client template
curl http://localhost:3003/wave-reader-client
```

### 3. **Replace Your App Component**

In your main React app, replace the old App import:

```typescript
// OLD
import App from './app';

// NEW
import AppTomes from './app-tomes';

// Update your render
<AppTomes />
```

## Integration Options

### Option 1: Full Replacement

Replace your entire `App.tsx` with `app-tomes.tsx`:

```typescript
// src/index.tsx or your main entry point
import React from 'react';
import ReactDOM from 'react-dom';
import AppTomes from './app-tomes';

ReactDOM.render(
  <React.StrictMode>
    <AppTomes />
  </React.StrictMode>,
  document.getElementById('root')
);
```

### Option 2: Gradual Migration

Keep both components and switch between them:

```typescript
// src/index.tsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import AppTomes from './app-tomes';

const AppSwitcher = () => {
  const [useTomes, setUseTomes] = useState(false);
  
  return (
    <div>
      <div style={{ padding: '10px', background: '#f0f0f0' }}>
        <label>
          <input 
            type="checkbox" 
            checked={useTomes} 
            onChange={(e) => setUseTomes(e.target.checked)} 
          />
          Use Tomes Architecture
        </label>
      </div>
      
      {useTomes ? <AppTomes /> : <App />}
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <AppSwitcher />
  </React.StrictMode>,
  document.getElementById('root')
);
```

### Option 3: Component-Level Integration

Use specific Tomes components in your existing app:

```typescript
// src/app.tsx
import React from 'react';
import { createWaveReaderStateMachine } from './component-middleware/wave-reader/robotcopy-pact-config';

const App = () => {
  const [waveReaderMachine, setWaveReaderMachine] = useState(null);
  
  useEffect(() => {
    // Initialize Tomes state machine
    const machine = createWaveReaderStateMachine();
    setWaveReaderMachine(machine);
    
    machine.send({ type: 'INITIALIZE_WAVE_READER' });
  }, []);
  
  // Your existing app logic here
  return (
    <div>
      {/* Existing components */}
      
      {/* Tomes-integrated wave reader */}
      {waveReaderMachine && (
        <WaveReaderTomes machine={waveReaderMachine} />
      )}
    </div>
  );
};
```

## Configuration

### Environment Variables

Create a `.env` file for configuration:

```bash
# .env
TOMES_SERVER_PORT=3003
TOMES_SERVER_HOST=localhost
WAVE_READER_API_URL=http://localhost:3003/api
```

### Webpack Configuration

Update your webpack config to handle the new structure:

```javascript
// webpack.common.js
module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@tomes': path.resolve(__dirname, 'src/component-middleware'),
      '@wave-reader': path.resolve(__dirname, 'src/component-middleware/wave-reader'),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
```

## API Integration

### Using the Tomes API

The Tomes server provides REST API endpoints:

```typescript
// Start wave reader
const startWaveReader = async (selector: string) => {
  const response = await fetch('http://localhost:3003/api/wave-reader/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selector, options: {} })
  });
  
  return response.json();
};

// Stop wave reader
const stopWaveReader = async () => {
  const response = await fetch('http://localhost:3003/api/wave-reader/stop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  
  return response.json();
};
```

### Chrome Extension Integration

For Chrome extension usage, update your manifest:

```json
// manifest.json
{
  "permissions": [
    "activeTab",
    "storage",
    "http://localhost:3003/*"
  ],
  "content_security_policy": {
    "extension_pages": "script-src 'self' http://localhost:3003; object-src 'self'"
  }
}
```

## State Management

### Using the State Machine

```typescript
import { createWaveReaderStateMachine } from './component-middleware/wave-reader/robotcopy-pact-config';

const useWaveReader = () => {
  const [machine, setMachine] = useState(null);
  const [state, setState] = useState('idle');
  
  useEffect(() => {
    const waveReader = createWaveReaderStateMachine();
    setMachine(waveReader);
    
    // Subscribe to state changes
    waveReader.subscribe((snapshot) => {
      setState(snapshot.value);
    });
    
    // Initialize
    waveReader.send({ type: 'INITIALIZE_WAVE_READER' });
  }, []);
  
  const startReading = (selector: string) => {
    machine?.send({ type: 'START_WAVE_READER', selector });
  };
  
  const stopReading = () => {
    machine?.send({ type: 'STOP_WAVE_READER' });
  };
  
  return { state, startReading, stopReading };
};
```

### Custom State Machines

Create your own state machines following the pattern:

```typescript
// src/component-middleware/my-component/robotcopy-config.js
import { createViewStateMachine } from '../../../../log-view-machine/src/core/ViewStateMachine';

export const createMyComponentStateMachine = () => {
  return createViewStateMachine({
    machineId: 'my-component',
    xstateConfig: {
      id: 'my-component',
      initial: 'idle',
      states: {
        idle: {
          on: { START: 'active' }
        },
        active: {
          on: { STOP: 'idle' }
        }
      }
    }
  });
};
```

## Testing

### Unit Tests

```typescript
// src/component-middleware/wave-reader/__tests__/state-machine.test.ts
import { createWaveReaderStateMachine } from '../robotcopy-pact-config';

describe('Wave Reader State Machine', () => {
  let machine;
  
  beforeEach(() => {
    machine = createWaveReaderStateMachine();
  });
  
  test('should start in idle state', () => {
    expect(machine.getSnapshot().value).toBe('idle');
  });
  
  test('should transition to waving on START_WAVE_READER', async () => {
    await machine.send({ type: 'START_WAVE_READER' });
    expect(machine.getSnapshot().value).toBe('waving');
  });
});
```

### Integration Tests

```typescript
// src/__tests__/tomes-integration.test.ts
import { render, screen } from '@testing-library/react';
import AppTomes from '../app-tomes';

describe('Tomes Integration', () => {
  test('should render wave reader interface', () => {
    render(<AppTomes />);
    expect(screen.getByText('🌊 Wave Reader')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues

1. **Server won't start**
   - Check if port 3003 is available
   - Ensure all dependencies are installed
   - Check for syntax errors in tome-server.js

2. **Import errors**
   - Verify log-view-machine is installed
   - Check import paths in robotcopy config
   - Ensure babel/webpack can handle ES modules

3. **State machine errors**
   - Check XState syntax
   - Verify state transitions
   - Check action implementations

4. **API errors**
   - Ensure Tomes server is running
   - Check CORS settings
   - Verify endpoint URLs

### Debug Mode

Enable debug logging:

```typescript
// In your robotcopy config
const ROBOTCOPY_CONFIG = {
  enableTracing: true,
  enableDataDog: true,
  debug: true
};
```

### Logs

Check server logs:

```bash
# View server logs
node src/tome-server.js 2>&1 | tee tome-server.log

# Check for errors
grep -i error tome-server.log
```

## Performance Considerations

### Lazy Loading

```typescript
// Lazy load Tomes components
const WaveReaderTomes = React.lazy(() => import('./app-tomes'));

// Use Suspense
<Suspense fallback={<div>Loading...</div>}>
  <WaveReaderTomes />
</Suspense>
```

### State Machine Optimization

```typescript
// Use predictable action arguments
const machine = createMachine({
  predictableActionArguments: true,
  // ... rest of config
});
```

### Caching

```typescript
// Cache state machine instances
const machineCache = new Map();

const getOrCreateMachine = (id: string) => {
  if (!machineCache.has(id)) {
    machineCache.set(id, createWaveReaderStateMachine());
  }
  return machineCache.get(id);
};
```

## Next Steps

1. **Customize Components**: Modify the wave-reader component template
2. **Add New States**: Extend the state machine with new functionality
3. **Integrate Services**: Connect to your existing services
4. **Add Tests**: Create comprehensive test coverage
5. **Performance Tuning**: Optimize for your use case

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the TOMES_REFACTORING_README.md
- Examine the log-view-machine documentation
- Check the XState documentation for state machine patterns
