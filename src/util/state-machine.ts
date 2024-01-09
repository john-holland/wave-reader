import {State, NameAccessMapInterface, Named} from "./state"
import {Observable, Subscriber} from "rxjs";
import Message, {MessageInterface} from "../models/message";
import MessageSender = chrome.runtime.MessageSender;
import InstalledDetails = chrome.runtime.InstalledDetails;
import {guardLastError} from "./util";
import {fromMessage} from "./messages";
import BootstrapMessage from "../models/messages/bootstrap";
import BootstrapResultMessage from "../models/messages/bootstrap-result";
import HeartbeatResultMessage from "../models/messages/heartbeat-result";
// import {BaseVentures} from "./venture-states";

export class ClientMessage<T extends Message<any>> {
    path: string
    clientId: string
    message: T

    constructor(path: string, clientId: string, message: T) {
        this.path = path;
        this.clientId = clientId;
        this.message = message;
    }
}

export type Success = boolean;
export type ClientID = string

export interface IClientMessengerService<T extends Message<any>> {
    initialize(): Promise<ClientID>
    getRuntimeProxy(): IRuntimeProxy
    getDiscover(): ClientDiscovery
    getApiMap(): Map<string, IClientMessengerService<T>>
    getManager(): ClientID
    getClientMap(): Map<string, ClientHost>
    sendMessage(path: string, clientId: ClientID, message: T): Promise<Success>;
    onReceiveMessage(): Promise<Observable<ClientMessage<T>>>
}

export type ClientHost = string;
type HostType = {
    POPUP: string, // send messages to tabs
    BACKGROUND: string, // receives & sends, as a router
    CONTENT: string,// sends to background
    API: string // todo: graphql transition
}
export const ClientLocation: HostType = {
    POPUP: "popup", // send messages to tabs
    BACKGROUND: "background", // receives & sends, as a router
    CONTENT: "content",// sends to background
    API: "api" // todo: graphql transition
}

export type ClientDiscovery = {
    from: string
    to: string
}

class NotImplementedError implements Error {
    message: string;
    name: string;

    constructor(message: string) {
        this.message = message;
        this.name = "not implemented error";
    }
}

export abstract class APIMessage<T> extends Message<T> implements MessageInterface, Named {
    // todo: api message data?
}

/**
 * An api client that facilitates api communication and automated polling
 *
 * todo: implement
 * todo: implement polling
 */
export class APIClientMessengerService<T extends Message<any>, Discovery extends ClientDiscovery> implements IClientMessengerService<T> {
    getDiscover(): ClientDiscovery {
        throw new NotImplementedError("todo: implement api client message service")
    }

    getRuntimeProxy(): IRuntimeProxy {
        throw new NotImplementedError("todo: implement api client message service")
    }

    onReceiveMessage(): Promise<Observable<ClientMessage<T>>> {
        throw new NotImplementedError("todo: implement api client message service")
    }

    sendMessage(path: string, clientId: ClientID, message: T): Promise<Success> {
        throw new NotImplementedError("todo: implement api client message service")
    }
    initialize(): Promise<ClientID> {
        throw new NotImplementedError("todo: implement api client message service")
    }

    getApiMap(): Map<string, IClientMessengerService<T>> {
        throw new NotImplementedError("todo: implement api client message service")
    }


    getClientMap(): Map<string, ClientHost> {
        throw new NotImplementedError("todo: implement api client message service")
    }

    getManager(): ClientID {
        throw new NotImplementedError("todo: implement api client message service")
    }

}

export interface IRuntimeProxy {
    sendMessageToTab(tabId: number, message: any, callback: { (response: any): void }): void;
    sendMessageToRuntime(message: any, callback: { (response: any): void }): void;
    onInstalled(callback: {(details: any): void}): void;
    onMessage(callback: {(message: any, sender: MessageSender, sendResponse: { (response?: any): void }): void }): void;
}

export class GoogleChromeRuntimeProxy implements IRuntimeProxy {
    onInstalled(callback: { (details: any): void }): void {
        chrome.runtime.onInstalled.addListener(callback)
    }

    onMessage(callback: { (message: any, sender: chrome.runtime.MessageSender, sendResponse: { (response?: any): void }): void }): void {
        chrome.runtime.onMessage.addListener(callback);
    }

    sendMessageToRuntime(message: any, callback: { (response: any): void }): void {
        chrome.runtime.sendMessage(message, callback);
    }

