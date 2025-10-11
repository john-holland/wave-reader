import { createProxyRobotCopyStateMachine, createRobotCopy } from 'log-view-machine';

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
    return createProxyRobotCopyStateMachine({
        machineId: 'background-proxy-machine',
        predictableActionArguments: false,
        xstateConfig: {
            initial: 'idle',
            context: {
                message: null,
                sessionId: null,
                activeConnections: 0
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
                        PING: { target: 'idle', actions: ['handlePing'] }
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
                error: {
                    on: {
                        RETRY: { target: 'idle' },
                        RESET: { target: 'idle' }
                    }
                }
            },
            actions: {
                handleInitialize: {
                    type: 'function',
                    fn: async ({context, event, send, log}: any) => {
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
                    type: 'function',
                    fn: async ({context, event, send, log}: any) => {
                        log('🌊 Background Proxy: Handling start');
                        
                        try {
                            if (typeof chrome !== 'undefined' && chrome.runtime) {
                                const response: any = await new Promise((resolve, reject) => {
                                    chrome.runtime.sendMessage({
                                        type: 'START',
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
                    type: 'function',
                    fn: async ({context, event, send, log}: any) => {
                        log('🌊 Background Proxy: Handling stop');
                        
                        try {
                            if (typeof chrome !== 'undefined' && chrome.runtime) {
                                const response: any = await new Promise((resolve, reject) => {
                                    chrome.runtime.sendMessage({
                                        type: 'STOP',
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
                    type: 'function',
                    fn: async ({context, event, send, log}: any) => {
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
                    type: 'function',
                    fn: async ({context, event, send, log}: any) => {
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
                    type: 'function',
                    fn: async ({context, event, send, log}: any) => {
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
                handlePing: {
                    type: 'function',
                    fn: async ({context, event, send, log}: any) => {
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
                    type: 'function',
                    fn: ({log}: any) => {
                        log('🌊 Background Proxy: Initialization completed');
                    }
                },
                completeStart: {
                    type: 'function',
                    fn: ({log}: any) => {
                        log('🌊 Background Proxy: Start completed');
                    }
                },
                completeStop: {
                    type: 'function',
                    fn: ({log}: any) => {
                        log('🌊 Background Proxy: Stop completed');
                    }
                },
                completeToggle: {
                    type: 'function',
                    fn: ({log}: any) => {
                        log('🌊 Background Proxy: Toggle completed');
                    }
                },
                handleError: {
                    type: 'function',
                    fn: ({context, event, log}: any) => {
                        log('🌊 Background Proxy: Error occurred', event);
                        context.message = event.error || 'Unknown error';
                    }
                }
            }
        },
        robotCopy: createRobotCopy({
            enableTracing: false,
            enableDataDog: false,
            kotlinBackendUrl: typeof chrome !== 'undefined' && chrome.runtime?.id 
                ? `chrome-extension://${chrome.runtime.id}` 
                : 'chrome-extension://wave-reader',
            nodeBackendUrl: typeof chrome !== 'undefined' && chrome.runtime?.id 
                ? `chrome-extension://${chrome.runtime.id}` 
                : 'chrome-extension://wave-reader'
        })
    });
};

