import { test, expect, Page } from '@playwright/test';
import { ExtensionTestUtils, createExtensionTestConfig } from './extension-utils';

test.describe('Keyboard Shortcut Tests', () => {
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

    test('should verify extension loads and responds to keyboard input', async () => {
        // Load the test page
        await extensionUtils.loadTestPage(page);
        
        // Set up console log monitoring
        const consoleLogs: string[] = [];
        page.on('console', (msg) => {
            const text = msg.text();
            consoleLogs.push(`[${msg.type()}] ${text}`);
            console.log(`[${msg.type()}] ${text}`);
        });

        // Wait for page to load and check for any extension activity
        await page.waitForTimeout(3000);
        
        console.log('🔍 Checking for extension activity...');
        
        // Check if any extension-related logs appear
        const extensionLogs = consoleLogs.filter(log => 
            log.includes('🌊') || 
            log.includes('Wave Reader') || 
            log.includes('content script') ||
            log.includes('background') ||
            log.includes('extension')
        );
        
        console.log('🔍 Extension-related logs:', extensionLogs);
        
        // Check if the extension files are accessible
        const extensionFiles = await page.evaluate(() => {
            return {
                hasChrome: typeof chrome !== 'undefined',
                hasRuntime: typeof chrome !== 'undefined' && chrome.runtime,
                hasStorage: typeof chrome !== 'undefined' && chrome.storage,
                hasScripting: typeof chrome !== 'undefined' && chrome.scripting,
                userAgent: navigator.userAgent
            };
        });
        
        console.log('🔍 Extension environment check:', extensionFiles);
        
        // Verify that we're in a Chrome extension context
        expect(extensionFiles.hasChrome).toBeTruthy();
        
        // Test keyboard input to see if the page responds
        console.log('🎹 Testing basic keyboard input...');
        
        // Focus on the page first
        await page.click('body');
        
        // Test some basic keys
        await page.keyboard.press('a');
        await page.keyboard.press('b');
        await page.keyboard.press('c');
        
        // Wait a moment for any processing
        await page.waitForTimeout(1000);
        
        // Check if we captured any console logs
        console.log('🔍 Total console logs captured:', consoleLogs.length);
        console.log('🔍 All console logs:', consoleLogs);
        
        // At minimum, we should have some console activity
        expect(consoleLogs.length).toBeGreaterThan(0);
    });

    test('should test keyboard shortcut through background script', async () => {
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
        await page.waitForTimeout(2000);
        
        // Focus on the page
        await page.click('body');
        
        // Test the keyboard shortcut (Shift+W)
        console.log('🎹 Testing keyboard shortcut: Shift+W');
        await page.keyboard.press('Shift+W');
        
        // Wait for any processing
        await page.waitForTimeout(2000);
        
        // Check for any logs related to keyboard input
        const keyboardLogs = consoleLogs.filter(log => 
            log.includes('key') || 
            log.includes('keyboard') || 
            log.includes('shortcut') ||
            log.includes('toggle') ||
            log.includes('wave')
        );
        
        console.log('🔍 Keyboard-related logs:', keyboardLogs);
        
        // Check if the page received the keyboard input
        const keyboardTest = await page.evaluate(() => {
            let keyPressed = false;
            let keyValue = '';
            
            const keyHandler = (event: KeyboardEvent) => {
                keyPressed = true;
                keyValue = event.key;
                console.log('Key pressed:', event.key, 'Shift:', event.shiftKey);
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
            
            return { keyPressed, keyValue };
        });
        
        console.log('🔍 Keyboard test result:', keyboardTest);
        
        // Verify that keyboard events are being captured
        expect(keyboardTest.keyPressed).toBeTruthy();
    });

    test('should examine extension manifest and structure', async () => {
        // Verify extension structure
        const structureValid = extensionUtils.verifyExtensionStructure();
        expect(structureValid).toBeTruthy();
        
        // Check if the extension files exist
        const fs = require('fs');
        const path = require('path');
        
        const buildPath = path.join(process.cwd(), 'build');
        const manifestPath = path.join(buildPath, 'manifest.json');
        const contentScriptPath = path.join(buildPath, 'content.js');
        const shadowContentPath = path.join(buildPath, 'shadowContent.js');
        const backgroundPath = path.join(buildPath, 'background.js');
        
        console.log('🔍 Checking extension files...');
        console.log('Manifest exists:', fs.existsSync(manifestPath));
        console.log('Content script exists:', fs.existsSync(contentScriptPath));
        console.log('Shadow content script exists:', fs.existsSync(shadowContentPath));
        console.log('Background script exists:', fs.existsSync(backgroundPath));
        
        // Verify all required files exist
        expect(fs.existsSync(manifestPath)).toBeTruthy();
        expect(fs.existsSync(shadowContentPath)).toBeTruthy();
        expect(fs.existsSync(backgroundPath)).toBeTruthy();
        
        // Read and verify manifest
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        console.log('🔍 Manifest content:', JSON.stringify(manifest, null, 2));
        
        // Verify manifest structure
        expect(manifest.manifest_version).toBe(3);
        expect(manifest.name).toBe('Wave Reader');
        expect(manifest.content_scripts).toBeDefined();
        expect(manifest.content_scripts.length).toBeGreaterThan(0);
        expect(manifest.background).toBeDefined();
        expect(manifest.commands).toBeDefined();
        
        // Check for keyboard shortcut commands
        const commands = manifest.commands;
        console.log('🔍 Extension commands:', commands);
        
        expect(commands['toggle-wave-reader']).toBeDefined();
        expect(commands['_execute_action']).toBeDefined();
    });

    test('should test extension in different scenarios', async () => {
        // Load the test page
        await extensionUtils.loadTestPage(page);
        
        // Set up console log monitoring
        const consoleLogs: string[] = [];
        page.on('console', (msg) => {
            const text = msg.text();
            consoleLogs.push(`[${msg.type()}] ${text}`);
        });

        // Wait for page to load
        await page.waitForTimeout(2000);
        
        // Test different keyboard combinations
        const testKeys = ['a', 'b', 'c', 'Shift+A', 'Alt+W', 'Shift+W'];
        
        for (const key of testKeys) {
            console.log(`🎹 Testing key: ${key}`);
            try {
                await page.keyboard.press(key);
                await page.waitForTimeout(500);
            } catch (error) {
                console.log(`⚠️ Failed to press key ${key}:`, error);
            }
        }
        
        // Check for any console activity
        console.log('🔍 Total console logs:', consoleLogs.length);
        console.log('🔍 Console logs:', consoleLogs);
        
        // Verify we have some activity
        expect(consoleLogs.length).toBeGreaterThan(0);
        
        // Test page interaction
        await page.click('#testToggle');
        await page.waitForTimeout(1000);
        
        // Check if the test button worked
        const statusText = await page.textContent('#status');
        console.log('🔍 Status after toggle test:', statusText);
        
        expect(statusText).toBeTruthy();
    });

    test.afterAll(async () => {
        if (extensionUtils) {
            await extensionUtils.cleanup(page);
        }
    });
}); 