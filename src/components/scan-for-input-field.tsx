import { FunctionComponent, useEffect, useState } from "react";
import { FormLabel } from "@mui/material";
import * as React from "react";
import { KeyChord, WindowKeyDownKey, WindowKeyDownKeyObserverDefinition } from "./util/user-input";
import styled from "styled-components";
import { CState, NameAccessMapInterface, Named, State, StateNames } from "../util/state";
import StateMachine from "../util/state-machine";

//const val = (fn: {(v: any): void}) => ((_: any, value: any) => fn(value));
//const eventVal = (fn: {(e: any): void}) =>
//    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => fn(e.target);

export type ActionType = string | undefined;
type ScanForInputProps = {
    actionType: ActionType | string
    shortcut: KeyChord
    keyLimit: number
    onScan: {(keyChord: KeyChord): void}
    onCancelScan: {(keyChord: KeyChord): void}
}

type VisibilityProps = {
    visible: boolean
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
}
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
       shouldPreventDefault = true
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
    const [scanning, setScanning] = useState(false);
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
        shouldPreventDefault: true
    });

    const stateMachine = () => { return StateMachineMap.get(actionType); }
    const handleState = (name: string): State | undefined => {
        const machine = stateMachine();

        return machine?.handleState(machine.getState(name) as Named)
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
