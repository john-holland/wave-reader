// Mock for deprecate module to avoid CSP eval issues
module.exports = function deprecate(fn, message) {
    return fn;
};

module.exports.wrapfunction = function(fn, message) {
    return fn;
};
