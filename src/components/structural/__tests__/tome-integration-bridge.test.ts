import { TomeIntegrationBridge, TomeBridgeConfig } from '../tome-integration-bridge';

// Mock message router
const mockMessageRouter = {
  sendMessage: jest.fn().mockResolvedValue({ success: true }),
  isConnected: true
};

describe('TomeIntegrationBridge', () => {
  let bridge: TomeIntegrationBridge;

  beforeEach(() => {
    jest.clearAllMocks();
    bridge = new TomeIntegrationBridge(mockMessageRouter);
  });

  describe('constructor', () => {
    it('should initialize with message router', () => {
      expect(bridge).toBeInstanceOf(TomeIntegrationBridge);
    });
  });

  describe('createBridge', () => {
    const mockConfig: TomeBridgeConfig = {
      componentName: 'test-component',
      tomeConfig: {
        id: 'test-component',
        name: 'Test Component',
        xstateConfig: { initial: 'idle', states: {} }
      },
      messageRouter: mockMessageRouter
    };

    it('should create a bridge successfully', async () => {
      const result = await bridge.createBridge(mockConfig);

      expect(result).toBeDefined();
      expect(result.componentName).toBe('test-component');
      expect(result.tomeConfig).toBe(mockConfig.tomeConfig);
      expect(result.messageRouter).toBe(mockMessageRouter);
    });

    it('should store bridge in internal map', async () => {
      await bridge.createBridge(mockConfig);
      
      const storedBridge = bridge.getBridge('test-component');
      expect(storedBridge).toBeDefined();
      expect(storedBridge.componentName).toBe('test-component');
    });
  });

  describe('getBridge', () => {
    it('should return bridge for existing component', async () => {
      const mockConfig: TomeBridgeConfig = {
        componentName: 'existing-component',
        tomeConfig: {},
        messageRouter: mockMessageRouter
      };

      await bridge.createBridge(mockConfig);
      const result = bridge.getBridge('existing-component');
      
      expect(result).toBeDefined();
      expect(result.componentName).toBe('existing-component');
    });

    it('should return undefined for non-existent component', () => {
      const result = bridge.getBridge('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('sendMessage', () => {
    beforeEach(async () => {
      const mockConfig: TomeBridgeConfig = {
        componentName: 'test-component',
        tomeConfig: {},
        messageRouter: mockMessageRouter
      };

      await bridge.createBridge(mockConfig);
    });

    it('should send message through bridge successfully', async () => {
      const event = { type: 'TEST_EVENT', data: { value: 'test' } };
      const result = await bridge.sendMessage('test-component', event);

      expect(result).toBeDefined();
      expect(result.result).toEqual({ success: true });
      expect(result.bridge).toBeDefined();
    });

    it('should throw error for non-existent bridge', async () => {
      const event = { type: 'TEST_EVENT', data: {} };
      
      await expect(bridge.sendMessage('non-existent', event))
        .rejects.toThrow('No bridge found for component: non-existent');
    });

    it('should call message router sendMessage', async () => {
      const event = { type: 'TEST_EVENT', data: { value: 'test' } };
      await bridge.sendMessage('test-component', event);

      expect(mockMessageRouter.sendMessage).toHaveBeenCalledWith('TEST_EVENT', 'test-component', { value: 'test' });
    });
  });

  describe('getAllBridges', () => {
    it('should return all created bridges', async () => {
      const configs = [
        { componentName: 'component1', tomeConfig: {}, messageRouter: mockMessageRouter },
        { componentName: 'component2', tomeConfig: {}, messageRouter: mockMessageRouter }
      ];

      for (const config of configs) {
        await bridge.createBridge(config as TomeBridgeConfig);
      }

      const allBridges = bridge.getAllBridges();
      expect(allBridges).toHaveLength(2);
      expect(allBridges.map(b => b.componentName)).toEqual(['component1', 'component2']);
    });

    it('should return empty array when no bridges exist', () => {
      const allBridges = bridge.getAllBridges();
      expect(allBridges).toEqual([]);
    });
  });

  describe('cleanup', () => {
    it('should clear all bridges', async () => {
      const mockConfig: TomeBridgeConfig = {
        componentName: 'test-component',
        tomeConfig: {},
        messageRouter: mockMessageRouter
      };

      await bridge.createBridge(mockConfig);
      expect(bridge.getAllBridges()).toHaveLength(1);

      bridge.cleanup();
      expect(bridge.getAllBridges()).toHaveLength(0);
    });
  });

  describe('bridge methods', () => {
    let testBridge: any;

    beforeEach(async () => {
      const mockConfig: TomeBridgeConfig = {
        componentName: 'test-component',
        tomeConfig: { id: 'test', name: 'Test' },
        messageRouter: mockMessageRouter
      };

      testBridge = await bridge.createBridge(mockConfig);
    });

    describe('sendEvent', () => {
      it('should call message router sendMessage', async () => {
        const event = { type: 'TEST_EVENT', data: { value: 'test' } };
        const result = await testBridge.sendEvent(event);

        expect(mockMessageRouter.sendMessage).toHaveBeenCalledWith('TEST_EVENT', 'test-component', { value: 'test' });
        expect(result).toEqual({ success: true });
      });
    });

    describe('getState', () => {
      it('should return null (placeholder implementation)', () => {
        const state = testBridge.getState();
        expect(state).toBeNull();
      });
    });

    describe('getTomeConfig', () => {
      it('should return tome configuration', () => {
        const config = testBridge.getTomeConfig();
        expect(config).toEqual({ id: 'test', name: 'Test' });
      });
    });
  });

  describe('error handling', () => {
    it('should handle message sending errors', async () => {
      const mockConfig: TomeBridgeConfig = {
        componentName: 'error-component',
        tomeConfig: {},
        messageRouter: mockMessageRouter
      };

      await bridge.createBridge(mockConfig);

      // Mock message router to throw error
      mockMessageRouter.sendMessage.mockRejectedValue(new Error('Send failed'));

      await expect(bridge.sendMessage('error-component', { type: 'TEST' }))
        .rejects.toThrow('Send failed');
    });
  });
});
