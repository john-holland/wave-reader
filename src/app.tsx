import React, { FunctionComponent, useEffect, useState, useCallback, useRef } from 'react'
import styled from "styled-components";
import './styles.scss';
import { ErrorBoundary } from './components/error-boundary';
import { Settings } from './components/settings';
import WaveTabs from './components/wave-tabs';
import About from './components/about';
import ErrorTestComponent from './components/ErrorTestComponent';
import ErrorDemoComponent from './components/ErrorDemoComponent';
import { getSyncObject, setSyncObject } from './util/sync';
import { guardLastError } from "./util/util";
import configured from './config/config';
import SettingsService from "./services/settings";
import MLSettingsService from "./services/ml-settings-service";
import { SelectorsDefaultFactory } from "./models/defaults";
import Options from "./models/options";
import Wave from "./models/wave";
import { StartMessage, StopMessage, ToggleMessage, MessageFactory, MessageUtility } from "./models/messages/simplified-messages";
import { 
  WaveReaderMessageRouter,
  useWaveReaderMessageRouter
} from './components/structural';
import { createProxyRobotCopyStateMachine, createTomeConfig, createViewStateMachine, TomeManager } from 'log-view-machine';

/**
 * ISubMachine Interface
 * 
 * Common interface for all sub-machines in the Tome architecture.
 * Provides standardized access to machine vitals, routing, and messaging capabilities.
 */
export interface ISubMachine {
    // Machine identification
    readonly machineId: string;
    readonly machineType: 'proxy' | 'view' | 'background' | 'content';
    
    // State management
    getState(): any;
    getContext(): any;
    isInState(stateName: string): boolean;
    
    // Event handling
    send(event: string | object): void;
    canHandle(event: string): boolean;
    
    // Lifecycle
    start(): Promise<void>;
    stop(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    
    // Routing and messaging
    routeMessage(message: any): Promise<any>;
    sendToParent(message: any): Promise<any>;
    sendToChild(machineId: string, message: any): Promise<any>;
    broadcast(message: any): Promise<any>;
    
    // View rendering (for view machines)
    render?(): React.ReactNode;
    
    // Configuration
    getConfig(): any;
    updateConfig(config: Partial<any>): void;
    
    // Health and monitoring
    getHealth(): {
        status: 'healthy' | 'degraded' | 'unhealthy';
        lastHeartbeat: number;
        errorCount: number;
        uptime: number;
    };
    
    // Event subscription
    on(event: string, handler: (data: any) => void): void;
    off(event: string, handler: (data: any) => void): void;
    emit(event: string, data: any): void;
}

/**
 * ProxyMachineAdapter
 * 
 * Adapter that wraps ProxyRobotCopyStateMachine to implement ISubMachine interface
 */
export class ProxyMachineAdapter implements ISubMachine {
    private machine: any;
    private startTime: number;
    private errorCount: number;
    private eventHandlers: Map<string, Set<(data: any) => void>>;

    constructor(machine: any) {
        this.machine = machine;
        this.startTime = Date.now();
        this.errorCount = 0;
        this.eventHandlers = new Map();
    }

    get machineId(): string {
        return this.machine.machineId || 'unknown-proxy';
    }

    get machineType(): 'proxy' | 'view' | 'background' | 'content' {
        return 'proxy';
    }

    getState(): any {
        return this.machine.getState?.() || { value: 'unknown' };
    }

    getContext(): any {
        return this.machine.getContext?.() || {};
    }

    isInState(stateName: string): boolean {
        const state = this.getState();
        return state.value === stateName || state.matches?.(stateName) || false;
    }

    send(event: string | object): void {
        try {
            this.machine.send?.(event);
        } catch (error) {
            this.errorCount++;
            this.emit('error', { error, event });
        }
    }

    canHandle(event: string): boolean {
        // Check if the machine can handle this event based on current state
        const state = this.getState();
        const stateConfig = this.machine.getConfig?.()?.states?.[state.value];
        return stateConfig?.on?.[event] !== undefined;
    }

    async start(): Promise<void> {
        try {
            await this.machine.start?.();
            this.emit('started', { machineId: this.machineId });
        } catch (error) {
            this.errorCount++;
            this.emit('error', { error, action: 'start' });
            throw error;
        }
    }

    async stop(): Promise<void> {
        try {
            await this.machine.stop?.();
            this.emit('stopped', { machineId: this.machineId });
        } catch (error) {
            this.errorCount++;
            this.emit('error', { error, action: 'stop' });
            throw error;
        }
    }

    async pause(): Promise<void> {
        // Proxy machines don't typically have pause functionality
        this.emit('paused', { machineId: this.machineId });
    }

    async resume(): Promise<void> {
        // Proxy machines don't typically have resume functionality
        this.emit('resumed', { machineId: this.machineId });
    }

    async routeMessage(message: any): Promise<any> {
        try {
            // Route message through the proxy's robot copy functionality
            if (this.machine.robotCopy?.sendMessage) {
                return await this.machine.robotCopy.sendMessage(message);
            }
            return { success: false, error: 'No routing capability' };
        } catch (error) {
            this.errorCount++;
            this.emit('error', { error, action: 'routeMessage' });
            throw error;
        }
    }

    async sendToParent(message: any): Promise<any> {
        // Proxy machines typically send to parent through their robot copy
        return this.routeMessage(message);
    }

    async sendToChild(machineId: string, message: any): Promise<any> {
        // Proxy machines don't typically have children
        return { success: false, error: 'Proxy machines do not have children' };
    }

    async broadcast(message: any): Promise<any> {
        return this.routeMessage(message);
    }

    getConfig(): any {
        return this.machine.getConfig?.() || {};
    }

    updateConfig(config: Partial<any>): void {
        // Proxy machines typically don't support runtime config updates
        this.emit('configUpdateRequested', { config });
    }

