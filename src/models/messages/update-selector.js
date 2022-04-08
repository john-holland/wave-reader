var UpdateSelectorMessage = /** @class */ (function () {
    function UpdateSelectorMessage(attributes) {
        if (attributes === void 0) { attributes = {
            reset: false
        }; }
        this.reset = false;
        this.name = 'update-selector';
        Object.assign(this, attributes);
    }
    return UpdateSelectorMessage;
}());
export default UpdateSelectorMessage;
