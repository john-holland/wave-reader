import Message from "../message";

export default class RemoveSelectorMessage extends Message<RemoveSelectorMessage> {
    selector?: string;

    constructor(attributes: Partial<RemoveSelectorMessage> = {}) {
        super('remove-selector', 'popup', attributes)
    }
}