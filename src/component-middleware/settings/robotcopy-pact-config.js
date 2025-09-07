// RobotCopy Configuration for Settings Component
// This file configures RobotCopy instances with PACT test client for the settings component
// Specifically designed for Chrome extension communication and settings management

import { createRobotCopy } from '../../../../log-view-machine/src/core/RobotCopy';
import { createViewStateMachine } from '../../../../log-view-machine/src/core/ViewStateMachine';
import { createClientGenerator } from '../../../../log-view-machine/src/core/ClientGenerator';

// PACT Test Client Configuration
const PACT_CONFIG = {
    consumer: 'SettingsConsumer',
    provider: 'SettingsProvider',
    logLevel: 'info',
    dir: './pacts',
    spec: 2
};

// RobotCopy Configuration for Settings Chrome Extension
const ROBOTCOPY_CONFIG = {
    unleashUrl: 'http://localhost:4242/api',
    unleashClientKey: 'default:development.unleash-insecure-api-token',
    unleashAppName: 'settings-extension',
    unleashEnvironment: 'development',
    
    // Chrome Extension specific URLs and configurations
    chromeExtension: {
        extensionId: (typeof chrome !== 'undefined' && chrome?.runtime?.id) ? chrome.runtime.id : 'settings-extension',
        popupUrl: (typeof chrome !== 'undefined' && chrome?.runtime?.getURL) ? chrome.runtime.getURL('popup.html') : 'popup.html',
        backgroundUrl: (typeof chrome !== 'undefined' && chrome?.runtime?.getURL) ? chrome.runtime.getURL('background.js') : 'background.js',
        contentScriptUrl: (typeof chrome !== 'undefined' && chrome?.runtime?.getURL) ? chrome.runtime.getURL('content.js') : 'content.js',
        optionsUrl: (typeof chrome !== 'undefined' && chrome?.runtime?.getURL) ? chrome.runtime.getURL('options.html') : 'options.html'
    },
    
    // Communication endpoints for different extension contexts
    endpoints: {
        popup: {
            id: 'popup',
            type: 'popup',
            canSendTo: ['background', 'content'],
            canReceiveFrom: ['background', 'content']
        },
        background: {
            id: 'background',
            type: 'background',
            canSendTo: ['popup', 'content', 'tabs'],
            canReceiveFrom: ['popup', 'content', 'tabs']
        },
        content: {
            id: 'content',
            type: 'content',
            canSendTo: ['background'],
            canReceiveFrom: ['background', 'popup']
        }
    },
    
    // Message routing configuration
    messageRouting: {
        // Popup to Background communication
        'popup:background': {
            method: 'chrome.runtime.sendMessage',
            target: 'background',
            requiresResponse: true
        },
        
        // Background to Popup communication
        'background:popup': {
            method: 'chrome.runtime.sendMessage',
            target: 'popup',
            requiresResponse: false
        },
        
        // Background to Content communication
        'background:content': {
            method: 'chrome.tabs.sendMessage',
            target: 'activeTab',
            requiresResponse: true
        },
        
        // Content to Background communication
        'content:background': {
            method: 'chrome.runtime.sendMessage',
            target: 'background',
            requiresResponse: true
        }
    },
    
    enableTracing: true,
    enableDataDog: true,
    debug: true
};

// Chrome Extension Message Handler for Settings
class SettingsMessageHandler {
    constructor(config = ROBOTCOPY_CONFIG) {
        this.config = config;
        this.messageHandlers = new Map();
        this.settingsListeners = new Map();
        this.setupMessageListeners();
    }

