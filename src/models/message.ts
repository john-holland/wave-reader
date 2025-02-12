import AttributeConstructor from "../util/attribute-constructor";
import {Named} from "../util/state";

export interface MessageInterface {
    getName(): string;
    getFrom(): string;
    getClientId(): string;
}

export default abstract class Message<T> extends AttributeConstructor<T> implements MessageInterface, Named {
    name: string;
    from: string;
    clientId?: string;

    protected constructor(name: string, from: string, attributes?: Partial<T>, requireAllAssigned: boolean = true, clientId = undefined) {
        super(attributes, requireAllAssigned)

        this.name = name;
        this.from = from;
        this.clientId = clientId;
    }

    /**
     * Returns clientId
     */
    getFrom(): string {
        return this.from
    }

    getName(): string {
        return this.name;
    }

    getClientId(): string {
        if (!this.clientId) console.log("clientId is missing from message: " + this.name + ", from, " + this.from)
        return this.clientId || "no-id";
    }
}
