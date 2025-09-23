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

// Lazy TomeManager - only instantiated when needed
class LazyTomeManager {
    constructor(tome) {
        this.tome = tome;
        this.isInitialized = false;
        this.subTomes = new Map();
        this.eventListeners = new Map();
        this.renderKey = 0;
    }
    
    // Lazy initialization
    _ensureInitialized() {
        if (!this.isInitialized) {
            console.log('🌊 LazyTomeManager: Initializing for tome', this.tome.id);
            this.isInitialized = true;
            this.tome.isStarted = false;
            this.tome.isRegistered = false;
        }
    }
    
    // TomeManager methods
    registerTome(tome) {
        this._ensureInitialized();
        console.log('🌊 LazyTomeManager: Registering tome', tome.id);
        this.subTomes.set(tome.id, tome);
        return { success: true };
    }
    
    startTome(tomeId) {
        this._ensureInitialized();
        console.log('🌊 LazyTomeManager: Starting tome', tomeId);
        
        if (tomeId === this.tome.id) {
            this.tome.isStarted = true;
            // Start all sub-machines
            Object.values(this.tome.machines || {}).forEach(machine => {
                if (machine.start) {
                    machine.start();
                }
            });
        } else {
            const subTome = this.subTomes.get(tomeId);
            if (subTome && subTome.start) {
                subTome.start();
            }
        }
        
        this.emit('tomeStarted', { tomeId });
        return { success: true };
    }
    
    stopTome(tomeId) {
        this._ensureInitialized();
        console.log('🌊 LazyTomeManager: Stopping tome', tomeId);
        
        if (tomeId === this.tome.id) {
            this.tome.isStarted = false;
            // Stop all sub-machines
            Object.values(this.tome.machines || {}).forEach(machine => {
                if (machine.stop) {
                    machine.stop();
                }
            });
        } else {
            const subTome = this.subTomes.get(tomeId);
            if (subTome && subTome.stop) {
                subTome.stop();
            }
        }
        
        this.emit('tomeStopped', { tomeId });
        return { success: true };
    }
    
    getTome(tomeId) {
        this._ensureInitialized();
        console.log('🌊 LazyTomeManager: Getting tome', tomeId);
        
        if (tomeId === this.tome.id) {
            return this.tome;
        }
        return this.subTomes.get(tomeId) || null;
    }
    
    // Event system
    on(event, handler) {
        this._ensureInitialized();
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(handler);
        return this;
    }
    
    off(event, handler) {
        this._ensureInitialized();
        const handlers = this.eventListeners.get(event);
        if (handlers) {
            handlers.delete(handler);
        }
        return this;
    }
    
    emit(event, data) {
        this._ensureInitialized();
        const handlers = this.eventListeners.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`🌊 LazyTomeManager: Error in event handler for ${event}:`, error);
                }
            });
        }
        return this;
    }
    
    // Force re-render
    forceRender() {
        this._ensureInitialized();
        this.renderKey++;
        this.emit('render', { tomeId: this.tome.id, renderKey: this.renderKey });
        return this;
    }
}

