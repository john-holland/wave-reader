import { KeyChordService } from './keychord-service';

/**
 * KeyChord Content Integration
 * 
 * Sets up keyboard shortcuts for content scripts
 * Integrates with content system tomes to handle toggle actions
 */

let keyChordService: KeyChordService | null = null;
let settingsCleanup: (() => void) | null = null;

/**
 * Initialize keyboard shortcut service for content scripts
 * 
 * @param onToggle - Optional callback when toggle shortcut is pressed
 *                   If not provided, sends message to background script
 */
export async function initializeKeyChordService(
    onToggle?: () => void
): Promise<void> {
    console.log('⌨️ KeyChordContentIntegration: Initializing keyboard shortcut service');
    
    // Stop existing service if any
    if (keyChordService) {
        cleanupKeyChordService();
    }

    // Load key chord from storage
    const keyChord = await KeyChordService.loadKeyChordFromStorage();
    
    // Create service
    keyChordService = new KeyChordService(keyChord, onToggle || (() => {
        // Default: send toggle message to background
        sendToggleToBackground();
    }));

    // Start the service
    keyChordService.start();

    // Set up settings change listener
    settingsCleanup = KeyChordService.setupSettingsListener((newKeyChord: KeyChord) => {
        console.log('⌨️ KeyChordContentIntegration: Settings changed, updating keyboard shortcut');
        if (keyChordService) {
            keyChordService.updateKeyChord(newKeyChord);
        }
    });

    console.log('⌨️ KeyChordContentIntegration: Keyboard shortcut service initialized with:', keyChord.join(' + '));
}

/**
 * Send toggle message to background script
 */
async function sendToggleToBackground(): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.runtime) {
        console.warn('⌨️ KeyChordContentIntegration: Chrome runtime not available');
        return;
    }

    try {
        const response = await chrome.runtime.sendMessage({
            name: 'toggle',
            from: 'content-script',
            source: 'keychord-service',
            timestamp: Date.now()
        });

        console.log('⌨️ KeyChordContentIntegration: Toggle message sent to background, response:', response);
    } catch (error: any) {
        console.error('⌨️ KeyChordContentIntegration: Failed to send toggle message:', error);
    }
}

/**
 * Update the toggle callback
 */
export function setToggleCallback(onToggle: () => void): void {
    if (keyChordService) {
        keyChordService.setOnToggle(onToggle);
    }
}

/**
 * Cleanup keyboard shortcut service
 */
export function cleanupKeyChordService(): void {
    console.log('⌨️ KeyChordContentIntegration: Cleaning up keyboard shortcut service');
    
    if (keyChordService) {
        keyChordService.cleanup();
        keyChordService = null;
    }

    if (settingsCleanup) {
        settingsCleanup();
        settingsCleanup = null;
    }
}

/**
 * Get current key chord
 */
export function getCurrentKeyChord(): string[] {
    if (keyChordService) {
        return keyChordService.getCurrentKeyChord();
    }
    return ['Ctrl', 'Shift', 'W'];
}

/**
 * Check if service is active
 */
export function isKeyChordServiceActive(): boolean {
    return keyChordService?.getIsActive() || false;
}

