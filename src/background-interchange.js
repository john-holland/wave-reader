// Background Script Interchange State Machine
// This handles communication between popup (app.tsx) and content scripts
// Manages wave reader state and coordinates operations across the extension

import { createMachine, interpret } from 'xstate';

// Background Interchange State Machine
class BackgroundInterchange {
    constructor() {
        this.stateMachine = this.createInterchangeStateMachine();
        this.service = interpret(this.stateMachine).start();
        this.activeTabs = new Map(); // Track active tabs and their wave reader state
        this.setupMessageListeners();
        this.setupTabListeners();
    }

    createInterchangeStateMachine() {
        return createMachine({
            id: 'background-interchange',
            initial: 'idle',
            context: {
                globalState: 'idle',
                activeSelectors: new Set(),
                settings: {
                    showNotifications: true,
                    waveSpeed: 1000,
                    waveColor: '#667eea',
                    waveOpacity: 0.8
                },
                traceId: null,
                messageQueue: [],
                errorLog: []
            },
            states: {
                idle: {
                    on: {
                        INITIALIZE: {
                            target: 'ready',
                            actions: ['initializeSystem']
                        },
                        START_WAVE_READER: {
                            target: 'coordinating',
                            actions: ['handleStartRequest']
                        },
                        STOP_WAVE_READER: {
                            target: 'stopping',
                            actions: ['handleStopRequest']
                        }
                    }
                },
                ready: {
                    on: {
                        START_WAVE_READER: {
                            target: 'coordinating',
                            actions: ['handleStartRequest']
                        },
                        UPDATE_SETTINGS: {
                            actions: ['updateSettings']
                        },
                        SELECTOR_OPERATION: {
                            actions: ['handleSelectorOperation']
                        }
                    }
                },
                coordinating: {
                    on: {
                        COORDINATION_COMPLETE: {
                            target: 'waving',
                            actions: ['startWaveAnimation']
                        },
                        COORDINATION_FAILED: {
                            target: 'error',
                            actions: ['handleCoordinationError']
                        },
                        STOP_WAVE_READER: {
                            target: 'stopping',
                            actions: ['handleStopRequest']
                        }
                    }
                },
                waving: {
                    on: {
                        STOP_WAVE_READER: {
                            target: 'stopping',
                            actions: ['handleStopRequest']
                        },
                        PAUSE_WAVE_READER: {
                            target: 'paused',
                            actions: ['pauseWaveAnimation']
                        },
                        WAVE_ERROR: {
                            target: 'error',
                            actions: ['handleWaveError']
                        },
                        TAB_UPDATED: {
                            actions: ['handleTabUpdate']
                        }
                    }
                },
                paused: {
                    on: {
                        RESUME_WAVE_READER: {
                            target: 'waving',
                            actions: ['resumeWaveAnimation']
                        },
                        STOP_WAVE_READER: {
                            target: 'stopping',
                            actions: ['handleStopRequest']
                        }
                    }
                },
                stopping: {
                    on: {
                        STOP_COMPLETE: {
                            target: 'ready',
                            actions: ['cleanupWaveAnimation']
                        },
                        STOP_FAILED: {
                            target: 'error',
                            actions: ['handleStopError']
                        }
                    }
                },
                error: {
                    on: {
                        RETRY: {
                            target: 'ready',
                            actions: ['retryOperation']
                        },
                        RESET: {
                            target: 'idle',
                            actions: ['resetSystem']
                        }
                    }
                }
            }
        });
    }

