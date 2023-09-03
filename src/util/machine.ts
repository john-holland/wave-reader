import {Named} from "./state";
import {Base} from "./venture-states";
import Message, {MessageInterface} from "../models/message";
import {FunctionComponent} from "react";

/**
 * hierarchical state machine with message bubbling
 *
 * each component requires a props bundle and a state machine
 *
 * any call up the chain from a sub-state machine must fulfill both
 *
 * A(B) -> a(B, b)
 *
 * app starts -> loads settings, user switches tabs, sets settings
 *
 * SUPER(state: string) requests a state in the higher level state machine change state if possible
 * DONE/UP() declare inactivity, and will make the machine noisier
 *
 * [bootstrap] -> [base]
 * [*] -> [settings updated] -> [*]
 * [switch tabs] -> [settings open] {
 *     [base] // data down
 *     [*] -> [settings changed] -> [unsaved]
 *     [unsaved] -> [save] / [revert] / [discard]
 *     [save] SUPER(settings updated) -> [base] // causes app state machine to switch and close
 *     [*] -> [close] -> SUPER(base) UP()
 *     [*] -> [start edit keybind] {
 *          [base] // data down
 *          [*] -> [start scanning] -> [scanning]
 *          [scanning] -> [save, clear, revert, stop scanning]
 *          [stop scanning] -> [base]
 *          [save] -> SUPER(update keybind, name) UP() -> [base]
 *          [clear] -> [scanning]
 *          [revert] -> [scanning]
 *          [stop scanning] -> UP() -> [base]
 *          [close] -> [close]
 *     }
 * } -> [settings updated] -> [base]
 * [start choose selector mode] -> [selector mode active] (message to content, start selector choose mode) {
 *   // from content.js
 *     [base] // data down
 *     [set selector] -> [unsaved] // user changes the text box
 *     [*] -> [add island selection] -> [unsaved]
 *     [*] -> [remove island selection] -> [unsaved]
 *     [unsaved] -> [save selector]
 *     [save selector] SUPER(settings updated) -> [close]
 *     [revert selector] -> [base]
 *     [*] -> [close] UP() -> [close] // from popup.js, press escape, or press 'x' button in the corner
 * } -> [selector updated] -> [base]
 * [selector updated] -> [base]
 * [switch tab] (ed) -> [education tab] {
 *     [open] -> [open, close]
 *     [close] UP() -> [close]
 *  }
 * [switch tab] (about) -> [about tab] {
 *     // no premium features as this is a reading tool, but donation, newsletter and about link?
 *     [open] -> [open, close]
 *     [close] UP() -> [close]
 * }
 */

type Named = {
    name: string;
}

class State implements Named {
    name: string
    ventureStates: string[]
    isBaseLevel: boolean
}

/**
 * The above describes states for a hierarchical state machine with asynchronous blocking measures
 * It would be nifty to let the state machine be data driven
 */
const enum MachineClientConnectionStatus {
    SILENT = 1 << 0, // initial state, no messages
    ONLY_SENT = 1 << 1, // has only sent so far
    ONLY_RECEIVED = 1 << 2, // has only received so far
    CONNECTED = 1 << 3, // sent and received
    ERROR = 1 << 4, // in an error state, cannot send, hasn't received for [timeout], or other
    CONNECTED_ERROR = 1 << 5 // connected, but has maintained errors
}

const isConnected = (connection: MachineClientConnectionStatus) => !!(connection & (MachineClientConnectionStatus.CONNECTED | MachineClientConnectionStatus.CONNECTED_ERROR));
const isError = (connection: MachineClientConnectionStatus) => !!(connection & (MachineClientConnectionStatus.ERROR | MachineClientConnectionStatus.CONNECTED_ERROR));
const isBootstrapping = (connection: MachineClientConnectionStatus) => !!(connection & (MachineClientConnectionStatus.SILENT | MachineClientConnectionStatus.ONLY_RECEIVED | MachineClientConnectionStatus.ONLY_SENT))

interface StateMachineClientManagerInterface {
    setState(state: State): void;
    getState(name: string): State;
    addMachine(machine: MachineInterface): void;
    addAllMachines(machines: MachineInterface[]): void;
    getConnection(machine: MachineInterface): void;
}
type StateMachineClientManagerProps = {
    machines: MachineInterface[],
    clients: StateMachineClientManagerInterface[]
}

interface StateMachineClientInterface {
    initialize(props: StateMachineClientProps): void;
    addMachine(machine: MachineInterface, local: boolean): void;
    isLocal(machine: MachineInterface): void;
    getName(): string;
    getState(name: string): State;
    getClientType(): MachineLocation;
}
const enum MachineLocation {
    BACKGROUND, // runs in the background
    CONTENT, // runs on the webpage proper
    POPUP // runs in the popup
}
type StateMachineClientProps = {
    machine: MachineInterface,
    machines: MachineInterface[],
    initialState: State,
    clientManager: StateMachineClientManagerInterface,
    connectionStatus: MachineLocation
}

