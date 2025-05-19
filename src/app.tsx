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
import configured from './config/config';
import { guardLastError } from "./util/util";
import UpdateWaveMessage from "./models/messages/update-wave";
import { Settings } from "./components/settings";
import WaveTabs from './components/wave-tabs';
import InstalledDetails = chrome.runtime.InstalledDetails;
import {CState, NameAccessMapInterface, Named, State, StateNames} from "./util/state";
import StateMachine from "./util/state-machine";
import SettingsService from "./services/settings";
import {Observer} from "rxjs";
import RemoveSelectorMessage from "./models/messages/remove-selector";
import StartSelectorChooseMessage from "./models/messages/start-selection-choose";
import {SelectorsDefaultFactory} from "./models/defaults";
// @ts-ignore
// TODO: {score!} Remove if not needed for future selector hierarchy implementation
import {Selector} from "./services/selector-hierarchy";
import SelectionModeActivateMessage from "./models/messages/selection-mode-activate";
import SelectionModeDeactivateMessage from "./models/messages/selection-mode-deactivate";
import EndSelectorChooseMessage from "./models/messages/end-selection-choose";
import AddSelectorMessage from "./models/messages/add-selector";
import SelectionMadeMessage from "./models/messages/selection-made";
import { clientForLocation } from "./config/robotcopy";
import { ClientLocation } from "./util/state-machine";
import Donation from './components/donation';

const PopupClient = clientForLocation(ClientLocation.POPUP)

const WaveReader = styled.div`
  width: 800px;
`;

const settingsService = new SettingsService();

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
    settingsService: SettingsService,
    originState: string,
    map: Map<string, State>,
    setState: { (state: string | Named): Promise<State> },
    setGoing: { (going: boolean): void },
    getGoing: { (): boolean },
    _getGoingAsync: { (): Promise<boolean> },
    setOptions: { (options: Options): void },
    bootstrapCondition: { (going: boolean): Promise<Options> },
    onRunTimeInstalledListener: { (callback: {(details: InstalledDetails): void }): void },
    onMessageListener: { (callback: {(message: any): boolean}): void },
    optionsObserver: Observer<Options>,
    getSyncObject_Going: GetSyncObjectFunction<GoingStorageProxy>,
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
    bootstrapLock = SetReset.unset("bootstrap-lock"),
    setOptions = (options: Options) => {
        throw new Error("unset setOptions method" + JSON.stringify(options))
    }
