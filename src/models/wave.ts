
import Text from '../models/text';

interface WaveProps {
    selector?: string;
    cssTemplate?: string;
    waveSpeed?: string;
    axisRotationAmount?: number;
    text: Text;
}

export default class Wave {
    constructor(attributes: WaveProps = {
        text: new Text()
    }) {
        Object.assign(this, attributes)
    }
}