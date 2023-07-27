import Message from "../message";
import Wave from "../wave";

export default class UpdateWaveMessage extends Message<UpdateWaveMessage> {
    wave?: Wave

    constructor(attributes: Partial<UpdateWaveMessage> = {
        wave: new Wave()
    }) {
        super('update-wave', 'popup', attributes)
    }
}
