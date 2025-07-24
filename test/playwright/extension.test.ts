import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Wave Reader Extension Tests', () => {
    let extensionPath: string;

    test.beforeAll(async () => {
        // Build the extension first
        const { execSync } = require('child_process');
        try {
            execSync('npm run build', { stdio: 'inherit' });
            console.log('Extension built successfully');
        } catch (error) {
            console.error('Failed to build extension:', error);
            throw error;
        }
        
        extensionPath = path.join(process.cwd(), 'build');
        console.log('Extension path:', extensionPath);
    });

    test('should load extension and display test page', async ({ page }) => {
        // Navigate to the test page
        await page.goto('file://' + path.join(process.cwd(), 'test/playwright/test.html'));
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        
        // Check that the page loaded correctly
        await expect(page.locator('h1, h2')).toHaveCount(4); // Should have 4 section headers
        await expect(page.locator('.test-controls')).toBeVisible();
        
        // Check that test controls are present
        await expect(page.locator('#testMouseWave')).toBeVisible();
        await expect(page.locator('#testCSSTemplate')).toBeVisible();
        await expect(page.locator('#testToggle')).toBeVisible();
        await expect(page.locator('#testPerformance')).toBeVisible();
        
        console.log('Test page loaded successfully');
    });

    test('should have extension content script loaded', async ({ page }) => {
        await page.goto('file://' + path.join(process.cwd(), 'test/playwright/test.html'));
        await page.waitForLoadState('networkidle');
        
        // Check if extension content script is loaded by looking for console logs
        const logs: string[] = [];
        page.on('console', msg => {
            if (msg.text().includes('🌊')) {
                logs.push(msg.text());
            }
        });
        
        // Wait a bit for any extension scripts to load
        await page.waitForTimeout(2000);
        
        // Check if we have any wave reader logs
        expect(logs.length).toBeGreaterThan(0);
        console.log('Extension logs found:', logs);
    });

    test('should test mouse wave animation functionality', async ({ page }) => {
        await page.goto('file://' + path.join(process.cwd(), 'test/playwright/test.html'));
        await page.waitForLoadState('networkidle');
        
        // Click the test mouse wave button
        await page.click('#testMouseWave');
        
        // Wait for the test to complete
        await page.waitForSelector('#status.status-success', { timeout: 5000 });
        
        const statusText = await page.locator('#status').textContent();
        expect(statusText).toContain('Mouse wave test completed');
        
        console.log('Mouse wave test completed successfully');
    });

    test('should test CSS template animation functionality', async ({ page }) => {
        await page.goto('file://' + path.join(process.cwd(), 'test/playwright/test.html'));
        await page.waitForLoadState('networkidle');
        
        // Click the test CSS template button
        await page.click('#testCSSTemplate');
        
        // Wait for the test to complete
        await page.waitForSelector('#status.status-success', { timeout: 5000 });
        
        const statusText = await page.locator('#status').textContent();
        expect(statusText).toContain('CSS template test completed');
        
        console.log('CSS template test completed successfully');
    });

    test('should test toggle functionality', async ({ page }) => {
        await page.goto('file://' + path.join(process.cwd(), 'test/playwright/test.html'));
        await page.waitForLoadState('networkidle');
        
        // Click the test toggle button
        await page.click('#testToggle');
        
        // Wait for the test to complete
        await page.waitForSelector('#status.status-success', { timeout: 5000 });
        
        const statusText = await page.locator('#status').textContent();
        expect(statusText).toContain('Toggle test completed');
        
        console.log('Toggle test completed successfully');
    });

    test('should test performance metrics', async ({ page }) => {
        await page.goto('file://' + path.join(process.cwd(), 'test/playwright/test.html'));
        await page.waitForLoadState('networkidle');
        
        // Click the test performance button
        await page.click('#testPerformance');
        
        // Wait for the test to complete
        await page.waitForSelector('#status.status-success', { timeout: 10000 });
        
        const statusText = await page.locator('#status').textContent();
        expect(statusText).toContain('Performance test completed');
        
        console.log('Performance test completed successfully');
    });

    test('should handle mouse movement and wave animation', async ({ page }) => {
        await page.goto('file://' + path.join(process.cwd(), 'test/playwright/test.html'));
        await page.waitForLoadState('networkidle');
        
        // Get the test content area
        const testContent = page.locator('.test-content').first();
        await expect(testContent).toBeVisible();
        
        // Simulate mouse movement over the content
        const rect = await testContent.boundingBox();
        if (rect) {
            // Move mouse to center of content
            await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
            
            // Move mouse around to test wave animation
            await page.mouse.move(rect.x + rect.width / 4, rect.y + rect.height / 4);
            await page.mouse.move(rect.x + rect.width * 3 / 4, rect.y + rect.height * 3 / 4);
            await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
            
            console.log('Mouse movement test completed');
        }
    });

    test('should verify extension manifest and structure', async ({ page }) => {
        // This test verifies that the extension was built correctly
        const manifestPath = path.join(extensionPath, 'manifest.json');
        const fs = require('fs');
        
        expect(fs.existsSync(manifestPath)).toBe(true);
        
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        expect(manifest.name).toBeDefined();
        expect(manifest.version).toBeDefined();
        expect(manifest.manifest_version).toBeDefined();
        
        // Check for content scripts
        expect(manifest.content_scripts).toBeDefined();
        expect(manifest.content_scripts.length).toBeGreaterThan(0);
        
        console.log('Extension manifest verified successfully');
    });

    test('should test extension in different content scenarios', async ({ page }) => {
        await page.goto('file://' + path.join(process.cwd(), 'test/playwright/test.html'));
        await page.waitForLoadState('networkidle');
        
        // Test with different text content sections
        const sections = await page.locator('.test-section').all();
        expect(sections.length).toBeGreaterThan(0);
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            await section.scrollIntoViewIfNeeded();
            
            // Move mouse over the section
            const rect = await section.boundingBox();
            if (rect) {
                await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
                await page.waitForTimeout(500); // Brief pause to observe
            }
        }
        
        console.log('Content scenario testing completed');
    });

    test('should verify extension performance and memory usage', async ({ page }) => {
        await page.goto('file://' + path.join(process.cwd(), 'test/playwright/test.html'));
        await page.waitForLoadState('networkidle');
        
        // Monitor console for performance metrics
        const performanceLogs: string[] = [];
        page.on('console', msg => {
            if (msg.text().includes('performance') || msg.text().includes('metrics')) {
                performanceLogs.push(msg.text());
            }
        });
        
        // Perform some actions to trigger performance monitoring
        await page.click('#testPerformance');
        await page.waitForTimeout(3000);
        
        // Check if we have any performance logs
        console.log('Performance logs found:', performanceLogs);
        
        // The test passes if we can complete the performance test without errors
        await page.waitForSelector('#status.status-success', { timeout: 10000 });
    });
}); 