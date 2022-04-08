var Text = /** @class */ (function () {
    function Text(attributes) {
        if (attributes === void 0) { attributes = {
            textSize: '1rem',
            textColor: 'initial'
        }; }
        this.textSize = attributes.textSize;
        this.textColor = attributes.textColor;
        Object.assign(this, attributes);
    }
    return Text;
}());
export default Text;
