
export interface AttributeAccessor {
    [key: string]: any;
}

export default abstract class AttributeConstructor<T> {

    protected constructor(attributes?: AttributeAccessor & Partial<T>, requireAllAssigned: boolean = false) {
        this.assign(attributes, requireAllAssigned)
    }

    protected assign(attributes?: AttributeAccessor & Partial<T>, requireAllAssigned: boolean = false) {
        if (attributes) {
            if (requireAllAssigned && !new Array(...Object.keys(attributes)).every(k => attributes[k] !== undefined)) {
                throw new Error('if [requireAllAssigned == true], a message must contain properties with no undefined values!')
            }
            Object.assign(this, attributes)
        }
    }
}
