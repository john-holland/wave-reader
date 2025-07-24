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

// --- Mouse-following wave logic using shared module ---

// Start/stop mouse-following interval using shared module
function enableMouseFollowingWave(options) {
    // Store options globally for compatibility
    window.currentWaveOptions = options;
    window.currentAnimationDuration = options?.wave?.waveSpeed || 4;
    
    // Use shared module with content.js specific CSS functions
    sharedEnableMouseFollowingWave(options, loadCSSTemplate, replaceAnimationVariablesWithDuration);
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

const CSS_MODE__MOUSE = "1";
const CSS_MODE__TEMPLATE = "0";

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
    if (!currentOptions) {
        console.log('🌊 Content script: No options provided to updateWavingStatus');
        return;
    }

    const modeChanged = previousOptions?.waveAnimationControl !== currentOptions.waveAnimationControl;
    
    if (modeChanged) {
        console.log('🌊 Content script: Animation mode changed from', previousOptions?.waveAnimationControl, 'to', currentOptions.waveAnimationControl);
        
        // Handle mode changes
        if (currentOptions.waveAnimationControl === CSS_MODE__MOUSE) {
            console.log('🌊 Content script: Switching to Mouse mode - enabling mouse-following wave');
            enableMouseFollowingWave(currentOptions);
        } else if (currentOptions.waveAnimationControl === CSS_MODE__TEMPLATE) {
            console.log('🌊 Content script: Switching to CSS mode - disabling mouse-following wave');
            disableMouseFollowingWave();
            loadCSSTemplate(currentOptions.wave.cssTemplate);
        }
    } else {
        // Handle updates within the same mode
        if (currentOptions.waveAnimationControl === CSS_MODE__MOUSE) {
            // Check if mouse template changed or wave speed changed
            const templateChanged = previousOptions?.wave?.cssMouseTemplate !== currentOptions.wave.cssMouseTemplate;
            const speedChanged = previousOptions?.wave?.waveSpeed !== currentOptions.wave.waveSpeed;
            
            if (templateChanged || speedChanged) {
                console.log('🌊 Content script: Mouse template or speed updated - restarting mouse-following wave');
                disableMouseFollowingWave();
                enableMouseFollowingWave(currentOptions);
            }
        } else if (currentOptions.waveAnimationControl === CSS_MODE__TEMPLATE) {
            // Check if CSS template changed
            if (previousOptions?.wave?.cssTemplate !== currentOptions.wave.cssTemplate) {
                console.log('🌊 Content script: CSS template updated');
                loadCSSTemplate(currentOptions.wave.cssTemplate);
            }
        }
    }
}

function loadCSS(css) {
    if (!css || typeof css !== 'string') {
        console.warn("🌊 Invalid CSS provided:", css);
        return false;
    }
    
    try {
        // Check if we're in a Shadow DOM context
        const isShadowDOM = document.head === null || document.head === undefined;
        
        if (isShadowDOM) {
            // In Shadow DOM, we need to find the shadow root and create a style element there
            const shadowRoot = document.querySelector('*')?.shadowRoot;
            if (shadowRoot) {
                // Remove existing style element if it exists
                const existingStyle = shadowRoot.getElementById("extension");
                if (existingStyle) {
                    existingStyle.remove();
                }
                
                const style = document.createElement("style");
                style.id = "extension";
                style.textContent = css;
                shadowRoot.appendChild(style);
                console.log("🌊 CSS loaded in Shadow DOM");
                return true;
            } else {
                console.warn("🌊 Shadow DOM not found, falling back to regular DOM");
            }
        }
        
        // Fallback to regular DOM
        const head = document.head || document.getElementsByTagName("head")[0];
        if (!head) {
            console.warn("🌊 No head element found, cannot load CSS");
            return false;
        }
        
        // Remove existing style element if it exists
        const existingStyle = document.getElementById("extension");
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const style = document.createElement("style");
        style.id = "extension";
        style.textContent = css;
        head.appendChild(style);
        console.log("🌊 CSS loaded in regular DOM");
        return true;
    } catch (error) {
        console.error("🌊 Error loading CSS:", error);
        return false;
    }
}

function unloadCSS() {
    try {
        // Try to find the style element in regular DOM
        const cssNode = document.getElementById("extension");
        if (cssNode && cssNode.parentNode) {
            cssNode.parentNode.removeChild(cssNode);
            console.log("🌊 CSS unloaded from regular DOM");
            return;
        }
        
        // Try to find the style element in Shadow DOM
        const shadowRoot = document.querySelector('*')?.shadowRoot;
        if (shadowRoot) {
            const shadowCssNode = shadowRoot.getElementById("extension");
            if (shadowCssNode) {
                shadowCssNode.remove();
                console.log("🌊 CSS unloaded from Shadow DOM");
                return;
            }
        }
        
        console.log("🌊 No CSS element found to unload");
    } catch (error) {
        console.error("🌊 Error unloading CSS:", error);
    }
}

