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
import SettingsService from "../src/services/settings"
import UpdateWaveMessage from "../src/models/messages/update-wave";
import Options from "../src/models/options";
import SelectionModeMessage from "../src/models/messages/selection-mode";

const stateMachineMap = new Map();
stateMachineMap.set("base", Base);

const settingsService = new SettingsService();

const stateMachine = new StateMachine()

let latestOptions = undefined;

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
    if (eventListener !== undefined) {
        window.removeEventListener("keydown", eventListener);
    }
    // fx. callstop
}

const initializeOrUpdateToggleObserver = (message) => {
    if (keychordObserver !== undefined) {
        stopKeyChordEventListenerPredicate();
    }

    //TODO: debounce?
    keychordObserver = FollowKeyChordObserver(
        message.options.toggleKeys.keyChord,
        WindowKeyDownKey((e/*{(event: KeyboardEvent): void}*/) => {
            eventListener = e
        }, false),
        stopKeyChordEventListenerPredicate
    ).subscribe((matched) => {
        if (!matched) {
            return;
        } else {
            console.log("matched: "+ matched)
        }

        if (stateMachine.getCurrentState().name === "waving") {
            stateMachine.handleState(stateMachine.getState("toggle stop"))
        } else {
            stateMachine.handleState(stateMachine.getState("toggle start"))
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
            latestOptions = message.options;
            loadCSSTemplate(latestOptions.wave.cssTemplate)
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
            latestOptions = message.options;
            console.log("Update called with previous state: " + previousState.name);
            if (previousState.name === "waving") {
                loadCSSTemplate(latestOptions.wave.cssTemplate)
            }

            // may need to separate steps for clarity
            initializeOrUpdateToggleObserver(message);
            return previousState
        }, true),
        "toggle start": CState("toggle start", StartVentures, false, (message, state, previousState) => {
            loadCSSTemplate(latestOptions.wave.cssTemplate)
            return map.get('waving')
        }, false),
        "toggle stop": CState("toggle stop", StopVentures, false, (message, state, previousState) => {
            unloadCSS()
            return map.get('base')
        }, false),
        "start mouse": CState("start mouse", StartVentures, false, (message, state, previousState) => {
            // TODO: this may need to be merged with the start and toggle logic
            latestOptions = message.options;
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
        "start-selection-choose":  CState("selection mode activate", ["selection mode activate"], false, (message, state, previousState) => {
            const selector = message?.selector;

            if (!(selector || "").trim()) {
                console.log("start selection choose activated without selector!")
            }

            stateMachine.handleState(new SelectionModeMessage({
                selector
            }))

            return map.get('selection mode')
        }, false),
        "selection mode": CState("selection mode", ["selection mode activate", "selection mode", "selection made", "selection mode deactivate"], (message, state, previousState) => {
            // todo: make component mount and render HierarchySelectorComponent
            document.querySelector("#wave-reader-component-mount")

            return map.get('base')
        }, false),
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

settingsService.getCurrentSettings().then(settings => {
    stateMachine.handleState(new UpdateWaveMessage({ options: settings }))
})

chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
        console.log(`message: ${JSON.stringify(message)}`)

        if (guardLastError()) {
            return false;
        }

        if (message.from !== "popup") {
            return false;
        }

        try {
            stateMachine.handleState(message);
        } catch (e) {
            throw new Error(`Failed with message: ${JSON.stringify(message)}, and error, ${e.message}`);
        }

        sendResponse(true);

    return true;
});

// maybe a nyan cat easter egg?
