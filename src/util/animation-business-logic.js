/**
 * Centralized Animation Business Logic
 * Provides unified business logic for both content.js and shadow-content.js
 */

// Animation mode constants
const CSS_MODE__MOUSE = "1";
const CSS_MODE__TEMPLATE = "0";

/**
 * Updates wave animation status based on mode changes and option updates
 * @param {Object} currentOptions - Current animation options
 * @param {Object} previousOptions - Previous animation options
 * @param {Object} context - Context object with required functions
 * @param {Function} context.enableMouseFollowingWave - Function to enable mouse following
 * @param {Function} context.disableMouseFollowingWave - Function to disable mouse following
 * @param {Function} context.loadCSSTemplate - Function to load CSS template
 * @param {Function} context.log - Logging function
 * @param {string} contextPrefix - Prefix for logging (e.g., "🌊 Content" or "🌊 Shadow DOM")
 */
export function updateWavingStatus(currentOptions, previousOptions, context, contextPrefix) {
    if (!currentOptions) {
        context.log(`${contextPrefix}: No options provided to updateWavingStatus`);
        return;
    }

    const modeChanged = previousOptions?.waveAnimationControl !== currentOptions.waveAnimationControl;
    
    if (modeChanged) {
        context.log(`${contextPrefix}: Animation mode changed from`, previousOptions?.waveAnimationControl, 'to', currentOptions.waveAnimationControl);
        
        // Handle mode changes
        if (currentOptions.waveAnimationControl === CSS_MODE__MOUSE) {
            context.log(`${contextPrefix}: Switching to Mouse mode - enabling mouse-following wave`);
            context.enableMouseFollowingWave(currentOptions);
        } else if (currentOptions.waveAnimationControl === CSS_MODE__TEMPLATE) {
            context.log(`${contextPrefix}: Switching to CSS mode - disabling mouse-following wave`);
            context.disableMouseFollowingWave();
            context.loadCSSTemplate(currentOptions.wave.cssTemplate);
        }
    } else {
        // Handle updates within the same mode
        if (currentOptions.waveAnimationControl === CSS_MODE__MOUSE) {
            // Check if mouse template changed or wave speed changed
            const templateChanged = previousOptions?.wave?.cssMouseTemplate !== currentOptions.wave.cssMouseTemplate;
            const speedChanged = previousOptions?.wave?.waveSpeed !== currentOptions.wave.waveSpeed;
            
            if (templateChanged || speedChanged) {
                context.log(`${contextPrefix}: Mouse template or speed updated - restarting mouse-following wave`);
                context.disableMouseFollowingWave();
                context.enableMouseFollowingWave(currentOptions);
            }
        } else if (currentOptions.waveAnimationControl === CSS_MODE__TEMPLATE) {
            // Check if CSS template changed
            if (previousOptions?.wave?.cssTemplate !== currentOptions.wave.cssTemplate) {
                context.log(`${contextPrefix}: CSS template updated`);
                context.loadCSSTemplate(currentOptions.wave.cssTemplate);
            }
        }
    }
}

/**
 * Loads CSS into the DOM (regular or Shadow DOM)
 * @param {string} css - CSS content to load
 * @param {Object} context - Context object with DOM access
 * @param {Function} context.log - Logging function
 * @param {boolean} isShadowDom - Whether this is Shadow DOM context
 * @param {Object} context.shadowRoot - Shadow root (for Shadow DOM context)
 * @param {Object} context.styleElement - Style element (for Shadow DOM context)
 * @param {Object} context.mainDocumentStyle - Main document style element (for Shadow DOM context)
 * @returns {boolean} Success status
 */
export function loadCSS(css, context, isShadowDom) {
    if (!css || typeof css !== 'string') {
        context.log("🌊 Invalid CSS provided:", css);
        return false;
    }
    
    try {
        if (isShadowDom) {
            // Shadow DOM context
            if (context.styleElement) {
                context.styleElement.textContent = css;
            }
            
            // Also inject CSS into the main document for text elements
            if (!context.mainDocumentStyle) {
                context.mainDocumentStyle = document.createElement('style');
                context.mainDocumentStyle.id = 'wave-reader-main-css';
                document.head.appendChild(context.mainDocumentStyle);
            }
            context.mainDocumentStyle.textContent = css;
            
            context.log("🌊 Shadow DOM: CSS loaded into main document");
            return true;
        } else {
            // Regular DOM context
            // Check if we're in a Shadow DOM context
            const isShadowDOM = document.head === null || document.head === undefined;
            
            if (isShadowDOM) {
                // In Shadow DOM, we need to find the shadow root and create a style element there
                const shadowRoot = document.querySelector('*')?.shadowRoot;
                if (shadowRoot) {
                    // Remove existing style element if it exists
                    const existingStyle = shadowRoot.getElementById("extension");
                    if (existingStyle) {
                        existingStyle.remove();
                    }
                    
                    const style = document.createElement("style");
                    style.id = "extension";
                    style.textContent = css;
                    shadowRoot.appendChild(style);
                    context.log("🌊 CSS loaded in Shadow DOM");
                    return true;
                } else {
                    context.log("🌊 Shadow DOM not found, falling back to regular DOM");
                }
            }
            
            // Fallback to regular DOM
            const head = document.head || document.getElementsByTagName("head")[0];
            if (!head) {
                context.log("🌊 No head element found, cannot load CSS");
                return false;
            }
            
            // Remove existing style element if it exists
            const existingStyle = document.getElementById("extension");
            if (existingStyle) {
                existingStyle.remove();
            }
            
            const style = document.createElement("style");
            style.id = "extension";
            style.textContent = css;
            head.appendChild(style);
            context.log("🌊 CSS loaded in regular DOM");
            return true;
        }
    } catch (error) {
        context.log("🌊 Error loading CSS:", error);
        return false;
    }
}

