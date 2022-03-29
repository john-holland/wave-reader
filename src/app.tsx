import React, {FunctionComponent, useState} from 'react'
import { SelectorInput } from "./components/selector-input";
import styled from "styled-components";

//todo:
// * Material UI
// * save selector and settings with chrome sync
// * Controls: read speed, reset speed, rotation angle, wave width
//
//todo-ne:
// * scss, styled components
// * typescript, functional component style

// https://medium.com/@seanlumjy/build-a-chrome-extension-that-injects-css-into-your-favourite-website-9b65f722f409

const Wave = styled.h2`
  display: inline;
`;

const App: FunctionComponent = () => {
    const [ selector, setSelector ] = useState('p');
    const [ saved, setSaved ] = useState(true);

    const selectorClicked = () => {
        setSaved(false);
    };

    const onSaved = (selector: string) => {
        setSelector(selector);
        setSaved(true);
    };

    return (
        <div>
            <Wave>🌊</Wave>
            <SelectorInput selector={selector}
                           saved={saved}
                           selectorClicked={selectorClicked}
                           onSave={onSaved}></SelectorInput>
        </div>
    );
};

export default App;
