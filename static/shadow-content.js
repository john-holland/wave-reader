import "regenerator-runtime/runtime";

// Import our new Tome-based shadow system
import { LogViewShadowSystemTomes } from "../src/content-scripts/log-view-shadow-system-tome";

console.log("🌊 Wave Reader Shadow DOM content script is loading on: " + window.location.href);

// Initialize the Shadow DOM using our new Tome-based system
const shadowTome = LogViewShadowSystemTomes.create({});

// Expose to window object for debugging
window.waveReaderShadow = shadowTome;

console.log("🌊 Wave Reader Shadow DOM content script loaded successfully using Tome-based system");
