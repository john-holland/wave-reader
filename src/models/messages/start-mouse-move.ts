import Wave from "../wave";
import Message from "../message";

export default class StartMouseMove extends Message<StartMouseMove> {
    wave?: Wave;

    constructor(attributes: Partial<StartMouseMove> = {}) {
        super('start-mouse-move', 'popup', attributes)
    }
}