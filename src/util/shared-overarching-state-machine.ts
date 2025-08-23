import { LogViewMessageUtility } from './log-view-messages';
import { MessageFactory } from '../models/messages/log-view-messages';
import { 
    BaseVentures, 
    StartVentures, 
    StopVentures, 
    WavingVentures,
    MLVentures,
    WaveReaderVentures,
    AnalyticsVentures,
    ExtensionVentures,
    AllVentures
} from './venture-states';

// Core View interface for rendering
export interface RenderableView {
    type: 'content' | 'shadow' | 'overlay' | 'notification';
    component: string;
    props: Record<string, any>;
    priority: number;
    timestamp: number;
}

// Robot proxy interface for background interchange
export interface RobotProxy {
    sendMessage(message: any): Promise<any>;
    receiveMessage(): Promise<any>;
    getStatus(): Promise<any>;
    healthCheck(): Promise<any>;
}

// XState-style Action Definition
export interface StateAction {
    type: string;
    payload?: any;
    meta?: any;
}

// Tome Configuration for the overarching system
export const createTomeConfig = (config = {}) => ({
    id: 'overarching-system-tome',
    name: 'Overarching System Tome',
    description: 'Manages content, shadow, and background systems with integrated telemetry and routing',
    version: '1.0.0',
    dependencies: ['log-view-machine'],
    
    // Tome configuration
    config: {
        machineId: 'overarching-system',
        xstateConfig: {
            id: 'overarching-system',
            initial: 'base',
            context: {
                contentSystem: {
                    isActive: false,
                    currentView: null,
                    waveAnimation: { isActive: false, options: null },
                    selectorUI: { isVisible: false, currentSelector: null }
                },
                shadowSystem: {
                    isActive: false,
                    currentView: null,
                    mouseTracking: { isActive: false, lastPosition: { x: 0, y: 0 }, lastUpdate: Date.now() },
                    shadowDOM: { isInitialized: false, containerId: null }
                },
                backgroundSystem: {
                    isActive: true,
                    activeTabs: new Map(),
                    mlService: { isInitialized: false, lastRecommendation: null }
                },
                sessionId: `overarching-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                messageQueue: [],
                viewQueue: [],
                stateHistory: []
            },
            states: {
                base: {
                    on: {
                        START: { target: 'content-active', actions: ['activateContent', 'activateShadow'] },
                        STOP: { target: 'base', actions: ['deactivateContent', 'deactivateShadow'] },
                        TOGGLE: { target: 'content-active', actions: ['toggleSystems'] },
                        'WAVE-READER-START': { target: 'content-active', actions: ['initializeComponents'] },
                        'WAVE-READER-STOP': { target: 'base', actions: ['cleanupComponents'] },
                        'ML-RECOMMENDATION': { target: 'base', actions: ['updateMLRecommendation'] },
                        'SETTINGS-RESET': { target: 'base', actions: ['resetSettings'] },
                        'SELECTION-MADE': { target: 'selection-mode', actions: ['showSelectorUI'] },
                        'START-SELECTION': { target: 'selection-mode', actions: ['enableSelectionMode'] },
                        'END-SELECTION': { target: 'base', actions: ['disableSelectionMode'] }
                    }
                },
                'content-active': {
                    on: {
                        STOP: { target: 'base', actions: ['deactivateContent'] },
                        TOGGLE: { target: 'base', actions: ['deactivateContent'] },
                        'WAVE-ANIMATION-START': { target: 'waving', actions: ['startWaveAnimation'] },
                        'WAVE-ANIMATION-STOP': { target: 'content-active', actions: ['stopWaveAnimation'] },
                        'SELECTION-MADE': { target: 'selection-mode', actions: ['showSelectorUI'] }
                    }
                },
                'shadow-active': {
                    on: {
                        STOP: { target: 'base', actions: ['deactivateShadow'] },
                        TOGGLE: { target: 'base', actions: ['deactivateShadow'] },
                        'MOUSE-TRACKING-START': { target: 'shadow-active', actions: ['enableMouseTracking'] },
                        'MOUSE-TRACKING-STOP': { target: 'shadow-active', actions: ['disableMouseTracking'] },
                        'START-SELECTION': { target: 'selection-mode', actions: ['enableSelectionMode'] }
                    }
                },
                waving: {
                    on: {
                        STOP: { target: 'base', actions: ['stopWaveAnimation', 'deactivateContent'] },
                        'SELECTION-MADE': { target: 'selection-mode', actions: ['showSelectorUI'] },
                        'END-SELECTION': { target: 'base', actions: ['disableSelectionMode'] }
                    }
                },
                'selection-mode': {
                    on: {
                        'SELECTION-MADE': { target: 'base', actions: ['showSelectorUI', 'disableSelectionMode'] },
                        'END-SELECTION': { target: 'base', actions: ['disableSelectionMode'] },
                        CANCEL: { target: 'base', actions: ['cancelSelection', 'disableSelectionMode'] }
                    }
                },
                error: {
                    on: {
                        RESET: { target: 'base', actions: ['resetToBase'] },
                        RETRY: { target: 'base', actions: ['retryOperation'] }
                    }
                }
            }
        }
    },

    // Create the tome instance
    create: (initialModel = {}) => {
        // Import createViewStateMachine dynamically to avoid circular dependencies
        let createViewStateMachine;
        try {
            // Try to import from log-view-machine first
            createViewStateMachine = require('log-view-machine').createViewStateMachine;
        } catch (error) {
            // Fallback to local implementation if log-view-machine is not available
            console.warn('log-view-machine not available, using local implementation');
            createViewStateMachine = createLocalViewStateMachine;
        }

        return createViewStateMachine({
            machineId: 'overarching-system',
            xstateConfig: {
                ...createTomeConfig().config.xstateConfig,
                context: {
                    ...createTomeConfig().config.xstateConfig.context,
                    ...initialModel
                }
            },
            logStates: {
                base: async (context: any) => {
                    await context.log('System in base state - ready for operations');
                    return context.view(renderBaseView(context));
                },
                
                'content-active': async (context: any) => {
                    await context.log('Content system active - wave reader ready');
                    return context.view(renderContentActiveView(context));
                },
                
                'shadow-active': async (context: any) => {
                    await context.log('Shadow system active - mouse tracking enabled');
                    return context.view(renderShadowActiveView(context));
                },
                
                waving: async (context: any) => {
                    await context.log('Wave animation active - reading in progress');
                    return context.view(renderWavingView(context));
                },
                
                'selection-mode': async (context: any) => {
                    await context.log('Selection mode active - choose elements');
                    return context.view(renderSelectionModeView(context));
                },
                
                error: async (context: any) => {
                    await context.log('Error state - system needs attention');
                    return context.view(renderErrorView(context));
                }
            }
        });
    }
});

// Local fallback implementation of createViewStateMachine
function createLocalViewStateMachine(config: any) {
    console.log('🌊 Using local ViewStateMachine implementation');
    
    // Return a simple machine-like object for local use
    return {
        machineId: config.machineId,
        xstateConfig: config.xstateConfig,
        logStates: config.logStates,
        context: config.xstateConfig.context,
        
        // Basic machine interface
        send: (event: any) => {
            console.log('🌊 Local machine received event:', event);
            return Promise.resolve();
        },
        
        on: (event: string, handler: Function) => {
            console.log('🌊 Local machine registered handler for:', event);
        },
        
        executeServerState: async (state: string, model: any) => {
            console.log('🌊 Local machine executing state:', state, 'with model:', model);
            return Promise.resolve();
        }
    };
}

// View rendering functions
function renderBaseView(context: any) {
    return {
        type: 'overlay',
        component: 'SystemStatus',
        props: {
            status: 'ready',
            message: 'System ready for operations',
            systems: {
                content: context.contentSystem.isActive,
                shadow: context.shadowSystem.isActive,
                background: context.backgroundSystem.isActive
            }
        },
        priority: 1,
        timestamp: Date.now()
    };
}

function renderContentActiveView(context: any) {
    return {
        type: 'content',
        component: 'WaveReader',
        props: {
            isActive: true,
            message: 'Wave reader active',
            waveAnimation: context.contentSystem.waveAnimation,
            selectorUI: context.contentSystem.selectorUI
        },
        priority: 2,
        timestamp: Date.now()
    };
}

function renderShadowActiveView(context: any) {
    return {
        type: 'shadow',
        component: 'MouseTracking',
        props: {
            isActive: true,
            message: 'Mouse tracking enabled',
            mouseTracking: context.shadowSystem.mouseTracking,
            shadowDOM: context.shadowSystem.shadowDOM
        },
        priority: 2,
        timestamp: Date.now()
    };
}

function renderWavingView(context: any) {
    return {
        type: 'content',
        component: 'WaveAnimation',
        props: {
            isActive: true,
            message: 'Wave animation in progress',
            waveAnimation: context.contentSystem.waveAnimation
        },
        priority: 3,
        timestamp: Date.now()
    };
}

function renderSelectionModeView(context: any) {
    return {
        type: 'overlay',
        component: 'ElementSelector',
        props: {
            isActive: true,
            message: 'Select elements to read',
            selectorUI: context.contentSystem.selectorUI
        },
        priority: 4,
        timestamp: Date.now()
    };
}

function renderErrorView(context: any) {
    return {
        type: 'notification',
        component: 'ErrorDisplay',
        props: {
            isActive: true,
            message: 'System error - check logs',
            error: context.error || 'Unknown error'
        },
        priority: 5,
        timestamp: Date.now()
    };
}

// Main ViewStateMachine class that integrates with the tome system
export class ViewStateMachine {
    private tome: any;
    private robotProxy: RobotProxy;
    private sessionId: string;

    constructor(robotProxy: RobotProxy) {
        this.robotProxy = robotProxy;
        this.sessionId = this.generateSessionId();
        
        // Create and initialize the tome
        this.tome = createTomeConfig().create({
            sessionId: this.sessionId,
            robotProxy: this.robotProxy
        });
        
        console.log("🌊 View State Machine initialized with Tome System");
    }

    private generateSessionId(): string {
        return `view-state-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Process messages through the tome system
    async processMessage(message: any, source: string): Promise<{
        newState: any;
        views: RenderableView[];
        actions: StateAction[];
    }> {
        console.log(`🌊 View State Machine: Processing message from ${source}:`, message.name);
        
        // Log the message through the tome system
        await this.tome.send({ type: 'LOG_MESSAGE', payload: { message, source } });
        
        // Route the message through our log-view system
        const route = LogViewMessageUtility.routeMessage(source, 'view-state-machine', message, this.sessionId);
        
        // Send the message to the tome state machine
        await this.tome.send({ type: message.name, payload: message });
        
        // Get current state and generate views
        const currentState = this.tome.context?.currentState || 'base';
        const views = this.generateViewsForState(currentState, message);
        const actions = this.generateActionsForMessage(message);
        
        return {
            newState: { name: currentState, context: this.tome.context },
            views,
            actions
        };
    }

    private generateViewsForState(state: string, message: any): RenderableView[] {
        const views: RenderableView[] = [];
        const timestamp = Date.now();

        switch (state) {
            case 'content-active':
                views.push({
                    type: 'content',
                    component: 'WaveReader',
                    props: { isActive: true, message: 'Content system active' },
                    priority: 2,
                    timestamp
                });
                break;
                
            case 'shadow-active':
                views.push({
                    type: 'shadow',
                    component: 'MouseTracking',
                    props: { isActive: true, message: 'Shadow system active' },
                    priority: 2,
                    timestamp
                });
                break;
                
            case 'waving':
                views.push({
                    type: 'content',
                    component: 'WaveAnimation',
                    props: { isActive: true, message: 'Wave animation active' },
                    priority: 3,
                    timestamp
                });
                break;
                
            case 'selection-mode':
                views.push({
                    type: 'overlay',
                    component: 'ElementSelector',
                    props: { isActive: true, message: 'Selection mode active' },
                    priority: 4,
                    timestamp
                });
                break;
        }

        return views;
    }

    private generateActionsForMessage(message: any): StateAction[] {
        const actions: StateAction[] = [];

        switch (message.name) {
            case 'START':
                actions.push(
                    { type: 'ACTIVATE_CONTENT' },
                    { type: 'ACTIVATE_SHADOW' }
                );
                break;

            case 'STOP':
                actions.push(
                    { type: 'DEACTIVATE_CONTENT' },
                    { type: 'DEACTIVATE_SHADOW' }
                );
                break;

            case 'SELECTION-MADE':
                actions.push(
                    { type: 'SHOW_SELECTOR_UI', payload: { selector: message.selector } }
                );
                break;
        }

        return actions;
    }

    // Get current state
    getCurrentState(): any {
        return this.tome.context?.currentState || 'base';
    }

    // Get current views
    getCurrentViews(): RenderableView[] {
        const currentState = this.getCurrentState();
        return this.generateViewsForState(currentState, {});
    }

    // Clear processed views
    clearProcessedViews(): void {
        // Views are generated on-demand, so nothing to clear
    }

    // Get state history
    getStateHistory(): any[] {
        return this.tome.context?.stateHistory || [];
    }

    // Get health status
    getHealthStatus(): any {
        return {
            timestamp: Date.now(),
            sessionId: this.sessionId,
            currentState: this.getCurrentState(),
            stateMachineInitialized: true,
            tomeId: this.tome.machineId,
            viewQueueLength: this.getCurrentViews().length,
            messageHistoryLength: this.tome.context?.messageQueue?.length || 0,
            stateHistoryLength: this.getStateHistory().length
        };
    }

    // Public methods for external access
    getMessageHistory(): any[] {
        return this.tome.context?.messageQueue || [];
    }

    getSessionId(): string {
        return this.sessionId;
    }

    destroy(): void {
        console.log("🌊 View State Machine: Destroying");
        // Clean up tome resources if needed
        this.tome = null;
    }
}

// Export for testing
export default ViewStateMachine;
