import { guardLastError } from "../src/util/util";
import { mousePos } from "../src/util/mouse";
import { replaceAnimationVariables } from "../src/models/wave";
import { FollowKeyChordObserver, WindowKeyDownKey } from "../src/components/util/user-input";
import StateMachine  from "../src/util/state-machine";
import { CState } from "../src/util/state";
import {
    BaseVentures,
    StartVentures,
    StopVentures,
    WavingVentures,
    AllVentures,
    Base
} from "../src/util/venture-states";

// if a promised resolved state is a future, then a potential state maybe nicely referred to as a venture?


const stateMachineMap = new Map();
stateMachineMap.set("base", Base);

const stateMachine = new StateMachine()

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

let stopKeyChordEventListenerPredicate = () => {
    if (callStop && eventListener !== undefined) {
        window.removeEventListener("keydown", eventListener);
    }
    // fx. callstop
}

const initializeOrUpdateToggleObserver = (message) => {
    if (keychordObserver !== undefined) {
        stopKeyChordEventListenerPredicate();
    }

    //TODO: debounce
    keychordObserver = FollowKeyChordObserver(
        message.options.toggleKeys.keyChord,
        WindowKeyDownKey((e/*{(event: KeyboardEvent): void}*/) => {
            eventListener = e
        }),
        stopKeyChordEventListenerPredicate
    ).subscribe(() => {
        // TODO: refactor with a state machine manager or something, like a WaveRemote class etc
        if (stateMachine.getCurrentState().name === "waving") {
            stateMachine.handle(stateMachine.getState("toggle stop"))
        } else {
            stateMachine.handle(stateMachine.getState("toggle start"))
        }
    });
}

/**
 side effects on states or partial states?
 mouse move vs css requires remove listener / timer
 * [state from base level event]
    * [ventures] (transition states)
    * [isBaseLevel] whether or not this is requires validation using possible states
 */

function StateNameMap(map = new Map()) {
    /* eslint-disable  @typescript-eslint/no-unused-vars */
    const states = {
        // base defined above
        "waving": CState("waving", WavingVentures, false),
        "error": CState("error", AllVentures, true, (message, state, previousState) => {
            console.log("transitioning from error to base state from " + previousState.name)
            return map.get('base')
        }, true),
        "start": CState("start", StartVentures, false, (message, state, previousState) => {
            loadCSSTemplate(message.options.wave.cssTemplate)
            // TODO: see if the state machine will let us remove this
            going = true;
            initializeOrUpdateToggleObserver(message);
            return map.get('waving')
            }, false),
        "stop": CState("stop", StopVentures, false, (message, state, previousState) => {
            unloadCSS()
            going = false;
            return map.get('base')
        }, false),
        "update": CState("update", BaseVentures, false, (message, state, previousState) => {
            unloadCSS()
            if (previousState.name === "waving") {
                loadCSSTemplate(message.options.wave.cssTemplate)
            }

            // may need to separate steps for clarity
            initializeOrUpdateToggleObserver(message);
            return previousState
            }, true),
        "toggle start": CState("toggle start", StartVentures, false, (message, state, previousState) => {
            loadCSSTemplate(message.options.wave.cssTemplate)
            return map.get('waving')
            }, false),
        "toggle stop": CState("toggle stop", StopVentures, false, (message, state, previousState) => {
            unloadCSS()
            return map.get('base')
            }, false),
        "start mouse": CState("start mouse", StartVentures, false, (message, state, previousState) => {
            const elements = document.querySelectorAll(message.options.wave.selector);
            elements.forEach(element => {
                element.addEventListener("mousemove", mouseMoveListener);
            })
            return map.get('waving')
            }, false),
        "stop mouse": CState("stop mouse", StopVentures, false, (message, state, previousState) => {
            // maybe unloadCSS and reload each time?
            unloadCSS()
            const elements = document.querySelectorAll(message.options.wave.selector);
            elements.forEach(element => {
                element.removeEventListener("mousemove", mouseMoveListener);
            })
            return map.get('base')
            }, false),
        "selection mode activate": CState("selection mode activate", ["selection mode deactivate", "selection made"], false, (message, state, previousState) => {
            console.log('start selection choose cheese')
            // mouse over / enter / blur tracking
            // highlight element if larger than 20px and contains text (maybe option to select everything)
            // (maybe option to change size)
            // plus and minus buttons to bubble the selection up or select/drill down
            // show textual elements with transparent background colors,
            // pick quads or triads, then half stops as selections
            //  -> start with base colors, then pastels
            // $ => on mouse over, dim element by #eee overlay - like a potato chip
            //      shift click to select sub element, or [+] button
            //      overlay goes away, and sub elements are clickable
            //          hovering over sub elements reveals sub elements down to a specific size
            // $ => press [-] button to bubble the selection up to the next level of elements
            return map.get('selection mode')
        }),
        "selection mode": CState("selection mode", ["selection mode activate", "selection mode", "selection made", "selection mode deactivate"], false),
        "selection made": CState("selection made", BaseVentures, false, (message, state, previousState) => {
            return map.get('base')
            }, false),
        "selection mode deactivate": CState("selection mode deactivate", [], false, (message, state, previousState) => {
            return map.get('base')
            }, false)
    }

    // i'd prefer a native map.addAll method, but this allows a retrofit
    Object.keys(states).forEach(key => map.set(key, states[key]));

    if (!map.has("base")) {
        map.set("base", Base);
    }

    this.map = map;
    this.getState = (name) => {
        return this.map.get(name);
    }
}

let going = false;

stateMachine.initialize(new StateNameMap(stateMachineMap), Base);

chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
        console.log(`message: ${JSON.stringify(message)}`)

        if (guardLastError()) {
            return false;
        }

        if (message.from !== "popup") {
            return false;
        }

        stateMachine.handleState(message, stateMachine);

        sendResponse(true);

    return true;
});

// maybe a nyan cat easter egg?
