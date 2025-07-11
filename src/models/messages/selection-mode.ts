import Message from "../message";

export default class SelectionModeMessage extends Message<SelectionModeMessage> {
    selector?: string;

    constructor(attributes: Partial<SelectionModeMessage> = {
    }) {
        super('selector-mode', 'popup', attributes)
    }
}
