import React, { FunctionComponent, useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { SettingsMessageHandler } from './robotcopy-pact-config';

// Styled components for the Tomes-based settings
const SettingsContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const SettingsHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 24px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
`;

const SettingsTitle = styled.h3`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
`;

const SaveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
`;

const SavedStatus = styled.span<{ isSaved: boolean }>`
  color: ${props => props.isSaved ? '#a8f5a8' : '#ffd700'};
  font-weight: 600;
  animation: ${props => props.isSaved ? 'none' : 'pulse 2s infinite'};
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
`;

const SettingsNavigation = styled.div`
  background: #f8f9fa;
  padding: 16px 24px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;

const NavButton = styled.button<{ isActive: boolean }>`
  padding: 8px 16px;
  border: 2px solid #dee2e6;
  background: ${props => props.isActive ? '#667eea' : 'white'};
  color: ${props => props.isActive ? 'white' : '#495057'};
  border-color: ${props => props.isActive ? '#667eea' : '#dee2e6'};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    color: ${props => props.isActive ? 'white' : '#667eea'};
  }
`;

const SettingsContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const SettingGroup = styled.div`
  margin-bottom: 32px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

const SettingGroupTitle = styled.h4`
  margin: 0 0 20px 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  padding-bottom: 12px;
  border-bottom: 2px solid #667eea;
`;

const SettingItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  transition: border-color 0.2s ease;
  
  &:hover {
    border-color: #667eea;
  }
`;

const SettingLabel = styled.label`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
`;

const SettingInput = styled.input`
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &.number {
    width: 120px;
  }
  
  &.text {
    width: 100%;
  }
`;

const SettingTextarea = styled.textarea`
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
  background: white;
  min-height: 120px;
  resize: vertical;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.4;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &.css {
    min-height: 150px;
  }
`;

const SettingSelect = styled.select`
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
  background: white;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SettingCheckbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: #667eea;
  margin-right: 8px;
`;

const SettingRadio = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
  margin-right: 8px;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.05);
  }
`;

const HelpText = styled.span`
  font-size: 12px;
  color: #6c757d;
  font-style: italic;
  margin-top: 6px;
  line-height: 1.4;
`;

const SettingsActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e9ecef;
`;

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #5a6268;
    transform: translateY(-1px);
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 8px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &.btn-primary {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  }
  
  &.btn-secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
    }
  }
  
  &.btn-danger {
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
    }
  }
`;

const KeyboardInput = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 8px;
`;

const KeyboardInputField = styled.input`
  flex: 1;
  background: #f8f9fa;
  cursor: not-allowed;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
`;

const ProgressView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 20px;
  text-align: center;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e3f2fd;
  border-top: 4px solid #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ProgressText = styled.p`
  margin: 8px 0;
  color: #495057;
  font-size: 16px;
`;

const ErrorView = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const ErrorText = styled.p`
  color: #dc3545;
  font-weight: 600;
  background: #f8d7da;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #f5c6cb;
  margin-top: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
