var Options = /** @class */ (function () {
    function Options(props) {
        if (props === void 0) { props = {
            showNotifications: false
        }; }
        this.showNotifications = props.showNotifications;
        Object.assign(this, props);
    }
    Options.getDefaultOptions = function () {
        return new Options();
    };
    return Options;
}());
export default Options;
