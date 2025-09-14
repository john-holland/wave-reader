import { LogViewContentSystemTomes } from './log-view-content-system-tome';
import { LogViewShadowSystemTomes } from './log-view-shadow-system-tome';
import { ContentSystemDOMService } from '../services/content-system-dom-service';
import { ContentSystemMessageService } from '../services/content-system-message-service';
import { MLSettingsService } from '../services/ml-settings-service';
import { SelectorHierarchy } from '../services/selector-hierarchy';
import { SimpleColorServiceAdapter } from '../services/simple-color-service';
import Options from '../models/options';

/**
 * Integrated Content System with Proxy State Machine
 * 
 * This system integrates the main content system with the shadow system proxy,
 * providing a unified message routing architecture that can connect Tomes structurally.
 */
export class LogViewContentSystemIntegrated {
  private contentTome: any;
  private shadowTome: any;
  private domService: ContentSystemDOMService;
  private messageService: ContentSystemMessageService;
  private mlService: MLSettingsService;
  private selectorService: SelectorHierarchy;
  private colorService: SimpleColorServiceAdapter;
  
  private going: boolean = false;
  private latestOptions: Options | undefined;
  private sessionId: string;
  private messageHistory: any[] = [];
  private proxyState: 'idle' | 'active' | 'shadow-active' | 'both-active' = 'idle';

