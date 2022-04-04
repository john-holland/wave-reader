import Wave from "../wave";
import Message from "../message";

interface StartMessageProps {
    wave?: Wave;
}

export default class StartMessage implements Message {
    name = 'start';

    constructor(attributes: StartMessageProps = {}) {
        Object.assign(this, attributes)
    }
}