`;

// Settings interface
interface Settings {
  showNotifications: boolean;
  waveAnimationControl: 'CSS' | 'MOUSE';
  toggleKeys: { keyChord: string[] };
  textColor: string;
  textSize: string;
  selector: string;
  cssTemplate: string;
  cssMouseTemplate: string;
  waveSpeed: number;
  axisTranslateAmountXMax: number;
  axisTranslateAmountXMin: number;
  axisRotationAmountYMax: number;
  axisRotationAmountYMin: number;
  mouseFollowInterval: number;
  autoGenerateCss: boolean;
}

// Domain paths interface
interface DomainPaths {
  domain: string;
  paths: string[];
}

// Props interface
interface SettingsTomesProps {
  initialSettings?: Partial<Settings>;
  domainPaths?: DomainPaths[];
  currentDomain?: string;
  currentPath?: string;
  onUpdateSettings?: (settings: Settings) => void;
  onDomainPathChange?: (domain: string, path: string) => void;
  className?: string;
}

// Main component using withState pattern
const SettingsTomes: FunctionComponent<SettingsTomesProps> = ({
  initialSettings = {},
  domainPaths = [],
  currentDomain = '',
  currentPath = '',
  onUpdateSettings,
  onDomainPathChange,
  className
}) => {
  // State management using withState pattern
  const [currentView, setCurrentView] = useState<'general' | 'wave' | 'css' | 'domain' | 'keyboard' | 'advanced' | 'saving' | 'loading' | 'error'>('general');
  const [settings, setSettings] = useState<Settings>({
    showNotifications: true,
    waveAnimationControl: 'CSS',
    toggleKeys: { keyChord: [] },
    textColor: 'initial',
    textSize: 'initial',
    selector: 'p',
    cssTemplate: '',
    cssMouseTemplate: '',
    waveSpeed: 2.0,
    axisTranslateAmountXMax: 10,
    axisTranslateAmountXMin: -10,
    axisRotationAmountYMax: 5,
    axisRotationAmountYMin: -5,
    mouseFollowInterval: 50,
    autoGenerateCss: true,
    ...initialSettings
  });
  const [localDomainPaths, setLocalDomainPaths] = useState<DomainPaths[]>(domainPaths);
  const [localCurrentDomain, setLocalCurrentDomain] = useState(currentDomain);
  const [localCurrentPath, setLocalCurrentPath] = useState(currentPath);
  const [saved, setSaved] = useState(true);
  const [messageHandler, setMessageHandler] = useState<SettingsMessageHandler | null>(null);
  const [isExtension, setIsExtension] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const settingsRef = useRef<Settings>(settings);

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      // Check if we're running in a Chrome extension context
      const extensionContext = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
      setIsExtension(Boolean(extensionContext));

      if (extensionContext) {
        // Initialize Chrome extension message handler
        const handler = new SettingsMessageHandler();
        setMessageHandler(handler);
        
        // Load saved settings from Chrome storage
        if (chrome.storage && chrome.storage.local) {
          try {
            const result = await chrome.storage.local.get(['waveReaderSettings', 'waveReaderDomainPaths']);
            
            if (result.waveReaderSettings) {
              setSettings(prev => ({ ...prev, ...result.waveReaderSettings }));
              setSaved(true);
            }
            
            if (result.waveReaderDomainPaths) {
              setLocalDomainPaths(result.waveReaderDomainPaths);
            }
          } catch (error) {
            console.warn('Failed to load settings from Chrome storage:', error);
          }
        }
      }
      
      console.log('⚙️ SettingsTomes: Initialized for Chrome extension context');
    };

    initializeComponent();
  }, []);

  // Update settings ref when settings change
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Handle Chrome extension messaging
  const sendExtensionMessage = async (message: any) => {
    if (!isExtension || !messageHandler) {
      console.warn('⚙️ SettingsTomes: Not in extension context or message handler not ready');
      return null;
    }

    try {
      return await messageHandler.sendMessage('background', message);
    } catch (error) {
      console.error('⚙️ SettingsTomes: Failed to send extension message:', error);
      return null;
    }
  };

  // Event handlers
  const handleViewChange = useCallback((view: typeof currentView) => {
    console.log('⚙️ SettingsTomes: Switching to view:', view);
    setCurrentView(view);
  }, []);

  const handleSettingChange = useCallback((key: keyof Settings, value: any) => {
    console.log('⚙️ SettingsTomes: Updating setting:', key, value);
    
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const handleWaveSettingChange = useCallback((key: keyof Settings, value: any) => {
    console.log('⚙️ SettingsTomes: Updating wave setting:', key, value);
    
    handleSettingChange(key, value);
    
    // Auto-generate CSS if enabled
    if (settings.autoGenerateCss && ['waveSpeed', 'axisTranslateAmountXMax', 'axisTranslateAmountXMin', 'axisRotationAmountYMax', 'axisRotationAmountYMin', 'mouseFollowInterval'].includes(key)) {
      // This would trigger CSS auto-generation
      console.log('⚙️ SettingsTomes: Auto-generating CSS from wave parameters');
    }
  }, [handleSettingChange, settings.autoGenerateCss]);

  const handleCssSettingChange = useCallback((key: keyof Settings, value: any) => {
    console.log('⚙️ SettingsTomes: Updating CSS setting:', key, value);
    
    handleSettingChange(key, value);
    
    // If auto-generate is disabled, parse CSS to update parameters
    if (!settings.autoGenerateCss && ['cssTemplate', 'cssMouseTemplate'].includes(key)) {
      console.log('⚙️ SettingsTomes: Parsing CSS to update parameters');
      // This would parse CSS and update wave parameters
    }
  }, [handleSettingChange, settings.autoGenerateCss]);

  const handleDomainSettingChange = useCallback((key: 'domain' | 'path', value: string) => {
    console.log('⚙️ SettingsTomes: Updating domain setting:', key, value);
    
    if (key === 'domain') {
      setLocalCurrentDomain(value);
      // Reset path when domain changes
      const newPaths = localDomainPaths.find(dp => dp.domain === value)?.paths || [];
      if (newPaths.length > 0) {
        setLocalCurrentPath(newPaths[0]);
        if (onDomainPathChange) {
          onDomainPathChange(value, newPaths[0]);
        }
      }
    } else {
      setLocalCurrentPath(value);
      if (onDomainPathChange) {
        onDomainPathChange(localCurrentDomain, value);
      }
    }
    
    setSaved(false);
  }, [localDomainPaths, localCurrentDomain, onDomainPathChange]);

  const handleKeyboardSettingChange = useCallback((key: keyof Settings, value: any) => {
    console.log('⚙️ SettingsTomes: Updating keyboard setting:', key, value);
    
    handleSettingChange(key, value);
  }, [handleSettingChange]);

  const handleSaveSettings = useCallback(async () => {
    console.log('⚙️ SettingsTomes: Saving settings');
    
    setCurrentView('saving');
    
    try {
      // Save to storage
      if (isExtension) {
        await sendExtensionMessage({
          type: 'SETTINGS_SAVED',
          settings: settingsRef.current,
          source: 'settings',
          target: 'background',
          traceId: Date.now().toString()
        });
        
        // Save to Chrome storage
        if (chrome.storage && chrome.storage.local) {
          await chrome.storage.local.set({ 
            waveReaderSettings: settingsRef.current,
            waveReaderDomainPaths: localDomainPaths
          });
        }
      }
      
      // Notify parent component
      if (onUpdateSettings) {
        onUpdateSettings(settingsRef.current);
      }
      
      setSaved(true);
      setCurrentView('general');
      
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setCurrentView('error');
    }
  }, [isExtension, localDomainPaths, onUpdateSettings]);

  const handleResetSettings = useCallback(async () => {
    console.log('⚙️ SettingsTomes: Resetting settings');
    
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      try {
        // Reset to default values
        const defaultSettings: Settings = {
          showNotifications: true,
          waveAnimationControl: 'CSS',
          toggleKeys: { keyChord: [] },
          textColor: 'initial',
          textSize: 'initial',
          selector: 'p',
          cssTemplate: '',
          cssMouseTemplate: '',
          waveSpeed: 2.0,
          axisTranslateAmountXMax: 10,
          axisTranslateAmountXMin: -10,
          axisRotationAmountYMax: 5,
          axisRotationAmountYMin: -5,
          mouseFollowInterval: 50,
          autoGenerateCss: true
        };
        
        setSettings(defaultSettings);
        setSaved(false);
        
        // Save to storage
        if (isExtension) {
          await sendExtensionMessage({
            type: 'SETTINGS_RESET',
            source: 'settings',
            target: 'background',
            traceId: Date.now().toString()
          });
        }
        
      } catch (error) {
        console.error('Failed to reset settings:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setCurrentView('error');
      }
    }
  }, [isExtension]);

  const handleRetry = useCallback(() => {
    console.log('⚙️ SettingsTomes: Retrying operation');
    setError(null);
    setCurrentView('general');
  }, []);

  // Render different views based on currentView
  if (currentView === 'saving') {
    return (
      <SettingsContainer className={className}>
        <SettingsHeader>
          <SettingsTitle>💾 Saving Settings</SettingsTitle>
        </SettingsHeader>
        
        <SettingsContent>
          <ProgressView>
            <Spinner />
            <ProgressText>Saving your settings...</ProgressText>
            <ProgressText>Please wait while we update your configuration.</ProgressText>
            
            <SettingsActions>
              <Button className="btn btn-secondary" onClick={() => setCurrentView('general')}>
                ❌ Cancel
              </Button>
            </SettingsActions>
          </ProgressView>
        </SettingsContent>
      </SettingsContainer>
    );
  }

  if (currentView === 'loading') {
    return (
      <SettingsContainer className={className}>
        <SettingsHeader>
          <SettingsTitle>📥 Loading Settings</SettingsTitle>
        </SettingsHeader>
        
        <SettingsContent>
          <ProgressView>
            <Spinner />
            <ProgressText>Loading your settings...</ProgressText>
            <ProgressText>Please wait while we retrieve your configuration.</ProgressText>
          </ProgressView>
        </SettingsContent>
      </SettingsContainer>
    );
  }

  if (currentView === 'error') {
    return (
      <SettingsContainer className={className}>
        <SettingsHeader>
          <SettingsTitle>❌ Error</SettingsTitle>
        </SettingsHeader>
        
        <SettingsContent>
          <ErrorView>
            <ErrorMessage>
              <p>An error occurred while processing your request:</p>
              <ErrorText>{error || 'Unknown error'}</ErrorText>
            </ErrorMessage>
            
            <SettingsActions>
              <Button className="btn btn-primary" onClick={handleRetry}>
                🔄 Retry
              </Button>
              <Button className="btn btn-secondary" onClick={() => setCurrentView('general')}>
                🏠 Go to General
              </Button>
            </SettingsActions>
          </ErrorView>
        </SettingsContent>
      </SettingsContainer>
    );
  }

  // Render main settings view
  return (
    <SettingsContainer className={className}>
      <SettingsHeader>
        <SettingsTitle>⚙️ Settings</SettingsTitle>
        <SaveIndicator>
          <SavedStatus isSaved={saved}>
            {saved ? '✅ Saved' : '🌊 Unsaved Changes'}
          </SavedStatus>
        </SaveIndicator>
      </SettingsHeader>
      
      <SettingsNavigation>
        <NavButton 
          isActive={currentView === 'general'}
          onClick={() => handleViewChange('general')}
        >
          General
        </NavButton>
        <NavButton 
          isActive={currentView === 'wave'}
          onClick={() => handleViewChange('wave')}
        >
          Wave Animation
        </NavButton>
        <NavButton 
          isActive={currentView === 'css'}
          onClick={() => handleViewChange('css')}
        >
          CSS Templates
        </NavButton>
        <NavButton 
          isActive={currentView === 'domain'}
          onClick={() => handleViewChange('domain')}
        >
          Domain & Path
        </NavButton>
        <NavButton 
          isActive={currentView === 'keyboard'}
          onClick={() => handleViewChange('keyboard')}
        >
          Keyboard
        </NavButton>
        <NavButton 
          isActive={currentView === 'advanced'}
          onClick={() => handleViewChange('advanced')}
        >
          Advanced
        </NavButton>
      </SettingsNavigation>
      
      <SettingsContent>
        {currentView === 'general' && (
          <>
            <SettingGroup>
              <SettingGroupTitle>Basic Settings</SettingGroupTitle>
              
              <SettingItem>
                <SettingLabel>
                  <SettingCheckbox
                    type="checkbox"
                    checked={settings.showNotifications}
                    onChange={(e) => handleSettingChange('showNotifications', e.target.checked)}
                  />
                  Show Notifications
                </SettingLabel>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Wave Animation Control:</SettingLabel>
                <RadioGroup>
                  <RadioLabel>
                    <SettingRadio
                      type="radio"
                      name="waveControl"
                      value="CSS"
                      checked={settings.waveAnimationControl === 'CSS'}
                      onChange={(e) => handleSettingChange('waveAnimationControl', e.target.value)}
                    />
                    CSS Animation
                  </RadioLabel>
                  <RadioLabel>
                    <SettingRadio
                      type="radio"
                      name="waveControl"
                      value="MOUSE"
                      checked={settings.waveAnimationControl === 'MOUSE'}
                      onChange={(e) => handleSettingChange('waveAnimationControl', e.target.value)}
                    />
                    Mouse
                  </RadioLabel>
                </RadioGroup>
              </SettingItem>
            </SettingGroup>
            
            <SettingsActions>
              <Button className="btn btn-primary" onClick={handleSaveSettings}>
                💾 Save Settings
              </Button>
              <Button className="btn btn-secondary" onClick={handleResetSettings}>
                🔄 Reset to Defaults
              </Button>
            </SettingsActions>
          </>
        )}
        
        {currentView === 'wave' && (
          <>
            <SettingGroup>
              <SettingGroupTitle>Wave Animation Parameters</SettingGroupTitle>
              
              <SettingItem>
                <SettingLabel>Wave Speed (seconds):</SettingLabel>
                <SettingInput
                  type="number"
                  className="number"
                  value={settings.waveSpeed}
                  min={0.1}
                  max={20}
                  step={0.1}
                  onChange={(e) => handleWaveSettingChange('waveSpeed', parseFloat(e.target.value))}
                />
                <HelpText>Duration of the wave animation cycle</HelpText>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Axis Translation X Max:</SettingLabel>
                <SettingInput
                  type="number"
                  className="number"
                  value={settings.axisTranslateAmountXMax}
                  onChange={(e) => handleWaveSettingChange('axisTranslateAmountXMax', parseFloat(e.target.value))}
                />
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Axis Translation X Min:</SettingLabel>
                <SettingInput
                  type="number"
                  className="number"
                  value={settings.axisTranslateAmountXMin}
                  onChange={(e) => handleWaveSettingChange('axisTranslateAmountXMin', parseFloat(e.target.value))}
                />
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Axis Rotation Y Max:</SettingLabel>
                <SettingInput
                  type="number"
                  className="number"
                  value={settings.axisRotationAmountYMax}
                  onChange={(e) => handleWaveSettingChange('axisRotationAmountYMax', parseFloat(e.target.value))}
                />
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Axis Rotation Y Min:</SettingLabel>
                <SettingInput
                  type="number"
                  className="number"
                  value={settings.axisRotationAmountYMin}
                  onChange={(e) => handleWaveSettingChange('axisRotationAmountYMin', parseFloat(e.target.value))}
                />
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Mouse Follow Interval (ms):</SettingLabel>
                <SettingInput
                  type="number"
                  className="number"
                  value={settings.mouseFollowInterval}
                  disabled={settings.waveAnimationControl === 'CSS'}
                  onChange={(e) => handleWaveSettingChange('mouseFollowInterval', parseInt(e.target.value))}
                />
                <HelpText>Only used with Mouse animation</HelpText>
              </SettingItem>
            </SettingGroup>
            
            <SettingsActions>
              <Button className="btn btn-primary" onClick={handleSaveSettings}>💾 Save Settings</Button>
              <BackButton onClick={() => handleViewChange('general')}>← Back</BackButton>
            </SettingsActions>
          </>
        )}
        
        {currentView === 'css' && (
          <>
            <SettingGroup>
              <SettingGroupTitle>CSS Generation</SettingGroupTitle>
              
              <SettingItem>
                <SettingLabel>
                  <SettingCheckbox
                    type="checkbox"
                    checked={settings.autoGenerateCss}
                    onChange={(e) => handleSettingChange('autoGenerateCss', e.target.checked)}
                  />
                  Auto-generate CSS from parameters
                </SettingLabel>
                <HelpText>When enabled, CSS templates are automatically generated from animation parameters</HelpText>
              </SettingItem>
            </SettingGroup>
            
            <SettingGroup>
              <SettingGroupTitle>CSS Templates</SettingGroupTitle>
              
              <SettingItem>
                <SettingLabel>CSS Template:</SettingLabel>
                <SettingTextarea
                  className="css"
                  value={settings.cssTemplate}
                  readOnly={settings.autoGenerateCss}
                  onChange={(e) => handleCssSettingChange('cssTemplate', e.target.value)}
                />
                <HelpText>
                  {settings.autoGenerateCss ? 
                    'Auto-generated from parameters above' : 
                    'Edit manually to update parameters below'
                  }
                </HelpText>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>CSS Mouse Template:</SettingLabel>
                <SettingTextarea
                  className="css"
                  value={settings.cssMouseTemplate}
                  readOnly={settings.autoGenerateCss}
                  onChange={(e) => handleCssSettingChange('cssMouseTemplate', e.target.value)}
                />
                <HelpText>
                  {settings.autoGenerateCss ? 
                    'Auto-generated from parameters above' : 
                    'Edit manually to update parameters below'
                  }
                </HelpText>
              </SettingItem>
            </SettingGroup>
            
            <SettingsActions>
              <Button className="btn btn-primary" onClick={handleSaveSettings}>💾 Save Settings</Button>
              <BackButton onClick={() => handleViewChange('general')}>← Back</BackButton>
            </SettingsActions>
          </>
        )}
        
        {currentView === 'domain' && (
          <>
            <SettingGroup>
              <SettingGroupTitle>Domain Configuration</SettingGroupTitle>
              
              <SettingItem>
                <SettingLabel>Current Domain:</SettingLabel>
                <SettingSelect
                  value={localCurrentDomain}
                  onChange={(e) => handleDomainSettingChange('domain', e.target.value)}
                >
                  {localDomainPaths.map(dp => (
                    <option key={dp.domain} value={dp.domain}>
                      {dp.domain}
                    </option>
                  ))}
                </SettingSelect>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Current Path:</SettingLabel>
                <SettingSelect
                  value={localCurrentPath}
                  onChange={(e) => handleDomainSettingChange('path', e.target.value)}
                >
                  {(localDomainPaths.find(dp => dp.domain === localCurrentDomain)?.paths || []).map(path => (
                    <option key={path} value={path}>
                      {path}
                    </option>
                  ))}
                </SettingSelect>
              </SettingItem>
            </SettingGroup>
            
            <SettingsActions>
              <Button className="btn btn-primary" onClick={handleSaveSettings}>💾 Save Settings</Button>
              <BackButton onClick={() => handleViewChange('general')}>← Back</BackButton>
            </SettingsActions>
          </>
        )}
        
        {currentView === 'keyboard' && (
          <>
            <SettingGroup>
              <SettingGroupTitle>Wave Toggle Shortcut</SettingGroupTitle>
              
              <SettingItem>
                <SettingLabel>Toggle Keys:</SettingLabel>
                <KeyboardInput>
                  <KeyboardInputField
                    value={settings.toggleKeys.keyChord.join(' + ')}
                    placeholder="Press keys to set shortcut"
                    readOnly
                  />
                  <Button className="btn btn-secondary">
                    🔍 Scan for Keys
                  </Button>
                </KeyboardInput>
                <HelpText>Press up to 4 keys to create your shortcut</HelpText>
              </SettingItem>
            </SettingGroup>
            
            <SettingsActions>
              <Button className="btn btn-primary" onClick={handleSaveSettings}>💾 Save Settings</Button>
              <BackButton onClick={() => handleViewChange('general')}>← Back</BackButton>
            </SettingsActions>
          </>
        )}
        
        {currentView === 'advanced' && (
          <>
            <SettingGroup>
              <SettingGroupTitle>Text Settings</SettingGroupTitle>
              
              <SettingItem>
                <SettingLabel>Text Color:</SettingLabel>
                <SettingInput
                  type="text"
                  className="text"
                  value={settings.textColor}
                  onChange={(e) => handleSettingChange('textColor', e.target.value)}
                />
                <HelpText>CSS color value (e.g., 'red', '#ff0000', 'rgb(255,0,0)')</HelpText>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Text Size:</SettingLabel>
                <SettingInput
                  type="text"
                  className="text"
                  value={settings.textSize}
                  onChange={(e) => handleSettingChange('textSize', e.target.value)}
                />
                <HelpText>CSS size value (e.g., '16px', '1.2em', 'large')</HelpText>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>CSS Selector:</SettingLabel>
                <SettingInput
                  type="text"
                  className="text"
                  value={settings.selector}
                  onChange={(e) => handleSettingChange('selector', e.target.value)}
                />
                <HelpText>CSS selector for target elements (e.g., 'p', '.content', '#main')</HelpText>
              </SettingItem>
            </SettingGroup>
            
            <SettingsActions>
              <Button className="btn btn-primary" onClick={handleSaveSettings}>💾 Save Settings</Button>
              <BackButton onClick={() => handleViewChange('general')}>← Back</BackButton>
            </SettingsActions>
          </>
        )}
      </SettingsContent>
    </SettingsContainer>
  );
};

export default SettingsTomes;
