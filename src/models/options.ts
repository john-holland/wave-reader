
interface OptionsProps {
    showNotifications: boolean;
}

export default class Options {
    constructor(props: OptionsProps = {
        showNotifications: false
    }) {
        Object.assign(this, props)
    }

    public static getDefaultOptions(): Options {
        return new Options();
    }
}
