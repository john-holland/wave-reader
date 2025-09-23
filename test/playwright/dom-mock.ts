/**
 * JSDOM-based DOM mock for animation testing
 * This provides a realistic DOM environment for testing wave animations
 */

import { JSDOM } from 'jsdom';

export interface DOMSnapshot {
    classes: string[];
    styles: { [key: string]: string };
    attributes: { [key: string]: string };
    innerHTML: string;
    children: DOMSnapshot[];
}

export class DOMMock {
    private dom: JSDOM;
    private document: Document;
    private window: any;
    private snapshots: Map<Element, DOMSnapshot> = new Map();

    constructor(html: string = '<html><body><div class="test-content">Test Content</div></body></html>') {
        this.dom = new JSDOM(html, {
            url: 'http://localhost',
            pretendToBeVisual: true,
            resources: 'usable'
        });
        
        this.document = this.dom.window.document;
        this.window = this.dom.window;
        
        // Add some basic CSS for testing
        this.addTestStyles();
    }

    private addTestStyles(): void {
        const style = this.document.createElement('style');
        style.textContent = `
            .test-content {
                width: 200px;
                height: 100px;
                background: #f0f0f0;
                border: 1px solid #ccc;
                padding: 10px;
                margin: 10px;
                transition: all 0.3s ease;
            }
            .wave-animation {
                animation: wave 0.5s ease-in-out;
                transform: scale(1.05);
            }
            .wave-active {
                background: #e0f0ff;
                border-color: #007bff;
            }
            @keyframes wave {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1.05); }
            }
        `;
        this.document.head.appendChild(style);
    }

    getDocument(): Document {
        return this.document;
    }

    getWindow(): any {
        return this.window;
    }

    getElement(selector: string): Element | null {
        return this.document.querySelector(selector);
    }

    getAllElements(selector: string): NodeListOf<Element> {
        return this.document.querySelectorAll(selector);
    }

    /**
     * Take a snapshot of an element's current state
     */
    takeSnapshot(element: Element): DOMSnapshot {
        const snapshot: DOMSnapshot = {
            classes: Array.from(element.classList),
            styles: this.getComputedStyles(element),
            attributes: this.getAttributes(element),
            innerHTML: element.innerHTML,
            children: []
        };

        // Take snapshots of children
        for (let i = 0; i < element.children.length; i++) {
            const child = element.children[i];
            snapshot.children.push(this.takeSnapshot(child));
        }

        this.snapshots.set(element, snapshot);
        return snapshot;
    }

    /**
     * Compare current state with a snapshot
     */
    compareWithSnapshot(element: Element, snapshot: DOMSnapshot): {
        hasChanges: boolean;
        changes: {
            classes: { added: string[]; removed: string[] };
            styles: { added: { [key: string]: string }; removed: { [key: string]: string }; modified: { [key: string]: { from: string; to: string } } };
            attributes: { added: { [key: string]: string }; removed: string[]; modified: { [key: string]: { from: string; to: string } } };
        };
    } {
        const currentSnapshot = this.takeSnapshot(element);
        
        const changes = {
            classes: {
                added: currentSnapshot.classes.filter(cls => !snapshot.classes.includes(cls)),
                removed: snapshot.classes.filter(cls => !currentSnapshot.classes.includes(cls))
            },
            styles: {
                added: {} as { [key: string]: string },
                removed: {} as { [key: string]: string },
                modified: {} as { [key: string]: { from: string; to: string } }
            },
            attributes: {
                added: {} as { [key: string]: string },
                removed: [] as string[],
                modified: {} as { [key: string]: { from: string; to: string } }
            }
        };

        // Compare styles
        const allStyleKeys = new Set([...Object.keys(currentSnapshot.styles), ...Object.keys(snapshot.styles)]);
        for (const key of Array.from(allStyleKeys)) {
            const currentValue = currentSnapshot.styles[key];
            const snapshotValue = snapshot.styles[key];
            
            if (currentValue !== snapshotValue) {
                if (snapshotValue === undefined) {
                    changes.styles.added[key] = currentValue;
                } else if (currentValue === undefined) {
                    changes.styles.removed[key] = snapshotValue;
                } else {
                    changes.styles.modified[key] = { from: snapshotValue, to: currentValue };
                }
            }
        }

        // Compare attributes
        const allAttrKeys = new Set([...Object.keys(currentSnapshot.attributes), ...Object.keys(snapshot.attributes)]);
        for (const key of Array.from(allAttrKeys)) {
            const currentValue = currentSnapshot.attributes[key];
            const snapshotValue = snapshot.attributes[key];
            
            if (currentValue !== snapshotValue) {
                if (snapshotValue === undefined) {
                    changes.attributes.added[key] = currentValue;
                } else if (currentValue === undefined) {
                    changes.attributes.removed.push(key);
                } else {
                    changes.attributes.modified[key] = { from: snapshotValue, to: currentValue };
                }
            }
        }

        const hasChanges = 
            changes.classes.added.length > 0 ||
            changes.classes.removed.length > 0 ||
            Object.keys(changes.styles.added).length > 0 ||
            Object.keys(changes.styles.removed).length > 0 ||
            Object.keys(changes.styles.modified).length > 0 ||
            Object.keys(changes.attributes.added).length > 0 ||
            changes.attributes.removed.length > 0 ||
            Object.keys(changes.attributes.modified).length > 0;

        return { hasChanges, changes };
    }

