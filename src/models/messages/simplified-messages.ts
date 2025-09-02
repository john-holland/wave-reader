import Message from "../message";
import Options from "../options";

// Simplified message system for the new Tome-based architecture

export class StartMessage extends Message<StartMessage> {
    options?: Options;

    constructor(attributes: Partial<StartMessage> = {
        options: new Options()
    }) {
        super('start', 'popup', attributes);
    }
}

export class StopMessage extends Message<StopMessage> {
    constructor(attributes: Partial<StopMessage> = {}) {
        super('stop', 'popup', attributes);
    }
}

export class ToggleMessage extends Message<ToggleMessage> {
    constructor(attributes: Partial<ToggleMessage> = {}) {
        super('toggle', 'popup', attributes);
    }
}

export class PingMessage extends Message<PingMessage> {
    constructor(attributes: Partial<PingMessage> = {}) {
        super('ping', 'system', attributes);
    }
}

export class PongMessage extends Message<PongMessage> {
    constructor(attributes: Partial<PongMessage> = {}) {
        super('pong', 'system', attributes);
    }
}

export class SelectionMadeMessage extends Message<SelectionMadeMessage> {
    selector?: string;
    
    constructor(attributes: Partial<SelectionMadeMessage> = {}) {
        super('selection-made', 'content', attributes);
    }
}

export class MLRecommendationMessage extends Message<MLRecommendationMessage> {
    recommendation?: any;
    
    constructor(attributes: Partial<MLRecommendationMessage> = {}) {
        super('ml-recommendation', 'system', attributes);
    }
}

// Message factory for creating messages
export class MessageFactory {
    static createMessage(name: string, from: string, data: any = {}) {
        switch (name) {
            case 'start':
                return new StartMessage(data);
            case 'stop':
                return new StopMessage(data);
            case 'toggle':
                return new ToggleMessage(data);
            case 'ping':
                return new PingMessage(data);
            case 'pong':
                return new PongMessage(data);
            case 'selection-made':
                return new SelectionMadeMessage(data);
            case 'ml-recommendation':
                return new MLRecommendationMessage(data);
                    default:
            // Create a generic message for unknown types
            const genericMessage = new (class extends Message<any> {
                constructor(name: string, from: string, data: any) {
                    super(name, from, data);
                }
            })(name, from, data);
            return genericMessage;
        }
    }
}

// Simple message utility for routing
export class MessageUtility {
    static routeMessage(from: string, to: string, message: any, sessionId: string) {
        return {
            from,
            to,
            message,
            sessionId,
            timestamp: Date.now()
        };
    }
}
