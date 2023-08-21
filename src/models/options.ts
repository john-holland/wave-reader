import AttributeConstructor from "../util/attribute-constructor";
import Wave, { WaveAnimationControl } from "./wave";
import { KeyChord } from "../components/util/user-input";
import {
    SelectorDefault,
    KeyChordDefault,
    WaveAnimationControlDefault,
    ShowNotificationsDefault,
    GoingDefault,
    WaveDefault,
    SelectorsDefault, WaveDefaultFactory
} from "./defaults"


export class WaveToggleConfig extends AttributeConstructor<WaveToggleConfig> {
    // a 1-4ish length array of keys
    keyChord: KeyChord = []

    public constructor(attributes: Partial<WaveToggleConfig> = WaveToggleConfig.getDefaultConfig()) {
        super(attributes);
        this.keyChord = attributes.keyChord || []
    }

    static getDefaultConfig(): WaveToggleConfig {
        return new WaveToggleConfig({
            keyChord: ["w", "Shift"]
        })
    }
}

export default class Options extends AttributeConstructor<Options> {
    showNotifications: boolean = ShowNotificationsDefault;
    going: boolean = GoingDefault;
    waveAnimationControl: WaveAnimationControl = WaveAnimationControlDefault;
    wave: Wave = WaveDefaultFactory();
    toggleKeys: WaveToggleConfig = WaveToggleConfig.getDefaultConfig();
    selectors: string[] = SelectorsDefault;

    constructor(props: Partial<Options> = Options.getDefaultOptions()) {
        super(undefined);
        // typescript auto-fills defaults here, if this is the desired behavior
        super.assign(props);
        // rehydrate the wave property as it surprisingly loses type after deserialization
        this.wave = new Wave(this.wave);
    }

    public static getDefaultOptions(): Options {
        return new Options();
    }
}