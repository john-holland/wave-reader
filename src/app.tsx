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
import {CState, NameAccessMapInterface, State, StateNames} from "./util/state";
import {WindowKeyDownKey} from "./components/util/user-input";
import StateMachine from "./util/state-machine";

import SettingsService from "./services/settings";
import SelectorService from "./services/selector";
import {Observer} from "rxjs";

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

const settingsService = new SettingsService();
const selectorService = new SelectorService(settingsService);

const startPageCss = (wave: Wave) => {
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
        options.wave = wave.update();
        chrome.runtime.sendMessage(new StartMessage({
            options: options
        }));

        setSyncObject("going", { going: true });
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
                options.wave = options.wave.update();
                chrome.runtime.sendMessage(new StartMessage({
                    options: options
                }));
            } else if (!going && options) {
                chrome.runtime.sendMessage(new UpdateWaveMessage({ options }))
            } else {
                chrome.runtime.sendMessage(new StopMessage())
            }
        }, 3000);
    });
}

const getGoingChromeStorage = (callback: { going: boolean }) => getSyncObject("going", { going: false }, g => callback(g));

const getGoingAsync = async (): Promise<boolean> => new Promise((resolve) => getGoingChromeStorage(resolve));

/**
 *
 */

type AppStatesProps = {
    machine: StateMachine,
    map: Map<string, State>,
    setState: { (state: string): State }
    setGoing: { (going: boolean): void },
    getGoing: { (): boolean },
    _getGoingAsync: { (): boolean },
    setOptions: { (options: Options): void },
    bootstrapCondition: { (going: boolean): void },
    onRunTimeInstalledListener: { (details: InstalledDetails): void },
    onMessageListener: { (message: any): boolean},
    optionsObserver: Observer<Options>
}

const chromeRunTimeInstalledListener = (callback: {(details: InstalledDetails): void}) => {
    // maybe direct assignment would be prettier but i'm not sure if ts binds [tbis] for class method dispatch
    chrome.runtime.onInstalled.addListener(callback);
}

const chromeOnMessageListener = (callback: { (message: any): boolean }) => {
    chrome.runtime.onMessage.addListener(callback);
}

