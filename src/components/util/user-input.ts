import {Observable, Subscriber} from 'rxjs';

/**
 * a keydown event listener returning an [Observable<string>] of [event.key]
 * @param listenerReturn probably YAGNI but a function to return the closure scoped event listener \
 *    so you can extract the listener from the listenerReturn lambda and call [window.removeEventListener()] \
 *    maybe just return a [Pair<>] idk
 */
export const WindowKeyDownKey = (listenerReturn: {(eventListener: {(event: KeyboardEvent): void}): void}): Observable<string> => {
    return new Observable((subscriber: Subscriber<string>) => {
        const listener = (event) => {
            if (event.defaultPrevented) {
                return; // Should do nothing if the default action has been cancelled
            }

            let handled = false;
            if (event.key) {
                // Handle the event with KeyboardEvent.key
                subscriber.next(event.key);
                handled = true;
            }

            if (handled) {
                // Suppress "double action" if event handled
                event.preventDefault();
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
 * a 1-4ish length array of keys
 */
export type KeyChord = string[]
export const FollowKeyChordObserver = (shortcut: KeyChord,
                                       keysObservable: Observable<string>,
                                       stop: {(): boolean}): Observable<boolean> => {
    return new Observable((subscriber: Subscriber<void>) => {
        let typed: KeyChord = []
        const joined = shortcut.join(', ');
        keysObservable.subscribe((key: string) => {
            if (stop()) {

                subscriber.complete()
                return;
            }
            typed.unshift(key);

            if (typed.join(', ') === joined) {
                subscriber.next(true);
                typed = [];
            } else if (typed.length > shortcut.length) {
                typed = [];
            }
        })
    });
}