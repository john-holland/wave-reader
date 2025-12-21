import { createProxyRobotCopyStateMachine, createRobotCopy } from 'log-view-machine';
import { FeatureToggleService, getDefaultBackendRequestState } from '../../config/feature-toggles';
import { performBackendRequest, registerBackendToggleService, safeGraphQLRequest } from '../../utils/backend-api-wrapper';

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
 * Background Proxy Machine
 * 
 * Wraps all Chrome extension API communications
 * Routes messages between popup and background/content scripts
 * 
 * Uses hierarchical routing:
 * - Send to parent: send('..', event, data)
 * - Send to sibling: send('./SiblingMachine', event, data)
 */
export const createBackgroundProxyMachine = () => {
    const robotCopyInstance = createRobotCopy({
        enableTracing: false,
        enableDataDog: false,
        kotlinBackendUrl: typeof chrome !== 'undefined' && chrome.runtime?.id 
            ? `chrome-extension://${chrome.runtime.id}` 
            : 'chrome-extension://wave-reader',
        nodeBackendUrl: typeof chrome !== 'undefined' && chrome.runtime?.id 
            ? `chrome-extension://${chrome.runtime.id}` 
            : 'chrome-extension://wave-reader'
    });

    const originalIsEnabled = robotCopyInstance.isEnabled?.bind(robotCopyInstance);

    if (originalIsEnabled) {
        robotCopyInstance.isEnabled = async (toggleName: string, context?: any) => {
            if (toggleName === 'enable-backend-api-requests') {
                return false;
            }

            try {
                return await originalIsEnabled(toggleName, context);
            } catch (error) {
                console.warn('🌊 Background Proxy: Falling back to default toggle state for', toggleName, error);
                return false;
            }
        };
    }

    const backendToggleService = new FeatureToggleService(robotCopyInstance);
    registerBackendToggleService(backendToggleService);
    const initialBackendState = backendToggleService.getCachedBackendRequestState();
    const machine = createProxyRobotCopyStateMachine({
        machineId: 'background-proxy-machine',
        predictableActionArguments: false,
        xstateConfig: {
            initial: 'idle',
            context: {
                message: null,
                sessionId: null,
                activeConnections: 0,
                backendRequestsEnabled: initialBackendState,
                lastBackendResponse: null,
                lastGraphQLResponse: null
            },
            states: {
                idle: {
                    on: {
                        INITIALIZE: { target: 'initializing', actions: ['handleInitialize'] },
                        START: { target: 'starting', actions: ['handleStart'] },
                        STOP: { target: 'stopping', actions: ['handleStop'] },
                        TOGGLE: { target: 'toggling', actions: ['handleToggle'] },
                        GET_STATUS: { target: 'idle', actions: ['handleGetStatus'] },
                        HEALTH_CHECK: { target: 'idle', actions: ['handleHealthCheck'] },
                        PING: { target: 'idle', actions: ['handlePing'] },
                        BACKEND_REQUEST: { target: 'backendRequesting' },
                        GRAPHQL_REQUEST: { target: 'graphqlRequesting' },
                        SET_BACKEND_TOGGLE: { target: 'idle', actions: ['setBackendToggleState'] },
                        GET_BACKEND_TOGGLE: { target: 'backendToggleQuerying' }
                    }
                },
                initializing: {
                    on: {
                        INITIALIZATION_COMPLETE: { target: 'idle', actions: ['completeInitialization'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
                    }
                },
                starting: {
                    on: {
                        START_COMPLETE: { target: 'idle', actions: ['completeStart'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
                    }
                },
                stopping: {
                    on: {
                        STOP_COMPLETE: { target: 'idle', actions: ['completeStop'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
                    }
                },
                toggling: {
                    on: {
                        TOGGLE_COMPLETE: { target: 'idle', actions: ['completeToggle'] },
                        ERROR: { target: 'error', actions: ['handleError'] }
                    }
                },
                backendRequesting: {
                    invoke: {
                        src: 'proxyBackendRequestService',
                        onDone: { target: 'idle', actions: ['completeBackendRequest'] },
                        onError: { target: 'error', actions: ['handleError'] }
                    }
                },
                graphqlRequesting: {
                    invoke: {
                        src: 'proxyGraphQLRequestService',
                        onDone: { target: 'idle', actions: ['completeGraphQLRequest'] },
                        onError: { target: 'error', actions: ['handleError'] }
                    }
                },
                backendToggleQuerying: {
                    invoke: {
                        src: 'proxyBackendToggleService',
                        onDone: { target: 'idle', actions: ['completeBackendToggleQuery'] },
                        onError: { target: 'error', actions: ['handleError'] }
                    }
                },
                error: {
                    on: {
                        RETRY: { target: 'idle' },
                        RESET: { target: 'idle' }
                    }
                }
            },
            actions: {
                handleInitialize: {
                    exec: async (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        const send = meta?.send || machine?.send?.bind(machine) || ((evt: any) => console.warn('send not available:', evt));
                        log('🌊 Background Proxy: Handling initialization');
                        
                        try {
                            // Send initialization message to background script
                            if (typeof chrome !== 'undefined' && chrome.runtime) {
                                const response: any = await new Promise((resolve, reject) => {
                                    chrome.runtime.sendMessage({
                                        type: 'INITIALIZE',
                                        from: 'popup',
                                        timestamp: Date.now()
                                    }, (response: any) => {
                                        if (chrome.runtime.lastError) {
                                            reject(chrome.runtime.lastError);
                                        } else {
                                            resolve(response);
                                        }
                                    });
                                });
                                
                                if (response && response.success) {
                                    context.sessionId = response.sessionId;
                                    send('INITIALIZATION_COMPLETE');
                                } else {
                                    throw new Error(response?.error || 'Initialization failed');
                                }
                            } else {
                                throw new Error('Chrome runtime not available');
                            }
                        } catch (error: any) {
                            log('🌊 Background Proxy: Initialization error', error);
                            send('ERROR', { error: error.message });
                        }
                    }
                },
                handleStart: {
                    exec: async (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        const send = meta?.send || machine?.send?.bind(machine) || ((evt: any) => console.warn('send not available:', evt));
                        log('🌊 Background Proxy: Handling start');
                        
                        try {
                            if (typeof chrome !== 'undefined' && chrome.runtime) {
                                const response: any = await new Promise((resolve, reject) => {
                                    chrome.runtime.sendMessage({
                                        name: 'start',
                                        from: 'popup',
                                        timestamp: Date.now(),
                                        options: event.data?.options || {}
                                    }, (response: any) => {
                                        if (chrome.runtime.lastError) {
                                            reject(chrome.runtime.lastError);
                                        } else {
                                            resolve(response);
                                        }
                                    });
                                });
                                
                                if (response && response.success) {
                                    send('START_COMPLETE');
                                } else {
                                    throw new Error(response?.error || 'Start failed');
                                }
                            } else {
                                throw new Error('Chrome runtime not available');
                            }
                        } catch (error: any) {
                            log('🌊 Background Proxy: Start error', error);
                            send('ERROR', { error: error.message });
                        }
                    }
                },
                handleStop: {
                    exec: async (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        const send = meta?.send || machine?.send?.bind(machine) || ((evt: any) => console.warn('send not available:', evt));
                        log('🌊 Background Proxy: Handling stop');
                        
                        try {
                            if (typeof chrome !== 'undefined' && chrome.runtime) {
                                const response: any = await new Promise((resolve, reject) => {
                                    chrome.runtime.sendMessage({
                                        name: 'stop',
                                        from: 'popup',
                                        timestamp: Date.now()
                                    }, (response: any) => {
                                        if (chrome.runtime.lastError) {
                                            reject(chrome.runtime.lastError);
                                        } else {
                                            resolve(response);
                                        }
                                    });
                                });
                                
                                if (response && response.success) {
                                    send('STOP_COMPLETE');
                                } else {
                                    throw new Error(response?.error || 'Stop failed');
                                }
                            } else {
                                throw new Error('Chrome runtime not available');
                            }
                        } catch (error: any) {
                            log('🌊 Background Proxy: Stop error', error);
                            send('ERROR', { error: error.message });
                        }
                    }
                },
                handleToggle: {
                    exec: async (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        const send = meta?.send || machine?.send?.bind(machine) || ((evt: any) => console.warn('send not available:', evt));
                        log('🌊 Background Proxy: Handling toggle');
                        
                        try {
                            if (typeof chrome !== 'undefined' && chrome.runtime) {
                                const response: any = await new Promise((resolve, reject) => {
                                    chrome.runtime.sendMessage({
                                        type: 'TOGGLE',
                                        from: 'popup',
                                        timestamp: Date.now(),
                                        data: { going: event.going }
                                    }, (response: any) => {
                                        if (chrome.runtime.lastError) {
                                            reject(chrome.runtime.lastError);
                                        } else {
                                            resolve(response);
                                        }
                                    });
                                });
                                
                                if (response && response.success) {
                                    send('TOGGLE_COMPLETE');
                                } else {
                                    throw new Error(response?.error || 'Toggle failed');
                                }
                            } else {
                                throw new Error('Chrome runtime not available');
                            }
                        } catch (error: any) {
                            log('🌊 Background Proxy: Toggle error', error);
                            send('ERROR', { error: error.message });
                        }
                    }
                },
                handleGetStatus: {
                    exec: async (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        log('🌊 Background Proxy: Getting status');
                        
                        try {
                            if (typeof chrome !== 'undefined' && chrome.runtime) {
                                const response: any = await new Promise((resolve, reject) => {
                                    chrome.runtime.sendMessage({
                                        type: 'GET_STATUS',
                                        from: 'popup',
                                        timestamp: Date.now()
                                    }, (response: any) => {
                                        if (chrome.runtime.lastError) {
                                            reject(chrome.runtime.lastError);
                                        } else {
                                            resolve(response);
                                        }
                                    });
                                });
                                
                                // Response is already available to caller through promise
                                log('🌊 Background Proxy: Status received', response);
                            }
                        } catch (error: any) {
                            log('🌊 Background Proxy: Get status error', error);
                        }
                    }
                },
                handleHealthCheck: {
                    exec: async (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        log('🌊 Background Proxy: Health check');
                        
                        try {
                            if (typeof chrome !== 'undefined' && chrome.runtime) {
                                const response: any = await new Promise((resolve, reject) => {
                                    chrome.runtime.sendMessage({
                                        type: 'HEALTH_CHECK',
                                        from: 'popup',
                                        timestamp: Date.now()
                                    }, (response: any) => {
                                        if (chrome.runtime.lastError) {
                                            reject(chrome.runtime.lastError);
                                        } else {
                                            resolve(response);
                                        }
                                    });
                                });
                                
                                if (response) {
                                    context.activeConnections = response.activeConnections || 0;
                                    context.sessionId = response.sessionId;
                                }
                            }
                        } catch (error: any) {
                            log('🌊 Background Proxy: Health check error', error);
                        }
                    }
                },
                completeBackendRequest: {
                    exec: (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        log('🌊 Background Proxy: Backend request complete', event?.data);
                        context.lastBackendResponse = event?.data || null;
                    }
                },
                completeGraphQLRequest: {
                    exec: (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        log('🌊 Background Proxy: GraphQL request complete', event?.data);
                        context.lastGraphQLResponse = event?.data || null;
                    }
                },
                completeBackendToggleQuery: {
                    exec: (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        log('🌊 Background Proxy: Backend toggle query result', event?.data);
                        if (event?.data && typeof event.data.enabled === 'boolean') {
                            context.backendRequestsEnabled = event.data.enabled;
                        }
                    }
                },
                setBackendToggleState: {
                    exec: (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        const enabled = Boolean(event?.enabled);
                        context.backendRequestsEnabled = enabled;
                        log('🌊 Background Proxy: Backend requests state updated', { enabled });
                    }
                },
                handlePing: {
                    exec: async (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        log('🌊 Background Proxy: Ping');
                        
                        try {
                            if (typeof chrome !== 'undefined' && chrome.runtime) {
                                const response: any = await new Promise((resolve, reject) => {
                                    chrome.runtime.sendMessage({
                                        type: 'PING',
                                        from: 'popup',
                                        timestamp: Date.now(),
                                        data: event.data || {}
                                    }, (response: any) => {
                                        if (chrome.runtime.lastError) {
                                            reject(chrome.runtime.lastError);
                                        } else {
                                            resolve(response);
                                        }
                                    });
                                });
                                
                                // Response is already available to caller through promise
                                log('🌊 Background Proxy: Pong received', response);
                            }
                        } catch (error: any) {
                            log('🌊 Background Proxy: Ping error', error);
                        }
                    }
                },
                completeInitialization: {
                    exec: (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        log('🌊 Background Proxy: Initialization completed');
                    }
                },
                completeStart: {
                    exec: (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        log('🌊 Background Proxy: Start completed');
                    }
                },
                completeStop: {
                    exec: (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        log('🌊 Background Proxy: Stop completed');
                    }
                },
                completeToggle: {
                    exec: (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        log('🌊 Background Proxy: Toggle completed');
                    }
                },
                handleError: {
                    exec: (context: any, event: any, meta: any) => {
                        const machine = meta?.state?.machine;
                        const log = getActionLog(meta, 'background-proxy-machine');
                        log('🌊 Background Proxy: Error occurred', event);
                        context.message = event.error || 'Unknown error';
                    }
                }
            },
            services: {
                proxyBackendRequestService: async (_context: any, event: any) => {
                    const request = event?.request || event?.data || {};
                    const endpoint = request.endpoint;

                    if (!endpoint) {
                        throw new Error('Missing backend endpoint');
                    }

                    const result = await performBackendRequest({
                        endpoint,
                        options: request.options || {},
                        mockKey: request.mockKey || 'default',
                        payload: request.payload,
                        context: request.context || {}
                    });

                    return { success: true, data: result.data, backendDisabled: result.backendDisabled };
                },
                proxyGraphQLRequestService: async (_context: any, event: any) => {
                    const request = event?.request || event?.data || {};
                    const endpoint = request.endpoint;
                    const query = request.query;

                    if (!endpoint || !query) {
                        throw new Error('Missing GraphQL endpoint or query');
                    }

                    const result = await safeGraphQLRequest({
                        endpoint,
                        query,
                        variables: request.variables || {},
                        requestInit: request.options || {},
                        mockKey: request.mockKey || 'graphql',
                        context: request.context || {}
                    });

                    return { success: true, data: result.data, errors: result.errors, backendDisabled: result.backendDisabled };
                },
                proxyBackendToggleService: async () => {
                    try {
                        const enabled = await backendToggleService.canMakeBackendRequests();
                        return { success: true, enabled };
                    } catch (error) {
                        console.warn('🌊 Background Proxy: Failed to evaluate backend toggle state on demand', error);
                        return { success: true, enabled: getDefaultBackendRequestState(), backendDisabled: true };
                    }
                }
            }
        },
        robotCopy: robotCopyInstance
    });

    backendToggleService.canMakeBackendRequests().then((enabled) => {
        try {
            machine.send?.({ type: 'SET_BACKEND_TOGGLE', enabled });

            if (typeof chrome !== 'undefined' && chrome.runtime) {
                chrome.runtime.sendMessage({
                    name: 'set-backend-toggle',
                    from: 'popup',
                    timestamp: Date.now(),
                    enabled
                });
            }
        } catch (error) {
            console.warn('🌊 Background Proxy: Unable to notify backend toggle state', error);
        }
    }).catch((error) => {
        console.warn('🌊 Background Proxy: Failed to evaluate backend toggle state', error);
    });

    return machine;
};

