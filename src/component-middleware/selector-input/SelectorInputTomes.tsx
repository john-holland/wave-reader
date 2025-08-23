import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { SelectorInputMessageHandler } from './robotcopy-pact-config';

// Styled components for the Tomes-based selector input
const SelectorInputContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const SelectorInputHeader = styled.div`
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

const SelectorInputContent = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-radius: 0 0 8px 8px;
`;

const SelectorDisplay = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.1);
  }
`;

const SelectorText = styled.span`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 18px;
  color: #495057;
  font-weight: 500;
`;

const EditHint = styled.span`
  font-size: 12px;
  color: #6c757d;
  font-style: italic;
  margin-left: 12px;
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  
  &.btn-primary {
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a6fd8;
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

const SavedSelectors = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e9ecef;
`;

const SavedSelectorsTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #2c3e50;
`;

const SelectorItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.1);
  }
`;

const SelectorActions = styled.div`
  display: flex;
  gap: 8px;
`;

const NoSelectorsMessage = styled.p`
  color: #6c757d;
  font-style: italic;
  text-align: center;
  margin: 20px 0;
`;

// Props interface
interface SelectorInputTomesProps {
  initialSelector?: string;
  initialSelectors?: string[];
  onSelectorChange?: (selector: string) => void;
  onSelectorsUpdate?: (selectors: string[]) => void;
  className?: string;
}

// Main component
const SelectorInputTomes: FunctionComponent<SelectorInputTomesProps> = ({
  initialSelector = 'p',
  initialSelectors = ['p', 'h1', 'h2', 'h3', '.content', '.article'],
  onSelectorChange,
  onSelectorsUpdate,
  className
}) => {
  // State management
  const [selector, setSelector] = useState(initialSelector);
  const [selectors, setSelectors] = useState<string[]>(initialSelectors);
  const [isEditing, setIsEditing] = useState(false);
  const [selectorText, setSelectorText] = useState(initialSelector);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [messageHandler, setMessageHandler] = useState<SelectorInputMessageHandler | null>(null);
  const [isExtension, setIsExtension] = useState(false);

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      // Check if we're running in a Chrome extension context
      const extensionContext = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
      setIsExtension(Boolean(extensionContext));

      if (extensionContext) {
        // Initialize Chrome extension message handler
        const handler = new SelectorInputMessageHandler();
        setMessageHandler(handler);
        
        // Load saved selectors from Chrome storage
        if (chrome.storage && chrome.storage.local) {
          try {
            const result = await chrome.storage.local.get(['waveReaderSelectors', 'currentSelector']);
            
            if (result.waveReaderSelectors) {
              setSelectors(result.waveReaderSelectors);
            }
            
            if (result.currentSelector) {
              setSelector(result.currentSelector);
              setSelectorText(result.currentSelector);
            }
          } catch (error) {
            console.warn('Failed to load selectors from Chrome storage:', error);
          }
        }
      }
      
      console.log('🎯 SelectorInputTomes: Initialized for Chrome extension context');
    };

    initializeComponent();
  }, []);

  // Handle Chrome extension messaging
  const sendExtensionMessage = async (message: any) => {
    if (!isExtension || !messageHandler) {
      console.warn('🎯 SelectorInputTomes: Not in extension context or message handler not ready');
      return null;
    }

    try {
      return await messageHandler.sendMessage('background', message);
    } catch (error) {
      console.error('🎯 SelectorInputTomes: Failed to send extension message:', error);
      return null;
    }
  };

  // Event handlers
  const handleStartEditing = () => {
    console.log('🎯 SelectorInputTomes: Starting edit mode');
    setIsEditing(true);
    setSelectorText(selector);
    setValidationError(null);
    setSuggestions([]);
  };

  const handleToggleSelectorMode = () => {
    console.log('🎯 SelectorInputTomes: Toggling selector mode');
    
    if (isExtension) {
      // Send message to background script to enable element selection mode
      sendExtensionMessage({
        type: 'TOGGLE_SELECTOR_MODE',
        source: 'selector-input',
        target: 'background',
        traceId: Date.now().toString()
      });
    }
    
    // For now, just go back to idle state
    setIsEditing(false);
  };

  const handleSelectorTextChange = (value: string) => {
    console.log('🎯 SelectorInputTomes: Updating selector text:', value);
    setSelectorText(value);
    setValidationError(null);
    
    // Generate suggestions
    const newSuggestions = generateSuggestions(value, selectors);
    setSuggestions(newSuggestions);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    console.log('🎯 SelectorInputTomes: Selecting suggestion:', suggestion);
    setSelectorText(suggestion);
    setSuggestions([]);
  };

  const handleSaveSelector = async () => {
    console.log('🎯 SelectorInputTomes: Saving selector:', selectorText);
    
    if (!selectorText || selectorText.trim() === '') {
      setValidationError('Selector cannot be empty');
      return;
    }

    // Validate selector
    if (!isValidSelector(selectorText)) {
      setValidationError('Invalid CSS selector');
      return;
    }

    try {
      if (isExtension) {
        // Send message to background script for validation
        const response = await sendExtensionMessage({
          type: 'VALIDATE_SELECTOR',
          selector: selectorText,
          source: 'selector-input',
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
      console.error('Failed to validate selector:', error);
      setValidationError('Validation failed');
    }
  };

  const handleValidationSuccess = async () => {
    console.log('🎯 SelectorInputTomes: Validation successful');
    
    // Update local state
    setSelector(selectorText);
    setIsEditing(false);
    setValidationError(null);
    setSuggestions([]);
    
    // Add to saved selectors if not already there
    if (!selectors.includes(selectorText)) {
      const newSelectors = [...new Set([...selectors, selectorText])];
      setSelectors(newSelectors);
      
      // Notify parent component
      if (onSelectorsUpdate) {
        onSelectorsUpdate(newSelectors);
      }
    }
    
    // Notify parent component
    if (onSelectorChange) {
      onSelectorChange(selectorText);
    }
    
    // Save to storage
    if (isExtension) {
      try {
        await sendExtensionMessage({
          type: 'SELECTOR_SAVED',
          selector: selectorText,
          source: 'selector-input',
          target: 'background',
          traceId: Date.now().toString()
        });
        
        // Save to Chrome storage
        if (chrome.storage && chrome.storage.local) {
          await chrome.storage.local.set({ 
            currentSelector: selectorText,
            waveReaderSelectors: selectors
          });
        }
      } catch (error) {
        console.warn('Failed to save selector to extension:', error);
      }
    }
  };

  const handleCancelEditing = () => {
    console.log('🎯 SelectorInputTomes: Canceling editing');
    setIsEditing(false);
    setSelectorText(selector);
    setValidationError(null);
    setSuggestions([]);
  };

  const handleUseSelector = (selectedSelector: string) => {
    console.log('🎯 SelectorInputTomes: Using selector:', selectedSelector);
    setSelector(selectedSelector);
    setSelectorText(selectedSelector);
    
    // Notify parent component
    if (onSelectorChange) {
      onSelectorChange(selectedSelector);
    }
  };

  const handleRemoveSelector = (selectorToRemove: string) => {
    console.log('🎯 SelectorInputTomes: Removing selector:', selectorToRemove);
    
    const newSelectors = selectors.filter(s => s !== selectorToRemove);
    setSelectors(newSelectors);
    
    // If we removed the current selector, reset to default
    if (selector === selectorToRemove) {
      const newSelector = 'p';
      setSelector(newSelector);
      setSelectorText(newSelector);
      
      if (onSelectorChange) {
        onSelectorChange(newSelector);
      }
    }
    
    // Notify parent component
    if (onSelectorsUpdate) {
      onSelectorsUpdate(newSelectors);
    }
  };

  // Helper functions
  const generateSuggestions = (input: string, existingSelectors: string[]): string[] => {
    if (!input || input.length < 2) return [];
    
    const suggestions: string[] = [];
    
    // Add existing selectors that match
    existingSelectors.forEach(selector => {
      if (selector.toLowerCase().includes(input.toLowerCase())) {
        suggestions.push(selector);
      }
    });
    
    // Add common CSS selectors
    const commonSelectors = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'a', 'img', '.content', '.article', '.text', '.title'];
    commonSelectors.forEach(selector => {
      if (selector.toLowerCase().includes(input.toLowerCase()) && !suggestions.includes(selector)) {
        suggestions.push(selector);
      }
    });
    
    return suggestions.slice(0, 5); // Limit to 5 suggestions
  };

  const isValidSelector = (selector: string): boolean => {
    try {
      // Basic CSS selector validation
      if (!selector || typeof selector !== 'string') return false;
      
      // Check for basic CSS selector patterns
      const validPatterns = [
        /^[a-zA-Z][a-zA-Z0-9_-]*$/, // Element selectors
        /^\.[a-zA-Z][a-zA-Z0-9_-]*$/, // Class selectors
        /^#[a-zA-Z][a-zA-Z0-9_-]*$/, // ID selectors
        /^[a-zA-Z][a-zA-Z0-9_-]*\[[^\]]+\]$/, // Attribute selectors
        /^[a-zA-Z][a-zA-Z0-9_-]*:[a-zA-Z][a-zA-Z0-9_-]*$/, // Pseudo-class selectors
        /^[a-zA-Z][a-zA-Z0-9_-]*::[a-zA-Z][a-zA-Z0-9_-]*$/, // Pseudo-element selectors
        /^[a-zA-Z][a-zA-Z0-9_-]*\.[a-zA-Z][a-zA-Z0-9_-]*$/, // Element.class
        /^[a-zA-Z][a-zA-Z0-9_-]*#[a-zA-Z][a-zA-Z0-9_-]*$/, // Element#id
        /^[a-zA-Z][a-zA-Z0-9_-]*\s+[a-zA-Z][a-zA-Z0-9_-]*$/, // Descendant selectors
        /^[a-zA-Z][a-zA-Z0-9_-]*>[a-zA-Z][a-zA-Z0-9_-]*$/, // Child selectors
        /^[a-zA-Z][a-zA-Z0-9_-]*\+[a-zA-Z][a-zA-Z0-9_-]*$/, // Adjacent sibling selectors
        /^[a-zA-Z][a-zA-Z0-9_-]*~[a-zA-Z][a-zA-Z0-9_-]*$/ // General sibling selectors
      ];
      
      return validPatterns.some(pattern => pattern.test(selector)) || 
             selector === '*' || // Universal selector
             selector === 'p' || // Common simple selectors
             selector === 'h1' ||
             selector === 'h2' ||
             selector === 'h3' ||
             selector === 'div' ||
             selector === 'span' ||
             selector === 'a' ||
             selector === 'img';
    } catch (error) {
      return false;
    }
  };

  // Render editing state
  if (isEditing) {
    return (
      <SelectorInputContainer className={className}>
        <SelectorInputHeader>
          <h2>🎯 Edit Selector</h2>
          <p>Modify your CSS selector</p>
        </SelectorInputHeader>
        
        <SelectorInputContent>
          <div style={{ background: 'white', borderRadius: '8px', padding: '20px', border: '1px solid #e9ecef' }}>
            <label htmlFor="selectorInput" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
              CSS Selector
            </label>
            
            <input
              type="text"
              id="selectorInput"
              value={selectorText}
              onChange={(e) => handleSelectorTextChange(e.target.value)}
              placeholder="Enter CSS selector (e.g., p, h1, .content)"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '16px',
                fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
                marginBottom: '16px',
                transition: 'border-color 0.2s ease'
              }}
            />
            
            {suggestions.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Suggestions:</div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    style={{
                      padding: '8px 12px',
                      marginBottom: '4px',
                      background: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#667eea';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8f9fa';
                      e.currentTarget.style.color = '#495057';
                      e.currentTarget.style.borderColor = '#e9ecef';
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
            
            {validationError && (
              <div style={{
                color: '#dc3545',
                fontSize: '14px',
                marginBottom: '16px',
                padding: '8px 12px',
                background: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '4px'
              }}>
                {validationError}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button className="btn btn-primary" onClick={handleSaveSelector}>
                💾 Save
              </Button>
              <Button className="btn btn-secondary" onClick={handleCancelEditing}>
                ❌ Cancel
              </Button>
            </div>
          </div>
        </SelectorInputContent>
      </SelectorInputContainer>
    );
  }

  // Render idle state
  return (
    <SelectorInputContainer className={className}>
      <SelectorInputHeader>
        <h2>🎯 Selector Input</h2>
        <p>Manage your CSS selectors</p>
      </SelectorInputHeader>
      
      <SelectorInputContent>
        <SelectorDisplay onClick={handleStartEditing}>
          <SelectorText>{selector}</SelectorText>
          <EditHint>(click to edit)</EditHint>
        </SelectorDisplay>
        
        <ControlButtons>
          <Button className="btn btn-secondary" onClick={handleToggleSelectorMode}>
            🎯 Select Element
          </Button>
        </ControlButtons>
        
        <SavedSelectors>
          <SavedSelectorsTitle>Saved Selectors:</SavedSelectorsTitle>
          
          {selectors.length === 0 ? (
            <NoSelectorsMessage>No selectors saved yet</NoSelectorsMessage>
          ) : (
            selectors.map((savedSelector, index) => (
              <SelectorItem key={index}>
                <span style={{ fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace', fontSize: '14px', color: '#495057' }}>
                  {savedSelector}
                </span>
                <SelectorActions>
                  <Button 
                    className="btn btn-secondary" 
                    onClick={() => handleUseSelector(savedSelector)}
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                  >
                    Use
                  </Button>
                  <Button 
                    className="btn btn-danger" 
                    onClick={() => handleRemoveSelector(savedSelector)}
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                  >
                    Remove
                  </Button>
                </SelectorActions>
              </SelectorItem>
            ))
          )}
        </SavedSelectors>
      </SelectorInputContent>
    </SelectorInputContainer>
  );
};

export default SelectorInputTomes;
