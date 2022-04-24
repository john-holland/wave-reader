
function loadCSS(css) {
    const head = document.head || document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.id = "extension";
    style.textContent = css;
    head.appendChild(style);
}

function unloadCSS() {
    const cssNode = document.getElementById("extension");
    cssNode?.parentNode?.removeChild(cssNode);
}

function setBg(css) {
    unloadCSS();
    setTimeout(() => loadCSS(css));
}

const backgroundPort = chrome.runtime.connect({ name: "content" });

//backgroundPort.onMessage.addListener((message, port) => {
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(`message: ${message}`)

    if (chrome.runtime.lastError) {
        console.log('last error');
    }

    if (message.name === "start") {
        setBg(message.wave.cssTemplate)
    } else if (message.name === "stop") {
        unloadCSS()
    } else if (message.name === "update-wave") {
        setBg(message.wave.cssTemplate)
    } else if (message.name === "start-selection-choose") {
        console.log('start selection choose')
    } else {
        console.log('unknown message name' + message.name)
    }
    // TODO: send current chrome.stormge.local state back with bootstrap
    // else if (message.name === "bootstrap") {
    //     message.from = "content";
    //     chrome.runtime.sendMessage(message)
    // }
    //sendResponse(true);

    return true;
});

// maybe a nyan cat easter egg?
