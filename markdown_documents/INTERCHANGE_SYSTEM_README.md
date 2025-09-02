# 🌊 Wave Reader Interchange System

## Overview

The Wave Reader Interchange System provides a robust communication framework between the Chrome extension's popup (app.tsx), background script, and content scripts. This system enables seamless coordination of wave reader operations across different extension contexts while maintaining state consistency and providing fallback mechanisms.

## 🏗️ Architecture

### Components

1. **Popup (app.tsx)** - User interface in the extension popup window
2. **Background Script** - Central coordinator and state manager
3. **Content Scripts** - Page-level wave reader functionality
4. **Message Handler** - Chrome extension communication abstraction

### Communication Flow

```
Popup (app.tsx) ←→ Background Script ←→ Content Scripts
     ↕                ↕                    ↕
Chrome Storage    State Machine      DOM Animation
```

## 🔧 Key Components

### 1. ChromeExtensionMessageHandler

**Location**: `src/component-middleware/wave-reader/robotcopy-pact-config.js`

**Purpose**: Abstracts Chrome extension messaging with error handling and response management.

**Features**:
- Automatic message routing based on target
- Error handling and fallback mechanisms
- Message tracing with unique IDs
- Support for both popup and content script contexts

**Usage**:
```javascript
const messageHandler = new ChromeExtensionMessageHandler();

// Send message to background
const response = await messageHandler.sendMessage('background', {
    type: 'START_WAVE_READER',
    selector: 'p',
    source: 'popup',
    target: 'background',
    traceId: Date.now().toString()
});

// Register message handlers
messageHandler.registerMessageHandler('WAVE_READER_STARTED', (data) => {
    console.log('Wave reader started:', data);
});
```

### 2. BackgroundInterchange

**Location**: `src/background-interchange.js`

**Purpose**: Central coordinator that manages wave reader state and coordinates operations across tabs.

**Features**:
- XState-based state machine for global coordination
- Tab state tracking and management
- Chrome storage integration
- Message routing to content scripts
- Error logging and reporting

**States**:
- `idle` - Initial state
- `ready` - System ready for operations
- `coordinating` - Coordinating wave reader start
- `waving` - Wave reader active
- `paused` - Wave reader paused
- `stopping` - Stopping wave reader
- `error` - Error state

**Usage**:
```javascript
// Initialize background interchange
const backgroundInterchange = new BackgroundInterchange();

// Get current state
const state = backgroundInterchange.getState();

// Get active tabs
const activeTabs = backgroundInterchange.getActiveTabs();

// Get settings
const settings = backgroundInterchange.getSettings();
```

### 3. ContentInterchange

**Location**: `src/content-interchange.js`

**Purpose**: Handles wave reader functionality within web pages and communicates with the background script.

**Features**:
- DOM-based wave animation
- Dynamic content detection
- Settings synchronization
- Error handling and reporting
- Cleanup on page unload

**Wave Animation**:
- CSS-based pulse animation
- Configurable speed, color, and opacity
- Automatic element cycling
- DOM mutation observation

**Usage**:
```javascript
// Content script automatically initializes
// Access via window.waveReaderContent

// Check status
const status = await window.waveReaderContent.getStatus();

// Manual cleanup
window.waveReaderContent.cleanup();
```

## 📡 Message Types

### Core Operations
- `START_WAVE_READER` - Start wave reading
- `STOP_WAVE_READER` - Stop wave reading
- `PAUSE_WAVE_READER` - Pause wave reading
- `RESUME_WAVE_READER` - Resume wave reading

### Configuration
- `UPDATE_SETTINGS` - Update wave reader settings
- `SETTINGS_UPDATED` - Settings have been updated
- `SETTINGS_RESET` - Reset settings to defaults

### Selector Management
- `SELECTOR_UPDATED` - Update current selector
- `SELECTOR_ADDED` - Add new selector to saved list
- `SELECTOR_REMOVED` - Remove selector from saved list
- `SELECTION_CONFIRMED` - Confirm element selection

### Status and Reporting
- `WAVE_READER_STATUS` - Get current status
- `ERROR_REPORTED` - Report error
- `CONTENT_SCRIPT_READY` - Content script ready notification

## 🎯 Usage Examples

### Starting Wave Reader from Popup

```javascript
// In app.tsx
const onGo = async () => {
    try {
        if (isExtension) {
            const response = await sendExtensionMessage({
                type: 'START_WAVE_READER',
                selector: selector,
                source: 'popup',
                target: 'background',
                traceId: Date.now().toString()
            });
            
            if (response && response.success) {
                setGoing(true);
                console.log('Wave reader started via extension');
            }
        } else {
            // Fallback for non-extension context
            setGoing(true);
        }
    } catch (error) {
        console.error('Failed to start wave reader:', error);
    }
};
```