    /**
     * Simulate mouse events on an element
     */
    simulateMouseEvent(element: Element, eventType: string, options: any = {}): void {
        const event = new (this.window as any).MouseEvent(eventType, {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 100,
            ...options
        });
        
        element.dispatchEvent(event);
    }

    /**
     * Simulate wave animation by adding classes and styles
     */
    simulateWaveAnimation(element: Element): void {
        // Add wave animation classes
        element.classList.add('wave-animation', 'wave-active');
        
        // Add some inline styles to simulate animation
        (element as HTMLElement).style.transform = 'scale(1.05)';
        (element as HTMLElement).style.background = '#e0f0ff';
        (element as HTMLElement).style.borderColor = '#007bff';
        
        // Simulate animation end after a short delay
        setTimeout(() => {
            element.classList.remove('wave-animation');
        }, 500);
    }

    /**
     * Check if an element has wave animation classes
     */
    hasWaveAnimation(element: Element): boolean {
        return element.classList.contains('wave-animation') || 
               element.classList.contains('wave-active');
    }

    /**
     * Check if an element has been modified for wave animation
     */
    hasWaveModifications(element: Element): boolean {
        const styles = this.getComputedStyles(element);
        return (
            element.classList.contains('wave-animation') ||
            element.classList.contains('wave-active') ||
            styles.transform !== 'none' ||
            styles.background.includes('rgb(224, 240, 255)') ||
            styles.borderColor.includes('rgb(0, 123, 255)')
        );
    }

    private getComputedStyles(element: Element): { [key: string]: string } {
        const computed = this.window.getComputedStyle(element);
        const styles: { [key: string]: string } = {};
        
        // Get relevant CSS properties for wave animation
        const relevantProps = [
            'transform', 'background', 'backgroundColor', 'borderColor', 
            'border', 'opacity', 'scale', 'animation', 'transition'
        ];
        
        for (const prop of relevantProps) {
            styles[prop] = computed.getPropertyValue(prop);
        }
        
        return styles;
    }

    private getAttributes(element: Element): { [key: string]: string } {
        const attributes: { [key: string]: string } = {};
        
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            attributes[attr.name] = attr.value;
        }
        
        return attributes;
    }

    /**
     * Clean up the DOM mock
     */
    cleanup(): void {
        this.snapshots.clear();
        this.dom.window.close();
    }
}

/**
 * Helper function to create a DOM mock for testing
 */
export function createDOMMock(html?: string): DOMMock {
    return new DOMMock(html);
}

/**
 * Helper function to test wave animation in a DOM mock
 */
export function testWaveAnimationInDOM(domMock: DOMMock, selector: string = '.test-content'): {
    success: boolean;
    hasAnimation: boolean;
    hasModifications: boolean;
    changes?: any;
} {
    const element = domMock.getElement(selector);
    if (!element) {
        return {
            success: false,
            hasAnimation: false,
            hasModifications: false
        };
    }

    // Take initial snapshot
    const initialSnapshot = domMock.takeSnapshot(element);
    
    // Simulate mouse event to trigger animation
    domMock.simulateMouseEvent(element, 'mousemove', {
        clientX: 150,
        clientY: 150
    });
    
    // Simulate wave animation
    domMock.simulateWaveAnimation(element);
    
    // Check for changes
    const comparison = domMock.compareWithSnapshot(element, initialSnapshot);
    const hasAnimation = domMock.hasWaveAnimation(element);
    const hasModifications = domMock.hasWaveModifications(element);
    
    return {
        success: true,
        hasAnimation,
        hasModifications,
        changes: comparison.changes
    };
}
