import { ComponentMiddlewareAdapter, ComponentMiddlewareConfig, TomeIntegrationBridge, TomeBridgeConfig } from '../tome-integration-bridge';

// Mock message router
const mockMessageRouter = {
  sendMessage: jest.fn().mockResolvedValue({ success: true }),
  isConnected: true
};

describe('ComponentMiddlewareAdapter', () => {
  let adapter: ComponentMiddlewareAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    adapter = new ComponentMiddlewareAdapter(mockMessageRouter);
  });

  describe('constructor', () => {
    it('should initialize with message router', () => {
      expect(adapter).toBeInstanceOf(ComponentMiddlewareAdapter);
    });
  });

  describe('createAdapter', () => {
    const mockConfig: ComponentMiddlewareConfig = {
      componentName: 'test-component',
      structuralTomeConfig: {
        id: 'test-component',
        name: 'Test Component',
        xstateConfig: { initial: 'idle', states: {} }
      },
      messageRouter: mockMessageRouter
    };

    it('should create an adapter successfully', async () => {
      const result = await adapter.createAdapter(mockConfig);

      expect(result).toBeDefined();
      expect(result.componentName).toBe('test-component');
      expect(result.structuralTome).toBe(mockConfig.structuralTomeConfig);
      expect(result.messageRouter).toBe(mockMessageRouter);
    });

    it('should store adapter in internal map', async () => {
      await adapter.createAdapter(mockConfig);
      
      const storedAdapter = adapter.getAdapter('test-component');
      expect(storedAdapter).toBeDefined();
      expect(storedAdapter.componentName).toBe('test-component');
    });
  });

  describe('getAdapter', () => {
    it('should return adapter for existing component', async () => {
      const mockConfig: ComponentMiddlewareConfig = {
        componentName: 'existing-component',
        structuralTomeConfig: {},
        messageRouter: mockMessageRouter
      };

      await adapter.createAdapter(mockConfig);
      const result = adapter.getAdapter('existing-component');
      
      expect(result).toBeDefined();
      expect(result.componentName).toBe('existing-component');
    });

    it('should return undefined for non-existent component', () => {
      const result = adapter.getAdapter('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('sendMessage', () => {
    beforeEach(async () => {
      const mockConfig: ComponentMiddlewareConfig = {
        componentName: 'test-component',
        structuralTomeConfig: {},
        messageRouter: mockMessageRouter
      };

      await adapter.createAdapter(mockConfig);
    });

    it('should send message through adapter successfully', async () => {
      const event = { type: 'TEST_EVENT', data: { value: 'test' } };
      const result = await adapter.sendMessage('test-component', event);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should throw error for non-existent adapter', async () => {
      const event = { type: 'TEST_EVENT', data: {} };
      
      await expect(adapter.sendMessage('non-existent', event))
        .rejects.toThrow('No adapter found for component: non-existent');
    });

    it('should call message router sendMessage', async () => {
      const event = { type: 'TEST_EVENT', data: { value: 'test' } };
      await adapter.sendMessage('test-component', event);

      expect(mockMessageRouter.sendMessage).toHaveBeenCalledWith('TEST_EVENT', 'test-component', { value: 'test' });
    });
  });

  describe('getAllAdapters', () => {
    it('should return all created adapters', async () => {
      const configs = [
        { componentName: 'component1', structuralTomeConfig: {}, messageRouter: mockMessageRouter },
        { componentName: 'component2', structuralTomeConfig: {}, messageRouter: mockMessageRouter }
      ];

      for (const config of configs) {
        await adapter.createAdapter(config as ComponentMiddlewareConfig);
      }

      const allAdapters = adapter.getAllAdapters();
      expect(allAdapters).toHaveLength(2);
      expect(allAdapters.map(a => a.componentName)).toEqual(['component1', 'component2']);
    });

    it('should return empty array when no adapters exist', () => {
      const allAdapters = adapter.getAllAdapters();
      expect(allAdapters).toEqual([]);
    });
  });

  describe('cleanup', () => {
    it('should clear all adapters', async () => {
      const mockConfig: ComponentMiddlewareConfig = {
        componentName: 'test-component',
        structuralTomeConfig: {},
        messageRouter: mockMessageRouter
      };

      await adapter.createAdapter(mockConfig);
      expect(adapter.getAllAdapters()).toHaveLength(1);

      adapter.cleanup();
      expect(adapter.getAllAdapters()).toHaveLength(0);
    });
  });

  describe('adapter methods', () => {
    let testAdapter: any;

    beforeEach(async () => {
      const mockConfig: ComponentMiddlewareConfig = {
        componentName: 'test-component',
        structuralTomeConfig: { id: 'test', name: 'Test' },
        messageRouter: mockMessageRouter
      };

      testAdapter = await adapter.createAdapter(mockConfig);
    });

    describe('sendEvent', () => {
      it('should call message router sendMessage', async () => {
        const event = { type: 'TEST_EVENT', data: { value: 'test' } };
        const result = await testAdapter.sendEvent(event);

        expect(mockMessageRouter.sendMessage).toHaveBeenCalledWith('TEST_EVENT', 'test-component', { value: 'test' });
        expect(result).toEqual({ success: true });
      });
    });

    describe('getState', () => {
      it('should return null (placeholder implementation)', () => {
        const state = testAdapter.getState();
        expect(state).toBeNull();
      });
    });

    describe('getTomeConfig', () => {
      it('should return tome configuration', () => {
        const config = testAdapter.getTomeConfig();
        expect(config).toEqual({ id: 'test', name: 'Test' });
      });
    });
  });

  describe('error handling', () => {
    it('should handle message sending errors', async () => {
      const mockConfig: ComponentMiddlewareConfig = {
        componentName: 'error-component',
        structuralTomeConfig: {},
        messageRouter: mockMessageRouter
      };

      await adapter.createAdapter(mockConfig);

      // Mock message router to throw error
      mockMessageRouter.sendMessage.mockRejectedValue(new Error('Send failed'));

      await expect(adapter.sendMessage('error-component', { type: 'TEST' }))
        .rejects.toThrow('Send failed');
    });
  });

  describe('legacy compatibility', () => {
    it('should support TomeIntegrationBridge alias', () => {
      const legacyAdapter = new TomeIntegrationBridge(mockMessageRouter);
      expect(legacyAdapter).toBeInstanceOf(ComponentMiddlewareAdapter);
    });

    it('should support TomeBridgeConfig alias', () => {
      const legacyConfig: TomeBridgeConfig = {
        componentName: 'test',
        structuralTomeConfig: {},
        messageRouter: mockMessageRouter
      };
      expect(legacyConfig).toBeDefined();
    });
  });
});
