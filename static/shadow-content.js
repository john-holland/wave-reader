import "regenerator-runtime/runtime";
// import { FollowKeyChordObserver, WindowKeyDownKey } from "../src/components/util/user-input";
import StateMachine from "../src/util/state-machine";
import { CState } from "../src/util/state";
// import debounce from "../src/util/debounce";
// import {
//     BaseVentures,
//     StartVentures,
//     StopVentures,
//     WavingVentures,
//     AllVentures,
//     Base
// } from "../src/util/venture-states";

// import UpdateGoingStateMessage from "../src/models/messages/update-going-state";
import { MountOrFindSelectorHierarchyComponent } from "../src/components/selector-hierarchy";
// import { ErrorBoundary } from "../src/components/error-boundary";
import { SimpleColorServiceAdapter } from "../src/services/simple-color-service";
import { SelectorHierarchy } from "../src/services/selector-hierarchy";
import SelectionMadeMessage from "../src/models/messages/selection-made";
import PongMessage from "../src/models/messages/pong";
import StartMessage from "../src/models/messages/start";
import StopMessage from "../src/models/messages/stop";
// import React from "react";
// import ReactDOM from "react-dom";

const CSS_MODE__MOUSE = "1";
const CSS_MODE__TEMPLATE = "0";

// Reduced logging - only log important events
const log = (message) => {
    const isDevelopment = typeof window !== 'undefined' && window.location && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (isDevelopment) {
        console.log(`🌊 ${message}`);
    }
};

log("Wave Reader Shadow DOM content script is loading on: " + window.location.href);

// Mouse-following utility functions
function cartesianToCylindrical(x, y, cx, cy) {
    const dx = x - cx;
    const dy = y - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    const theta = Math.atan2(dy, dx);
    return { r, theta };
}



// Create Shadow DOM container
class WaveReaderShadowDOM {
    constructor() {
        this.shadowRoot = null;
        this.styleElement = null;
        this.stateMachine = null;
        this.going = false;
        this.latestOptions = undefined;
        this.keychordObserver = undefined;
        this.eventListener = undefined;
        this.hierarchySelectorMount = undefined;
        this.hierarchySelectorService = new SelectorHierarchy(new SimpleColorServiceAdapter());
        this.setHierarchySelector = undefined;
        
        // Mouse-following wave variables
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseFollowInterval = null;
        this.lastCss = '';
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.lastMouseTime = Date.now();
        this.currentAnimationDuration = null;
        
        this.init();
    }

