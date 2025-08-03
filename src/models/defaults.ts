import Wave from "./wave";


export const enum WaveAnimationControl {
    CSS,
    MOUSE
}

export const KeyChordDefaultFactory = () => ["w", "Shift"]
export const WaveAnimationControlDefault: WaveAnimationControl = WaveAnimationControl.MOUSE;
export const ShowNotificationsDefault = true
export const GoingDefault = false
export const WaveDefaultFactory = () => Wave.getDefaultWave()
export const SelectorDefault: string = "body,iframe" /* "p,h2,h3,h4,h5,h6,h7,h8,article,section,aside,figcaption,pre,div" */
export const SelectorsDefaultFactory = () => [SelectorDefault]
export const WindowDocumentWidth = 600