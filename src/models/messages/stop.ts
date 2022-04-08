import Message from "../message";

export default class StopMessage extends Message<StopMessage> {
    constructor() {
        super('stop', 'popup')
    }
}