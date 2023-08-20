
/**
 * A Promise proxy function
 *
 * e.x. p((r) => r(true)).then(() => {
 *   console.log('sugar')
 * })
 * @param promiseFn a promise function body
 * @returns {Promise<unknown>} another promise or a value wrapped in resolve promise
 */
/* eslint-disable  @typescript-eslint/no-unused-vars */
const p = (promiseFn = (resolve = () => {}, reject = () => {}) => {}) => {
    return new Promise(promiseFn);
};

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

export const currentTab = () => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            resolve(tabs);
        }).catch(e => {
            console.log('error getting current tab: ', e);
            reject(e);
        });
    });
}

export default p;
