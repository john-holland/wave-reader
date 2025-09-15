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
    return {
        ...config,
        withState: (stateName, handler) => {
            console.log('🌊 Mock createViewStateMachine: Adding state handler', stateName);
            return {
                ...config,
                withState: createViewStateMachine(config).withState
            };
        },
        send: (event) => {
            console.log('🌊 Mock createViewStateMachine: Sending event', event);
            return { success: true };
        },
        getState: () => ({ value: 'idle' }),
        getContext: () => ({}),
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
                callback({ type: 'stateChanged', data: { value: 'idle' } });
            }
            return {
                unsubscribe: () => {
                    console.log('🌊 Mock createViewStateMachine: Unsubscribing');
                }
            };
        }
    };
};

// Mock createProxyRobotCopyStateMachine
const createProxyRobotCopyStateMachine = (config) => {
    console.log('🌊 Mock createProxyRobotCopyStateMachine: Creating proxy state machine');
    return {
        ...config,
        withState: (stateName, handler) => {
            console.log('🌊 Mock createProxyRobotCopyStateMachine: Adding state handler', stateName);
            return {
                ...config,
                withState: createProxyRobotCopyStateMachine(config).withState
            };
        },
        send: (event) => {
            console.log('🌊 Mock createProxyRobotCopyStateMachine: Sending event', event);
            return { success: true };
        },
        getState: () => ({ value: 'idle' }),
        getContext: () => ({}),
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
                callback({ type: 'stateChanged', data: { value: 'idle' } });
            }
            return {
                unsubscribe: () => {
                    console.log('🌊 Mock createProxyRobotCopyStateMachine: Unsubscribing');
                }
            };
        }
    };
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
