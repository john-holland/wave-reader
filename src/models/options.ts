import AttributeConstructor from "../util/attribute-constructor";
import Wave from "./wave";
import { KeyChord } from "../components/util/user-input";

export enum WaveAnimationControl {
    CSS,
    MOUSE
}

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
    showNotifications: boolean = true;
    going: boolean = false;
    waveAnimationControl: WaveAnimationControl = WaveAnimationControl.CSS;
    wave: Wave = Wave.getDefaultWave();
    toggleKeys: WaveToggleConfig = WaveToggleConfig.getDefaultConfig();
    selectors: string[] = [];

    constructor(props: Partial<Options> = Options.getDefaultOptions()) {
        super(undefined);
        // typescript auto-fills defaults here, if this is the desired behavior
        super.assign(props);
        // rehydrate the wave property as it surprisingly loses type after deserialization
        this.wave = new Wave(this.wave);
    }

    public static getDefaultOptions(): Options {
        return new Options({
            showNotifications: true,
            going: false,
            wave: Wave.getDefaultWave(),
            selectors: ['p,div,pre,paragraph']
        });
    }
}