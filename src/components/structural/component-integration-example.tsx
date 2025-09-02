import React, { useState, useEffect } from 'react';
import { useWaveReaderMessageRouter } from './useWaveReaderMessageRouter';
import { TomeIntegrationBridge } from './tome-integration-bridge';
import { WaveReaderMainTome } from './wave-reader-tome-config';

/**
 * Component Integration Example
 * 
 * This example shows how to integrate existing component middleware tomes
 * with the new structural system using the TomeIntegrationBridge.
 */

// Example: Enhanced GoButton that uses both systems
const EnhancedGoButton = () => {
  const [isActive, setIsActive] = useState(false);
  const [selector, setSelector] = useState('');

  // Use the message router for structural system communication
  const {
    isConnected,
    startWaveReader,
    stopWaveReader,
    messageStats
  } = useWaveReaderMessageRouter({
    componentName: 'go-button',
    autoProcess: true,
    enableMetrics: true
  });

  // Create tome integration bridge
  const [tomeBridge, setTomeBridge] = useState<TomeIntegrationBridge | null>(null);

  useEffect(() => {
    if (isConnected) {
      // Initialize the bridge when connected
      const bridge = new TomeIntegrationBridge({
        sendMessage: async (type: string, target: string, data: any) => {
          // This would use the actual message router
          console.log('Sending message through bridge:', { type, target, data });
          return { success: true };
        }
      });

      // Create bridge for go-button component
      bridge.createBridge({
        componentName: 'go-button',
        existingTomePath: '../component-middleware/go-button/GoButtonTomes.tsx',
        structuralTomeConfig: WaveReaderMainTome.machines.goButton,
        messageRouter: { sendMessage: async () => ({ success: true }) }
      }).then(() => {
        setTomeBridge(bridge);
      });
    }
  }, [isConnected]);

  const handleStart = async () => {
    if (!isConnected || !selector.trim()) return;

    try {
      // Send through structural system
      const structuralResult = await startWaveReader(selector);
      
      // Also send through existing tome system if bridge is available
      if (tomeBridge) {
        const bridgeResult = await tomeBridge.sendMessage('go-button', {
          type: 'GO',
          data: { selector }
        });
        console.log('Bridge result:', bridgeResult);
      }

      if (structuralResult.success) {
        setIsActive(true);
        console.log('Wave reader started successfully');
      }
    } catch (error) {
      console.error('Failed to start wave reader:', error);
    }
  };

  const handleStop = async () => {
    if (!isConnected) return;

    try {
      // Send through structural system
      const structuralResult = await stopWaveReader();
      
      // Also send through existing tome system if bridge is available
      if (tomeBridge) {
        const bridgeResult = await tomeBridge.sendMessage('go-button', {
          type: 'STOP',
          data: {}
        });
        console.log('Bridge result:', bridgeResult);
      }

      if (structuralResult.success) {
        setIsActive(false);
        console.log('Wave reader stopped successfully');
      }
    } catch (error) {
      console.error('Failed to stop wave reader:', error);
    }
  };

  return (
    <div className="enhanced-go-button">
      <h3>Enhanced Go Button (Dual System Integration)</h3>
      
      <div className="input-section">
        <input
          type="text"
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          placeholder="Enter CSS selector"
          disabled={!isConnected}
        />
      </div>

      <div className="button-section">
        <button
          onClick={handleStart}
          disabled={!isConnected || !selector.trim() || isActive}
          className="start-button"
        >
          Start Wave Reader
        </button>
        
        <button
          onClick={handleStop}
          disabled={!isConnected || !isActive}
          className="stop-button"
        >
          Stop Wave Reader
        </button>
      </div>

      <div className="status-section">
        <div>Connection: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>
        <div>Status: {isActive ? '🟢 Active' : '⚪ Inactive'}</div>
        <div>Selector: {selector || 'None'}</div>
        <div>Bridge: {tomeBridge ? '🟢 Active' : '🔴 Inactive'}</div>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="debug-section">
          <h4>Debug Information</h4>
          <div>Total Messages: {messageStats.totalMessages}</div>
          <div>Success Rate: {messageStats.successRate.toFixed(1)}%</div>
          <div>Average Processing Time: {messageStats.averageProcessingTime.toFixed(2)}ms</div>
          <div>Error Count: {messageStats.errorCount}</div>
        </div>
      )}
    </div>
  );
};