    sendMessageToTab(tabId: number, message: any, callback: { (response: any): void }): void {
        chrome.tabs.sendMessage(tabId, message, callback);
    }
}

/**
 * Unidirectional client service, discover clients from->to, or delegate to API clients
 * Api clients should have typed names
 */
export class GoogleClientMessengerService<T extends Message<any>, Discovery extends ClientDiscovery> implements IClientMessengerService<T> {
    discover: Discovery;
    //todo: this may want to be the extension id for runtime.sendmessage to guaard against spam
    clientId?: ClientID;
    managerId?: ClientID;
    clientMap: Map<ClientID, ClientHost> = new Map<ClientID, ClientHost>()
    observable?: Observable<ClientMessage<T>>
    subscriber?: Subscriber<ClientMessage<T>>
    private apiMap: Map<ClientID, IClientMessengerService<T>>;
    runtimeProxy: IRuntimeProxy;

    constructor(discover: Discovery, apiMap: Map<string, IClientMessengerService<T>>, chromeRuntimeProxy: IRuntimeProxy = new GoogleChromeRuntimeProxy()) {
        this.discover = discover;
        this.apiMap = apiMap;
        this.runtimeProxy = chromeRuntimeProxy;
    }

    getRuntimeProxy(): IRuntimeProxy {
        return this.runtimeProxy;
    }

    getManager(): string {
        throw new Error("Method not implemented.");
    }

    getClientMap(): Map<ClientID, ClientHost> {
        throw new Error("Method not implemented.");
    }

    getApiMap(): Map<ClientID, IClientMessengerService<T>> {
        return this.apiMap;
    }

    getDiscover(): Discovery {
        return this.discover;
    }

    sendMessage(path: string, clientId: ClientID, message: T): Promise<Success> {
        return new Promise((resolve, reject) => {
            if (this.discover.from === this.discover.to) throw new Error("discover is set to a loopback, please use hierarchy, or internal messaging")

            const location = this.clientMap.get(clientId) || this.discover.to.toString();

            // background has two clients, one upstream and one down
            if (location === ClientLocation.POPUP) {
                this.runtimeProxy.sendMessageToRuntime(new ClientMessage(path, clientId, message), (response) => {
                    resolve(response);
                })
            } else if (location === ClientLocation.CONTENT) {
                if (isNaN(Number(clientId))) throw new Error("message to tab with invalid tabId! Not a number, " + clientId + " for message, " + JSON.stringify(message))
                this.runtimeProxy.sendMessageToTab(Number(clientId), new ClientMessage(path, clientId, message), (response) => {
                    resolve(response);
                });
            } else if (location === ClientLocation.API) {
                if (this.getApiMap().has(message.getClientId())) {
                    this.getApiMap().get(message.getClientId())?.sendMessage(path, clientId, message).then(resolve).catch(reject);
                } else {
                    throw new Error(`type was ClientLocation.API, but unknown clientId for api map in ClientMessengerService from client: ${clientId} for message ${message}`)
                }
            } else if (location === ClientLocation.BACKGROUND) {
                // use sendMessageToRuntime since the background script can be reached that way by both the popup and the tabs.
                if (this.discover.from === ClientLocation.CONTENT) {
                    this.getRuntimeProxy().sendMessageToRuntime(message, resolve);
                }
            }
        })
    }

    onReceiveMessage(): Promise<Observable<ClientMessage<T>>> {
        return new Promise((resolve, reject) => {
        // todo: do we want a retry or timeout?
            let clientReceived = false;
            const backlog: any[] = [];
            const observable = new Observable<ClientMessage<T>>((subscriber) => {
                this.runtimeProxy.onMessage((message: any, sender: MessageSender, response: {(response?: any): void}) => {
                    const typedMessage = fromMessage(message);

                    //todo: review: @mr-sekiro xsrf secure?

                    if (typedMessage.name === "bootstrap-result") {
                        const bootstrapResult = typedMessage as BootstrapResultMessage;
                        this.clientId = bootstrapResult.clientId;
                        clientReceived = true;
                        resolve(observable);
                        backlog.forEach(m => subscriber.next(m));
                    } else if (!clientReceived) {
                        backlog.push(message);
                    } else if ("clientId" in message && !!(message as ClientMessage<any>)) {
                        subscriber.next(message);
                    } else {
                        subscriber.next(new ClientMessage<T>(".", typedMessage.from, typedMessage as T))
                    }
                });
            });
        })
    }

    heartbeatMessage(heartbeat: HeartbeatResultMessage) {
        // todo: update client map
        // todo: similar to bootstrap send back whatever info in response, just no additional messaging
        console.error("### straw ###")
    }

