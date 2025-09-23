/**
 * Settings Component Template
 * 
 * A template for a comprehensive settings management component with state machine
 * and separate views for different settings categories.
 */

import { createViewStateMachine } from 'log-view-machine';

const SettingsComponentTemplate = {
  id: 'settings-component',
  name: 'Settings Component',
  description: 'Comprehensive settings management with wave animation controls and domain configuration',
  version: '1.0.0',
  dependencies: ['log-view-machine'],
  
  // Template configuration
  config: {
    machineId: 'settings-component',
    xstateConfig: {
      id: 'settings-component',
      initial: 'general',
      context: {
        currentView: 'general',
        settings: {},
        domainPaths: [],
        currentDomain: '',
        currentPath: '',
        editingDomain: '',
        saved: true,
        autoGenerateCss: true,
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
        mouseFollowInterval: 50
      }
    }
  },

  // Create the template instance
  create: (config = {}) => {
    return createViewStateMachine({
      machineId: 'settings-component',
      xstateConfig: {
        ...SettingsComponentTemplate.config.xstateConfig,
        ...config.xstateConfig
      },
      logStates: {
        general: async (context) => {
          await context.log('Displaying general settings view');
          return context.view(renderGeneralSettingsView(context));
        },
        
        wave: async (context) => {
          await context.log('Displaying wave animation settings view');
          return context.view(renderWaveSettingsView(context));
        },
        
        css: async (context) => {
          await context.log('Displaying CSS template settings view');
          return context.view(renderCssSettingsView(context));
        },
        
        domain: async (context) => {
          await context.log('Displaying domain and path settings view');
          return context.view(renderDomainSettingsView(context));
        },
        
        keyboard: async (context) => {
          await context.log('Displaying keyboard shortcut settings view');
          return context.view(renderKeyboardSettingsView(context));
        },
        
        advanced: async (context) => {
          await context.log('Displaying advanced settings view');
          return context.view(renderAdvancedSettingsView(context));
        },
        
        saving: async (context) => {
          await context.log('Displaying save settings view');
          return context.view(renderSaveSettingsView(context));
        },
        
        loading: async (context) => {
          await context.log('Displaying loading settings view');
          return context.view(renderLoadingSettingsView(context));
        },
        
        error: async (context) => {
          await context.log('Displaying error view');
          return context.view(renderErrorView(context));
        }
      },
      
      // State machine configuration
      states: {
        general: {
          on: {
            SWITCH_TO_WAVE: { target: 'wave', actions: ['switchToWave'] },
            SWITCH_TO_CSS: { target: 'css', actions: ['switchToCss'] },
            SWITCH_TO_DOMAIN: { target: 'domain', actions: ['switchToDomain'] },
            SWITCH_TO_KEYBOARD: { target: 'keyboard', actions: ['switchToKeyboard'] },
            SWITCH_TO_ADVANCED: { target: 'advanced', actions: ['switchToAdvanced'] },
            SAVE_SETTINGS: { target: 'saving', actions: ['prepareSave'] },
            RESET_SETTINGS: { actions: ['resetSettings'] }
          }
        },
        
        wave: {
          on: {
            SWITCH_TO_GENERAL: { target: 'general', actions: ['switchToGeneral'] },
            SWITCH_TO_CSS: { target: 'css', actions: ['switchToCss'] },
            SWITCH_TO_DOMAIN: { target: 'domain', actions: ['switchToDomain'] },
            SWITCH_TO_KEYBOARD: { target: 'keyboard', actions: ['switchToKeyboard'] },
            SWITCH_TO_ADVANCED: { target: 'advanced', actions: ['switchToAdvanced'] },
            UPDATE_WAVE_SETTINGS: { actions: ['updateWaveSettings'] },
            SAVE_SETTINGS: { target: 'saving', actions: ['prepareSave'] }
          }
        },
        
        css: {
          on: {
            SWITCH_TO_GENERAL: { target: 'general', actions: ['switchToGeneral'] },
            SWITCH_TO_WAVE: { target: 'wave', actions: ['switchToWave'] },
            SWITCH_TO_DOMAIN: { target: 'domain', actions: ['switchToDomain'] },
            SWITCH_TO_KEYBOARD: { target: 'keyboard', actions: ['switchToKeyboard'] },
            SWITCH_TO_ADVANCED: { target: 'advanced', actions: ['switchToAdvanced'] },
            UPDATE_CSS_SETTINGS: { actions: ['updateCssSettings'] },
            TOGGLE_AUTO_GENERATE: { actions: ['toggleAutoGenerate'] },
            SAVE_SETTINGS: { target: 'saving', actions: ['prepareSave'] }
          }
        },
        
        domain: {
          on: {
            SWITCH_TO_GENERAL: { target: 'general', actions: ['switchToGeneral'] },
            SWITCH_TO_WAVE: { target: 'wave', actions: ['switchToWave'] },
            SWITCH_TO_CSS: { target: 'css', actions: ['switchToCss'] },
            SWITCH_TO_KEYBOARD: { target: 'keyboard', actions: ['switchToKeyboard'] },
            SWITCH_TO_ADVANCED: { target: 'advanced', actions: ['switchToAdvanced'] },
            UPDATE_DOMAIN_SETTINGS: { actions: ['updateDomainSettings'] },
            SAVE_SETTINGS: { target: 'saving', actions: ['prepareSave'] }
          }
        },
        
        keyboard: {
          on: {
            SWITCH_TO_GENERAL: { target: 'general', actions: ['switchToGeneral'] },
            SWITCH_TO_WAVE: { target: 'wave', actions: ['switchToWave'] },
            SWITCH_TO_CSS: { target: 'css', actions: ['switchToCss'] },
            SWITCH_TO_DOMAIN: { target: 'domain', actions: ['switchToDomain'] },
            SWITCH_TO_ADVANCED: { target: 'advanced', actions: ['switchToAdvanced'] },
            UPDATE_KEYBOARD_SETTINGS: { actions: ['updateKeyboardSettings'] },
            SAVE_SETTINGS: { target: 'saving', actions: ['prepareSave'] }
          }
        },
        
        advanced: {
          on: {
            SWITCH_TO_GENERAL: { target: 'general', actions: ['switchToGeneral'] },
            SWITCH_TO_WAVE: { target: 'wave', actions: ['switchToWave'] },
            SWITCH_TO_CSS: { target: 'css', actions: ['switchToCss'] },
            SWITCH_TO_DOMAIN: { target: 'domain', actions: ['switchToDomain'] },
            SWITCH_TO_KEYBOARD: { target: 'keyboard', actions: ['switchToKeyboard'] },
            UPDATE_ADVANCED_SETTINGS: { actions: ['updateAdvancedSettings'] },
            SAVE_SETTINGS: { target: 'saving', actions: ['prepareSave'] }
          }
        },
        
        saving: {
          on: {
            SAVE_SUCCESS: { target: 'general', actions: ['handleSaveSuccess'] },
            SAVE_FAILED: { target: 'error', actions: ['handleSaveFailed'] },
            CANCEL_SAVE: { target: 'general', actions: ['cancelSave'] }
          }
        },
        
        loading: {
          on: {
            LOAD_SUCCESS: { target: 'general', actions: ['handleLoadSuccess'] },
            LOAD_FAILED: { target: 'error', actions: ['handleLoadFailed'] }
          }
        },
        
        error: {
          on: {
            RETRY: { target: 'loading', actions: ['retryOperation'] },
            GO_TO_GENERAL: { target: 'general', actions: ['goToGeneral'] }
          }
        }
      },
      
      // Actions
      actions: {
        switchToGeneral: async (context) => {
          await context.log('Switching to general settings view');
          context.model.currentView = 'general';
        },
        
        switchToWave: async (context) => {
          await context.log('Switching to wave settings view');
          context.model.currentView = 'wave';
        },
        
        switchToCss: async (context) => {
          await context.log('Switching to CSS settings view');
          context.model.currentView = 'css';
        },
        
        switchToDomain: async (context) => {
          await context.log('Switching to domain settings view');
          context.model.currentView = 'domain';
        },
        
        switchToKeyboard: async (context) => {
          await context.log('Switching to keyboard settings view');
          context.model.currentView = 'keyboard';
        },
        
        switchToAdvanced: async (context) => {
          await context.log('Switching to advanced settings view');
          context.model.currentView = 'advanced';
        },
        
        updateWaveSettings: async (context, event) => {
          await context.log('Updating wave settings');
          const { waveSpeed, axisTranslateAmountXMax, axisTranslateAmountXMin, axisRotationAmountYMax, axisRotationAmountYMin, mouseFollowInterval } = event;
          
          if (waveSpeed !== undefined) context.model.waveSpeed = waveSpeed;
          if (axisTranslateAmountXMax !== undefined) context.model.axisTranslateAmountXMax = axisTranslateAmountXMax;
          if (axisTranslateAmountXMin !== undefined) context.model.axisTranslateAmountXMin = axisTranslateAmountXMin;
          if (axisRotationAmountYMax !== undefined) context.model.axisRotationAmountYMax = axisRotationAmountYMax;
          if (axisRotationAmountYMin !== undefined) context.model.axisRotationAmountYMin = axisRotationAmountYMin;
          if (mouseFollowInterval !== undefined) context.model.mouseFollowInterval = mouseFollowInterval;
          
          context.model.saved = false;
        },
        
        updateCssSettings: async (context, event) => {
          await context.log('Updating CSS settings');
          const { cssTemplate, cssMouseTemplate } = event;
          
          if (cssTemplate !== undefined) context.model.cssTemplate = cssTemplate;
          if (cssMouseTemplate !== undefined) context.model.cssMouseTemplate = cssMouseTemplate;
          
          context.model.saved = false;
        },
        
        toggleAutoGenerate: async (context) => {
          await context.log('Toggling auto-generate CSS');
          context.model.autoGenerateCss = !context.model.autoGenerateCss;
          context.model.saved = false;
        },
        
        updateDomainSettings: async (context, event) => {
          await context.log('Updating domain settings');
          const { domain, path } = event;
          
          if (domain !== undefined) {
            context.model.currentDomain = domain;
            context.model.editingDomain = domain;
          }
          if (path !== undefined) context.model.currentPath = path;
          
          context.model.saved = false;
        },
        
        updateKeyboardSettings: async (context, event) => {
          await context.log('Updating keyboard settings');
          const { toggleKeys } = event;
          
          if (toggleKeys !== undefined) context.model.toggleKeys = toggleKeys;
          
          context.model.saved = false;
        },
        
        updateAdvancedSettings: async (context, event) => {
          await context.log('Updating advanced settings');
          const { showNotifications, waveAnimationControl } = event;
          
          if (showNotifications !== undefined) context.model.showNotifications = showNotifications;
          if (waveAnimationControl !== undefined) context.model.waveAnimationControl = waveAnimationControl;
          
          context.model.saved = false;
        },
        
        prepareSave: async (context) => {
          await context.log('Preparing to save settings');
          // This would prepare the settings object for saving
        },
        
        handleSaveSuccess: async (context) => {
          await context.log('Settings saved successfully');
          context.model.saved = true;
          
          // Notify parent component
          if (context.model.onUpdateSettings) {
            context.model.onUpdateSettings(context.model.settings);
          }
        },
        
        handleSaveFailed: async (context, event) => {
          await context.log('Settings save failed');
          context.model.error = event.error;
        },
        
        cancelSave: async (context) => {
          await context.log('Save cancelled');
          // Return to previous view
        },
        
        handleLoadSuccess: async (context, event) => {
          await context.log('Settings loaded successfully');
          context.model.settings = event.settings;
          context.model.saved = true;
        },
        
        handleLoadFailed: async (context, event) => {
          await context.log('Settings load failed');
          context.model.error = event.error;
        },
        
        retryOperation: async (context) => {
          await context.log('Retrying operation');
          context.model.error = null;
        },
        
        goToGeneral: async (context) => {
          await context.log('Going to general settings');
          context.model.currentView = 'general';
          context.model.error = null;
        },
        
        resetSettings: async (context) => {
          await context.log('Resetting settings to defaults');
          
          // Reset to default values
          context.model.textColor = 'initial';
          context.model.textSize = 'initial';
          context.model.selector = 'p';
          context.model.waveSpeed = 2.0;
          context.model.axisTranslateAmountXMax = 10;
          context.model.axisTranslateAmountXMin = -10;
          context.model.axisRotationAmountYMax = 5;
          context.model.axisRotationAmountYMin = -5;
          context.model.mouseFollowInterval = 50;
          context.model.showNotifications = true;
          context.model.waveAnimationControl = 'CSS';
          context.model.autoGenerateCss = true;
          
          context.model.saved = false;
        }
      }
    });
  }
};

