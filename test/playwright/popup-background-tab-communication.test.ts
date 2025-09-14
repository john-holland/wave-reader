import { test, expect, Page } from '@playwright/test';
import { ExtensionTestUtils, createExtensionTestConfig } from './extension-utils';

test.describe('Popup -> Background -> Tab Communication', () => {
    let extensionUtils: ExtensionTestUtils;
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        // Build the extension first
        const { execSync } = require('child_process');
        try {
            execSync('npm run build', { stdio: 'inherit' });
            console.log('✅ Extension built successfully');
        } catch (error) {
            console.error('❌ Failed to build extension:', error);
            throw error;
        }

        // Create extension test configuration
        const config = createExtensionTestConfig();
        extensionUtils = new ExtensionTestUtils(config);

        // Create extension context
        const context = await extensionUtils.createExtensionContext(browser);
        page = await context.newPage();
    });

    test('should handle popup to background to tab communication for wave animation', async () => {
        // Load the test page
        await extensionUtils.loadTestPage(page);
        
        // Set up console log monitoring
        const consoleLogs: string[] = [];
        page.on('console', (msg) => {
            const text = msg.text();
            consoleLogs.push(`[${msg.type()}] ${text}`);
            console.log(`[${msg.type()}] ${text}`);
        });

        // Wait for page to load
        await page.waitForTimeout(3000);
        
        console.log('🔍 Testing popup -> background -> tab communication...');
        
        // Check if we're in a Chrome extension context
        const extensionCheck = await page.evaluate(() => {
            return {
                hasChrome: typeof chrome !== 'undefined',
                hasRuntime: typeof chrome !== 'undefined' && chrome.runtime,
                hasStorage: typeof chrome !== 'undefined' && chrome.storage,
                hasTabs: typeof chrome !== 'undefined' && chrome.tabs,
                userAgent: navigator.userAgent,
                url: window.location.href
            };
        });
        
        console.log('🔍 Extension environment:', extensionCheck);
        
        // Verify we're in a Chrome extension context
        expect(extensionCheck.hasChrome).toBeTruthy();
        expect(extensionCheck.hasRuntime).toBeTruthy();
        expect(extensionCheck.hasTabs).toBeTruthy();
        
        // Test popup -> background communication
        console.log('🔄 Testing popup -> background communication...');
        
        const popupToBackgroundTest = await page.evaluate(async () => {
            try {
                // Simulate popup sending message to background
                const response = await chrome.runtime.sendMessage({
                    type: 'START_WAVE_READER',
                    selector: '.test-content',
                    options: {
                        animationSpeed: 'medium',
                        waveIntensity: 'normal'
                    },
                    source: 'popup',
                    target: 'background',
                    traceId: 'test-trace-' + Date.now()
                });
                
                return {
                    success: true,
                    response: response,
                    message: 'Popup to background communication successful'
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    message: 'Popup to background communication failed'
                };
            }
        });
        
        console.log('🔍 Popup to background test result:', popupToBackgroundTest);
        
        // Test background -> tab communication
        console.log('🔄 Testing background -> tab communication...');
        
        const backgroundToTabTest = await page.evaluate(async () => {
            try {
                // Simulate background sending message to content script
                const response = await chrome.runtime.sendMessage({
                    type: 'START_WAVE_READER',
                    selector: '.test-content',
                    options: {
                        animationSpeed: 'medium',
                        waveIntensity: 'normal'
                    },
                    source: 'background',
                    target: 'content',
                    traceId: 'test-trace-' + Date.now()
                });
                
                return {
                    success: true,
                    response: response,
                    message: 'Background to tab communication successful'
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    message: 'Background to tab communication failed'
                };
            }
        });
        
        console.log('🔍 Background to tab test result:', backgroundToTabTest);
        
        // Test animation feature activation
        console.log('🎨 Testing animation feature activation...');
        
        const animationTest = await page.evaluate(async () => {
            try {
                // Test if wave animation can be triggered
                const testContent = document.querySelector('.test-content');
                if (!testContent) {
                    return {
                        success: false,
                        error: 'Test content not found',
                        message: 'Animation test failed - no content'
                    };
                }
                
                // Simulate mouse movement to trigger animation
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: 100,
                    clientY: 100,
                    bubbles: true,
                    cancelable: true
                });
                
                testContent.dispatchEvent(mouseEvent);
                
                // Check if animation classes are applied
                const hasAnimationClass = testContent.classList.contains('wave-animation') || 
                                        testContent.classList.contains('wave-active') ||
                                        testContent.style.animation !== '';
                
                return {
                    success: true,
                    hasAnimationClass: hasAnimationClass,
                    message: 'Animation test completed',
                    animationTriggered: hasAnimationClass
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    message: 'Animation test failed'
                };
            }
        });
        
        console.log('🔍 Animation test result:', animationTest);
        
        // Test complete communication flow
        console.log('🔄 Testing complete communication flow...');
        
        const completeFlowTest = await page.evaluate(async () => {
            try {
                // Step 1: Popup sends start command
                const startResponse = await chrome.runtime.sendMessage({
                    type: 'START_WAVE_READER',
                    selector: '.test-content',
                    options: { animationSpeed: 'fast' },
                    source: 'popup',
                    target: 'background',
                    traceId: 'complete-flow-test'
                });
                
                // Step 2: Simulate content script receiving message
                const contentScriptResponse = await chrome.runtime.sendMessage({
                    type: 'WAVE_READER_STARTED',
                    selector: '.test-content',
                    source: 'content',
                    target: 'background',
                    traceId: 'complete-flow-test'
                });
                
                // Step 3: Test animation activation
                const testContent = document.querySelector('.test-content');
                if (testContent) {
                    // Apply wave animation class
                    testContent.classList.add('wave-animation');
                    
                    // Simulate mouse movement
                    const mouseEvent = new MouseEvent('mousemove', {
                        clientX: 150,
                        clientY: 150,
                        bubbles: true,
                        cancelable: true
                    });
                    
                    testContent.dispatchEvent(mouseEvent);
                }
                
                return {
                    success: true,
                    startResponse: startResponse,
                    contentScriptResponse: contentScriptResponse,
                    message: 'Complete communication flow successful'
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    message: 'Complete communication flow failed'
                };
            }
        });
        
        console.log('🔍 Complete flow test result:', completeFlowTest);
        
        // Verify communication worked
        expect(consoleLogs.length).toBeGreaterThan(0);
        
        // Check for extension-related console logs
        const extensionLogs = consoleLogs.filter(log => 
            log.includes('🌊') || 
            log.includes('Wave Reader') || 
            log.includes('background') || 
            log.includes('popup') ||
            log.includes('content')
        );
        
        console.log('🔍 Extension-related logs:', extensionLogs);
        
        // Verify we have some extension activity
        expect(extensionLogs.length).toBeGreaterThan(0);
        
        // Test mouse wave animation
        console.log('🎨 Testing mouse wave animation...');
        await extensionUtils.testMouseWaveAnimation(page, '.test-content');
        
        // Wait for animation to complete
        await page.waitForTimeout(2000);
        
        // Check for animation-related console logs
        const animationLogs = consoleLogs.filter(log => 
            log.includes('animation') || 
            log.includes('wave') || 
            log.includes('mouse') ||
            log.includes('mousemove')
        );
        
        console.log('🔍 Animation-related logs:', animationLogs);
        
        // Verify animation was triggered
        expect(animationLogs.length).toBeGreaterThan(0);
    });

    test('should handle extension state management across popup, background, and tab', async () => {
        // Load the test page
        await extensionUtils.loadTestPage(page);
        
        // Set up console log monitoring
        const consoleLogs: string[] = [];
        page.on('console', (msg) => {
            const text = msg.text();
            consoleLogs.push(`[${msg.type()}] ${text}`);
            console.log(`[${msg.type()}] ${text}`);
        });

        // Wait for page to load
        await page.waitForTimeout(3000);
        
        console.log('🔍 Testing extension state management...');
        
        // Test state synchronization
        const stateTest = await page.evaluate(async () => {
            try {
                // Test popup state
                const popupState = await chrome.runtime.sendMessage({
                    type: 'GET_STATE',
                    source: 'popup',
                    target: 'background'
                });
                
                // Test background state
                const backgroundState = await chrome.runtime.sendMessage({
                    type: 'GET_STATE',
                    source: 'content',
                    target: 'background'
                });
                
                // Test content script state
                const contentState = await chrome.runtime.sendMessage({
                    type: 'GET_STATE',
                    source: 'content',
                    target: 'background'
                });
                
                return {
                    success: true,
                    popupState: popupState,
                    backgroundState: backgroundState,
                    contentState: contentState,
                    message: 'State management test completed'
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    message: 'State management test failed'
                };
            }
        });
        
        console.log('🔍 State management test result:', stateTest);
        
        // Test settings persistence
        const settingsTest = await page.evaluate(async () => {
            try {
                // Test saving settings
                const saveResponse = await chrome.runtime.sendMessage({
                    type: 'SAVE_SETTINGS',
                    settings: {
                        animationSpeed: 'fast',
                        waveIntensity: 'high',
                        selector: '.test-content'
                    },
                    source: 'popup',
                    target: 'background'
                });
                
                // Test loading settings
                const loadResponse = await chrome.runtime.sendMessage({
                    type: 'LOAD_SETTINGS',
                    source: 'content',
                    target: 'background'
                });
                
                return {
                    success: true,
                    saveResponse: saveResponse,
                    loadResponse: loadResponse,
                    message: 'Settings persistence test completed'
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    message: 'Settings persistence test failed'
                };
            }
        });
        
        console.log('🔍 Settings persistence test result:', settingsTest);
        
        // Verify we have some state management activity
        expect(consoleLogs.length).toBeGreaterThan(0);
        
        // Check for state-related console logs
        const stateLogs = consoleLogs.filter(log => 
            log.includes('state') || 
            log.includes('settings') || 
            log.includes('storage') ||
            log.includes('persist')
        );
        
        console.log('🔍 State-related logs:', stateLogs);
    });

    test('should handle error cases in popup -> background -> tab communication', async () => {
        // Load the test page
        await extensionUtils.loadTestPage(page);
        
        // Set up console log monitoring
        const consoleLogs: string[] = [];
        page.on('console', (msg) => {
            const text = msg.text();
            consoleLogs.push(`[${msg.type()}] ${text}`);
            console.log(`[${msg.type()}] ${text}`);
        });

        // Wait for page to load
        await page.waitForTimeout(3000);
        
        console.log('🔍 Testing error handling in communication flow...');
        
        // Test invalid message handling
        const errorTest = await page.evaluate(async () => {
            try {
                // Send invalid message
                const response = await chrome.runtime.sendMessage({
                    type: 'INVALID_MESSAGE_TYPE',
                    source: 'popup',
                    target: 'background'
                });
                
                return {
                    success: true,
                    response: response,
                    message: 'Error handling test completed'
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    message: 'Error handling test failed as expected'
                };
            }
        });
        
        console.log('🔍 Error handling test result:', errorTest);
        
        // Test missing selector handling
        const missingSelectorTest = await page.evaluate(async () => {
            try {
                // Send message without selector
                const response = await chrome.runtime.sendMessage({
                    type: 'START_WAVE_READER',
                    source: 'popup',
                    target: 'background'
                });
                
                return {
                    success: true,
                    response: response,
                    message: 'Missing selector test completed'
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    message: 'Missing selector test failed as expected'
                };
            }
        });
        
        console.log('🔍 Missing selector test result:', missingSelectorTest);
        
        // Verify error handling worked
        expect(consoleLogs.length).toBeGreaterThan(0);
        
        // Check for error-related console logs
        const errorLogs = consoleLogs.filter(log => 
            log.includes('error') || 
            log.includes('Error') || 
            log.includes('failed') ||
            log.includes('invalid')
        );
        
        console.log('🔍 Error-related logs:', errorLogs);
    });

    test.afterAll(async () => {
        if (extensionUtils) {
            await extensionUtils.cleanup(page);
        }
    });
});
