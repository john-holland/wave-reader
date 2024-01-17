import Message from "../message";

export default class EndSelectorChooseMessage extends Message<EndSelectorChooseMessage> {
    constructor(attributes: Partial<EndSelectorChooseMessage> = {}) {
        super('end-selection-choose', 'popup', attributes)
    }
}
