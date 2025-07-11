import Message from "../message";

export default class UpdateGoingStateMessage extends Message<UpdateGoingStateMessage> {
    going?: boolean;

    constructor(attributes: Partial<UpdateGoingStateMessage> = {}) {
        super('update-going-state', 'content', attributes);
    }
}
