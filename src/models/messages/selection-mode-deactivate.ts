import Message from "../message";

export default class SelectionModeDeactivateMessage extends Message<SelectionModeDeactivateMessage> {

    constructor(attributes: Partial<SelectionModeDeactivateMessage> = {
    }) {
        super('selection mode deactivate', 'popup', attributes)
    }
}
