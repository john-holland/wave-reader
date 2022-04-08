import {FunctionComponent, useEffect, useState} from "react";
import styled from "styled-components";

type SelectorProps = {
    going: boolean,
    onGo: () => void
    onStop: () => void
}

export const Go = styled.input`
    height: 8rem;
    width: 8rem;
`;

const GoButton: FunctionComponent<SelectorProps> = ({ going, onGo, onStop }: SelectorProps) => {
    const [goDisplayText, setGoDisplayText] = useState('go!');

    useEffect(() => {
        if (going) {
            setGoDisplayText("waving"); // 🌊
        } else {
            setGoDisplayText("go!")
        }
    }, [going])

    const goClicked = () => {
        if (going) {
            // we want to stop if we're going
            onStop();
        } else {
            onGo();
        }
        going = !going;
    }

    return (
        <Go type={"button"} onClick={goClicked} value={goDisplayText}></Go>
    );
}

export default GoButton;
