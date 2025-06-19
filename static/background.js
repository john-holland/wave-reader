import "regenerator-runtime/runtime";
// chrome.runtime.onInstalled?.addListener(() => {
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
//       ...
// });
// import 'regenerator-runtime/runtime'
// import registerContentScript from 'content-scripts-register-polyfill/ponyfill.js';

import p, { guardLastError } from "../src/util/util";
import StartMessage from "../src/models/messages/start";

import { clientForLocation } from "../src/config/robotcopy";
import { ClientLocation } from "../src/util/state-machine";

const BackgroundClient = clientForLocation(ClientLocation.BACKGROUND)
const APIClient = clientForLocation(ClientLocation.API)
const AuthClient = clientForLocation(ClientLocation.AUTH)


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
            });
        } else if (message.from === 'content') {
            chrome.runtime.sendMessage(message, callback);
            guardLastError()
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
