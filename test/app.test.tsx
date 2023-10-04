/**
 * @jest-environment jsdom
 */

// todo: the above [jest-environment] does not set the config/config mode properly
//       i thought it was for just this, but App.tsx is still one of the only files to access the config
//       directly.
import * as React from "react"
import "jest";

import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

import App, { AppStates, GoingStorageProxy, SetReset } from "../src/app";
import StateMachine from "../src/util/state-machine";
import { NameAccessMapInterface, Named, State } from "../src/util/state";
import Options from "../src/models/options";
import InstalledDetails = chrome.runtime.InstalledDetails;

import UpdateWaveMessage from "../src/models/messages/update-wave";

import {withMockSettingsService} from "./components/util/mock-settings-service";
import SettingsService, {SettingsDAOInterface} from "../src/services/settings";
import styled from 'styled-components';
const Container = styled.div``;
import { waitFor } from "@testing-library/react";
//import "@testing-library/react";
// import "@testing-library/jest-dom"
//
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// const waitFor = async (action: { (): void }, timeout: number, interval: number = 100): Promise<boolean> => {
//     const start = new Date().getTime();
//     let now = new Date().getTime();
//     return new Promise((resolve, reject) => {
//         const act = () => {
//             if ((now - start) <= timeout || (now - start + interval) <= timeout) {
//                 try {
//                     action()
//                     resolve(true);
//                     return;
//                 } catch (e) {
//                     if ((now - start) === timeout || (now - start + interval) > timeout) {
//                         reject(e);
//                         return;
//                     }
//
//                     now = new Date().getTime();
//                     setTimeout(act, interval);
//                     return;
//                 }
//             }
//             resolve(false);
//         };
//         setTimeout(act, interval);
//     })
// }
//
//

type BooleanProxy = {
    bool: boolean
}
type StateMachineMockProps = {
    setGoingCalled: BooleanProxy
    bootstrapConditionCalled: BooleanProxy
    going: boolean | undefined
    goingCalledValue: boolean | undefined
    state: State | undefined
    options: Options
    statemachine: StateMachine,
    bootstrapLock: SetReset,
    onMessageListener: { (callback: {(message: any): boolean}): void }
    accessSettingsService?: { (service: SettingsDAOInterface): void }
    setOptions: { (options: Options): void }
}
const StateMachineFactory = async ({
    setGoingCalled = { bool: false },
    bootstrapConditionCalled = { bool: false },
    going = undefined,
    goingCalledValue = undefined,
    state = undefined,
    options = new Options(),
    statemachine = new StateMachine(),
    bootstrapLock = SetReset.unset("test bootstrap lock"),
    onMessageListener = (callback) => { },
    accessSettingsService,
    setOptions = (opts: Options) => {
        options = opts;
    }
}: Partial<StateMachineMockProps>) => {
    const states: NameAccessMapInterface = (await withMockSettingsService<NameAccessMapInterface>((settingsService: SettingsService, accessRegistry) => {
        if (accessSettingsService) accessSettingsService(settingsService)
        return AppStates({
            machine: statemachine,
            settingsService,
            setState: (s): Promise<State> => {
                state = s as State;
                return statemachine.handleState(s as Named || statemachine.getState(s as string) as Named).then(c => c!!)
            },
            map: new Map<string, State>(),
            getGoing: (): boolean => {
                return going!!;
            },
            setGoing: (value: boolean): Promise<void> => {
                going = value;
                setGoingCalled.bool = true;
                return Promise.resolve();
            },
            bootstrapCondition: (value: boolean): Promise<Options> => {
                goingCalledValue = value;
                bootstrapConditionCalled.bool = true;
                return Promise.resolve(options);
            },
            setOptions: (o: Options) => {
                options = o;
                setOptions(options);
            },
            _getGoingAsync: () => Promise.resolve(!!going),
            onRunTimeInstalledListener: (callback: { (details: InstalledDetails): void }) => {
                callback({} as unknown as InstalledDetails)
            },
            onMessageListener,
            getSyncObject_Going: (key: string, defaultValue: { going: boolean }, callback: { (result: GoingStorageProxy): void }) => { callback({ going: going || false } as GoingStorageProxy) },
            bootstrapLock
        })
    })) as NameAccessMapInterface

    return states;
}

// describe("something", () => {
//     test("has to have a test", () => {
//         expect(true).toBeTruthy();
//     })
//
//     test("waitFor", async () => {
//             return new Promise(async (resolve, reject) => {
//                 const start = new Date().getTime();
//
//                 const success = await waitFor(() => {
//                     throw new Error("test")
//                 }, 3000).catch(resolve);
//
//                 expect(new Date().getTime() - start).toBeGreaterThan(3000)
//                 resolve(void 0);
//             })
//         })
//
//         test("waitFor", async () => {
//             return new Promise(async (resolve, reject) => {
//                 const start = new Date().getTime();
//
//                 const success = await waitFor(() => {
//                     const now = new Date().getTime()
//                     if ((now - start) < 1500) {
//                         console.log(now - start)
//                         throw new Error("test")
//                     }
//                 }, 3000)
//
//                 const now = new Date().getTime()
//                 expect(now - start).toBeGreaterThan(1500)
//
//                 expect(success).toBeTruthy()
//                 resolve(void 0);
//             })
//         })
// })

