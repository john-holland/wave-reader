import { guardLastError } from "../src/util/util";
import { mousePos } from "../src/util/mouse";
import { replaceAnimationVariables } from "../src/models/wave";
import {FollowKeyChordObserver, WindowKeyDownKey} from "../src/components/util/user-input";

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

const mouseMoveListener = (e) => {
    applyMouseMove(e, message.wave.selector, message, elements)
}

let keychordObserver /*Observable<boolean> | undefined*/ = undefined;
let eventListener /*{(event: KeyboardEvent): void} | undefined*/ = undefined;
let callStop = false;
let stopKeyChordEventListenerPredicate = () => {
    if (callStop && eventListener !== undefined) {
        window.removeEventListener("keydown", eventListener);
    }
    return callStop;
}

const initializeOrUpdateToggleObserver = (message) => {
    if (keychordObserver !== undefined) {
        // a little awkward but it's nice to loosely guard against key events
        callStop = true;
        stopKeyChordEventListenerPredicate();
        callStop = false;
    }

    keychordObserver = FollowKeyChordObserver(
        message.options.toggleKeys.keyChord,
        WindowKeyDownKey((e/*{(event: KeyboardEvent): void}*/) => {
            eventListener = e
        }),
        stopKeyChordEventListenerPredicate
    ).subscribe(() => {
        // TODO: refactor with a state machine manager or something, like a WaveRemote class etc
        if (going) {
            unloadCSS()
            going = false;
        } else {
            loadCSSTemplate(message.options.wave.cssTemplate)
            going = true;
        }
    });
}

let going = false;

chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
        console.log(`message: ${JSON.stringify(message)}`)

        if (guardLastError()) {
            return false;
        }

        if (message.from !== "popup") {
            return false;
        }

        if (message.name === "start") {
            loadCSSTemplate(message.options.wave.cssTemplate)
            going = true;
            initializeOrUpdateToggleObserver(message);
        } else if (message.name === "stop") {
            unloadCSS()
            going = false;
        } else if (message.name === "update-wave") {
            unloadCSS()
            if (going) {
                loadCSSTemplate(message.options.wave.cssTemplate)
            }

            initializeOrUpdateToggleObserver(message);
        } else if (message.name === "start-selection-choose") {
            console.log('start selection choose')
        } else if (message.name === "stop-mouse-move") {
            // maybe unloadCSS and reload each time?
            unloadCSS()
            const elements = document.querySelectorAll(message.options.wave.selector);
            elements.forEach(element => {
                element.removeEventListener("mousemove", mouseMoveListener);
            })
        } else if (message.name === "start-mouse-move") {
            const elements = document.querySelectorAll(message.options.wave.selector);
            elements.forEach(element => {
                element.addEventListener("mousemove", mouseMoveListener);
            })
        } else {
            console.log('unknown message name' + message.name)
        }

        sendResponse(true);

    return true;
});

// maybe a nyan cat easter egg?
