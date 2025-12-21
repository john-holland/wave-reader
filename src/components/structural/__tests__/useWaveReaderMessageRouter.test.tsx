// Mock the waveReaderMessageRouter module first
const mockStructuralSystem = {
  createMachine: jest.fn(),
  getMachine: jest.fn(),
  sendMessage: jest.fn(),
  isConnected: true
};

jest.mock('../wave-reader-message-router', () => ({
  waveReaderMessageRouter: {
    sendMessage: jest.fn(),
    sendMessageWithRetry: jest.fn(),
    broadcastMessage: jest.fn(),
    routeMessage: jest.fn(),
    getMessageStats: jest.fn(),
    getQueueStatus: jest.fn(),
    healthCheck: jest.fn(),
    clearMetrics: jest.fn(),
    getStructuralSystem: jest.fn(() => mockStructuralSystem),
    isConnected: true
  }
}));

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useWaveReaderMessageRouter } from '../useWaveReaderMessageRouter';

// Get the mocked message router
const mockMessageRouter = require('../wave-reader-message-router').waveReaderMessageRouter;

// Test component that uses the hook
const TestComponent = ({ componentName, options = {} }: { componentName: string; options?: any }) => {
  const {
    isConnected,
    sendMessage,
    sendMessageWithRetry,
    broadcastMessage,
    routeMessage,
    messageStats,
    lastMessageResult,
    lastError,
    clearMetrics,
    healthCheck,
    startWaveReader,
    stopWaveReader,
    changeTab,
    enableGoButton,
    disableGoButton
  } = useWaveReaderMessageRouter({ componentName, ...options });

  return (
    <div>
      <div data-testid="connection-status">
        Connected: {isConnected ? 'Yes' : 'No'}
      </div>
      
      <button 
        data-testid="send-message" 
        onClick={() => sendMessage('TEST_TYPE', 'target', { data: 'test' })}
      >
        Send Message
      </button>
      
      <button 
        data-testid="send-retry" 
        onClick={() => sendMessageWithRetry('RETRY_TYPE', 'target', { data: 'retry' }, 'high', 3)}
      >
        Send with Retry
      </button>
      
      <button 
        data-testid="broadcast" 
        onClick={() => broadcastMessage('BROADCAST_TYPE', ['comp1', 'comp2'], { message: 'hello' })}
      >
        Broadcast
      </button>
      
      <button 
        data-testid="route-message" 
        onClick={() => routeMessage({ name: 'ROUTE_NAME', source: 'test-component', target: 'target', data: { data: 'route' }, priority: 'normal' })}
      >
        Route Message
      </button>
      
      <button 
        data-testid="start-wave-reader" 
        onClick={() => startWaveReader('selector')}
      >
        Start Wave Reader
      </button>
      
      <button 
        data-testid="stop-wave-reader" 
        onClick={() => stopWaveReader()}
      >
        Stop Wave Reader
      </button>
      
      <button 
        data-testid="change-tab" 
        onClick={() => changeTab('settings')}
      >
        Change Tab
      </button>
      
      <button 
        data-testid="enable-button" 
        onClick={() => enableGoButton()}
      >
        Enable Button
      </button>
      
      <button 
        data-testid="disable-button" 
        onClick={() => disableGoButton()}
      >
        Disable Button
      </button>
      
      <button 
        data-testid="health-check" 
        onClick={() => healthCheck()}
      >
        Health Check
      </button>
      
      <button 
        data-testid="clear-metrics" 
        onClick={() => clearMetrics()}
      >
        Clear Metrics
      </button>
      
      <div data-testid="message-stats">
        Total: {messageStats.totalMessages}, 
        Success: {messageStats.successfulMessages}, 
        Rate: {messageStats.successRate.toFixed(1)}%
      </div>
      
      <div data-testid="last-result">
        Last Result: {lastMessageResult ? 'Success' : 'None'}
      </div>
      
      <div data-testid="last-error">
        Last Error: {lastError || 'None'}
      </div>
    </div>
  );
};

