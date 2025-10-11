import React from 'react';
import { ISubMachine } from '../types/interfaces';

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

