import { 
  createViewStateMachine,
  StructuralSystem,
  StructuralTomeConnector,
  createStructuralConfig,
  type AppStructureConfig
} from 'log-view-machine';
import { LogViewMessageUtility } from '../util/log-view-messages';
import { MessageFactory } from '../models/messages/log-view-messages';
import { 
  BaseVentures, 
  StartVentures, 
  StopVentures, 
  WavingVentures,
  MLVentures,
  WaveReaderVentures,
  AnalyticsVentures,
  ExtensionVentures
} from '../util/venture-states';
import { MountOrFindSelectorHierarchyComponent } from '../components/selector-hierarchy';
import { SelectorHierarchy } from '../services/selector-hierarchy';
import { SimpleColorServiceAdapter } from '../services/simple-color-service';
import { MLSettingsService } from '../services/ml-settings-service';
import Wave from '../models/wave';
import Options from '../models/options';

// 🎯 IMPROVEMENT: Use official createViewStateMachine from log-view-machine
// 🎯 IMPROVEMENT: Integrate with structural system for better organization

// Shadow System Structural Configuration
const ShadowSystemConfig: AppStructureConfig = createStructuralConfig({
  AppStructure: {
    id: 'log-view-shadow-system',
    name: 'Log View Shadow System',
    type: 'application',
    routing: {
      base: '/',
      defaultRoute: '/shadow'
    }
  },

  ComponentTomeMapping: {
    'shadow-system': {
      componentPath: 'src/content-scripts/ShadowSystemComponent.tsx',
      tomePath: 'src/content-scripts/ShadowSystemTome.tsx',
      templatePath: 'src/content-scripts/templates/shadow-system/'
    },
    'mouse-tracking': {
      componentPath: 'src/content-scripts/MouseTrackingComponent.tsx',
      tomePath: 'src/content-scripts/MouseTrackingTome.tsx',
      templatePath: 'src/content-scripts/templates/mouse-tracking/'
    },
    'shadow-dom': {
      componentPath: 'src/content-scripts/ShadowDOMComponent.tsx',
      tomePath: 'src/content-scripts/ShadowDOMTome.tsx',
      templatePath: 'src/content-scripts/templates/shadow-dom/'
    }
  },

  RoutingConfig: {
    routes: [
      { path: '/', redirect: '/shadow' },
      { path: '/shadow', component: 'shadow-system' },
      { path: '/mouse-tracking', component: 'mouse-tracking' },
      { path: '/shadow-dom', component: 'shadow-dom' }
    ],
    navigation: {
      primary: [
        { id: 'shadow', label: 'Shadow System', path: '/shadow', icon: '👁️' },
        { id: 'mouse-tracking', label: 'Mouse Tracking', path: '/mouse-tracking', icon: '🖱️' },
        { id: 'shadow-dom', label: 'Shadow DOM', path: '/shadow-dom', icon: '🌳' }
      ]
    }
  },

  TomeConfig: {
    tomes: {
      'shadow-system-tome': {
        machineId: 'shadow-system',
        description: 'Manages shadow system state and lifecycle',
        states: ['idle', 'initializing', 'active', 'error', 'shutdown'],
        events: ['INIT', 'ACTIVATE', 'DEACTIVATE', 'ERROR', 'SHUTDOWN', 'RESTART']
      },
      'mouse-tracking-tome': {
        machineId: 'mouse-tracking',
        description: 'Manages mouse tracking functionality',
        states: ['idle', 'tracking', 'paused', 'stopped', 'error'],
        events: ['START_TRACKING', 'PAUSE_TRACKING', 'STOP_TRACKING', 'MOUSE_MOVE', 'ERROR', 'RESTART']
      },
      'shadow-dom-tome': {
        machineId: 'shadow-dom',
        description: 'Manages shadow DOM operations',
        states: ['idle', 'initializing', 'active', 'updating', 'error'],
        events: ['INIT', 'ACTIVATE', 'UPDATE', 'ERROR', 'RESET', 'DESTROY']
      }
    }
  }
});

// 🎯 IMPROVEMENT: Enhanced shadow system using structural system
export class LogViewShadowSystemIntegrated {
  private shadowRoot: ShadowRoot | null = null;
  private shadowStyleElement: HTMLStyleElement | null = null;
  private selectorUiRoot: HTMLDivElement | null = null;
  private going: boolean = false;
  private latestOptions: Options | undefined;
  private hierarchySelectorService: SelectorHierarchy;
  private setHierarchySelector: any = undefined;
  private hierarchySelectorMount: any = undefined;
  private mlService: MLSettingsService;
  private messageHistory: any[] = [];
  private sessionId: string;
  
