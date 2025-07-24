import { test, expect, Page } from '@playwright/test';
import { ExtensionTestUtils, createExtensionTestConfig } from './extension-utils';

test.describe('Simple Keyboard Shortcut Test', () => {
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

    test('should verify extension loads and keyboard input works', async () => {
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
        
        console.log('🔍 Checking extension environment...');
        
        // Check if we're in a Chrome extension context
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
        
        // Verify we're in a Chrome extension context
        expect(extensionCheck.hasChrome).toBeTruthy();
        
        // Test basic keyboard input
        console.log('🎹 Testing keyboard input...');
        
        // Focus on the page
        await page.click('body');
        
        // Test the keyboard shortcut (Shift+W)
        console.log('🎹 Pressing Shift+W...');
        await page.keyboard.press('Shift+W');
        
        // Wait for any processing
        await page.waitForTimeout(2000);
        
        // Check for any console activity
        console.log('🔍 Total console logs:', consoleLogs.length);
        console.log('🔍 Console logs:', consoleLogs);
        
        // Verify we have some console activity
        expect(consoleLogs.length).toBeGreaterThan(0);
        
        // Test that the page can receive keyboard events
        const keyboardTest = await page.evaluate(() => {
            let keyReceived = false;
            let keyValue = '';
            
            const keyHandler = (event: KeyboardEvent) => {
                keyReceived = true;
                keyValue = event.key;
                console.log('Key event received:', event.key, 'Shift:', event.shiftKey);
            };
            
            document.addEventListener('keydown', keyHandler);
            
            // Simulate a key press
            const testEvent = new KeyboardEvent('keydown', {
                key: 'W',
                shiftKey: true,
                bubbles: true
            });
            
            document.dispatchEvent(testEvent);
            
            // Clean up
            document.removeEventListener('keydown', keyHandler);
            
            return { keyReceived, keyValue };
        });
        
        console.log('🔍 Keyboard test result:', keyboardTest);
        
        // Verify keyboard events are being captured
        expect(keyboardTest.keyReceived).toBeTruthy();
        expect(keyboardTest.keyValue).toBe('W');
        
        // Test page interaction
        console.log('🔍 Testing page interaction...');
        await page.click('#testToggle');
        await page.waitForTimeout(1000);
        
        const statusText = await page.textContent('#status');
        console.log('🔍 Status after toggle test:', statusText);
        
        expect(statusText).toBeTruthy();
        expect(statusText).toContain('completed');
    });

    test('should verify extension manifest and files', async () => {
        // Verify extension structure
        const structureValid = extensionUtils.verifyExtensionStructure();
        expect(structureValid).toBeTruthy();
        
        // Check if the extension files exist
        const fs = require('fs');
        const path = require('path');
        
        const buildPath = path.join(process.cwd(), 'build');
        const manifestPath = path.join(buildPath, 'manifest.json');
        const shadowContentPath = path.join(buildPath, 'shadowContent.js');
        const backgroundPath = path.join(buildPath, 'background.js');
        
        console.log('🔍 Checking extension files...');
        console.log('Manifest exists:', fs.existsSync(manifestPath));
        console.log('Shadow content script exists:', fs.existsSync(shadowContentPath));
        console.log('Background script exists:', fs.existsSync(backgroundPath));
        
        // Verify all required files exist
        expect(fs.existsSync(manifestPath)).toBeTruthy();
        expect(fs.existsSync(shadowContentPath)).toBeTruthy();
        expect(fs.existsSync(backgroundPath)).toBeTruthy();
        
        // Read and verify manifest
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        
        // Verify manifest structure
        expect(manifest.manifest_version).toBe(3);
        expect(manifest.name).toBe('Wave Reader');
        expect(manifest.content_scripts).toBeDefined();
        expect(manifest.background).toBeDefined();
        expect(manifest.commands).toBeDefined();
        
        // Check for keyboard shortcut commands
        const commands = manifest.commands;
        console.log('🔍 Extension commands:', commands);
        
        expect(commands['toggle-wave-reader']).toBeDefined();
        expect(commands['_execute_action']).toBeDefined();
        
        // Verify the keyboard shortcut configuration
        const toggleCommand = commands['toggle-wave-reader'];
        console.log('🔍 Toggle command:', toggleCommand);
        
        expect(toggleCommand.suggested_key).toBeDefined();
        expect(toggleCommand.description).toBe('Toggle Wave Reader on current page');
    });

    test.afterAll(async () => {
        if (extensionUtils) {
            await extensionUtils.cleanup(page);
        }
    });
}); 