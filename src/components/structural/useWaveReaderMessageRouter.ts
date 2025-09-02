import { useCallback, useEffect, useState, useRef } from 'react';
import { waveReaderMessageRouter, WaveReaderMessage, MessageRoutingResult } from './wave-reader-message-router';

/**
 * React Hook for Wave Reader Message Router
 * 
 * Provides easy access to the message router for components to send and receive messages.
 */

export interface UseWaveReaderMessageRouterOptions {
  componentName: string;
  autoProcess?: boolean;
  enableMetrics?: boolean;
  onMessageReceived?: (message: WaveReaderMessage) => void;
  onError?: (error: string) => void;
}

export interface UseWaveReaderMessageRouterReturn {
  // Message sending functions
  sendMessage: (type: string, target: string, data?: any, priority?: WaveReaderMessage['priority']) => Promise<MessageRoutingResult>;
  sendMessageWithRetry: (type: string, target: string, data?: any, priority?: WaveReaderMessage['priority'], maxRetries?: number) => Promise<MessageRoutingResult>;
  broadcastMessage: (type: string, targets: string[], data?: any, priority?: WaveReaderMessage['priority']) => Promise<MessageRoutingResult[]>;
  
  // Message routing functions
  routeMessage: (message: Omit<WaveReaderMessage, 'id' | 'timestamp'>) => Promise<MessageRoutingResult>;
  
  // State and metrics
  isConnected: boolean;
  messageStats: {
    totalMessages: number;
    successRate: number;
    averageProcessingTime: number;
    errorCount: number;
    queueSizes: Record<string, number>;
  };
  lastMessageResult?: MessageRoutingResult;
  lastError?: string;
  
  // Utility functions
  clearMetrics: () => void;
  healthCheck: () => Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    message: string;
    metrics: any;
  }>;
}

