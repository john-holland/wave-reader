import React, { FunctionComponent, useEffect, useState, useCallback, useRef } from 'react'
import styled from "styled-components";
import './styles.scss';
import { ErrorBoundary } from './components/error-boundary';
import { Settings } from './components/settings';
import WaveTabs from './components/wave-tabs';
import Tab from './models/tab';
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
import { createProxyRobotCopyStateMachine, createTomeConfig, createViewStateMachine, TomeClient, createRobotCopy } from 'log-view-machine';
import SettingsTomes from './component-middleware/settings/SettingsTomes';
import AboutTome from './component-middleware/about/AboutTome';
import WaveTabsTomes from './component-middleware/wave-tabs/WaveTabsTomes';
import { actionTypes } from 'xstate/lib/actions';

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
    
    // State change subscription
    subscribe(callback: (data: any) => void): { unsubscribe: () => void };
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

    subscribe(callback: (data: any) => void): { unsubscribe: () => void } {
        return this.machine.subscribe?.(callback) || {
            unsubscribe: () => {
                console.log('🌊 ProxyMachineAdapter: No subscription to unsubscribe from');
            }
        };
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

    subscribe(callback: (data: any) => void): { unsubscribe: () => void } {
        return this.machine.subscribe?.(callback) || {
            unsubscribe: () => {
                console.log('🌊 ViewMachineAdapter: No subscription to unsubscribe from');
            }
        };
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

// New styled components for bifocal modal structure
const ModalContainer = styled.div`
  width: 400px;
  max-height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StartWaveButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CollapseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const TabNavigation = styled.div`
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
`;

const TabButton = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: ${props => props.isActive ? 'white' : 'transparent'};
  color: ${props => props.isActive ? '#667eea' : '#6c757d'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid ${props => props.isActive ? '#667eea' : 'transparent'};
  
  &:hover {
    background: ${props => props.isActive ? 'white' : 'rgba(102, 126, 234, 0.05)'};
    color: #667eea;
  }
`;

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const HowToContent = styled.div`
  line-height: 1.6;
  
  h3 {
    color: #2c3e50;
    margin-bottom: 16px;
    font-size: 1.2rem;
  }
  
  p {
    margin-bottom: 12px;
    color: #495057;
  }
  
  .shortcut {
    background: #e9ecef;
    padding: 8px 12px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    color: #495057;
    display: inline-block;
    margin: 4px 0;
  }
`;

const AboutContent = styled.div`
  line-height: 1.6;
  
  h3 {
    color: #2c3e50;
    margin-bottom: 16px;
    font-size: 1.2rem;
  }
  
  p {
    margin-bottom: 12px;
    color: #495057;
  }
  
  .donation-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    margin: 20px 0;
  }
  
  .donation-image {
    width: 60%;
    margin: 16px auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .donation-image img {
    width: 100%;
    height: auto;
    max-width: 300px;
    display: block;
  }
  
  .address {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    color: #6c757d;
    word-break: break-all;
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
    robotCopy: createRobotCopy({
        enableTracing: false, // Disable tracing in browser extension
        enableDataDog: false, // Disable DataDog in browser extension
        kotlinBackendUrl: typeof chrome !== 'undefined' && chrome.runtime?.id 
            ? `chrome-extension://${chrome.runtime.id}` 
            : 'chrome-extension://wave-reader',
        nodeBackendUrl: typeof chrome !== 'undefined' && chrome.runtime?.id 
            ? `chrome-extension://${chrome.runtime.id}` 
            : 'chrome-extension://wave-reader'
    })
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

