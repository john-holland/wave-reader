import "regenerator-runtime/runtime";
// chrome.runtime.onInstalled?.addListener(() => {
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
//       ...
// });
// import 'regenerator-runtime/runtime'
// import registerContentScript from 'content-scripts-register-polyfill/ponyfill.js';

import { guardLastError } from "../src/util/util";
import StartMessage from "../src/models/messages/start";
// import UpdateGoingStateMessage from "../src/models/messages/update-going-state";
import PingMessage from "../src/models/messages/ping";

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
    console.log("🌊 Background received command:", command);
    
    if (command === "_execute_action") {
        // This opens the popup - handled automatically by Chrome
        console.log("🌊 Background: _execute_action command received - popup will open");
        return;
    }
    
    if (command === "toggle-wave-reader") {
        console.log("🌊 Background: Toggle wave reader command received");
        
        // Get the active tab and send toggle message to content script
        chrome.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            if (!tabs || tabs.length === 0) {
                console.error('🌊 No active tabs found for keyboard shortcut');
                return;
            }
            
            // Check if the tab URL is accessible (not chrome:// or chrome-extension://)
            const tabUrl = tabs[0].url;
            if (tabUrl && (tabUrl.startsWith('chrome://') || tabUrl.startsWith('chrome-extension://') || tabUrl.startsWith('moz-extension://'))) {
                console.log('🌊 Skipping toggle command for restricted URL:', tabUrl);
                return;
            }
            
            console.log(`🌊 Background sending toggle command to tab:`, tabs[0].url);
            
            // Send toggle message to content script via window.postMessage
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (messageData) => {
                    console.log("🌊 Background script injecting toggle command to content script:", messageData);
                    window.postMessage({
                        source: 'wave-reader-extension',
                        message: messageData
                    }, '*');
                },
                args: [{
                    from: 'background-script',
                    name: 'toggle-wave-reader'
                }]
            }).then(() => {
                console.log('🌊 Background script toggle command injected successfully');
            }).catch((error) => {
                console.log('🌊 Background script failed to inject toggle command:', error);
            });
        }).catch((error) => {
            console.error('🌊 Error querying tabs for keyboard shortcut:', error);
        });
    }
});

// Listen for messages from content scripts and forward to popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("🌊 Background received message:", message);
    console.log("🌊 Message sender:", sender);
    console.log("🌊 Message from:", message.from);
    console.log("🌊 Message name:", message.name);
    

    
    // Handle selection-made messages from content script (via chrome.runtime.sendMessage)
    if (message.from === 'content-script' && message.name === 'selection-made') {
        console.log("🌊 Background forwarding selection-made to popup:", message.selector);
        
        // Forward the message to the popup
        chrome.runtime.sendMessage({
            from: 'background-script',
            name: 'selection-made',
            selector: message.selector
        }).then(() => {
            console.log("🌊 Background: Message forwarded to popup successfully");
        }).catch(error => {
            console.log("🌊 Background: Popup not available, message not sent:", error);
        });
        
        sendResponse({ success: true });
        return true; // Keep message channel open
    }
    
    // Handle ping messages from popup
    if (message.from === 'popup' && message.name === 'ping') {
        console.log("🌊 Background: Received ping from popup, forwarding to content script");
        
        // Get the active tab and send ping message to content script
        chrome.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            if (!tabs || tabs.length === 0) {
                console.error('🌊 No active tabs found for ping');
                sendResponse({ success: false, error: 'No active tabs found' });
                return;
            }
            
            // Check if the tab URL is accessible
            const tabUrl = tabs[0].url;
            if (tabUrl && (tabUrl.startsWith('chrome://') || tabUrl.startsWith('chrome-extension://') || tabUrl.startsWith('moz-extension://'))) {
                console.log('🌊 Skipping ping for restricted URL:', tabUrl);
                sendResponse({ success: false, error: 'Restricted URL' });
                return;
            }
            
            console.log(`🌊 Background sending ping to tab:`, tabs[0].url);
            
            // Send ping message to content script via window.postMessage
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (messageData) => {
                    console.log("🌊 Background script injecting ping to content script:", messageData);
                    window.postMessage({
                        source: 'wave-reader-extension',
                        message: messageData
                    }, '*');
                },
                args: [new PingMessage({
                    timestamp: Date.now(),
                    source: 'background-script'
                })]
            }).then(() => {
                console.log('🌊 Background script ping injected successfully');
                sendResponse({ success: true });
            }).catch((error) => {
                console.log('🌊 Background script failed to inject ping:', error);
                sendResponse({ success: false, error: error.message });
            });
        }).catch((error) => {
            console.error('🌊 Error querying tabs for ping:', error);
            sendResponse({ success: false, error: error.message });
        });
        
        return true; // Keep message channel open
    }
    
    // Handle pong responses from content script
    if (message.from === 'shadow-content-script' && message.name === 'pong') {
        console.log("🌊 Background: Received pong from shadow content script:", message.timestamp);
        
        // Forward pong to popup if needed
        chrome.runtime.sendMessage({
            from: 'background-script',
            name: 'pong',
            timestamp: message.timestamp,
            source: 'shadow-content-script'
        }).then(() => {
            console.log("🌊 Background: Pong forwarded to popup successfully");
        }).catch(error => {
            console.log("🌊 Background: Popup not available for pong:", error);
        });
        
        sendResponse({ success: true });
        return true; // Keep message channel open
    }
    
    // Handle other existing messages
    if (!guardLastError()) {
        console.log('background message: ', message)
    }

    //debugger;
    if (message.from === 'popup') {
        // Get the tab that the popup was opened from - use currentWindow for more reliability
        chrome.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            if (!tabs || tabs.length === 0) {
                console.error('🌊 No active tabs found in current window');
                // Try alternative query
                return chrome.tabs.query({active: true, lastFocusedWindow: true});
            }
            return tabs;
        }).then((tabs) => {
            if (!tabs || tabs.length === 0) {
                console.error('🌊 No active tabs found in any window');
                sendResponse(false);
                return;
            }
            
            console.log(`🌊 Background script sending message to tab:`, tabs[0].url);
            
            // Send message to content script via window.postMessage since it's in ISOLATED world
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (messageData) => {
                    console.log("🌊 Background script injecting message to content script:", messageData);
                    window.postMessage({
                        source: 'wave-reader-extension',
                        message: messageData
                    }, '*');
                },
                args: [message]
            }).then(() => {
                console.log('🌊 Background script message injected successfully');
                sendResponse(true);
            }).catch((error) => {
                console.error('🌊 Background script failed to inject message:', error);
                sendResponse(false);
            });
        }).catch((error) => {
            console.error('🌊 Error querying tabs:', error);
            sendResponse(false);
        });
        
        return true; // Keep message channel open for async response
    }
    
    sendResponse(false);
    return false;
});



