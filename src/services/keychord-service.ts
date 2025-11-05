import { Observable, Subscription } from 'rxjs';
import { 
    KeyChord, 
    WindowKeyDownKey,
    FollowKeyChordObserver,
    normalizeKey,
    sortKeyChord,
    compareKeyChords
} from '../components/util/user-input';

/**
 * KeyChord Service
 * 
 * Manages keyboard shortcut detection using KeyChord pattern
 * Listens for keyboard events and triggers toggle when shortcut is pressed
 * Can be updated with new shortcuts from settings
 */
export class KeyChordService {
    private subscription: Subscription | null = null;
    private listener: ((event: KeyboardEvent) => void) | null = null;
    private currentKeyChord: KeyChord = [];
    private isActive: boolean = false;
    private onToggle: (() => void) | null = null;

    constructor(
        initialKeyChord: KeyChord = ['Ctrl', 'Shift', 'W'],
        onToggleCallback?: () => void
    ) {
        // Normalize the keychord when setting it
        this.currentKeyChord = sortKeyChord(initialKeyChord);
        this.onToggle = onToggleCallback || null;
    }

    /**
     * Start listening for keyboard shortcuts
     */
    start(): void {
        if (this.isActive) {
            console.warn('⌨️ KeyChordService: Already active, stopping first');
            this.stop();
        }

        console.log('⌨️ KeyChordService: Starting keyboard shortcut listener for:', this.currentKeyChord.join(' + '));
        
        this.isActive = true;
        let keysSubscription: Subscription | null = null;
        let typedKeys: KeyChord = [];
        
        // Create keyboard observer
        // WindowKeyDownKey returns an Observable and calls listenerReturn with the listener
        // WindowKeyDownKey already adds the listener to window, so we just store it for cleanup
        // Use preventDefault = false here, we'll handle it manually when keychord matches
        let currentEvent: KeyboardEvent | null = null;
        const keysObservable = WindowKeyDownKey(
            (listenerFn: (event: KeyboardEvent) => void) => {
                // Store the listener so we can remove it later
                // Wrap it to capture events for synchronous keychord checking
                this.listener = (event: KeyboardEvent) => {
                    // WindowKeyDownKey already handles input-selector fields (emits key but doesn't prevent default)
                    // We capture the event here to check keychord completion synchronously
                    currentEvent = event;
                    listenerFn(event);
                };
            },
            false // Don't prevent default here - we handle it manually when keychord matches
        );

        // Store keys subscription for cleanup - track keys and check keychord completion
        keysSubscription = keysObservable.subscribe({
            next: (key: string) => {
                // Normalize and filter the incoming key
                const normalizedKey = normalizeKey(key);
                
                // Skip invalid keys (like "Dead", "Unidentified")
                if (!normalizedKey) {
                    return;
                }
                
                // Filter out Meta if it's not part of the target keychord
                // (Some browsers emit Meta unexpectedly when only modifier keys are pressed)
                if (normalizedKey === 'Meta' && !this.currentKeyChord.includes('Meta')) {
                    return;
                }
                
                // Track typed keys for keychord matching (only valid, normalized keys)
                typedKeys = [normalizedKey].concat(typedKeys).slice(0, this.currentKeyChord.length);
                
                // Check if keychord is completed using normalized, sorted comparison
                const isCompleted = compareKeyChords(typedKeys, this.currentKeyChord);
                
                // Only prevent default if keychord is completed AND not in input-selector field
                if (isCompleted && currentEvent && !this.isInputSelectorField(currentEvent)) {
                    // Prevent default synchronously when keychord matches
                    currentEvent.preventDefault();
                    console.log('⌨️ KeyChordService: Shortcut matched!', this.currentKeyChord.join(' + '));
                    this.handleToggle();
                    typedKeys = []; // Reset after match
                }
                // If keychord not completed OR in input-selector field, don't prevent default
                // This allows normal typing
            },
            error: (error: any) => {
                console.error('⌨️ KeyChordService: Error in keys observable:', error);
            }
        });

        // Create key chord follower for backup/secondary matching
        const keyChordObserver = FollowKeyChordObserver(
            this.currentKeyChord,
            keysObservable,
            () => !this.isActive // stop condition
        );

        // Subscribe to key chord matches (secondary check - primary is handled above)
        this.subscription = keyChordObserver.subscribe({
            next: (matched: boolean) => {
                // Primary matching and preventDefault is handled in the keysSubscription above
                // This is a fallback/secondary check
                if (matched && currentEvent && !this.isInputSelectorField(currentEvent)) {
                    // Already handled above, but ensure toggle is called
                    typedKeys = [];
                }
            },
            error: (error: any) => {
                console.error('⌨️ KeyChordService: Error in key chord observer:', error);
            },
            complete: () => {
                console.log('⌨️ KeyChordService: Key chord observer completed');
                // Clean up keys subscription when observer completes
                if (keysSubscription) {
                    keysSubscription.unsubscribe();
                }
            }
        });
    }

    /**
     * Check if the event target is within an input-selector field or is an editable element
     * @param event - The keyboard event to check
     * @returns true if target is an input-selector field or editable element
     */
    private isInputSelectorField(event: KeyboardEvent): boolean {
        const target = event.target as HTMLElement;
        if (!target) return false;

        // Check if target is an input or textarea element
        const tagName = target.tagName?.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea') {
            return true;
        }

