import {Deferred} from "../../src/util/deferred";
import {describe, expect, test} from '@jest/globals'

describe('Deferred', () => {
    test('resolves waitFor properly', (done: () => void) => {
        let deferred = new Deferred<string>(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve('test'), 0);
            });
        });

        deferred.waitFor().then((value: string) => {
            expect(value).toBe('test');
            done();
        });
    });

    test('rejects waitFor properly', (done: () => void) => {
        let deferred = new Deferred<string>(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => reject('test'), 0);
            });
        });

        deferred.waitFor().then((value?: string) => {}, (reason: string) => {
            expect(reason).toBe('test');
            done();
        });
    });

    test('updates', (done: () => void) => {
        let arr = [1,2,3];
        let deferred = new Deferred<number>(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(arr.pop()!!), 0);
            });
        });

        deferred.waitFor().then((value?: number) => {
            expect(value).toBe(3);

            deferred.update().then((value?: number) => {
                expect(value).toBe(2);
                done();
            });
        });
    });

    test('updates rejects', (done: () => void) => {
        let arr = [3];
        let deferred = new Deferred<number>(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(arr.pop()!!), 0);
            });
        });

        deferred.waitFor().then((value?: number) => {
            expect(value).toBe(3);

            deferred.update().then((value?: number) => {}, (reason) => {
                done();
            });
        });
    });
});