// RobotCopy Configuration for Scan For Input Component
// This file configures RobotCopy instances with PACT test client for the scan-for-input component
// Specifically designed for Chrome extension communication and keyboard shortcut management

import { createRobotCopy } from '../../../../log-view-machine/src/core/RobotCopy';
import { createViewStateMachine } from '../../../../log-view-machine/src/core/ViewStateMachine';
import { createClientGenerator } from '../../../../log-view-machine/src/core/ClientGenerator';

// PACT Test Client Configuration
const PACT_CONFIG = {
    consumer: 'ScanForInputConsumer',
    provider: 'ScanForInputProvider',
    logLevel: 'info',
    dir: './pacts',
    spec: 2
};

// RobotCopy Configuration for Scan For Input Chrome Extension
const ROBOTCOPY_CONFIG = {
    unleashUrl: 'http://localhost:4242/api',
    unleashClientKey: 'default:development.unleash-insecure-api-token',
    unleashAppName: 'scan-for-input-extension',
    unleashEnvironment: 'development',
    
    // Chrome Extension specific URLs and configurations
    chromeExtension: {
        extensionId: (typeof chrome !== 'undefined' && chrome?.runtime?.id) ? chrome.runtime.id : 'scan-for-input-extension',
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

// Chrome Extension Message Handler for Scan For Input
class ScanForInputMessageHandler {
    constructor(config = ROBOTCOPY_CONFIG) {
        this.config = config;
        this.messageHandlers = new Map();
        this.keyboardListeners = new Map();
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
        
        console.log('⌨️ ScanForInput: Received message:', { type, source, target, traceId });
        
        // Route message to appropriate handler
        if (this.messageHandlers.has(type)) {
            const handler = this.messageHandlers.get(type);
            try {
                const result = handler(data, sender);
                sendResponse({ success: true, data: result, traceId });
            } catch (error) {
                console.error('⌨️ ScanForInput: Error handling message:', error);
                sendResponse({ success: false, error: error.message, traceId });
            }
        } else {
            console.warn('⌨️ ScanForInput: No handler for message type:', type);
            sendResponse({ success: false, error: 'No handler for message type: ' + type, traceId });
        }
    }

    registerMessageHandler(messageType, handler) {
        this.messageHandlers.set(messageType, handler);
    }

    registerKeyboardListener(actionType, listener) {
        this.keyboardListeners.set(actionType, listener);
    }

    removeKeyboardListener(actionType) {
        this.keyboardListeners.delete(actionType);
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

    // Keyboard shortcut management methods
    startKeyboardScanning(actionType, keyLimit = 3) {
        console.log('⌨️ ScanForInput: Starting keyboard scanning for:', actionType);
        
        // Set up global keyboard listener
        const keyboardHandler = (event) => {
            if (event.type !== 'keydown') return;
            
            // Prevent default behavior for certain keys
            if (['Escape', 'Tab', 'F5', 'F12'].includes(event.key)) {
                event.preventDefault();
            }
            
            // Notify listeners
            const listener = this.keyboardListeners.get(actionType);
            if (listener) {
                listener({
                    type: 'KEY_PRESSED',
                    key: event.key,
                    actionType,
                    keyLimit
                });
            }
        };
        
        document.addEventListener('keydown', keyboardHandler);
        
        // Store the handler for cleanup
        this.keyboardListeners.set(actionType, {
            handler: keyboardHandler,
            cleanup: () => document.removeEventListener('keydown', keyboardHandler)
        });
        
        return true;
    }

    stopKeyboardScanning(actionType) {
        console.log('⌨️ ScanForInput: Stopping keyboard scanning for:', actionType);
        
        const listener = this.keyboardListeners.get(actionType);
        if (listener && listener.cleanup) {
            listener.cleanup();
            this.keyboardListeners.delete(actionType);
        }
        
        return true;
    }

    validateShortcut(shortcut, actionType) {
        console.log('⌨️ ScanForInput: Validating shortcut:', shortcut, 'for action:', actionType);
        
        // Basic validation
        if (!Array.isArray(shortcut) || shortcut.length === 0) {
            return { valid: false, error: 'Shortcut must be an array of keys' };
        }
        
        if (shortcut.length > 5) {
            return { valid: false, error: 'Shortcut cannot exceed 5 keys' };
        }
        
        // Check for invalid keys
        const invalidKeys = shortcut.filter(key => 
            ['Escape', 'Tab', 'F5', 'F12'].includes(key)
        );
        
        if (invalidKeys.length > 0) {
            return { 
                valid: false, 
                error: `Invalid keys: ${invalidKeys.join(', ')}` 
            };
        }
        
        return { valid: true, shortcut, actionType };
    }

    checkShortcutConflicts(shortcut, actionType) {
        console.log('⌨️ ScanForInput: Checking for conflicts with shortcut:', shortcut);
        
        // This would typically check against existing shortcuts in storage
        // For now, return empty array (no conflicts)
        return [];
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

// Scan For Input State Machine Configuration
// Note: This is a simplified version for Chrome extension use
// In a full log-view-machine setup, this would use createViewStateMachine
const createScanForInputStateMachine = () => {
    console.log('⌨️ ScanForInput: State machine factory called (simplified version)');
    
    // Return a simple mock for now
    return {
        send: async (event) => {
            console.log('⌨️ ScanForInput: Mock state machine received event:', event);
            return { success: true };
        },
        getSnapshot: () => ({
            value: 'idle',
            context: {}
        })
    };
};

// Export the state machine factory and configurations
export { 
    createScanForInputStateMachine, 
    ROBOTCOPY_CONFIG, 
    PACT_CONFIG, 
    PactTestClient,
    ScanForInputMessageHandler 
};
