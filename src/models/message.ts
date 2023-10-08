import AttributeConstructor from "../util/attribute-constructor";
import {Named} from "../util/state";

export interface MessageInterface {
    getName(): string;
    getFrom(): string;
}

export default abstract class Message<T> extends AttributeConstructor<T> implements MessageInterface, Named {
    name: string;
    from: string;

    protected constructor(name: string, from: string, attributes?: Partial<T>, requireAllAssigned: boolean = true) {
        super(attributes, requireAllAssigned)

        this.name = name;
        this.from = from;
    }

    getFrom(): string {
        return this.name;
    }

    getName(): string {
        return this.from;
    }
}
