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
let animationFrameId = null;
let lastCss = '';
let currentAnimationDuration = null;
let lastAnimationTime = 0;

// Smooth animation state
let currentRotationY = 0;
let targetRotationY = 0;
let currentTranslationX = 0;
let targetTranslationX = 0;
let isInitialized = false;

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
                
                // Calculate target values based on mouse position
                const mouseXNormalized = Math.max(0, Math.min(1, mouseX / window.innerWidth)); // Clamp to 0-1
                const mouseYNormalized = Math.max(0, Math.min(1, mouseY / window.innerHeight)); // Clamp to 0-1
                
                // Use default values if settings are missing
                const minRotation = options.wave.axisRotationAmountYMin ?? -2;
                const maxRotation = options.wave.axisRotationAmountYMax ?? 2;
                const rotationRange = maxRotation - minRotation;
                
                // Calculate target rotation (center position)
                const centerRotation = (minRotation + maxRotation) / 2;
                const targetRotation = centerRotation + (mouseXNormalized - 0.5) * rotationRange;
                targetRotationY = Math.max(minRotation, Math.min(maxRotation, targetRotation));
                
                // Calculate target translation (center position)
                const translationRange = 1.0; // -0.5% to +0.5%
                const targetTranslation = (mouseYNormalized - 0.5) * translationRange;
                targetTranslationX = Math.max(-0.5, Math.min(0.5, targetTranslation));
                
                // Smooth interpolation (lerp) toward target values
                const lerpFactor = 0.1; // Adjust for smoothness (0.1 = smooth, 0.5 = faster)
                currentRotationY += (targetRotationY - currentRotationY) * lerpFactor;
                currentTranslationX += (targetTranslationX - currentTranslationX) * lerpFactor;
                
                // Format for CSS
                const rotationY = currentRotationY.toFixed(2);
                const translationX = currentTranslationX.toFixed(2);
                
                // Debug logging to check values
                console.log('🌊 Animation values:', {
                    mouseX, mouseY,
                    mouseXNormalized, mouseYNormalized,
                    minRotation, maxRotation, rotationRange,
                    centerRotation: (minRotation + maxRotation) / 2,
                    targetRotationY, currentRotationY,
                    targetTranslationX, currentTranslationX,
                    rotationY, translationX,
                    lerpFactor: 0.1,
                    settings: {
                        min: options.wave.axisRotationAmountYMin,
                        max: options.wave.axisRotationAmountYMax
                    },
                    options: options.wave
                });
                
                // Additional safety check - clamp rotation to reasonable values
                const clampedRotationY = Math.max(-10, Math.min(10, parseFloat(rotationY))).toFixed(2);
                if (Math.abs(parseFloat(rotationY)) > 10) {
                    console.warn('🌊 Rotation value too large, clamping:', rotationY, '->', clampedRotationY);
                }
                
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
    // Clear any existing intervals or animation frames
    if (mouseFollowInterval) clearInterval(mouseFollowInterval);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    
    // Reset performance metrics
    performanceMetrics = {
        updateCount: 0,
        lastUpdateTime: 0,
        averageUpdateTime: 0,
        cssUpdateCount: 0,
        errorCount: 0
    };
    
    // Initialize smooth animation state
    const minRotation = options?.wave?.axisRotationAmountYMin ?? -2;
    const maxRotation = options?.wave?.axisRotationAmountYMax ?? 2;
    const centerRotation = (minRotation + maxRotation) / 2;
    
    // Start at center position
    currentRotationY = centerRotation;
    targetRotationY = centerRotation;
    currentTranslationX = 0;
    targetTranslationX = 0;
    isInitialized = true;
    
    console.log('🌊 Smooth animation initialized at center:', {
        centerRotation,
        currentRotationY,
        currentTranslationX
    });
    
    // Store options and base duration for dynamic updates
    currentAnimationDuration = options?.wave?.waveSpeed || 4;
    
    // Set up mouse tracking first
    setupMouseTracking();
    
    // IMPORTANT: Update wave immediately, don't wait for first interval
    console.log('🌊 Mouse-following wave enabled, performing immediate update...');
    updateWaveToMouse(options, loadCSSFunction, replaceAnimationVariablesFunction);
    
    // Use requestAnimationFrame with proper timing control
    const animate = (currentTime) => {
        // Check if enough time has passed since last animation update
        const timeSinceLastUpdate = currentTime - lastAnimationTime;
        const updateInterval = currentAnimationDuration * 1000; // Convert to milliseconds
        
        if (timeSinceLastUpdate >= updateInterval) {
            updateWaveToMouse(options, loadCSSFunction, replaceAnimationVariablesFunction);
            lastAnimationTime = currentTime;
        }
        
        animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start the animation loop immediately
    lastAnimationTime = performance.now();
    animationFrameId = requestAnimationFrame(animate);
    console.log('🌊 Mouse-following wave enabled with timed requestAnimationFrame, duration:', currentAnimationDuration, 's');
}

// Disable mouse-following wave
function disableMouseFollowingWave() {
    if (mouseFollowInterval) clearInterval(mouseFollowInterval);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    mouseFollowInterval = null;
    animationFrameId = null;
    lastCss = '';
    currentAnimationDuration = null;
    lastAnimationTime = 0;
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
    animationFrameId = null;
    lastCss = '';
    currentAnimationDuration = null;
    lastAnimationTime = 0;
    
    // Reset smooth animation state
    currentRotationY = 0;
    targetRotationY = 0;
    currentTranslationX = 0;
    targetTranslationX = 0;
    isInitialized = false;
    
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
    hasMouseMovedSignificantly,
    hasCssChangedSignificantly,
    retryOperation,
    performanceMetrics
}; 