import AttributeConstructor from "../util/attribute-constructor";
import {KeyChord} from "../components/util/user-input";
import Wave, { WaveAnimationControl } from "./wave";


export const KeyChordDefault = ["w", "Shift"]
export const WaveAnimationControlDefault: WaveAnimationControl = WaveAnimationControl.CSS;
export const ShowNotificationsDefault = true
export const GoingDefault = false
export const WaveDefaultFactory = () => Wave.getDefaultWave()
export const SelectorDefault: string = "div, pre, p, paragraph"
export const SelectorsDefault = [SelectorDefault]