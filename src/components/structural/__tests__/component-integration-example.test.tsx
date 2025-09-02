// Setup mocks first
jest.mock('../useWaveReaderMessageRouter', () => ({
  useWaveReaderMessageRouter: jest.fn()
}));

jest.mock('../tome-integration-bridge', () => ({
  TomeIntegrationBridge: jest.fn()
}));

jest.mock('../wave-reader-tome-config', () => ({
  WaveReaderMainTome: {}
}));

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ComponentIntegrationExample, { EnhancedGoButton, EnhancedWaveTabs } from '../component-integration-example';

// Get the mocked modules
const mockUseWaveReaderMessageRouter = require('../useWaveReaderMessageRouter').useWaveReaderMessageRouter;
const mockTomeIntegrationBridge = require('../tome-integration-bridge').TomeIntegrationBridge;
const mockWaveReaderMainTome = require('../wave-reader-tome-config').WaveReaderMainTome;

// Setup mock implementations
const mockHookReturn = {
  isConnected: true,
  startWaveReader: jest.fn().mockResolvedValue({ success: true }),
  stopWaveReader: jest.fn().mockResolvedValue({ success: true }),
  changeTab: jest.fn().mockResolvedValue({ success: true }),
  messageStats: {
    totalMessages: 5,
    successRate: 95.5,
    averageProcessingTime: 150.2,
    errorCount: 0
  },
  lastError: null
};

const mockBridgeInstance = {
  createBridge: jest.fn().mockResolvedValue({
    componentName: 'test-component',
    sendMessage: jest.fn().mockResolvedValue({
      existing: 'existing-result',
      structural: { success: true },
      bridge: {}
    })
  })
};

const mockTomeConfig = {
  machines: {
    goButton: { id: 'go-button', name: 'Go Button' },
    waveTabs: { id: 'wave-tabs', name: 'Wave Tabs' }
  }
};

