import {
    ComponentLog,
    log,
    MachineComponentProps,
    ReactMachine,
    ReactMachineFunction,
    view
} from '../util/react-machine';

import { FunctionComponent, useEffect, useState } from "react";
import { FormLabel } from "@mui/material";
import * as React from "react";
import { KeyChord, WindowKeyDownKey, WindowKeyDownKeyObserverDefinition } from "./util/user-input";
import styled from "styled-components";
import { CState, NameAccessMapInterface, Named, State, StateNames } from "../util/state";
import StateMachine, {Client, ClientMessage} from "../util/state-machine";
import Message from "../models/message";

//const val = (fn: {(v: any): void}) => ((_: any, value: any) => fn(value));
//const eventVal = (fn: {(e: any): void}) =>
//    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => fn(e.target);

export type ActionType = string | undefined;
export type ScanForInputProps = {
    actionType: ActionType | string
    shortcut: KeyChord
    keyLimit: number
    onScan: {(keyChord: KeyChord): void}
    onCancelScan: {(keyChord: KeyChord): void}
}

type VisibilityProps = {
    visible?: boolean
}

const ScanTextInput = styled.input`
  display: ${((props: VisibilityProps) => props.visible ? 'inline' : 'none')};
  // should not accept text input
  pointer-events: none;
`;

const SaveButton = styled.input`
    display: ${((props: VisibilityProps) => props.visible ? 'inline' : 'none')}
`;

const RevertButton = styled.input`
  display: ${((props: VisibilityProps) => props.visible ? 'inline' : 'none')}
`;

const ScanTextDisplay = styled.div`
  display: ${((props: VisibilityProps) => props.visible ? 'inline' : 'none')}
`;

const ScanNote = styled.div`
  color: #333;
  display: ${((props: VisibilityProps) => props.visible ? 'inline' : 'none')};
`;

const ClearButton = styled.input`
  display: ${((props: VisibilityProps) => props.visible ? 'inline' : 'none')}
`

const ClickableScanTextContainer = styled.div`
  display: inline;
`;

const ScanForInput = styled.div``;

type EventListener = {(event: KeyboardEvent): void} | undefined;

/**
 * truncating limited unshift, this returns:
 *   [] for Escape
 *   [key] for key limit exceeded
 *   [..., key] for under limit
 * @param keyChord [KeyChord | string[]] the typed keychord so far
 * @param key [string] the key typed
 * @param keyLimit [number] the limit of keys in this keychord
 */
type KeyChordAssignment = {
    keyChord: KeyChord
    escapeCalled: boolean
}
export const assignKeyChord = (keyChord: KeyChord, key: string, keyLimit: number): Partial<KeyChordAssignment> => {
    if (key === "Escape") {
        // TODO: REVIEW: international keyboard key names?
        return { keyChord: [], escapeCalled: true };
    }
    if (keyChord.length === keyLimit) {
        return { keyChord: [key], escapeCalled: false };
    } else {
        return { keyChord: [key].concat(keyChord), escapeCalled: false };
    }
}

/**
 * Presents a clickable label and an input scanning text box.
 * The returned is an array of keys [KeyChord] typed.
 *
 * @param actionType the name of the event you're scanning keys for, e.x. "Toggle"
 * @param shortcut [string[] | KeyChord] an array of key names
 * @param keyLimit the length of the key chord
 * @param onScan [{(keys: KeyChord): void}] saved! Passes the new shortcut KeyChord
 * @param onCancelScan [{(keys: KeyChord): void}] cancelled! Passes the old shortcut KeyChord
 * @constructor see [ScanForInputProps]
 */
const ScanningMap: Map<ActionType, KeyChord> = new Map<ActionType, KeyChord>();
const ListenerMap: Map<ActionType, EventListener> = new Map<ActionType, EventListener>();

export const ClearScanningMap = () => {
    ScanningMap.clear();
}

type ScanForInputStatesProps = {
    map: Map<ActionType, State>
    stateMachineMap: Map<ActionType, StateMachine>
    listenerMap: Map<ActionType, EventListener>
    scanningMap: Map<ActionType, KeyChord>
    actionType: ActionType
    keyLimit: number
    shortcut: KeyChord
    setScanning: { (scanning: boolean): void }
    setKeyChord: { (keyChord: KeyChord): void }
    onScan: { (keyChord: KeyChord): void }
    onCancelScan: { (keyChord: KeyChord): void }
    windowKeyDownObserver: WindowKeyDownKeyObserverDefinition
    shouldPreventDefault: boolean
    window: Window & typeof globalThis;
}

// type WindowMethods = {
//     addEventListener: { (eventName: string, listener: EventListener): void }
//     removeEventListener: { (eventName: string, listener: EventListener): void }
// }
type WindowLike = Window & typeof globalThis;
// type WindowMock = WindowLike & WindowMethods;

