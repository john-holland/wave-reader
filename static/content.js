import "regenerator-runtime/runtime";
import { guardLastError } from "../src/util/util";
import { mousePos } from "../src/util/mouse";
import { replaceAnimationVariables, replaceAnimationVariablesWithDuration } from "../src/models/wave";
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

import {MountOrFindSelectorHierarchyComponent} from "../src/components/selector-hierarchy";
import {ColorGeneratorService, SelectorHierarchy} from "../src/services/selector-hierarchy";
import SelectionMadeMessage from "../src/models/messages/selection-made";

import {ReactMachine} from "../src/util/react-machine";

// Import shared wave animation module
import {
    enableMouseFollowingWave as sharedEnableMouseFollowingWave,
    disableMouseFollowingWave as sharedDisableMouseFollowingWave,
    getWavePerformanceMetrics as sharedGetWavePerformanceMetrics
} from "../src/util/wave-animation";

// Import centralized state name map factory
import { createStateNameMap } from "../src/util/state-name-map-factory";

// Import centralized animation business logic
import {
    updateWavingStatus as sharedUpdateWavingStatus,
    loadCSS as sharedLoadCSS,
    unloadCSS as sharedUnloadCSS,
    loadCSSTemplate as sharedLoadCSSTemplate,
    replaceAnimationVariables as sharedReplaceAnimationVariables,
    replaceAnimationVariablesWithDuration as sharedReplaceAnimationVariablesWithDuration,
    CSS_MODE__MOUSE,
    CSS_MODE__TEMPLATE
} from "../src/util/animation-business-logic";

// --- Mouse-following wave logic using shared module ---

// Start/stop mouse-following interval using shared module
function enableMouseFollowingWave(options) {
    // Store options globally for compatibility
    window.currentWaveOptions = options;
    window.currentAnimationDuration = options?.wave?.waveSpeed || 4;
    
    // Use shared module with content.js specific CSS functions
    sharedEnableMouseFollowingWave(options, loadCSSTemplate, sharedReplaceAnimationVariablesWithDuration);
}

function disableMouseFollowingWave() {
    // Clear global references
    window.currentWaveOptions = null;
    window.currentAnimationDuration = null;
    
    // Use shared module
    sharedDisableMouseFollowingWave();
}
// --- End Mouse-following wave logic ---

// Debug function to get current performance metrics
function getWavePerformanceMetrics() {
    return sharedGetWavePerformanceMetrics();
}

// Expose for debugging
window.getWavePerformanceMetrics = getWavePerformanceMetrics;

console.log("🌊 Wave Reader content script is loading on:", window.location.href);

// Content script runs in ISOLATED world, so chrome APIs are available
console.log("🌊 Content script running in ISOLATED world - chrome APIs available");

const stateMachineMap = new Map();
stateMachineMap.set("base", Base);

//const settingsService = SettingsService.withTabUrlProvider(() => Promise.resolve(document.location.href));

const stateMachine = new StateMachine()

let latestOptions = undefined;

/**
 * Centralized method to update wave animation status
 * Handles mode changes, CSS updates, and mouse-following wave
 */
function updateWavingStatus(currentOptions, previousOptions) {
    const context = {
        enableMouseFollowingWave,
        disableMouseFollowingWave,
        loadCSSTemplate,
        log: console.log
    };
    sharedUpdateWavingStatus(currentOptions, previousOptions, context, '🌊 Content');
}

function loadCSS(css) {
    const context = {
        log: console.log
    };
    return sharedLoadCSS(css, context, false); // false = not Shadow DOM
}

function unloadCSS() {
    const context = {
        log: console.log
    };
    sharedUnloadCSS(context, false); // false = not Shadow DOM
}

function loadCSSTemplate(css) {
    const context = {
        loadCSS,
        unloadCSS,
        log: console.log
    };
    return sharedLoadCSSTemplate(css, context, false); // false = not Shadow DOM
}
console.log("content script loaded...")

// loadCSSTemplate("\n@-webkit-keyframes wobble {\n  0% { transform: translateX(0%); rotateY(-2deg); }\n  15% { transform: translateX(-1%) rotateY(2deg); }\n}\n\n.wave-reader__text {\n  font-size: initial;\n  -webkit-animation-name: wobble;\n  animation-name: wobble;\n  -webkit-animation-duration: 4s;\n  animation-duration: 4s;\n  -webkit-animation-fill-mode: both;\n  animation-fill-mode: both;\n  animation-iteration-count: infinite;\n}\n"
//     .replaceAll("wave-reader__text", "test"));

const applyMouseMove = (event, selector, message, elements) => {
    try {
        const { rotationAmountY, translationAmountX } = mousePos(message.wave.axisRotationAmountYMax, event, elements);
        unloadCSS();
        const newCSS = replaceAnimationVariables(wave, translationAmountX, rotationAmountY);
        loadCSS(newCSS);
        console.log("🌊 Applied mouse move animation:", { translationAmountX, rotationAmountY });
    } catch (error) {
        console.error("🌊 Error applying mouse move:", error);
    }
}

