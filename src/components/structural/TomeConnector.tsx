import React, { useEffect, useState, useRef, useMemo } from 'react';
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

// Simple browser-compatible tome machine
class BrowserTomeMachine {
  id: string;
  machineId: string;
  state: string;
  model: any;
  private listeners: Map<string, Function[]> = new Map();

  constructor(machineId: string, initialState: string, initialModel: any) {
    this.id = `${machineId}-${Date.now()}`;
    this.machineId = machineId;
    this.state = initialState;
    this.model = { ...initialModel };
  }

  sendEvent(event: any) {
    const { type, data } = event;
    
    // Handle state transitions based on event type
    switch (type) {
      case 'START_READING':
        if (this.state === 'idle') {
          this.state = 'reading';
          this.model.going = true;
          this.model.lastActivity = new Date().toISOString();
        }
        break;
      
      case 'STOP_READING':
        if (this.state === 'reading') {
          this.state = 'idle';
          this.model.going = false;
          this.model.lastActivity = new Date().toISOString();
        }
        break;
      
      case 'SELECTOR_UPDATE':
        this.model.selector = data?.selector || this.model.selector;
        this.model.lastActivity = new Date().toISOString();
        break;
      
      case 'SETTINGS_UPDATE':
        this.model.settings = { ...this.model.settings, ...data };
        this.model.lastActivity = new Date().toISOString();
        break;
      
      case 'ERROR':
        this.state = 'error';
        this.model.error = data?.message || 'Unknown error';
        this.model.lastActivity = new Date().toISOString();
        break;
      
      default:
        console.warn(`Unknown event type: ${type}`);
    }

    // Notify listeners
    this.notifyListeners('stateChange', { state: this.state, model: this.model });
    this.notifyListeners('logEntry', { 
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `Event ${type} processed, state: ${this.state}`,
      event,
      data: this.model
    });
  }

  updateModel(updates: any) {
    this.model = { ...this.model, ...updates };
    this.model.lastActivity = new Date().toISOString();
    
    // Notify listeners
    this.notifyListeners('modelUpdate', { model: this.model });
    this.notifyListeners('logEntry', {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Model updated',
      updates,
      data: this.model
    });
  }

  getState(): string {
    return this.state;
  }

  getModel(): any {
    return this.model;
  }

  addListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  removeListener(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
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

  const machineRef = useRef<BrowserTomeMachine | null>(null);

  // Get tome configuration and component mapping
  const tomeConfig = useMemo(() => {
    return TomeConfig.tomes[`${componentName}-tome` as keyof typeof TomeConfig.tomes];
  }, [componentName]);

  const componentMapping = useMemo(() => {
    return ComponentTomeMapping[componentName as keyof typeof ComponentTomeMapping];
  }, [componentName]);

  // Create the tome machine instance
  const tomeInstance = useMemo(() => {
    if (!tomeConfig) return null;
    
    try {
      const machine = new BrowserTomeMachine(
        tomeConfig.machineId,
        'idle',
        initialModel
      );
      
      // Set up event listeners
      machine.addListener('stateChange', (data: any) => {
        setState(prev => ({
          ...prev,
          currentState: data.state,
          model: data.model
        }));
        onStateChange?.(data.state, data.model);
      });

      machine.addListener('logEntry', (entry: any) => {
        setState(prev => ({
          ...prev,
          logEntries: [...prev.logEntries, entry].slice(-50) // Keep last 50 entries
        }));
        onLogEntry?.(entry);
      });

      machine.addListener('modelUpdate', (data: any) => {
        setState(prev => ({
          ...prev,
          model: data.model
        }));
      });

      return machine;
    } catch (error) {
      console.error(`Failed to create tome machine for ${componentName}:`, error);
      return null;
    }
  }, [componentName, tomeConfig, initialModel, onStateChange, onLogEntry]);

  // Store machine reference
  useEffect(() => {
    machineRef.current = tomeInstance;
  }, [tomeInstance]);

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

        if (!tomeInstance) {
          throw new Error(`Failed to create tome instance for component: ${componentName}`);
        }

        // Initialize with idle state
        tomeInstance.sendEvent({ type: 'INITIALIZE', data: { componentName } });

        setState(prev => ({
          ...prev,
          machine: tomeInstance,
          currentState: tomeInstance.getState(),
          model: tomeInstance.getModel(),
          isLoading: false,
          error: null
        }));

        console.log(`🌊 TomeConnector: Initialized ${componentName} with machine ${tomeInstance.id}`);
      } catch (error) {
        console.error(`🌊 TomeConnector: Failed to initialize ${componentName}:`, error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    };

    initializeTome();
  }, [componentName, tomeConfig, componentMapping, tomeInstance]);

  if (state.isLoading) {
    return (
      <div className="tome-connector-loading">
        <div className="loading-spinner">🌊</div>
        <div>Initializing {componentName}...</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="tome-connector-error">
        <div className="error-icon">❌</div>
        <div className="error-message">Error: {state.error}</div>
      </div>
    );
  }

  return (
    <div className="tome-connector">
      <div className="tome-content">
        {children}
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="tome-debug-panel" style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '11px',
          zIndex: 1000,
          fontFamily: 'monospace',
          maxWidth: '300px'
        }}>
          <div>🌊 {componentName} Tome</div>
          <div>State: {state.currentState}</div>
          <div>Machine: {machineRef.current?.id}</div>
          <div>Logs: {state.logEntries.length}</div>
        </div>
      )}
    </div>
  );
};

// Hook to use tome connector
export const useTomeConnector = (componentName: string) => {
  const [machine, setMachine] = useState<any>(null);
  const [currentState, setCurrentState] = useState<string>('idle');
  const [model, setModel] = useState<any>({});

  const sendEvent = (event: any) => {
    if (machine) {
      machine.sendEvent(event);
    }
  };

  const updateModel = (updates: any) => {
    if (machine) {
      machine.updateModel(updates);
    }
  };

  return {
    machine,
    currentState,
    model,
    sendEvent,
    updateModel,
    setMachine,
    setCurrentState,
    setModel
  };
};

export default TomeConnector;

