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

export type SizeValue = {
    size: string,
    sizeType?: string
}
export const getSizeValuesRegex = (sizeValue: string): SizeValue => {
    const regex = new RegExp("([0-9]+)([a-zA-Z]+|%)", "ig");

    const result = regex.exec(sizeValue)
    if (!result) return {
        size: "0",
        sizeType: undefined
    };

    const [s, value, valueType, ...rest] = [...result.values()];

    return {
        size: value,
        sizeType: valueType
    } as unknown as SizeValue
}

const windowDefault: any | undefined = (typeof window !== 'undefined' && window) || undefined
export const getDefaultFontSizeREM = (_window: any | undefined = windowDefault) => _window.getComputedStyle(_window.document.documentElement).getPropertyValue('font-size')

// credit: @marc_s https://stackoverflow.com/q/66070706
export const isVisible = (element: HTMLElement) => {
    if (element instanceof Text) return true;
    if (element instanceof Comment) return false;
    if (!(element instanceof Element)) throw Error("isVisible(): argument is not an element");

    // for real elements, the second argument is omitted (or null)
    // for pseudo-elements, the second argument is a string specifying the pseudo-element to match.
    const style = window.getComputedStyle(element, null);

    // if element has size 0
    if(element.offsetWidth === 0 || element.offsetHeight === 0){
        // only on 'visible', content does appear outside of the element's box
        if (style.overflow !== 'visible') {
            return false;
        } else {
            for (const child of element.childNodes) {
                if (isVisible(child as HTMLElement)) return true;
            }
            return false;
        }
    }

    // if css display property is used
    if (style.display === 'none') return false;

    // if css visibility property is used
    if (style.visibility !== 'visible') return false;

    // if css opacity property is used
    if (parseFloat(style.opacity) === 0) return false;

    // this method does not work for elements with "position: fixed;"
    if (style.position !== 'fixed') {
        if (element.offsetParent === null) return false;
    }

    return true;
}