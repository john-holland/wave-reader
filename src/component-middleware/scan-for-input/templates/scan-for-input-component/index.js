/**
 * Scan For Input Component Template
 * 
 * A consolidated template for keyboard shortcut scanning that combines both implementations
 * with routing support for keyboard input management and state management.
 */

import { createViewStateMachine } from 'log-view-machine';

const ScanForInputComponentTemplate = {
  id: 'scan-for-input-component',
  name: 'Scan For Input Component',
  description: 'Consolidated keyboard shortcut scanner with React Machine integration and routing support',
  version: '2.0.0',
  dependencies: ['log-view-machine'],
  
  // Template configuration
  config: {
    machineId: 'scan-for-input-component',
    xstateConfig: {
      id: 'scan-for-input-component',
      initial: 'idle',
      context: {
        actionType: 'toggle',
        shortcut: [],
        keyLimit: 3,
        isScanning: false,
        currentKeyChord: [],
        escapeCalled: false,
        scanningMap: new Map(),
        listenerMap: new Map(),
        validationError: null,
        lastKeyPressed: null
      }
    }
  },

  // Create the template instance
  create: (config = {}) => {
    return createViewStateMachine({
      machineId: 'scan-for-input-component',
      xstateConfig: {
        ...ScanForInputComponentTemplate.config.xstateConfig,
        ...config.xstateConfig
      },
      logStates: {
        idle: async (context) => {
          await context.log('Displaying idle state');
          
          return context.view(`
            <div class="scan-for-input-idle">
              <div class="scan-header">
                <h3>⌨️ Keyboard Shortcut Scanner</h3>
                <p>Configure keyboard shortcuts for: ${context.model.actionType}</p>
              </div>
              
              <div class="shortcut-display">
                <h4>Current Shortcut:</h4>
                <div class="shortcut-text">
                  ${context.model.shortcut.length === 0 ? 
                    '<span class="no-shortcut">No shortcut configured</span>' : 
                    context.model.shortcut.map(key => `<kbd class="key">${key}</kbd>`).join(' + ')
                  }
                </div>
              </div>
              
              <div class="scan-controls">
                <button class="btn btn-primary" onclick="startScanning()">
                  🔍 Start Scanning
                </button>
                <button class="btn btn-secondary" onclick="clearShortcut()">
                  🗑️ Clear Shortcut
                </button>
              </div>
              
              <div class="shortcut-info">
                <p><strong>Key Limit:</strong> ${context.model.keyLimit} keys</p>
                <p><strong>Action Type:</strong> ${context.model.actionType}</p>
                <p class="hint">Press Escape to cancel scanning</p>
              </div>
            </div>
          `);
        },
        
        scanning: async (context) => {
          await context.log('Displaying scanning state');
          
          return context.view(`
            <div class="scan-for-input-scanning">
              <div class="scanning-header">
                <h3>🎯 Scanning for Keys</h3>
                <p>Press keys for: ${context.model.actionType}</p>
              </div>
              
              <div class="scanning-progress">
                <div class="key-chord-display">
                  <h4>Current Key Chord:</h4>
                  <div class="key-chord">
                    ${context.model.currentKeyChord.length === 0 ? 
                      '<span class="waiting">Waiting for input...</span>' : 
                      context.model.currentKeyChord.map(key => `<kbd class="key pressed">${key}</kbd>`).join(' + ')
                    }
                  </div>
                </div>
                
                <div class="scanning-status">
                  <div class="status-indicator scanning"></div>
                  <p>Listening for keyboard input...</p>
                  <p class="key-limit">${context.model.currentKeyChord.length}/${context.model.keyLimit} keys</p>
                </div>
              </div>
              
              <div class="scanning-controls">
                <button class="btn btn-primary" onclick="confirmShortcut()" 
                        ${context.model.currentKeyChord.length === 0 ? 'disabled' : ''}>
                  ✅ Confirm Shortcut
                </button>
                <button class="btn btn-secondary" onclick="cancelScanning()">
                  ❌ Cancel
                </button>
              </div>
              
              <div class="scanning-instructions">
                <div class="instruction">
                  <span class="instruction-icon">💡</span>
                  <span>Press up to ${context.model.keyLimit} keys to create your shortcut</span>
                </div>
                <div class="instruction">
                  <span class="instruction-icon">⚠️</span>
                  <span>Press Escape to cancel and clear the current chord</span>
                </div>
              </div>
            </div>
          `);
        },
        
        validating: async (context) => {
          await context.log('Displaying validating state');
          
          return context.view(`
            <div class="scan-for-input-validating">
              <div class="validation-header">
                <h3>🔍 Validating Shortcut</h3>
                <p>Checking shortcut: ${context.model.currentKeyChord.map(key => key).join(' + ')}</p>
              </div>
              
              <div class="validation-progress">
                <div class="spinner"></div>
                <p>Validating keyboard shortcut...</p>
                <p>Checking for conflicts and accessibility...</p>
              </div>
            </div>
          `);
        },
        
        'shortcut-conflict': async (context) => {
          await context.log('Displaying shortcut conflict state');
          
          return context.view(`
            <div class="scan-for-input-conflict">
              <div class="conflict-header">
                <h3>⚠️ Shortcut Conflict Detected</h3>
                <p>The shortcut ${context.model.currentKeyChord.map(key => key).join(' + ')} is already in use</p>
              </div>
              
              <div class="conflict-details">
                <h4>Conflicting Actions:</h4>
                <ul class="conflict-list">
                  ${context.model.conflictingActions ? 
                    context.model.conflictingActions.map(action => `<li>${action}</li>`).join('') : 
                    '<li>Unknown action</li>'
                  }
                </ul>
              </div>
              
              <div class="conflict-actions">
                <button class="btn btn-warning" onclick="overrideConflict()">
                  🚨 Override Conflict
                </button>
                <button class="btn btn-secondary" onclick="chooseDifferentShortcut()">
                  🔄 Choose Different Shortcut
                </button>
                <button class="btn btn-danger" onclick="cancelScanning()">
                  ❌ Cancel
                </button>
              </div>
            </div>
          `);
        },
        
        'shortcut-saved': async (context) => {
          await context.log('Displaying shortcut saved state');
          
          return context.view(`
            <div class="scan-for-input-saved">
              <div class="saved-header">
                <h3>✅ Shortcut Saved!</h3>
                <p>Successfully configured shortcut for: ${context.model.actionType}</p>
              </div>
              
              <div class="saved-shortcut">
                <h4>New Shortcut:</h4>
                <div class="shortcut-display">
                  ${context.model.shortcut.map(key => `<kbd class="key">${key}</kbd>`).join(' + ')}
                </div>
              </div>
              
              <div class="saved-actions">
                <button class="btn btn-primary" onclick="goToIdle()">
                  🏠 Back to Main
                </button>
                <button class="btn btn-secondary" onclick="configureAnother()">
                  ⚙️ Configure Another
                </button>
              </div>
            </div>
          `);
        },
        
        error: async (context) => {
          await context.log('Displaying error state');
          
          return context.view(`
            <div class="scan-for-input-error">
              <div class="error-header">
                <h3>❌ Error</h3>
                <p>${context.model.validationError || 'An error occurred while scanning'}</p>
              </div>
              
              <div class="error-actions">
                <button class="btn btn-primary" onclick="retryScanning()">
                  🔄 Retry
                </button>
                <button class="btn btn-secondary" onclick="goToIdle()">
                  ← Back to Main
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
            START_SCANNING: {
              target: 'scanning',
              actions: ['startScanning']
            },
            CLEAR_SHORTCUT: {
              actions: ['clearShortcut']
            },
            UPDATE_ACTION_TYPE: {
              actions: ['updateActionType']
            }
          }
        },
        
        scanning: {
          on: {
            KEY_PRESSED: {
              actions: ['handleKeyPress']
            },
            ESCAPE_PRESSED: {
              actions: ['handleEscape']
            },
            CONFIRM_SHORTCUT: {
              target: 'validating',
              actions: ['prepareValidation'],
              cond: 'hasValidKeyChord'
            },
            CANCEL_SCANNING: {
              target: 'idle',
              actions: ['cancelScanning']
            }
          }
        },
        
        validating: {
          on: {
            VALIDATION_SUCCESS: {
              target: 'shortcut-saved',
              actions: ['handleValidationSuccess']
            },
            VALIDATION_FAILED: {
              target: 'error',
              actions: ['handleValidationFailed']
            },
            SHORTCUT_CONFLICT: {
              target: 'shortcut-conflict',
              actions: ['handleShortcutConflict']
            }
          }
        },
        
        'shortcut-conflict': {
          on: {
            OVERRIDE_CONFLICT: {
              target: 'validating',
              actions: ['overrideConflict']
            },
            CHOOSE_DIFFERENT: {
              target: 'scanning',
              actions: ['resetKeyChord']
            },
            CANCEL: {
              target: 'idle',
              actions: ['cancelScanning']
            }
          }
        },
        
        'shortcut-saved': {
          on: {
            GO_TO_IDLE: {
              target: 'idle',
              actions: ['resetToIdle']
            },
            CONFIGURE_ANOTHER: {
              target: 'idle',
              actions: ['prepareForAnother']
            }
          }
        },
        
        error: {
          on: {
            RETRY: {
              target: 'scanning',
              actions: ['retryScanning']
            },
            GO_TO_IDLE: {
              target: 'idle',
              actions: ['clearError']
            }
          }
        }
      },
      
      // Guards
      guards: {
        hasValidKeyChord: (context) => {
          return context.model.currentKeyChord.length > 0;
        }
      },
      
      // Actions
      actions: {
        startScanning: async (context) => {
          await context.log('Starting keyboard scanning');
          context.model.isScanning = true;
          context.model.currentKeyChord = [];
          context.model.escapeCalled = false;
          
          // Set up global keyboard listener
          setupGlobalKeyboardListener(context);
        },
        
        handleKeyPress: async (context, event) => {
          await context.log('Key pressed:', event.key);
          
          if (event.key === 'Escape') {
            context.model.escapeCalled = true;
            context.model.currentKeyChord = [];
            return;
          }
          
          // Add key to current chord
          if (context.model.currentKeyChord.length < context.model.keyLimit) {
            context.model.currentKeyChord.push(event.key);
          } else {
            // Replace the oldest key
            context.model.currentKeyChord.shift();
            context.model.currentKeyChord.push(event.key);
          }
          
          context.model.lastKeyPressed = event.key;
        },
        
        handleEscape: async (context) => {
          await context.log('Escape pressed');
          context.model.escapeCalled = true;
          context.model.currentKeyChord = [];
        },
        
        prepareValidation: async (context) => {
          await context.log('Preparing validation');
          
          // Stop global keyboard listener
          removeGlobalKeyboardListener();
          
          // Check for conflicts
          const conflicts = checkForShortcutConflicts(context.model.currentKeyChord);
          if (conflicts.length > 0) {
            context.model.conflictingActions = conflicts;
            // Transition to conflict state will be handled by the machine
          }
        },
        
        handleValidationSuccess: async (context) => {
          await context.log('Validation successful');
          
          // Save the shortcut
          context.model.shortcut = [...context.model.currentKeyChord];
          context.model.isScanning = false;
          
          // Save to storage
          if (context.model.messageHandler) {
            try {
              await context.model.messageHandler.sendMessage('background', {
                type: 'SHORTCUT_SAVED',
                actionType: context.model.actionType,
                shortcut: context.model.shortcut,
                source: 'scan-for-input',
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
          context.model.validationError = event.error || 'Shortcut validation failed';
        },
        
        handleShortcutConflict: async (context) => {
          await context.log('Handling shortcut conflict');
          // Conflict details are already set in context
        },
        
        overrideConflict: async (context) => {
          await context.log('Overriding conflict');
          // Continue with validation
        },
        
        resetKeyChord: async (context) => {
          await context.log('Resetting key chord');
          context.model.currentKeyChord = [];
          context.model.escapeCalled = false;
          
          // Re-setup global keyboard listener
          setupGlobalKeyboardListener(context);
        },
        
        cancelScanning: async (context) => {
          await context.log('Canceling scanning');
          context.model.isScanning = false;
          context.model.currentKeyChord = [];
          context.model.escapeCalled = false;
          
          // Remove global keyboard listener
          removeGlobalKeyboardListener();
        },
        
        clearShortcut: async (context) => {
          await context.log('Clearing shortcut');
          context.model.shortcut = [];
          
          // Clear from storage
          if (context.model.messageHandler) {
            try {
              await context.model.messageHandler.sendMessage('background', {
                type: 'SHORTCUT_CLEARED',
                actionType: context.model.actionType,
                source: 'scan-for-input',
                target: 'background',
                traceId: Date.now().toString()
              });
            } catch (error) {
              console.warn('Could not send clear message:', error);
            }
          }
        },
        
        updateActionType: async (context, event) => {
          await context.log('Updating action type');
          context.model.actionType = event.actionType;
        },
        
        resetToIdle: async (context) => {
          await context.log('Resetting to idle state');
          context.model.isScanning = false;
          context.model.currentKeyChord = [];
          context.model.escapeCalled = false;
          context.model.validationError = null;
        },
        
        prepareForAnother: async (context) => {
          await context.log('Preparing for another configuration');
          context.model.isScanning = false;
          context.model.currentKeyChord = [];
          context.model.escapeCalled = false;
          context.model.validationError = null;
        },
        
        retryScanning: async (context) => {
          await context.log('Retrying scanning');
          context.model.validationError = null;
          context.model.isScanning = true;
          context.model.currentKeyChord = [];
          
          // Re-setup global keyboard listener
          setupGlobalKeyboardListener(context);
        },
        
        clearError: async (context) => {
          await context.log('Clearing error');
          context.model.validationError = null;
        }
      }
    });
  }
};

// Global keyboard listener management
let globalKeyboardListener = null;

function setupGlobalKeyboardListener(context) {
  if (globalKeyboardListener) {
    removeGlobalKeyboardListener();
  }
  
  globalKeyboardListener = (event) => {
    // Only handle keydown events
    if (event.type !== 'keydown') return;
    
    // Prevent default behavior for certain keys
    if (['Escape', 'Tab', 'F5', 'F12'].includes(event.key)) {
      event.preventDefault();
    }
    
    // Send key event to the state machine
    context.send({ type: 'KEY_PRESSED', key: event.key });
  };
  
  document.addEventListener('keydown', globalKeyboardListener);
}

function removeGlobalKeyboardListener() {
  if (globalKeyboardListener) {
    document.removeEventListener('keydown', globalKeyboardListener);
    globalKeyboardListener = null;
  }
}

// Helper function to check for shortcut conflicts
function checkForShortcutConflicts(keyChord) {
  // This would typically check against existing shortcuts
  // For now, return empty array (no conflicts)
  return [];
}

// Export the template
export { ScanForInputComponentTemplate };
