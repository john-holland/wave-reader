import AttributeConstructor from "../util/attribute-constructor";
import Wave from "./wave";

export default class Options extends AttributeConstructor<Options> {
    showNotifications: boolean = true;
    going: boolean = false;
    wave: Wave = Wave.getDefaultWave();

    constructor(props: Partial<Options> = { }) {
        super(props);
    }

    public static getDefaultOptions(): Options {
        return new Options({
            showNotifications: true,
            going: false,
            wave: Wave.getDefaultWave()
        });
    }
}
