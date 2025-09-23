// Simple polyfill for util-deprecate
function deprecate(fn, message) {
    if (process.env.NODE_ENV === 'development') {
        console.warn('Deprecation warning:', message);
    }
    return fn;
}

// Export both CommonJS and ES module formats
module.exports = deprecate;
module.exports.default = deprecate;
module.exports.__esModule = true;
