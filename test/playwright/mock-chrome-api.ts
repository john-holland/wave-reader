/**
 * Mock Chrome API for Playwright testing
 * This provides a realistic mock of Chrome extension APIs for testing
 */

interface MockChromeMessage {
    type: string;
    selector?: string;
    options?: any;
    source?: string;
    target?: string;
    traceId?: string;
    settings?: any;
}

interface MockChromeResponse {
    success: boolean;
    message?: string;
    data?: any;
    error?: string;
}

export class MockChromeAPI {
    private messageHandlers: Map<string, (message: MockChromeMessage) => MockChromeResponse> = new Map();
    private storage: Map<string, any> = new Map();
    private state: any = {
        isActive: false,
        currentSelector: null,
        animationSpeed: 'medium',
        waveIntensity: 'normal'
    };

    constructor() {
        this.setupDefaultHandlers();
    }

    private setupDefaultHandlers() {
        // START_WAVE_READER handler
        this.messageHandlers.set('START_WAVE_READER', (message) => {
            console.log('🌊 Mock Chrome API: Starting Wave Reader', message);
            this.state.isActive = true;
            this.state.currentSelector = message.selector || '.test-content';
            this.state.animationSpeed = message.options?.animationSpeed || 'medium';
            this.state.waveIntensity = message.options?.waveIntensity || 'normal';
            
            return {
                success: true,
                message: 'Wave Reader started successfully',
                data: {
                    selector: this.state.currentSelector,
                    options: message.options,
                    traceId: message.traceId
                }
            };
        });

        // STOP_WAVE_READER handler
        this.messageHandlers.set('STOP_WAVE_READER', (message) => {
            console.log('🛑 Mock Chrome API: Stopping Wave Reader', message);
            this.state.isActive = false;
            this.state.currentSelector = null;
            
            return {
                success: true,
                message: 'Wave Reader stopped successfully'
            };
        });

        // GET_STATE handler
        this.messageHandlers.set('GET_STATE', (message) => {
            console.log('📊 Mock Chrome API: Getting state', message);
            return {
                success: true,
                message: 'State retrieved successfully',
                data: { ...this.state }
            };
        });

        // SAVE_SETTINGS handler
        this.messageHandlers.set('SAVE_SETTINGS', (message) => {
            console.log('💾 Mock Chrome API: Saving settings', message);
            if (message.settings) {
                Object.assign(this.state, message.settings);
                this.storage.set('settings', message.settings);
            }
            
            return {
                success: true,
                message: 'Settings saved successfully',
                data: message.settings
            };
        });

        // LOAD_SETTINGS handler
        this.messageHandlers.set('LOAD_SETTINGS', (message) => {
            console.log('📂 Mock Chrome API: Loading settings', message);
            const settings = this.storage.get('settings') || {};
            
            return {
                success: true,
                message: 'Settings loaded successfully',
                data: settings
            };
        });

        // WAVE_READER_STARTED handler
        this.messageHandlers.set('WAVE_READER_STARTED', (message) => {
            console.log('✅ Mock Chrome API: Wave Reader started confirmation', message);
            return {
                success: true,
                message: 'Wave Reader started confirmation received'
            };
        });

        // Default handler for unknown message types
        this.messageHandlers.set('DEFAULT', (message) => {
            console.log('❓ Mock Chrome API: Unknown message type', message);
            return {
                success: false,
                error: `Unknown message type: ${message.type}`,
                message: 'Message type not recognized'
            };
        });
    }

    // Mock chrome.runtime.sendMessage
    sendMessage(message: MockChromeMessage): Promise<MockChromeResponse> {
        return new Promise((resolve) => {
            console.log('📤 Mock Chrome API: Sending message', message);
            
            // Simulate async behavior
            setTimeout(() => {
                const handler = this.messageHandlers.get(message.type) || this.messageHandlers.get('DEFAULT');
                const response = handler(message);
                console.log('📥 Mock Chrome API: Response', response);
                resolve(response);
            }, 10); // Small delay to simulate real API
        });
    }

