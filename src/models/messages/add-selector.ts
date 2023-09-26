import Message from "../message";

export default class AddSelectorMessage extends Message<AddSelectorMessage> {
    selector?: string;

    constructor(attributes: Partial<AddSelectorMessage> = {}) {
        super('add-selector', 'popup', attributes)
    }
}