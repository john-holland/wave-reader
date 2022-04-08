import Message from "../message";

export default class StartSelectorChooseMessage extends Message<StartSelectorChooseMessage> {
    selector?: string;

    constructor(attributes: Partial<StartSelectorChooseMessage> = {}) {
        super('start-selection-choose', 'popup', attributes)
    }
}