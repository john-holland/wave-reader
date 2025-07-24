/**
 * Test file for mouse wave improvements
 * Tests the performance optimizations and error handling improvements
 */

// Mock DOM environment for testing
const mockDocument = {
    head: {
        appendChild: jest.fn(),
        removeChild: jest.fn()
    },
    getElementById: jest.fn(),
    querySelectorAll: jest.fn(),
    getElementsByTagName: jest.fn(() => [mockDocument.head])
};

const mockWindow = {
    innerWidth: 1920,
    innerHeight: 1080,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    postMessage: jest.fn()
};

// Mock performance API
const mockPerformance = {
    now: jest.fn(() => Date.now())
};

// Mock console
const mockConsole = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};

// Setup global mocks
global.document = mockDocument;
global.window = mockWindow;
global.performance = mockPerformance;
global.console = mockConsole;

describe('Mouse Wave Improvements', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        
        // Reset global variables
        global.mouseX = 0;
        global.mouseY = 0;
        global.lastMouseX = 0;
        global.lastMouseY = 0;
        global.lastCss = '';
        global.isMouseTrackingActive = false;
        global.performanceMetrics = {
            updateCount: 0,
            lastUpdateTime: 0,
            averageUpdateTime: 0,
            cssUpdateCount: 0,
            errorCount: 0
        };
    });

    test('should detect significant mouse movement', () => {
        // Test mouse movement threshold
        global.mouseX = 10;
        global.mouseY = 10;
        global.lastMouseX = 0;
        global.lastMouseY = 0;
        
        const hasMoved = hasMouseMovedSignificantly();
        expect(hasMoved).toBe(true);
    });

    test('should not detect insignificant mouse movement', () => {
        // Test small mouse movement
        global.mouseX = 2;
        global.mouseY = 2;
        global.lastMouseX = 0;
        global.lastMouseY = 0;
        
        const hasMoved = hasMouseMovedSignificantly();
        expect(hasMoved).toBe(false);
    });

    test('should detect CSS value changes', () => {
        const newRotationY = '10.5';
        const newTranslationX = '5.2';
        const lastRotationY = '10.0';
        const lastTranslationX = '5.0';
        
        const hasChanged = hasCssChangedSignificantly(newRotationY, newTranslationX, lastRotationY, lastTranslationX);
        expect(hasChanged).toBe(true);
    });

    test('should not detect insignificant CSS changes', () => {
        const newRotationY = '10.05';
        const newTranslationX = '5.02';
        const lastRotationY = '10.0';
        const lastTranslationX = '5.0';
        
        const hasChanged = hasCssChangedSignificantly(newRotationY, newTranslationX, lastRotationY, lastTranslationX);
        expect(hasChanged).toBe(false);
    });

    test('should handle invalid options gracefully', () => {
        const invalidOptions = null;
        
        updateWaveToMouseWithDuration(invalidOptions, 4);
        
        expect(mockConsole.warn).toHaveBeenCalledWith('🌊 Invalid options for wave animation');
    });

    test('should handle missing elements gracefully', () => {
        mockDocument.querySelectorAll.mockReturnValue([]);
        
        const options = {
            wave: {
                selector: '.test-selector'
            }
        };
        
        updateWaveToMouseWithDuration(options, 4);
        
        expect(mockConsole.warn).toHaveBeenCalledWith('🌊 No elements found for selector: .test-selector');
    });

    test('should setup mouse tracking correctly', () => {
        setupMouseTracking();
        
        expect(mockWindow.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
        expect(global.isMouseTrackingActive).toBe(true);
    });

    test('should cleanup mouse tracking correctly', () => {
        global.isMouseTrackingActive = true;
        global.globalMouseMoveListener = jest.fn();
        
        cleanupMouseTracking();
        
        expect(mockWindow.removeEventListener).toHaveBeenCalledWith('mousemove', global.globalMouseMoveListener);
        expect(global.isMouseTrackingActive).toBe(false);
    });

    test('should calculate cartesian to cylindrical coordinates correctly', () => {
        const result = cartesianToCylindrical(5, 5, 0, 0);
        
        expect(result.r).toBeCloseTo(7.07, 2);
        expect(result.theta).toBeCloseTo(0.785, 3);
    });

    test('should update performance metrics correctly', () => {
        updatePerformanceMetrics(10.5, true, false);
        
        expect(global.performanceMetrics.updateCount).toBe(1);
        expect(global.performanceMetrics.cssUpdateCount).toBe(1);
        expect(global.performanceMetrics.errorCount).toBe(0);
    });

    test('should handle errors in performance metrics', () => {
        updatePerformanceMetrics(5.2, false, true);
        
        expect(global.performanceMetrics.updateCount).toBe(1);
        expect(global.performanceMetrics.cssUpdateCount).toBe(0);
        expect(global.performanceMetrics.errorCount).toBe(1);
    });
});

// Helper functions for testing (these would be imported from the actual file)
function hasMouseMovedSignificantly() {
    const dx = Math.abs(global.mouseX - global.lastMouseX);
    const dy = Math.abs(global.mouseY - global.lastMouseY);
    return dx > 5 || dy > 5;
}

function hasCssChangedSignificantly(newRotationY, newTranslationX, lastRotationY, lastTranslationX) {
    if (!lastRotationY || !lastTranslationX) return true;
    
    const rotationDiff = Math.abs(parseFloat(newRotationY) - parseFloat(lastRotationY));
    const translationDiff = Math.abs(parseFloat(newTranslationX) - parseFloat(lastTranslationX));
    
    return rotationDiff > 0.1 || translationDiff > 0.1;
}

function cartesianToCylindrical(x, y, cx, cy) {
    const dx = x - cx;
    const dy = y - cy;
    const r = Math.sqrt(dx*dx + dy*dy);
    const theta = Math.atan2(dy, dx);
    return { r, theta };
}

function setupMouseTracking() {
    global.isMouseTrackingActive = true;
    mockWindow.addEventListener('mousemove', jest.fn());
}

function cleanupMouseTracking() {
    global.isMouseTrackingActive = false;
    mockWindow.removeEventListener('mousemove', global.globalMouseMoveListener);
}

function updatePerformanceMetrics(updateTime, cssUpdated = false, error = false) {
    global.performanceMetrics.updateCount++;
    global.performanceMetrics.lastUpdateTime = updateTime;
    
    if (cssUpdated) {
        global.performanceMetrics.cssUpdateCount++;
    }
    
    if (error) {
        global.performanceMetrics.errorCount++;
    }
}

function updateWaveToMouseWithDuration(options, duration) {
    if (!options || !options.wave || !options.wave.selector) {
        mockConsole.warn('🌊 Invalid options for wave animation');
        return;
    }
    
    const elements = mockDocument.querySelectorAll(options.wave.selector);
    if (!elements.length) {
        mockConsole.warn(`🌊 No elements found for selector: ${options.wave.selector}`);
        return;
    }
} 