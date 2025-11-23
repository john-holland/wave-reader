import { Observable, Subscription } from 'rxjs';
import { 
    KeyChord, 
    WindowKeyDownKey,
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
    private debounceId: any = undefined;
    private activeKeys: Set<string> = new Set();
    private keyupListener: ((event: KeyboardEvent) => void) | null = null;
    private blurListener: (() => void) | null = null;
    private static readonly MODIFIER_KEYS = new Set(['Alt', 'Ctrl', 'Shift', 'Meta']);

    constructor(
        initialKeyChord: KeyChord = ['Shift', 'F'],
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
        this.resetActiveKeys();
        let keysSubscription: Subscription | null = null;
        
        // Create keyboard observer
        // WindowKeyDownKey attaches its own listener, but we need to intercept events first
        // So we'll attach our listener directly and manually call WindowKeyDownKey's listener when needed
        let internalListener: ((event: KeyboardEvent) => void) | null = null;
        
        // Create our wrapper listener that handles keychord matching synchronously
        // This will be attached directly to window
        this.listener = (event: KeyboardEvent) => {
            // Skip if event is already prevented
            if (event.defaultPrevented) {
                if (internalListener) internalListener(event);
                return;
            }
            
            // Skip if in input-selector field
            if (this.isInputSelectorField(event)) {
                if (internalListener) internalListener(event);
                return;
            }
            
            // Normalize and filter the incoming key
            const normalizedKey = normalizeKey(event.key);
            
            // Skip invalid keys (like "Dead", "Unidentified")
            if (!normalizedKey) {
                if (internalListener) internalListener(event);
                return;
            }
            
            // Filter out Meta if it's not part of the target keychord
            // (Some browsers emit Meta unexpectedly when only modifier keys are pressed)
            if (normalizedKey === 'Meta' && !this.currentKeyChord.includes('Meta')) {
                if (internalListener) internalListener(event);
                return;
            }
            
            if (event.repeat && this.activeKeys.has(normalizedKey)) {
                if (internalListener) internalListener(event);
                return;
            }

            this.activeKeys.add(normalizedKey);
            this.scheduleActiveKeysReset();

            const isCompleted = this.isActiveKeyChordMatch();
            
            // Handle keychord match synchronously on keydown
            if (isCompleted) {
                // Prevent default synchronously when keychord matches
                event.preventDefault();
                event.stopPropagation();
                console.log('⌨️ KeyChordService: Shortcut matched!', this.currentKeyChord.join(' + '));
                this.handleToggle();
                this.resetActiveKeys();
                // Don't call internalListener for matched shortcuts to avoid emitting the key
                return;
            }
            
            // If keychord not completed, emit the key normally through the internal listener
            if (internalListener) internalListener(event);
        };
        
        // Attach our listener directly to window (capture phase, runs first)
        window.addEventListener('keydown', this.listener, true);

        this.keyupListener = (event: KeyboardEvent) => {
            const normalizedKey = normalizeKey(event.key);
            if (!normalizedKey) {
                return;
            }

            if (this.activeKeys.has(normalizedKey)) {
                this.activeKeys.delete(normalizedKey);
            }
        };

        window.addEventListener('keyup', this.keyupListener, true);

        this.blurListener = () => {
            this.resetActiveKeys();
        };

        window.addEventListener('blur', this.blurListener, true);
        
        // Create the observable - it will create and attach its own listener
        // Our listener runs first (capture phase), so we intercept events before WindowKeyDownKey's listener
        const keysObservable = WindowKeyDownKey(
            (listenerFn: (event: KeyboardEvent) => void) => {
                // Store the internal listener that WindowKeyDownKey creates
                // We'll call it from our listener when the keychord doesn't match
                internalListener = listenerFn;
            },
            false // Don't prevent default here - we handle it manually when keychord matches
        );

        // Store keys subscription for cleanup - we track keys in the listener above
        // The observable subscription is needed to keep the listener active
        keysSubscription = keysObservable.subscribe({
            next: (key: string) => {
                // Keys are processed synchronously in the listener above
                // This subscription keeps the observable active
            },
            error: (error: any) => {
                console.error('⌨️ KeyChordService: Error in keys observable:', error);
            },
            complete: () => {
                console.log('⌨️ KeyChordService: Keys observable completed');
            }
        });

        // Store the keys subscription as the main subscription for cleanup
        this.subscription = keysSubscription;
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

    private scheduleActiveKeysReset(): void {
        if (this.debounceId) {
            clearTimeout(this.debounceId);
        }

        this.debounceId = setTimeout(() => {
            this.resetActiveKeys();
        }, 5000);
    }

    private resetActiveKeys(): void {
        this.activeKeys.clear();

        if (this.debounceId) {
            clearTimeout(this.debounceId);
            this.debounceId = undefined;
        }
    }

    private isActiveKeyChordMatch(): boolean {
        if (this.currentKeyChord.length === 0) {
            return false;
        }

        const hasNonModifier = this.currentKeyChord.some(key => !KeyChordService.MODIFIER_KEYS.has(key));

        if (!hasNonModifier) {
            return false;
        }

        if (this.activeKeys.size !== this.currentKeyChord.length) {
            return false;
        }

        return compareKeyChords(Array.from(this.activeKeys), this.currentKeyChord);
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

        if (this.keyupListener) {
            window.removeEventListener('keyup', this.keyupListener, true);
            this.keyupListener = null;
        }

        if (this.blurListener) {
            window.removeEventListener('blur', this.blurListener, true);
            this.blurListener = null;
        }

        this.resetActiveKeys();
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
        this.resetActiveKeys();

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