const mouseMoveListener = (e) => {
    try {
        applyMouseMove(e, message.wave.selector, message, elements);
    } catch (error) {
        console.error("🌊 Error in mouse move listener:", error);
    }
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

// Create StateNameMap using the centralized factory
const StateNameMap = createStateNameMap({
    isShadowDom: false,
    context: {
        latestOptions,
        going,
        setHierarchySelector,
        hierarchySelectorMount,
        hierarchySelectorService,
        stateMachine,
        unloadCSS,
        enableMouseFollowingWave,
        disableMouseFollowingWave,
        updateWavingStatus,
        initializeOrUpdateToggleObserver
    },
    updateWavingStatus,
    enableMouseFollowingWave,
    disableMouseFollowingWave,
    unloadCSS,
    loadCSSTemplate,
    initializeOrUpdateToggleObserver,
    MountOrFindSelectorHierarchyComponent,
    SelectionMadeMessage,
    log: console.log
});

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
console.log("🌊 Content script window object:", typeof window);
console.log("🌊 Content script document object:", typeof document);
console.log("🌊 Content script chrome object:", typeof chrome);

// Auto-initialize wave animation if we have saved options
function autoInitializeWaveAnimation() {
    try {
        // Check if we have saved options in chrome.storage
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            chrome.storage.sync.get(['options', 'going'], (result) => {
                if (result.going && result.going.going && result.options) {
                    console.log('🌊 Auto-initializing wave animation with saved options');
                    latestOptions = result.options;
                    updateWavingStatus(latestOptions, null);
                    going = true;
                }
            });
        }
    } catch (error) {
        console.warn('🌊 Auto-initialization failed:', error);
    }
}

// Try to auto-initialize after a short delay to ensure DOM is ready
setTimeout(autoInitializeWaveAnimation, 1000);

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

        // Check if we're in a valid DOM context before processing
        if (!document || !document.head) {
            console.warn("🌊 Content script: Not in valid DOM context, skipping message processing");
            sendResponse({ success: false, error: "Invalid DOM context" });
            return false;
        }

        try {
            console.log(`🌊 Processing message: ${message.name}`);
            
            // Handle toggle-wave-reader command from background script
            if (message.name === 'toggle-wave-reader') {
                console.log('🌊 Content script: Handling toggle-wave-reader command');
                toggleWave();
            } else {
                stateMachine.handleState(message);
            }
            
            console.log(`🌊 Message processed successfully`);
            
            // Send response with timeout
            setTimeout(() => {
                try {
                    sendResponse({ success: true });
                } catch (error) {
                    console.warn("🌊 Content script: Failed to send response:", error);
                }
            }, 100); // Small delay to ensure processing is complete
        } catch (e) {
            console.error(`🌊 Failed to process message: ${JSON.stringify(message)}, error: ${e.message}`);
            setTimeout(() => {
                try {
                    sendResponse({ success: false, error: e.message });
                } catch (error) {
                    console.warn("🌊 Content script: Failed to send error response:", error);
                }
            }, 100); // Small delay to ensure processing is complete
        }

        return true; // Keep message channel open for async response
    });
} else {
    console.warn("🌊 Chrome runtime not available in content script context");
}

// Also listen for window.postMessage events from background script
window.addEventListener('message', (event) => {
    // Only handle messages from our extension
    if (event.source !== window || !event.data || event.data.source !== 'wave-reader-extension') {
        return;
    }
    
    const message = event.data.message;
    console.log("🌊 Content script received window.postMessage:", message);

    if (message.from !== "popup" && message.from !== "background-script") {
        console.log("🌊 Message not from popup or background-script, ignoring. From: " + message.from);
        return;
    }

    // Check if we're in a valid DOM context before processing
    if (!document || !document.head) {
        console.warn("🌊 Content script: Not in valid DOM context, skipping message processing");
        return;
    }

    try {
        console.log(`🌊 Processing window.postMessage: ${message.name}`);
        
        // Handle toggle-wave-reader command from background script
        if (message.name === 'toggle-wave-reader') {
            console.log('🌊 Content script: Handling toggle-wave-reader command');
            toggleWave();
        } else {
            stateMachine.handleState(message);
        }
        
        console.log(`🌊 Window.postMessage processed successfully`);
    } catch (e) {
        console.error(`🌊 Failed to process window.postMessage: ${JSON.stringify(message)}, error: ${e.message}`);
    }
});





// Content script runs in MAIN world, so chrome APIs are not available
// No need for chrome.runtime.connect() or disconnect listener

// maybe a nyan cat easter egg?
