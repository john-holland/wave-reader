import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from "styled-components";
import './styles.scss';
import SelectorInput from "./components/selector-input";
import GoButton from "./components/go-button";
import StartMessage from "./models/messages/start";
import Wave from "./models/wave";
import Options from "./models/options";
import {getSyncObject, GetSyncObjectFunction, newSyncObject, setSyncObject} from './util/sync';
import StopMessage from "./models/messages/stop";
import {fromMessage} from "./util/messages";
import SelectorUpdated from "./models/messages/selector-updated";
// todo: this should work, but jest returns a config is not defined
import configured from './config/config';
// todo: slightly less data driven shim
const isDevelopment = configured.mode !== 'production'; //process.env.NODE_ENV !== 'production';
import { guardLastError } from "./util/util";
import UpdateWaveMessage from "./models/messages/update-wave";
import { Settings } from "./components/settings";

import WaveTabs from './components/wave-tabs';
import InstalledDetails = chrome.runtime.InstalledDetails;
import {CState, NameAccessMapInterface, Named, State, StateNames} from "./util/state";
import StateMachine from "./util/state-machine";

import SettingsService from "./services/settings";
//import SelectorService from "./services/selector";
import {Observer} from "rxjs";

//todo:
// * Material UI
// * Controls: read speed, reset speed, rotation angle, wave width, read duration
// * save selector and settings with chrome sync
// * keyboard shortcut toggle
// * mouse movement
// * audio from the ocean or the highway, coffee shop, or white or brown noise
// * education ([Orton Gillingham](https://en.wikipedia.org/wiki/Orton-Gillingham) &
//              [Phonics](https://en.wikipedia.org/wiki/Phonics)) & about page
// * support for right to left, top to bottom etc, perhaps a "direction" option as a toggle switch in the settings menu?
// * maybe a 3d swirl wave for the F-shaped pattern readers?
//      https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
//      https://en.wikipedia.org/wiki/Screen_reading
// * a css animation stop per row on the active viewport could be cool and would support the layer cake pattern if
//     we added stops at each horizontal
//     or possibly add a F-shaped layer cake swirl that would 3d swirl each layer cake section as a hybrid?
//         https://www.nngroup.com/articles/layer-cake-pattern-scanning/
// * add an "advanced settings" option (that saves), to show the css, and default false
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
//const selectorService = new SelectorService(settingsService);

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

const bootstrapConditionSettingsSetState = (going: boolean): Promise<Options> => {
    return settingsService.getCurrentSettings().then((options) => {
        return new Promise((resolve) => {
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
                resolve(options);
            }, 100);
        });
    });
}
type GoingBox = {
    going: boolean
}
const getGoingChromeStorage = (callback: { (going: boolean): void }) => getSyncObject("going", { going: false }, (result: GoingBox) => callback(result.going));

const getGoingAsync = async (): Promise<boolean> => new Promise((resolve) => getGoingChromeStorage(resolve));

type AppStatesProps = {
    machine: StateMachine,
    settingsService: SettingsService
    originState: string,
    map: Map<string, State>,
    setState: { (state: string | Named): Promise<State> }
    setGoing: { (going: boolean): void },
    getGoing: { (): boolean },
    _getGoingAsync: { (): Promise<boolean> },
    setOptions: { (options: Options): void },
    bootstrapCondition: { (going: boolean): Promise<Options> },
    onRunTimeInstalledListener: { (callback: {(details: InstalledDetails): void }): void },
    onMessageListener: { (callback: {(message: any): boolean}): void },
    optionsObserver: Observer<Options>
    getSyncObject_Going: GetSyncObjectFunction<GoingStorageProxy>
    bootstrapLock: SetReset
}

const chromeRunTimeInstalledListener = (callback: {(details: InstalledDetails): void}) => {
    // maybe direct assignment would be prettier but i'm not sure if ts binds [this] for class method dispatch
    chrome.runtime.onInstalled.addListener(callback);
}

const chromeOnMessageListener = (callback: { (message: any): boolean }) => {
    chrome.runtime.onMessage.addListener(callback);
}

export type GoingStorageProxy = {
    going: boolean
}

