import AttributeConstructor from "../util/attribute-constructor";
import Wave from "./wave";

export enum WaveAnimationControl {
    CSS,
    MOUSE
}

export default class Options extends AttributeConstructor<Options> {
    showNotifications: boolean = true;
    going: boolean = false;
    waveAnimationControl: WaveAnimationControl = WaveAnimationControl.CSS;
    wave: Wave = Wave.getDefaultWave();

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
            wave: Wave.getDefaultWave()
        });
    }
}