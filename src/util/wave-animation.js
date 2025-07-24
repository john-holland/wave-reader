/**
 * Shared Wave Animation Module
 * Provides unified wave animation functionality for both content.js and shadow-content.js
 */

// Performance monitoring
let performanceMetrics = {
    updateCount: 0,
    lastUpdateTime: 0,
    averageUpdateTime: 0,
    totalUpdateTime: 0
};

// Performance optimization constants
const MOUSE_MOVEMENT_THRESHOLD = 5; // pixels
const CSS_UPDATE_THRESHOLD = 0.1; // degrees/percent
const MAX_RETRY_ATTEMPTS = 3; // Maximum retry attempts

// Mouse tracking state
let mouseX = 0, mouseY = 0;
let lastMouseX = 0, lastMouseY = 0;
let globalMouseMoveListener = null;
let isMouseTrackingActive = false;

// Wave animation state
let mouseFollowInterval = null;
let lastCss = '';
let currentAnimationDuration = null;

// Performance monitoring function
function updatePerformanceMetrics(updateTime, cssUpdated = false, error = false) {
    performanceMetrics.updateCount++;
    performanceMetrics.lastUpdateTime = updateTime;
    
    // Calculate rolling average
    const alpha = 0.1; // Smoothing factor
    performanceMetrics.averageUpdateTime = 
        performanceMetrics.averageUpdateTime * (1 - alpha) + updateTime * alpha;
    
    if (cssUpdated) {
        performanceMetrics.cssUpdateCount++;
    }
    
    if (error) {
        performanceMetrics.errorCount++;
    }
    
    // Log performance metrics every 100 updates
    if (performanceMetrics.updateCount % 100 === 0) {
        console.log('🌊 Performance metrics:', {
            totalUpdates: performanceMetrics.updateCount,
            averageUpdateTime: performanceMetrics.averageUpdateTime.toFixed(2) + 'ms',
            cssUpdates: performanceMetrics.cssUpdateCount,
            errors: performanceMetrics.errorCount,
            cssUpdateRate: ((performanceMetrics.cssUpdateCount / performanceMetrics.updateCount) * 100).toFixed(1) + '%'
        });
    }
}

// Utility: Cartesian to cylindrical (relative to center)
function cartesianToCylindrical(x, y, cx, cy) {
    const dx = x - cx;
    const dy = y - cy;
    const r = Math.sqrt(dx*dx + dy*dy);
    const theta = Math.atan2(dy, dx); // radians
    return { r, theta };
}

// Check if mouse has moved significantly since last update
function hasMouseMovedSignificantly() {
    const dx = Math.abs(mouseX - lastMouseX);
    const dy = Math.abs(mouseY - lastMouseY);
    const hasMoved = dx > MOUSE_MOVEMENT_THRESHOLD || dy > MOUSE_MOVEMENT_THRESHOLD;
    
    // If mouse has moved, update the last position for next comparison
    if (hasMoved) {
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
    
    return hasMoved;
}

// Check if CSS values have changed significantly
function hasCssChangedSignificantly(newRotationY, newTranslationX, lastRotationY, lastTranslationX) {
    if (!lastRotationY || !lastTranslationX) return true;
    
    const rotationDiff = Math.abs(parseFloat(newRotationY) - parseFloat(lastRotationY));
    const translationDiff = Math.abs(parseFloat(newTranslationX) - parseFloat(lastTranslationX));
    
    return rotationDiff > CSS_UPDATE_THRESHOLD || translationDiff > CSS_UPDATE_THRESHOLD;
}

// Retry mechanism for failed operations
function retryOperation(operation, maxAttempts = MAX_RETRY_ATTEMPTS) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        
        const attempt = () => {
            attempts++;
            try {
                const result = operation();
                resolve(result);
            } catch (error) {
                console.warn(`🌊 Operation failed (attempt ${attempts}/${maxAttempts}):`, error);
                if (attempts < maxAttempts) {
                    setTimeout(attempt, 100 * attempts); // Exponential backoff
                } else {
                    reject(error);
                }
            }
        };
        
        attempt();
    });
}