    setupMessageListeners() {
        // Set up message listeners based on context
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                this.handleIncomingMessage(message, sender, sendResponse);
                return true; // Keep message channel open for async response
            });
        }
    }

    handleIncomingMessage(message, sender, sendResponse) {
        const { type, data, source, target, traceId } = message;
        
        console.log('⚙️ Settings: Received message:', { type, source, target, traceId });
        
        // Route message to appropriate handler
        if (this.messageHandlers.has(type)) {
            const handler = this.messageHandlers.get(type);
            try {
                const result = handler(data, sender);
                sendResponse({ success: true, data: result, traceId });
            } catch (error) {
                console.error('⚙️ Settings: Error handling message:', error);
                sendResponse({ success: false, error: error.message, traceId });
            }
        } else {
            console.warn('⚙️ Settings: No handler for message type:', type);
            sendResponse({ success: false, error: 'No handler for message type: ' + type, traceId });
        }
    }

    registerMessageHandler(messageType, handler) {
        this.messageHandlers.set(messageType, handler);
    }

    registerSettingsListener(settingKey, listener) {
        this.settingsListeners.set(settingKey, listener);
    }

    removeSettingsListener(settingKey) {
        this.settingsListeners.delete(settingKey);
    }

    sendMessage(target, message) {
        return new Promise((resolve, reject) => {
            try {
                if (target === 'background') {
                    chrome.runtime.sendMessage(message, (response) => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(chrome.runtime.lastError.message));
                        } else {
                            resolve(response);
                        }
                    });
                } else if (target === 'content') {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs[0]) {
                            chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
                                if (chrome.runtime.lastError) {
                                    reject(new Error(chrome.runtime.lastError.message));
                                } else {
                                    resolve(response);
                                }
                            });
                        } else {
                            reject(new Error('No active tab found'));
                        }
                    });
                } else {
                    reject(new Error(`Unknown target: ${target}`));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    // Settings management methods
    saveSettings(settings) {
        console.log('⚙️ Settings: Saving settings:', settings);
        
        // This would typically save the settings to storage
        // For now, return success
        return {
            success: true,
            savedAt: new Date().toISOString(),
            settings
        };
    }

    loadSettings() {
        console.log('⚙️ Settings: Loading settings');
        
        // This would typically load the settings from storage
        // For now, return default settings
        return {
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
    }

    updateSetting(settingKey, value) {
        console.log('⚙️ Settings: Updating setting:', settingKey, value);
        
        // Notify listeners
        const listener = this.settingsListeners.get(settingKey);
        if (listener) {
            listener({ settingKey, value, timestamp: new Date().toISOString() });
        }
        
        return {
            success: true,
            settingKey,
            value,
            updatedAt: new Date().toISOString()
        };
    }

    resetSettings() {
        console.log('⚙️ Settings: Resetting settings to defaults');
        
        // This would typically reset settings to defaults
        const defaultSettings = this.loadSettings();
        
        // Notify all listeners
        this.settingsListeners.forEach((listener, key) => {
            listener({ settingKey: key, value: defaultSettings[key], timestamp: new Date().toISOString() });
        });
        
        return {
            success: true,
            resetAt: new Date().toISOString(),
            defaultSettings
        };
    }

    // Wave animation specific methods
    updateWaveSettings(waveSettings) {
        console.log('⚙️ Settings: Updating wave settings:', waveSettings);
        
        // Validate wave settings
        const validation = this.validateWaveSettings(waveSettings);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error
            };
        }
        
        // Update individual settings
        Object.entries(waveSettings).forEach(([key, value]) => {
            this.updateSetting(key, value);
        });
        
        return {
            success: true,
            updatedAt: new Date().toISOString(),
            waveSettings
        };
    }

    validateWaveSettings(waveSettings) {
        const { waveSpeed, axisTranslateAmountXMax, axisTranslateAmountXMin, axisRotationAmountYMax, axisRotationAmountYMin, mouseFollowInterval } = waveSettings;
        
        if (waveSpeed < 0.1 || waveSpeed > 20) {
            return { valid: false, error: 'Wave speed must be between 0.1 and 20 seconds' };
        }
        
        if (mouseFollowInterval < 10 || mouseFollowInterval > 1000) {
            return { valid: false, error: 'Mouse follow interval must be between 10 and 1000ms' };
        }
        
        return { valid: true };
    }

    // CSS template methods
    updateCssSettings(cssSettings) {
        console.log('⚙️ Settings: Updating CSS settings:', cssSettings);
        
        // Validate CSS templates
        const validation = this.validateCssSettings(cssSettings);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error
            };
        }
        
        // Update individual settings
        Object.entries(cssSettings).forEach(([key, value]) => {
            this.updateSetting(key, value);
        });
        
        return {
            success: true,
            updatedAt: new Date().toISOString(),
            cssSettings
        };
    }

    validateCssSettings(cssSettings) {
        const { cssTemplate, cssMouseTemplate } = cssSettings;
        
        // Basic CSS validation
        if (cssTemplate && !cssTemplate.includes('{') && !cssTemplate.includes('}')) {
            return { valid: false, error: 'CSS template must contain valid CSS syntax' };
        }
        
        if (cssMouseTemplate && !cssMouseTemplate.includes('{') && !cssMouseTemplate.includes('}')) {
            return { valid: false, error: 'CSS mouse template must contain valid CSS syntax' };
        }
        
        return { valid: true };
    }

    // Domain and path methods
    updateDomainSettings(domainSettings) {
        console.log('⚙️ Settings: Updating domain settings:', domainSettings);
        
        // Validate domain settings
        const validation = this.validateDomainSettings(domainSettings);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error
            };
        }
        
        // Update individual settings
        Object.entries(domainSettings).forEach(([key, value]) => {
            this.updateSetting(key, value);
        });
        
        return {
            success: true,
            updatedAt: new Date().toISOString(),
            domainSettings
        };
    }

    validateDomainSettings(domainSettings) {
        const { domain, path } = domainSettings;
        
        if (domain && !domain.includes('.')) {
            return { valid: false, error: 'Domain must be a valid domain name' };
        }
        
        if (path && !path.startsWith('/')) {
            return { valid: false, error: 'Path must start with /' };
        }
        
        return { valid: true };
    }

    // Keyboard shortcut methods
    updateKeyboardSettings(keyboardSettings) {
        console.log('⚙️ Settings: Updating keyboard settings:', keyboardSettings);
        
        // Validate keyboard settings
        const validation = this.validateKeyboardSettings(keyboardSettings);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error
            };
        }
        
        // Update individual settings
        Object.entries(keyboardSettings).forEach(([key, value]) => {
            this.updateSetting(key, value);
        });
        
        return {
            success: true,
            updatedAt: new Date().toISOString(),
            keyboardSettings
        };
    }

    validateKeyboardSettings(keyboardSettings) {
        const { toggleKeys } = keyboardSettings;
        
        if (toggleKeys && toggleKeys.keyChord && toggleKeys.keyChord.length > 4) {
            return { valid: false, error: 'Keyboard shortcut cannot exceed 4 keys' };
        }
        
        return { valid: true };
    }

    // Export and import methods
    exportSettings() {
        console.log('⚙️ Settings: Exporting settings');
        
        const settings = this.loadSettings();
        const exportData = {
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
            settings
        };
        
        return {
            success: true,
            exportData: JSON.stringify(exportData, null, 2)
        };
    }

    importSettings(importData) {
        console.log('⚙️ Settings: Importing settings');
        
        try {
            const parsed = JSON.parse(importData);
            
            if (!parsed.settings || !parsed.version) {
                return {
                    success: false,
                    error: 'Invalid settings file format'
                };
            }
            
            // Validate imported settings
            const validation = this.validateImportedSettings(parsed.settings);
            if (!validation.valid) {
                return {
                    success: false,
                    error: validation.error
                };
            }
            
            // Apply imported settings
            Object.entries(parsed.settings).forEach(([key, value]) => {
                this.updateSetting(key, value);
            });
            
            return {
                success: true,
                importedAt: new Date().toISOString(),
                importedSettings: parsed.settings
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'Failed to parse settings file: ' + error.message
            };
        }
    }

    validateImportedSettings(settings) {
        // Basic validation of imported settings
        const requiredKeys = ['showNotifications', 'waveSpeed'];
        
        for (const key of requiredKeys) {
            if (!(key in settings)) {
                return { valid: false, error: `Missing required setting: ${key}` };
            }
        }
        
        return { valid: true };
    }
}

