import Message from "../message";

export default class SelectionModeActivateMessage extends Message<SelectionModeActivateMessage> {

    constructor(attributes: Partial<SelectionModeActivateMessage> = {
    }) {
        super('selection mode activate', 'popup', attributes)
    }
}
