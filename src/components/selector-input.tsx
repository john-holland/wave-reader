import React, {FunctionComponent, useEffect, useRef, useState, useCallback} from 'react'; // we need this to make JSX compile
import styled from 'styled-components';
import {Autocomplete, Button, TextField} from "@mui/material";

const SelectorTitle = styled.h3`
    display: inline;
`;

type VisibilityProps = {
    visible: boolean
}

const SelectorTextInput = styled.input`
    display: ${((props: VisibilityProps) => props.visible ? 'inline' : 'none')}
`;

const SaveButton = styled.input`
  display: ${((props: VisibilityProps) => props.visible ? 'inline' : 'none')}
`;

const SelectorTextDisplay = styled.div`
  display: ${((props: VisibilityProps) => props.visible ? 'inline' : 'none')}
`;

const SelectorNote = styled.div`
  color: #333;
  display: ${((props: VisibilityProps) => props.visible ? 'inline' : 'none')};
`;

const ClickableSelectorTextContainer = styled.div`
  display: inline;
`;

// type ClickedCallback = () => void;
type SelectorProps = {
    selector: string,
    selectors: string[],
    saved: boolean,
    selectorClicked: () => void,
    onSave: (selector: string) => void,
    selectorModeClicked: (selectorModeOn: boolean) => void,
    selectorModeOn: boolean,
    children?: React.ReactNode
}

const SelectorInput: FunctionComponent<SelectorProps> = ({
    selector,
    selectors,
    saved,
    onSave,
    selectorModeClicked,
    selectorModeOn = false
}: SelectorProps) => {
    const [ selectorText, setSelectorText ] = useState(selector);
    const [ displaySelectors, setDisplaySelectors ] = useState([... new Set(selectors)])
    const [ isEditing, setIsEditing ] = useState(!saved);

    const selectorRef = useRef<HTMLInputElement>(null);

    // Sync with parent selector prop
    useEffect(() => {
        setSelectorText(selector);
        setIsEditing(!saved);
    }, [selector, saved]);

    // Update display selectors when selectors prop changes
    useEffect(() => {
        setDisplaySelectors([... new Set(selectors)]);
    }, [selectors]);

    const saveClicked = useCallback(() => {
        if (onSave) {
            const newSelector = selectorRef.current?.value || selectorText;
            console.log("🌊 SelectorInput: saveClicked called with selector:", newSelector);
            onSave(newSelector);
            setSelectorText(newSelector);
            setIsEditing(false);
            // Update display selectors with the new selector
            setDisplaySelectors(prev => [... new Set([...prev, newSelector])]);
        }
    }, [onSave, selectorText]);

    const onPathChange = useCallback((event: any, newValue: string | null) => {
        if (newValue) {
            console.log("🌊 SelectorInput: onPathChange called with selector:", newValue);
            setSelectorText(newValue);
            onSave(newValue);
            setIsEditing(false);
        }
    }, [onSave]);

    const onSelectorModeClicked = useCallback(() => {
        selectorModeClicked(!selectorModeOn);
    }, [selectorModeClicked, selectorModeOn]);

    const startEditing = useCallback(() => {
        setIsEditing(true);
        // Focus the input after a brief delay to ensure it's rendered
        setTimeout(() => {
            selectorRef.current?.focus();
        }, 10);
    }, []);

    const cancelEditing = useCallback(() => {
        setIsEditing(false);
        setSelectorText(selector); // Reset to original value
    }, [selector]);

    return (
        <div>
            <SelectorTitle>Text Selector </SelectorTitle>
            <ClickableSelectorTextContainer data-testid={"clickable-selector-label"} onClick={startEditing}>
                <SelectorTextDisplay visible={!isEditing}>{ selectorText }</SelectorTextDisplay>
                <SelectorNote visible={!isEditing}>&nbsp;(click to edit selector)</SelectorNote>
            </ClickableSelectorTextContainer>
            <SelectorTextInput 
                visible={isEditing} 
                type="text" 
                value={selectorText}
                onChange={(e) => setSelectorText(e.target.value)}
                ref={selectorRef} 
            />
            <SaveButton visible={isEditing} type="button" value={"Save"} onClick={saveClicked} />
            <input 
                type="button" 
                value={"Cancel"} 
                onClick={cancelEditing}
                style={{ display: isEditing ? 'inline' : 'none', marginLeft: '8px' }}
            />
            <Button onClick={onSelectorModeClicked} style={{ marginTop: '8px' }}>
                {!selectorModeOn ? "Activate Selector Mode! 🌙" : "Deactivate Selector Mode 🌚"}
            </Button>
            {/* Only show autocomplete when not editing */}
            {!isEditing && (
                <Autocomplete 
                    id="selector-dropdown"
                    className={"item"}
                    disablePortal
                    value={selectorText}
                    onChange={onPathChange}
                    options={displaySelectors || []}
                    sx={{ width: "50%", marginTop: '8px' }}
                    renderInput={(params) => <TextField {...params} label="Select from saved selectors" />} 
                />
            )}
            {/* todo: a remove button for selectors in this control might be cool */}
        </div>
    );
}

export default SelectorInput;
