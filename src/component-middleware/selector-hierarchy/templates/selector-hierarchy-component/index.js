/**
 * Selector Hierarchy Component Template
 * 
 * A template for a complex hierarchy selector component with tree structure,
 * nested state machines, and comprehensive element selection capabilities.
 */

import { createViewStateMachine } from 'log-view-machine';

const SelectorHierarchyComponentTemplate = {
  id: 'selector-hierarchy-component',
  name: 'Selector Hierarchy Component',
  description: 'Complex hierarchy selector with tree structure, nested state machines, and element selection',
  version: '1.0.0',
  dependencies: ['log-view-machine'],
  
  // Template configuration
  config: {
    machineId: 'selector-hierarchy-component',
    xstateConfig: {
      id: 'selector-hierarchy-component',
      initial: 'initializing',
      context: {
        currentView: 'initializing',
        selector: '',
        latestSelector: null,
        activeSelectorColorPanels: [],
        htmlHierarchy: null,
        dimmedPanels: [],
        confirmed: false,
        refreshKey: 0,
        error: null,
        mainElements: [],
        selection: null,
        panelState: 'idle',
        hierarchyDepth: 0,
        selectedElements: new Set(),
        excludedElements: new Set(),
        colorScheme: 'default',
        panelSize: 'medium',
        autoConfirm: false,
        showDebugInfo: false
      }
    }
  },

  // Create the template instance
  create: (config = {}) => {
    return createViewStateMachine({
      machineId: 'selector-hierarchy-component',
      xstateConfig: {
        ...SelectorHierarchyComponentTemplate.config.xstateConfig,
        ...config.xstateConfig
      },
      logStates: {
        initializing: async (context) => {
          await context.log('Initializing selector hierarchy component');
          return context.view(renderInitializingView(context));
        },
        
        'hierarchy-analysis': async (context) => {
          await context.log('Analyzing DOM hierarchy');
          return context.view(renderHierarchyAnalysisView(context));
        },
        
        'element-selection': async (context) => {
          await context.log('Element selection mode active');
          return context.view(renderElementSelectionView(context));
        },
        
        'panel-creation': async (context) => {
          await context.log('Creating color panels for elements');
          return context.view(renderPanelCreationView(context));
        },
        
        'selector-building': async (context) => {
          await context.log('Building CSS selector from selections');
          return context.view(renderSelectorBuildingView(context));
        },
        
        'validation': async (context) => {
          await context.log('Validating selector');
          return context.view(renderValidationView(context));
        },
        
        'confirmation': async (context) => {
          await context.log('Selector confirmation ready');
          return context.view(renderConfirmationView(context));
        },
        
        'hierarchy-exploration': async (context) => {
          await context.log('Exploring hierarchy structure');
          return context.view(renderHierarchyExplorationView(context));
        },
        
        'panel-management': async (context) => {
          await context.log('Managing color panels');
          return context.view(renderPanelManagementView(context));
        },
        
        'error-recovery': async (context) => {
          await context.log('Error recovery mode');
          return context.view(renderErrorRecoveryView(context));
        },
        
        'debug-mode': async (context) => {
          await context.log('Debug mode active');
          return context.view(renderDebugModeView(context));
        },
        
        'completed': async (context) => {
          await context.log('Selector hierarchy completed');
          return context.view(renderCompletedView(context));
        }
      },
      
      // State machine configuration
      states: {
        initializing: {
          on: {
            HIERARCHY_READY: { target: 'hierarchy-analysis', actions: ['initializeHierarchy'] },
            ERROR: { target: 'error-recovery', actions: ['handleInitializationError'] }
          }
        },
        
        'hierarchy-analysis': {
          on: {
            ANALYSIS_COMPLETE: { target: 'element-selection', actions: ['completeAnalysis'] },
            ANALYSIS_FAILED: { target: 'error-recovery', actions: ['handleAnalysisError'] },
            DEBUG_MODE: { target: 'debug-mode', actions: ['enableDebugMode'] }
          }
        },
        
        'element-selection': {
          on: {
            ELEMENTS_SELECTED: { target: 'panel-creation', actions: ['processElementSelection'] },
            HIERARCHY_EXPLORE: { target: 'hierarchy-exploration', actions: ['startHierarchyExploration'] },
            SELECTOR_BUILD: { target: 'selector-building', actions: ['startSelectorBuilding'] },
            ERROR: { target: 'error-recovery', actions: ['handleSelectionError'] }
          }
        },
        
        'panel-creation': {
          on: {
            PANELS_CREATED: { target: 'panel-management', actions: ['finalizePanels'] },
            PANEL_ERROR: { target: 'error-recovery', actions: ['handlePanelError'] },
            VALIDATE_SELECTOR: { target: 'validation', actions: ['startValidation'] }
          }
        },
        
        'selector-building': {
          on: {
            SELECTOR_BUILT: { target: 'validation', actions: ['completeSelectorBuilding'] },
            BUILD_ERROR: { target: 'error-recovery', actions: ['handleBuildError'] },
            MANUAL_EDIT: { actions: ['enableManualEditing'] }
          }
        },
        
        'validation': {
          on: {
            VALIDATION_PASSED: { target: 'confirmation', actions: ['completeValidation'] },
            VALIDATION_FAILED: { target: 'selector-building', actions: ['handleValidationFailure'] },
            ERROR: { target: 'error-recovery', actions: ['handleValidationError'] }
          }
        },
        
        'confirmation': {
          on: {
            CONFIRMED: { target: 'completed', actions: ['confirmSelector'] },
            REJECTED: { target: 'selector-building', actions: ['rejectSelector'] },
            MODIFY: { target: 'element-selection', actions: ['modifySelection'] }
          }
        },
        
        'hierarchy-exploration': {
          on: {
            EXPLORATION_COMPLETE: { target: 'element-selection', actions: ['completeExploration'] },
            DEEP_DIVE: { actions: ['increaseHierarchyDepth'] },
            SURFACE_LEVEL: { actions: ['decreaseHierarchyDepth'] },
            ERROR: { target: 'error-recovery', actions: ['handleExplorationError'] }
          }
        },
        
        'panel-management': {
          on: {
            PANELS_READY: { target: 'confirmation', actions: ['finalizePanelManagement'] },
            PANEL_MODIFY: { target: 'panel-creation', actions: ['modifyPanels'] },
            ERROR: { target: 'error-recovery', actions: ['handlePanelManagementError'] }
          }
        },
        
        'error-recovery': {
          on: {
            RECOVERY_SUCCESS: { target: 'element-selection', actions: ['handleRecoverySuccess'] },
            RECOVERY_FAILED: { target: 'initializing', actions: ['handleRecoveryFailure'] },
            RETRY: { actions: ['retryOperation'] }
          }
        },
        
        'debug-mode': {
          on: {
            DEBUG_COMPLETE: { target: 'hierarchy-analysis', actions: ['disableDebugMode'] },
            ERROR: { target: 'error-recovery', actions: ['handleDebugError'] }
          }
        },
        
        'completed': {
          type: 'final',
          on: {
            RESET: { target: 'initializing', actions: ['resetComponent'] }
          }
        }
      },
      
      // Guards
      guards: {
        hasValidHierarchy: (context) => {
          return context.model.htmlHierarchy && context.model.mainElements.length > 0;
        },
        
        hasValidSelection: (context) => {
          return context.model.selection && context.model.activeSelectorColorPanels.length > 0;
        },
        
        canBuildSelector: (context) => {
          return context.model.selectedElements.size > 0 || context.model.selector;
        },
        
        isRecoverable: (context) => {
          return context.model.error && context.model.error.recoverable !== false;
        }
      },
      
      // Actions
      actions: {
        initializeHierarchy: async (context, event) => {
          await context.log('Initializing DOM hierarchy analysis');
          
          try {
            // Initialize the HTML hierarchy
            context.model.htmlHierarchy = event.document || document;
            
            // Get main elements
            const allElements = Array.from(context.model.htmlHierarchy.querySelectorAll("body *"));
            context.model.mainElements = allElements.filter(el => isMainElement(el));
            
            context.model.error = null;
            
          } catch (error) {
            await context.log('Error initializing hierarchy:', error);
            context.model.error = {
              message: 'Failed to initialize hierarchy',
              details: error.message,
              recoverable: true
            };
          }
        },
        
        completeAnalysis: async (context, event) => {
          await context.log('Completing hierarchy analysis');
          
          try {
            // Process the analysis results
            context.model.hierarchyDepth = event.depth || 0;
            context.model.colorScheme = event.colorScheme || 'default';
            context.model.panelSize = event.panelSize || 'medium';
            
            // Set up initial element selection
            context.model.selectedElements = new Set();
            context.model.excludedElements = new Set();
            
          } catch (error) {
            await context.log('Error completing analysis:', error);
            context.model.error = {
              message: 'Failed to complete analysis',
              details: error.message,
              recoverable: true
            };
          }
        },
        
        processElementSelection: async (context, event) => {
          await context.log('Processing element selection');
          
          try {
            const { elements, action } = event;
            
            if (action === 'add') {
              elements.forEach(el => context.model.selectedElements.add(el));
            } else if (action === 'remove') {
              elements.forEach(el => context.model.selectedElements.delete(el));
            } else if (action === 'exclude') {
              elements.forEach(el => context.model.excludedElements.add(el));
            }
            
            // Update selector based on selections
            await updateSelectorFromSelections(context);
            
          } catch (error) {
            await context.log('Error processing element selection:', error);
            context.model.error = {
              message: 'Failed to process element selection',
              details: error.message,
              recoverable: true
            };
          }
        },
        
        startSelectorBuilding: async (context) => {
          await context.log('Starting selector building process');
          
          try {
            // Build selector from selected elements
            const selectorParts = Array.from(context.model.selectedElements).map(el => {
              return generateSelector(el);
            }).filter(Boolean);
            
            context.model.selector = selectorParts.join(', ');
            
            // Validate the built selector
            if (context.model.selector) {
              await validateSelector(context, context.model.selector);
            }
            
          } catch (error) {
            await context.log('Error building selector:', error);
            context.model.error = {
              message: 'Failed to build selector',
              details: error.message,
              recoverable: true
            };
          }
        },
        
        startValidation: async (context) => {
          await context.log('Starting selector validation');
          
          try {
            const isValid = await validateSelector(context, context.model.selector);
            
            if (isValid) {
              context.model.error = null;
            } else {
              context.model.error = {
                message: 'Selector validation failed',
                details: 'The generated selector is not valid',
                recoverable: true
              };
            }
            
          } catch (error) {
            await context.log('Error during validation:', error);
            context.model.error = {
              message: 'Validation error',
              details: error.message,
              recoverable: true
            };
          }
        },
        
        completeValidation: async (context) => {
          await context.log('Completing validation');
          
          try {
            // Validation passed, prepare for confirmation
            context.model.error = null;
            
            // Create final panels for confirmation
            await createConfirmationPanels(context);
            
          } catch (error) {
            await context.log('Error completing validation:', error);
            context.model.error = {
              message: 'Failed to complete validation',
              details: error.message,
              recoverable: true
            };
          }
        },
        
        confirmSelector: async (context) => {
          await context.log('Confirming selector');
          
          try {
            context.model.confirmed = true;
            
            // Notify parent component
            if (context.model.onConfirmSelector) {
              context.model.onConfirmSelector(context.model.selector);
            }
            
            // Clean up resources
            await cleanupResources(context);
            
          } catch (error) {
            await context.log('Error confirming selector:', error);
            context.model.error = {
              message: 'Failed to confirm selector',
              details: error.message,
              recoverable: false
            };
          }
        },
        
        startHierarchyExploration: async (context) => {
          await context.log('Starting hierarchy exploration');
          
          try {
            // Increase exploration depth
            context.model.hierarchyDepth++;
            
            // Get elements at current depth
            const depthElements = getElementsAtDepth(context.model.htmlHierarchy, context.model.hierarchyDepth);
            
            // Update main elements
            context.model.mainElements = depthElements;
            
          } catch (error) {
            await context.log('Error exploring hierarchy:', error);
            context.model.error = {
              message: 'Failed to explore hierarchy',
              details: error.message,
              recoverable: true
            };
          }
        },
        
        finalizePanels: async (context) => {
          await context.log('Finalizing color panels');
          
          try {
            // Create color panels for selected elements
            context.model.activeSelectorColorPanels = await createColorPanels(
              context.model.selectedElements,
              context.model.colorScheme
            );
            
            // Create dimmed panels for excluded elements
            context.model.dimmedPanels = await createDimmedPanels(
              context.model.excludedElements,
              context.model.colorScheme
            );
            
          } catch (error) {
            await context.log('Error finalizing panels:', error);
            context.model.error = {
              message: 'Failed to finalize panels',
              details: error.message,
              recoverable: true
            };
          }
        },
        
        handleRecoverySuccess: async (context) => {
          await context.log('Recovery successful');
          
          try {
            context.model.error = null;
            
            // Retry the failed operation
            await retryFailedOperation(context);
            
          } catch (error) {
            await context.log('Error during recovery:', error);
            context.model.error = {
              message: 'Recovery failed',
              details: error.message,
              recoverable: false
            };
          }
        },
        
        retryOperation: async (context) => {
          await context.log('Retrying operation');
          
          try {
            context.model.error = null;
            context.model.refreshKey++;
            
            // Retry the current operation
            await retryCurrentOperation(context);
            
          } catch (error) {
            await context.log('Error during retry:', error);
            context.model.error = {
              message: 'Retry failed',
              details: error.message,
              recoverable: false
            };
          }
        },
        
        resetComponent: async (context) => {
          await context.log('Resetting component');
          
          try {
            // Reset all state
            context.model.selector = '';
            context.model.latestSelector = null;
            context.model.activeSelectorColorPanels = [];
            context.model.dimmedPanels = [];
            context.model.confirmed = false;
            context.model.refreshKey = 0;
            context.model.error = null;
            context.model.selectedElements.clear();
            context.model.excludedElements.clear();
            context.model.hierarchyDepth = 0;
            
            // Reset to initial state
            context.model.currentView = 'initializing';
            
          } catch (error) {
            await context.log('Error resetting component:', error);
            context.model.error = {
              message: 'Failed to reset component',
              details: error.message,
              recoverable: false
            };
          }
        }
      }
    });
  }
};

