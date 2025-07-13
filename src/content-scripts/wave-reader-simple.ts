import { guardLastError } from "../../src/util/util";
import debounce from "../../src/util/debounce";
import { MountOrFindSelectorHierarchyComponent } from "../../src/components/selector-hierarchy";
import { SelectorHierarchy } from "../../src/services/selector-hierarchy";
import { SimpleColorServiceAdapter } from "../../src/services/simple-color-service";
import ReactDOM from "react-dom";

console.log("🌊 Wave Reader Simple Shadow DOM content script is loading on:", window.location.href);

class WaveReaderShadowDOM {
    private shadowRoot: ShadowRoot | null = null;
    private shadowStyleElement: HTMLStyleElement | null = null;
    private mainDocumentStyleElement: HTMLStyleElement | null = null;
    private selectorUiRoot: HTMLDivElement | null = null;
    private going: boolean = false;
    private latestOptions: any = undefined;
    private hierarchySelectorService: SelectorHierarchy;
    private setHierarchySelector: any = undefined;
    private hierarchySelectorMount: any = undefined;

    constructor() {
        console.log("🌊 Creating SimpleColorServiceAdapter...");
        const colorService = new SimpleColorServiceAdapter();
        console.log("🌊 Color service created:", colorService);
        this.hierarchySelectorService = new SelectorHierarchy(colorService);
        console.log("🌊 SelectorHierarchy created with color service:", this.hierarchySelectorService);
        this.init();
    }

    init() {
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

        // Ensure shadow root is properly initialized
        if (!this.shadowRoot) {
            console.error("🌊 ERROR: Shadow root is null after creation");
            return;
        }

        // Create style element for Shadow DOM CSS injection
        this.shadowStyleElement = document.createElement('style');
        this.shadowStyleElement.textContent = `
            /* Wave Reader Shadow DOM Styles */
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
        
        // Ensure shadow root is available before appending
        if (this.shadowRoot) {
            this.shadowRoot.appendChild(this.shadowStyleElement);
            console.log("🌊 Shadow DOM style element added successfully");
        } else {
            console.error("🌊 ERROR: Shadow root is null when trying to append style element");
        }

        // Create style element for main document CSS injection
        this.mainDocumentStyleElement = document.createElement('style');
        this.mainDocumentStyleElement.id = 'wave-reader-main-styles';
        this.mainDocumentStyleElement.textContent = `
            /* Wave Reader Main Document Styles */
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
        document.head.appendChild(this.mainDocumentStyleElement);
        console.log("🌊 CSS injected into both Shadow DOM and main document");

        // Create selector UI root
        this.selectorUiRoot = document.createElement('div');
        this.selectorUiRoot.id = 'selector-ui-root';
        this.shadowRoot.appendChild(this.selectorUiRoot);

        // Set up message listeners
        this.setupMessageListeners();
        console.log("🌊 Shadow DOM initialized successfully");
    }

