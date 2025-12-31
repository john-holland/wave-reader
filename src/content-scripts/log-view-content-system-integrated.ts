import { LogViewContentSystemTomes } from './log-view-content-system-tome';
import { LogViewShadowSystemTomes } from './log-view-shadow-system-tome';
import { ContentSystemDOMService } from '../services/content-system-dom-service';
import { ContentSystemMessageService } from '../services/content-system-message-service';
import { MLSettingsService } from '../services/ml-settings-service';
import { SelectorHierarchy } from '../services/selector-hierarchy';
import { SimpleColorServiceAdapter } from '../services/simple-color-service';
import Options from '../models/options';
import { initializeKeyChordService, cleanupKeyChordService, setToggleCallback } from '../services/keychord-content-integration';
import { replaceKeyframePlaceholders } from '../models/wave';

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
  private lastSyncedGoingState: boolean | null = null; // Track last synced state to avoid spam
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

  private async init() {
    // Wait for document.body to be available
    if (!document.body) {
      setTimeout(() => this.init(), 100);
      return;
    }

    console.log("🌊 Integrated System: Starting initialization...");
    
    // Initialize DOM service
    this.domService.initialize();
    
    // Load settings from storage proactively so they're available when wave starts
    console.log("🌊 Integrated System: Loading settings from storage...");
    await this.loadSettingsFromStorage();
    console.log("🌊 Integrated System: Settings loading complete", {
      hasLatestOptions: !!this.latestOptions,
      waveSpeed: this.latestOptions?.wave?.waveSpeed
    });
    
    // Set up message routing
    this.setupMessageRouting();
    
    // Initialize keyboard shortcut service
    this.setupKeyboardShortcuts();
    
    // Log system initialization
    this.logMessage('system-init', 'Integrated content system initialized successfully');
    console.log("🌊 Integrated System: Initialization complete");
  }

  /**
   * Load settings from Chrome storage proactively
   * This ensures settings are available even before a start message is received
   */
  private async loadSettingsFromStorage(): Promise<void> {
    console.log("🌊 Integrated System: loadSettingsFromStorage called", {
      hasChrome: typeof chrome !== 'undefined',
      hasStorage: typeof chrome !== 'undefined' && !!chrome.storage,
      hasLocal: typeof chrome !== 'undefined' && !!chrome.storage?.local
    });
    
    try {
      const Options = (await import('../models/options')).default;
      const Wave = (await import('../models/wave')).default;
      
      if (typeof chrome !== 'undefined' && chrome.storage) {
        try {
          // Try local storage first
          console.log("🌊 Integrated System: Attempting to read from chrome.storage.local...");
          const result = await chrome.storage.local.get(['waveReaderSettings']);
          console.log("🌊 Integrated System: Storage read result", {
            hasResult: !!result,
            hasSettings: !!result.waveReaderSettings,
            settingsKeys: result.waveReaderSettings ? Object.keys(result.waveReaderSettings) : []
          });
          
          if (result.waveReaderSettings) {
            const storedSettings = result.waveReaderSettings;
            
            // Convert flat Settings format to nested Options format if needed
            let optionsData = storedSettings;
            if (storedSettings.waveSpeed !== undefined || storedSettings.axisRotationAmountYMax !== undefined) {
              // Flat Settings format - convert to nested Options format
              const waveProps: any = {
                ...(storedSettings.wave || {}),
                waveSpeed: storedSettings.waveSpeed,
                axisTranslateAmountXMax: storedSettings.axisTranslateAmountXMax,
                axisTranslateAmountXMin: storedSettings.axisTranslateAmountXMin,
                axisRotationAmountYMax: storedSettings.axisRotationAmountYMax,
                axisRotationAmountYMin: storedSettings.axisRotationAmountYMin,
                selector: storedSettings.selector,
                cssGenerationMode: storedSettings.cssGenerationMode,
                cssTemplate: storedSettings.cssTemplate,
                cssMouseTemplate: storedSettings.cssMouseTemplate
              };
              optionsData = {
                ...storedSettings,
                wave: new Wave(waveProps) // Create Wave instance to regenerate CSS templates
              };
            }
            
            this.latestOptions = new Options(optionsData);
            console.log("🌊 Integrated System: Proactively loaded settings from storage on init", {
              hasOptions: !!this.latestOptions,
              hasWave: !!this.latestOptions?.wave,
              waveSpeed: this.latestOptions?.wave?.waveSpeed,
              storedWaveSpeed: storedSettings.waveSpeed,
              cssTemplateLength: this.latestOptions?.wave?.cssTemplate?.length || 0
            });
            return;
          }
          
          // Try sync storage
          const syncResult = await chrome.storage.sync.get(['waveReaderSettings']);
          if (syncResult.waveReaderSettings) {
            const storedSettings = syncResult.waveReaderSettings;
            
            // Convert flat Settings format to nested Options format if needed
            let optionsData = storedSettings;
            if (storedSettings.waveSpeed !== undefined || storedSettings.axisRotationAmountYMax !== undefined) {
              const waveProps: any = {
                ...(storedSettings.wave || {}),
                waveSpeed: storedSettings.waveSpeed,
                axisTranslateAmountXMax: storedSettings.axisTranslateAmountXMax,
                axisTranslateAmountXMin: storedSettings.axisTranslateAmountXMin,
                axisRotationAmountYMax: storedSettings.axisRotationAmountYMax,
                axisRotationAmountYMin: storedSettings.axisRotationAmountYMin,
                selector: storedSettings.selector,
                cssGenerationMode: storedSettings.cssGenerationMode,
                cssTemplate: storedSettings.cssTemplate,
                cssMouseTemplate: storedSettings.cssMouseTemplate
              };
              optionsData = {
                ...storedSettings,
                wave: new Wave(waveProps)
              };
            }
            
            this.latestOptions = new Options(optionsData);
            console.log("🌊 Integrated System: Proactively loaded settings from sync storage on init", {
              hasOptions: !!this.latestOptions,
              hasWave: !!this.latestOptions?.wave,
              waveSpeed: this.latestOptions?.wave?.waveSpeed,
              storedWaveSpeed: storedSettings.waveSpeed
            });
            return;
          }
          
          console.log("🌊 Integrated System: No settings found in storage on init, will use defaults when wave starts");
        } catch (storageError) {
          console.error("🌊 Integrated System: Failed to load settings from storage on init", {
            error: storageError,
            errorMessage: storageError instanceof Error ? storageError.message : String(storageError),
            errorStack: storageError instanceof Error ? storageError.stack : undefined
          });
        }
      } else {
        console.warn("🌊 Integrated System: chrome.storage not available", {
          hasChrome: typeof chrome !== 'undefined',
          hasStorage: typeof chrome !== 'undefined' && !!chrome.storage
        });
      }
    } catch (error) {
      console.error("🌊 Integrated System: Error loading settings on init", {
        error: error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined
      });
    }
  }

  private async setupKeyboardShortcuts() {
    console.log('⌨️ Integrated System: Setting up keyboard shortcuts');
    
    // Initialize KeyChordService with toggle callback that uses integrated system's handleToggle
    await initializeKeyChordService(async () => {
      console.log('⌨️ Integrated System: Keyboard shortcut triggered, checking blacklist');
      
      // Check epileptic blacklist before toggling
      try {
        const { EpilepticBlacklistService } = await import('../services/epileptic-blacklist');
        await EpilepticBlacklistService.initialize();
        
        // Get current URL
        let currentUrl: string | null = null;
        if (typeof chrome !== 'undefined' && chrome.tabs) {
          try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            currentUrl = tabs[0]?.url || null;
          } catch (e) {
            // Fallback to window.location if available
            if (typeof window !== 'undefined' && window.location) {
              currentUrl = window.location.href;
            }
          }
        } else if (typeof window !== 'undefined' && window.location) {
          currentUrl = window.location.href;
        }
        
        if (currentUrl && EpilepticBlacklistService.isBlacklisted(currentUrl)) {
          console.log('⌨️ Integrated System: Site is blacklisted, ignoring keyboard shortcut', currentUrl);
          return; // Don't toggle if site is blacklisted
        }
      } catch (error) {
        console.warn('⌨️ Integrated System: Error checking blacklist, proceeding with toggle', error);
      }
      
      console.log('⌨️ Integrated System: Calling handleToggle');
      // Use the integrated system's toggle handler which properly routes to start/stop
      this.handleToggle({
        name: 'toggle',
        from: 'keyboard-shortcut',
        timestamp: Date.now(),
        options: this.latestOptions // Include current options if available
      });
    });
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
    
    // Coalesce nested message objects - check if message has an embedded message property
    let normalizedMessage = message;
    if (message && typeof message === 'object' && message.message && typeof message.message === 'object') {
      // Extract the inner message and merge with outer properties (like source)
      normalizedMessage = {
        ...message.message,
        // Preserve outer properties like source if they exist and aren't in inner message
        source: message.source || message.message.source,
        from: message.from || message.message.from || message.source
      };
      console.log("🌊 Integrated System: Coalesced nested message:", normalizedMessage);
    }
    
    // Normalize message name: convert legacy 'type' field to 'name' if needed, and convert to lowercase
    // We only use 'name' field now - 'type' is legacy and should be migrated
    if (!normalizedMessage.name && normalizedMessage.type) {
      normalizedMessage.name = normalizedMessage.type.toLowerCase();
      // Remove type field since we're standardizing on name
      delete normalizedMessage.type;
    } else if (normalizedMessage.name && typeof normalizedMessage.name === 'string') {
      normalizedMessage.name = normalizedMessage.name.toLowerCase();
    }
    
    // Ensure 'from' field is set
    if (!normalizedMessage.from) {
      normalizedMessage.from = normalizedMessage.source || sender?.id ? 'background' : 'unknown';
    }
    
    console.log("🌊 Integrated System: Normalized message name:", normalizedMessage.name, "from:", normalizedMessage.from);
    
    try {
      switch (normalizedMessage.name) {
        case 'start':
          this.handleStart(normalizedMessage).then(() => {
            sendResponse({ success: true, state: this.proxyState });
          }).catch((error: any) => {
            console.error("🌊 Integrated System: Error in handleStart", error);
            sendResponse({ success: false, error: error.message });
          });
          break;
        case 'stop':
          this.handleStop(normalizedMessage).then(() => {
            sendResponse({ success: true, state: this.proxyState });
          }).catch((error: any) => {
            console.error("🌊 Integrated System: Error in handleStop", error);
            sendResponse({ success: false, error: error.message });
          });
          break;
        case 'toggle':
        case 'toggle-wave-reader':
          try {
            this.handleToggle(normalizedMessage);
            sendResponse({ success: true, state: this.proxyState });
          } catch (error: any) {
            console.error("🌊 Integrated System: Error in handleToggle", error);
            sendResponse({ success: false, error: error.message });
          }
          break;
        case 'ping':
          this.handlePing(normalizedMessage);
          sendResponse({ success: true, state: this.proxyState });
          break;
        case 'get-status':
          this.handleGetStatus(normalizedMessage);
          sendResponse({ success: true, status: this.getCurrentState() });
          break;
        case 'settings_updated':
          console.log('🚨🚨🚨 CONTENT: Received SETTINGS_UPDATED message', {
            hasOptions: !!normalizedMessage.options,
            options: normalizedMessage.options
          });
          this.handleSettingsUpdated(normalizedMessage).then(() => {
            sendResponse({ success: true, state: this.proxyState });
          }).catch((error: any) => {
            console.error("🌊 Integrated System: Error in handleSettingsUpdated", error);
            sendResponse({ success: false, error: error.message });
          });
          break;
        default:
          console.log("🌊 Integrated System: Unknown runtime message type:", normalizedMessage.name);
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error: any) {
      console.error("🌊 Integrated System: Error handling runtime message:", error);
      sendResponse({ success: false, error: error.message });
    }
  }

  private handleWindowMessage(message: any) {
    console.log("🌊 Integrated System: Handling window message", message);
    
    // Coalesce nested message objects - check if message has an embedded message property
    let normalizedMessage = message;
    if (message && typeof message === 'object' && message.message && typeof message.message === 'object') {
      // Extract the inner message and merge with outer properties (like source)
      normalizedMessage = {
        ...message.message,
        // Preserve outer properties like source if they exist and aren't in inner message
        source: message.source || message.message.source,
        from: message.from || message.message.from || message.source
      };
      console.log("🌊 Integrated System: Coalesced nested window message:", normalizedMessage);
    }
    
    try {
      switch (normalizedMessage.name) {
        case 'start':
          this.handleStart(normalizedMessage).catch((error: any) => {
            console.error("🌊 Integrated System: Error in handleStart (window)", error);
          });
          break;
        case 'stop':
          this.handleStop(normalizedMessage).catch((error: any) => {
            console.error("🌊 Integrated System: Error in handleStop (window)", error);
          });
          break;
        case 'toggle':
        case 'toggle-wave-reader':
          this.handleToggle(normalizedMessage);
          break;
        case 'ping':
          this.handlePing(normalizedMessage);
          break;
        default:
          console.log("🌊 Integrated System: Unknown window message type:", normalizedMessage.name);
      }
    } catch (error: any) {
      console.error("🌊 Integrated System: Error handling window message:", error);
    }
  }

  private async handleStart(message: any) {
    console.log("🌊 Integrated System: Handling start message", { 
      message, 
      hasOptions: !!message.options,
      from: message.from || 'unknown'
    });
    
    this.going = true;
    
    // Extract options from the start message
    if (message.options) {
      // Ensure options are properly rehydrated as Options instance
      try {
        const Options = (await import('../models/options')).default;
        // If it's already an Options instance, use it; otherwise create one
        if (message.options instanceof Options) {
          this.latestOptions = message.options;
        } else {
          this.latestOptions = new Options(message.options);
        }
        console.log("🌊 Integrated System: Options extracted and rehydrated", { 
          latestOptions: this.latestOptions,
          hasWave: !!this.latestOptions?.wave,
          hasCssTemplate: !!this.latestOptions?.wave?.cssTemplate
        });
      } catch (error: any) {
        console.warn("🌊 Integrated System: Failed to rehydrate options, using as-is", error);
        this.latestOptions = message.options;
        console.log("🌊 Integrated System: Options extracted (not rehydrated)", { 
          latestOptions: this.latestOptions,
          hasWave: !!this.latestOptions?.wave 
        });
      }
    } else {
      console.warn("🌊 Integrated System: No options found in start message, loading defaults");
      this.messageService.logMessage('start-warning', 'No options in start message, using defaults');
      
      // Load default options if none provided
      try {
        const Options = (await import('../models/options')).default;
        // Try to load from Chrome storage first
        if (typeof chrome !== 'undefined' && chrome.storage) {
          try {
            const result = await chrome.storage.local.get(['waveReaderSettings']);
            if (result.waveReaderSettings) {
              // Stored settings might be in flat Settings format - convert to Options format
              const storedSettings = result.waveReaderSettings;
              const Wave = (await import('../models/wave')).default;
              
              // If stored settings have flat wave properties, construct wave object
              let optionsData = storedSettings;
              if (storedSettings.waveSpeed !== undefined || storedSettings.axisRotationAmountYMax !== undefined) {
                // Flat Settings format - convert to nested Options format
                const waveProps: any = {
                  ...(storedSettings.wave || {}),
                  waveSpeed: storedSettings.waveSpeed,
                  axisTranslateAmountXMax: storedSettings.axisTranslateAmountXMax,
                  axisTranslateAmountXMin: storedSettings.axisTranslateAmountXMin,
                  axisRotationAmountYMax: storedSettings.axisRotationAmountYMax,
                  axisRotationAmountYMin: storedSettings.axisRotationAmountYMin,
                  selector: storedSettings.selector,
                  cssGenerationMode: storedSettings.cssGenerationMode,
                  cssTemplate: storedSettings.cssTemplate,
                  cssMouseTemplate: storedSettings.cssMouseTemplate
                };
                optionsData = {
                  ...storedSettings,
                  wave: new Wave(waveProps) // Create Wave instance to regenerate CSS templates
                };
              }
              
              // Create Options instance from stored data to properly rehydrate wave property
              this.latestOptions = new Options(optionsData);
              console.log("🌊 Integrated System: Loaded options from Chrome storage and rehydrated", {
                hasOptions: !!this.latestOptions,
                hasWave: !!this.latestOptions?.wave,
                hasCssTemplate: !!this.latestOptions?.wave?.cssTemplate,
                waveSpeed: this.latestOptions?.wave?.waveSpeed,
                storedWaveSpeed: storedSettings.waveSpeed,
                storedHasWave: !!storedSettings.wave
              });
            } else {
              // Try sync storage
              const syncResult = await chrome.storage.sync.get(['waveReaderSettings']);
              if (syncResult.waveReaderSettings) {
                // Stored settings might be in flat Settings format - convert to Options format
                const storedSettings = syncResult.waveReaderSettings;
                const Wave = (await import('../models/wave')).default;
                
                // If stored settings have flat wave properties, construct wave object
                let optionsData = storedSettings;
                if (storedSettings.waveSpeed !== undefined || storedSettings.axisRotationAmountYMax !== undefined) {
                  // Flat Settings format - convert to nested Options format
                  const waveProps: any = {
                    ...(storedSettings.wave || {}),
                    waveSpeed: storedSettings.waveSpeed,
                    axisTranslateAmountXMax: storedSettings.axisTranslateAmountXMax,
                    axisTranslateAmountXMin: storedSettings.axisTranslateAmountXMin,
                    axisRotationAmountYMax: storedSettings.axisRotationAmountYMax,
                    axisRotationAmountYMin: storedSettings.axisRotationAmountYMin,
                    selector: storedSettings.selector,
                    cssGenerationMode: storedSettings.cssGenerationMode,
                    cssTemplate: storedSettings.cssTemplate,
                    cssMouseTemplate: storedSettings.cssMouseTemplate
                  };
                  optionsData = {
                    ...storedSettings,
                    wave: new Wave(waveProps) // Create Wave instance to regenerate CSS templates
                  };
                }
                
                this.latestOptions = new Options(optionsData);
                console.log("🌊 Integrated System: Loaded options from Chrome sync storage and rehydrated", {
                  hasOptions: !!this.latestOptions,
                  hasWave: !!this.latestOptions?.wave,
                  hasCssTemplate: !!this.latestOptions?.wave?.cssTemplate,
                  waveSpeed: this.latestOptions?.wave?.waveSpeed,
                  storedWaveSpeed: storedSettings.waveSpeed
                });
              } else {
                // Use defaults if nothing in storage
                this.latestOptions = Options.getDefaultOptions();
                console.log("🌊 Integrated System: Using default options", this.latestOptions);
              }
            }
          } catch (storageError) {
            console.error("🌊 Integrated System: Failed to load from storage", storageError);
            // Fall back to defaults
            this.latestOptions = Options.getDefaultOptions();
            console.log("🌊 Integrated System: Using default options after storage error", this.latestOptions);
          }
        } else {
          // No Chrome storage available, use defaults
          this.latestOptions = Options.getDefaultOptions();
          console.log("🌊 Integrated System: Using default options (no Chrome storage)", this.latestOptions);
        }
      } catch (error: any) {
        console.error("🌊 Integrated System: Failed to load default options", error);
        // Last resort: try to use whatever is in storage as-is
        if (typeof chrome !== 'undefined' && chrome.storage) {
          try {
            const result = await chrome.storage.local.get(['waveReaderSettings']);
            if (result.waveReaderSettings) {
              // Even if Options constructor fails, try to use the raw data
              this.latestOptions = result.waveReaderSettings;
              console.warn("🌊 Integrated System: Using raw storage data (Options constructor failed)", this.latestOptions);
            }
          } catch (storageError) {
            console.error("🌊 Integrated System: Failed to load from storage", storageError);
          }
        }
      }
    }
    
    // Route message to both Tomes
    this.routeMessageToTomes('start', message);
    
    // Apply wave animation
    this.applyWaveAnimation();
    
    // Update proxy state
    this.updateProxyState();
    
    // Sync state with background script
    this.syncGoingStateWithBackground();
    
    // CRITICAL: Ensure keyboard shortcut callback is set AFTER all state is initialized
    // This ensures the shortcut can stop the wave even if it was started from popup
    // The callback must be set last so it captures the final state
    // Wrap in try-catch to ensure errors don't prevent start from completing
    try {
      const { setToggleCallback } = await import('../services/keychord-content-integration');
      await setToggleCallback(() => {
        // Use arrow function to capture 'this' and ensure we check current state at execution time
        const currentGoingState = this.going;
        console.log('⌨️ Integrated System: Keyboard shortcut triggered in callback', {
          currentGoingState,
          hasLatestOptions: !!this.latestOptions,
          timestamp: new Date().toISOString()
        });
        this.handleToggle({
          name: 'toggle',
          from: 'keyboard-shortcut',
          timestamp: Date.now(),
          options: this.latestOptions
        });
      });
      console.log('⌨️ Integrated System: Keyboard shortcut callback set after start', {
        currentGoingState: this.going,
        messageFrom: message.from,
        hasLatestOptions: !!this.latestOptions
      });
    } catch (error: any) {
      console.warn('⌨️ Integrated System: Failed to set keyboard shortcut callback after start', error);
      // Don't throw - allow start to complete even if callback setup fails
    }
    
    this.messageService.logMessage('start', 'Integrated system started');
    this.logMessage('start', 'Integrated system started');
  }

  private async handleStop(message: any) {
    console.log("🌊 Integrated System: Handling stop message", {
      currentGoingState: this.going,
      messageFrom: message.from
    });
    
    this.going = false;
    
    // Route message to both Tomes
    this.routeMessageToTomes('stop', message);
    
    // Remove wave animation
    this.removeWaveAnimation();
    
    // Update proxy state
    this.updateProxyState();
    
    // Sync state with background script
    this.syncGoingStateWithBackground();
    
    // Ensure keyboard shortcut callback is set after all stop operations complete
    // This ensures the shortcut can start a new wave after stopping
    // Do this asynchronously and non-blocking so it doesn't interfere with stop flow
    import('../services/keychord-content-integration').then(({ setToggleCallback }) => {
      setToggleCallback(() => {
        // Use arrow function to capture 'this' and ensure we check current state at execution time
        const currentGoingState = this.going;
        console.log('⌨️ Integrated System: Keyboard shortcut triggered', {
          currentGoingState,
          timestamp: new Date().toISOString()
        });
        this.handleToggle({
          name: 'toggle',
          from: 'keyboard-shortcut',
          timestamp: Date.now(),
          options: this.latestOptions
        });
      }).catch((error: any) => {
        console.warn('⌨️ Integrated System: Failed to set keyboard shortcut callback after stop', error);
      });
    }).catch((error: any) => {
      console.warn('⌨️ Integrated System: Failed to import keychord service after stop', error);
    });
    
    this.messageService.logMessage('stop', 'Integrated system stopped');
    this.logMessage('stop', 'Integrated system stopped');
  }

  private handleToggle(message: any) {
    console.log("🌊 Integrated System: Handling toggle message", {
      currentGoingState: this.going,
      messageFrom: message.from,
      timestamp: new Date().toISOString()
    });
    
    // Always check current state at execution time
    const currentState = this.going;
    console.log("🌊 Integrated System: Toggle decision", {
      currentState,
      action: currentState ? 'STOP' : 'START'
    });
    
    if (currentState) {
      console.log("🌊 Integrated System: Current state is going=true, calling handleStop");
      this.handleStop(message);
    } else {
      console.log("🌊 Integrated System: Current state is going=false, calling handleStart");
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
    // Only sync if the state has actually changed to reduce spam
    if (this.going === this.lastSyncedGoingState) {
      return;
    }
    
    console.log("🌊 Integrated System: Syncing going state with background", { going: this.going });
    
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      try {
        chrome.runtime.sendMessage({
          from: 'integrated-content-system',
          name: 'update-going-state',
          going: this.going,
          timestamp: Date.now(),
          sessionId: this.sessionId
        }, (response) => {
          // Check for extension context invalidation or other errors
          if (chrome.runtime.lastError) {
            const errorMessage = chrome.runtime.lastError.message || '';
            // Extension context invalidated is a common development-time error
            // when the extension is reloaded while pages are still open
            if (errorMessage.includes('Extension context invalidated') || 
                errorMessage.includes('message port closed')) {
              console.warn("🌊 Integrated System: Extension context invalidated (extension was reloaded). This is normal during development.");
            } else {
              console.warn("🌊 Integrated System: Failed to sync going state with background:", errorMessage);
            }
          } else {
            // Only update lastSyncedGoingState on successful send
            this.lastSyncedGoingState = this.going;
          }
        });
      } catch (error: any) {
        // Handle cases where chrome.runtime might throw synchronously
        const errorMessage = error?.message || String(error);
        if (errorMessage.includes('Extension context invalidated') || 
            errorMessage.includes('message port closed')) {
          console.warn("🌊 Integrated System: Extension context invalidated (extension was reloaded). This is normal during development.");
        } else {
          console.warn("🌊 Integrated System: Error syncing going state with background:", errorMessage);
        }
      }
    }
  }

  private async handleSettingsUpdated(message: any) {
    console.log('🚨🚨🚨 CONTENT: handleSettingsUpdated called', {
      hasOptions: !!message.options,
      options: message.options,
      currentGoingState: this.going,
      hasLatestOptions: !!this.latestOptions,
      incomingWaveSpeed: message.options?.waveSpeed,
      incomingWave: message.options?.wave
    });
    
    try {
      // Update latestOptions with new settings
      if (message.options) {
        const Options = (await import('../models/options')).default;
        const Wave = (await import('../models/wave')).default;
        
        // Merge with existing options if we have them, otherwise create new
        if (this.latestOptions) {
          // Deep merge: properly merge wave properties
          const existingWave = this.latestOptions.wave || {};
          const incomingWave = message.options.wave || {};
          
          // Extract wave properties from flat settings structure (if they exist at top level)
          const waveProps: any = {
            ...existingWave,
            ...incomingWave,
            // Also check for flat properties in message.options (from Settings interface)
            waveSpeed: message.options.waveSpeed !== undefined ? message.options.waveSpeed : (incomingWave.waveSpeed ?? existingWave.waveSpeed),
            axisTranslateAmountXMax: message.options.axisTranslateAmountXMax !== undefined ? message.options.axisTranslateAmountXMax : (incomingWave.axisTranslateAmountXMax ?? existingWave.axisTranslateAmountXMax),
            axisTranslateAmountXMin: message.options.axisTranslateAmountXMin !== undefined ? message.options.axisTranslateAmountXMin : (incomingWave.axisTranslateAmountXMin ?? existingWave.axisTranslateAmountXMin),
            axisRotationAmountYMax: message.options.axisRotationAmountYMax !== undefined ? message.options.axisRotationAmountYMax : (incomingWave.axisRotationAmountYMax ?? existingWave.axisRotationAmountYMax),
            axisRotationAmountYMin: message.options.axisRotationAmountYMin !== undefined ? message.options.axisRotationAmountYMin : (incomingWave.axisRotationAmountYMin ?? existingWave.axisRotationAmountYMin),
            selector: message.options.selector !== undefined ? message.options.selector : (incomingWave.selector ?? existingWave.selector),
            cssGenerationMode: message.options.cssGenerationMode !== undefined ? message.options.cssGenerationMode : (incomingWave.cssGenerationMode ?? existingWave.cssGenerationMode),
            cssTemplate: incomingWave.cssTemplate ?? existingWave.cssTemplate,
            cssMouseTemplate: incomingWave.cssMouseTemplate ?? existingWave.cssMouseTemplate
          };
          
          // Merge all other options (non-wave properties)
          const mergedOptions = {
            ...this.latestOptions,
            ...message.options,
            wave: new Wave(waveProps) // Create new Wave instance with merged properties
          };
          
          this.latestOptions = new Options(mergedOptions);
        } else {
          // No existing options, create new from message
          // If message.options has flat wave properties, construct wave object
          if (message.options.waveSpeed !== undefined || message.options.axisRotationAmountYMax !== undefined) {
            const waveProps: any = {
              ...(message.options.wave || {}),
              waveSpeed: message.options.waveSpeed,
              axisTranslateAmountXMax: message.options.axisTranslateAmountXMax,
              axisTranslateAmountXMin: message.options.axisTranslateAmountXMin,
              axisRotationAmountYMax: message.options.axisRotationAmountYMax,
              axisRotationAmountYMin: message.options.axisRotationAmountYMin,
              selector: message.options.selector,
              cssGenerationMode: message.options.cssGenerationMode
            };
            const optionsWithWave = {
              ...message.options,
              wave: new Wave(waveProps)
            };
            this.latestOptions = new Options(optionsWithWave);
          } else {
            this.latestOptions = new Options(message.options);
          }
        }
        
        console.log('🚨🚨🚨 CONTENT: Updated latestOptions', {
          hasOptions: !!this.latestOptions,
          hasWave: !!this.latestOptions?.wave,
          waveSpeed: this.latestOptions?.wave?.waveSpeed,
          axisRotationAmountYMax: this.latestOptions?.wave?.axisRotationAmountYMax,
          axisRotationAmountYMin: this.latestOptions?.wave?.axisRotationAmountYMin,
          cssTemplateLength: this.latestOptions?.wave?.cssTemplate?.length || 0,
          incomingWaveSpeed: message.options?.waveSpeed
        });
      }
      
      // If wave is currently active, reapply animation with new settings
      if (this.going) {
        console.log('🚨🚨🚨 CONTENT: Wave is active, reapplying animation with new settings');
        this.applyWaveAnimation();
      } else {
        console.log('🚨🚨🚨 CONTENT: Wave is not active, settings updated but animation not applied');
      }
      
      this.messageService.logMessage('settings-updated', 'Settings updated and applied');
      this.logMessage('settings-updated', 'Settings updated and applied');
    } catch (error: any) {
      console.error('🚨🚨🚨 CONTENT: Error in handleSettingsUpdated', error);
      this.messageService.logMessage('settings-update-failed', `Failed to update settings: ${error.message}`);
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
    let css = wave.cssTemplate;

    // Enhanced logging for CSS animation update - output entire wave object
    console.log("🌊 Integrated System: Updating CSS animation", {
      waveObject: wave,
      waveSpeed: wave.waveSpeed,
      axisTranslateAmountXMax: wave.axisTranslateAmountXMax,
      axisTranslateAmountXMin: wave.axisTranslateAmountXMin,
      axisRotationAmountYMax: wave.axisRotationAmountYMax,
      axisRotationAmountYMin: wave.axisRotationAmountYMin,
      selector: wave.selector,
      cssGenerationMode: wave.cssGenerationMode,
      cssTemplateLength: css ? css.length : 0,
      cssTemplatePreview: css ? (css.length > 300 ? 'TOO_LONG' : css) : 'NO_CSS',
      hasCssTemplate: !!css,
      fullWaveObject: JSON.parse(JSON.stringify(wave)) // Deep clone to avoid circular references
    });

    if (css) {
      // Replace keyframe placeholders if using template mode
      if (wave.cssGenerationMode === 'template') {
        console.log("🚨🚨🚨 CONTENT: Replacing keyframe placeholders in CSS template", {
          beforeLength: css.length,
          axisTranslateAmountXMin: wave.axisTranslateAmountXMin,
          axisTranslateAmountXMax: wave.axisTranslateAmountXMax,
          axisRotationAmountYMin: wave.axisRotationAmountYMin,
          axisRotationAmountYMax: wave.axisRotationAmountYMax
        });
        css = replaceKeyframePlaceholders(css, wave);
        console.log("🚨🚨🚨 CONTENT: After replacing placeholders", {
          afterLength: css.length,
          cssPreview: css.substring(0, 500)
        });
      }
      
      console.log("🌊 Integrated System: Calling DOM service to apply CSS animation...");
      const beforeTime = performance.now();
      this.domService.applyWaveAnimation(css);
      const afterTime = performance.now();
      const duration = afterTime - beforeTime;
      
      console.log("🌊 Integrated System: CSS animation updated successfully", {
        cssLength: css.length,
        applicationDuration: `${duration.toFixed(2)}ms`,
        timestamp: new Date().toISOString()
      });
      this.messageService.logMessage('wave-animation-applied', 'Wave animation applied');
    } else {
      console.warn("🌊 Integrated System: No CSS template available in wave", {
        wave: wave,
        hasWave: !!wave,
        waveKeys: wave ? Object.keys(wave) : []
      });
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
    
    // Clean up keyboard shortcuts
    cleanupKeyChordService();
    
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
