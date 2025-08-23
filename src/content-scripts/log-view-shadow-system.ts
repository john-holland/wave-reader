import { LogViewMessageUtility } from '../util/log-view-messages';
import { MessageFactory } from '../models/messages/log-view-messages';
import { 
    BaseVentures, 
    StartVentures, 
    StopVentures, 
    WavingVentures,
    MLVentures,
    WaveReaderVentures,
    AnalyticsVentures,
    ExtensionVentures
} from '../util/venture-states';
import { MountOrFindSelectorHierarchyComponent } from '../components/selector-hierarchy';
import { SelectorHierarchy } from '../services/selector-hierarchy';
import { SimpleColorServiceAdapter } from '../services/simple-color-service';
import { MLSettingsService } from '../services/ml-settings-service';
import Wave from '../models/wave';
import Options from '../models/options';
import StateMachine from '../util/state-machine';
import { CState } from '../util/state';

// Log-View-Machine Shadow DOM System
export class LogViewShadowSystem {
    private shadowRoot: ShadowRoot | null = null;
    private shadowStyleElement: HTMLStyleElement | null = null;
    private selectorUiRoot: HTMLDivElement | null = null;
    private going: boolean = false;
    private latestOptions: Options | undefined;
    private hierarchySelectorService: SelectorHierarchy;
    private setHierarchySelector: any = undefined;
    private hierarchySelectorMount: any = undefined;
    private mlService: MLSettingsService;
    private stateMachine: StateMachine;
    private messageHistory: any[] = [];
    private sessionId: string;
    
    // Mouse-following wave variables
    private mouseX: number = 0;
    private mouseY: number = 0;
    private mouseFollowInterval: any = null;
    private lastCss: string = '';
    private lastMouseX: number = 0;
    private lastMouseY: number = 0;
    private lastMouseTime: number = Date.now();
    private currentAnimationDuration: number | null = null;

    constructor() {
        console.log("🌊 Creating Log-View-Machine Shadow DOM System...");
        
        // Initialize services
        const colorService = new SimpleColorServiceAdapter();
        this.hierarchySelectorService = new SelectorHierarchy(colorService);
        this.mlService = new MLSettingsService();
        this.stateMachine = new StateMachine();
        this.sessionId = this.generateSessionId();
        
        // Initialize the system
        this.init();
        
        // Set up message listeners
        this.setupMessageListeners();
        
        console.log("🌊 Log-View-Machine Shadow DOM System initialized successfully");
    }

