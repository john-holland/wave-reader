/**
 * Centralized StateNameMap Factory
 * Creates state machine configurations for both content.js and shadow-content.js
 */

import { CState } from "./state";
import { 
    Base,
    BaseVentures, 
    StartVentures, 
    StopVentures, 
    WavingVentures, 
    AllVentures 
} from "./venture-states";

/**
 * Creates a StateNameMap with context-specific behavior
 * @param {Object} options - Configuration options
 * @param {Map} options.map - Existing state map (optional)
 * @param {boolean} options.isShadowDom - Whether this is for Shadow DOM context
 * @param {Object} options.context - Context-specific functions and variables
 * @param {Function} options.updateWavingStatus - Function to update wave animation status
 * @param {Function} options.enableMouseFollowingWave - Function to enable mouse following
 * @param {Function} options.disableMouseFollowingWave - Function to disable mouse following
 * @param {Function} options.unloadCSS - Function to unload CSS
 * @param {Function} options.loadCSSTemplate - Function to load CSS template
 * @param {Function} options.initializeOrUpdateToggleObserver - Function to initialize toggle observer
 * @param {Function} options.setHierarchySelector - Function to set hierarchy selector
 * @param {Function} options.log - Logging function
 * @param {Object} options.stateMachine - State machine instance (for Shadow DOM)
 * @param {Object} options.hierarchySelectorMount - Hierarchy selector mount (for Shadow DOM)
 * @param {Object} options.hierarchySelectorService - Hierarchy selector service (for Shadow DOM)
 * @param {Object} options.shadowRoot - Shadow root (for Shadow DOM)
 * @param {Function} options.createCustomDocumentContext - Function to create custom document context (for Shadow DOM)
 * @param {Function} options.MountOrFindSelectorHierarchyComponent - Component mount function (for Shadow DOM)
 * @param {Function} options.SelectionMadeMessage - Selection made message constructor (for Shadow DOM)
 * @returns {Object} StateNameMap with getState method
 */
