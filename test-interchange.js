// Test Interchange System
// This tests the communication between popup, background, and content scripts

console.log('🌊 Testing Interchange System...');

// Mock DOM environment for Node.js testing
if (typeof document === 'undefined') {
    global.document = {
        readyState: 'complete',
        addEventListener: () => {},
        removeEventListener: () => {},
        querySelector: () => null,
        querySelectorAll: () => [],
        getElementById: () => null,
        head: {
            appendChild: () => {}
        },
        body: {
            appendChild: () => {},
            removeChild: () => {},
            getBoundingClientRect: () => ({ top: 0, left: 0, width: 100, height: 100 })
        }
    };
    
    global.window = {
        location: {
            href: 'https://example.com',
            hostname: 'example.com',
            pathname: '/'
        },
        pageYOffset: 0,
        pageXOffset: 0,
        addEventListener: () => {},
        removeEventListener: () => {}
    };
    
    global.Node = {
        ELEMENT_NODE: 1,
        TEXT_NODE: 3
    };
    
    global.NodeList = Array;
    
    global.MutationObserver = class {
        constructor(callback) {
            this.callback = callback;
        }
        observe() {}
        disconnect() {}
    };
}

// Mock Chrome extension APIs for testing
if (typeof chrome === 'undefined') {
    global.chrome = {
        runtime: {
            id: 'test-extension-id',
            onMessage: {
                addListener: () => {},
                removeListener: () => {}
            },
            sendMessage: (message, callback) => {
                console.log('🌊 Mock Chrome: sendMessage called with:', message);
                if (callback) {
                    callback({ success: true, message: 'Mock response' });
                }
            }
        },
        tabs: {
            query: (queryInfo, callback) => {
                console.log('🌊 Mock Chrome: tabs.query called with:', queryInfo);
                callback([{ id: 1, url: 'https://example.com' }]);
            },
            sendMessage: (tabId, message, callback) => {
                console.log('🌊 Mock Chrome: tabs.sendMessage called with:', { tabId, message });
                if (callback) {
                    callback({ success: true, message: 'Mock tab response' });
                }
            },
            onUpdated: {
                addListener: () => {},
                removeListener: () => {}
            },
            onRemoved: {
                addListener: () => {},
                removeListener: () => {}
            },
            onActivated: {
                addListener: () => {},
                removeListener: () => {}
            }
        },
        storage: {
            local: {
                get: (keys, callback) => {
                    console.log('🌊 Mock Chrome: storage.local.get called with:', keys);
                    if (callback) {
                        callback({ 
                            waveReaderSettings: { waveSpeed: 1000, waveColor: '#667eea' },
                            waveReaderSelectors: ['p', 'h1', 'h2'],
                            currentSelector: 'p'
                        });
                    }
                },
                set: (data, callback) => {
                    console.log('🌊 Mock Chrome: storage.local.set called with:', data);
                    if (callback) {
                        callback();
                    }
                }
            }
        }
    };
}

// Test the interchange system
async function testInterchange() {
    try {
        console.log('\n🧪 Testing Chrome Extension Message Handler...');
        
        // Import the message handler
        const { ChromeExtensionMessageHandler } = await import('./src/component-middleware/wave-reader/robotcopy-pact-config.js');
        
        // Create a message handler instance
        const messageHandler = new ChromeExtensionMessageHandler();
        console.log('✅ ChromeExtensionMessageHandler created successfully');
        
        // Test sending a message
        const response = await messageHandler.sendMessage('background', {
            type: 'TEST_MESSAGE',
            data: 'Hello from test',
            source: 'test',
            target: 'background',
            traceId: Date.now().toString()
        });
        
        console.log('✅ Message sent successfully:', response);
        
        // Test registering a message handler
        messageHandler.registerMessageHandler('TEST_HANDLER', (data, sender) => {
            console.log('✅ Test handler called with:', data);
            return 'Test response';
        });
        
        console.log('✅ Message handler registered successfully');
        
        console.log('\n🧪 Testing Content Interchange...');
        
        // Import the content interchange
        const { ContentInterchange } = await import('./src/content-interchange.js');
        
        // Create a content interchange instance
        const contentInterchange = new ContentInterchange();
        console.log('✅ ContentInterchange created successfully');
        
        // Test the content interchange methods
        console.log('✅ Content interchange methods available:', {
            isActive: contentInterchange.isActive,
            currentSelector: contentInterchange.currentSelector,
            settings: contentInterchange.settings
        });
        
        console.log('\n🧪 Testing Background Interchange...');
        
        // Import the background interchange
        const { BackgroundInterchange } = await import('./src/background-interchange.js');
        
        // Create a background interchange instance
        const backgroundInterchange = new BackgroundInterchange();
        console.log('✅ BackgroundInterchange created successfully');
        
        // Test the background interchange methods
        console.log('✅ Background interchange methods available:', {
            getState: typeof backgroundInterchange.getState,
            getActiveTabs: typeof backgroundInterchange.getActiveTabs,
            getSettings: typeof backgroundInterchange.getSettings,
            getActiveSelectors: typeof backgroundInterchange.getActiveSelectors
        });
        
        console.log('\n🎉 All interchange tests passed!');
        
    } catch (error) {
        console.error('❌ Interchange test failed:', error);
    }
}

// Run the test
testInterchange();
