import React from 'react';

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

