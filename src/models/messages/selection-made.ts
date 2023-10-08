import Message from "../message";

export default class SelectionMadeMessage extends Message<SelectionMadeMessage> {
    selector?: string;

    constructor(attributes: Partial<SelectionMadeMessage> = {}) {
        super('selector made', 'content', attributes);
    }
}
