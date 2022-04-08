
export default class Text {
    size: string;
    color: string;

    constructor(attributes: Partial<Text> = {
        size: 'initial',
        color: 'initial'
    }) {
        this.size = attributes.size!!
        this.color = attributes.color!!
        Object.assign(this, attributes)
    }
}