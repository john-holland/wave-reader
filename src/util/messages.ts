import BootstrapMessage from "../models/messages/bootstrap";
import SelectorUpdated from "../models/messages/selector-updated";
import Message from "../models/message";
import StartMessage from "../models/messages/start";
import StopMessage from "../models/messages/stop";
import StartSelectorChooseMessage from "../models/messages/start-selection-choose";
import UpdateSelectorMessage from "../models/messages/update-selector";
import UpdateWaveMessage from "../models/messages/update-wave";

export const fromMessage = (message: Message<any>) => {
    switch (message.name) {
        case 'bootstrap': return message as BootstrapMessage;
        case 'selector-updated': return message as SelectorUpdated;
        case 'start': return message as StartMessage;
        case 'stop': return message as StopMessage;
        case 'start-selection-choose': return message as StartSelectorChooseMessage;
        case 'update-selector': return message as UpdateSelectorMessage;
        case 'update': return message as UpdateWaveMessage;
        default: throw new Error(`unknown message type: ${message.name}`)
    }
}