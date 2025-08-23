import { 
  createViewStateMachine,
  StructuralSystem,
  StructuralTomeConnector,
  createStructuralConfig,
  type AppStructureConfig
} from 'log-view-machine';
import { ChromeRobotProxyMachine } from '../util/robot-proxy-machine';
import { LogViewMessageUtility } from '../util/log-view-messages';
import { MessageFactory } from '../models/messages/log-view-messages';
import { MountOrFindSelectorHierarchyComponent } from '../components/selector-hierarchy';
import { SelectorHierarchy } from '../services/selector-hierarchy';
import { SimpleColorServiceAdapter } from '../services/simple-color-service';
import { MLSettingsService } from '../services/ml-settings-service';
import Wave from '../models/wave';
import Options from '../models/options';

// 🎯 IMPROVEMENT: Use official createViewStateMachine from log-view-machine
// 🎯 IMPROVEMENT: Integrate with structural system for better organization

// Content System Structural Configuration
const ContentSystemConfig: AppStructureConfig = createStructuralConfig({
  AppStructure: {
    id: 'log-view-content-system',
    name: 'Log View Content System',
    type: 'application',
    routing: {
      base: '/',
      defaultRoute: '/content'
    }
  },

  ComponentTomeMapping: {
    'content-system': {
      componentPath: 'src/content-scripts/ContentSystemComponent.tsx',
      tomePath: 'src/content-scripts/ContentSystemTome.tsx',
      templatePath: 'src/content-scripts/templates/content-system/'
    },
    'wave-reader': {
      componentPath: 'src/content-scripts/WaveReaderComponent.tsx',
      tomePath: 'src/content-scripts/WaveReaderTome.tsx',
      templatePath: 'src/content-scripts/templates/wave-reader/'
    },
    'selector-ui': {
      componentPath: 'src/content-scripts/SelectorUIComponent.tsx',
      tomePath: 'src/content-scripts/SelectorUITome.tsx',
      templatePath: 'src/content-scripts/templates/selector-ui/'
    }
  },

  RoutingConfig: {
    routes: [
      { path: '/', redirect: '/content' },
      { path: '/content', component: 'content-system' },
      { path: '/wave-reader', component: 'wave-reader' },
      { path: '/selector-ui', component: 'selector-ui' }
    ],
    navigation: {
      primary: [
        { id: 'content', label: 'Content System', path: '/content', icon: '📖' },
        { id: 'wave-reader', label: 'Wave Reader', path: '/wave-reader', icon: '🌊' },
        { id: 'selector-ui', label: 'Selector UI', path: '/selector-ui', icon: '🎯' }
      ]
    }
  },

  TomeConfig: {
    tomes: {
      'content-system-tome': {
        machineId: 'content-system',
        description: 'Manages content system state and lifecycle',
        states: ['idle', 'initializing', 'active', 'error', 'shutdown'],
        events: ['INIT', 'ACTIVATE', 'DEACTIVATE', 'ERROR', 'SHUTDOWN', 'RESTART']
      },
      'wave-reader-tome': {
        machineId: 'wave-reader',
        description: 'Manages wave reading functionality',
        states: ['idle', 'reading', 'paused', 'stopped', 'error'],
        events: ['START_READING', 'PAUSE_READING', 'STOP_READING', 'ERROR', 'RESTART']
      },
      'selector-ui-tome': {
        machineId: 'selector-ui',
        description: 'Manages element selector UI',
        states: ['hidden', 'visible', 'selecting', 'selected', 'error'],
        events: ['SHOW', 'HIDE', 'START_SELECTION', 'ELEMENT_SELECTED', 'ERROR', 'RESET']
      }
    }
  }
});

// 🎯 IMPROVEMENT: Enhanced content system using structural system
export class LogViewContentSystemIntegrated {
  private shadowRoot: ShadowRoot | null = null;
  private shadowStyleElement: HTMLStyleElement | null = null;
  private mainDocumentStyleElement: HTMLStyleElement | null = null;
  private selectorUiRoot: HTMLDivElement | null = null;
  private hierarchySelectorService: SelectorHierarchy;
  private setHierarchySelector: any = undefined;
  private hierarchySelectorMount: any = undefined;
  private mlService: MLSettingsService;
  private sessionId: string;
  
