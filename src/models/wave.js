import Text from '../models/text';
var Wave = /** @class */ (function () {
    function Wave(attributes) {
        if (attributes === void 0) { attributes = {
            text: new Text()
        }; }
        this.text = attributes.text;
        Object.assign(this, attributes);
    }
    return Wave;
}());
export default Wave;