/* eslint-enable: typescript-eslint/no-unused-vars */
}: Partial<AppStatesProps>): NameAccessMapInterface => {
    /* eslint-disable  @typescript-eslint/no-unused-vars */
    const states: StateNames = {
        "base": CState("base", ["base", "bootstrap", "settings updated"], true, () => {
            return Promise.resolve(machine?.getState("base"))
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

                        return true;
                    });
                });

            });

            return machine?.getState("base") as State;
        }),
        "update": CState("update", ["base"], true, async (message, state, previousState) => {
            const settingsUpdated = message as UpdateWaveMessage;
            await settingsService?.updateCurrentSettings((options) => {
                // todo: not updating as expected!
                (settingsUpdated.options as Options).wave.selector = settingsUpdated?.options?.wave.selector;
                (settingsUpdated.options as Options).wave.update();
                setOptions(settingsUpdated.options as Options);
                return settingsUpdated.options as Options;
            })
            return previousState
        }),
        // selector selection mode
        "selection mode activate": CState("selection mode activate", ["selection mode active"], true, async (message, state, previousState): Promise<State> => {
            //setSettingsEnabled(false);
            chrome.runtime.sendMessage(new StartSelectorChooseMessage({
                selector: (await settingsService?.getCurrentSettings())?.wave?.selector || SelectorsDefaultFactory()[0]
            }))
            return Promise.resolve(machine?.getState("selection mode active") as State)
        }),
        "selection mode deactivate": CState("selection mode activate", ["selection mode active"], true, async (message, state, previousState): Promise<State> => {
            //setSettingsEnabled(false);
            chrome.runtime.sendMessage(new EndSelectorChooseMessage())
            return Promise.resolve(machine?.getState("selection mode active") as State)
        }),
        "selection mode active": CState("selection mode active", ["selection made", "selection error report", "settings updated"], false, (message, state, previousState): Promise<State> => {
            //  (disable settings tab)
            return Promise.resolve(machine?.getState("selection mode active")!)

            // return states.get("selection made (enable settings tab)")
        }),
        "selection made": CState("selection made (enable settings tab)", ["base"], false, (message, state, previousState): Promise<State> => {
            //setSettingsEnabled(true);
            machine?.handleState(new AddSelectorMessage({ selector: (message as SelectionMadeMessage)?.selector}))
            return Promise.resolve(machine?.getState("base")!)
        }),
        "selection error report (user error, set red selection error note, revert to previous selector)": CState("selection error report (user error, set red selection error note, revert to previous selector)", ["base"], false, (message, state, previousState) => {
            // todo: maybe this isn't necessary -- it would be neat to have super states so the
            //   dependent state machines could know when not to be active
            return Promise.resolve(machine?.getState("selection mode active"))
        }),
        // selectors!
        "add selector": CState("add selector", ["base"], true, (message, state, previousState): Promise<State> => {
                // selectorUpdated(message)
            settingsService?.updateCurrentSettings((options) => {
                options.wave.selector = (message as SelectorUpdated).selector as string || options.wave.selector;
                options.selectors.push((message as SelectorUpdated).selector as string)
                options.wave.update();
                return options;
            })
            return Promise.resolve(previousState)
        }),
        // remove
        "remove selector": CState("remove selector", ["confirm remove selector", "cancel remove selector"], false, (message, state, previousState): Promise<State> => {
            return Promise.resolve(machine?.getState("confirm remove selector")!)
        }),
        "confirm remove selector": CState("confirm remove selector", ["base"], false, (message, state, previousState): Promise<State> => {
            if (window.confirm("Are you sure you wish to remove this selector?")) {
                settingsService?.updateCurrentSettings(options => {
                    const remove = (message as RemoveSelectorMessage).selector || '';
                    options.selectors.splice(options.selectors.indexOf(remove, 0), 1);
                    return options;
                })
            }
            return Promise.resolve(machine?.getState("base")!)
        }),
        // use
        "use selector": CState("use selector", ["base"], false, (message, state, previousState): Promise<State> => {
            return Promise.resolve(machine?.getState("base")!)
        }),
        // ~~ waves ~~
        "start waving": CState("start waving", ["base"], true, (message, state, previousState): Promise<State> => {
            return Promise.resolve(machine?.getState("waving")!)
        }),
        "waving": CState("start waving", ["stop wave", "settings updated"], false, (message, state, previousState): Promise<State> => {
            return Promise.resolve(machine?.getState("waving")!)
        }),
        "stop waving": CState("stop waving", ["base"], false, (message, state, previousState): Promise<State> => {
            return Promise.resolve(machine?.getState("base")!)
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
    const [ selectors, setSelectors ] = useState<string[]>([]);
    const [ selectorModeOn, setSelectorModeOn ] = useState<boolean>(false)

    const appStateMap = AppStates({
        machine: AppStateMachine,
        setGoing: (going) => setGoing(going),
        getGoing: (): boolean => { return going },
        bootstrapCondition: bootstrapConditionSettingsSetState,
        settingsService,
        setOptions
    })

    useEffect(() => {
        AppStateMachine.initialize(appStateMap, appStateMap.getState("bootstrap") as State)

        settingsService.getCurrentDomainAndPaths().then(domainAndPath => {
            setDomain(domainAndPath.domain);
            setPath(domainAndPath.paths[0])
        })

        settingsService.getCurrentSettings().then(settings => {
            setSelectors(settings.selectors);
            setSelector(settings.wave.selector as string);
        })
    }, []);

    const selectorClicked = () => {
        setSaved(false);
    };

    const selectorModeClicked = (selectorModeOn: boolean) => {
        setSelectorModeOn(!selectorModeOn)
        if (!selectorModeOn) {
            AppStateMachine.handleState(new SelectionModeActivateMessage())
        } else {
            AppStateMachine.handleState(new SelectionModeDeactivateMessage())
        }
    }

    const onSaved = async (settings: Options) => {
        setSelector(settings.wave.selector as string);
        setSaved(true);
        // todo what?
        selectorUpdated(new SelectorUpdated({ selector: settings.wave.selector }))
        await AppStateMachine.handleState(new UpdateWaveMessage({
            options: settings
        }))
    };

    const selectorUpdated = (message: SelectorUpdated) => {
        AppStateMachine.handleState(message);
        setSelector(message.selector || 'p');
        setSelectors([...new Set(selectors.concat([message.selector as string]))])
        setSaved(true);
    }

    const onGo = () => {
        setGoing(true);

        settingsService.updateCurrentSettings((options) => {
            options.going = true;
            setSelectors(options.selectors);
            // use workboots and send message with wave params to interpolate css
            startPageCss(options.wave);
            return options;
        })
    }

    const onStop = () => {
        setGoing(false);
        stopPageCss();
    }


    useEffect(() => {
        if (configured.mode !== 'production') {
            window.onblur = () => {
                window.close();
            };
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
                    selectors={selectors}
                    saved={saved}
                    selectorClicked={selectorClicked}
                    onSave={async (selector) => selectorUpdated(new SelectorUpdated({ selector }))}
                    selectorModeClicked={selectorModeClicked}
                    selectorModeOn={selectorModeOn}>
                </SelectorInput>
                <Settings
                    tab-name={"Settings"}
                    initialSettings={options}
                    onUpdateSettings={onSaved}
                    domain={domain} path={path}
                    settingsService={settingsService}
                    onDomainPathChange={onDomainPathChange}>
                </Settings>
                <Donation tab-name={"Support"} />
            </WaveTabs>
        </WaveReader>
    );
};

export default App;
