import { createViewStateMachine, MachineRouter } from 'log-view-machine';
import Options from '../../models/options';

// ServiceMeta type for routed send
// This provides the routedSend function in services
type ServiceMeta = {
    routedSend?: (target: string, event: string, data?: any) => Promise<any>;
    machine?: {
        parentMachine?: {
            appMachine?: {
                send: (event: string) => void;
            };
        };
    };
};

/**
 * Chrome API Machine
 * 
 * Handles Chrome extension API communications using routed send pattern
 * Replaces ProxyRobotCopyStateMachine with standard ViewStateMachine + transformers
 * 
 * Pattern:
 * - Uses routed send to communicate with parent AppTome
 * - Uses services for async Chrome API calls
 * - Transformers can be added at the Tome level for message routing
 */
export const createChromeApiMachine = (router?: MachineRouter) => {
    return createViewStateMachine({
        machineId: 'chrome-api-machine',
        router: router,
        predictableActionArguments: false,
        xstateConfig: {
            initial: 'idle',
            context: {
                sessionId: null,
                activeConnections: 0,
                lastMessage: null,
                error: null
            },
            states: {
                idle: {
                    on: {
                        INITIALIZE: { target: 'initializing' },
                        START: { target: 'starting' },
                        STOP: { target: 'stopping' },
                        TOGGLE: { target: 'toggling' },
                        GET_STATUS: { target: 'idle', actions: ['respondWithStatus'] },
                        HEALTH_CHECK: { target: 'idle', actions: ['respondWithHealth'] },
                        PING: { target: 'idle', actions: ['respondWithPong'] },
                        INCOMING_MESSAGE: { target: 'idle', actions: ['handleIncomingMessage'] }
                    }
                },
                initializing: {
                    invoke: {
                        src: 'initializeService',
                        onDone: { target: 'idle', actions: ['setSessionId'] },
                        onError: { target: 'error', actions: ['setError'] }
                    }
                },
                starting: {
                    invoke: {
                        src: 'startService',
                        onDone: { target: 'idle', actions: ['handleStartComplete'] },
                        onError: { target: 'error', actions: ['setError'] }
                    }
                },
                stopping: {
                    invoke: {
                        src: 'stopService',
                        onDone: { target: 'idle', actions: ['handleStopComplete'] },
                        onError: { target: 'error', actions: ['setError'] }
                    }
                },
                toggling: {
                    invoke: {
                        src: 'toggleService',
                        onDone: { target: 'idle', actions: ['handleToggleComplete'] },
                        onError: { target: 'error', actions: ['setError'] }
                    }
                },
                error: {
                    on: {
                        RETRY: { target: 'idle', actions: ['clearError'] },
                        RESET: { target: 'idle', actions: ['resetMachine'] }
                    }
                }
            },
            services: {
                initializeService: async (context: any, event: any, meta: ServiceMeta) => {
                    console.log('🔌 ChromeApi: Initializing connection to background script');
                    
                    if (typeof chrome !== 'undefined' && chrome.runtime) {
                        try {
                            const response: any = await chrome.runtime.sendMessage({
                                name: 'initialize',
                                from: 'popup',
                                timestamp: Date.now()
                            });
                            
                            if (response && response.success) {
                                // Notify parent about successful initialization via routed send
                                if (meta.routedSend) {
                                    await meta.routedSend('..', 'CHROME_API_INITIALIZED', {
                                        sessionId: response.sessionId
                                    });
                                }
                                
                                return response;
                            } else {
                                throw new Error(response?.error || 'Initialization failed');
                            }
                        } catch (error: any) {
                            console.error('🔌 ChromeApi: Initialization error', error);
                            throw error;
                        }
                    } else {
                        throw new Error('Chrome runtime not available');
                    }
                },
                
                startService: async (context: any, event: any, meta: ServiceMeta) => {
                    console.log('🔌 ChromeApi: Starting wave reader');
                    
                    // Extract options from event (routedSend spreads payload into event object)
                    // event will be { type: 'START', options: ..., selector: ... }
                    let options = event?.options || null;
                    
                    // If no options provided, use defaults (safety net)
                    if (!options) {
                        console.warn('🔌 ChromeApi: No options in event, using defaults');
                        options = Options.getDefaultOptions();
                    }
                    
                    // Serialize options to plain object for message passing
                    const optionsPlain = options && typeof options === 'object' 
                        ? (options.toJSON ? options.toJSON() : JSON.parse(JSON.stringify(options)))
                        : options;
                    
                    const selector = event?.selector || 'p';
                    
                    console.log('🔌 ChromeApi: Start request with options:', { options: optionsPlain, selector });
                    
                    if (typeof chrome !== 'undefined' && chrome.runtime) {
                        const response: any = await chrome.runtime.sendMessage({
                            name: 'start',
                            from: 'popup',
                            timestamp: Date.now(),
                            options: optionsPlain,
                            selector: selector
                        });
                        
                        // Notify parent via routed send
                        if (meta.routedSend && response?.success) {
                            await meta.routedSend('..', 'WAVE_STARTED', {
                                success: true,
                                data: response,
                                timestamp: Date.now()
                            });
                        }
                        
                        // Also send directly to parent machine if available
                        if (meta.machine?.parentMachine?.appMachine) {
                            meta.machine.parentMachine.appMachine.send('WAVE_STARTED');
                        }
                        
                        return response;
                    } else {
                        throw new Error('Chrome runtime not available');
                    }
                },
                
                stopService: async (context: any, event: any, meta: ServiceMeta) => {
                    console.log('🔌 ChromeApi: Stopping wave reader');
                    
                    if (typeof chrome !== 'undefined' && chrome.runtime) {
                        const response: any = await chrome.runtime.sendMessage({
                            name: 'stop',
                            from: 'popup',
                            timestamp: Date.now()
                        });
                        
                        // Notify parent via routed send
                        if (meta.routedSend && response?.success) {
                            await meta.routedSend('..', 'WAVE_STOPPED', {
                                success: true,
                                data: response,
                                timestamp: Date.now()
                            });
                        }
                        
                        // Also send directly to parent machine if available
                        if (meta.machine?.parentMachine?.appMachine) {
                            meta.machine.parentMachine.appMachine.send('WAVE_STOPPED');
                        }
                        
                        return response;
                    } else {
                        throw new Error('Chrome runtime not available');
                    }
                },
                
                toggleService: async (context: any, event: any, meta: ServiceMeta) => {
                    console.log('🔌 ChromeApi: Toggling wave reader');
                    
                    if (typeof chrome !== 'undefined' && chrome.runtime) {
                        const response: any = await chrome.runtime.sendMessage({
                            name: 'toggle',
                            from: 'popup',
                            timestamp: Date.now()
                        });
                        
                        // Notify parent via routed send
                        if (meta.routedSend && response?.success) {
                            await meta.routedSend('..', 'WAVE_TOGGLED', {
                                success: true,
                                data: response,
                                timestamp: Date.now()
                            });
                        }
                        
                        // Also send directly to parent machine if available
                        if (meta.machine?.parentMachine?.appMachine) {
                            meta.machine.parentMachine.appMachine.send('WAVE_TOGGLED');
                        }
                        
                        return response;
                    } else {
                        throw new Error('Chrome runtime not available');
                    }
                }
            },
            actions: {
                setSessionId: (context: any, event: any) => {
                    console.log('🔌 ChromeApi: Session ID set', event.data.sessionId);
                    context.sessionId = event.data.sessionId;
                },
                handleStartComplete: (context: any, event: any) => {
                    console.log('🔌 ChromeApi: Start complete', event.data);
                    // The routed send event is already sent in the service, just log completion
                },
                handleStopComplete: (context: any, event: any) => {
                    console.log('🔌 ChromeApi: Stop complete', event.data);
                    // The routed send event is already sent in the service, just log completion
                },
                handleToggleComplete: (context: any, event: any) => {
                    console.log('🔌 ChromeApi: Toggle complete', event.data);
                    // The routed send event is already sent in the service, just log completion
                },
                respondWithStatus: (context: any) => {
                    console.log('🔌 ChromeApi: Status requested', {
                        sessionId: context.sessionId,
                        activeConnections: context.activeConnections
                    });
                },
                respondWithHealth: (context: any) => {
                    console.log('🔌 ChromeApi: Health check', {
                        healthy: !!context.sessionId,
                        sessionId: context.sessionId
                    });
                },
                respondWithPong: (context: any) => {
                    console.log('🔌 ChromeApi: Pong', { timestamp: Date.now() });
                },
                setError: (context: any, event: any) => {
                    console.error('🔌 ChromeApi: Error occurred', event.data);
                    context.error = event.data;
                },
                clearError: (context: any) => {
                    console.log('🔌 ChromeApi: Clearing error');
                    context.error = null;
                },
                resetMachine: (context: any) => {
                    console.log('🔌 ChromeApi: Resetting machine');
                    context.sessionId = null;
                    context.activeConnections = 0;
                    context.lastMessage = null;
                    context.error = null;
                },
                handleIncomingMessage: async (context: any, event: any, meta: ServiceMeta) => {
                    console.log('🔌 ChromeApi: Handling incoming message', event);
                    
                    const message = event.data?.message || event.message;
                    if (!message) {
                        console.warn('🔌 ChromeApi: No message data in incoming message event');
                        return;
                    }

                    // Store last message
                    context.lastMessage = message;
                    
                    // Route message to appropriate target based on message type
                    try {
                        let eventType: string;
                        let messageData: any = {};

                        if (message.name === 'selection-made') {
                            eventType = 'SELECTION_MADE';
                            messageData = {
                                selector: message.selector,
                                sessionId: message.sessionId,
                                timestamp: message.timestamp || Date.now()
                            };
                        } else if (message.type === 'TAB_ACTIVATED') {
                            eventType = 'TAB_ACTIVATED';
                            messageData = {
                                tabId: message.data?.tabId || message.tabId,
                                timestamp: message.timestamp || Date.now()
                            };
                        } else {
                            // For other message types, route with original message name/type
                            eventType = message.name || message.type || 'UNKNOWN_MESSAGE';
                            messageData = {
                                ...message,
                                timestamp: message.timestamp || Date.now()
                            };
                            console.log('🔌 ChromeApi: Routing unknown message type:', eventType);
                        }

                        // Use relative path to route to parent (AppMachine)
                        if (meta.routedSend) {
                            console.log('🔌 ChromeApi: Routing to parent machine:', eventType, messageData);
                            await meta.routedSend('..', eventType, messageData);
                        } else {
                            console.warn('🔌 ChromeApi: routedSend not available in meta');
                        }
                    } catch (error: any) {
                        console.error('🔌 ChromeApi: Error routing incoming message:', error);
                        context.error = error.message;
                    }
                }
            }
        }
    });
};

/**
 * Helper function to create a message transformer for Chrome API routing
 * This can be used in the Tome configuration to route messages
 */
export const createChromeApiTransformer = () => ({
    input: async ({context, event, send, log, machine}: any) => {
        console.log('🔌 ChromeApi Transformer: Processing input', event);
        
        // Transform the event for the Chrome API machine
        const transformedEvent = {
            type: event.type,
            data: event.data || {},
            timestamp: Date.now()
        };
        
        // Send to Chrome API machine via router
        if (machine.parentMachine) {
            const chromeApiMachine = machine.parentMachine.router?.resolve('ChromeApiMachine');
            if (chromeApiMachine) {
                return chromeApiMachine.send(transformedEvent);
            }
        }
        
        return { success: false, error: 'Chrome API machine not found' };
    },
    output: ({context, event, send, log}: any) => {
        console.log('🔌 ChromeApi Transformer: Processing output', event);
        
        // Return the context or response
        return context;
    }
});

