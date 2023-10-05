import Message from "../message";

export default class StartAddSelectorMessage extends Message<StartAddSelectorMessage> {
    selector?: string;

    constructor(attributes: Partial<StartAddSelectorMessage> = {}) {
        super('start-add-selector', 'popup', attributes)
    }
}