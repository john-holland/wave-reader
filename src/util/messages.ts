import BootstrapMessage from "../models/messages/bootstrap";
import SelectorUpdated from "../models/messages/selector-updated";
import Message from "../models/message";
import StartMessage from "../models/messages/start";
import StopMessage from "../models/messages/stop";
import StartSelectorChooseMessage from "../models/messages/start-selection-choose";
import UpdateSelectorMessage from "../models/messages/update-selector";
import UpdateWaveMessage from "../models/messages/update-wave";
import CancelAddSelectorMessage from "../models/messages/cancel-add-selector";
import EndSelectorChooseMessage from "../models/messages/end-selection-choose";
import RemoveSelectorMessage from "../models/messages/remove-selector";
import SelectionMadeMessage from "../models/messages/selection-made";
import SelectionModeMessage from "../models/messages/selection-mode";
import SelectionModeActivateMessage from "../models/messages/selection-mode-activate";
import SelectionModeDeactivateMessage from "../models/messages/selection-mode-deactivate";
import SelectorUpdatedMessage from "../models/messages/selector-updated";
import StartAddSelectorMessage from "../models/messages/start-add-selector";
import StartMouseMoveMessage from "../models/messages/start-mouse-move";
import StopMouseMoveMessage from "../models/messages/stop-mouse-move";

// todo: separate based on ClientLocation
export const fromMessage = (message: Message<any>) => {
    switch (message.name) {
        case 'add-selector': return message as SelectorUpdated;
        case 'bootstrap': return message as BootstrapMessage;
        case 'cancel-add-selector': return message as CancelAddSelectorMessage;
        case 'end-selection-choose': return message as EndSelectorChooseMessage;
        case 'remove-selection': return message as RemoveSelectorMessage;
        case 'selection-made': return message as SelectionMadeMessage;
        case 'selection-mode': return message as SelectionModeMessage;
        case 'selection-mode-activate': return message as SelectionModeActivateMessage;
        case 'selection-mode-deactivate': return message as SelectionModeDeactivateMessage;
        case 'selector-updated': return message as SelectorUpdatedMessage;
        case 'start': return message as StartMessage;
        case 'start-add-selector': return message as StartAddSelectorMessage;
        case 'start-mouse-move': return message as StartMouseMoveMessage;
        case 'start-selection-choose': return message as StartSelectorChooseMessage;
        case 'stop': return message as StopMessage;
        case 'stop-mouse-move': return message as StopMouseMoveMessage;
        case 'update-selector': return message as UpdateSelectorMessage;
        case 'update-wave': return message as UpdateWaveMessage;

        default: throw new Error(`unknown message type: ${message.name}`)
    }
}
