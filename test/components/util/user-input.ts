import {Deferred} from "../../src/util/deferred";
import {describe, expect, test} from '@jest/globals'
import {FollowKeyChordObserver} from "../../../src/components/util/user-input";

describe('user-inputs', () => {
    test('matches key chords', (done: () => void) => {
        FollowKeyChordObserver(["Shift", "w"], new Observable<string>((subscriber) => {
            subscriber.next("Shift");
            subscriber.next("w");
        })).subscribe((chord) => {
            expect(chord).toBe(true);
            done();
        });

        // let deferred = new Deferred<string>(() => {
        //     return new Promise((resolve, reject) => {
        //         setTimeout(() => resolve('test'), 0);
        //     });
        // });
        //
        // deferred.waitFor().then((value: string | undefined) => {
        //     expect(value).toBe('test');
        //     done();
        // });
    });
});