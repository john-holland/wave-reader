import Message from "../message";

export default class CancelAddSelectorMessage extends Message<CancelAddSelectorMessage> {
    selector?: string;

    constructor(attributes: Partial<CancelAddSelectorMessage> = {}) {
        super('cancel-add-selector', 'popup', attributes)
    }
}