export function createStateNameMap(options = {}) {
    const {
        map = new Map(),
        isShadowDom = false,
        context = {},
        updateWavingStatus,
        enableMouseFollowingWave,
        disableMouseFollowingWave,
        unloadCSS,
        loadCSSTemplate,
        initializeOrUpdateToggleObserver,
        setHierarchySelector,
        log = console.log,
        stateMachine,
        hierarchySelectorMount,
        hierarchySelectorService,
        shadowRoot,
        createCustomDocumentContext,
        MountOrFindSelectorHierarchyComponent,
        SelectionMadeMessage
    } = options;

    const contextPrefix = isShadowDom ? '🌊 Shadow DOM' : '🌊 Content';
    
    function StateNameMap(stateMap = new Map()) {
        const states = {
            // Base state - same for both contexts
            "base": Base,

            // Error state - same for both contexts
            "error": CState("error", AllVentures, true, async (message, state, previousState) => {
                log(`${contextPrefix}: Error state activated, transitioning to base`);
                return stateMap.get('base');
            }, true),

            // Start state - context-specific behavior
            "start": CState("start", StartVentures, false, async (message, state, previousState) => {
                log(`${contextPrefix}: Start state activated`);
                
                if (isShadowDom) {
                    // Shadow DOM context
                    context.latestOptions = message.options;
                    context.going = true;
                    log(`${contextPrefix}: Received waveAnimationControl:`, context.latestOptions.waveAnimationControl);
                    log(`${contextPrefix}: Full options:`, JSON.stringify(context.latestOptions));
                    
                    // Initialize wave animation based on mode
                    context.updateWavingStatus(context.latestOptions, null);
                } else {
                    // Content script context
                    context.latestOptions = message.options;
                    
                    // Validate selector and elements
                    if (context.latestOptions.wave.selector) {
                        try {
                            const elements = document.querySelectorAll(context.latestOptions.wave.selector);
                            log(`${contextPrefix}: Found ${elements.length} elements for selector: ${context.latestOptions.wave.selector}`);
                            
                            if (elements.length === 0) {
                                log(`${contextPrefix}: No elements found for selector: ${context.latestOptions.wave.selector}`);
                                // Try with a fallback selector
                                const fallbackElements = document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6');
                                log(`${contextPrefix}: Using fallback selector, found ${fallbackElements.length} elements`);
                            }
                        } catch (error) {
                            log(`${contextPrefix}: Invalid selector: ${context.latestOptions.wave.selector}`, error);
                        }
                    }
                    
                    // Initialize wave animation based on mode
                    context.updateWavingStatus(context.latestOptions, null);
                    context.going = true;
                    context.initializeOrUpdateToggleObserver(message);
                }
                
                return stateMap.get('waving');
            }, false),

            // Stop state - context-specific behavior
            "stop": CState("stop", [...BaseVentures, ...StopVentures], true, async (message, state, previousState) => {
                log(`${contextPrefix}: Stop state activated`);
                context.unloadCSS();
                
                // Disable mouse-following wave
                context.disableMouseFollowingWave();
                
                context.going = false;
                return stateMap.get("base");
            }, false),

            // Update state - context-specific behavior
            "update": CState("update", BaseVentures, false, async (message, state, previousState) => {
                log(`${contextPrefix}: Update state activated`);
                context.unloadCSS();

                if (!message?.options) {
                    log(`${contextPrefix}: Warning: update called with no options`, JSON.stringify(message));
                    return previousState;
                }

                const previousOptions = context.latestOptions;
                context.latestOptions = message.options;

                log(`${contextPrefix}: Update called with previous state: ${previousState.name}`);
                
                // Handle mode changes while waving
                context.updateWavingStatus(context.latestOptions, previousOptions);

                if (isShadowDom) {
                    // Shadow DOM specific update logic
                    log(`${contextPrefix}: Updated options in Shadow DOM context`);
                } else {
                    // Content script specific update logic
                    if (context.setHierarchySelector) {
                        context.setHierarchySelector(context.latestOptions.wave.selector);
                    }
                    context.initializeOrUpdateToggleObserver(message);
                }

                return previousState;
            }, true),

            // Toggle start state - context-specific behavior
            "toggle start": CState("toggle start", StartVentures, false, async (message, state, previousState) => {
                log(`${contextPrefix}: Toggle start state activated`);
                
                // Initialize wave animation based on mode
                context.updateWavingStatus(context.latestOptions, null);
                
                context.going = !context.going;
                
                if (!isShadowDom) {
                    // Content script specific: Send message to background script
                    window.postMessage({
                        source: 'wave-reader-extension',
                        message: {
                            name: 'update-going-state',
                            going: true
                        }
                    }, '*');
                }
                
                return stateMap.get('waving');
            }, false),

            // Toggle stop state - context-specific behavior
            "toggle stop": CState("toggle stop", BaseVentures, false, async (message, state, previousState) => {
                log(`${contextPrefix}: Toggle stop state activated`);
                context.unloadCSS();
                
                // Disable mouse-following wave
                context.disableMouseFollowingWave();
                
                context.going = false;
                
                if (!isShadowDom) {
                    // Content script specific: Send message to background script
                    window.postMessage({
                        source: 'wave-reader-extension',
                        message: {
                            name: 'update-going-state',
                            going: false
                        }
                    }, '*');
                }
                
                return stateMap.get('base');
            }, false),

            // Waving state - context-specific behavior
            "waving": CState("waving", WavingVentures, false, async (message, state, previousState) => {
                if (isShadowDom) {
                    // Shadow DOM context: Handle wave updates and mode changes
                    const previousOptions = context.latestOptions;
                    context.latestOptions = message.options;
                    context.updateWavingStatus(context.latestOptions, previousOptions);
                }
                return stateMap.get("waving");
            }, false),

            // Selection states - context-specific behavior
            "start-selection-choose": CState("start-selection-choose", ["selection mode activate"], true, async (message, state, previousState) => {
                const selector = message?.selector;

                if (!(selector || "").trim()) {
                    log(`${contextPrefix}: Start selection choose activated without selector!`);
                }

                log(`${contextPrefix}: Starting selector mode activation`);
                log(`${contextPrefix}: Selector: ${selector}`);

                if (isShadowDom) {
                    // Shadow DOM specific selection logic
                    try {
                        log(`${contextPrefix}: Mounting selector hierarchy component...`);
                        
                        // Create a mount element within the Shadow DOM
                        let mount = context.shadowRoot.querySelector("#wave-reader-component-mount");
                        
                        if (mount) {
                            mount.remove();
                        }
                        
                        mount = document.createElement("div");
                        mount.style.cssText = `
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            z-index: 10000;
                            pointer-events: auto;
                            background: rgba(0, 0, 0, 0.1);
                        `;
                        mount.setAttribute("id", "wave-reader-component-mount");
                        context.shadowRoot.appendChild(mount);
                        
                        log(`${contextPrefix}: Mount element created and appended: ${mount}`);
                        
                        // Create a custom document context for React components
                        const customDocument = context.createCustomDocumentContext();
                        
                        context.hierarchySelectorMount = context.MountOrFindSelectorHierarchyComponent({
                            service: context.hierarchySelectorService,
                            selector,
                            passSetSelector: (modifier) => { 
                                log(`${contextPrefix}: Setting hierarchy selector modifier`);
                                context.setHierarchySelector = modifier; 
                            },
                            onConfirmSelector: (selector) => {
                                log(`${contextPrefix}: onConfirmSelector called with selector: ${selector}`);
                                context.stateMachine.handleState(new context.SelectionMadeMessage({
                                    selector
                                }));
                            },
                            doc: customDocument,
                            uiRoot: context.shadowRoot
                        });
                        log(`${contextPrefix}: Selector hierarchy component mounted successfully`);
                    } catch (error) {
                        log(`${contextPrefix}: Failed to mount selector hierarchy component:`, error);
                    }
                } else {
                    // Content script specific selection logic
                    try {
                        log(`${contextPrefix}: Mounting selector hierarchy component...`);
                        context.hierarchySelectorMount = context.MountOrFindSelectorHierarchyComponent({
                            service: context.hierarchySelectorService,
                            selector,
                            passSetSelector: (modifier) => { 
                                log(`${contextPrefix}: Setting hierarchy selector modifier`);
                                context.setHierarchySelector = modifier; 
                            },
                            onConfirmSelector: (selector) => {
                                log(`${contextPrefix}: onConfirmSelector called with selector: ${selector}`);
                                context.stateMachine.handleState(new context.SelectionMadeMessage({
                                    selector
                                }));
                            },
                            doc: document,
                            uiRoot: (typeof context.shadowRoot !== 'undefined' && context.shadowRoot) ? context.shadowRoot : document
                        });
                        log(`${contextPrefix}: Selector hierarchy component mounted successfully`);
                    } catch (error) {
                        log(`${contextPrefix}: Failed to mount selector hierarchy component:`, error);
                    }
                }

                return stateMap.get('selection mode');
            }, false),

            "selection mode": CState("selection mode", ["selection mode activate", "selection mode", "selection made", "end-selection-choose"], true, (message, state, previousState) => {
                return stateMap.get('selection mode');
            }, false),

            "selection made": CState("selection made", ["end-selection-choose"], true, async (message, state, previousState) => {
                log(`${contextPrefix}: Selection made: ${message?.selector}`);
                
                if (!isShadowDom) {
                    // Content script specific: Send selection back to popup through background script
                    log(`${contextPrefix}: Sending selection back to popup via background script...`);
                    
                    return new Promise((resolve) => {
                        let messageSent = false;
                        let timeoutId;
                        
                        // Set up a timeout to handle cases where the message isn't received
                        timeoutId = setTimeout(() => {
                            if (!messageSent) {
                                log(`${contextPrefix}: Timeout: Selection message not confirmed, trying alternative method...`);
                                
                                // Try alternative method - send directly to background script
                                try {
                                    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                                        chrome.runtime.sendMessage({
                                            from: 'content-script',
                                            name: 'selection-made',
                                            selector: message?.selector
                                        }).then(() => {
                                            log(`${contextPrefix}: Selection sent via Chrome runtime`);
                                        }).catch(error => {
                                            log(`${contextPrefix}: Failed to send via Chrome runtime:`, error);
                                        });
                                    }
                                } catch (error) {
                                    log(`${contextPrefix}: Failed to send selection via Chrome runtime:`, error);
                                }
                                
                                resolve(stateMap.get('end-selection-choose'));
                            }
                        }, 2000);
                        
                        // Send the message via Chrome runtime
                        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                            chrome.runtime.sendMessage({
                                from: 'content-script',
                                name: 'selection-made',
                                selector: message?.selector
                            }).then(() => {
                                log(`${contextPrefix}: Selection message sent via Chrome runtime`);
                            }).catch(error => {
                                log(`${contextPrefix}: Failed to send selection via Chrome runtime:`, error);
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
                        
                        log(`${contextPrefix}: Selection message sent, waiting for confirmation...`);
                        resolve(stateMap.get('end-selection-choose'));
                    });
                } else {
                    // Shadow DOM context: Simple return
                    return stateMap.get('end-selection-choose');
                }
            }, false),

            "end-selection-choose": CState("end-selection-choose", BaseVentures, true, async (message, state, previousState) => {
                log(`${contextPrefix}: Ending selector mode`);
                
                if (isShadowDom) {
                    // Shadow DOM specific cleanup
                    if (context.hierarchySelectorMount && context.hierarchySelectorMount.remove) {
                        log(`${contextPrefix}: Removing hierarchy selector mount`);
                        context.hierarchySelectorMount.remove();
                    } else {
                        log(`${contextPrefix}: No hierarchy selector mount to remove`);
                    }
                    context.setHierarchySelector = undefined;
                    log(`${contextPrefix}: Selector mode ended successfully`);
                } else {
                    // Content script specific cleanup
                    if (context.hierarchySelectorMount && context.hierarchySelectorMount.remove) {
                        log(`${contextPrefix}: Removing hierarchy selector mount`);
                        context.hierarchySelectorMount.remove();
                    } else {
                        log(`${contextPrefix}: No hierarchy selector mount to remove`);
                    }
                    context.setHierarchySelector = undefined;
                    log(`${contextPrefix}: Selector mode ended successfully`);
                }

                return stateMap.get('base');
            }, false)
        };

        // Add all states to the map
        Object.keys(states).forEach(key => {
            stateMap.set(key, states[key]);
        });

        // Return the NameAccessMapInterface implementation
        return {
            map: stateMap,
            getState: (name) => stateMap.get(name)
        };
    }

    return StateNameMap;
} 