  // 🎯 IMPROVEMENT: Use structural system instead of manual state machine
  private structuralSystem: StructuralSystem;
  private robotProxy: ChromeRobotProxyMachine;
  private viewRenderer: ViewRenderer;
  private actionExecutor: ActionExecutor;

  constructor() {
    console.log("🌊 Creating Integrated Log-View Content System with Structural System...");
    
    // Initialize services
    const colorService = new SimpleColorServiceAdapter();
    this.hierarchySelectorService = new SelectorHierarchy(colorService);
    this.mlService = new MLSettingsService();
    this.sessionId = this.generateSessionId();
    
    // 🎯 IMPROVEMENT: Initialize structural system instead of manual state machine
    this.structuralSystem = new StructuralSystem(ContentSystemConfig);
    this.robotProxy = new ChromeRobotProxyMachine();
    
    // Initialize view renderer and action executor
    this.viewRenderer = new ViewRenderer();
    this.actionExecutor = new ActionExecutor(this);
    
    // Initialize the system
    this.init();
    
    // Set up message listeners
    this.setupMessageListeners();
    
    console.log("🌊 Integrated Log-View Content System initialized successfully");
  }

  private generateSessionId(): string {
    return `content-integrated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private init() {
    // Create shadow DOM container
    const container = document.createElement('div');
    container.id = 'wave-reader-log-view-content-integrated';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      pointer-events: none;
      z-index: 2147483647;
    `;
    document.body.appendChild(container);
    this.shadowRoot = container.attachShadow({ mode: 'open' });

    if (!this.shadowRoot) {
      console.error("🌊 ERROR: Shadow root is null after creation");
      return;
    }

    // Create style elements
    this.createStyleElements();
    
    // 🎯 IMPROVEMENT: Initialize structural system machines
    this.initializeStructuralMachines();
    
    // Log system initialization
    this.logMessage('system-init', 'Integrated content system initialized successfully');
  }

  // 🎯 IMPROVEMENT: Initialize machines using structural system
  private initializeStructuralMachines() {
    try {
      // Create the main content system machine
      const contentMachine = this.structuralSystem.createMachine('content-system', {
        sessionId: this.sessionId,
        robotProxy: this.robotProxy,
        hierarchySelectorService: this.hierarchySelectorService,
        mlService: this.mlService
      });

      if (contentMachine) {
        console.log("🌊 Content system machine created successfully");
        // Start the machine
        contentMachine.start();
      }

      // Create wave reader machine
      const waveReaderMachine = this.structuralSystem.createMachine('wave-reader', {
        sessionId: this.sessionId,
        robotProxy: this.robotProxy
      });

      if (waveReaderMachine) {
        console.log("🌊 Wave reader machine created successfully");
        waveReaderMachine.start();
      }

      // Create selector UI machine
      const selectorUIMachine = this.structuralSystem.createMachine('selector-ui', {
        sessionId: this.sessionId,
        hierarchySelectorService: this.hierarchySelectorService
      });

      if (selectorUIMachine) {
        console.log("🌊 Selector UI machine created successfully");
        selectorUIMachine.start();
      }

    } catch (error) {
      console.error("🌊 Error initializing structural machines:", error);
    }
  }

