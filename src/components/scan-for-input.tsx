import {FunctionComponent} from "react";
import {Checkbox, FormControlLabel, FormLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {WaveAnimationControl} from "../models/options";
import * as React from "react";

const val = (fn: {(v: any): void}) => ((_: any, value: any) => fn(value));
const eventVal = (fn: {(e: any): void}) =>
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => fn(e.target);

type ScanForInputProps = {
    onScan: {(key: Key, modifier: Key): void}
    onCancelScan: {(key: Key, modifier: Key): void}
}

const ScanForInput = styled.div``;

/**
 * Modifier keys
 * key scanned
 * @param onScan
 * @param onCancelScan
 * @constructor
 */
const ScanForInputButton: FunctionComponent<ScanForInputProps> = ({ onScan, onCancelScan, actionType}: ScanForInputProps) => {
    const [downKey, setDownKey] = useState();
    const [upKey, setUpKey] = useState();

    useEffect(() => {
        // display with "shift + space" etc
        // modifiers, shift, control, alt/option, maybe command, maybe just last key chords and see what happens?
        onScan(upKey.key, downKey.key)
    }, [downKey, upKey])

    return (
        <ScanForInput>
            <FormLabel id={"notifications-checkbox-label"}>Press {actionType} button</FormLabel>
            <TextField
                id="settings__css-template"
                aria-labelledby="notifications-checkbox-label"
                value={cssTemplate}
                onKeyUp={eventVal(setUpKey)}
                onKeyDown={eventVal(setDownKey)}
                multiline
                rows={10}
                placeholder={"initial"}
                label="Text CSS Selector"
                variant="outlined"
            />
        </ScanForInput>
    );
}