export class SetReset {
    private _set: boolean
    private name: string

    private constructor(name: string = "unnamed lock", set: boolean = false) {
        this.name = name;
        this._set = set
    }

    reset() {
        console.log(`set called for ${this.name}`)
        this._set = false;
    }

    set() {
        console.log(`set called for ${this.name}`)
        this._set = true;
    }

    getSet() {
        return this._set;
    }

    static set(name: string) {
        console.log(`created set for ${this.name}`)
        return new SetReset(name, true);
    }
    static unset(name: string) {
        console.log(`created unset for ${this.name}`)
        return new SetReset(name, false);
    }
}

//todo chrome.runtime.onSuspend() handle this method and save state
export const AppStates = ({
  /* eslint-disable: typescript-eslint/no-unused-vars */
    machine = new StateMachine(),
    settingsService,
    originState = "base",
    // setState = async (state): Promise<State> => {
    // todo: we should use state machine observable to support state tracking and auto saving
    // },
    map = new Map<string, State>(),
    setGoing = (going) => { console.error("unset setGoing method in AppStates, goiing: ", going); },
    //getGoing = () => { console.error("unset setGoing method in AppStates"); return false; },
    _getGoingAsync = getGoingAsync,
    //setOptions = (options) => { settingsService?.updateCurrentSettings(_ => options)},
    bootstrapCondition = bootstrapConditionSettingsSetState,
    onRunTimeInstalledListener = chromeRunTimeInstalledListener,
    onMessageListener = chromeOnMessageListener,
    getSyncObject_Going = getSyncObject,
    bootstrapLock = SetReset.unset("bootstrap-lock")
/* eslint-enable: typescript-eslint/no-unused-vars */
}: Partial<AppStatesProps>): NameAccessMapInterface => {
    /* eslint-disable  @typescript-eslint/no-unused-vars */
    const states: StateNames = {
        "base": CState("base", ["base", "bootstrap", "settings updated"], true, () => {
            return machine?.getState("base")
        }),
        "bootstrap": CState("bootstrap", ["base"], true, async (message, state, previousState): Promise<State> => {
            if (!bootstrapLock.getSet()) {
                const going = (await _getGoingAsync()) || false;
                setGoing(going);
                bootstrapCondition(going).then(options => {
                    machine?.handleState(options.state || machine?.getState(originState) as State).then(state => {
                        settingsService?.updateCurrentSettings(update => {
                            // check sub state? or let it error, and design better???
                            update.state = state;
                            return update;
                        });
                    });
                });
                bootstrapLock.set()
            }

            onRunTimeInstalledListener((details: InstalledDetails) => {
                console.log(`install details: ${details}`);
                // upon first load, get a default value for 'going'
                getSyncObject_Going("going", {going: false}, (result) => {
                    onMessageListener((message: any) => {
                        const typedMessage = fromMessage(message);

                        machine?.handleState(typedMessage);

                        // switch (typeof typedMessage) {
                        //     // case typeof BootstrapMessage:
                        //     //     bootstrapCondition();
                        //     //     break;
                        //     case typeof SelectorUpdated:
                        //         machine?.handleState(message);
                        //         break;
                        //     default:
                        //         console.log(`${typeof typedMessage} unhandled typed message from content script`)
                        // }

                        return true;
                    });
                });

            });

            return machine?.getState("base") as State;
        }),
        "update": CState("update", ["base"], true, async (message, state, previousState) => {
            const settingsUpdated = message as UpdateWaveMessage;
            await settingsService?.updateCurrentSettings((options) => {
                (settingsUpdated.options as Options).wave.selector = settingsUpdated?.options?.wave.selector;
                (settingsUpdated.options as Options).wave.update();
                return settingsUpdated.options as Options;
            })
            return previousState
        }),
        // selector selection mode
        "selection mode activate": CState("selection mode activate", ["selection mode active"], true, (message, state, previousState) => {
            return machine?.getState("selection mode active")
        }),
        "selection mode active": CState("selection mode active", ["selection made", "selection error report", "settings updated"], false, (message, state, previousState) => {
            //  (disable settings tab)
            return machine?.getState("selection mode active")

            // return states.get("selection made (enable settings tab)")
        }),
        "selection made (enable settings tab)": CState("selection made (enable settings tab)", ["base"], false, (message, state, previousState) => {
            return machine?.getState("base")
        }),
        "selection error report (user error, set red selection error note, revert to previous selector)": CState("selection error report (user error, set red selection error note, revert to previous selector)", ["base"], false, (message, state, previousState) => {
            // todo: maybe this isn't necessary -- it would be neat to have super states so the
            //   dependent state machines could know when not to be active
            return machine?.getState("selection mode active")
        }),
        // selectors!
        // add
        "start add selector": CState("start add selector", ["add selector", "cancel add selector"], false, (message, state, previousState) => {
            // TODO✅(see settings-hierarchy.tsx): need a selector choose drop down component
            return machine?.getState("add selector")
        }),
        "add selector": CState("add selector", ["base"], false, (message, state, previousState) => {
                // selectorUpdated(message)
            return machine?.getState("base")
        }),
        "cancel add selector": CState("cancel add selector", ["base"], false, (message, state, previousState) => {
            return machine?.getState("base")
        }),
        // remove
        "remove selector": CState("remove selector", ["confirm remove selector", "cancel remove selector"], false, (message, state, previousState) => {
            return machine?.getState("confirm remove selector")
        }),
        "confirm remove selector": CState("confirm remove selector", ["base"], false, (message, state, previousState) => {
            return machine?.getState("base")
        }),
        "cancel remove selector": CState("cancel remove selector", ["base"], false, (message, state, previousState) => {
            return machine?.getState("base")}),
        // use
        "use selector": CState("use selector", ["base"], false, (message, state, previousState) => {
            return machine?.getState("base")
        }),
        // ~~ waves ~~
        "start waving": CState("start waving", ["base"], true, (message, state, previousState) => {
            return machine?.getState("waving")
        }),
        "waving": CState("start waving", ["stop wave", "settings updated"], false, (message, state, previousState) => {
            return machine?.getState("waving")
        }),
        "stop waving": CState("stop waving", ["base"], false, (message, state, previousState) => {
            return machine?.getState("base")
        }),
    };

    Object.keys(states).forEach(state => map.set(state, states[state]))

    return new class implements NameAccessMapInterface {
        getState(name: string): State | undefined {
            return map.get(name);
        }
    }
}