function loadCSSTemplate(css) {
    if (!css || typeof css !== 'string') {
        console.warn("🌊 Invalid CSS template provided:", css);
        return false;
    }
    
    try {
        console.log("🌊 Loading CSS template:", css.substring(0, 100) + "...");
        unloadCSS();
        
        // Use a more reliable approach with retry mechanism
        return retryOperation(() => {
            const success = loadCSS(css);
            if (success) {
                console.log("🌊 CSS template loaded successfully");
                return true;
            } else {
                throw new Error("Failed to load CSS");
            }
        }, 2).then(() => true).catch(error => {
            console.error("🌊 Failed to load CSS template after retries:", error);
            return false;
        });
    } catch (error) {
        console.error("🌊 Error in loadCSSTemplate:", error);
        return false;
    }
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
            
            // Validate selector and elements
            if (latestOptions.wave.selector) {
                try {
                    const elements = document.querySelectorAll(latestOptions.wave.selector);
                    console.log(`🌊 Found ${elements.length} elements for selector: ${latestOptions.wave.selector}`);
                    
                    if (elements.length === 0) {
                        console.warn(`🌊 No elements found for selector: ${latestOptions.wave.selector}`);
                        // Try with a fallback selector
                        const fallbackElements = document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6');
                        console.log(`🌊 Using fallback selector, found ${fallbackElements.length} elements`);
                    }
                } catch (error) {
                    console.error(`🌊 Invalid selector: ${latestOptions.wave.selector}`, error);
                }
            }
            
            // Initialize wave animation based on mode
            updateWavingStatus(latestOptions, null);
            
            // TODO: see if the state machine will let us remove this
            going = true;
            initializeOrUpdateToggleObserver(message);
            return map.get('waving')
        }, false),
        "stop": CState("stop", StopVentures, true, async (message, state, previousState) => {
            unloadCSS()
            
            // Disable mouse-following wave
            disableMouseFollowingWave();
            
            going = false;
            return previousState.name === "waving" ? map.get("base") : previousState;
        }, false),
        "update": CState("update", BaseVentures, false, async (message, state, previousState) => {
            unloadCSS()

            if (!message?.options) {
                console.log("warning: update called with no options" + JSON.stringify(message));
                return previousState;
            }

            const previousOptions = latestOptions;
            latestOptions = message.options;

            console.log("Update called with previous state: " + previousState.name);
            
            // Handle mode changes while waving
            updateWavingStatus(latestOptions, previousOptions);

            if (setHierarchySelector) {
                setHierarchySelector(latestOptions.wave.selector);
            }

            // may need to separate steps for clarity
            initializeOrUpdateToggleObserver(message);
            return previousState
        }, true),
        "toggle start": CState("toggle start", StartVentures, false, async (message, state, previousState) => {
            // Initialize wave animation based on mode
            updateWavingStatus(latestOptions, null);
            
            going = !going;
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
            
            // Disable mouse-following wave
            disableMouseFollowingWave();
            
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
        "start-selection-choose":  CState("start-selection-choose", ["selection mode activate"], true, async (message, state, previousState) => {
            const selector = message?.selector;

            if (!(selector || "").trim()) {
                console.log("start selection choose activated without selector!")
            }

            console.log("🌊 Content script: Starting selector mode activation");
            console.log("🌊 Content script: Selector:", selector);
            console.log("🌊 Content script: Message:", message);

            try {
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

                console.log("🌊 Content script: Mounting selector hierarchy component...");
                hierarchySelectorMount = MountOrFindSelectorHierarchyComponent({
                    service: hierarchySelectorService,
                    selector,
                    passSetSelector: (modifier) => { 
                        console.log("🌊 Content script: Setting hierarchy selector modifier");
                        setHierarchySelector = modifier; 
                    },
                    onConfirmSelector: (selector) => {
                        console.log("🌊 onConfirmSelector called with selector:", selector);
                        stateMachine.handleState(new SelectionMadeMessage({
                            selector
                        }))
                    },
                    doc: document,
                    uiRoot: (typeof shadowRoot !== 'undefined' && shadowRoot) ? shadowRoot : document
                })
                console.log("🌊 Content script: Selector hierarchy component mounted successfully");
            } catch (error) {
                console.error("🌊 Content script: Failed to mount selector hierarchy component:", error);
                console.error("🌊 Content script: Error stack:", error.stack);
            }

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
                        
                        // Clean up listeners
                        window.removeEventListener('message', handleConfirmation);
                        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
                            chrome.runtime.onMessage.removeListener(handleChromeConfirmation);
                        }
                        
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
                
                // Also listen for Chrome runtime confirmation messages
                const handleChromeConfirmation = (message, sender, sendResponse) => {
                    if (message.from === 'background-script' && message.name === 'selection-confirmed') {
                        console.log("🌊 Selection confirmed by background script via Chrome runtime");
                        messageSent = true;
                        clearTimeout(timeoutId);
                        window.removeEventListener('message', handleConfirmation);
                        // Remove the Chrome listener temporarily
                        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
                            chrome.runtime.onMessage.removeListener(handleChromeConfirmation);
                        }
                        resolve(map.get('end-selection-choose'));
                    }
                };
                
                // Add listener for confirmation
                window.addEventListener('message', handleConfirmation);
                
                // Add Chrome runtime listener for confirmation
                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
                    chrome.runtime.onMessage.addListener(handleChromeConfirmation);
                }
                
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
            console.log("🌊 Content script: Ending selector mode");
            console.log("🌊 Content script: Message:", message);
            
            try {
                if (hierarchySelectorMount && hierarchySelectorMount.remove) {
                    console.log("🌊 Content script: Removing hierarchy selector mount");
                    hierarchySelectorMount.remove();
                } else {
                    console.log("🌊 Content script: No hierarchy selector mount to remove");
                }
                setHierarchySelector = undefined;
                console.log("🌊 Content script: Selector mode ended successfully");
            } catch (error) {
                console.error("🌊 Content script: Failed to end selector mode:", error);
            }

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
