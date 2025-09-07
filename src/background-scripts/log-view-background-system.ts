import { MessageUtility } from '../models/messages/simplified-messages';
import { MessageFactory } from '../models/messages/simplified-messages';
import { MLSettingsService } from '../services/ml-settings-service';

// Log-View-Machine Background System using ProxyMachine
export class LogViewBackgroundSystem {
    private mlService: MLSettingsService;
    private messageHistory: any[] = [];
    private sessionId: string;
    private activeTabs: Map<number, any> = new Map();
    private extensionState: 'active' | 'inactive' = 'active';
    private proxyMachine: any;

    constructor() {
        console.log("🌊 Creating Log-View-Machine Background System with ProxyMachine...");
        
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
        
        // Initialize ProxyMachine for delegation
        this.initializeProxyMachine();
        
        // Log system initialization
        this.logMessage('system-init', 'Background system initialized successfully');
    }

    private initializeProxyMachine() {
        console.log("🌊 Initializing ProxyMachine for background system...");
        
        // Create a ProxyMachine to delegate message handling
        this.proxyMachine = new Proxy(this, {
            get(target, prop, receiver) {
                // Delegate method calls to the target
                const value = Reflect.get(target, prop, receiver);
                
                if (typeof value === 'function') {
                    return function(...args: any[]) {
                        console.log(`🌊 ProxyMachine delegating call to ${String(prop)}`);
                        return value.apply(target, args);
                    };
                }
                
                return value;
            },
            
            set(target, prop, value, receiver) {
                console.log(`🌊 ProxyMachine delegating property set: ${String(prop)}`);
                return Reflect.set(target, prop, value, receiver);
            }
        });
        
        this.logMessage('proxy-machine-init', 'ProxyMachine initialized for delegation');
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
        }

