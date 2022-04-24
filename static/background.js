// chrome.runtime.onInstalled?.addListener(() => {
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
//       ...
// });

const currentTab = (callback) => {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        callback(tabs);
    }).catch(e => console.log('error getting current tab: ', e));
}

chrome.tabs.onActivated.addListener(() => {
    chrome.declarativeContent.onPageChanged.addRules([
        {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { urlMatches: "https://*/*" },
                }),
            ],
            // And shows the extension's page action.
            actions: [new chrome.declarativeContent.ShowPageAction()],
        },
    ]);

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

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.from === 'popup') {
            //currentTab((tabs) => {
            chrome.windows.getCurrent(w => {
                chrome.tabs.query({active: true, windowId: w.id}).then((tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
                })
            })
        } else if (message.from === 'content') {
            chrome.runtime.sendMessage(message, sendResponse)
        }

        return true;
    });
});