### Handling Messages in Background

```javascript
// In background-interchange.js
async handleStartWaveReader(message, sender, sendResponse) {
    const { selector, options, traceId } = message;
    
    try {
        // Update global state
        this.service.send({ type: 'START_WAVE_READER' });
        
        // Get active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Send message to content script
        await chrome.tabs.sendMessage(tab.id, {
            type: 'START_WAVE_READER',
            selector: selector,
            options: this.service.context.settings,
            source: 'background',
            target: 'content',
            traceId: traceId
        });
        
        // Update tracking
        this.activeTabs.set(tab.id, {
            selector: selector,
            state: 'waving',
            startTime: Date.now()
        });
        
        sendResponse({ success: true, message: 'Wave reader started' });
        
    } catch (error) {
        console.error('Failed to start wave reader:', error);
        sendResponse({ success: false, error: error.message });
    }
}
```

### Content Script Wave Animation

```javascript
// In content-interchange.js
startWaveAnimation(selector) {
    try {
        // Stop any existing animation
        this.stopWaveAnimation();
        
        // Get elements to animate
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            throw new Error('No elements found for animation');
        }
        
        // Create and start wave animation
        this.waveAnimation = this.createWaveAnimation(elements);
        this.waveAnimation.start();
        
    } catch (error) {
        console.error('Failed to start wave animation:', error);
        throw error;
    }
}
```

## 🔄 State Management

### Chrome Storage Integration

The system automatically saves and loads:
- Wave reader settings
- Saved selectors
- Current selector
- User preferences

### State Synchronization

- Background script maintains global state
- Content scripts sync with background on initialization
- Popup reflects current state from background
- Settings changes propagate to all contexts

## 🛡️ Error Handling

### Graceful Degradation

- Fallback to localStorage when Chrome storage unavailable
- Non-extension context support for development
- Automatic retry mechanisms
- Comprehensive error logging

### Error Recovery

- Automatic cleanup on page unload
- State restoration after errors
- User notification of issues
- Detailed error reporting to background

## 🧪 Testing

### Test File

Run the interchange system tests:

```bash
node test-interchange.js
```

### Mock Chrome APIs

The test system includes mock Chrome extension APIs for testing outside of extension context.

## 🚀 Integration

### 1. Replace App Component

```javascript
// In your main entry point
import AppTomes from './src/app-tomes';

// Use AppTomes instead of the original App component
```

### 2. Update Manifest

Ensure your manifest.json includes:

```json
{
  "background": {
    "service_worker": "src/background-interchange.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["src/content-interchange.js"]
    }
  ],
  "permissions": [
    "storage",
    "tabs",
    "activeTab"
  ]
}
```

### 3. Build Process

The interchange system works with your existing build process and can be bundled with webpack or other bundlers.

## 🔮 Future Enhancements

### Planned Features

1. **Advanced Animation** - More sophisticated wave patterns
2. **Performance Monitoring** - Track animation performance
3. **Accessibility** - Screen reader support
4. **Custom Themes** - User-defined animation styles
5. **Analytics** - Usage statistics and insights

### Extension Points

The system is designed to be easily extensible:
- New message types can be added
- Additional state machine states
- Custom animation engines
- Plugin system for third-party integrations

## 📚 API Reference

### ChromeExtensionMessageHandler

| Method | Description |
|--------|-------------|
| `sendMessage(target, message)` | Send message to target |
| `registerMessageHandler(type, handler)` | Register message handler |
| `handleIncomingMessage(message, sender, sendResponse)` | Handle incoming messages |

### BackgroundInterchange

| Method | Description |
|--------|-------------|
| `getState()` | Get current state machine state |
| `getActiveTabs()` | Get active tabs information |
| `getSettings()` | Get current settings |
| `getActiveSelectors()` | Get active selectors |

### ContentInterchange

| Method | Description |
|--------|-------------|
| `startWaveAnimation(selector)` | Start wave animation |
| `stopWaveAnimation()` | Stop wave animation |
| `pauseWaveAnimation()` | Pause wave animation |
| `resumeWaveAnimation()` | Resume wave animation |
| `getStatus()` | Get current status |
| `cleanup()` | Clean up resources |

## 🎉 Benefits

1. **Separation of Concerns** - Clear boundaries between components
2. **State Consistency** - Centralized state management
3. **Error Resilience** - Robust error handling and recovery
4. **Extensibility** - Easy to add new features
5. **Testing** - Comprehensive testing support
6. **Performance** - Efficient message routing and state updates
7. **User Experience** - Seamless operation across extension contexts

This interchange system provides a solid foundation for the Wave Reader extension, enabling reliable communication and state management while maintaining excellent user experience and developer productivity.
