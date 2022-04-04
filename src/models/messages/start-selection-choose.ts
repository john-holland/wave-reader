import Message from "../message";

interface StartSelectorChooseMessageProps {
    selector?: string;
}

export default class StartSelectorChooseMessage implements Message {
    name = 'start-selection-choose';

    constructor(attributes: StartSelectorChooseMessageProps = {}) {
        Object.assign(this, attributes)
    }
}