//typeof window !== undefined ? window as (Window & typeof globalThis) : {
//     addEventListener: (eventName: string, listener: EventListener) => { console.error("window mock was instantiated during runtime"); },
//     removeEventListener: (eventName: string, listener: EventListener) => { console.error("window mock was instantiated during runtime"); }
// } as unknown as WindowMock;
const _window = window as unknown as WindowLike
export const ScanForInputStates = ({
                                       map,
                                       stateMachineMap,
                                       listenerMap,
                                       scanningMap,
                                       actionType,
                                       keyLimit,
                                       shortcut,
                                       setScanning,
                                       setKeyChord,
                                       onScan,
                                       onCancelScan,
                                       windowKeyDownObserver = WindowKeyDownKey,
                                       shouldPreventDefault = true,
                                       window = _window
                                   }: ScanForInputStatesProps): NameAccessMapInterface =>  {
    // TODO: shortcut is still getting passed in from settings as the previous value:
    //   after a "click", "start scanning" "save", save settings -> "click", "save" ...
    //   observed: back to the value saved before saving settings
    //   expected: saves the new value scanned
    // theory: settings isn't matriculating through properly?

    /* eslint-disable  @typescript-eslint/no-unused-vars */
    const states: StateNames = {
        "base": CState("base", ["start scanning", "base"], true, (message, state, previousState) => {
            if (listenerMap.has(actionType)) {
                scanningMap.delete(actionType)
                window.removeEventListener("keydown", listenerMap.get(actionType)!, true);
                listenerMap.delete(actionType)
            }
            return map.get("base");
        }),
        "start scanning": CState("start scanning", ["scanning", "stop scanning"], false, (message, state, previousState) => {
            setScanning(true);
            // maybe add a useState "started editing" variable, and keep the scanningMap defaulted to shortcut
            //  then when we get any events from subscribe, clear it and accept the new input
            //   - or -
            //  alternatively, we may want to change the value type for scanningMap to include a "started editing" property
            scanningMap.set(actionType, []);

            windowKeyDownObserver((e: {(event: KeyboardEvent): void}) => {
                listenerMap.set(actionType, e);
            }, shouldPreventDefault).subscribe((key: string) => {
                if (!scanningMap.has(actionType)) {
                    console.log("no scanning map found, inspect previous state!");
                    return;
                }

                const assignment = assignKeyChord(scanningMap.get(actionType) || [], key, keyLimit)
                if (assignment.escapeCalled) {
                    // defer the current frame
                    // setTimeout(() => , 0)
                    stateMachineMap.get(actionType)?.handleState({ name: "stop scanning" } as Named)
                } else {
                    scanningMap.set(actionType, assignment.keyChord || [])
                    setKeyChord(assignment.keyChord || []);
                }
            })
            return map.get("scanning");
        }),
        "scanning": CState("scanning", ["save", "revert", "clear", "stop scanning"], false),
        "save": CState("save", ["base"], false, (message, state, previousState) => {
            if (listenerMap.has(actionType)) {
                window.removeEventListener("keydown", listenerMap.get(actionType)!, true);
                listenerMap.delete(actionType)
            }
            setScanning(false)
            const update = scanningMap.get(actionType) || [];
            scanningMap.delete(actionType);
            setKeyChord(update);
            onScan(update);
            return map.get("base");
        }),
        "clear": CState("clear", ["scanning"], false, (message, state, previousState) => {
            scanningMap.set(actionType, []);
            setKeyChord([]);
            return map.get("scanning")
        }),
        "revert": CState("revert", ["scanning"], false, (message, state, previousState) => {
            // revert
            setKeyChord(shortcut);
            return previousState;
        }),
        "stop scanning": CState("base", ["base"], false, (message, state, previousState) => {
            if (listenerMap.has(actionType)) {
                window.removeEventListener("keydown", listenerMap.get(actionType)!, true);
                listenerMap.delete(actionType)
            }
            setScanning(false)
            setKeyChord(shortcut);
            scanningMap.delete(actionType);
            onCancelScan(shortcut);
            return map.get("base");
        })
    }

    Object.keys(states).forEach(key => {
        map.set(key, states[key]);
    })

    return {
        map,
        getState(name: string): State | undefined {
            return map.get(name);
        }
    } as NameAccessMapInterface;
}



