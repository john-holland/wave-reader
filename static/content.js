import "regenerator-runtime/runtime";
import { guardLastError } from "../src/util/util";
import { mousePos } from "../src/util/mouse";
import { replaceAnimationVariables } from "../src/models/wave";
import { FollowKeyChordObserver, WindowKeyDownKey } from "../src/components/util/user-input";
import StateMachine  from "../src/util/state-machine";
import { CState } from "../src/util/state";
import debounce from "../src/util/debounce";
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
import SelectionModeMessage from "../src/models/messages/selection-mode";
import {MountOrFindSelectorHierarchyComponent} from "../src/components/selector-hierarchy";
import {ColorGeneratorService, SelectorHierarchy} from "../src/services/selector-hierarchy";
import SelectionMadeMessage from "../src/models/messages/selection-made";
import { clientForLocation } from "../src/config/robotcopy";
import { ClientLocation } from "../src/util/state-machine";
import {ReactMachine} from "../src/util/react-machine";

console.log("🌊 Wave Reader content script is loading on:", window.location.href);

const ContentClient = clientForLocation(ClientLocation.CONTENT)

// Content script runs in MAIN world, so chrome APIs are not available
// We'll use a different approach for communication
console.log("🌊 Content script running in MAIN world - chrome APIs not available");

// Set up a message listener that works in MAIN world
window.addEventListener('message', (event) => {
    // Only handle messages from our extension
    if (event.source !== window || !event.data || event.data.source !== 'wave-reader-extension') {
        return;
    }

    const message = event.data.message;
    console.log(`🌊 Content script received message: ${JSON.stringify(message)}`);

    try {
        console.log(`🌊 Processing message: ${message.name}`);
        stateMachine.handleState(message);
        console.log(`🌊 Message processed successfully`);
    } catch (e) {
        console.error(`🌊 Failed to process message: ${JSON.stringify(message)}, error: ${e.message}`);
    }
});

const stateMachineMap = new Map();
stateMachineMap.set("base", Base);

//const settingsService = SettingsService.withTabUrlProvider(() => Promise.resolve(document.location.href));

const stateMachine = new StateMachine()

let latestOptions = undefined;

function loadCSS(css) {
    const head = document.head || document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.id = "extension";
    style.textContent = css;
    head.appendChild(style);

    // todo: apply rotated animation with SizeFunctions.calcRotation
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

const toggleWave = debounce(() => {
    if (stateMachine.getCurrentState().name === "waving") {
        stateMachine.handleState(stateMachine.getState("toggle stop"))
    } else {
        stateMachine.handleState(stateMachine.getState("toggle start"))
    }
}, 500, false)

const initializeOrUpdateToggleObserver = (message) => {
    if (keychordObserver !== undefined) {
        stopKeyChordEventListenerPredicate();
    }

    //TODO: debug further for keychord double activation, shouldn't need to debounce beyond feel...
    // todo: draw "feel eel"
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

        toggleWave();
    });
}


/**
 side effects on states or partial states?
 mouse move vs css requires remove listener / timer
 * [state from base level event]
    * [ventures] (transition states)
    * [isBaseLevel] whether or not this is requires validation using possible states
 */

let hierarchySelectorMount = undefined;
const hierarchySelectorService = new SelectorHierarchy(new ColorGeneratorService())
let setHierarchySelector = undefined;

