import { Page, BrowserContext } from '@playwright/test';
import path from 'path';

export interface ExtensionTestConfig {
    extensionPath: string;
    testPagePath: string;
    timeout?: number;
}

export class ExtensionTestUtils {
    private config: ExtensionTestConfig;

    constructor(config: ExtensionTestConfig) {
        this.config = {
            timeout: 10000,
            ...config
        };
    }

    /**
     * Create a browser context with the extension loaded
     */
    async createExtensionContext(browser: any): Promise<BrowserContext> {
        const context = await browser.newContext({
            // Load the extension
            args: [
                `--disable-extensions-except=${this.config.extensionPath}`,
                `--load-extension=${this.config.extensionPath}`,
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

        return context;
    }

    /**
     * Navigate to the test page and wait for extension to load
     */
    async loadTestPage(page: Page): Promise<void> {
        // Inject mock Chrome API into the page context BEFORE navigation
        await this.injectMockChromeAPI(page);
        
        await page.goto(`file://${this.config.testPagePath}`);
        await page.waitForLoadState('networkidle');
        
        // Wait for extension content script to load
        await page.waitForTimeout(2000);
    }

    /**
     * Inject mock Chrome API into the page context
     */
    async injectMockChromeAPI(page: Page): Promise<void> {
        // Inject the mock Chrome API directly into the page context
        await page.addInitScript(() => {
            console.log('🔧 Creating mock Chrome API in page context...');
            
            // Create mock Chrome API directly in the page context
            const mockChrome = {
                runtime: {
                    sendMessage: async (message) => {
                        console.log('📤 Mock Chrome API: Sending message', message);
                        
                        // Simulate async behavior
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                const response = {
                                    success: true,
                                    message: 'Mock response received',
                                    data: {
                                        selector: message.selector || '.test-content',
                                        options: message.options || {},
                                        traceId: message.traceId || 'mock-trace-' + Date.now()
                                    }
                                };
                                console.log('📥 Mock Chrome API: Response', response);
                                resolve(response);
                            }, 10);
                        });
                    },
                    onMessage: {
                        addListener: (callback) => {
                            console.log('👂 Mock Chrome API: Message listener added');
                        },
                        removeListener: (callback) => {
                            console.log('🔇 Mock Chrome API: Message listener removed');
                        }
                    }
                },
                storage: {
                    local: {
                        get: (keys, callback) => {
                            console.log('📦 Mock Chrome API: Storage get', keys);
                            const result = {};
                            if (callback) {
                                setTimeout(() => callback(result), 10);
                            }
                            return Promise.resolve(result);
                        },
                        set: (items, callback) => {
                            console.log('💾 Mock Chrome API: Storage set', items);
                            if (callback) {
                                setTimeout(callback, 10);
                            }
                            return Promise.resolve();
                        },
                        remove: (keys, callback) => {
                            console.log('🗑️ Mock Chrome API: Storage remove', keys);
                            if (callback) {
                                setTimeout(callback, 10);
                            }
                            return Promise.resolve();
                        },
                        clear: (callback) => {
                            console.log('🧹 Mock Chrome API: Storage clear');
                            if (callback) {
                                setTimeout(callback, 10);
                            }
                            return Promise.resolve();
                        }
                    }
                },
                tabs: {
                    query: (queryInfo, callback) => {
                        console.log('🔍 Mock Chrome API: Tabs query', queryInfo);
                        const mockTabs = [{
                            id: 1,
                            url: 'file:///Users/johnholland/Developers/wave-reader/test/playwright/test.html',
                            title: 'Test Page',
                            active: true
                        }];
                        if (callback) {
                            setTimeout(() => callback(mockTabs), 10);
                        }
                        return Promise.resolve(mockTabs);
                    },
                    sendMessage: (tabId, message, callback) => {
                        console.log('📤 Mock Chrome API: Tab send message', { tabId, message });
                        return mockChrome.runtime.sendMessage(message).then(response => {
                            if (callback) {
                                callback(response);
                            }
                            return response;
                        });
                    }
                },
                action: {
                    setBadgeText: (details) => {
                        console.log('🏷️ Mock Chrome API: Set badge text', details);
                    },
                    setBadgeBackgroundColor: (details) => {
                        console.log('🎨 Mock Chrome API: Set badge color', details);
                    }
                }
            };
            
            // @ts-ignore - We're intentionally adding to global scope
            window.chrome = mockChrome;
            
            // Also add to global scope for compatibility
            // @ts-ignore
            globalThis.chrome = mockChrome;
            
            console.log('🔧 Chrome API injected successfully');
            console.log('🔧 window.chrome:', window.chrome);
            console.log('🔧 globalThis.chrome:', globalThis.chrome);
        });
        
