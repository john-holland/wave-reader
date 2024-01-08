import Message from "../message";
import {ClientHost, ClientID} from "../../util/state-machine";

export default class HeartbeatResultMessage extends Message<HeartbeatResultMessage> {
    clientId?: string; // the receiving client's client id
    apiMap?: Map<ClientID, ClientHost> // clientId to the ClientLocation type for api discovery

    constructor() {
        super('heartbeat-result', 'popup', undefined, false);
    }
}