export const AppStates = ({
    machine,
    setState = (state) => {
        /* eslint-disable  @typescript-eslint/no-unused-vars */
        const resultState = machine.handleState(machine.getState(state));
        // TODO: update settings with state property
        //settingsService.updateCurrentSettings(settings => settings.state)
    },
    map = new Map<string, State>(),
    setGoing,
    getGoingLocal,
    _getGoingAsync = getGoingAsync,
    setOptions,
    bootstrapCondition,
    onRunTimeInstalledListener = chromeRunTimeInstalledListener,
    onMessageListener = chromeOnMessageListener,
    optionsObserver
}: AppStatesProps): NameAccessMapInterface => {
    /* eslint-disable  @typescript-eslint/no-unused-vars */
    const states: StateNames = {
        "base": CState("base", ["base", "bootstrap", "settings updated"], true, () => {
            return states.get("base")
        }),
        "bootstrap": CState("bootstrap", ["base"], true, async (message, state, previousState) => {
            if (getGoingLocal === undefined) {
                const going = await _getGoingAsync() || false;
                setGoing(going);
                bootstrapCondition(going);
            }

            onRunTimeInstalledListener((details: InstalledDetails) => {
                console.log(`install details: ${details}`);
                // upon first load, get a default value for 'going'
                getSyncObject("going", {going: false}, (result) => {
                    setGoing(result.going);

                    // use result.going as useState is an async call
                    bootstrapCondition(result.going);

                    onMessageListener((message: any) => {
                        const typedMessage = fromMessage(message);

                        switch (typeof typedMessage) {
                            // case typeof BootstrapMessage:
                            //     bootstrapCondition();
                            //     break;
                            case typeof SelectorUpdated:
                                machine.handleState(message);
                                break;
                            default:
                                console.log(`${typeof typedMessage} unhandled typed message from content script`)
                        }

                        return true;
                    });
                });

            });
            LoadSettings().then(setOptions)
            return states.get("base");
        }),
        "settings updated": CState("settings updated", ["base"], true, async (message, state, previousState) => {
            setSelector(message.selector || 'p');
            await settingsService.updateCurrentSettings((options) => {
                options.wave.selector = message.selector;
                options.wave.update();
                return options;
            })
            return previousState
        }),
        // selector selection mode
        "selection mode activate": CState("selection mode activate", ["selection mode active"], true, (message, state, previousState) => {
            return states.get("selection mode active")
        }),
        "selection mode active": CState("selection mode active", ["selection made", "selection error report", "settings updated"], false, (message, state, previousState) => {
            //  (disable settings tab)
            return states.get("selection mode active")

            // return states.get("selection made (enable settings tab)")
        }),
        "selection made (enable settings tab)": CState("selection made (enable settings tab)", ["base"], false, (message, state, previousState) => {
            return states.get("base")
        }),
        "selection error report (user error, set red selection error note, revert to previous selector)": CState("selection error report (user error, set red selection error note, revert to previous selector)", ["base"], false, (message, state, previousState) => {
            // todo: maybe this isn't necessary -- it would be neat to have super states so the
            //   dependent state machines could know when not to be active
            return states.get("selection mode active")
        }),
        // selectors!
        // add
        "start add selector": CState("start add selector", ["add selector", "cancel add selector"], false, (message, state, previousState) => {
            // TODO: need a selector choose drop down component
            return states.get("add selector")
        }),
        "add selector": CState("add selector", ["base"], false, (message, state, previousState) => {
                // selectorUpdated(message)
            return states.get("base")
        }),
        "cancel add selector": CState("cancel add selector", ["base"], false, (message, state, previousState) => {
            return states.get("base")
        }),
        // remove
        "remove selector": CState("remove selector", ["confirm remove selector", "cancel remove selector"], false, (message, state, previousState) => {
            return states.get("confirm remove selector")
        }),
        "confirm remove selector": CState("confirm remove selector", ["base"], false, (message, state, previousState) => {
            return states.get("base")
        }),
        "cancel remove selector": CState("cancel remove selector", ["base"], false, (message, state, previousState) => {
            return states.get("base")}),
        // use
        "use selector": CState("use selector", ["base"], false, (message, state, previousState) => {
            return states.get("base")
        }),
        // ~~ waves ~~
        "start waving": CState("start waving", ["base"], true, (message, state, previousState) => {
            return states.get("waving")
        }),
        "waving": CState("start waving", ["stop wave", "settings updated"], false, (message, state, previousState) => {
            return states.get("waving")
        }),
        "stop waving": CState("stop waving", ["base"], false, (message, state, previousState) => {
            return states.get("base")
        }),
    };

    Object.keys(states).forEach(state => map.set(state, states[state]))

    return new class implements NameAccessMapInterface {
        getState(name: string): State | undefined {
            return map.get(name);
        }
    }
}



const App: FunctionComponent = () => {
    const [ selector, setSelector ] = useState('p');
    const [ saved, setSaved ] = useState(true);
    const [ going, setGoing ] = useState(false);
    const [ options, setOptions ] = useState<Options>(Options.getDefaultOptions());

    useEffect(() => {
        LoadSettings().then(setOptions)
    }, []);

    // [sm] start add selector
    const selectorClicked = () => {
        setSaved(false);
    };

    // [sm] add selector
    const onSaved = (selector: string) => {
        setSelector(selector);
        setSaved(true);
        selectorUpdated(new SelectorUpdated({ selector })).then(() => {
            chrome.runtime.sendMessage(new UpdateWaveMessage({
                options: options
            }))
        });
    };

    // [sm] start waving
    const onGo = () => {
        setGoing(true);

        newSyncObject<Options>(Options, "options", Options.getDefaultOptions(), (result) => {
            result.going = true;
            setSyncObject("options", result)
            // use workboots and send message with wave params to interpolate css
            startPageCss(result.wave);
        });
    }

    // [sm] stop waving
    const onStop = () => {
        setGoing(false);
        stopPageCss();
    }

    // [sm] use selector / add selector
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

    // [sm] settings updated
    // TODO: when we can't reach the tab, we want to instruct the user to try refreshing the tab, then the browser
    const settingsUpdated = () => {
        newSyncObject<Options>(Options, "options", Options.getDefaultOptions(), (result: Options) => {
            result.wave = result.wave.update();
            setOptions(result);
            chrome.runtime.sendMessage(new UpdateWaveMessage({
                options: result
            }));
        });
    }

    // [sm] settings update / bootstrap
    useEffect(() => {
        // TODO: this needs a revision to send a start or update message depending on the state of "going" in google sync
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
        // [sm] bootstrap
        getSyncObject("going", { going: false }, (result) => {
            setGoing(result.going);
        });

        // [sm] bootstrap
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
