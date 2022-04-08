import AttributeConstructor from "../util/attribute-constructor";

export default abstract class Message<T> extends AttributeConstructor<T> {
    name: string;
    from: string;

    protected constructor(name: string, from: string, attributes?: Partial<T>, requireAllAssigned: boolean = true) {
        super(attributes, requireAllAssigned)

        this.name = name;
        this.from = from;
    }
}
