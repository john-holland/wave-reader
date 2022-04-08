
function loadCSS(css) {
    var head = document.head || document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.id = "extension";
    style.textContent = css;
    head.appendChild(style);
}

function unloadCSS() {
    var cssNode = document.getElementById("extension");
    cssNode?.parentNode?.removeChild(cssNode);
}

function setBg(css) {
    unloadCSS();
    setTimeout(() => loadCSS(css));
}

const backgroundPort = chrome.runtime.connect({ name: "content" });

//chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
backgroundPort.onMessage.addListener((message, port) => {
    console.log(`message: ${message}`)
    if (message.name === "start") {
        setBg(message.wave.cssTemplate)
    } else if (message.name === "stop") {
        unloadCSS()
    } else if (message.name === "update-wave") {
        setBg(message.wave.cssTemplate)
    } else if (message.name === "start-selection-choose") {
        console.log('start selection choose')
    }
    // else if (message.name === "bootstrap") {
    //     message.from = "content";
    //     chrome.runtime.sendMessage(message)
    // }

    return true;
});

// maybe a nyan cat easter egg?
