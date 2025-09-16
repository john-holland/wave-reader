// Mock for log-view-machine to avoid CSP eval issues
// This provides all the necessary exports without using eval() or new Function()

// Mock regeneratorRuntime to avoid "regeneratorRuntime is not defined" errors
if (typeof globalThis !== 'undefined') {
    globalThis.regeneratorRuntime = {
        wrap: function(innerFn, outerFn, self, tryLocsList) {
            return function() {
                return innerFn.apply(self, arguments);
            };
        },
        mark: function(genFun) {
            return genFun;
        },
        awrap: function(arg) {
            return { __await: arg };
        },
        async: function(innerFn, outerFn, self, tryLocsList) {
            return function() {
                return Promise.resolve(innerFn.apply(self, arguments));
            };
        }
    };
}

// Mock TomeConfig interface
const createTomeConfig = (config) => {
    return {
        ...config,
        start: async () => {
            console.log('🌊 Mock TomeConfig: Starting', config.id);
            return { success: true };
        },
        stop: async () => {
            console.log('🌊 Mock TomeConfig: Stopping', config.id);
            return { success: true };
        },
        getMachine: (machineId) => {
            console.log('🌊 Mock TomeConfig: Getting machine', machineId);
            return config.machines?.[machineId] || null;
        },
        subscribe: (callback) => {
            console.log('🌊 Mock TomeConfig: Subscribing to', config.id);
            // Mock subscription - just call the callback immediately
            if (typeof callback === 'function') {
                callback({ type: 'initialized', data: config });
            }
            return {
                unsubscribe: () => {
                    console.log('🌊 Mock TomeConfig: Unsubscribing from', config.id);
                }
            };
        }
    };
};

// Mock TomeManager
const TomeManager = {
    getInstance: () => ({
        registerTome: (tome) => {
            console.log('🌊 Mock TomeManager: Registering tome', tome.id);
            return { success: true };
        },
        startTome: (tomeId) => {
            console.log('🌊 Mock TomeManager: Starting tome', tomeId);
            return { success: true };
        },
        stopTome: (tomeId) => {
            console.log('🌊 Mock TomeManager: Stopping tome', tomeId);
            return { success: true };
        },
        getTome: (tomeId) => {
            console.log('🌊 Mock TomeManager: Getting tome', tomeId);
            return null;
        }
    })
};

// Mock createViewStateMachine
const createViewStateMachine = (config) => {
    console.log('🌊 Mock createViewStateMachine: Creating view state machine');
    
    let currentState = 'idle';
    let context = { viewModel: { going: false, saved: false, selector: null } };
    const stateHandlers = new Map();
    const eventListeners = [];
    
    const mockMachine = {
        ...config,
        withState: (stateName, handler) => {
            console.log('🌊 Mock createViewStateMachine: Adding state handler', stateName);
            stateHandlers.set(stateName, handler);
            return mockMachine;
        },
        send: (event) => {
            console.log('🌊 Mock createViewStateMachine: Sending event', event);
            
            // Handle different events
            const eventType = typeof event === 'string' ? event : event.type || event;
            
            switch (eventType) {
                case 'TOGGLE':
                    context.viewModel.going = !context.viewModel.going;
                    context.viewModel.saved = false;
                    currentState = context.viewModel.going ? 'waving' : 'idle';
                    console.log('🌊 Mock createViewStateMachine: Toggled to', currentState);
                    break;
                case 'START':
                    context.viewModel.going = true;
                    context.viewModel.saved = false;
                    currentState = 'waving';
                    console.log('🌊 Mock createViewStateMachine: Started wave');
                    break;
                case 'STOP':
                    context.viewModel.going = false;
                    context.viewModel.saved = true;
                    currentState = 'idle';
                    console.log('🌊 Mock createViewStateMachine: Stopped wave');
                    break;
                case 'SETTINGS_UPDATE':
                    currentState = 'settingsUpdating';
                    console.log('🌊 Mock createViewStateMachine: Opening settings');
                    break;
                case 'INITIALIZE':
                    currentState = 'initializing';
                    console.log('🌊 Mock createViewStateMachine: Initializing');
                    break;
            }
            
            // Trigger state handler if it exists
            const handler = stateHandlers.get(currentState);
            if (handler && typeof handler === 'function') {
                try {
                    // Simulate the handler call with proper parameters
                    const mockSend = (event) => mockMachine.send(event);
                    const mockTransition = (state) => {
                        console.log('🌊 Mock createViewStateMachine: Transitioning to', state);
                        currentState = state;
                    };
                    const mockLog = (message, data) => {
                        console.log('🌊 Mock createViewStateMachine:', message, data);
                    };
                    
                    handler({
                        context,
                        event,
                        view: currentState,
                        transition: mockTransition,
                        send: mockSend,
                        log: mockLog
                    });
                } catch (error) {
                    console.error('🌊 Mock createViewStateMachine: Handler error', error);
                }
            }
            
            // Notify listeners
            eventListeners.forEach(listener => {
                try {
                    listener({ type: 'stateChanged', data: { value: currentState, context } });
                } catch (error) {
                    console.error('🌊 Mock createViewStateMachine: Listener error', error);
                }
            });
            
            return { success: true };
        },
        getState: () => ({ value: currentState }),
        getContext: () => context,
        start: async function* () {
            console.log('🌊 Mock createViewStateMachine: Starting');
            yield { success: true };
            return { success: true };
        },
        stop: async () => {
            console.log('🌊 Mock createViewStateMachine: Stopping');
            return { success: true };
        },
        subscribe: (callback) => {
            console.log('🌊 Mock createViewStateMachine: Subscribing');
            if (typeof callback === 'function') {
                eventListeners.push(callback);
                callback({ type: 'stateChanged', data: { value: currentState, context } });
            }
            return {
                unsubscribe: () => {
                    console.log('🌊 Mock createViewStateMachine: Unsubscribing');
                    const index = eventListeners.indexOf(callback);
                    if (index > -1) {
                        eventListeners.splice(index, 1);
                    }
                }
            };
        }
    };
    
    return mockMachine;
};

