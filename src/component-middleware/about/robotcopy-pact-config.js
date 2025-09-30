// RobotCopy Configuration for Wave Tabs Component
// This file configures RobotCopy instances with PACT test client for the wave-tabs component
// Specifically designed for Chrome extension communication and tab management

import { createRobotCopy, createViewStateMachine, createClientGenerator } from 'log-view-machine';

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


// Export the state machine factory and configurations
export { 
    ROBOTCOPY_CONFIG
};
