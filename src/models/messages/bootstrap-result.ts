import Message from "../message";
import {ClientHost, ClientID} from "../../util/state-machine";

export default class BootstrapResultMessage extends Message<BootstrapResultMessage> {
    clientId?: string; // the receiving client's client id
    apiMap?: Map<ClientID, ClientHost> // clientId to the ClientLocation type for api discovery

    constructor(attributes: Partial<BootstrapResultMessage> = {}) {
        super('bootstrap-result', 'background', undefined, false);
    }
}