import Wave from "../wave";
import Message from "../message";

export default class StopMouseMoveMessage extends Message<StopMouseMoveMessage> {
    wave?: Wave;

    constructor(attributes: Partial<StopMouseMoveMessage> = {}) {
        super('stop-mouse-move', 'popup', attributes)
    }
}