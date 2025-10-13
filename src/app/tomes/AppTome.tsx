import React from 'react';
import { TomeBase } from 'log-view-machine';
import { ProxyMachineAdapter } from '../../adapters/machine-adapters';
import { createAppMachine } from '../machines/app-machine';
import { createBackgroundProxyMachine } from '../machines/background-proxy-machine';

/**
 * AppTome
 * 
 * Main orchestrator for the Wave Reader application
 * Manages the app state machine and coordinates with sub-tomes
 * Implements the observable pattern for React integration
 */
class AppTomeClass extends TomeBase {
    private appMachine: any;
    private backgroundProxyMachine: any;
    private isInitialized: boolean = false;

    constructor() {
        super();
        this.currentViewKey = 'loading';
    }

    /**
     * Initialize the tome and its machines
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) {
            console.warn('🌊 AppTome: Already initialized');
            return;
        }

        console.log('🌊 AppTome: Initializing...');

        try {
            // Create Background Proxy Machine
            const bgProxyMachineRaw = createBackgroundProxyMachine();
            this.backgroundProxyMachine = new ProxyMachineAdapter(bgProxyMachineRaw);
            
            // Register with router
            this.router.register('BackgroundProxyMachine', this.backgroundProxyMachine);
            
            // Create App Machine with view state rendering
            const appMachineRaw = createAppMachine();
            
            // Attach view rendering using withState pattern
            this.appMachine = this.attachViewRendering(appMachineRaw);
            
            // Register machine with router
            this.router.register('AppMachine', this.appMachine);
            
            // Set up machine event listeners
            this.setupMachineListeners();
            
            // Start the app machine
            await this.appMachine.start?.();
            
            // Send initialize event (will invoke initializeService)
            this.appMachine.send('INITIALIZE');
            
            this.isInitialized = true;
            this.updateViewKey('initialized');
            
            console.log('🌊 AppTome: Initialization complete');
        } catch (error) {
            console.error('🌊 AppTome: Initialization failed', error);
            this.updateViewKey('error');
            throw error;
        }
    }

    /**
     * Attach view rendering for each state using withState pattern
     * Returns the machine with view rendering attached
     */
    private attachViewRendering(machine: any): any {
        // Chain withState calls for each state
        return machine
            .withState('idle', async ({context, event, view, clear}: any) => {
                clear();
                this.viewStack.clear();
                const rendered = this.renderIdleView(context);
                this.viewStack.append('idle', rendered);
                view(rendered);
                this.updateViewKey(`idle-${Date.now()}`);
            })
            .withState('initializing', async ({context, event, view, clear}: any) => {
                clear();
                this.viewStack.clear();
                const rendered = this.renderInitializingView(context);
                this.viewStack.append('initializing', rendered);
                view(rendered);
                this.updateViewKey(`initializing-${Date.now()}`);
            })
            .withState('ready', async ({context, event, view, clear}: any) => {
                clear();
                this.viewStack.clear();
                const rendered = this.renderReadyView(context);
                this.viewStack.append('ready', rendered);
                view(rendered);
                this.updateViewKey(`ready-${Date.now()}`);
            })
            .withState('starting', async ({context, event, view, clear}: any) => {
                clear();
                this.viewStack.clear();
                const rendered = this.renderReadyView(context);  // Use ready view while starting
                this.viewStack.append('starting', rendered);
                view(rendered);
                this.updateViewKey(`starting-${Date.now()}`);
            })
            .withState('waving', async ({context, event, view, clear}: any) => {
                clear();
                this.viewStack.clear();
                const rendered = this.renderWavingView(context);
                this.viewStack.append('waving', rendered);
                view(rendered);
                this.updateViewKey(`waving-${Date.now()}`);
            })
            .withState('stopping', async ({context, event, view, clear}: any) => {
                clear();
                this.viewStack.clear();
                const rendered = this.renderWavingView(context);  // Use waving view while stopping
                this.viewStack.append('stopping', rendered);
                view(rendered);
                this.updateViewKey(`stopping-${Date.now()}`);
            })
            .withState('toggling', async ({context, event, view, clear}: any) => {
                clear();
                this.viewStack.clear();
                const rendered = this.renderReadyView(context);
                this.viewStack.append('toggling', rendered);
                view(rendered);
                this.updateViewKey(`toggling-${Date.now()}`);
            })
            .withState('keyboardToggling', async ({context, event, view, clear}: any) => {
                clear();
                this.viewStack.clear();
                const rendered = this.renderReadyView(context);
                this.viewStack.append('keyboardToggling', rendered);
                view(rendered);
                this.updateViewKey(`keyboardToggling-${Date.now()}`);
            })
            .withState('selectorUpdating', async ({context, event, view, clear}: any) => {
                clear();
                this.viewStack.clear();
                const rendered = this.renderReadyView(context);
                this.viewStack.append('selectorUpdating', rendered);
                view(rendered);
                this.updateViewKey(`selectorUpdating-${Date.now()}`);
            })
            .withState('settingsUpdating', async ({context, event, view, clear}: any) => {
                clear();
                this.viewStack.clear();
                const rendered = this.renderReadyView(context);
                this.viewStack.append('settingsUpdating', rendered);
                view(rendered);
                this.updateViewKey(`settingsUpdating-${Date.now()}`);
            })
            .withState('error', async ({context, event, view, clear}: any) => {
                clear();
                this.viewStack.clear();
                const rendered = this.renderErrorView(context);
                this.viewStack.append('error', rendered);
                view(rendered);
                this.updateViewKey(`error-${Date.now()}`);
            });
    }

