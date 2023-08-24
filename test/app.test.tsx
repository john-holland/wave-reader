import { AppStates } from "../src/app";
import StateMachine from "../src/util/state-machine";
import {CState, NameAccessMapInterface, Named, State, StateNames} from "../src/util/state";
import {getSyncObject} from "../src/util/sync";
import {fromMessage} from "../src/util/messages";
import SelectorUpdated from "../src/models/messages/selector-updated";
import {LoadSettings} from "../src/components/settings";
import Options from "../src/models/options";
import InstalledDetails = chrome.runtime.InstalledDetails;

describe("app tests", () => {
    describe("app state machine", () => {
        test("bootstrap", () => {
            return;
            let setGoingCalled = false;
            let bootstrapConditionCalled = false;
            let going: boolean | undefined = undefined;
            let goingCalledValue: boolean | undefined = undefined;
            let state = undefined;
            const statemachine = new StateMachine();
            const states = AppStates({
                machine: statemachine,
                setState: (s): State => { state = s; return statemachine.handleState(statemachine.getState(s) as Named) },
                map: new Map<string, State>(),
                getGoing: (): boolean => {
                    return going!!;
                },
                setGoing: (value: boolean): Promise<void> => {
                    going = value;
                    setGoingCalled = true;
                    return Promise.resolve();
                },
                bootstrapCondition: (value: boolean): void => {
                    goingCalledValue = value;
                    bootstrapConditionCalled = true;
                },
                setOptions: (options) => {

                },
                _getGoingAsync: () => !!going,
                onRunTimeInstalledListener: (details: InstalledDetails) => { },
                onMessageListener: (message) => { return true; }
            })
            statemachine.initialize(states, states.getState("base") as State)

            expect(statemachine.handleState(states.getState("bootstrap") as State).name).toBe("base")
        })
        test("base", () => {
        })
        test("bootstrap", () => {

        })
        test("settings updated", () => {

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