// Mock createProxyRobotCopyStateMachine
const createProxyRobotCopyStateMachine = (config) => {
    console.log('🌊 Mock createProxyRobotCopyStateMachine: Creating proxy state machine');
    
    let currentState = 'idle';
    let context = { proxyData: { connected: true, messages: [] } };
    const stateHandlers = new Map();
    const eventListeners = [];
    
    const mockMachine = {
        ...config,
        withState: (stateName, handler) => {
            console.log('🌊 Mock createProxyRobotCopyStateMachine: Adding state handler', stateName);
            stateHandlers.set(stateName, handler);
            return mockMachine;
        },
        send: (event) => {
            console.log('🌊 Mock createProxyRobotCopyStateMachine: Sending event', event);
            
            // Handle different events
            const eventType = typeof event === 'string' ? event : event.type || event;
            
            switch (eventType) {
                case 'TOGGLE':
                    currentState = currentState === 'idle' ? 'active' : 'idle';
                    console.log('🌊 Mock createProxyRobotCopyStateMachine: Toggled to', currentState);
                    break;
                case 'START':
                    currentState = 'active';
                    console.log('🌊 Mock createProxyRobotCopyStateMachine: Started proxy');
                    break;
                case 'STOP':
                    currentState = 'idle';
                    console.log('🌊 Mock createProxyRobotCopyStateMachine: Stopped proxy');
                    break;
                case 'CONNECT':
                    currentState = 'connected';
                    context.proxyData.connected = true;
                    console.log('🌊 Mock createProxyRobotCopyStateMachine: Connected');
                    break;
                case 'DISCONNECT':
                    currentState = 'disconnected';
                    context.proxyData.connected = false;
                    console.log('🌊 Mock createProxyRobotCopyStateMachine: Disconnected');
                    break;
            }
            
            // Trigger state handler if it exists
            const handler = stateHandlers.get(currentState);
            if (handler && typeof handler === 'function') {
                try {
                    // Simulate the handler call with proper parameters
                    const mockSend = (event) => mockMachine.send(event);
                    const mockTransition = (state) => {
                        console.log('🌊 Mock createProxyRobotCopyStateMachine: Transitioning to', state);
                        currentState = state;
                    };
                    const mockLog = (message, data) => {
                        console.log('🌊 Mock createProxyRobotCopyStateMachine:', message, data);
                    };
                    
                    handler({
                        context,
                        event,
                        view: currentState,
                        transition: mockTransition,
                        send: mockSend,
                        log: mockLog
                    });
                } catch (error) {
                    console.error('🌊 Mock createProxyRobotCopyStateMachine: Handler error', error);
                }
            }
            
            // Notify listeners
            eventListeners.forEach(listener => {
                try {
                    listener({ type: 'stateChanged', data: { value: currentState, context } });
                } catch (error) {
                    console.error('🌊 Mock createProxyRobotCopyStateMachine: Listener error', error);
                }
            });
            
            return { success: true };
        },
        getState: () => ({ value: currentState }),
        getContext: () => context,
        start: async function* () {
            console.log('🌊 Mock createProxyRobotCopyStateMachine: Starting');
            yield { success: true };
            return { success: true };
        },
        stop: async () => {
            console.log('🌊 Mock createProxyRobotCopyStateMachine: Stopping');
            return { success: true };
        },
        subscribe: (callback) => {
            console.log('🌊 Mock createProxyRobotCopyStateMachine: Subscribing');
            if (typeof callback === 'function') {
                eventListeners.push(callback);
                callback({ type: 'stateChanged', data: { value: currentState, context } });
            }
            return {
                unsubscribe: () => {
                    console.log('🌊 Mock createProxyRobotCopyStateMachine: Unsubscribing');
                    const index = eventListeners.indexOf(callback);
                    if (index > -1) {
                        eventListeners.splice(index, 1);
                    }
                }
            };
        }
    };
    
    return mockMachine;
};

// Mock withState function
const withState = (stateName, handler) => {
    console.log('🌊 Mock withState: Adding state handler', stateName);
    return (config) => ({
        ...config,
        withState: withState
    });
};

// Export all the necessary functions and classes
module.exports = {
    createTomeConfig,
    TomeManager,
    createViewStateMachine,
    createProxyRobotCopyStateMachine,
    withState,
    // Add any other exports that might be needed
    default: {
        createTomeConfig,
        TomeManager,
        createViewStateMachine,
        createProxyRobotCopyStateMachine,
        withState
    }
};

// Also export as ES modules for compatibility
module.exports.createTomeConfig = createTomeConfig;
module.exports.TomeManager = TomeManager;
module.exports.createViewStateMachine = createViewStateMachine;
module.exports.createProxyRobotCopyStateMachine = createProxyRobotCopyStateMachine;
module.exports.withState = withState;
