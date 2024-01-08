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
            (message: Named, state: State, previousState: State): State | undefined => {
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

    type MachineComponentProps = {
        stateProxy: UseStateProxy
        machine: StateMachine
        previousState: string
    }
    type MachineComponent = ReactElement<any, any> | null & {
    }

    type ComponentLog = {
        state: string,
        view?: MachineComponent
    }
    type ComponentLogView = {
        states: string[]
        state: string
        views: MachineComponent[]
    }
    const log = (state: string, view?: MachineComponent) => {
        return {
            state,
            view
        } as unknown as ComponentLog
    }
    const view = (state: string, states: string[], ...views: MachineComponent[]) => {
        return {
            state,
            states,
            views
        } as unknown as ComponentLogView
    }

    type StateComponentFunction = { ({stateProxy, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> }
    type ReactStateMachineProps = {
        states: { [key: string]: StateComponentFunction },
        client: Client<Message<any>>,
        useStateProxy: UseStateProxy,
        errorState?: State
    }

    type useStateFunction<S> = { (initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] }

    class UseStateProxy {
        useStateFn?: useStateFunction<any>
        useStates: Map<string, SetStateAction<any>> = new Map<string, React.SetStateAction<any>>()
        stateValues: Map<string, any> = new Map<string, any>()

        constructor(useStateFn?: useStateFunction<any>) {
            this.useStateFn = useStateFn
        }

        setUseState(useStateFn: useStateFunction<any>) {
            this.useStateFn = useStateFn
        }
        useState<S>(name: string, initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
            const [state, setState] = this.useStateFn!(initialState)
            return [state, ((value: S): void => {
                this.stateValues.set(name, value)
                setState(value);
            }) as Dispatch<SetStateAction<S>>]
        }
        getState<T>(name: string): T {
            return this.stateValues.get(name) as T;
        }
    }

    type whatever = null | undefined

    type ReactStateMachineComponentProps = {
        useState: useStateFunction<any>
        setState: { (state: string, value: any): void }
    }

    class ReactStateMachine {
        private states: { [key: string]: StateComponentFunction };
        private renderTarget?: React.ReactElement<any, any> | null;
        private stateMachine: StateMachine = new StateMachine()
        private logView: ComponentLogView = {
            state: "base",
            views: [],
            states: ["base"]
        }
        private stateProxy: UseStateProxy = new UseStateProxy()
        private errorView: string[] = [];
        private ErrorStateFunction = (): ComponentLog => {
            return log("base", <ul>{this.errorView.map(e => <li>{e}</li>)}</ul>);
        }

        private ErrorState = new State("error", ["error", "base"], true, (async (message, state, previousState): State => {
            const log = this.ErrorStateFunction()
            if (log.view) this.logView.views.push(log.view)
            this.logView.states.push(log.state)
            return this.stateMachine.getState((await log).state) || this.ErrorState
        }))

        private errorState = this.ErrorState;

        private toState(name: string, isBaseLevel: boolean, ventureStates: string[], componentFunction: StateComponentFunction) {
            return new State(name, ventureStates, isBaseLevel, (async (message, state, previousState): State => {
                const log: ComponentLog = await componentFunction({

                } as Partial<MachineComponentProps>)
                if (log.view) this.logView.views.push(log.view)
                this.logView.states.push(log.state)
                return this.stateMachine.getState((await log).state) || this.ErrorState
            }))
        }

        constructor({
            states,
            errorState
        }: ReactStateMachineProps) {
            this.states = states;
            this.errorState = errorState || this.ErrorState;
        }

        initialize() {
            const machine = this;
            const map = new Map<string, State>();

            if (!(this.logView.state in this.states)) {
                machine.errorView.push("cannot find " + machine.logView.state + " in states map!")
            }

            this.stateMachine.initialize(new class implements NameAccessMapInterface {
                getState(name: string): State | undefined {
                    return map.get(name);
                }
            }, map.get(this.logView.state) || this.ErrorState)

            this.renderTarget = ReactStateMachineRenderTarget({
                useStateProxy: this.stateProxy,
                logView: this.logView,
                stateMachine: this.stateMachine
            })
        }

        handleMessage(message: Named) {
            this.stateMachine.handleState(message);
        }

        getStateMachine(): StateMachine {
            return this.stateMachine;
        }

        getLogView(): ComponentLogView {
            return this.logView;
        }

        getRenderTarget(): ReactElement<any, any> | whatever {
            return this.renderTarget;
        }
    }


    type ReactStateMachineRenderTargetProps = {
        useStateProxy: UseStateProxy,
        logView: ComponentLogView,
        stateMachine: StateMachine,
        context?: React.Context<StateMachine>
    }

    const ReactStateMachineRenderTarget: FunctionComponent<ReactStateMachineRenderTargetProps> = ({
        useStateProxy,
        logView,
        stateMachine,
        context= React.createContext(stateMachine)
    }): ReactElement<any, any> | null => {
        const [rerender, setRerender] = useState(5);

        useEffect(() => {
            useStateProxy.setUseState(useState)

            // todo: review: we may want to subscribe from the componentMachine
            stateMachine.getObservable()?.subscribe(() => {
                setRerender(rerender + 1);
            })
        }, [])


        useEffect(() => {
            if (rerender >= 100) {
                setRerender(1);
            }
        }, [rerender])

        return (<context.Provider value={stateMachine}>
            {logView.views.map((view, i) => <view key={i} />)}
        </context.Provider>);
    }

    const ReactMachine = (props: ReactStateMachineProps) => {
        return new ReactStateMachine(props)
    }

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
            useStateProxy,
            client,
            states: {
                base: ({stateProxy, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
                    const [test, setTest] = stateProxy?.useState("test", false) || [undefined, undefined]
                    return Promise.resolve(log("base", <div/>));
                },
                complex: async ({stateProxy, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
                    const saved = await client.sendMessage(new ClientMessage("app/settings", "save", new UpdateWaveMessage({ options: new Options() })))
                    return Promise.resolve(log("base", <div>{saved}</div>));
                },
            }
        })

        // json react tree matching for output
        componentMachine.initialize();
        expect(componentMachine.getRenderTarget()).toBeTruthy()
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
