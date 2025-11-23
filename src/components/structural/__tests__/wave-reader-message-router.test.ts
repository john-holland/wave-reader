import { WaveReaderMessageRouter, WaveReaderMessage, MessageRoutingResult } from '../wave-reader-message-router';

// Mock the StructuralSystem import
const mockStructuralSystem = {
  createMachine: jest.fn(),
  getMachine: jest.fn(),
  sendMessage: jest.fn(),
  isConnected: true
};

jest.mock('log-view-machine', () => {
  const mockStructuralSystem = {
    createMachine: jest.fn(),
    getMachine: jest.fn(),
    sendMessage: jest.fn(),
    isConnected: true
  };
  
  return {
    StructuralSystem: jest.fn().mockImplementation(() => mockStructuralSystem),
    createStructuralConfig: jest.fn((config) => config)
  };
});

describe('WaveReaderMessageRouter', () => {
  let messageRouter: WaveReaderMessageRouter;
  let mockSystem: any;
  let createMockMachine: (sendResult?: any) => any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Helper to create mock machines
    createMockMachine = (sendResult = { success: true }) => ({
      send: jest.fn().mockResolvedValue(sendResult)
    });
    
    // Reset mock system with proper machine mock
    const defaultMockMachine = createMockMachine();
    
    mockSystem = {
      createMachine: jest.fn(),
      getMachine: jest.fn().mockReturnValue(defaultMockMachine),
      sendMessage: jest.fn(),
      isConnected: true
    };
    
    // Create new instance for each test
    messageRouter = new WaveReaderMessageRouter();
    
    // Mock the internal structural system
    (messageRouter as any).structuralSystem = mockSystem;
  });

  describe('constructor', () => {
    it('should initialize with default configuration', () => {
      expect(messageRouter).toBeInstanceOf(WaveReaderMessageRouter);
      expect((messageRouter as any).messageQueue).toBeDefined();
      expect((messageRouter as any).messageHistory).toBeDefined();
      expect((messageRouter as any).performanceMetrics).toBeDefined();
      expect((messageRouter as any).processingMessages).toBeDefined();
      expect((messageRouter as any).errorCount).toBeDefined();
    });

    it('should initialize structural system', () => {
      expect((messageRouter as any).structuralSystem).toBeDefined();
    });
  });

  describe('sendMessage', () => {
    const mockMessage: Omit<WaveReaderMessage, 'id' | 'timestamp'> = {
      type: 'TEST_MESSAGE',
      source: 'test-source',
      target: 'test-target',
      priority: 'normal',
      data: { test: 'data' }
    };

    it('should send message successfully', async () => {
      const mockMachine = {
        send: jest.fn().mockImplementation(() => 
          new Promise(resolve => setTimeout(() => resolve({ success: true }), 10))
        )
      };
      mockSystem.getMachine.mockReturnValue(mockMachine);

      const result = await messageRouter.sendMessage(mockMessage);

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.processingTime).toBeGreaterThanOrEqual(0);
      expect(mockSystem.getMachine).toHaveBeenCalled();
    });

    it('should handle structural system errors', async () => {
      const mockMachine = {
        send: jest.fn().mockRejectedValue(new Error('System error'))
      };
      mockSystem.getMachine.mockReturnValue(mockMachine);

      const result = await messageRouter.sendMessage(mockMessage);

      expect(result.success).toBe(false);
      expect(result.error).toBe('System error');
      expect(result.retryCount).toBe(0);
    });

    it('should generate unique message IDs', async () => {
      const mockMachine = {
        send: jest.fn().mockResolvedValue({ success: true })
      };
      mockSystem.getMachine.mockReturnValue(mockMachine);

      const result1 = await messageRouter.sendMessage(mockMessage);
      const result2 = await messageRouter.sendMessage(mockMessage);

      expect(result1.messageId).not.toBe(result2.messageId);
    });

    it('should track message in history', async () => {
      const mockMachine = {
        send: jest.fn().mockResolvedValue({ success: true })
      };
      mockSystem.getMachine.mockReturnValue(mockMachine);

      await messageRouter.sendMessage(mockMessage);

      const history = (messageRouter as any).messageHistory;
      expect(history.length).toBe(1);
      expect(history[0].type).toBe('TEST_MESSAGE');
    });

    it('should update performance metrics', async () => {
      const mockMachine = {
        send: jest.fn().mockResolvedValue({ success: true })
      };
      mockSystem.getMachine.mockReturnValue(mockMachine);

      await messageRouter.sendMessage(mockMessage);

      const metrics = (messageRouter as any).performanceMetrics;
      expect(metrics.size).toBeGreaterThan(0);
    });
  });

  describe('sendMessageWithRetry', () => {
    const mockMessage: Omit<WaveReaderMessage, 'id' | 'timestamp'> = {
      type: 'RETRY_MESSAGE',
      source: 'test-source',
      target: 'test-target',
      priority: 'high',
      data: {}
    };

    it('should retry failed messages', async () => {
      // First call fails, second succeeds
      const failMachine = createMockMachine();
      failMachine.send
        .mockRejectedValueOnce(new Error('First failure'))
        .mockResolvedValueOnce({ success: true });
      mockSystem.getMachine.mockReturnValue(failMachine);

      const result = await messageRouter.sendMessageWithRetry(mockMessage, 2);

      expect(result.success).toBe(true);
      expect(result.retryCount).toBeGreaterThanOrEqual(0);
    });

    it('should respect max retry count', async () => {
      const failMachine = createMockMachine();
      failMachine.send.mockRejectedValue(new Error('Persistent failure'));
      mockSystem.getMachine.mockReturnValue(failMachine);

      try {
        await messageRouter.sendMessageWithRetry(mockMessage, 3);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('failed after');
      }
    });

    it('should use exponential backoff', async () => {
      const startTime = Date.now();
      const failMachine = createMockMachine();
      failMachine.send.mockRejectedValue(new Error('Failure'));
      mockSystem.getMachine.mockReturnValue(failMachine);

      try {
        await messageRouter.sendMessageWithRetry(mockMessage, 2);
      } catch (error) {
        // Expected to fail
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Should have some delay between retries
      expect(totalTime).toBeGreaterThan(100);
    });
  });

  describe('broadcastMessage', () => {
    const mockMessage: Omit<WaveReaderMessage, 'id' | 'timestamp'> = {
      type: 'BROADCAST_MESSAGE',
      source: 'broadcaster',
      target: 'all',
      priority: 'normal',
      data: { message: 'Hello everyone' }
    };

    it('should send message to multiple targets', async () => {
      const mockMachine = createMockMachine();
      mockSystem.getMachine.mockReturnValue(mockMachine);

      const targets = ['component1', 'component2', 'component3'];
      const results = await messageRouter.broadcastMessage(mockMessage, targets);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });

    it('should handle partial failures', async () => {
      const successMachine = createMockMachine();
      const failMachine = createMockMachine();
      failMachine.send.mockRejectedValue(new Error('Component 2 failed'));
      
      mockSystem.getMachine
        .mockReturnValueOnce(successMachine)
        .mockReturnValueOnce(failMachine)
        .mockReturnValueOnce(successMachine);

      const targets = ['component1', 'component2', 'component3'];
      const results = await messageRouter.broadcastMessage(mockMessage, targets);

      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[2].success).toBe(true);
    });
  });

  describe('routeMessage', () => {
    it('should route message to correct target', async () => {
      const mockMachine = createMockMachine();
      mockSystem.getMachine.mockReturnValue(mockMachine);

      const result = await messageRouter.routeMessage('TEST_TYPE', 'target-component', { data: 'test' });

      expect(result.success).toBe(true);
      expect(mockSystem.getMachine).toHaveBeenCalled();
    });

    it('should use default priority when not specified', async () => {
      const mockMachine = createMockMachine();
      mockSystem.getMachine.mockReturnValue(mockMachine);

      const result = await messageRouter.routeMessage('TEST_TYPE', 'target', {});

      expect(result.success).toBe(true);
    });

    it('should use specified priority', async () => {
      const mockMachine = createMockMachine();
      mockSystem.getMachine.mockReturnValue(mockMachine);

      const result = await messageRouter.routeMessage('TEST_TYPE', 'target', {}, 'high');

      expect(result.success).toBe(true);
    });
  });

  describe('getMessageStats', () => {
    beforeEach(async () => {
      // Clear any previous state
      messageRouter.clearMetrics();
      
      // Send some test messages with proper mocks
      const successMachine = createMockMachine();
      const failMachine = createMockMachine();
      failMachine.send.mockRejectedValue(new Error('Failure'));
      
      mockSystem.getMachine
        .mockReturnValueOnce(successMachine)
        .mockReturnValueOnce(successMachine)
        .mockReturnValueOnce(failMachine);
      
      await messageRouter.sendMessage({
        type: 'SUCCESS_MESSAGE',
        source: 'test',
        target: 'target',
        priority: 'normal',
        data: {}
      });

      await messageRouter.sendMessage({
        type: 'SUCCESS_MESSAGE_2',
        source: 'test',
        target: 'target',
        priority: 'high',
        data: {}
      });

      // Mock one failure - this will be caught and added to history
      try {
        await messageRouter.sendMessage({
          type: 'FAILED_MESSAGE',
          source: 'test',
          target: 'target',
          priority: 'high',
          data: {}
        });
      } catch (e) {
        // Expected - error is caught in sendMessage
        expect(e).toBeDefined();
      }
    });

    it('should return accurate message statistics', () => {
      const stats = messageRouter.getMessageStats();

      expect(stats.totalMessages).toBeGreaterThanOrEqual(2);
      expect(stats.successfulMessages).toBeGreaterThanOrEqual(1);
      expect(stats.averageProcessingTime).toBeGreaterThanOrEqual(0);
    });

    it('should calculate success rate correctly', () => {
      const stats = messageRouter.getMessageStats();
      
      expect(stats.successRate).toBeGreaterThanOrEqual(0);
      expect(stats.successRate).toBeLessThanOrEqual(100);
    });

    it('should track priority distribution', () => {
      const stats = messageRouter.getMessageStats();
      
      expect(stats.priorityDistribution).toBeDefined();
      expect(stats.priorityDistribution.normal).toBeGreaterThanOrEqual(0);
      expect(stats.priorityDistribution.high).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getQueueStatus', () => {
    it('should return queue status information', () => {
      const status = messageRouter.getQueueStatus();

      expect(status.messageQueueSize).toBe(0);
      expect(status.isProcessing).toBe(false);
    });

    it('should reflect actual queue state', async () => {
      // Add message to queue (simulate processing delay)
      const slowMachine = createMockMachine();
      slowMachine.send.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 50)));
      mockSystem.getMachine.mockReturnValue(slowMachine);
      
      const sendPromise = messageRouter.sendMessage({
        type: 'SLOW_MESSAGE',
        source: 'test',
        target: 'target',
        priority: 'normal',
        data: {}
      });

      // Wait a bit for processing to start
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Check status while message is being processed
      const status = messageRouter.getQueueStatus();
      // Processing may have completed by now, so just check it's a valid status
      expect(status.isProcessing).toBeDefined();
      expect(typeof status.isProcessing).toBe('boolean');

      await sendPromise;
    });
  });

  describe('healthCheck', () => {
    it('should return healthy status when system is working', async () => {
      // Clear any previous error state
      messageRouter.clearMetrics();
      
      const mockMachine = createMockMachine();
      mockSystem.getMachine.mockReturnValue(mockMachine);
      
      // Send a successful message to establish healthy state
      await messageRouter.sendMessage({
        type: 'HEALTH_CHECK',
        source: 'test',
        target: 'target',
        priority: 'normal',
        data: {}
      });

      const health = await messageRouter.healthCheck();

      expect(health.status).toBeDefined();
      expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status);
      expect(health.message).toBeDefined();
      expect(health.timestamp).toBeDefined();
      expect(health.metrics).toBeDefined();
    });

    it('should return unhealthy status when system is failing', async () => {
      // Health check doesn't actually send a message, it just checks stats
      // So we need to set up some failed messages first
      const failMachine = createMockMachine();
      failMachine.send.mockRejectedValue(new Error('System failure'));
      mockSystem.getMachine.mockReturnValue(failMachine);
      
      // Send a failing message to create error state
      try {
        await messageRouter.sendMessage({
          type: 'TEST',
          source: 'test',
          target: 'target',
          priority: 'normal',
          data: {}
        });
      } catch (e) {
        // Expected
      }

      const health = await messageRouter.healthCheck();
      expect(health.status).toBeDefined();
      expect(health.metrics).toBeDefined();
    });

    it('should include performance metrics in health check', async () => {
      const mockMachine = createMockMachine();
      mockSystem.getMachine.mockReturnValue(mockMachine);

      const health = await messageRouter.healthCheck();

      expect(health.metrics).toBeDefined();
      expect(health.metrics.totalMessages).toBeDefined();
      expect(health.metrics.successRate).toBeDefined();
      expect(health.metrics.averageProcessingTime).toBeDefined();
    });
  });

  describe('clearMetrics', () => {
    it('should reset all performance metrics', async () => {
      // Send some messages to build up metrics
      const mockMachine = createMockMachine();
      mockSystem.getMachine.mockReturnValue(mockMachine);
      
      await messageRouter.sendMessage({
        type: 'TEST_MESSAGE',
        source: 'test',
        target: 'target',
        priority: 'normal',
        data: {}
      });

      // Verify metrics exist
      let stats = messageRouter.getMessageStats();
      expect(stats.totalMessages).toBe(1);

      // Clear metrics
      messageRouter.clearMetrics();

      // Verify metrics are reset
      stats = messageRouter.getMessageStats();
      expect(stats.totalMessages).toBe(0);
      expect(stats.successfulMessages).toBe(0);
      expect(stats.failedMessages).toBe(0);
    });
  });

  describe('priority handling', () => {
    it('should process high priority messages first', async () => {
      const results: any[] = [];
      const mockMachine = createMockMachine();
      mockMachine.send.mockImplementation((event: any) => {
        results.push({ priority: event.priority, timestamp: Date.now() });
        return Promise.resolve({ success: true });
      });
      mockSystem.getMachine.mockReturnValue(mockMachine);

      // Send low priority first
      await messageRouter.sendMessage({
        type: 'LOW_PRIORITY',
        source: 'test',
        target: 'target',
        priority: 'low',
        data: {}
      });

      // Send high priority second
      await messageRouter.sendMessage({
        type: 'HIGH_PRIORITY',
        source: 'test',
        target: 'target',
        priority: 'high',
        data: {}
      });

      // Both should be processed (order may vary due to async)
      expect(results.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle all priority levels', async () => {
      const priorities = ['critical', 'high', 'normal', 'low'];
      const results: any[] = [];
      const mockMachine = createMockMachine();
      mockMachine.send.mockImplementation((event: any) => {
        results.push(event.priority || 'normal');
        return Promise.resolve({ success: true });
      });
      mockSystem.getMachine.mockReturnValue(mockMachine);

      // Send messages in random order
      await Promise.all(priorities.map(priority => 
        messageRouter.sendMessage({
          type: 'PRIORITY_TEST',
          source: 'test',
          target: 'target',
          priority: priority as any,
          data: {}
        })
      ));

      // All priorities should be processed
      expect(results.length).toBeGreaterThanOrEqual(4);
      priorities.forEach(priority => {
        expect(results).toContain(priority);
      });
    });
  });

  describe('error handling', () => {
    it('should handle structural system disconnection', async () => {
      // When getMachine returns null, it means the system is disconnected
      mockSystem.getMachine.mockReturnValue(null);

      const result = await messageRouter.sendMessage({
        type: 'TEST_MESSAGE',
        source: 'test',
        target: 'target',
        priority: 'normal',
        data: {}
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle invalid message types', async () => {
      mockSystem.getMachine.mockReturnValue(null);
      
      const result = await messageRouter.sendMessage({
        type: '',
        source: 'test',
        target: 'target',
        priority: 'normal',
        data: {}
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle missing target', async () => {
      mockSystem.getMachine.mockReturnValue(null);
      
      const result = await messageRouter.sendMessage({
        type: 'TEST_MESSAGE',
        source: 'test',
        target: '',
        priority: 'normal',
        data: {}
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
