var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import Text from "../text";
var UpdateWaveMessage = /** @class */ (function () {
    function UpdateWaveMessage(attributes) {
        if (attributes === void 0) { attributes = {
            text: new Text()
        }; }
        this.name = 'update-wave';
        if (!__spreadArray([], Object.keys(attributes), true).any(function (k) { return !attributes ? [k] : ; })) { }
        Object.assign(this, attributes);
    }
    return UpdateWaveMessage;
}());
export default UpdateWaveMessage;
