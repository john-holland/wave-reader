import { LogViewMessageUtility } from './log-view-messages';
import { MessageFactory } from '../models/messages/log-view-messages';

// Robot proxy machine interface
export interface RobotProxyMachine {
    sendMessage(message: any): Promise<any>;
    receiveMessage(): Promise<any>;
    getStatus(): Promise<any>;
    healthCheck(): Promise<any>;
    getActiveTabs(): Promise<any[]>;
    injectScript(tabId: number, script: string): Promise<boolean>;
    executeScript(tabId: number, func: Function, args: any[]): Promise<any>;
}

// Chrome extension robot proxy implementation
export class ChromeRobotProxyMachine implements RobotProxyMachine {
    private messageQueue: any[] = [];
    private responseHandlers: Map<string, (response: any) => void> = new Map();
    private isActive: boolean = true;
    private sessionId: string;

    constructor() {
        this.sessionId = this.generateSessionId();
        this.setupMessageListeners();
        console.log("🌊 Chrome Robot Proxy Machine initialized");
    }

    private generateSessionId(): string {
        return `robot-proxy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private setupMessageListeners() {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                this.handleIncomingMessage(message, sender, sendResponse);
                return true; // Keep message channel open
            });
        }
    }

    private handleIncomingMessage(message: any, sender: any, sendResponse: any) {
        console.log("🌊 Robot Proxy: Received message:", message);
        
        // Create a proper message using our factory
        const properMessage = MessageFactory.createMessage(message.name, message.from, message);
        
        // Route the message through our log-view system
        const route = LogViewMessageUtility.routeMessage(
            message.from, 
            'robot-proxy', 
            properMessage, 
            this.sessionId
        );
        
        // Process the message
        this.processMessage(properMessage, sender, sendResponse);
    }

    private processMessage(message: any, sender: any, sendResponse: any) {
        const messageName = message.name;
        
        try {
            switch (messageName) {
                case 'ping':
                    this.handlePing(message, sendResponse);
                    break;
                    
                case 'health-check':
                    this.handleHealthCheck(message, sendResponse);
                    break;
                    
                case 'get-status':
                    this.handleGetStatus(message, sendResponse);
                    break;
                    
                case 'inject-script':
                    this.handleInjectScript(message, sendResponse);
                    break;
                    
                case 'execute-script':
                    this.handleExecuteScript(message, sendResponse);
                    break;
                    
                default:
                    console.log(`🌊 Robot Proxy: Unknown message type: ${messageName}`);
                    sendResponse({ success: false, error: 'Unknown message type' });
            }
        } catch (error: any) {
            console.error(`🌊 Robot Proxy: Error processing message ${messageName}:`, error);
            sendResponse({ success: false, error: error?.message || 'Unknown error' });
        }
    }

    private handlePing(message: any, sendResponse: any) {
        console.log("🌊 Robot Proxy: Handling ping");
        sendResponse({ 
            success: true, 
            pong: true, 
            timestamp: Date.now(),
            sessionId: this.sessionId
        });
    }

    private handleHealthCheck(message: any, sendResponse: any) {
        console.log("🌊 Robot Proxy: Handling health check");
        const healthStatus = this.getHealthStatus();
        sendResponse({ success: true, status: healthStatus });
    }

    private handleGetStatus(message: any, sendResponse: any) {
        console.log("🌊 Robot Proxy: Handling get status");
        this.getStatus().then(status => {
            sendResponse({ success: true, status });
        }).catch(error => {
            sendResponse({ success: false, error: error?.message || 'Unknown error' });
        });
    }

    private handleInjectScript(message: any, sendResponse: any) {
        console.log("🌊 Robot Proxy: Handling inject script");
        const { tabId, script } = message;
        
        if (!tabId || !script) {
            sendResponse({ success: false, error: 'Missing tabId or script' });
            return;
        }
        
        this.injectScript(tabId, script).then(success => {
            sendResponse({ success, tabId });
        }).catch(error => {
            sendResponse({ success: false, error: error?.message || 'Unknown error' });
        });
    }

    private handleExecuteScript(message: any, sendResponse: any) {
        console.log("🌊 Robot Proxy: Handling execute script");
        const { tabId, func, args } = message;
        
        if (!tabId || !func) {
            sendResponse({ success: false, error: 'Missing tabId or function' });
            return;
        }
        
        this.executeScript(tabId, func, args || []).then(result => {
            sendResponse({ success: true, result });
        }).catch(error => {
            sendResponse({ success: false, error: error?.message || 'Unknown error' });
        });
    }

    // Send message to background or content scripts
    public async sendMessage(message: any): Promise<any> {
        if (!this.isActive) {
            throw new Error('Robot proxy machine is not active');
        }

        if (typeof chrome === 'undefined' || !chrome.runtime) {
            throw new Error('Chrome runtime not available');
        }

        try {
            const response = await chrome.runtime.sendMessage(message);
            return response;
        } catch (error: any) {
            console.error("🌊 Robot Proxy: Error sending message:", error);
            throw error;
        }
    }

    // Receive message from background or content scripts
    public async receiveMessage(): Promise<any> {
        if (!this.isActive) {
            throw new Error('Robot proxy machine is not active');
        }

        return new Promise((resolve, reject) => {
            if (typeof chrome === 'undefined' || !chrome.runtime) {
                reject(new Error('Chrome runtime not available'));
                return;
            }

            // Set up a one-time listener
            const listener = (message: any, sender: any, sendResponse: any) => {
                chrome.runtime.onMessage.removeListener(listener);
                resolve({ message, sender, sendResponse });
            };

            chrome.runtime.onMessage.addListener(listener);
        });
    }

    // Get current status
    public async getStatus(): Promise<any> {
        if (!this.isActive) {
            throw new Error('Robot proxy machine is not active');
        }

        const status = {
            timestamp: Date.now(),
            sessionId: this.sessionId,
            isActive: this.isActive,
            messageQueueLength: this.messageQueue.length,
            responseHandlersCount: this.responseHandlers.size,
            chromeApis: {
                runtime: typeof chrome !== 'undefined' && !!chrome.runtime,
                tabs: typeof chrome !== 'undefined' && !!chrome.tabs,
                scripting: typeof chrome !== 'undefined' && !!chrome.scripting
            }
        };

        return status;
    }

    // Perform health check
    public async healthCheck(): Promise<any> {
        if (!this.isActive) {
            throw new Error('Robot proxy machine is not active');
        }

        const healthStatus = this.getHealthStatus();
        return healthStatus;
    }

    // Get active tabs
    public async getActiveTabs(): Promise<any[]> {
        if (typeof chrome === 'undefined' || !chrome.tabs) {
            throw new Error('Chrome tabs API not available');
        }

        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            return tabs || [];
        } catch (error: any) {
            console.error("🌊 Robot Proxy: Error getting active tabs:", error);
            throw error;
        }
    }

    // Inject script into a tab
    public async injectScript(tabId: number, script: string): Promise<boolean> {
        if (typeof chrome === 'undefined' || !chrome.scripting) {
            throw new Error('Chrome scripting API not available');
        }

        try {
            await chrome.scripting.executeScript({
                target: { tabId },
                func: (scriptContent) => {
                    // Create and inject a script element
                    const scriptElement = document.createElement('script');
                    scriptElement.textContent = scriptContent;
                    document.head.appendChild(scriptElement);
                },
                args: [script]
            });
            
            return true;
        } catch (error: any) {
            console.error("🌊 Robot Proxy: Error injecting script:", error);
            return false;
        }
    }

    // Execute script in a tab
    public async executeScript(tabId: number, func: (...args: any[]) => any, args: any[]): Promise<any> {
        if (typeof chrome === 'undefined' || !chrome.scripting) {
            throw new Error('Chrome scripting API not available');
        }

        try {
            const results = await chrome.scripting.executeScript({
                target: { tabId },
                func: func,
                args: args
            });
            
            // Return the result from the first frame
            return results?.[0]?.result;
        } catch (error: any) {
            console.error("🌊 Robot Proxy: Error executing script:", error);
            throw error;
        }
    }

    // Get health status
    private getHealthStatus(): any {
        return {
            timestamp: Date.now(),
            sessionId: this.sessionId,
            isActive: this.isActive,
            messageQueueLength: this.messageQueue.length,
            responseHandlersCount: this.responseHandlers.size,
            chromeApis: {
                runtime: typeof chrome !== 'undefined' && !!chrome.runtime,
                tabs: typeof chrome !== 'undefined' && !!chrome.tabs,
                scripting: typeof chrome !== 'undefined' && !!chrome.scripting
            }
        };
    }

    // Queue a message for later processing
    public queueMessage(message: any): void {
        this.messageQueue.push({
            ...message,
            timestamp: Date.now(),
            id: this.generateMessageId()
        });
    }

    // Process queued messages
    public async processQueuedMessages(): Promise<void> {
        if (this.messageQueue.length === 0) return;

        const messages = [...this.messageQueue];
        this.messageQueue = [];

        for (const message of messages) {
            try {
                await this.sendMessage(message);
            } catch (error: any) {
                console.error("🌊 Robot Proxy: Error processing queued message:", error);
                // Re-queue failed messages
                this.messageQueue.push(message);
            }
        }
    }

    // Generate unique message ID
    private generateMessageId(): string {
        return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Register response handler
    public registerResponseHandler(messageId: string, handler: (response: any) => void): void {
        this.responseHandlers.set(messageId, handler);
    }

    // Unregister response handler
    public unregisterResponseHandler(messageId: string): void {
        this.responseHandlers.delete(messageId);
    }

    // Public methods for external access
    public getMessageQueue() {
        return [...this.messageQueue];
    }

    public getResponseHandlersCount() {
        return this.responseHandlers.size;
    }

    public getSessionId() {
        return this.sessionId;
    }

    public destroy() {
        console.log("🌊 Robot Proxy: Destroying proxy machine");
        
        // Clean up
        this.isActive = false;
        this.messageQueue = [];
        this.responseHandlers.clear();
        
        // Remove message listeners
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onMessage.removeListener(this.handleIncomingMessage.bind(this));
        }
    }
}

// Export for testing
export default ChromeRobotProxyMachine;
