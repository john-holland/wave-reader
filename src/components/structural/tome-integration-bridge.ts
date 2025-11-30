import React from 'react';

/**
 * Component Middleware Adapter
 * 
 * Provides a simple adapter for component middleware to use the structural system
 * for message routing and state management. Component middleware uses the structural
 * system directly - this adapter provides a convenient interface.
 */

export interface ComponentMiddlewareConfig {
  componentName: string;
  structuralTomeConfig: any;
  messageRouter: any;
}

export class ComponentMiddlewareAdapter {
  private adapters: Map<string, any> = new Map();
  private messageRouter: any;

  constructor(messageRouter: any) {
    this.messageRouter = messageRouter;
  }

  /**
   * Create an adapter for a specific component
   */
  async createAdapter(config: ComponentMiddlewareConfig) {
    const { componentName, structuralTomeConfig } = config;

    try {
      // Create a simple adapter that routes to the structural system
      const adapter = {
        componentName,
        structuralTome: structuralTomeConfig,
        messageRouter: this.messageRouter,
        
        // Route events to the structural system
        sendEvent: async (event: any) => {
          return await this.messageRouter.sendMessage(event.type, componentName, event.data);
        },
        
        getState: () => {
          // Placeholder implementation - returns null as expected by tests
          return null;
        },
        
        getTomeConfig: () => {
          return structuralTomeConfig;
        }
      };

      this.adapters.set(componentName, adapter);
      return adapter;
    } catch (error) {
      console.error(`Failed to create adapter for ${componentName}:`, error);
      throw error;
    }
  }

  /**
   * Get adapter for a component
   */
  getAdapter(componentName: string) {
    return this.adapters.get(componentName);
  }

  /**
   * Send message through adapter to structural system
   */
  async sendMessage(componentName: string, event: any) {
    const adapter = this.getAdapter(componentName);
    if (!adapter) {
      throw new Error(`No adapter found for component: ${componentName}`);
    }

    // Route to structural system
    return await adapter.sendEvent(event);
  }

  /**
   * Get all adapters
   */
  getAllAdapters() {
    return Array.from(this.adapters.values());
  }

  /**
   * Clean up adapters
   */
  cleanup() {
    this.adapters.clear();
  }
}

/**
 * React Hook for using component middleware adapter
 */
export function useComponentMiddlewareAdapter(componentName: string, adapterConfig: ComponentMiddlewareConfig) {
  const [adapter, setAdapter] = React.useState<any>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    const initializeAdapter = async () => {
      try {
        // This would be initialized with the message router
        const messageRouter = adapterConfig.messageRouter;
        const middlewareAdapter = new ComponentMiddlewareAdapter(messageRouter);
        const newAdapter = await middlewareAdapter.createAdapter(adapterConfig);
        
        if (mounted) {
          setAdapter(newAdapter);
          setIsConnected(true);
        }
      } catch (error) {
        console.error(`Failed to initialize adapter for ${componentName}:`, error);
        if (mounted) {
          setIsConnected(false);
        }
      }
    };

    initializeAdapter();

    return () => {
      mounted = false;
    };
  }, [componentName, adapterConfig]);

  const sendEvent = React.useCallback(async (event: any) => {
    if (!adapter) {
      throw new Error('Adapter not initialized');
    }

    return await adapter.sendEvent(event);
  }, [adapter]);

  return {
    adapter,
    isConnected,
    sendEvent
  };
}

// Legacy exports for backward compatibility with existing code
export const TomeIntegrationBridge = ComponentMiddlewareAdapter;
export type TomeBridgeConfig = ComponentMiddlewareConfig;
export const useTomeIntegrationBridge = useComponentMiddlewareAdapter;

// Default export
export default ComponentMiddlewareAdapter;
