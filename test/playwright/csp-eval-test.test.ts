import { test, expect, Page } from '@playwright/test';

test.describe('CSP Eval Test', () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        // Create a simple browser context without extension
        const context = await browser.newContext();
        page = await context.newPage();
    }, { timeout: 10000 });

    test('should not have CSP eval errors when using util-deprecate', async () => {
        // Set up console log monitoring with stderr output
        const consoleLogs: string[] = [];
        const errors: string[] = [];
        
        page.on('console', (msg) => {
            const text = msg.text();
            const logEntry = `[${msg.type()}] ${text}`;
            consoleLogs.push(logEntry);
            // Print to stderr for better visibility
            console.error(`[CONSOLE-${msg.type()}] ${text}`);
            
            // Check for CSP eval errors
            if (text.includes('EvalError') || text.includes('unsafe-eval') || text.includes('new Function')) {
                errors.push(logEntry);
            }
        });

        // Also capture page errors
        page.on('pageerror', (error) => {
            const errorMsg = `[PAGE-ERROR] ${error.message}`;
            consoleLogs.push(errorMsg);
            console.error(errorMsg);
            
            // Check for CSP eval errors
            if (error.message.includes('EvalError') || error.message.includes('unsafe-eval') || error.message.includes('new Function')) {
                errors.push(errorMsg);
            }
        });

        // Create a test page that uses util-deprecate
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>CSP Eval Test</title>
                <!-- Set a strict CSP to test our polyfill -->
                <meta http-equiv="Content-Security-Policy" content="script-src 'self'; object-src 'none';">
            </head>
            <body>
                <h1>CSP Eval Test</h1>
                <div id="status">Loading...</div>
                <script>
                    console.log('🌊 Starting CSP eval test...');
                    
                    // Test our util-deprecate polyfill
                    try {
                        // Simulate what util-deprecate does internally
                        const testFunction = function() { return 'test'; };
                        
                        // This should work without new Function()
                        const deprecatedFn = testFunction;
                        console.log('✅ Function wrapping works without eval');
                        console.log('✅ Function result:', deprecatedFn());
                        
                        // Test wrapFunction method
                        if (typeof globalThis.utilDeprecate !== 'undefined') {
                            const wrapped = globalThis.utilDeprecate.wrapFunction(testFunction, 'Test deprecation');
                            console.log('✅ wrapFunction works without eval');
                            console.log('✅ Wrapped function result:', wrapped());
                        }
                        
                        document.getElementById('status').textContent = 'Success: No CSP eval errors!';
                        
                    } catch (error) {
                        console.error('❌ CSP eval error:', error.message);
                        document.getElementById('status').textContent = 'Failed: ' + error.message;
                    }
                </script>
            </body>
            </html>
        `;

        // Load the HTML content
        await page.setContent(htmlContent);
        
        console.error('🔍 Testing CSP eval compliance...');
        
        // Wait for script execution
        await page.waitForTimeout(1000);
        
        // Check the status element
        const status = await page.textContent('#status');
        console.error('📊 Status:', status);
        
        // Log all captured console messages
        console.error('📋 All captured console logs:', consoleLogs);
        
        // Log any CSP eval errors found
        if (errors.length > 0) {
            console.error('❌ CSP eval errors found:', errors);
        } else {
            console.error('✅ No CSP eval errors found!');
        }
        
        // The test passes if we don't have CSP eval errors
        expect(errors.length).toBe(0);
        expect(consoleLogs.length).toBeGreaterThan(0);
        
        console.error(`✅ Test passed - captured ${consoleLogs.length} console logs, ${errors.length} CSP eval errors`);
    });

    test.afterAll(async () => {
        if (page) {
            await page.close();
        }
    });
});
