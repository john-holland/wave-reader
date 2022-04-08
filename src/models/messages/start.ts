import Wave from "../wave";
import Message from "../message";

export default class StartMessage extends Message<StartMessage> {
    wave?: Wave;

    constructor(attributes: Partial<StartMessage> = {}) {
        super('start', 'popup', attributes)
    }
}