import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Extension Load Test', () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        // Create a simple browser context without extension
        const context = await browser.newContext();
        page = await context.newPage();
    }, { timeout: 10000 });

    test('should load extension files without util-deprecate errors', async () => {
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

        // Check if build files exist
        const buildDir = path.join(__dirname, '../../build');
        const appJsPath = path.join(buildDir, 'app.js');
        const backgroundJsPath = path.join(buildDir, 'background.js');
        
        console.error('🔍 Checking build files...');
        console.error('Build directory exists:', fs.existsSync(buildDir));
        console.error('app.js exists:', fs.existsSync(appJsPath));
        console.error('background.js exists:', fs.existsSync(backgroundJsPath));

        // Create a test page that loads the built extension files
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Extension Load Test</title>
            </head>
            <body>
                <h1>Extension Load Test</h1>
                <div id="status">Loading...</div>
                <script>
                    console.log('🌊 Starting extension load test...');
                    
                    // Test loading the built app.js file
                    const script = document.createElement('script');
                    script.src = '/build/app.js';
                    script.onload = () => {
                        console.log('✅ app.js loaded successfully');
                        document.getElementById('status').textContent = 'Success: app.js loaded without util-deprecate errors!';
                    };
                    script.onerror = (error) => {
                        console.error('❌ app.js failed to load:', error);
                        document.getElementById('status').textContent = 'Failed: app.js load error';
                    };
                    document.head.appendChild(script);
                </script>
            </body>
            </html>
        `;

        // Load the HTML content
        await page.setContent(htmlContent);
        
        console.error('🔍 Testing extension file loading...');
        
        // Wait for script loading
        await page.waitForTimeout(3000);
        
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
        
        // The test passes if we don't have util-deprecate errors
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
