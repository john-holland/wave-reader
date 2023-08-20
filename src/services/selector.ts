import { getSyncObject, setSyncObject } from '../util/sync'
import {SettingsInterface} from "./settings";

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
        // TODO: validate selector?
        this.settings.updateCurrentSettings(options => {
            options.selectors.push(selector);
            return options;
        })
    }

    async currentSelector(): string {
        return (await this.settings.getCurrentSettings()).wave.selector
    }

    async removeSelector(selector: string): void {
        return new Promise((resolve, reject) => {
            this.settings.updateCurrentSettings(options => {
                options.selectors.splice(options.selectors.indexOf(selector), 1);
                return options;
            })
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