import Message from "../message";

export default class ToggleWaveReaderMessage extends Message<ToggleWaveReaderMessage> {
    constructor(attributes: Partial<ToggleWaveReaderMessage> = {}) {
        super('toggle-wave-reader', 'background-script', attributes)
    }
} 