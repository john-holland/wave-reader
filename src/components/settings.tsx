import { FunctionComponent, useEffect, useState } from "react";
import { WaveAnimationControl } from "../models/defaults";
import Options, {WaveToggleConfig} from "../models/options";
import Text from "../models/text";

import {getSyncObject, newSyncObject, setSyncObject} from "../util/sync";
import {
    Autocomplete,
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
import styled from "styled-components";
import ScanForInputField from "./scan-for-input-field";
import {KeyChord} from "./util/user-input";
import SettingsService, {DomainPaths, SettingsDAOInterface} from "../services/settings";

type SettingsProps = {
    initialSettings: Options;
    onUpdateSettings: {( settings: Options ): void},
    domain: string,
    path: string,
    onDomainPathChange: {(domain: string, path: string): void}
    settingsService: SettingsDAOInterface
}

const SettingsStyleContainer = styled.div`
  width: 100%;
  
  .form-control {
    display: flex!important;
    height: 600px;
    width: 100%;
    align-items: baseline;
    flex-wrap: wrap!important;
    justify-content: space-evenly;
    align-content: space-between;
    flex-flow: column;
    flex-direction: column;
    
    & > * {
      margin: 1em!important;
    }
  }
`;

type AutocompleteOption = string;

const DomainPathContainer = styled.div`
  display: flex;
  flex-flow: row;
`

const val = (fn: {(v: any): void}) => ((_: any, value: any) => fn(value));
const eventVal = (fn: {(e: any): void}) =>
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => fn(e.target.value);

// This may be a bit cleaner with redux or some other data store
//  maybe it's worth while to make something like nested('property.prop.value', object)
/**
 * TODO: copy for current tab button
 *
 * todo: toggle for settings ???
 * @param initialSettings the initial settings object, use [Option.getDefaultOptions()] for defaults
 * @param onUpdateSettings evented update callback
 * @param domain the domain for the given initialSettings
 * @param path the path for the given initialSettings
 * @param onDomainPathChange domain change event
 * @param settingsService self described
 * @constructor
 */
export const Settings: FunctionComponent<SettingsProps> = ({
    initialSettings,
    onUpdateSettings,
    domain,
    path,
    onDomainPathChange,
    settingsService = new SettingsService()
}: SettingsProps) => {

    const [settings, setSettings] = useState(new Options(initialSettings));
    const typedSetSettings = (deltaSettings: Partial<Options> = settings) => setSettings(new Options(deltaSettings));

    const [domainPaths, setDomainPaths] = useState<DomainPaths[]>([])
    const [currentPath, setCurrentPath] = useState(path)
    const [currentDomain, setCurrentDomain] = useState(domain)
    const [editingDomain, setEditingDomain] = useState(domain)

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
    const [toggleKeys, setToggleKeys] = useState(initialSettings.toggleKeys)

    useEffect(() => {
        settingsService.getDomainsAndPaths().then(setDomainPaths)
    }, [])

    useEffect(() => {
        typedSetSettings({
            showNotifications,
            going: settings.going,
            waveAnimationControl,
            toggleKeys,
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
        });
        setEditingDomain(currentDomain)
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
        toggleKeys
    ]);

    const resetSettings = () => {
        if (window.confirm("Are you sure you want to reset the settings?")) {
            const defaultSettings = Options.getDefaultOptions();
            saveSettings(defaultSettings);
        }
    }

    const saveSettings = (deltaSettings?: Partial<Options>) => {
        const settingsToSave: Options = new Options({
                    showNotifications,
                    going: settings.going || false,
                    waveAnimationControl,
                    toggleKeys,
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
                    }),
            ...deltaSettings});

        setSettings(settingsToSave);
        onUpdateSettings(settingsToSave);
    }

    const onToggleScan = (keyChord: KeyChord) => {
        setToggleKeys(new WaveToggleConfig({
            keyChord
        }))
    }

    const onCancelToggleScan = (keyChord: KeyChord) => {
        // maybe unnecessary
        setToggleKeys(new WaveToggleConfig({
            keyChord
        }))
    }

    const onDomainChange = (event: any, newValue: string | null) => {
        if (newValue && newValue !== currentDomain) {
            setCurrentDomain(newValue);
            onDomainPathChange(newValue, currentPath);
        }
    }

    const onPathChange = (event: any, newValue: string | null) => {
        if (newValue && (newValue !== currentPath || (newValue === currentPath && currentDomain != domain))) {
            setCurrentPath(newValue);
            onDomainPathChange(currentDomain, newValue);
        }
    }

    // for the css template to work, we need to switch over to replacement templates instead of runtime.
    return (
        <SettingsStyleContainer>
            <FormControl className={"form-control"}>
                <FormLabel id={"notifications-checkbox-label"}>Show Notifications</FormLabel>
                <Checkbox aria-labelledby="notifications-checkbox-label" checked={showNotifications} onChange={val(setShowNotifications)} />
                <ScanForInputField actionType={"Wave Toggle"}
                                   keyLimit={4}
                                   shortcut={toggleKeys.keyChord}
                                   onScan={onToggleScan}
                                   onCancelScan={onCancelToggleScan} />

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
                    id="settings__css-template"
                    value={cssMouseTemplate}
                    onChange={eventVal(setCssMouseTemplate)}
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

                <DomainPathContainer>
                    <Autocomplete
                        disablePortal
                        id="domain-settings-dropdown"
                        value={currentDomain}
                        onChange={onDomainChange}
                        options={domainPaths.map(dp => dp.domain)}
                        sx={{ width: "50%" }}
                        renderInput={(params) => <TextField {...params} label={currentDomain} />}
                    />

                    <Autocomplete
                        disablePortal
                        id="path-settings-dropdown"
                        value={currentPath}
                        onChange={onPathChange}
                        options={domainPaths.find((dp: DomainPaths) => dp.domain === currentDomain)?.paths as string[]}
                        sx={{ width: "50%" }}
                        renderInput={(params) => <TextField {...params} label={currentPath} />}
                    />
                </DomainPathContainer>

            </FormControl>
            <ButtonGroup variant="text" aria-label="text button group">
                <Button onClick={() => saveSettings()}>Save Settings</Button>
                <Button onClick={resetSettings}>Reset</Button>
            </ButtonGroup>
        </SettingsStyleContainer>
    )
};

export const LoadSettings = (settingsService: SettingsDAOInterface) : Promise<Options> => {
        try {
            return settingsService.getCurrentSettings()
        } catch (e) {
            console.error(`cannot load options with exception: ${e}`);
            //throw(new Error(`cannot load options with exception: ${e}`))
            const defaultSettings = Options.getDefaultOptions()
            defaultSettings.defaultSettings = true;
            return Promise.resolve(defaultSettings)
        }
}