// Example: Enhanced WaveTabs that uses both systems
const EnhancedWaveTabs = () => {
  const [activeTab, setActiveTab] = useState('wave-tabs');

  const {
    isConnected,
    changeTab,
    messageStats
  } = useWaveReaderMessageRouter({
    componentName: 'wave-tabs',
    autoProcess: true,
    enableMetrics: true
  });

  const [tomeBridge, setTomeBridge] = useState<TomeIntegrationBridge | null>(null);

  useEffect(() => {
    if (isConnected) {
      const bridge = new TomeIntegrationBridge({
        sendMessage: async (type: string, target: string, data: any) => {
          console.log('Sending message through bridge:', { type, target, data });
          return { success: true };
        }
      });

      bridge.createBridge({
        componentName: 'wave-tabs',
        existingTomePath: '../component-middleware/wave-tabs/WaveTabsTomes.tsx',
        structuralTomeConfig: WaveReaderMainTome.machines.waveTabs,
        messageRouter: { sendMessage: async () => ({ success: true }) }
      }).then(() => {
        setTomeBridge(bridge);
      });
    }
  }, [isConnected]);

  const handleTabChange = async (tabId: string) => {
    setActiveTab(tabId);
    
    if (isConnected) {
      try {
        // Send through structural system
        const structuralResult = await changeTab(tabId);
        
        // Also send through existing tome system if bridge is available
        if (tomeBridge) {
          const bridgeResult = await tomeBridge.sendMessage('wave-tabs', {
            type: 'TAB_SELECT',
            data: { tabId }
          });
          console.log('Bridge result:', bridgeResult);
        }

        if (structuralResult.success) {
          console.log('Tab changed successfully');
        }
      } catch (error) {
        console.error('Failed to change tab:', error);
      }
    }
  };

  const tabs = [
    { id: 'wave-tabs', name: 'Wave Reader', icon: '🌊' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'about', name: 'About', icon: 'ℹ️' }
  ];

  return (
    <div className="enhanced-wave-tabs">
      <h3>Enhanced Wave Tabs (Dual System Integration)</h3>
      
      <div className="tabs-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            disabled={!isConnected}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="status-section">
        <div>Connection: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>
        <div>Active Tab: {activeTab}</div>
        <div>Bridge: {tomeBridge ? '🟢 Active' : '🔴 Inactive'}</div>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="debug-section">
          <h4>Debug Information</h4>
          <div>Total Messages: {messageStats.totalMessages}</div>
          <div>Success Rate: {messageStats.successRate.toFixed(1)}%</div>
        </div>
      )}
    </div>
  );
};

// Main integration example component
const ComponentIntegrationExample = () => {
  return (
    <div className="component-integration-example">
      <h2>🌊 Wave Reader Component Integration Example</h2>
      <p>
        This example demonstrates how to integrate existing component middleware tomes
        with the new structural system using the TomeIntegrationBridge.
      </p>
      
      <div className="integration-section">
        <h3>Dual System Integration</h3>
        <p>
          Each component now communicates through both systems:
        </p>
        <ul>
          <li><strong>Existing System:</strong> RobotProxy ProxyStateMachines (component middleware)</li>
          <li><strong>New System:</strong> Structural system with enhanced message routing</li>
          <li><strong>Bridge:</strong> TomeIntegrationBridge synchronizes both systems</li>
        </ul>
      </div>

      <div className="components-section">
        <EnhancedGoButton />
        <EnhancedWaveTabs />
      </div>

      <div className="architecture-section">
        <h3>Architecture Overview</h3>
        <pre>
{`
┌─────────────────────────────────────────────────────────────┐
│                Component Integration Bridge                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │ Existing Tomes      │    │   New Structural System    │ │
│  │ (Component Middleware) │  │                             │ │
│  │ • GoButtonTomes    │    │ • Enhanced Message Router   │ │
│  │ • WaveTabsTomes    │    │ • Priority-based routing    │ │
│  │ • RobotProxy       │    │ • Performance monitoring    │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    TomeIntegrationBridge                    │
│              (Synchronizes Both Systems)                   │
└─────────────────────────────────────────────────────────────┘
`}
        </pre>
      </div>
    </div>
  );
};

export default ComponentIntegrationExample;
export { EnhancedGoButton, EnhancedWaveTabs };
