/**
 * @jest-environment node
 */

import 'jest';
import React from "react"

import {AppStates, GoingStorageProxy, SetReset} from "../src/app";
import StateMachine from "../src/util/state-machine";
import {CState, NameAccessMapInterface, Named, State, StateNames} from "../src/util/state";
import Options from "../src/models/options";
import InstalledDetails = chrome.runtime.InstalledDetails;
import {render, screen, waitFor} from "@testing-library/react";
import "@testing-library/react";

import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

import "@testing-library/jest-dom"
import UpdateWaveMessage from "../src/models/messages/update-wave";
import {withMockSettingsService} from "./components/util/mock-settings-service";
import SettingsService, {SettingsDAOInterface} from "../src/services/settings";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
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
    accessSettingsService
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
            setOptions: (opts) => {
                options = opts;
            },
            _getGoingAsync: () => Promise.resolve(!!going),
            onRunTimeInstalledListener: (callback: { (details: InstalledDetails): void }) => {
                callback({} as unknown as InstalledDetails)
            },
            onMessageListener,
            getSyncObject_Going: (key: string, defaultValue: { going: boolean }, callback: { (result: GoingStorageProxy): void }) => { callback({ going: going || false } as GoingStorageProxy) },
            bootstrapLock
        })
    }))!!

    return states;
}

type GOoooo = void;
describe("app tests", () => {
    describe("app state machine", () => {
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
            const states = await StateMachineFactory({
                statemachine,
                setGoingCalled,
                bootstrapConditionCalled,
                onMessageListener: (callback: { (message: any): void }) => {
                    messageCallback = callback
                },
                accessSettingsService: (settingsService) => {
                    settings = settingsService as SettingsService
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
            if (messageCallback !== undefined) (messageCallback as Event)(new UpdateWaveMessage({
                options: new Options({ selectors: ["test selector"] })
            }))

            // a quick explanation for the order of statesPushed:
            //   bootstrap returns base, and also sets base as the active state (reporting 2 bases)
            //   then update switches back to base, for something like a baseball game with baseballs new expansion:
            //      extra bases ball! (unrelated to "Really Bad Baseball" if Zach Gage gets into physics... <3)
            return new Promise(async (resolve, reject) => {
                await waitFor(async () => {
                    const currently = await settings!!.getCurrentSettings();
                    expect(currently.selectors.includes("test selector")).toBeTruthy();
                    expect(statesPushed.map(c => c?.name)).toStrictEqual(["bootstrap", "base", "base", "base", "update", "base"])
                    resolve(void 0)
                }, {interval: 100})
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

