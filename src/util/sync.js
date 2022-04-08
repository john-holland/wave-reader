export var getSyncObject = function (key, defaultValue, callback) {
    chrome.storage.sync.get(key, (function (items) {
        callback(JSON.parse(items[key]));
    }));
};
var setSyncObject = function (key, value, callback) {
    var _a;
    chrome.storage.sync.set((_a = {}, _a[key] = JSON.stringify(value), _a), callback);
};
export default {
    getSyncObject: getSyncObject,
    setSyncObject: setSyncObject
};
