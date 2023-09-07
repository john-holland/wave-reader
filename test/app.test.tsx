/**
 * @jest-environment jsdom
 */

import * as React from "react"

import { AppStates } from "../src/app";
import StateMachine from "../src/util/state-machine";
import {CState, NameAccessMapInterface, Named, State, StateNames} from "../src/util/state";
import {getSyncObject} from "../src/util/sync";
import {fromMessage} from "../src/util/messages";
import SelectorUpdated from "../src/models/messages/selector-updated";
import {LoadSettings} from "../src/components/settings";
import Options from "../src/models/options";
import InstalledDetails = chrome.runtime.InstalledDetails;
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import {act} from "react-test-renderer";

import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

import "@testing-library/jest-dom"


const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe("app tests", () => {
    describe("app state machine", () => {
        test("bootstrap", async () => {
            return;
            let setGoingCalled = false;
            let bootstrapConditionCalled = false;
            let going: boolean | undefined = undefined;
            let goingCalledValue: boolean | undefined = undefined;
            let state = undefined;
            let options = new Options();
            const statemachine = new StateMachine();
            const states = AppStates({
                machine: statemachine,
                setState: (s): Promise<State> => {
                    state = s;
                    return statemachine.handleState(s as Named || statemachine.getState(s as string) as Named).then(c => c!!)
                },
                map: new Map<string, State>(),
                getGoing: (): boolean => {
                    return going!!;
                },
                setGoing: (value: boolean): Promise<void> => {
                    going = value;
                    setGoingCalled = true;
                    return Promise.resolve();
                },
                bootstrapCondition: (value: boolean): Promise<Options> => {
                    goingCalledValue = value;
                    bootstrapConditionCalled = true;
                    return Promise.resolve(options);
                },
                setOptions: (opts) => {
                    options = opts;
                },
                _getGoingAsync: () => Promise.resolve(!!going),
                onRunTimeInstalledListener: (callback: { (details: InstalledDetails): void }) => {
                },
                onMessageListener: (message: { (message: any): void }) => {
                }
            })
            statemachine.initialize(states, states.getState("base") as State)

            expect((await statemachine.handleState(states.getState("bootstrap") as State))?.name).toBe("base")
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