        // Check if target has contenteditable attribute
        if (target.hasAttribute?.('contenteditable') && target.getAttribute('contenteditable') !== 'false') {
            return true;
        }

        // Check for input-selector specific IDs
        if (target.id === 'selectorInput' || target.id === 'selector-text-input') {
            return true;
        }

        // Check for input-selector specific classes
        if (target.classList?.contains('selector-text-input')) {
            return true;
        }

        // Check if target is within an element with selector-input classes
        let current: HTMLElement | null = target;
        while (current) {
            if (current.classList?.contains('selector-input-editing') || 
                current.classList?.contains('selector-input-section')) {
                return true;
            }
            current = current.parentElement;
        }

        return false;
    }

    /**
     * Stop listening for keyboard shortcuts
     */
    stop(): void {
        if (!this.isActive) {
            return;
        }

        console.log('⌨️ KeyChordService: Stopping keyboard shortcut listener');
        
        this.isActive = false;

        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }

        if (this.listener) {
            window.removeEventListener('keydown', this.listener, true);
            this.listener = null;
        }
    }

    /**
     * Update the keyboard shortcut and restart listener
     */
    updateKeyChord(newKeyChord: KeyChord): void {
        console.log('⌨️ KeyChordService: Updating keyboard shortcut from', 
            this.currentKeyChord.join(' + '), 'to', newKeyChord.join(' + '));
        
        const wasActive = this.isActive;
        
        if (wasActive) {
            this.stop();
        }
        
        // Normalize the keychord when updating it
        this.currentKeyChord = sortKeyChord(newKeyChord);
        
        if (wasActive) {
            this.start();
        }
    }

    /**
     * Handle toggle action when shortcut is pressed
     */
    private handleToggle(): void {
        console.log('⌨️ KeyChordService: Toggle triggered by keyboard shortcut');
        
        if (this.onToggle) {
            this.onToggle();
        } else {
            // Default behavior: send message to background script
            this.sendToggleMessage();
        }
    }

    /**
     * Send toggle message to background script
     */
    private async sendToggleMessage(): Promise<void> {
        if (typeof chrome === 'undefined' || !chrome.runtime) {
            console.warn('⌨️ KeyChordService: Chrome runtime not available');
            return;
        }

        try {
            const response = await chrome.runtime.sendMessage({
                name: 'toggle',
                from: 'content-script',
                source: 'keychord-service',
                timestamp: Date.now()
            });

            console.log('⌨️ KeyChordService: Toggle message sent, response:', response);
        } catch (error: any) {
            console.error('⌨️ KeyChordService: Failed to send toggle message:', error);
        }
    }

    /**
     * Set the toggle callback
     */
    setOnToggle(callback: () => void): void {
        this.onToggle = callback;
    }

    /**
     * Get current key chord
     */
    getCurrentKeyChord(): KeyChord {
        return [...this.currentKeyChord];
    }

    /**
     * Check if service is active
     */
    getIsActive(): boolean {
        return this.isActive;
    }

    /**
     * Load key chord from Chrome storage
     */
    static async loadKeyChordFromStorage(): Promise<KeyChord> {
        const defaultKeyChord: KeyChord = ['Ctrl', 'Shift', 'W'];
        
        if (typeof chrome === 'undefined' || !chrome.storage) {
            return defaultKeyChord;
        }

        try {
            const result = await chrome.storage.local.get(['waveReaderSettings']);
            
            if (result.waveReaderSettings?.toggleKeys?.keyChord) {
                const keyChord = result.waveReaderSettings.toggleKeys.keyChord;
                console.log('⌨️ KeyChordService: Loaded key chord from storage:', keyChord);
                return keyChord;
            }
            
            // Also check sync storage
            const syncResult = await chrome.storage.sync.get(['waveReaderSettings']);
            if (syncResult.waveReaderSettings?.toggleKeys?.keyChord) {
                const keyChord = syncResult.waveReaderSettings.toggleKeys.keyChord;
                console.log('⌨️ KeyChordService: Loaded key chord from sync storage:', keyChord);
                return keyChord;
            }
        } catch (error) {
            console.warn('⌨️ KeyChordService: Failed to load key chord from storage:', error);
        }

        return defaultKeyChord;
    }

    /**
     * Set up listener for settings changes in Chrome storage
     */
    static setupSettingsListener(onKeyChordChange: (newKeyChord: KeyChord) => void): (() => void) | null {
        if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.onChanged) {
            return null;
        }

        const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
            if (areaName === 'local' || areaName === 'sync') {
                if (changes.waveReaderSettings) {
                    const newValue = changes.waveReaderSettings.newValue;
                    if (newValue?.toggleKeys?.keyChord) {
                        console.log('⌨️ KeyChordService: Settings changed, updating key chord:', newValue.toggleKeys.keyChord);
                        onKeyChordChange(newValue.toggleKeys.keyChord);
                    }
                }
            }
        };

        chrome.storage.onChanged.addListener(listener);

        // Return cleanup function
        return () => {
            chrome.storage.onChanged.removeListener(listener);
        };
    }

    /**
     * Cleanup resources
     */
    cleanup(): void {
        this.stop();
        this.onToggle = null;
    }
}