        // Handle tab updates
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
                this.handleTabUpdated(tabId, changeInfo, tab);
            });
        }
    }

    private setupMessageListeners() {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                this.handleRuntimeMessage(message, sender, sendResponse);
                return true; // Keep the message channel open for async response
            });
        }
    }

    private handleKeyboardCommand(command: string) {
        console.log("🌊 Log-View-Machine: Keyboard command received:", command);
        this.logMessage('keyboard-command', `Command received: ${command}`);
        
        switch (command) {
            case '_execute_action':
                this.toggleWaveReader();
                break;
            case 'toggle-wave-reader':
                this.toggleWaveReader();
                break;
            default:
                console.log("🌊 Log-View-Machine: Unknown command:", command);
        }
    }

    private handleExtensionInstalled(details: chrome.runtime.InstalledDetails) {
        console.log("🌊 Log-View-Machine: Extension installed/updated:", details);
        this.logMessage('extension-installed', `Extension ${details.reason} - version ${details.previousVersion || 'new'}`);
        
        if (details.reason === 'install') {
            this.logMessage('first-install', 'First time installation completed');
        } else if (details.reason === 'update') {
            this.logMessage('extension-updated', `Updated from version ${details.previousVersion}`);
        }
    }

    private handleTabUpdated(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) {
        if (changeInfo.status === 'complete' && tab.url) {
            console.log("🌊 Log-View-Machine: Tab updated:", tabId, tab.url);
            this.logMessage('tab-updated', `Tab ${tabId} updated: ${tab.url}`);
            
            // Update active tabs tracking
            if (this.activeTabs.has(tabId)) {
                const tabInfo = this.activeTabs.get(tabId);
                tabInfo.url = tab.url;
                tabInfo.lastUpdated = Date.now();
                this.activeTabs.set(tabId, tabInfo);
            }
        }
    }

    private async handleRuntimeMessage(message: any, sender: any, sendResponse: any) {
        console.log("🌊 Log-View-Machine: Background received runtime message:", message);
        this.logMessage('runtime-message', `Received ${message.name} from ${message.from}`);
        
        try {
            // Delegate message handling to ProxyMachine
            const result = await this.proxyMachine.handleMessage(message, sender);
            sendResponse({ success: true, result });
        } catch (error: any) {
            console.error("🌊 Log-View-Machine: Error handling message:", error);
            this.logMessage('message-error', `Error handling message: ${error.message}`);
            sendResponse({ success: false, error: error.message });
        }
    }

    private async handleMessage(message: any, sender: any) {
        console.log("🌊 Log-View-Machine: Handling message via ProxyMachine:", message);
        
        switch (message.name) {
            case 'start':
                return await this.handleStart(message, sender);
            case 'stop':
                return await this.handleStop(message, sender);
            case 'toggle':
                return await this.handleToggle(message, sender);
            case 'update-going-state':
                return await this.handleUpdateGoingState(message, sender);
            case 'get-status':
                return await this.handleGetStatus(message, sender);
            case 'get-health':
                return await this.handleGetHealth(message, sender);
            default:
                throw new Error(`Unknown message type: ${message.name}`);
        }
    }

    private async handleStart(message: any, sender: any) {
        console.log("🌊 Log-View-Machine: Handling start message:", message);
        this.logMessage('start-requested', 'Start wave reader requested');
        
        try {
            // Get active tab
            const tab = await this.getActiveTab();
            if (!tab) {
                throw new Error('No active tab found');
            }
            
            // Check if the tab URL is accessible
            if (!tab.url || !this.isUrlAccessible(tab.url)) {
                throw new Error(`Cannot access restricted URL: ${tab.url || 'unknown'}`);
            }
            
            // Send start message to content script
            if (!tab.id) {
                throw new Error('Tab ID is undefined');
            }
            await this.injectMessageToContentScript(tab.id, {
                from: 'background-script',
                name: 'start',
                options: message.options,
                timestamp: Date.now()
            });
            
            // Update active tabs tracking
            this.activeTabs.set(tab.id, {
                ...this.activeTabs.get(tab.id),
                state: 'waving',
                startTime: Date.now(),
                options: message.options
            });
            
            this.logMessage('start-success', 'Wave reader started successfully');
            return { success: true, message: 'Wave reader started' };
            
        } catch (error: any) {
            console.error('🌊 Log-View-Machine: Failed to start wave reader:', error);
            this.logMessage('start-error', `Failed to start: ${error.message}`);
            throw error;
        }
    }

    private async handleStop(message: any, sender: any) {
        console.log("🌊 Log-View-Machine: Handling stop message:", message);
        this.logMessage('stop-requested', 'Stop wave reader requested');
        
        try {
            // Get active tab
            const tab = await this.getActiveTab();
            if (!tab) {
                throw new Error('No active tab found');
            }
            
            // Send stop message to content script
            if (!tab.id) {
                throw new Error('Tab ID is undefined');
            }
            await this.injectMessageToContentScript(tab.id, {
                from: 'background-script',
                name: 'stop',
                timestamp: Date.now()
            });
            
            // Update active tabs tracking
            if (this.activeTabs.has(tab.id)) {
                const tabInfo = this.activeTabs.get(tab.id);
                tabInfo.state = 'stopped';
                tabInfo.stopTime = Date.now();
                this.activeTabs.set(tab.id, tabInfo);
            }
            
            this.logMessage('stop-success', 'Wave reader stopped successfully');
            return { success: true, message: 'Wave reader stopped' };
            
        } catch (error: any) {
            console.error('🌊 Log-View-Machine: Failed to stop wave reader:', error);
            this.logMessage('stop-error', `Failed to stop: ${error.message}`);
            throw error;
        }
    }

    private async handleToggle(message: any, sender: any) {
        console.log("🌊 Log-View-Machine: Handling toggle message:", message);
        this.logMessage('toggle-requested', 'Toggle wave reader requested');
        
        try {
            // Get active tab
            const tab = await this.getActiveTab();
            if (!tab) {
                throw new Error('No active tab found');
            }
            
            // Check if the tab URL is accessible
            if (!tab.url || !this.isUrlAccessible(tab.url)) {
                throw new Error(`Cannot access restricted URL: ${tab.url || 'unknown'}`);
            }
            
            // Send toggle message to content script
            if (!tab.id) {
                throw new Error('Tab ID is undefined');
            }
            await this.injectMessageToContentScript(tab.id, {
                from: 'background-script',
                name: 'toggle',
                options: message.options,
                timestamp: Date.now()
            });
            
            this.logMessage('toggle-success', 'Wave reader toggle sent successfully');
            return { success: true, message: 'Wave reader toggled' };
            
        } catch (error: any) {
            console.error('🌊 Log-View-Machine: Failed to toggle wave reader:', error);
            this.logMessage('toggle-error', `Failed to toggle: ${error.message}`);
            throw error;
        }
    }

    private async handleGetStatus(message: any, sender: any) {
        console.log("🌊 Log-View-Machine: Handling get-status message:", message);
        
        // Get current going state from storage
        let goingState = false;
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                const result = await chrome.storage.local.get(['going']);
                goingState = result.going?.going || false;
            }
        } catch (error) {
            console.log('🌊 Log-View-Machine: Could not get going state from storage:', error);
        }
        
        const status = {
            sessionId: this.sessionId,
            timestamp: Date.now(),
            mlServiceStatus: 'active',
            messageHistoryLength: this.messageHistory.length,
            activeTabsCount: this.activeTabs.size,
            extensionState: this.extensionState,
            going: goingState
        };
        
        return { success: true, status };
    }

    private async handleUpdateGoingState(message: any, sender: any) {
        console.log("🌊 Log-View-Machine: Handling update-going-state message:", message);
        this.logMessage('going-state-update', `Going state updated to: ${message.going}`);
        
        try {
            // Update Chrome storage with the new going state
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.set({
                    going: { going: message.going }
                });
                
                this.logMessage('going-state-saved', `Going state saved to storage: ${message.going}`);
            }
            
            return { success: true, going: message.going };
        } catch (error: any) {
            console.error('🌊 Log-View-Machine: Failed to update going state:', error);
            this.logMessage('going-state-error', `Failed to update going state: ${error.message}`);
            throw error;
        }
    }

    private async handleGetHealth(message: any, sender: any) {
        console.log("🌊 Log-View-Machine: Handling get-health message:", message);
        
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
                scripting: typeof chrome !== 'undefined' && !!chrome.scripting
            }
        };
        
        return { success: true, health: healthStatus };
    }

    private async getActiveTab(): Promise<chrome.tabs.Tab | null> {
        if (typeof chrome === 'undefined' || !chrome.tabs) {
            throw new Error('Chrome tabs API not available');
        }
        
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            return tab || null;
        } catch (error: any) {
            console.error('🌊 Log-View-Machine: Failed to get active tab:', error);
            throw error;
        }
    }

    private isUrlAccessible(url: string): boolean {
        if (!url) return false;
        
        // Check for restricted URLs
        const restrictedPatterns = [
            /^chrome:\/\//,
            /^chrome-extension:\/\//,
            /^moz-extension:\/\//,
            /^about:/,
            /^data:/
        ];
        
        return !restrictedPatterns.some(pattern => pattern.test(url));
    }

    private async injectMessageToContentScript(tabId: number, messageData: any) {
        if (typeof chrome === 'undefined' || !chrome.scripting) {
            throw new Error('Chrome scripting API not available');
        }
        
        try {
            await chrome.scripting.executeScript({
                target: { tabId },
                func: (messageData) => {
                    console.log("🌊 Log-View-Machine: Background script injecting message to content script:", messageData);
                    window.postMessage({
                        source: 'wave-reader-extension',
                        message: messageData
                    }, '*');
                },
                args: [messageData]
            });
            
            this.logMessage('message-injected', 'Message injected to content script successfully');
        } catch (error: any) {
            console.error('🌊 Log-View-Machine: Failed to inject message:', error);
            this.logMessage('injection-error', `Failed to inject message: ${error.message}`);
            throw error;
        }
    }

    private async toggleWaveReader() {
        console.log("🌊 Log-View-Machine: Toggling wave reader via keyboard shortcut");
        this.logMessage('keyboard-toggle', 'Toggle wave reader via keyboard shortcut');
        
        try {
            const tab = await this.getActiveTab();
            if (!tab) {
                throw new Error('No active tab found');
            }
            
            if (!tab.id) {
                throw new Error('Tab ID is undefined');
            }
            await this.injectMessageToContentScript(tab.id, {
                from: 'background-script',
                name: 'toggle-wave-reader',
                timestamp: Date.now()
            });
            
            this.logMessage('keyboard-toggle-success', 'Toggle command sent successfully');
        } catch (error: any) {
            console.error('🌊 Log-View-Machine: Failed to toggle via keyboard:', error);
            this.logMessage('keyboard-toggle-error', `Failed to toggle: ${error.message}`);
        }
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
                scripting: typeof chrome !== 'undefined' && !!chrome.scripting
            }
        };
        
        return healthStatus;
    }

    public destroy() {
        console.log("🌊 Log-View-Machine: Destroying background system");
        
        // Clean up
        this.activeTabs.clear();
        this.extensionState = 'inactive';
        
        this.logMessage('system-destroyed', 'Background system destroyed');
    }
}

export default LogViewBackgroundSystem;