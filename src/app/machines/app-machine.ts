import { createViewStateMachine, MachineRouter } from 'log-view-machine';
import { SyncSystem } from '../../systems/sync';
import { MACHINE_NAMES } from './machine-names';

// ServiceMeta type (from log-view-machine but defined locally due to webpack alias)
interface ServiceMeta {
    routedSend?: (target: string, event: string, payload?: any) => Promise<any>;
    machineId: string;
    router?: MachineRouter;
    machine?: any;
}

/**
 * Get a log function for XState actions
 * ViewStateMachine doesn't provide log to actions (only to services),
 * so we use console.log directly without warnings
 */
function getActionLog(meta: any, machineName: string): (msg: string, data?: any) => void {
    // Try to get log from meta if available (for future compatibility)
    if (meta?.log) {
        return meta.log;
    }
    
    // Try to get log from ViewStateMachine instance if accessible
    const machine = meta?.state?.machine;
    if (machine?.log) {
        return machine.log;
    }
    
    // Fallback: use console.log directly without warnings
    // This is expected behavior since ViewStateMachine doesn't wrap actions
    return (msg: string, data?: any) => {
        console.log(`[${machineName}] ${msg}`, data);
    };
}

/**
 * App Machine
 * 
 * Main application state machine that orchestrates:
 * - Application initialization and sync
 * - Wave control (start/stop/toggle)
 * - Settings and selector management
 * - Tab navigation
 * - Error handling
 * 
 * @param router - Optional MachineRouter for inter-machine communication
 */
