import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from "styled-components";
import './styles.scss';
import SelectorInput from "./components/selector-input";
import GoButton from "./components/go-button";
import StartMessage from "./models/messages/start";
import Wave from "./models/wave";
import Options from "./models/options";
import {getSyncObject, newSyncObject, setSyncObject} from './util/sync';
import StopMessage from "./models/messages/stop";
import {fromMessage} from "./util/messages";
import {Deferred} from "./util/deferred";
import SelectorUpdated from "./models/messages/selector-updated";
import configured from './config/config';
import {guardLastError} from "./util/util";
import UpdateWaveMessage from "./models/messages/update-wave";
import {Settings, LoadSettings} from "./components/settings";

import WaveTabs from './components/wave-tabs';
import InstalledDetails = chrome.runtime.InstalledDetails;

//todo:
// * Material UI
// * Controls: read speed, reset speed, rotation angle, wave width, read duration
// * save selector and settings with chrome sync
// * keyboard shortcut toggle
// * mouse movement
// * audio from the ocean or the highway, coffee shop, or white or brown noise
//
//todo,ne:
// * NOTE: popup, chrome.runtime.sendMessage -> background, chrome.tabs.query...sendMessage -> content
// * NOTE: content, chrome.runtime.sendMessage -> background, chrome.runtime.sendMessage -> popup
// * use BootstrapMessage to get the chrome.storage.local `waving` parameter, and use that as `going`
// * scss, styled components
// * typescript, functional component style

// https://medium.com/@seanlumjy/build-a-chrome-extension-that-injects-css-into-your-favourite-website-9b65f722f409

const WaveReader = styled.div`
  width: 800px;
`;

const startPageCss = (wave: Wave) => {
    chrome.runtime.sendMessage(new StartMessage({
    //popupPort.postMessage(new StartMessage({
        wave: wave.update()
    }));

    setSyncObject("going", { going: true });

    newSyncObject<Options>(Options,'options', Options.getDefaultOptions(), (options) => {
        if (options.showNotifications) {
            const notifOptions = {
                type: "basic",
                iconUrl: "icons/waver48.png",
                title: "wave reader",
                message: "reading",
            };

            // @ts-ignore
            chrome.notifications.create("", notifOptions, guardLastError);
        }
    })
}

const stopPageCss = () => {
    chrome.runtime.sendMessage(new StopMessage());
    setSyncObject("going", { going: false });
}

const deferredOptions = new Deferred<Options>(() => {
    return new Promise((resolve, reject) => {
        try {
            newSyncObject<Options>(Options,'options', Options.getDefaultOptions(), (result) => {
                resolve(result);
            });
        } catch (e) {
            reject(e);
        }
    });
})

const bootstrapCondition = (going: boolean) => {
    deferredOptions.waitFor().then((options) => {
        options = new Options(options);
        setTimeout(() => {
            if (going && options) {
                chrome.runtime.sendMessage(new StartMessage({
                    wave: options.wave.update()
                }))
            } else {
                chrome.runtime.sendMessage(new StopMessage())
            }
        }, 3000);
    });
}

const App: FunctionComponent = () => {
    const [ selector, setSelector ] = useState('p');
    const [ saved, setSaved ] = useState(true);
    const [ going, setGoing ] = useState(false);
    const [ options, setOptions ] = useState<Options>(Options.getDefaultOptions());

    useEffect(() => {
        LoadSettings().then(setOptions)
    }, []);

    const selectorClicked = () => {
        setSaved(false);
    };

    const onSaved = (selector: string) => {
        setSelector(selector);
        setSaved(true);
        selectorUpdated(new SelectorUpdated({ selector })).then(() => {
            chrome.runtime.sendMessage(new UpdateWaveMessage({
                wave: options.wave
            }))
        });
    };

    const onGo = () => {
        setGoing(true);

        newSyncObject<Options>(Options, "options", Options.getDefaultOptions(), (result) => {
            result.going = true;
            setSyncObject("options", result)
            // use workboots and send message with wave params to interpolate css
            startPageCss(result.wave);
        });
    }

    const onStop = () => {
        setGoing(false);
        stopPageCss();
    }

    const selectorUpdated = async (message: SelectorUpdated) => {
        setSelector(message.selector || 'p');
        options.wave.selector = message.selector;
        options.wave.update();
        deferredOptions.waitFor().then((options) => {
            if (options) {
                setSyncObject('options', options);
            } else {
                throw new Error("empty options");
            }
        });
        deferredOptions.update();
    }

    const settingsUpdated = () => {
        newSyncObject<Options>(Options, "options", Options.getDefaultOptions(), (result: Options) => {
            setOptions(result);
            chrome.runtime.sendMessage(new UpdateWaveMessage({
                //popupPort.postMessage(new StartMessage({
                wave: result.wave
            }));
        });
    }

    useEffect(() => {
        deferredOptions.subscribe((options: Options = Options.getDefaultOptions(), error?: any) => {
            if (error) {
                console.log(error);
                if (!options) return;
            }
            setOptions(options);
            setSelector(options?.wave?.selector || 'p');
        });

        if (configured.mode === "production") {
            window.onblur = () => {
                window.close();
            }
        }

        chrome.runtime.onInstalled.addListener((details: InstalledDetails) => {
            console.log(`install details: ${details}`);
            // upon first load, get a default value for 'going'
            getSyncObject("going", { going: false }, (result) => {
                setGoing(result.going);

                // use result.going as useState is an async call
                bootstrapCondition(result.going);

                chrome.runtime.onMessage.addListener((message: any) => {
                    const typedMessage = fromMessage(message);

                    switch (typeof typedMessage) {
                        // case typeof BootstrapMessage:
                        //     bootstrapCondition();
                        //     break;
                        case typeof SelectorUpdated:
                            selectorUpdated(message);
                            break;
                        default:
                            console.log(`${typeof typedMessage} unhandled typed message from content script`)
                    }

                    return true;
                });
            });
        });
    }, []);

    return (
        <WaveReader>
            <GoButton onGo={onGo} onStop={onStop} going={going}/>
            <WaveTabs>
                <SelectorInput
                    tab-name={"Selector"}
                    selector={selector}
                    saved={saved}
                    selectorClicked={selectorClicked}
                    onSave={onSaved}>
                </SelectorInput>
                <Settings
                    tab-name={"Settings"}
                    initialSettings={options}
                    onUpdateSettings={settingsUpdated}>
                </Settings>
            </WaveTabs>
        </WaveReader>
    );
};

export default App;
