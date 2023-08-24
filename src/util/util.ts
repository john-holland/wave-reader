/**
 *
 * @returns {boolean} true if lastError
 */
export const guardLastError = () => {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
        console.log(new Error().stack);
        return chrome.runtime.lastError;
    }

    return false;
}

export type Tab = chrome.tabs.Tab;

export const currentTab = (): Promise<Tab[]> => {
    return new Promise<Tab[]>((resolve, reject) => {
        chrome.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            resolve(tabs);
        }).catch(e => {
            console.log('error getting current tab: ', e);
            reject(e);
        });
    });
}

/**
 * A Promise proxy function
 *
 * e.x. p((r) => r(true)).then(() => {
 *   console.log('sugar')
 * })
 * @param promiseFn a promise function body
 * @returns {Promise<unknown>} another promise or a value wrapped in resolve promise
 */
type PromiseFunction<T> = (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;
/* eslint-disable  @typescript-eslint/no-unused-vars */
const p = <T> (promiseFn: PromiseFunction<T> = (resolve = () => {}, reject = (reason?: string) => {}) => { }) => {
    return new Promise(promiseFn);
};

export default p;