    private generateSessionId(): string {
        return `shadow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private init() {
        // Wait for document.body to be available
        if (!document.body) {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        // Create shadow DOM container
        this.createShadowDOMContainer();
        
        // Create style elements
        this.createStyleElements();
        
        // Initialize state machine
        this.initializeStateMachine();
        
        // Set up mouse tracking
        this.setupMouseTracking();
        
        // Log system initialization
        this.logMessage('system-init', 'Shadow DOM system initialized successfully');
    }

    private createShadowDOMContainer() {
        const container = document.createElement('div');
        container.id = 'wave-reader-log-view-shadow-container';
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

        if (!this.shadowRoot) {
            console.error("🌊 ERROR: Shadow root is null after creation");
            return;
        }
    }

    private createStyleElements() {
        // Shadow DOM styles
        this.shadowStyleElement = document.createElement('style');
        this.shadowStyleElement.textContent = `
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
            
            .wave-reader-selector-ui {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px;
                border-radius: 8px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                max-width: 300px;
                z-index: 2147483646;
            }
        `;
        
        this.shadowRoot!.appendChild(this.shadowStyleElement);
    }

    private initializeStateMachine() {
        // Create base state with log-view-machine ventures
        const baseState = CState('base', [
            ...BaseVentures,
            ...StartVentures,
            ...StopVentures,
            ...WavingVentures,
            ...MLVentures,
            ...WaveReaderVentures,
            ...AnalyticsVentures,
            ...ExtensionVentures
        ], true, async (message: any, state: any, previousState: any) => {
            console.log(`🌊 Log-View-Machine Shadow: Transitioning to ${state.name}`);
            this.logMessage('state-transition', `Transitioned to ${state.name}`);
            return state;
        });

        // Create a proper state map that implements NameAccessMapInterface
        const stateMap = {
            getState: (name: string) => {
                if (name === 'base') return baseState;
                return undefined;
            }
        };

        this.stateMachine.initialize(stateMap, baseState);
        this.logMessage('state-machine-init', 'State machine initialized with log-view ventures');
    }

    private setupMouseTracking() {
        // Track mouse movement for wave animation
        document.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
            this.lastMouseTime = Date.now();
            
            if (this.going && this.latestOptions?.wave) {
                this.updateMouseFollowingWave();
            }
        });
    }

    private setupMessageListeners() {
        // Listen for messages from the extension
        window.addEventListener('message', (event) => {
            if (event.source !== window) return;
            if (event.data?.source !== 'wave-reader-extension') return;

            const messageData = event.data.message;
            this.handleExtensionMessage(messageData);
        });

        // Listen for messages from the popup
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                this.handlePopupMessage(message, sender, sendResponse);
                return true; // Keep message channel open
            });
        }
    }

    private handleExtensionMessage(messageData: any) {
        console.log("🌊 Log-View-Machine Shadow: Received extension message:", messageData);
        
        // Create a proper message using our factory
        const message = MessageFactory.createMessage(messageData.name, messageData.from, messageData);
        
        // Log the message
        this.logMessage('extension-message', `Received ${messageData.name} from ${messageData.from}`);
        
        // Route the message through our log-view system
        const route = LogViewMessageUtility.routeMessage(
            messageData.from, 
            'shadow-content-script', 
            message, 
            this.sessionId
        );
        
        // Handle the message based on its type
        this.processMessage(message, route);
    }

    private handlePopupMessage(message: any, sender: any, sendResponse: any) {
        console.log("🌊 Log-View-Machine Shadow: Received popup message:", message);
        
        // Create a proper message using our factory
        const popupMessage = MessageFactory.createMessage(message.name, message.from, message);
        
        // Log the message
        this.logMessage('popup-message', `Received ${message.name} from popup`);
        
        // Route the message through our log-view system
        const route = LogViewMessageUtility.routeMessage(
            'popup', 
            'shadow-content-script', 
            popupMessage, 
            this.sessionId
        );
        
        // Handle the message based on its type
        this.processMessage(popupMessage, route);
        
        // Send response back to popup
        sendResponse({ success: true, sessionId: this.sessionId });
    }

    private processMessage(message: any, route: any) {
        const messageName = message.name;
        
        try {
            switch (messageName) {
                case 'start':
                    this.handleStart(message);
                    break;
                case 'stop':
                    this.handleStop(message);
                    break;
                case 'toggle-wave-reader':
                    this.handleToggle(message);
                    break;
                case 'selection-made':
                    this.handleSelectionMade(message);
                    break;
                case 'ml-recommendation':
                    this.handleMLRecommendation(message);
                    break;
                case 'settings-reset':
                    this.handleSettingsReset(message);
                    break;
                case 'wave-reader-start':
                    this.handleWaveReaderStart(message);
                    break;
                case 'wave-reader-stop':
                    this.handleWaveReaderStop(message);
                    break;
                case 'analytics':
                    this.handleAnalytics(message);
                    break;
                case 'health-check':
                    this.handleHealthCheck(message);
                    break;
                case 'ping':
                    this.handlePing(message);
                    break;
                default:
                    console.log(`🌊 Log-View-Machine Shadow: Unknown message type: ${messageName}`);
                    this.logMessage('unknown-message', `Unknown message type: ${messageName}`);
            }
        } catch (error: any) {
            console.error(`🌊 Log-View-Machine Shadow: Error processing message ${messageName}:`, error);
            this.logMessage('message-error', `Error processing ${messageName}: ${error?.message || 'Unknown error'}`);
        }
    }

    private handleStart(message: any) {
        console.log("🌊 Log-View-Machine Shadow: Handling start message");
        this.going = true;
        this.logMessage('start', 'Wave reader started');
        
        // Update state machine
        this.stateMachine.handleState({ name: 'start' });
        
        // Apply wave animation
        this.applyWaveAnimation();
        
        // Start mouse following if options are available
        if (this.latestOptions?.wave) {
            this.startMouseFollowingWave();
        }
    }

    private handleStop(message: any) {
        console.log("🌊 Log-View-Machine Shadow: Handling stop message");
        this.going = false;
        this.logMessage('stop', 'Wave reader stopped');
        
        // Update state machine
        this.stateMachine.handleState({ name: 'stop' });
        
        // Remove wave animation
        this.removeWaveAnimation();
        
        // Stop mouse following
        this.stopMouseFollowingWave();
    }

    private handleToggle(message: any) {
        console.log("🌊 Log-View-Machine Shadow: Handling toggle message");
        
        if (this.going) {
            this.handleStop(message);
        } else {
            this.handleStart(message);
        }
    }

    private handleSelectionMade(message: any) {
        console.log("🌊 Log-View-Machine Shadow: Handling selection made message");
        this.logMessage('selection-made', `Selector selected: ${message.selector}`);
        
        // Update state machine
        this.stateMachine.handleState({ name: 'selection-made' });
        
        // Handle selector selection
        this.handleSelectorSelection(message.selector);
    }

    private handleMLRecommendation(message: any) {
        console.log("🌊 Log-View-Machine Shadow: Handling ML recommendation message");
        this.logMessage('ml-recommendation', 'ML recommendation received');
        
        // Update state machine
        this.stateMachine.handleState({ name: 'ml-recommendation' });
        
        // Process ML recommendation
        this.processMLRecommendation(message);
    }

    private handleSettingsReset(message: any) {
        console.log("🌊 Log-View-Machine Shadow: Handling settings reset message");
        this.logMessage('settings-reset', 'Settings reset requested');
        
        // Update state machine
        this.stateMachine.handleState({ name: 'settings-reset' });
        
        // Reset to ML defaults
        this.resetToMLDefaults();
    }

    private handleWaveReaderStart(message: any) {
        console.log("🌊 Log-View-Machine Shadow: Handling wave reader start message");
        this.logMessage('wave-reader-start', 'Wave reader component started');
        
        // Update state machine
        this.stateMachine.handleState({ name: 'wave-reader-start' });
        
        // Initialize wave reader components
        this.initializeWaveReaderComponents();
    }

    private handleWaveReaderStop(message: any) {
        console.log("🌊 Log-View-Machine Shadow: Handling wave reader stop message");
        this.logMessage('wave-reader-stop', 'Wave reader component stopped');
        
        // Update state machine
        this.stateMachine.handleState({ name: 'wave-reader-stop' });
        
        // Clean up wave reader components
        this.cleanupWaveReaderComponents();
    }

    private handleAnalytics(message: any) {
        console.log("🌊 Log-View-Machine Shadow: Handling analytics message");
        this.logMessage('analytics', 'Analytics event received');
        
        // Update state machine
        this.stateMachine.handleState({ name: 'analytics' });
        
        // Process analytics
        this.processAnalytics(message);
    }

    private handleHealthCheck(message: any) {
        console.log("🌊 Log-View-Machine Shadow: Handling health check message");
        this.logMessage('health-check', 'Health check requested');
        
        // Update state machine
        this.stateMachine.handleState({ name: 'health-check' });
        
        // Perform health check
        const healthStatus = this.performHealthCheck();
        
        // Send response back
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage({
                from: 'shadow-content-script',
                name: 'health-check-result',
                status: healthStatus,
                sessionId: this.sessionId
            });
        }
    }

    private handlePing(message: any) {
        console.log("🌊 Log-View-Machine Shadow: Handling ping message");
        this.logMessage('ping', 'Ping received');
        
        // Update state machine
        this.stateMachine.handleState({ name: 'ping' });
        
        // Send pong response
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage({
                from: 'shadow-content-script',
                name: 'pong',
                timestamp: Date.now(),
                sessionId: this.sessionId
            });
        }
    }

    private handleSelectorSelection(selector: string) {
        // Create selector hierarchy component
        if (!this.selectorUiRoot) {
            this.selectorUiRoot = document.createElement('div');
            this.selectorUiRoot.id = 'wave-reader-selector-ui';
            this.selectorUiRoot.className = 'wave-reader-selector-ui';
            this.shadowRoot!.appendChild(this.selectorUiRoot);
        }

        // Mount selector hierarchy component
        this.hierarchySelectorMount = MountOrFindSelectorHierarchyComponent({
            service: this.hierarchySelectorService,
            selector: selector,
            passSetSelector: (setter: any) => {
                this.setHierarchySelector = setter;
            },
            onConfirmSelector: (confirmedSelector: string) => {
                console.log("🌊 Log-View-Machine Shadow: Selector confirmed:", confirmedSelector);
                this.logMessage('selector-confirmed', `Selector confirmed: ${confirmedSelector}`);
                
                // Send confirmation back to popup
                if (typeof chrome !== 'undefined' && chrome.runtime) {
                    chrome.runtime.sendMessage({
                        from: 'shadow-content-script',
                        name: 'selector-confirmed',
                        selector: confirmedSelector,
                        sessionId: this.sessionId
                    });
                }
            },
            doc: document,
            uiRoot: this.shadowRoot!,
            renderFunction: (mount: any, component: any) => {
                // Render the component
                console.log("🌊 Log-View-Machine Shadow: Rendering selector component");
            }
        });
    }

    private processMLRecommendation(message: any) {
        // Get ML recommendations for current domain
        const domain = window.location.hostname;
        const path = window.location.pathname;
        
        this.mlService.getSettingsRecommendations(domain, path, message.selector || 'body')
            .then((recommendations) => {
                console.log("🌊 Log-View-Machine Shadow: ML recommendations received:", recommendations);
                this.logMessage('ml-recommendations', `Received ${recommendations.length} ML recommendations`);
                
                // Apply the best recommendation
                if (recommendations.length > 0) {
                    const bestRecommendation = recommendations[0];
                    this.applyMLRecommendation(bestRecommendation);
                }
            })
            .catch((error) => {
                console.error("🌊 Log-View-Machine Shadow: Error getting ML recommendations:", error);
                this.logMessage('ml-error', `Error getting recommendations: ${error.message}`);
            });
    }

    private resetToMLDefaults() {
        const domain = window.location.hostname;
        const path = window.location.pathname;
        
        try {
            const newDefaults = this.mlService.resetToNewDefaults();
            console.log("🌊 Log-View-Machine Shadow: Reset to ML defaults:", newDefaults);
            this.logMessage('ml-reset', 'Reset to ML defaults completed');
            
            // Apply new defaults
            this.applyMLRecommendation({
                settings: newDefaults,
                confidence: 1.0,
                reasoning: ['Reset to ML defaults']
            });
        } catch (error: any) {
            console.error("🌊 Log-View-Machine Shadow: Error resetting to ML defaults:", error);
            this.logMessage('ml-reset-error', `Error resetting: ${error?.message || 'Unknown error'}`);
        }
    }

    private applyMLRecommendation(recommendation: any) {
        if (recommendation.settings?.wave) {
            this.latestOptions = recommendation.settings;
            this.logMessage('ml-applied', `Applied ML recommendation with confidence ${recommendation.confidence}`);
            
            // Apply wave animation if currently active
            if (this.going) {
                this.applyWaveAnimation();
                this.startMouseFollowingWave();
            }
        }
    }

    private initializeWaveReaderComponents() {
        console.log("🌊 Log-View-Machine Shadow: Initializing wave reader components");
        this.logMessage('components-init', 'Wave reader components initialized');
        
        // Initialize any additional components here
    }

    private cleanupWaveReaderComponents() {
        console.log("🌊 Log-View-Machine Shadow: Cleaning up wave reader components");
        this.logMessage('components-cleanup', 'Wave reader components cleaned up');
        
        // Clean up any components here
    }

    private processAnalytics(message: any) {
        console.log("🌊 Log-View-Machine Shadow: Processing analytics:", message);
        this.logMessage('analytics-processed', `Analytics processed: ${message.eventType}`);
        
        // Process analytics data here
    }

    private performHealthCheck() {
        const healthStatus = {
            timestamp: Date.now(),
            sessionId: this.sessionId,
            going: this.going,
            stateMachineState: this.stateMachine.getCurrentState()?.name,
            shadowRoot: !!this.shadowRoot,
            selectorService: !!this.hierarchySelectorService,
            mlService: !!this.mlService,
            messageHistoryLength: this.messageHistory.length,
            options: this.latestOptions ? 'loaded' : 'not-loaded',
            mouseTracking: {
                active: !!this.mouseFollowInterval,
                lastPosition: { x: this.mouseX, y: this.mouseY },
                lastUpdate: this.lastMouseTime
            }
        };
        
        console.log("🌊 Log-View-Machine Shadow: Health check completed:", healthStatus);
        return healthStatus;
    }

    private applyWaveAnimation() {
        if (!this.latestOptions?.wave) return;
        
        const wave = this.latestOptions.wave;
        const css = wave.cssTemplate;
        
        if (css) {
            // Apply CSS animation
            this.shadowStyleElement!.textContent = css;
            this.logMessage('wave-animation-applied', 'Wave animation applied');
        }
    }

    private removeWaveAnimation() {
        if (this.shadowStyleElement) {
            this.shadowStyleElement.textContent = '';
            this.logMessage('wave-animation-removed', 'Wave animation removed');
        }
    }

    private startMouseFollowingWave() {
        if (!this.latestOptions?.wave || this.mouseFollowInterval) return;
        
        const interval = this.latestOptions.wave.mouseFollowInterval || 100;
        
        this.mouseFollowInterval = setInterval(() => {
            this.updateMouseFollowingWave();
        }, interval);
        
        this.logMessage('mouse-following-started', `Mouse following started with interval ${interval}ms`);
    }

    private stopMouseFollowingWave() {
        if (this.mouseFollowInterval) {
            clearInterval(this.mouseFollowInterval);
            this.mouseFollowInterval = null;
            this.logMessage('mouse-following-stopped', 'Mouse following stopped');
        }
    }

    private updateMouseFollowingWave() {
        if (!this.latestOptions?.wave || !this.going) return;
        
        const wave = this.latestOptions.wave;
        const now = Date.now();
        
        // Only update if enough time has passed
        if (now - this.lastMouseTime < (wave.mouseFollowInterval || 100)) {
            return;
        }
        
        // Calculate wave parameters based on mouse position
        const translateX = this.calculateTranslateX();
        const rotateY = this.calculateRotateY();
        
        // Apply the wave transformation
        this.applyMouseWave(translateX, rotateY);
        
        this.lastMouseTime = now;
        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
    }

    private calculateTranslateX(): number {
        const centerX = window.innerWidth / 2;
        const relativeX = (this.mouseX - centerX) / centerX;
        return relativeX * (this.latestOptions?.wave?.axisTranslateAmountXMax || 1);
    }

    private calculateRotateY(): number {
        const centerY = window.innerHeight / 2;
        const relativeY = (this.mouseY - centerY) / centerY;
        return relativeY * (this.latestOptions?.wave?.axisRotationAmountYMax || 2);
    }

    private applyMouseWave(translateX: number, rotateY: number) {
        if (!this.latestOptions?.wave) return;
        
        const wave = this.latestOptions.wave;
        const css = wave.cssMouseTemplate
            ?.replace('TRANSLATE_X', translateX.toString())
            ?.replace('ROTATE_Y', rotateY.toString())
            ?.replace('ANIMATION_DURATION', (wave.waveSpeed || 4).toString()) || '';
        
        if (css !== this.lastCss) {
            this.shadowStyleElement!.textContent = css;
            this.lastCss = css;
        }
    }

    private logMessage(type: string, message: string, data?: any) {
        const logEntry = {
            timestamp: Date.now(),
            type,
            message,
            data,
            sessionId: this.sessionId,
            url: window.location.href,
            state: this.stateMachine.getCurrentState()?.name
        };
        
        this.messageHistory.push(logEntry);
        
        // Keep only last 1000 messages
        if (this.messageHistory.length > 1000) {
            this.messageHistory = this.messageHistory.slice(-1000);
        }
        
        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`🌊 Log-View-Machine Shadow [${type}]:`, message, data || '');
        }
    }

    // Public methods for external access
    public getMessageHistory() {
        return [...this.messageHistory];
    }

    public getCurrentState() {
        return this.stateMachine.getCurrentState();
    }

    public getSessionId() {
        return this.sessionId;
    }

    public getHealthStatus() {
        return this.performHealthCheck();
    }

    public destroy() {
        console.log("🌊 Log-View-Machine Shadow: Destroying shadow system");
        
        // Clean up
        this.removeWaveAnimation();
        this.stopMouseFollowingWave();
        
        // Remove DOM elements
        if (this.shadowRoot?.host) {
            this.shadowRoot.host.remove();
        }
        
        this.logMessage('system-destroyed', 'Shadow system destroyed');
    }
}

// Initialize the system when the script loads
console.log("🌊 Log-View-Machine: Initializing shadow system...");

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LogViewShadowSystem();
    });
} else {
    new LogViewShadowSystem();
}

// Export for testing
export default LogViewShadowSystem;
