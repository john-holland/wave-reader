/**
 * Wave Reader Component Template
 * 
 * A template for a wave reader component that can be edited by the generic editor system.
 * Includes routing support for wave reader operations and state management.
 */

import { createViewStateMachine } from '../../../../../../log-view-machine/src/core/ViewStateMachine.tsx';

const WaveReaderComponentTemplate = {
  id: 'wave-reader-component',
  name: 'Wave Reader Component',
  description: 'Interactive wave reader with selector management and wave animation with routing support',
  version: '1.0.0',
  dependencies: ['log-view-machine'],
  
  // Template configuration
  config: {
    machineId: 'wave-reader-component',
    xstateConfig: {
      id: 'wave-reader-component',
      initial: 'idle',
      context: {
        selector: 'p',
        selectors: ['p', 'h1', 'h2', 'h3', '.content', '.article'],
        going: false,
        options: {
          showNotifications: true,
          waveSpeed: 1000,
          waveColor: '#667eea',
          waveOpacity: 0.8
        },
        traceId: null,
        currentDomain: '',
        currentPath: '',
        settings: {}
      }
    }
  },

  // Create the template instance
  create: (config = {}) => {
    return createViewStateMachine({
      machineId: 'wave-reader-component',
      xstateConfig: {
        ...WaveReaderComponentTemplate.config.xstateConfig,
        ...config.xstateConfig
      },
      logStates: {
        idle: async (context) => {
          await context.log('Displaying idle state');
          
          return context.view(`
            <div class="wave-reader-idle">
              <div class="idle-header">
                <h2>🌊 Wave Reader</h2>
                <p>Ready to start reading</p>
              </div>
              
              <div class="selector-input-section">
                <h3>CSS Selector</h3>
                <input type="text" class="selector-input" id="selector" 
                       placeholder="Enter CSS selector (e.g., p, h1, .content)" 
                       value="${context.model.selector}">
                
                <div class="control-buttons">
                  <button class="btn btn-primary" onclick="startWaveReader()">
                    🚀 Start Reading
                  </button>
                  <button class="btn btn-secondary" onclick="addSelector()">
                    ➕ Add Selector
                  </button>
                </div>
              </div>
              
              <div class="selectors-list">
                <h4>Saved Selectors:</h4>
                ${context.model.selectors.length === 0 ? '<p>No selectors saved yet</p>' : 
                  context.model.selectors.map(selector => `
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
        
        'waving': async (context) => {
          await context.log('Displaying waving state');
          
          return context.view(`
            <div class="wave-reader-waving">
              <div class="waving-header">
                <h2>🌊 Wave Reader Active</h2>
                <p>Currently reading: ${context.model.selector}</p>
              </div>
              
              <div class="wave-animation">
                <div class="wave-indicator">
                  <div class="wave-dot active"></div>
                  <div class="wave-dot"></div>
                  <div class="wave-dot"></div>
                  <div class="wave-dot"></div>
                  <div class="wave-dot"></div>
                </div>
                <p class="wave-status">Reading in progress...</p>
              </div>
              
              <div class="control-buttons">
                <button class="btn btn-success" onclick="stopWaveReader()">
                  ⏹️ Stop Reading
                </button>
                <button class="btn btn-secondary" onclick="pauseWaveReader()">
                  ⏸️ Pause
                </button>
              </div>
              
              <div class="current-settings">
                <h4>Current Settings:</h4>
                <p><strong>Selector:</strong> ${context.model.selector}</p>
                <p><strong>Speed:</strong> ${context.model.options.waveSpeed}ms</p>
                <p><strong>Color:</strong> <span class="color-preview" style="background-color: ${context.model.options.waveColor}"></span> ${context.model.options.waveColor}</p>
              </div>
            </div>
          `);
        },
        
        'settings': async (context) => {
          await context.log('Displaying settings view');
          
          return context.view(`
            <div class="wave-reader-settings">
              <h2>⚙️ Settings</h2>
              
              <div class="settings-section">
                <h3>Wave Animation</h3>
                <div class="setting-group">
                  <label for="wave-speed">Wave Speed (ms):</label>
                  <input type="range" id="wave-speed" min="500" max="3000" step="100" 
                         value="${context.model.options.waveSpeed}" onchange="updateWaveSpeed(this.value)">
                  <span class="value-display">${context.model.options.waveSpeed}ms</span>
                </div>
                
                <div class="setting-group">
                  <label for="wave-color">Wave Color:</label>
                  <input type="color" id="wave-color" value="${context.model.options.waveColor}" 
                         onchange="updateWaveColor(this.value)">
                </div>
                
                <div class="setting-group">
                  <label for="wave-opacity">Wave Opacity:</label>
                  <input type="range" id="wave-opacity" min="0.1" max="1.0" step="0.1" 
                         value="${context.model.options.waveOpacity}" onchange="updateWaveOpacity(this.value)">
                  <span class="value-display">${context.model.options.waveOpacity}</span>
                </div>
              </div>
              
              <div class="settings-section">
                <h3>Notifications</h3>
                <div class="setting-group">
                  <label>
                    <input type="checkbox" id="show-notifications" 
                           ${context.model.options.showNotifications ? 'checked' : ''} 
                           onchange="updateShowNotifications(this.checked)">
                    Show Notifications
                  </label>
                </div>
              </div>
              
              <div class="settings-section">
                <h3>Domain & Path</h3>
                <p><strong>Current Domain:</strong> ${context.model.currentDomain || 'Not set'}</p>
                <p><strong>Current Path:</strong> ${context.model.currentPath || 'Not set'}</p>
              </div>
              
              <div class="settings-actions">
                <button class="btn btn-primary" onclick="saveSettings()">
                  💾 Save Settings
                </button>
                <button class="btn btn-secondary" onclick="resetToDefaults()">
                  🔄 Reset to Defaults
                </button>
                <button class="btn btn-secondary" onclick="goBackToMain()">
                  ← Back to Main
                </button>
              </div>
            </div>
          `);
        },
        
        'selector-selection': async (context) => {
          await context.log('Displaying selector selection mode');
          
          return context.view(`
            <div class="wave-reader-selector-selection">
              <div class="selection-header">
                <h2>🎯 Selector Selection Mode</h2>
                <p>Click on an element to select it</p>
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
              
              <div class="current-selection">
                <h4>Current Selection:</h4>
                <p id="selected-element">No element selected yet</p>
                <p id="selected-selector">Selector: None</p>
              </div>
            </div>
          `);
        },
        
        'error': async (context) => {
          await context.log('Displaying error state');
          
          return context.view(`
            <div class="wave-reader-error">
              <div class="error-header">
                <h2>❌ Error Occurred</h2>
                <p>Something went wrong with the wave reader</p>
              </div>
              
              <div class="error-details">
                <p><strong>Error Type:</strong> ${context.model.errorType || 'Unknown'}</p>
                <p><strong>Error Message:</strong> ${context.model.errorMessage || 'No error message available'}</p>
                <p><strong>Trace ID:</strong> ${context.model.traceId || 'N/A'}</p>
              </div>
              
              <div class="error-actions">
                <button class="btn btn-primary" onclick="retryOperation()">
                  🔄 Retry
                </button>
                <button class="btn btn-secondary" onclick="goBackToMain()">
                  ← Back to Main
                </button>
                <button class="btn btn-danger" onclick="reportError()">
                  📧 Report Error
                </button>
              </div>
            </div>
          `);
        }
      }
    });
  }
};

export { WaveReaderComponentTemplate };
