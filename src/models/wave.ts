
import Text from '../models/text';
import AttributeConstructor from "../util/attribute-constructor";
import {SelectorDefault} from "./defaults";

export const defaultCssTemplate = (options: Wave) => `
@-webkit-keyframes wobble {
  0% { transform: translateX(0%); rotateY(0deg); }
  25% { transform: translateX(${options.axisTranslateAmountXMin}%); rotateY(${options.axisRotationAmountYMin}deg); }
  50% { transform: translateX(0%); rotateY(${options.axisRotationAmountYMax}deg); }
  75% { transform: translateX(${options.axisTranslateAmountXMax}%); rotateY(${options.axisRotationAmountYMin}deg); }
  100% { transform: translateX(0%); rotateY(0deg); }
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

// Direct positioning template - no keyframes, just direct transforms
export const defaultCssMouseTemplate = (options: Wave) => `
${options.selector || '.wave-reader__text'} {
  font-size: ${options.text?.size || 'inherit'};
  transform: translateX(TRANSLATE_X%) rotateY(ROTATE_Ydeg);
  transition: transform ANIMATION_DURATIONs ease-out;
}
`;

const TRANSLATE_X = "TRANSLATE_X";
const ROTATE_Y = "ROTATE_Y";
const ANIMATION_DURATION = "ANIMATION_DURATION";

export const replaceAnimationVariables = (wave: Wave, translateX: string, rotateY: string): string => {
    return (wave.cssMouseTemplate || "")
        .replaceAll(TRANSLATE_X, translateX)
        .replaceAll(ROTATE_Y, rotateY);
}

export const replaceAnimationVariablesWithDuration = (wave: Wave, translateX: string, rotateY: string, duration: number): string => {
    let css = wave.cssMouseTemplate || "";
    css = css.replaceAll(TRANSLATE_X, translateX);
    css = css.replaceAll(ROTATE_Y, rotateY);
    css = css.replaceAll(ANIMATION_DURATION, duration.toString());
    return css;
}

const enum WaveShape {
    AUTO, // based on the wave shape options, choose best fit
    F_SHAPED, // left to right (per orientation, like an ocean wave
    LAYER_CAKE, // a swirl, broadly based on headers
    F_SHAPED_STOP // the f-shaped wave, but stops horizontally at each horizontal page break, animating,
    // offset each stop by a small degree, slightly more exagerated maybe but could really help those that spend a lot of
    // their time scanning losely collected pages like personal shoppers, or people addicted to pinterest etc

    // todo: perhaps a WaveRecommendationService, as we could pass in the result from the user selector choice,
    //  then suggest a preset or a custom
    // todo: research whether or not, layer cake or f-shaped scanning is:
    //  - user preference (nurture)
    //  - innate brain stuff (nature)
    //  - a combination (both)
    //  hypothesis: combination, based on the alignment of the page - more grid like, layer cake, more article like, f-shaped
    //   https://www.nngroup.com/articles/layer-cake-pattern-scanning/
    //  theory: the more evenly spaced the page, the more we should apply swirl animation to each stop
    //       similar to the needleman-wunsch algorithm, we want to calculate a spread from expected average position
    //  theory: (of my own behavior), spread(set, h, w, n, count) = <set[n].x - n * w/count, set[n].y - n * h/count>
    //       if the avg sum of widths for horizontal and vertical is less than 1 standard deviation for each axis
    //          then we have relatively evenly spread grid, and should use layer cake pattern for this selection
    //       if the avg width sum of widths for horizontal and vertical is greater than 1 standard deviation for each axis
    //          then we have an oblong shaped article, and should use an F-shaped pattern
    //       todo: research:
    //          if we choose layer-cake, we should check to see if each horizontal stop resembles an F-shaped, or layer cake pattern
    //             then if we're still layer-caked, we stay with swirl, if not, we use hybrid or combination
}

export default class Wave extends AttributeConstructor<Wave>{
    text: Text = new Text();
    selector?: string;
    cssTemplate?: string;
    cssMouseTemplate?: string;
    waveSpeed?: number;
    shape: WaveShape = WaveShape.F_SHAPED
    axisTranslateAmountXMax?: number;
    axisTranslateAmountXMin?: number;
    axisRotationAmountYMax?: number;
    axisRotationAmountYMin?: number;
    mouseFollowInterval?: number;

    constructor(attributes: Partial<Wave> = Wave.getDefaultWave()) {
        super(attributes);
        // Always generate CSS templates from current parameters (shader-like approach)
        // Use the attributes directly to ensure we have the correct values
        const waveWithAttributes = { ...this, ...attributes };
        this.cssTemplate = defaultCssTemplate(waveWithAttributes);
        this.cssMouseTemplate = defaultCssMouseTemplate(waveWithAttributes);
    }

    // Always regenerate CSS templates from current parameters
    public update(): Wave {
        this.cssTemplate = defaultCssTemplate(this);
        this.cssMouseTemplate = defaultCssMouseTemplate(this);
        return this
    }

    public static getDefaultWave(): Wave {
        return new Wave({
            selector: SelectorDefault,
            waveSpeed: 4,
            shape: WaveShape.F_SHAPED,
            axisTranslateAmountXMax: 0,
            axisTranslateAmountXMin: -1,
            axisRotationAmountYMin: -2,
            axisRotationAmountYMax: 2,
            mouseFollowInterval: 100,
            text: new Text({
                size: 'initial',
                color: 'initial'
            })
        });
    }
}