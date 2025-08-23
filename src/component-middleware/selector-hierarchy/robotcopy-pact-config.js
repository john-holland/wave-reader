// RobotCopy Configuration for Selector Hierarchy Component
// This file configures RobotCopy instances with PACT test client for the selector hierarchy component
// Specifically designed for Chrome extension communication and complex hierarchy management

import { createRobotCopy } from '../../../../log-view-machine/src/core/RobotCopy';
import { createViewStateMachine } from '../../../../log-view-machine/src/core/ViewStateMachine';
import { createClientGenerator } from '../../../../log-view-machine/src/core/ClientGenerator';

// PACT Test Client Configuration
const PACT_CONFIG = {
    consumer: 'SelectorHierarchyConsumer',
    provider: 'SelectorHierarchyProvider',
    logLevel: 'info',
    dir: './pacts',
    spec: 2
};

// RobotCopy Configuration for Selector Hierarchy Chrome Extension
const ROBOTCOPY_CONFIG = {
    unleashUrl: 'http://localhost:4242/api',
    unleashClientKey: 'default:development.unleash-insecure-api-token',
    unleashAppName: 'selector-hierarchy-extension',
    unleashEnvironment: 'development',
    
    // Chrome Extension specific URLs and configurations
    chromeExtension: {
        extensionId: (typeof chrome !== 'undefined' && chrome?.runtime?.id) ? chrome.runtime.id : 'selector-hierarchy-extension',
        popupUrl: (typeof chrome !== 'undefined' && chrome?.runtime?.getURL) ? chrome.runtime.getURL('popup.html') : 'popup.html',
        backgroundUrl: (typeof chrome !== 'undefined' && chrome?.runtime?.getURL) ? chrome.runtime.getURL('background.js') : 'background.js',
        contentScriptUrl: (typeof chrome !== 'undefined' && chrome?.runtime?.getURL) ? chrome.runtime.getURL('content.js') : 'content.js',
        optionsUrl: (typeof chrome !== 'undefined' && chrome?.runtime?.getURL) ? chrome.runtime.getURL('options.html') : 'options.html'
    },
    
    // Communication endpoints for different extension contexts
    endpoints: {
        popup: {
            id: 'popup',
            type: 'popup',
            canSendTo: ['background', 'content'],
            canReceiveFrom: ['background', 'content']
        },
        background: {
            id: 'background',
            type: 'background',
            canSendTo: ['popup', 'content', 'tabs'],
            canReceiveFrom: ['popup', 'content', 'tabs']
        },
        content: {
            id: 'content',
            type: 'content',
            canSendTo: ['background'],
            canReceiveFrom: ['background', 'popup']
        }
    },
    
    // Message routing configuration
    messageRouting: {
        // Popup to Background communication
        'popup:background': {
            method: 'chrome.runtime.sendMessage',
            target: 'background',
            requiresResponse: true
        },
        
        // Background to Popup communication
        'background:popup': {
            method: 'chrome.runtime.sendMessage',
            target: 'popup',
            requiresResponse: false
        },
        
        // Background to Content communication
        'background:content': {
            method: 'chrome.tabs.sendMessage',
            target: 'activeTab',
            requiresResponse: true
        },
        
        // Content to Background communication
        'content:background': {
            method: 'chrome.runtime.sendMessage',
            target: 'background',
            requiresResponse: true
        }
    },
    
    enableTracing: true,
    enableDataDog: true,
    debug: true
};

// Chrome Extension Message Handler for Selector Hierarchy
class SelectorHierarchyMessageHandler {
    constructor(config = ROBOTCOPY_CONFIG) {
        this.config = config;
        this.messageHandlers = new Map();
        this.hierarchyListeners = new Map();
        this.panelListeners = new Map();
        this.setupMessageListeners();
    }

