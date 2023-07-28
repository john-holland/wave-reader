import Message from "../message";

export default class BootstrapMessage extends Message<BootstrapMessage> {
    constructor() {
        super('bootstrap', 'background', undefined, false);
    }
}