import React, { useEffect, useState, useRef, useMemo } from 'react';
import { createViewStateMachine } from 'log-view-machine';
import { ComponentTomeMapping, TomeConfig } from './app-structure';

interface TomeConnectorProps {
  componentName: string;
  initialModel?: any;
  onStateChange?: (state: string, model: any) => void;
  onLogEntry?: (entry: any) => void;
  children?: React.ReactNode;
}

interface TomeConnectorState {
  machine: any;
  currentState: string;
  model: any;
  logEntries: any[];
  isLoading: boolean;
  error: string | null;
}

export const TomeConnector: React.FC<TomeConnectorProps> = ({
  componentName,
  initialModel = {},
  onStateChange,
  onLogEntry,
  children
}) => {
  const [state, setState] = useState<TomeConnectorState>({
    machine: null,
    currentState: 'idle',
    model: initialModel,
    logEntries: [],
    isLoading: true,
    error: null
  });

  const machineRef = useRef<any>(null);
  const logEntriesRef = useRef<any[]>([]);
  const componentRef = useRef<any>(null);

  // Get tome configuration and component mapping
  const tomeConfig = useMemo(() => {
    return TomeConfig.tomes[`${componentName}-tome` as keyof typeof TomeConfig.tomes];
  }, [componentName]);

  const componentMapping = useMemo(() => {
    return ComponentTomeMapping[componentName as keyof typeof ComponentTomeMapping];
  }, [componentName]);

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

  // Initialize the tome machine
  useEffect(() => {
    const initializeTome = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        // Validate configuration
        if (!tomeConfig) {
          throw new Error(`No tome configuration found for component: ${componentName}`);
        }

        if (!componentMapping) {
          throw new Error(`No component mapping found for: ${componentName}`);
        }

        // If we have a component instance, use its configuration
        let machine;
        if (componentInstance) {
          // Use the component's existing machine if available
          if (componentInstance.machine) {
            machine = componentInstance.machine;
          } else {
            // Create machine using component's configuration
            machine = createViewStateMachine({
              machineId: tomeConfig.machineId,
              xstateConfig: componentInstance.xstateConfig || {
                id: tomeConfig.machineId,
                initial: 'idle',
                context: {
                  model: initialModel,
                  componentName,
                  tomeId: `${componentName}-tome`
                }
              },
              // Copy logStates from the component instance if available
              logStates: componentInstance.logStates || createDefaultLogStates(componentName)
            });
          }
        } else {
          // Fallback: create basic machine with default configuration
          machine = createViewStateMachine({
            machineId: tomeConfig.machineId,
            xstateConfig: {
              id: tomeConfig.machineId,
              initial: 'idle',
              context: {
                model: initialModel,
                componentName,
                tomeId: `${componentName}-tome`
              },
                           states: tomeConfig.states.reduce((acc: Record<string, any>, stateName: string) => {
               acc[stateName] = {
                 on: {
                   ERROR: { target: 'error' },
                   RESET: { target: 'idle' }
                 }
               };
               return acc;
             }, {} as Record<string, any>)
            },
            logStates: createDefaultLogStates(componentName)
          });
        }

        // Set up event handlers
        machine.on('stateChange', (event: any) => {
          const newState = event.state;
          const newModel = event.context?.model || state.model;
          
          setState(prev => ({
            ...prev,
            currentState: newState,
            model: newModel
          }));

          onStateChange?.(newState, newModel);
        });

        machine.on('logEntry', (entry: any) => {
          logEntriesRef.current.push(entry);
          setState(prev => ({
            ...prev,
            logEntries: [...prev.logEntries, entry]
          }));

          onLogEntry?.(entry);
        });

        // Store machine reference
        machineRef.current = machine;

        // Initialize the machine
        await machine.executeServerState('idle', initialModel);

        setState(prev => ({
          ...prev,
          machine,
          isLoading: false,
          currentState: 'idle'
        }));

      } catch (error) {
        console.error(`Failed to initialize tome for ${componentName}:`, error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    };

    initializeTome();
  }, [componentName, initialModel, onStateChange, onLogEntry, tomeConfig, componentMapping, componentInstance]);

  // Send events to the machine
  const sendEvent = (event: any) => {
    if (machineRef.current) {
      try {
        machineRef.current.send(event);
      } catch (error) {
        console.error(`Failed to send event ${event.type}:`, error);
        setState(prev => ({
          ...prev,
          error: `Failed to send event: ${event.type}`
        }));
      }
    }
  };

  // Update model
  const updateModel = (updates: any) => {
    if (machineRef.current) {
      try {
        const newModel = { ...state.model, ...updates };
        machineRef.current.executeServerState(state.currentState, newModel);
        
        setState(prev => ({
          ...prev,
          model: newModel
        }));
      } catch (error) {
        console.error('Failed to update model:', error);
        setState(prev => ({
          ...prev,
          error: 'Failed to update model'
        }));
      }
    }
  };

  // Reset machine
  const resetMachine = () => {
    if (machineRef.current) {
      try {
        machineRef.current.send({ type: 'RESET' });
        setState(prev => ({
          ...prev,
          error: null,
          currentState: 'idle'
        }));
      } catch (error) {
        console.error('Failed to reset machine:', error);
      }
    }
  };

  // Get component methods if available
  const getComponentMethod = (methodName: string) => {
    if (componentRef.current && typeof componentRef.current[methodName] === 'function') {
      return componentRef.current[methodName].bind(componentRef.current);
    }
    return null;
  };

  // Render loading state
  if (state.isLoading) {
    return (
      <div className="tome-connector-loading">
        <div className="loading-spinner"></div>
        <p>Initializing {componentName} tome...</p>
      </div>
    );
  }

  // Render error state
  if (state.error) {
    return (
      <div className="tome-connector-error">
        <h3>Error in {componentName}</h3>
        <p>{state.error}</p>
        <button onClick={resetMachine}>Reset</button>
      </div>
    );
  }

  // Render children with tome context
  return (
    <div className="tome-connector">
      <div className="tome-header">
        <h4>{componentName} Tome</h4>
        <span className="tome-state">State: {state.currentState}</span>
        <button onClick={resetMachine}>Reset</button>
      </div>
      
      <div className="tome-content">
        {children}
      </div>
      
      <div className="tome-footer">
        <div className="tome-logs">
          <h5>Recent Logs</h5>
          <div className="log-entries">
            {state.logEntries.slice(-5).map((entry, index) => (
              <div key={index} className="log-entry">
                <span className="log-timestamp">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
                <span className="log-level">{entry.level}</span>
                <span className="log-message">{entry.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Create default logStates when component tome is not available
function createDefaultLogStates(componentName: string) {
  return {
    idle: async (context: any) => {
      await context.log(`${componentName} is idle`);
      return context.view(renderDefaultIdleView(context, componentName));
    },
    error: async (context: any) => {
      await context.log(`${componentName} encountered an error`);
      return context.view(renderDefaultErrorView(context, componentName));
    }
  };
}

// Helper functions for rendering default views
function renderDefaultIdleView(context: any, componentName: string) {
  return (
    <div className="tome-default-idle-view">
      <p>Component {componentName} is idle</p>
    </div>
  );
}

function renderDefaultErrorView(context: any, componentName: string) {
  return (
    <div className="tome-default-error-view">
      <p>Component {componentName} has an error</p>
    </div>
  );
}

// Hook to use tome connector
export const useTomeConnector = (componentName: string) => {
  const [machine, setMachine] = useState<any>(null);
  const [currentState, setCurrentState] = useState<string>('idle');
  const [model, setModel] = useState<any>({});
  const [componentInstance, setComponentInstance] = useState<any>(null);

  const sendEvent = (event: any) => {
    if (machine) {
      machine.send(event);
    }
  };

  const updateModel = (updates: any) => {
    if (machine) {
      const newModel = { ...model, ...updates };
      machine.executeServerState(currentState, newModel);
      setModel(newModel);
    }
  };

  const getComponentMethod = (methodName: string) => {
    if (componentInstance && typeof componentInstance[methodName] === 'function') {
      return componentInstance[methodName].bind(componentInstance);
    }
    return null;
  };

  return {
    machine,
    currentState,
    model,
    componentInstance,
    sendEvent,
    updateModel,
    getComponentMethod,
    setMachine,
    setCurrentState,
    setModel,
    setComponentInstance
  };
};

export default TomeConnector;
