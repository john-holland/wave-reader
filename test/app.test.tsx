import { AppStates } from "../src/app.tsx";
import StateMachine from "../src/util/state-machine";
import {State} from "../src/util/state";

describe("app tests", () => {
describe("app state machine", () => {
    test("bootstrap", () => {
        let setGoingCalled = false;
        let bootstrapConditionCalled = false;
        let going = undefined;
        let goingCalledValue = undefined;
        const statemachine = new StateMachine();
        const states = AppStates({
            map: new Map<string, State>(),
            getGoing: (): boolean => { return going },
            setGoing: (value: boolean) => {
                going = value;
                setGoingCalled = true;
            },
            bootstrapCondition: (value: boolean) => {
                goingCalledValue = value;
                bootstrapConditionCalled = true;
            }
        })
        statemachine.initialize(states, states.getState("base"))

        expect(statemachine.handleState(states.getState("bootstrap")).name).toBe("base")
    })
})
})