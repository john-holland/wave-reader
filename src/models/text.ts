import AttributeConstructor from "../util/attribute-constructor";

export default class Text extends AttributeConstructor<Text> {
    size?: string;
    color?: string;

    constructor(attributes: Partial<Text> = {
        size: 'initial',
        color: 'initial'
    }) {
        super(attributes);
        this.assign(attributes);
    }
}