    setupMessageListeners() {
        // Set up message listeners based on context
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                this.handleIncomingMessage(message, sender, sendResponse);
                return true; // Keep message channel open for async response
            });
        }
    }

    handleIncomingMessage(message, sender, sendResponse) {
        const { type, data, source, target, traceId } = message;
        
        console.log('🔍 SelectorHierarchy: Received message:', { type, source, target, traceId });
        
        // Route message to appropriate handler
        if (this.messageHandlers.has(type)) {
            const handler = this.messageHandlers.get(type);
            try {
                const result = handler(data, sender);
                sendResponse({ success: true, data: result, traceId });
            } catch (error) {
                console.error('🔍 SelectorHierarchy: Error handling message:', error);
                sendResponse({ success: false, error: error.message, traceId });
            }
        } else {
            console.warn('🔍 SelectorHierarchy: No handler for message type:', type);
            sendResponse({ success: false, error: 'No handler for message type: ' + type, traceId });
        }
    }

    registerMessageHandler(messageType, handler) {
        this.messageHandlers.set(messageType, handler);
    }

    registerHierarchyListener(listenerId, listener) {
        this.hierarchyListeners.set(listenerId, listener);
    }

    removeHierarchyListener(listenerId) {
        this.hierarchyListeners.delete(listenerId);
    }

    registerPanelListener(listenerId, listener) {
        this.panelListeners.set(listenerId, listener);
    }

    removePanelListener(listenerId) {
        this.panelListeners.delete(listenerId);
    }

    sendMessage(target, message) {
        return new Promise((resolve, reject) => {
            try {
                if (target === 'background') {
                    chrome.runtime.sendMessage(message, (response) => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(chrome.runtime.lastError.message));
                        } else {
                            resolve(response);
                        }
                    });
                } else if (target === 'content') {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs[0]) {
                            chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
                                if (chrome.runtime.lastError) {
                                    reject(new Error(chrome.runtime.lastError.message));
                                } else {
                                    resolve(response);
                                }
                            });
                        } else {
                            reject(new Error('No active tab found'));
                        }
                    });
                } else {
                    reject(new Error(`Unknown target: ${target}`));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    // Hierarchy management methods
    initializeHierarchy(document) {
        console.log('🔍 SelectorHierarchy: Initializing hierarchy for document');
        
        try {
            // Analyze DOM structure
            const hierarchy = this.analyzeDOMHierarchy(document);
            
            // Notify listeners
            this.hierarchyListeners.forEach((listener, id) => {
                listener({ type: 'HIERARCHY_READY', hierarchy, document });
            });
            
            return {
                success: true,
                hierarchy,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Failed to initialize hierarchy:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    analyzeDOMHierarchy(document) {
        console.log('🔍 SelectorHierarchy: Analyzing DOM hierarchy');
        
        const hierarchy = {
            root: document.documentElement,
            body: document.body,
            elements: [],
            depth: 0,
            structure: {}
        };
        
        // Get all elements
        const allElements = Array.from(document.querySelectorAll('body *'));
        
        // Filter main elements
        hierarchy.elements = allElements.filter(el => this.isMainElement(el));
        
        // Calculate hierarchy depth
        hierarchy.depth = this.calculateHierarchyDepth(document.body);
        
        // Build structure tree
        hierarchy.structure = this.buildStructureTree(document.body);
        
        return hierarchy;
    }

    isMainElement(element) {
        if (!element.offsetParent) return false;
        
        const rect = element.getBoundingClientRect();
        const docWidth = window.innerWidth;
        const docHeight = document.documentElement.scrollHeight;
        
        // Exclude elements that are nearly the full page
        const isNearlyFullWidth = rect.width > 0.98 * docWidth;
        const isNearlyFullHeight = rect.height > 0.95 * docHeight;
        if (isNearlyFullWidth && isNearlyFullHeight) return false;
        
        // Exclude obvious non-content elements
        const excludedTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'META', 'LINK', 'TITLE'];
        if (excludedTags.includes(element.tagName)) return false;
        
        // Basic size requirements
        if (rect.width < 20 || rect.height < 10) return false;
        
        return true;
    }

    calculateHierarchyDepth(element, currentDepth = 0) {
        let maxDepth = currentDepth;
        
        for (const child of element.children) {
            const childDepth = this.calculateHierarchyDepth(child, currentDepth + 1);
            maxDepth = Math.max(maxDepth, childDepth);
        }
        
        return maxDepth;
    }

    buildStructureTree(element, depth = 0) {
        const tree = {
            tagName: element.tagName.toLowerCase(),
            id: element.id || null,
            className: element.className || null,
            depth: depth,
            children: []
        };
        
        for (const child of element.children) {
            tree.children.push(this.buildStructureTree(child, depth + 1));
        }
        
        return tree;
    }

    // Element selection methods
    selectElements(elements, action = 'add') {
        console.log('🔍 SelectorHierarchy: Selecting elements:', action, elements.length);
        
        try {
            const result = {
                action,
                elements: elements.map(el => ({
                    element: el,
                    selector: this.generateSelector(el),
                    rect: el.getBoundingClientRect()
                })),
                timestamp: new Date().toISOString()
            };
            
            // Notify listeners
            this.hierarchyListeners.forEach((listener, id) => {
                listener({ type: 'ELEMENTS_SELECTED', ...result });
            });
            
            return {
                success: true,
                ...result
            };
            
        } catch (error) {
            console.error('Failed to select elements:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    excludeElements(elements) {
        console.log('🔍 SelectorHierarchy: Excluding elements:', elements.length);
        
        try {
            const result = {
                action: 'exclude',
                elements: elements.map(el => ({
                    element: el,
                    selector: this.generateSelector(el),
                    rect: el.getBoundingClientRect()
                })),
                timestamp: new Date().toISOString()
            };
            
            // Notify listeners
            this.hierarchyListeners.forEach((listener, id) => {
                listener({ type: 'ELEMENTS_EXCLUDED', ...result });
            });
            
            return {
                success: true,
                ...result
            };
            
        } catch (error) {
            console.error('Failed to exclude elements:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    generateSelector(element) {
        let selector = element.tagName.toLowerCase();
        
        if (element.id) {
            selector += '#' + element.id;
        } else if (element.className) {
            const classes = element.className.split(' ').filter(c => c.trim());
            if (classes.length > 0) {
                selector += '.' + classes.join('.');
            }
        }
        
        // Add nth-child if needed
        if (element.parentElement) {
            const siblings = Array.from(element.parentElement.children);
            const index = siblings.indexOf(element) + 1;
            if (index > 1) {
                selector += `:nth-child(${index})`;
            }
        }
        
        return selector;
    }

    // Panel management methods
    createColorPanels(elements, colorScheme = 'default') {
        console.log('🔍 SelectorHierarchy: Creating color panels for', elements.length, 'elements');
        
        try {
            const panels = elements.map((el, index) => ({
                element: el,
                color: this.generateColor(index, colorScheme),
                selector: this.generateSelector(el),
                rect: el.getBoundingClientRect()
            }));
            
            // Notify panel listeners
            this.panelListeners.forEach((listener, id) => {
                listener({ type: 'PANELS_CREATED', panels, colorScheme });
            });
            
            return {
                success: true,
                panels,
                colorScheme,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Failed to create color panels:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    createDimmedPanels(elements, colorScheme = 'default') {
        console.log('🔍 SelectorHierarchy: Creating dimmed panels for', elements.length, 'elements');
        
        try {
            const panels = elements.map((el, index) => ({
                element: el,
                color: this.generateDimmedColor(index, colorScheme),
                selector: this.generateSelector(el),
                rect: el.getBoundingClientRect()
            }));
            
            // Notify panel listeners
            this.panelListeners.forEach((listener, id) => {
                listener({ type: 'DIMMED_PANELS_CREATED', panels, colorScheme });
            });
            
            return {
                success: true,
                panels,
                colorScheme,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Failed to create dimmed panels:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    generateColor(index, scheme) {
        const colors = {
            default: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
            warm: ['#ff6b6b', '#ff8e53', '#ffc75f', '#f9f871', '#ff6b9d'],
            cool: ['#4ecdc4', '#45b7d1', '#96ceb4', '#dda0dd', '#98d8c8']
        };
        
        const colorSet = colors[scheme] || colors.default;
        return colorSet[index % colorSet.length];
    }

    generateDimmedColor(index, scheme) {
        const baseColor = this.generateColor(index, scheme);
        return baseColor + '40'; // Add transparency
    }

    // Selector building methods
    buildSelector(selectedElements, excludedElements = []) {
        console.log('🔍 SelectorHierarchy: Building selector from', selectedElements.length, 'selected elements');
        
        try {
            // Generate selectors for selected elements
            const selectors = selectedElements.map(el => this.generateSelector(el));
            
            // Filter out any empty selectors
            const validSelectors = selectors.filter(s => s && s.trim());
            
            // Join with commas for multiple selectors
            const selector = validSelectors.join(', ');
            
            // Validate the generated selector
            const validation = this.validateSelector(selector);
            
            return {
                success: true,
                selector,
                selectedCount: selectedElements.length,
                excludedCount: excludedElements.length,
                validation,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Failed to build selector:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    validateSelector(selector) {
        console.log('🔍 SelectorHierarchy: Validating selector:', selector);
        
        try {
            // Test if the selector is valid CSS
            const testElement = document.createElement('div');
            testElement.style.cssText = selector + ' { color: red; }';
            
            // Check if the selector finds elements
            const elements = document.querySelectorAll(selector);
            
            return {
                isValid: true,
                elementsFound: elements.length,
                syntax: 'valid',
                performance: 'good'
            };
            
        } catch (error) {
            return {
                isValid: false,
                elementsFound: 0,
                syntax: 'invalid',
                performance: 'poor',
                error: error.message
            };
        }
    }

    // Hierarchy exploration methods
    exploreHierarchy(depth, direction = 'deeper') {
        console.log('🔍 SelectorHierarchy: Exploring hierarchy at depth', depth, direction);
        
        try {
            const elements = this.getElementsAtDepth(document.body, depth);
            
            const result = {
                depth,
                direction,
                elements: elements.map(el => ({
                    element: el,
                    selector: this.generateSelector(el),
                    rect: el.getBoundingClientRect()
                })),
                timestamp: new Date().toISOString()
            };
            
            // Notify listeners
            this.hierarchyListeners.forEach((listener, id) => {
                listener({ type: 'HIERARCHY_EXPLORED', ...result });
            });
            
            return {
                success: true,
                ...result
            };
            
        } catch (error) {
            console.error('Failed to explore hierarchy:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    getElementsAtDepth(root, targetDepth, currentDepth = 0) {
        const elements = [];
        
        if (currentDepth === targetDepth) {
            elements.push(root);
        } else if (currentDepth < targetDepth) {
            for (const child of root.children) {
                elements.push(...this.getElementsAtDepth(child, targetDepth, currentDepth + 1));
            }
        }
        
        return elements;
    }

    // Error recovery methods
    handleError(error, context) {
        console.log('🔍 SelectorHierarchy: Handling error:', error.message, 'in context:', context);
        
        try {
            const errorInfo = {
                message: error.message,
                context,
                timestamp: new Date().toISOString(),
                recoverable: this.isErrorRecoverable(error, context)
            };
            
            // Notify listeners
            this.hierarchyListeners.forEach((listener, id) => {
                listener({ type: 'ERROR_OCCURRED', ...errorInfo });
            });
            
            return {
                success: true,
                errorInfo
            };
            
        } catch (recoveryError) {
            console.error('Failed to handle error:', recoveryError);
            return {
                success: false,
                error: recoveryError.message
            };
        }
    }

    isErrorRecoverable(error, context) {
        // Determine if an error is recoverable based on context
        const recoverableErrors = [
            'No elements found',
            'Invalid selector',
            'Network timeout',
            'Temporary failure'
        ];
        
        const unrecoverableErrors = [
            'Document not found',
            'Permission denied',
            'Invalid document structure'
        ];
        
        if (unrecoverableErrors.some(msg => error.message.includes(msg))) {
            return false;
        }
        
        return recoverableErrors.some(msg => error.message.includes(msg)) || true;
    }

    retryOperation(operation, context) {
        console.log('🔍 SelectorHierarchy: Retrying operation:', operation, 'in context:', context);
        
        try {
            // Implement retry logic based on operation type
            const retryResult = this.executeRetryLogic(operation, context);
            
            return {
                success: true,
                operation,
                context,
                retryResult,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Failed to retry operation:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    executeRetryLogic(operation, context) {
        // Implement specific retry logic for different operations
        switch (operation) {
            case 'initializeHierarchy':
                return this.initializeHierarchy(document);
            case 'selectElements':
                return this.selectElements(context.elements, context.action);
            case 'createColorPanels':
                return this.createColorPanels(context.elements, context.colorScheme);
            case 'buildSelector':
                return this.buildSelector(context.selectedElements, context.excludedElements);
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }
    }

    // Debug methods
    enableDebugMode() {
        console.log('🔍 SelectorHierarchy: Enabling debug mode');
        
        try {
            // Enable additional logging and debugging features
            this.debugMode = true;
            
            // Collect debug information
            const debugInfo = this.collectDebugInfo();
            
            return {
                success: true,
                debugMode: true,
                debugInfo,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Failed to enable debug mode:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    collectDebugInfo() {
        return {
            document: {
                title: document.title,
                url: document.URL,
                readyState: document.readyState,
                elements: document.querySelectorAll('*').length
            },
            window: {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                scrollX: window.scrollX,
                scrollY: window.scrollY
            },
            hierarchy: {
                depth: this.calculateHierarchyDepth(document.body),
                mainElements: this.isMainElement ? document.querySelectorAll('body *').filter(el => this.isMainElement(el)).length : 0
            }
        };
    }

    disableDebugMode() {
        console.log('🔍 SelectorHierarchy: Disabling debug mode');
        
        try {
            this.debugMode = false;
            
            return {
                success: true,
                debugMode: false,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Failed to disable debug mode:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Export and import methods
    exportHierarchyData() {
        console.log('🔍 SelectorHierarchy: Exporting hierarchy data');
        
        try {
            const exportData = {
                hierarchy: this.analyzeDOMHierarchy(document),
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            };
            
            return {
                success: true,
                exportData: JSON.stringify(exportData, null, 2),
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Failed to export hierarchy data:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    importHierarchyData(importData) {
        console.log('🔍 SelectorHierarchy: Importing hierarchy data');
        
        try {
            const parsed = JSON.parse(importData);
            
            if (!parsed.hierarchy || !parsed.version) {
                return {
                    success: false,
                    error: 'Invalid hierarchy data format'
                };
            }
            
            // Validate imported data
            const validation = this.validateImportedHierarchy(parsed.hierarchy);
            if (!validation.valid) {
                return {
                    success: false,
                    error: validation.error
                };
            }
            
            // Apply imported hierarchy
            const result = this.applyImportedHierarchy(parsed.hierarchy);
            
            return {
                success: true,
                importedAt: new Date().toISOString(),
                result
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'Failed to parse hierarchy data: ' + error.message
            };
        }
    }

    validateImportedHierarchy(hierarchy) {
        // Basic validation of imported hierarchy
        const requiredKeys = ['root', 'body', 'elements', 'depth', 'structure'];
        
        for (const key of requiredKeys) {
            if (!(key in hierarchy)) {
                return { valid: false, error: `Missing required key: ${key}` };
            }
        }
        
        return { valid: true };
    }

    applyImportedHierarchy(hierarchy) {
        // Apply the imported hierarchy to the current document
        // This would typically involve updating the component state
        console.log('🔍 SelectorHierarchy: Applying imported hierarchy');
        
        return {
            applied: true,
            elementsCount: hierarchy.elements.length,
            depth: hierarchy.depth
        };
    }
}

// PACT Test Client Setup
class PactTestClient {
    constructor(config = PACT_CONFIG) {
        this.config = config;
        this.interactions = [];
        this.provider = null;
    }

    setup() {
        // Initialize PACT provider
        this.provider = new Pact({
            consumer: this.config.consumer,
            provider: this.config.provider,
            log: path.resolve(process.cwd(), 'logs', 'pact.log'),
            logLevel: this.config.logLevel,
            dir: path.resolve(process.cwd(), this.config.dir),
            spec: this.config.spec
        });

        return this.provider.setup();
    }

    addInteraction(interaction) {
        this.interactions.push(interaction);
        return this.provider.addInteraction(interaction);
    }

    verify() {
        return this.provider.verify();
    }

    finalize() {
        return this.provider.finalize();
    }

    cleanup() {
        this.interactions = [];
    }
}

// Selector Hierarchy State Machine Configuration
// Note: This is a simplified version for Chrome extension use
// In a full log-view-machine setup, this would use createViewStateMachine
const createSelectorHierarchyStateMachine = () => {
    console.log('🔍 SelectorHierarchy: State machine factory called (simplified version)');
    
    // Return a simple mock for now
    return {
        send: async (event) => {
            console.log('🔍 SelectorHierarchy: Mock state machine received event:', event);
            return { success: true };
        },
        getSnapshot: () => ({
            value: 'initializing',
            context: {}
        })
    };
};

// Export the state machine factory and configurations
export { 
    createSelectorHierarchyStateMachine, 
    ROBOTCOPY_CONFIG, 
    PACT_CONFIG, 
    PactTestClient,
    SelectorHierarchyMessageHandler 
};
