// RobotCopy Configuration for Wave Tabs Component
// This file configures RobotCopy instances with PACT test client for the wave-tabs component
// Specifically designed for Chrome extension communication and tab management

import { createRobotCopy } from '../../../../log-view-machine/src/core/RobotCopy';
import { createViewStateMachine } from '../../../../log-view-machine/src/core/ViewStateMachine';
import { createClientGenerator } from '../../../../log-view-machine/src/core/ClientGenerator';

// PACT Test Client Configuration
const PACT_CONFIG = {
    consumer: 'WaveTabsConsumer',
    provider: 'WaveTabsProvider',
    logLevel: 'info',
    dir: './pacts',
    spec: 2
};

// RobotCopy Configuration for Wave Tabs Chrome Extension
const ROBOTCOPY_CONFIG = {
    unleashUrl: 'http://localhost:4242/api',
    unleashClientKey: 'default:development.unleash-insecure-api-token',
    unleashAppName: 'wave-tabs-extension',
    unleashEnvironment: 'development',
    
    // Chrome Extension specific URLs and configurations
    chromeExtension: {
        extensionId: (typeof chrome !== 'undefined' && chrome?.runtime?.id) ? chrome.runtime.id : 'wave-tabs-extension',
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

// Chrome Extension Message Handler for Wave Tabs
class WaveTabsMessageHandler {
    constructor(config = ROBOTCOPY_CONFIG) {
        this.config = config;
        this.messageHandlers = new Map();
        this.tabStateListeners = new Map();
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
        
        console.log('📑 WaveTabs: Received message:', { type, source, target, traceId });
        
        // Route message to appropriate handler
        if (this.messageHandlers.has(type)) {
            const handler = this.messageHandlers.get(type);
            try {
                const result = handler(data, sender);
                sendResponse({ success: true, data: result, traceId });
            } catch (error) {
                console.error('📑 WaveTabs: Error handling message:', error);
                sendResponse({ success: false, error: error.message, traceId });
            }
        } else {
            console.warn('📑 WaveTabs: No handler for message type:', type);
            sendResponse({ success: false, error: 'No handler for message type: ' + type, traceId });
        }
    }

    registerMessageHandler(messageType, handler) {
        this.messageHandlers.set(messageType, handler);
    }

    registerTabStateListener(tabId, listener) {
        this.tabStateListeners.set(tabId, listener);
    }

    removeTabStateListener(tabId) {
        this.tabStateListeners.delete(tabId);
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

    // Tab management methods
    createTab(tabData) {
        console.log('📑 WaveTabs: Creating new tab:', tabData);
        
        const newTab = {
            id: `tab-${Date.now()}`,
            name: tabData.name || 'New Tab',
            content: tabData.content || '',
            state: tabData.state || {},
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        return newTab;
    }

    updateTab(tabId, updates) {
        console.log('📑 WaveTabs: Updating tab:', tabId, updates);
        
        // This would typically update the tab in storage
        // For now, return the updated tab data
        return {
            id: tabId,
            ...updates,
            lastModified: new Date().toISOString()
        };
    }

    deleteTab(tabId) {
        console.log('📑 WaveTabs: Deleting tab:', tabId);
        
        // This would typically remove the tab from storage
        return { success: true, deletedTabId: tabId };
    }

    reorderTabs(tabIds) {
        console.log('📑 WaveTabs: Reordering tabs:', tabIds);
        
        // This would typically update the tab order in storage
        return { success: true, newOrder: tabIds };
    }

    getTabState(tabId) {
        console.log('📑 WaveTabs: Getting tab state:', tabId);
        
        // This would typically retrieve the tab state from storage
        return {
            id: tabId,
            state: {},
            lastAccessed: new Date().toISOString()
        };
    }

    setTabState(tabId, state) {
        console.log('📑 WaveTabs: Setting tab state:', tabId, state);
        
        // This would typically save the tab state to storage
        return {
            success: true,
            tabId,
            state,
            lastModified: new Date().toISOString()
        };
    }

    // Tab configuration methods
    saveTabConfiguration(configuration) {
        console.log('📑 WaveTabs: Saving tab configuration:', configuration);
        
        // This would typically save the configuration to storage
        return {
            success: true,
            configuration,
            savedAt: new Date().toISOString()
        };
    }

    loadTabConfiguration() {
        console.log('📑 WaveTabs: Loading tab configuration');
        
        // This would typically load the configuration from storage
        return {
            tabs: [],
            tabNames: [],
            tabContents: [],
            tabStates: {},
            maxTabs: 10,
            saveHistory: true,
            autoSave: true
        };
    }

    resetTabConfiguration() {
        console.log('📑 WaveTabs: Resetting tab configuration');
        
        // This would typically reset the configuration to defaults
        return {
            success: true,
            resetAt: new Date().toISOString()
        };
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

// Wave Tabs State Machine Configuration
// Note: This is a simplified version for Chrome extension use
// In a full log-view-machine setup, this would use createViewStateMachine
const createWaveTabsStateMachine = () => {
    console.log('📑 WaveTabs: State machine factory called (simplified version)');
    
    // Return a simple mock for now
    return {
        send: async (event) => {
            console.log('📑 WaveTabs: Mock state machine received event:', event);
            return { success: true };
        },
        getSnapshot: () => ({
            value: 'tab-0',
            context: {}
        })
    };
};

// Export the state machine factory and configurations
export { 
    createWaveTabsStateMachine, 
    ROBOTCOPY_CONFIG, 
    PACT_CONFIG, 
    PactTestClient,
    WaveTabsMessageHandler 
};