// Setup mouse tracking
function setupMouseTracking() {
    if (globalMouseMoveListener) {
        window.removeEventListener('mousemove', globalMouseMoveListener);
    }
    
    globalMouseMoveListener = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        lastMouseTime = Date.now();
    };
    
    window.addEventListener('mousemove', globalMouseMoveListener);
    isMouseTrackingActive = true;
    console.log('🌊 Mouse tracking setup complete');
}

// Clean up mouse tracking
function cleanupMouseTracking() {
    if (globalMouseMoveListener) {
        window.removeEventListener('mousemove', globalMouseMoveListener);
        globalMouseMoveListener = null;
    }
    isMouseTrackingActive = false;
    console.log('🌊 Mouse tracking cleanup complete');
}

// Main wave animation update function
function updateWaveToMouse(options, loadCSSFunction, replaceAnimationVariablesFunction) {
    updateWaveToMouseWithDuration(options, options?.wave?.waveSpeed || 4, loadCSSFunction, replaceAnimationVariablesFunction);
}

// Main function to update wave animation with specific duration
function updateWaveToMouseWithDuration(options, duration, loadCSSFunction, replaceAnimationVariablesFunction) {
    const startTime = performance.now();
    let cssUpdated = false;
    let error = false;
    
    if (!options || !options.wave || !options.wave.selector) {
        console.warn('🌊 Invalid options for wave animation');
        error = true;
        updatePerformanceMetrics(performance.now() - startTime, false, error);
        return;
    }
    
    // Performance optimization: Only update if mouse has moved significantly
    // BUT: Always update on first call (when lastMouseX/lastMouseY are 0)
    const isFirstUpdate = lastMouseX === 0 && lastMouseY === 0;
    if (!isFirstUpdate && !hasMouseMovedSignificantly()) {
        updatePerformanceMetrics(performance.now() - startTime, false, false);
        return;
    }
    
    // Check if mouse tracking is active
    if (!isMouseTrackingActive) {
        console.warn('🌊 Mouse tracking not active, reinitializing...');
        setupMouseTracking();
    }
    
    try {
        const elements = document.querySelectorAll(options.wave.selector);
        if (!elements.length) {
            console.warn(`🌊 No elements found for selector: ${options.wave.selector}`);
            error = true;
            updatePerformanceMetrics(performance.now() - startTime, false, error);
            return;
        }
        
        let newCss = null;
        let lastRotationY = null;
        let lastTranslationX = null;
        
        // Extract current values from last CSS if it exists
        if (lastCss) {
            const rotationMatch = lastCss.match(/rotateY\(([^)]+)deg\)/);
            const translationMatch = lastCss.match(/translateX\(([^)]+)%\)/);
            if (rotationMatch) lastRotationY = rotationMatch[1];
            if (translationMatch) lastTranslationX = translationMatch[1];
        }
        
        elements.forEach(el => {
            try {
                const rect = el.getBoundingClientRect();
                if (!rect || rect.width === 0 || rect.height === 0) {
                    console.warn('🌊 Element has invalid dimensions:', el);
                    return;
                }
                
                const cx = rect.left + rect.width/2;
                const cy = rect.top + rect.height/2;
                
                // Bounds checking for mouse coordinates
                if (mouseX < 0 || mouseY < 0 || mouseX > window.innerWidth || mouseY > window.innerHeight) {
                    console.warn('🌊 Mouse coordinates out of bounds:', { mouseX, mouseY });
                    return;
                }
                
                const { r, theta } = cartesianToCylindrical(mouseX, mouseY, cx, cy);
                
                // Map theta to a rotation (deg) and r to a translation (%)
                // Adjust angle by adding π/2 (90 degrees) for more intuitive control
                const adjustedTheta = theta + Math.PI / 2;
                const rotationY = (adjustedTheta * 180 / Math.PI).toFixed(2); // degrees
                
                // translation: scale r to a reasonable % (max 10% of width)
                const maxR = Math.max(rect.width, rect.height) / 2;
                const translationX = ((r / maxR) * 10 * Math.cos(adjustedTheta)).toFixed(2); // percent
                
                // Performance optimization: Only update CSS if values have changed significantly
                if (hasCssChangedSignificantly(rotationY, translationX, lastRotationY, lastTranslationX)) {
                    newCss = replaceAnimationVariablesFunction(options.wave, translationX, rotationY, duration);
                }
            } catch (error) {
                console.error('🌊 Error processing element:', error);
                error = true;
            }
        });
        
        // Only update CSS if we have new values and they're different
        if (newCss && newCss !== lastCss) {
            retryOperation(() => {
                loadCSSFunction(newCss);
                lastCss = newCss;
                cssUpdated = true;
                return true;
            }).catch(error => {
                console.error('🌊 Failed to update CSS after retries:', error);
                error = true;
            });
        }
        
    } catch (error) {
        console.error('🌊 Error in updateWaveToMouseWithDuration:', error);
        error = true;
    }
    
    updatePerformanceMetrics(performance.now() - startTime, cssUpdated, error);
}