interface MachineInterface {
    initialize(props: MachineProps, client: StateMachineClientInterface): Promise<StateMachineClientManagerInterface>
    getClient(): StateMachineClientInterface
    getSuperMachine(): MachineInterface;
    getSubMachines(): MachineInterface[];
    getActiveSubMachines(): MachineInterface[];
    setState(state: State): void;
    getState(): State;
    setSuperState(state: State): Promise<[MachineClientConnectionStatus, State]>;
    getName(): string;
}
type MachineProps = {
    superMachine: MachineInterface,
    activeSubMachine: MachineInterface,
    subMachines: MachineInterface[],
    initialState: State,
    errorState: { (e: any): State }
    errors: any[]
}

type StateEventExpectation = boolean;
const BaseLevel: StateEventExpectation = true;
const SubState: StateEventExpectation = false;

type MessageProps = {
    client: StateMachineClientInterface,
    message: MessageInterface
}

type MachineFactoryProps = {
    location: MachineLocation,
    name: string,
    submachines: MachineInterface[]
    states: { (client: StateMachineClientManagerInterface, machine: MachineInterface): Partial<State> }
    superStates: string[] // the valid effected super states to expect from this machine
    ventureStates: string[] // the valid future states for this machine
}
const Machine = (props: Partial<MachineFactoryProps> = { }): MachineInterface => {
    // return new class implements MachineInterface {
    //     getActiveSubMachines(): MachineInterface[] {
    //         return [];
    //     }
    //
    //     getClient(): StateMachineClient {
    //         return new class implements StateMachineClientManagerInterface;
    //     }
    //
    //     getName(): string {
    //         return "";
    //     }
    //
    //     getState(): State {
    //         return undefined;
    //     }
    //
    //     getSubMachines(): MachineInterface[] {
    //         return [];
    //     }
    //
    //     getSuperMachine(): MachineInterface {
    //         return undefined;
    //     }
    //
    //     initialize(props: MachineProps, client: StateMachineClient): Promise<StateMachineClientManagerInterface> {
    //         return Promise.resolve(undefined);
    //     }
    //
    //     setState(state: State): void {
    //     }
    //
    //     setSuperState(state: State): Promise<[MachineClientConnectionStatus, State]> {
    //         return Promise.resolve([undefined, undefined]);
    //     }
    //
    // }
}

const machine = Machine({
    location: MachineLocation.POPUP, // or BACKGROUND?
    name: "app",
    component: undefined, // FunctionalComponent<SomethingComponent>
    submachines: [
        Machine({
            location: MachineLocation.POPUP,
            name: "settings",
            states: (client: StateMachineClientInterface, machine: MachineInterface): Partial<State>[] => {
                return [
                    {
                        base: ["base", BaseLevel, () => {}],

                    }
                ] as unknown as Partial<State>[];
            }
        }),
        Machine({
            location: MachineLocation.POPUP,
            name: "education"
        }),
        Machine({
            location: MachineLocation.POPUP,
            name: "about",
            superStates: ["BUNNIES"],
            states: (client: StateMachineClientManagerInterface, machine: MachineInterface): Partial<State>[] => {
                return [
                    {
                        base: [["base"], BaseLevel, () => {}],
                        startDonate: [["donating"], BaseLevel, () => { /* open webpage */ }],
                        donated: [["easterEgg"], SubState],
                        stopDonate: [["base"], SubState],
                        donating: [["donated", "stopDonate"], SubState],
                        easterEgg: [["base"], SubState, ({ client, message }: MessageProps) => {
                            // show as many bunnies bouncing happily, as pennies donated or something, and unlock konami code
                            machine.setSuperState(client.getState("BUNNIES"))
                        }]

                    }
                ] as unknown as Partial<State>[];
            }
        }),
        Machine({
            location: MachineLocation.CONTENT,
            name: "selector-hierarchy-ux",
            states: (client: any, machine: any): Partial<State>[] => {
                return [
                    {
                        base: ["base", true, () => {}],

                    }
                ] as unknown as Partial<State>[];
            }
        }),
        Machine({
            location: MachineLocation.POPUP,
            name: "selector-popup-settings"
        })
    ],
    states: (client: any, machine: any): Partial<State>[] => {
        return [
            {
                base: ["base", true, () => {}],

            }
        ] as unknown as Partial<State>[];
    }
})

interface MachineComponent <TProps> { //  <T> implements FunctionalComponent<T>
    getMachine(): MachineInterface;
    render(props: TProps): FunctionComponent<TProps>
}