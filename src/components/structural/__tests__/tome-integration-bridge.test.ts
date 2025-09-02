import { TomeIntegrationBridge, TomeBridgeConfig } from '../tome-integration-bridge';

// Mock message router
const mockMessageRouter = {
  sendMessage: jest.fn().mockResolvedValue({ success: true }),
  isConnected: true
};

// Mock existing tome module
const mockExistingTome = {
  sendEvent: jest.fn().mockReturnValue('existing-result'),
  getCurrentState: jest.fn().mockReturnValue({ state: 'idle', data: {} })
};

// Mock dynamic import
const mockImportModule = jest.fn().mockResolvedValue(mockExistingTome);

// Mock the global import function
Object.defineProperty(global, 'import', {
  value: mockImportModule,
  writable: true
});

describe('TomeIntegrationBridge', () => {
  let bridge: TomeIntegrationBridge;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the mock import
    mockImportModule.mockResolvedValue(mockExistingTome);
    
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
      existingTomePath: '../component-middleware/test/TestTomes.tsx',
      structuralTomeConfig: {
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
      expect(result.existingTome).toBe(mockExistingTome);
      expect(result.structuralTome).toBe(mockConfig.structuralTomeConfig);
      expect(result.messageRouter).toBe(mockMessageRouter);
    });

    it('should handle import errors gracefully', async () => {
      mockImportModule.mockRejectedValue(new Error('Import failed'));

      const result = await bridge.createBridge(mockConfig);

      // Should handle import errors gracefully and create bridge with null existingTome
      expect(result).toBeDefined();
      expect(result.componentName).toBe('test-component');
      expect(result.existingTome).toBeNull();
      expect(result.structuralTome).toBe(mockConfig.structuralTomeConfig);
    });

    it('should store bridge in internal map', async () => {
      await bridge.createBridge(mockConfig);
      
      const storedBridge = bridge.getBridge('test-component');
      expect(storedBridge).toBeDefined();
      expect(storedBridge.componentName).toBe('test-component');
    });

    it('should handle missing existingTome gracefully', async () => {
      mockImportModule.mockResolvedValue(null);

      const result = await bridge.createBridge(mockConfig);
      
      expect(result.existingTome).toBeNull();
      expect(result.sendToExisting).toBeDefined();
    });
  });

  describe('getBridge', () => {
    it('should return bridge for existing component', async () => {
      const mockConfig: TomeBridgeConfig = {
        componentName: 'existing-component',
        existingTomePath: 'path/to/tome',
        structuralTomeConfig: {},
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
        existingTomePath: 'path/to/tome',
        structuralTomeConfig: {},
        messageRouter: mockMessageRouter
      };

      await bridge.createBridge(mockConfig);
    });

    it('should send message through bridge successfully', async () => {
      const event = { type: 'TEST_EVENT', data: { value: 'test' } };
      const result = await bridge.sendMessage('test-component', event);

      expect(result).toBeDefined();
      expect(result.existing).toBe('existing-result');
      expect(result.structural).toEqual({ success: true });
      expect(result.bridge).toBeDefined();
    });

    it('should throw error for non-existent bridge', async () => {
      const event = { type: 'TEST_EVENT', data: {} };
      
      await expect(bridge.sendMessage('non-existent', event))
        .rejects.toThrow('No bridge found for component: non-existent');
    });

    it('should call existing tome sendEvent when available', async () => {
      const event = { type: 'TEST_EVENT', data: {} };
      await bridge.sendMessage('test-component', event);

      expect(mockExistingTome.sendEvent).toHaveBeenCalledWith(event);
    });

    it('should handle existing tome without sendEvent method', async () => {
      const mockTomeWithoutSendEvent = { getCurrentState: jest.fn() };
      mockImportModule.mockResolvedValue(mockTomeWithoutSendEvent);

      const mockConfig: TomeBridgeConfig = {
        componentName: 'no-send-event',
        existingTomePath: 'path/to/tome',
        structuralTomeConfig: {},
        messageRouter: mockMessageRouter
      };

      await bridge.createBridge(mockConfig);
      
      const event = { type: 'TEST_EVENT', data: {} };
      const result = await bridge.sendMessage('no-send-event', event);

      expect(result.existing).toBeNull();
      expect(result.structural).toEqual({ success: true });
    });
  });

  describe('getAllBridges', () => {
    it('should return all created bridges', async () => {
      const configs = [
        { componentName: 'component1', existingTomePath: 'path1', structuralTomeConfig: {}, messageRouter: mockMessageRouter },
        { componentName: 'component2', existingTomePath: 'path2', structuralTomeConfig: {}, messageRouter: mockMessageRouter }
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
        existingTomePath: 'path/to/tome',
        structuralTomeConfig: {},
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
        existingTomePath: 'path/to/tome',
        structuralTomeConfig: {},
        messageRouter: mockMessageRouter
      };

      testBridge = await bridge.createBridge(mockConfig);
    });

    describe('sendToExisting', () => {
      it('should call existing tome sendEvent', () => {
        const event = { type: 'TEST_EVENT', data: {} };
        const result = testBridge.sendToExisting(event);

        expect(mockExistingTome.sendEvent).toHaveBeenCalledWith(event);
        expect(result).toBe('existing-result');
      });

      it('should return null when existingTome is null', async () => {
        mockImportModule.mockResolvedValue(null);
        
        const mockConfig: TomeBridgeConfig = {
          componentName: 'null-tome',
          existingTomePath: 'path/to/tome',
          structuralTomeConfig: {},
          messageRouter: mockMessageRouter
        };

        const nullBridge = await bridge.createBridge(mockConfig);
        const result = nullBridge.sendToExisting({ type: 'TEST' });

        expect(result).toBeNull();
      });
    });

    describe('sendToStructural', () => {
      it('should call message router sendMessage', async () => {
        const event = { type: 'TEST_EVENT', data: { value: 'test' } };
        const result = await testBridge.sendToStructural(event);

        expect(mockMessageRouter.sendMessage).toHaveBeenCalledWith('TEST_EVENT', 'test-component', { value: 'test' });
        expect(result).toEqual({ success: true });
      });
    });

    describe('getExistingState', () => {
      it('should return existing tome state', () => {
        const state = testBridge.getExistingState();
        
        expect(mockExistingTome.getCurrentState).toHaveBeenCalled();
        expect(state).toEqual({ state: 'idle', data: {} });
      });

      it('should return null when existingTome is null', async () => {
        mockImportModule.mockResolvedValue(null);
        
        const mockConfig: TomeBridgeConfig = {
          componentName: 'null-tome',
          existingTomePath: 'path/to/tome',
          structuralTomeConfig: {},
          messageRouter: mockMessageRouter
        };

        const nullBridge = await bridge.createBridge(mockConfig);
        const state = nullBridge.getExistingState();

        expect(state).toBeNull();
      });
    });

    describe('getStructuralState', () => {
      it('should return null (placeholder implementation)', () => {
        const state = testBridge.getStructuralState();
        expect(state).toBeNull();
      });
    });

    describe('syncStates', () => {
      it('should log state synchronization', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        
        testBridge.syncStates();
        
        expect(consoleSpy).toHaveBeenCalledWith(
          'Syncing states for test-component:',
          { existingState: { state: 'idle', data: {} }, structuralState: null }
        );
        
        consoleSpy.mockRestore();
      });
    });
  });

  describe('error handling', () => {
    it('should handle bridge creation errors gracefully', async () => {
      const mockConfig: TomeBridgeConfig = {
        componentName: 'error-component',
        existingTomePath: 'path/to/tome',
        structuralTomeConfig: {},
        messageRouter: mockMessageRouter
      };

      // Mock import to throw error
      mockImportModule.mockRejectedValue(new Error('Import failed'));

      const result = await bridge.createBridge(mockConfig);

      // Should handle import errors gracefully and create bridge with null existingTome
      expect(result).toBeDefined();
      expect(result.componentName).toBe('error-component');
      expect(result.existingTome).toBeNull();
    });

    it('should handle message sending errors', async () => {
      const mockConfig: TomeBridgeConfig = {
        componentName: 'error-component',
        existingTomePath: 'path/to/tome',
        structuralTomeConfig: {},
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
