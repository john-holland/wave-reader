import { KeyChordService } from './keychord-service';
import { KeyChord } from '../components/util/user-input';

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
            // Store current callback before update
            const currentCallback = keyChordService.getOnToggle() || sendToggleToBackground;
            keyChordService.updateKeyChord(newKeyChord);
            // Re-establish callback if needed (updateKeyChord should preserve it, but ensure it's set)
            if (currentCallback) {
                keyChordService.setOnToggle(currentCallback);
            }
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
export async function setToggleCallback(onToggle: () => void): Promise<void> {
    console.log('⌨️ KeyChordContentIntegration: Setting toggle callback', {
        hasKeyChordService: !!keyChordService,
        hasCallback: !!onToggle,
        callbackType: typeof onToggle
    });
    
    // If service isn't initialized, initialize it now
    if (!keyChordService) {
        console.log('⌨️ KeyChordContentIntegration: Service not initialized, initializing now');
        await initializeKeyChordService(onToggle);
        return;
    }
    
    const wasActive = keyChordService.getIsActive();
    keyChordService.setOnToggle(onToggle);
    console.log('⌨️ KeyChordContentIntegration: Toggle callback set', {
        wasActive,
        isActive: keyChordService.getIsActive(),
        hasCallback: !!keyChordService.getOnToggle()
    });
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
    return ['Shift', 'W'];
}

/**
 * Check if service is active
 */
export function isKeyChordServiceActive(): boolean {
    return keyChordService?.getIsActive() || false;
}

