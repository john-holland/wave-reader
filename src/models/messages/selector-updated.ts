import Message from "../message";

export default class SelectorUpdatedMessage extends Message<SelectorUpdatedMessage> {
    selector?: string;

    constructor(attributes: Partial<SelectorUpdatedMessage> = {}) {
        super('selector-updated', 'content', attributes);
    }
}