    setupMessageListeners() {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                console.log(`🌊 Shadow DOM received message: ${JSON.stringify(message)}`);
                if (guardLastError()) {
                    console.log('🌊 Guard last error returned true, ignoring message');
                    return false;
                }
                if (message.from !== "popup" && message.from !== "background-script") {
                    console.log(`🌊 Message not from popup or background-script, ignoring. From: ${message.from}`);
                    return false;
                }
                try {
                    console.log(`🌊 Processing message: ${message.name}`);
                    this.handleMessage(message);
                    console.log(`🌊 Message processed successfully`);
                    setTimeout(() => {
                        try {
                            sendResponse({ success: true });
                        } catch (error) {
                            console.warn("🌊 Shadow DOM: Failed to send response:", error);
                        }
                    }, 100);
                } catch (e: any) {
                    console.error(`🌊 Failed to process message: ${JSON.stringify(message)}, error: ${e.message}`);
                    setTimeout(() => {
                        try {
                            sendResponse({ success: false, error: e.message });
                        } catch (error: any) {
                            console.warn("🌊 Shadow DOM: Failed to send error response:", error);
                        }
                    }, 100);
                }
                return true;
            });
        }
    }

    handleMessage(message: any) {
        switch (message.name) {
            case 'start':
                this.startWaving(message);
                break;
            case 'stop':
                this.stopWaving();
                break;
            case 'update':
                this.updateOptions(message);
                break;
            case 'toggle':
                this.toggleWaving();
                break;
            case 'start-selection-choose':
                this.mountSelectorUI(message);
                break;
            case 'end-selection-choose':
                this.unmountSelectorUI();
                break;
            default:
                console.log(`🌊 Unknown message: ${message.name}`);
        }
    }

    mountSelectorUI(message: any) {
        console.log("🌊 Mounting selector UI...");
        console.log("🌊 Shadow root:", this.shadowRoot);
        console.log("🌊 Selector UI root:", this.selectorUiRoot);
        
        if (!this.shadowRoot) {
            console.error("🌊 ERROR: Shadow root is null, cannot mount selector UI");
            return;
        }
        
        if (!this.selectorUiRoot) {
            console.error("🌊 ERROR: Selector UI root is null, cannot mount selector UI");
            return;
        }
        
        // Remove any previous UI
        this.unmountSelectorUI();
        
        try {
            // Mount the selector hierarchy component inside the shadow root
            const uiElement = MountOrFindSelectorHierarchyComponent({
                service: this.hierarchySelectorService,
                selector: message?.selector,
                passSetSelector: (modifier: any) => {
                    this.setHierarchySelector = modifier;
                },
                onConfirmSelector: (selector: string) => {
                    // Send selection made message
                    chrome.runtime.sendMessage({
                        from: 'content-script',
                        name: 'selection-made',
                        selector
                    });
                    this.unmountSelectorUI();
                },
                doc: this.selectorUiRoot.ownerDocument,
                uiRoot: this.shadowRoot,
                renderFunction: (mount: Element, component: React.ReactNode) => {
                    if (component && mount) {
                        try {
                            ReactDOM.render(component as React.ReactElement, mount);
                            console.log("🌊 React component rendered successfully");
                        } catch (error) {
                            console.error("🌊 Error rendering React component:", error);
                        }
                    } else {
                        console.warn("🌊 Component or mount element is null");
                    }
                }
            });
            if (uiElement) {
                this.hierarchySelectorMount = uiElement;
            }
            console.log("🌊 Selector UI mounted in shadow DOM");
        } catch (error) {
            console.error("🌊 Error mounting selector UI:", error);
        }
    }

    unmountSelectorUI() {
        if (this.hierarchySelectorMount && this.hierarchySelectorMount.remove) {
            this.hierarchySelectorMount.remove();
            this.hierarchySelectorMount = undefined;
        } else if (this.selectorUiRoot) {
            this.selectorUiRoot.innerHTML = '';
        }
        this.setHierarchySelector = undefined;
        console.log("🌊 Selector UI unmounted from shadow DOM");
    }

    startWaving(message: any) {
        console.log("🌊 Starting wave animation");
        this.latestOptions = message.options;
        this.loadCSSTemplate(this.latestOptions.wave.cssTemplate);
        this.going = true;
        this.sendMessageToBackground({
            name: 'update-going-state',
            going: true
        });
    }

    stopWaving() {
        console.log("🌊 Stopping wave animation");
        this.unloadCSS();
        this.going = false;
        this.sendMessageToBackground({
            name: 'update-going-state',
            going: false
        });
    }

    updateOptions(message: any) {
        console.log("🌊 Updating options");
        this.unloadCSS();
        this.latestOptions = message.options;
        if (this.going) {
            this.loadCSSTemplate(this.latestOptions.wave.cssTemplate);
        }
    }

    toggleWaving = debounce(() => {
        if (this.going) {
            this.stopWaving();
        } else {
            this.startWaving({ options: this.latestOptions });
        }
    }, 500, false);

    loadCSS(css: string) {
        if (this.shadowStyleElement) {
            this.shadowStyleElement.textContent = css;
        }
        if (this.mainDocumentStyleElement) {
            this.mainDocumentStyleElement.textContent = css;
        }
        console.log("🌊 CSS loaded into both Shadow DOM and main document");
    }

    unloadCSS() {
        if (this.shadowStyleElement) {
            this.shadowStyleElement.textContent = '';
        }
        if (this.mainDocumentStyleElement) {
            this.mainDocumentStyleElement.textContent = '';
        }
        console.log("🌊 CSS unloaded from both Shadow DOM and main document");
    }

    loadCSSTemplate(css: string) {
        this.unloadCSS();
        setTimeout(() => this.loadCSS(css));
    }

    sendMessageToBackground(message: any) {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
            try {
                chrome.runtime.sendMessage({
                    from: 'content-script',
                    ...message
                });
            } catch (error: any) {
                console.error("🌊 Shadow DOM: Failed to send message to background:", error);
            }
        }
    }
}

new WaveReaderShadowDOM();

console.log("🌊 Wave Reader Simple Shadow DOM content script loaded successfully"); 