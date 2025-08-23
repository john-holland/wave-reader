import React from 'react';
import { TomeConnector, useTomeConnector } from './index';
import { GoButtonTomes } from '../../component-middleware/go-button/GoButtonTomes';

/**
 * Structural Example Component
 * 
 * Demonstrates how to use the structural system with tome integration.
 * This shows how components can be wrapped with TomeConnector to get
 * state management and logging capabilities.
 */

export const StructuralExample: React.FC = () => {
  const handleStateChange = (state: string, model: any) => {
    console.log('Go Button state changed:', { state, model });
  };

  const handleLogEntry = (entry: any) => {
    console.log('Go Button log entry:', entry);
  };

  return (
    <div className="structural-example">
      <h2>Structural System Example</h2>
      <p>This demonstrates the integration between React components and log-view-machine tomes.</p>
      
      <div className="example-section">
        <h3>Go Button with Tome Integration</h3>
        <p>The go button below is wrapped with TomeConnector, giving it:</p>
        <ul>
          <li>State management via log-view-machine</li>
          <li>Built-in logging for debugging</li>
          <li>Event-driven state transitions</li>
          <li>Automatic view updates</li>
          <li>Local component reference for performance</li>
          <li>Copied logStates from the tome for consistency</li>
        </ul>
        
        <TomeConnector
          componentName="go-button"
          initialModel={{
            displayText: 'Start Waving!',
            buttonSize: 'large',
            buttonStyle: 'primary',
            waveSymbol: '🌊'
          }}
          onStateChange={handleStateChange}
          onLogEntry={handleLogEntry}
        >
          <div className="go-button-wrapper">
            <button 
              className="example-go-button"
              onClick={() => {
                // This would typically be handled by the tome
                console.log('Go button clicked!');
              }}
            >
              🌊 Start Waving!
            </button>
            <p className="example-description">
              Click the button to see state changes and logging in the console.
            </p>
          </div>
        </TomeConnector>
      </div>
      
      <div className="example-section">
        <h3>Direct Tome Usage</h3>
        <p>You can also create and use tomes directly:</p>
        
        <div className="tome-example">
          <button 
            onClick={() => {
              const tome = GoButtonTomes.create({
                displayText: 'Custom Button',
                buttonSize: 'small',
                buttonStyle: 'secondary'
              });
              
              console.log('Created tome:', tome);
              
              // Send events to the tome
              if (tome && typeof (tome as any).send === 'function') {
                (tome as any).send({ type: 'GO' });
              } else {
                console.log('Tome created but send method not available');
              }
            }}
          >
            Create and Use Tome
          </button>
          <p>Check the console to see the tome being created and used.</p>
        </div>
      </div>
      
      <div className="example-section">
        <h3>Using TomeConnector Hook</h3>
        <p>You can also use the hook version for more control:</p>
        
        <TomeConnectorHookExample />
      </div>
      
      <div className="example-section">
        <h3>Component Structure</h3>
        <p>The application follows this component hierarchy:</p>
        <pre className="structure-tree">
{`wave-tabs (navigation)
├── wave-reader (main content)
│   ├── go-button (control)
│   └── selector-input (input)
├── settings (configuration)
└── about (information)

background (services)
└── interchange (communication)

content (scripts)
└── wave-reader-content
    └── selector-hierarchy (content control)`}
        </pre>
      </div>
      
      <div className="example-section">
        <h3>Routing Configuration</h3>
        <p>Routes are configured declaratively in the structure configuration:</p>
        <ul>
          <li><code>/wave-tabs</code> - Main navigation</li>
          <li><code>/wave-tabs/wave-reader</code> - Main content area</li>
          <li><code>/wave-tabs/wave-reader/go-button</code> - Go button control</li>
          <li><code>/wave-tabs/settings</code> - Settings panel</li>
          <li><code>/wave-tabs/about</code> - About information</li>
        </ul>
      </div>
      
      <div className="example-section">
        <h3>Next Steps</h3>
        <p>To continue integrating the structural system:</p>
        <ol>
          <li>Wrap more components with TomeConnector</li>
          <li>Create tomes for other components (selector-input, settings, etc.)</li>
          <li>Use the AppRouter for navigation between components</li>
          <li>Add more state management and logging to tomes</li>
          <li>Customize the routing and navigation structure</li>
        </ol>
      </div>
    </div>
  );
};

// Example component using the TomeConnector hook
const TomeConnectorHookExample: React.FC = () => {
  const { 
    currentState, 
    model, 
    sendEvent, 
    updateModel, 
    componentInstance,
    getComponentMethod 
  } = useTomeConnector('go-button');
  
  const handleClick = () => {
    sendEvent({ type: 'GO' });
  };
  
  const updateText = (newText: string) => {
    updateModel({ displayText: newText });
  };
  
  const handleCustomMethod = () => {
    // Try to get a custom method from the component instance
    const customMethod = getComponentMethod('customMethod');
    if (customMethod) {
      customMethod();
    } else {
      console.log('Custom method not available');
    }
  };
  
  return (
    <div className="hook-example">
      <h4>Hook-based TomeConnector</h4>
      <p>Current State: <strong>{currentState}</strong></p>
      <p>Display Text: <strong>{model.displayText || 'Not set'}</strong></p>
      
      <div className="hook-controls">
        <button onClick={handleClick}>Send GO Event</button>
        <button onClick={() => updateText('Updated Text!')}>Update Text</button>
        <button onClick={handleCustomMethod}>Try Custom Method</button>
      </div>
      
      <div className="hook-info">
        <p><strong>Component Instance:</strong> {componentInstance ? 'Available' : 'Not available'}</p>
        <p><strong>Model Keys:</strong> {Object.keys(model).join(', ') || 'None'}</p>
      </div>
    </div>
  );
};

export default StructuralExample;