  // 🎯 IMPROVEMENT: Use structural system instead of manual state machine
  private structuralSystem: StructuralSystem;
  
  // Mouse-following wave variables
  private mouseX: number = 0;
  private mouseY: number = 0;
  private mouseFollowInterval: any = null;
  private lastCss: string = '';
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;
  private lastMouseTime: number = Date.now();
  private currentAnimationDuration: number | null = null;

  constructor() {
    console.log("🌊 Creating Integrated Log-View Shadow System with Structural System...");
    
    // Initialize services
    const colorService = new SimpleColorServiceAdapter();
    this.hierarchySelectorService = new SelectorHierarchy(colorService);
    this.mlService = new MLSettingsService();
    this.sessionId = this.generateSessionId();
    
    // 🎯 IMPROVEMENT: Initialize structural system instead of manual state machine
    this.structuralSystem = new StructuralSystem(ShadowSystemConfig);
    
    // Initialize the system
    this.init();
    
    // Set up message listeners
    this.setupMessageListeners();
    
    console.log("🌊 Integrated Log-View Shadow System initialized successfully");
  }

  private generateSessionId(): string {
    return `shadow-integrated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private init() {
    // Wait for document.body to be available
    if (!document.body) {
      setTimeout(() => this.init(), 100);
      return;
    }
    
    // Create shadow DOM container
    this.createShadowDOMContainer();
    
    // Create style elements
    this.createStyleElements();
    
    // 🎯 IMPROVEMENT: Initialize structural system machines
    this.initializeStructuralMachines();
    
    // Set up mouse tracking
    this.setupMouseTracking();
    
    // Log system initialization
    this.logMessage('system-init', 'Integrated shadow DOM system initialized successfully');
  }

  // 🎯 IMPROVEMENT: Initialize machines using structural system
  private initializeStructuralMachines() {
    try {
      // Create the main shadow system machine
      const shadowMachine = this.structuralSystem.createMachine('shadow-system', {
        sessionId: this.sessionId,
        hierarchySelectorService: this.hierarchySelectorService,
        mlService: this.mlService
      });

      if (shadowMachine) {
        console.log("🌊 Shadow system machine created successfully");
        shadowMachine.start();
      }

      // Create mouse tracking machine
      const mouseTrackingMachine = this.structuralSystem.createMachine('mouse-tracking', {
        sessionId: this.sessionId,
        mousePosition: { x: this.mouseX, y: this.mouseY }
      });

      if (mouseTrackingMachine) {
        console.log("🌊 Mouse tracking machine created successfully");
        mouseTrackingMachine.start();
      }

      // Create shadow DOM machine
      const shadowDOMMachine = this.structuralSystem.createMachine('shadow-dom', {
        sessionId: this.sessionId,
        shadowRoot: this.shadowRoot
      });

      if (shadowDOMMachine) {
        console.log("🌊 Shadow DOM machine created successfully");
        shadowDOMMachine.start();
      }

    } catch (error) {
      console.error("🌊 Error initializing structural machines:", error);
    }
  }

  // 🎯 IMPROVEMENT: Enhanced message processing using structural system
  async processMessage(message: any, source: string): Promise<any> {
    console.log(`🌊 Integrated Shadow System: Processing message from ${source}:`, message.name);
    
    try {
      // Get the appropriate machine based on message type
      let targetMachine = null;
      
      if (message.name.includes('MOUSE') || message.name.includes('TRACKING')) {
        targetMachine = this.structuralSystem.getMachine('mouse-tracking');
      } else if (message.name.includes('SHADOW') || message.name.includes('DOM')) {
        targetMachine = this.structuralSystem.getMachine('shadow-dom');
      } else {
        targetMachine = this.structuralSystem.getMachine('shadow-system');
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
          type: 'shadow',
          component: 'ShadowSystem',
          props: { 
            isActive: true, 
            message: 'Shadow system active',
            context: context
          },
          priority: 2,
          timestamp
        });
        break;
        
      case 'tracking':
        views.push({
          type: 'shadow',
          component: 'MouseTracking',
          props: { 
            isActive: true, 
            message: 'Mouse tracking active',
            mousePosition: { x: this.mouseX, y: this.mouseY },
            context: context
          },
          priority: 3,
          timestamp
        });
        break;
        
      case 'updating':
        views.push({
          type: 'shadow',
          component: 'ShadowDOM',
          props: { 
            isActive: true, 
            message: 'Shadow DOM updating',
            context: context
          },
          priority: 4,
          timestamp
        });
        break;
        
      case 'error':
        views.push({
          type: 'notification',
          component: 'ErrorDisplay',
          props: { 
            isActive: true, 
            message: 'Shadow system error',
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
      case 'START_TRACKING':
        if (currentState !== 'tracking') {
          actions.push({ type: 'ACTIVATE_MOUSE_TRACKING' });
        }
        break;

      case 'STOP_TRACKING':
        if (currentState === 'tracking') {
          actions.push({ type: 'DEACTIVATE_MOUSE_TRACKING' });
        }
        break;

      case 'MOUSE_MOVE':
        actions.push({ type: 'UPDATE_MOUSE_POSITION', payload: message.payload });
        break;

      case 'SHADOW_UPDATE':
        actions.push({ type: 'UPDATE_SHADOW_DOM', payload: message.payload });
        break;
    }

    return actions;
  }

  // 🎯 IMPROVEMENT: Enhanced state management using structural system
  getCurrentState(): any {
    const shadowMachine = this.structuralSystem.getMachine('shadow-system');
    return shadowMachine?.getState()?.value || 'idle';
  }

  getCurrentViews(): any[] {
    const currentState = this.getCurrentState();
    const shadowMachine = this.structuralSystem.getMachine('shadow-system');
    const context = shadowMachine?.getState()?.context || {};
    
    return this.generateViewsForState(currentState, {}, context);
  }

  clearProcessedViews(): void {
    // Views are managed by React components now
  }

  getStateHistory(): any[] {
    const shadowMachine = this.structuralSystem.getMachine('shadow-system');
    return shadowMachine?.getState()?.context?.stateHistory || [];
  }

  // 🎯 IMPROVEMENT: Enhanced health status using structural system
  getHealthStatus(): any {
    const shadowMachine = this.structuralSystem.getMachine('shadow-system');
    const mouseTrackingMachine = this.structuralSystem.getMachine('mouse-tracking');
    const shadowDOMMachine = this.structuralSystem.getMachine('shadow-dom');
    
    return {
      timestamp: Date.now(),
      sessionId: this.sessionId,
      shadowSystemState: shadowMachine?.getState()?.value || 'idle',
      mouseTrackingState: mouseTrackingMachine?.getState()?.value || 'idle',
      shadowDOMState: shadowDOMMachine?.getState()?.value || 'idle',
      structuralSystemActive: true,
      machineCount: this.structuralSystem.getAllMachines().size,
      viewQueueLength: this.getCurrentViews().length,
      messageHistoryLength: shadowMachine?.getState()?.context?.messageQueue?.length || 0,
      stateHistoryLength: this.getStateHistory().length,
      mousePosition: { x: this.mouseX, y: this.mouseY },
      mouseTrackingActive: !!this.mouseFollowInterval
    };
  }

  getMessageHistory(): any[] {
    const shadowMachine = this.structuralSystem.getMachine('shadow-system');
    return shadowMachine?.getState()?.context?.messageQueue || [];
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // 🎯 IMPROVEMENT: Enhanced cleanup using structural system
  destroy(): void {
    console.log("🌊 Integrated Shadow System: Destroying");
    
    try {
      // Clean up all structural system machines
      const machines = this.structuralSystem.getAllMachines();
      machines.forEach((machine, name) => {
        console.log(`🌊 Stopping machine: ${name}`);
        machine.stop();
      });
      
      // Clean up structural system
      this.structuralSystem = null;
      
      // Clean up mouse tracking
      if (this.mouseFollowInterval) {
        clearInterval(this.mouseFollowInterval);
        this.mouseFollowInterval = null;
      }
      
      // Clean up other resources
      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = '';
      }
      
    } catch (error) {
      console.error("🌊 Error during cleanup:", error);
    }
  }

  // ... rest of the existing methods (createShadowDOMContainer, createStyleElements, etc.)
  // These would remain largely the same but could be enhanced to work with the structural system

  private createShadowDOMContainer() {
    // Implementation would be similar to the original
    // but could be enhanced to work with the structural system
  }

  private createStyleElements() {
    // Implementation would be similar to the original
    // but could be enhanced to work with the structural system
  }

  private setupMouseTracking() {
    // Implementation would be similar to the original
    // but could be enhanced to work with the structural system
  }

  private setupMessageListeners() {
    // Implementation would be similar to the original
    // but could be enhanced to work with the structural system
  }

  private logMessage(type: string, message: string) {
    // Implementation would be similar to the original
    // but could be enhanced to work with the structural system
  }
}

// 🎯 IMPROVEMENT: Export the integrated system
export default LogViewShadowSystemIntegrated;