// Enable mouse-following wave
function enableMouseFollowingWave(options, loadCSSFunction, replaceAnimationVariablesFunction) {
    if (mouseFollowInterval) clearInterval(mouseFollowInterval);
    
    // Reset performance metrics
    performanceMetrics = {
        updateCount: 0,
        lastUpdateTime: 0,
        averageUpdateTime: 0,
        cssUpdateCount: 0,
        errorCount: 0
    };
    
    // Store options and base duration for dynamic updates
    currentAnimationDuration = options?.wave?.waveSpeed || 4;
    
    // Use the current animation duration for the update interval (1:1 relationship)
    const updateInterval = currentAnimationDuration * 1000; // Convert to milliseconds
    
    // Set up mouse tracking first
    setupMouseTracking();
    
    // IMPORTANT: Update wave immediately, don't wait for first interval
    console.log('🌊 Mouse-following wave enabled, performing immediate update...');
    updateWaveToMouse(options, loadCSSFunction, replaceAnimationVariablesFunction);
    
    // Then start the interval for continuous updates
    mouseFollowInterval = setInterval(() => 
        updateWaveToMouse(options, loadCSSFunction, replaceAnimationVariablesFunction), 
        updateInterval
    );
    console.log('🌊 Mouse-following wave enabled, duration:', currentAnimationDuration, 's, update interval:', updateInterval, 'ms (1:1 ratio)');
}

// Disable mouse-following wave
function disableMouseFollowingWave() {
    if (mouseFollowInterval) clearInterval(mouseFollowInterval);
    mouseFollowInterval = null;
    lastCss = '';
    currentAnimationDuration = null;
    cleanupMouseTracking();
    console.log('🌊 Mouse-following wave disabled');
}

// Get performance metrics for debugging
function getWavePerformanceMetrics() {
    return {
        ...performanceMetrics,
        isMouseTrackingActive,
        mouseFollowInterval: mouseFollowInterval !== null,
        lastCss: lastCss ? lastCss.substring(0, 100) + '...' : null
    };
}

// Reset all state (useful for testing)
function resetWaveAnimationState() {
    performanceMetrics = {
        updateCount: 0,
        lastUpdateTime: 0,
        averageUpdateTime: 0,
        cssUpdateCount: 0,
        errorCount: 0
    };
    
    mouseX = 0;
    mouseY = 0;
    lastMouseX = 0;
    lastMouseY = 0;
    lastMouseTime = Date.now();
    isMouseTrackingActive = false;
    mouseFollowInterval = null;
    lastCss = '';
    currentAnimationDuration = null;
    
    cleanupMouseTracking();
}

// Export all functions
export {
    updateWaveToMouse,
    updateWaveToMouseWithDuration,
    enableMouseFollowingWave,
    disableMouseFollowingWave,
    setupMouseTracking,
    cleanupMouseTracking,
    getWavePerformanceMetrics,
    resetWaveAnimationState,
    cartesianToCylindrical,
    hasMouseMovedSignificantly,
    hasCssChangedSignificantly,
    retryOperation,
    performanceMetrics
}; 