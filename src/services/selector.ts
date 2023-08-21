import { getSyncObject, setSyncObject } from '../util/sync'
import {SettingsInterface} from "./settings";
import { SelectorDefault } from "../models/defaults"

export interface SelectorServiceInterface {
    addSelector(selector: string): void;
    removeSelector(selector: string): void;
    useSelector(selector: string): boolean;
    currentSelector(): string;
    getSelectors(): string[];
}

export default class SelectorService implements SelectorServiceInterface {
    settings: SettingsInterface;

    constructor(saveService: SettingsInterface) {
        this.settings = saveService;
    }

    async addSelector(selector: string): void {
        // TODO: validate selector? because of how loose the selector protocol is, i'm not sure it's worth it, other than to
        // todo:  callout possibly sus selector characters, like the quotes copied in
        return this.settings.updateCurrentSettings(options => {
            options.selectors.push(selector);
            return options;
        })
    }

    async currentSelector(): string {
        return Promise.resolve((await this.settings.getCurrentSettings()).wave.selector)
    }

    async removeSelector(selector: string): void {
        return this.settings.updateCurrentSettings(options => {
            options.selectors.splice(options.selectors.indexOf(selector), 1);

            // if the currect selector is the one we want to remove, default gracefully
            if (options.wave.selector === selector) {
                options.wave.selector = options.selectors[0] as unknown as string || SelectorDefault
            }
            return options;
        })
    }

    async useSelector(selector: string): boolean {
        return this.settings.updateCurrentSettings(options => {
            if (!options.selectors.includes(selector)) {
                options.selectors.push(selector);
            }
            options.wave.selector = selector;
            return options;
        });
    }

    async getSelectors(): string[] {
        return this.settings.getCurrentSettings()?.selectors;
    }

}