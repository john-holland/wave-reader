import "regenerator-runtime/runtime";
// chrome.runtime.onInstalled?.addListener(() => {
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
//       ...
// });
// import 'regenerator-runtime/runtime'
// import registerContentScript from 'content-scripts-register-polyfill/ponyfill.js';

import p, { guardLastError } from "../src/util/util";
import StartMessage from "../src/models/messages/start";
import Options from "../src/models/options";
import { getSyncObject, setSyncObject } from "../src/util/sync";

import { clientForLocation } from "../src/config/robotcopy";
import { ClientLocation } from "../src/util/state-machine";

const BackgroundClient = clientForLocation(ClientLocation.BACKGROUND)
const APIClient = clientForLocation(ClientLocation.API)
const AuthClient = clientForLocation(ClientLocation.AUTH)

// Background Settings Service
class BackgroundSettingsService {
    constructor() {
        this.initializeSettingsListener();
    }

    async getCurrentSettings() {
        return new Promise((resolve) => {
            getSyncObject("options", Options.getDefaultOptions(), (options) => {
                resolve(new Options(options));
            });
        });
    }

    async updateCurrentSettings(update) {
        return new Promise((resolve) => {
            getSyncObject("options", Options.getDefaultOptions(), (currentOptions) => {
                const updatedOptions = update(new Options(currentOptions));
                setSyncObject("options", updatedOptions, () => {
                    // Notify content scripts of settings change
                    this.notifyContentScriptsOfSettingsChange(updatedOptions);
                    resolve(updatedOptions);
                });
            });
        });
    }

    notifyContentScriptsOfSettingsChange(settings) {
        // This would notify content scripts when settings change
        console.log("🌊 Background: Settings changed, would notify content scripts");
    }

    initializeSettingsListener() {
        // Listen for settings-related messages
        console.log("🌊 Background: Settings service initialized");
    }
}

// Initialize the background settings service
const backgroundSettingsService = new BackgroundSettingsService();

// Listen for messages from content scripts and forward to popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("🌊 Background received message:", message);
    console.log("🌊 Message sender:", sender);
    console.log("🌊 Message from:", message.from);
    console.log("🌊 Message name:", message.name);
    
    // Handle ping messages from popup
    if (message.from === 'popup' && message.name === 'ping') {
        console.log("🌊 Background: Responding to popup ping");
        sendResponse({ success: true, message: 'Background script is ready' });
        return true;
    }
    
    // Handle window.postMessage messages from content scripts
    if (message && message.source === 'wave-reader-extension' && message.message) {
        const contentMessage = message.message;
        console.log("🌊 Background received window.postMessage from content:", contentMessage);
        
        if (contentMessage.from === 'content-script' && contentMessage.name === 'selection-made') {
            console.log("🌊 Background forwarding selection-made to popup:", contentMessage.selector);
            
            // Forward the message to the popup
            chrome.runtime.sendMessage({
                from: 'background-script',
                name: 'selection-made',
                selector: contentMessage.selector
            }).then(() => {
                console.log("🌊 Background: Message forwarded to popup successfully");
                
                // Send confirmation back to content script
                chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
                    if (tabs && tabs.length > 0) {
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            func: () => {
                                window.postMessage({
                                    source: 'wave-reader-extension',
                                    message: {
                                        name: 'selection-confirmed'
                                    }
                                }, '*');
                            }
                        }).then(() => {
                            console.log("🌊 Background: Confirmation sent to content script");
                        }).catch(error => {
                            console.error("🌊 Background: Failed to send confirmation to content script:", error);
                        });
                    }
                });
            }).catch(error => {
                console.log("🌊 Background: Popup not available, message not sent:", error);
                
                // Still send confirmation even if popup is not available
                chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
                    if (tabs && tabs.length > 0) {
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            func: () => {
                                window.postMessage({
                                    source: 'wave-reader-extension',
                                    message: {
                                        name: 'selection-confirmed'
                                    }
                                }, '*');
                            }
                        });
                    }
                });
            });
            
            sendResponse({ success: true });
            return true;
        }
    }
    
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
    
    // Handle other existing messages
    if (!guardLastError()) {
        console.log('background message: ', message)
    }

    //debugger;
    if (message.from === 'popup') {
        // Get the tab that the popup was opened from
        chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
            if (!tabs || tabs.length === 0) {
                console.error('🌊 No active tabs found');
                sendResponse(false);
                return;
            }
            
            console.log(`🌊 Background script sending message to tab:`, tabs[0].url);
            
            // Use window.postMessage to communicate with content script in MAIN world
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (message) => {
                    window.postMessage(message, '*');
                },
                args: [message]
            }).then(() => {
                console.log('🌊 Background script message sent to content script');
                sendResponse(true);
            }).catch((error) => {
                console.error('🌊 Background script failed to send message to content script:', error);
                sendResponse(false);
            });
        });
        
        return true; // Keep message channel open for async response
    }
    
    sendResponse(false);
    return false;
});

const currentTab = () => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            resolve(tabs);
        }).catch(e => {
            console.log('error getting current tab: ', e);
            reject(e);
        });
    });
}

console.log('background script loaded...')


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
            chrome.tabs.sendMessage(tabs[0].id, new StartMessage());
            guardLastError()
        })
    })

    chrome.runtime.onMessage.addListener((message, sender, callback) => {
        if (!guardLastError()) {
            console.log('background message: ', message)
        }

        //debugger;
        if (message.from === 'popup') {
            // Get the tab that the popup was opened from
            chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
                if (!tabs || tabs.length === 0) {
                    console.error('🌊 No active tabs found');
                    callback(false);
                    return;
                }
                
                console.log(`🌊 Background script sending message to tab:`, tabs[0].url);
                
                // Use window.postMessage to communicate with content script in MAIN world
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: (messageData) => {
                        window.postMessage({
                            source: 'wave-reader-extension',
                            message: messageData
                        }, '*');
                    },
                    args: [{
                        ...message,
                        from: 'popup'
                    }]
                });
                
                guardLastError();
                callback(true);
            }).catch(error => {
                console.error('🌊 Error querying tabs:', error);
                callback(false);
            });
        } else if (message.from === 'content-script') {
            // Handle messages from content script
            if (message.name === 'selection-made') {
                console.log('🌊 Background received selection-made:', message.selector);
                
                // Update settings with new selector
                backgroundSettingsService.updateCurrentSettings((options) => {
                    options.wave.selector = message.selector;
                    options.selectors.push(message.selector);
                    options.wave.update();
                    return options;
                });
                
                // Forward to popup if it's open
                chrome.runtime.sendMessage({
                    from: 'background',
                    name: 'selection-made',
                    selector: message.selector
                });
                
                callback(true);
            } else {
                // Forward other content script messages
                chrome.runtime.sendMessage(message, callback);
            }
            guardLastError();
        } else if (message.name === 'update-going-state') {
            // Handle going state updates from content script
            chrome.storage.sync.set({ going: { going: message.going } });
            guardLastError();
            callback(true);
        } else {
            console.log('unknown source!');
        }

        guardLastError()
        // returning true or false is meaningful
        return true;
    });
}

// Initialize the message listener immediately
initializeContentInterchange();

// The content script is loaded automatically by the manifest
// No need for manual injection