    bootstrapMessages(): Promise<void> {
        // todo: implement: send up, then once complete, await id message
        throw new NotImplementedError("not yet implemented!")
        if (this.discover.from !== ClientLocation.CONTENT) {
            // todo: accept client id here from message,
            //  saturate api map if found
            this.clientId = this.discover.from;
            return Promise.resolve();
        }
        // send up
        return new Promise((resolve, reject) => {
            // todo: using what info is available, extension id, etc, send info back to requested
            this.runtimeProxy.sendMessageToRuntime(new BootstrapMessage(), (response) => {
                resolve();
            })
        })
    }

    initialize(): Promise<ClientID> {
        return new Promise((resolve, reject) => {
            this.bootstrapMessages().then(this.onReceiveMessage);
        })
    }

    private getClientId() {
        if (!this.clientId) console.log("GoogleMessengerCLient#getClientId called with a null clientid! bootstrap failed!")
        return this.clientId || "no-id"
    }
}

export class FirefoxSyncClientMessengerService<T extends Message<any>> implements IClientMessengerService<T> {
    sendMessage(clientId: ClientID, message: any): Promise<boolean> {
        throw new Error("TODO: implement firefox!.");
    }

    initialize(): Promise<ClientID> {
        throw new Error("TODO: implement firefox!.");
    }

    getApiMap(): Map<string, IClientMessengerService<T>> {
        throw new Error("TODO: implement firefox!.");
    }

    getClientMap(): Map<string, ClientHost> {
        throw new Error("TODO: implement firefox!.");
    }

    getDiscover(): ClientDiscovery {
        throw new Error("TODO: implement firefox!.");
    }

    getManager(): ClientID {
        throw new Error("TODO: implement firefox!.");
    }

    getRuntimeProxy(): IRuntimeProxy {
        throw new Error("TODO: implement firefox!.");
    }

    onReceiveMessage(): Promise<Observable<ClientMessage<T>>> {
        throw new Error("TODO: implement firefox!.");
    }

}

export interface IClient<T extends Message<any>> {
    initialize(): Promise<Success>;
    sendMessage(message: ClientMessage<T>): Promise<Success | State>;
    getMessageReceivedObservable(): Observable<ClientMessage<T>>;
    getStateMachines(): Map<string, StateMachine>
}

const ContentToPopupDiscovery = {
    from: ClientLocation.CONTENT,
    to: ClientLocation.POPUP
} as ClientDiscovery;

const PopupToContentDiscovery = {
    from: ClientLocation.POPUP,
    to: ClientLocation.CONTENT
} as ClientDiscovery;

const PopupToBackgroundDiscovery = {
    from: ClientLocation.POPUP,
    to: ClientLocation.BACKGROUND
} as ClientDiscovery;

const BackgroundToPopupDiscovery = {
    from: ClientLocation.BACKGROUND,
    to: ClientLocation.POPUP
} as ClientDiscovery;

const PopupToAPIDiscovery = {
    from: ClientLocation.POPUP,
    to: ClientLocation.API
} as ClientDiscovery;

const ContentToAPIDiscovery = {
    from: ClientLocation.CONTENT,
    to: ClientLocation.API
} as ClientDiscovery;

// for the time being we'd like the api access to primarily live on the background.js thread
const BackgroundToAPIDiscovery = {
    from: ClientLocation.BACKGROUND,
    to: ClientLocation.API
} as ClientDiscovery;

export class Client<T extends Message<any>> implements IClient<T> {
    messengerClient: IClientMessengerService<T>
    private clientId: ClientID | undefined = undefined;
    private observer?: Observable<ClientMessage<T>>

    private stateMachineMap = new Map<string, StateMachine>();

    constructor(messengerClient: IClientMessengerService<T> =
                    new GoogleClientMessengerService<T, ClientDiscovery>(
                        PopupToContentDiscovery,
                        new Map<ClientID, IClientMessengerService<T>>()
                    ),
                stateMachineMap?: Map<string, StateMachine>
    ) {
        this.messengerClient = messengerClient;
        if (stateMachineMap) {
            [...stateMachineMap.entries()].forEach(p => this.stateMachineMap.set(p[0], p[1]))
        }
    }

    getMessageReceivedObservable(): Observable<ClientMessage<T>> {
        if (!this.observer) {
            throw new Error("please initialize client before accessing message observer")
        }
        return this.observer;
    }
    getStateMachines(): Map<string, StateMachine> {
        return this.stateMachineMap
    }

