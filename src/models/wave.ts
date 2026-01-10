
import Text from '../models/text';
import AttributeConstructor from "../util/attribute-constructor";
import {SelectorDefault} from "./defaults";

export const defaultCssTemplate = (options: Wave, cssGenerationMode: 'template' | 'hardcoded' = 'hardcoded') => {
  const mode = cssGenerationMode || 'hardcoded';
  
  if (mode === 'template') {
    // Template mode: Use TEMPLATE variables that get replaced at runtime
    return `
@-webkit-keyframes wobble {
  0% { transform: translateX(0%); rotateY(0deg); }
  25% { transform: translateX(TRANSLATE_X_MIN%) rotateY(ROTATE_Y_MINdeg); }
  50% { transform: translateX(0%); rotateY(ROTATE_Y_MAXdeg); }
  75% { transform: translateX(TRANSLATE_X_MAX%) rotateY(ROTATE_Y_MINdeg); }
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
  } else {
    // Hardcoded mode: Use actual values (current behavior)
    return `
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
  }
};

// Direct positioning template - no keyframes, just direct transforms
export const defaultCssMouseTemplate = (options: Wave, cssGenerationMode: 'template' | 'hardcoded' = 'template') => {
  const mode = cssGenerationMode || 'template';
  
  if (mode === 'template') {
    // Template mode: Use TEMPLATE variables (current behavior)
    return `
${options.selector || '.wave-reader__text'} {
  font-size: ${options.text?.size || 'inherit'};
  transform: translateX(TRANSLATE_X%) rotateY(ROTATE_Ydeg);
  transition: transform ANIMATION_DURATIONs ease-out;
}
`;
  } else {
    // Hardcoded mode: Use actual values (for consistency with CSS template)
    // Note: For mouse template, hardcoded mode is less useful since values change dynamically,
    // but we provide it for consistency
    return `
${options.selector || '.wave-reader__text'} {
  font-size: ${options.text?.size || 'inherit'};
  transform: translateX(0%) rotateY(0deg);
  transition: transform ${options.waveSpeed || 2}s ease-out;
}
`;
  }
};

const TRANSLATE_X = "TRANSLATE_X";
const ROTATE_Y = "ROTATE_Y";
const ANIMATION_DURATION = "ANIMATION_DURATION";
const TRANSLATE_X_MIN = "TRANSLATE_X_MIN";
const TRANSLATE_X_MAX = "TRANSLATE_X_MAX";
const ROTATE_Y_MIN = "ROTATE_Y_MIN";
const ROTATE_Y_MAX = "ROTATE_Y_MAX";

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

/**
 * Replaces keyframe animation placeholders in CSS template with actual values
 * Used when cssGenerationMode is 'template' to replace placeholders at runtime
 */
export const replaceKeyframePlaceholders = (cssTemplate: string, wave: Wave): string => {
    let css = cssTemplate;
    css = css.replaceAll(ANIMATION_DURATION, (wave.waveSpeed || 2).toString());
    css = css.replaceAll(TRANSLATE_X_MIN, (wave.axisTranslateAmountXMin || 0).toString());
    css = css.replaceAll(TRANSLATE_X_MAX, (wave.axisTranslateAmountXMax || 0).toString());
    css = css.replaceAll(ROTATE_Y_MIN, (wave.axisRotationAmountYMin || 0).toString());
    css = css.replaceAll(ROTATE_Y_MAX, (wave.axisRotationAmountYMax || 0).toString());
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
    cssGenerationMode?: 'template' | 'hardcoded';

    constructor(attributes: Partial<Wave> = Wave.getDefaultWave()) {
        super(attributes);
        // Always generate CSS templates from current parameters (shader-like approach)
        // Use the attributes directly to ensure we have the correct values
        const waveWithAttributes = { ...this, ...attributes };
        const cssGenerationMode = attributes.cssGenerationMode || 'hardcoded';
        this.cssGenerationMode = cssGenerationMode;
        this.cssTemplate = defaultCssTemplate(waveWithAttributes, cssGenerationMode);
        this.cssMouseTemplate = defaultCssMouseTemplate(waveWithAttributes, cssGenerationMode);
    }

    // Always regenerate CSS templates from current parameters
    public update(): Wave {
        const cssGenerationMode = this.cssGenerationMode || 'hardcoded';
        this.cssTemplate = defaultCssTemplate(this, cssGenerationMode);
        this.cssMouseTemplate = defaultCssMouseTemplate(this, cssGenerationMode);
        return this
    }

    public static getDefaultWave(): Wave {
        return new Wave({
            selector: SelectorDefault,
            waveSpeed: 4,
            shape: WaveShape.F_SHAPED,
            axisTranslateAmountXMax: 1,
            axisTranslateAmountXMin: 0,
            axisRotationAmountYMin: -1,
            axisRotationAmountYMax: 1,
            mouseFollowInterval: 100,
            text: new Text({
                size: 'initial',
                color: 'initial'
            })
        });
    }
}