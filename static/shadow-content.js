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
// import React from "react";
// import ReactDOM from "react-dom";

// Reduced logging - only log important events
const log = (message) => {
    const isDevelopment = typeof window !== 'undefined' && window.location && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (isDevelopment) {
        console.log(`🌊 ${message}`);
    }
};

log("Wave Reader Shadow DOM content script is loading on: " + window.location.href);





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
        
        // Mouse tracking is now handled by the shared wave animation module
        
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
        // Create StateNameMap using the centralized factory
        const StateNameMap = createStateNameMap({
            isShadowDom: true,
            context: {
                latestOptions: this.latestOptions,
                going: this.going,
                setHierarchySelector: this.setHierarchySelector,
                hierarchySelectorMount: this.hierarchySelectorMount,
                hierarchySelectorService: this.hierarchySelectorService,
                stateMachine: this.stateMachine,
                shadowRoot: this.shadowRoot,
                unloadCSS: this.unloadCSS.bind(this),
                enableMouseFollowingWave: this.enableMouseFollowingWave.bind(this),
                disableMouseFollowingWave: this.disableMouseFollowingWave.bind(this),
                updateWavingStatus: this.updateWavingStatus.bind(this),
                initializeOrUpdateToggleObserver: this.initializeOrUpdateToggleObserver?.bind(this)
            },
            updateWavingStatus: this.updateWavingStatus.bind(this),
            enableMouseFollowingWave: this.enableMouseFollowingWave.bind(this),
            disableMouseFollowingWave: this.disableMouseFollowingWave.bind(this),
            unloadCSS: this.unloadCSS.bind(this),
            loadCSSTemplate: this.loadCSSTemplate.bind(this),
            createCustomDocumentContext: this.createCustomDocumentContext.bind(this),
            MountOrFindSelectorHierarchyComponent,
            SelectionMadeMessage,
            log
        });

        // Initialize the state machine with the map and initial state
        this.stateMachine = new StateMachine();
        const stateMachineMap = new Map();
        const nameAccessMap = StateNameMap(stateMachineMap);
        this.stateMachine.initialize(nameAccessMap, nameAccessMap.getState("base"));
        log("🌊 Shadow DOM: State machine initialized using centralized factory");
    }

    /**
     * Centralized method to update wave animation status
     * Handles mode changes, CSS updates, and mouse-following wave
     */
    updateWavingStatus(currentOptions, previousOptions) {
        const context = {
            enableMouseFollowingWave: this.enableMouseFollowingWave.bind(this),
            disableMouseFollowingWave: this.disableMouseFollowingWave.bind(this),
            loadCSSTemplate: this.loadCSSTemplate.bind(this),
            log
        };
        sharedUpdateWavingStatus(currentOptions, previousOptions, context, '🌊 Shadow DOM');
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
        const context = {
            styleElement: this.styleElement,
            mainDocumentStyle: this.mainDocumentStyle,
            log
        };
        sharedUnloadCSS(context, true); // true = Shadow DOM
        this.lastCss = '';
    }
    
    loadCSS(css) {
        const context = {
            styleElement: this.styleElement,
            mainDocumentStyle: this.mainDocumentStyle,
            log
        };
        return sharedLoadCSS(css, context, true); // true = Shadow DOM
    }

    loadCSSTemplate(css) {
        const context = {
            loadCSS: this.loadCSS.bind(this),
            unloadCSS: this.unloadCSS.bind(this),
            log
        };
        return sharedLoadCSSTemplate(css, context, true); // true = Shadow DOM
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

    // Mouse tracking is now handled by the shared wave animation module

    // Wrapper functions that use the shared wave animation module
    updateWaveToMouse(options) {
        // This function is handled by the shared module
        // The shared module will call our loadCSS and replaceAnimationVariablesWithDuration functions
    }

    updateWaveToMouseWithDuration(options, duration) {
        // This function is handled by the shared module
        // The shared module will call our loadCSS and replaceAnimationVariablesWithDuration functions
    }

    enableMouseFollowingWave(options) {
        // Use shared module with shadow-content specific CSS functions
        sharedEnableMouseFollowingWave(options, this.loadCSS.bind(this), sharedReplaceAnimationVariablesWithDuration);
        log('🌊 Shadow DOM: Mouse-following wave enabled using shared module');
    }

    disableMouseFollowingWave() {
        // Use shared module
        sharedDisableMouseFollowingWave();
        this.lastCss = '';
        this.currentWaveOptions = null;
        this.currentAnimationDuration = null;
        log('🌊 Shadow DOM: Mouse-following wave disabled using shared module');
    }

    // Animation variable replacement is now handled by the shared module

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