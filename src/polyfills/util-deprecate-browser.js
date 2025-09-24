// Browser polyfill for util-deprecate
// This replaces the Node.js util-deprecate module for browser environments
// Avoids new Function() to comply with CSP

function deprecate(fn, message) {
    // If no function provided, return a no-op function
    if (typeof fn !== 'function') {
        return function() {};
    }
    
    // Check if deprecation warnings are disabled
    if (config('noDeprecation')) {
        return fn;
    }

    var warned = false;
    
    // Create a wrapper function that warns once and then calls the original
    // This avoids new Function() while maintaining the same behavior
    function deprecated() {
        if (!warned) {
            if (config('throwDeprecation')) {
                throw new Error(message);
            } else if (config('traceDeprecation')) {
                console.trace(message);
            } else {
                console.warn(message);
            }
            warned = true;
        }
        return fn.apply(this, arguments);
    }

    return deprecated;
}

// Configuration helper function
function config(name) {
    try {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(name) === 'true';
        }
    } catch (e) {
        // Ignore localStorage errors
    }
    return false;
}

// Add wrapFunction method that util-deprecate uses internally
deprecate.wrapFunction = function(fn, message) {
    return deprecate(fn, message);
};

// Export in both CommonJS and ES module formats
if (typeof module !== 'undefined' && module.exports) {
    module.exports = deprecate;
    module.exports.default = deprecate;
    module.exports.__esModule = true;
    module.exports.wrapFunction = deprecate.wrapFunction;
}

// Also make it available globally for webpack
if (typeof global !== 'undefined') {
    global.utilDeprecate = deprecate;
}

// For ES modules
export default deprecate;
export { deprecate };
