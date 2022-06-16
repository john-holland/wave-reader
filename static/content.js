import {guardLastError} from "../src/util/util";
import {getMousePos, mousePos} from "../src/util/mouse";
import {replaceAnimationVariables} from "../src/models/wave";

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

function loadCSSTemplate(css) {
    unloadCSS();
    setTimeout(() => loadCSS(css));
}
console.log("content script loaded...")

// loadCSSTemplate("\n@-webkit-keyframes wobble {\n  0% { transform: translateX(0%); rotateY(-2deg); }\n  15% { transform: translateX(-1%) rotateY(2deg); }\n}\n\n.wave-reader__text {\n  font-size: initial;\n  -webkit-animation-name: wobble;\n  animation-name: wobble;\n  -webkit-animation-duration: 4s;\n  animation-duration: 4s;\n  -webkit-animation-fill-mode: both;\n  animation-fill-mode: both;\n  animation-iteration-count: infinite;\n}\n"
//     .replaceAll("wave-reader__text", "test"));

const applyMouseMove = (event, selector, message, elements) => {
    const { rotationAmountY, translationAmountX } = mousePos(message.wave.axisRotationAmountYMax, event, elements);
    unloadCSS();
    loadCSS(replaceAnimationVariables(wave, translationAmountX, rotationAmountY));
}

chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
        console.log(`message: ${JSON.stringify(message)}`)

        if (guardLastError()) {
            return false;
        }

        if (message.from !== "popup") {
            return false;
        }

        if (message.name === "start") {
            loadCSSTemplate(message.wave.cssTemplate)
        } else if (message.name === "stop") {
            unloadCSS()
        } else if (message.name === "update-wave") {
            unloadCSS()
            loadCSSTemplate(message.wave.cssTemplate)
        } else if (message.name === "start-selection-choose") {
            console.log('start selection choose')
        } else if (message.name === "stop-mouse-move") {
            // maybe unloadCSS and reload each time?
            unloadCSS()
        } else if (message.name === "start-mouse-move") {
            const elements = document.querySelectorAll(message.wave.selector);
            elements.forEach(element => {
                element.addEventListener("mousemove", (e) => {
                    applyMouseMove(e, message.wave.selector, message, elements)
                });
            })
        } else {
            console.log('unknown message name' + message.name)
        }

        sendResponse(true);

    return true;
});

// maybe a nyan cat easter egg?
