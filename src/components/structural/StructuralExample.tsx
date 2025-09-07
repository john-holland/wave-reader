import React, { useState, useEffect } from 'react';
import { createViewStateMachine } from '../../mocks/log-view-machine';

/**
 * StructuralExample demonstrates the structural system patterns
 * Note: Full structural system not yet available, using createViewStateMachine for now
 */
export const StructuralExample: React.FC = () => {
  const [machineState, setMachineState] = useState('idle');
  const [machine, setMachine] = useState<any>(null);

  useEffect(() => {
    // Create a simple state machine using createViewStateMachine
    const testMachine = createViewStateMachine({
      machineId: 'structural-example',
      xstateConfig: {
        id: 'structural-example',
        initial: 'idle',
        states: {
          idle: {
            on: { ACTIVATE: 'active' }
          },
          active: {
            on: { DEACTIVATE: 'idle', START: 'running' }
          },
          running: {
            on: { STOP: 'active', ERROR: 'error' }
          },
          error: {
            on: { RESTART: 'idle' }
          }
        }
      }
    });

    setMachine(testMachine);
    
    // Get initial state
    setMachineState('idle');
    
    console.log("🌊 Structural example machine created:", testMachine);
    
    return () => {
      // Cleanup if needed
      console.log("🌊 Cleaning up structural example machine");
    };
  }, []);

  const sendEvent = (eventType: string) => {
    if (machine) {
      try {
        // Try to use the machine's send method if available
        if (typeof machine.send === 'function') {
          machine.send({ type: eventType });
          console.log(`🌊 Sent event: ${eventType}`);
        } else {
          console.log(`🌊 Machine send method not available, event: ${eventType}`);
        }
      } catch (error) {
        console.error(`🌊 Error sending event ${eventType}:`, error);
      }
    }
  };

  return (
    <div className="structural-example">
      <h2>Structural System Example</h2>
      <p>This demonstrates the structural system patterns that will be available in log-view-machine.</p>
      
      <div className="example-section">
        <h3>Component Organization</h3>
        <p>The structural system provides:</p>
        <ul>
          <li>Declarative application structure</li>
          <li>Component-tome mapping</li>
          <li>Automatic routing and navigation</li>
          <li>State machine management</li>
        </ul>
      </div>

      <div className="example-section">
        <h3>Current Implementation</h3>
        <p>Using createViewStateMachine from log-view-machine:</p>
        <div className="state-machine-demo">
          <p><strong>Current State:</strong> {machineState}</p>
          <p><strong>Machine Status:</strong> {machine ? 'Created' : 'Not Created'}</p>
          <div className="controls">
            <button onClick={() => sendEvent('ACTIVATE')} disabled={machineState !== 'idle'}>
              Activate
            </button>
            <button onClick={() => sendEvent('START')} disabled={machineState !== 'active'}>
              Start
            </button>
            <button onClick={() => sendEvent('STOP')} disabled={machineState !== 'running'}>
              Stop
            </button>
            <button onClick={() => sendEvent('DEACTIVATE')} disabled={machineState !== 'active'}>
              Deactivate
            </button>
            <button onClick={() => sendEvent('ERROR')} disabled={machineState === 'error'}>
              Trigger Error
            </button>
            <button onClick={() => sendEvent('RESTART')} disabled={machineState !== 'error'}>
              Restart
            </button>
          </div>
          <p className="note">
            Note: This is a demonstration of createViewStateMachine. 
            The full structural system will provide enhanced state management capabilities.
          </p>
        </div>
      </div>

      <div className="example-section">
        <h3>Future Features</h3>
        <p>When the structural system is fully available, this will include:</p>
        <ul>
          <li>StructuralRouter with built-in navigation</li>
          <li>StructuralTomeConnector for enhanced connectivity</li>
          <li>Automatic state management</li>
          <li>Type-safe configuration</li>
        </ul>
      </div>
    </div>
  );
};

export default StructuralExample;
