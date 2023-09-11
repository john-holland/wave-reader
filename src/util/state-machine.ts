import {State, NameAccessMapInterface, Named} from "./state"
import {Observable, Subscriber} from "rxjs";
// import {BaseVentures} from "./venture-states";


class StateMachine {
    initialized: boolean = false;
    map: NameAccessMapInterface | undefined = undefined;
    currentState: State | undefined = undefined;
    // todo: review, this may be a useful feature, i almost didn't yagni this in a test (which sounds weird)
    private stateObservable?: Observable<State | undefined>
    private stateSubscriber?: Subscriber<State | undefined>;

    constructor() {
    }

    /**
     * @remarks Please note, the stateObservable does not report the originState
     * @param stateMachineMap [NameAccessMapInterface] a map of state-machine states by name
     * @param originState [State] a starting state (often "base")
     */
    initialize(stateMachineMap: NameAccessMapInterface, originState: State) {
        // TODO: guard for env?
        if (this.map !== undefined) console.log("initialize called with predefined map outside of test conditions: " + JSON.stringify(this.map));
        if (this.currentState !== undefined) console.log("initialize called with predefined currentState outside of test conditions: " + JSON.stringify(this.currentState));
        this.map = stateMachineMap;
        this.currentState = originState;
        if (this.map !== undefined && this.currentState !== undefined) this.initialized = true;

        const setStateSubscriber = (stateSubscriber: Subscriber<State | undefined>) => this.stateSubscriber = stateSubscriber;
        this.stateObservable = new Observable<State | undefined>((subscriber) => {
            setStateSubscriber(subscriber)
        });
    }

    getObservable(): Observable<State | undefined> | null {
        return this.stateObservable || null;
    }

    getBaseState(): State | undefined {
        return this.map?.getState("base");
    }

    getErrorState(): State | undefined {
        return this.map?.getState("error");
    }

    protected validateState(newState: Named): State | undefined {
        if (!this.initialized) throw new Error("not initialized, no StateMachineMap")

        const state = this.map?.getState(newState.name);

        if (!state || (!state?.isBaseLevel && !this.currentState?.ventureStates.includes(newState.name))) {
            console.error(this.currentState?.error(), (newState as State)?.error());
            return this.getErrorState();
        }

        return this.getState(newState.name)
    }

    protected async processState(message: Named, state: State | undefined, previousState: State): Promise<State | undefined> {
        if (!this.initialized) throw new Error("not initialized, no StateMachineMap")
        if (state === undefined) console.log("State undefined for previous state" + JSON.stringify(previousState))

        this.stateSubscriber?.next(state);

        if (typeof state?.stateEffects === 'function') {
            this.currentState = await state.stateEffects(message, state, previousState) || this.getBaseState();
            if (this.currentState?.name === "base") {
                console.log("transitioning back to base");
            }
        } else {
            console.log(`no stateEffects defined for ${state?.name}, transitioning back to base`)
            this.currentState = this.getBaseState();
        }

        this.stateSubscriber?.next(this.currentState);
        return this.currentState;
    }

    /**
     * Validates and processes the message, returning the state due to the [State#stateeffects()] or BaseState
     * @param namedState the message from chrome.runtime to be passed through to the [State#stateeffects()]
     * @return the BaseState or state from [State#stateeffects()]
     */
    handleState(namedState: Named): Promise<State | undefined> {
        if (!this.initialized) throw new Error("not initialized, no StateMachineMap")

        const state = this.validateState(namedState)
        /* eslint-disable  @typescript-eslint/no-extra-non-null-assertion */
        return this.processState(namedState, state, this.currentState!!)!!;
    }

    getState(name: string): State | undefined {
        if (!this.initialized) throw new Error("not initialized, no StateMachineMap")

        return this.map?.getState(name);
    }

    getCurrentState(): State | undefined {
        return this.currentState;
    }
}

export default StateMachine;