describe('useWaveReaderMessageRouter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock message router
    Object.assign(mockMessageRouter, {
      sendMessage: jest.fn().mockResolvedValue({ success: true }),
      sendMessageWithRetry: jest.fn().mockResolvedValue({ success: true }),
      broadcastMessage: jest.fn().mockResolvedValue([{ success: true }, { success: true }]),
      routeMessage: jest.fn().mockResolvedValue({ success: true }),
      getMessageStats: jest.fn().mockReturnValue({
        totalMessages: 0,
        successfulMessages: 0,
        failedMessages: 0,
        successRate: 100,
        averageProcessingTime: 0,
        priorityDistribution: {}
      }),
      getQueueStatus: jest.fn().mockReturnValue({
        messageQueueSize: 0,
        retryQueueSize: 0,
        isProcessing: false
      }),
      healthCheck: jest.fn().mockResolvedValue({
        status: 'healthy',
        message: 'System is healthy'
      }),
      clearMetrics: jest.fn(),
      isConnected: true
    });
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      render(<TestComponent componentName="test-component" />);
      
      expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected: Yes');
      expect(screen.getByTestId('message-stats')).toHaveTextContent('Total: 0');
      expect(screen.getByTestId('last-result')).toHaveTextContent('Last Result: None');
      expect(screen.getByTestId('last-error')).toHaveTextContent('Last Error: None');
    });

    it('should initialize with custom options', () => {
      const onMessageReceived = jest.fn();
      const onError = jest.fn();
      
      render(
        <TestComponent 
          componentName="test-component" 
          options={{ 
            onMessageReceived, 
            onError,
            autoProcess: false,
            enableMetrics: false
          }} 
        />
      );
      
      expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected: Yes');
    });
  });

  describe('message sending', () => {
    it('should send message successfully', async () => {
      render(<TestComponent componentName="test-component" />);
      
      fireEvent.click(screen.getByTestId('send-message'));
      
      await waitFor(() => {
        expect(mockMessageRouter.sendMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'TEST_TYPE',
            target: 'target',
            source: 'test-component',
            data: { data: 'test' },
            priority: 'normal'
          })
        );
      });
    });

    it('should send message with retry', async () => {
      render(<TestComponent componentName="test-component" />);
      
      fireEvent.click(screen.getByTestId('send-retry'));
      
      await waitFor(() => {
        expect(mockMessageRouter.sendMessageWithRetry).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'RETRY_TYPE',
            target: 'target',
            source: 'test-component',
            data: { data: 'retry' },
            priority: 'high'
          }),
          3
        );
      });
    });

    it('should broadcast message to multiple targets', async () => {
      render(<TestComponent componentName="test-component" />);
      
      fireEvent.click(screen.getByTestId('broadcast'));
      
      await waitFor(() => {
        expect(mockMessageRouter.broadcastMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'BROADCAST_TYPE',
            source: 'test-component',
            data: { message: 'hello' },
            priority: 'normal'
          }),
          ['comp1', 'comp2']
        );
      });
    });

    it('should route message with priority', async () => {
      render(<TestComponent componentName="test-component" />);
      
      fireEvent.click(screen.getByTestId('route-message'));
      
      await waitFor(() => {
        expect(mockMessageRouter.sendMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'ROUTE_NAME',
            target: 'target',
            source: 'test-component',
            data: { data: 'route' },
            priority: 'normal'
          })
        );
      });
    });
  });

  describe('wave reader operations', () => {
    it('should start wave reader', async () => {
      render(<TestComponent componentName="test-component" />);
      
      fireEvent.click(screen.getByTestId('start-wave-reader'));
      
      await waitFor(() => {
        expect(mockMessageRouter.sendMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'WAVE_READER_START',
            target: 'wave-reader',
            source: 'test-component',
            data: { selector: 'selector' },
            priority: 'high'
          })
        );
      });
    });

    it('should stop wave reader', async () => {
      render(<TestComponent componentName="test-component" />);
      
      fireEvent.click(screen.getByTestId('stop-wave-reader'));
      
      await waitFor(() => {
        expect(mockMessageRouter.sendMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'WAVE_READER_STOP',
            target: 'wave-reader',
            source: 'test-component',
            data: {},
            priority: 'high'
          })
        );
      });
    });

    it('should change tab', async () => {
      render(<TestComponent componentName="test-component" />);
      
      fireEvent.click(screen.getByTestId('change-tab'));
      
      await waitFor(() => {
        expect(mockMessageRouter.sendMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'TAB_CHANGE',
            target: 'wave-tabs',
            source: 'test-component',
            data: { tabId: 'settings' },
            priority: 'normal'
          })
        );
      });
    });

    it('should enable go button', async () => {
      render(<TestComponent componentName="test-component" />);
      
      fireEvent.click(screen.getByTestId('enable-button'));
      
      await waitFor(() => {
        expect(mockMessageRouter.sendMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'ENABLE_BUTTON',
            target: 'go-button',
            source: 'test-component',
            data: {},
            priority: 'normal'
          })
        );
      });
    });

    it('should disable go button', async () => {
      render(<TestComponent componentName="test-component" />);
      
      fireEvent.click(screen.getByTestId('disable-button'));
      
      await waitFor(() => {
        expect(mockMessageRouter.sendMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'DISABLE_BUTTON',
            target: 'go-button',
            source: 'test-component',
            data: {},
            priority: 'normal'
          })
        );
      });
    });
  });

  describe('utility operations', () => {
    it('should perform health check', async () => {
      render(<TestComponent componentName="test-component" />);
      
      fireEvent.click(screen.getByTestId('health-check'));
      
      await waitFor(() => {
        expect(mockMessageRouter.healthCheck).toHaveBeenCalled();
      });
    });

    it('should clear metrics', async () => {
      render(<TestComponent componentName="test-component" />);
      
      fireEvent.click(screen.getByTestId('clear-metrics'));
      
      expect(mockMessageRouter.clearMetrics).toHaveBeenCalled();
    });
  });

  describe('connection state', () => {
    it('should reflect connection status changes', async () => {
      // Start with connected (structural system available)
      mockMessageRouter.getStructuralSystem.mockReturnValue(mockStructuralSystem);
      
      render(<TestComponent componentName="test-component" />);
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected: Yes');
      });
      
      // Test that connection is established
      expect(mockMessageRouter.getStructuralSystem).toHaveBeenCalled();
    });
  });

  describe('message statistics', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    
    afterEach(() => {
      jest.useRealTimers();
    });
    
    it('should display updated message statistics', async () => {
      mockMessageRouter.getMessageStats.mockReturnValue({
        totalMessages: 10,
        successfulMessages: 8,
        failedMessages: 2,
        successRate: 80,
        averageProcessingTime: 150,
        priorityDistribution: { normal: 6, high: 4 }
      });
      
      render(<TestComponent componentName="test-component" options={{ enableMetrics: true }} />);
      
      // Fast-forward time to trigger metrics update (they update every 1 second)
      act(() => {
        jest.advanceTimersByTime(1100);
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('message-stats')).toHaveTextContent('Total: 10');
      });
      
      expect(screen.getByTestId('message-stats')).toHaveTextContent('Success: 8');
      expect(screen.getByTestId('message-stats')).toHaveTextContent('Rate: 80.0%');
    });
  });

  describe('error handling', () => {
    it('should handle message sending errors', async () => {
      const onError = jest.fn();
      mockMessageRouter.sendMessage.mockResolvedValue({
        success: false,
        error: 'Send failed',
        targetComponent: 'target',
        processingTime: 0,
        messageId: 'test-id',
        timestamp: Date.now()
      });
      
      render(
        <TestComponent 
          componentName="test-component" 
          options={{ onError }}
        />
      );
      
      // Wait for connection to be established
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected: Yes');
      });
      
      fireEvent.click(screen.getByTestId('send-message'));
      
      await waitFor(() => {
        expect(mockMessageRouter.sendMessage).toHaveBeenCalled();
        expect(onError).toHaveBeenCalledWith('Send failed');
      });
    });

    it('should handle connection errors', async () => {
      const onError = jest.fn();
      // Make getStructuralSystem return null to simulate disconnection
      mockMessageRouter.getStructuralSystem.mockReturnValue(null);
      
      render(
        <TestComponent 
          componentName="test-component" 
          options={{ onError }}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected: No');
        expect(onError).toHaveBeenCalled();
      });
    });
  });

  describe('auto-processing', () => {
    it('should auto-process messages when enabled', async () => {
      const onMessageReceived = jest.fn();
      mockMessageRouter.getStructuralSystem.mockReturnValue(mockStructuralSystem);
      mockMessageRouter.processQueuedMessages = jest.fn().mockResolvedValue(undefined);
      
      render(
        <TestComponent 
          componentName="test-component" 
          options={{ 
            autoProcess: true,
            onMessageReceived 
          }}
        />
      );
      
      // Wait for connection to be established
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected: Yes');
      });
    });
  });

  describe('metrics updates', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      mockMessageRouter.getStructuralSystem.mockReturnValue(mockStructuralSystem);
    });
    
    afterEach(() => {
      jest.useRealTimers();
    });
    
    it('should update metrics when enabled', async () => {
      render(
        <TestComponent 
          componentName="test-component" 
          options={{ enableMetrics: true }}
        />
      );
      
      // Wait for connection to be established first
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected: Yes');
      });
      
      // Fast-forward time to trigger metrics update (they update every 1 second)
      act(() => {
        jest.advanceTimersByTime(1100);
      });
      
      await waitFor(() => {
        expect(mockMessageRouter.getMessageStats).toHaveBeenCalled();
      });
    });

    it('should not update metrics when disabled', () => {
      render(
        <TestComponent 
          componentName="test-component" 
          options={{ enableMetrics: false }}
        />
      );
      
      // Metrics should not be updated
      expect(mockMessageRouter.getMessageStats).not.toHaveBeenCalled();
    });
  });

  describe('component unmounting', () => {
    it('should clean up on unmount', () => {
      const { unmount } = render(<TestComponent componentName="test-component" />);
      
      // Verify component is rendered
      expect(screen.getByTestId('connection-status')).toBeInTheDocument();
      
      // Unmount component
      unmount();
      
      // Component should be removed
      expect(screen.queryByTestId('connection-status')).not.toBeInTheDocument();
    });
  });

  describe('convenience methods', () => {
    it('should provide wave reader convenience methods', () => {
      render(<TestComponent componentName="test-component" />);
      
      // All convenience methods should be available
      expect(screen.getByTestId('start-wave-reader')).toBeInTheDocument();
      expect(screen.getByTestId('stop-wave-reader')).toBeInTheDocument();
      expect(screen.getByTestId('change-tab')).toBeInTheDocument();
      expect(screen.getByTestId('enable-button')).toBeInTheDocument();
      expect(screen.getByTestId('disable-button')).toBeInTheDocument();
    });

    it('should call appropriate message router methods for convenience operations', async () => {
      mockMessageRouter.getStructuralSystem.mockReturnValue(mockStructuralSystem);
      mockMessageRouter.sendMessage.mockResolvedValue({
        success: true,
        targetComponent: 'target',
        processingTime: 10,
        messageId: 'test-id',
        timestamp: Date.now()
      });
      
      render(<TestComponent componentName="test-component" />);
      
      // Wait for connection to be established
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected: Yes');
      });
      
      // Test each convenience method
      fireEvent.click(screen.getByTestId('start-wave-reader'));
      fireEvent.click(screen.getByTestId('stop-wave-reader'));
      fireEvent.click(screen.getByTestId('change-tab'));
      
      await waitFor(() => {
        expect(mockMessageRouter.sendMessage).toHaveBeenCalledTimes(3);
      });
    });
  });
});
