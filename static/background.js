import "regenerator-runtime/runtime";

// Import our background system
import LogViewBackgroundSystem from "../src/background-scripts/log-view-background-system";

console.log("🌊 Wave Reader background script is loading...");

// Initialize the background system
const backgroundSystem = new LogViewBackgroundSystem();

// Expose to global scope for debugging
window.waveReaderBackground = backgroundSystem;

console.log("🌊 Wave Reader background script loaded successfully");
