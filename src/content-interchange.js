// Content Script Interchange
// This handles wave reader functionality in web pages and communicates with the background script

class ContentInterchange {
    constructor() {
        this.isActive = false;
        this.currentSelector = null;
        this.waveAnimation = null;
        this.settings = {
            waveSpeed: 1000,
            waveColor: '#667eea',
            waveOpacity: 0.8
        };
        this.setupMessageListeners();
        this.setupDOMObservers();
        this.initialize();
    }

    initialize() {
        console.log('🌊 Content Script: Initializing wave reader content script');
        
        // Load settings from storage
        this.loadSettings();
        
        // Set up mutation observer for dynamic content
        this.setupMutationObserver();
        
        // Report ready status to background
        this.notifyBackground({
            type: 'CONTENT_SCRIPT_READY',
            data: { url: window.location.href, timestamp: Date.now() },
            source: 'content',
            target: 'background'
        });
    }

    setupMessageListeners() {
        // Listen for messages from background script
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleIncomingMessage(message, sender, sendResponse);
            return true; // Keep message channel open for async response
        });
    }

    setupDOMObservers() {
        // Set up observer for DOM changes that might affect wave reading
        this.domObserver = new MutationObserver((mutations) => {
            if (this.isActive && this.currentSelector) {
                // Check if mutations affect our current selector
                const shouldRestart = mutations.some(mutation => {
                    return Array.from(mutation.addedNodes).some(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            return node.matches && node.matches(this.currentSelector);
                        }
                        return false;
                    });
                });
                
                if (shouldRestart) {
                    console.log('🌊 Content Script: DOM changed, restarting wave animation');
                    this.restartWaveAnimation();
                }
            }
        });
        
        // Start observing
        this.domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupMutationObserver() {
        // Additional observer for more specific DOM changes
        this.mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && this.isActive) {
                    // Handle attribute changes that might affect wave reading
                    if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
                        this.handleStyleChange(mutation.target);
                    }
                }
            });
        });
        
        this.mutationObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ['style', 'class'],
            subtree: true
        });
    }

    handleIncomingMessage(message, sender, sendResponse) {
        const { type, data, source, target, traceId } = message;
        
        console.log('🌊 Content Script: Received message:', { type, source, target, traceId });
        
        try {
            switch (type) {
                case 'START_WAVE_READER':
                    this.handleStartWaveReader(message, sendResponse);
                    break;
                    
                case 'STOP_WAVE_READER':
                    this.handleStopWaveReader(message, sendResponse);
                    break;
                    
                case 'PAUSE_WAVE_READER':
                    this.handlePauseWaveReader(message, sendResponse);
                    break;
                    
                case 'RESUME_WAVE_READER':
                    this.handleResumeWaveReader(message, sendResponse);
                    break;
                    
                case 'SETTINGS_UPDATED':
                    this.handleSettingsUpdated(message, sendResponse);
                    break;
                    
                case 'SELECTOR_UPDATED':
                    this.handleSelectorUpdated(message, sendResponse);
                    break;
                    
                case 'GET_STATUS':
                    this.handleGetStatus(message, sendResponse);
                    break;
                    
                default:
                    console.warn('🌊 Content Script: Unknown message type:', type);
                    sendResponse({ success: false, error: 'Unknown message type: ' + type });
            }
        } catch (error) {
            console.error('🌊 Content Script: Error handling message:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async handleStartWaveReader(message, sendResponse) {
        const { selector, options, traceId } = message;
        
        try {
            console.log('🌊 Content Script: Starting wave reader with selector:', selector);
            
            // Update settings if provided
            if (options) {
                this.settings = { ...this.settings, ...options };
            }
            
            // Validate selector
            if (!selector || typeof selector !== 'string') {
                throw new Error('Invalid selector provided');
            }
            
            // Check if elements exist
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                throw new Error(`No elements found matching selector: ${selector}`);
            }
            
            // Start wave animation
            this.currentSelector = selector;
            this.isActive = true;
            this.startWaveAnimation(selector);
            
            // Send success response
            sendResponse({ 
                success: true, 
                message: 'Wave reader started',
                elementCount: elements.length,
                selector: selector
            });
            
            // Notify background of successful start
            this.notifyBackground({
                type: 'WAVE_READER_STARTED',
                data: { 
                    selector, 
                    elementCount: elements.length,
                    url: window.location.href 
                },
                source: 'content',
                target: 'background'
            });
            
        } catch (error) {
            console.error('🌊 Content Script: Failed to start wave reader:', error);
            sendResponse({ success: false, error: error.message });
            
            // Notify background of failure
            this.notifyBackground({
                type: 'WAVE_READER_ERROR',
                data: { 
                    error: error.message,
                    selector: selector,
                    url: window.location.href 
                },
                source: 'content',
                target: 'background'
            });
        }
    }

    handleStopWaveReader(message, sendResponse) {
        try {
            console.log('🌊 Content Script: Stopping wave reader');
            
            this.stopWaveAnimation();
            this.isActive = false;
            this.currentSelector = null;
            
            sendResponse({ success: true, message: 'Wave reader stopped' });
            
            // Notify background of successful stop
            this.notifyBackground({
                type: 'WAVE_READER_STOPPED',
                data: { url: window.location.href },
                source: 'content',
                target: 'background'
            });
            
        } catch (error) {
            console.error('🌊 Content Script: Failed to stop wave reader:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handlePauseWaveReader(message, sendResponse) {
        try {
            console.log('🌊 Content Script: Pausing wave reader');
            
            this.pauseWaveAnimation();
            
            sendResponse({ success: true, message: 'Wave reader paused' });
            
        } catch (error) {
            console.error('🌊 Content Script: Failed to pause wave reader:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handleResumeWaveReader(message, sendResponse) {
        try {
            console.log('🌊 Content Script: Resuming wave reader');
            
            this.resumeWaveAnimation();
            
            sendResponse({ success: true, message: 'Wave reader resumed' });
            
        } catch (error) {
            console.error('🌊 Content Script: Failed to resume wave reader:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handleSettingsUpdated(message, sendResponse) {
        const { options } = message;
        
        try {
            console.log('🌊 Content Script: Updating settings');
            
            // Update settings
            this.settings = { ...this.settings, ...options };
            
            // Restart animation if active to apply new settings
            if (this.isActive && this.currentSelector) {
                this.restartWaveAnimation();
            }
            
            sendResponse({ success: true, message: 'Settings updated' });
            
        } catch (error) {
            console.error('🌊 Content Script: Failed to update settings:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handleSelectorUpdated(message, sendResponse) {
        const { selector } = message;
        
        try {
            console.log('🌊 Content Script: Updating selector');
            
            if (this.isActive) {
                // Restart with new selector
                this.currentSelector = selector;
                this.restartWaveAnimation();
            }
            
            sendResponse({ success: true, message: 'Selector updated' });
            
        } catch (error) {
            console.error('🌊 Content Script: Failed to update selector:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handleGetStatus(message, sendResponse) {
        try {
            const status = {
                isActive: this.isActive,
                currentSelector: this.currentSelector,
                settings: this.settings,
                url: window.location.href,
                timestamp: Date.now()
            };
            
            sendResponse({ success: true, data: status });
            
        } catch (error) {
            console.error('🌊 Content Script: Failed to get status:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    startWaveAnimation(selector) {
        try {
            // Stop any existing animation
            this.stopWaveAnimation();
            
            // Get elements to animate
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                throw new Error('No elements found for animation');
            }
            
            console.log(`🌊 Content Script: Starting wave animation for ${elements.length} elements`);
            
            // Create wave animation
            this.waveAnimation = this.createWaveAnimation(elements);
            
            // Start the animation
            this.waveAnimation.start();
            
        } catch (error) {
            console.error('🌊 Content Script: Failed to start wave animation:', error);
            throw error;
        }
    }

    stopWaveAnimation() {
        if (this.waveAnimation) {
            this.waveAnimation.stop();
            this.waveAnimation = null;
        }
        
        // Remove any existing wave effects
        this.removeWaveEffects();
    }

    pauseWaveAnimation() {
        if (this.waveAnimation) {
            this.waveAnimation.pause();
        }
    }

    resumeWaveAnimation() {
        if (this.waveAnimation) {
            this.waveAnimation.resume();
        }
    }

    restartWaveAnimation() {
        if (this.currentSelector) {
            this.startWaveAnimation(this.currentSelector);
        }
    }

    createWaveAnimation(elements) {
        const animation = {
            elements: Array.from(elements),
            currentIndex: 0,
            interval: null,
            isPaused: false,
            
            start() {
                if (this.interval) {
                    clearInterval(this.interval);
                }
                
                this.interval = setInterval(() => {
                    if (!this.isPaused) {
                        this.animateNextElement();
                    }
                }, this.settings.waveSpeed);
            },
            
            stop() {
                if (this.interval) {
                    clearInterval(this.interval);
                    this.interval = null;
                }
                this.currentIndex = 0;
            },
            
            pause() {
                this.isPaused = true;
            },
            
            resume() {
                this.isPaused = false;
            },
            
            animateNextElement() {
                // Remove previous wave effect
                this.removeWaveEffects();
                
                // Add wave effect to current element
                if (this.elements[this.currentIndex]) {
                    this.addWaveEffect(this.elements[this.currentIndex]);
                }
                
                // Move to next element
                this.currentIndex = (this.currentIndex + 1) % this.elements.length;
            },
            
            addWaveEffect(element) {
                // Create wave overlay
                const waveOverlay = document.createElement('div');
                waveOverlay.className = 'wave-reader-overlay';
                waveOverlay.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: ${this.settings.waveColor};
                    opacity: ${this.settings.waveOpacity};
                    pointer-events: none;
                    z-index: 10000;
                    animation: wave-pulse 0.5s ease-in-out;
                `;
                
                // Add animation keyframes if not already present
                if (!document.getElementById('wave-reader-keyframes')) {
                    const style = document.createElement('style');
                    style.id = 'wave-reader-keyframes';
                    style.textContent = `
                        @keyframes wave-pulse {
                            0% { opacity: 0; transform: scale(0.8); }
                            50% { opacity: ${this.settings.waveOpacity}; transform: scale(1.1); }
                            100% { opacity: 0; transform: scale(1.2); }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                // Position the overlay relative to the element
                const rect = element.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                
                waveOverlay.style.position = 'fixed';
                waveOverlay.style.top = (rect.top + scrollTop) + 'px';
                waveOverlay.style.left = (rect.left + scrollLeft) + 'px';
                waveOverlay.style.width = rect.width + 'px';
                waveOverlay.style.height = rect.height + 'px';
                
                // Add to document
                document.body.appendChild(waveOverlay);
                
                // Remove after animation completes
                setTimeout(() => {
                    if (waveOverlay.parentNode) {
                        waveOverlay.parentNode.removeChild(waveOverlay);
                    }
                }, 500);
            },
            
            removeWaveEffects() {
                // Remove any existing wave overlays
                const overlays = document.querySelectorAll('.wave-reader-overlay');
                overlays.forEach(overlay => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                });
            }
        };
        
        // Bind settings to animation
        animation.settings = this.settings;
        
        return animation;
    }

    removeWaveEffects() {
        // Remove any existing wave effects
        const overlays = document.querySelectorAll('.wave-reader-overlay');
        overlays.forEach(overlay => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        });
        
        // Remove keyframes style
        const keyframesStyle = document.getElementById('wave-reader-keyframes');
        if (keyframesStyle) {
            keyframesStyle.parentNode.removeChild(keyframesStyle);
        }
    }

    handleStyleChange(element) {
        // Handle style changes that might affect wave reading
        if (this.isActive && this.currentSelector && element.matches(this.currentSelector)) {
            console.log('🌊 Content Script: Style changed for active element, updating animation');
            // Restart animation to handle style changes
            setTimeout(() => {
                this.restartWaveAnimation();
            }, 100);
        }
    }

    async loadSettings() {
        try {
            // Load settings from chrome storage
            const result = await chrome.storage.local.get(['waveReaderSettings']);
            if (result.waveReaderSettings) {
                this.settings = { ...this.settings, ...result.waveReaderSettings };
                console.log('🌊 Content Script: Loaded settings:', this.settings);
            }
        } catch (error) {
            console.warn('🌊 Content Script: Failed to load settings:', error);
        }
    }

    async notifyBackground(message) {
        try {
            await chrome.runtime.sendMessage(message);
        } catch (error) {
            // Background might not be available, which is normal
            console.log('🌊 Content Script: Could not send message to background:', error.message);
        }
    }

    // Cleanup method
    cleanup() {
        console.log('🌊 Content Script: Cleaning up');
        
        // Stop animation
        this.stopWaveAnimation();
        
        // Disconnect observers
        if (this.domObserver) {
            this.domObserver.disconnect();
        }
        
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
        
        // Reset state
        this.isActive = false;
        this.currentSelector = null;
    }
}

// Initialize content script when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.waveReaderContent = new ContentInterchange();
    });
} else {
    window.waveReaderContent = new ContentInterchange();
}

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.waveReaderContent) {
        window.waveReaderContent.cleanup();
    }
});

// Export for testing or external use
export { ContentInterchange };