console.log('background script loaded...')



// Function to send update-going-state message
// const sendUpdateGoingState = (tabId, going) => {
//     chrome.scripting.executeScript({
//         target: { tabId: tabId },
//         func: (messageData) => {
//             console.log("🌊 Background script injecting update-going-state to content script:", messageData);
//             window.postMessage({
//                 source: 'wave-reader-extension',
//                 message: messageData
//             }, '*');
//         },
//         args: [new UpdateGoingStateMessage({ going })]
//     }).then(() => {
//         console.log('🌊 Background script update-going-state injected successfully');
//     }).catch((error) => {
//         console.log('🌊 Background script failed to inject update-going-state:', error);
//     });
// };

// Function to send ping to content scripts
const sendPingToContentScripts = () => {
    chrome.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        if (!tabs || tabs.length === 0) {
            console.log('🌊 No active tabs found for ping test');
            return;
        }
        
        const tab = tabs[0];
        const tabUrl = tab.url;
        
        // Check if the tab URL is accessible
        if (tabUrl && (tabUrl.startsWith('chrome://') || tabUrl.startsWith('chrome-extension://') || tabUrl.startsWith('moz-extension://'))) {
            console.log('🌊 Skipping ping test for restricted URL:', tabUrl);
            return;
        }
        
        console.log(`🌊 Background sending ping test to tab:`, tabUrl);
        
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (messageData) => {
                console.log("🌊 Background script injecting ping test to content script:", messageData);
                window.postMessage({
                    source: 'wave-reader-extension',
                    message: messageData
                }, '*');
            },
            args: [new PingMessage({
                timestamp: Date.now(),
                source: 'background-script'
            })]
        }).then(() => {
            console.log('🌊 Background script ping test injected successfully');
        }).catch((error) => {
            console.log('🌊 Background script failed to inject ping test:', error);
        });
    }).catch((error) => {
        console.error('🌊 Error querying tabs for ping test:', error);
    });
};

// Set up periodic ping test (every 30 seconds)
setInterval(() => {
    sendPingToContentScripts();
}, 30000);

// TODO: try https://github.com/fregante/content-scripts-register-polyfill if simply not calling this doesn't work
//       it may be that the duplicate rules are throwing errors because we register in the manifest and the background.js
//       which prevents this from working at all.
//

//chrome.runtime.onInstalled.addListener(() => {
//     chrome.declarativeContent.onPageChanged.addRules([
//         {
//             conditions: [
//                 new chrome.declarativeContent.PageStateMatcher({
//                     pageUrl: { urlMatches: "https://*/*" }
//                 }),
//             ],
//             // And shows the extension's page action.
//             actions: [new chrome.declarativeContent.ShowPageAction()],
//         },
//     ]);

