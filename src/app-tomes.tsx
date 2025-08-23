import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from "styled-components";
import './styles.scss';
import { createWaveReaderStateMachine, ChromeExtensionMessageHandler } from './component-middleware/wave-reader/robotcopy-pact-config';
import { ErrorBoundary } from './components/error-boundary';

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

// New Tomes-based App component optimized for Chrome extension popup
const AppTomes: FunctionComponent = () => {
    const [selector, setSelector] = useState('p');
    const [saved, setSaved] = useState(true);
    const [going, setGoing] = useState(false);
    const [selectors, setSelectors] = useState<string[]>([]);
    const [currentView, setCurrentView] = useState('main');
    const [waveReaderMachine, setWaveReaderMachine] = useState<any>(null);
    const [messageHandler, setMessageHandler] = useState<ChromeExtensionMessageHandler | null>(null);
    const [isExtension, setIsExtension] = useState(false);

    useEffect(() => {
        // Check if we're running in a Chrome extension context
        const checkExtensionContext = () => {
            return typeof chrome !== 'undefined' && 
                   chrome.runtime && 
                   chrome.runtime.id;
        };

        const extensionContext = checkExtensionContext();
        setIsExtension(Boolean(extensionContext));

        // Initialize the wave reader state machine
        const initializeMachine = async () => {
            try {
                if (extensionContext) {
                    // Initialize Chrome extension message handler
                    const handler = new ChromeExtensionMessageHandler();
                    setMessageHandler(handler);
                    
                    // Load saved settings and selectors from Chrome storage
                    if (chrome.storage && chrome.storage.local) {
                        const result = await chrome.storage.local.get([
                            'waveReaderSettings', 
                            'waveReaderSelectors',
                            'currentSelector'
                        ]);
                        
                        if (result.waveReaderSelectors) {
                            setSelectors(result.waveReaderSelectors);
                        }
                        
                        if (result.currentSelector) {
                            setSelector(result.currentSelector);
                        }
                    }
                } else {
                    // Fallback to localStorage for non-extension context
                    const savedSelectorsData = localStorage.getItem('waveReaderSelectors');
                    const savedSelector = localStorage.getItem('waveReaderSelector');
                    
                    if (savedSelectorsData) {
                        setSelectors(JSON.parse(savedSelectorsData));
                    }
                    
                    if (savedSelector) {
                        setSelector(savedSelector);
                    }
                }
                
                console.log('🌊 Tomes App: Initialized for Chrome extension context');
            } catch (error) {
                console.error('🌊 Tomes App: Failed to initialize:', error);
            }
        };

        initializeMachine();
    }, []);

    // Enhanced error handling for Chrome extension messaging
    const sendExtensionMessage = async (message: any) => {
        if (!isExtension || !messageHandler) {
            console.warn('🌊 Tomes App: Not in extension context or message handler not ready');
            return null;
        }

        try {
            return await messageHandler.sendMessage('background', message);
        } catch (error: any) {
            console.error('🌊 Tomes App: Failed to send extension message:', error);
            // Enhanced error handling with user feedback
            throw new Error(`Failed to communicate with extension: ${error.message || 'Unknown error'}`);
        }
    };

    // Enhanced error handling for wave reader operations
    const onGo = async () => {
        try {
            if (isExtension) {
                const response = await sendExtensionMessage({
                    type: 'START_WAVE_READER',
                    selector: selector,
                    source: 'popup',
                    target: 'background',
                    traceId: Date.now().toString()
                });
                
                if (response && response.success) {
                    setGoing(true);
                    setSaved(true);
                    console.log('🌊 Tomes App: Wave reader started via extension');
                } else {
                    throw new Error('Background script failed to start wave reader');
                }
            } else {
                setGoing(true);
                setSaved(true);
                console.log('🌊 Tomes App: Wave reader started (non-extension mode)');
            }
        } catch (error: any) {
            console.error('🌊 Tomes App: Failed to start wave reader:', error);
            // Show user-friendly error message
            alert(`Failed to start wave reader: ${error.message || 'Unknown error'}`);
        }
    };

    // Enhanced error handling for stop operation
    const onStop = async () => {
        try {
            if (isExtension) {
                const response = await sendExtensionMessage({
                    type: 'STOP_WAVE_READER',
                    source: 'popup',
                    target: 'background',
                    traceId: Date.now().toString()
                });
                
                if (response && response.success) {
                    setGoing(false);
                    setSaved(true);
                    console.log('🌊 Tomes App: Wave reader stopped via extension');
                } else {
                    throw new Error('Background script failed to stop wave reader');
                }
            } else {
                setGoing(false);
                setSaved(true);
                console.log('🌊 Tomes App: Wave reader stopped (non-extension mode)');
            }
        } catch (error: any) {
            console.error('🌊 Tomes App: Failed to stop wave reader:', error);
            alert(`Failed to stop wave reader: ${error.message || 'Unknown error'}`);
        }
    };

    // Update selector
    const onSelectorUpdate = async (newSelector: string) => {
        try {
            if (isExtension) {
                // Send message to background script
                const response = await sendExtensionMessage({
                    type: 'SELECTOR_UPDATED',
                    selector: newSelector,
                    source: 'popup',
                    target: 'background',
                    traceId: Date.now().toString()
                });
                
                if (response && response.success) {
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
            console.error('🌊 Tomes App: Failed to update selector:', error);
        }
    };

    // Add selector
    const onAddSelector = async (newSelector: string) => {
        try {
            if (isExtension) {
                // Send message to background script
                const response = await sendExtensionMessage({
                    type: 'SELECTOR_ADDED',
                    selector: newSelector,
                    source: 'popup',
                    target: 'background',
                    traceId: Date.now().toString()
                });
                
                if (response && response.success) {
                    setSelectors(prev => [...new Set([...prev, newSelector])]);
                    setSaved(true);
                }
            } else {
                // Fallback for non-extension context
                setSelectors(prev => [...new Set([...prev, newSelector])]);
                setSaved(true);
                localStorage.setItem('waveReaderSelectors', JSON.stringify([...selectors, newSelector]));
            }
        } catch (error) {
            console.error('🌊 Tomes App: Failed to add selector:', error);
        }
    };

    // Remove selector
    const onRemoveSelector = async (selectorToRemove: string) => {
        try {
            if (isExtension) {
                // Send message to background script
                const response = await sendExtensionMessage({
                    type: 'SELECTOR_REMOVED',
                    selector: selectorToRemove,
                    source: 'popup',
                    target: 'background',
                    traceId: Date.now().toString()
                });
                
                if (response && response.success) {
                    setSelectors(prev => prev.filter(s => s !== selectorToRemove));
                    setSaved(true);
                }
            } else {
                // Fallback for non-extension context
                setSelectors(prev => prev.filter(s => s !== selectorToRemove));
                setSaved(true);
                localStorage.setItem('waveReaderSelectors', JSON.stringify(selectors.filter(s => s !== selectorToRemove)));
            }
        } catch (error) {
            console.error('🌊 Tomes App: Failed to remove selector:', error);
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

    // Render the appropriate view based on current state
    const renderView = () => {
        switch (currentView) {
            case 'settings':
                return (
                    <div>
                        <h3>⚙️ Settings</h3>
                        <CompactSection>
                            <h4>Wave Animation</h4>
                            <p>Settings will be implemented in the next iteration</p>
                        </CompactSection>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <CompactButton className="btn btn-secondary" onClick={onGoBackToMain}>
                                ← Back
                            </CompactButton>
                        </div>
                    </div>
                );
            
            case 'selector-selection':
                return (
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
            
            default:
                return (
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
        }
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

export default AppTomes;
