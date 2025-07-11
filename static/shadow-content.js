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

import SettingsService from "../src/services/settings"
import UpdateWaveMessage from "../src/models/messages/update-wave";
import SelectionModeMessage from "../src/models/messages/selection-mode";
import UpdateGoingStateMessage from "../src/models/messages/update-going-state";
import {MountOrFindSelectorHierarchyComponent} from "../src/components/selector-hierarchy";
import {ColorGeneratorService, SelectorHierarchy} from "../src/services/selector-hierarchy";
import SelectionMadeMessage from "../src/models/messages/selection-made";
import { clientForLocation } from "../src/config/robotcopy";
import { ClientLocation } from "../src/util/state-machine";
import {ReactMachine} from "../src/util/react-machine";

console.log("🌊 Wave Reader Shadow DOM content script is loading on:", window.location.href);

const ContentClient = clientForLocation(ClientLocation.CONTENT)

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
        this.hierarchySelectorService = new SelectorHierarchy(new ColorGeneratorService());
        this.setHierarchySelector = undefined;
        
        this.init();
    }

    init() {
        // Wait for document.body to be available
        if (!document.body) {
            console.log("🌊 Shadow DOM: Document body not ready, waiting...");
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
        
        // Initialize state machine
        this.initializeStateMachine();
        
        // Set up message listeners
        this.setupMessageListeners();
        
        console.log("🌊 Shadow DOM initialized successfully");
    }

    initializeStateMachine() {
        const stateMachineMap = new Map();
        stateMachineMap.set("base", Base);

        this.stateMachine = new StateMachine();
        
        const states = {
            "waving": CState("waving", WavingVentures, false, (async (message, state, previousState) => {
                return stateMachineMap.get("waving")
            }).bind(this)),
            "error": CState("error", AllVentures, true, (async (message, state, previousState) => {
                console.log("transitioning from error to base state from " + previousState.name)
                return stateMachineMap.get('base')
            }).bind(this), true),
            "start": CState("start", StartVentures, false, (async (message, state, previousState) => {
                this.latestOptions = message.options;
                this.loadCSSTemplate(this.latestOptions.wave.cssTemplate);
                this.going = true;
                this.initializeOrUpdateToggleObserver(message);
                return stateMachineMap.get('waving')
            }).bind(this), false),
            "stop": CState("stop", StopVentures, true, (async (message, state, previousState) => {
                this.unloadCSS();
                this.going = false;
                return previousState.name === "waving" ? stateMachineMap.get("base") : previousState;
            }).bind(this), false),
            "update": CState("update", BaseVentures, false, (async (message, state, previousState) => {
                this.unloadCSS();

                if (!message?.options) {
                    console.log("warning: update called with no options" + JSON.stringify(message));
                    return previousState;
                }

                this.latestOptions = message.options;

                console.log("Update called with previous state: " + previousState.name);
                if (previousState.name === "waving") {
                    this.loadCSSTemplate(this.latestOptions.wave.cssTemplate);
                }

                if (this.setHierarchySelector) {
                    this.setHierarchySelector(this.latestOptions.wave.selector);
                }

                this.initializeOrUpdateToggleObserver(message);
                return previousState
            }).bind(this), true),
            "toggle start": CState("toggle start", StartVentures, false, (async (message, state, previousState) => {
                this.loadCSSTemplate(this.latestOptions.wave.cssTemplate);
                this.going = true;
                this.sendMessageToBackground(new UpdateGoingStateMessage({
                    going: true
                }));
                return stateMachineMap.get('waving')
            }).bind(this), false),
            "toggle stop": CState("toggle stop", StopVentures, false, (async (message, state, previousState) => {
                this.unloadCSS();
                this.going = false;
                this.sendMessageToBackground(new UpdateGoingStateMessage({
                    going: false
                }));
                return stateMachineMap.get('base')
            }).bind(this), false),
            "start-selection-choose": CState("start-selection-choose", ["selection mode activate"], true, (async (message, state, previousState) => {
                const selector = message?.selector;

                if (!(selector || "").trim()) {
                    console.log("start selection choose activated without selector!")
                }

                console.log("🌊 Shadow DOM: Starting selector mode activation");
                console.log("🌊 Shadow DOM: Selector:", selector);

                try {
                    console.log("🌊 Shadow DOM: Mounting selector hierarchy component...");
                    this.hierarchySelectorMount = MountOrFindSelectorHierarchyComponent({
                        service: this.hierarchySelectorService,
                        selector,
                        passSetSelector: (modifier) => { 
                            console.log("🌊 Shadow DOM: Setting hierarchy selector modifier");
                            this.setHierarchySelector = modifier; 
                        },
                        onConfirmSelector: (selector) => {
                            console.log("🌊 onConfirmSelector called with selector:", selector);
                            this.stateMachine.handleState(new SelectionMadeMessage({
                                selector
                            }));
                        },
                        doc: document
                    });
                    console.log("🌊 Shadow DOM: Selector hierarchy component mounted successfully");
                } catch (error) {
                    console.error("🌊 Shadow DOM: Failed to mount selector hierarchy component:", error);
                }

                return stateMachineMap.get('selection mode')
            }).bind(this), false),
            "selection mode": CState("selection mode", ["selection mode activate", "selection mode", "selection made", "end-selection-choose"], true, (async (message, state, previousState) => {
                return stateMachineMap.get('selection mode')
            }).bind(this), false),
            "selection made": CState("selection made", ["end-selection-choose"], true, (async (message, state, previousState) => {
                console.log("🌊 Selection made state triggered with selector:", message?.selector);
                
                this.sendMessageToBackground({
                    name: 'selection-made',
                    selector: message?.selector
                });
                
                return stateMachineMap.get('end-selection-choose');
            }).bind(this), false),
            "end-selection-choose": CState("end-selection-choose", BaseVentures, true, (async (message, state, previousState) => {
                console.log("🌊 Shadow DOM: Ending selector mode");
                
                try {
                    if (this.hierarchySelectorMount && this.hierarchySelectorMount.remove) {
                        console.log("🌊 Shadow DOM: Removing hierarchy selector mount");
                        this.hierarchySelectorMount.remove();
                    }
                    this.setHierarchySelector = undefined;
                    console.log("🌊 Shadow DOM: Selector mode ended successfully");
                } catch (error) {
                    console.error("🌊 Shadow DOM: Failed to end selector mode:", error);
                }

                return stateMachineMap.get('base')
            }).bind(this), false)
        };

        Object.keys(states).forEach(key => stateMachineMap.set(key, states[key]));

        if (!stateMachineMap.has("base")) {
            stateMachineMap.set("base", Base);
        }

        const stateNameMap = {
            map: stateMachineMap,
            getState: (name) => stateMachineMap.get(name)
        };

        this.stateMachine.initialize(stateNameMap, Base);
        console.log("🌊 Shadow DOM state machine initialized");
    }

    setupMessageListeners() {
        console.log("🌊 Shadow DOM: Setting up message listeners...");
        
        // Listen for window.postMessage since we're in ISOLATED world
        console.log("🌊 Shadow DOM: Adding window.postMessage listener");
        window.addEventListener('message', (event) => {
            // Only handle messages from our extension
            if (event.source !== window || !event.data || event.data.source !== 'wave-reader-extension') {
                return;
            }
            
            const message = event.data.message;
            console.log(`🌊 Shadow DOM received window.postMessage: ${JSON.stringify(message)}`);

            if (message.from !== "popup" && message.from !== "background-script") {
                console.log(`🌊 Message not from popup or background-script, ignoring. From: ${message.from}`);
                return;
            }

            // Handle ping messages to test connectivity
            if (message.name === 'ping') {
                console.log("🌊 Shadow DOM: Received ping message");
                                    // Send response via window.postMessage back to background
                    window.postMessage({
                        source: 'wave-reader-extension',
                        message: { success: true, message: 'Shadow DOM content script is ready' }
                    }, '*');
                return;
            }

                        // Handle keyboard shortcut toggle command
            if (message.name === 'toggle-wave-reader') {
                console.log("🌊 Shadow DOM: Received toggle-wave-reader command from keyboard shortcut");
                try {
                    this.toggleWave();
                    
                    // Send update-going-state to background to sync the UI
                    this.sendMessageToBackground(new UpdateGoingStateMessage({
                        going: this.going
                    }));
                    
                    // Send response via window.postMessage back to background
                    window.postMessage({
                        source: 'wave-reader-extension',
                        message: { success: true }
                    }, '*');
                } catch (e) {
                    console.error(`🌊 Failed to process toggle command: ${e.message}`);
                    // Send error response via window.postMessage back to background
                    window.postMessage({
                        source: 'wave-reader-extension',
                        message: { success: false, error: e.message }
                    }, '*');
                }
                return;
            }

            // Handle update-going-state message
            if (message.name === 'update-going-state') {
                console.log("🌊 Shadow DOM: Received update-going-state command:", message.going);
                try {
                    this.going = message.going;
                    console.log("🌊 Shadow DOM: Updated going state to:", this.going);
                    
                    // Send response via window.postMessage back to background
                    window.postMessage({
                        source: 'wave-reader-extension',
                        message: { success: true, going: this.going }
                    }, '*');
                } catch (e) {
                    console.error(`🌊 Failed to process update-going-state command: ${e.message}`);
                    // Send error response via window.postMessage back to background
                    window.postMessage({
                        source: 'wave-reader-extension',
                        message: { success: false, error: e.message }
                    }, '*');
                }
                return;
            }

            try {
                console.log(`🌊 Processing message: ${message.name}`);
                this.stateMachine.handleState(message);
                console.log(`🌊 Message processed successfully`);
                
                // Send response via window.postMessage back to background
                window.postMessage({
                    source: 'wave-reader-extension-response',
                    message: { success: true }
                }, '*');
            } catch (e) {
                console.error(`🌊 Failed to process message: ${JSON.stringify(message)}, error: ${e.message}`);
                // Send error response via window.postMessage back to background
                window.postMessage({
                    source: 'wave-reader-extension',
                    message: { success: false, error: e.message }
                }, '*');
            }
        });
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
        
        console.log("🌊 Shadow DOM: CSS loaded into main document");
    }

    unloadCSS() {
        if (this.styleElement) {
            this.styleElement.textContent = '';
        }
        
        // Remove CSS from main document
        if (this.mainDocumentStyle) {
            this.mainDocumentStyle.remove();
            this.mainDocumentStyle = null;
        }
        
        console.log("🌊 Shadow DOM: CSS unloaded from main document");
    }

    loadCSSTemplate(css) {
        this.unloadCSS();
        setTimeout(() => this.loadCSS(css));
    }

    sendMessageToBackground(message) {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({
                from: 'content-script',
                ...message
            }).catch(error => {
                console.error("🌊 Shadow DOM: Failed to send message to background:", error);
            });
        }
    }

    initializeOrUpdateToggleObserver(message) {
        if (this.keychordObserver !== undefined) {
            this.stopKeyChordEventListenerPredicate();
        }

        this.keychordObserver = FollowKeyChordObserver(
            message.options.toggleKeys.keyChord,
            WindowKeyDownKey((e) => {
                this.eventListener = e;
            }, false),
            this.stopKeyChordEventListenerPredicate
        ).subscribe((matched) => {
            if (!matched) {
                return;
            } else {
                console.log("matched: " + matched);
            }

            this.toggleWave();
        });
    }

    stopKeyChordEventListenerPredicate = () => {
        if (this.eventListener !== undefined) {
            window.removeEventListener("keydown", this.eventListener);
        }
    }

    toggleWave = debounce((() => {
        if (this.stateMachine.getCurrentState().name === "waving") {
            this.stateMachine.handleState(this.stateMachine.getState("toggle stop"));
        } else {
            this.stateMachine.handleState(this.stateMachine.getState("toggle start"));
        }
    }).bind(this), 500, false);
}

// Initialize the Shadow DOM when the script loads
const waveReaderShadow = new WaveReaderShadowDOM();

// Expose to window object for debugging
window.waveReaderShadow = waveReaderShadow;

console.log("🌊 Wave Reader Shadow DOM content script loaded successfully"); 