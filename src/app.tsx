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
  TomeConnector, 
  useTomeConnector, 
  AppRouter, 
  useRouter,
  AppStructure,
  ComponentTomeMapping,
  RoutingConfig,
  TomeConfig
} from './components/structural';

// Check if we're in development mode
const isDevelopment = configured.mode !== 'production';

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
                        }
                    }

                    // Load current settings
                    const currentSettings = await settingsService.getCurrentSettings();
                    if (currentSettings) {
                        setSettings(new Options(currentSettings));
                        setShowNotifications(currentSettings.showNotifications || true);
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

    // Enhanced error handling for Chrome extension messaging
    const sendExtensionMessage = async (message: any) => {
        if (!isExtension) {
            console.warn('🌊 Unified App: Not in extension context');
            return null;
        }

        try {
            return await chrome.runtime.sendMessage(message);
        } catch (error: any) {
            console.error('🌊 Unified App: Failed to send extension message:', error);
            throw new Error(`Failed to communicate with extension: ${error.message || 'Unknown error'}`);
        }
    };

    // Start wave reading with enhanced functionality from app.tsx
    const onGo = async () => {
        try {
            if (isExtension) {
                // Get current settings and create wave
                const currentOptions = await settingsService.getCurrentSettings();
                const options = new Options(currentOptions);
                
                // Create wave with current selector
                const wave = new Wave();
                wave.selector = selector;
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
                        min="1"
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

                {/* Wave Control Type */}
                <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                        Animation Control:
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                                type="radio"
                                name="waveControl"
                                value="CSS"
                                checked={settings?.waveAnimationControl === 0}
                                onChange={() => updateWaveSettings({ waveAnimationControl: 0 })}
                            />
                            CSS
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                                type="radio"
                                name="waveControl"
                                value="MOUSE"
                                checked={settings?.waveAnimationControl === 1}
                                onChange={() => updateWaveSettings({ waveAnimationControl: 1 })}
                            />
                            Mouse
                        </label>
                    </div>
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

                {/* Mouse Follow Interval */}
                <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                        Mouse Follow Interval: {settings?.wave?.mouseFollowInterval || 100}ms
                    </label>
                    <input
                        type="range"
                        min="50"
                        max="200"
                        step="10"
                        value={settings?.wave?.mouseFollowInterval || 100}
                        onChange={(e) => {
                            if (settings?.wave) {
                                const newWave = new Wave(settings.wave);
                                newWave.mouseFollowInterval = parseInt(e.target.value);
                                updateWaveSettings({ wave: newWave });
                            }
                        }}
                        style={{ width: '100%' }}
                    />
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

export default AppUnified;
