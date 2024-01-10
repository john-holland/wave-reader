import StateMachine, {Client} from "./state-machine";
import React, {Dispatch, FunctionComponent, ReactElement, SetStateAction, useEffect, useState} from "react";
import Message from "../models/message";
import {CState, NameAccessMapInterface, Named, State} from "./state";

export type MachineComponentProps = {
    state: UseStateProxy<any>
    machine: StateMachine
    previousState: string
}
export type MachineComponent = ReactElement<any, any> | null & {
}

/**
 * Return to assert the current [MachineComponent]'s as the current view without affecting the view
 */
export type View = {}
export const _View_ = {} as unknown as View;

/**
 * Return to empty the current [views.views], maintaining the previous states (tm)
 */
export type ClearViews = {}
export const _ClearViews_ = {} as unknown as ClearViews;
/**
 * Return to empty [view.states] & [view.views]
 */
export type Clean = {}
export const _Clean_ = {} as unknown as Clean;

export type ComponentLog = {
    state: string,
    /**
     * The [MachineComponent] to log and contribute to building the presented view, returned by the ComponentState functions,
     */
    view?: MachineComponent | View | ClearViews | Clean
}

export type ComponentLogView = {
    states: string[]
    state: string
    views: MachineComponent[]
}

export const log = (state: string, view?: MachineComponent | View | ClearViews | Clean) => {
    return {
        state,
        view
    } as unknown as ComponentLog
}
export const view = (state: string, states: string[], ...views: MachineComponent[]) => {
    return {
        state,
        states,
        views
    } as unknown as ComponentLogView
}

export type StateComponentFunction = { ({state, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> }
export type ReactStateMachineProps<TProps> = {
    initialState: string | Named,
    states: { [key: string]: StateComponentFunction },
    client: Client<Message<any>>,
    errorState?: State
}

export type ReactStateMachineConstructorProps<TProps> = ReactStateMachineProps<TProps> & {
    props: TProps
}

export type useStateFunction<S> = { (initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] }

export class UseStateProxy<TProps extends any | object> {
    useStateFn?: useStateFunction<any>
    useStates: Map<string, SetStateAction<any>> = new Map<string, React.SetStateAction<any>>()
    stateValues: Map<string, any> = new Map<string, any>()
    props: TProps

    constructor(props: TProps, useStateFn?: useStateFunction<any>) {
        this.useStateFn = useStateFn
        this.props = props
    }

    setUseState(useStateFn: useStateFunction<any>) {
        this.useStateFn = useStateFn
    }
    useState<S>(name: string, initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
        const [state, setState] = this.useStateFn!(initialState)
        // todo: review: should an optional , "overwrite" ?
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

export type ReactStateMachineComponentProps = {
    useState: useStateFunction<any>
    setState: { (state: string, value: any): void }
}

export class ReactStateMachine<TProps> {
    private states: { [key: string]: StateComponentFunction };
    private renderTarget?: React.ReactElement<any, any> | null;
    private stateMachine: StateMachine = new StateMachine()
    private logView: ComponentLogView = {
        state: "base",
        views: [],
        states: ["base"]
    }
    private state: UseStateProxy<TProps>;
    private errorView: string[] = [];
    private ErrorStateFunction = (): ComponentLog => {
        return log("base", <ul>{this.errorView.map(e => <li>{e}</li>)}</ul>);
    }

    private ErrorState = new State("error", ["error", "base"], true, (async (message, state, previousState): Promise<State> => {
        const log = this.ErrorStateFunction()
        if (log.view) this.logView.views.push(log.view as MachineComponent)
        this.logView.states.push(log.state)
        return this.stateMachine.getState((await log).state) || this.ErrorState
    }))

    private errorState = this.ErrorState;
    private initialState: string | Named;

    private toState(name: string, isBaseLevel: boolean, ventureStates: string[], componentFunction: StateComponentFunction) {
        return new State(name, ventureStates, isBaseLevel, (async (message, state, previousState): Promise<State> => {
            const log: ComponentLog = await componentFunction({

            } as Partial<MachineComponentProps>)
            if (log.view) this.logView.views.push(log.view as MachineComponent)
            this.logView.states.push(log.state)
            return this.stateMachine.getState((await log).state) || this.ErrorState
        }))
    }

    constructor({
                    states,
                    errorState,
                    props,
                    initialState
                }: ReactStateMachineConstructorProps<TProps>) {
        this.states = states;
        this.errorState = errorState || this.ErrorState;
        this.state = new UseStateProxy<TProps>(props);
        this.initialState = initialState;
    }

    initialize() {
        const machine = this;
        const map = new Map<string, State>();

        this.logView.state = typeof this.initialState === "string" ? this.initialState : (this.initialState as Named)?.name || "base";
        if (!(this.logView.state in this.states)) {
            machine.errorView.push("cannot find initialState " + machine.logView.state + " in states map!")
        }

        Object.keys(this.states).forEach(key => {
            map.set(key, CState(key, [], true,
                async (message, state, previousState): Promise<State | undefined> => {
                const result: ComponentLog = await this.states[key](
                    {
                        machine: this,
                        state: this.state,
                        previousState: previousState
                    } as unknown as MachineComponentProps)

                // this feels a little squirrelly, but i'd rather log what we consider effecting here, as the state mutex
                // especially since we observe deterministically
                this.logView.states.push(this.logView.state)
                this.logView.state = result.state

                // on the upside, optional types & type unions give us a neat little pattern matching pattern!
                const matchComponent = (view?: MachineComponent): Promise<State> | State | undefined => {
                    if (view) this.logView.views.push(view);
                    else return undefined;

                    return Promise.resolve(map.get(result.state)!)
                }

                const matchView = (view?: View): Promise<State> | State | undefined => {
                    if (!view) return undefined;

                    return Promise.resolve(map.get(result.state)!)
                }

                const matchClearViews = (view?: ClearViews): Promise<State> | State | undefined => {
                    if (!view) return undefined;

                    this.logView.views = [];

                    return Promise.resolve(map.get(result.state)!)
                }


                const matchClean = (view?: ClearViews): Promise<State> | State | undefined => {
                    if (!view) return undefined;

                    this.logView.views = [];
                    this.logView.states = [];

                    return Promise.resolve(map.get(result.state)!)
                }

                return matchComponent(result.view as MachineComponent) ||
                        matchView(result.view as View) ||
                        matchClearViews(result.view as ClearViews) ||
                        matchClean(result.view as Clean);
            }))
        })

        this.stateMachine.initialize(new class implements NameAccessMapInterface {
            getState(name: string): State | undefined {
                return map.get(name);
            }
        }, map.get(this.logView.state) || this.ErrorState)

        this.renderTarget = ReactStateMachineRenderTarget({
            useStateProxy: this.state,
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


export type ReactStateMachineRenderTargetProps<TProps> = {
    useStateProxy: UseStateProxy<TProps>,
    logView: ComponentLogView,
    stateMachine: StateMachine,
    context?: React.Context<StateMachine>
}

export const ReactStateMachineRenderTarget: FunctionComponent<ReactStateMachineRenderTargetProps<any>> = ({
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

export type ReactMachineFunction<TProps = {}> = { (props: TProps): ReactStateMachine<TProps> };
// const declaration definition didn't work for generics... :( weird :(
export function ReactMachine<TProps>(machineProps: ReactStateMachineProps<TProps>): ReactMachineFunction<TProps> {
    return (props: TProps) => new ReactStateMachine<TProps>({ props, ...machineProps } as unknown as ReactStateMachineConstructorProps<TProps>)
}
