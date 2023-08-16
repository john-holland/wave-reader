import Message from "../message";
import Options from "../options";

export default class StartMessage extends Message<StartMessage> {
    options?: Options;

    constructor(attributes: Partial<StartMessage> = {
        options: new Options()
    }) {
        super('start', 'popup', attributes)
    }
}