import Options from "../models/options";
import {currentTab} from "../util/util";
import {getSyncObject, setSyncObject} from "../util/sync";
import {State} from "../util/state";

type Tab = {
    url: string
}

export interface SettingsRegistry {
    [key: string]: DomainSettings;
}


const tabUrl = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        (currentTab() as unknown as Promise<string[]>).then((tabs: Tab[]) => {
            if (tabs.length === 0) {
                reject(0)
            } else {
                resolve(tabs[0].url)
            }
        });
    })
}

export class DomainSettings {
    // the domain including subdomain and protocol: everything from http or file to path (group 0): ^(.+)(\..+\/|$)
    domain: string;
    // the path not including query string (group 2): ^(.+)\/(.+)([\?\#].+)$
    pathSettings: Map<string, Options>

    constructor(domain: string, pathSettings: Map<string, Options>) {
        this.domain = domain;
        this.pathSettings = pathSettings;
    }
}

export interface SettingsInterface {
    /**
     * Find the current settings for the active tab with domain and pathSettings
     * @returns [Options] the options for the current tab or default
     */
    getCurrentSettings(): Options;
    updateCurrentSettings(update: { (options: Options): Options }): Promise<void>;
    getSettingsForDomain(domain: string): DomainSettings | undefined;
    addSettingsForDomain(domain: string, path: string, settings: Options): void;
    getSettingsForDomain(domain: string, path: string): Options;
    copySettingsFromDomain(from: DomainSettings, fromPath: string, domain: string, path: string, acceptExisting: boolean = true): Promise<void>;
    removeSettingsForDomain(domain: string): Promise<boolean>;
    removeSettingsForDomain(domain: string, path: string): Promise<boolean>;
}

interface SettingsRegistry {
    [key: string]: DomainSettings;
}

const getSettingsRegistry = (callback: {(settingsRegistry: SettingsRegistry): void}) => {
    const defaultsettingsRegistry: SettingsRegistry = { "initial": Options.getDefaultOptions() };
    getSyncObject(SettingsRegistryStorageKey, defaultsettingsRegistry, callback);
}

const saveSettingsRegistry = (settingsRegistry: SettingsRegistry, callback?: {(): void}) => {
    setSyncObject(SettingsRegistryStorageKey, settingsRegistry, callback)
}

const SettingsRegistryStorageKey = "wave_reader__settings_registry";
export default class SettingsService implements SettingsInterface {
    private settingsRegistryProvider: (callback: { (settingsRegistry: SettingsRegistry): void }) => void;
    private tabUrlProvider: () => Promise<string>;
    private saveSettingsRegistryProvider: (settingsRegistry: SettingsRegistry, callback?: { (): void }) => void;

    constructor(settingsRegistryProvider = getSettingsRegistry, tabUrlProvider = currentTab,
                saveSettingsRegistryProvider = saveSettingsRegistry) {
        this.settingsRegistryProvider = settingsRegistryProvider;
        this.tabUrlProvider = tabUrlProvider;
        this.saveSettingsRegistryProvider = saveSettingsRegistryProvider;
    }

    async addSettingsForDomain(domain: string, path: string, settings: Options): Promise<void> {
        return new Promise(async (resolve, reject) => {
           const registry = await this.getSettingsRegistryForDomain(domain, true);
           registry[domain]?.pathSettings.set(path, settings);
           resolve();
        })
    }

