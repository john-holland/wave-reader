/**
 * App Loader
 * 
 * Dynamically loads either the refactored (default) or original app based on environment variable.
 * This is processed at build time by webpack's DefinePlugin.
 * 
 * Default: Refactored modular architecture (Tome View Stack)
 * To use the original app (for rollback): USE_ORIGINAL_APP=true npm run build
 */

// Webpack will replace process.env.USE_ORIGINAL_APP with the actual value at build time
if (process.env.USE_ORIGINAL_APP === 'true') {
  console.log('🌊 Loading ORIGINAL app architecture (legacy fallback)');
  module.exports = require('./app').default;
} else {
  console.log('🌊 Loading REFACTORED app architecture (Tome View Stack) - DEFAULT');
  module.exports = require('./app-refactored').default;
}

