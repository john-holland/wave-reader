import Message from "../message";

export default class PingMessage extends Message<PingMessage> {
    timestamp?: number;
    source?: string;

    constructor(attributes: Partial<PingMessage> = {}) {
        super('ping', 'background-script', attributes);
    }
} 