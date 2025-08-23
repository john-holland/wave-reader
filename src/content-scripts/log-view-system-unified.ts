import { 
  createViewStateMachine,
  StructuralSystem,
  StructuralTomeConnector,
  createStructuralConfig,
  type AppStructureConfig
} from 'log-view-machine';
import LogViewContentSystemIntegrated from './log-view-content-system-integrated';
import LogViewShadowSystemIntegrated from './log-view-shadow-system-integrated';

// 🎯 IMPROVEMENT: Unified system that coordinates both content and shadow systems
// 🎯 IMPROVEMENT: Uses official createViewStateMachine from log-view-machine

// Unified System Structural Configuration
const UnifiedSystemConfig: AppStructureConfig = createStructuralConfig({
  AppStructure: {
    id: 'log-view-unified-system',
    name: 'Log View Unified System',
    type: 'application',
    routing: {
      base: '/',
      defaultRoute: '/unified'
    }
  },

  ComponentTomeMapping: {
    'unified-system': {
      componentPath: 'src/content-scripts/UnifiedSystemComponent.tsx',
      tomePath: 'src/content-scripts/UnifiedSystemTome.tsx',
      templatePath: 'src/content-scripts/templates/unified-system/'
    },
    'content-system': {
      componentPath: 'src/content-scripts/ContentSystemComponent.tsx',
      tomePath: 'src/content-scripts/ContentSystemTome.tsx',
      templatePath: 'src/content-scripts/templates/content-system/'
    },
    'shadow-system': {
      componentPath: 'src/content-scripts/ShadowSystemComponent.tsx',
      tomePath: 'src/content-scripts/ShadowSystemTome.tsx',
      templatePath: 'src/content-scripts/templates/shadow-system/'
    },
    'coordination': {
      componentPath: 'src/content-scripts/CoordinationComponent.tsx',
      tomePath: 'src/content-scripts/CoordinationTome.tsx',
      templatePath: 'src/content-scripts/templates/coordination/'
    }
  },

  RoutingConfig: {
    routes: [
      { path: '/', redirect: '/unified' },
      { path: '/unified', component: 'unified-system' },
      { path: '/content', component: 'content-system' },
      { path: '/shadow', component: 'shadow-system' },
      { path: '/coordination', component: 'coordination' }
    ],
    navigation: {
      primary: [
        { id: 'unified', label: 'Unified System', path: '/unified', icon: '🌊' },
        { id: 'content', label: 'Content System', path: '/content', icon: '📖' },
        { id: 'shadow', label: 'Shadow System', path: '/shadow', icon: '👁️' },
        { id: 'coordination', label: 'Coordination', path: '/coordination', icon: '🔗' }
      ]
    }
  },

  TomeConfig: {
    tomes: {
      'unified-system-tome': {
        machineId: 'unified-system',
        description: 'Manages unified system coordination',
        states: ['idle', 'initializing', 'active', 'coordinating', 'error', 'shutdown'],
        events: ['INIT', 'ACTIVATE', 'COORDINATE', 'ERROR', 'SHUTDOWN', 'RESTART']
      },
      'content-system-tome': {
        machineId: 'content-system',
        description: 'Manages content system state and lifecycle',
        states: ['idle', 'initializing', 'active', 'error', 'shutdown'],
        events: ['INIT', 'ACTIVATE', 'DEACTIVATE', 'ERROR', 'SHUTDOWN', 'RESTART']
      },
      'shadow-system-tome': {
        machineId: 'shadow-system',
        description: 'Manages shadow system state and lifecycle',
        states: ['idle', 'initializing', 'active', 'error', 'shutdown'],
        events: ['INIT', 'ACTIVATE', 'DEACTIVATE', 'ERROR', 'SHUTDOWN', 'RESTART']
      },
      'coordination-tome': {
        machineId: 'coordination',
        description: 'Manages coordination between content and shadow systems',
        states: ['idle', 'coordinating', 'synchronized', 'error'],
        events: ['START_COORDINATION', 'SYNC_SYSTEMS', 'ERROR', 'RESET']
      }
    }
  }
});

