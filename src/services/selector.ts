import { getSyncObject, setSyncObject } from '../util/sync'
import {SettingsDAOInterface} from "./settings";
import { SelectorDefault } from "../models/defaults"
import Options from "../models/options";

export interface SelectorServiceInterface {
    addSelector(selector: string): Promise<void>;
    removeSelector(selector: string): Promise<void>;
    useSelector(selector: string): Promise<void>;
    currentSelector(): Promise<string | undefined>;
    getSelectors(): Promise<string[]>;
}

export default class SelectorService implements SelectorServiceInterface {
    settings: SettingsDAOInterface;

    constructor(saveService: SettingsDAOInterface) {
        this.settings = saveService;
    }

    async addSelector(selector: string): Promise<void> {
        // TODO: validate selector? because of how loose the selector protocol is, i'm not sure it's worth it, other than to
        // todo:  callout possibly sus selector characters, like the quotes copied in
        return this.settings.updateCurrentSettings(null, (options: Options) => {
            options.selectors.push(selector);
            return options;
        })
    }

    async currentSelector(): Promise<string | undefined> {
        return Promise.resolve((await this.settings.getCurrentSettings()).wave.selector)
    }

    async removeSelector(selector: string): Promise<void> {
        return this.settings.updateCurrentSettings(null, (options: Options) => {
            options.selectors.splice(options.selectors.indexOf(selector), 1);

            // if the currect selector is the one we want to remove, default gracefully
            if (options.wave.selector === selector) {
                options.wave.selector = options.selectors[options.selectors.length - 1] as unknown as string || SelectorDefault
            }
            return options;
        })
    }

    async useSelector(selector: string): Promise<void> {
        return this.settings.updateCurrentSettings(null, (options: Options) => {
            if (!options.selectors.includes(selector)) {
                options.selectors.push(selector);
            }
            options.wave.selector = selector;
            return options;
        });
    }

    async getSelectors(): Promise<string[]> {
        return (await this.settings.getCurrentSettings())?.selectors;
    }

}