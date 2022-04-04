import Wave from "../wave";
import Message from "../message";

interface UpdateSelectorMessageProps {
    selector?: string;
    reset: false;
}

export default class UpdateSelectorMessage implements Message {
    name = 'update-selector';

    constructor(attributes: UpdateSelectorMessageProps = {
        reset: false
    }) {
        Object.assign(this, attributes)
    }
}