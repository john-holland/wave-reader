import { ViewStateMachine, RenderableView, StateAction } from '../util/shared-overarching-state-machine';
import { ChromeRobotProxyMachine } from '../util/robot-proxy-machine';
import { LogViewMessageUtility } from '../util/log-view-messages';
import { MessageFactory } from '../models/messages/log-view-messages';
import { MountOrFindSelectorHierarchyComponent } from '../components/selector-hierarchy';
import { SelectorHierarchy } from '../services/selector-hierarchy';
import { SimpleColorServiceAdapter } from '../services/simple-color-service';
import { MLSettingsService } from '../services/ml-settings-service';
import Wave from '../models/wave';
import Options from '../models/options';

// Log-View Content System using View State Machine
export class LogViewContentSystem {
    private shadowRoot: ShadowRoot | null = null;
    private shadowStyleElement: HTMLStyleElement | null = null;
    private mainDocumentStyleElement: HTMLStyleElement | null = null;
    private selectorUiRoot: HTMLDivElement | null = null;
    private hierarchySelectorService: SelectorHierarchy;
    private setHierarchySelector: any = undefined;
    private hierarchySelectorMount: any = undefined;
    private mlService: MLSettingsService;
    private sessionId: string;
    
    // State machine integration
    private viewStateMachine: ViewStateMachine;
    private robotProxy: ChromeRobotProxyMachine;
    private viewRenderer: ViewRenderer;
    private actionExecutor: ActionExecutor;

    constructor() {
        console.log("🌊 Creating Refactored Log-View Content System...");
        
        // Initialize services
        const colorService = new SimpleColorServiceAdapter();
        this.hierarchySelectorService = new SelectorHierarchy(colorService);
        this.mlService = new MLSettingsService();
        this.sessionId = this.generateSessionId();
        
        // Initialize robot proxy and view state machine
        this.robotProxy = new ChromeRobotProxyMachine();
        this.viewStateMachine = new ViewStateMachine(this.robotProxy);
        
        // Initialize view renderer and action executor
        this.viewRenderer = new ViewRenderer();
        this.actionExecutor = new ActionExecutor(this);
        
        // Initialize the system
        this.init();
        
        // Set up message listeners
        this.setupMessageListeners();
        
        console.log("🌊 Refactored Log-View Content System initialized successfully");
    }

