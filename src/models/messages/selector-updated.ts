import Message from "../message";

export default class SelectorUpdated extends Message<SelectorUpdated> {
    selector?: string;

    constructor(attributes: Partial<SelectorUpdated> = {}) {
        super('add selector', 'content', attributes);
    }
}
