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

const DeepEquals = (a: Object, b: Object): boolean => {
    if (typeof a !== 'object' && a === b) {
        return true;
    }

    const aString = JSON.stringify(a);
    const bString = JSON.stringify(b);

    const aObj = JSON.parse(aString);
    const bObj = JSON.parse(bString);

    if (Object.keys(aObj).find(prop => !(prop in bObj)) || Object.keys(bObj).find(prop => !(prop in aObj))) {
        console.log("array mismatch for property: aString: " + aString + ", bString: " + bString);
        return false;
    }

    for (let prop in aObj) {
        if (Array.isArray(aObj[prop]) || Array.isArray(bObj[prop])) {
            if (aObj[prop].find((ap: any, i: number) => Array.isArray(bObj[prop]) && !Object.is(ap, bObj[prop][i]))) {
                console.log(" array mismatch for property: " + prop);
                return false;
            }
        } else {
            if (!DeepEquals(aObj[prop], bObj[prop])) {
                console.log(" array mismatch for property: " + prop);
                return false;
            }
        }
    }

    return true;
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

    public static OptionsEqual(a: Options, b: Options) {
        return DeepEquals(a, b);
    }
}