/**
 * Unloads CSS from the DOM
 * @param {Object} context - Context object with DOM access
 * @param {Function} context.log - Logging function
 * @param {boolean} isShadowDom - Whether this is Shadow DOM context
 * @param {Object} context.styleElement - Style element (for Shadow DOM context)
 * @param {Object} context.mainDocumentStyle - Main document style element (for Shadow DOM context)
 */
export function unloadCSS(context, isShadowDom) {
    if (isShadowDom) {
        // Shadow DOM context
        if (context.styleElement) {
            context.styleElement.textContent = '';
        }
        if (context.mainDocumentStyle) {
            context.mainDocumentStyle.textContent = '';
        }
        context.log("🌊 CSS unloaded from both Shadow DOM and main document");
    } else {
        // Regular DOM context
        try {
            // Try to find the style element in regular DOM
            const cssNode = document.getElementById("extension");
            if (cssNode && cssNode.parentNode) {
                cssNode.parentNode.removeChild(cssNode);
                context.log("🌊 CSS unloaded from regular DOM");
                return;
            }
            
            // Try to find the style element in Shadow DOM
            const shadowRoot = document.querySelector('*')?.shadowRoot;
            if (shadowRoot) {
                const shadowCssNode = shadowRoot.getElementById("extension");
                if (shadowCssNode) {
                    shadowCssNode.remove();
                    context.log("🌊 CSS unloaded from Shadow DOM");
                    return;
                }
            }
            
            context.log("🌊 No CSS element found to unload");
        } catch (error) {
            context.log("🌊 Error unloading CSS:", error);
        }
    }
}

/**
 * Loads CSS template with retry mechanism
 * @param {string} css - CSS template content
 * @param {Object} context - Context object with required functions
 * @param {Function} context.loadCSS - Function to load CSS
 * @param {Function} context.unloadCSS - Function to unload CSS
 * @param {Function} context.log - Logging function
 * @param {boolean} isShadowDom - Whether this is Shadow DOM context
 * @returns {Promise<boolean>} Success status
 */
export function loadCSSTemplate(css, context, isShadowDom) {
    if (!css || typeof css !== 'string') {
        context.log("🌊 Invalid CSS template provided:", css);
        return false;
    }
    
    try {
        context.log("🌊 Loading CSS template:", css.substring(0, 100) + "...");
        context.unloadCSS();
        
        // Use a more reliable approach with retry mechanism
        return retryOperation(() => {
            const success = context.loadCSS(css, context, isShadowDom);
            if (success) {
                context.log("🌊 CSS template loaded successfully");
                return true;
            } else {
                throw new Error("Failed to load CSS");
            }
        }, 2).then(() => true).catch(error => {
            context.log("🌊 Failed to load CSS template after retries:", error);
            return false;
        });
    } catch (error) {
        context.log("🌊 Error in loadCSSTemplate:", error);
        return false;
    }
}

/**
 * Replaces animation variables in CSS template
 * @param {Object} wave - Wave configuration object
 * @param {string} translationX - Translation X value
 * @param {string} rotationY - Rotation Y value
 * @returns {string} CSS with replaced variables
 */
export function replaceAnimationVariables(wave, translationX, rotationY) {
    // Use the same constants as the Wave model
    const TRANSLATE_X = "TRANSLATE_X";
    const ROTATE_Y = "ROTATE_Y";
    
    let css = wave.cssMouseTemplate || wave.cssTemplate || '';
    css = css.replaceAll(TRANSLATE_X, translationX);
    css = css.replaceAll(ROTATE_Y, rotationY);
    return css;
}

/**
 * Replaces animation variables in CSS template with duration
 * @param {Object} wave - Wave configuration object
 * @param {string} translationX - Translation X value
 * @param {string} rotationY - Rotation Y value
 * @param {number} duration - Animation duration
 * @returns {string} CSS with replaced variables
 */
export function replaceAnimationVariablesWithDuration(wave, translationX, rotationY, duration) {
    // Use the same constants as the Wave model
    const TRANSLATE_X = "TRANSLATE_X";
    const ROTATE_Y = "ROTATE_Y";
    const ANIMATION_DURATION = "ANIMATION_DURATION";
    
    let css = wave.cssMouseTemplate || wave.cssTemplate || '';
    css = css.replaceAll(TRANSLATE_X, translationX);
    css = css.replaceAll(ROTATE_Y, rotationY);
    css = css.replaceAll(ANIMATION_DURATION, duration.toString());
    return css;
}

/**
 * Retry mechanism for failed operations
 * @param {Function} operation - Operation to retry
 * @param {number} maxAttempts - Maximum retry attempts
 * @returns {Promise} Promise that resolves with operation result
 */
function retryOperation(operation, maxAttempts = 3) {
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

// Export constants for use in other modules
export { CSS_MODE__MOUSE, CSS_MODE__TEMPLATE }; 