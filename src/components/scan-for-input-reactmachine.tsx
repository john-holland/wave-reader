import {
    ComponentLog,
    log,
    MachineComponentProps,
    ReactMachine,
    ReactMachineFunction,
    view,
    View,
    Clean,
    ClearViews, _Clean_, _ClearViews_
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

const ScanForInput = styled.div`
  background-color: blue
`;

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

const StateMachineMap = new Map<ActionType, StateMachine>()
// todo: service discovery for clients to prevent duplication
const PopupClient = new Client<Message<any>>()
export const ScanForInputFieldMachine: ReactMachineFunction<ScanForInputProps> = ReactMachine<ScanForInputProps>({
    client: PopupClient,
    initialState: "initialize",
    states: {
        initialize: ({state, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            if(!StateMachineMap.has(state?.props?.actionType)) {
                const machine = new StateMachine();
                StateMachineMap.set(state?.props?.actionType, machine);
                machine.initialize(state?.props?.scanForInputStateMap, state?.props?.scanForInputStateMap.getState("base") as State);
            } else {
                StateMachineMap.get(state?.props?.actionType)?.handleState({name: "base"} as Named);
            }
            return Promise.resolve(log("base", _Clean_))
        },
        base: ({state, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            const [actionType, setActionType] = state?.useState("actionType", "unassigned") || [undefined, undefined]
            // todo: review: replace log and view with a deconstructor like useState and useReducer?
            return Promise.resolve(log("base",
                <ScanForInput data-testid={"scan-for-input-field"}>
                    <FormLabel id={"scan-text-label"}>{actionType}</FormLabel>
                    <div />
                    <ClickableScanTextContainer
                        data-testid={"clickable-text-container"}
                        aria-labelledby="scan-text-label"
                        onClick={() => machine?.handleState({ name: "start scanning" } as Named)}>
                        <ScanTextDisplay data-testid={"scan-text-display"}>{ state?.props?.keyChord.reverse().join(", ") }</ScanTextDisplay>
                        <ScanNote>&nbsp;(click to set {actionType})</ScanNote>
                    </ClickableScanTextContainer>
                </ScanForInput>));
        },
        scanning: ({state, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            return Promise.resolve(log("scanning",
                <ScanForInput data-testId={"scan-for-input-field"}>
                    <ScanTextInput
                        data-testid={"scan-text-input"}
                        aria-labelledby="scan-text-label"
                        type="text"
                        value={state?.props?.keyChord.reverse().join(", ")}
                        onChange={() => {}}/>
                    <SaveButton data-testid={"save-button"} type="button" value={"Save"} onClick={() => machine?.handleState({ name: "save" } as Named)} />
                    <RevertButton data-testid={"revert-button"} type="button" value={"Cancel"} onClick={() => {
                        machine?.handleState({ name: "revert" } as Named)
                        machine?.handleState({ name: "stop scanning" } as Named)
                    }} />
                    <ClearButton data-testid={"revert-button"} type="button" value={"Clear"} onClick={() => machine?.handleState({ name: "clear" } as Named)} />
                </ScanForInput>))
        },
        "start scanning":  ({state, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            state?.props?.setScanning(true);
            // maybe add a useState "started editing" variable, and keep the scanningMap defaulted to shortcut
            //  then when we get any events from subscribe, clear it and accept the new input
            //   - or -
            //  alternatively, we may want to change the value type for scanningMap to include a "started editing" property
            state?.props?.scanningMap.set(state?.props?.actionType, []);

            state?.props?.windowKeyDownObserver((e: {(event: KeyboardEvent): void}) => {
                state?.props?.listenerMap.set(state?.props?.actionType, e);
            }, state?.props?.shouldPreventDefault).subscribe((key: string) => {
                if (!state?.props?.scanningMap.has(state?.props?.actionType)) {
                    console.log("no scanning map found, inspect previous state!");
                    return;
                }

                const assignment = assignKeyChord(state?.props?.scanningMap.get(state?.props?.actionType) || [], key, state?.props?.keyLimit)
                if (assignment.escapeCalled) {
                    // defer the current frame
                    // setTimeout(() => , 0)
                    state?.props?.stateMachineMap.get(state?.props?.actionType)?.handleState({ name: "stop scanning" } as Named)
                } else {
                    state?.props?.scanningMap.set(state?.props?.actionType, assignment.keyChord || [])
                    state?.props?.setKeyChord(assignment.keyChord || []);
                }
            })
            return Promise.resolve(log("scanning", _ClearViews_));
        },
        "clear views": ({previousState}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            return Promise.resolve(log(previousState || "base", _ClearViews_))
        },
        "clean": ({previousState}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            return Promise.resolve(log(previousState || "base", _Clean_))
        },
        "save":  async ({state, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            if (state?.props?.listenerMap.has(state?.props?.actionType)) {
                window.removeEventListener("keydown", state?.props?.listenerMap.get(state?.props?.actionType)!, true);
                state?.props?.listenerMap.delete(state?.props?.actionType)
            }
            state?.props?.setScanning(false)
            const update = state?.props?.scanningMap.get(state?.props?.actionType) || [];
            state?.props?.scanningMap.delete(state?.props?.actionType);
            state?.props?.setKeyChord(update);
            state?.props?.onScan(update);

            await machine?.handleState({ name: "clean" })

            return Promise.resolve(log("base", <span>Saved!</span>));
        },
        "clear":  ({state, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            state?.props?.scanningMap.set(state?.props?.actionType, []);
            state?.props?.setKeyChord([]);
            return Promise.resolve(log("scanning", _ClearViews_))
        },
        "revert":  ({state, machine, previousState}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            // revert
            state?.props?.setKeyChord(state?.props?.shortcut);
            return Promise.resolve(log(previousState || "base", _ClearViews_));
        },
        "stop scanning":  ({state, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            if (state?.props?.listenerMap.has(state?.props?.actionType)) {
                window.removeEventListener("keydown", state?.props?.listenerMap.get(state?.props?.actionType)!, true);
                state?.props?.listenerMap.delete(state?.props?.actionType)
            }
            state?.props?.setScanning(false)
            state?.props?.setKeyChord(state?.props?.shortcut);
            state?.props?.scanningMap.delete(state?.props?.actionType);
            state?.props?.onCancelScan(state?.props?.shortcut);
            return Promise.resolve(log("base", _Clean_))
        }
    }
});
