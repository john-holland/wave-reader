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
            chrome.windows.getCurrent(w => {
                chrome.tabs.query({active: true, windowId: w.id}).then((tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, message);
                    guardLastError()
                    callback(true);
                })
            })
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

//const CONTENT_SCRIPT_ID = 'content_script_wave_reader';


chrome.scripting.getRegisteredContentScripts().then((scripts) => {
    console.log(`registered scripts: ${scripts}`);

    return p(resolve => {
        currentTab().then((tabs) => {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id, allFrames: true},
                files: ['content.js']
            }, resolve);
        }).catch(guardLastError);
    })

}).then(initializeContentInterchange);

    // if (scripts.some(script => script.id === CONTENT_SCRIPT_ID)) {
    //     return Promise.resolve()
    // } else {
    //     return p(resolve => {
    //
    //return chrome.scripting.registerContentScripts([{
    //id: CONTENT_SCRIPT_ID,
    //  matches: ['*://*/*'],
    //runAt: 'document_start',

     //   });
   // }
    // chrome.runtime.onConnect.addListener((port) => {
    //
    //     const popupPort = chrome.runtime.connect({ name: "popup" });
    //     const contentPort = chrome.runtime.connect({ name: "content" });
    //
    //     popupPort.onMessage.addListener((message, sender, sendResponse) => {
    //         debugger;
    //         if (message.from === 'content') {
    //             chrome.runtime.sendMessage(message, sendResponse)
    //         } else {
    //             throw new Error("popupPort has inbound message not directed to content")
    //         }
    //
    //         return true;
    //     });
    //
    //     contentPort.onMessage.addListener((message, sender, sendResponse) => {
    //         if (message.from === 'popup') {
    //             currentTab((tabs) => {
    //                 return chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
    //             })
    //         } else {
    //             throw new Error("contentPort has inbound message not directed to popup")
    //         }
    //
    //         return true;
    //     });
    // });

    // });
