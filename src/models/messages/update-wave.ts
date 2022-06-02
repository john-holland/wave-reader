import Message from "../message";
import Text from "../text";
import Wave from "../wave";

export default class UpdateWaveMessage extends Message<UpdateWaveMessage> {
    wave?: Wave

    constructor(attributes: Partial<UpdateWaveMessage> = {
        wave: new Wave()
    }) {
        super('update-wave', 'popup', attributes)
    }
}
