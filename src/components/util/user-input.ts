import {Observable, Subscriber} from 'rxjs';

export type WindowKeyDownKeyObserverDefinition = {
    (
        listenerReturn: { (eventListener: { (event: KeyboardEvent): void }): void },
        preventDefault: boolean
    ): Observable<string>
};

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
        const join = (shortcut: string[]) => shortcut.join(', ').toLowerCase()
        const joined = join(shortcut)
        let complete = false;
        keysObservable.subscribe((key: string) => {
            if (stop()) {
                if (!complete) {
                    complete = true;
                    subscriber.complete()
                }
                return;
            }

            // typed.unshift(key);
            // todo: review: should shift, meta, and control reduce to 1 and stick until keyup?
            //        so you can hold shift, and toggle with 'w'
            typed = [key].concat(typed).slice(0, shortcut.length)

            if (join(typed) === joined) {
                subscriber.next(true);
            } else {
                subscriber.next(false);
            }
        })
    });
}
