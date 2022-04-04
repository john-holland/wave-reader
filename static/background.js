chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlMatches: "https:/*/*" },
                    }),
                ],
                // And shows the extension's page action.
                actions: [new chrome.declarativeContent.ShowPageAction()],
            },
        ]);
    });
});

chrome.webNavigation.onCompleted.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { cmd: "fetchBg" }, () => {});
    });
});