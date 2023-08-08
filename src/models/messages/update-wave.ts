import Message from "../message";
import Options from "../options";

export default class UpdateWaveMessage extends Message<UpdateWaveMessage> {
    wave?: Options

    constructor(attributes: Partial<UpdateWaveMessage> = {
        wave: new Options()
    }) {
        super('update-wave', 'popup', attributes)
    }
}
