
interface TextProps {
    textSize: string;
    textColor: string;
}

export default class Text {
    constructor(attributes: TextProps = {
        textSize: '1rem',
        textColor: 'initial'
    }) {
        Object.assign(this, attributes)
    }
}