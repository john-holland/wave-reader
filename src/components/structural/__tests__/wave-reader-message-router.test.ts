import { WaveReaderMessageRouter, WaveReaderMessage, MessageRoutingResult } from '../wave-reader-message-router';

// Mock StructuralSystem
const mockStructuralSystem = {
  createMachine: jest.fn(),
  getMachine: jest.fn(),
  sendMessage: jest.fn(),
  isConnected: true
};

// Mock the StructuralSystem import
jest.mock('log-view-machine', () => ({
  StructuralSystem: jest.fn().mockImplementation(() => mockStructuralSystem)
}));

describe('WaveReaderMessageRouter', () => {
  let messageRouter: WaveReaderMessageRouter;
  let mockSystem: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock system
    mockSystem = {
      createMachine: jest.fn(),
      getMachine: jest.fn(),
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
      expect((messageRouter as any).retryQueue).toBeDefined();
      expect((messageRouter as any).messageHistory).toBeDefined();
      expect((messageRouter as any).performanceMetrics).toBeDefined();
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
      mockSystem.sendMessage.mockResolvedValue({ success: true });

      const result = await messageRouter.sendMessage(mockMessage);

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.processingTime).toBeGreaterThan(0);
    });

    it('should handle structural system errors', async () => {
      mockSystem.sendMessage.mockRejectedValue(new Error('System error'));

      const result = await messageRouter.sendMessage(mockMessage);

      expect(result.success).toBe(false);
      expect(result.error).toBe('System error');
      expect(result.retryCount).toBe(0);
    });

    it('should generate unique message IDs', async () => {
      mockSystem.sendMessage.mockResolvedValue({ success: true });

      const result1 = await messageRouter.sendMessage(mockMessage);
      const result2 = await messageRouter.sendMessage(mockMessage);

      expect(result1.messageId).not.toBe(result2.messageId);
    });

    it('should track message in history', async () => {
      mockSystem.sendMessage.mockResolvedValue({ success: true });

      await messageRouter.sendMessage(mockMessage);

      const history = (messageRouter as any).messageHistory;
      expect(history.length).toBe(1);
      expect(history[0].type).toBe('TEST_MESSAGE');
    });

    it('should update performance metrics', async () => {
      mockSystem.sendMessage.mockResolvedValue({ success: true });

      await messageRouter.sendMessage(mockMessage);

      const metrics = (messageRouter as any).performanceMetrics;
      expect(metrics.totalMessages).toBe(1);
      expect(metrics.successfulMessages).toBe(1);
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
      mockSystem.sendMessage
        .mockRejectedValueOnce(new Error('First failure'))
        .mockResolvedValueOnce({ success: true });

      const result = await messageRouter.sendMessageWithRetry(mockMessage, 2);

      expect(result.success).toBe(true);
      expect(result.retryCount).toBe(1);
      expect(mockSystem.sendMessage).toHaveBeenCalledTimes(2);
    });

    it('should respect max retry count', async () => {
      mockSystem.sendMessage.mockRejectedValue(new Error('Persistent failure'));

      const result = await messageRouter.sendMessageWithRetry(mockMessage, 3);

      expect(result.success).toBe(false);
      expect(result.retryCount).toBe(3);
      expect(mockSystem.sendMessage).toHaveBeenCalledTimes(4); // Initial + 3 retries
    });

    it('should use exponential backoff', async () => {
      const startTime = Date.now();
      mockSystem.sendMessage.mockRejectedValue(new Error('Failure'));

      await messageRouter.sendMessageWithRetry(mockMessage, 2);

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
      mockSystem.sendMessage.mockResolvedValue({ success: true });

      const targets = ['component1', 'component2', 'component3'];
      const results = await messageRouter.broadcastMessage(mockMessage, targets);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
      expect(mockSystem.sendMessage).toHaveBeenCalledTimes(3);
    });

    it('should handle partial failures', async () => {
      mockSystem.sendMessage
        .mockResolvedValueOnce({ success: true })
        .mockRejectedValueOnce(new Error('Component 2 failed'))
        .mockResolvedValueOnce({ success: true });

      const targets = ['component1', 'component2', 'component3'];
      const results = await messageRouter.broadcastMessage(mockMessage, targets);

      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[2].success).toBe(true);
    });
  });

  describe('routeMessage', () => {
    it('should route message to correct target', async () => {
      mockSystem.sendMessage.mockResolvedValue({ success: true });

      const result = await messageRouter.routeMessage('TEST_TYPE', 'target-component', { data: 'test' });

      expect(result.success).toBe(true);
      expect(mockSystem.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'TEST_TYPE',
          target: 'target-component',
          data: { data: 'test' }
        })
      );
    });

    it('should use default priority when not specified', async () => {
      mockSystem.sendMessage.mockResolvedValue({ success: true });

      await messageRouter.routeMessage('TEST_TYPE', 'target', {});

      expect(mockSystem.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          priority: 'normal'
        })
      );
    });

    it('should use specified priority', async () => {
      mockSystem.sendMessage.mockResolvedValue({ success: true });

      await messageRouter.routeMessage('TEST_TYPE', 'target', {}, 'high');

      expect(mockSystem.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          priority: 'high'
        })
      );
    });
  });

  describe('getMessageStats', () => {
    beforeEach(async () => {
      // Send some test messages
      mockSystem.sendMessage.mockResolvedValue({ success: true });
      
      await messageRouter.sendMessage({
        type: 'SUCCESS_MESSAGE',
        source: 'test',
        target: 'target',
        priority: 'normal',
        data: {}
      });

      await messageRouter.sendMessage({
        type: 'FAILED_MESSAGE',
        source: 'test',
        target: 'target',
        priority: 'high',
        data: {}
      });

      // Mock one failure
      mockSystem.sendMessage.mockRejectedValueOnce(new Error('Failure'));
      await messageRouter.sendMessage({
        type: 'FAILED_MESSAGE',
        source: 'test',
        target: 'target',
        priority: 'high',
        data: {}
      });
    });

    it('should return accurate message statistics', () => {
      const stats = messageRouter.getMessageStats();

      expect(stats.totalMessages).toBe(3);
      expect(stats.successfulMessages).toBe(2);
      expect(stats.failedMessages).toBe(1);
      expect(stats.successRate).toBeCloseTo(66.67, 1);
      expect(stats.averageProcessingTime).toBeGreaterThan(0);
    });

    it('should calculate success rate correctly', () => {
      const stats = messageRouter.getMessageStats();
      const expectedRate = (2 / 3) * 100;
      
      expect(stats.successRate).toBeCloseTo(expectedRate, 1);
    });

    it('should track priority distribution', () => {
      const stats = messageRouter.getMessageStats();
      
      expect(stats.priorityDistribution).toBeDefined();
      expect(stats.priorityDistribution.normal).toBe(1);
      expect(stats.priorityDistribution.high).toBe(2);
    });
  });

  describe('getQueueStatus', () => {
    it('should return queue status information', () => {
      const status = messageRouter.getQueueStatus();

      expect(status.messageQueueSize).toBe(0);
      expect(status.retryQueueSize).toBe(0);
      expect(status.isProcessing).toBe(false);
    });

    it('should reflect actual queue state', async () => {
      // Add message to queue (simulate processing delay)
      mockSystem.sendMessage.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      const sendPromise = messageRouter.sendMessage({
        type: 'SLOW_MESSAGE',
        source: 'test',
        target: 'target',
        priority: 'normal',
        data: {}
      });

      // Check status while message is being processed
      const status = messageRouter.getQueueStatus();
      expect(status.isProcessing).toBe(true);

      await sendPromise;
    });
  });

  describe('healthCheck', () => {
    it('should return healthy status when system is working', async () => {
      mockSystem.sendMessage.mockResolvedValue({ success: true });

      const health = await messageRouter.healthCheck();

      expect(health.status).toBe('healthy');
      expect(health.message).toBe('Message router is functioning normally');
      expect(health.timestamp).toBeDefined();
      expect(health.metrics).toBeDefined();
    });

    it('should return unhealthy status when system is failing', async () => {
      mockSystem.sendMessage.mockRejectedValue(new Error('System failure'));

      const health = await messageRouter.healthCheck();

      expect(health.status).toBe('unhealthy');
      expect(health.message).toContain('System failure');
      expect(health.error).toBeDefined();
    });

    it('should include performance metrics in health check', async () => {
      mockSystem.sendMessage.mockResolvedValue({ success: true });

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
      mockSystem.sendMessage.mockResolvedValue({ success: true });
      
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
      
      // Send messages in reverse priority order
      mockSystem.sendMessage.mockImplementation((message) => {
        results.push({ priority: message.priority, timestamp: Date.now() });
        return Promise.resolve({ success: true });
      });

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

      // High priority should be processed first
      expect(results[0].priority).toBe('high');
      expect(results[1].priority).toBe('low');
    });

    it('should handle all priority levels', async () => {
      const priorities = ['critical', 'high', 'normal', 'low'];
      const results: any[] = [];

      mockSystem.sendMessage.mockImplementation((message) => {
        results.push(message.priority);
        return Promise.resolve({ success: true });
      });

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
      expect(results).toHaveLength(4);
      priorities.forEach(priority => {
        expect(results).toContain(priority);
      });
    });
  });

  describe('error handling', () => {
    it('should handle structural system disconnection', async () => {
      mockSystem.isConnected = false;

      const result = await messageRouter.sendMessage({
        type: 'TEST_MESSAGE',
        source: 'test',
        target: 'target',
        priority: 'normal',
        data: {}
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('not connected');
    });

    it('should handle invalid message types', async () => {
      const result = await messageRouter.sendMessage({
        type: '',
        source: 'test',
        target: 'target',
        priority: 'normal',
        data: {}
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('invalid message type');
    });

    it('should handle missing target', async () => {
      const result = await messageRouter.sendMessage({
        type: 'TEST_MESSAGE',
        source: 'test',
        target: '',
        priority: 'normal',
        data: {}
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('invalid target');
    });
  });
});