// Helper functions for rendering views
function renderGeneralSettingsView(context) {
  return `
    <div class="settings-general-view">
      <div class="settings-header">
        <h3>⚙️ General Settings</h3>
        <div class="save-indicator">
          ${context.model.saved ? '<span class="saved">✅ Saved</span>' : '<span class="unsaved">🌊 Unsaved Changes</span>'}
        </div>
      </div>
      
      <div class="settings-navigation">
        <button class="nav-btn active" onclick="switchToView('general')">General</button>
        <button class="nav-btn" onclick="switchToView('wave')">Wave Animation</button>
        <button class="nav-btn" onclick="switchToView('css')">CSS Templates</button>
        <button class="nav-btn" onclick="switchToView('domain')">Domain & Path</button>
        <button class="nav-btn" onclick="switchToView('keyboard')">Keyboard</button>
        <button class="nav-btn" onclick="switchToView('advanced')">Advanced</button>
      </div>
      
      <div class="settings-content">
        <div class="setting-group">
          <h4>Basic Settings</h4>
          
          <div class="setting-item">
            <label>Show Notifications:</label>
            <input type="checkbox" 
                   ${context.model.showNotifications ? 'checked' : ''} 
                   onchange="updateSetting('showNotifications', this.checked)">
          </div>
          
        </div>
        
        <div class="settings-actions">
          <button class="btn btn-primary" onclick="saveSettings()">
            💾 Save Settings
          </button>
          <button class="btn btn-secondary" onclick="resetSettings()">
            🔄 Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderWaveSettingsView(context) {
  return `
    <div class="settings-wave-view">
      <div class="settings-header">
        <h3>🌊 Wave Animation Settings</h3>
        <button class="back-btn" onclick="switchToView('general')">← Back to General</button>
      </div>
      
      <div class="settings-content">
        <div class="setting-group">
          <h4>Animation Parameters</h4>
          
          <div class="setting-item">
            <label>Wave Speed (seconds):</label>
            <input type="number" 
                   value="${context.model.waveSpeed}" 
                   min="0.1" max="20" step="0.1"
                   onchange="updateWaveSetting('waveSpeed', parseFloat(this.value))">
            <span class="help-text">Duration of the wave animation cycle</span>
          </div>
          
          <div class="setting-item">
            <label>Axis Translation X Max:</label>
            <input type="number" 
                   value="${context.model.axisTranslateAmountXMax}"
                   onchange="updateWaveSetting('axisTranslateAmountXMax', parseFloat(this.value))">
          </div>
          
          <div class="setting-item">
            <label>Axis Translation X Min:</label>
            <input type="number" 
                   value="${context.model.axisTranslateAmountXMin}"
                   onchange="updateWaveSetting('axisTranslateAmountXMin', parseFloat(this.value))">
          </div>
          
          <div class="setting-item">
            <label>Axis Rotation Y Max:</label>
            <input type="number" 
                   value="${context.model.axisRotationAmountYMax}"
                   onchange="updateWaveSetting('axisRotationAmountYMax', parseFloat(this.value))">
          </div>
          
          <div class="setting-item">
            <label>Axis Rotation Y Min:</label>
            <input type="number" 
                   value="${context.model.axisRotationAmountYMin}"
                   onchange="updateWaveSetting('axisRotationAmountYMin', parseFloat(this.value))">
          </div>
          
        </div>
        
        <div class="settings-actions">
          <button class="btn btn-primary" onclick="saveSettings()">💾 Save Settings</button>
          <button class="btn btn-secondary" onclick="switchToView('general')">← Back</button>
        </div>
      </div>
    </div>
  `;
}

function renderCssSettingsView(context) {
  return `
    <div class="settings-css-view">
      <div class="settings-header">
        <h3>🎨 CSS Template Settings</h3>
        <button class="back-btn" onclick="switchToView('general')">← Back to General</button>
      </div>
      
      <div class="settings-content">
        <div class="setting-group">
          <h4>CSS Generation</h4>
          
          <div class="setting-item">
            <label>
              <input type="checkbox" 
                     ${context.model.autoGenerateCss ? 'checked' : ''}
                     onchange="toggleAutoGenerate()">
              Auto-generate CSS from parameters
            </label>
            <span class="help-text">When enabled, CSS templates are automatically generated from animation parameters</span>
          </div>
        </div>
        
        <div class="setting-group">
          <h4>CSS Templates</h4>
          
          <div class="setting-item">
            <label>CSS Template:</label>
            <textarea rows="10" 
                      ${context.model.autoGenerateCss ? 'readonly' : ''}
                      onchange="updateCssSetting('cssTemplate', this.value)">${context.model.cssTemplate}</textarea>
            <span class="help-text">
              ${context.model.autoGenerateCss ? 
                'Auto-generated from parameters above' : 
                'Edit manually to update parameters below'
              }
            </span>
          </div>
          
          <div class="setting-item">
            <label>CSS Mouse Template:</label>
            <textarea rows="10" 
                      ${context.model.autoGenerateCss ? 'readonly' : ''}
                      onchange="updateCssSetting('cssMouseTemplate', this.value)">${context.model.cssMouseTemplate}</textarea>
            <span class="help-text">
              ${context.model.autoGenerateCss ? 
                'Auto-generated from parameters above' : 
                'Edit manually to update parameters below'
              }
            </span>
          </div>
        </div>
        
        <div class="settings-actions">
          <button class="btn btn-primary" onclick="saveSettings()">💾 Save Settings</button>
          <button class="btn btn-secondary" onclick="switchToView('general')">← Back</button>
        </div>
      </div>
    </div>
  `;
}

function renderDomainSettingsView(context) {
  return `
    <div class="settings-domain-view">
      <div class="settings-header">
        <h3>🌐 Domain & Path Settings</h3>
        <button class="back-btn" onclick="switchToView('general')">← Back to General</button>
      </div>
      
      <div class="settings-content">
        <div class="setting-group">
          <h4>Domain Configuration</h4>
          
          <div class="setting-item">
            <label>Current Domain:</label>
            <select onchange="updateDomainSetting('domain', this.value)">
              ${context.model.domainPaths.map(dp => 
                `<option value="${dp.domain}" ${dp.domain === context.model.currentDomain ? 'selected' : ''}>
                  ${dp.domain}
                </option>`
              ).join('')}
            </select>
          </div>
          
          <div class="setting-item">
            <label>Current Path:</label>
            <select onchange="updateDomainSetting('path', this.value)">
              ${(context.model.domainPaths.find(dp => dp.domain === context.model.currentDomain)?.paths || []).map(path => 
                `<option value="${path}" ${path === context.model.currentPath ? 'selected' : ''}>
                  ${path}
                </option>`
              ).join('')}
            </select>
          </div>
        </div>
        
        <div class="settings-actions">
          <button class="btn btn-primary" onclick="saveSettings()">💾 Save Settings</button>
          <button class="btn btn-secondary" onclick="switchToView('general')">← Back</button>
        </div>
      </div>
    </div>
  `;
}

function renderKeyboardSettingsView(context) {
  return `
    <div class="settings-keyboard-view">
      <div class="settings-header">
        <h3>⌨️ Keyboard Shortcut Settings</h3>
        <button class="back-btn" onclick="switchToView('general')">← Back to General</button>
      </div>
      
      <div class="settings-content">
        <div class="setting-group">
          <h4>Wave Toggle Shortcut</h4>
          
          <div class="setting-item">
            <label>Toggle Keys:</label>
            <div class="keyboard-input">
              <input type="text" 
                     value="${context.model.toggleKeys.keyChord.join(' + ')}" 
                     placeholder="Press keys to set shortcut"
                     readonly>
              <button class="btn btn-secondary" onclick="startKeyboardScan()">
                🔍 Scan for Keys
              </button>
            </div>
            <span class="help-text">Press up to 4 keys to create your shortcut</span>
          </div>
        </div>
        
        <div class="settings-actions">
          <button class="btn btn-primary" onclick="saveSettings()">💾 Save Settings</button>
          <button class="btn btn-secondary" onclick="switchToView('general')">← Back</button>
        </div>
      </div>
    </div>
  `;
}

function renderAdvancedSettingsView(context) {
  return `
    <div class="settings-advanced-view">
      <div class="settings-header">
        <h3>🔧 Advanced Settings</h3>
        <button class="back-btn" onclick="switchToView('general')">← Back to General</button>
      </div>
      
      <div class="settings-content">
        <div class="setting-group">
          <h4>Text Settings</h4>
          
          <div class="setting-item">
            <label>Text Color:</label>
            <input type="text" 
                   value="${context.model.textColor}" 
                   onchange="updateAdvancedSetting('textColor', this.value)">
            <span class="help-text">CSS color value (e.g., 'red', '#ff0000', 'rgb(255,0,0)')</span>
          </div>
          
          <div class="setting-item">
            <label>Text Size:</label>
            <input type="text" 
                   value="${context.model.textSize}" 
                   onchange="updateAdvancedSetting('textSize', this.value)">
            <span class="help-text">CSS size value (e.g., '16px', '1.2em', 'large')</span>
          </div>
          
          <div class="setting-item">
            <label>CSS Selector:</label>
            <input type="text" 
                   value="${context.model.selector}" 
                   onchange="updateAdvancedSetting('selector', this.value)">
            <span class="help-text">CSS selector for target elements (e.g., 'p', '.content', '#main')</span>
          </div>
        </div>
        
        <div class="settings-actions">
          <button class="btn btn-primary" onclick="saveSettings()">💾 Save Settings</button>
          <button class="btn btn-secondary" onclick="switchToView('general')">← Back</button>
        </div>
      </div>
    </div>
  `;
}

function renderSaveSettingsView(context) {
  return `
    <div class="settings-saving-view">
      <div class="settings-header">
        <h3>💾 Saving Settings</h3>
      </div>
      
      <div class="settings-content">
        <div class="saving-progress">
          <div class="spinner"></div>
          <p>Saving your settings...</p>
          <p>Please wait while we update your configuration.</p>
        </div>
        
        <div class="settings-actions">
          <button class="btn btn-secondary" onclick="cancelSave()">❌ Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function renderLoadingSettingsView(context) {
  return `
    <div class="settings-loading-view">
      <div class="settings-header">
        <h3>📥 Loading Settings</h3>
      </div>
      
      <div class="settings-content">
        <div class="loading-progress">
          <div class="spinner"></div>
          <p>Loading your settings...</p>
          <p>Please wait while we retrieve your configuration.</p>
        </div>
      </div>
    </div>
  `;
}

function renderErrorView(context) {
  return `
    <div class="settings-error-view">
      <div class="settings-header">
        <h3>❌ Error</h3>
      </div>
      
      <div class="settings-content">
        <div class="error-message">
          <p>An error occurred while processing your request:</p>
          <p class="error-text">${context.model.error || 'Unknown error'}</p>
        </div>
        
        <div class="settings-actions">
          <button class="btn btn-primary" onclick="retryOperation()">🔄 Retry</button>
          <button class="btn btn-secondary" onclick="goToGeneral()">🏠 Go to General</button>
        </div>
      </div>
    </div>
  `;
}

// Export the template
export { SettingsComponentTemplate };
