// Debug script to check content script injection
console.log("🔍 Debug: Checking content script injection...");

// Check if content script is loaded
if (typeof window.waveReaderIntegrated !== 'undefined') {
    console.log("✅ Content script is loaded:", window.waveReaderIntegrated);
    console.log("✅ Content script state:", window.waveReaderIntegrated.getCurrentState());
    console.log("✅ Content script session ID:", window.waveReaderIntegrated.getSessionId());
    console.log("✅ Content script message history:", window.waveReaderIntegrated.getMessageHistory());
} else {
    console.log("❌ Content script is NOT loaded - window.waveReaderIntegrated is undefined");
}

// Check if there are any console errors
console.log("🔍 Debug: Checking for console errors...");

// Check if the content script console logs are visible
console.log("🔍 Debug: Looking for content script console logs...");

// Check if content script is in the DOM
const contentScriptElement = document.querySelector('script[src*="content.js"]');
if (contentScriptElement) {
    console.log("✅ Content script element found in DOM:", contentScriptElement);
} else {
    console.log("❌ Content script element NOT found in DOM");
}

// Check if there are any script tags
const scriptTags = document.querySelectorAll('script');
console.log("🔍 Debug: Found script tags:", scriptTags.length);
scriptTags.forEach((script, index) => {
    if (script.src && script.src.includes('content.js')) {
        console.log(`✅ Content script found at index ${index}:`, script.src);
    }
});

// Check if there are any errors in the console
console.log("🔍 Debug: Checking for any JavaScript errors...");

// Check if the page is ready
console.log("🔍 Debug: Document ready state:", document.readyState);
console.log("🔍 Debug: Window location:", window.location.href);
console.log("🔍 Debug: User agent:", navigator.userAgent);

// Check if Chrome extension APIs are available
if (typeof chrome !== 'undefined' && chrome.runtime) {
    console.log("✅ Chrome extension APIs are available");
    console.log("✅ Chrome runtime ID:", chrome.runtime.id);
} else {
    console.log("❌ Chrome extension APIs are NOT available");
}

console.log("🔍 Debug: Content script injection check complete");