    // Mock chrome.runtime.onMessage
    onMessage = {
        addListener: (callback: (message: MockChromeMessage, sender: any, sendResponse: (response: MockChromeResponse) => void) => void) => {
            console.log('👂 Mock Chrome API: Message listener added');
            // Store the callback for potential future use
            this.messageHandlers.set('_listener', callback as any);
        },
        removeListener: (callback: Function) => {
            console.log('🔇 Mock Chrome API: Message listener removed');
        }
    };

    // Mock chrome.storage
    storage = {
        local: {
            get: (keys: string | string[] | object | null, callback?: (items: any) => void) => {
                console.log('📦 Mock Chrome API: Storage get', keys);
                const result: any = {};
                if (Array.isArray(keys)) {
                    keys.forEach(key => {
                        result[key] = this.storage.get(key);
                    });
                } else if (typeof keys === 'string') {
                    result[keys] = this.storage.get(keys);
                } else if (keys === null) {
                    // Return all storage
                    for (const [key, value] of this.storage.entries()) {
                        result[key] = value;
                    }
                }
                
                if (callback) {
                    setTimeout(() => callback(result), 10);
                }
                return Promise.resolve(result);
            },
            set: (items: object, callback?: () => void) => {
                console.log('💾 Mock Chrome API: Storage set', items);
                Object.entries(items).forEach(([key, value]) => {
                    this.storage.set(key, value);
                });
                
                if (callback) {
                    setTimeout(callback, 10);
                }
                return Promise.resolve();
            },
            remove: (keys: string | string[], callback?: () => void) => {
                console.log('🗑️ Mock Chrome API: Storage remove', keys);
                const keysArray = Array.isArray(keys) ? keys : [keys];
                keysArray.forEach(key => this.storage.delete(key));
                
                if (callback) {
                    setTimeout(callback, 10);
                }
                return Promise.resolve();
            },
            clear: (callback?: () => void) => {
                console.log('🧹 Mock Chrome API: Storage clear');
                this.storage.clear();
                
                if (callback) {
                    setTimeout(callback, 10);
                }
                return Promise.resolve();
            }
        }
    };

    // Mock chrome.tabs
    tabs = {
        query: (queryInfo: any, callback?: (tabs: any[]) => void) => {
            console.log('🔍 Mock Chrome API: Tabs query', queryInfo);
            const mockTabs = [
                {
                    id: 1,
                    url: 'file:///Users/johnholland/Developers/wave-reader/test/playwright/test.html',
                    title: 'Test Page',
                    active: true
                }
            ];
            
            if (callback) {
                setTimeout(() => callback(mockTabs), 10);
            }
            return Promise.resolve(mockTabs);
        },
        sendMessage: (tabId: number, message: MockChromeMessage, callback?: (response: MockChromeResponse) => void) => {
            console.log('📤 Mock Chrome API: Tab send message', { tabId, message });
            return this.sendMessage(message).then(response => {
                if (callback) {
                    callback(response);
                }
                return response;
            });
        }
    };

    // Mock chrome.action
    action = {
        setBadgeText: (details: { text: string }) => {
            console.log('🏷️ Mock Chrome API: Set badge text', details);
        },
        setBadgeBackgroundColor: (details: { color: string }) => {
            console.log('🎨 Mock Chrome API: Set badge color', details);
        }
    };

    // Helper method to get current state
    getState() {
        return { ...this.state };
    }

    // Helper method to reset state
    reset() {
        this.state = {
            isActive: false,
            currentSelector: null,
            animationSpeed: 'medium',
            waveIntensity: 'normal'
        };
        this.storage.clear();
        console.log('🔄 Mock Chrome API: Reset');
    }
}

// Create and export a singleton instance
const mockChrome = new MockChromeAPI();

// Export the mock Chrome object that can be injected into the global scope
const mockChromeObject = {
    runtime: {
        sendMessage: (message: MockChromeMessage) => mockChrome.sendMessage(message),
        onMessage: mockChrome.onMessage
    },
    storage: mockChrome.storage,
    tabs: mockChrome.tabs,
    action: mockChrome.action
};

// Export using CommonJS syntax
module.exports = {
    mockChrome,
    mockChromeObject
};
