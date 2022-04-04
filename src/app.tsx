import React, {FunctionComponent, useState} from 'react'
import { SelectorInput } from "./components/selector-input";
import styled from "styled-components";
import {GoButton} from "./components/go-button";
import StartMessage from "./models/messages/start";
import Wave from "./models/wave";
import Tab = chrome.tabs.Tab;
import Options from "./models/options";
import { getSyncObject } from './util/sync';

//todo:
// * Material UI
// * save selector and settings with chrome sync
// * Controls: read speed, reset speed, rotation angle, wave width, read duration
//
//todo-ne:
// * scss, styled components
// * typescript, functional component style

// https://medium.com/@seanlumjy/build-a-chrome-extension-that-injects-css-into-your-favourite-website-9b65f722f409

const WaveSymbol = styled.h2`
  display: inline;
`;

const startPageCss = (wave: Wave) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: Tab[]) => {
        chrome.tabs.sendMessage(tabs[0].id as number, new StartMessage({
            wave
        }));
        // chrome.storage.sync.set({ image: inputTxt.value }, () => {});
    });

    getSyncObject<Options>('options', Options.getDefaultOptions(), (options) => {
        if (options.attributes.showNotifications) {
            const notifOptions = {
                type: "basic",
                iconUrl: "images/background48.png",
                title: "🌊",
                message: "reading",
            };
            chrome.notifications.create("", notifOptions, function () {
                console.log("Last error:", chrome.runtime.lastError);
            });
        }
    })
}

const stopPageCss = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { cmd: "clearBg" });

        chrome.storage.sync.set({ image: "" }, () => {});
    });
}

function convertIntoCss(url) {
    const css = `html body { 
        background: url(${url}); \n
        image-rendering: crisp-edges; \n        
        image-rendering: -webkit-optimize-contrast; \n
        background-size:     cover; \n
        background-repeat:   no-repeat; \n
        background-position: center center; \n    
      }\n`;
    return css;
}

const App: FunctionComponent = () => {
    const [ selector, setSelector ] = useState('p');
    const [ saved, setSaved ] = useState(true);
    const [ going, setGoing ] = useState(false);

    const selectorClicked = () => {
        setSaved(false);
    };

    const onSaved = (selector: string) => {
        setSelector(selector);
        setSaved(true);
    };

    const onGo = () => {
        setGoing(true);
        // use workboots and send message with wave params to interpolate css
        startPageCss(selector);
    }

    const onStop = () => {
        setGoing(false);
        stopPageCss();
    }

    return (
        <div>
            <WaveSymbol>🌊</WaveSymbol>
            <SelectorInput selector={selector}
                           saved={saved}
                           selectorClicked={selectorClicked}
                           onSave={onSaved}></SelectorInput>
            <GoButton onGo={onGo} onStop={onStop} going={going}></GoButton>
        </div>
    );
};

export default App;
