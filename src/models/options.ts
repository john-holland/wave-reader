import AttributeConstructor from "../util/attribute-constructor";
import Wave from "./wave";
import { KeyChord } from "../components/util/user-input";
import {
    WaveAnimationControlDefault,
    ShowNotificationsDefault,
    GoingDefault,
    WaveAnimationControl,
    WaveDefaultFactory,
    KeyChordDefaultFactory,
    SelectorsDefaultFactory
} from "./defaults"
import {State} from "../util/state";

export class WaveToggleConfig extends AttributeConstructor<WaveToggleConfig> {
    // a 1-4ish length array of keys
    keyChord: KeyChord = KeyChordDefaultFactory()

    public constructor(attributes: Partial<WaveToggleConfig> = {}) {
        super(attributes);
        this.keyChord = attributes.keyChord || []
    }

    static getDefaultConfig(): WaveToggleConfig {
        return new WaveToggleConfig()
    }
}

export default class Options extends AttributeConstructor<Options> {
    defaultSettings: boolean = false;
    state: State | undefined = undefined;
    showNotifications: boolean = ShowNotificationsDefault;
    going: boolean = GoingDefault;
    waveAnimationControl: WaveAnimationControl = WaveAnimationControlDefault;
    wave: Wave = WaveDefaultFactory();
    toggleKeys: WaveToggleConfig = WaveToggleConfig.getDefaultConfig();
    selectors: string[] = SelectorsDefaultFactory();

    constructor(props: Partial<Options> = {}) {
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