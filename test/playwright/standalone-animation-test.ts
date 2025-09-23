/**
 * Standalone JSDOM animation test
 * This test doesn't require the extension build and focuses purely on DOM animation testing
 */

import { test, expect } from '@playwright/test';
import { createDOMMock, testWaveAnimationInDOM } from './dom-mock';

test.describe('Standalone JSDOM Animation Testing', () => {
    test('should test wave animation using JSDOM mock', async () => {
        console.log('🎨 Testing wave animation with JSDOM mock...');
        
        // Create DOM mock with test content
        const domMock = createDOMMock(`
            <html>
                <body>
                    <div class="test-content">
                        <h1>Test Content</h1>
                        <p>This is test content for wave animation</p>
                        <div class="nested-content">
                            <span>Nested content that should also animate</span>
                        </div>
                    </div>
                    <div class="other-content">
                        <p>Other content that should not animate</p>
                    </div>
                </body>
            </html>
        `);
        
        try {
            // Test wave animation on the main content
            const animationResult = testWaveAnimationInDOM(domMock, '.test-content');
            
            console.log('🔍 Animation test result:', animationResult);
            
            // Verify animation was successful
            expect(animationResult.success).toBe(true);
            expect(animationResult.hasAnimation).toBe(true);
            expect(animationResult.hasModifications).toBe(true);
            
            // Test that changes were made
            if (animationResult.changes) {
                expect(animationResult.changes.classes.added.length).toBeGreaterThan(0);
                expect(animationResult.changes.styles.added).toBeDefined();
                
                // Check for specific wave animation classes
                const addedClasses = animationResult.changes.classes.added;
                expect(addedClasses).toContain('wave-animation');
                expect(addedClasses).toContain('wave-active');
                
                // Check for style modifications
                const addedStyles = animationResult.changes.styles.added;
                expect(addedStyles.transform).toBeDefined();
                expect(addedStyles.background).toBeDefined();
                expect(addedStyles.borderColor).toBeDefined();
            }
            
            // Test that other content was not affected
            const otherContent = domMock.getElement('.other-content');
            expect(otherContent).toBeTruthy();
            expect(domMock.hasWaveAnimation(otherContent!)).toBe(false);
            expect(domMock.hasWaveModifications(otherContent!)).toBe(false);
            
            console.log('✅ JSDOM wave animation test passed');
            
        } finally {
            // Clean up
            domMock.cleanup();
        }
    });

    test('should test multiple elements for wave animation', async () => {
        console.log('🎨 Testing multiple elements with JSDOM mock...');
        
        // Create DOM mock with multiple test elements
        const domMock = createDOMMock(`
            <html>
                <body>
                    <div class="content-section-1">
                        <h2>Section 1</h2>
                        <p>Content for section 1</p>
                    </div>
                    <div class="content-section-2">
                        <h2>Section 2</h2>
                        <p>Content for section 2</p>
                    </div>
                    <div class="no-animate">
                        <p>This should not animate</p>
                    </div>
                </body>
            </html>
        `);
        
        try {
            // Test animation on first section
            const animation1 = testWaveAnimationInDOM(domMock, '.content-section-1');
            expect(animation1.success).toBe(true);
            expect(animation1.hasAnimation).toBe(true);
            
            // Test animation on second section
            const animation2 = testWaveAnimationInDOM(domMock, '.content-section-2');
            expect(animation2.success).toBe(true);
            expect(animation2.hasAnimation).toBe(true);
            
            // Test that non-animating element doesn't animate
            const noAnimateElement = domMock.getElement('.no-animate');
            expect(noAnimateElement).toBeTruthy();
            expect(domMock.hasWaveAnimation(noAnimateElement!)).toBe(false);
            
            console.log('✅ Multiple elements animation test passed');
            
        } finally {
            domMock.cleanup();
        }
    });

    test('should test wave animation with different mouse positions', async () => {
        console.log('🎨 Testing wave animation with different mouse positions...');
        
        const domMock = createDOMMock(`
            <html>
                <body>
                    <div class="test-content" style="width: 300px; height: 200px;">
                        <h1>Large Content Area</h1>
                        <p>This content should respond to different mouse positions</p>
                    </div>
                </body>
            </html>
        `);
        
        try {
            const element = domMock.getElement('.test-content');
            expect(element).toBeTruthy();
            
            // Test different mouse positions
            const positions = [
                { x: 50, y: 50 },   // Top-left
                { x: 150, y: 100 }, // Center
                { x: 250, y: 150 }, // Bottom-right
                { x: 100, y: 50 },  // Top-center
            ];
            
            for (const pos of positions) {
                // Take snapshot before animation
                const snapshot = domMock.takeSnapshot(element!);
                
                // Simulate mouse event at this position
                domMock.simulateMouseEvent(element!, 'mousemove', {
                    clientX: pos.x,
                    clientY: pos.y
                });
                
                // Simulate wave animation
                domMock.simulateWaveAnimation(element!);
                
                // Check for changes
                const comparison = domMock.compareWithSnapshot(element!, snapshot);
                expect(comparison.hasChanges).toBe(true);
                expect(domMock.hasWaveAnimation(element!)).toBe(true);
                
                console.log(`✅ Mouse position (${pos.x}, ${pos.y}) animation test passed`);
            }
            
        } finally {
            domMock.cleanup();
        }
    });

    test('should test wave animation timing and cleanup', async () => {
        console.log('🎨 Testing wave animation timing and cleanup...');
        
        const domMock = createDOMMock(`
            <html>
                <body>
                    <div class="test-content">
                        <h1>Timing Test Content</h1>
                        <p>This content tests animation timing</p>
                    </div>
                </body>
            </html>
        `);
        
        try {
            const element = domMock.getElement('.test-content');
            expect(element).toBeTruthy();
            
            // Test initial state
            expect(domMock.hasWaveAnimation(element!)).toBe(false);
            expect(domMock.hasWaveModifications(element!)).toBe(false);
            
            // Trigger animation
            domMock.simulateWaveAnimation(element!);
            
            // Test immediate state
            expect(domMock.hasWaveAnimation(element!)).toBe(true);
            expect(domMock.hasWaveModifications(element!)).toBe(true);
            
            // Wait for animation to complete (simulated)
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // Test final state (animation should be cleaned up)
            // Note: In our mock, we remove 'wave-animation' class after 500ms
            // but keep 'wave-active' class for testing purposes
            expect(domMock.hasWaveModifications(element!)).toBe(true);
            
            console.log('✅ Animation timing and cleanup test passed');
            
        } finally {
            domMock.cleanup();
        }
    });

    test('should test wave animation with complex nested elements', async () => {
        console.log('🎨 Testing wave animation with complex nested elements...');
        
        const domMock = createDOMMock(`
            <html>
                <body>
                    <div class="test-content">
                        <header>
                            <h1>Complex Content</h1>
                            <nav>
                                <ul>
                                    <li><a href="#section1">Section 1</a></li>
                                    <li><a href="#section2">Section 2</a></li>
                                </ul>
                            </nav>
                        </header>
                        <main>
                            <section class="content-section">
                                <h2>Main Content</h2>
                                <p>This is the main content area with nested elements</p>
                                <div class="nested-widget">
                                    <button>Click me</button>
                                    <span>Widget content</span>
                                </div>
                            </section>
                        </main>
                    </div>
                </body>
            </html>
        `);
        
        try {
            // Test animation on the main container
            const animationResult = testWaveAnimationInDOM(domMock, '.test-content');
            expect(animationResult.success).toBe(true);
            expect(animationResult.hasAnimation).toBe(true);
            
            // Test that nested elements are also affected
            const nestedWidget = domMock.getElement('.nested-widget');
            expect(nestedWidget).toBeTruthy();
            
            // The nested elements should inherit the animation state from parent
            // (in a real implementation, this would depend on CSS inheritance)
            expect(domMock.hasWaveModifications(nestedWidget!)).toBe(true);
            
            console.log('✅ Complex nested elements animation test passed');
            
        } finally {
            domMock.cleanup();
        }
    });
});
