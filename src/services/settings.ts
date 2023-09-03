import Options from "../models/options";
import {currentTab, Tab} from "../util/util";
import {getSyncObject, setSyncObject} from "../util/sync";
import {State} from "../util/state";


export interface SettingsRegistry {
    [key: string]: DomainSettings;
}


const tabUrl = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        (currentTab() as unknown as Promise<Tab[]>).then((tabs: Tab[]) => {
            if (tabs.length === 0) {
                reject(0)
            } else {
                resolve(tabs[0]?.url!!)
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

    getDomainPaths() {
        return new DomainPaths(this.domain, [...this.pathSettings.keys()])
    }
}

export class DomainPaths {
    public paths: string[];
    public domain: string;
    constructor(domain: string, paths: string[]) {
        this.domain = domain;
        this.paths = paths;
    }
}

/**
 * SettingsDAOInterface
 *
 * @note both path and domain from new URL, so url requires a protocol usually
 *       path = "/path" (with leading slash)
 *       domain = "www.wikipedia.com"
 */
export interface SettingsDAOInterface {
    /**
     * Find the current settings for the active tab with domain and pathSettings
     * @returns [Options] the options for the current tab or default
     */
    getCurrentSettings(): Promise<Options>;
    updateCurrentSettings(update: { (options: Options): Options }): Promise<void>;
    getSettingsForDomain(domain: string): Promise<DomainSettings | undefined>;
    addSettingsForDomain(domain: string, path: string, settings: Options): Promise<void>;
    getPathOptionsForDomain(domain: string, path: string): Promise<Options | undefined>;
    copySettingsFromDomain(from: DomainSettings, fromPath: string, domain: string, path: string, acceptExisting: boolean): Promise<void>;
    removeSettingsForDomain(domain: string): Promise<boolean>;
    removeSettingsForDomain(domain: string, path: string): Promise<boolean>;
    getDomainsAndPaths(): Promise<DomainPaths[]>;
}

const getSettingsRegistry = (callback: {(settingsRegistry: SettingsRegistry): void}) => {
    const defaultSettingsRegistry: SettingsRegistry = {
        "initial": new DomainSettings("", new Map<string, Options>([[ "", Options.getDefaultOptions() ]]))
    };
    getSyncObject(SettingsRegistryStorageKey, defaultSettingsRegistry, callback);
}

const saveSettingsRegistry = (settingsRegistry: SettingsRegistry, callback?: {(): void}) => {
    setSyncObject(SettingsRegistryStorageKey, settingsRegistry, callback)
}

const guardUrlWithProtocol = (url: string) => {
    const colonIndex = url.indexOf(":");
    return colonIndex > -1 && colonIndex < url.indexOf(".") ? url : "https://" + url;
}

const SettingsRegistryStorageKey = "wave_reader__settings_registry";
export default class SettingsService implements SettingsDAOInterface {
    private settingsRegistryProvider: (callback: { (settingsRegistry: SettingsRegistry): void }) => void;
    private tabUrlProvider: () => Promise<string>;
    private saveSettingsRegistryProvider: (settingsRegistry: SettingsRegistry, callback?: { (): void }) => void;
    constructor(settingsRegistryProvider = getSettingsRegistry, tabUrlProvider = tabUrl,
                saveSettingsRegistryProvider = saveSettingsRegistry) {
        this.settingsRegistryProvider = settingsRegistryProvider;
        this.tabUrlProvider = tabUrlProvider;
        this.saveSettingsRegistryProvider = saveSettingsRegistryProvider;
    }

    async addSettingsForDomain(domain: string, path: string, settings: Options): Promise<void> {
        return new Promise(async (resolve, reject) => {
           const registry: SettingsRegistry = await this.getSettingsRegistryForDomain(domain, true)
               .catch(reject) as unknown as SettingsRegistry;

           registry[domain]?.pathSettings?.set(path, settings);
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
                return;
            }
            await this.addSettingsForDomain(domain, path, from.pathSettings?.get(fromPath)!)
            resolve();
        })
    }

    /**
     * Retrieves the settings for the given domain, defaulting path options along the way.
     */
    async getCurrentSettings(): Promise<Options> {
        return new Promise<Options>((resolve, reject) => {
            this.tabUrlProvider().then((url) => {
                // an odd note: new URL was throwing an exception in the constructor of URL and blew up the chain
                let urlobj: URL;
                try {
                    urlobj = new URL(guardUrlWithProtocol(url));
                } catch (e) {
                    reject(e);
                    return;
                }

                this.settingsRegistryProvider(settingsRegistry => {
                    if (urlobj.hostname in settingsRegistry) {
                        const domainSettings = settingsRegistry[urlobj.hostname];
                        if (!domainSettings.pathSettings.has(urlobj.pathname)) {
                            const availableOptions: Options = domainSettings.pathSettings.values().next()?.value || Options.getDefaultOptions();

                            console.log(`defaulting options for ${urlobj.hostname} with path: ${urlobj.pathname}`)
                            domainSettings.pathSettings.set(urlobj.pathname, availableOptions)
                        }

                        resolve(domainSettings.pathSettings.get(urlobj.pathname)!)
                    } else {
                        // value mismatch
                        reject([urlobj.hostname, Object.keys(settingsRegistry)])
                    }
                })
            });
        });
    }

    async getSettingsRegistryForDomain(domain: string, defaultUndefined: boolean = true): Promise<SettingsRegistry | undefined> {
        const hostname = new URL(guardUrlWithProtocol(domain)).hostname;
        return new Promise((resolve, reject) => {
            this.settingsRegistryProvider(settingsRegistry => {
                if (!(hostname in settingsRegistry)) {
                    if (defaultUndefined) {
                        console.log(`defaulting options for ${hostname} with path:`)
                        settingsRegistry[hostname] = new DomainSettings(hostname, new Map<string, Options>([["", Options.getDefaultOptions()]]))
                    } else {
                        console.log("no entry for domain in the settings registry matched the desired DomainSettings")
                        resolve(undefined);
                    }
                }


                resolve(settingsRegistry)
            })
        });
    }

    /**
     * Retrieves the domains and domain specific paths for which we have saved unique settings
     */
    async getDomainsAndPaths(): Promise<DomainPaths[]> {
        return new Promise((resolve, reject) => {
            return this.settingsRegistryProvider((settingsRegistry: SettingsRegistry) => {
                resolve(Object.keys(settingsRegistry).map(settings => settingsRegistry[settings].getDomainPaths()))
            })
        })
    }

    async getSettingsForDomain(domain: string, defaultUndefined: boolean = true): Promise<DomainSettings | undefined> {
        const hostname = new URL(guardUrlWithProtocol(domain)).hostname;
        const settingsRegistry: SettingsRegistry = (await this.getSettingsRegistryForDomain(hostname, defaultUndefined))!!

        if (!defaultUndefined && settingsRegistry && !(hostname in settingsRegistry)) {
            return Promise.resolve(undefined)
        }

        return Promise.resolve(settingsRegistry[hostname]);
    }

    async getPathOptionsForDomain(domain: string, path: string, defaultUndefined = true, useExistingInsteadOfNew = true): Promise<Options | undefined> {
        const hostname = new URL(guardUrlWithProtocol(domain)).hostname;
        const domainSettings = await this.getSettingsForDomain(hostname, defaultUndefined);

        if (domainSettings === undefined || !defaultUndefined && !domainSettings?.pathSettings.has(path)) {
            return Promise.resolve(undefined);
        } else if (!domainSettings?.pathSettings.has(path)) {
            const availableOptions = useExistingInsteadOfNew ? domainSettings?.pathSettings.values().next()?.value || Options.getDefaultOptions() : Options.getDefaultOptions();

            console.log(`defaulting options for ${domain} with path: ${path}`)
            domainSettings?.pathSettings.set(path, availableOptions)
        }

        return Promise.resolve(domainSettings?.pathSettings.get(path));
    }

    async updateCurrentSettings(update: { (options: Options): Options }): Promise<void> {
        return this.tabUrlProvider().then(async (url) => {
            const tab = new URL(guardUrlWithProtocol(url));

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
        const hostname = new URL(guardUrlWithProtocol(domain)).hostname;
        return new Promise((resolve, reject) => {
            this.settingsRegistryProvider(settingsRegistry => {
                if (hostname in settingsRegistry) {
                    delete settingsRegistry[hostname];
                    this.saveSettingsRegistryProvider(settingsRegistry, () => {
                        resolve(true);
                    })
                    return;
                }
                resolve(false);
            })
        })
    }

    async removeSettingsForDomainPath(domain: string, path: string, deleteDomainIfEmpty: boolean = true): Promise<boolean> {
        const hostname = new URL(guardUrlWithProtocol(domain)).hostname;
        return new Promise((resolve, reject) => {
            this.settingsRegistryProvider(settingsRegistry => {
                if (hostname in settingsRegistry) {
                    const domainSettings = settingsRegistry[hostname];
                    if (domainSettings.pathSettings.has(path)) {
                        settingsRegistry[hostname].pathSettings.delete(path)
                    }

                    if (deleteDomainIfEmpty && domainSettings.pathSettings.size === 0) {
                        delete settingsRegistry[hostname]
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
