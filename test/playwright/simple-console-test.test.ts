import { test, expect, Page } from '@playwright/test';

test.describe('Simple Console Log Test', () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        // Create a simple browser context without extension
        const context = await browser.newContext();
        page = await context.newPage();
    }, { timeout: 10000 }); // Increase timeout for beforeAll

    test('should capture console logs from a simple page', async () => {
        // Set up console log monitoring with stderr output
        const consoleLogs: string[] = [];
        
        page.on('console', (msg) => {
            const text = msg.text();
            const logEntry = `[${msg.type()}] ${text}`;
            consoleLogs.push(logEntry);
            // Print to stderr for better visibility
            console.error(`[CONSOLE-${msg.type()}] ${text}`);
        });

        // Also capture page errors
        page.on('pageerror', (error) => {
            const errorMsg = `[PAGE-ERROR] ${error.message}`;
            consoleLogs.push(errorMsg);
            console.error(errorMsg);
        });

        // Create a simple HTML page with console logs
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Console Test</title>
            </head>
            <body>
                <h1>Console Log Test</h1>
                <script>
                    console.log('🌊 Test console log from page');
                    console.warn('⚠️ Test console warn from page');
                    console.error('❌ Test console error from page');
                    console.info('ℹ️ Test console info from page');
                    
                    // Test some utility functions
                    setTimeout(() => {
                        console.log('🔄 Async console log after 100ms');
                    }, 100);
                    
                    setTimeout(() => {
                        console.log('🔄 Async console log after 500ms');
                    }, 500);
                </script>
            </body>
            </html>
        `;

        // Load the HTML content
        await page.setContent(htmlContent);
        
        console.error('🔍 Testing console log capture...');
        
        // Wait for async console logs
        await page.waitForTimeout(1000);
        
        // Log all captured console messages
        console.error('📋 All captured console logs:', consoleLogs);
        
        // Test that we captured console logs
        expect(consoleLogs.length).toBeGreaterThan(0);
        console.error(`✅ Test passed - captured ${consoleLogs.length} console logs`);
        
        // Check for specific log types
        const logEntries = consoleLogs.filter(log => log.includes('Test console log from page'));
        expect(logEntries.length).toBeGreaterThan(0);
        
        const warnEntries = consoleLogs.filter(log => log.includes('Test console warn from page'));
        expect(warnEntries.length).toBeGreaterThan(0);
        
        const errorEntries = consoleLogs.filter(log => log.includes('Test console error from page'));
        expect(errorEntries.length).toBeGreaterThan(0);
        
        console.error('✅ All console log types captured successfully!');
    });

    test.afterAll(async () => {
        if (page) {
            await page.close();
        }
    });
});
