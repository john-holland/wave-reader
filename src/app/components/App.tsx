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
import AboutTome from '../../component-middleware/about/AboutTome';
import { DevConsole } from './DevConsole';
import { FeatureToggleService } from '../../config/feature-toggles';


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
  const [showDevConsole, setShowDevConsole] = useState(false);
  
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
        
        // Check developer mode feature toggle
        const checkDeveloperMode = async () => {
          try {
            const appTomeRouter = AppTome.getRouter();
            const bgProxyMachine = appTomeRouter?.resolve('BackgroundProxyMachine');
            const robotCopy = bgProxyMachine?.robotCopy || null;
            
            const toggleService = new FeatureToggleService(robotCopy);
            const enabled = await toggleService.isEnabled('DEVELOPER_MODE');
            setShowDevConsole(enabled);
          } catch (error) {
            console.warn('Failed to check developer mode feature toggle, defaulting to disabled', error);
            setShowDevConsole(false);
          }
        };
        
        checkDeveloperMode();
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
          hideHeader={true}
        >
          <AboutTome />
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
      {showDevConsole && <DevConsole />}
      <ModalContainer>
        <ModalHeader>
          <HeaderTitle>Wave Reader</HeaderTitle>
          <HeaderActions>
            {(() => {
              const context = AppTome.getContext();
              const going = context?.viewModel?.going || false;
              console.log('🌊 App Component: Button state - going:', going);
              
              return going ? (
                <StopWaveButton onClick={async () => {
                  console.log('🌊 App Component: Stop button clicked');
                  try {
                    await AppTome.send(MACHINE_NAMES.APP, 'STOP');
                  } catch (error) {
                    console.error('🌊 App Component: Failed to send STOP:', error);
                  }
                }}>
                  Stop
                </StopWaveButton>
              ) : (
                <StartWaveButton onClick={async () => {
                  console.log('🌊 App Component: Start button clicked');
                  try {
                    await AppTome.send(MACHINE_NAMES.APP, 'START');
                  } catch (error) {
                    console.error('🌊 App Component: Failed to send START:', error);
                  }
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

