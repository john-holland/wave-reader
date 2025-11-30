import React, { useState } from 'react';
import { useWaveReaderMessageRouter } from './useWaveReaderMessageRouter';

/**
 * Component Integration Example
 * 
 * This example demonstrates how component middleware uses the structural system
 * for message routing and state management.
 */

// Example: GoButton component that uses the structural system
const EnhancedGoButton = () => {
  const [isActive, setIsActive] = useState(false);
  const [selector, setSelector] = useState('');

  // Component middleware uses the structural system's message router
  const {
    isConnected,
    startWaveReader,
    stopWaveReader,
    messageStats,
    sendMessage
  } = useWaveReaderMessageRouter({
    componentName: 'go-button',
    autoProcess: true,
    enableMetrics: true
  });

  const handleStart = async () => {
    if (!isConnected || !selector.trim()) return;

    try {
      // Send through structural system
      const result = await startWaveReader(selector);

      if (result.success) {
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
      const result = await stopWaveReader();

      if (result.success) {
        setIsActive(false);
        console.log('Wave reader stopped successfully');
      }
    } catch (error) {
      console.error('Failed to stop wave reader:', error);
    }
  };

  const handleGoAction = async () => {
    if (!isConnected) return;

    try {
      const result = await sendMessage('GO_ACTION', 'go-button', {
        timestamp: Date.now(),
        action: 'go',
        component: 'go-button'
      });

      console.log('Go action result:', result);
    } catch (error) {
      console.error('Failed to send go action:', error);
    }
  };

  return (
    <div className="enhanced-go-button">
      <h3>Enhanced Go Button (Component Middleware Integration)</h3>
      
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

// Example: WaveTabs component that uses the structural system
const EnhancedWaveTabs = () => {
  const [activeTab, setActiveTab] = useState('wave-tabs');

  // Component middleware uses the structural system's message router
  const {
    isConnected,
    changeTab,
    messageStats,
    sendMessage
  } = useWaveReaderMessageRouter({
    componentName: 'wave-tabs',
    autoProcess: true,
    enableMetrics: true
  });

  const handleTabChange = async (tabId: string) => {
    if (!isConnected) return;

    try {
      const result = await sendMessage('TAB_CHANGE', 'wave-tabs', {
        from: activeTab,
        to: tabId,
        timestamp: Date.now()
      });

      setActiveTab(tabId);
      console.log('Tab change result:', result);
    } catch (error) {
      console.error('Failed to change tab:', error);
    }
  };

  const tabs = [
    { id: 'wave-tabs', name: 'Wave Reader', icon: '🌊' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'about', name: 'About', icon: 'ℹ️' }
  ];

  return (
    <div className="enhanced-wave-tabs">
      <h3>Enhanced Wave Tabs (Component Middleware Integration)</h3>
      
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
        This example demonstrates how component middleware uses the structural system
        for message routing and state management.
      </p>
      
      <div className="integration-section">
        <h3>Component Middleware Architecture</h3>
        <p>
          Component middleware uses the structural system for all communication:
        </p>
        <ul>
          <li><strong>Component Middleware:</strong> React components with UI and business logic</li>
          <li><strong>Structural System:</strong> Provides message routing, priority queuing, and state management</li>
          <li><strong>Integration:</strong> Components use the message router hook to communicate through the structural system</li>
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
│              Component Middleware Layer                     │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ GoButtonTomes   │  │ WaveTabsTomes    │               │
│  │ SettingsTomes   │  │ AboutTomes       │               │
│  └────────┬─────────┘  └────────┬─────────┘               │
│           │                     │                          │
│           └──────────┬──────────┘                          │
│                      │                                      │
│                      ▼                                      │
├─────────────────────────────────────────────────────────────┤
│              Structural System Layer                        │
│  • Enhanced Message Router                                  │
│  • Priority-based routing                                   │
│  • Performance monitoring                                    │
│  • State management                                         │
└─────────────────────────────────────────────────────────────┘
`}
        </pre>
      </div>
    </div>
  );
};

export default ComponentIntegrationExample;
export { EnhancedGoButton, EnhancedWaveTabs };