export function useWaveReaderMessageRouter(options: UseWaveReaderMessageRouterOptions): UseWaveReaderMessageRouterReturn {
  const { componentName, autoProcess = true, enableMetrics = true, onMessageReceived, onError } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [messageStats, setMessageStats] = useState({
    totalMessages: 0,
    successRate: 0,
    averageProcessingTime: 0,
    errorCount: 0,
    queueSizes: {}
  });
  const [lastMessageResult, setLastMessageResult] = useState<MessageRoutingResult>();
  const [lastError, setLastError] = useState<string>();
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const messageQueueRef = useRef<WaveReaderMessage[]>([]);

  // Initialize connection
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        // Check if the structural system is available
        const structuralSystem = waveReaderMessageRouter.getStructuralSystem();
        if (structuralSystem) {
          setIsConnected(true);
          console.log(`🌊 Message Router: ${componentName} connected successfully`);
        } else {
          throw new Error('Structural system not available');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`🌊 Message Router: ${componentName} connection failed:`, errorMessage);
        setIsConnected(false);
        setLastError(errorMessage);
        onError?.(errorMessage);
      }
    };

    initializeConnection();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [componentName, onError]);

  // Auto-process messages if enabled
  useEffect(() => {
    if (autoProcess && isConnected) {
      intervalRef.current = setInterval(async () => {
        try {
          await waveReaderMessageRouter.processQueuedMessages();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`🌊 Message Router: Error processing queued messages:`, errorMessage);
        }
      }, 100); // Process every 100ms
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoProcess, isConnected]);

  // Update metrics if enabled
  useEffect(() => {
    if (enableMetrics && isConnected) {
      const updateMetrics = () => {
        const stats = waveReaderMessageRouter.getMessageStats();
        setMessageStats(stats);
      };

      // Update metrics every second
      const metricsInterval = setInterval(updateMetrics, 1000);
      
      return () => clearInterval(metricsInterval);
    }
  }, [enableMetrics, isConnected]);

  // Send message function
  const sendMessage = useCallback(async (
    type: string,
    target: string,
    data?: any,
    priority: WaveReaderMessage['priority'] = 'normal'
  ): Promise<MessageRoutingResult> => {
    if (!isConnected) {
      throw new Error('Message router not connected');
    }

    try {
      const result = await waveReaderMessageRouter.sendMessage({
        type,
        source: componentName,
        target,
        priority,
        data
      });

      setLastMessageResult(result);
      
      if (!result.success && result.error) {
        setLastError(result.error);
        onError?.(result.error);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setLastError(errorMessage);
      onError?.(errorMessage);
      throw error;
    }
  }, [componentName, isConnected, onError]);

  // Send message with retry function
  const sendMessageWithRetry = useCallback(async (
    type: string,
    target: string,
    data?: any,
    priority: WaveReaderMessage['priority'] = 'normal',
    maxRetries: number = 3
  ): Promise<MessageRoutingResult> => {
    if (!isConnected) {
      throw new Error('Message router not connected');
    }

    try {
      const result = await waveReaderMessageRouter.sendMessageWithRetry({
        type,
        source: componentName,
        target,
        priority,
        data
      }, maxRetries);

      setLastMessageResult(result);
      
      if (!result.success && result.error) {
        setLastError(result.error);
        onError?.(result.error);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setLastError(errorMessage);
      onError?.(errorMessage);
      throw error;
    }
  }, [componentName, isConnected, onError]);

  // Broadcast message function
  const broadcastMessage = useCallback(async (
    type: string,
    targets: string[],
    data?: any,
    priority: WaveReaderMessage['priority'] = 'normal'
  ): Promise<MessageRoutingResult[]> => {
    if (!isConnected) {
      throw new Error('Message router not connected');
    }

    try {
      const results = await waveReaderMessageRouter.broadcastMessage({
        type,
        source: componentName,
        priority,
        data
      }, targets);

      // Check for errors in results
      const errors = results.filter(r => !r.success).map(r => r.error).filter(Boolean);
      if (errors.length > 0) {
        const errorMessage = errors.join(', ');
        setLastError(errorMessage);
        onError?.(errorMessage);
      }

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setLastError(errorMessage);
      onError?.(errorMessage);
      throw error;
    }
  }, [componentName, isConnected, onError]);

  // Route message function
  const routeMessage = useCallback(async (
    message: Omit<WaveReaderMessage, 'id' | 'timestamp'>
  ): Promise<MessageRoutingResult> => {
    if (!isConnected) {
      throw new Error('Message router not connected');
    }

    try {
      const result = await waveReaderMessageRouter.sendMessage({
        ...message,
        source: componentName
      });

      setLastMessageResult(result);
      
      if (!result.success && result.error) {
        setLastError(result.error);
        onError?.(result.error);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setLastError(errorMessage);
      onError?.(errorMessage);
      throw error;
    }
  }, [componentName, isConnected, onError]);

  // Clear metrics function
  const clearMetrics = useCallback(() => {
    waveReaderMessageRouter.clearMetrics();
    setMessageStats({
      totalMessages: 0,
      successRate: 0,
      averageProcessingTime: 0,
      errorCount: 0,
      queueSizes: {}
    });
    setLastMessageResult(undefined);
    setLastError(undefined);
  }, []);

  // Health check function
  const healthCheck = useCallback(async () => {
    if (!isConnected) {
      throw new Error('Message router not connected');
    }

    return await waveReaderMessageRouter.healthCheck();
  }, [isConnected]);

  // Convenience functions for common wave reader operations
  const waveReaderOperations = {
    // Wave reader control
    startWaveReader: (selector?: string) => 
      sendMessage('WAVE_READER_START', 'wave-reader', { selector }, 'high'),
    
    stopWaveReader: () => 
      sendMessage('WAVE_READER_STOP', 'wave-reader', {}, 'high'),
    
    updateWaveReader: (settings: any) => 
      sendMessage('WAVE_READER_UPDATE', 'wave-reader', settings, 'normal'),
    
    // Tab navigation
    changeTab: (tabId: string) => 
      sendMessage('TAB_CHANGE', 'wave-tabs', { tabId }, 'normal'),
    
    // Settings
    updateSettings: (settings: any) => 
      sendMessage('SETTING_CHANGE', 'settings', settings, 'normal'),
    
    // Selector input
    updateSelector: (selector: string) => 
      sendMessage('SELECTOR_UPDATE', 'selector-input', { selector }, 'normal'),
    
    // Go button
    enableGoButton: () => 
      sendMessage('ENABLE_BUTTON', 'go-button', {}, 'normal'),
    
    disableGoButton: () => 
      sendMessage('DISABLE_BUTTON', 'go-button', {}, 'normal')
  };

  return {
    // Core message functions
    sendMessage,
    sendMessageWithRetry,
    broadcastMessage,
    routeMessage,
    
    // State and metrics
    isConnected,
    messageStats,
    lastMessageResult,
    lastError,
    
    // Utility functions
    clearMetrics,
    healthCheck,
    
    // Convenience operations
    ...waveReaderOperations
  };
}

// Export the hook
export default useWaveReaderMessageRouter;