    init() {
        // Wait for document.body to be available
        if (!document.body) {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        // Create shadow DOM container
        const container = document.createElement('div');
        container.id = 'wave-reader-shadow-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            pointer-events: none;
            z-index: 2147483647;
        `;
        
        document.body.appendChild(container);
        this.shadowRoot = container.attachShadow({ mode: 'open' });
        
        // Create a proper document-like structure for styled-components
        this.createStyledComponentsEnvironment();
        
        // Initialize state machine
        this.initializeStateMachine();
        
        // Set up message listeners
        this.setupMessageListeners();
        
        // Set up mouse tracking for mouse-following wave
        this.setupMouseTracking();
        
        log("Shadow DOM initialized successfully");
    }

    createStyledComponentsEnvironment() {
        // Create head element for styled-components
        const head = document.createElement('head');
        this.shadowRoot.appendChild(head);
        
        // Create style element for CSS injection
        this.styleElement = document.createElement('style');
        this.styleElement.textContent = `
            /* Wave Reader Styles */
            .wave-reader__text {
                font-size: initial;
                -webkit-animation-name: wobble;
                animation-name: wobble;
                -webkit-animation-duration: 4s;
                animation-duration: 4s;
                -webkit-animation-fill-mode: both;
                animation-fill-mode: both;
                animation-iteration-count: infinite;
            }
            
            @-webkit-keyframes wobble {
                0% { transform: translateX(0%); rotateY(-2deg); }
                15% { transform: translateX(-1%) rotateY(2deg); }
            }
            
            @keyframes wobble {
                0% { transform: translateX(0%); rotateY(-2deg); }
                15% { transform: translateX(-1%) rotateY(2deg); }
            }
        `;
        
        this.shadowRoot.appendChild(this.styleElement);
        
        // Create a document facade that properly handles styled-components
    }

    initializeStateMachine() {
        const stateMachineMap = new Map();
        
        const states = {
            "base": CState("base", ["start", "stop"], true, (async () => {
                return stateMachineMap.get('base')
            }).bind(this), false),
            
            "start": CState("start", ["start", "stop", "waving"], true, (async (message) => {
                log("Start state activated");
                this.latestOptions = message.options;
                this.going = true;
                log('🌊 Shadow DOM: Received waveAnimationControl:', this.latestOptions.waveAnimationControl);
                log('🌊 Shadow DOM: Full options:', JSON.stringify(this.latestOptions));
                
                // Initialize wave animation based on mode
                this.updateWavingStatus(this.latestOptions, null);
                
                return stateMachineMap.get('waving')
            }).bind(this), false),
            
            "stop": CState("stop", ["start", "stop", "base"], true, (async () => {
                log("Stop state activated");
                this.unloadCSS();
                
                // Disable mouse-following wave
                this.disableMouseFollowingWave();
                
                this.going = false;
                return stateMachineMap.get('base')
            }).bind(this), false),
            
            "waving": CState("waving", ["start", "stop", "waving", "start-selection-choose"], true, (async (message) => {
                // Handle wave updates and mode changes
                const previousOptions = this.latestOptions;
                this.latestOptions = message.options;
                
                this.updateWavingStatus(this.latestOptions, previousOptions);

                return stateMachineMap.get('waving')
            }).bind(this), false),
            
            "start-selection-choose": CState("start-selection-choose", ["selection mode activate"], true, (async (message) => {
                const selector = message?.selector;

                if (!(selector || "").trim()) {
                    log("start selection choose activated without selector!");
                }

                log("Starting selector mode activation");
                log("Selector: " + selector);

                try {
                    log("Mounting selector hierarchy component...");
                    
                    // Create a mount element within the Shadow DOM
                    let mount = this.shadowRoot.querySelector("#wave-reader-component-mount");
                    
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
                    this.shadowRoot.appendChild(mount);
                    
                    log("Mount element created and appended: " + mount);
                    
                    // Create a custom document context for React components
                    const customDocument = this.createCustomDocumentContext();
                    
                    this.hierarchySelectorMount = MountOrFindSelectorHierarchyComponent({
                        service: this.hierarchySelectorService,
                        selector,
                        passSetSelector: (modifier) => { 
                            log("Setting hierarchy selector modifier");
                            this.setHierarchySelector = modifier; 
                        },
                        onConfirmSelector: (selector) => {
                            log("onConfirmSelector called with selector: " + selector);
                            this.stateMachine.handleState(new SelectionMadeMessage({
                                selector
                            }));
                        },
                        doc: customDocument, // Use our custom document context
                        uiRoot: this.shadowRoot
                    });
                    log("Selector hierarchy component mounted successfully, mount: " + this.hierarchySelectorMount);
                } catch (error) {
                    console.error("Failed to mount selector hierarchy component:", error);
                }

                return stateMachineMap.get('selection mode')
            }).bind(this), false),
            
            "selection mode": CState("selection mode", ["selection mode activate", "selection mode", "selection made", "end-selection-choose"], true, (async () => {
                return stateMachineMap.get('selection mode')
            }).bind(this), false),
            
            "selection mode activate": CState("selection mode activate", ["selection mode", "selection made", "end-selection-choose"], true, (async () => {
                return stateMachineMap.get('selection mode')
            }).bind(this), false),
            
            "selection made": CState("selection made", ["end-selection-choose"], true, (async (message) => {
                log("Selection made: " + message.selector);
                return stateMachineMap.get('end-selection-choose')
            }).bind(this), false),
            
            "end-selection-choose": CState("end-selection-choose", ["waving"], true, (async () => {
                log("End selection choose activated");
                if (this.hierarchySelectorMount) {
                    this.hierarchySelectorMount.remove();
                    this.hierarchySelectorMount = undefined;
                }
                return stateMachineMap.get('waving')
            }).bind(this), false)
        };

        // Create state machine map
        Object.keys(states).forEach(key => {
            stateMachineMap.set(key, states[key]);
        });

        // Create a NameAccessMapInterface implementation
        const nameAccessMap = {
            getState: (name) => stateMachineMap.get(name)
        };

        // Initialize the state machine with the map and initial state
        this.stateMachine = new StateMachine();
        this.stateMachine.initialize(nameAccessMap, states["base"]);
        log("Shadow DOM state machine initialized");
    }

    /**
     * Centralized method to update wave animation status
     * Handles mode changes, CSS updates, and mouse-following wave
     */
    updateWavingStatus(currentOptions, previousOptions) {
        if (!currentOptions) {
            log('🌊 Shadow DOM: No options provided to updateWavingStatus');
            return;
        }

        const modeChanged = previousOptions?.waveAnimationControl !== currentOptions.waveAnimationControl;
        
        if (modeChanged) {
            log('🌊 Shadow DOM: Animation mode changed from', previousOptions?.waveAnimationControl, 'to', currentOptions.waveAnimationControl);
            
            // Handle mode changes
            if (currentOptions.waveAnimationControl === CSS_MODE__MOUSE) {
                log('🌊 Shadow DOM: Switching to Mouse mode - enabling mouse-following wave');
                this.enableMouseFollowingWave(currentOptions);
            } else if (currentOptions.waveAnimationControl === CSS_MODE__TEMPLATE) {
                log('🌊 Shadow DOM: Switching to CSS mode - disabling mouse-following wave');
                this.disableMouseFollowingWave();
                this.loadCSS(currentOptions.wave.cssTemplate);
            }
        } else {
            // Handle updates within the same mode
            if (currentOptions.waveAnimationControl === CSS_MODE__MOUSE) {
                // Check if mouse template changed or wave speed changed
                const templateChanged = previousOptions?.wave?.cssMouseTemplate !== currentOptions.wave.cssMouseTemplate;
                const speedChanged = previousOptions?.wave?.waveSpeed !== currentOptions.wave.waveSpeed;
                
                if (templateChanged || speedChanged) {
                    log('🌊 Shadow DOM: Mouse template or speed updated - restarting mouse-following wave');
                    this.disableMouseFollowingWave();
                    this.enableMouseFollowingWave(currentOptions);
                }
            } else if (currentOptions.waveAnimationControl === CSS_MODE__TEMPLATE) {
                // Check if CSS template changed
                if (previousOptions?.wave?.cssTemplate !== currentOptions.wave.cssTemplate) {
                    log('🌊 Shadow DOM: CSS template updated');
                    this.loadCSS(currentOptions.wave.cssTemplate);
                }
            }
        }
    }

    setupMessageListeners() {
        log("Setting up message listeners...");
        
        // Listen for window.postMessage since we're in ISOLATED world
        log("Adding window.postMessage listener");
        window.addEventListener('message', (event) => {
            // Only handle messages from our extension
            if (event.source !== window || !event.data || event.data.source !== 'wave-reader-extension') {
                return;
            }
            
            const message = event.data.message;
            log("Shadow DOM received window.postMessage: " + JSON.stringify(message));

            if (message.from !== "popup" && message.from !== "background-script") {
                log("Message not from popup or background-script, ignoring. From: " + message.from);
                return;
            }

            // Handle ping message
            if (message.name === 'ping') {
                log("Shadow DOM: Received ping, sending pong");
                try {
                    // Send pong response via window.postMessage back to background
                    window.postMessage({
                        source: 'wave-reader-extension',
                        message: new PongMessage({
                            timestamp: Date.now(),
                            source: 'shadow-content-script'
                        })
                    }, '*');
                } catch (e) {
                    console.error("Failed to process ping command: " + e.message);
                    // Send error response via window.postMessage back to background
                    window.postMessage({
                        source: 'wave-reader-extension',
                        message: { success: false, error: e.message }
                    }, '*');
                }
                return;
            }

            try {
                log("Processing message: " + message.name);
                
                // Handle toggle-wave-reader command from background script
                if (message.name === 'toggle-wave-reader') {
                    log("Shadow DOM: Handling toggle-wave-reader command");
                    this.toggleWaving();
                } else {
                    this.stateMachine.handleState(message);
                }
                
                log("Message processed successfully");
                
                // Send response via window.postMessage back to background
                window.postMessage({
                    source: 'wave-reader-extension-response',
                    message: { success: true }
                }, '*');
            } catch (e) {
                console.error("Failed to process message: " + JSON.stringify(message) + ", error: " + e.message);
                // Send error response via window.postMessage back to background
                window.postMessage({
                    source: 'wave-reader-extension',
                    message: { success: false, error: e.message }
                }, '*');
            }
        });
    }

    unloadCSS() {
        if (this.styleElement) {
            this.styleElement.textContent = '';
        }
        if (this.mainDocumentStyle) {
            this.mainDocumentStyle.textContent = '';
        }
        
        // Clear mouse-following state
        this.lastCss = '';
        
        console.log("🌊 CSS unloaded from both Shadow DOM and main document");
    }
    
    loadCSS(css) {
        // Apply CSS to the main document, not just the Shadow DOM
        if (this.styleElement) {
            this.styleElement.textContent = css;
        }
        
        // Also inject CSS into the main document for text elements
        if (!this.mainDocumentStyle) {
            this.mainDocumentStyle = document.createElement('style');
            this.mainDocumentStyle.id = 'wave-reader-main-css';
            document.head.appendChild(this.mainDocumentStyle);
        }
        this.mainDocumentStyle.textContent = css;
        
        log("🌊 Shadow DOM: CSS loaded into main document");
    }

    toggleWaving() {
        log("Shadow DOM: Toggle waving called");
        if (this.going) {
            log("Shadow DOM: Currently waving, stopping");
            this.stateMachine.handleState(new StopMessage());
        } else {
            log("Shadow DOM: Currently stopped, starting");
            if (this.latestOptions) {
                this.stateMachine.handleState(new StartMessage({
                    options: this.latestOptions
                }));
            } else {
                log("Shadow DOM: No latest options available for toggle");
            }
        }
    }

    setupMouseTracking() {
        // Listen for mouse movement globally
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            this.lastMouseTime = Date.now();
        });
        log('🌊 Shadow DOM: Mouse tracking initialized');
    }

    // Mouse-following wave methods
    updateWaveToMouse(options) {
        this.updateWaveToMouseWithDuration(options, options?.wave?.waveSpeed || 4);
    }

    updateWaveToMouseWithDuration(options, duration) {
        if (!options || !options.wave || !options.wave.selector) return;
        const elements = document.querySelectorAll(options.wave.selector);
        if (!elements.length) return;
        
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width/2;
            const cy = rect.top + rect.height/2;
            const { r, theta } = cartesianToCylindrical(this.mouseX, this.mouseY, cx, cy);
            
            // Map theta to a rotation (deg) and r to a translation (%)
            // Adjust angle by adding π/2 (90 degrees) for more intuitive control
            const adjustedTheta = theta + Math.PI / 2;
            const rotationY = (adjustedTheta * 180 / Math.PI).toFixed(2); // degrees
            // translation: scale r to a reasonable % (max 10% of width)
            const maxR = Math.max(rect.width, rect.height) / 2;
            const translationX = ((r / maxR) * 10 * Math.cos(adjustedTheta)).toFixed(2); // percent
            
            // Update the CSS with dynamic values and duration
            const css = this.replaceAnimationVariablesWithDuration(options.wave, translationX, rotationY, duration);
            if (css !== this.lastCss) {
                this.loadCSS(css);
                this.lastCss = css;
            }
        });
    }

    enableMouseFollowingWave(options) {
        if (this.mouseFollowInterval) clearInterval(this.mouseFollowInterval);
        
        // Store options and base duration for dynamic updates
        this.currentWaveOptions = options;
        this.currentAnimationDuration = options?.wave?.waveSpeed || 4;
        
        // Use the current animation duration for the update interval (1:1 relationship)
        const updateInterval = this.currentAnimationDuration * 1000; // Convert to milliseconds
        this.mouseFollowInterval = setInterval(() => this.updateWaveToMouse(options), updateInterval);
        log('🌊 Shadow DOM: Mouse-following wave enabled, duration:', this.currentAnimationDuration, 's, update interval:', updateInterval, 'ms (1:1 ratio)');
    }

    disableMouseFollowingWave() {
        if (this.mouseFollowInterval) clearInterval(this.mouseFollowInterval);
        this.mouseFollowInterval = null;
        this.lastCss = '';
        this.currentWaveOptions = null;
        this.currentAnimationDuration = null;
        log('🌊 Shadow DOM: Mouse-following wave disabled');
    }

    replaceAnimationVariables(wave, translationX, rotationY) {
        // Use the same constants as the Wave model
        const TRANSLATE_X = "TRANSLATE_X";
        const ROTATE_Y = "ROTATE_Y";
        
        let css = wave.cssMouseTemplate || wave.cssTemplate || '';
        css = css.replaceAll(TRANSLATE_X, translationX);
        css = css.replaceAll(ROTATE_Y, rotationY);
        return css;
    }

    replaceAnimationVariablesWithDuration(wave, translationX, rotationY, duration) {
        // Use the same constants as the Wave model
        const TRANSLATE_X = "TRANSLATE_X";
        const ROTATE_Y = "ROTATE_Y";
        const ANIMATION_DURATION = "ANIMATION_DURATION";
        
        let css = wave.cssMouseTemplate || wave.cssTemplate || '';
        css = css.replaceAll(TRANSLATE_X, translationX);
        css = css.replaceAll(ROTATE_Y, rotationY);
        css = css.replaceAll(ANIMATION_DURATION, duration.toString());
        return css;
    }

    createCustomDocumentContext() {
        // This function creates a custom document context that React components can use
        // to render styled-components. It intercepts the styled-components style injection
        // and ensures it goes to the Shadow DOM's head.
        const customDocument = {
            ...document, // Start with the main document's properties
            head: this.shadowRoot.querySelector('head'), // Override head to point to Shadow DOM head
            body: this.shadowRoot, // Override body to point to Shadow DOM
            documentElement: {
                ...document.documentElement,
                scrollHeight: document.documentElement?.scrollHeight || window.innerHeight,
                clientWidth: document.documentElement?.clientWidth || window.innerWidth,
                clientHeight: document.documentElement?.clientHeight || window.innerHeight,
                scrollWidth: document.documentElement?.scrollWidth || window.innerWidth,
                scrollTop: document.documentElement?.scrollTop || 0,
                scrollLeft: document.documentElement?.scrollLeft || 0,
                style: document.documentElement?.style || {},
                appendChild: (child) => {
                    // Redirect style elements to Shadow DOM head
                    if (child.tagName === 'STYLE') {
                        const head = this.shadowRoot.querySelector('head');
                        return head ? head.appendChild(child) : this.shadowRoot.appendChild(child);
                    }
                    return this.shadowRoot.appendChild(child);
                },
                insertBefore: (newNode, referenceNode) => {
                    // Redirect style elements to Shadow DOM head
                    if (newNode.tagName === 'STYLE') {
                        const head = this.shadowRoot.querySelector('head');
                        return head ? head.insertBefore(newNode, referenceNode) : this.shadowRoot.insertBefore(newNode, referenceNode);
                    }
                    return this.shadowRoot.insertBefore(newNode, referenceNode);
                }
            },
            createElement: (tagName) => {
                const element = document.createElement(tagName);
                // Mark style elements for Shadow DOM
                if (tagName.toLowerCase() === 'style') {
                    log("Creating style element for Shadow DOM");
                    element.setAttribute('data-shadow-dom', 'true');
                }
                return element;
            },
            createTextNode: (text) => document.createTextNode(text),
            appendChild: (child) => {
                if (child.tagName === 'STYLE') {
                    const head = this.shadowRoot.querySelector('head');
                    return head ? head.appendChild(child) : this.shadowRoot.appendChild(child);
                }
                return this.shadowRoot.appendChild(child);
            },
            insertBefore: (newNode, referenceNode) => {
                if (newNode.tagName === 'STYLE') {
                    const head = this.shadowRoot.querySelector('head');
                    return head ? head.insertBefore(newNode, referenceNode) : this.shadowRoot.insertBefore(newNode, referenceNode);
                }
                return this.shadowRoot.insertBefore(newNode, referenceNode);
            },
            querySelector: (selector) => {
                // Try Shadow DOM first, then main document
                const shadowResult = this.shadowRoot.querySelector(selector);
                return shadowResult || document.querySelector(selector);
            },
            querySelectorAll: (selector) => {
                // Try Shadow DOM first, then main document
                const shadowResult = this.shadowRoot.querySelectorAll(selector);
                return shadowResult.length > 0 ? shadowResult : document.querySelectorAll(selector);
            },
            getElementById: (id) => {
                const shadowResult = this.shadowRoot.getElementById(id);
                return shadowResult || document.getElementById(id);
            },
            getElementsByTagName: (tagName) => {
                const shadowResult = this.shadowRoot.getElementsByTagName(tagName);
                return shadowResult.length > 0 ? shadowResult : document.getElementsByTagName(tagName);
            },
            getElementsByClassName: (className) => {
                const shadowResult = this.shadowRoot.getElementsByClassName(className);
                return shadowResult.length > 0 ? shadowResult : document.getElementsByClassName(className);
            }
        };
        return customDocument;
    }


}

// Initialize the Shadow DOM when the script loads
const waveReaderShadow = new WaveReaderShadowDOM();

// Expose to window object for debugging
window.waveReaderShadow = waveReaderShadow;

log("Wave Reader Shadow DOM content script loaded successfully"); 