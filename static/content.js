import "regenerator-runtime/runtime";

// Import our new integrated content system
import LogViewContentSystemIntegrated from "../src/content-scripts/log-view-content-system-integrated";

console.log("🌊 Wave Reader content script is loading on:", window.location.href);

// Initialize the integrated content system
const integratedSystem = new LogViewContentSystemIntegrated();

// Expose to window object for debugging
window.waveReaderIntegrated = integratedSystem;

console.log("🌊 Wave Reader content script loaded successfully using integrated system");
