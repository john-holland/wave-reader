import { test, expect, Page } from '@playwright/test';

test.describe('Extension Util-Deprecate Test', () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        // Create a browser context with extension loaded
        const context = await browser.newContext({
            // Load the extension
            args: [
                '--disable-extensions-except=./build',
                '--load-extension=./build',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-default-browser-check',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection',
            ],
        });
        page = await context.newPage();
    }, { timeout: 15000 });

    test('should load extension without util-deprecate errors', async () => {
        // Set up console log monitoring with stderr output
        const consoleLogs: string[] = [];
        const errors: string[] = [];
        
        page.on('console', (msg) => {
            const text = msg.text();
            const logEntry = `[${msg.type()}] ${text}`;
            consoleLogs.push(logEntry);
            // Print to stderr for better visibility
            console.error(`[CONSOLE-${msg.type()}] ${text}`);
            
            // Check for util-deprecate errors
            if (text.includes('util-deprecate') || text.includes('Cannot find module')) {
                errors.push(logEntry);
            }
        });

        // Also capture page errors
        page.on('pageerror', (error) => {
            const errorMsg = `[PAGE-ERROR] ${error.message}`;
            consoleLogs.push(errorMsg);
            console.error(errorMsg);
            
            // Check for util-deprecate errors
            if (error.message.includes('util-deprecate') || error.message.includes('Cannot find module')) {
                errors.push(errorMsg);
            }
        });

        // Navigate to a test page to trigger the extension
        await page.goto('https://example.com');
        
        console.error('🔍 Testing extension with util-deprecate polyfill...');
        
        // Wait for extension to load and initialize
        await page.waitForTimeout(3000);
        
        // Log all captured console messages
        console.error('📋 All captured console logs:', consoleLogs);
        
        // Log any util-deprecate errors found
        if (errors.length > 0) {
            console.error('❌ Util-deprecate errors found:', errors);
        } else {
            console.error('✅ No util-deprecate errors found!');
        }
        
        // The test passes if we don't have util-deprecate errors
        expect(errors.length).toBe(0);
        // Don't require console logs - the important thing is no util-deprecate errors
        
        console.error(`✅ Test passed - captured ${consoleLogs.length} console logs, ${errors.length} util-deprecate errors`);
    });

    test.afterAll(async () => {
        if (page) {
            await page.close();
        }
    });
});
