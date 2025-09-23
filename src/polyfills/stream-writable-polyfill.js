// Polyfill for _stream_writable to prevent util-deprecate errors
module.exports = {
    // Mock the _stream_writable module to prevent the error
    Writable: function() {},
    // Add any other exports that might be needed
};
