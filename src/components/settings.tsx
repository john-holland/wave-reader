import {ChangeEvent, FunctionComponent, useEffect, useState} from "react";
import Options, {WaveAnimationControl} from "../models/options";
import Text from "../models/text";

import {newSyncObject, setSyncObject} from "../util/sync";
import {
    Button,
    ButtonGroup,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel, Radio,
    RadioGroup,
    TextField
} from "@mui/material";
import Wave from "../models/wave";
import * as React from "react";

type SettingsProps = {
    initialSettings: Options;
    onUpdateSettings: {(): void}
}

const val = (fn: {(v: any): void}) => ((_: any, value: any) => fn(value));
const eventVal = (fn: {(e: any): void}) =>
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => fn(e.target.value);

// This may be a bit cleaner with redux or some other data store
//  maybe it's worth while to make something like nested('property.prop.value', object)
export const Settings: FunctionComponent<SettingsProps> = ({ initialSettings, onUpdateSettings }: SettingsProps) => {
    const [settings, setSettings] = useState(initialSettings);

    const [waveAnimationControl, setWaveAnimationControl] = useState(initialSettings.waveAnimationControl)
    const [textColor, setTextColor] = useState(initialSettings.wave.text.color);
    const [textSize, setTextSize] = useState(initialSettings.wave.text.size);
    const [selector, setSelector] = useState(initialSettings.wave.selector);
    const [cssTemplate, setCssTemplate] = useState(initialSettings.wave.cssTemplate);
    const [cssMouseTemplate, setCssMouseTemplate] = useState(initialSettings.wave.cssMouseTemplate);
    const [waveSpeed, setWaveSpeed] = useState(initialSettings.wave.waveSpeed);
    const [axisTranslateAmountXMax, setAxisTranslateAmountXMax] = useState(initialSettings.wave.axisTranslateAmountXMax);
    const [axisTranslateAmountXMin, setAxisTranslateAmountXMin] = useState(initialSettings.wave.axisTranslateAmountXMin);
    const [axisRotationAmountYMax, setAxisRotationAmountYMax] = useState(initialSettings.wave.axisRotationAmountYMax);
    const [axisRotationAmountYMin, setAxisRotationAmountYMin] = useState(initialSettings.wave.axisRotationAmountYMin);
    const [showNotifications, setShowNotifications] = useState(initialSettings.showNotifications);


    useEffect(() => {
        newSyncObject(Options, "options", Options.getDefaultOptions(), (result: Options) => {
            setSettings(result);
        });
    });

    useEffect(() => {
        setSettings(new Options({
            showNotifications,
            going: settings.going,
            waveAnimationControl,
            wave: new Wave({
                text: new Text({
                    color: textColor,
                    size: textSize
                }),
                selector,
                cssTemplate, cssMouseTemplate,
                waveSpeed,
                axisTranslateAmountXMax,
                axisTranslateAmountXMin,
                axisRotationAmountYMax,
                axisRotationAmountYMin,
            })
        }));
    }, [
        waveAnimationControl,
        showNotifications,
        textColor, textSize,
        selector,
        cssTemplate, cssMouseTemplate,
        waveSpeed,
        axisTranslateAmountXMax,
        axisTranslateAmountXMin,
        axisRotationAmountYMax,
        axisRotationAmountYMin,
    ]);

    const resetSettings = () => {
        if (window.confirm("Are you sure you want to reset the settings?")) {
            const defaultSettings = Options.getDefaultOptions();
            setSettings(defaultSettings);
            setSyncObject("options", defaultSettings, onUpdateSettings);
        }
    }

    const saveSettings = () => {
        setSyncObject("options", settings, onUpdateSettings);
    }

    // for the css template to work, we need to switch over to replacement templates instead of runtime.
    return (
        <FormControl>
            <FormLabel id={"notifications-checkbox-label"}>Show Notifications</FormLabel>
            <Checkbox aria-labelledby="notifications-checkbox-label" checked={showNotifications} onChange={val(setShowNotifications)} />
            <FormLabel id="wave-control-radio-buttons-group-label">Wave Control</FormLabel>
            <RadioGroup
                aria-labelledby="wave-control-radio-buttons-group-label"
                defaultValue={WaveAnimationControl.CSS}
                name="radio-buttons-group"
                value={waveAnimationControl}
                onChange={val(setWaveAnimationControl)}
            >
                <FormControlLabel value={WaveAnimationControl.CSS} control={<Radio />} label="CSS Animation" />
                <FormControlLabel value={WaveAnimationControl.MOUSE} control={<Radio />} label="Mouse" />
            </RadioGroup>

            <TextField id="settings__text-color" value={textColor} onChange={eventVal(setTextColor)} placeholder={"initial"} label="Text Color" variant="outlined" />
            <TextField id="settings__text-size" value={textSize} onChange={eventVal(setTextSize)} placeholder={"initial"} label="Text Size" variant="outlined" />
            <TextField id="settings__selector" value={selector} onChange={eventVal(setSelector)} placeholder={"initial"} label="Text CSS Selector" variant="outlined" />
            <TextField
                id="settings__css-template"
                value={cssTemplate}
                onChange={eventVal(setCssTemplate)}
                multiline
                rows={10}
                placeholder={"initial"}
                label="Text CSS Selector"
                variant="outlined"
            />
            <TextField
                id="settings__wave-speed"
                label="Wave Speed"
                type="number"
                value={waveSpeed}
                onChange={eventVal(setWaveSpeed)}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                id="settings__wave-translate-x-max"
                label="Axis Translation Amount X Max"
                type="number"
                value={axisTranslateAmountXMax}
                onChange={eventVal(setAxisTranslateAmountXMax)}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                id="settings__wave-translate-x-min"
                label="Axis Translation Amount X Min"
                type="number"
                value={axisTranslateAmountXMin}
                onChange={eventVal(setAxisTranslateAmountXMin)}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                id="settings__wave-rotation-y-max"
                label="Axis Rotation Amount Y Max"
                type="number"
                value={axisRotationAmountYMax}
                onChange={eventVal(setAxisRotationAmountYMax)}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                id="settings__wave-rotation-y-min"
                label="Axis Rotation Amount Y Min"
                type="number"
                value={axisRotationAmountYMin}
                onChange={eventVal(setAxisRotationAmountYMin)}
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <ButtonGroup variant="text" aria-label="text button group">
                <Button onClick={saveSettings}>Save Settings</Button>
                <Button onClick={resetSettings}>Reset</Button>
            </ButtonGroup>
        </FormControl>
    )
};