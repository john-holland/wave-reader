import Wave from "../wave";
import Message from "../message";

export default class UpdateSelectorMessage extends Message<UpdateSelectorMessage> {
    reset: boolean = false;
    selector?: string;

    constructor(attributes: Partial<UpdateSelectorMessage> = {
        reset: false
    }) {
        super('update-selector', 'popup', attributes)
    }
}