function StateNameMap(map = new Map()) {
    /* eslint-disable  @typescript-eslint/no-unused-vars */
    const states = {
        // base defined above
        "waving": CState("waving", WavingVentures, false, async (message, state, previousState) => {
          return map.get("waving")
        }),
        "error": CState("error", AllVentures, true, async (message, state, previousState) => {
            console.log("transitioning from error to base state from " + previousState.name)
            return map.get('base')
        }, true),
        "start": CState("start", StartVentures, false, async (message, state, previousState) => {
            latestOptions = message.options;
            loadCSSTemplate(latestOptions.wave.cssTemplate)
            // TODO: see if the state machine will let us remove this
            going = true;
            initializeOrUpdateToggleObserver(message);
            return map.get('waving')
        }, false),
        "stop": CState("stop", StopVentures, true, async (message, state, previousState) => {
            unloadCSS()
            going = false;
            return previousState.name === "waving" ? map.get("base") : previousState;
        }, false),
        "update": CState("update", BaseVentures, false, async (message, state, previousState) => {
            unloadCSS()

            if (!message?.options) {
                console.log("warning: update called with no options" + JSON.stringify(message));
                return previousState;
            }

            latestOptions = message.options;

            console.log("Update called with previous state: " + previousState.name);
            if (previousState.name === "waving") {
                loadCSSTemplate(latestOptions.wave.cssTemplate)
            }

            if (setHierarchySelector) {
                setHierarchySelector(latestOptions.wave.selector);
            }

            // may need to separate steps for clarity
            initializeOrUpdateToggleObserver(message);
            return previousState
        }, true),
        "toggle start": CState("toggle start", StartVentures, false, async (message, state, previousState) => {
            loadCSSTemplate(latestOptions.wave.cssTemplate)
            going = true;
            // Send message to background script to update sync storage
            window.postMessage({
                source: 'wave-reader-extension',
                message: {
                    name: 'update-going-state',
                    going: true
                }
            }, '*');
            return map.get('waving')
        }, false),
        "toggle stop": CState("toggle stop", StopVentures, false, async (message, state, previousState) => {
            unloadCSS()
            going = false;
            // Send message to background script to update sync storage
            window.postMessage({
                source: 'wave-reader-extension',
                message: {
                    name: 'update-going-state',
                    going: false
                }
            }, '*');
            return map.get('base')
        }, false),
        "start mouse": CState("start mouse", StartVentures, false, async (message, state, previousState) => {
            // TODO: this may need to be merged with the start and toggle logic
            latestOptions = message.options;
            const elements = document.querySelectorAll(message.options.wave.selector);
            elements.forEach(element => {
                element.addEventListener("mousemove", mouseMoveListener);
            })
            return map.get('waving')
        }, false),
        "stop mouse": CState("stop mouse", StopVentures, false, async (message, state, previousState) => {
            // maybe unloadCSS and reload each time?
            unloadCSS()
            const elements = document.querySelectorAll(message.options.wave.selector);
            elements.forEach(element => {
                element.removeEventListener("mousemove", mouseMoveListener);
            })
            return map.get('base')
        }, false),
        "start-selection-choose":  CState("selection mode activate", ["selection mode activate"], true, async (message, state, previousState) => {
            const selector = message?.selector;

            if (!(selector || "").trim()) {
                console.log("start selection choose activated without selector!")
            }

            // todo: add an id specifyer to the content Client, as iframes make it a 1 - * relationship for background -> content
            /* science!
              hypothesis: previously i did not include the world parameter in the content script manifest
                    it was only getting the extension document
              evidence: found iframe
              conclusion: ?
              theory: borf
              */
            //
            // stateMachine.handleState(new SelectionModeMessage({
            //     selector
            // }))

            hierarchySelectorMount = MountOrFindSelectorHierarchyComponent({
                service: hierarchySelectorService,
                selector,
                passSetSelector: (modifier) => { setHierarchySelector = modifier; },
                onConfirmSelector: (selector) => {
                    console.log("🌊 onConfirmSelector called with selector:", selector);
                    stateMachine.handleState(new SelectionMadeMessage({
                        selector
                    }))
                },
                doc: document
            })

            return map.get('selection mode')
        }, false),
        "selection mode": CState("selection mode", ["selection mode activate", "selection mode", "selection made", "end-selection-choose"], true,(message, state, previousState) => {
            return map.get('selection mode')
        }, false),
        "selection made": CState("selection made", ["end-selection-choose"], true, async (message, state, previousState) => {
            console.log("🌊 Selection made state triggered with selector:", message?.selector);
            
            // Send the selection back to the popup through the background script
            console.log("🌊 Sending selection back to popup via background script...");
            
            return new Promise((resolve) => {
                let messageSent = false;
                let timeoutId;
                
                // Set up a timeout to handle cases where the message isn't received
                timeoutId = setTimeout(() => {
                    if (!messageSent) {
                        console.warn("🌊 Timeout: Selection message not confirmed, trying alternative method...");
                        
                        // Try alternative method - send directly to background script
                        try {
                            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                                chrome.runtime.sendMessage({
                                    from: 'content-script',
                                    name: 'selection-made',
                                    selector: message?.selector
                                }).then(() => {
                                    console.log('🌊 Selection sent via Chrome runtime');
                                }).catch(error => {
                                    console.log('🌊 Failed to send via Chrome runtime:', error);
                                });
                            }
                        } catch (error) {
                            console.error("🌊 Failed to send selection via Chrome runtime:", error);
                        }
                        
                        // Resolve anyway after timeout
                        resolve(map.get('end-selection-choose'));
                    }
                }, 2000); // 2 second timeout
                
                // Listen for confirmation that the message was received
                const handleConfirmation = (event) => {
                    if (event.source === window && event.data && event.data.source === 'wave-reader-extension') {
                        if (event.data.message && event.data.message.name === 'selection-confirmed') {
                            console.log("🌊 Selection confirmed by background script");
                            messageSent = true;
                            clearTimeout(timeoutId);
                            window.removeEventListener('message', handleConfirmation);
                            resolve(map.get('end-selection-choose'));
                        }
                    }
                };
                
                // Add listener for confirmation
                window.addEventListener('message', handleConfirmation);
                
                // Send the message via Chrome runtime
                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                    chrome.runtime.sendMessage({
                        from: 'content-script',
                        name: 'selection-made',
                        selector: message?.selector
                    }).then(() => {
                        console.log("🌊 Selection message sent via Chrome runtime");
                    }).catch(error => {
                        console.error("🌊 Failed to send selection via Chrome runtime:", error);
                        // Try window.postMessage as fallback
                        window.postMessage({
                            source: 'wave-reader-extension',
                            message: {
                                from: 'content-script',
                                name: 'selection-made',
                                selector: message?.selector
                            }
                        }, '*');
                    });
                } else {
                    // Fallback to window.postMessage if Chrome runtime not available
                    window.postMessage({
                        source: 'wave-reader-extension',
                        message: {
                            from: 'content-script',
                            name: 'selection-made',
                            selector: message?.selector
                        }
                    }, '*');
                }
                
                console.log("🌊 Selection message sent, waiting for confirmation...");
            });
        }, false),
        "end-selection-choose": CState("end-selection-choose", BaseVentures, true, async (message, state, previousState) => {
            hierarchySelectorMount.remove()
            setHierarchySelector = undefined;

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

console.log("🌊 Initializing state machine...");
stateMachine.initialize(new StateNameMap(stateMachineMap), Base);
console.log("🌊 State machine initialized with base state");

// settingsService.getCurrentSettings().then(settings => {
//     stateMachine.handleState(new UpdateWaveMessage({ options: settings }))
// })

const ContentReactMachine = ReactMachine({
    
})

console.log("🌊 Content script setup complete, ready to receive messages");

// Check if chrome.runtime is available before setting up message listener
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
        console.log(`🌊 Content script received message: ${JSON.stringify(message)}`)

        if (guardLastError()) {
            console.log('🌊 Guard last error returned true, ignoring message');
            return false;
        }

        // Accept messages from both popup and background-script
        if (message.from !== "popup" && message.from !== "background-script") {
            console.log(`🌊 Message not from popup or background-script, ignoring. From: ${message.from}`);
            return false;
        }

        try {
            console.log(`🌊 Processing message: ${message.name}`);
            stateMachine.handleState(message);
            console.log(`🌊 Message processed successfully`);
        } catch (e) {
            console.error(`🌊 Failed to process message: ${JSON.stringify(message)}, error: ${e.message}`);
            throw new Error(`Failed to process message: ${e.message}`);
        }

        return true;
    });
} else {
    console.warn("🌊 Chrome runtime not available in content script context");
}

// Content script runs in MAIN world, so chrome APIs are not available
// No need for chrome.runtime.connect() or disconnect listener

// maybe a nyan cat easter egg?