    getHealth(): {
        status: 'healthy' | 'degraded' | 'unhealthy';
        lastHeartbeat: number;
        errorCount: number;
        uptime: number;
    } {
        return {
            status: this.errorCount > 10 ? 'unhealthy' : this.errorCount > 5 ? 'degraded' : 'healthy',
            lastHeartbeat: Date.now(),
            errorCount: this.errorCount,
            uptime: Date.now() - this.startTime
        };
    }

    on(event: string, handler: (data: any) => void): void {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event)!.add(handler);
    }

    off(event: string, handler: (data: any) => void): void {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.delete(handler);
        }
    }

    emit(event: string, data: any): void {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }
}

/**
 * ViewMachineAdapter
 * 
 * Adapter that wraps ViewStateMachine to implement ISubMachine interface
 */
export class ViewMachineAdapter implements ISubMachine {
    private machine: any;
    private startTime: number;
    private errorCount: number;
    private eventHandlers: Map<string, Set<(data: any) => void>>;

    constructor(machine: any) {
        this.machine = machine;
        this.startTime = Date.now();
        this.errorCount = 0;
        this.eventHandlers = new Map();
    }

    get machineId(): string {
        return this.machine.machineId || 'unknown-view';
    }

    get machineType(): 'proxy' | 'view' | 'background' | 'content' {
        return 'view';
    }

    getState(): any {
        return this.machine.getState?.() || { value: 'unknown' };
    }

    getContext(): any {
        return this.machine.getContext?.() || {};
    }

    isInState(stateName: string): boolean {
        const state = this.getState();
        return state.value === stateName || state.matches?.(stateName) || false;
    }

    send(event: string | object): void {
        try {
            this.machine.send?.(event);
        } catch (error) {
            this.errorCount++;
            this.emit('error', { error, event });
        }
    }

    canHandle(event: string): boolean {
        const state = this.getState();
        const stateConfig = this.machine.getConfig?.()?.states?.[state.value];
        return stateConfig?.on?.[event] !== undefined;
    }

    async start(): Promise<void> {
        try {
            await this.machine.start?.();
            this.emit('started', { machineId: this.machineId });
        } catch (error) {
            this.errorCount++;
            this.emit('error', { error, action: 'start' });
            throw error;
        }
    }

    async stop(): Promise<void> {
        try {
            await this.machine.stop?.();
            this.emit('stopped', { machineId: this.machineId });
        } catch (error) {
            this.errorCount++;
            this.emit('error', { error, action: 'stop' });
            throw error;
        }
    }

    async pause(): Promise<void> {
        // View machines can be paused by stopping event processing
        this.emit('paused', { machineId: this.machineId });
    }

    async resume(): Promise<void> {
        // View machines can be resumed by restarting event processing
        this.emit('resumed', { machineId: this.machineId });
    }

    async routeMessage(message: any): Promise<any> {
        try {
            // View machines route messages through their state machine
            this.send(message);
            return { success: true, message: 'Message routed to state machine' };
        } catch (error) {
            this.errorCount++;
            this.emit('error', { error, action: 'routeMessage' });
            throw error;
        }
    }

    async sendToParent(message: any): Promise<any> {
        // View machines can send messages to parent through extension messaging
        try {
            if (typeof chrome !== 'undefined' && chrome.runtime) {
                return await chrome.runtime.sendMessage(message);
            }
            return { success: false, error: 'No parent communication available' };
        } catch (error) {
            this.errorCount++;
            this.emit('error', { error, action: 'sendToParent' });
            throw error;
        }
    }

    async sendToChild(machineId: string, message: any): Promise<any> {
        // View machines don't typically have children
        return { success: false, error: 'View machines do not have children' };
    }

    async broadcast(message: any): Promise<any> {
        // View machines can broadcast through extension messaging
        return this.sendToParent(message);
    }

    render?(): React.ReactNode {
        // Delegate to the machine's render method if it exists
        return this.machine.render?.() || null;
    }

    getConfig(): any {
        return this.machine.getConfig?.() || {};
    }

    updateConfig(config: Partial<any>): void {
        // View machines can update their configuration
        this.emit('configUpdateRequested', { config });
    }

    getHealth(): {
        status: 'healthy' | 'degraded' | 'unhealthy';
        lastHeartbeat: number;
        errorCount: number;
        uptime: number;
    } {
        return {
            status: this.errorCount > 10 ? 'unhealthy' : this.errorCount > 5 ? 'degraded' : 'healthy',
            lastHeartbeat: Date.now(),
            errorCount: this.errorCount,
            uptime: Date.now() - this.startTime
        };
    }

    on(event: string, handler: (data: any) => void): void {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event)!.add(handler);
    }

    off(event: string, handler: (data: any) => void): void {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.delete(handler);
        }
    }

    emit(event: string, data: any): void {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }
}

// Add spinner animation CSS
const SpinnerStyle = styled.div`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  &.spinner {
    animation: spin 1s linear infinite;
  }
`;

// Check if we're in development mode
const isDevelopment = configured.mode !== 'production';

// Global refresh function for manual state sync
let globalRefreshFunction: (() => void) | null = null;

// Function to send messages to content script
const sendExtensionMessage = async (message: any) => {
  try {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      const response = await chrome.runtime.sendMessage(message);
      return response;
    } else {
      console.warn('Chrome runtime not available');
      return { success: false, error: 'Chrome runtime not available' };
    }
  } catch (error: any) {
    console.error('Failed to send message to content script:', error);
    return { success: false, error: error.message };
  }
};


// Styled components optimized for Chrome extension popup
const WaveReader = styled.div`
  width: 400px; // Smaller width for popup
  max-height: 600px; // Limit height for popup
  overflow-y: auto;
  font-size: 14px; // Smaller font for popup
`;

const PopupHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 15px;
  text-align: center;
  border-radius: 8px 8px 0 0;
  
  h1 {
    margin: 0 0 5px 0;
    font-size: 1.5rem; // Smaller for popup
    font-weight: 700;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const PopupContent = styled.div`
  padding: 15px;
`;

const CompactButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin: 2px;
  
  &.btn-primary {
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a6fd8;
      transform: translateY(-1px);
    }
  }
  
  &.btn-success {
    background: #28a745;
    color: white;
    
    &:hover {
      background: #218838;
      transform: translateY(-1px);
    }
  }
  
  &.btn-secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
      transform: translateY(-1px);
    }
  }
  
  &.btn-danger {
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
      transform: translateY(-1px);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const CompactInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 10px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

const CompactSection = styled.div`
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 1rem;
    color: #2c3e50;
  }
`;

const CompactSelectorItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  margin-bottom: 6px;
  background: white;
  font-size: 12px;
  
  .selector-text {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    background: #f8f9fa;
    padding: 2px 6px;
    border-radius: 3px;
    color: #495057;
  }
  
  .selector-actions {
    display: flex;
    gap: 4px;
  }
`;

interface StatusIndicatorProps {
  isActive: boolean;
}

const StatusIndicator = styled.div<StatusIndicatorProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: ${props => props.isActive ? '#d4edda' : '#f8f9fa'};
  border: 1px solid ${props => props.isActive ? '#c3e6cb' : '#e9ecef'};
  border-radius: 4px;
  margin-bottom: 12px;
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.isActive ? '#28a745' : '#6c757d'};
    animation: ${props => props.isActive ? 'pulse 1.5s infinite' : 'none'};
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

// Unified App component using Tome architecture


// todo: wire this up to the existing UI above and use TomeManager to register the structural system
//      already configured in DefaultStructuralConfig

const BackgroundProxyMachineRaw = createProxyRobotCopyStateMachine({
    machineId: 'background-proxy-machine',
    xstateConfig: {
        initial: 'idle',
        context: {
            message: null
        },
        states: {
            idle: {
                on: {
                    INITIALIZE: { target: 'initializing' },
                    START: { target: 'starting' },
                    STOP: { target: 'stopping' },
                    TOGGLE: { target: 'toggling' }
                }
            },
            initializing: {
                on: {
                    INITIALIZATION_COMPLETE: { target: 'idle' }
                }
            },
            starting: {
                on: {
                    START_COMPLETE: { target: 'idle' }
                }
            },
            stopping: {
                on: {
                    STOP_COMPLETE: { target: 'idle' }
                }
            },
            toggling: {
                on: {
                    TOGGLE_COMPLETE: { target: 'idle' }
                }
            }
        }
    },
    robotCopy: {
        sendMessage: async (message: any) => {
            console.log('Mock robot copy send message:', message);
            return { success: true };
        }
    } as any
});

// Wrap with adapter to implement ISubMachine interface
const BackgroundProxyMachine = new ProxyMachineAdapter(BackgroundProxyMachineRaw);

// Render function for AppTome that uses viewModel
const renderAppView = (viewModel: any) => {
    console.log('🌊 AppTome: Rendering view with viewModel:', viewModel);
    
    return (
        <div>
            <h3>Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <p style={{ margin: 0 }}>Current state: {viewModel?.going ? 'Running' : 'Stopped'}</p>
                {globalRefreshFunction && (
                    <button 
                        onClick={globalRefreshFunction}
                        style={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                        title="Refresh"
                    >
                        🔄
                    </button>
                )}
            </div>
            <p>Selector: {viewModel?.selector || 'None'}</p>
            <p>View: {viewModel?.currentView || 'main'}</p>
            <p>Saved: {viewModel?.saved ? 'Yes' : 'No'}</p>
            {viewModel?.error && (
                <div style={{ color: 'red' }}>
                    Error: {viewModel.error}
                </div>
            )}
        </div>
    );
};

// Render function for Settings view with callback
const renderSettingsView = (viewModel: any, onSettingsUpdated?: (settings: any) => void) => {
    console.log('🌊 AppTome: Rendering settings view with viewModel:', viewModel);
    
    const handleSettingsSave = () => {
        console.log('🌊 AppTome: Settings save requested');
        if (onSettingsUpdated) {
            onSettingsUpdated(viewModel.settings);
        }
    };
    
    const handleSettingsCancel = () => {
        console.log('🌊 AppTome: Settings cancel requested');
        if (onSettingsUpdated) {
            onSettingsUpdated(null);
        }
    };
    
    return (
        <div>
            <h3>⚙️ Settings</h3>
            <div>
                <p>Current Settings:</p>
                <ul>
                    <li>Show Notifications: {viewModel?.showNotifications ? 'Yes' : 'No'}</li>
                    <li>Current View: {viewModel?.currentView || 'main'}</li>
                    <li>Extension Mode: {viewModel?.isExtension ? 'Yes' : 'No'}</li>
                </ul>
                
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={handleSettingsSave}
                        style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        Save Settings
                    </button>
                    <button 
                        onClick={handleSettingsCancel}
                        style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const AppMachineRaw = createViewStateMachine({
    machineId: 'app-machine',
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
                showNotifications: true
            }
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
                    REFRESH_STATE: { target: 'ready', actions: ['refreshStateFromContentScript'] },
                    STATE_REFRESHED: { target: 'ready', actions: ['logStateRefresh'] },
                    STATE_REFRESH_FAILED: { target: 'ready', actions: ['logStateRefreshError'] },
                    ERROR: { target: 'error', actions: ['handleError'] }
                }
            },
            starting: {
                on: {
                    START_COMPLETE: { target: 'waving', actions: ['startWaveAnimation'] },
                    START_FAILED: { target: 'error', actions: ['handleStartError'] }
                }
            },
            waving: {
                on: {
                    STOP: { target: 'stopping', actions: ['stopWaveAnimation'] },
                    TOGGLE: { target: 'toggling', actions: ['toggleWaveAnimation'] },
                    SELECTOR_UPDATE: { target: 'selectorUpdating', actions: ['updateSelector'] },
                    SETTINGS_UPDATE: { target: 'settingsUpdating', actions: ['updateSettings'] },
                    ERROR: { target: 'error', actions: ['handleError'] }
                }
            },
            stopping: {
                on: {
                    STOP_COMPLETE: { target: 'idle', actions: ['completeStop'] },
                    ERROR: { target: 'error', actions: ['handleError'] }
                }
            },
            selectorUpdating: {
                on: { SELECTOR_UPDATE_COMPLETE: { target: 'idle', actions: ['completeSelectorUpdate'] } },
                entry: 'updateSelector'
            },
            settingsUpdating: {
                on: { 
                    SETTINGS_UPDATE_COMPLETE: { target: 'idle', actions: ['completeSettingsUpdate'] },
                    SETTINGS_UPDATE_CANCELLED: { target: 'idle', actions: ['cancelSettingsUpdate'] }
                },
                entry: 'updateSettings'
            },
            keyboardToggling: {
                on: { 
                    KEYBOARD_TOGGLE_COMPLETE: { target: 'idle', actions: ['completeKeyboardToggle'] },
                    ERROR: { target: 'error', actions: ['handleError'] }
                },
                entry: 'handleKeyboardToggle'
            },
            error: {
                on: {
                    RECOVER: { target: 'idle', actions: ['recoverFromError'] },
                    RESET: { target: 'initializing', actions: ['resetApplication'] }
                }
            }
        },
        actions: {
            // Helper function for data synchronization
            syncDataWithContentScript: {
                type: 'function',
                fn: async ({context, log}: any) => {
                    log('🌊 App Tome: Syncing data with content script...');
                    
                    try {
                        const statusResponse = await sendExtensionMessage({
                            from: 'popup',
                            name: 'get-status',
                            timestamp: Date.now()
                        });
                        
                        if (statusResponse && statusResponse.success) {
                            // Update critical state from content script
                            const contentState = (statusResponse as any).data || statusResponse;
                            context.viewModel.going = contentState.going || false;
                            
                            // Sync any additional state that content script provides
                            if (contentState.selector) {
                                context.viewModel.selector = contentState.selector;
                            }
                            
                            log('🌊 App Tome: Successfully synced with content script', contentState);
                            return contentState;
                        }
                    } catch (error: any) {
                        log('🌊 App Tome: Failed to sync with content script', error);
                    }
                    
                    return null;
                }
            },
            initializeApp: {
                type: 'function',
                fn: async ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Initialize app');
                    
                    try {
                        // Data synchronization strategy: Use a combination approach
                        // 1. Load from Chrome storage (fast, cached data)
                        // 2. Query content script for real-time state (accurate, current)
                        // 3. Merge and resolve conflicts with content script taking precedence
                        
                        log('🌊 App Tome: Starting data synchronization...');
                        
                        // Step 1: Load cached data from Chrome storage
                        let cachedData = {
                            selector: '',
                            saved: true,
                            going: false,
                            selectors: [],
                            currentView: 'main',
                            isExtension: false,
                            settings: null,
                            showNotifications: true
                        };
                        
                        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                            try {
                                const storageResult = await chrome.storage.local.get([
                                    'waveReaderSettings', 
                                    'waveReaderSelectors',
                                    'currentSelector',
                                    'going',
                                    'waveReaderCurrentView',
                                    'waveReaderShowNotifications'
                                ]);
                                
                                cachedData = {
                                    selector: storageResult.currentSelector || '',
                                    saved: true,
                                    going: storageResult.going?.going || false,
                                    selectors: storageResult.waveReaderSelectors || [],
                                    currentView: storageResult.waveReaderCurrentView || 'main',
                                    isExtension: true,
                                    settings: storageResult.waveReaderSettings || null,
                                    showNotifications: storageResult.waveReaderShowNotifications !== false
                                };
                                
                                log('🌊 App Tome: Loaded cached data from Chrome storage', cachedData);
                            } catch (storageError) {
                                log('🌊 App Tome: Failed to load from Chrome storage, using defaults', storageError);
                            }
                        }
                        
                        // Step 2: Query content script for real-time state
                        let realtimeData: any = null;
                        try {
                        const statusResponse = await sendExtensionMessage({
                            from: 'popup',
                            name: 'get-status',
                            timestamp: Date.now()
                        });
                        
                        if (statusResponse && statusResponse.success) {
                            const contentState = (statusResponse as any).data || statusResponse;
                            realtimeData = {
                                going: contentState.going || false,
                                // Content script may have additional state we want to sync
                                contentState: contentState
                            };
                                log('🌊 App Tome: Retrieved real-time state from content script', realtimeData);
                            }
                        } catch (contentError: any) {
                            log('🌊 App Tome: Could not get real-time state from content script, using cached data', contentError);
                        }
                        
                        // Step 3: Merge data with content script taking precedence for critical state
                        const viewModel = {
                            ...cachedData,
                            // Override with real-time data where available
                            ...(realtimeData && {
                                going: realtimeData.going,
                                // Mark as unsaved if real-time state differs from cached
                                saved: realtimeData.going === cachedData.going
                            })
                        };
                        
                        log('🌊 App Tome: Final synchronized viewModel', viewModel);
                        
                        // Step 4: Save synchronized state back to Chrome storage for consistency
                        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                            try {
                                await chrome.storage.local.set({
                                    currentSelector: viewModel.selector,
                                    going: { going: viewModel.going },
                                    waveReaderSelectors: viewModel.selectors,
                                    waveReaderCurrentView: viewModel.currentView,
                                    waveReaderShowNotifications: viewModel.showNotifications,
                                    lastSyncTimestamp: Date.now()
                                });
                                log('🌊 App Tome: Saved synchronized state to Chrome storage');
                            } catch (saveError) {
                                log('🌊 App Tome: Failed to save synchronized state', saveError);
                            }
                        }
                        
                        // Update context with initialized viewModel
                        context.viewModel = viewModel;
                        
                        // Send completion event
                        send('INITIALIZATION_COMPLETE');
                        
                    } catch (error: any) {
                        console.error('🌊 App Tome: Initialization failed', error);
                        send('INITIALIZATION_FAILED');
                    }
                }
            },
            // Periodic sync action that can be called to refresh state
            refreshStateFromContentScript: {
                type: 'function',
                fn: async ({context, send, log}: any) => {
                    log('🌊 App Tome: Refreshing state from content script...');
                    
                    try {
                        // Call the sync function directly
                        const statusResponse = await sendExtensionMessage({
                            from: 'popup',
                            name: 'get-status',
                            timestamp: Date.now()
                        });
                        
                        if (statusResponse && statusResponse.success) {
                            const contentState = (statusResponse as any).data || statusResponse;
                            const previousGoing = context.viewModel.going;
                            
                            // Update critical state from content script
                            context.viewModel.going = contentState.going || false;
                            
                            // Sync any additional state that content script provides
                            if (contentState.selector) {
                                context.viewModel.selector = contentState.selector;
                            }
                            
                            // Update the saved flag based on whether state changed
                            context.viewModel.saved = contentState.going === previousGoing;
                            
                            // Trigger a state update event
                            send('STATE_REFRESHED', { 
                                contentState, 
                                previousGoing,
                                currentGoing: contentState.going 
                            });
                            
                            log('🌊 App Tome: State refreshed successfully', {
                                previousGoing,
                                currentGoing: contentState.going,
                                saved: context.viewModel.saved
                            });
                        }
                    } catch (error: any) {
                        log('🌊 App Tome: Failed to refresh state', error);
                        send('STATE_REFRESH_FAILED', { error: error.message });
                    }
                }
            },
            logStateRefresh: {
                type: 'function',
                fn: ({context, event, log}: any) => {
                    log('🌊 App Tome: State refreshed from content script', {
                        previousGoing: event.previousGoing,
                        currentGoing: event.currentGoing,
                        contentState: event.contentState
                    });
                }
            },
            logStateRefreshError: {
                type: 'function',
                fn: ({context, event, log}: any) => {
                    log('🌊 App Tome: Failed to refresh state from content script', event.error);
                }
            },
            completeStop: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Complete stop');
                }
            },
            updateSelector: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Update selector');
                }
            },
            updateSettings: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Update settings');
                }
            },
            handleError: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Handle error', event);
                    
                    // Update viewModel with error state
                    context.viewModel.error = event.error || 'Unknown error';
                    context.viewModel.saved = false;
                    
                    log(`🌊 App Tome: Error handled:`, event.error);
                }
            },
            updateViewModel: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Update viewModel', event);
                    
                    if (event.viewModel) {
                        context.viewModel = { ...context.viewModel, ...event.viewModel };
                        log(`🌊 App Tome: ViewModel updated:`, context.viewModel);
                    }
                }
            },
            markInitialized: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Mark initialized', event.viewModel);
                    
                    // Update viewModel with any passed data
                    if (event.viewModel) {
                        context.viewModel = { ...context.viewModel, ...event.viewModel };
                    }
                    
                    // Log the current viewModel state
                    log(`🌊 App Tome: ViewModel initialized:`, context.viewModel);
                }
            },
            handleInitError: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Handle init error', context);
                }
            },
            startApp: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Start app');
                }
            },
            stopApp: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Stop app');
                }
            },
            toggleApp: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Toggle app');
                }
            },
            handleKeyboardToggle: {
                type: 'function',
                fn: async ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Handle keyboard toggle', event);
                    
                    try {
                        // Send toggle message to content script via background script
                        const toggleMessage = {
                            name: 'toggle',
                            from: 'popup-state-machine'
                        };
                        
                        const response = await sendExtensionMessage(toggleMessage);
                        console.log('🌊 App Tome: Keyboard toggle response', response);
                        
                        // Update the viewModel going state
                        if (response && typeof response.success !== 'undefined') {
                            // Toggle the current going state in viewModel
                            context.viewModel.going = !context.viewModel.going;
                            context.viewModel.saved = false; // Mark as unsaved since state changed
                            
                            log(`🌊 App Tome: Updated viewModel.going to ${context.viewModel.going}`);
                        }
                        
                        // Send completion event
                        send('KEYBOARD_TOGGLE_COMPLETE');
                        
                    } catch (error: any) {
                        console.error('🌊 App Tome: Keyboard toggle error', error);
                        send('ERROR');
                    }
                }
            },
            completeKeyboardToggle: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Complete keyboard toggle');
                    
                    // Update viewModel if provided
                    if (event.viewModel) {
                        context.viewModel = { ...context.viewModel, ...event.viewModel };
                        log(`🌊 App Tome: ViewModel updated after keyboard toggle:`, context.viewModel);
                    }
                }
            },
            completeToggle: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Complete toggle');
                }
            },
            completeSelectorUpdate: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Complete selector update');
                }
            },
            completeSettingsUpdate: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Complete settings update');
                    log('🌊 App Tome: Settings update completed successfully');
                }
            },
            cancelSettingsUpdate: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Cancel settings update');
                    log('🌊 App Tome: Settings update cancelled by user');
                }
            },
            recoverFromError: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Recovering from error');
                    // Clear error state
                    context.viewModel.error = null;
                    log('🌊 App Tome: Error state cleared, returning to normal operation');
                }
            },
            resetApplication: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Resetting application');
                    // Reset viewModel to default state
                    context.viewModel = {
                        selector: '',
                        saved: true,
                        going: false,
                        selectors: [],
                        currentView: 'main',
                        isExtension: false,
                        settings: null,
                        showNotifications: true,
                        error: null
                    };
                    log('🌊 App Tome: Application reset to default state');
                }
            },
            handleStartError: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Handle start error');
                }
            },
            startWaveAnimation: {
                type: 'function',
                fn: async (context: any, event: any) => {
                    // Get current settings and create wave
                    const currentOptions = await context.settingsService?.getCurrentSettings() || {};
                    const options = new Options(currentOptions);
                    
                    // Create wave with current selector and settings
                    const wave = new Wave({ 
                        selector: context.viewModel.selector || 'p',
                        ...currentOptions.wave // Include all wave settings including waveSpeed
                    });
                    options.wave = wave.update();

                    // Show notification if enabled
                    if (options.showNotifications) {
                        try {
                            const notifOptions = {
                                type: "basic",
                                iconUrl: "icons/waver48.png",
                                title: "wave reader",
                                message: "reading",
                            };

                            // @ts-ignore
                            chrome.notifications.create("", notifOptions, guardLastError);
                        } catch (error) {
                            console.warn("Could not create notification:", error);
                        }
                    }

                    // Send start message
                    const startMessage = new StartMessage({ options });
                    await sendExtensionMessage(startMessage);
                    
                    // Update sync state
                    setSyncObject("going", { going: true });
                    context.viewModel.going = true;
                    context.viewModel.saved = true;
                    
                    console.log('🌊 Unified App: Wave reader started via extension');
                }
            },
            stopWaveAnimation: {
                type: 'function',
                fn: async ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Stopping wave animation');
                    try {
                        const stopMessage = new StopMessage();
                        await sendExtensionMessage(stopMessage);
                        
                        // Update sync state
                        setSyncObject("going", { going: false });
                        context.viewModel.going = false;
                        context.viewModel.saved = true;
                        
                        log('🌊 App Tome: Wave animation stopped successfully');
                        console.log('🌊 Unified App: Wave reader stopped via extension');
                    } catch (error: any) {
                        console.error('🌊 App Tome: Failed to stop wave animation', error);
                        send('ERROR');
                    }
                }
            },
            toggleWaveAnimation: {
                type: 'function',
                fn: ({ context, event, send, log, transition, machine, viewModel}: any) => {
                    if (viewModel.going) {
                        transition('stopWaveAnimation');
                    } else {
                        transition('startWaveAnimation');
                    }
                    viewModel.going = !viewModel.going;
                    send({ type: 'TOGGLE_COMPLETE' });
                }
                }
            }
        }
}).withState('idle', async ({ context, event, view, transition, send, log}: any) => {
    console.log('🌊 App Tome: In idle state', context.viewModel);
    log('🌊 App Tome: Idle state - ready for user interaction');
    
    // Render with tabs and structural components
    const tabContent = (
        <div>
            <h3>🌊 Wave Reader - Idle State</h3>
            <p>Ready for user interaction</p>
            <div style={{ marginBottom: '20px' }}>
                <p><strong>Machine Status:</strong></p>
                <p>State: {context.viewModel?.currentView || 'idle'}</p>
                <p>Going: {context.viewModel?.going ? 'Yes' : 'No'}</p>
                <p>Selector: {context.viewModel?.selector || 'None'}</p>
            </div>
            <div>
                <button 
                    onClick={() => send('START')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Start Wave
                </button>
                <button 
                    onClick={() => send('SETTINGS_UPDATE')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Settings
                </button>
            </div>
        </div>
    );
    
    view(tabContent);
}).withState('initializing', async ({ context, event, view, transition, send, log}: any) => {
    console.log('🌊 App Tome: Initializing', context.viewModel);
    log('🌊 App Tome: Initializing state - setting up application');
    
    // Simulate initialization process
    setTimeout(() => {
        send('INITIALIZATION_COMPLETE');
    }, 1000);
    
    const tabContent = (
        <div>
            <h3>🌊 Wave Reader - Initializing</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="spinner" style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #f3f3f3',
                    borderTop: '2px solid #007bff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p>Setting up application...</p>
            </div>
        </div>
    );
    
    view(tabContent);
}).withState('ready', async ({ context, event, view, transition, send, log}: any) => {
    console.log('🌊 App Tome: Ready', context.viewModel);
    log('🌊 App Tome: Ready state - application fully initialized');
    
    const tabContent = (
        <div>
            <h3>🌊 Wave Reader - Ready</h3>
            <p>Application fully initialized and ready to use</p>
            <div style={{ marginBottom: '20px' }}>
                <p><strong>System Status:</strong></p>
                <p>State: Ready</p>
                <p>Going: {context.viewModel?.going ? 'Yes' : 'No'}</p>
                <p>Selector: {context.viewModel?.selector || 'None'}</p>
            </div>
            <div>
                <button 
                    onClick={() => send('START')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Start Wave
                </button>
                <button 
                    onClick={() => send('TOGGLE')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#ffc107',
                        color: 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Toggle
                </button>
                <button 
                    onClick={() => send('SETTINGS_UPDATE')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Settings
                </button>
            </div>
        </div>
    );
    
    view(tabContent);
}).withState('starting', async ({ context, event, view, transition, send, log}: any) => {
    console.log('🌊 App Tome: Starting', context.viewModel);
    log('🌊 App Tome: Starting wave animation');
    
    // Simulate starting process
    setTimeout(() => {
        context.viewModel.going = true;
        send('START_COMPLETE');
    }, 500);
    
    const tabContent = (
        <div>
            <h3>🌊 Wave Reader - Starting</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="spinner" style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #f3f3f3',
                    borderTop: '2px solid #28a745',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p>Starting wave animation...</p>
            </div>
        </div>
    );
    
    view(tabContent);
}).withState('waving', async ({ context, event, view, transition, send, log}: any) => {
    console.log('🌊 App Tome: Waving', context.viewModel);
    log('🌊 App Tome: Wave animation active');
    
    const tabContent = (
        <div>
            <h3>🌊 Wave Reader - Active</h3>
            <div style={{ 
                padding: '20px', 
                backgroundColor: '#d4edda', 
                border: '1px solid #c3e6cb', 
                borderRadius: '4px',
                marginBottom: '20px'
            }}>
                <p style={{ margin: 0, color: '#155724' }}>
                    <strong>✅ Wave animation is active!</strong>
                </p>
                <p style={{ margin: '5px 0 0 0', color: '#155724' }}>
                    Reading with selector: <code>{context.viewModel?.selector || 'p'}</code>
                </p>
            </div>
            <div>
                <button 
                    onClick={() => send('STOP')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Stop Wave
                </button>
                <button 
                    onClick={() => send('TOGGLE')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#ffc107',
                        color: 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Toggle
                </button>
            </div>
        </div>
    );
    
    view(tabContent);
}).withState('stopping', async ({ context, event, view, transition, send, log}: any) => {
    console.log('🌊 App Tome: Stopping', context.viewModel);
    log('🌊 App Tome: Stopping wave animation');
    
    // Simulate stopping process
    setTimeout(() => {
        context.viewModel.going = false;
        send('STOP_COMPLETE');
    }, 500);
    
    const tabContent = (
        <div>
            <h3>🌊 Wave Reader - Stopping</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="spinner" style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #f3f3f3',
                    borderTop: '2px solid #dc3545',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p>Stopping wave animation...</p>
            </div>
        </div>
    );
    
    view(tabContent);
}).withState('selectorUpdating', async ({ context, event, view, transition, send, log}: any) => {
    console.log('🌊 App Tome: Selector updating', context.viewModel);
    log('🌊 App Tome: Updating selector');
    
    // Simulate selector update process
    setTimeout(() => {
        send('SELECTOR_UPDATE_COMPLETE');
    }, 300);
    
    const tabContent = (
        <div>
            <h3>🌊 Wave Reader - Updating Selector</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="spinner" style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #f3f3f3',
                    borderTop: '2px solid #007bff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p>Updating selector...</p>
            </div>
        </div>
    );
    
    view(tabContent);
}).withState('settingsUpdating', async ({ context, event, view, transition, send, log}: any) => {
    console.log('🌊 App Tome: Settings updating', context.viewModel);
    
    const onSettingsUpdated = (settings: any) => {
        console.log('🌊 App Tome: Settings updated callback triggered', settings);
        if (settings !== null) {
            // Update viewModel with new settings
            context.viewModel.settings = settings;
            context.viewModel.saved = false;
            log('🌊 App Tome: Settings saved to viewModel');
            send('SETTINGS_UPDATE_COMPLETE');
        } else {
            // Settings cancelled
            log('🌊 App Tome: Settings update cancelled');
            send('SETTINGS_UPDATE_CANCELLED');
        }
    };
    
    const tabContent = (
        <div>
            <h3>🌊 Wave Reader - Settings</h3>
            <div style={{ marginBottom: '20px' }}>
                <p>Configure your wave reader settings:</p>
                <Settings 
                    initialSettings={context.viewModel?.settings || {}}
                    onUpdateSettings={onSettingsUpdated}
                    domain={window.location.hostname}
                    path={window.location.pathname}
                    onDomainPathChange={(domain, path) => {
                        console.log('Domain/Path changed:', domain, path);
                    }}
                    settingsService={new SettingsService()}
                />
            </div>
            <div>
                <button 
                    onClick={() => send('SETTINGS_UPDATE_CANCELLED')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
    
    view(tabContent);
}).withState('error', async ({ context, event, view, transition, send, log}: any) => {
    console.log('🌊 App Tome: Error state', context.viewModel);
    
    // Auto-recover from error after 3 seconds
    setTimeout(() => {
        log('🌊 App Tome: Auto-recovering from error state');
        send('RECOVER');
    }, 3000);
    
    const tabContent = (
        <div>
            <h3>🌊 Wave Reader - Error</h3>
            <div style={{ 
                padding: '20px', 
                backgroundColor: '#f8d7da', 
                border: '1px solid #f5c6cb', 
                borderRadius: '4px',
                marginBottom: '20px'
            }}>
                <p style={{ margin: 0, color: '#721c24' }}>
                    <strong>❌ An error occurred</strong>
                </p>
                <p style={{ margin: '5px 0 0 0', color: '#721c24' }}>
                    Auto-recovering in 3 seconds...
                </p>
            </div>
            <div>
                <button 
                    onClick={() => send('RECOVER')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Recover Now
                </button>
            </div>
        </div>
    );
    
    view(tabContent);
});

// Wrap with adapter to implement ISubMachine interface
const AppMachine = new ViewMachineAdapter(AppMachineRaw);

const AppTome = createTomeConfig({
    id: 'app-tome',
    name: 'App Tome',
    description: 'App Tome',
    version: '1.0.0',
    machines: {
        'backgroundProxyMachine': BackgroundProxyMachine as any,
        'appMachine': AppMachine as any
    },
    dependencies: ['log-view-machine'],
    routing: {
        basePath: '/',
        routes: {
            'background-proxy-machine': {
                path: '/background-proxy-machine',
                method: 'POST',
                transformers: {
                    input: ({context, event, send, log, transition, machine}: any) => {
                        machine.parentMachine.send({event});
                    },
                    output: ({context, event, send, log, transition, machine}: any) => {
                        sendExtensionMessage(context.message);
                    }
                }
            },
            'app-machine': {
                path: '/app-machine',
                method: 'POST',
                transformers: {
                    input: ({context, event, send, log, transition, machine}: any) => {
                        // Defer to ViewStateMachine routing for XState events
                        console.log('🌊 App Machine: Processing XState event', event);
                        return machine.send(event);
                    },
                    output: ({context, event, send, log, transition, machine}: any) => {
                        // Handle output from ViewStateMachine
                        console.log('🌊 App Machine: XState output', event);
                        return context;
                    }
                }
            }
        }
    }
});

// AppTome.start();

const AppComponent: FunctionComponent = () => {
    const [selector, setSelector] = useState('p');
    const [saved, setSaved] = useState(true);
    const [going, setGoing] = useState(false);
    const [selectors, setSelectors] = useState<string[]>([]);
    const [currentView, setCurrentView] = useState('main');
    const [isExtension, setIsExtension] = useState(false);
    const [settings, setSettings] = useState<Options | null>(null);
    const [showNotifications, setShowNotifications] = useState(true);

    // Initialize services
    const settingsService = new SettingsService();
    const mlSettingsService = new MLSettingsService();

    const syncState = async () => {
        // Simplified sync state - just update local state
        console.log('🌊 App: Syncing state');
    }

    // Function to refresh state from content script
    const refreshStateFromContentScript = async () => {
        try {
                console.log('🌊 App: Triggered state refresh from content script');
        } catch (error) {
            console.error('🌊 App: Failed to trigger state refresh', error);
        }
    }

    // Set the global refresh function
    globalRefreshFunction = refreshStateFromContentScript;

    useEffect(() => {
        // Initialize AppMachine with viewModel
        const viewModel = {
            selector,
            saved,
            going,
            selectors,
            currentView,
            isExtension,
            settings,
            showNotifications
        };
        
        // Initialize the AppMachine
        // AppMachine.send('INITIALIZE');
        
        // Register and start the tome
        // TomeManager.getInstance().registerTome(AppTome);
        // TomeManager.getInstance().startTome('app-tome');
        
        // Set up ISubMachine event listeners to demonstrate the platform capabilities
        AppMachine.on('started', (data: any) => {
            console.log('🌊 App Machine started:', data);
        });
        
        AppMachine.on('stopped', (data: any) => {
            console.log('🌊 App Machine stopped:', data);
        });
        
        AppMachine.on('error', (data: any) => {
            console.error('🌊 App Machine error:', data);
        });
        
        BackgroundProxyMachine.on('started', (data: any) => {
            console.log('🌊 Background Proxy Machine started:', data);
        });
        
        BackgroundProxyMachine.on('error', (data: any) => {
            console.error('🌊 Background Proxy Machine error:', data);
        });
        
        console.log('🌊 AppTome: Initialized with viewModel:', viewModel);
        console.log('🌊 AppTome: Machine health status:', {
            appMachine: AppMachine.getHealth(),
            backgroundProxy: BackgroundProxyMachine.getHealth()
        });
    }, []);

    return (
        <ErrorBoundary>
            <WaveReader>
                <PopupHeader>
                    <h1>🌊 Wave Reader</h1>
                    <p>Motion Reader for Eye Tracking</p>
                </PopupHeader>
                
                <PopupContent>
                    {/* Use WaveTabs with structural components */}
                    <WaveTabs>
                        <div>
                            {/* Machine Status Tab */}
                            <div style={{ marginBottom: '20px' }}>
                                <h3>🔧 Machine Status</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div style={{ 
                                        padding: '15px', 
                                        backgroundColor: '#f8f9fa', 
                                        border: '1px solid #dee2e6', 
                                        borderRadius: '4px' 
                                    }}>
                                        <h4>Background Proxy Machine</h4>
                                        <p><strong>ID:</strong> {BackgroundProxyMachine.machineId}</p>
                                        <p><strong>Type:</strong> {BackgroundProxyMachine.machineType}</p>
                                        <p><strong>State:</strong> {BackgroundProxyMachine.getState().value}</p>
                                        <p><strong>Health:</strong> 
                                            <span style={{ 
                                                color: BackgroundProxyMachine.getHealth().status === 'healthy' ? '#28a745' : 
                                                       BackgroundProxyMachine.getHealth().status === 'degraded' ? '#ffc107' : '#dc3545'
                                            }}>
                                                {BackgroundProxyMachine.getHealth().status}
                                            </span>
                                        </p>
                                    </div>
                                    <div style={{ 
                                        padding: '15px', 
                                        backgroundColor: '#f8f9fa', 
                                        border: '1px solid #dee2e6', 
                                        borderRadius: '4px' 
                                    }}>
                                        <h4>App Machine</h4>
                                        <p><strong>ID:</strong> {AppMachine.machineId}</p>
                                        <p><strong>Type:</strong> {AppMachine.machineType}</p>
                                        <p><strong>State:</strong> {AppMachine.getState().value}</p>
                                        <p><strong>Health:</strong> 
                                            <span style={{ 
                                                color: AppMachine.getHealth().status === 'healthy' ? '#28a745' : 
                                                       AppMachine.getHealth().status === 'degraded' ? '#ffc107' : '#dc3545'
                                            }}>
                                                {AppMachine.getHealth().status}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* View Model Status */}
                            <div style={{ marginBottom: '20px' }}>
                                <h3>📊 View Model Status</h3>
                                <div style={{ 
                                    padding: '15px', 
                                    backgroundColor: '#e3f2fd', 
                                    border: '1px solid #bbdefb', 
                                    borderRadius: '4px' 
                                }}>
                                    <p><strong>Selector:</strong> {selector}</p>
                                    <p><strong>Going:</strong> {going ? 'Yes' : 'No'}</p>
                                    <p><strong>Saved:</strong> {saved ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                            
                            {/* Control Buttons */}
                            <div>
                                <h3>🎮 Controls</h3>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <button 
                                        onClick={() => AppMachine.send('TOGGLE')}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Toggle App Machine
                                    </button>
                                    <button 
                                        onClick={() => BackgroundProxyMachine.send('TOGGLE')}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Toggle Proxy Machine
                                    </button>
                                    <button 
                                        onClick={() => AppMachine.send('START')}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#17a2b8',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Start Wave
                                    </button>
                                    <button 
                                        onClick={() => AppMachine.send('SETTINGS_UPDATE')}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#6f42c1',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </WaveTabs>
                </PopupContent>
            </WaveReader>
        </ErrorBoundary>
    );
}

export { AppTome };
export default AppComponent;