const AppStateMachine = new StateMachine();

const App: FunctionComponent = () => {
    const [ selector, setSelector ] = useState('p');
    const [ saved, setSaved ] = useState(true);
    const [ going, setGoing ] = useState(false);
    const [ options, setOptions ] = useState<Options>(Options.getDefaultOptions());
    const [ domain, setDomain ] = useState<string>("");
    const [ path, setPath ] = useState<string>("");

    const appStateMap = AppStates({
        machine: AppStateMachine,
        setGoing: (going) => setGoing(going),
        getGoing: (): boolean => { return going },
        bootstrapCondition: bootstrapConditionSettingsSetState,
    })

    useEffect(() => {
        AppStateMachine.initialize(appStateMap, appStateMap.getState("bootstrap") as State)

        settingsService.getCurrentDomainAndPaths().then(domainAndPath => {
            setDomain(domainAndPath.domain);
            setPath(domainAndPath.paths[0])
        })
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
        return settingsService.updateCurrentSettings((_) => {
            return options;
        });
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
        // TODO✅: this needs a revision to send a start or update message depending on the state of "going" in google sync
        //          bootstrap condition now sets the state to the last setState or base, and delivers the start stop or update
        //          per "going" which should provide nice backup measures, however we need to store the last message as a State

        //if (configured.mode === "production") {
        if (!isDevelopment) {
            window.onblur = () => {
                window.close();
            }
        }
    }, []);

    const onDomainPathChange = (domain: string, path: string) => {
        setDomain(domain);
        setPath(path);
    }

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
                    onUpdateSettings={settingsUpdated}
                    domain={domain} path={path}
                    settingsService={settingsService}
                    onDomainPathChange={onDomainPathChange}>
                </Settings>
            </WaveTabs>
        </WaveReader>
    );
};

export default App;
