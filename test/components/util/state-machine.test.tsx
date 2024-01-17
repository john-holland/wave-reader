import "jest";
import StateMachine, {
    Client,
    ClientDiscovery,
    ClientHost, ClientID, ClientLocation, ClientMessage, GoogleChromeRuntimeProxy, GoogleClientMessengerService,
    IClientMessengerService,
    IRuntimeProxy, Success
} from "../../../src/util/state-machine";
import {State, CState, NameAccessMapInterface, Named, StateNames} from "../../../src/util/state"

import {
    StartVentures,
    StopVentures,
    WavingVentures,
    AllVentures,
    Base
} from "../../../src/util/venture-states";
import UpdateWaveMessage from "../../../src/models/messages/update-wave";
import {Context, Dispatch, FunctionComponent, ReactElement, SetStateAction, useEffect, useState} from "react";
import SelectorHierarchy, {HierarchySelectorComponentProps} from "../../../src/components/selector-hierarchy";
import React from "react";
import Message from "../../../src/models/message";
import {Observable, Subscriber} from "rxjs";
import {fromMessage} from "../../../src/util/messages";
import Wave from "../../../src/models/wave";
import MessageSender = chrome.runtime.MessageSender;
import Options from "../../../src/models/options";
import {log, ComponentLog, MachineComponentProps, ReactMachine, UseStateProxy} from "../../../src/util/react-machine";


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
        "error": CState("error", AllVentures, true, async (message: Named, state: State, previousState: State): Promise<State | undefined> => {
            console.log("transitioning from error to base state from " + previousState.name)
            return map.get('base') as State
        }),
        "start": CState("start", StartVentures, false, async (message: Named, state: State, previousState: State): Promise<State | undefined> => {
            return map.get('waving') as State
        }),
        "stop": CState("stop", StopVentures, false, async (message: Named, state: State, previousState: State): Promise<State | undefined> => {
            return map.get('base') as State
        }),
        "update": CState("update", BaseVentures, true, async (message: Named, state: State, previousState: State): Promise<State | undefined> => {
            return previousState
        }),
        "toggle start": CState("toggle start", StartVentures, false, async (message: Named, state: State, previousState: State): Promise<State | undefined> => {
            return map.get('waving') as State
        }),
        "toggle stop": CState("toggle stop", StopVentures, false, async (message: Named, state: State, previousState: State): Promise<State | undefined> => {
            return map.get('base') as State
        }),
        "start mouse": CState("start mouse", StartVentures, false, async (message: Named, state: State, previousState: State): Promise<State | undefined> => {
            return map.get('waving') as State
        }),
        "stop mouse": CState("stop mouse", StopVentures, false, async (message: Named, state: State, previousState: State): Promise<State | undefined> => {
            return map.get('base') as State
        }),
        "selection mode activate": CState("selection mode activate", ["selection mode deactivate", "selection made"], false, async (message: Named, state: State, previousState: State): Promise<State | undefined> => {
            return map.get('selection mode') as State
        }),
        "selection mode": CState("selection mode", ["selection mode activate", "selection mode", "selection made", "selection mode deactivate"], false),
        "selection made": CState("selection made", BaseVentures, false, async (message: Named, state: State, previousState: State): Promise<State | undefined> => {
            return map.get('base') as State
        }),
        "selection mode deactivate": CState("selection mode deactivate", [], false, async (message: Named, state: State, previousState: State): Promise<State | undefined> => {
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

    test("validate error moves to base state", async () => {
        const {stateMachine, stateNameMap} = newStateMachine();
        expect((await stateMachine.handleState(stateNameMap.getState("error")!!))?.name).toBe("base");
    })

    test("validate we receive the message passed to handleState", async () => {
        const message = new UpdateWaveMessage()
        message.name = "message-test"
        if (message.options) message.options.wave.text.color = "test green";
        const map = new Map()
        map.set("message-test", CState("message-test", BaseVentures, true,
            async (message: Named, state: State, previousState: State): Promise<State | undefined> => {
                const convertedMessage = (message as unknown as UpdateWaveMessage);
                expect(convertedMessage?.options?.wave.text.color).toBe("test green");
                return undefined
            }))
        const {stateMachine, stateNameMap} = newStateMachine(StateNameMap(map));

        expect((await stateMachine.handleState(message))?.name).toBe("base");
    })

    test("stop moves to base state", async () => {
        const {stateMachine, stateNameMap} = newStateMachine(StateNameMap(new Map()), "waving");
        expect((await stateMachine.handleState(stateNameMap.getState("stop")!!))?.name).toBe("base");
    })

    test("start moves to waving state", async () => {
        const {stateMachine, stateNameMap} = newStateMachine();
        expect((await stateMachine.handleState(stateNameMap.getState("start")!!))?.name).toBe("waving");
    })

    test("stop toggle moves to base state", async () => {
        const {stateMachine, stateNameMap} = newStateMachine(StateNameMap(new Map()), "waving");
        expect((await stateMachine.handleState(stateNameMap.getState("toggle stop")!!))?.name).toBe("base");
    })

    test("start toggle moves to waving state", async () => {
        const {stateMachine, stateNameMap} = newStateMachine();
        expect((await stateMachine.handleState(stateNameMap.getState("toggle start")!!))?.name).toBe("waving");
    })

    test("stop mouse moves to base state", async () => {
        const {stateMachine, stateNameMap} = newStateMachine(StateNameMap(new Map()), "waving");
        expect((await stateMachine.handleState(stateNameMap.getState("stop mouse")!!))?.name).toBe("base");
    })

    test("start mouse moves to waving state", async () => {
        const {stateMachine, stateNameMap} = newStateMachine();
        expect((await stateMachine.handleState(stateNameMap.getState("start mouse")!!))?.name).toBe("waving");
    })

    test("selection mode activate moves to selection mode state", async () => {
        const {stateMachine, stateNameMap} = newStateMachine();
        expect((await stateMachine.handleState(stateNameMap.getState("selection mode activate")!!))?.name).toBe("selection mode");
    })

    test("selection mode moves to base state", async () => {
        const {stateMachine, stateNameMap} = newStateMachine(StateNameMap(new Map()), "selection mode");
        expect((await stateMachine.handleState(stateNameMap.getState("selection mode")!!))?.name).toBe("base");
    })

    test("selection made moves to base state", async () => {
        const {stateMachine, stateNameMap} = newStateMachine(StateNameMap(new Map()), "selection mode");
        expect((await stateMachine.handleState(stateNameMap.getState("selection made")!!))?.name).toBe("base");
    })

    test("selection mode deactivate moves to base state", async () => {
        const {stateMachine, stateNameMap} = newStateMachine(StateNameMap(new Map()), "selection mode");
        expect((await stateMachine.handleState(stateNameMap.getState("selection mode deactivate")!!))?.name).toBe("base");
    })



    class TestRuntimeProxy implements IRuntimeProxy {
        public reponses: any[] = []
        public messagesSentToRunTime: any[] = []
        public messagesSendToTab: any[] = []

        onInstalled(callback: { (details: any): void }): void {
            callback(true)
        }

        onMessage(callback: { (message: any, sender: chrome.runtime.MessageSender, sendResponse: { (response?: any): void }): void }): void {
            callback(new UpdateWaveMessage({ options: new Options({}) }), { id: "unknown"} as unknown as MessageSender, (response) => {this.reponses.push(response)})
        }

        sendMessageToRuntime(message: any, callback: { (response: any): void }): void {
            this.messagesSentToRunTime.push(message)
            callback(true);
        }

        sendMessageToTab(tabId: number, message: any, callback: { (response: any): void }): void {
            this.messagesSendToTab.push(message)
            callback(true);
        }

    }

    test("selection mode deactivate moves to base state", async () => {
        const {stateMachine, stateNameMap} = newStateMachine(StateNameMap(new Map()), "selection mode");

        const client = new Client<Message<any>>(new GoogleClientMessengerService(
            {
                from: ClientLocation.POPUP,
                to: ClientLocation.CONTENT
            },
            new Map<string, IClientMessengerService<Message<any>>>(),
            new TestRuntimeProxy()))
        const useStateProxy = new UseStateProxy(null);
        const componentMachine = ReactMachine({
            initialState: "base",
            client,
            states: {
                base: async ({state, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
                    const [test, setTest] = state?.useState("test", false) || [undefined, undefined]
                    // todo: review: replace log and view with a deconstructor like useState and useReducer?
                    return Promise.resolve(log("base", <div/>));
                },
                complex: async ({state, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
                    // todo: implement as api client with settings mock and run test
                    const saved = await client.sendMessage(new ClientMessage("app/settings", "save", new UpdateWaveMessage({ options: new Options() })))
                    return Promise.resolve(log("base", <div>{saved}</div>));
                },
            }
        })

        // json react tree matching for output
        componentMachine.initialize();
        expect(componentMachine.getRenderTarget()).toBeTruthy()
    })

    test("multiple content clients per background client", () => {
        throw new Error("todo: dooo")
    })

    test("observe state change", async () => {
        const {stateMachine, stateNameMap} = newStateMachine(StateNameMap(new Map()), "selection mode");
        let changeCount = 0;
        let changedToState: (State | undefined)[] = [];
        stateMachine.getObservable()?.subscribe((state) => {
            changedToState.push(state);
            changeCount++;
        })
        expect((await stateMachine.handleState(stateNameMap.getState("selection mode deactivate")!!))?.name).toBe("base");
        expect(changedToState[0]!!.name).toBe("selection mode deactivate")
        expect(changedToState[1]!!.name).toBe("base")
        expect(changeCount).toBe(2)
    })
})
