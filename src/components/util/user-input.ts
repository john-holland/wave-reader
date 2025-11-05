import {Observable, Subscriber} from 'rxjs';

export type WindowKeyDownKeyObserverDefinition = {
    (
        listenerReturn: { (eventListener: { (event: KeyboardEvent): void }): void },
        preventDefault: boolean
    ): Observable<string>
};

/**
 * Check if the event target is within an input-selector field or is an editable element
 * @param event - The keyboard event to check
 * @returns true if target is an input-selector field or editable element
 */
function isInputSelectorField(event: KeyboardEvent): boolean {
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
 * a keydown event listener returning an [Observable<string>] of [event.key]
 * @param listenerReturn probably YAGNI but a function to return the closure scoped event listener \
 *    so you can extract the listener from the listenerReturn lambda and call [window.removeEventListener()] \
 *    maybe just return a [Pair<>] idk
 * @param preventDefault calls event.preventDefault() optionally a key is detected, useful for scanning, bad for shortcuts
 */
export const WindowKeyDownKey: WindowKeyDownKeyObserverDefinition = (listenerReturn: {(eventListener: {(event: KeyboardEvent): void}): void},
                                                                     preventDefault = true): Observable<string> => {
    return new Observable((subscriber: Subscriber<string>) => {
        const listener = (event: KeyboardEvent) => {
            if (event.defaultPrevented) {
                return; // Should do nothing if the default action has been cancelled
            }

            if (event.key) {
                // Skip preventDefault if target is an input-selector field
                // This allows normal typing in input fields
                if (isInputSelectorField(event)) {
                    // Emit the key but don't prevent default - allow normal typing
                    subscriber.next(event.key);
                    return;
                }

                // Handle the event with KeyboardEvent.key
                subscriber.next(event.key);
                if (preventDefault) event.preventDefault();
            }
        };
        listenerReturn(listener);
        window.addEventListener(
            "keydown",
            listener,
            true,
        );
    });
}


/**
 * Normalize a key name to a standard format
 * @param key - The key name from event.key
 * @returns Normalized key name or null if invalid
 */
export function normalizeKey(key: string): string | null {
    if (!key) return null;
    
    // Filter out invalid keys
    const invalidKeys = ['Dead', 'Unidentified'];
    if (invalidKeys.includes(key)) {
        return null;
    }
    
    // Normalize modifier keys
    const normalized = key.trim();
    
    // Map common variations to standard names
    const keyMap: { [key: string]: string } = {
        'Control': 'Ctrl',
        'Meta': 'Meta', // Keep Meta as is, but we'll filter it if it appears alone
        'Shift': 'Shift',
        'Alt': 'Alt',
        'AltGraph': 'Alt',
    };
    
    // Check if it's a known modifier key mapping
    const mapped = keyMap[normalized];
    if (mapped) {
        return mapped;
    }
    
    // Return the key as-is (capitalized first letter for consistency)
    return normalized.length > 0 
        ? normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase()
        : normalized;
}

/**
 * Filter and normalize a keychord, removing invalid keys
 * @param keyChord - The keychord to filter and normalize
 * @returns Filtered and normalized keychord
 */
export function filterAndNormalizeKeyChord(keyChord: KeyChord): KeyChord {
    return keyChord
        .map(key => normalizeKey(key))
        .filter((key): key is string => key !== null && key !== undefined);
}

/**
 * Sort and normalize a keychord for comparison
 * Modifier keys come first, then regular keys, both sorted alphabetically
 * @param keyChord - The keychord to sort
 * @returns Sorted and normalized keychord
 */
export function sortKeyChord(keyChord: KeyChord): KeyChord {
    const normalized = filterAndNormalizeKeyChord(keyChord);
    
    // Define modifier key order (alphabetical within modifiers)
    const modifierKeys = ['Alt', 'Ctrl', 'Meta', 'Shift'];
    const isModifier = (key: string) => modifierKeys.includes(key);
    
    // Separate modifiers and regular keys
    const modifiers = normalized.filter(isModifier).sort();
    const regularKeys = normalized.filter(key => !isModifier(key)).sort();
    
    // Return modifiers first, then regular keys
    return [...modifiers, ...regularKeys];
}

/**
 * Compare two keychords for equality (order-independent, normalized)
 * @param chord1 - First keychord
 * @param chord2 - Second keychord
 * @returns True if keychords match
 */
export function compareKeyChords(chord1: KeyChord, chord2: KeyChord): boolean {
    const sorted1 = sortKeyChord(chord1);
    const sorted2 = sortKeyChord(chord2);
    
    if (sorted1.length !== sorted2.length) {
        return false;
    }
    
    return sorted1.every((key, index) => key.toLowerCase() === sorted2[index].toLowerCase());
}

/**
 * a 1-4ish length array of keys
 */
export type KeyChord = string[]
/**
 * Observes keyboard key events and returns an Observable that calls next(true) if the shortcut is matched
 * Calls, next(false) if not
 * @param shortcut
 * @param keysObservable
 * @param stop
 * @constructor
 */
export const FollowKeyChordObserver = (shortcut: KeyChord,
                                       keysObservable: Observable<string>,
                                       stop: {(): boolean}): Observable<boolean> => {
    return new Observable((subscriber: Subscriber<boolean>) => {
        let typed: KeyChord = []
        let complete = false;
        
        // Normalize and sort the target shortcut once
        const normalizedShortcut = sortKeyChord(shortcut);
        
        keysObservable.subscribe((key: string) => {
            if (stop()) {
                if (!complete) {
                    complete = true;
                    subscriber.complete()
                }
                return;
            }

            // Normalize and filter the incoming key
            const normalizedKey = normalizeKey(key);
            
            // Skip invalid keys (like "Dead", "Unidentified")
            if (!normalizedKey) {
                subscriber.next(false);
                return;
            }

            // typed.unshift(key);
            // todo: review: should shift, meta, and control reduce to 1 and stick until keyup?
            //        so you can hold shift, and toggle with 'w'
            typed = [normalizedKey].concat(typed).slice(0, shortcut.length)

            // Compare using normalized, sorted keychords
            const matches = compareKeyChords(typed, normalizedShortcut);
            
            if (matches) {
                subscriber.next(true);
            } else {
                subscriber.next(false);
            }
        })
    });
}