    setupMessageListeners() {
        // Listen for messages from popup and content scripts
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleIncomingMessage(message, sender, sendResponse);
            return true; // Keep message channel open for async response
        });
    }

    setupTabListeners() {
        // Listen for tab updates to manage wave reader state
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url) {
                this.handleTabUpdate(tabId, tab);
            }
        });

        // Listen for tab removal to cleanup state
        chrome.tabs.onRemoved.addListener((tabId) => {
            this.handleTabRemoval(tabId);
        });

        // Listen for tab activation to manage focus
        chrome.tabs.onActivated.addListener((activeInfo) => {
            this.handleTabActivation(activeInfo.tabId);
        });
    }

    handleIncomingMessage(message, sender, sendResponse) {
        const { type, data, source, target, traceId } = message;
        
        console.log('🌊 Background: Received message:', { type, source, target, traceId });
        
        try {
            switch (type) {
                case 'START_WAVE_READER':
                    this.handleStartWaveReader(message, sender, sendResponse);
                    break;
                    
                case 'STOP_WAVE_READER':
                    this.handleStopWaveReader(message, sender, sendResponse);
                    break;
                    
                case 'PAUSE_WAVE_READER':
                    this.handlePauseWaveReader(message, sender, sendResponse);
                    break;
                    
                case 'RESUME_WAVE_READER':
                    this.handleResumeWaveReader(message, sender, sendResponse);
                    break;
                    
                case 'UPDATE_SETTINGS':
                    this.handleUpdateSettings(message, sender, sendResponse);
                    break;
                    
                case 'SELECTOR_UPDATED':
                    this.handleSelectorUpdated(message, sender, sendResponse);
                    break;
                    
                case 'SELECTOR_ADDED':
                    this.handleSelectorAdded(message, sender, sendResponse);
                    break;
                    
                case 'SELECTOR_REMOVED':
                    this.handleSelectorRemoved(message, sender, sendResponse);
                    break;
                    
                case 'SELECTION_CONFIRMED':
                    this.handleSelectionConfirmed(message, sender, sendResponse);
                    break;
                    
                case 'SETTINGS_UPDATED':
                    this.handleSettingsUpdated(message, sender, sendResponse);
                    break;
                    
                case 'SETTINGS_RESET':
                    this.handleSettingsReset(message, sender, sendResponse);
                    break;
                    
                case 'ERROR_REPORTED':
                    this.handleErrorReported(message, sender, sendResponse);
                    break;
                    
                case 'WAVE_READER_STATUS':
                    this.handleStatusRequest(message, sender, sendResponse);
                    break;
                    
                default:
                    console.warn('🌊 Background: Unknown message type:', type);
                    sendResponse({ success: false, error: 'Unknown message type: ' + type });
            }
        } catch (error) {
            console.error('🌊 Background: Error handling message:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async handleStartWaveReader(message, sender, sendResponse) {
        const { selector, options, traceId } = message;
        
        try {
            // Update global state
            this.service.send({ type: 'START_WAVE_READER' });
            
            // Update settings if provided
            if (options) {
                this.service.context.settings = { ...this.service.context.settings, ...options };
            }
            
            // Get active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) {
                throw new Error('No active tab found');
            }
            
            // Send message to content script
            await chrome.tabs.sendMessage(tab.id, {
                type: 'START_WAVE_READER',
                selector: selector,
                options: this.service.context.settings,
                source: 'background',
                target: 'content',
                traceId: traceId
            });
            
            // Update active tabs tracking
            this.activeTabs.set(tab.id, {
                selector: selector,
                state: 'waving',
                startTime: Date.now(),
                options: this.service.context.settings
            });
            
            // Add selector to active selectors
            this.service.context.activeSelectors.add(selector);
            
            // Send success response
            sendResponse({ 
                success: true, 
                message: 'Wave reader started',
                tabId: tab.id,
                selector: selector
            });
            
            // Notify popup of successful start
            this.notifyPopup({
                type: 'WAVE_READER_STARTED',
                data: { selector, tabId: tab.id },
                source: 'background',
                target: 'popup'
            });
            
        } catch (error) {
            console.error('🌊 Background: Failed to start wave reader:', error);
            sendResponse({ success: false, error: error.message });
            
            // Notify popup of failure
            this.notifyPopup({
                type: 'WAVE_READER_ERROR',
                data: { error: error.message },
                source: 'background',
                target: 'popup'
            });
        }
    }

    async handleStopWaveReader(message, sender, sendResponse) {
        try {
            // Update global state
            this.service.send({ type: 'STOP_WAVE_READER' });
            
            // Get active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) {
                throw new Error('No active tab found');
            }
            
            // Send message to content script
            await chrome.tabs.sendMessage(tab.id, {
                type: 'STOP_WAVE_READER',
                source: 'background',
                target: 'content'
            });
            
            // Update active tabs tracking
            if (this.activeTabs.has(tab.id)) {
                const tabInfo = this.activeTabs.get(tab.id);
                tabInfo.state = 'stopped';
                tabInfo.stopTime = Date.now();
                this.activeTabs.set(tab.id, tabInfo);
            }
            
            // Send success response
            sendResponse({ 
                success: true, 
                message: 'Wave reader stopped',
                tabId: tab.id
            });
            
            // Notify popup of successful stop
            this.notifyPopup({
                type: 'WAVE_READER_STOPPED',
                data: { tabId: tab.id },
                source: 'background',
                target: 'popup'
            });
            
        } catch (error) {
            console.error('🌊 Background: Failed to stop wave reader:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async handlePauseWaveReader(message, sender, sendResponse) {
        try {
            // Update global state
            this.service.send({ type: 'PAUSE_WAVE_READER' });
            
            // Get active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) {
                throw new Error('No active tab found');
            }
            
            // Send message to content script
            await chrome.tabs.sendMessage(tab.id, {
                type: 'PAUSE_WAVE_READER',
                source: 'background',
                target: 'content'
            });
            
            // Update active tabs tracking
            if (this.activeTabs.has(tab.id)) {
                const tabInfo = this.activeTabs.get(tab.id);
                tabInfo.state = 'paused';
                this.activeTabs.set(tab.id, tabInfo);
            }
            
            sendResponse({ success: true, message: 'Wave reader paused' });
            
        } catch (error) {
            console.error('🌊 Background: Failed to pause wave reader:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async handleResumeWaveReader(message, sender, sendResponse) {
        try {
            // Update global state
            this.service.send({ type: 'RESUME_WAVE_READER' });
            
            // Get active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) {
                throw new Error('No active tab found');
            }
            
            // Send message to content script
            await chrome.tabs.sendMessage(tab.id, {
                type: 'RESUME_WAVE_READER',
                source: 'background',
                target: 'content'
            });
            
            // Update active tabs tracking
            if (this.activeTabs.has(tab.id)) {
                const tabInfo = this.activeTabs.get(tab.id);
                tabInfo.state = 'waving';
                this.activeTabs.set(tab.id, tabInfo);
            }
            
            sendResponse({ success: true, message: 'Wave reader resumed' });
            
        } catch (error) {
            console.error('🌊 Background: Failed to resume wave reader:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handleUpdateSettings(message, sender, sendResponse) {
        const { options } = message;
        
        try {
            // Update settings
            this.service.context.settings = { ...this.service.context.settings, ...options };
            
            // Save to storage
            chrome.storage.local.set({ waveReaderSettings: this.service.context.settings });
            
            sendResponse({ success: true, message: 'Settings updated' });
            
            // Notify all active tabs of settings change
            this.notifyAllTabs({
                type: 'SETTINGS_UPDATED',
                data: { options: this.service.context.settings },
                source: 'background',
                target: 'content'
            });
            
        } catch (error) {
            console.error('🌊 Background: Failed to update settings:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handleSelectorUpdated(message, sender, sendResponse) {
        const { selector } = message;
        
        try {
            // Update active selectors
            this.service.context.activeSelectors.add(selector);
            
            // Save to storage
            chrome.storage.local.set({ 
                waveReaderSelectors: Array.from(this.service.context.activeSelectors) 
            });
            
            sendResponse({ success: true, message: 'Selector updated' });
            
        } catch (error) {
            console.error('🌊 Background: Failed to update selector:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handleSelectorAdded(message, sender, sendResponse) {
        const { selector } = message;
        
        try {
            // Add to active selectors
            this.service.context.activeSelectors.add(selector);
            
            // Save to storage
            chrome.storage.local.set({ 
                waveReaderSelectors: Array.from(this.service.context.activeSelectors) 
            });
            
            sendResponse({ success: true, message: 'Selector added' });
            
        } catch (error) {
            console.error('🌊 Background: Failed to add selector:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handleSelectorRemoved(message, sender, sendResponse) {
        const { selector } = message;
        
        try {
            // Remove from active selectors
            this.service.context.activeSelectors.delete(selector);
            
            // Save to storage
            chrome.storage.local.set({ 
                waveReaderSelectors: Array.from(this.service.context.activeSelectors) 
            });
            
            sendResponse({ success: true, message: 'Selector removed' });
            
        } catch (error) {
            console.error('🌊 Background: Failed to remove selector:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handleSelectionConfirmed(message, sender, sendResponse) {
        const { selector } = message;
        
        try {
            // Add to active selectors if not already there
            this.service.context.activeSelectors.add(selector);
            
            // Save to storage
            chrome.storage.local.set({ 
                waveReaderSelectors: Array.from(this.service.context.activeSelectors),
                currentSelector: selector
            });
            
            sendResponse({ success: true, message: 'Selection confirmed' });
            
        } catch (error) {
            console.error('🌊 Background: Failed to confirm selection:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handleSettingsUpdated(message, sender, sendResponse) {
        const { options } = message;
        
        try {
            // Update settings
            this.service.context.settings = { ...this.service.context.settings, ...options };
            
            // Save to storage
            chrome.storage.local.set({ waveReaderSettings: this.service.context.settings });
            
            sendResponse({ success: true, message: 'Settings updated' });
            
        } catch (error) {
            console.error('🌊 Background: Failed to update settings:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handleSettingsReset(message, sender, sendResponse) {
        try {
            // Reset to default settings
            this.service.context.settings = {
                showNotifications: true,
                waveSpeed: 1000,
                waveColor: '#667eea',
                waveOpacity: 0.8
            };
            
            // Save to storage
            chrome.storage.local.set({ waveReaderSettings: this.service.context.settings });
            
            sendResponse({ success: true, message: 'Settings reset to defaults' });
            
        } catch (error) {
            console.error('🌊 Background: Failed to reset settings:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handleErrorReported(message, sender, sendResponse) {
        const { errorReport } = message;
        
        try {
            // Log error
            this.service.context.errorLog.push({
                ...errorReport,
                timestamp: new Date().toISOString(),
                source: sender.id || 'unknown'
            });
            
            // Keep only last 100 errors
            if (this.service.context.errorLog.length > 100) {
                this.service.context.errorLog = this.service.context.errorLog.slice(-100);
            }
            
            sendResponse({ success: true, message: 'Error logged' });
            
            // In a real application, you might want to send this to a logging service
            console.error('🌊 Background: Error reported:', errorReport);
            
        } catch (error) {
            console.error('🌊 Background: Failed to log error:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handleStatusRequest(message, sender, sendResponse) {
        try {
            const status = {
                globalState: this.service.getSnapshot().value,
                activeTabs: Array.from(this.activeTabs.entries()),
                activeSelectors: Array.from(this.service.context.activeSelectors),
                settings: this.service.context.settings,
                errorCount: this.service.context.errorLog.length
            };
            
            sendResponse({ success: true, data: status });
            
        } catch (error) {
            console.error('🌊 Background: Failed to get status:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handleTabUpdate(tabId, tab) {
        // Handle tab updates (e.g., page navigation)
        if (this.activeTabs.has(tabId)) {
            const tabInfo = this.activeTabs.get(tabId);
            if (tabInfo.state === 'waving') {
                // Page changed while waving, might need to restart
                console.log('🌊 Background: Tab updated while waving, tabId:', tabId);
                
                // Notify popup of tab update
                this.notifyPopup({
                    type: 'TAB_UPDATED',
                    data: { tabId, url: tab.url },
                    source: 'background',
                    target: 'popup'
                });
            }
        }
    }

    handleTabRemoval(tabId) {
        // Clean up when tab is closed
        if (this.activeTabs.has(tabId)) {
            this.activeTabs.delete(tabId);
            console.log('🌊 Background: Tab removed, cleaned up state for tabId:', tabId);
        }
    }

    handleTabActivation(tabId) {
        // Handle tab activation (focus change)
        console.log('🌊 Background: Tab activated, tabId:', tabId);
        
        // Notify popup of tab activation
        this.notifyPopup({
            type: 'TAB_ACTIVATED',
            data: { tabId },
            source: 'background',
            target: 'popup'
        });
    }

    async notifyPopup(message) {
        try {
            // Send message to popup if it's open
            await chrome.runtime.sendMessage(message);
        } catch (error) {
            // Popup might not be open, which is normal
            console.log('🌊 Background: Could not send message to popup (might be closed):', error.message);
        }
    }

    async notifyAllTabs(message) {
        try {
            // Get all tabs and send message to content scripts
            const tabs = await chrome.tabs.query({});
            for (const tab of tabs) {
                try {
                    await chrome.tabs.sendMessage(tab.id, message);
                } catch (error) {
                    // Tab might not have content script, which is normal
                    console.log('🌊 Background: Could not send message to tab:', tab.id, error.message);
                }
            }
        } catch (error) {
            console.error('🌊 Background: Failed to notify all tabs:', error);
        }
    }

    // Get current state
    getState() {
        return this.service.getSnapshot();
    }

    // Get active tabs info
    getActiveTabs() {
        return this.activeTabs;
    }

    // Get settings
    getSettings() {
        return this.service.context.settings;
    }

    // Get active selectors
    getActiveSelectors() {
        return Array.from(this.service.context.activeSelectors);
    }
}

// Initialize the background interchange
const backgroundInterchange = new BackgroundInterchange();

// Export for use in other modules
export { BackgroundInterchange, backgroundInterchange };
