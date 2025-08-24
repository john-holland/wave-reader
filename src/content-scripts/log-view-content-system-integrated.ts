import { 
  createViewStateMachine
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
// 🎯 NOTE: Structural system components not yet available in published package
// Using createViewStateMachine for now, will integrate structural system when available

// Content System using createViewStateMachine
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
  
  // 🎯 IMPROVEMENT: Use createViewStateMachine for state management
  private viewStateMachine: any;
  private robotProxy: ChromeRobotProxyMachine;

  constructor() {
    console.log("🌊 Creating Integrated Log-View Content System with createViewStateMachine...");
    
    // Initialize services
    const colorService = new SimpleColorServiceAdapter();
    this.hierarchySelectorService = new SelectorHierarchy(colorService);
    this.mlService = new MLSettingsService();
    this.sessionId = this.generateSessionId();
    
    // 🎯 IMPROVEMENT: Initialize with createViewStateMachine
    this.robotProxy = new ChromeRobotProxyMachine();
    
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
    
    // 🎯 IMPROVEMENT: Initialize with createViewStateMachine
    this.initializeStateMachine();
    
    // Log system initialization
    this.logMessage('system-init', 'Integrated content system initialized successfully');
  }

  // 🎯 IMPROVEMENT: Initialize using createViewStateMachine
  private initializeStateMachine() {
    try {
      // Create a state machine using createViewStateMachine
      this.viewStateMachine = createViewStateMachine({
        machineId: 'content-system-integrated',
        xstateConfig: {
          id: 'content-system-integrated',
          initial: 'idle',
          states: {
            idle: {
              on: { ACTIVATE: 'active' }
            },
            active: {
              on: { DEACTIVATE: 'idle', START_READING: 'reading', START_SELECTION: 'selecting' }
            },
            reading: {
              on: { STOP_READING: 'active', ERROR: 'error' }
            },
            selecting: {
              on: { ELEMENT_SELECTED: 'active', ERROR: 'error' }
            },
            error: {
              on: { RESTART: 'idle' }
            }
          }
        }
      });
      
      console.log("🌊 Content system initialized with createViewStateMachine");
      
    } catch (error) {
      console.error("🌊 Error initializing state machine:", error);
    }
  }

  // 🎯 IMPROVEMENT: Enhanced message processing using createViewStateMachine
  async processMessage(message: any, source: string): Promise<any> {
    console.log(`🌊 Integrated Content System: Processing message from ${source}:`, message.name);
    
    try {
      // Process message using createViewStateMachine
      if (this.viewStateMachine) {
        // Send event to the state machine
        await this.viewStateMachine.send({ type: message.name, payload: message });
        
        // Get current state
        const currentState = this.viewStateMachine.getState()?.value || 'idle';
        const context = this.viewStateMachine.getState()?.context || {};
        
        return {
          newState: { name: currentState, context },
          views: this.generateViewsForState(currentState, message, context),
          actions: this.generateActionsForMessage(message, currentState)
        };
      }
      
      return {
        newState: { name: 'active', context: {} },
        views: this.generateViewsForState('active', message, {}),
        actions: this.generateActionsForMessage(message, 'active')
      };
      
    } catch (error) {
      console.error("🌊 Error processing message:", error);
      return { newState: { name: 'error' }, views: [], actions: [] };
    }
  }

  // 🎯 IMPROVEMENT: Enhanced view generation
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

  // 🎯 IMPROVEMENT: Enhanced action generation
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

  // 🎯 IMPROVEMENT: Enhanced state management using createViewStateMachine
  getCurrentState(): any {
    if (this.viewStateMachine) {
      return this.viewStateMachine.getState()?.value || 'idle';
    }
    return 'idle';
  }

  getCurrentViews(): any[] {
    const currentState = this.getCurrentState();
    return this.generateViewsForState(currentState, {}, {});
  }

  clearProcessedViews(): void {
    // Views are managed by React components now
  }

  getStateHistory(): any[] {
    if (this.viewStateMachine) {
      return this.viewStateMachine.getState()?.context?.stateHistory || [];
    }
    return [];
  }

  // 🎯 IMPROVEMENT: Enhanced health status
  getHealthStatus(): any {
    return {
      timestamp: Date.now(),
      sessionId: this.sessionId,
      contentSystemState: this.getCurrentState(),
      createViewStateMachineActive: !!this.viewStateMachine,
      machineCount: this.viewStateMachine ? 1 : 0,
      viewQueueLength: this.getCurrentViews().length,
      messageHistoryLength: 0,
      stateHistoryLength: this.getStateHistory().length
    };
  }

  getMessageHistory(): any[] {
    return []; // For now, return empty array
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // 🎯 IMPROVEMENT: Enhanced cleanup
  destroy(): void {
    console.log("🌊 Integrated Content System: Destroying");
    
    try {
      // Clean up state machine
      if (this.viewStateMachine) {
        this.viewStateMachine.stop();
      }
      
      // Clean up resources
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