    initialize(): Promise<Success> {
        return new Promise(async (resolve, reject) => {
             this.messengerClient.initialize().then(async (id) => {
                 this.clientId = id;
                 this.observer = await this.onReceiveMessage(this.clientId)
                 this.observer.subscribe((message) => {
                     this.sendMessage(message).catch(e => {
                        console.log("failed to process state or message: " + JSON.stringify(message));
                     });
                 })
                 resolve(true)
             }).catch(error => {
                 console.log(new Error(`error receiving message for client ${this.clientId}: ${error.message}`, error));
                 resolve(false)
             })
        })
    }

    sendMessage(message: ClientMessage<T>): Promise<Success | State> {

        // send a message to the specific client, then descend the state machines
        //  finding the appropriate machine starting at the root (usually "content" or "popup")
        //  once descended, we deliver the message
        // path examples:
        //  * 'app#settings' 'extensionid321' 'save' { ... data }
        //  * 'background/api#ga' 'ga' 'page' { ... data }
        //  * 'content#wave' 'tab123' 'start' { ... data }
        const clients = message.path.split('/')
        const machines = message.path.split('#')
        const machine = machines[machines.length - 1];

        if (machines.length > 1) {
            console.log("machines " + machines.slice(1).join(', '))
        }
        const client = clients[0];
        // given the message.from & the host location, send to the next hope, or pizza down to the next message

        return new Promise((resolve, reject) => {
            if (client === this.clientId) {
                if (!this.stateMachineMap.has(machine)) {
                    throw new Error(`statemachine missing from client, ${client} for machine, ${machine}`)
                }

                // message sent!
                this.stateMachineMap.get(machine)?.handleState(message.message).then((p) => resolve(p || false)).catch(reject)
            } else {
                // otherwise, we use the from and client to send appropriately
                const newPath = (clients.length > 1 ? clients.slice(1) : clients).join('/');

                // the graph here isn't very big, you're either on a client, and sending a message to another part of the client
                // or on the correct client and sending a message to an api client
                // so if you're message is from the popup sending to background, then
                if (this.messengerClient.getApiMap().has(client)) {
                    this.messengerClient.getApiMap().get(client)?.sendMessage(newPath, message.clientId, message.message).then(p => resolve(p || false)).catch(reject)
                } else {
                    this.messengerClient.sendMessage(newPath, message.clientId, message.message).then(p => resolve(p || false)).catch(reject);
                }
            }
        });
    }

    private onReceiveMessage(clientId: string): Promise<Observable<ClientMessage<T>>> {
        if (this.clientId === clientId) {
            return this.messengerClient.onReceiveMessage()
        }
        if (this.messengerClient.getClientMap().has(clientId)) {
            if (!this.messengerClient.getApiMap().has(this.messengerClient.getClientMap().get(clientId)!)) {
                throw new Error(`clientId: ${clientId} has no corresponding API mappings on this host ${this.clientId}`)
            }
            return this.messengerClient.getApiMap().get(this.messengerClient.getClientMap().get(clientId)!)!.onReceiveMessage()
        } else {
            throw new Error(`clientId: ${clientId} not found`)
        }
    }
}


const createBackgroundToPopupClientMessengerService = <T extends Message<T>>() => new GoogleClientMessengerService<T, ClientDiscovery>(
    BackgroundToPopupDiscovery,
    new Map<ClientID, IClientMessengerService<T>>()
);

const createPopupToBackgroundClientMessengerService = <T extends Message<T>>() => new GoogleClientMessengerService<T, ClientDiscovery>(
    PopupToContentDiscovery,
    new Map<ClientID, IClientMessengerService<T>>()
);

const createContentToPopupClientMessengerService = <T extends Message<T>>() => new GoogleClientMessengerService<T, ClientDiscovery>(
    ContentToPopupDiscovery,
    new Map<ClientID, IClientMessengerService<T>>()
);

const createPopupToContentClientMessengerService = <T extends Message<T>>() => new GoogleClientMessengerService<T, ClientDiscovery>(
    PopupToContentDiscovery,
    new Map<ClientID, IClientMessengerService<T>>()
);

class StateMachine {
    initialized: boolean = false;
    map: NameAccessMapInterface | undefined = undefined;
    currentState: State | undefined = undefined;
    // todo: review, this may be a useful feature, i almost didn't yagni this in a test (which sounds weird)
    private stateObservable?: Observable<State | undefined>
    private stateSubscriber?: Subscriber<State | undefined>;