// PACT Test Client Setup
class PactTestClient {
    constructor(config = PACT_CONFIG) {
        this.config = config;
        this.interactions = [];
        this.provider = null;
    }

    setup() {
        // Initialize PACT provider
        this.provider = new Pact({
            consumer: this.config.consumer,
            provider: this.config.provider,
            log: path.resolve(process.cwd(), 'logs', 'pact.log'),
            logLevel: this.config.logLevel,
            dir: path.resolve(process.cwd(), this.config.dir),
            spec: this.config.spec
        });

        return this.provider.setup();
    }

    addInteraction(interaction) {
        this.interactions.push(interaction);
        return this.provider.addInteraction(interaction);
    }

    verify() {
        return this.provider.verify();
    }

    finalize() {
        return this.provider.finalize();
    }

    cleanup() {
        this.interactions = [];
    }
}

// Settings State Machine Configuration
// Note: This is a simplified version for Chrome extension use
// In a full log-view-machine setup, this would use createViewStateMachine
const createSettingsStateMachine = () => {
    console.log('⚙️ Settings: State machine factory called (simplified version)');
    
    // Return a simple mock for now
    return {
        send: async (event) => {
            console.log('⚙️ Settings: Mock state machine received event:', event);
            return { success: true };
        },
        getSnapshot: () => ({
            value: 'general',
            context: {}
        })
    };
};

// Export the state machine factory and configurations
export { 
    createSettingsStateMachine, 
    ROBOTCOPY_CONFIG, 
    PACT_CONFIG, 
    PactTestClient,
    SettingsMessageHandler 
};
