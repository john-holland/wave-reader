/**
 * Selector Input Component Template
 * 
 * A template for a selector input component that can be edited by the generic editor system.
 * Includes routing support for selector management and state management.
 */

import { createViewStateMachine } from '../../../../../../log-view-machine/src/core/ViewStateMachine.tsx';

const SelectorInputComponentTemplate = {
  id: 'selector-input-component',
  name: 'Selector Input Component',
  description: 'Interactive selector input with autocomplete, validation, and management capabilities',
  version: '1.0.0',
  dependencies: ['log-view-machine'],
  
  // Template configuration
  config: {
    machineId: 'selector-input-component',
    xstateConfig: {
      id: 'selector-input-component',
      initial: 'idle',
      context: {
        selector: 'p',
        selectors: ['p', 'h1', 'h2', 'h3', '.content', '.article'],
        saved: true,
        isEditing: false,
        selectorText: 'p',
        displaySelectors: ['p', 'h1', 'h2', 'h3', '.content', '.article'],
        validationError: null,
        suggestions: []
      }
    }
  },

  // Create the template instance
  create: (config = {}) => {
    return createViewStateMachine({
      machineId: 'selector-input-component',
      xstateConfig: {
        ...SelectorInputComponentTemplate.config.xstateConfig,
        ...config.xstateConfig
      },
      logStates: {
        idle: async (context) => {
          await context.log('Displaying idle state');
          
          return context.view(`
            <div class="selector-input-idle">
              <div class="selector-display">
                <h3 class="selector-title">CSS Selector</h3>
                <div class="selector-text-display" onclick="startEditing()">
                  <span class="selector-text">${context.model.selector}</span>
                  <span class="edit-hint">(click to edit)</span>
                </div>
                <button class="btn btn-secondary" onclick="toggleSelectorMode()">
                  🎯 Select Element
                </button>
              </div>
              
              <div class="saved-selectors">
                <h4>Saved Selectors:</h4>
                ${context.model.displaySelectors.length === 0 ? '<p>No selectors saved yet</p>' : 
                  context.model.displaySelectors.map(selector => `
                    <div class="selector-item">
                      <span class="selector-text">${selector}</span>
                      <div class="selector-actions">
                        <button class="btn btn-sm btn-secondary" onclick="useSelector('${selector}')">
                          Use
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="removeSelector('${selector}')">
                          Remove
                        </button>
                      </div>
                    </div>
                  `).join('')
                }
              </div>
            </div>
          `);
        },
        
        editing: async (context) => {
          await context.log('Displaying editing state');
          
          return context.view(`
            <div class="selector-input-editing">
              <div class="selector-input-section">
                <h3 class="selector-title">CSS Selector</h3>
                <input type="text" 
                       class="selector-text-input" 
                       id="selectorInput" 
                       value="${context.model.selectorText}"
                       placeholder="Enter CSS selector (e.g., p, h1, .content)"
                       onchange="updateSelectorText(this.value)">
                
                <div class="suggestions" id="suggestions">
                  ${context.model.suggestions.map(suggestion => `
                    <div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">
                      ${suggestion}
                    </div>
                  `).join('')}
                </div>
                
                <div class="validation-error" id="validationError">
                  ${context.model.validationError || ''}
                </div>
                
                <div class="control-buttons">
                  <button class="btn btn-primary" onclick="saveSelector()">
                    💾 Save
                  </button>
                  <button class="btn btn-secondary" onclick="cancelEditing()">
                    ❌ Cancel
                  </button>
                </div>
              </div>
            </div>
          `);
        },
        
        'selector-mode': async (context) => {
          await context.log('Displaying selector mode state');
          
          return context.view(`
            <div class="selector-input-selector-mode">
              <div class="selector-mode-header">
                <h3>🎯 Element Selection Mode</h3>
                <p>Click on any element on the page to select it</p>
              </div>
              
              <div class="selection-instructions">
                <div class="instruction-step">
                  <span class="step-number">1</span>
                  <span class="step-text">Click on any element on the page</span>
                </div>
                <div class="instruction-step">
                  <span class="step-number">2</span>
                  <span class="step-text">The element will be highlighted</span>
                </div>
                <div class="instruction-step">
                  <span class="step-number">3</span>
                  <span class="step-text">Confirm your selection</span>
                </div>
              </div>
              
              <div class="selection-controls">
                <button class="btn btn-primary" onclick="confirmSelection()">
                  ✅ Confirm Selection
                </button>
                <button class="btn btn-secondary" onclick="cancelSelection()">
                  ❌ Cancel Selection
                </button>
              </div>
            </div>
          `);
        },
        
        validating: async (context) => {
          await context.log('Displaying validating state');
          
          return context.view(`
            <div class="selector-input-validating">
              <div class="validation-header">
                <h3>🔍 Validating Selector</h3>
                <p>Checking if selector "${context.model.selectorText}" is valid...</p>
              </div>
              
              <div class="validation-progress">
                <div class="spinner"></div>
                <p>Validating CSS selector syntax and checking for elements...</p>
              </div>
            </div>
          `);
        },
        
        error: async (context) => {
          await context.log('Displaying error state');
          
          return context.view(`
            <div class="selector-input-error">
              <div class="error-header">
                <h3>❌ Error</h3>
                <p>${context.model.validationError || 'An error occurred'}</p>
              </div>
              
              <div class="error-actions">
                <button class="btn btn-primary" onclick="retryValidation()">
                  🔄 Retry
                </button>
                <button class="btn btn-secondary" onclick="goToIdle()">
                  ← Back to Idle
                </button>
              </div>
            </div>
          `);
        }
      },
      
      // State machine configuration
      states: {
        idle: {
          on: {
            START_EDITING: {
              target: 'editing',
              actions: ['startEditing']
            },
            TOGGLE_SELECTOR_MODE: {
              target: 'selector-mode',
              actions: ['enterSelectorMode']
            },
            USE_SELECTOR: {
              actions: ['useSelector']
            },
            REMOVE_SELECTOR: {
              actions: ['removeSelector']
            }
          }
        },
        
        editing: {
          on: {
            UPDATE_SELECTOR_TEXT: {
              actions: ['updateSelectorText']
            },
            SAVE_SELECTOR: {
              target: 'validating',
              actions: ['prepareValidation']
            },
            CANCEL_EDITING: {
              target: 'idle',
              actions: ['cancelEditing']
            }
          }
        },
        
        'selector-mode': {
          on: {
            ELEMENT_SELECTED: {
              actions: ['handleElementSelection']
            },
            CONFIRM_SELECTION: {
              target: 'validating',
              actions: ['prepareValidation']
            },
            CANCEL_SELECTION: {
              target: 'idle',
              actions: ['exitSelectorMode']
            }
          }
        },
        
        validating: {
          on: {
            VALIDATION_SUCCESS: {
              target: 'idle',
              actions: ['handleValidationSuccess']
            },
            VALIDATION_FAILED: {
              target: 'error',
              actions: ['handleValidationFailed']
            }
          }
        },
        
        error: {
          on: {
            RETRY_VALIDATION: {
              target: 'validating',
              actions: ['retryValidation']
            },
            GO_TO_IDLE: {
              target: 'idle',
              actions: ['clearError']
            }
          }
        }
      },
      
      // Actions
      actions: {
        startEditing: async (context) => {
          await context.log('Starting editing mode');
          context.model.isEditing = true;
          context.model.selectorText = context.model.selector;
        },
        
        enterSelectorMode: async (context) => {
          await context.log('Entering selector mode');
          // This would typically send a message to the background script
          // to enable element selection mode
        },
        
        updateSelectorText: async (context, event) => {
          await context.log('Updating selector text');
          context.model.selectorText = event.value;
          context.model.validationError = null;
          
          // Generate suggestions based on the current text
          context.model.suggestions = generateSuggestions(event.value, context.model.selectors);
        },
        
        prepareValidation: async (context) => {
          await context.log('Preparing validation');
          context.model.selector = context.model.selectorText;
          
          // Send message to background script for validation
          if (context.model.messageHandler) {
            try {
              await context.model.messageHandler.sendMessage('background', {
                type: 'VALIDATE_SELECTOR',
                selector: context.model.selector,
                source: 'selector-input',
                target: 'background',
                traceId: Date.now().toString()
              });
            } catch (error) {
              console.warn('Could not send validation message:', error);
            }
          }
        },
        
        handleValidationSuccess: async (context) => {
          await context.log('Validation successful');
          context.model.saved = true;
          context.model.isEditing = false;
          
          // Add to saved selectors if not already there
          if (!context.model.selectors.includes(context.model.selector)) {
            context.model.selectors.push(context.model.selector);
            context.model.displaySelectors = [...new Set(context.model.selectors)];
          }
          
          // Save to storage
          if (context.model.messageHandler) {
            try {
              await context.model.messageHandler.sendMessage('background', {
                type: 'SELECTOR_SAVED',
                selector: context.model.selector,
                source: 'selector-input',
                target: 'background',
                traceId: Date.now().toString()
              });
            } catch (error) {
              console.warn('Could not send save message:', error);
            }
          }
        },
        
        handleValidationFailed: async (context, event) => {
          await context.log('Validation failed');
          context.model.validationError = event.error || 'Invalid selector';
        },
        
        cancelEditing: async (context) => {
          await context.log('Canceling editing');
          context.model.isEditing = false;
          context.model.selectorText = context.model.selector;
          context.model.validationError = null;
        },
        
        exitSelectorMode: async (context) => {
          await context.log('Exiting selector mode');
          // This would typically send a message to the background script
          // to disable element selection mode
        },
        
        handleElementSelection: async (context, event) => {
          await context.log('Element selected');
          if (event.selector) {
            context.model.selectorText = event.selector;
          }
        },
        
        useSelector: async (context, event) => {
          await context.log('Using selector');
          context.model.selector = event.selector;
          context.model.selectorText = event.selector;
          context.model.saved = true;
        },
        
        removeSelector: async (context, event) => {
          await context.log('Removing selector');
          const index = context.model.selectors.indexOf(event.selector);
          if (index > -1) {
            context.model.selectors.splice(index, 1);
            context.model.displaySelectors = [...new Set(context.model.selectors)];
          }
        },
        
        retryValidation: async (context) => {
          await context.log('Retrying validation');
          context.model.validationError = null;
        },
        
        clearError: async (context) => {
          await context.log('Clearing error');
          context.model.validationError = null;
        }
      }
    });
  }
};

// Helper function to generate selector suggestions
function generateSuggestions(input, existingSelectors) {
  if (!input || input.length < 2) return [];
  
  const suggestions = [];
  
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
}

export { SelectorInputComponentTemplate };