    /**
     * @param from settings to copy from
     * @param fromPath the path from which to copy settings
     * @param domain copy to domain
     * @param path copy to path
     * @param acceptExisting should accept existing settings
     */
    async copySettingsFromDomain(from: DomainSettings, fromPath: string, domain: string, path: string, acceptExisting: boolean = true): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!from.pathSettings.has(fromPath)) {
                reject(fromPath)
            }
            await this.addSettingsForDomain(domain, path, from.pathSettings.get(fromPath))
            resolve();
        })
    }

    async getCurrentSettings(): Options {
        return new Promise((resolve, reject) => {
            this.tabUrlProvider().then((url) => {
                const urlobj = new URL(url);

                this.settingsRegistryProvider(settingsRegistry => {
                    if (urlobj.hostname in settingsRegistry) {
                        const domainSettings = settingsRegistry[urlobj.hostname];
                        if (!domainSettings.pathSettings.has(urlobj.pathname)) {
                            const availableOptions = domainSettings.pathSettings.values().next()?.value || Options.getDefaultOptions();

                            console.log(`defaulting options for ${urlobj.hostname} with path: ${urlobj.pathname}`)
                            domainSettings.pathSettings.set(urlobj.pathname, availableOptions)
                        }

                        resolve(domainSettings.pathSettings.get(urlobj.pathname))
                    }
                })
            });
        });
    }

    async getSettingsRegistryForDomain(domain: string, defaultUndefined: boolean = true): SettingsRegistry | undefined {
        return new Promise((resolve, reject) => {
            this.settingsRegistryProvider(settingsRegistry => {
                if (!(domain in settingsRegistry)) {
                    if (defaultUndefined) {
                        console.log(`defaulting options for ${domain} with path:`)
                        settingsRegistry[domain] = new DomainSettings(domain, new Map<string, Options>({"": Options.getDefaultOptions()}))
                    } else {
                        console.log("no entry for domain in the settings registry matched the desired DomainSettings")
                        resolve(undefined);
                    }
                }


                resolve(settingsRegistry)
            })
        });
    }

    async getSettingsForDomain(domain: string, defaultUndefined: boolean = true): DomainSettings | undefined {
        const domainSettings = await this.getSettingsRegistryForDomain(domain, defaultUndefined);

        return domainSettings;
    }

    async getSettingsForDomain(domain: string, path: string, defaultUndefined = true, useExistingInsteadOfNew = true): Options | undefined {
        const domainSettings = await this.getSettingsForDomain(domain, defaultUndefined);

        if (!domainSettings?.pathSettings.has(path)) {
            const availableOptions = useExistingInsteadOfNew ? domainSettings?.pathSettings.values().next()?.value || Options.getDefaultOptions() : Options.getDefaultOptions();

            console.log(`defaulting options for ${domain} with path: ${path}`)
            domainSettings?.pathSettings.set(path, availableOptions)
        }

        return domainSettings?.pathSettings.get(path);
    }

    async updateCurrentSettings(update: { (options: Options): Options }): Promise<void> {
        return this.tabUrlProvider().then(async (url) => {
            const tab = new URL(url);

            tab.pathname
            tab.hostname
            const domainSettings = await this.getCurrentSettings();
            return this.addSettingsForDomain(tab.hostname, tab.pathname, update(domainSettings))
        });
    }

    /**
     * removes the selected domain settings from the settings registry
     * @param domain the url domain to remove
     * @returns [Promise<boolean>] if true, removed, false, not present, catch, internal error
     */
    async removeSettingsForDomain(domain: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.settingsRegistryProvider(settingsRegistry => {
                if (domain in settingsRegistry) {
                    delete settingsRegistry[domain];
                    this.saveSettingsRegistryProvider(settingsRegistry, () => {
                        resolve(true);
                    })
                }
                resolve(false);
            })
        })
    }

    async removeSettingsForDomain(domain: string, path: string, deleteDomainIfEmpty: boolean = true): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.settingsRegistryProvider(settingsRegistry => {
                if (domain in settingsRegistry) {
                    const domainSettings = settingsRegistry[domain];
                    if (domainSettings.pathSettings.has(path)) {
                        settingsRegistry[domain].pathSettings.delete(path)
                    }

                    if (deleteDomainIfEmpty && domainSettings.pathSettings.size === 0) {
                        delete settingsRegistry[domain]
                    }

                    this.saveSettingsRegistryProvider(settingsRegistry, () => {
                        resolve(true);
                    })
                }
                resolve(false);
            })
        })
    }
}