  constructor() {
    console.log("🌊 Creating Log-View-Machine Integrated Content System...");
    
    // Generate session ID first
    this.sessionId = `integrated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Initialize services
    this.colorService = new SimpleColorServiceAdapter();
    this.selectorService = new SelectorHierarchy(this.colorService);
    this.mlService = new MLSettingsService();
    this.domService = new ContentSystemDOMService();
    this.messageService = new ContentSystemMessageService(this.sessionId);
    
    // Initialize Tomes by calling create() to get actual instances
    this.contentTome = LogViewContentSystemTomes.create({});
    this.shadowTome = LogViewShadowSystemTomes.create({});
    
    // Start the Tomes
    this.contentTome.start();
    this.shadowTome.start();
    
    // Initialize the system
    this.init();
    
    // Set up message listeners
    this.setupMessageListeners();
    
    console.log("🌊 Log-View-Machine Integrated Content System initialized successfully");
  }

  private init() {
    // Wait for document.body to be available
    if (!document.body) {
      setTimeout(() => this.init(), 100);
      return;
    }
    
    // Initialize DOM service
    this.domService.initialize();
    
    // Set up message routing
    this.setupMessageRouting();
    
    // Log system initialization
    this.logMessage('system-init', 'Integrated content system initialized successfully');
  }

  private setupMessageRouting() {
    // Set up routing between content and shadow Tomes
    this.contentTome.subscribe((state: any) => {
      console.log("🌊 Integrated System: Content Tome state changed", state);
      this.handleContentTomeStateChange(state);
    });

    this.shadowTome.subscribe((state: any) => {
      console.log("🌊 Integrated System: Shadow Tome state changed", state);
      this.handleShadowTomeStateChange(state);
    });
  }

  private setupMessageListeners() {
    // Listen for messages from the popup and background
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        this.handleRuntimeMessage(message, sender, sendResponse);
        return true; // Keep message channel open
      });
    }

    // Listen for window.postMessage from background script
    window.addEventListener('message', (event) => {
      if (event.data?.source === 'wave-reader-extension') {
        this.handleWindowMessage(event.data.message);
      }
    });
  }

  private handleRuntimeMessage(message: any, sender: any, sendResponse: any) {
    console.log("🌊 Integrated System: Handling runtime message", message);
    
    try {
      switch (message.name) {
        case 'start':
          this.handleStart(message);
          sendResponse({ success: true, state: this.proxyState });
          break;
        case 'stop':
          this.handleStop(message);
          sendResponse({ success: true, state: this.proxyState });
          break;
        case 'toggle':
        case 'toggle-wave-reader':
          this.handleToggle(message);
          sendResponse({ success: true, state: this.proxyState });
          break;
        case 'ping':
          this.handlePing(message);
          sendResponse({ success: true, state: this.proxyState });
          break;
        case 'get-status':
          this.handleGetStatus(message);
          sendResponse({ success: true, status: this.getCurrentState() });
          break;
        default:
          console.log("🌊 Integrated System: Unknown runtime message type:", message.name);
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error: any) {
      console.error("🌊 Integrated System: Error handling runtime message:", error);
      sendResponse({ success: false, error: error.message });
    }
  }

  private handleWindowMessage(message: any) {
    console.log("🌊 Integrated System: Handling window message", message);
    
    try {
      switch (message.name) {
        case 'start':
          this.handleStart(message);
          break;
        case 'stop':
          this.handleStop(message);
          break;
        case 'toggle':
        case 'toggle-wave-reader':
          this.handleToggle(message);
          break;
        case 'ping':
          this.handlePing(message);
          break;
        default:
          console.log("🌊 Integrated System: Unknown window message type:", message.name);
      }
    } catch (error: any) {
      console.error("🌊 Integrated System: Error handling window message:", error);
    }
  }

  private handleStart(message: any) {
    console.log("🌊 Integrated System: Handling start message", { 
      message, 
      hasOptions: !!message.options 
    });
    
    this.going = true;
    
    // Extract options from the start message
    if (message.options) {
      this.latestOptions = message.options;
      console.log("🌊 Integrated System: Options extracted and set", { 
        latestOptions: this.latestOptions,
        hasWave: !!this.latestOptions?.wave 
      });
    } else {
      console.warn("🌊 Integrated System: No options found in start message");
      this.messageService.logMessage('start-warning', 'No options in start message');
    }
    
    // Route message to both Tomes
    this.routeMessageToTomes('start', message);
    
    // Apply wave animation
    this.applyWaveAnimation();
    
    // Update proxy state
    this.updateProxyState();
    
    // Sync state with background script
    this.syncGoingStateWithBackground();
    
    this.messageService.logMessage('start', 'Integrated system started');
    this.logMessage('start', 'Integrated system started');
  }

  private handleStop(message: any) {
    console.log("🌊 Integrated System: Handling stop message");
    
    this.going = false;
    
    // Route message to both Tomes
    this.routeMessageToTomes('stop', message);
    
    // Remove wave animation
    this.removeWaveAnimation();
    
    // Update proxy state
    this.updateProxyState();
    
    // Sync state with background script
    this.syncGoingStateWithBackground();
    
    this.messageService.logMessage('stop', 'Integrated system stopped');
    this.logMessage('stop', 'Integrated system stopped');
  }

  private handleToggle(message: any) {
    console.log("🌊 Integrated System: Handling toggle message");
    
    if (this.going) {
      this.handleStop(message);
    } else {
      this.handleStart(message);
    }
  }

  private handlePing(message: any) {
    console.log("🌊 Integrated System: Handling ping message");
    
    // Route ping to both Tomes
    this.routeMessageToTomes('ping', message);
    
    // Send pong response
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        from: 'integrated-content-system',
        name: 'pong',
        timestamp: Date.now(),
        sessionId: this.sessionId,
        proxyState: this.proxyState
      });
    }
    
    this.messageService.logMessage('ping', 'Ping responded with pong');
    this.logMessage('ping', 'Ping responded with pong');
  }

  private handleGetStatus(message: any) {
    console.log("🌊 Integrated System: Handling get-status message");
    this.logMessage('status-requested', 'Status requested from integrated system');
  }

  private routeMessageToTomes(messageName: string, messageData: any) {
    console.log("🌊 Integrated System: Routing message to Tomes", { messageName, messageData });
    
    try {
      // Send to content Tome
      this.contentTome.send(messageName, messageData);
      
      // Send to shadow Tome
      this.shadowTome.send(messageName, messageData);
      
      console.log("🌊 Integrated System: Message routed to both Tomes successfully");
    } catch (error: any) {
      console.error("🌊 Integrated System: Error routing message to Tomes:", error);
    }
  }

  private handleContentTomeStateChange(state: any) {
    console.log("🌊 Integrated System: Content Tome state changed", state);
    
    // Handle content Tome state changes
    if (state.value === 'active') {
      console.log("🌊 Integrated System: Content Tome is now active");
    }
    
    // Update proxy state
    this.updateProxyState();
  }

  private handleShadowTomeStateChange(state: any) {
    console.log("🌊 Integrated System: Shadow Tome state changed", state);
    
    // Handle shadow Tome state changes
    if (state.value === 'waving') {
      console.log("🌊 Integrated System: Shadow Tome is now waving");
    }
    
    // Update proxy state
    this.updateProxyState();
  }

  private updateProxyState() {
    const contentState = this.contentTome.getState().value;
    const shadowState = this.shadowTome.getState().value;
    
    if (contentState === 'active' && shadowState === 'waving') {
      this.proxyState = 'both-active';
    } else if (contentState === 'active') {
      this.proxyState = 'active';
    } else if (shadowState === 'waving') {
      this.proxyState = 'shadow-active';
    } else {
      this.proxyState = 'idle';
    }
    
    console.log("🌊 Integrated System: Proxy state updated", {
      proxyState: this.proxyState,
      contentState,
      shadowState
    });
  }

  private syncGoingStateWithBackground() {
    console.log("🌊 Integrated System: Syncing going state with background", { going: this.going });
    
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        from: 'integrated-content-system',
        name: 'update-going-state',
        going: this.going,
        timestamp: Date.now(),
        sessionId: this.sessionId
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("🌊 Integrated System: Failed to sync going state with background:", chrome.runtime.lastError.message);
        }
      });
    }
  }

  private applyWaveAnimation() {
    console.log("🌊 Integrated System: Applying wave animation", {
      hasOptions: !!this.latestOptions,
      hasWave: !!this.latestOptions?.wave,
      wave: this.latestOptions?.wave
    });

    if (!this.latestOptions?.wave) {
      console.warn("🌊 Integrated System: No wave options available for animation");
      this.messageService.logMessage('wave-animation-failed', 'No wave options available');
      return;
    }

    const wave = this.latestOptions.wave;
    const css = wave.cssTemplate;

    console.log("🌊 Integrated System: Wave CSS template", {
      css,
      cssLength: css ? css.length : 0,
      cssPreview: css ? css.substring(0, 200) + '...' : 'NO_CSS'
    });

    if (css) {
      console.log("🌊 Integrated System: Calling DOM service to apply CSS animation...");
      this.domService.applyWaveAnimation(css);
      this.messageService.logMessage('wave-animation-applied', 'Wave animation applied');
      console.log("🌊 Integrated System: Wave animation CSS applied to DOM");
    } else {
      console.warn("🌊 Integrated System: No CSS template available in wave");
      this.messageService.logMessage('wave-animation-failed', 'No CSS template available');
    }
  }

  private removeWaveAnimation() {
    console.log("🌊 Integrated System: Removing wave animation");
    this.domService.removeWaveAnimation();
    this.messageService.logMessage('wave-animation-removed', 'Wave animation removed');
  }

  private logMessage(type: string, message: string, data?: any) {
    const logEntry = {
      type,
      message,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      url: window.location.href,
      proxyState: this.proxyState,
      contentState: this.contentTome.getState().value,
      shadowState: this.shadowTome.getState().value
    };
    
    this.messageHistory.push(logEntry);
    console.log(`🌊 Integrated System [${type}]:`, message, data);
  }

  // Public methods for external access
  public getCurrentState() {
    return {
      proxyState: this.proxyState,
      contentState: this.contentTome.getState().value,
      shadowState: this.shadowTome.getState().value,
      going: this.going
    };
  }

  public getSessionId() {
    return this.sessionId;
  }

  public getMessageHistory() {
    return this.messageHistory;
  }

  public isActive() {
    return this.going;
  }

  public getTomeStates() {
    return {
      content: this.contentTome.getState(),
      shadow: this.shadowTome.getState()
    };
  }

  public destroy() {
    console.log("🌊 Integrated System: Destroying system...");
    
    // Clean up Tomes
    if (this.contentTome) {
      this.contentTome.stop();
    }
    if (this.shadowTome) {
      this.shadowTome.stop();
    }
    
    // Clean up services
    this.domService.cleanup();
    
    this.logMessage('system-destroyed', 'Integrated system destroyed');
  }
}

// Initialize the integrated system when the script loads
console.log("🌊 Log-View-Machine: Initializing integrated content system...");

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LogViewContentSystemIntegrated();
  });
} else {
  new LogViewContentSystemIntegrated();
}

// Export for testing
export default LogViewContentSystemIntegrated;