    /**
     * Setup machine event listeners for reactive updates
     */
    private setupMachineListeners(): void {
        // Listen for state changes
        this.appMachine.subscribe?.((state: any) => {
            console.log('🌊 AppTome: App machine state changed', state);
            this.updateViewKey(`${state.value}-${Date.now()}`);
        });

        // Listen for background proxy events
        this.backgroundProxyMachine.on('started', (data: any) => {
            console.log('🌊 AppTome: Background proxy started', data);
        });

        this.backgroundProxyMachine.on('error', (data: any) => {
            console.error('🌊 AppTome: Background proxy error', data);
        });
    }

    /**
     * Render idle state view
     */
    private renderIdleView(context: any): React.ReactNode {
        const viewModel = context.viewModel || {};
        
        return (
            <div key="idle-view">
                <h3>Wave Reader</h3>
                <p>Status: {viewModel.going ? 'Running' : 'Stopped'}</p>
                <p>Selector: {viewModel.selector || 'None'}</p>
                <button
                    onClick={() => this.appMachine.send('START')}
                    style={{ padding: '8px 16px', margin: '5px' }}
                >
                    Start Wave
                </button>
                <button
                    onClick={() => this.appMachine.send('TOGGLE')}
                    style={{ padding: '8px 16px', margin: '5px' }}
                >
                    Toggle
                </button>
            </div>
        );
    }

    /**
     * Render initializing state view
     */
    private renderInitializingView(context: any): React.ReactNode {
        return (
            <div key="initializing-view">
                <h3>Initializing...</h3>
                <p>Please wait while Wave Reader initializes.</p>
            </div>
        );
    }

    /**
     * Render ready state view
     */
    private renderReadyView(context: any): React.ReactNode {
        const viewModel = context.viewModel || {};
        
        return (
            <div key="ready-view">
                <h3>Wave Reader Ready</h3>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px'
                }}>
                    <p style={{ margin: 0 }}>
                        Current state: {viewModel.going ? 'Running' : 'Stopped'}
                    </p>
                </div>
                <p>Selector: {viewModel.selector || 'None'}</p>
                <p>View: {viewModel.currentView || 'main'}</p>
                <p>Saved: {viewModel.saved ? 'Yes' : 'No'}</p>
                {viewModel.error && (
                    <div style={{ color: 'red' }}>
                        Error: {viewModel.error}
                    </div>
                )}
                <div style={{ marginTop: '10px' }}>
                    <button
                        onClick={() => this.appMachine.send('START')}
                        style={{
                            padding: '8px 16px',
                            margin: '5px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Start Wave
                    </button>
                    <button
                        onClick={() => this.appMachine.send('STOP')}
                        style={{
                            padding: '8px 16px',
                            margin: '5px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Stop Wave
                    </button>
                    <button
                        onClick={() => this.appMachine.send('TOGGLE')}
                        style={{
                            padding: '8px 16px',
                            margin: '5px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Toggle
                    </button>
                </div>
            </div>
        );
    }

    /**
     * Render waving state view
     */
    private renderWavingView(context: any): React.ReactNode {
        const viewModel = context.viewModel || {};
        
        return (
            <div key="waving-view">
                <h3>🌊 Wave Active</h3>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px'
                }}>
                    <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#28a745',
                        animation: 'pulse 1.5s infinite'
                    }} />
                    <p style={{ margin: 0 }}>Waving is active</p>
                </div>
                <p>Selector: {viewModel.selector || 'None'}</p>
                <div style={{ marginTop: '10px' }}>
                    <button
                        onClick={() => this.appMachine.send('STOP')}
                        style={{
                            padding: '8px 16px',
                            margin: '5px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Stop Wave
                    </button>
                    <button
                        onClick={() => this.appMachine.send('TOGGLE')}
                        style={{
                            padding: '8px 16px',
                            margin: '5px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Toggle
                    </button>
                </div>
            </div>
        );
    }

    /**
     * Render error state view
     */
    private renderErrorView(context: any): React.ReactNode {
        const viewModel = context.viewModel || {};
        
        return (
            <div key="error-view">
                <h3 style={{ color: 'red' }}>❌ Error</h3>
                <p>{viewModel.error || 'An unknown error occurred'}</p>
                <div style={{ marginTop: '10px' }}>
                    <button
                        onClick={() => this.appMachine.send('RETRY')}
                        style={{
                            padding: '8px 16px',
                            margin: '5px',
                            backgroundColor: '#ffc107',
                            color: 'black',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Retry
                    </button>
                    <button
                        onClick={() => this.appMachine.send('RESET')}
                        style={{
                            padding: '8px 16px',
                            margin: '5px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Reset
                    </button>
                </div>
            </div>
        );
    }

    /**
     * Render the current view from the machine
     * Overrides base class to use ViewStateMachine's render method
     */
    render(): React.ReactNode {
        if (!this.appMachine) {
            return <div>Initializing...</div>;
        }
        
        // Use the ViewStateMachine's render method
        if (typeof this.appMachine.render === 'function') {
            return this.appMachine.render();
        }
        
        // Fallback to view stack composition
        return this.viewStack.compose();
    }

    /**
     * Cleanup resources
     */
    cleanup(): void {
        console.log('🌊 AppTome: Cleaning up...');
        
        if (this.appMachine) {
            this.appMachine.stop?.();
        }
        
        if (this.backgroundProxyMachine) {
            this.backgroundProxyMachine.stop?.();
        }
        
        super.cleanup();
        this.isInitialized = false;
    }
}

// Export singleton instance
export const AppTome = new AppTomeClass();

