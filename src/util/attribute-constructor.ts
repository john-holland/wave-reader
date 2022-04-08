
interface AttributeAccessor {
    [key: string]: any;
}

export default abstract class AttributeConstructor<T> {
    protected constructor(attributes?: AttributeAccessor & Partial<T>, requireAllAssigned: boolean = false) {
        if (attributes && requireAllAssigned) {
            if (!new Array(...Object.keys(attributes)).every(k => attributes[k] !== undefined)) {
                throw new Error('a message must contain properties')
            }
            Object.assign(this, attributes)
        }
    }
}