// Helper functions for rendering views
function renderInitializingView(context) {
  return `
    <div class="selector-hierarchy-initializing">
      <div class="initialization-header">
        <h3>🔍 Initializing Selector Hierarchy</h3>
        <div class="spinner"></div>
      </div>
      
      <div class="initialization-content">
        <p>Analyzing DOM structure...</p>
        <p>Preparing element selection interface...</p>
        <p>Setting up color schemes and panels...</p>
      </div>
      
      <div class="initialization-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: 25%"></div>
        </div>
        <span class="progress-text">25% Complete</span>
      </div>
    </div>
  `;
}

function renderHierarchyAnalysisView(context) {
  return `
    <div class="selector-hierarchy-analysis">
      <div class="analysis-header">
        <h3>📊 Hierarchy Analysis</h3>
        <div class="analysis-stats">
          <span class="stat">Elements: ${context.model.mainElements.length}</span>
          <span class="stat">Depth: ${context.model.hierarchyDepth}</span>
          <span class="stat">Color Scheme: ${context.model.colorScheme}</span>
        </div>
      </div>
      
      <div class="analysis-content">
        <div class="hierarchy-tree">
          <h4>DOM Structure Overview</h4>
          <div class="tree-container">
            ${renderHierarchyTree(context.model.htmlHierarchy, context.model.hierarchyDepth)}
          </div>
        </div>
        
        <div class="analysis-actions">
          <button class="btn btn-primary" onclick="startElementSelection()">
            🎯 Start Element Selection
          </button>
          <button class="btn btn-secondary" onclick="exploreHierarchy()">
            🔍 Explore Deeper
          </button>
          <button class="btn btn-secondary" onclick="enableDebugMode()">
            🐛 Debug Mode
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderElementSelectionView(context) {
  return `
    <div class="selector-hierarchy-selection">
      <div class="selection-header">
        <h3>🎯 Element Selection Mode</h3>
        <div class="selection-stats">
          <span class="stat">Selected: ${context.model.selectedElements.size}</span>
          <span class="stat">Excluded: ${context.model.excludedElements.size}</span>
          <span class="stat">Total: ${context.model.mainElements.length}</span>
        </div>
      </div>
      
      <div class="selection-content">
        <div class="selection-instructions">
          <h4>Selection Instructions</h4>
          <ul>
            <li>Click on elements to select them</li>
            <li>Right-click to exclude elements</li>
            <li>Use Ctrl+Click for multiple selection</li>
            <li>Press Space to preview selector</li>
          </ul>
        </div>
        
        <div class="element-grid">
          ${renderElementGrid(context.model.mainElements, context.model.selectedElements, context.model.excludedElements)}
        </div>
        
        <div class="selection-actions">
          <button class="btn btn-primary" onclick="buildSelector()">
            🔨 Build Selector
          </button>
          <button class="btn btn-secondary" onclick="exploreHierarchy()">
            🔍 Explore Hierarchy
          </button>
          <button class="btn btn-secondary" onclick="clearSelection()">
            🗑️ Clear Selection
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderPanelCreationView(context) {
  return `
    <div class="selector-hierarchy-panels">
      <div class="panel-header">
        <h3>🎨 Creating Color Panels</h3>
        <div class="panel-stats">
          <span class="stat">Panels: ${context.model.activeSelectorColorPanels.length}</span>
          <span class="stat">Size: ${context.model.panelSize}</span>
          <span class="stat">Scheme: ${context.model.colorScheme}</span>
        </div>
      </div>
      
      <div class="panel-content">
        <div class="panel-preview">
          <h4>Panel Preview</h4>
          <div class="preview-container">
            ${renderPanelPreview(context.model.activeSelectorColorPanels)}
          </div>
        </div>
        
        <div class="panel-actions">
          <button class="btn btn-primary" onclick="finalizePanels()">
            ✅ Finalize Panels
          </button>
          <button class="btn btn-secondary" onclick="modifyPanels()">
            ✏️ Modify Panels
          </button>
          <button class="btn btn-secondary" onclick="validateSelector()">
            🔍 Validate Selector
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderSelectorBuildingView(context) {
  return `
    <div class="selector-hierarchy-building">
      <div class="building-header">
        <h3>🔨 Building CSS Selector</h3>
        <div class="selector-preview">
          <code class="selector-code">${context.model.selector || 'No selector yet'}</code>
        </div>
      </div>
      
      <div class="building-content">
        <div class="selector-options">
          <h4>Selector Options</h4>
          <div class="option-group">
            <label>
              <input type="checkbox" ${context.model.autoConfirm ? 'checked' : ''} onchange="toggleAutoConfirm()">
              Auto-confirm when valid
            </label>
          </div>
          <div class="option-group">
            <label>
              <input type="checkbox" ${context.model.showDebugInfo ? 'checked' : ''} onchange="toggleDebugInfo()">
              Show debug information
            </label>
          </div>
        </div>
        
        <div class="selector-editor">
          <h4>Manual Selector Editor</h4>
          <textarea 
            class="selector-textarea" 
            value="${context.model.selector}" 
            onchange="updateSelector(this.value)"
            placeholder="Enter CSS selector manually..."
          ></textarea>
        </div>
        
        <div class="building-actions">
          <button class="btn btn-primary" onclick="validateSelector()">
            🔍 Validate Selector
          </button>
          <button class="btn btn-secondary" onclick="testSelector()">
            🧪 Test Selector
          </button>
          <button class="btn btn-secondary" onclick="resetSelector()">
            🔄 Reset Selector
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderValidationView(context) {
  return `
    <div class="selector-hierarchy-validation">
      <div class="validation-header">
        <h3>🔍 Validating Selector</h3>
        <div class="validation-status">
          <span class="status-indicator validating">⏳ Validating...</span>
        </div>
      </div>
      
      <div class="validation-content">
        <div class="validation-results">
          <h4>Validation Results</h4>
          <div class="result-item">
            <span class="result-label">Syntax:</span>
            <span class="result-value">Checking...</span>
          </div>
          <div class="result-item">
            <span class="result-label">Elements Found:</span>
            <span class="result-value">Counting...</span>
          </div>
          <div class="result-item">
            <span class="result-label">Performance:</span>
            <span class="result-value">Measuring...</span>
          </div>
        </div>
        
        <div class="validation-actions">
          <button class="btn btn-primary" onclick="completeValidation()">
            ✅ Complete Validation
          </button>
          <button class="btn btn-secondary" onclick="fixValidationIssues()">
            🔧 Fix Issues
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderConfirmationView(context) {
  return `
    <div class="selector-hierarchy-confirmation">
      <div class="confirmation-header">
        <h3>✅ Selector Ready for Confirmation</h3>
        <div class="final-selector">
          <code class="selector-code">${context.model.selector}</code>
        </div>
      </div>
      
      <div class="confirmation-content">
        <div class="selector-summary">
          <h4>Selector Summary</h4>
          <div class="summary-item">
            <span class="summary-label">Elements Selected:</span>
            <span class="summary-value">${context.model.selectedElements.size}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Elements Excluded:</span>
            <span class="summary-value">${context.model.excludedElements.size}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Selector Length:</span>
            <span class="summary-value">${context.model.selector.length} characters</span>
          </div>
        </div>
        
        <div class="confirmation-actions">
          <button class="btn btn-primary" onclick="confirmSelector()">
            ✅ Confirm Selector
          </button>
          <button class="btn btn-secondary" onclick="modifySelection()">
            ✏️ Modify Selection
          </button>
          <button class="btn btn-secondary" onclick="rejectSelector()">
            ❌ Reject Selector
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderHierarchyExplorationView(context) {
  return `
    <div class="selector-hierarchy-exploration">
      <div class="exploration-header">
        <h3>🔍 Exploring Hierarchy</h3>
        <div class="exploration-stats">
          <span class="stat">Current Depth: ${context.model.hierarchyDepth}</span>
          <span class="stat">Elements at Depth: ${context.model.mainElements.length}</span>
        </div>
      </div>
      
      <div class="exploration-content">
        <div class="depth-navigation">
          <h4>Depth Navigation</h4>
          <div class="depth-controls">
            <button class="btn btn-secondary" onclick="decreaseDepth()">
              ⬆️ Surface Level
            </button>
            <button class="btn btn-secondary" onclick="increaseDepth()">
              ⬇️ Deep Dive
            </button>
          </div>
        </div>
        
        <div class="depth-elements">
          <h4>Elements at Current Depth</h4>
          <div class="element-list">
            ${renderDepthElements(context.model.mainElements, context.model.hierarchyDepth)}
          </div>
        </div>
        
        <div class="exploration-actions">
          <button class="btn btn-primary" onclick="completeExploration()">
            ✅ Complete Exploration
          </button>
          <button class="btn btn-secondary" onclick="continueExploration()">
            🔍 Continue Exploring
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderPanelManagementView(context) {
  return `
    <div class="selector-hierarchy-panel-management">
      <div class="management-header">
        <h3>🎨 Panel Management</h3>
        <div class="management-stats">
          <span class="stat">Active Panels: ${context.model.activeSelectorColorPanels.length}</span>
          <span class="stat">Dimmed Panels: ${context.model.dimmedPanels.length}</span>
        </div>
      </div>
      
      <div class="management-content">
        <div class="panel-overview">
          <h4>Panel Overview</h4>
          <div class="panel-grid">
            ${renderPanelGrid(context.model.activeSelectorColorPanels, context.model.dimmedPanels)}
          </div>
        </div>
        
        <div class="management-actions">
          <button class="btn btn-primary" onclick="finalizePanelManagement()">
            ✅ Finalize Panels
          </button>
          <button class="btn btn-secondary" onclick="modifyPanels()">
            ✏️ Modify Panels
          </button>
          <button class="btn btn-secondary" onclick="reorderPanels()">
            🔄 Reorder Panels
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderErrorRecoveryView(context) {
  return `
    <div class="selector-hierarchy-error-recovery">
      <div class="recovery-header">
        <h3>⚠️ Error Recovery</h3>
        <div class="error-details">
          <span class="error-message">${context.model.error?.message || 'Unknown error'}</span>
        </div>
      </div>
      
      <div class="recovery-content">
        <div class="error-analysis">
          <h4>Error Analysis</h4>
          <div class="error-info">
            <p><strong>Error:</strong> ${context.model.error?.message || 'Unknown'}</p>
            <p><strong>Details:</strong> ${context.model.error?.details || 'No details available'}</p>
            <p><strong>Recoverable:</strong> ${context.model.error?.recoverable ? 'Yes' : 'No'}</p>
          </div>
        </div>
        
        <div class="recovery-options">
          <h4>Recovery Options</h4>
          <div class="option-list">
            ${context.model.error?.recoverable ? `
              <button class="btn btn-primary" onclick="retryOperation()">
                🔄 Retry Operation
              </button>
              <button class="btn btn-secondary" onclick="useFallback()">
                🛟 Use Fallback
              </button>
            ` : `
              <p class="unrecoverable">This error cannot be automatically recovered.</p>
            `}
            <button class="btn btn-secondary" onclick="resetComponent()">
              🔄 Reset Component
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderDebugModeView(context) {
  return `
    <div class="selector-hierarchy-debug">
      <div class="debug-header">
        <h3>🐛 Debug Mode</h3>
        <div class="debug-controls">
          <button class="btn btn-secondary" onclick="disableDebugMode()">
            ❌ Exit Debug Mode
          </button>
        </div>
      </div>
      
      <div class="debug-content">
        <div class="debug-info">
          <h4>Debug Information</h4>
          <div class="debug-details">
            <pre class="debug-json">${JSON.stringify({
              selector: context.model.selector,
              selectedElements: context.model.selectedElements.size,
              excludedElements: context.model.excludedElements.size,
              hierarchyDepth: context.model.hierarchyDepth,
              mainElements: context.model.mainElements.length,
              error: context.model.error
            }, null, 2)}</pre>
          </div>
        </div>
        
        <div class="debug-actions">
          <button class="btn btn-secondary" onclick="exportDebugData()">
            📤 Export Debug Data
          </button>
          <button class="btn btn-secondary" onclick="testSelector()">
            🧪 Test Selector
          </button>
          <button class="btn btn-secondary" onclick="validateHierarchy()">
            🔍 Validate Hierarchy
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderCompletedView(context) {
  return `
    <div class="selector-hierarchy-completed">
      <div class="completed-header">
        <h3>🎉 Selector Hierarchy Completed</h3>
        <div class="final-result">
          <span class="result-label">Final Selector:</span>
          <code class="selector-code">${context.model.selector}</code>
        </span>
      </div>
      
      <div class="completed-content">
        <div class="completion-summary">
          <h4>Completion Summary</h4>
          <div class="summary-item">
            <span class="summary-label">Elements Selected:</span>
            <span class="summary-value">${context.model.selectedElements.size}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Elements Excluded:</span>
            <span class="summary-value">${context.model.excludedElements.size}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Hierarchy Depth Explored:</span>
            <span class="summary-value">${context.model.hierarchyDepth}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Panels Created:</span>
            <span class="summary-value">${context.model.activeSelectorColorPanels.length}</span>
          </div>
        </div>
        
        <div class="completion-actions">
          <button class="btn btn-primary" onclick="resetComponent()">
            🔄 Start New Selection
          </button>
          <button class="btn btn-secondary" onclick="exportResults()">
            📤 Export Results
          </button>
        </div>
      </div>
    </div>
  `;
}

// Helper functions for rendering components
function renderHierarchyTree(htmlHierarchy, depth) {
  // This would render a tree structure of the DOM hierarchy
  return `<div class="hierarchy-tree-placeholder">DOM Tree at depth ${depth}</div>`;
}

function renderElementGrid(elements, selected, excluded) {
  // This would render a grid of selectable elements
  return elements.map(el => `
    <div class="element-item ${selected.has(el) ? 'selected' : ''} ${excluded.has(el) ? 'excluded' : ''}">
      ${el.tagName.toLowerCase()}
    </div>
  `).join('');
}

function renderPanelPreview(panels) {
  // This would render a preview of the color panels
  return panels.map(panel => `
    <div class="panel-preview-item" style="background-color: ${panel.color}">
      ${panel.element.tagName.toLowerCase()}
    </div>
  `).join('');
}

function renderPanelGrid(activePanels, dimmedPanels) {
  // This would render the grid of panels
  return `
    <div class="active-panels">
      ${activePanels.map(panel => `
        <div class="panel-item active" style="background-color: ${panel.color}">
          ${panel.element.tagName.toLowerCase()}
        </div>
      `).join('')}
    </div>
    <div class="dimmed-panels">
      ${dimmedPanels.map(panel => `
        <div class="panel-item dimmed" style="background-color: ${panel.color}">
          ${panel.element.tagName.toLowerCase()}
        </div>
      `).join('')}
    </div>
  `;
}

function renderDepthElements(elements, depth) {
  // This would render elements at a specific depth
  return elements.map(el => `
    <div class="depth-element-item">
      ${el.tagName.toLowerCase()} (Depth: ${depth})
    </div>
  `).join('');
}

// Utility functions
function isMainElement(el) {
  // Simplified version of the main element detection logic
  if (!el.offsetParent) return false;
  const rect = el.getBoundingClientRect();
  return rect.width >= 20 && rect.height >= 10;
}

function generateSelector(element) {
  // Simplified selector generation
  return element.tagName.toLowerCase() + (element.id ? '#' + element.id : '') + (element.className ? '.' + element.className.split(' ').join('.') : '');
}

function getElementsAtDepth(htmlHierarchy, depth) {
  // Get elements at a specific depth in the hierarchy
  const elements = [];
  const walker = document.createTreeWalker(
    htmlHierarchy.body,
    NodeFilter.SHOW_ELEMENT,
    null,
    false
  );
  
  let currentDepth = 0;
  let node = walker.nextNode();
  
  while (node) {
    if (currentDepth === depth) {
      elements.push(node);
    }
    node = walker.nextNode();
  }
  
  return elements;
}

async function createColorPanels(elements, colorScheme) {
  // Create color panels for selected elements
  return Array.from(elements).map((el, index) => ({
    element: el,
    color: generateColor(index, colorScheme)
  }));
}

async function createDimmedPanels(elements, colorScheme) {
  // Create dimmed panels for excluded elements
  return Array.from(elements).map((el, index) => ({
    element: el,
    color: generateDimmedColor(index, colorScheme)
  }));
}

function generateColor(index, scheme) {
  // Generate colors based on scheme
  const colors = {
    default: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
    warm: ['#ff6b6b', '#ff8e53', '#ffc75f', '#f9f871', '#ff6b9d'],
    cool: ['#4ecdc4', '#45b7d1', '#96ceb4', '#dda0dd', '#98d8c8']
  };
  
  return colors[scheme]?.[index % colors[scheme].length] || colors.default[index % colors.default.length];
}

function generateDimmedColor(index, scheme) {
  // Generate dimmed colors
  const baseColor = generateColor(index, scheme);
  return baseColor + '40'; // Add transparency
}

async function updateSelectorFromSelections(context) {
  // Update selector based on selected elements
  const selectorParts = Array.from(context.model.selectedElements).map(el => generateSelector(el));
  context.model.selector = selectorParts.join(', ');
}

async function validateSelector(context, selector) {
  // Validate the CSS selector
  try {
    const elements = context.model.htmlHierarchy.querySelectorAll(selector);
    return elements.length > 0;
  } catch (error) {
    return false;
  }
}

async function createConfirmationPanels(context) {
  // Create panels for confirmation view
  await finalizePanels(context);
}

async function cleanupResources(context) {
  // Clean up resources
  context.model.activeSelectorColorPanels = [];
  context.model.dimmedPanels = [];
}

async function retryFailedOperation(context) {
  // Retry the failed operation
  // Implementation depends on the specific operation that failed
}

async function retryCurrentOperation(context) {
  // Retry the current operation
  // Implementation depends on the current state
}

// Export the template
export { SelectorHierarchyComponentTemplate };
