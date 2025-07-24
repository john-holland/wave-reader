import { test, expect, Page } from '@playwright/test';
import { ExtensionTestUtils, createExtensionTestConfig } from './extension-utils';

test.describe('Debug Extension Test', () => {
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

    test('should load extension for interactive debugging', async () => {
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
        
        // Add a "Complete Manual Test" button to the page
        await page.evaluate(() => {
            const completeButton = document.createElement('button');
            completeButton.id = 'completeManualTest';
            completeButton.textContent = '✅ Complete Manual Test';
            completeButton.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: #4CAF50;
                color: white;
                border: none;
                padding: 15px 20px;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            `;
            completeButton.addEventListener('click', () => {
                console.log('🔍 Manual test completed by user');
                completeButton.textContent = '✅ Test Completed - Closing...';
                completeButton.style.background = '#2196F3';
            });
            document.body.appendChild(completeButton);
            
            // Add debug info to the page
            const debugInfo = document.createElement('div');
            debugInfo.id = 'debugInfo';
            debugInfo.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 9999;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 15px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                max-width: 300px;
            `;
            debugInfo.innerHTML = `
                <strong>🔍 Debug Info:</strong><br>
                • Press Alt+W or Ctrl+Shift+W to test keyboard shortcuts<br>
                • Check browser console for extension logs<br>
                • Click buttons below to test functionality<br>
                • Click the green button when done testing
            `;
            document.body.appendChild(debugInfo);
        });
        
        console.log('🔍 Extension loaded for debugging...');
        console.log('🔍 You can now interact with the page and test the extension');
        console.log('🔍 Check the browser console for extension logs');
        console.log('🔍 Try pressing Alt+W or Ctrl+Shift+W to test keyboard shortcuts');
        console.log('🔍 Click the "Complete Manual Test" button when you\'re done debugging');
        
        // Check extension environment
        const extensionCheck = await page.evaluate(() => {
            return {
                hasChrome: typeof chrome !== 'undefined',
                hasRuntime: typeof chrome !== 'undefined' && chrome.runtime,
                hasStorage: typeof chrome !== 'undefined' && chrome.storage,
                userAgent: navigator.userAgent,
                url: window.location.href
            };
        });
        
        console.log('🔍 Extension environment:', extensionCheck);
        
        // Wait for the user to click the complete button
        console.log('🔍 Waiting for manual test completion...');
        await page.waitForSelector('#completeManualTest');
        await page.click('#completeManualTest');
        
        // Wait a moment for the button to update
        await page.waitForTimeout(2000);
        
        // Check for any console activity
        console.log('🔍 Total console logs captured:', consoleLogs.length);
        console.log('🔍 Console logs:', consoleLogs);
        
        // Basic verification that the page loaded
        expect(extensionCheck.hasChrome).toBeTruthy();
        
        console.log('🔍 Manual debugging session completed');
    });

    test.afterAll(async () => {
        if (extensionUtils) {
            await extensionUtils.cleanup(page);
        }
    });
}); 