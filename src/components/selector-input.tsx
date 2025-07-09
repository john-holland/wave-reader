import React, {FunctionComponent, useEffect, useRef, useState} from 'react'; // we need this to make JSX compile
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
    selectorClicked,
    onSave,
    selectorModeClicked,
    selectorModeOn = false
}: SelectorProps) => {
    const [ selectorText, setSelectorText ] = useState(selector);
    const [ displaySelectors, setDisplaySelectors ] = useState([... new Set(selectors)])

    const selectorRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        //if (selectorRef.current?.value) {
            setSelectorText(selector);
        //}
    }, [selector, selectorRef]);

    const _selectorClicked = () => {
        if (selectorClicked) {
          selectorClicked();
        }
    };

    const saveClicked = () => {
        if (onSave) {
            const newSelector = selectorRef.current?.value || selector
            console.log("🌊 SelectorInput: saveClicked called with selector:", newSelector);
            onSave(newSelector);
            setDisplaySelectors([... new Set(selectors.concat([newSelector]))])
        }
    };

    const onPathChange = (event: any, newValue: string | null) => {
        if (newValue) {
            console.log("🌊 SelectorInput: onPathChange called with selector:", newValue);
            setSelectorText(newValue);
            onSave(newValue);
        }
    }

    const onSelectorModeClicked = () => {
        selectorModeClicked(selectorModeOn)
    }

    return (
        <div>
            <SelectorTitle>Text Selector </SelectorTitle>
            <ClickableSelectorTextContainer data-testid={"clickable-selector-label"} onClick={_selectorClicked}>
                <SelectorTextDisplay visible={saved}>{ selectorText }</SelectorTextDisplay>
                <SelectorNote visible={saved}>&nbsp;(click to set selector)</SelectorNote>
            </ClickableSelectorTextContainer>
            <SelectorTextInput visible={!saved} type="text" defaultValue={selectorText} ref={selectorRef} />
            <SaveButton visible={!saved} type="button" value={"Save"} onClick={saveClicked} />
            <Button onClick={onSelectorModeClicked}>{!selectorModeOn ? "Activate Selector Mode! 🌙" : "Deactivate Selector Mode 🌚"}</Button>
            <Autocomplete id="selector-dropdown"
                          className={"item"}
                          disablePortal
                          value={selector}
                          onChange={onPathChange}
                          options={displaySelectors || []}
                          sx={{ width: "50%" }}
                          renderInput={(params) => <TextField {...params} label={selector} />} />
            {/* todo: a remove button for selectors in this control might be cool */}

        </div>
    );
}

export default SelectorInput;
