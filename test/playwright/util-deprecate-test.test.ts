import { test, expect, Page } from '@playwright/test';

test.describe('Util-Deprecate Polyfill Test', () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        // Create a simple browser context without extension
        const context = await browser.newContext();
        page = await context.newPage();
    }, { timeout: 10000 }); // Increase timeout for beforeAll

    test('should not have util-deprecate errors when loading log-view-machine', async () => {
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

        // Create a test page that imports log-view-machine
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Util-Deprecate Test</title>
            </head>
            <body>
                <h1>Util-Deprecate Polyfill Test</h1>
                <div id="status">Loading...</div>
                <script>
                    console.log('🌊 Starting util-deprecate test...');
                    
                    // Test importing util-deprecate directly
                    try {
                        // This should work with our polyfill - using dynamic import
                        const deprecateModule = await import('util-deprecate');
                        const deprecate = deprecateModule.default || deprecateModule;
                        console.log('✅ util-deprecate imported successfully:', typeof deprecate);
                        
                        // Test using it
                        const testFn = () => 'test';
                        const deprecatedFn = deprecate(testFn, 'This is deprecated');
                        console.log('✅ util-deprecate function works:', typeof deprecatedFn);
                        console.log('✅ Deprecated function result:', deprecatedFn());
                        
                    } catch (error) {
                        console.error('❌ util-deprecate import failed:', error.message);
                    }
                    
                    // Test loading log-view-machine (this is where the error occurs)
                    setTimeout(async () => {
                        try {
                            console.log('🔄 Attempting to import log-view-machine...');
                            // This will trigger the util-deprecate error if polyfill is broken
                            const logViewMachine = await import('log-view-machine');
                            console.log('✅ log-view-machine imported successfully');
                            document.getElementById('status').textContent = 'Success: No util-deprecate errors!';
                        } catch (error) {
                            console.error('❌ log-view-machine import failed:', error.message);
                            document.getElementById('status').textContent = 'Failed: ' + error.message;
                        }
                    }, 100);
                </script>
            </body>
            </html>
        `;

        // Load the HTML content
        await page.setContent(htmlContent);
        
        console.error('🔍 Testing util-deprecate polyfill...');
        
        // Wait for async operations and any potential errors
        await page.waitForTimeout(2000);
        
        // Check the status element
        const status = await page.textContent('#status');
        console.error('📊 Status:', status);
        
        // Log all captured console messages
        console.error('📋 All captured console logs:', consoleLogs);
        
        // Log any util-deprecate errors found
        if (errors.length > 0) {
            console.error('❌ Util-deprecate errors found:', errors);
        } else {
            console.error('✅ No util-deprecate errors found!');
        }
        
        // The test passes if:
        // 1. We don't have util-deprecate errors
        // 2. We captured some console logs (indicating the page loaded)
        expect(errors.length).toBe(0);
        expect(consoleLogs.length).toBeGreaterThan(0);
        
        console.error(`✅ Test passed - captured ${consoleLogs.length} console logs, ${errors.length} util-deprecate errors`);
    });

    test.afterAll(async () => {
        if (page) {
            await page.close();
        }
    });
});