export const createAppMachine = (router?: MachineRouter) => {
    return createViewStateMachine({
        machineId: 'app-machine',
        predictableActionArguments: false,
        router: router,  // Pass router to ViewStateMachine
        xstateConfig: {
            initial: 'idle',
            context: {
                message: null,
                viewModel: {
                    selector: '',
                    saved: true,
                    going: false,
                    selectors: [],
                    currentView: 'main',
                    isExtension: false,
                    settings: null,
                    showNotifications: true,
                    toggleKeys: {
                        keyChord: ['Shift', 'W']
                    }
                },
                // State machine metadata
                currentView: 'main',
                lastCleared: null,
                isCollapsed: false,
                currentTab: 'how-to',
                syncStatus: 'idle',
                lastSync: null,
                syncError: null,
                initializationInProgress: false
            },
            states: {
                idle: {
                    on: {
                        INITIALIZE: { target: 'initializing' },
                        START: { target: 'starting' },
                        STOP: { target: 'stopping' },
                        TOGGLE: { target: 'toggling' },
                        WAVE_STARTED: { target: 'waving', actions: ['updateWaveState'] },
                        WAVE_STOPPED: { target: 'ready', actions: ['updateWaveState'] },
                        WAVE_TOGGLED: { target: 'ready', actions: ['toggleWaveState'] },
                        KEYBOARD_TOGGLE: { target: 'keyboardToggling', actions: ['handleKeyboardToggle'] },
                        SELECTOR_UPDATE: { target: 'selectorUpdating', actions: ['updateSelector'] },
                        SETTINGS_UPDATE: { target: 'settingsUpdating', actions: ['updateSettings'] },
                        TAB_CHANGE: { target: 'idle', actions: ['changeTab'] },
                        TOGGLE_COLLAPSE: { target: 'idle', actions: ['toggleCollapse'] },
                        SELECTION_MADE: { target: 'idle', actions: ['handleSelectionMade'] },
                        TAB_ACTIVATED: { target: 'idle', actions: ['handleTabActivated'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
                    }
                },
                initializing: {
                    invoke: {
                        src: 'initializeService',
                        onDone: { target: 'ready', actions: ['markInitialized'] },
                        onError: { target: 'error', actions: ['handleInitError'] }
                    }
                },
                ready: {
                    on: {
                        START: { target: 'starting' },
                        STOP: { target: 'stopping' },
                        TOGGLE: { target: 'toggling' },
                        WAVE_STARTED: { target: 'waving', actions: ['updateWaveState'] },
                        WAVE_STOPPED: { target: 'ready', actions: ['updateWaveState'] },
                        WAVE_TOGGLED: { target: 'ready', actions: ['toggleWaveState'] },
                        KEYBOARD_TOGGLE: { target: 'keyboardToggling', actions: ['handleKeyboardToggle'] },
                        SELECTOR_UPDATE: { target: 'selectorUpdating', actions: ['updateSelector'] },
                        SETTINGS_UPDATE: { target: 'settingsUpdating', actions: ['updateSettings'] },
                        TAB_CHANGE: { target: 'ready', actions: ['changeTab'] },
                        TOGGLE_COLLAPSE: { target: 'ready', actions: ['toggleCollapse'] },
                        REFRESH_STATE: { target: 'ready', actions: ['refreshStateFromContentScript'] },
                        STATE_REFRESHED: { target: 'ready', actions: ['logStateRefresh'] },
                        STATE_REFRESH_FAILED: { target: 'ready', actions: ['logStateRefreshError'] },
                        SELECTION_MADE: { target: 'ready', actions: ['handleSelectionMade'] },
                        TAB_ACTIVATED: { target: 'ready', actions: ['handleTabActivated'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
                    }
                },
                starting: {
                    invoke: {
                        src: 'startService',
                        onDone: { target: 'waving', actions: ['completeStart'] },
                        onError: { target: 'error', actions: ['handleStartError'] }
                    },
                    after: {
                        10000: { target: 'error', actions: ['handleStartError'] } // 10 second timeout
                    }
                },
                waving: {
                    on: {
                        START: { target: 'starting' }, // Allow restarting while waving (e.g., to update settings)
                        STOP: { target: 'stopping' },
                        TOGGLE: { target: 'toggling' },
                        SELECTOR_UPDATE: { target: 'selectorUpdating', actions: ['updateSelector'] },
                        SETTINGS_UPDATE: { target: 'settingsUpdating', actions: ['updateSettings'] },
                        TAB_CHANGE: { target: 'waving', actions: ['changeTab'] },
                        TOGGLE_COLLAPSE: { target: 'waving', actions: ['toggleCollapse'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
                    }
                },
                toggling: {
                    invoke: {
                        src: 'toggleService',
                        onDone: [
                            { target: 'waving', cond: (context: any) => context.viewModel.going, actions: ['completeToggleWaving'] },
                            { target: 'ready', actions: ['completeToggle'] }
                        ],
                        onError: { target: 'error', actions: ['handleError'] }
                    }
                },
                keyboardToggling: {
                    on: {
                        KEYBOARD_TOGGLE_COMPLETE: { target: 'ready', actions: ['completeKeyboardToggle'] },
                        KEYBOARD_TOGGLE_WAVING: { target: 'waving', actions: ['completeKeyboardToggle'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
                    }
                },
                stopping: {
                    invoke: {
                        src: 'stopService',
                        onDone: { target: 'ready', actions: ['completeStop'] },
                        onError: { target: 'error', actions: ['handleStopError'] }
                    },
                    after: {
                        10000: { target: 'error', actions: ['handleStopError'] } // 10 second timeout
                    }
                },
                selectorUpdating: {
                    on: { 
                        SELECTOR_UPDATE_COMPLETE: { target: 'ready', actions: ['completeSelectorUpdate'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
                    }
                },
                settingsUpdating: {
                    on: { 
                        SETTINGS_UPDATE_COMPLETE: { target: 'ready', actions: ['completeSettingsUpdate'] },
                        SETTINGS_CANCEL: { target: 'ready', actions: ['cancelSettingsUpdate'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
                    }
                },
                error: {
                    on: {
                        RETRY: { target: 'initializing' },
                        RESET: { target: 'idle', actions: ['resetApp'] }
                    }
                }
            },
            actions: {
                // Async actions moved to services section (initializeService, startService, stopService, toggleService)
                updateWaveState: {
                    exec: async (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Updating wave state from Chrome API', event);
                        // The wave state is already updated in the AppTome, just log it
                        log('🌊 App Machine: Wave state updated to', context.viewModel.going);
                    }
                },
                toggleWaveState: {
                    exec: async (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Toggling wave state from Chrome API', event);
                        // The wave state is already toggled in the AppTome, just log it
                        log('🌊 App Machine: Wave state toggled to', context.viewModel.going);
                    }
                },
                handleKeyboardToggle: {
                    exec: async (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'app-machine');
                        const send = meta?.send || machine?.send?.bind(machine) || ((evt: any) => console.warn('send not available:', evt));
                        log('🌊 App Machine: Handle keyboard toggle');
                        // Delegate to toggle action
                        context.viewModel.going = !context.viewModel.going;
                        context.viewModel.saved = false;
                        
                        if (context.viewModel.going) {
                            send('KEYBOARD_TOGGLE_WAVING');
                        } else {
                            send('KEYBOARD_TOGGLE_COMPLETE');
                        }
                    }
                },
                updateSelector: {
                    exec: async (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'app-machine');
                        const send = meta?.send || machine?.send?.bind(machine) || ((evt: any) => console.warn('send not available:', evt));
                        log('🌊 App Machine: Update selector', event);
                        if (event.selector) {
                            context.viewModel.selector = event.selector;
                            context.viewModel.saved = false;
                            await SyncSystem.saveViewModelToStorage(context.viewModel, log);
                        }
                        send('SELECTOR_UPDATE_COMPLETE');
                    }
                },
                updateSettings: {
                    exec: async (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'app-machine');
                        const send = meta?.send || machine?.send?.bind(machine) || ((evt: any) => console.warn('send not available:', evt));
                        log('🌊 App Machine: Update settings', event);
                        if (event.settings) {
                            context.viewModel.settings = { ...context.viewModel.settings, ...event.settings };
                            context.viewModel.saved = false;
                        }
                        send('SETTINGS_UPDATE_COMPLETE');
                    }
                },
                changeTab: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Change tab', event);
                        if (event.tab) {
                            context.currentTab = event.tab;
                        }
                    }
                },
                handleSelectionMade: {
                    exec: (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'app-machine');
                        const send = meta?.send || machine?.send?.bind(machine) || ((evt: any) => console.warn('send not available:', evt));
                        log('🌊 App Machine: Selection made', event);
                        
                        const selector = event.selector;
                        if (selector && selector !== context.viewModel.selector) {
                            context.viewModel.selector = selector;
                            log('🌊 App Machine: Selector updated from selection:', selector);
                            
                            // Trigger selector update to sync with content script
                            send('SELECTOR_UPDATE', { selector });
                        } else {
                            log('🌊 App Machine: Selection made but selector unchanged or missing');
                        }
                    }
                },
                handleTabActivated: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Tab activated', event);
                        
                        const tabId = event.tabId;
                        if (tabId) {
                            log('🌊 App Machine: Tab activated with ID:', tabId);
                            // You could store the active tab ID in context if needed
                            // context.activeTabId = tabId;
                        }
                    }
                },
                toggleCollapse: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Toggle collapse');
                        context.isCollapsed = !context.isCollapsed;
                    }
                },
                refreshStateFromContentScript: {
                    exec: async (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine || null;
                        const log = getActionLog(meta, 'app-machine');
                        const send = meta?.send || machine?.send?.bind(machine) || ((evt: any) => console.warn('send not available:', evt));
                        log('🌊 App Machine: Performing heartbeat sync...');
                        
                        try {
                            const hasChanges = await SyncSystem.heartbeatSync(context, log, machine);
                            
                            if (hasChanges) {
                                await SyncSystem.saveViewModelToStorage(context.viewModel, log);
                                send('STATE_REFRESHED', { hasChanges: true, timestamp: Date.now() });
                                log('🌊 App Machine: Heartbeat sync completed with changes');
                            } else {
                                log('🌊 App Machine: Heartbeat sync completed - no changes');
                            }
                        } catch (error: any) {
                            log('🌊 App Machine: Heartbeat sync failed', error);
                            send('STATE_REFRESH_FAILED', { error: error.message });
                        }
                    }
                },
                logStateRefresh: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: State refreshed', event);
                    }
                },
                logStateRefreshError: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Failed to refresh state', event.error);
                    }
                },
                handleError: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Error handled', event);
                        context.viewModel.error = event.error || 'Unknown error';
                        context.viewModel.saved = false;
                    }
                },
                handleInitError: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Initialization error', event);
                        context.viewModel.error = event.error || 'Initialization failed';
                    }
                },
                handleStartError: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        const errorMsg = event?.error?.message || event?.error || event?.type === 'xstate.after(10000)#app-machine.starting' ? 'Start timeout - service did not respond within 10 seconds' : 'Failed to start';
                        log('🌊 App Machine: Start error', { event, errorMsg });
                        context.viewModel.error = errorMsg;
                        context.viewModel.going = false; // Ensure going is false on error
                    }
                },
                handleStopError: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Stop error', event);
                        context.viewModel.error = event.error || 'Failed to stop';
                    }
                },
                markInitialized: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Marked as initialized', event);
                        if (event.viewModel) {
                            context.viewModel = { ...context.viewModel, ...event.viewModel };
                        }
                    }
                },
                completeStart: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Start completed');
                        context.viewModel.saved = true;
                    }
                },
                completeStop: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Stop completed');
                        context.viewModel.saved = true;
                    }
                },
                completeToggle: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Toggle completed');
                        context.viewModel.saved = true;
                    }
                },
                completeToggleWaving: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Toggle to waving completed');
                        context.viewModel.saved = true;
                    }
                },
                completeKeyboardToggle: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Keyboard toggle completed');
                        if (event.viewModel) {
                            context.viewModel = { ...context.viewModel, ...event.viewModel };
                        }
                    }
                },
                completeSelectorUpdate: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Selector update completed');
                        context.viewModel.saved = true;
                    }
                },
                completeSettingsUpdate: {
                    exec: async (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'app-machine');
                        const send = meta?.send || machine?.send?.bind(machine) || ((evt: any) => console.warn('send not available:', evt));
                        log('🌊 App Machine: Settings update completed');
                        context.viewModel.saved = true;
                        
                        await SyncSystem.saveViewModelToStorage(context.viewModel, log);
                        send('SETTINGS_UPDATE_COMPLETE');
                    }
                },
                cancelSettingsUpdate: {
                    exec: (context: any, event: any, meta: any) => {
                        const log = getActionLog(meta, 'app-machine');
                        log('🌊 App Machine: Settings update cancelled');
                    }
                },
                resetApp: (context: any) => {
                    console.log('🌊 App Machine: Resetting app');
                    context.viewModel.error = null;
                    context.initializationInProgress = false;
                }
            },
            services: {
                initializeService: async (context: any) => {
                    const log = (msg: string, data?: any) => console.log(msg, data);
                    const machine = null; // Will be passed via meta if needed
                    
                    // Circuit breaker to prevent multiple initialization attempts
                    if (context.initializationInProgress) {
                        log('🌊 App Machine: Initialization already in progress, skipping');
                        return context.viewModel;
                    }
                    
                    context.initializationInProgress = true;
                    log('🌊 App Machine: Initializing with comprehensive sync...');
                    
                    try {
                        // Step 1: Initialize sync from all sources
                        const syncData = await SyncSystem.initializeSync(log, machine);
                        
                        // Step 2: Create merged viewModel
                        const viewModel = {
                            ...syncData.cachedData,
                            // Content script data takes precedence for critical state
                            ...(syncData.contentData && {
                                going: syncData.contentData.going,
                                selector: syncData.contentData.selector || syncData.cachedData.selector,
                                saved: syncData.contentData.going === syncData.cachedData.going &&
                                       (syncData.contentData.selector === syncData.cachedData.selector || !syncData.contentData.selector)
                            }),
                            // Background data provides additional context
                            ...(syncData.backgroundData && {
                                activeConnections: syncData.backgroundData.activeConnections,
                                sessionId: syncData.backgroundData.sessionId,
                                healthStatus: syncData.backgroundData.healthStatus
                            }),
                            // Always mark initialization timestamp
                            lastInitialized: Date.now(),
                            toggleKeys: {
                                keyChord: ['Ctrl', 'Shift', 'W']
                            }
                        };
                        
                        log('🌊 App Machine: Synchronized viewModel created', viewModel);
                        
                        // Step 3: Save synchronized state for consistency
                        await SyncSystem.saveViewModelToStorage(viewModel, log);
                        
                        // Step 4: Update context and return
                        context.viewModel = viewModel;
                        context.initializationInProgress = false;
                        
                        return viewModel;
                    } catch (error: any) {
                        console.error('🌊 App Machine: Initialization failed', error);
                        context.viewModel.error = error.message || 'Initialization failed';
                        context.initializationInProgress = false;
                        throw error;
                    }
                },
                startService: async (context: any, event: any, meta: ServiceMeta) => {
                    const log = (msg: string, data?: any) => console.log(msg, data);
                    
                    log('🌊 App Machine: Starting Wave Reader...');
                    
                    // Load settings to include as options
                    let options = null;
                    try {
                        const Options = (await import('../../models/options')).default;
                        const Wave = (await import('../../models/wave')).default;
                        
                        // First try to get settings from context
                        if (context.viewModel.settings) {
                            options = context.viewModel.settings;
                            log('🌊 App Machine: Using settings from context', {
                                hasOptions: !!options,
                                waveSpeed: options?.waveSpeed || options?.wave?.waveSpeed
                            });
                        } else {
                            // Load from Chrome storage
                            if (typeof chrome !== 'undefined' && chrome.storage) {
                                const storageResult = await chrome.storage.local.get(['waveReaderSettings']);
                                if (storageResult.waveReaderSettings) {
                                    const storedSettings = storageResult.waveReaderSettings;
                                    log('🌊 App Machine: Loaded settings from Chrome storage', {
                                        hasSettings: !!storedSettings,
                                        waveSpeed: storedSettings.waveSpeed,
                                        hasWave: !!storedSettings.wave
                                    });
                                    
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
                                    
                                    // Create Options instance to ensure proper structure
                                    options = new Options(optionsData);
                                    log('🌊 App Machine: Converted settings to Options format', {
                                        hasOptions: !!options,
                                        hasWave: !!options?.wave,
                                        waveSpeed: options?.wave?.waveSpeed,
                                        cssTemplateLength: options?.wave?.cssTemplate?.length || 0
                                    });
                                    
                                    // Store in context for future use
                                    context.viewModel.settings = options;
                                }
                            }
                        }
                        
                        // If still no settings, try sync storage
                        if (!options && typeof chrome !== 'undefined' && chrome.storage) {
                            const syncResult = await chrome.storage.sync.get(['waveReaderSettings']);
                            if (syncResult.waveReaderSettings) {
                                const storedSettings = syncResult.waveReaderSettings;
                                log('🌊 App Machine: Loaded settings from Chrome sync storage', {
                                    hasSettings: !!storedSettings,
                                    waveSpeed: storedSettings.waveSpeed
                                });
                                
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
                                
                                options = new Options(optionsData);
                                log('🌊 App Machine: Converted sync settings to Options format', {
                                    hasOptions: !!options,
                                    waveSpeed: options?.wave?.waveSpeed
                                });
                                context.viewModel.settings = options;
                            }
                        }
                        
                        // If still no settings, use defaults
                        if (!options) {
                            options = Options.getDefaultOptions();
                            log('🌊 App Machine: Using default options', {
                                waveSpeed: options?.wave?.waveSpeed
                            });
                        }
                    } catch (error: any) {
                        log('🌊 App Machine: Failed to load settings, using defaults', error.message);
                        const Options = (await import('../../models/options')).default;
                        options = Options.getDefaultOptions();
                    }
                    
                    if (meta.routedSend) {
                        try {
                            // Convert Options to plain object for serialization
                            const optionsPlain = options && typeof options === 'object' 
                                ? (options.toJSON ? options.toJSON() : JSON.parse(JSON.stringify(options)))
                                : options;
                            
                            log('🌊 App Machine: About to send START to ChromeApiMachine via routedSend', {
                                target: MACHINE_NAMES.CHROME_API,
                                hasOptions: !!optionsPlain,
                                selector: context.viewModel.selector || 'p'
                            });
                            
                            // Send START to ChromeApiMachine via router with options
                            const response = await meta.routedSend(MACHINE_NAMES.CHROME_API, 'START', {
                                options: optionsPlain,
                                selector: context.viewModel.selector || 'p'
                            });
                            
                            log('🌊 App Machine: ChromeApiMachine response received', {
                                hasResponse: !!response,
                                responseType: typeof response,
                                responseKeys: response ? Object.keys(response) : [],
                                success: response?.success,
                                fullResponse: response
                            });
                            
                            // Only update state if start was successful
                            // If it failed, the ChromeApi Machine will have thrown an error
                            log('🌊 App Machine: Setting going = true and saved = false');
                            context.viewModel.going = true;
                            context.viewModel.saved = false;
                        } catch (error: any) {
                            log('🌊 App Machine: Failed to start wave reader - error caught in startService', {
                                errorMessage: error?.message,
                                errorName: error?.name,
                                errorStack: error?.stack?.substring(0, 200),
                                fullError: error
                            });
                            // Don't set going = true if start failed
                            log('🌊 App Machine: Re-throwing error to trigger onError transition');
                            throw error; // Re-throw to trigger onError transition
                        }
                    } else {
                        // If no routedSend, we can't actually start, so don't set going = true
                        log('🌊 App Machine: ChromeApiMachine not available, cannot start - no routedSend');
                        throw new Error('ChromeApiMachine not available');
                    }
                    
                    await SyncSystem.saveViewModelToStorage(context.viewModel, log);
                    
                    log('🌊 App Machine: Wave Reader started successfully');
                    return context.viewModel;
                },
                stopService: async (context: any, event: any, meta: ServiceMeta) => {
                    const log = (msg: string, data?: any) => console.log(msg, data);
                    
                    log('🌊 App Machine: Stopping Wave Reader...');
                    
                    if (meta.routedSend) {
                        try {
                            // Send STOP to ChromeApiMachine via router
                            const response = await meta.routedSend(MACHINE_NAMES.CHROME_API, 'STOP');
                            log('🌊 App Machine: ChromeApiMachine response', response);
                        } catch (error: any) {
                            log('🌊 App Machine: ChromeApiMachine not available, updating local state only', error.message);
                        }
                    }
                    
                    // Update local state
                    context.viewModel.going = false;
                    context.viewModel.saved = false;
                    
                    await SyncSystem.saveViewModelToStorage(context.viewModel, log);
                    
                    log('🌊 App Machine: Wave Reader stopped successfully');
                    return context.viewModel;
                },
                toggleService: async (context: any, event: any, meta: ServiceMeta) => {
                    const log = (msg: string, data?: any) => console.log(msg, data);
                    
                    log('🌊 App Machine: Toggling Wave Reader...');
                    
                    if (meta.routedSend) {
                        try {
                            // Send TOGGLE to ChromeApiMachine via router
                            const response = await meta.routedSend(MACHINE_NAMES.CHROME_API, 'TOGGLE');
                            log('🌊 App Machine: ChromeApiMachine response', response);
                        } catch (error: any) {
                            log('🌊 App Machine: ChromeApiMachine not available, updating local state only', error.message);
                        }
                    }
                    
                    // Update local state
                    context.viewModel.going = !context.viewModel.going;
                    context.viewModel.saved = false;
                    
                    log(`🌊 App Machine: Updated viewModel.going to ${context.viewModel.going}`);
                    
                    return context.viewModel;
                }
            }
        }
    });
};

