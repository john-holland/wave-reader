import React, { FunctionComponent, useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { ScanForInputMessageHandler } from './robotcopy-pact-config';

// Styled components for the Tomes-based scan for input
const ScanForInputContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const ScanForInputHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  border-radius: 8px 8px 0 0;
  text-align: center;
  
  h2 {
    margin: 0 0 8px 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const ScanForInputContent = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-radius: 0 0 8px 8px;
`;

const ShortcutDisplay = styled.div`
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
  transition: border-color 0.2s ease;
  
  &:hover {
    border-color: #667eea;
  }
`;

const ShortcutText = styled.div`
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const NoShortcut = styled.span`
  color: #6c757d;
  font-style: italic;
  font-size: 16px;
`;

const Key = styled.kbd`
  display: inline-block;
  padding: 8px 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
  min-width: 32px;
  text-align: center;
  transition: all 0.2s ease;
  
  &.pressed {
    background: linear-gradient(135deg, #28a745, #20c997);
    transform: scale(1.1);
    animation: keyPress 0.3s ease-in-out;
  }
  
  @keyframes keyPress {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1.1); }
  }
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
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
  
  &.btn-warning {
    background: linear-gradient(135deg, #ff9a56, #ff6b6b);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 154, 86, 0.4);
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

const ShortcutInfo = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e9ecef;
  margin-bottom: 20px;
`;

const ShortcutInfoTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #2c3e50;
`;

const ShortcutInfoText = styled.p`
  margin: 8px 0;
  color: #495057;
  
  &.hint {
    color: #6c757d;
    font-style: italic;
    font-size: 14px;
    margin-top: 16px;
    text-align: center;
  }
`;

const ScanningProgress = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 2px solid #ffc107;
`;

const KeyChordDisplay = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const KeyChordTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #2c3e50;
`;

const KeyChord = styled.div`
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const Waiting = styled.span`
  color: #6c757d;
  font-style: italic;
  font-size: 16px;
`;

const ScanningStatus = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const StatusIndicator = styled.div`
  width: 20px;
  height: 20px;
  background: #ffc107;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.1); }
    100% { opacity: 1; transform: scale(1); }
  }
`;

const KeyLimit = styled.p`
  font-weight: 600;
  color: #856404;
  font-size: 18px;
  margin: 8px 0;
`;

const ScanningInstructions = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #ffc107;
`;

const Instruction = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 8px;
  background: #fff8e1;
  border-radius: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InstructionIcon = styled.span`
  font-size: 20px;
  width: 24px;
  text-align: center;
`;

const ValidationProgress = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
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

const ValidationText = styled.p`
  margin: 0;
  color: #1565c0;
  font-size: 16px;
`;

const ConflictDetails = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  border: 2px solid #f44336;
`;

const ConflictList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #495057;
`;

const ConflictListItem = styled.li`
  margin-bottom: 8px;
`;

// Props interface
interface ScanForInputTomesProps {
  actionType?: string;
  initialShortcut?: string[];
  keyLimit?: number;
  onScan?: (keyChord: string[]) => void;
  onCancelScan?: (keyChord: string[]) => void;
  className?: string;
}

// Main component
const ScanForInputTomes: FunctionComponent<ScanForInputTomesProps> = ({
  actionType = 'toggle',
  initialShortcut = [],
  keyLimit = 3,
  onScan,
  onCancelScan,
  className
}) => {
  // State management
  const [shortcut, setShortcut] = useState<string[]>(initialShortcut);
  const [isScanning, setIsScanning] = useState(false);
  const [currentKeyChord, setCurrentKeyChord] = useState<string[]>([]);
  const [escapeCalled, setIsEscapeCalled] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [messageHandler, setMessageHandler] = useState<ScanForInputMessageHandler | null>(null);
  const [isExtension, setIsExtension] = useState(false);
  const [keyboardListener, setKeyboardListener] = useState<((event: KeyboardEvent) => void) | null>(null);

  // Refs
  const keyboardListenerRef = useRef<((event: KeyboardEvent) => void) | null>(null);

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      // Check if we're running in a Chrome extension context
      const extensionContext = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
      setIsExtension(Boolean(extensionContext));

      if (extensionContext) {
        // Initialize Chrome extension message handler
        const handler = new ScanForInputMessageHandler();
        setMessageHandler(handler);
        
        // Load saved shortcuts from Chrome storage
        if (chrome.storage && chrome.storage.local) {
          try {
            const result = await chrome.storage.local.get(['waveReaderShortcuts', `${actionType}Shortcut`]);
            
            if (result[`${actionType}Shortcut`]) {
              setShortcut(result[`${actionType}Shortcut`]);
            }
          } catch (error) {
            console.warn('Failed to load shortcuts from Chrome storage:', error);
          }
        }
      }
      
      console.log('⌨️ ScanForInputTomes: Initialized for Chrome extension context');
    };

    initializeComponent();
  }, [actionType]);

  // Cleanup keyboard listener on unmount
  useEffect(() => {
    return () => {
      if (keyboardListenerRef.current) {
        document.removeEventListener('keydown', keyboardListenerRef.current);
      }
    };
  }, []);

  // Handle Chrome extension messaging
  const sendExtensionMessage = async (message: any) => {
    if (!isExtension || !messageHandler) {
      console.warn('⌨️ ScanForInputTomes: Not in extension context or message handler not ready');
      return null;
    }

    try {
      return await messageHandler.sendMessage('background', message);
    } catch (error) {
      console.error('⌨️ ScanForInputTomes: Failed to send extension message:', error);
      return null;
    }
  };

  // Keyboard event handler
  const handleKeyboardEvent = useCallback((event: KeyboardEvent) => {
    if (event.type !== 'keydown') return;
    
    // Prevent default behavior for certain keys
    if (['Escape', 'Tab', 'F5', 'F12'].includes(event.key)) {
      event.preventDefault();
    }
    
    if (event.key === 'Escape') {
      setIsEscapeCalled(true);
      setCurrentKeyChord([]);
      return;
    }
    
    // Add key to current chord
    setCurrentKeyChord(prev => {
      if (prev.length < keyLimit) {
        return [...prev, event.key];
      } else {
        // Replace the oldest key
        const newChord = [...prev];
        newChord.shift();
        newChord.push(event.key);
        return newChord;
      }
    });
  }, [keyLimit]);

  // Event handlers
  const handleStartScanning = useCallback(() => {
    console.log('⌨️ ScanForInputTomes: Starting keyboard scanning');
    setIsScanning(true);
    setCurrentKeyChord([]);
    setIsEscapeCalled(false);
    setValidationError(null);
    
    // Set up global keyboard listener
    const listener = handleKeyboardEvent;
    keyboardListenerRef.current = listener;
    document.addEventListener('keydown', listener);
    setKeyboardListener(listener);
  }, [handleKeyboardEvent]);

  const handleStopScanning = useCallback(() => {
    console.log('⌨️ ScanForInputTomes: Stopping keyboard scanning');
    setIsScanning(false);
    
    // Remove global keyboard listener
    if (keyboardListenerRef.current) {
      document.removeEventListener('keydown', keyboardListenerRef.current);
      keyboardListenerRef.current = null;
      setKeyboardListener(null);
    }
  }, []);

  const handleConfirmShortcut = useCallback(async () => {
    console.log('⌨️ ScanForInputTomes: Confirming shortcut:', currentKeyChord);
    
    if (currentKeyChord.length === 0) {
      setValidationError('No keys pressed');
      return;
    }

    try {
      if (isExtension) {
        // Send message to background script for validation
        const response = await sendExtensionMessage({
          type: 'VALIDATE_SHORTCUT',
          shortcut: currentKeyChord,
          actionType,
          source: 'scan-for-input',
          target: 'background',
          traceId: Date.now().toString()
        });
        
        if (response && response.success) {
          await handleValidationSuccess();
        } else {
          setValidationError(response?.error || 'Validation failed');
        }
      } else {
        // Non-extension context - just save locally
        await handleValidationSuccess();
      }
    } catch (error) {
      console.error('Failed to validate shortcut:', error);
      setValidationError('Validation failed');
    }
  }, [currentKeyChord, actionType, isExtension]);

  const handleValidationSuccess = useCallback(async () => {
    console.log('⌨️ ScanForInputTomes: Validation successful');
    
    // Save the shortcut
    setShortcut([...currentKeyChord]);
    setIsScanning(false);
    setValidationError(null);
    
    // Notify parent component
    if (onScan) {
      onScan([...currentKeyChord]);
    }
    
    // Save to storage
    if (isExtension) {
      try {
        await sendExtensionMessage({
          type: 'SHORTCUT_SAVED',
          actionType,
          shortcut: currentKeyChord,
          source: 'scan-for-input',
          target: 'background',
          traceId: Date.now().toString()
        });
        
        // Save to Chrome storage
        if (chrome.storage && chrome.storage.local) {
          await chrome.storage.local.set({ 
            [`${actionType}Shortcut`]: currentKeyChord
          });
        }
      } catch (error) {
        console.warn('Failed to save shortcut to extension:', error);
      }
    }
    
    // Clean up keyboard listener
    handleStopScanning();
  }, [currentKeyChord, actionType, onScan, isExtension, handleStopScanning]);

  const handleCancelScanning = useCallback(() => {
    console.log('⌨️ ScanForInputTomes: Canceling scanning');
    
    // Notify parent component
    if (onCancelScan) {
      onCancelScan(shortcut);
    }
    
    // Clean up
    handleStopScanning();
    setCurrentKeyChord([]);
    setIsEscapeCalled(false);
  }, [shortcut, onCancelScan, handleStopScanning]);

  const handleClearShortcut = useCallback(async () => {
    console.log('⌨️ ScanForInputTomes: Clearing shortcut');
    setShortcut([]);
    
    // Clear from storage
    if (isExtension) {
      try {
        await sendExtensionMessage({
          type: 'SHORTCUT_CLEARED',
          actionType,
          source: 'scan-for-input',
          target: 'background',
          traceId: Date.now().toString()
        });
        
        // Clear from Chrome storage
        if (chrome.storage && chrome.storage.local) {
          await chrome.storage.local.remove([`${actionType}Shortcut`]);
        }
      } catch (error) {
        console.warn('Failed to clear shortcut from extension:', error);
      }
    }
  }, [actionType, isExtension]);

  // Render scanning state
  if (isScanning) {
    return (
      <ScanForInputContainer className={className}>
        <ScanForInputHeader>
          <h2>🎯 Scanning for Keys</h2>
          <p>Press keys for: {actionType}</p>
        </ScanForInputHeader>
        
        <ScanForInputContent>
          <ScanningProgress>
            <KeyChordDisplay>
              <KeyChordTitle>Current Key Chord:</KeyChordTitle>
              <KeyChord>
                {currentKeyChord.length === 0 ? (
                  <Waiting>Waiting for input...</Waiting>
                ) : (
                  currentKeyChord.map((key, index) => (
                    <Key key={index} className="pressed">
                      {key}
                    </Key>
                  ))
                )}
              </KeyChord>
            </KeyChordDisplay>
            
            <ScanningStatus>
              <StatusIndicator />
              <p>Listening for keyboard input...</p>
              <KeyLimit>{currentKeyChord.length}/{keyLimit} keys</KeyLimit>
            </ScanningStatus>
          </ScanningProgress>
          
          <ControlButtons>
            <Button 
              className="btn btn-primary" 
              onClick={handleConfirmShortcut}
              disabled={currentKeyChord.length === 0}
            >
              ✅ Confirm Shortcut
            </Button>
            <Button className="btn btn-secondary" onClick={handleCancelScanning}>
              ❌ Cancel
            </Button>
          </ControlButtons>
          
          <ScanningInstructions>
            <Instruction>
              <InstructionIcon>💡</InstructionIcon>
              <span>Press up to {keyLimit} keys to create your shortcut</span>
            </Instruction>
            <Instruction>
              <InstructionIcon>⚠️</InstructionIcon>
              <span>Press Escape to cancel and clear the current chord</span>
            </Instruction>
          </ScanningInstructions>
        </ScanForInputContent>
      </ScanForInputContainer>
    );
  }

  // Render idle state
  return (
    <ScanForInputContainer className={className}>
      <ScanForInputHeader>
        <h2>⌨️ Keyboard Shortcut Scanner</h2>
        <p>Configure keyboard shortcuts for: {actionType}</p>
      </ScanForInputHeader>
      
      <ScanForInputContent>
        <ShortcutDisplay>
          <ShortcutInfoTitle>Current Shortcut:</ShortcutInfoTitle>
          <ShortcutText>
            {shortcut.length === 0 ? (
              <NoShortcut>No shortcut configured</NoShortcut>
            ) : (
              shortcut.map((key, index) => (
                <Key key={index}>{key}</Key>
              ))
            )}
          </ShortcutText>
        </ShortcutDisplay>
        
        <ControlButtons>
          <Button className="btn btn-primary" onClick={handleStartScanning}>
            🔍 Start Scanning
          </Button>
          <Button className="btn btn-secondary" onClick={handleClearShortcut}>
            🗑️ Clear Shortcut
          </Button>
        </ControlButtons>
        
        <ShortcutInfo>
          <ShortcutInfoTitle>Shortcut Information:</ShortcutInfoTitle>
          <ShortcutInfoText><strong>Key Limit:</strong> {keyLimit} keys</ShortcutInfoText>
          <ShortcutInfoText><strong>Action Type:</strong> {actionType}</ShortcutInfoText>
          <ShortcutInfoText className="hint">Press Escape to cancel scanning</ShortcutInfoText>
        </ShortcutInfo>
      </ScanForInputContent>
    </ScanForInputContainer>
  );
};

export default ScanForInputTomes;
