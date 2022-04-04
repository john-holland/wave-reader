import Message from "../message";

interface UpdateWaveMessageProps {
    waveSpeed?: string;
    axisRotationAmount?: number;
    text: Text;
}

export default class UpdateWaveMessage implements Message {
    name = 'update-wave';

    constructor(attributes: UpdateWaveMessageProps = {
        text: new Text()
    }) {
        Object.assign(this, attributes)
    }
}
