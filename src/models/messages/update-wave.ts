import Message from "../message";
import Options from "../options";

export default class UpdateWaveMessage extends Message<UpdateWaveMessage> {
    options?: Options

    constructor(attributes: Partial<UpdateWaveMessage> = {
        options: new Options()
    }) {
        super('update', 'popup', attributes)
    }
}
