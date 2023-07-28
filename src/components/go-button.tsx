import React, {FunctionComponent, ReactNode, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {Button} from "@mui/material";

type SelectorProps = {
    going: boolean,
    onGo: () => void
    onStop: () => void
}

export const Go = styled(Button)`
    height: 4rem;
    width: 8rem;
    font-family: "Roboto","Helvetica","Arial",sans-serif;
    text-transform: uppercase;
  
`;
const WaveTypography = styled.h2`
  display: inline;
  font-size: 5rem!important;
  margin-right: 0.1rem;
  border-right: 0.1rem transparent;
  border-radius: 1rem;
  transition:font-size 3s;
  
  .wave {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 1em;
    height: 1em;
    display: inline-block;
    fill: currentColor;
    -webkit-flex-shrink: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }
  
  .shrink {
    font-size: 2rem;
    transition:font-size 12s;
  }
`;

type WaveProps = {
    children?: ReactNode
}

/* eslint-disable  @typescript-eslint/no-unused-vars */
const WaveSymbol = ({
 children
}: WaveProps) => {
    return <WaveTypography>{children}</WaveTypography>;
}


const GoButton: FunctionComponent<SelectorProps> = ({ going, onGo, onStop }: SelectorProps) => {
    const [goDisplayText, setGoDisplayText] = useState('go!');
    const goButtonRef = useRef<HTMLElement | null>();

    useEffect(() => {
        if (going) {
            setGoDisplayText("waving"); // 🌊
        } else {
            setGoDisplayText("go!")
        }
    }, [going]);

    useEffect(() => {
        if ((goButtonRef.current as HTMLElement | null) !== null) {
            setTimeout(() => {
                (goButtonRef.current as unknown as HTMLElement).classList.add("shrink");
            }, 0);
        }
    }, [goButtonRef])

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
        <Go variant="outlined" startIcon={<WaveSymbol><span className={'wave'} ref={el => goButtonRef.current = el}>🌊</span></WaveSymbol>}
            type={"button"} onClick={goClicked}>{goDisplayText}</Go>
    );
}

export default GoButton;