const initializeContentInterchange = () => {

    chrome.windows.getCurrent(w => {
        chrome.tabs.query({active: true, windowId: w.id}).then((tabs) => {
            if (!tabs || tabs.length === 0) {
                console.log('🌊 No active tabs found for initialization');
                return;
            }
            
            // Check if the tab URL is accessible (not chrome:// or chrome-extension://)
            const tabUrl = tabs[0].url;
            if (tabUrl && (tabUrl.startsWith('chrome://') || tabUrl.startsWith('chrome-extension://') || tabUrl.startsWith('moz-extension://'))) {
                console.log('🌊 Skipping StartMessage for restricted URL:', tabUrl);
                return;
            }
            
            // First, check if content script is loaded by trying to inject a test script
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    // Check if our content script is loaded
                    if (window.waveReaderShadow) {
                        console.log('🌊 Content script is loaded and available');
                        return true;
                    } else {
                        console.log('🌊 Content script not found in window object');
                        return false;
                    }
                }
            }).then((results) => {
                if (results && results[0] && results[0].result) {
                    console.log('🌊 Content script is ready, sending StartMessage');
                                // Send StartMessage via window.postMessage
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (messageData) => {
                    console.log("🌊 Background script injecting StartMessage to content script:", messageData);
                    window.postMessage({
                        source: 'wave-reader-extension',
                        message: messageData
                    }, '*');
                },
                args: [new StartMessage()]
            }).then(() => {
                console.log('🌊 Background script StartMessage injected successfully');
            }).catch((error) => {
                console.log('🌊 Background script failed to inject StartMessage:', error);
            });
                } else {
                    console.log('🌊 Content script not ready yet, will retry later');
                }
            }).catch((error) => {
                console.log('🌊 Error checking content script status:', error);
            });
            
            guardLastError()
        }).catch((error) => {
            console.log('🌊 Error querying tabs for initialization:', error);
        })
    })

    // This duplicate listener is causing conflicts - removing it
    // chrome.runtime.onMessage.addListener((message, sender, callback) => {
    //     if (!guardLastError()) {
    //         console.log('background message: ', message)
    //     }

    //     //debugger;
    //     if (message.from === 'popup') {
    //         // Get the tab that the popup was opened from
    //         chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
    //             if (!tabs || tabs.length === 0) {
    //                 console.error('🌊 No active tabs found');
    //                 callback(false);
    //                 return;
    //             }
                
    //             console.log(`🌊 Background script sending message to tab:`, tabs[0].url);
                
    //             // Use window.postMessage to communicate with content script in MAIN world
    //             chrome.scripting.executeScript({
    //                 target: { tabId: tabs[0].id },
    //                 func: (messageData) => {
    //                     window.postMessage({
    //                         source: 'wave-reader-extension',
    //                         message: messageData
    //                     }, '*');
    //                 },
    //                 args: [{
    //                     ...message,
    //                     from: 'popup'
    //                 }]
    //             });
                
    //             guardLastError();
    //             callback(true);
    //         }).catch(error => {
    //             console.error('🌊 Error querying tabs:', error);
    //             callback(false);
    //         });
    //     } else if (message.from === 'content-script') {
    //         // Handle messages from content script
    //         if (message.name === 'selection-made') {
    //             console.log('🌊 Background received selection-made:', message.selector);
                
    //             // Update settings with new selector
    //             backgroundSettingsService.updateCurrentSettings((options) => {
    //                 options.wave.selector = message.selector;
    //                 options.selectors.push(message.selector);
    //                 options.wave.update();
    //                 return options;
    //             });
                
    //             // Forward to popup if it's open
    //             chrome.runtime.sendMessage({
    //                 from: 'background',
    //                 name: 'selection-made',
    //                 selector: message.selector
    //             });
                
    //             callback(true);
    //         } else {
    //             // Forward other content script messages
    //             chrome.runtime.sendMessage(message, callback);
    //         }
    //         guardLastError();
    //     } else if (message.name === 'update-going-state') {
    //         // Handle going state updates from content script
    //         chrome.storage.sync.set({ going: { going: message.going } });
    //         guardLastError();
    //         callback(true);
    //     } else {
    //         console.log('unknown source!');
    //     }

    //     guardLastError()
    //     // returning true or false is meaningful
    //     return true;
    // });
}

// Initialize the message listener with a delay to allow content script to load
console.log("🌊 Background script: Waiting for content script to initialize...");
setTimeout(() => {
    initializeContentInterchange();
}, 1000);



// The content script is loaded automatically by the manifest
// No need for manual injection
