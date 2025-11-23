import React, { FunctionComponent, useEffect, useState } from 'react';
import { ErrorBoundary } from '../../components/error-boundary';
import { AppTome } from '../tomes/AppTome';
import { MACHINE_NAMES } from '../machines/machine-names';
import {
  ModalContainer,
  ModalHeader,
  HeaderTitle,
  HeaderActions,
  StartWaveButton,
  StopWaveButton,
  CollapseButton
} from '../../components/styled/AppStyles';
import SimpleTabs from './SimpleTabs';
import EditorWrapper from './EditorWrapper';
import SettingsTomes from '../../component-middleware/settings/SettingsTomes';
import SettingsService from '../../services/settings';
import Options, { WaveToggleConfig } from '../../models/options';


const settingsService = new SettingsService();

/**
 * App Component
 * 
 * Clean React entry point for the Wave Reader application
 * Uses the AppTome with observable pattern for reactive rendering
 */
const AppComponent: FunctionComponent = () => {
  // Use the observable pattern to track view changes
  const [currentViewKey, setCurrentViewKey] = useState(AppTome.getViewKey());
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSettings, setCurrentSettings] = useState<Options | null>(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'how-to' | 'settings' | 'about'>('how-to');
  
  useEffect(() => {
    settingsService.getCurrentSettings().then((settings) => {
      setCurrentSettings(settings);
    });

    // Subscribe to view key changes
    const unsubscribe = AppTome.observeViewKey(setCurrentViewKey);
    
    // Initialize the tome
    AppTome.initialize()
      .then(() => {
        console.log('🌊 App Component: AppTome initialized successfully');
        setIsInitialized(true);
      })
      .catch((err) => {
        console.error('🌊 App Component: Failed to initialize AppTome', err);
        setError(err.message || 'Failed to initialize');
        setIsInitialized(true); // Set to true to show error state
      });
    
    // Cleanup on unmount
    return () => {
      unsubscribe();
      AppTome.cleanup();
    };
  }, []);
  
  // Debug log for view key changes
  useEffect(() => {
    console.log('🌊 App Component: View key changed:', currentViewKey);
  }, [currentViewKey, currentSettings]);

  // Tab configuration for SimpleTabs using EditorWrapper components
  const tabs = [
    {
      id: 'how-to',
      name: 'How to',
      content: (
        <EditorWrapper
          title="How to Use Wave Reader"
          description="Learn how to use Wave Reader to animate web pages"
          componentId="how-to-component"
          onError={(error: Error) => console.error('HowTo Editor Error:', error)}
        >
          <div style={{ padding: '20px' }}>
            <h2>Getting Started</h2>
            <p>Click the <strong>Start</strong> button to begin animating elements on the page. Wave Reader will animate elements that match your selector.</p>
            
            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #bbdefb',
              margin: '15px 0'
            }}>
              <h3>Pro Tip</h3>
              <p>Use CSS selectors to target specific elements:</p>
              <ul>
                <li><code>p</code> - All paragraphs</li>
                <li><code>.highlight</code> - Elements with "highlight" class</li>
                <li><code>#main-content</code> - Element with "main-content" ID</li>
              </ul>
            </div>
            
            <h3>Keyboard Shortcuts</h3>
            <p>Toggle Wave Reader: <strong>{(currentSettings?.toggleKeys.keyChord.join(' + ')) || WaveToggleConfig.getDefaultConfig().keyChord.join(' + ')}</strong></p>
          </div>
        </EditorWrapper>
      ),
      state: { type: 'how-to' }
    },
    {
      id: 'settings',
      name: 'Settings',
      content: (
        <SettingsTomes
          onUpdateSettings={(settings) => {
            console.log('🌊 App Component: Settings updated:', settings);
            // Settings are automatically saved to Chrome storage by SettingsTomes
          }}
        />
      ),
      state: { type: 'settings' }
    },
    {
      id: 'about',
      name: 'About',
      content: (
        <EditorWrapper
          title="About Wave Reader"
          description="Information about Wave Reader and its features"
          componentId="about-component"
          onError={(error: Error) => console.error('About Editor Error:', error)}
        >
          <div style={{ padding: '20px', color: '#333' }}>
            <h2 style={{ color: '#2c3e50', marginTop: 0 }}>About Wave Reader</h2>
            
            <div style={{
              backgroundColor: '#e8f5e8',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #c8e6c9',
              marginBottom: '20px',
              color: '#2c3e50'
            }}>
              <h3 style={{ color: '#2c3e50', marginTop: 0 }}>Wave Reader v1.0</h3>
              <p style={{ color: '#495057', marginBottom: 0 }}>Wave Reader is a Chrome extension that brings beautiful wave animations to web pages. Select elements and watch them come alive with smooth, flowing animations.</p>
            </div>
            
            <h3 style={{ color: '#2c3e50' }}>Features</h3>
            <ul style={{ color: '#495057' }}>
              <li><strong>CSS Selector Support:</strong> Target any element using CSS selectors</li>
              <li><strong>Keyboard Shortcuts:</strong> Quick access with customizable hotkeys</li>
              <li><strong>Smooth Animations:</strong> Beautiful wave effects that enhance user experience</li>
              <li><strong>Real-time Control:</strong> Start and stop animations instantly</li>
              <li><strong>Customizable Settings:</strong> Adjust animation speed and behavior</li>
            </ul>
            
            <div style={{
              backgroundColor: '#f0f8ff',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #b3d9ff',
              marginTop: '20px',
              color: '#2c3e50'
            }}>
              <h4 style={{ color: '#2c3e50', marginTop: 0 }}>Technical Details</h4>
              <p style={{ color: '#495057', marginBottom: '8px' }}><strong>Architecture:</strong> Tome-based state management with XState machines</p>
              <p style={{ color: '#495057', marginBottom: '8px' }}><strong>Rendering:</strong> React with ViewStateMachine integration</p>
              <p style={{ color: '#495057', marginBottom: 0 }}><strong>Communication:</strong> Chrome Extension APIs with background scripts</p>
            </div>
          </div>
        </EditorWrapper>
      ),
      state: { type: 'about' }
    }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as 'how-to' | 'settings' | 'about');
    console.log('🌊 App Component: Tab changed to:', tabId);
  };
  
  return (
    <ErrorBoundary>
      <ModalContainer>
        <ModalHeader>
          <HeaderTitle>Wave Reader</HeaderTitle>
          <HeaderActions>
            {(() => {
              const context = AppTome.getContext();
              const going = context?.viewModel?.going || false;
              console.log('🌊 App Component: Button state - going:', going);
              
              return going ? (
                <StopWaveButton onClick={() => {
                  console.log('🌊 App Component: Stop button clicked');
                  AppTome.send(MACHINE_NAMES.APP, 'STOP');
                }}>
                  Stop
                </StopWaveButton>
              ) : (
                <StartWaveButton onClick={() => {
                  console.log('🌊 App Component: Start button clicked');
                  AppTome.send(MACHINE_NAMES.APP, 'START');
                }}>
                  Start
                </StartWaveButton>
              );
            })()}
            <CollapseButton onClick={() => {
              console.log('🌊 App Component: Settings button clicked');
              // Toggle to settings tab
              if (activeTab !== 'settings') {
                handleTabChange('settings');
              }
            }}>
              ⚙️
            </CollapseButton>
          </HeaderActions>
        </ModalHeader>
        
        <div style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          {!isInitialized && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>Loading...</p>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                .spinner {
                  animation: spin 1s linear infinite;
                  display: inline-block;
                }
              `}</style>
              <div className="spinner">⏳</div>
            </div>
          )}
          
          {isInitialized && error && (
            <div style={{ padding: '20px', color: 'red' }}>
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          )}
          
          {isInitialized && !error && (
            <SimpleTabs 
              activeTab={activeTab}
              tabs={tabs}
              onTabChange={handleTabChange}
            />
          )}
        </div>
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f0f0f0',
            borderTop: '1px solid #ccc',
            fontSize: '12px'
          }}>
            <strong>Debug Info:</strong>
            <div>View Key: {currentViewKey}</div>
            <div>Initialized: {isInitialized ? 'Yes' : 'No'}</div>
            <div>Error: {error || 'None'}</div>
          </div>
        )}
      </ModalContainer>
    </ErrorBoundary>
  );
};

export default AppComponent;

