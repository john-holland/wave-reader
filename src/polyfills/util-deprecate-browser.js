// Browser polyfill for util-deprecate
// This replaces the Node.js util-deprecate module for browser environments
// Avoids new Function() to comply with CSP

function deprecate(fn, message) {
    // In browser environments, we'll just log a warning and return the function
    // Avoid using new Function() to comply with Content Security Policy
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
        console.warn('Deprecation warning:', message);
    }
    return fn;
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
