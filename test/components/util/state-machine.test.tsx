import "jest";
import StateMachine from "../../../src/util/state-machine";
import {State, CState, NameAccessMapInterface, Named, StateNames} from "../../../src/util/state"

import {
    StartVentures,
    StopVentures,
    WavingVentures,
    AllVentures,
    Base
} from "../../../src/util/venture-states";
import UpdateWaveMessage from "../../../src/models/messages/update-wave";

const BaseVentures = ["base", "error"]

class NameAccessMap implements NameAccessMapInterface {
    map: Map<string, State>;

    constructor(map: Map<string, State>) {
        this.map = map;
    }

    getState(name: string): State | undefined {
        return this.map.get(name);
    }
}
const StateNameMap = (map: Map<string, State> = new Map<string, State>()): NameAccessMap => {
    const mapObject = new NameAccessMap(map);


    const states: StateNames = {

        // base defined above
        "waving": CState("waving", WavingVentures, false),
        "error": CState("error", AllVentures, true, (message: Named, state: State, previousState: State): State | undefined => {
            console.log("transitioning from error to base state from " + previousState.name)
            return map.get('base') as State
        }),
        "start": CState("start", StartVentures, false, (message: Named, state: State, previousState: State): State | undefined => {
            return map.get('waving') as State
        }),
        "stop": CState("stop", StopVentures, false, (message: Named, state: State, previousState: State): State | undefined => {
            return map.get('base') as State
        }),
        "update": CState("update", BaseVentures, true, (message: Named, state: State, previousState: State): State | undefined => {
            return previousState
        }),
        "toggle start": CState("toggle start", StartVentures, false, (message: Named, state: State, previousState: State): State | undefined => {
            return map.get('waving') as State
        }),
        "toggle stop": CState("toggle stop", StopVentures, false, (message: Named, state: State, previousState: State): State | undefined => {
            return map.get('base') as State
        }),
        "start mouse": CState("start mouse", StartVentures, false, (message: Named, state: State, previousState: State): State | undefined => {
            return map.get('waving') as State
        }),
        "stop mouse": CState("stop mouse", StopVentures, false, (message: Named, state: State, previousState: State): State | undefined => {
            return map.get('base') as State
        }),
        "selection mode activate": CState("selection mode activate", ["selection mode deactivate", "selection made"], false, (message: Named, state: State, previousState: State): State | undefined => {
            return map.get('selection mode') as State
        }),
        "selection mode": CState("selection mode", ["selection mode activate", "selection mode", "selection made", "selection mode deactivate"], false),
        "selection made": CState("selection made", BaseVentures, false, (message: Named, state: State, previousState: State): State | undefined => {
            return map.get('base') as State
        }),
        "selection mode deactivate": CState("selection mode deactivate", [], false, (message: Named, state: State, previousState: State): State | undefined => {
            return map.get('base') as State
        })
    }

    // i'd prefer a native map.addAll method, but this allows a retrofit
    Object.keys(states).forEach(key => map.set(key, states[key]));

    if (!map.has("base")) {
        map.set("base", Base);
    }

    return mapObject;
}

type StateMahineReturn = {
    stateMachine: StateMachine
    stateNameMap: NameAccessMapInterface
}
const newStateMachine = (stateNameMap = StateNameMap(new Map()),
                      originState = "base"): StateMahineReturn => {
    const stateMachine = new StateMachine();
    stateMachine.initialize(stateNameMap, stateNameMap.getState(originState)!!);
    return { stateMachine, stateNameMap };
}

describe("state machine", () => {
    test("validate base state", () => {
        const { stateMachine } = newStateMachine();
        expect(stateMachine.getState("base")).toBeTruthy();
    })

    test("validate error moves to base state", () => {
        const { stateMachine, stateNameMap } = newStateMachine();
        expect(stateMachine.handleState(stateNameMap.getState("error")!!).name).toBe("base");
    })

    test("validate we receive the message passed to handleState", () => {
        const message = new UpdateWaveMessage()
        message.name = "message-test"
        if (message.options) message.options.wave.text.color = "test green";
        const map = new Map()
        map.set("message-test", CState("message-test", BaseVentures, true,
            (message: Named, state: State, previousState: State): State | undefined => {
                const convertedMessage = (message as unknown as UpdateWaveMessage);
                expect(convertedMessage?.options?.wave.text.color).toBe("test green");
                return undefined
            }))
        const { stateMachine, stateNameMap } = newStateMachine(StateNameMap(map));

        expect(stateMachine.handleState(message).name).toBe("base");
    })

    test("stop moves to base state", () => {
        const { stateMachine, stateNameMap } = newStateMachine(StateNameMap(new Map()), "waving");
        expect(stateMachine.handleState(stateNameMap.getState("stop")!!).name).toBe("base");
    })

    test("start moves to waving state", () => {
        const { stateMachine, stateNameMap } = newStateMachine();
        expect(stateMachine.handleState(stateNameMap.getState("start")!!).name).toBe("waving");
    })

    test("stop toggle moves to base state", () => {
        const { stateMachine, stateNameMap } = newStateMachine(StateNameMap(new Map()), "waving");
        expect(stateMachine.handleState(stateNameMap.getState("toggle stop")!!).name).toBe("base");
    })

    test("start toggle moves to waving state", () => {
        const { stateMachine, stateNameMap } = newStateMachine();
        expect(stateMachine.handleState(stateNameMap.getState("toggle start")!!).name).toBe("waving");
    })

    test("stop mouse moves to base state", () => {
        const { stateMachine, stateNameMap } = newStateMachine(StateNameMap(new Map()), "waving");
        expect(stateMachine.handleState(stateNameMap.getState("stop mouse")!!).name).toBe("base");
    })

    test("start mouse moves to waving state", () => {
        const { stateMachine, stateNameMap } = newStateMachine();
        expect(stateMachine.handleState(stateNameMap.getState("start mouse")!!).name).toBe("waving");
    })

    test("selection mode activate moves to selection mode state", () => {
        const { stateMachine, stateNameMap } = newStateMachine();
        expect(stateMachine.handleState(stateNameMap.getState("selection mode activate")!!).name).toBe("selection mode");
    })

    test("selection mode moves to base state", () => {
        const { stateMachine, stateNameMap } = newStateMachine(StateNameMap(new Map()), "selection mode");
        expect(stateMachine.handleState(stateNameMap.getState("selection mode")!!).name).toBe("base");
    })

    test("selection made moves to base state", () => {
        const { stateMachine, stateNameMap } = newStateMachine(StateNameMap(new Map()), "selection mode");
        expect(stateMachine.handleState(stateNameMap.getState("selection made")!!).name).toBe("base");
    })

    test("selection mode deactivate moves to base state", () => {
        const { stateMachine, stateNameMap } = newStateMachine(StateNameMap(new Map()), "selection mode");
        expect(stateMachine.handleState(stateNameMap.getState("selection mode deactivate")!!).name).toBe("base");
    })
})
