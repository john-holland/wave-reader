import { createViewStateMachine } from 'log-view-machine';
import { SyncSystem } from '../../systems/sync';

/**
 * App Machine
 * 
 * Main application state machine that orchestrates:
 * - Application initialization and sync
 * - Wave control (start/stop/toggle)
 * - Settings and selector management
 * - Tab navigation
 * - Error handling
 */
export const createAppMachine = () => {
    return createViewStateMachine({
        machineId: 'app-machine',
        predictableActionArguments: false,
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
                        keyChord: ['Ctrl', 'Shift', 'W']
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
                        INITIALIZE: { target: 'initializing', actions: ['initializeApp'] },
                        START: { target: 'starting', actions: ['startApp'] },
                        STOP: { target: 'stopping', actions: ['stopApp'] },
                        TOGGLE: { target: 'toggling', actions: ['toggleApp'] },
                        KEYBOARD_TOGGLE: { target: 'keyboardToggling', actions: ['handleKeyboardToggle'] },
                        SELECTOR_UPDATE: { target: 'selectorUpdating', actions: ['updateSelector'] },
                        SETTINGS_UPDATE: { target: 'settingsUpdating', actions: ['updateSettings'] },
                        TAB_CHANGE: { target: 'idle', actions: ['changeTab'] },
                        TOGGLE_COLLAPSE: { target: 'idle', actions: ['toggleCollapse'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
                    }
                },
                initializing: {
                    on: {
                        INITIALIZATION_COMPLETE: { target: 'ready', actions: ['markInitialized'] },
                        INITIALIZATION_FAILED: { target: 'error', actions: ['handleInitError'] }
                    }
                },
                ready: {
                    on: {
                        START: { target: 'starting', actions: ['startApp'] },
                        STOP: { target: 'stopping', actions: ['stopApp'] },
                        TOGGLE: { target: 'toggling', actions: ['toggleApp'] },
                        KEYBOARD_TOGGLE: { target: 'keyboardToggling', actions: ['handleKeyboardToggle'] },
                        SELECTOR_UPDATE: { target: 'selectorUpdating', actions: ['updateSelector'] },
                        SETTINGS_UPDATE: { target: 'settingsUpdating', actions: ['updateSettings'] },
                        TAB_CHANGE: { target: 'ready', actions: ['changeTab'] },
                        TOGGLE_COLLAPSE: { target: 'ready', actions: ['toggleCollapse'] },
                        REFRESH_STATE: { target: 'ready', actions: ['refreshStateFromContentScript'] },
                        STATE_REFRESHED: { target: 'ready', actions: ['logStateRefresh'] },
                        STATE_REFRESH_FAILED: { target: 'ready', actions: ['logStateRefreshError'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
                    }
                },
                starting: {
                    on: {
                        APP_STARTED: { target: 'waving', actions: ['completeStart'] },
                        START_FAILED: { target: 'error', actions: ['handleStartError'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
                    }
                },
                waving: {
                    on: {
                        STOP: { target: 'stopping', actions: ['stopApp'] },
                        TOGGLE: { target: 'toggling', actions: ['toggleApp'] },
                        SELECTOR_UPDATE: { target: 'selectorUpdating', actions: ['updateSelector'] },
                        SETTINGS_UPDATE: { target: 'settingsUpdating', actions: ['updateSettings'] },
                        TAB_CHANGE: { target: 'waving', actions: ['changeTab'] },
                        TOGGLE_COLLAPSE: { target: 'waving', actions: ['toggleCollapse'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
                    }
                },
                toggling: {
                    on: {
                        TOGGLE_COMPLETE: { target: 'ready', actions: ['completeToggle'] },
                        TOGGLE_COMPLETE_WAVING: { target: 'waving', actions: ['completeToggleWaving'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
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
                    on: {
                        APP_STOPPED: { target: 'ready', actions: ['completeStop'] },
                        STOP_FAILED: { target: 'error', actions: ['handleStopError'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
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
                        RETRY: { target: 'initializing', actions: ['initializeApp'] },
                        RESET: { target: 'idle', actions: ['resetApp'] }
                    }
                }
            },
            actions: {
                initializeApp: {
                    type: 'function',
                    fn: async ({context, event, send, log, machine}: any) => {
                        // Circuit breaker to prevent multiple initialization attempts
                        if (context.initializationInProgress) {
                            log('🌊 App Machine: Initialization already in progress, skipping');
                            return;
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
                            
                            // Step 4: Update context and complete initialization
                            context.viewModel = viewModel;
                            context.initializationInProgress = false;
                            send('INITIALIZATION_COMPLETE');
                            
                        } catch (error: any) {
                            console.error('🌊 App Machine: Initialization failed', error);
                            context.viewModel.error = error.message || 'Initialization failed';
                            context.initializationInProgress = false;
                            send('INITIALIZATION_FAILED', { error: error.message });
                        }
                    }
                },
                startApp: {
                    type: 'function',
                    fn: async ({context, event, send, log, machine}: any) => {
                        log('🌊 App Machine: Starting Wave Reader...');
                        
                        try {
                            // Send START to background proxy via parent machine
                            const bgProxy = machine.parentMachine?.getSubMachine?.('background-proxy-machine');
                            const response = await bgProxy?.send?.('START') || { success: false, error: 'Background proxy not found' };
                            
                            if (response && response.success) {
                                context.viewModel.going = true;
                                context.viewModel.saved = false;
                                
                                await SyncSystem.saveViewModelToStorage(context.viewModel, log);
                                
                                log('🌊 App Machine: Wave Reader started successfully');
                                send('APP_STARTED');
                            } else {
                                throw new Error(response?.error || 'Failed to start Wave Reader');
                            }
                        } catch (error: any) {
                            log('🌊 App Machine: Failed to start Wave Reader', error);
                            context.viewModel.error = error.message;
                            send('ERROR', { error: error.message });
                        }
                    }
                },
                stopApp: {
                    type: 'function',
                    fn: async ({context, event, send, log, machine}: any) => {
                        log('🌊 App Machine: Stopping Wave Reader...');
                        
                        try {
                            // Send STOP to background proxy via parent machine
                            const bgProxy = machine.parentMachine?.getSubMachine?.('background-proxy-machine');
                            const response = await bgProxy?.send?.('STOP') || { success: false, error: 'Background proxy not found' };
                            
                            if (response && response.success) {
                                context.viewModel.going = false;
                                context.viewModel.saved = false;
                                
                                await SyncSystem.saveViewModelToStorage(context.viewModel, log);
                                
                                log('🌊 App Machine: Wave Reader stopped successfully');
                                send('APP_STOPPED');
                            } else {
                                throw new Error(response?.error || 'Failed to stop Wave Reader');
                            }
                        } catch (error: any) {
                            log('🌊 App Machine: Failed to stop Wave Reader', error);
                            context.viewModel.error = error.message;
                            send('ERROR', { error: error.message });
                        }
                    }
                },
                toggleApp: {
                    type: 'function',
                    fn: async ({context, event, send, log, machine}: any) => {
                        log('🌊 App Machine: Toggling Wave Reader...');
                        
                        try {
                            // Send TOGGLE to background proxy via parent machine
                            const bgProxy = machine.parentMachine?.getSubMachine?.('background-proxy-machine');
                            const response = await bgProxy?.send?.('TOGGLE') || { success: false };
                            
                            // Update viewModel
                            context.viewModel.going = !context.viewModel.going;
                            context.viewModel.saved = false;
                            
                            log(`🌊 App Machine: Updated viewModel.going to ${context.viewModel.going}`);
                            
                            // Send appropriate completion event
                            if (context.viewModel.going) {
                                send('TOGGLE_COMPLETE_WAVING');
                            } else {
                                send('TOGGLE_COMPLETE');
                            }
                            
                        } catch (error: any) {
                            console.error('🌊 App Machine: Toggle error', error);
                            send('ERROR', { error: error.message });
                        }
                    }
                },
                handleKeyboardToggle: {
                    type: 'function',
                    fn: async ({context, event, send, log}: any) => {
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
                    type: 'function',
                    fn: async ({context, event, send, log}: any) => {
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
                    type: 'function',
                    fn: async ({context, event, send, log}: any) => {
                        log('🌊 App Machine: Update settings', event);
                        if (event.settings) {
                            context.viewModel.settings = { ...context.viewModel.settings, ...event.settings };
                            context.viewModel.saved = false;
                        }
                        send('SETTINGS_UPDATE_COMPLETE');
                    }
                },
                changeTab: {
                    type: 'function',
                    fn: ({context, event, log}: any) => {
                        log('🌊 App Machine: Change tab', event);
                        if (event.tab) {
                            context.currentTab = event.tab;
                        }
                    }
                },
                toggleCollapse: {
                    type: 'function',
                    fn: ({context, log}: any) => {
                        log('🌊 App Machine: Toggle collapse');
                        context.isCollapsed = !context.isCollapsed;
                    }
                },
                refreshStateFromContentScript: {
                    type: 'function',
                    fn: async ({context, send, log, machine}: any) => {
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
                    type: 'function',
                    fn: ({context, event, log}: any) => {
                        log('🌊 App Machine: State refreshed', event);
                    }
                },
                logStateRefreshError: {
                    type: 'function',
                    fn: ({context, event, log}: any) => {
                        log('🌊 App Machine: Failed to refresh state', event.error);
                    }
                },
                handleError: {
                    type: 'function',
                    fn: ({context, event, log}: any) => {
                        log('🌊 App Machine: Error handled', event);
                        context.viewModel.error = event.error || 'Unknown error';
                        context.viewModel.saved = false;
                    }
                },
                handleInitError: {
                    type: 'function',
                    fn: ({context, event, log}: any) => {
                        log('🌊 App Machine: Initialization error', event);
                        context.viewModel.error = event.error || 'Initialization failed';
                    }
                },
                handleStartError: {
                    type: 'function',
                    fn: ({context, event, log}: any) => {
                        log('🌊 App Machine: Start error', event);
                        context.viewModel.error = event.error || 'Failed to start';
                    }
                },
                handleStopError: {
                    type: 'function',
                    fn: ({context, event, log}: any) => {
                        log('🌊 App Machine: Stop error', event);
                        context.viewModel.error = event.error || 'Failed to stop';
                    }
                },
                markInitialized: {
                    type: 'function',
                    fn: ({context, event, log}: any) => {
                        log('🌊 App Machine: Marked as initialized', event);
                        if (event.viewModel) {
                            context.viewModel = { ...context.viewModel, ...event.viewModel };
                        }
                    }
                },
                completeStart: {
                    type: 'function',
                    fn: ({context, log}: any) => {
                        log('🌊 App Machine: Start completed');
                        context.viewModel.saved = true;
                    }
                },
                completeStop: {
                    type: 'function',
                    fn: ({context, log}: any) => {
                        log('🌊 App Machine: Stop completed');
                        context.viewModel.saved = true;
                    }
                },
                completeToggle: {
                    type: 'function',
                    fn: ({context, log}: any) => {
                        log('🌊 App Machine: Toggle completed');
                        context.viewModel.saved = true;
                    }
                },
                completeToggleWaving: {
                    type: 'function',
                    fn: ({context, log}: any) => {
                        log('🌊 App Machine: Toggle to waving completed');
                        context.viewModel.saved = true;
                    }
                },
                completeKeyboardToggle: {
                    type: 'function',
                    fn: ({context, event, log}: any) => {
                        log('🌊 App Machine: Keyboard toggle completed');
                        if (event.viewModel) {
                            context.viewModel = { ...context.viewModel, ...event.viewModel };
                        }
                    }
                },
                completeSelectorUpdate: {
                    type: 'function',
                    fn: ({context, log}: any) => {
                        log('🌊 App Machine: Selector update completed');
                        context.viewModel.saved = true;
                    }
                },
                completeSettingsUpdate: {
                    type: 'function',
                    fn: async ({context, send, log}: any) => {
                        log('🌊 App Machine: Settings update completed');
                        context.viewModel.saved = true;
                        
                        await SyncSystem.saveViewModelToStorage(context.viewModel, log);
                        send('SETTINGS_UPDATE_COMPLETE');
                    }
                },
                cancelSettingsUpdate: {
                    type: 'function',
                    fn: ({log}: any) => {
                        log('🌊 App Machine: Settings update cancelled');
                    }
                },
                resetApp: {
                    type: 'function',
                    fn: ({context, log}: any) => {
                        log('🌊 App Machine: Resetting app');
                        context.viewModel.error = null;
                        context.initializationInProgress = false;
                    }
                }
            }
        }
    });
};

