import React, {FunctionComponent, useEffect, useRef, useState} from 'react'; // we need this to make JSX compile
import styled from 'styled-components';

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
    saved: boolean,
    selectorClicked: () => void,
    onSave: (selector: string) => void
}

const SelectorInput: FunctionComponent<SelectorProps> = ({ selector, saved, selectorClicked, onSave }: SelectorProps) => {
    const [ selectorText, setSelectorText ] = useState(selector);

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
          onSave(selectorRef.current?.value || selector);
        }
    };

    return (
        <div>
            <SelectorTitle>Text Selector </SelectorTitle>
            <ClickableSelectorTextContainer onClick={_selectorClicked}>
                <SelectorTextDisplay visible={saved}>{ selectorText }</SelectorTextDisplay>
                <SelectorNote visible={saved}>&nbsp;(click to set selector)</SelectorNote>
            </ClickableSelectorTextContainer>
            <SelectorTextInput visible={!saved} type="text" defaultValue={selectorText} ref={selectorRef} />
            <SaveButton visible={!saved} type="button" value={"Save"} onClick={saveClicked} />
        </div>
    );
}

export default SelectorInput;