// Sync system helper functions
const SyncSystem = {
    // Initialize sync - gather data from all sources
    async initializeSync(log: any, machine: any) {
        log('🌊 Sync System: Initializing sync from all sources...');
        
        const syncData = {
            cachedData: null as any,
            contentData: null as any,
            backgroundData: null as any
        };
        
        // Get cached data from Chrome storage
        syncData.cachedData = await this.getCachedData(log);
        
        // Get real-time data from content script via background
        syncData.contentData = await this.getContentScriptData(log, machine);
        
        // Get background script state
        syncData.backgroundData = await this.getBackgroundScriptData(log, machine);
        
        log('🌊 Sync System: All sync data gathered', syncData);
        return syncData;
    },
    
    async getCachedData(log: any) {
        const defaultData = {
            selector: '',
            saved: true,
            going: false,
            selectors: [],
            currentView: 'main',
            isExtension: false,
            settings: null,
            showNotifications: true
        };
        
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            try {
                const storageResult = await chrome.storage.sync.get([
                    'waveReaderSettings', 
                    'waveReaderSelectors',
                    'currentSelector',
                    'going',
                    'waveReaderCurrentView',
                    'waveReaderShowNotifications',
                    'lastSyncTimestamp'
                ]);
                
                const cachedData = {
                    ...defaultData,
                    selector: storageResult.currentSelector || '',
                    going: storageResult.going?.going || false,
                    selectors: storageResult.waveReaderSelectors || [],
                    currentView: storageResult.waveReaderCurrentView || 'main',
                    isExtension: true,
                    settings: storageResult.waveReaderSettings || null,
                    showNotifications: storageResult.waveReaderShowNotifications !== false,
                    lastSyncTimestamp: storageResult.lastSyncTimestamp || 0
                };
                
                log('🌊 Sync System: Loaded cached data from Chrome sync storage', cachedData);
                return cachedData;
            } catch (storageError) {
                log('🌊 Sync System: Failed to load from Chrome sync storage, using defaults', storageError);
            }
        }
        
        return defaultData;
    },
    
    async getContentScriptData(log: any, machine: any) {
        try {
            const statusResponse = await machine.parentMachine.getSubMachine('background-proxy')?.send({
                from: 'popup',
                name: 'get-status',
                timestamp: Date.now()
            });
            
            if (statusResponse && statusResponse.success) {
                const contentState = (statusResponse as any).data || statusResponse;
                const contentData = {
                    going: contentState.going || false,
                    selector: contentState.selector,
                    activeTab: contentState.activeTab,
                    lastActivity: contentState.lastActivity || Date.now()
                };
                
                log('🌊 Sync System: Retrieved content script data', contentData);
                return contentData;
            }
        } catch (error: any) {
            log('🌊 Sync System: Could not get content script data', error);
        }
        
        return null;
    },
    
    async getBackgroundScriptData(log: any, machine: any) {
        try {
            const healthResponse = await machine.parentMachine.getSubMachine('background-proxy')?.send({
                from: 'popup',
                name: 'health-check',
                timestamp: Date.now()
            });
            
            if (healthResponse && healthResponse.success) {
                const backgroundState = (healthResponse as any).data || healthResponse;
                const backgroundData = {
                    sessionId: backgroundState.sessionId,
                    activeConnections: backgroundState.activeConnections || 0,
                    healthStatus: backgroundState.status || 'unknown',
                    lastHeartbeat: backgroundState.lastHeartbeat || Date.now()
                };
                
                log('🌊 Sync System: Retrieved background script data', backgroundData);
                return backgroundData;
            }
        } catch (error: any) {
            log('🌊 Sync System: Could not get background script data', error);
        }
        
        return null;
    },
    
    async saveViewModelToStorage(viewModel: any, log: any) {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            try {
                await chrome.storage.sync.set({
                    currentSelector: viewModel.selector,
                    going: { going: viewModel.going },
                    waveReaderSelectors: viewModel.selectors,
                    waveReaderCurrentView: viewModel.currentView,
                    waveReaderShowNotifications: viewModel.showNotifications,
                    waveReaderSettings: viewModel.settings,
                    lastSyncTimestamp: Date.now()
                });
                log('🌊 Sync System: Saved viewModel to Chrome sync storage');
                return true;
            } catch (saveError) {
                log('🌊 Sync System: Failed to save viewModel to storage', saveError);
                return false;
            }
        }
        return false;
    },
    
    // Heartbeat sync - lightweight sync for active tabs
    async heartbeatSync(context: any, log: any, machine: any) {
        log('🌊 Sync System: Performing heartbeat sync...');
        
        try {
            // Send ping to background to get current state
            const pingResponse = await machine.parentMachine.getSubMachine('background-proxy')?.send({
                from: 'popup',
                name: 'ping',
                timestamp: Date.now(),
                currentState: {
                    going: context.viewModel.going,
                    selector: context.viewModel.selector
                }
            });
            
            if (pingResponse && pingResponse.success) {
                const updates = (pingResponse as any).data || {};
                
                // Apply lightweight updates
                let hasChanges = false;
                if (updates.going !== undefined && updates.going !== context.viewModel.going) {
                    context.viewModel.going = updates.going;
                    hasChanges = true;
                }
                
                if (updates.selector && updates.selector !== context.viewModel.selector) {
                    context.viewModel.selector = updates.selector;
                    hasChanges = true;
                }
                
                if (hasChanges) {
                    context.viewModel.saved = false;
                    context.viewModel.lastHeartbeat = Date.now();
                    log('🌊 Sync System: Heartbeat sync applied changes', updates);
                }
                
                return hasChanges;
            }
        } catch (error: any) {
            log('🌊 Sync System: Heartbeat sync failed', error);
        }
        
        return false;
    }
};


class AppMachineTab implements Tab {
    static nextFreeTabId = 0;
    id: number; 
    name: string;
    content: any;
    state: Record<string, any>;

    constructor(attributes: any = {
        id: AppMachineTab.nextFreeTabId++,
        name: 'New Tab',
        content: (<p>Tab Content Here!</p>),
        state: {}
    } as Partial<Tab>) {
        this.id = attributes.id;
        this.name = attributes.name;
        this.content = attributes.content;
        this.state = attributes.state || {};
    }
}

const tabs = [
    new AppMachineTab({ 
        id: 'how-to', label: 'How to', icon: 'ℹ️', enabled: true,
        content: (context: any, event: any, view: any, transition: any, send: any, log: any) => {
            return (<div>
                <p>Click "Start Wave" to animate the page.</p>
                <h3>Keyboard Shortcuts: </h3> <p>Toggle Wave: {context.viewModel.toggleKeys.keyChord.join(' + ')}</p>
            </div>)
        }
    }),
    new AppMachineTab({ 
        id: 'settings', label: 'Settings', icon: '⚙️', enabled: true,
        content: (context: any, event: any, view: any, transition: any, send: any, log: any) => {
            return (<SettingsTomes />)
        }
    }),
    new AppMachineTab({ id: 'about', label: 'About', icon: 'ℹ️', enabled: true,
        content: (context: any, event: any, view: any, transition: any, send: any, log: any) => {
            return (<AboutTome />)
        }
    })
];

