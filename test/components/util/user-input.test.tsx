import {describe, expect, test} from '@jest/globals'
import {FollowKeyChordObserver} from "../../../src/components/util/user-input";
import {Observable, Subscriber} from "rxjs";

describe('user-inputs', () => {
    test('matches key chords', (done: () => void) => {
        let callCount = 0;
        FollowKeyChordObserver(["w", "Shift"], new Observable<string>((subscriber: Subscriber<string>) => {
            subscriber.next("Shift");
            subscriber.next("w");
        }), () => false).subscribe((chord) => {
            callCount++;
            if (callCount > 1) {
                expect(chord).toBe(true);
                done();
            } else {
                expect(chord).toBe(false);
            }
        });
    });

    test('does not match key chords out of order', (done: () => void) => {
        let chordAssertCount = 0
        FollowKeyChordObserver(["w", "Shift"], new Observable<string>((subscriber: Subscriber<string>) => {
            subscriber.next("w");
            subscriber.next("Shift");
        }), () => false).subscribe((chord) => {
            expect(chord).toBe(false);
            chordAssertCount++;
            if (chordAssertCount >= 2) {
                done();
            }
        });
    });

    test('does not match wrong keys', (done: () => void) => {
        FollowKeyChordObserver(["w", "Shift"], new Observable<string>((subscriber: Subscriber<string>) => {
            subscriber.next("oops");
        }), () => false).subscribe((chord) => {
            expect(chord).toBe(false);
            done();
        });
    });

    test('calls complete if stop returns true', (done: () => void) => {
        FollowKeyChordObserver(["w", "Shift"],
            new Observable<string>((subscriber: Subscriber<string>) => {
                subscriber.next("Shift");
                subscriber.next("world");
                subscriber.next("wem");
                subscriber.next("moot");
            }),
            () => true)
        .subscribe({
            next: (chord) => {
                throw new Error("we should never call next if stop is true from the get go!");
            },
            error: (e) => console.log(e),
            complete: () => {
                done();
            }
        });
    });

    test('calls next and stop if a closure controls stop return', (done: () => void) => {
        let stop = false;
        let nextCalled = 0;
        FollowKeyChordObserver(["w", "Shift"], new Observable<string>((subscriber: Subscriber<string>) => {
            subscriber.next("Shift");
            stop = true;
            subscriber.next("w");
            subscriber.next("w");
        }), () => stop).subscribe({
            next: (chord) => {
                expect(chord).toBe(true);
                nextCalled++;
                expect(nextCalled).toBe(1);
            },
            error: (e) => console.log(e),
            complete: () => {
                done();
            }
        });
    });
});