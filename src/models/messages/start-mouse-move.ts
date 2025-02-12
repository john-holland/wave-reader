import Wave from "../wave";
import Message from "../message";

export default class StartMouseMoveMessage extends Message<StartMouseMoveMessage> {
    wave?: Wave;

    constructor(attributes: Partial<StartMouseMoveMessage> = {}) {
        super('start-mouse-move', 'popup', attributes)
    }
}