    constructor() {
    }

    // todo: for client manager, add the ability to pass the active node etc
    //   look into graphql propegation apis?
    /**
     * @remarks Please note, the stateObservable does not report the originState
     * @param stateMachineMap [NameAccessMapInterface] a map of state-machine states by name
     * @param originState [State] a starting state (often "base")
     */
    initialize(stateMachineMap: NameAccessMapInterface, originState: State) {
        // TODO: guard for env?
        if (this.map !== undefined) console.log("initialize called with predefined map outside of test conditions: " + JSON.stringify(this.map));
        if (this.currentState !== undefined) console.log("initialize called with predefined currentState outside of test conditions: " + JSON.stringify(this.currentState));
        this.map = stateMachineMap;
        this.currentState = originState;
        if (this.map !== undefined && this.currentState !== undefined) this.initialized = true;

        const setStateSubscriber = (stateSubscriber: Subscriber<State | undefined>) => this.stateSubscriber = stateSubscriber;
        this.stateObservable = new Observable<State | undefined>((subscriber) => {
            setStateSubscriber(subscriber)
        });
    }

    getObservable(): Observable<State | undefined> | null {
        return this.stateObservable || null;
    }

    getBaseState(): State | undefined {
        return this.map?.getState("base");
    }

    getErrorState(): State | undefined {
        return this.map?.getState("error");
    }

    protected validateState(newState: Named): State | undefined {
        if (!this.initialized) throw new Error("not initialized, no StateMachineMap")

        const state = this.map?.getState(newState.name);

        if (!state || (!state?.isBaseLevel && !this.currentState?.ventureStates.includes(newState.name))) {
            console.error(
                this.currentState?.error(),
                newState?.name
            );
            return this.getErrorState();
        }

        return this.getState(newState.name)
    }

    protected async processState(message: Named, state: State | undefined, previousState: State): Promise<State | undefined> {
        if (!this.initialized) throw new Error("not initialized, no StateMachineMap")
        if (state === undefined) console.log("State undefined for previous state" + JSON.stringify(previousState))

        this.stateSubscriber?.next(state);

        // important note here, we put the state machine into the state returned by stateEffects lambda but don't call
        //   the associated stateEffects - this is a free form way to handle the transition problem,
        //   but we don't enforce transitions either which may cause some unexpected hitches
        //   base -> start -> waving -> end selection choose (bam! error (:=0))
        //   we can liberally use venture states to handle this - cli tools would be cool & yagnilishious
        if (typeof state?.stateEffects === 'function') {
            this.currentState = await state.stateEffects(message, state, previousState) || this.getBaseState();
            if (this.currentState?.name === "base") {
                console.log("transitioning back to base");
            }
        } else {
            console.log(`no stateEffects defined for ${state?.name}, transitioning back to base`)
            this.currentState = this.getBaseState();
        }

        this.stateSubscriber?.next(this.currentState);
        return this.currentState;
    }

    processing = false;
    queue: Named[] = [];

    /**
     * Validates and processes the message, returning the state due to the [State#stateeffects()] or BaseState
     * @param namedState the message from chrome.runtime to be passed through to the [State#stateeffects()]
     * @return the BaseState or state from [State#stateeffects()]
     */
    async handleState(namedState: Named): Promise<State | undefined> {
        if (!this.initialized) throw new Error("not initialized, no StateMachineMap")

        const state = this.validateState(namedState)
        /* eslint-disable  @typescript-eslint/no-extra-non-null-assertion */
        return this.processState(namedState, state, this.currentState!!)!!;
        if (this.processing) {
            this.queue.unshift(namedState)
            let returnState = undefined;
            await this.stateObservable?.forEach(state => returnState = state)
            return Promise.resolve(returnState);
        } else {
            // loop through available states, processing any state that does not return as "base"
            let state: State | undefined;
            while (this.queue.length) {
                state = this.validateState(this.queue.pop()!!);

                state = await this.processState(namedState, state, this.currentState!!);
                if (state?.name !== "base") {
                    this.queue.unshift(state as Named)
                }
            }
            try {
                return state ? Promise.resolve(state) : Promise.reject(state);
            }
            finally {
                this.processing = false;
            }
        }
    }

    getState(name: string): State | undefined {
        if (!this.initialized) throw new Error("not initialized, no StateMachineMap")

        return this.map?.getState(name);
    }

    getCurrentState(): State | undefined {
        return this.currentState;
    }
}

export default StateMachine;