// Enhanced createTomeConfig with lazy TomeManager
const createTomeConfig = (config) => {
    console.log('🌊 Mock createTomeConfig: Creating tome with lazy TomeManager', config.id);
    
    let lazyTomeManager = null;
    
    return {
        ...config,
        
        // Lazy TomeManager getter
        get tomeManager() {
            if (!lazyTomeManager) {
                lazyTomeManager = new LazyTomeManager(this);
            }
            return lazyTomeManager;
        },
        
        // TomeManager methods that delegate to lazy manager
        start() {
            return this.tomeManager.startTome(this.id);
        },
        
        stop() {
            return this.tomeManager.stopTome(this.id);
        },
        
        registerTome(tome) {
            return this.tomeManager.registerTome(tome);
        },
        
        startTome(tomeId) {
            return this.tomeManager.startTome(tomeId);
        },
        
        stopTome(tomeId) {
            return this.tomeManager.stopTome(tomeId);
        },
        
        getTome(tomeId) {
            return this.tomeManager.getTome(tomeId);
        },
        
        // Event system
        on(event, handler) {
            return this.tomeManager.on(event, handler);
        },
        
        off(event, handler) {
            return this.tomeManager.off(event, handler);
        },
        
        emit(event, data) {
            return this.tomeManager.emit(event, data);
        },
        
        // Force re-render
        forceRender() {
            return this.tomeManager.forceRender();
        },
        
        // Sub-machine management
        getSubMachine(machineId) {
            console.log('🌊 Tome: Getting sub-machine', machineId);
            return this.machines?.[machineId] || null;
        },
        
        // Subscription system
        subscribe(callback) {
            console.log('🌊 Tome: Subscribing to tome', this.id);
            if (typeof callback === 'function') {
                callback({ type: 'tomeStarted', data: this });
            }
            return {
                unsubscribe: () => {
                    console.log('🌊 Tome: Unsubscribing from tome', this.id);
                }
            };
        },
        
        // State management
        getState() {
            const states = {};
            Object.entries(this.machines || {}).forEach(([id, machine]) => {
                if (machine.getState) {
                    states[id] = machine.getState();
                }
            });
            return {
                tomeId: this.id,
                isStarted: this.isStarted || false,
                isRegistered: this.isRegistered || false,
                machines: states
            };
        },
        
        getContext() {
            const contexts = {};
            Object.entries(this.machines || {}).forEach(([id, machine]) => {
                if (machine.getContext) {
                    contexts[id] = machine.getContext();
                }
            });
            return {
                tomeId: this.id,
                machines: contexts
            };
        },
        
        // Health monitoring
        getHealth() {
            const machineHealth = {};
            Object.entries(this.machines || {}).forEach(([id, machine]) => {
                if (machine.getHealth) {
                    machineHealth[id] = machine.getHealth();
                }
            });
            
            const overallStatus = Object.values(machineHealth).every(health => 
                health && health.status === 'healthy'
            ) ? 'healthy' : 'degraded';
            
            return {
                status: overallStatus,
                tomeId: this.id,
                isStarted: this.isStarted || false,
                machines: machineHealth
            };
        },
        
        // Routing
        route(path, method, data) {
            console.log('🌊 Tome: Routing request', { path, method, tomeId: this.id });
            
            if (!this.routing || !this.routing.routes) {
                return { success: false, error: 'No routing configured' };
            }
            
            // Find matching route
            const route = Object.values(this.routing.routes).find(r => 
                r.path === path && r.method === method
            );
            
            if (!route) {
                return { success: false, error: 'Route not found' };
            }
            
            // Execute route transformer
            if (route.transformers && route.transformers.input) {
                try {
                    return route.transformers.input({
                        context: this.getContext(),
                        event: data,
                        send: (event) => this.emit('route', event),
                        log: (message, data) => console.log('🌊 Tome Route:', message, data),
                        transition: (state) => console.log('🌊 Tome: Transitioning to', state),
                        machine: this
                    });
                } catch (error) {
                    console.error('🌊 Tome: Route execution error', error);
                    return { success: false, error: error.message };
                }
            }
            
            return { success: true };
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
    let context = { viewModel: { going: false, saved: true, selector: null, showNotifications: true, currentView: 'main' } };
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
                    // going is domain-specific, doesn't require save notification
                    currentState = context.viewModel.going ? 'waving' : 'idle';
                    console.log('🌊 Mock createViewStateMachine: Toggled to', currentState, '(domain-specific state)');
                    break;
                case 'START':
                    context.viewModel.going = true;
                    // going is domain-specific, doesn't require save notification
                    currentState = 'waving';
                    console.log('🌊 Mock createViewStateMachine: Started wave (domain-specific state)');
                    break;
                case 'STOP':
                    context.viewModel.going = false;
                    // going is domain-specific, doesn't require save notification
                    currentState = 'idle';
                    console.log('🌊 Mock createViewStateMachine: Stopped wave (domain-specific state)');
                    break;
                case 'SETTINGS_UPDATE':
                    currentState = 'settingsUpdating';
                    console.log('🌊 Mock createViewStateMachine: Opening settings');
                    break;
                case 'SETTINGS_CHANGE':
                    // Handle settings changes
                    if (typeof event === 'object' && event.key && event.value !== undefined) {
                        context.viewModel[event.key] = event.value;
                        
                        // Domain-specific settings that don't require "saved" notifications
                        const domainSpecificSettings = ['going'];
                        
                        // Only mark as unsaved if it's not a domain-specific setting
                        if (!domainSpecificSettings.includes(event.key)) {
                            context.viewModel.saved = false;
                        }
                        
                        console.log('🌊 Mock createViewStateMachine: Settings changed', event.key, 'to', event.value, 
                                   domainSpecificSettings.includes(event.key) ? '(domain-specific, no save required)' : '(requires save)');
                    }
                    break;
                case 'SETTINGS_UPDATE_COMPLETE':
                    context.viewModel.saved = true;
                    currentState = 'idle';
                    console.log('🌊 Mock createViewStateMachine: Settings update completed');
                    break;
                case 'SETTINGS_UPDATE_CANCELLED':
                    context.viewModel.saved = true;
                    currentState = 'idle';
                    console.log('🌊 Mock createViewStateMachine: Settings update cancelled');
                    break;
                case 'REFRESH_STATE':
                    currentState = 'selectorUpdating';
                    console.log('🌊 Mock createViewStateMachine: Refreshing state');
                    // Simulate refresh delay
                    setTimeout(() => {
                        currentState = 'idle';
                        context.viewModel.selector = 'p';
                        console.log('🌊 Mock createViewStateMachine: State refreshed');
                    }, 1000);
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
                    
                    // Create a mock view function that accepts JSX
                    const mockView = (jsx) => {
                        console.log('🌊 Mock createViewStateMachine: Rendering view for state', currentState);
                        // In a real implementation, this would render the JSX
                        // For now, we just log it
                        if (jsx && typeof jsx === 'object') {
                            console.log('🌊 Mock createViewStateMachine: View content:', jsx);
                        }
                    };
                    
                    handler({
                        context,
                        event,
                        view: mockView,
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
                    
                    // Create a mock view function that accepts JSX
                    const mockView = (jsx) => {
                        console.log('🌊 Mock createProxyRobotCopyStateMachine: Rendering view for state', currentState);
                        // In a real implementation, this would render the JSX
                        // For now, we just log it
                        if (jsx && typeof jsx === 'object') {
                            console.log('🌊 Mock createProxyRobotCopyStateMachine: View content:', jsx);
                        }
                    };
                    
                    handler({
                        context,
                        event,
                        view: mockView,
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

// Mock ISubMachine interface implementation
class ProxyMachineAdapter {
    constructor(machine) {
        this.machine = machine;
        this.startTime = Date.now();
        this.errorCount = 0;
        this.eventHandlers = new Map();
    }

    get machineId() { return this.machine.machineId || 'proxy-machine'; }
    get machineType() { return 'proxy'; }

    getState() { return this.machine.getState?.() || { value: 'idle' }; }
    getContext() { return this.machine.getContext?.() || {}; }
    isInState(stateName) { return this.getState().value === stateName; }
    send(event) { this.machine.send?.(event); }
    canHandle(event) { return true; }

    async start() { return this.machine.start?.() || Promise.resolve(); }
    async stop() { return this.machine.stop?.() || Promise.resolve(); }
    async pause() { return Promise.resolve(); }
    async resume() { return Promise.resolve(); }

    async routeMessage(message) { return { success: true, data: message }; }
    async sendToParent(message) { return { success: true, data: message }; }
    async sendToChild(machineId, message) { return { success: true, data: message }; }
    async broadcast(message) { return { success: true, data: message }; }

    getConfig() { return this.machine.getConfig?.() || {}; }
    updateConfig(config) { this.machine.updateConfig?.(config); }

    getHealth() {
        return {
            status: 'healthy',
            lastHeartbeat: Date.now(),
            errorCount: this.errorCount,
            uptime: Date.now() - this.startTime
        };
    }

    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event).add(handler);
    }

    off(event, handler) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.delete(handler);
        }
    }

    emit(event, data) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }

    subscribe(callback) {
        console.log('🌊 Mock ProxyMachineAdapter: Subscribing to state changes');
        if (typeof callback === 'function') {
            callback({ type: 'state_change', data: this.getState() });
        }
        return {
            unsubscribe: () => {
                console.log('🌊 Mock ProxyMachineAdapter: Unsubscribing from state changes');
            }
        };
    }
}

class ViewMachineAdapter {
    constructor(machine) {
        this.machine = machine;
        this.startTime = Date.now();
        this.errorCount = 0;
        this.eventHandlers = new Map();
    }

    get machineId() { return this.machine.machineId || 'view-machine'; }
    get machineType() { return 'view'; }

    getState() { return this.machine.getState?.() || { value: 'idle' }; }
    getContext() { return this.machine.getContext?.() || {}; }
    isInState(stateName) { return this.getState().value === stateName; }
    send(event) { this.machine.send?.(event); }
    canHandle(event) { return true; }

    async start() { return this.machine.start?.() || Promise.resolve(); }
    async stop() { return this.machine.stop?.() || Promise.resolve(); }
    async pause() { return Promise.resolve(); }
    async resume() { return Promise.resolve(); }

    async routeMessage(message) { return { success: true, data: message }; }
    async sendToParent(message) { return { success: true, data: message }; }
    async sendToChild(machineId, message) { return { success: true, data: message }; }
    async broadcast(message) { return { success: true, data: message }; }

    render() { return this.machine.render?.() || null; }

    getConfig() { return this.machine.getConfig?.() || {}; }
    updateConfig(config) { this.machine.updateConfig?.(config); }

    getHealth() {
        return {
            status: 'healthy',
            lastHeartbeat: Date.now(),
            errorCount: this.errorCount,
            uptime: Date.now() - this.startTime
        };
    }

    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event).add(handler);
    }

    off(event, handler) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.delete(handler);
        }
    }

    emit(event, data) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }

    subscribe(callback) {
        console.log('🌊 Mock ViewMachineAdapter: Subscribing to state changes');
        if (typeof callback === 'function') {
            callback({ type: 'state_change', data: this.getState() });
        }
        return {
            unsubscribe: () => {
                console.log('🌊 Mock ViewMachineAdapter: Unsubscribing from state changes');
            }
        };
    }
}

// Export all the necessary functions and classes
module.exports = {
    createTomeConfig,
    TomeManager,
    LazyTomeManager,
    createViewStateMachine,
    createProxyRobotCopyStateMachine,
    withState,
    ProxyMachineAdapter,
    ViewMachineAdapter,
    // Add any other exports that might be needed
    default: {
        createTomeConfig,
        TomeManager,
        LazyTomeManager,
        createViewStateMachine,
        createProxyRobotCopyStateMachine,
        withState,
        ProxyMachineAdapter,
        ViewMachineAdapter
    }
};

// Also export as ES modules for compatibility
module.exports.createTomeConfig = createTomeConfig;
module.exports.TomeManager = TomeManager;
module.exports.LazyTomeManager = LazyTomeManager;
module.exports.createViewStateMachine = createViewStateMachine;
module.exports.createProxyRobotCopyStateMachine = createProxyRobotCopyStateMachine;
module.exports.withState = withState;
module.exports.ProxyMachineAdapter = ProxyMachineAdapter;
module.exports.ViewMachineAdapter = ViewMachineAdapter;
