
import Text from '../models/text';

export const defaultCssTemplate = (options: Wave) => `
@-webkit-keyframes wobble {
  0% { transform: translateX(${options.axisTranslateAmountXMax}%); rotateY(${options.axisRotationAmountYMin}deg); }
  15% { transform: translateX(${options.axisTranslateAmountXMin}%) rotateY(${options.axisRotationAmountYMax}deg); }
}

.wave-reader__text {
  font-size: ${options.text?.size || 'inherit'};
  -webkit-animation-name: wobble;
  animation-name: wobble;
  -webkit-animation-duration: ${options.waveSpeed}s;
  animation-duration: ${options.waveSpeed}s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
}
`

export default class Wave {
    text: Text;
    selector?: string;
    cssTemplate?: string;
    waveSpeed?: number;
    axisTranslateAmountXMax?: number;
    axisTranslateAmountXMin?: number;
    axisRotationAmountYMax?: number;
    axisRotationAmountYMin?: number;

    constructor(attributes: Partial<Wave> = {
        text: new Text()
    }) {
        this.text = attributes.text!!
        this.cssTemplate = attributes.cssTemplate || defaultCssTemplate(attributes as Wave);
        Object.assign(this, attributes)
    }

    // mutates the wave if necessary to update the css
    update(): Wave {
        const css = defaultCssTemplate(this);
        if (css != this.cssTemplate) {
            this.cssTemplate = defaultCssTemplate(this);
        }
        return this
    }

    static getDefaultWave() {
        return new Wave({
            selector: "p,h2,h3,h4,h5,h6,h7,h8,article,section,aside,figcaption",
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