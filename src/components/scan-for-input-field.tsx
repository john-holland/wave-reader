import {FunctionComponent, useEffect, useState} from "react";
import {FormLabel} from "@mui/material";
import * as React from "react";
import {KeyChord, WindowKeyDownKey} from "./util/user-input";
import styled from "styled-components";

//const val = (fn: {(v: any): void}) => ((_: any, value: any) => fn(value));
//const eventVal = (fn: {(e: any): void}) =>
//    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => fn(e.target);

type ScanForInputProps = {
    actionType: string
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
const ScanningMap: Map<string, KeyChord> = new Map<string, KeyChord>();
const ListenerMap: Map<string, EventListener> = new Map<string, EventListener>();

export const ClearScanningMap = () => {
    ScanningMap.clear();
}

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

    useEffect(() => {
        if (scanning)
            WindowKeyDownKey((e/*{(event: KeyboardEvent): void}*/) => {
                ListenerMap.set(actionType, e);
            }).subscribe((key: string) => {
                if (!ScanningMap.has(actionType)) ScanningMap.set(actionType, []);

                const assignment = assignKeyChord(ScanningMap.get(actionType) || [], key, keyLimit)
                if (assignment.escapeCalled) {
                    setScanning(false);
                    ScanningMap.set(actionType, [])
                    setKeyChord(shortcut);
                } else {
                    ScanningMap.set(actionType, assignment.keyChord || [])
                    setKeyChord(assignment.keyChord || []);
                }
            })
        else
            if (ListenerMap.has(actionType)) {
                ScanningMap.delete(actionType)
                window.removeEventListener("keydown", ListenerMap.get(actionType)!, true);
                ListenerMap.delete(actionType)
            }
    }, [scanning])

    const saveClicked = () => {
        setScanning(false)
        if (ListenerMap.has(actionType)) {
            window.removeEventListener("keydown", ListenerMap.get(actionType)!, true);
            ListenerMap.delete(actionType)
        }
        const update = ScanningMap.get(actionType) || [];
        ScanningMap.delete(actionType);
        setKeyChord(update);
        onScan(update);
    }

    const revertClicked = () => {
        // revert
        if (ListenerMap.has(actionType)) {
            window.removeEventListener("keydown", ListenerMap.get(actionType)!, true);
            ListenerMap.delete(actionType)
        }
        setKeyChord(shortcut);
        ScanningMap.delete(actionType);
        setScanning(false)
        onCancelScan(shortcut);

    }

    const clearClicked = () => {
        ScanningMap.set(actionType, []);
        setKeyChord([])
    }

    const scanClicked = () => {
        //ScanningMap.set(actionType, shortcut);
        setScanning(true);
    }

    // TODO: the ClickableScanTextContainer and the ScanTextInput components present reversed keyChords from one another
    // TODO: and while reveresed keyChords is cool, its confusing, as assignment to the WaveToggleConfig apparently does that
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
            <RevertButton data-testid={"revert-button"} visible={scanning} type="button" value={"Cancel"} onClick={revertClicked} />
            <ClearButton data-testid={"revert-button"} visible={scanning} type="button" value={"Clear"} onClick={clearClicked} />
        </ScanForInput>
    );
}

export default ScanForInputField;