describe('ComponentIntegrationExample', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock implementations
    mockUseWaveReaderMessageRouter.mockReturnValue(mockHookReturn);
    mockTomeIntegrationBridge.mockImplementation(() => mockBridgeInstance);
    Object.assign(mockWaveReaderMainTome, mockTomeConfig);
  });

  describe('ComponentIntegrationExample', () => {
    it('should render the main integration example', () => {
      render(<ComponentIntegrationExample />);
      
      expect(screen.getByText('🌊 Wave Reader Component Integration Example')).toBeInTheDocument();
      expect(screen.getByText('Dual System Integration')).toBeInTheDocument();
      expect(screen.getByText('Component Integration Bridge')).toBeInTheDocument();
    });

    it('should display architecture overview', () => {
      render(<ComponentIntegrationExample />);
      
      expect(screen.getByText('Architecture Overview')).toBeInTheDocument();
      expect(screen.getByText('Component Integration Bridge')).toBeInTheDocument();
      expect(screen.getByText('TomeIntegrationBridge')).toBeInTheDocument();
    });

    it('should explain the dual system integration', () => {
      render(<ComponentIntegrationExample />);
      
      expect(screen.getByText('Each component now communicates through both systems:')).toBeInTheDocument();
      expect(screen.getByText('Existing System: RobotProxy ProxyStateMachines (component middleware)')).toBeInTheDocument();
      expect(screen.getByText('New System: Enhanced structural system with enhanced message routing')).toBeInTheDocument();
      expect(screen.getByText('Bridge: TomeIntegrationBridge synchronizes both systems')).toBeInTheDocument();
    });
  });

  describe('EnhancedGoButton', () => {
    beforeEach(() => {
      // Reset mock hook for each test
      (mockHookReturn.startWaveReader as jest.Mock).mockResolvedValue({ success: true });
      (mockHookReturn.stopWaveReader as jest.Mock).mockResolvedValue({ success: true });
    });

    it('should render with initial state', () => {
      render(<EnhancedGoButton />);
      
      expect(screen.getByText('Enhanced Go Button (Dual System Integration)')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter CSS selector')).toBeInTheDocument();
      expect(screen.getByText('Start Wave Reader')).toBeInTheDocument();
      expect(screen.getByText('Stop Wave Reader')).toBeInTheDocument();
    });

    it('should display connection status', () => {
      render(<EnhancedGoButton />);
      
      expect(screen.getByText('Connection: 🟢 Connected')).toBeInTheDocument();
    });

    it('should handle selector input changes', () => {
      render(<EnhancedGoButton />);
      
      const selectorInput = screen.getByPlaceholderText('Enter CSS selector');
      fireEvent.change(selectorInput, { target: { value: '.wave-element' } });
      
      expect(selectorInput).toHaveValue('.wave-element');
    });

    it('should start wave reader when start button is clicked', async () => {
      render(<EnhancedGoButton />);
      
      const selectorInput = screen.getByPlaceholderText('Enter CSS selector');
      fireEvent.change(selectorInput, { target: { value: '.wave' } });
      
      const startButton = screen.getByText('Start Wave Reader');
      fireEvent.click(startButton);
      
      await waitFor(() => {
        expect(mockHookReturn.startWaveReader).toHaveBeenCalledWith('.wave');
      });
    });

    it('should stop wave reader when stop button is clicked', async () => {
      render(<EnhancedGoButton />);
      
      const stopButton = screen.getByText('Stop Wave Reader');
      fireEvent.click(stopButton);
      
      await waitFor(() => {
        expect(mockHookReturn.stopWaveReader).toHaveBeenCalled();
      });
    });

    it('should disable start button when no selector is entered', () => {
      render(<EnhancedGoButton />);
      
      const startButton = screen.getByText('Start Wave Reader');
      expect(startButton).toBeDisabled();
    });

    it('should enable start button when selector is entered', () => {
      render(<EnhancedGoButton />);
      
      const selectorInput = screen.getByPlaceholderText('Enter CSS selector');
      fireEvent.change(selectorInput, { target: { value: '.wave' } });
      
      const startButton = screen.getByText('Start Wave Reader');
      expect(startButton).not.toBeDisabled();
    });

    it('should display debug information in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      render(<EnhancedGoButton />);
      
      expect(screen.getByText('Debug Information')).toBeInTheDocument();
      expect(screen.getByText('Total Messages: 5')).toBeInTheDocument();
      expect(screen.getByText('Success Rate: 95.5%')).toBeInTheDocument();
      expect(screen.getByText('Average Processing Time: 150.2ms')).toBeInTheDocument();
      expect(screen.getByText('Error Count: 0')).toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should not display debug information in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      render(<EnhancedGoButton />);
      
      expect(screen.queryByText('Debug Information')).not.toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should handle health check button click', () => {
      render(<EnhancedGoButton />);
      
      const healthCheckButton = screen.getByText('Health Check');
      expect(healthCheckButton).toBeInTheDocument();
    });
  });

  describe('EnhancedWaveTabs', () => {
    beforeEach(() => {
      (mockHookReturn.changeTab as jest.Mock).mockResolvedValue({ success: true });
    });

    it('should render with initial state', () => {
      render(<EnhancedWaveTabs />);
      
      expect(screen.getByText('Enhanced Wave Tabs (Dual System Integration)')).toBeInTheDocument();
      expect(screen.getByText('🌊 Wave Reader')).toBeInTheDocument();
      expect(screen.getByText('⚙️ Settings')).toBeInTheDocument();
      expect(screen.getByText('ℹ️ About')).toBeInTheDocument();
    });

    it('should display connection status', () => {
      render(<EnhancedWaveTabs />);
      
      expect(screen.getByText('Connection: 🟢 Connected')).toBeInTheDocument();
    });

    it('should display active tab', () => {
      render(<EnhancedWaveTabs />);
      
      expect(screen.getByText('Active Tab: wave-tabs')).toBeInTheDocument();
    });

    it('should handle tab changes', async () => {
      render(<EnhancedWaveTabs />);
      
      const settingsTab = screen.getByText('⚙️ Settings');
      fireEvent.click(settingsTab);
      
      await waitFor(() => {
        expect(mockHookReturn.changeTab).toHaveBeenCalledWith('settings');
      });
    });

    it('should update active tab when clicked', async () => {
      render(<EnhancedWaveTabs />);
      
      const aboutTab = screen.getByText('ℹ️ About');
      fireEvent.click(aboutTab);
      
      await waitFor(() => {
        expect(screen.getByText('Active Tab: about')).toBeInTheDocument();
      });
    });

    it('should display bridge status', () => {
      render(<EnhancedWaveTabs />);
      
      expect(screen.getByText('Bridge: 🔴 Inactive')).toBeInTheDocument();
    });

    it('should display debug information in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      render(<EnhancedWaveTabs />);
      
      expect(screen.getByText('Debug Information')).toBeInTheDocument();
      expect(screen.getByText('Total Messages: 5')).toBeInTheDocument();
      expect(screen.getByText('Success Rate: 95.5%')).toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should not display debug information in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      render(<EnhancedWaveTabs />);
      
      expect(screen.queryByText('Debug Information')).not.toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should handle all tab clicks', async () => {
      render(<EnhancedWaveTabs />);
      
      const tabs = [
        { text: '🌊 Wave Reader', id: 'wave-tabs' },
        { text: '⚙️ Settings', id: 'settings' },
        { text: 'ℹ️ About', id: 'about' }
      ];

      for (const tab of tabs) {
        const tabElement = screen.getByText(tab.text);
        fireEvent.click(tabElement);
        
        await waitFor(() => {
          expect(mockHookReturn.changeTab).toHaveBeenCalledWith(tab.id);
        });
      }
    });
  });

  describe('Integration Features', () => {
    it('should demonstrate dual system architecture', () => {
      render(<ComponentIntegrationExample />);
      
      expect(screen.getByText('Dual System Integration')).toBeInTheDocument();
      expect(screen.getByText('Component Integration Bridge')).toBeInTheDocument();
    });

    it('should show bridge architecture diagram', () => {
      render(<ComponentIntegrationExample />);
      
      const architectureSection = screen.getByText('Architecture Overview');
      expect(architectureSection).toBeInTheDocument();
      
      // Check for the ASCII diagram
      expect(screen.getByText('Component Integration Bridge')).toBeInTheDocument();
      expect(screen.getByText('TomeIntegrationBridge')).toBeInTheDocument();
    });

    it('should explain the bridge purpose', () => {
      render(<ComponentIntegrationExample />);
      
      expect(screen.getByText('TomeIntegrationBridge synchronizes both systems')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle connection failures gracefully', () => {
      // Mock disconnected state
      (mockHookReturn as any).isConnected = false;
      
      render(<EnhancedGoButton />);
      
      expect(screen.getByText('Connection: 🔴 Disconnected')).toBeInTheDocument();
    });

    it('should handle message router errors', async () => {
      // Mock error in message router
      (mockHookReturn.startWaveReader as jest.Mock).mockRejectedValue(
        new Error('Message router error')
      );
      
      render(<EnhancedGoButton />);
      
      const selectorInput = screen.getByPlaceholderText('Enter CSS selector');
      fireEvent.change(selectorInput, { target: { value: '.wave' } });
      
      const startButton = screen.getByText('Start Wave Reader');
      fireEvent.click(startButton);
      
      // Should handle error gracefully
      await waitFor(() => {
        expect(mockHookReturn.startWaveReader).toHaveBeenCalled();
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('should display real-time message statistics', () => {
      render(<EnhancedGoButton />);
      
      expect(screen.getByText('Total Messages: 5')).toBeInTheDocument();
      expect(screen.getByText('Success Rate: 95.5%')).toBeInTheDocument();
      expect(screen.getByText('Average Processing Time: 150.2ms')).toBeInTheDocument();
    });

    it('should track error counts', () => {
      render(<EnhancedGoButton />);
      
      expect(screen.getByText('Error Count: 0')).toBeInTheDocument();
    });

    it('should provide health check functionality', () => {
      render(<EnhancedGoButton />);
      
      const healthCheckButton = screen.getByText('Health Check');
      expect(healthCheckButton).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize tome integration bridge on mount', () => {
      render(<EnhancedGoButton />);
      
      // The bridge should be initialized when the component mounts
      expect(mockBridgeInstance.createBridge).toHaveBeenCalled();
    });

    it('should handle component unmounting gracefully', () => {
      const { unmount } = render(<EnhancedGoButton />);
      
      // Component should render
      expect(screen.getByText('Enhanced Go Button (Dual System Integration)')).toBeInTheDocument();
      
      // Unmount should not throw errors
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button labels', () => {
      render(<EnhancedGoButton />);
      
      expect(screen.getByText('Start Wave Reader')).toBeInTheDocument();
      expect(screen.getByText('Stop Wave Reader')).toBeInTheDocument();
      expect(screen.getByText('Health Check')).toBeInTheDocument();
    });

    it('should have proper input labels', () => {
      render(<EnhancedGoButton />);
      
      const selectorInput = screen.getByPlaceholderText('Enter CSS selector');
      expect(selectorInput).toBeInTheDocument();
    });

    it('should display status information clearly', () => {
      render(<EnhancedGoButton />);
      
      expect(screen.getByText('Connection: 🟢 Connected')).toBeInTheDocument();
      expect(screen.getByText('Status: ⚪ Inactive')).toBeInTheDocument();
      expect(screen.getByText('Selector: None')).toBeInTheDocument();
      expect(screen.getByText('Bridge: 🔴 Inactive')).toBeInTheDocument();
    });
  });
});
