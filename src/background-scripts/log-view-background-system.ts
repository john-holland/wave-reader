import { MessageUtility } from '../models/messages/simplified-messages';
import { MessageFactory } from '../models/messages/simplified-messages';
import { MLSettingsService } from '../services/ml-settings-service';

// Log-View-Machine Background System
export class LogViewBackgroundSystem {
    private mlService: MLSettingsService;
    private messageHistory: any[] = [];
    private sessionId: string;
    private activeTabs: Map<number, any> = new Map();
    private extensionState: 'active' | 'inactive' = 'active';

    constructor() {
        console.log("🌊 Creating Log-View-Machine Background System...");
        
        // Initialize services
        this.mlService = new MLSettingsService();
        this.sessionId = this.generateSessionId();
        
        // Initialize the system
        this.init();
        
        // Set up message listeners
        this.setupMessageListeners();
        
        console.log("🌊 Log-View-Machine Background System initialized successfully");
    }

    private generateSessionId(): string {
        return `background-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private init() {
        // Set up Chrome extension event listeners
        this.setupChromeListeners();
        
        // Log system initialization
        this.logMessage('system-init', 'Background system initialized successfully');
    }

    private setupChromeListeners() {
        // Handle keyboard shortcuts
        if (typeof chrome !== 'undefined' && chrome.commands) {
            chrome.commands.onCommand.addListener((command) => {
                this.handleKeyboardCommand(command);
            });
        }

        // Handle extension installation
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onInstalled.addListener((details) => {
                this.handleExtensionInstalled(details);
            });

            // Handle extension startup
            chrome.runtime.onStartup.addListener(() => {
                this.handleExtensionStartup();
            });

            // Handle tab updates
            if (chrome.tabs) {
                chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
                    this.handleTabUpdated(tabId, changeInfo, tab);
                });

                chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
                    this.handleTabRemoved(tabId, removeInfo);
                });
            }
        }
    }

    private setupMessageListeners() {
        // Listen for messages from content scripts and popup
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                this.handleRuntimeMessage(message, sender, sendResponse);
                return true; // Keep message channel open
            });
        }
    }

    private handleKeyboardCommand(command: string) {
        console.log("🌊 Log-View-Machine: Background received command:", command);
        this.logMessage('keyboard-command', `Received command: ${command}`);
        
        switch (command) {
            case "_execute_action":
                // This opens the popup - handled automatically by Chrome
                this.logMessage('popup-open', 'Popup opened via keyboard shortcut');
                break;
                
            case "toggle-wave-reader":
                this.handleToggleWaveReader();
                break;
                
            default:
                this.logMessage('unknown-command', `Unknown command: ${command}`);
        }
    }

    private handleExtensionInstalled(details: any) {
        console.log("🌊 Log-View-Machine: Extension installed:", details);
        this.logMessage('extension-installed', `Extension installed: ${details.reason}`);
        
        // Initialize ML service with default patterns
        this.initializeMLService();
        
        // Set up default extension state
        this.extensionState = 'active';
    }

    private handleExtensionStartup() {
        console.log("🌊 Log-View-Machine: Extension started");
        this.logMessage('extension-startup', 'Extension started');
        
        // Initialize ML service
        this.initializeMLService();
        
        // Set up default extension state
        this.extensionState = 'active';
    }

    private handleTabUpdated(tabId: number, changeInfo: any, tab: any) {
        if (changeInfo.status === 'complete' && tab.url) {
            // Check if the tab URL is accessible
            if (this.isUrlAccessible(tab.url)) {
                this.activeTabs.set(tabId, {
                    url: tab.url,
                    title: tab.title,
                    timestamp: Date.now()
                });
                
                this.logMessage('tab-updated', `Tab updated: ${tab.url}`, { tabId, url: tab.url });
            }
        }
    }

    private handleTabRemoved(tabId: number, removeInfo: any) {
        this.activeTabs.delete(tabId);
        this.logMessage('tab-removed', `Tab removed`, { tabId });
    }

    private handleToggleWaveReader() {
        console.log("🌊 Log-View-Machine: Toggle wave reader command received");
        this.logMessage('toggle-requested', 'Toggle wave reader requested');
        
        // Get the active tab and send toggle message to content script
        this.getActiveTab().then((tab) => {
            if (!tab) {
                this.logMessage('toggle-error', 'No active tab found for toggle command');
                return;
            }
            
            // Check if the tab URL is accessible
            if (!this.isUrlAccessible(tab.url)) {
                this.logMessage('toggle-skipped', `Skipping toggle for restricted URL: ${tab.url}`);
                return;
            }
            
            this.logMessage('toggle-sending', `Sending toggle command to tab: ${tab.url}`);
            
            // Send toggle message to content script via window.postMessage
            this.injectToggleCommand(tab.id);
        }).catch((error) => {
            this.logMessage('toggle-error', `Error getting active tab: ${error.message}`);
        });
    }

    private async getActiveTab(): Promise<any> {
        if (typeof chrome === 'undefined' || !chrome.tabs) {
            throw new Error('Chrome tabs API not available');
        }
        
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tabs || tabs.length === 0) {
            throw new Error('No active tabs found');
        }
        
        return tabs[0];
    }

    private isUrlAccessible(url: string): boolean {
        if (!url) return false;
        
        // Check if the URL is restricted
        return !(
            url.startsWith('chrome://') || 
            url.startsWith('chrome-extension://') || 
            url.startsWith('moz-extension://') ||
            url.startsWith('edge://') ||
            url.startsWith('about:')
        );
    }

    private injectToggleCommand(tabId: number) {
        if (typeof chrome === 'undefined' || !chrome.scripting) {
            this.logMessage('toggle-error', 'Chrome scripting API not available');
            return;
        }
        
        chrome.scripting.executeScript({
            target: { tabId },
            func: (messageData) => {
                console.log("🌊 Log-View-Machine: Background script injecting toggle command to content script:", messageData);
                window.postMessage({
                    source: 'wave-reader-extension',
                    message: messageData
                }, '*');
            },
            args: [{
                from: 'background-script',
                name: 'toggle-wave-reader',
                timestamp: Date.now()
            }]
        }).then(() => {
            this.logMessage('toggle-injected', 'Toggle command injected successfully');
        }).catch((error) => {
            this.logMessage('toggle-error', `Failed to inject toggle command: ${error.message}`);
        });
    }

    private handleRuntimeMessage(message: any, sender: any, sendResponse: any) {
        console.log("🌊 Log-View-Machine: Background received runtime message:", message);
        this.logMessage('runtime-message', `Received ${message.name} from ${message.from}`);
        
        // Create a proper message using our factory
        const properMessage = MessageFactory.createMessage(message.name, message.from, message);
        
        // Route the message through our message system
        const route = MessageUtility.routeMessage(
            message.from, 
            'background-script', 
            properMessage, 
            this.sessionId
        );
        
        // Handle the message based on its type
        this.processRuntimeMessage(properMessage, route, sender, sendResponse);
    }

    private processRuntimeMessage(message: any, route: any, sender: any, sendResponse: any) {
        const messageName = message.name;
        
        try {
            switch (messageName) {
                case 'selection-made':
                    this.handleSelectionMade(message, sender, sendResponse);
                    break;
                    
                case 'ping':
                    this.handlePing(message, sender, sendResponse);
                    break;
                    
                case 'health-check':
                    this.handleHealthCheck(message, sender, sendResponse);
                    break;
                    
                case 'ml-recommendation-request':
                    this.handleMLRecommendationRequest(message, sender, sendResponse);
                    break;
                    
                case 'settings-reset-request':
                    this.handleSettingsResetRequest(message, sender, sendResponse);
                    break;
                    
                case 'analytics-event':
                    this.handleAnalyticsEvent(message, sender, sendResponse);
                    break;
                    
                case 'extension-status-request':
                    this.handleExtensionStatusRequest(message, sender, sendResponse);
                    break;
                    
                default:
                    console.log(`🌊 Log-View-Machine: Unknown runtime message type: ${messageName}`);
                    this.logMessage('unknown-runtime-message', `Unknown message type: ${messageName}`);
                    sendResponse({ success: false, error: 'Unknown message type' });
            }
        } catch (error: any) {
            console.error(`🌊 Log-View-Machine: Error processing runtime message ${messageName}:`, error);
            this.logMessage('runtime-message-error', `Error processing ${messageName}: ${error?.message || 'Unknown error'}`);
            sendResponse({ success: false, error: error?.message || 'Unknown error' });
        }
    }

    private handleSelectionMade(message: any, sender: any, sendResponse: any) {
        console.log("🌊 Log-View-Machine: Handling selection-made message:", message.selector);
        this.logMessage('selection-made', `Selector selected: ${message.selector}`);
        
        // Forward the message to the popup
        this.forwardToPopup({
            from: 'background-script',
            name: 'selection-made',
            selector: message.selector,
            sessionId: this.sessionId
        });
        
        sendResponse({ success: true });
    }

    private handlePing(message: any, sender: any, sendResponse: any) {
        console.log("🌊 Log-View-Machine: Handling ping message from popup");
        this.logMessage('ping-received', 'Ping received from popup');
        
        // Get the active tab and send ping message to content script
        this.getActiveTab().then((tab) => {
            if (!tab || !this.isUrlAccessible(tab.url)) {
                this.logMessage('ping-skipped', 'Ping skipped for restricted URL');
                sendResponse({ success: false, error: 'URL not accessible' });
                return;
            }
            
            // Send ping message to content script
            this.injectPingCommand(tab.id);
            sendResponse({ success: true });
        }).catch((error) => {
            this.logMessage('ping-error', `Error handling ping: ${error.message}`);
            sendResponse({ success: false, error: error.message });
        });
    }

    private injectPingCommand(tabId: number) {
        if (typeof chrome === 'undefined' || !chrome.scripting) {
            this.logMessage('ping-error', 'Chrome scripting API not available');
            return;
        }
        
        chrome.scripting.executeScript({
            target: { tabId },
            func: (messageData) => {
                console.log("🌊 Log-View-Machine: Background script injecting ping command to content script:", messageData);
                window.postMessage({
                    source: 'wave-reader-extension',
                    message: messageData
                }, '*');
            },
            args: [{
                from: 'background-script',
                name: 'ping',
                timestamp: Date.now()
            }]
        }).then(() => {
            this.logMessage('ping-injected', 'Ping command injected successfully');
        }).catch((error) => {
            this.logMessage('ping-error', `Failed to inject ping command: ${error.message}`);
        });
    }

    private handleHealthCheck(message: any, sender: any, sendResponse: any) {
        console.log("🌊 Log-View-Machine: Handling health check message");
        this.logMessage('health-check-requested', 'Health check requested');
        
        const healthStatus = this.performHealthCheck();
        sendResponse({ success: true, status: healthStatus });
    }

    private handleMLRecommendationRequest(message: any, sender: any, sendResponse: any) {
        console.log("🌊 Log-View-Machine: Handling ML recommendation request");
        this.logMessage('ml-request', 'ML recommendation requested');
        
        const { domain, path, selector } = message;
        
        this.mlService.getSettingsRecommendations(domain, path, selector)
            .then((recommendations) => {
                this.logMessage('ml-recommendations', `Generated ${recommendations.length} ML recommendations`);
                sendResponse({ success: true, recommendations });
            })
            .catch((error) => {
                this.logMessage('ml-error', `Error generating recommendations: ${error.message}`);
                sendResponse({ success: false, error: error.message });
            });
    }

    private handleSettingsResetRequest(message: any, sender: any, sendResponse: any) {
        console.log("🌊 Log-View-Machine: Handling settings reset request");
        this.logMessage('settings-reset-requested', 'Settings reset requested');
        
        try {
            const newDefaults = this.mlService.resetToNewDefaults();
            this.logMessage('settings-reset-completed', 'Settings reset to ML defaults completed');
            sendResponse({ success: true, newDefaults });
        } catch (error: any) {
            this.logMessage('settings-reset-error', `Error resetting settings: ${error?.message || 'Unknown error'}`);
            sendResponse({ success: false, error: error?.message || 'Unknown error' });
        }
    }

    private handleAnalyticsEvent(message: any, sender: any, sendResponse: any) {
        console.log("🌊 Log-View-Machine: Handling analytics event");
        this.logMessage('analytics-event', `Analytics event: ${message.eventType}`);
        
        // Process analytics event
        this.processAnalyticsEvent(message);
        
        sendResponse({ success: true });
    }

    private handleExtensionStatusRequest(message: any, sender: any, sendResponse: any) {
        console.log("🌊 Log-View-Machine: Handling extension status request");
        this.logMessage('status-requested', 'Extension status requested');
        
        const status = {
            extensionState: this.extensionState,
            activeTabsCount: this.activeTabs.size,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            mlServiceStatus: 'active',
            messageHistoryLength: this.messageHistory.length
        };
        
        sendResponse({ success: true, status });
    }

    private forwardToPopup(message: any) {
        if (typeof chrome === 'undefined' || !chrome.runtime) {
            this.logMessage('popup-forward-error', 'Chrome runtime not available');
            return;
        }
        
        try {
            chrome.runtime.sendMessage(message);
            this.logMessage('popup-forwarded', 'Message forwarded to popup successfully');
        } catch (error: any) {
            this.logMessage('popup-forward-error', `Popup not available: ${error?.message || 'Unknown error'}`);
        }
    }

    private initializeMLService() {
        console.log("🌊 Log-View-Machine: Initializing ML service");
        this.logMessage('ml-service-init', 'ML service initialization started');
        
        // The ML service is already initialized in the constructor
        // This method can be used for additional setup if needed
        
        this.logMessage('ml-service-init', 'ML service initialization completed');
    }

    private processAnalyticsEvent(event: any) {
        console.log("🌊 Log-View-Machine: Processing analytics event:", event);
        this.logMessage('analytics-processed', `Analytics event processed: ${event.eventType}`);
        
        // Process analytics data here
        // This could include sending to external analytics services, storing locally, etc.
    }

    private performHealthCheck() {
        const healthStatus = {
            timestamp: Date.now(),
            sessionId: this.sessionId,
            extensionState: this.extensionState,
            activeTabsCount: this.activeTabs.size,
            mlService: !!this.mlService,
            messageHistoryLength: this.messageHistory.length,
            chromeApis: {
                runtime: typeof chrome !== 'undefined' && !!chrome.runtime,
                tabs: typeof chrome !== 'undefined' && !!chrome.tabs,
                scripting: typeof chrome !== 'undefined' && !!chrome.scripting,
                commands: typeof chrome !== 'undefined' && !!chrome.commands
            }
        };
        
        console.log("🌊 Log-View-Machine: Health check completed:", healthStatus);
        return healthStatus;
    }

    private logMessage(type: string, message: string, data?: any) {
        const logEntry = {
            timestamp: Date.now(),
            type,
            message,
            data,
            sessionId: this.sessionId,
            extensionState: this.extensionState
        };
        
        this.messageHistory.push(logEntry);
        
        // Keep only last 1000 messages
        if (this.messageHistory.length > 1000) {
            this.messageHistory = this.messageHistory.slice(-1000);
        }
        
        // Log to console in development
        console.log(`🌊 Log-View-Machine [${type}]:`, message, data || '');
    }

    // Public methods for external access
    public getMessageHistory() {
        return [...this.messageHistory];
    }

    public getExtensionState() {
        return this.extensionState;
    }

    public getActiveTabsCount() {
        return this.activeTabs.size;
    }

    public getSessionId() {
        return this.sessionId;
    }

    public getHealthStatus() {
        return this.performHealthCheck();
    }

    public destroy() {
        console.log("🌊 Log-View-Machine: Destroying background system");
        
        // Clean up
        this.activeTabs.clear();
        this.extensionState = 'inactive';
        
        this.logMessage('system-destroyed', 'Background system destroyed');
    }
}

// Initialize the system when the script loads
console.log("🌊 Log-View-Machine: Initializing background system...");

// Create the background system instance
const backgroundSystem = new LogViewBackgroundSystem();

// Export for testing
export default LogViewBackgroundSystem;
