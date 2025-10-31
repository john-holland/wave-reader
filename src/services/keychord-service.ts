import { Observable, Subscription } from 'rxjs';
import { KeyChord, WindowKeyDownKey } from '../components/util/user-input';
import { FollowKeyChordObserver } from '../components/util/user-input';

/**
 * KeyChord Service
 * 
 * Manages keyboard shortcut detection using KeyChord pattern
 * Listens for keyboard events and triggers toggle when shortcut is pressed
 * Can be updated with new shortcuts from settings
 */
export class KeyChordService {
    private subscription: Subscription | null = null;
    private listener: ((listener: (event: KeyboardEvent) => void) => void) | null = null;
    private currentKeyChord: KeyChord = [];
    private isActive: boolean = false;
    private onToggle: (() => void) | null = null;

    constructor(
        initialKeyChord: KeyChord = ['Ctrl', 'Shift', 'W'],
        onToggleCallback?: () => void
    ) {
        this.currentKeyChord = initialKeyChord;
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
        
        // Create keyboard observer
        const keysObservable = WindowKeyDownKey(
            (listener: (event: KeyboardEvent) => void) => {
                this.listener = listener;
            },
            true // preventDefault
        );

        // Store keys subscription for cleanup
        keysSubscription = keysObservable.subscribe({
            error: (error: any) => {
                console.error('⌨️ KeyChordService: Error in keys observable:', error);
            }
        });

        // Create key chord follower
        const keyChordObserver = FollowKeyChordObserver(
            this.currentKeyChord,
            keysObservable,
            () => !this.isActive // stop condition
        );

        // Subscribe to key chord matches
        this.subscription = keyChordObserver.subscribe({
            next: (matched: boolean) => {
                if (matched) {
                    console.log('⌨️ KeyChordService: Shortcut matched!', this.currentKeyChord.join(' + '));
                    this.handleToggle();
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
        
        this.currentKeyChord = newKeyChord;
        
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