type GOoooo = void;
describe("app tests", () => {
    describe("app state machine", () => {
        test("waitFor", async () => {
            return new Promise(async (resolve, reject) => {
                const start = new Date().getTime();

                const success = await waitFor(() => {
                    const now = new Date().getTime()
                    if (now - start <= 3000) {
                        throw new Error("test")
                    }
                }, { timeout: 3000, interval: 100 }).catch(resolve);

                expect(new Date().getTime() - start).toBeGreaterThan(3000)
                resolve(void 0);
            })
        })

        test("waitFor", async () => {
            return new Promise(async (resolve, reject) => {
                const start = new Date().getTime();

                const success = await waitFor(() => {
                    const now = new Date().getTime()
                    if (now - start < 1500) {
                        throw new Error("test")
                    }
                }, { timeout: 3000, interval: 100 })

                const now = new Date().getTime()
                expect(now - start).toBeGreaterThan(1500)

                // expect(success).toBeTruthy() // in our petty waitFor, not react's
                resolve(void 0);
            })
        })

        test("bootstrap", async () => {
            const statemachine = new StateMachine();
            const setGoingCalled: BooleanProxy = { bool: false }
            const bootstrapConditionCalled: BooleanProxy = { bool: false }
            const bootstrapLock = SetReset.unset("bootstrap test lock")
            const states = await StateMachineFactory({
                statemachine,
                setGoingCalled,
                bootstrapConditionCalled,
                bootstrapLock
            });

            statemachine.initialize(states, states.getState("base") as State)

            expect((await statemachine.handleState(states.getState("bootstrap") as State))?.name).toBe("base")

            expect(bootstrapConditionCalled.bool).toBeTruthy()
            expect(bootstrapLock.getSet()).toBeTruthy()

            return Promise.resolve<GOoooo>(void 0);
        })

        test("base", async () => {
            const statemachine = new StateMachine();
            const setGoingCalled: BooleanProxy = { bool: false }
            const bootstrapConditionCalled: BooleanProxy = { bool: false }
            const states = await StateMachineFactory({
                statemachine,
                setGoingCalled,
                bootstrapConditionCalled
            });

            statemachine.initialize(states, states.getState("base") as State)

            expect((await statemachine.handleState(states.getState("bootstrap") as State))?.name).toBe("base")

            expect(bootstrapConditionCalled.bool).toBeTruthy()

            return Promise.resolve<GOoooo>(void 0);
        })
        test("settings updated", async () => {
            type Event = { (message: any): void };
            let messageCallback: Event | undefined = undefined;
            const statemachine = new StateMachine();
            const setGoingCalled: BooleanProxy = { bool: false }
            const bootstrapConditionCalled: BooleanProxy = { bool: false }
            let settings: SettingsService | undefined = undefined;
            let setOptionsCalled: boolean = false;
            let optionsCalledWith: Options | undefined = undefined;
            const states = await StateMachineFactory({
                statemachine,
                setGoingCalled,
                bootstrapConditionCalled,
                onMessageListener: (callback: { (message: any): void }) => {
                    messageCallback = callback
                },
                accessSettingsService: (settingsService) => {
                    settings = settingsService as SettingsService
                },
                setOptions: (options: Options) => {
                    setOptionsCalled = true;
                    optionsCalledWith = options;
                }
            });

            statemachine.initialize(states, states.getState("base") as State)

            const statesPushed: (State | undefined)[] = []
            statemachine.getObservable()?.forEach((state) => {
                statesPushed.push(state);
            })

            expect((await statemachine.handleState(states.getState("bootstrap") as State))?.name).toBe("base")

            expect(bootstrapConditionCalled.bool).toBeTruthy()
            const previous = await settings!!.getCurrentSettings();

            const newOptions = new Options({ selectors: ["test selector"] });
            if (messageCallback !== undefined) (messageCallback as Event)(new UpdateWaveMessage({
                options: newOptions
            }))

            // a quick explanation for the order of statesPushed:
            //   bootstrap returns base, and also sets base as the active state (reporting 2 bases)
            //   then update switches back to base, for something like a baseball game with baseballs new expansion:
            //      extra bases ball! (unrelated to "Really Bad Baseball" if Zach Gage gets into physics... <3)
            return new Promise(async (resolve, reject) => {
                await waitFor(async () => {
                    const currently = await settings!!.getCurrentSettings();
                    expect(setOptionsCalled).toBeTruthy()
                    expect(Options.OptionsEqual(currently, newOptions)).toBeTruthy();
                    expect(Options.OptionsEqual(currently, optionsCalledWith as Options)).toBeTruthy();
                    expect(currently.selectors.includes("test selector")).toBeTruthy();
                    expect(statesPushed.map(c => c?.name)).toStrictEqual(["bootstrap", "base", "base", "base", "update", "base"])
                    resolve(void 0)
                }, { timeout: 3000, interval: 100 })
            })
        })
        test("set wave", () => {

        })
        test("selection mode activate", () => {

        })
        test("selection mode active", () => {

        })
        test("selection made (enable settings tab)", () => {

        })
        test("selection error report (user error, set red selection error note, revert to previous selector)", () => {

        })
        test("start add selector", () => {

        })
        test("add selector", () => {

        })
        test("cancel add selector", () => {

        })
        test("remove selector", () => {

        })
        test("confirm remove selector", () => {

        })
        test("cancel remove selector", () => {

        })
        test("use selector", () => {

        })
        test("start waving", () => {

        })
        test("waving", () => {

        })
        test("stop waving", () => {
        })
    })
})

