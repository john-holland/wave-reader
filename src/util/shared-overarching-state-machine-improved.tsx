import React from 'react';
import {
  StructuralSystem,
  StructuralTomeConnector,
  useStructuralTomeConnector,
  createStructuralConfig,
  type AppStructureConfig,
  type TomeDefinition
} from 'log-view-machine';

// 🎯 IMPROVEMENT #1: Declarative structure configuration instead of hardcoded states
const OverarchingSystemConfig: AppStructureConfig = createStructuralConfig({
  AppStructure: {
    id: 'overarching-system',
    name: 'Overarching System',
    type: 'application',
    routing: {
      base: '/',
      defaultRoute: '/base'
    }
  },

  ComponentTomeMapping: {
    'overarching-system': {
      componentPath: 'src/util/OverarchingSystemComponent.tsx',
      tomePath: 'src/util/OverarchingSystemTome.tsx',
      templatePath: 'src/util/templates/overarching-system/'
    },
    'content-system': {
      componentPath: 'src/util/ContentSystemComponent.tsx',
      tomePath: 'src/util/ContentSystemTome.tsx',
      templatePath: 'src/util/templates/content-system/'
    },
    'shadow-system': {
      componentPath: 'src/util/ShadowSystemComponent.tsx',
      tomePath: 'src/util/ShadowSystemTome.tsx',
      templatePath: 'src/util/templates/shadow-system/'
    },
    'background-system': {
      componentPath: 'src/util/BackgroundSystemComponent.tsx',
      tomePath: 'src/util/BackgroundSystemTome.tsx',
      templatePath: 'src/util/templates/background-system/'
    }
  },

  RoutingConfig: {
    routes: [
      { path: '/', redirect: '/base' },
      { path: '/base', component: 'overarching-system' },
      { path: '/content-active', component: 'content-system' },
      { path: '/shadow-active', component: 'shadow-system' },
      { path: '/waving', component: 'waving-system' },
      { path: '/selection-mode', component: 'selection-system' }
    ],
    navigation: {
      primary: [
        { id: 'base', label: 'Base', path: '/base', icon: '🏠' },
        { id: 'content', label: 'Content', path: '/content-active', icon: '📖' },
        { id: 'shadow', label: 'Shadow', path: '/shadow-active', icon: '👁️' },
        { id: 'waving', label: 'Waving', path: '/waving', icon: '🌊' },
        { id: 'selection', label: 'Selection', path: '/selection-mode', icon: '🎯' }
      ]
    }
  },

  TomeConfig: {
    tomes: {
      'overarching-system-tome': {
        machineId: 'overarching-system',
        description: 'Manages content, shadow, and background systems with integrated telemetry and routing',
        states: ['base', 'content-active', 'shadow-active', 'waving', 'selection-mode', 'error'],
        events: ['START', 'STOP', 'TOGGLE', 'WAVE-READER-START', 'WAVE-READER-STOP', 'ML-RECOMMENDATION', 'SETTINGS-RESET', 'SELECTION-MADE', 'START-SELECTION', 'END-SELECTION', 'WAVE-ANIMATION-START', 'WAVE-ANIMATION-STOP', 'MOUSE-TRACKING-START', 'MOUSE-TRACKING-STOP', 'CANCEL', 'RESET', 'RETRY']
      },
      'content-system-tome': {
        machineId: 'content-system',
        description: 'Manages wave reader content and animations',
        states: ['idle', 'active', 'waving', 'selecting'],
        events: ['ACTIVATE', 'DEACTIVATE', 'START_WAVE', 'STOP_WAVE', 'START_SELECTION', 'END_SELECTION']
      },
      'shadow-system-tome': {
        machineId: 'shadow-system',
        description: 'Manages shadow DOM and mouse tracking',
        states: ['idle', 'active', 'tracking'],
        events: ['ACTIVATE', 'DEACTIVATE', 'START_TRACKING', 'STOP_TRACKING', 'MOUSE_MOVE']
      },
      'background-system-tome': {
        machineId: 'background-system',
        description: 'Manages background services and ML recommendations',
        states: ['idle', 'active', 'ml-processing'],
        events: ['ACTIVATE', 'DEACTIVATE', 'START_ML', 'STOP_ML', 'ML_RECOMMENDATION']
      }
    }
  }
});