// 🎯 IMPROVEMENT: Unified system that coordinates both content and shadow systems
export class LogViewUnifiedSystem {
  private structuralSystem: StructuralSystem;
  private contentSystem: LogViewContentSystemIntegrated;
  private shadowSystem: LogViewShadowSystemIntegrated;
  private sessionId: string;
  private isInitialized: boolean = false;

  constructor() {
    console.log("🌊 Creating Log-View Unified System with Structural System...");
    
    this.sessionId = this.generateSessionId();
    
    // 🎯 IMPROVEMENT: Initialize structural system for coordination
    this.structuralSystem = new StructuralSystem(UnifiedSystemConfig);
    
    // Initialize the unified system
    this.init();
    
    console.log("🌊 Log-View Unified System initialized successfully");
  }

  private generateSessionId(): string {
    return `unified-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async init() {
    try {
      // 🎯 IMPROVEMENT: Initialize structural system machines
      await this.initializeStructuralMachines();
      
      // Initialize content and shadow systems
      this.contentSystem = new LogViewContentSystemIntegrated();
      this.shadowSystem = new LogViewShadowSystemIntegrated();
      
      // Set up coordination between systems
      this.setupCoordination();
      
      this.isInitialized = true;
      console.log("🌊 Unified system initialization completed");
      
    } catch (error) {
      console.error("🌊 Error initializing unified system:", error);
    }
  }

  // 🎯 IMPROVEMENT: Initialize machines using structural system
  private async initializeStructuralMachines() {
    try {
      // Create the main unified system machine
      const unifiedMachine = this.structuralSystem.createMachine('unified-system', {
        sessionId: this.sessionId,
        contentSystem: null,
        shadowSystem: null
      });

      if (unifiedMachine) {
        console.log("🌊 Unified system machine created successfully");
        await unifiedMachine.start();
      }

      // Create content system machine
      const contentMachine = this.structuralSystem.createMachine('content-system', {
        sessionId: this.sessionId
      });

      if (contentMachine) {
        console.log("🌊 Content system machine created successfully");
        await contentMachine.start();
      }

      // Create shadow system machine
      const shadowMachine = this.structuralSystem.createMachine('shadow-system', {
        sessionId: this.sessionId
      });

      if (shadowMachine) {
        console.log("🌊 Shadow system machine created successfully");
        await shadowMachine.start();
      }

      // Create coordination machine
      const coordinationMachine = this.structuralSystem.createMachine('coordination', {
        sessionId: this.sessionId,
        contentSystemState: 'idle',
        shadowSystemState: 'idle'
      });

      if (coordinationMachine) {
        console.log("🌊 Coordination machine created successfully");
        await coordinationMachine.start();
      }

    } catch (error) {
      console.error("🌊 Error initializing structural machines:", error);
      throw error;
    }
  }

  // 🎯 IMPROVEMENT: Set up coordination between content and shadow systems
  private setupCoordination() {
    if (!this.contentSystem || !this.shadowSystem) {
      console.warn("🌊 Content or shadow system not available for coordination");
      return;
    }

    // Set up message forwarding between systems
    this.contentSystem.processMessage = async (message: any, source: string) => {
      // Process message in content system
      const result = await this.contentSystem.processMessage(message, source);
      
      // Forward relevant messages to shadow system
      if (message.name.includes('WAVE') || message.name.includes('SELECTION')) {
        await this.shadowSystem.processMessage(message, 'content-system');
      }
      
      // Update coordination machine
      const coordinationMachine = this.structuralSystem.getMachine('coordination');
      if (coordinationMachine) {
        await coordinationMachine.send({ 
          type: 'SYNC_SYSTEMS', 
          payload: { 
            contentSystemState: result.newState.name,
            shadowSystemState: this.shadowSystem.getCurrentState()
          }
        });
      }
      
      return result;
    };

    this.shadowSystem.processMessage = async (message: any, source: string) => {
      // Process message in shadow system
      const result = await this.shadowSystem.processMessage(message, source);
      
      // Forward relevant messages to content system
      if (message.name.includes('MOUSE') || message.name.includes('SHADOW')) {
        await this.contentSystem.processMessage(message, 'shadow-system');
      }
      
      // Update coordination machine
      const coordinationMachine = this.structuralSystem.getMachine('coordination');
      if (coordinationMachine) {
        await coordinationMachine.send({ 
          type: 'SYNC_SYSTEMS', 
          payload: { 
            contentSystemState: this.contentSystem.getCurrentState(),
            shadowSystemState: result.newState.name
          }
        });
      }
      
      return result;
    };
  }

  // 🎯 IMPROVEMENT: Enhanced message processing using structural system
  async processMessage(message: any, source: string): Promise<any> {
    console.log(`🌊 Unified System: Processing message from ${source}:`, message.name);
    
    if (!this.isInitialized) {
      console.warn("🌊 Unified system not yet initialized");
      return { newState: { name: 'initializing' }, views: [], actions: [] };
    }
    
    try {
      // Get the appropriate machine based on message type
      let targetMachine = null;
      
      if (message.name.includes('CONTENT') || message.name.includes('WAVE')) {
        targetMachine = this.structuralSystem.getMachine('content-system');
        return await this.contentSystem.processMessage(message, source);
      } else if (message.name.includes('SHADOW') || message.name.includes('MOUSE')) {
        targetMachine = this.structuralSystem.getMachine('shadow-system');
        return await this.shadowSystem.processMessage(message, source);
      } else if (message.name.includes('COORDINATE') || message.name.includes('SYNC')) {
        targetMachine = this.structuralSystem.getMachine('coordination');
      } else {
        targetMachine = this.structuralSystem.getMachine('unified-system');
      }

      if (targetMachine) {
        // Send the message to the appropriate machine
        await targetMachine.send({ type: message.name, payload: message });
        
        // Get current state from the machine
        const currentState = targetMachine.getState()?.value || 'idle';
        const context = targetMachine.getState()?.context || {};
        
        // Generate views and actions based on the new state
        const views = this.generateViewsForState(currentState, message, context);
        const actions = this.generateActionsForMessage(message, currentState);
        
        return {
          newState: { name: currentState, context },
          views,
          actions
        };
      }
      
      return { newState: { name: 'idle' }, views: [], actions: [] };
      
    } catch (error) {
      console.error("🌊 Error processing message:", error);
      return { newState: { name: 'error' }, views: [], actions: [] };
    }
  }

  // 🎯 IMPROVEMENT: Enhanced view generation using structural system context
  private generateViewsForState(state: string, message: any, context: any): any[] {
    const views: any[] = [];
    const timestamp = Date.now();

    switch (state) {
      case 'active':
        views.push({
          type: 'content',
          component: 'UnifiedSystem',
          props: { 
            isActive: true, 
            message: 'Unified system active',
            context: context
          },
          priority: 1,
          timestamp
        });
        break;
        
      case 'coordinating':
        views.push({
          type: 'overlay',
          component: 'Coordination',
          props: { 
            isActive: true, 
            message: 'Systems coordinating',
            context: context
          },
          priority: 2,
          timestamp
        });
        break;
        
      case 'synchronized':
        views.push({
          type: 'content',
          component: 'SystemStatus',
          props: { 
            isActive: true, 
            message: 'Systems synchronized',
            context: context
          },
          priority: 3,
          timestamp
        });
        break;
        
      case 'error':
        views.push({
          type: 'notification',
          component: 'ErrorDisplay',
          props: { 
            isActive: true, 
            message: 'Unified system error',
            error: context.error || 'Unknown error',
            context: context
          },
          priority: 5,
          timestamp
        });
        break;
    }

    return views;
  }

  // 🎯 IMPROVEMENT: Enhanced action generation using structural system state
  private generateActionsForMessage(message: any, currentState: string): any[] {
    const actions: any[] = [];

    switch (message.name) {
      case 'START_COORDINATION':
        if (currentState !== 'coordinating') {
          actions.push({ type: 'ACTIVATE_COORDINATION' });
        }
        break;

      case 'SYNC_SYSTEMS':
        actions.push({ type: 'SYNCHRONIZE_SYSTEMS', payload: message.payload });
        break;

      case 'ERROR':
        actions.push({ type: 'HANDLE_ERROR', payload: message.payload });
        break;
    }

    return actions;
  }

  // 🎯 IMPROVEMENT: Enhanced state management using structural system
  getCurrentState(): any {
    const unifiedMachine = this.structuralSystem.getMachine('unified-system');
    return unifiedMachine?.getState()?.value || 'idle';
  }

  getCurrentViews(): any[] {
    const currentState = this.getCurrentState();
    const unifiedMachine = this.structuralSystem.getMachine('unified-system');
    const context = unifiedMachine?.getState()?.context || {};
    
    return this.generateViewsForState(currentState, {}, context);
  }

  clearProcessedViews(): void {
    // Views are managed by React components now
  }

  getStateHistory(): any[] {
    const unifiedMachine = this.structuralSystem.getMachine('unified-system');
    return unifiedMachine?.getState()?.context?.stateHistory || [];
  }

  // 🎯 IMPROVEMENT: Enhanced health status using structural system
  getHealthStatus(): any {
    const unifiedMachine = this.structuralSystem.getMachine('unified-system');
    const contentMachine = this.structuralSystem.getMachine('content-system');
    const shadowMachine = this.structuralSystem.getMachine('shadow-system');
    const coordinationMachine = this.structuralSystem.getMachine('coordination');
    
    return {
      timestamp: Date.now(),
      sessionId: this.sessionId,
      unifiedSystemState: unifiedMachine?.getState()?.value || 'idle',
      contentSystemState: contentMachine?.getState()?.value || 'idle',
      shadowSystemState: shadowMachine?.getState()?.value || 'idle',
      coordinationState: coordinationMachine?.getState()?.value || 'idle',
      structuralSystemActive: true,
      machineCount: this.structuralSystem.getAllMachines().size,
      viewQueueLength: this.getCurrentViews().length,
      messageHistoryLength: unifiedMachine?.getState()?.context?.messageQueue?.length || 0,
      stateHistoryLength: this.getStateHistory().length,
      isInitialized: this.isInitialized,
      contentSystemActive: !!this.contentSystem,
      shadowSystemActive: !!this.shadowSystem
    };
  }

  getMessageHistory(): any[] {
    const unifiedMachine = this.structuralSystem.getMachine('unified-system');
    return unifiedMachine?.getState()?.context?.messageQueue || [];
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // 🎯 IMPROVEMENT: Enhanced cleanup using structural system
  destroy(): void {
    console.log("🌊 Unified System: Destroying");
    
    try {
      // Clean up content and shadow systems
      if (this.contentSystem) {
        this.contentSystem.destroy();
      }
      
      if (this.shadowSystem) {
        this.shadowSystem.destroy();
      }
      
      // Clean up all structural system machines
      const machines = this.structuralSystem.getAllMachines();
      machines.forEach((machine, name) => {
        console.log(`🌊 Stopping machine: ${name}`);
        machine.stop();
      });
      
      // Clean up structural system
      this.structuralSystem = null;
      
      this.isInitialized = false;
      
    } catch (error) {
      console.error("🌊 Error during cleanup:", error);
    }
  }

  // 🎯 IMPROVEMENT: Get individual system references
  getContentSystem(): LogViewContentSystemIntegrated | null {
    return this.contentSystem || null;
  }

  getShadowSystem(): LogViewShadowSystemIntegrated | null {
    return this.shadowSystem || null;
  }

  // 🎯 IMPROVEMENT: Check system health
  isHealthy(): boolean {
    return this.isInitialized && 
           !!this.contentSystem && 
           !!this.shadowSystem && 
           !!this.structuralSystem;
  }
}

// 🎯 IMPROVEMENT: Export the unified system
export default LogViewUnifiedSystem;
