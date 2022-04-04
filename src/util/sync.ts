
export const getSyncObject = <T extends object>(key: string, defaultValue: T, callback: (result: T) => void) => {
    chrome.storage.sync.get(key, ( (items: { [key: string]: any }) => {
        callback(JSON.parse(items[key]))
    }));
}

const setSyncObject = (key: string, value: object, callback: () => void) => {
    chrome.storage.sync.set({ [key]: JSON.stringify(value) }, callback);
}

export default {
    getSyncObject,
    setSyncObject
}