const tabSectionTabView = createViewStateMachine({
    machineId: 'tab-section-tab-view',
    xstateConfig: {
        initial: 'idle',
        context: {
            activeTab: 'how-to',
            tabs: tabs
        },
        states: {
            idle: {
                on: {
                    TAB_CHANGE: { target: 'changing', actions: ['changeTab'] }
                }
            },
            changing: {
                on: {
                    TAB_SELECTION_COMPLETE: { target: 'idle', action: ['change'] }
                }
            }
        },
        actions: {
            changeTab: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    context.activeTab = event.tab;
                }
            },
            change: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine, clear}: any) => {
                    clear();
                }
            }
        }
    }
}).
withState('idle', async ({context, event, view, transition, send, log}: any) => {
    const tabContent = context.tabs[context.activeTab]?.content(context, event, view, transition, send, log) || <div>No content available for this tab</div>;
    view(tabContent);
}).
withState('changing', async ({context, event, view, transition, send, log, clear}: any) => {
    clear();
    send('TAB_SELECTION_COMPLETE');
});

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
                showNotifications: true,
                activeTab: 'how-to',
                isCollapsed: false
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
                    START_COMPLETE: { target: 'waving', actions: ['startApp'] },
                    START_FAILED: { target: 'error', actions: ['handleStartError'] }
                }
            },
            waving: {
                on: {
                    STOP: { target: 'stopping', actions: ['stopApp'] },
                    TOGGLE: { target: 'toggling', actions: ['toggleWaveAnimation'] },
                    SELECTOR_UPDATE: { target: 'selectorUpdating', actions: ['updateSelector'] },
                    SETTINGS_UPDATE: { target: 'settingsUpdating', actions: ['updateSettings'] },
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
                    SETTINGS_UPDATE_CANCELLED: { target: 'idle', actions: ['cancelSettingsUpdate'] },
                    SETTINGS_CHANGE: { target: 'settingsUpdating', actions: ['handleSettingsChange'] }
                },
                entry: 'updateSettings'
            },
            keyboardToggling: {
                on: { 
                    KEYBOARD_TOGGLE_COMPLETE: { target: 'idle', actions: ['toggleApp'] },
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
            toggleComplete: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Toggle complete');
                }
            },
            toggleCompleteWaving: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Toggle complete waving');
                }
            },
            toggleCollapse: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Toggle collapse');
                    context.viewModel.isCollapsed = !context.viewModel.isCollapsed;
                }
            },
            changeTab: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Change tab to', event.tab);
                    context.viewModel.activeTab = event.tab || 'how-to';
                }
            },
            // Helper function for data synchronization
            syncDataWithContentScript: {
                type: 'function',
                fn: async ({context, log, machine}: any) => {
                    log('🌊 App Tome: Syncing data with content script...');
                    
                    try {
                        const statusResponse = await machine.parentMachine.getSubMachine('background-proxy')?.send({
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
                    log('🌊 App Tome: Initialize app with proper sync system');
                    
                    try {
                        // Step 1: Initialize sync system - get state from all sources
                        const syncData = await SyncSystem.initializeSync(log, machine);
                        
                        // Step 2: Create merged viewModel with proper precedence
                        const viewModel = {
                            ...syncData.cachedData,
                            // Content script data takes precedence for critical state
                            ...(syncData.contentData && {
                                going: syncData.contentData.going,
                                selector: syncData.contentData.selector || syncData.cachedData.selector,
                                // Mark as unsaved if states differ
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
                            lastInitialized: Date.now()
                        };
                        
                        log('🌊 App Tome: Synchronized viewModel created', viewModel);
                        
                        // Step 3: Save synchronized state for consistency
                        await SyncSystem.saveViewModelToStorage(viewModel, log);
                        
                        // Step 4: Update context and complete initialization
                        context.viewModel = viewModel;
                        send('INITIALIZATION_COMPLETE');
                        
                    } catch (error: any) {
                        console.error('🌊 App Tome: Initialization failed', error);
                        context.viewModel.error = error.message || 'Initialization failed';
                        send('INITIALIZATION_FAILED', { error: error.message });
                    }
                }
            },
            // Heartbeat/ping sync - lightweight sync for active tabs
            refreshStateFromContentScript: {
                type: 'function',
                fn: async ({context, send, log, machine}: any) => {
                    log('🌊 App Tome: Performing heartbeat sync...');
                    
                    try {
                        // Use the sync system's heartbeat function
                        const hasChanges = await SyncSystem.heartbeatSync(context, log, machine);
                        
                        if (hasChanges) {
                            // Save updated state
                            await SyncSystem.saveViewModelToStorage(context.viewModel, log);
                            
                            // Trigger a state update event
                            send('STATE_REFRESHED', { 
                                hasChanges: true,
                                timestamp: Date.now()
                            });
                            
                            log('🌊 App Tome: Heartbeat sync completed with changes');
                        } else {
                            log('🌊 App Tome: Heartbeat sync completed - no changes');
                        }
                        
                    } catch (error: any) {
                        log('🌊 App Tome: Heartbeat sync failed', error);
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
                fn: async ({context, event, send, log, transition, machine}: any) => {
                    log('🌊 App Tome: Starting Wave Reader with sync...');
                    
                    try {
                        // Send start command to background
                        const response = await machine.parentMachine.getSubMachine('background-proxy')?.send('START');
                        
                        if (response && response.success) {
                            // Update viewModel state
                            context.viewModel.going = true;
                            context.viewModel.saved = false;
                            
                            // Sync and save state
                            await SyncSystem.saveViewModelToStorage(context.viewModel, log);
                            
                            log('🌊 App Tome: Wave Reader started successfully');
                            send('APP_STARTED');
                        } else {
                            throw new Error(response?.error || 'Failed to start Wave Reader');
                        }
                } catch (error: any) {
                        log('🌊 App Tome: Failed to start Wave Reader', error);
                        context.viewModel.error = error.message;
                        send('ERROR', { error: error.message });
                    }
                }
            },
            stopApp: {
                type: 'function',
                fn: async ({context, event, send, log, transition, machine}: any) => {
                    log('🌊 App Tome: Stopping Wave Reader with sync...');
                    
                    try {
                        // Send stop command to background
                        const response = await machine.parentMachine.getSubMachine('background-proxy')?.send('STOP');
                        
                        if (response && response.success) {
                            // Update viewModel state
                            context.viewModel.going = false;
                            context.viewModel.saved = false;
                            
                            // Sync and save state
                            await SyncSystem.saveViewModelToStorage(context.viewModel, log);
                            
                            log('🌊 App Tome: Wave Reader stopped successfully');
                            send('APP_STOPPED');
                        } else {
                            throw new Error(response?.error || 'Failed to stop Wave Reader');
                        }
                    } catch (error: any) {
                        log('🌊 App Tome: Failed to stop Wave Reader', error);
                        context.viewModel.error = error.message;
                        send('ERROR', { error: error.message });
                    }
                }
            },
            toggleApp: ({context, event, send, log, transition, machine}: any) => {
                console.log('🌊 App Tome: Toggle app action');
                
                try {
                    // Send toggle message to content script via background script
                    const toggleMessage = {
                        name: 'toggle',
                        from: 'popup-state-machine'
                    };
                    
                    const response = machine.parentMachine.getSubMachine('background-proxy')?.send('TOGGLE');
                    console.log('🌊 App Tome: Toggle response', response);
                    
                    // Update the viewModel going state
                    context.viewModel.going = !context.viewModel.going;
                    context.viewModel.saved = false; // Mark as unsaved since state changed
                    
                    log(`🌊 App Tome: Updated viewModel.going to ${context.viewModel.going}`);
                    
                    // Send appropriate completion event based on the new state
                    if (context.viewModel.going) {
                        send('TOGGLE_COMPLETE_WAVING');
                    } else {
                        send('TOGGLE_COMPLETE');
                    }
                    
                } catch (error: any) {
                    console.error('🌊 App Tome: Toggle error', error);
                    send('ERROR');
                }
            },
            handleKeyboardToggle: {
                type: 'function',
                fn: async ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Handle keyboard toggle', event);
                    send('')
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
            completeToggle: (context: any, event: any) => {
                console.log('🌊 App Tome: Complete toggle action');
                // Toggle completed successfully
                context.viewModel.saved = true;
            },
            completeToggleWaving: (context: any, event: any) => {
                console.log('🌊 App Tome: Complete toggle waving action');
                // Toggle to waving state completed successfully
                context.viewModel.saved = true;
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
                    
                    // Mark settings as saved
                    context.viewModel.saved = true;
                    
                    // Save settings to Chrome sync storage if available
                    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
                        try {
                            chrome.storage.sync.set({
                                'waveReaderSettings': context.viewModel.settings,
                                'waveReaderShowNotifications': context.viewModel.showNotifications,
                                'waveReaderCurrentView': context.viewModel.currentView,
                                'waveReaderSelector': context.viewModel.selector
                            });
                            console.log('🌊 App Tome: Settings saved to Chrome sync storage');
                        } catch (error) {
                            console.warn('🌊 App Tome: Failed to save settings to Chrome storage:', error);
                        }
                    }
                    
                    log('🌊 App Tome: Settings update completed successfully');
                    
                    // Transition back to idle state
                    send('SETTINGS_UPDATE_COMPLETE');
                }
            },
            cancelSettingsUpdate: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Cancel settings update');
                    
                    // Revert any unsaved changes by reloading from storage
                    // For now, just mark as saved to hide the edit indicator
                    context.viewModel.saved = true;
                    
                    log('🌊 App Tome: Settings update cancelled by user');
                    
                    // Transition back to idle state
                    send('SETTINGS_UPDATE_CANCELLED');
                }
            },
            handleSettingsChange: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Handle settings change', event);
                    
                    // Update the specific setting in the viewModel
                    if (event.key && event.value !== undefined) {
                        context.viewModel[event.key] = event.value;
                        context.viewModel.saved = false; // Mark as unsaved
                        
                        console.log('🌊 App Tome: Updated setting', event.key, 'to', event.value);
                    }
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
                fn: async (context: any, event: any, machine: any) => {
                    // Get current settings and create wave
                    debugger;
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
                    await machine.parentMachine.getSubMachine('background-proxy')?.send(startMessage);
                    
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
                        await machine.parentMachine.getSubMachine('background-proxy')?.send(stopMessage);
                        
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
                {tabSectionTabView.render(context)}
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
                {tabSectionTabView.render(context)}
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
                {tabSectionTabView.render(context)}
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
                {tabSectionTabView.render(context)}
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

// Create UI Component Tome Configurations
const WaveTabsTome = createTomeConfig({
    id: 'wave-tabs-tome',
    name: 'Wave Tabs Tome',
    description: 'UI Component Tome for Wave Tabs functionality',
    version: '1.0.0',
    machines: {
        'waveTabsMachine': {
            machineId: 'wave-tabs-machine',
            machineType: 'view',
            getState: () => ({ value: 'idle' }),
            getContext: () => ({ activeTab: 0, tabs: [] }),
            send: (event: any) => {
                console.log('🌊 WaveTabs Tome: Processing event', event);
                // Handle tab-related events
                if (event.type === 'TAB_CHANGE') {
                    console.log('🌊 WaveTabs Tome: Tab changed to', event.tabIndex);
                }
                return { success: true };
            },
            subscribe: (callback: any) => ({
                unsubscribe: () => console.log('🌊 WaveTabs Tome: Unsubscribed')
            })
        } as any
    },
    dependencies: ['log-view-machine'],
    routing: {
        basePath: '/ui/wave-tabs',
        routes: {
            'tab-management': {
                path: '/tab-management',
                method: 'POST',
                transformers: {
                    input: ({context, event, send, log, transition, machine}: any) => {
                        console.log('🌊 WaveTabs Tome: Processing tab event', event);
                        return machine.send(event);
                    },
                    output: ({context, event, send, log, transition, machine}: any) => {
                        console.log('🌊 WaveTabs Tome: Tab output', event);
                        return context;
                    }
                }
            }
        }
    }
});

const SettingsTome = createTomeConfig({
    id: 'settings-tome',
    name: 'Settings Tome',
    description: 'UI Component Tome for Settings functionality',
    version: '1.0.0',
    machines: {
        'settingsMachine': {
            machineId: 'settings-machine',
            machineType: 'view',
            getState: () => ({ value: 'idle' }),
            getContext: () => ({ settings: {}, isOpen: false }),
            send: (event: any) => {
                console.log('🌊 Settings Tome: Processing event', event);
                if (event.type === 'SETTINGS_UPDATE') {
                    console.log('🌊 Settings Tome: Settings updated', event.settings);
                }
                return { success: true };
            },
            subscribe: (callback: any) => ({
                unsubscribe: () => console.log('🌊 Settings Tome: Unsubscribed')
            })
        } as any
    },
    dependencies: ['log-view-machine'],
    routing: {
        basePath: '/ui/settings',
        routes: {
            'settings-management': {
                path: '/settings-management',
                method: 'POST',
                transformers: {
                    input: ({context, event, send, log, transition, machine}: any) => {
                        console.log('🌊 Settings Tome: Processing settings event', event);
                        return machine.send(event);
                    },
                    output: ({context, event, send, log, transition, machine}: any) => {
                        console.log('🌊 Settings Tome: Settings output', event);
                        return context;
                    }
                }
            }
        }
    }
});

const appTomeConfig = {
    id: 'app-tome',
    name: 'App Tome',
    description: 'Main Application Tome with integrated UI components',
    version: '1.0.0',
    machines: {
        'backgroundProxyMachine': BackgroundProxyMachine as any,
        'appMachine': AppMachine as any,
        'waveTabsTome': WaveTabsTome as any,
        'settingsTome': SettingsTome as any
    },
    dependencies: ['log-view-machine'],
    render: () => {
        // Get current state from the app machine
        const appState = AppMachine.getState();
        const appContext = AppMachine.getContext();
        
        console.log('🌊 AppTome: Rendering with state:', appState.value);
        
        // PAMSwitch Configuration - controls which non-structural features are enabled
        const PAMSwitch = {
            enableProxyControls: true,   // Set to true to enable proxy-dependent controls
            enableDebugControls: true,   // Set to false to hide debug/development controls
            enableAdvancedSettings: false // Set to true to show advanced settings options
        };

        // Render control buttons that work with the state machine (PAMSwitch controlled)
        const renderControlButtons = () => {
            const isGoing = appContext.viewModel?.going;
            const isWaving = appState.value === 'waving';
            
            return (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {/* Core structural controls - always available */}
                    <button
                        onClick={() => {
                            console.log('🌊 App: Settings button clicked');
                            AppMachine.send('SETTINGS_UPDATE');
                        }}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => (e.target as HTMLButtonElement).style.opacity = '0.9'}
                        onMouseOut={(e) => (e.target as HTMLButtonElement).style.opacity = '1'}
                    >
                        ⚙️ Settings
                    </button>

                    {/* PAMSwitch: Debug/Development controls */}
                    {PAMSwitch.enableDebugControls && (
                        <button
                            onClick={() => {
                                console.log('🌊 App: State info button clicked');
                                console.log('Current state:', appState.value);
                                console.log('Context:', appContext);
                                console.log('PAMSwitch config:', PAMSwitch);
                            }}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#17a2b8',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => (e.target as HTMLButtonElement).style.opacity = '0.9'}
                            onMouseOut={(e) => (e.target as HTMLButtonElement).style.opacity = '1'}
                        >
                            📊 State Info
                        </button>
                    )}

                    {/* PAMSwitch: Proxy-dependent controls */}
                    {PAMSwitch.enableProxyControls && (
                        <>
                            <button
                                onClick={() => {
                                    console.log('🌊 App: Toggle button clicked (proxy enabled)');
                                    AppMachine.send('TOGGLE');
                                }}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: isGoing ? '#dc3545' : '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => (e.target as HTMLButtonElement).style.opacity = '0.9'}
                                onMouseOut={(e) => (e.target as HTMLButtonElement).style.opacity = '1'}
                            >
                                {isGoing ? '🛑 Stop Wave' : '🌊 Start Wave'}
                            </button>
                            
                            <button
                                onClick={() => {
                                    console.log('🌊 App: Refresh button clicked (proxy enabled)');
                                    AppMachine.send('REFRESH_STATE');
                                }}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#17a2b8',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => (e.target as HTMLButtonElement).style.opacity = '0.9'}
                                onMouseOut={(e) => (e.target as HTMLButtonElement).style.opacity = '1'}
                            >
                                🔄 Refresh
                            </button>
                        </>
                    )}

                    {/* PAMSwitch: Advanced settings controls */}
                    {PAMSwitch.enableAdvancedSettings && (
                        <button
                            onClick={() => {
                                console.log('🌊 App: Advanced settings clicked');
                                // Toggle PAMSwitch settings (for development)
                                console.log('Current PAMSwitch config:', PAMSwitch);
                            }}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#6f42c1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => (e.target as HTMLButtonElement).style.opacity = '0.9'}
                            onMouseOut={(e) => (e.target as HTMLButtonElement).style.opacity = '1'}
                        >
                            🔧 Advanced
                        </button>
                    )}

                    {/* PAMSwitch status indicator */}
                    {PAMSwitch.enableDebugControls && (
                        <div style={{
                            padding: '5px 10px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: '#6c757d',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            <span>PAM:</span>
                            {PAMSwitch.enableProxyControls && <span style={{color: '#28a745'}}>🔗</span>}
                            {PAMSwitch.enableDebugControls && <span style={{color: '#17a2b8'}}>🐛</span>}
                            {PAMSwitch.enableAdvancedSettings && <span style={{color: '#6f42c1'}}>⚙️</span>}
                        </div>
                    )}

                    {/* Observer Status Button */}
                    {PAMSwitch.enableDebugControls && (
                        <button
                            onClick={() => {
                                console.log('🌊 App: Observer status clicked');
                                const status = appTomeObserver.getStatus();
                                console.log('Observer Status:', status);
                                
                                // Show observer status in an alert for now
                                alert(`Observer Status:
• Observing: ${status.isObserving ? 'Yes' : 'No'}
• Last Sync: ${new Date(status.lastSyncTime).toLocaleTimeString()}
• Sync Interval: ${status.syncIntervalMs}ms
• Tome ID: ${status.tomeId}`);
                            }}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => (e.target as HTMLButtonElement).style.opacity = '0.9'}
                            onMouseOut={(e) => (e.target as HTMLButtonElement).style.opacity = '1'}
                        >
                            📡 Observer
                        </button>
                    )}
                </div>
            );
        };
        
        // Render based on current state
        switch (appState.value) {
            case 'idle':
                const hasUnsavedChangesIdle = !appContext.viewModel?.saved;
                
                return (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <h3>🌊 Wave Reader - Idle State</h3>
                        <p>Ready for user interaction</p>
                        
                        {/* Edit Indicator */}
                        {hasUnsavedChangesIdle && (
                            <div style={{
                                padding: '8px 12px',
                                backgroundColor: '#fff3cd',
                                border: '1px solid #ffeaa7',
                                borderRadius: '6px',
                                color: '#856404',
                                fontSize: '14px',
                                fontWeight: '500',
                                margin: '10px 0',
                                display: 'inline-block'
                            }}>
                                ⚠️ You have unsaved changes
                            </div>
                        )}
                        
                        <div style={{ marginBottom: '20px' }}>
                            <p><strong>Machine Status:</strong> {appState.value}</p>
                            <p><strong>Going:</strong> {appContext.viewModel?.going ? 'Yes' : 'No'}</p>
                            <p><strong>Selector:</strong> {appContext.viewModel?.selector || 'None'}</p>
                            <p><strong>Saved:</strong> {appContext.viewModel?.saved ? 'Yes' : 'No'}</p>
                        </div>
                        {renderControlButtons()}
                    </div>
                );
            case 'initializing':
                return (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <h3>🌊 Wave Reader - Initializing</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="spinner" style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid #f3f3f3',
                                borderTop: '2px solid #3498db',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <span>Setting up application...</span>
                        </div>
                    </div>
                );
            case 'waving':
                return (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <h3>🌊 Wave Reader - Waving</h3>
                        <p>Wave animation is active</p>
                        <div style={{ marginBottom: '20px' }}>
                            <p><strong>Machine Status:</strong> {appState.value}</p>
                            <p><strong>Going:</strong> {appContext.viewModel?.going ? 'Yes' : 'No'}</p>
                            <p><strong>Selector:</strong> {appContext.viewModel?.selector || 'None'}</p>
                        </div>
                        {renderControlButtons()}
                    </div>
                );
            case 'settingsUpdating':
                const hasUnsavedChanges = !appContext.viewModel?.saved;
                
                return (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <h3>🌊 Wave Reader - Settings</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <p><strong>Machine Status:</strong> {appState.value}</p>
                            <p>Configure your Wave Reader settings below:</p>
                            
                            {/* Edit Indicator */}
                            {hasUnsavedChanges && (
                                <div style={{
                                    padding: '8px 12px',
                                    backgroundColor: '#fff3cd',
                                    border: '1px solid #ffeaa7',
                                    borderRadius: '6px',
                                    color: '#856404',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    margin: '10px 0',
                                    display: 'inline-block'
                                }}>
                                    ⚠️ You have unsaved changes
                                </div>
                            )}
                        </div>
                        
                        {/* Settings Modal Content */}
                        <div style={{
                            background: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '20px',
                            textAlign: 'left'
                        }}>
                            <h4 style={{ marginTop: 0, color: '#495057' }}>⚙️ Settings Configuration</h4>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                    Show Notifications:
                                </label>
                                <input
                                    type="checkbox"
                                    checked={appContext.viewModel?.showNotifications !== false}
                                    onChange={(e) => {
                                        // Update settings through state machine
                                        AppMachine.send({
                                            type: 'SETTINGS_CHANGE',
                                            key: 'showNotifications',
                                            value: e.target.checked
                                        });
                                    }}
                                    style={{ marginRight: '8px' }}
                                />
                                <span>Enable notification popups</span>
                            </div>
                            
                            {/* Domain-specific setting: Wave State */}
                            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '6px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#6c757d' }}>
                                    🌊 Wave State (Domain-specific):
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        padding: '4px 12px',
                                        backgroundColor: appContext.viewModel?.going ? '#28a745' : '#6c757d',
                                        color: 'white',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: '500'
                                    }}>
                                        {appContext.viewModel?.going ? '🟢 Active' : '⚫ Inactive'}
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#6c757d' }}>
                                        {appContext.viewModel?.going ? 'Wave animation is running' : 'Wave animation is stopped'}
                                    </span>
                                </div>
                                <div style={{ fontSize: '11px', color: '#6c757d', marginTop: '4px' }}>
                                    This setting changes automatically and is specific to each website
                                </div>
                            </div>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                    Current View:
                                </label>
                                <select
                                    value={appContext.viewModel?.currentView || 'main'}
                                    onChange={(e) => {
                                        AppMachine.send({
                                            type: 'SETTINGS_CHANGE',
                                            key: 'currentView',
                                            value: e.target.value
                                        });
                                    }}
                                    style={{
                                        padding: '8px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="main">Main View</option>
                                    <option value="compact">Compact View</option>
                                    <option value="detailed">Detailed View</option>
                                </select>
                            </div>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                    CSS Selector:
                                </label>
                                <input
                                    type="text"
                                    value={appContext.viewModel?.selector || ''}
                                    onChange={(e) => {
                                        AppMachine.send({
                                            type: 'SELECTOR_UPDATE',
                                            selector: e.target.value
                                        });
                                    }}
                                    placeholder="Enter CSS selector for elements to wave"
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                        </div>
                        
                        {/* Settings Action Buttons */}
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                onClick={() => AppMachine.send('SETTINGS_UPDATE_COMPLETE')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                ✅ Save Settings
                            </button>
                            <button
                                onClick={() => AppMachine.send('SETTINGS_UPDATE_CANCELLED')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </div>
                );
            case 'error':
                return (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>
                        <h3>🌊 Wave Reader - Error</h3>
                        <p>An error occurred. Auto-recovering...</p>
                        <div style={{ marginBottom: '20px' }}>
                            <p><strong>Machine Status:</strong> {appState.value}</p>
                        </div>
                        {renderControlButtons()}
                    </div>
                );
            default:
                return (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <h3>🌊 Wave Reader - {appState.value}</h3>
                        <p>Current state: {appState.value}</p>
                        <div style={{ marginBottom: '20px' }}>
                            <p><strong>Going:</strong> {appContext.viewModel?.going ? 'Yes' : 'No'}</p>
                            <p><strong>Selector:</strong> {appContext.viewModel?.selector || 'None'}</p>
                        </div>
                        {renderControlButtons()}
                    </div>
                );
        }
    },
    routing: {
        basePath: '/',
        routes: {
            'background-proxy-machine': {
                path: '/background-proxy-machine',
                method: 'POST',
                transformers: {
                    input: async ({context, event, send, log, transition, machine}: any) => {
                        console.log('POPUP->BACKGROUND: Sending message to background script:', event);
                        
                        // Convert our internal events to background script message format
                        let messageType = event;
                        if (typeof event === 'string') {
                            switch (event) {
                                case 'TOGGLE':
                                    messageType = 'TOGGLE_WAVE_READER';
                                    break;
                                case 'START':
                                    messageType = 'START_WAVE_READER';
                                    break;
                                case 'STOP':
                                    messageType = 'STOP_WAVE_READER';
                                    break;
                                default:
                                    messageType = event;
                            }
                        } else if (event.type) {
                            messageType = event.type;
                        }
                        
                        // Send message to background script
                        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                            try {
                                const response: any = await chrome.runtime.sendMessage({
                                    type: messageType,
                                    source: 'popup',
                                    target: 'background',
                                    data: event,
                                    timestamp: Date.now()
                                });
                                console.log('BACKGROUND->POPUP: Background script response:', response);
                                
                                // Sync viewModel after successful background operation
                                if (response && response.success) {
                                    machine.parentMachine.getSubMachine('appMachine')?.send({
                                        type: 'SYNC_VIEWMODEL',
                                        data: response
                                    });
                                }
                                
                                return response;
        } catch (error) {
                                console.error('POPUP->BACKGROUND: Failed to send message to background script:', error);
                                return { success: false, error: error instanceof Error ? error.message : String(error) };
                            }
                        } else {
                            console.warn('🌊 AppTome: Chrome runtime not available');
                            return { success: false, error: 'Chrome runtime not available' };
                        }
                    },
                    output: ({context, event, send, log, transition, machine}: any) => {
                        return context;
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
            },
            'wave-tabs-tome': {
                path: '/ui/wave-tabs',
                method: 'POST',
                transformers: {
                    input: ({context, event, send, log, transition, machine}: any) => {
                        console.log('🌊 App Tome: Routing to WaveTabs Tome', event);
                        // Route to WaveTabs Tome
                        return machine.parentMachine.getSubMachine('waveTabsTome')?.send(event);
                    },
                    output: ({context, event, send, log, transition, machine}: any) => {
                        console.log('🌊 App Tome: WaveTabs Tome output', event);
                        // Handle output from WaveTabs Tome
                        return context;
                    }
                }
            },
            'settings-tome': {
                path: '/ui/settings',
                method: 'POST',
                transformers: {
                    input: ({context, event, send, log, transition, machine}: any) => {
                        console.log('🌊 App Tome: Routing to Settings Tome', event);
                        // Route to Settings Tome
                        return machine.parentMachine.getSubMachine('settingsTome')?.send(event);
                    },
                    output: ({context, event, send, log, transition, machine}: any) => {
                        console.log('🌊 App Tome: Settings Tome output', event);
                        // Handle output from Settings Tome
                        return context;
                    }
                }
            }
        }
    }
} as any;

const AppTome = createTomeConfig(appTomeConfig);

// Recursive Observer System for AppTome Machines
class AppTomeObserver {
    private tome: any;
    private syncInterval: NodeJS.Timeout | null = null;
    private isObserving = false;
    private lastSyncTime = 0;
    private syncIntervalMs = 5000; // Sync every 5 seconds

    constructor(tome: any) {
        this.tome = tome;
        console.log('🌊 AppTomeObserver: Initialized for', tome.id);
    }

    // Start observing all machines recursively
    startObserving() {
        if (this.isObserving) {
            console.log('🌊 AppTomeObserver: Already observing');
            return;
        }

        console.log('🌊 AppTomeObserver: Starting recursive observation');
        this.isObserving = true;

        // Set up recursive observers for all machines
        this.setupMachineObservers();

        // Set up periodic sync to Google storage
        this.startPeriodicSync();

        console.log('🌊 AppTomeObserver: Observation started');
    }

    // Stop observing
    stopObserving() {
        if (!this.isObserving) {
            console.log('🌊 AppTomeObserver: Not currently observing');
            return;
        }

        console.log('🌊 AppTomeObserver: Stopping observation');
        this.isObserving = false;

        // Clear sync interval
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }

        console.log('🌊 AppTomeObserver: Observation stopped');
    }

    // Set up observers for all machines recursively
    private setupMachineObservers() {
        const machines = this.tome.machines || {};
        
        Object.keys(machines).forEach(machineId => {
            const machine = machines[machineId];
            console.log('🌊 AppTomeObserver: Setting up observer for', machineId);
            
            // Subscribe to state changes
            if (machine && typeof machine.subscribe === 'function') {
                machine.subscribe((stateData: any) => {
                    console.log(`🌊 AppTomeObserver: State change detected in ${machineId}:`, stateData);
                    this.handleMachineStateChange(machineId, stateData);
                });
            }

            // If it's a tome with sub-machines, observe recursively
            if (machine && machine.machines) {
                console.log(`🌊 AppTomeObserver: ${machineId} has sub-machines, observing recursively`);
                this.observeSubTomeRecursively(machineId, machine);
            }
        });
    }

    // Recursively observe sub-tomes
    private observeSubTomeRecursively(parentId: string, tome: any) {
        const machines = tome.machines || {};
        
        Object.keys(machines).forEach(machineId => {
            const fullMachineId = `${parentId}.${machineId}`;
            const machine = machines[machineId];
            
            console.log(`🌊 AppTomeObserver: Setting up recursive observer for ${fullMachineId}`);
            
            if (machine && typeof machine.subscribe === 'function') {
                machine.subscribe((stateData: any) => {
                    console.log(`🌊 AppTomeObserver: Recursive state change in ${fullMachineId}:`, stateData);
                    this.handleMachineStateChange(fullMachineId, stateData);
                });
            }

            // Continue recursion if this machine also has sub-machines
            if (machine && machine.machines) {
                this.observeSubTomeRecursively(fullMachineId, machine);
            }
        });
    }

    // Handle state changes from any machine
    private handleMachineStateChange(machineId: string, stateData: any) {
        console.log(`🌊 AppTomeObserver: Processing state change for ${machineId}`);
        
        // Update last sync time to indicate activity
        this.lastSyncTime = Date.now();
        
        // Trigger immediate sync if this is a critical state change
        if (this.isCriticalStateChange(stateData)) {
            console.log(`🌊 AppTomeObserver: Critical state change detected, triggering immediate sync`);
            this.syncToStorage();
        }
    }

    // Determine if a state change is critical and needs immediate sync
    private isCriticalStateChange(stateData: any): boolean {
        // Define critical state changes that need immediate sync
        const criticalStates = ['error', 'settingsUpdating', 'saved'];
        const stateValue = stateData?.value || stateData?.type;
        
        return criticalStates.some(critical => 
            stateValue?.includes?.(critical) || 
            stateData?.saved === false ||
            stateData?.type === 'settings_change'
        );
    }

    // Start periodic sync to Google storage
    private startPeriodicSync() {
        console.log('🌊 AppTomeObserver: Starting periodic sync to Google storage');
        
        this.syncInterval = setInterval(() => {
            if (this.isObserving) {
                this.syncToStorage();
            }
        }, this.syncIntervalMs);
    }

    // Sync all machine states to Google storage
    private async syncToStorage() {
        try {
            console.log('🌊 AppTomeObserver: Syncing machine states to Google storage');
            
            const machineStates = this.collectAllMachineStates();
            const syncData = {
                timestamp: Date.now(),
                tomeId: this.tome.id,
                machineStates,
                lastSync: this.lastSyncTime
            };

            // Save to Chrome sync storage (Google storage in extension context)
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
                await chrome.storage.sync.set({
                    [`waveReaderTomeStates_${this.tome.id}`]: syncData
                });
                console.log('🌊 AppTomeObserver: Successfully synced to Google storage');
            } else {
                console.warn('🌊 AppTomeObserver: Chrome storage not available, using localStorage fallback');
                localStorage.setItem(`waveReaderTomeStates_${this.tome.id}`, JSON.stringify(syncData));
            }

        } catch (error) {
            console.error('🌊 AppTomeObserver: Failed to sync to storage:', error);
        }
    }

    // Collect states from all machines recursively
    private collectAllMachineStates(): any {
        const states: any = {};
        
        const collectFromMachine = (machineId: string, machine: any, prefix = '') => {
            const fullId = prefix ? `${prefix}.${machineId}` : machineId;
            
            try {
                // Get current state and context
                const state = machine.getState?.() || { value: 'unknown' };
                const context = machine.getContext?.() || {};
                const health = machine.getHealth?.() || { status: 'unknown' };
                
                states[fullId] = {
                    state,
                    context,
                    health,
                    timestamp: Date.now(),
                    machineType: machine.machineType || 'unknown'
                };

                // Recursively collect from sub-machines
                if (machine.machines) {
                    Object.keys(machine.machines).forEach(subMachineId => {
                        collectFromMachine(subMachineId, machine.machines[subMachineId], fullId);
                    });
                }
            } catch (error) {
                console.warn(`🌊 AppTomeObserver: Failed to collect state from ${fullId}:`, error);
                states[fullId] = {
                    error: error instanceof Error ? error.message : String(error),
                    timestamp: Date.now()
                };
            }
        };

        // Collect from all root machines
        const machines = this.tome.machines || {};
        Object.keys(machines).forEach(machineId => {
            collectFromMachine(machineId, machines[machineId]);
        });

        return states;
    }

    // Get observer status
    getStatus() {
        return {
            isObserving: this.isObserving,
            lastSyncTime: this.lastSyncTime,
            syncIntervalMs: this.syncIntervalMs,
            tomeId: this.tome.id
        };
    }
}

// Initialize and start the observer
const appTomeObserver = new AppTomeObserver(AppTome);
appTomeObserver.startObserving();

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
    
    // New state for modal structure
    const [activeTab, setActiveTab] = useState<'how-to' | 'settings' | 'about'>('how-to');
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Add state for reactive UI updates
    const [appMachineState, setAppMachineState] = useState(AppMachine.getState());
    const [proxyMachineState, setProxyMachineState] = useState(BackgroundProxyMachine.getState());
    const [appMachineContext, setAppMachineContext] = useState(AppMachine.getContext());
    const [proxyMachineContext, setProxyMachineContext] = useState(BackgroundProxyMachine.getContext());
    
    // State for tome rendering
    const [tomeRenderKey, setTomeRenderKey] = useState(0);
    
    // Set up UI component communication
    const handleUIComponentEvent = (event: any) => {
        console.log('🌊 App Component: UI component event received', event);
        
        // Route UI events to appropriate tomes
        switch (event.source) {
            case 'wave-tabs':
                console.log('🌊 App Component: Routing to WaveTabs Tome');
                // You can access the tome through the AppTome
                break;
            case 'settings':
                console.log('🌊 App Component: Routing to Settings Tome');
                // You can access the tome through the AppTome
                break;
            default:
                console.log('🌊 App Component: Unknown UI component', event.source);
        }
    };

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
        
        // Set up state change listeners for reactive UI
        const handleAppMachineStateChange = (data: any) => {
            console.log('🌊 App Component: App machine state changed', data);
            setAppMachineState(AppMachine.getState());
            setAppMachineContext(AppMachine.getContext());
            // Trigger tome re-render
            setTomeRenderKey(prev => prev + 1);
        };
        
        const handleProxyMachineStateChange = (data: any) => {
            console.log('🌊 App Component: Proxy machine state changed', data);
            setProxyMachineState(BackgroundProxyMachine.getState());
            setProxyMachineContext(BackgroundProxyMachine.getContext());
        };
        
        // Subscribe to state changes
        const appSubscription = AppMachine.subscribe?.(handleAppMachineStateChange);
        const proxySubscription = BackgroundProxyMachine.subscribe?.(handleProxyMachineStateChange);
        
        // Subscribe to tome events for reactive rendering
        const handleTomeRender = (data: any) => {
            console.log('🌊 App Component: Tome render event', data);
            setTomeRenderKey(prev => prev + 1);
        };
        
        (AppTome as any).on('render', handleTomeRender);
        
        return () => {
            appSubscription?.unsubscribe?.();
            proxySubscription?.unsubscribe?.();
            (AppTome as any).off('render', handleTomeRender);
        };
    }, []);

    // Helper functions for tab management
    const handleTabChange = (tab: 'how-to' | 'settings' | 'about') => {
        AppMachine.send({ type: 'TAB_CHANGE', tab });
    };

    const handleToggleCollapse = () => {
        AppMachine.send({ type: 'TOGGLE_COLLAPSE' });
    };

    const handleStartWave = () => {
        AppMachine.send({ type: 'START' });
    };

    return (
        <ErrorBoundary>
            <ModalContainer>
                <ModalHeader>
                    <HeaderTitle>🌊 Wave Reader</HeaderTitle>
                    <HeaderActions>
                        <StartWaveButton onClick={handleStartWave}>
                            {going ? 'Stop Wave' : 'Start Wave'}
                        </StartWaveButton>
                        <CollapseButton 
                            onClick={handleToggleCollapse}
                            title={isCollapsed ? 'Expand tabs' : 'Collapse tabs'}
                        >
                            {isCollapsed ? '⇲' : '⇳'}
                        </CollapseButton>
                    </HeaderActions>
                </ModalHeader>
                
                {!isCollapsed && (
                    <>
                        <TabNavigation>
                            <TabButton 
                                isActive={activeTab === 'how-to'}
                                onClick={() => handleTabChange('how-to')}
                            >
                                How to
                            </TabButton>
                            <TabButton 
                                isActive={activeTab === 'settings'}
                                onClick={() => handleTabChange('settings')}
                            >
                                Settings
                            </TabButton>
                            <TabButton 
                                isActive={activeTab === 'about'}
                                onClick={() => handleTabChange('about')}
                            >
                                About
                            </TabButton>
                        </TabNavigation>
                        
                        <TabContent>
                            {activeTab === 'how-to' && (
                                <HowToContent>
                                    <h3>🌊 How to Use Wave Reader</h3>
                                    <p>Click "Start Wave" to animate the page and help with reading comprehension.</p>
                                    <p>
                                        <strong>Keyboard Shortcut:</strong> 
                                        <span className="shortcut">Alt + S</span> to toggle page animation
                                    </p>
                                    <p>
                                        The wave animation applies gentle wobble effects to text elements, 
                                        helping your eyes follow the content more naturally and reducing eye strain.
                                    </p>
                                </HowToContent>
                            )}
                            
                            {activeTab === 'settings' && (
                                <SettingsTomes />
                            )}
                            
                            {activeTab === 'about' && (
                                <AboutTome />
                            )}
                        </TabContent>
                    </>
                )}
            </ModalContainer>
        </ErrorBoundary>
    );
}

export { AppTome };
export default AppComponent;