// 🎯 IMPROVEMENT #2: React components instead of manual view rendering
const OverarchingSystemComponent: React.FC = () => {
  const { structuralSystem } = useStructuralTomeConnector('overarching-system', structuralSystem);
  
  return (
    <StructuralTomeConnector
      componentName="overarching-system"
      structuralSystem={structuralSystem}
      initialModel={{
        contentSystem: { isActive: false, currentView: null, waveAnimation: { isActive: false }, selectorUI: { isVisible: false } },
        shadowSystem: { isActive: false, currentView: null, mouseTracking: { isActive: false }, shadowDOM: { isInitialized: false } },
        backgroundSystem: { isActive: true, activeTabs: new Map(), mlService: { isInitialized: false } },
        sessionId: `overarching-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }}
    >
      {(context) => (
        <div className="overarching-system">
          <h2>Overarching System</h2>
          <p>Current State: {context.currentState}</p>
          
          {/* 🎯 IMPROVEMENT #3: Declarative state-based rendering */}
          <SystemStatusDisplay context={context} />
          <SystemControls context={context} />
          <ViewQueue context={context} />
        </div>
      )}
    </StructuralTomeConnector>
  );
};

// 🎯 IMPROVEMENT #4: Component-based state rendering instead of manual functions
const SystemStatusDisplay: React.FC<{ context: any }> = ({ context }) => {
  const { model, currentState } = context;
  
  return (
    <div className="system-status">
      <h3>System Status</h3>
      <div className="status-grid">
        <div className={`status-item ${model.contentSystem.isActive ? 'active' : 'inactive'}`}>
          <span>Content System</span>
          <span>{model.contentSystem.isActive ? '🟢' : '🔴'}</span>
        </div>
        <div className={`status-item ${model.shadowSystem.isActive ? 'active' : 'inactive'}`}>
          <span>Shadow System</span>
          <span>{model.shadowSystem.isActive ? '🟢' : '🔴'}</span>
        </div>
        <div className={`status-item ${model.backgroundSystem.isActive ? 'active' : 'inactive'}`}>
          <span>Background System</span>
          <span>{model.backgroundSystem.isActive ? '🟢' : '🔴'}</span>
        </div>
      </div>
      <p>Session: {model.sessionId}</p>
    </div>
  );
};

// 🎯 IMPROVEMENT #5: Event-driven controls instead of manual action generation
const SystemControls: React.FC<{ context: any }> = ({ context }) => {
  const { sendEvent, currentState } = context;
  
  return (
    <div className="system-controls">
      <h3>System Controls</h3>
      <div className="control-buttons">
        <button 
          onClick={() => sendEvent({ type: 'START' })}
          disabled={currentState === 'content-active'}
        >
          Start Systems
        </button>
        <button 
          onClick={() => sendEvent({ type: 'STOP' })}
          disabled={currentState === 'base'}
        >
          Stop Systems
        </button>
        <button 
          onClick={() => sendEvent({ type: 'TOGGLE' })}
        >
          Toggle
        </button>
        <button 
          onClick={() => sendEvent({ type: 'WAVE-READER-START' })}
          disabled={currentState === 'base'}
        >
          Start Wave Reader
        </button>
        <button 
          onClick={() => sendEvent({ type: 'START-SELECTION' })}
          disabled={currentState === 'selection-mode'}
        >
          Start Selection
        </button>
      </div>
    </div>
  );
};

// 🎯 IMPROVEMENT #6: Automatic view queue management instead of manual generation
const ViewQueue: React.FC<{ context: any }> = ({ context }) => {
  const { model, logEntries } = context;
  
  return (
    <div className="view-queue">
      <h3>View Queue & Logs</h3>
      <div className="logs">
        {logEntries.slice(-5).map((entry: any, index: number) => (
          <div key={index} className="log-entry">
            <span className="timestamp">{new Date(entry.timestamp).toLocaleTimeString()}</span>
            <span className="message">{entry.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🎯 IMPROVEMENT #7: Simplified main class using structural system
export class ImprovedViewStateMachine {
  private structuralSystem: StructuralSystem;
  private robotProxy: any;
  private sessionId: string;

  constructor(robotProxy: any) {
    this.robotProxy = robotProxy;
    this.sessionId = this.generateSessionId();
    
    // 🎯 IMPROVEMENT #8: Use structural system instead of manual tome creation
    this.structuralSystem = new StructuralSystem(OverarchingSystemConfig);
    
    console.log("🌊 Improved View State Machine initialized with Structural System");
  }

  private generateSessionId(): string {
    return `view-state-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // 🎯 IMPROVEMENT #9: Simplified message processing using structural system
  async processMessage(message: any, source: string): Promise<any> {
    console.log(`🌊 Improved View State Machine: Processing message from ${source}:`, message.name);
    
    // Get the overarching system machine
    const machine = this.structuralSystem.getMachine('overarching-system') || 
                   this.structuralSystem.createMachine('overarching-system');
    
    if (machine) {
      // Send the message directly to the machine
      await machine.send({ type: message.name, payload: message });
      
      // Get current state from the machine
      const currentState = machine.getState()?.value || 'base';
      
      return {
        newState: { name: currentState, context: machine.getState()?.context },
        views: this.getCurrentViews(),
        actions: this.getCurrentActions()
      };
    }
    
    return { newState: { name: 'base' }, views: [], actions: [] };
  }

  // 🎯 IMPROVEMENT #10: Automatic view generation from structural system
  private getCurrentViews(): any[] {
    const machine = this.structuralSystem.getMachine('overarching-system');
    if (!machine) return [];
    
    const currentState = machine.getState()?.value || 'base';
    const context = machine.getState()?.context || {};
    
    // Views are now automatically managed by the structural system
    return [{
      type: 'content',
      component: 'OverarchingSystem',
      props: { currentState, context },
      priority: 1,
      timestamp: Date.now()
    }];
  }

  private getCurrentActions(): any[] {
    // Actions are now handled by the structural system's state machine
    return [];
  }

  // 🎯 IMPROVEMENT #11: Simplified state management
  getCurrentState(): any {
    const machine = this.structuralSystem.getMachine('overarching-system');
    return machine?.getState()?.value || 'base';
  }

  getCurrentViews(): any[] {
    return this.getCurrentViews();
  }

  clearProcessedViews(): void {
    // Views are managed by React components now
  }

  getStateHistory(): any[] {
    const machine = this.structuralSystem.getMachine('overarching-system');
    return machine?.getState()?.context?.stateHistory || [];
  }

  // 🎯 IMPROVEMENT #12: Enhanced health status using structural system
  getHealthStatus(): any {
    const machine = this.structuralSystem.getMachine('overarching-system');
    const currentState = machine?.getState()?.value || 'base';
    
    return {
      timestamp: Date.now(),
      sessionId: this.sessionId,
      currentState,
      stateMachineInitialized: !!machine,
      structuralSystemActive: true,
      tomeCount: this.structuralSystem.getAllMachines().size,
      viewQueueLength: this.getCurrentViews().length,
      messageHistoryLength: machine?.getState()?.context?.messageQueue?.length || 0,
      stateHistoryLength: this.getStateHistory().length
    };
  }

  getMessageHistory(): any[] {
    const machine = this.structuralSystem.getMachine('overarching-system');
    return machine?.getState()?.context?.messageQueue || [];
  }

  getSessionId(): string {
    return this.sessionId;
  }

  destroy(): void {
    console.log("🌊 Improved View State Machine: Destroying");
    // Clean up structural system resources
    this.structuralSystem = null;
  }
}

// 🎯 IMPROVEMENT #13: Export the improved component for easy use
export { OverarchingSystemComponent as default };