        console.log('🔧 Mock Chrome API injection script added');
    }

    /**
     * Check if the extension is loaded by looking for console logs
     */
    async verifyExtensionLoaded(page: Page): Promise<boolean> {
        const logs: string[] = [];
        
        page.on('console', msg => {
            if (msg.text().includes('🌊')) {
                logs.push(msg.text());
            }
        });

        // Wait a bit more for any delayed logs
        await page.waitForTimeout(1000);
        
        return logs.length > 0;
    }

    /**
     * Simulate mouse movement over content to test wave animation
     */
    async testMouseWaveAnimation(page: Page, selector: string = '.test-content'): Promise<void> {
        const content = page.locator(selector).first();
        await content.waitFor({ state: 'visible' });
        
        const rect = await content.boundingBox();
        if (!rect) {
            throw new Error('Content element not found or not visible');
        }

        // Move mouse to different positions to test wave animation
        const positions = [
            { x: rect.x + rect.width / 4, y: rect.y + rect.height / 4 },
            { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
            { x: rect.x + rect.width * 3 / 4, y: rect.y + rect.height * 3 / 4 },
            { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
        ];

        for (const pos of positions) {
            await page.mouse.move(pos.x, pos.y);
            await page.waitForTimeout(200); // Brief pause to observe animation
        }
    }

    /**
     * Test extension performance by monitoring console logs
     */
    async testExtensionPerformance(page: Page): Promise<string[]> {
        const performanceLogs: string[] = [];
        
        page.on('console', msg => {
            if (msg.text().includes('performance') || 
                msg.text().includes('metrics') || 
                msg.text().includes('update')) {
                performanceLogs.push(msg.text());
            }
        });

        // Trigger some actions to generate performance data
        await page.click('#testPerformance');
        await page.waitForTimeout(3000);

        return performanceLogs;
    }

    /**
     * Verify extension manifest and structure
     */
    verifyExtensionStructure(): boolean {
        const fs = require('fs');
        const manifestPath = path.join(this.config.extensionPath, 'manifest.json');
        
        if (!fs.existsSync(manifestPath)) {
            throw new Error(`Extension manifest not found at ${manifestPath}`);
        }

        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        
        // Basic manifest validation
        const requiredFields = ['name', 'version', 'manifest_version'];
        for (const field of requiredFields) {
            if (!manifest[field]) {
                throw new Error(`Missing required manifest field: ${field}`);
            }
        }

        // Check for content scripts
        if (!manifest.content_scripts || manifest.content_scripts.length === 0) {
            throw new Error('No content scripts found in manifest');
        }

        return true;
    }

    /**
     * Get extension performance metrics
     */
    async getPerformanceMetrics(page: Page): Promise<any> {
        // This would need to be implemented based on your extension's performance monitoring
        // For now, we'll return a basic structure
        return {
            timestamp: Date.now(),
            pageUrl: page.url(),
            userAgent: await page.evaluate(() => navigator.userAgent),
        };
    }

    /**
     * Test extension in different content scenarios
     */
    async testContentScenarios(page: Page): Promise<void> {
        const sections = await page.locator('.test-section').all();
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            await section.scrollIntoViewIfNeeded();
            
            const rect = await section.boundingBox();
            if (rect) {
                await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
                await page.waitForTimeout(500);
            }
        }
    }

    /**
     * Clean up extension resources
     */
    async cleanup(page: Page): Promise<void> {
        // Close the page to clean up resources
        if (page) {
            await page.close();
        }
    }
}

/**
 * Helper function to create extension test configuration
 */
export function createExtensionTestConfig(
    extensionPath: string = path.join(process.cwd(), 'build'),
    testPagePath: string = path.join(process.cwd(), 'test/playwright/test.html')
): ExtensionTestConfig {
    return {
        extensionPath,
        testPagePath,
        timeout: 10000,
    };
} 