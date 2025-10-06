// RobotCopy Configuration for Wave Tabs Component
// This file configures RobotCopy instances with PACT test client for the wave-tabs component
// Specifically designed for Chrome extension communication and tab management

import { createRobotCopy, createViewStateMachine, createProxyRobotCopyStateMachine, createClientGenerator } from 'log-view-machine';


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
            canSendTo: ['backend'],
            canReceiveFrom: ['backend']
        },
        backend: {
            id: 'backend',
            type: 'backend',
            canSendTo: ['popup'],
            canReceiveFrom: ['popup']
        }
    },
    
    // Message routing configuration
    messageRouting: {
        // Popup to Background communication
        'popup:backend': {
            method: 'chrome.runtime.sendMessage',
            target: 'backend',
            requiresResponse: true
        },
        
        // Background to Popup communication
        'backend:popup': {
            method: 'chrome.runtime.sendMessage',
            target: 'popup',
            requiresResponse: false
        }
    },
    
    enableTracing: true,
    enableDataDog: true,
    debug: true
};

const DonationPageMachine = createRobotCopyStateMachine({
    machineId: 'donation-page-machine',
    robotCopyConfig: createRobotCopy(ROBOTCOPY_CONFIG),
    routing: {
        basePath: '/api/donation',
        routes: {
            // todo: review: do we require submachines here to use this routing?
            // e.g. donationMachine and donationStatusMachine - are we better off with
            // a TomeConfig?
            donationMachine: {
                path: '/donate',
                method: 'POST'
            },
            donationStatusMachine: {
                path: '/status',
                method: 'POST'
            }
        }
    },
    xstateConfig: {
        initial: 'idle',
        states: {
            idle: {
                on: {
                    DONATE: 'donating', actions: ['donate'],
                    CHECK_STATUS: 'donationStatus', actions: ['checkStatus']
                }
            },
            donating: {
                on: {
                    DONATION_COMPLETE: 'idle', actions: ['donationComplete']
                }
            },
            donationStatus: {
                on: {
                    DONATION_STATUS_UPDATED: 'idle', actions: ['donationStatusUpdated']
                }
            }
        },
        actions: {
            donate: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    send('DONATION_COMPLETE');
                    // todo: add admin backend page for donation easter egg whitelist
                }
            },
            donationComplete: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    
                    send('DONATION_COMPLETE');
                }
            },
            checkStatus: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    send('status');
                }
            },
            donationStatusUpdated: {
                type: 'function',
                fn: ({context, event, send, log, transition, machine}: any) => {
                    
                    machine.parentMachine.getSubMachine('about-page-machine').send('DONATION_STATUS_UPDATED', { donated: event.donated, hasEasterEggs: event.hasEasterEggs });
                }
            }
        }
    }
});


// Export the state machine factory and configurations
export { 
    ROBOTCOPY_CONFIG,
    DonationPageTemplate
};
