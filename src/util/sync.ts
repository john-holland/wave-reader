import AttributeConstructor, {AttributeAccessor} from "./attribute-constructor";

export const getSyncObject = <T extends object>(key: string, defaultValue: T, callback: (result: T) => void) => {
    chrome.storage.sync.get(key, ( (items: { [key: string]: any }) => {
        if (key in items) {
            try {
                callback(JSON.parse(items[key]))
            } catch (e) {
                console.log(e);
                callback(defaultValue)
            }
        } else {
            callback(defaultValue)
        }
    }));
}
// ??
export const newSyncObject = <T extends AttributeConstructor<T>>(objectType: { new(attributes?: AttributeAccessor & Partial<T>, requireAllAssigned?: boolean): T },
                                                                 key: string, defaultValue: T, callback: (result: T) => void) => {
    chrome.storage.sync.get(key, ( (items: { [key: string]: any }) => {
        if (key in items) {
            try {
                callback(new objectType(JSON.parse(items[key])))
            } catch (e) {
                console.log(e);
                callback(defaultValue)
            }
        } else {
            callback(defaultValue)
        }
    }));
}

export const setSyncObject = (key: string, value: object, callback: () => void = () => {}) => {
    chrome.storage.sync.set({ [key]: JSON.stringify(value) }, callback);
}

export default {
    getSyncObject,
    setSyncObject
}
