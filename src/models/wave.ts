
import Text from '../models/text';
import AttributeConstructor from "../util/attribute-constructor";
import {SelectorDefault} from "./defaults";

export const defaultCssTemplate = (options: Wave) => `
@-webkit-keyframes wobble {
  0% { transform: translateX(${options.axisTranslateAmountXMax}%); rotateY(${options.axisRotationAmountYMin}deg); }
  15% { transform: translateX(${options.axisTranslateAmountXMin}%) rotateY(${options.axisRotationAmountYMax}deg); }
}

${options.selector || '.wave-reader__text'} {
  font-size: ${options.text?.size || 'inherit'};
  -webkit-animation-name: wobble;
  animation-name: wobble;
  -webkit-animation-duration: ${options.waveSpeed}s;
  animation-duration: ${options.waveSpeed}s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
}
`;

// maybe change initial 0% animation frame of wobble to 'initial' values
//   and 15% to replacement values, such that the animation will pan to the new rotation
//   NOTE: this may be the existing behavior.
export const defaultCssMouseTemplate = (options: Wave) => `
@-webkit-keyframes wobble {
  0% { transform: translateX(initial); rotateY(initial); }
  15% { transform: translateX(TRANSLATE_X%); rotateY(ROTATE_Ydeg); }
}

${options.selector || '.wave-reader__text'} {
  font-size: ${options.text?.size || 'inherit'};
  -webkit-animation-name: wobble;
  animation-name: wobble;
  -webkit-animation-duration: ${options.waveSpeed}s;
  animation-duration: ${options.waveSpeed}s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
}
`;

const TRANSLATE_X = "TRANSLATE_X";
const ROTATE_Y = "ROTATE_Y";

export const replaceAnimationVariables = (wave: Wave, translateX: string, rotateY: string): string => {
    return (wave.cssMouseTemplate || "")
        .replaceAll(TRANSLATE_X, translateX)
        .replaceAll(ROTATE_Y, rotateY);
}

export default class Wave extends AttributeConstructor<Wave>{
    text: Text = new Text();
    selector?: string;
    cssTemplate?: string;
    cssMouseTemplate?: string;
    waveSpeed?: number;
    axisTranslateAmountXMax?: number;
    axisTranslateAmountXMin?: number;
    axisRotationAmountYMax?: number;
    axisRotationAmountYMin?: number;

    constructor(attributes: Partial<Wave> = Wave.getDefaultWave()) {
        super(attributes);
        this.cssTemplate = attributes.cssTemplate || defaultCssTemplate(attributes as Wave);
        this.cssMouseTemplate = attributes.cssMouseTemplate || defaultCssMouseTemplate(attributes as Wave)
    }

    // mutates the wave if necessary to update the css
    public update(): Wave {
        const css = defaultCssTemplate(this);
        if (css != this.cssTemplate && !this.cssTemplate) {
            this.cssTemplate = defaultCssTemplate(this);
            this.cssMouseTemplate = defaultCssMouseTemplate(this);
        }
        return this
    }

    public static getDefaultWave(): Wave {
        return new Wave({
            selector: SelectorDefault,
            waveSpeed: 4,
            axisTranslateAmountXMax: 0,
            axisTranslateAmountXMin: -1,
            axisRotationAmountYMin: -2,
            axisRotationAmountYMax: 2,
            text: new Text({
                size: 'initial',
                color: 'initial'
            })
        });
    }
}