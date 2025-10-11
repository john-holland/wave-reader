/**
 * App Loader
 * 
 * Dynamically loads either the original or refactored app based on environment variable.
 * This is processed at build time by webpack's DefinePlugin.
 * 
 * To use the refactored app:
 * USE_REFACTORED_APP=true npm run build
 */

// Webpack will replace process.env.USE_REFACTORED_APP with the actual value at build time
if (process.env.USE_REFACTORED_APP === 'true') {
  console.log('🌊 Loading REFACTORED app architecture (Tome View Stack)');
  module.exports = require('./app-refactored').default;
} else {
  console.log('🌊 Loading ORIGINAL app architecture');
  module.exports = require('./app').default;
}