const StateMachineMap = new Map<ActionType, StateMachine>()
// todo: service discovery for clients to prevent duplication
const PopupClient = new Client<Message<any>>()
export const ScanForInputFieldMachine: ReactMachineFunction<ScanForInputProps> = ReactMachine<ScanForInputProps>({
    client: PopupClient,
    // todo: add initial state
    initialState: "initialize",
    states: {
        initialize: ({stateProxy, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            if(!StateMachineMap.has(stateProxy?.props?.actionType)) {
                const machine = new StateMachine();
                StateMachineMap.set(stateProxy?.props?.actionType, machine);
                machine.initialize(stateProxy?.props?.scanForInputStateMap, stateProxy?.props?.scanForInputStateMap.getState("base") as State);
            } else {
                StateMachineMap.get(stateProxy?.props?.actionType)?.handleState({name: "base"} as Named);
            }
            return Promise.resolve(log("base"))
        },
        base: ({stateProxy, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            const [actionType, setActionType] = stateProxy?.useState("actionType", "unassigned") || [undefined, undefined]
            // todo: review: replace log and view with a deconstructor like useState and useReducer?
            return Promise.resolve(log("base",
                <ScanForInput data-testid={"scan-for-input-field"}>
                    <FormLabel id={"scan-text-label"}>{actionType}</FormLabel>
                    <div />
                    <ClickableScanTextContainer
                        data-testid={"clickable-text-container"}
                        aria-labelledby="scan-text-label"
                        onClick={() => machine?.handleState({ name: "start scanning" } as Named)}>
                        <ScanTextDisplay data-testid={"scan-text-display"}>{ stateProxy?.props?.keyChord.reverse().join(", ") }</ScanTextDisplay>
                        <ScanNote>&nbsp;(click to set {actionType})</ScanNote>
                    </ClickableScanTextContainer>
                </ScanForInput>));
        },
        scanning: ({stateProxy, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            return Promise.resolve(log("scanning",
                <ScanForInput data-testId={"scan-for-input-field"}>
                    <ScanTextInput
                        data-testid={"scan-text-input"}
                        aria-labelledby="scan-text-label"
                        type="text"
                        value={stateProxy?.props?.keyChord.reverse().join(", ")}
                        onChange={() => {}}/>
                    <SaveButton data-testid={"save-button"} type="button" value={"Save"} onClick={() => machine?.handleState({ name: "save" } as Named)} />
                    <RevertButton data-testid={"revert-button"} type="button" value={"Cancel"} onClick={() => {
                        machine?.handleState({ name: "revert" } as Named)
                        machine?.handleState({ name: "stop scanning" } as Named)
                    }} />
                    <ClearButton data-testid={"revert-button"} type="button" value={"Clear"} onClick={() => machine?.handleState({ name: "clear" } as Named)} />
                </ScanForInput>))
        },
        "start scanning":  ({stateProxy, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            stateProxy?.props?.setScanning(true);
            // maybe add a useState "started editing" variable, and keep the scanningMap defaulted to shortcut
            //  then when we get any events from subscribe, clear it and accept the new input
            //   - or -
            //  alternatively, we may want to change the value type for scanningMap to include a "started editing" property
            stateProxy?.props?.scanningMap.set(stateProxy?.props?.actionType, []);

            stateProxy?.props?.windowKeyDownObserver((e: {(event: KeyboardEvent): void}) => {
                stateProxy?.props?.listenerMap.set(stateProxy?.props?.actionType, e);
            }, stateProxy?.props?.shouldPreventDefault).subscribe((key: string) => {
                if (!stateProxy?.props?.scanningMap.has(stateProxy?.props?.actionType)) {
                    console.log("no scanning map found, inspect previous state!");
                    return;
                }

                const assignment = assignKeyChord(stateProxy?.props?.scanningMap.get(stateProxy?.props?.actionType) || [], key, stateProxy?.props?.keyLimit)
                if (assignment.escapeCalled) {
                    // defer the current frame
                    // setTimeout(() => , 0)
                    stateProxy?.props?.stateMachineMap.get(stateProxy?.props?.actionType)?.handleState({ name: "stop scanning" } as Named)
                } else {
                    stateProxy?.props?.scanningMap.set(stateProxy?.props?.actionType, assignment.keyChord || [])
                    stateProxy?.props?.setKeyChord(assignment.keyChord || []);
                }
            })
            return Promise.resolve(log("scanning"));
        },
        "save":  ({stateProxy, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            if (stateProxy?.props?.listenerMap.has(stateProxy?.props?.actionType)) {
                window.removeEventListener("keydown", stateProxy?.props?.listenerMap.get(stateProxy?.props?.actionType)!, true);
                stateProxy?.props?.listenerMap.delete(stateProxy?.props?.actionType)
            }
            stateProxy?.props?.setScanning(false)
            const update = stateProxy?.props?.scanningMap.get(stateProxy?.props?.actionType) || [];
            stateProxy?.props?.scanningMap.delete(stateProxy?.props?.actionType);
            stateProxy?.props?.setKeyChord(update);
            stateProxy?.props?.onScan(update);
            return Promise.resolve(log("base"));
        },
        "clear":  ({stateProxy, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            stateProxy?.props?.scanningMap.set(stateProxy?.props?.actionType, []);
            stateProxy?.props?.setKeyChord([]);
            return Promise.resolve(log("scanning"))
        },
        "revert":  ({stateProxy, machine, previousState}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            // revert
            stateProxy?.props?.setKeyChord(stateProxy?.props?.shortcut);
            return Promise.resolve(log(previousState || "base"));
        },
        "stop scanning":  ({stateProxy, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            if (stateProxy?.props?.listenerMap.has(stateProxy?.props?.actionType)) {
                window.removeEventListener("keydown", stateProxy?.props?.listenerMap.get(stateProxy?.props?.actionType)!, true);
                stateProxy?.props?.listenerMap.delete(stateProxy?.props?.actionType)
            }
            stateProxy?.props?.setScanning(false)
            stateProxy?.props?.setKeyChord(stateProxy?.props?.shortcut);
            stateProxy?.props?.scanningMap.delete(stateProxy?.props?.actionType);
            stateProxy?.props?.onCancelScan(stateProxy?.props?.shortcut);
            return Promise.resolve(log("base"))
        }
    }
});

const ScanForInputField: FunctionComponent<ScanForInputProps> = ({
                                                                     actionType = "Toggle",
                                                                     shortcut,
                                                                     keyLimit = 4,
                                                                     onScan,
                                                                     onCancelScan
                                                                 }: ScanForInputProps) => {

    // display with "shift + space" etc
    // modifiers, shift, control, alt/option, maybe command, maybe just last key chords and see what happens?
    const [keyChord, setKeyChord] = useState<KeyChord>(shortcut);
    const [scanning, stateProxy?.props?.setScanning] = useState(false);
    // refresh the states with each re-render
    const scanForInputStateMap = ScanForInputStates({
        map: new Map<ActionType, State>(),
        stateMachineMap: StateMachineMap,
        listenerMap: ListenerMap,
        scanningMap: ScanningMap,
        actionType: actionType,
        keyLimit,
        shortcut,
        setScanning,
        setKeyChord,
        onScan,
        onCancelScan,
        windowKeyDownObserver: WindowKeyDownKey,
        shouldPreventDefault: true,
        window: _window
    });

    const stateMachine = () => { return StateMachineMap.get(actionType); }
    const handleState = async (name: string): Promise<State | undefined> => {
        const machine = stateMachine();

        return machine?.handleState(machine.getState(name) as State)
    }

    useEffect(() => {
        if (!StateMachineMap.has(actionType)) {
            const machine = new StateMachine();
            StateMachineMap.set(actionType, machine);
            machine.initialize(scanForInputStateMap, scanForInputStateMap.getState("base") as State);
        } else {
            StateMachineMap.get(actionType)?.handleState({ name: "base" } as Named);
        }
    }, [])

    const saveClicked = () => {
        handleState("save");
    }

    const cancelClicked = () => {
        // revert
        handleState("revert");
        handleState("stop scanning");
    }

    const clearClicked = () => {
        handleState("clear");
    }

    const scanClicked = () => {
        handleState("start scanning");
    }

    // TODO: the ClickableScanTextContainer and the ScanTextInput components present reversed keyChords from one another
    // TODO: and while reversed keyChords is cool, its confusing, as assignment to the WaveToggleConfig apparently does that
    return (
        <ScanForInput data-testid={"scan-for-input-field"}>
            <FormLabel id={"scan-text-label"}>{actionType}</FormLabel>
            <div />
            <ClickableScanTextContainer
                data-testid={"clickable-text-container"}
                aria-labelledby="scan-text-label"
                onClick={scanClicked}>
                <ScanTextDisplay data-testid={"scan-text-display"} visible={!scanning}>{ keyChord.reverse().join(", ") }</ScanTextDisplay>
                <ScanNote visible={!scanning}>&nbsp;(click to set {actionType})</ScanNote>
            </ClickableScanTextContainer>
            <ScanTextInput
                data-testid={"scan-text-input"}
                aria-labelledby="scan-text-label"
                visible={scanning} type="text"
                value={keyChord.reverse().join(", ")}
                onChange={() => {}}/>
            <SaveButton data-testid={"save-button"} visible={scanning} type="button" value={"Save"} onClick={saveClicked} />
            <RevertButton data-testid={"revert-button"} visible={scanning} type="button" value={"Cancel"} onClick={cancelClicked} />
            <ClearButton data-testid={"revert-button"} visible={scanning} type="button" value={"Clear"} onClick={clearClicked} />
        </ScanForInput>
    );
}

export default ScanForInputField;
