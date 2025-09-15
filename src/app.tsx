import React, { FunctionComponent, useEffect, useState, useCallback, useRef } from 'react'
import styled from "styled-components";
import './styles.scss';
import { ErrorBoundary } from './components/error-boundary';
import { Settings } from './components/settings';
import WaveTabs from './components/wave-tabs';
import About from './components/about';
import ErrorTestComponent from './components/ErrorTestComponent';
import ErrorDemoComponent from './components/ErrorDemoComponent';
import { getSyncObject, setSyncObject } from './util/sync';
import { guardLastError } from "./util/util";
import configured from './config/config';
import SettingsService from "./services/settings";
import MLSettingsService from "./services/ml-settings-service";
import { SelectorsDefaultFactory } from "./models/defaults";
import Options from "./models/options";
import Wave from "./models/wave";
import { StartMessage, StopMessage, ToggleMessage, MessageFactory, MessageUtility } from "./models/messages/simplified-messages";
import { 
  WaveReaderMessageRouter,
  useWaveReaderMessageRouter
} from './components/structural';
import { createProxyRobotCopyStateMachine, createTomeConfig, createViewStateMachine, TomeManager } from 'log-view-machine';



// Check if we're in development mode
const isDevelopment = configured.mode !== 'production';

// Global refresh function for manual state sync
let globalRefreshFunction: (() => void) | null = null;

// Function to send messages to content script
const sendExtensionMessage = async (message: any) => {
  try {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      const response = await chrome.runtime.sendMessage(message);
      return response;
    } else {
      console.warn('Chrome runtime not available');
      return { success: false, error: 'Chrome runtime not available' };
    }
  } catch (error: any) {
    console.error('Failed to send message to content script:', error);
    return { success: false, error: error.message };
  }
};


// Styled components optimized for Chrome extension popup
const WaveReader = styled.div`
  width: 400px; // Smaller width for popup
  max-height: 600px; // Limit height for popup
  overflow-y: auto;
  font-size: 14px; // Smaller font for popup
`;

const PopupHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 15px;
  text-align: center;
  border-radius: 8px 8px 0 0;
  
  h1 {
    margin: 0 0 5px 0;
    font-size: 1.5rem; // Smaller for popup
    font-weight: 700;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const PopupContent = styled.div`
  padding: 15px;
`;

const CompactButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin: 2px;
  
  &.btn-primary {
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a6fd8;
      transform: translateY(-1px);
    }
  }
  
  &.btn-success {
    background: #28a745;
    color: white;
    
    &:hover {
      background: #218838;
      transform: translateY(-1px);
    }
  }
  
  &.btn-secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
      transform: translateY(-1px);
    }
  }
  
  &.btn-danger {
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
      transform: translateY(-1px);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const CompactInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 10px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

const CompactSection = styled.div`
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 1rem;
    color: #2c3e50;
  }
`;

const CompactSelectorItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  margin-bottom: 6px;
  background: white;
  font-size: 12px;
  
  .selector-text {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    background: #f8f9fa;
    padding: 2px 6px;
    border-radius: 3px;
    color: #495057;
  }
  
  .selector-actions {
    display: flex;
    gap: 4px;
  }
`;

interface StatusIndicatorProps {
  isActive: boolean;
}

const StatusIndicator = styled.div<StatusIndicatorProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: ${props => props.isActive ? '#d4edda' : '#f8f9fa'};
  border: 1px solid ${props => props.isActive ? '#c3e6cb' : '#e9ecef'};
  border-radius: 4px;
  margin-bottom: 12px;
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.isActive ? '#28a745' : '#6c757d'};
    animation: ${props => props.isActive ? 'pulse 1.5s infinite' : 'none'};
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

// Unified App component using Tome architecture
// Helper function for extension message communication (moved outside component)
const sendExtensionMessage = async (message: any) => {
    try {
        return await chrome.runtime.sendMessage(message);
    } catch (error: any) {
        console.error('🌊 Unified App: Failed to send extension message:', error);
        throw new Error(`Failed to communicate with extension: ${error.message || 'Unknown error'}`);
    }
}

// Global refresh function for state synchronization
let globalRefreshFunction: (() => void) | null = null;

const AppUnified: FunctionComponent = () => {
    const [selector, setSelector] = useState('p');
    const [saved, setSaved] = useState(true);
    const [going, setGoing] = useState(false);
    const [selectors, setSelectors] = useState<string[]>([]);
    const [currentView, setCurrentView] = useState('main');
    const [isExtension, setIsExtension] = useState(false);
    const [settings, setSettings] = useState<Options | null>(null);
    const [showNotifications, setShowNotifications] = useState(true);

    // Initialize services
    const settingsService = new SettingsService();
    const mlSettingsService = new MLSettingsService();

    useEffect(() => {
        // Check if we're running in a Chrome extension context
        const checkExtensionContext = () => {
            return typeof chrome !== 'undefined' && 
                   chrome.runtime && 
                   chrome.runtime.id;
        };

        const extensionContext = checkExtensionContext();
        setIsExtension(Boolean(extensionContext));

        // Set up message listener for state changes from background script
        if (extensionContext && chrome.runtime && chrome.runtime.onMessage) {
            const messageListener = async (message: any) => {
                console.log('🌊 Popup: Received message from background:', message);
                if (message.from === 'background-script' && message.name === 'KEYBOARD_TOGGLE') {
                    console.log('🌊 Popup: Keyboard toggle detected, sending to app state machine');
                    
                    // Send keyboard toggle event to the app state machine
                    AppMachine.send('KEYBOARD_TOGGLE');
                }
            };
            
            chrome.runtime.onMessage.addListener(messageListener);
            
            // Cleanup listener on unmount
            return () => {
                chrome.runtime.onMessage.removeListener(messageListener);
            };
        }

        // Initialize the app
        const initializeApp = async () => {
            try {
                if (extensionContext) {
                    // Load saved settings and selectors from Chrome storage
                    if (chrome.storage && chrome.storage.local) {
                        const result = await chrome.storage.local.get([
                            'waveReaderSettings', 
                            'waveReaderSelectors',
                            'currentSelector',
                            'going'
                        ]);
                        
                        if (result.waveReaderSelectors) {
                            setSelectors(result.waveReaderSelectors);
                        }
                        
                        if (result.currentSelector) {
                            setSelector(result.currentSelector);
                        }

                        if (result.going) {
                            setGoing(result.going.going || false);
                        } else {
                            // If no going state is stored, default to false
                            setGoing(false);
                        }
                    }

                    // Load current settings
                    const currentSettings = await settingsService.getCurrentSettings();
                    if (currentSettings) {
                        setSettings(new Options(currentSettings));
                        setShowNotifications(currentSettings.showNotifications || true);
                    }

                    // Check current state from content script
                    try {
                        const statusMessage = {
                            name: 'get-status',
                            from: 'popup'
                        };
                        const statusResponse = await sendExtensionMessage(statusMessage) as any;
                        if (statusResponse && statusResponse.success && statusResponse.status) {
                            // Update going state based on content script status
                            const isGoing = statusResponse.status.going || false;
                            setGoing(isGoing);
                            console.log('🌊 Popup: Updated going state from content script:', isGoing);
                        }
                    } catch (error) {
                        console.log('🌊 Popup: Could not get status from content script:', error);
                        // Fall back to stored state
                    }
                } else {
                    // Fallback to localStorage for non-extension context
                    const savedSelectorsData = localStorage.getItem('waveReaderSelectors');
                    const savedSelector = localStorage.getItem('waveReaderSelector');
                    const savedGoing = localStorage.getItem('waveReaderGoing');
                    
                    if (savedSelectorsData) {
                        setSelectors(JSON.parse(savedSelectorsData));
                    }
                    
                    if (savedSelector) {
                        setSelector(savedSelector);
                    }

                    if (savedGoing) {
                        setGoing(JSON.parse(savedGoing));
                    }
                }
                
                console.log('🌊 Unified App: Initialized for Chrome extension context');
            } catch (error) {
                console.error('🌊 Unified App: Failed to initialize:', error);
            }
        };

        initializeApp();
    }, []);


    // Start wave reading with enhanced functionality from app.tsx
    const onGo = async () => {
        try {
            if (isExtension) {
                // Get current settings and create wave
                const currentOptions = await settingsService.getCurrentSettings();
                const options = new Options(currentOptions);
                
                // Create wave with current selector and settings
                const wave = new Wave({ 
                    selector: selector,
                    ...currentOptions.wave // Include all wave settings including waveSpeed
                });
                options.wave = wave.update();

                // Show notification if enabled
                if (options.showNotifications) {
                    try {
                        const notifOptions = {
                            type: "basic",
                            iconUrl: "icons/waver48.png",
                            title: "wave reader",
                            message: "reading",
                        };

                        // @ts-ignore
                        chrome.notifications.create("", notifOptions, guardLastError);
                    } catch (error) {
                        console.warn("Could not create notification:", error);
                    }
                }

                // Send start message
                const startMessage = new StartMessage({ options });
                await sendExtensionMessage(startMessage);
                
                // Update sync state
                setSyncObject("going", { going: true });
                setGoing(true);
                setSaved(true);
                
                console.log('🌊 Unified App: Wave reader started via extension');
            } else {
                setGoing(true);
                setSaved(true);
                localStorage.setItem('waveReaderGoing', JSON.stringify(true));
                console.log('🌊 Unified App: Wave reader started (non-extension mode)');
            }
        } catch (error: any) {
            console.error('🌊 Unified App: Failed to start wave reader:', error);
            alert(`Failed to start wave reader: ${error.message || 'Unknown error'}`);
        }
    };

    // Stop wave reading
    const onStop = async () => {
        try {
            if (isExtension) {
                const stopMessage = new StopMessage();
                await sendExtensionMessage(stopMessage);
                
                // Update sync state
                setSyncObject("going", { going: false });
                setGoing(false);
                setSaved(true);
                
                console.log('🌊 Unified App: Wave reader stopped via extension');
            } else {
                setGoing(false);
                setSaved(true);
                localStorage.setItem('waveReaderGoing', JSON.stringify(false));
                console.log('🌊 Unified App: Wave reader stopped (non-extension mode)');
            }
        } catch (error: any) {
            console.error('🌊 Unified App: Failed to stop wave reader:', error);
            alert(`Failed to stop wave reader: ${error.message || 'Unknown error'}`);
        }
    };

    // Toggle wave reading
    const onToggle = async () => {
        if (going) {
            await onStop();
        } else {
            await onGo();
        }
    };

    // Update selector
    const onSelectorUpdate = async (newSelector: string) => {
        try {
            if (isExtension) {
                // Send message to background script
                const response = await sendExtensionMessage({
                    name: 'selector-updated',
                    selector: newSelector,
                    from: 'popup'
                });
                
                if (response) {
                    setSelector(newSelector);
                    setSaved(true);
                    
                    // Save to Chrome storage
                    if (chrome.storage && chrome.storage.local) {
                        await chrome.storage.local.set({ currentSelector: newSelector });
                    }
                }
            } else {
                // Fallback for non-extension context
                setSelector(newSelector);
                setSaved(true);
                localStorage.setItem('waveReaderSelector', newSelector);
            }
        } catch (error) {
            console.error('🌊 Unified App: Failed to update selector:', error);
        }
    };

    // Add selector
    const onAddSelector = async (newSelector: string) => {
        try {
            if (isExtension) {
                // Send message to background script
                const response = await sendExtensionMessage({
                    name: 'selector-added',
                    selector: newSelector,
                    from: 'popup'
                });
                
                if (response) {
                    setSelectors(prev => [...new Set([...prev, newSelector])]);
                    setSaved(true);
                    
                    // Save to Chrome storage
                    if (chrome.storage && chrome.storage.local) {
                        await chrome.storage.local.set({ 
                            waveReaderSelectors: [...selectors, newSelector] 
                        });
                    }
                }
            } else {
                // Fallback for non-extension context
                setSelectors(prev => [...new Set([...prev, newSelector])]);
                setSaved(true);
                localStorage.setItem('waveReaderSelectors', JSON.stringify([...selectors, newSelector]));
            }
        } catch (error) {
            console.error('🌊 Unified App: Failed to add selector:', error);
        }
    };

    // Remove selector
    const onRemoveSelector = async (selectorToRemove: string) => {
        try {
            if (isExtension) {
                // Send message to background script
                const response = await sendExtensionMessage({
                    name: 'selector-removed',
                    selector: selectorToRemove,
                    from: 'popup'
                });
                
                if (response) {
                    setSelectors(prev => prev.filter(s => s !== selectorToRemove));
                    setSaved(true);
                    
                    // Save to Chrome storage
                    if (chrome.storage && chrome.storage.local) {
                        await chrome.storage.local.set({ 
                            waveReaderSelectors: selectors.filter(s => s !== selectorToRemove) 
                        });
                    }
                }
            } else {
                // Fallback for non-extension context
                setSelectors(prev => prev.filter(s => s !== selectorToRemove));
                setSaved(true);
                localStorage.setItem('waveReaderSelectors', JSON.stringify(selectors.filter(s => s !== selectorToRemove)));
            }
        } catch (error) {
            console.error('🌊 Unified App: Failed to remove selector:', error);
        }
    };

    // Show settings
    const onShowSettings = () => {
        setCurrentView('settings');
    };

    // Go back to main view
    const onGoBackToMain = () => {
        setCurrentView('main');
    };

    // Handle selector mode
    const onSelectorModeToggle = async (enabled: boolean) => {
        if (enabled) {
            setCurrentView('selector-selection');
        } else {
            setCurrentView('main');
        }
    };

    // Update wave settings
    const updateWaveSettings = (newSettings: Partial<Options>) => {
        if (settings) {
            const updatedSettings = new Options({
                ...settings,
                ...newSettings
            });
            setSettings(updatedSettings);
            setSaved(false);
        }
    };

    // Save settings
    const saveSettings = async () => {
        try {
            if (isExtension && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.set({ 
                    waveReaderSettings: settings 
                });
                setSaved(true);
                console.log('🌊 Settings saved successfully');
            } else {
                localStorage.setItem('waveReaderSettings', JSON.stringify(settings));
                setSaved(true);
                console.log('🌊 Settings saved to localStorage');
            }
        } catch (error) {
            console.error('🌊 Failed to save settings:', error);
        }
    };

    // Reset settings to defaults
    const resetSettings = () => {
        if (window.confirm('Are you sure you want to reset to default settings?')) {
            const defaultSettings = new Options();
            setSettings(defaultSettings);
            setSaved(false);
        }
    };

    // View components using withState pattern
    const withState = <T extends Record<string, any>>(Component: React.ComponentType<T>, props: T) => {
        return <Component {...props} />;
    };


    // Settings View Component
    const SettingsView = () => (
        <div>
            <h3>⚙️ Settings</h3>
            
            {/* Save Status */}
            <CompactSection>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Status</h4>
                    <span style={{ 
                        color: saved ? '#28a745' : '#ffc107',
                        fontWeight: 'bold'
                    }}>
                        {saved ? '✅ Saved' : '🌊 Unsaved Changes'}
                    </span>
                </div>
            </CompactSection>

            {/* Basic Settings */}
            <CompactSection>
                <h4>Basic Settings</h4>
                <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={showNotifications}
                            onChange={(e) => {
                                setShowNotifications(e.target.checked);
                                if (settings) {
                                    updateWaveSettings({ showNotifications: e.target.checked });
                                }
                            }}
                        />
                        Show Notifications
                    </label>
                </div>
            </CompactSection>

            {/* Wave Animation Settings */}
            <CompactSection>
                <h4>🌊 Wave Animation</h4>
                
                {/* Wave Speed */}
                <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                        Wave Speed: {settings?.wave?.waveSpeed || 4}s
                    </label>
                    <input
                        type="range"
                        min="0.5"
                        max="10"
                        step="0.5"
                        value={settings?.wave?.waveSpeed || 4}
                        onChange={(e) => {
                            if (settings?.wave) {
                                const newWave = new Wave(settings.wave);
                                newWave.waveSpeed = parseFloat(e.target.value);
                                updateWaveSettings({ wave: newWave });
                            }
                        }}
                        style={{ width: '100%' }}
                    />
                </div>


                {/* Axis Translation */}
                <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                        X Translation: {settings?.wave?.axisTranslateAmountXMin || -1} to {settings?.wave?.axisTranslateAmountXMax || 1}
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="number"
                            placeholder="Min"
                            value={settings?.wave?.axisTranslateAmountXMin || -1}
                            onChange={(e) => {
                                if (settings?.wave) {
                                    const newWave = new Wave(settings.wave);
                                    newWave.axisTranslateAmountXMin = parseFloat(e.target.value) || 0;
                                    updateWaveSettings({ wave: newWave });
                                }
                            }}
                            style={{ width: '50%', padding: '4px', fontSize: '12px' }}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={settings?.wave?.axisTranslateAmountXMax || 1}
                            onChange={(e) => {
                                if (settings?.wave) {
                                    const newWave = new Wave(settings.wave);
                                    newWave.axisTranslateAmountXMax = parseFloat(e.target.value) || 0;
                                    updateWaveSettings({ wave: newWave });
                                }
                            }}
                            style={{ width: '50%', padding: '4px', fontSize: '12px' }}
                        />
                    </div>
                </div>

                {/* Axis Rotation */}
                <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                        Y Rotation: {settings?.wave?.axisRotationAmountYMin || -2}° to {settings?.wave?.axisRotationAmountYMax || 2}°
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="number"
                            placeholder="Min"
                            value={settings?.wave?.axisRotationAmountYMin || -2}
                            onChange={(e) => {
                                if (settings?.wave) {
                                    const newWave = new Wave(settings.wave);
                                    newWave.axisRotationAmountYMin = parseFloat(e.target.value) || 0;
                                    updateWaveSettings({ wave: newWave });
                                }
                            }}
                            style={{ width: '50%', padding: '4px', fontSize: '12px' }}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={settings?.wave?.axisRotationAmountYMax || 2}
                            onChange={(e) => {
                                if (settings?.wave) {
                                    const newWave = new Wave(settings.wave);
                                    newWave.axisRotationAmountYMax = parseFloat(e.target.value) || 0;
                                    updateWaveSettings({ wave: newWave });
                                }
                            }}
                            style={{ width: '50%', padding: '4px', fontSize: '12px' }}
                        />
                    </div>
                </div>

            </CompactSection>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <CompactButton 
                    className="btn btn-primary" 
                    onClick={saveSettings}
                    disabled={saved}
                >
                    💾 Save Settings
                </CompactButton>
                <CompactButton 
                    className="btn btn-secondary" 
                    onClick={resetSettings}
                >
                    🔄 Reset to Defaults
                </CompactButton>
                <CompactButton 
                    className="btn btn-secondary" 
                    onClick={onGoBackToMain}
                >
                    ← Back
                </CompactButton>
            </div>
        </div>
    );

    // Selector Selection View Component
    const SelectorSelectionView = () => (
        <div>
            <h3>🎯 Select Element</h3>
            <p style={{ fontSize: '12px', marginBottom: '12px' }}>
                Click on any element on the page to select it
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
                <CompactButton className="btn btn-primary" onClick={() => setCurrentView('main')}>
                    ✅ Done
                </CompactButton>
                <CompactButton className="btn btn-secondary" onClick={() => setCurrentView('main')}>
                    ❌ Cancel
                </CompactButton>
            </div>
        </div>
    );

    // Main View Component
    const MainView = () => (
        <div>
            <CompactSection>
                <h3>CSS Selector</h3>
                <CompactInput
                    type="text"
                    value={selector}
                    onChange={(e) => setSelector(e.target.value)}
                    placeholder="e.g., p, h1, .content"
                />
                
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <CompactButton 
                        className="btn btn-primary" 
                        onClick={onGo} 
                        disabled={going}
                    >
                        🚀 Start
                    </CompactButton>
                    <CompactButton 
                        className="btn btn-success" 
                        onClick={onStop} 
                        disabled={!going}
                    >
                        ⏹️ Stop
                    </CompactButton>
                    <CompactButton 
                        className="btn btn-secondary" 
                        onClick={onToggle}
                    >
                        🔄 Toggle
                    </CompactButton>
                    <CompactButton 
                        className="btn btn-secondary" 
                        onClick={() => onAddSelector(selector)}
                    >
                        ➕ Add
                    </CompactButton>
                    <CompactButton 
                        className="btn btn-secondary" 
                        onClick={onShowSettings}
                    >
                        ⚙️
                    </CompactButton>
                </div>
            </CompactSection>
            
            {going && (
                <StatusIndicator isActive={true}>
                    <div className="status-dot"></div>
                    <span>🌊 Reading: {selector}</span>
                </StatusIndicator>
            )}
            
            <CompactSection>
                <h3>Saved Selectors</h3>
                {selectors.length === 0 ? (
                    <p style={{ fontSize: '12px', margin: 0 }}>No selectors saved yet</p>
                ) : (
                    selectors.map((savedSelector, index) => (
                        <CompactSelectorItem key={index}>
                            <span className="selector-text">{savedSelector}</span>
                            <div className="selector-actions">
                                <CompactButton 
                                    className="btn btn-sm btn-secondary" 
                                    onClick={() => onSelectorUpdate(savedSelector)}
                                >
                                    Use
                                </CompactButton>
                                <CompactButton 
                                    className="btn btn-sm btn-danger" 
                                    onClick={() => onRemoveSelector(savedSelector)}
                                >
                                    Remove
                                </CompactButton>
                            </div>
                        </CompactSelectorItem>
                    ))
                )}
            </CompactSection>
        </div>
    );

    // Render the appropriate view based on current state using withState
    const renderView = () => {
        const viewMap = {
            'settings': () => withState(SettingsView, {}),
            'selector-selection': () => withState(SelectorSelectionView, {}),
            'main': () => withState(MainView, {})
        };

        const viewRenderer = viewMap[currentView as keyof typeof viewMap];
        return viewRenderer ? viewRenderer() : withState(MainView, {});
    };

    return (
        <ErrorBoundary>
            <WaveReader>
                <PopupHeader>
                    <h1>🌊 Wave Reader</h1>
                    <p>Motion Reader for Eye Tracking</p>
                </PopupHeader>
                
                <PopupContent>
                    {renderView()}
                </PopupContent>
            </WaveReader>
        </ErrorBoundary>
    );
};



// todo: wire this up to the existing UI above and use TomeManager to register the structural system
//      already configured in DefaultStructuralConfig

const BackgroundProxyMachine = createProxyRobotCopyStateMachine({
    machineId: 'background-proxy-machine',
    xstateConfig: {
        initial: 'idle',
        context: {
            message: null
        },
        states: {
            idle: {
                on: {
                    INITIALIZE: { target: 'initializing' },
                    START: { target: 'starting' },
                    STOP: { target: 'stopping' },
                    TOGGLE: { target: 'toggling' }
                }
            },
            initializing: {
                on: {
                    INITIALIZATION_COMPLETE: { target: 'idle' }
                }
            },
            starting: {
                on: {
                    START_COMPLETE: { target: 'idle' }
                }
            },
            stopping: {
                on: {
                    STOP_COMPLETE: { target: 'idle' }
                }
            },
            toggling: {
                on: {
                    TOGGLE_COMPLETE: { target: 'idle' }
                }
            }
        }
    },
    robotCopy: {
        sendMessage: async (message: any) => {
            console.log('Mock robot copy send message:', message);
            return { success: true };
        }
    } as any
});

// Render function for AppTome that uses viewModel
const renderAppView = (viewModel: any) => {
    console.log('🌊 AppTome: Rendering view with viewModel:', viewModel);
    
    return (
        <div>
            <h3>Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <p style={{ margin: 0 }}>Current state: {viewModel?.going ? 'Running' : 'Stopped'}</p>
                {globalRefreshFunction && (
                    <button 
                        onClick={globalRefreshFunction}
                        style={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                        title="Refresh"
                    >
                        🔄
                    </button>
                )}
            </div>
            <p>Selector: {viewModel?.selector || 'None'}</p>
            <p>View: {viewModel?.currentView || 'main'}</p>
            <p>Saved: {viewModel?.saved ? 'Yes' : 'No'}</p>
            {viewModel?.error && (
                <div style={{ color: 'red' }}>
                    Error: {viewModel.error}
                </div>
            )}
        </div>
    );
};

// Render function for Settings view with callback
const renderSettingsView = (viewModel: any, onSettingsUpdated?: (settings: any) => void) => {
    console.log('🌊 AppTome: Rendering settings view with viewModel:', viewModel);
    
    const handleSettingsSave = () => {
        console.log('🌊 AppTome: Settings save requested');
        if (onSettingsUpdated) {
            onSettingsUpdated(viewModel.settings);
        }
    };
    
    const handleSettingsCancel = () => {
        console.log('🌊 AppTome: Settings cancel requested');
        if (onSettingsUpdated) {
            onSettingsUpdated(null);
        }
    };
    
    return (
        <div>
            <h3>⚙️ Settings</h3>
            <div>
                <p>Current Settings:</p>
                <ul>
                    <li>Show Notifications: {viewModel?.showNotifications ? 'Yes' : 'No'}</li>
                    <li>Current View: {viewModel?.currentView || 'main'}</li>
                    <li>Extension Mode: {viewModel?.isExtension ? 'Yes' : 'No'}</li>
                </ul>
                
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={handleSettingsSave}
                        style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        Save Settings
                    </button>
                    <button 
                        onClick={handleSettingsCancel}
                        style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const AppMachine = createViewStateMachine({
    machineId: 'app-machine',
    xstateConfig: {
        initial: 'idle',
        context: {
            message: null,
            viewModel: {
                selector: '',
                saved: true,
                going: false,
                selectors: [],
                currentView: 'main',
                isExtension: false,
                settings: null,
                showNotifications: true
            }
        },
        states: {
            idle: {
                on: {
                    INITIALIZE: { target: 'initializing', actions: ['initializeApp'] },
                    START: { target: 'starting', actions: ['startApp'] },
                    STOP: { target: 'stopping', actions: ['stopApp'] },
                    TOGGLE: { target: 'toggling', actions: ['toggleApp'] },
                    KEYBOARD_TOGGLE: { target: 'keyboardToggling', actions: ['handleKeyboardToggle'] },
                    SELECTOR_UPDATE: { target: 'selectorUpdating', actions: ['updateSelector'] },
                    SETTINGS_UPDATE: { target: 'settingsUpdating', actions: ['updateSettings'] },
                    ERROR: { target: 'error', actions: ['handleError'] }
                }
            },
            initializing: {
                on: {
                    INITIALIZATION_COMPLETE: { target: 'ready', actions: ['markInitialized'] },
                    INITIALIZATION_FAILED: { target: 'error', actions: ['handleInitError'] }
                }
            },
            ready: {
                on: {
                    START: { target: 'starting', actions: ['startApp'] },
                    STOP: { target: 'stopping', actions: ['stopApp'] },
                    TOGGLE: { target: 'toggling', actions: ['toggleApp'] },
                    KEYBOARD_TOGGLE: { target: 'keyboardToggling', actions: ['handleKeyboardToggle'] },
                    SELECTOR_UPDATE: { target: 'selectorUpdating', actions: ['updateSelector'] },
                    SETTINGS_UPDATE: { target: 'settingsUpdating', actions: ['updateSettings'] },
                    REFRESH_STATE: { target: 'ready', actions: ['refreshStateFromContentScript'] },
                    STATE_REFRESHED: { target: 'ready', actions: ['logStateRefresh'] },
                    STATE_REFRESH_FAILED: { target: 'ready', actions: ['logStateRefreshError'] },
                    ERROR: { target: 'error', actions: ['handleError'] }
                }
            },
            starting: {
                on: {
                    START_COMPLETE: { target: 'waving', actions: ['startWaveAnimation'] },
                    START_FAILED: { target: 'error', actions: ['handleStartError'] }
                }
            },
            waving: {
                on: {
                    STOP: { target: 'stopping', actions: ['stopWaveAnimation'] },
                    TOGGLE: { target: 'toggling', actions: ['toggleWaveAnimation'] },
                    SELECTOR_UPDATE: { target: 'selectorUpdating', actions: ['updateSelector'] },
                    SETTINGS_UPDATE: { target: 'settingsUpdating', actions: ['updateSettings'] },
                    ERROR: { target: 'error', actions: ['handleError'] }
                }
            },
            stopping: {
                on: {
                    STOP_COMPLETE: { target: 'idle', actions: ['completeStop'] },
                    ERROR: { target: 'error', actions: ['handleError'] }
                }
            },
            selectorUpdating: {
                on: { SELECTOR_UPDATE_COMPLETE: { target: 'idle', actions: ['completeSelectorUpdate'] } },
                entry: 'updateSelector'
            },
            settingsUpdating: {
                on: { 
                    SETTINGS_UPDATE_COMPLETE: { target: 'idle', actions: ['completeSettingsUpdate'] },
                    SETTINGS_UPDATE_CANCELLED: { target: 'idle', actions: ['cancelSettingsUpdate'] }
                },
                entry: 'updateSettings'
            },
            keyboardToggling: {
                on: { 
                    KEYBOARD_TOGGLE_COMPLETE: { target: 'idle', actions: ['completeKeyboardToggle'] },
                    ERROR: { target: 'error', actions: ['handleError'] }
                },
                entry: 'handleKeyboardToggle'
            },
            error: {
                on: {
                    RECOVER: { target: 'idle', actions: ['recoverFromError'] },
                    RESET: { target: 'initializing', actions: ['resetApplication'] }
                }
            }
        },
        actions: {
            // Helper function for data synchronization
            syncDataWithContentScript: {
                type: 'function',
                fn: async ({context, log}: any) => {
                    log('🌊 App Tome: Syncing data with content script...');
                    
                    try {
                        const statusResponse = await sendExtensionMessage({
                            from: 'popup',
                            name: 'get-status',
                            timestamp: Date.now()
                        });
                        
                        if (statusResponse && statusResponse.success) {
                            // Update critical state from content script
                            const contentState = statusResponse;
                            context.viewModel.going = contentState.going || false;
                            
                            // Sync any additional state that content script provides
                            if (contentState.selector) {
                                context.viewModel.selector = contentState.selector;
                            }
                            
                            log('🌊 App Tome: Successfully synced with content script', contentState);
                            return contentState;
                        }
                    } catch (error: any) {
                        log('🌊 App Tome: Failed to sync with content script', error);
                    }
                    
                    return null;
                }
            },
            initializeApp: {
                type: 'function',
                fn: async ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Initialize app');
                    
                    try {
                        // Data synchronization strategy: Use a combination approach
                        // 1. Load from Chrome storage (fast, cached data)
                        // 2. Query content script for real-time state (accurate, current)
                        // 3. Merge and resolve conflicts with content script taking precedence
                        
                        log('🌊 App Tome: Starting data synchronization...');
                        
                        // Step 1: Load cached data from Chrome storage
                        let cachedData = {
                            selector: '',
                            saved: true,
                            going: false,
                            selectors: [],
                            currentView: 'main',
                            isExtension: false,
                            settings: null,
                            showNotifications: true
                        };
                        
                        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                            try {
                                const storageResult = await chrome.storage.local.get([
                                    'waveReaderSettings', 
                                    'waveReaderSelectors',
                                    'currentSelector',
                                    'going',
                                    'waveReaderCurrentView',
                                    'waveReaderShowNotifications'
                                ]);
                                
                                cachedData = {
                                    selector: storageResult.currentSelector || '',
                                    saved: true,
                                    going: storageResult.going?.going || false,
                                    selectors: storageResult.waveReaderSelectors || [],
                                    currentView: storageResult.waveReaderCurrentView || 'main',
                                    isExtension: true,
                                    settings: storageResult.waveReaderSettings || null,
                                    showNotifications: storageResult.waveReaderShowNotifications !== false
                                };
                                
                                log('🌊 App Tome: Loaded cached data from Chrome storage', cachedData);
                            } catch (storageError) {
                                log('🌊 App Tome: Failed to load from Chrome storage, using defaults', storageError);
                            }
                        }
                        
                        // Step 2: Query content script for real-time state
                        let realtimeData: any = null;
                        try {
                        const statusResponse = await sendExtensionMessage({
                            from: 'popup',
                            name: 'get-status',
                            timestamp: Date.now()
                        });
                        
                        if (statusResponse && statusResponse.success) {
                            realtimeData = {
                                going: statusResponse.going || false,
                                // Content script may have additional state we want to sync
                                contentState: statusResponse
                            };
                                log('🌊 App Tome: Retrieved real-time state from content script', realtimeData);
                            }
                        } catch (contentError: any) {
                            log('🌊 App Tome: Could not get real-time state from content script, using cached data', contentError);
                        }
                        
                        // Step 3: Merge data with content script taking precedence for critical state
                        const viewModel = {
                            ...cachedData,
                            // Override with real-time data where available
                            ...(realtimeData && {
                                going: realtimeData.going,
                                // Mark as unsaved if real-time state differs from cached
                                saved: realtimeData.going === cachedData.going
                            })
                        };
                        
                        log('🌊 App Tome: Final synchronized viewModel', viewModel);
                        
                        // Step 4: Save synchronized state back to Chrome storage for consistency
                        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                            try {
                                await chrome.storage.local.set({
                                    currentSelector: viewModel.selector,
                                    going: { going: viewModel.going },
                                    waveReaderSelectors: viewModel.selectors,
                                    waveReaderCurrentView: viewModel.currentView,
                                    waveReaderShowNotifications: viewModel.showNotifications,
                                    lastSyncTimestamp: Date.now()
                                });
                                log('🌊 App Tome: Saved synchronized state to Chrome storage');
                            } catch (saveError) {
                                log('🌊 App Tome: Failed to save synchronized state', saveError);
                            }
                        }
                        
                        // Update context with initialized viewModel
                        context.viewModel = viewModel;
                        
                        // Send completion event
                        send('INITIALIZATION_COMPLETE');
                        
                    } catch (error: any) {
                        console.error('🌊 App Tome: Initialization failed', error);
                        send('INITIALIZATION_FAILED');
                    }
                }
            },
            // Periodic sync action that can be called to refresh state
            refreshStateFromContentScript: {
                type: 'function',
                fn: async ({context, send, log}: any) => {
                    log('🌊 App Tome: Refreshing state from content script...');
                    
                    try {
                        // Call the sync function directly
                        const statusResponse = await sendExtensionMessage({
                            from: 'popup',
                            name: 'get-status',
                            timestamp: Date.now()
                        });
                        
                        if (statusResponse && statusResponse.success) {
                            const contentState = statusResponse;
                            const previousGoing = context.viewModel.going;
                            
                            // Update critical state from content script
                            context.viewModel.going = contentState.going || false;
                            
                            // Sync any additional state that content script provides
                            if (contentState.selector) {
                                context.viewModel.selector = contentState.selector;
                            }
                            
                            // Update the saved flag based on whether state changed
                            context.viewModel.saved = contentState.going === previousGoing;
                            
                            // Trigger a state update event
                            send('STATE_REFRESHED', { 
                                contentState, 
                                previousGoing,
                                currentGoing: contentState.going 
                            });
                            
                            log('🌊 App Tome: State refreshed successfully', {
                                previousGoing,
                                currentGoing: contentState.going,
                                saved: context.viewModel.saved
                            });
                        }
                    } catch (error: any) {
                        log('🌊 App Tome: Failed to refresh state', error);
                        send('STATE_REFRESH_FAILED', { error: error.message });
                    }
                }
            },
            logStateRefresh: {
                type: 'function',
                fn: ({context, event, log}: any) => {
                    log('🌊 App Tome: State refreshed from content script', {
                        previousGoing: event.previousGoing,
                        currentGoing: event.currentGoing,
                        contentState: event.contentState
                    });
                }
            },
            logStateRefreshError: {
                type: 'function',
                fn: ({context, event, log}: any) => {
                    log('🌊 App Tome: Failed to refresh state from content script', event.error);
                }
            },
            completeStop: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Complete stop');
                }
            },
            updateSelector: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Update selector');
                }
            },
            updateSettings: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Update settings');
                }
            },
            handleError: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Handle error', event);
                    
                    // Update viewModel with error state
                    context.viewModel.error = event.error || 'Unknown error';
                    context.viewModel.saved = false;
                    
                    log(`🌊 App Tome: Error handled:`, event.error);
                }
            },
            updateViewModel: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Update viewModel', event);
                    
                    if (event.viewModel) {
                        context.viewModel = { ...context.viewModel, ...event.viewModel };
                        log(`🌊 App Tome: ViewModel updated:`, context.viewModel);
                    }
                }
            },
            markInitialized: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Mark initialized', event.viewModel);
                    
                    // Update viewModel with any passed data
                    if (event.viewModel) {
                        context.viewModel = { ...context.viewModel, ...event.viewModel };
                    }
                    
                    // Log the current viewModel state
                    log(`🌊 App Tome: ViewModel initialized:`, context.viewModel);
                }
            },
            handleInitError: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Handle init error', context);
                }
            },
            startApp: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Start app');
                }
            },
            stopApp: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Stop app');
                }
            },
            toggleApp: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Toggle app');
                }
            },
            handleKeyboardToggle: {
                type: 'function',
                fn: async ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Handle keyboard toggle', event);
                    
                    try {
                        // Send toggle message to content script via background script
                        const toggleMessage = {
                            name: 'toggle',
                            from: 'popup-state-machine'
                        };
                        
                        const response = await sendExtensionMessage(toggleMessage);
                        console.log('🌊 App Tome: Keyboard toggle response', response);
                        
                        // Update the viewModel going state
                        if (response && typeof response.success !== 'undefined') {
                            // Toggle the current going state in viewModel
                            context.viewModel.going = !context.viewModel.going;
                            context.viewModel.saved = false; // Mark as unsaved since state changed
                            
                            log(`🌊 App Tome: Updated viewModel.going to ${context.viewModel.going}`);
                        }
                        
                        // Send completion event
                        send('KEYBOARD_TOGGLE_COMPLETE');
                        
                    } catch (error: any) {
                        console.error('🌊 App Tome: Keyboard toggle error', error);
                        send('ERROR');
                    }
                }
            },
            completeKeyboardToggle: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Complete keyboard toggle');
                    
                    // Update viewModel if provided
                    if (event.viewModel) {
                        context.viewModel = { ...context.viewModel, ...event.viewModel };
                        log(`🌊 App Tome: ViewModel updated after keyboard toggle:`, context.viewModel);
                    }
                }
            },
            completeToggle: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Complete toggle');
                }
            },
            completeSelectorUpdate: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Complete selector update');
                }
            },
            completeSettingsUpdate: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Complete settings update');
                    log('🌊 App Tome: Settings update completed successfully');
                }
            },
            cancelSettingsUpdate: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Cancel settings update');
                    log('🌊 App Tome: Settings update cancelled by user');
                }
            },
            recoverFromError: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Recovering from error');
                    // Clear error state
                    context.viewModel.error = null;
                    log('🌊 App Tome: Error state cleared, returning to normal operation');
                }
            },
            resetApplication: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Resetting application');
                    // Reset viewModel to default state
                    context.viewModel = {
                        selector: '',
                        saved: true,
                        going: false,
                        selectors: [],
                        currentView: 'main',
                        isExtension: false,
                        settings: null,
                        showNotifications: true,
                        error: null
                    };
                    log('🌊 App Tome: Application reset to default state');
                }
            },
            handleStartError: {
                type: 'function',
                fn: (context: any, event: any) => {
                    console.log('🌊 App Tome: Handle start error');
                }
            },
            startWaveAnimation: {
                type: 'function',
                fn: async (context: any, event: any) => {
                    // Get current settings and create wave
                    const currentOptions = await settingsService.getCurrentSettings();
                    const options = new Options(currentOptions);
                    
                    // Create wave with current selector and settings
                    const wave = new Wave({ 
                        selector: selector,
                        ...currentOptions.wave // Include all wave settings including waveSpeed
                    });
                    options.wave = wave.update();

                    // Show notification if enabled
                    if (options.showNotifications) {
                        try {
                            const notifOptions = {
                                type: "basic",
                                iconUrl: "icons/waver48.png",
                                title: "wave reader",
                                message: "reading",
                            };

                            // @ts-ignore
                            chrome.notifications.create("", notifOptions, guardLastError);
                        } catch (error) {
                            console.warn("Could not create notification:", error);
                        }
                    }

                    // Send start message
                    const startMessage = new StartMessage({ options });
                    await sendExtensionMessage(startMessage);
                    
                    // Update sync state
                    setSyncObject("going", { going: true });
                    setGoing(true);
                    setSaved(true);
                    
                    console.log('🌊 Unified App: Wave reader started via extension');
                }
            },
            stopWaveAnimation: {
                type: 'function',
                fn: async ({context, event, send, log, transition, machine}: any) => {
                    console.log('🌊 App Tome: Stopping wave animation');
                    try {
                        const stopMessage = new StopMessage();
                        await sendExtensionMessage(stopMessage);
                        
                        // Update sync state
                        setSyncObject("going", { going: false });
                        setGoing(false);
                        setSaved(true);
                        
                        log('🌊 App Tome: Wave animation stopped successfully');
                        console.log('🌊 Unified App: Wave reader stopped via extension');
                    } catch (error: any) {
                        console.error('🌊 App Tome: Failed to stop wave animation', error);
                        send('ERROR');
                    }
                }
            },
            toggleWaveAnimation: {
                type: 'function',
                fn: ({ context, event, send, log, transition, machine, viewModel}: any) => {
                    if (viewModel.going) {
                        transition('stopWaveAnimation');
                    } else {
                        transition('startWaveAnimation');
                    }
                    viewModel.going = !viewModel.going;
                    send({ type: 'TOGGLE_COMPLETE' });
                }
            },
            completeToggle: {
                type: 'function',
                fn: (context: any, event: any) => {
                    log("toggle complete", viewModel.going)
                }
            }
        }
    }
}).withState('idle', ({ context, event, view, transition, send, log}) => {
    console.log('🌊 App Tome: In idle state', context.viewModel);
    log('🌊 App Tome: Idle state - ready for user interaction');
    view(renderAppView(context.viewModel));
}).withState('initializing', ({ context, event, view, transition, send, log}) => {
    console.log('🌊 App Tome: Initializing', context.viewModel);
    log('🌊 App Tome: Initializing state - setting up application');
    
    // Simulate initialization process
    setTimeout(() => {
        send('INITIALIZATION_COMPLETE');
    }, 1000);
    
    view(renderAppView(context.viewModel));
}).withState('ready', ({ context, event, view, transition, send, log}) => {
    console.log('🌊 App Tome: Ready', context.viewModel);
    log('🌊 App Tome: Ready state - application fully initialized');
    view(renderAppView(context.viewModel));
}).withState('starting', ({ context, event, view, transition, send, log}) => {
    console.log('🌊 App Tome: Starting', context.viewModel);
    log('🌊 App Tome: Starting wave animation');
    
    // Simulate starting process
    setTimeout(() => {
        context.viewModel.going = true;
        send('START_COMPLETE');
    }, 500);
    
    view(renderAppView(context.viewModel));
}).withState('waving', ({ context, event, view, transition, send, log}) => {
    console.log('🌊 App Tome: Waving', context.viewModel);
    log('🌊 App Tome: Wave animation active');
    view(renderAppView(context.viewModel));
}).withState('stopping', ({ context, event, view, transition, send, log}) => {
    console.log('🌊 App Tome: Stopping', context.viewModel);
    log('🌊 App Tome: Stopping wave animation');
    
    // Simulate stopping process
    setTimeout(() => {
        context.viewModel.going = false;
        send('STOP_COMPLETE');
    }, 500);
    
    view(renderAppView(context.viewModel));
}).withState('selectorUpdating', ({ context, event, view, transition, send, log}) => {
    console.log('🌊 App Tome: Selector updating', context.viewModel);
    log('🌊 App Tome: Updating selector');
    
    // Simulate selector update process
    setTimeout(() => {
        send('SELECTOR_UPDATE_COMPLETE');
    }, 300);
    
    view(renderAppView(context.viewModel));
}).withState('settingsUpdating', ({ context, event, view, transition, send, log}) => {
    console.log('🌊 App Tome: Settings updating', context.viewModel);
    
    const onSettingsUpdated = (settings: any) => {
        console.log('🌊 App Tome: Settings updated callback triggered', settings);
        if (settings !== null) {
            // Update viewModel with new settings
            context.viewModel.settings = settings;
            context.viewModel.saved = false;
            log('🌊 App Tome: Settings saved to viewModel');
            send('SETTINGS_UPDATE_COMPLETE');
        } else {
            // Settings cancelled
            log('🌊 App Tome: Settings update cancelled');
            send('SETTINGS_UPDATE_CANCELLED');
        }
    };
    
    view(renderSettingsView(context.viewModel, onSettingsUpdated));
}).withState('error', ({ context, event, view, transition, send, log}) => {
    console.log('🌊 App Tome: Error state', context.viewModel);
    
    // Auto-recover from error after 3 seconds
    setTimeout(() => {
        log('🌊 App Tome: Auto-recovering from error state');
        send('RECOVER');
    }, 3000);
    
    view(renderAppView(context.viewModel));
});

const AppTome = createTomeConfig({
    id: 'app-tome',
    name: 'App Tome',
    description: 'App Tome',
    version: '1.0.0',
    machines: {
        'backgroundProxyMachine': BackgroundProxyMachine,
        'appMachine': AppMachine
    },
    dependencies: ['log-view-machine'],
    author: 'Wave Reader Team',
    createdAt: '2024-01-01',
    lastModified: new Date().toISOString().split('T')[0],
    tags: ['app', 'tome'],
    priority: 'normal',
    stability: 'stable',
    routing: {
        basePath: '/',
        routes: {
            'background-proxy-machine': {
                path: '/background-proxy-machine',
                method: 'POST',
                transformers: {
                    input: ({context, event, send, log, transition, machine}: any) => {
                        machine.parentMachine.send({event});
                    },
                    output: ({context, event, send, log, transition, machine}: any) => {
                        sendExtensionMessage(context.message);
                    }
                }
            },
            'app-machine': {
                path: '/app-machine',
                method: 'POST',
                transformers: {
                    input: ({context, event, send, log, transition, machine}: any) => {
                        // Defer to ViewStateMachine routing for XState events
                        console.log('🌊 App Machine: Processing XState event', event);
                        return machine.send(event);
                    },
                    output: ({context, event, send, log, transition, machine}: any) => {
                        // Handle output from ViewStateMachine
                        console.log('🌊 App Machine: XState output', event);
                        return context;
                    }
                }
            }
        }
    }
});

AppTome.start();

const AppComponent: FunctionComponent = () => {
    const [selector, setSelector] = useState('p');
    const [saved, setSaved] = useState(true);
    const [going, setGoing] = useState(false);
    const [selectors, setSelectors] = useState<string[]>([]);
    const [currentView, setCurrentView] = useState('main');
    const [isExtension, setIsExtension] = useState(false);
    const [settings, setSettings] = useState<Options | null>(null);
    const [showNotifications, setShowNotifications] = useState(true);

    // Initialize services
    const settingsService = new SettingsService();
    const mlSettingsService = new MLSettingsService();

    const syncState = async () => {
        const appMachine = AppTome.getMachine('appMachine');
        if (appMachine) {
            const state = appMachine.getState();
            setSelector(state.context?.viewModel?.selector || '');
            setSaved(state.context?.viewModel?.saved || false);
            setGoing(state.context?.viewModel?.going || false);
        }
    }

    // Function to refresh state from content script
    const refreshStateFromContentScript = async () => {
        try {
            const appMachine = AppTome.getMachine('appMachine');
            if (appMachine) {
                appMachine.send('REFRESH_STATE');
                console.log('🌊 App: Triggered state refresh from content script');
            }
        } catch (error) {
            console.error('🌊 App: Failed to trigger state refresh', error);
        }
    }

    // Set the global refresh function
    globalRefreshFunction = refreshStateFromContentScript;

    useEffect(() => {
        // Initialize AppMachine with viewModel
        const viewModel = {
            selector,
            saved,
            going,
            selectors,
            currentView,
            isExtension,
            settings,
            showNotifications
        };
        
        // Initialize the AppMachine
        AppMachine.send('INITIALIZE');
        
        // Register and start the tome
        TomeManager.getInstance().registerTome(AppTome);
        TomeManager.getInstance().startTome('app-tome');
        
        console.log('🌊 AppTome: Initialized with viewModel:', viewModel);
    }, []);

    return (
        <ErrorBoundary>
            <WaveReader>
                <PopupHeader>
                    <h1>🌊 Wave Reader</h1>
                    <p>Motion Reader for Eye Tracking</p>
                </PopupHeader>
                
                <PopupContent>
                    {/* Render from AppTome */}
                    {AppTome.machines.appMachine.render()}
                </PopupContent>
            </WaveReader>
        </ErrorBoundary>
    );
}

export default AppTome;