    private generateSessionId(): string {
        return `content-refactored-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private init() {
        // Create shadow DOM container
        const container = document.createElement('div');
        container.id = 'wave-reader-log-view-content-refactored';
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

        // Create style elements
        this.createStyleElements();
        
        // Log system initialization
        this.logMessage('system-init', 'Refactored content system initialized successfully');
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
        `;
        
        this.shadowRoot!.appendChild(this.shadowStyleElement);

        // Main document styles
        this.mainDocumentStyleElement = document.createElement('style');
        this.mainDocumentStyleElement.id = 'wave-reader-log-view-content-refactored-styles';
        this.mainDocumentStyleElement.textContent = `
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

    private async handleExtensionMessage(messageData: any) {
        console.log("🌊 Refactored Content System: Received extension message:", messageData);
        
        // Process message through view state machine
        const result = await this.viewStateMachine.processMessage(messageData, 'extension');
        
        // Execute actions
        await this.actionExecutor.executeActions(result.actions);
        
        // Render views
        this.viewRenderer.renderViews(result.views, this.shadowRoot!);
        
        // Log the result
        this.logMessage('extension-message-processed', `Processed ${messageData.name}`, {
            views: result.views.length,
            actions: result.actions.length
        });
    }

    private async handlePopupMessage(message: any, sender: any, sendResponse: any) {
        console.log("🌊 Refactored Content System: Received popup message:", message);
        
        // Process message through view state machine
        const result = await this.viewStateMachine.processMessage(message, 'popup');
        
        // Execute actions
        await this.actionExecutor.executeActions(result.actions);
        
        // Render views
        this.viewRenderer.renderViews(result.views, this.shadowRoot!);
        
        // Send response back to popup
        sendResponse({ 
            success: true, 
            sessionId: this.sessionId,
            viewsProcessed: result.views.length,
            actionsExecuted: result.actions.length
        });
        
        // Log the result
        this.logMessage('popup-message-processed', `Processed ${message.name}`, {
            views: result.views.length,
            actions: result.actions.length
        });
    }

    // Public methods for action executor
    public async startWaveAnimation(options: any): Promise<void> {
        console.log("🌊 Refactored Content System: Starting wave animation");
        this.logMessage('wave-animation-start', 'Wave animation started');
        
        // Apply wave animation
        if (options?.wave) {
            const wave = options.wave;
            const css = wave.cssTemplate;
            
            if (css) {
                this.mainDocumentStyleElement!.textContent = css;
                this.logMessage('wave-animation-applied', 'Wave animation applied');
            }
        }
    }

    public async stopWaveAnimation(): Promise<void> {
        console.log("🌊 Refactored Content System: Stopping wave animation");
        this.logMessage('wave-animation-stop', 'Wave animation stopped');
        
        // Remove wave animation
        if (this.mainDocumentStyleElement) {
            this.mainDocumentStyleElement.textContent = '';
            this.logMessage('wave-animation-removed', 'Wave animation removed');
        }
    }

    public async showSelectorUI(selector: string): Promise<void> {
        console.log("🌊 Refactored Content System: Showing selector UI");
        this.logMessage('selector-ui-show', `Showing selector UI for: ${selector}`);
        
        // Create selector hierarchy component
        if (!this.selectorUiRoot) {
            this.selectorUiRoot = document.createElement('div');
            this.selectorUiRoot.id = 'wave-reader-selector-ui';
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
                console.log("🌊 Refactored Content System: Selector confirmed:", confirmedSelector);
                this.logMessage('selector-confirmed', `Selector confirmed: ${confirmedSelector}`);
                
                // Send confirmation back to popup
                if (typeof chrome !== 'undefined' && chrome.runtime) {
                    chrome.runtime.sendMessage({
                        from: 'refactored-content-script',
                        name: 'selector-confirmed',
                        selector: confirmedSelector,
                        sessionId: this.sessionId
                    });
                }
            },
            doc: document,
            uiRoot: this.shadowRoot!,
            renderFunction: (mount: any, component: any) => {
                console.log("🌊 Refactored Content System: Rendering selector component");
            }
        });
    }

    public async hideSelectorUI(): Promise<void> {
        console.log("🌊 Refactored Content System: Hiding selector UI");
        this.logMessage('selector-ui-hide', 'Hiding selector UI');
        
        if (this.selectorUiRoot) {
            this.selectorUiRoot.remove();
            this.selectorUiRoot = null;
        }
    }

    public async processMLRecommendation(recommendation: any): Promise<void> {
        console.log("🌊 Refactored Content System: Processing ML recommendation");
        this.logMessage('ml-recommendation-process', 'Processing ML recommendation');
        
        // Get ML recommendations for current domain
        const domain = window.location.hostname;
        const path = window.location.pathname;
        
        try {
            const recommendations = await this.mlService.getSettingsRecommendations(
                domain, 
                path, 
                recommendation.selector || 'body'
            );
            
            console.log("🌊 Refactored Content System: ML recommendations received:", recommendations);
            this.logMessage('ml-recommendations-received', `Received ${recommendations.length} ML recommendations`);
            
            // Apply the best recommendation
            if (recommendations.length > 0) {
                const bestRecommendation = recommendations[0];
                await this.applyMLRecommendation(bestRecommendation);
            }
        } catch (error: any) {
            console.error("🌊 Refactored Content System: Error getting ML recommendations:", error);
            this.logMessage('ml-error', `Error getting recommendations: ${error?.message || 'Unknown error'}`);
        }
    }

    public async resetToMLDefaults(): Promise<void> {
        console.log("🌊 Refactored Content System: Resetting to ML defaults");
        this.logMessage('ml-reset-start', 'Starting ML reset');
        
        try {
            const newDefaults = this.mlService.resetToNewDefaults();
            console.log("🌊 Refactored Content System: Reset to ML defaults:", newDefaults);
            this.logMessage('ml-reset-complete', 'Reset to ML defaults completed');
            
            // Apply new defaults
            await this.applyMLRecommendation({
                settings: newDefaults,
                confidence: 1.0,
                reasoning: ['Reset to ML defaults']
            });
        } catch (error: any) {
            console.error("🌊 Refactored Content System: Error resetting to ML defaults:", error);
            this.logMessage('ml-reset-error', `Error resetting: ${error?.message || 'Unknown error'}`);
        }
    }

    private async applyMLRecommendation(recommendation: any): Promise<void> {
        if (recommendation.settings?.wave) {
            this.logMessage('ml-applied', `Applied ML recommendation with confidence ${recommendation.confidence}`);
            
            // Apply wave animation if currently active
            const currentState = this.overarchingMachine.getCurrentState();
            if (currentState.subMachines.content.waveAnimation.isActive) {
                await this.startWaveAnimation(recommendation.settings);
            }
        }
    }

    private logMessage(type: string, message: string, data?: any) {
        const logEntry = {
            timestamp: Date.now(),
            type,
            message,
            data,
            sessionId: this.sessionId,
            system: 'refactored-content'
        };
        
        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`🌊 Refactored Content System [${type}]:`, message, data || '');
        }
    }

    // Public methods for external access
    public getCurrentState() {
        return this.overarchingMachine.getCurrentState();
    }

    public getCurrentViews() {
        return this.overarchingMachine.getCurrentViews();
    }

    public getSessionId() {
        return this.sessionId;
    }

    public async getHealthStatus() {
        return {
            timestamp: Date.now(),
            sessionId: this.sessionId,
            shadowRoot: !!this.shadowRoot,
            selectorService: !!this.hierarchySelectorService,
            mlService: !!this.mlService,
            overarchingMachine: this.overarchingMachine.getHealthStatus(),
            robotProxy: await this.robotProxy.healthCheck()
        };
    }

    public destroy() {
        console.log("🌊 Refactored Content System: Destroying system");
        
        // Clean up
        if (this.shadowRoot?.host) {
            this.shadowRoot.host.remove();
        }
        
        if (this.mainDocumentStyleElement) {
            this.mainDocumentStyleElement.remove();
        }
        
        // Destroy state machines
        this.overarchingMachine.destroy();
        this.robotProxy.destroy();
        
        this.logMessage('system-destroyed', 'Refactored content system destroyed');
    }
}

// View Renderer for handling view rendering
class ViewRenderer {
    public renderViews(views: RenderableView[], container: ShadowRoot): void {
        console.log(`🌊 View Renderer: Rendering ${views.length} views`);
        
        views.forEach(view => {
            this.renderView(view, container);
        });
    }

    private renderView(view: RenderableView, container: ShadowRoot): void {
        console.log(`🌊 View Renderer: Rendering view ${view.component} of type ${view.type}`);
        
        switch (view.type) {
            case 'content':
                this.renderContentView(view, container);
                break;
                
            case 'shadow':
                this.renderShadowView(view, container);
                break;
                
            case 'overlay':
                this.renderOverlayView(view, container);
                break;
                
            case 'notification':
                this.renderNotificationView(view, container);
                break;
                
            default:
                console.warn(`🌊 View Renderer: Unknown view type: ${view.type}`);
        }
    }

    private renderContentView(view: RenderableView, container: ShadowRoot): void {
        const element = document.createElement('div');
        element.className = `wave-reader-view wave-reader-view--${view.type}`;
        element.innerHTML = `<div class="wave-reader-view__content">${view.props.message || ''}</div>`;
        
        container.appendChild(element);
    }

    private renderShadowView(view: RenderableView, container: ShadowRoot): void {
        const element = document.createElement('div');
        element.className = `wave-reader-view wave-reader-view--${view.type}`;
        element.innerHTML = `<div class="wave-reader-view__content">${view.props.message || ''}</div>`;
        
        container.appendChild(element);
    }

    private renderOverlayView(view: RenderableView, container: ShadowRoot): void {
        const element = document.createElement('div');
        element.className = `wave-reader-view wave-reader-view--${view.type} wave-reader-view--overlay`;
        element.innerHTML = `<div class="wave-reader-view__content">${view.props.message || ''}</div>`;
        
        container.appendChild(element);
    }

    private renderNotificationView(view: RenderableView, container: ShadowRoot): void {
        const element = document.createElement('div');
        element.className = `wave-reader-view wave-reader-view--${view.type} wave-reader-view--notification`;
        element.innerHTML = `<div class="wave-reader-view__content">${view.props.message || ''}</div>`;
        
        container.appendChild(element);
    }
}

// Action Executor for handling action execution
class ActionExecutor {
    private contentSystem: LogViewContentSystemRefactored;

    constructor(contentSystem: LogViewContentSystemRefactored) {
        this.contentSystem = contentSystem;
    }

    public async executeActions(actions: string[]): Promise<void> {
        console.log(`🌊 Action Executor: Executing ${actions.length} actions`);
        
        for (const action of actions) {
            await this.executeAction(action);
        }
    }

    private async executeAction(action: string): Promise<void> {
        console.log(`🌊 Action Executor: Executing action: ${action}`);
        
        try {
            switch (action) {
                case 'start-wave-animation':
                    await this.contentSystem.startWaveAnimation({});
                    break;
                    
                case 'stop-wave-animation':
                    await this.contentSystem.stopWaveAnimation();
                    break;
                    
                case 'show-selector-ui':
                    // This would need to be passed from the state machine
                    break;
                    
                case 'hide-selector-ui':
                    await this.contentSystem.hideSelectorUI();
                    break;
                    
                case 'process-ml-recommendation':
                    // This would need to be passed from the state machine
                    break;
                    
                case 'reset-settings':
                    await this.contentSystem.resetToMLDefaults();
                    break;
                    
                default:
                    console.log(`🌊 Action Executor: Unknown action: ${action}`);
            }
        } catch (error: any) {
            console.error(`🌊 Action Executor: Error executing action ${action}:`, error);
        }
    }
}

// Initialize the system when the script loads
console.log("🌊 Refactored Log-View: Initializing content system...");

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LogViewContentSystemRefactored();
    });
} else {
    new LogViewContentSystemRefactored();
}

// Export for testing
export default LogViewContentSystemRefactored;
