import Message from "../message";

export default class PongMessage extends Message<PongMessage> {
    timestamp?: number;
    source?: string;

    constructor(attributes: Partial<PongMessage> = {}) {
        super('pong', 'shadow-content-script', attributes);
    }
} 