  // 🎯 IMPROVEMENT: Enhanced message processing using structural system
  async processMessage(message: any, source: string): Promise<any> {
    console.log(`🌊 Integrated Content System: Processing message from ${source}:`, message.name);
    
    try {
      // Get the appropriate machine based on message type
      let targetMachine = null;
      
      if (message.name.includes('WAVE') || message.name.includes('READING')) {
        targetMachine = this.structuralSystem.getMachine('wave-reader');
      } else if (message.name.includes('SELECTOR') || message.name.includes('UI')) {
        targetMachine = this.structuralSystem.getMachine('selector-ui');
      } else {
        targetMachine = this.structuralSystem.getMachine('content-system');
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
          component: 'ContentSystem',
          props: { 
            isActive: true, 
            message: 'Content system active',
            context: context
          },
          priority: 2,
          timestamp
        });
        break;
        
      case 'reading':
        views.push({
          type: 'content',
          component: 'WaveReader',
          props: { 
            isActive: true, 
            message: 'Wave reading in progress',
            context: context
          },
          priority: 3,
          timestamp
        });
        break;
        
      case 'selecting':
        views.push({
          type: 'overlay',
          component: 'SelectorUI',
          props: { 
            isActive: true, 
            message: 'Element selection active',
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
            message: 'System error occurred',
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
      case 'START_READING':
        if (currentState !== 'reading') {
          actions.push({ type: 'ACTIVATE_WAVE_READER' });
        }
        break;

      case 'STOP_READING':
        if (currentState === 'reading') {
          actions.push({ type: 'DEACTIVATE_WAVE_READER' });
        }
        break;

      case 'START_SELECTION':
        if (currentState !== 'selecting') {
          actions.push({ type: 'SHOW_SELECTOR_UI' });
        }
        break;

      case 'ELEMENT_SELECTED':
        actions.push({ type: 'PROCESS_SELECTION', payload: message.payload });
        break;
    }

    return actions;
  }

  // 🎯 IMPROVEMENT: Enhanced state management using structural system
  getCurrentState(): any {
    const contentMachine = this.structuralSystem.getMachine('content-system');
    return contentMachine?.getState()?.value || 'idle';
  }

  getCurrentViews(): any[] {
    const currentState = this.getCurrentState();
    const contentMachine = this.structuralSystem.getMachine('content-system');
    const context = contentMachine?.getState()?.context || {};
    
    return this.generateViewsForState(currentState, {}, context);
  }

  clearProcessedViews(): void {
    // Views are managed by React components now
  }

  getStateHistory(): any[] {
    const contentMachine = this.structuralSystem.getMachine('content-system');
    return contentMachine?.getState()?.context?.stateHistory || [];
  }

  // 🎯 IMPROVEMENT: Enhanced health status using structural system
  getHealthStatus(): any {
    const contentMachine = this.structuralSystem.getMachine('content-system');
    const waveReaderMachine = this.structuralSystem.getMachine('wave-reader');
    const selectorUIMachine = this.structuralSystem.getMachine('selector-ui');
    
    return {
      timestamp: Date.now(),
      sessionId: this.sessionId,
      contentSystemState: contentMachine?.getState()?.value || 'idle',
      waveReaderState: waveReaderMachine?.getState()?.value || 'idle',
      selectorUIState: selectorUIMachine?.getState()?.value || 'idle',
      structuralSystemActive: true,
      machineCount: this.structuralSystem.getAllMachines().size,
      viewQueueLength: this.getCurrentViews().length,
      messageHistoryLength: contentMachine?.getState()?.context?.messageQueue?.length || 0,
      stateHistoryLength: this.getStateHistory().length
    };
  }

  getMessageHistory(): any[] {
    const contentMachine = this.structuralSystem.getMachine('content-system');
    return contentMachine?.getState()?.context?.messageQueue || [];
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // 🎯 IMPROVEMENT: Enhanced cleanup using structural system
  destroy(): void {
    console.log("🌊 Integrated Content System: Destroying");
    
    try {
      // Clean up all structural system machines
      const machines = this.structuralSystem.getAllMachines();
      machines.forEach((machine, name) => {
        console.log(`🌊 Stopping machine: ${name}`);
        machine.stop();
      });
      
      // Clean up structural system
      this.structuralSystem = null;
      
      // Clean up other resources
      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = '';
      }
      
    } catch (error) {
      console.error("🌊 Error during cleanup:", error);
    }
  }

  // ... rest of the existing methods (createStyleElements, setupMessageListeners, etc.)
  // These would remain largely the same but could be enhanced to work with the structural system

  private createStyleElements() {
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
export default LogViewContentSystemIntegrated;
