import Message from "../message";
import Text from "../text";

export default class UpdateWaveMessage extends Message<UpdateWaveMessage> {
    text?: Text;
    waveSpeed?: string;
    axisRotationAmount?: number;

    constructor(attributes: Partial<UpdateWaveMessage> = {
        text: new Text()
    }) {
        super('update-wave', 'popup', attributes)
    }
}
