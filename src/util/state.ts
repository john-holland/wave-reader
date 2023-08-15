
// new wrapper for compose-ability and sanity, recycle new's here: new new new new new new new new new new new new new
export type Named = {
     name: string
}
export class State implements Named {
    name: string
    ventureStates: string[]
    isBaseLevel: boolean
    stateEffects: {(message: Named, state: State, previousState: State): State | undefined} | undefined

    constructor(name = "default",
                ventureStates: string[] = [],
                isBaseLevel = true,
                stateEffects: {(message: Named, state: State, previousState: State): State | undefined} | undefined = undefined) {
        this.name = name;
        this.ventureStates = ventureStates;
        this.isBaseLevel = isBaseLevel;
        this.stateEffects = stateEffects; // [{(state: State): State}
    }

    error(opts = undefined) {
        return `${this.name} state ${this.isBaseLevel ? "(base level)" : ""}with sub states ${this.ventureStates.join()} ${(opts ? " " + opts : "")}`;
    }
}

export interface NameAccessMapInterface {
    getState(name: string): State | undefined;
}

export interface StateNames {
    [key: string]: State;
}

export const CState = (name = "default",
                       ventureStates: string[] = [],
                       isBaseLevel = true,
                       stateEffects: {(message: Named, state: State, previousState: State): State | undefined} | undefined = undefined) => {
    return new State(name, ventureStates, isBaseLevel, stateEffects);
}