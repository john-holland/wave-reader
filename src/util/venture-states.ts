import {State} from "./state";

export const BaseVentures: string[] = ["base", "error"]
// if a promised resolved state is a future, then a potential state maybe nicely referred to as a venture?
export const StartVentures: string[] = ["waving"];
export const StopVentures: string[] = ["start", "update", "toggle start", "start mouse"];
export const WavingVentures: string[] = ["stop", "toggle stop", "update", "stop mouse", "start"]; // todo: review: we get ignored stop messages or immediate toggles, and we aren't able to stop if start isn't allowed in waving as i think the popup and the content script get desynced
export const AllVentures: string[] = ["start", "stop", "update", "toggle stop", "toggle start", "stop mouse", "start mouse", "selection mode activate", "selection made", "selection mode deactivate"]

export const Base: State = new State("base", [...StopVentures, "selection mode activate"], true);
