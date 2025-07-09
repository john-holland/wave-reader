import Options from "../models/options";
import {currentTab, Tab} from "../util/util";
import {getSyncObject, setSyncObject} from "../util/sync";

const guardUrlWithProtocol = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    } else if (url.startsWith('file://')) {
        // For file URLs, use a special domain for local files
        return 'file://localhost';
    } else {
        // For other protocols or no protocol, assume it's a web URL
        return `https://${url}`;
    }
}

const tabUrl = (): Promise<string> => {
    return new Promise((resolve) => {
        try {
            (currentTab() as unknown as Promise<Tab[]>).then((tabs: Tab[]) => {
                if (tabs.length === 0 || !tabs[0]?.url) {
                    // Fallback to a default URL if no tabs are available
                    console.warn("No active tab found, using fallback URL");
                    resolve("https://example.com");
                } else {
                    resolve(tabs[0].url as string);
                }
            }).catch((error) => {
                console.warn("Error getting current tab, using fallback URL:", error);
                resolve("https://example.com");
            });
        } catch (error) {
            console.warn("Chrome APIs not available, using fallback URL:", error);
            resolve("https://example.com");
        }
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

    // Make the class serializable by converting Map to plain object
    toJSON() {
        const pathSettingsObj: any = {};
        for (const [path, options] of this.pathSettings.entries()) {
            pathSettingsObj[path] = options;
        }
        return {
            domain: this.domain,
            pathSettings: pathSettingsObj
        };
    }
}

export interface SettingsRegistry {
    [key: string]: DomainSettings;
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
    updateCurrentSettings(updatedSettings: Options | null, update: { (options: Options): Options }): Promise<void>;
    getSettingsForDomain(domain: string): Promise<DomainSettings | undefined>;
    addSettingsForDomain(domain: string, path: string, settings: Options): Promise<void>;
    getPathOptionsForDomain(domain: string, path: string): Promise<Options | undefined>;
    copySettingsFromDomain(from: DomainSettings, fromPath: string, domain: string, path: string, acceptExisting: boolean): Promise<void>;
    removeSettingsForDomain(domain: string): Promise<boolean>;
    removeSettingsForDomain(domain: string, path: string): Promise<boolean>;
    getDomainsAndPaths(): Promise<DomainPaths[]>;
    getCurrentDomainAndPaths(): Promise<DomainPaths>;
}

const getSettingsRegistry = (callback: {(settingsRegistry: SettingsRegistry): void}) => {
    const defaultSettingsRegistry: SettingsRegistry = {
        "initial": new DomainSettings("", new Map<string, Options>([[ "", Options.getDefaultOptions() ]]))
    };
    getSyncObject(SettingsRegistryStorageKey, defaultSettingsRegistry, (storedRegistry: any) => {
        console.log(`🌊 Settings: Raw stored registry:`, storedRegistry);
        
        // Reconstruct the registry with proper DomainSettings objects and Map objects
        const reconstructedRegistry: SettingsRegistry = {};
        
        for (const [domain, domainData] of Object.entries(storedRegistry)) {
            console.log(`🌊 Settings: Processing domain ${domain}:`, domainData);
            
            if (domainData && typeof domainData === 'object' && 'domain' in domainData && 'pathSettings' in domainData) {
                // Reconstruct the pathSettings Map from the plain object
                const pathSettingsMap = new Map<string, Options>();
                const pathSettingsData = (domainData as any).pathSettings;
                
                console.log(`🌊 Settings: PathSettings data for ${domain}:`, pathSettingsData);
                
                if (pathSettingsData && typeof pathSettingsData === 'object') {
                    // Convert plain object back to Map
                    for (const [path, options] of Object.entries(pathSettingsData)) {
                        console.log(`🌊 Settings: Adding path ${path} with options:`, options);
                        const newOptions = new Options(options as Partial<Options>);
                        pathSettingsMap.set(path, newOptions);
                    }
                }
                
                console.log(`🌊 Settings: Final pathSettingsMap for ${domain}:`, pathSettingsMap);
                
                // Create the DomainSettings object
                reconstructedRegistry[domain] = new DomainSettings(
                    (domainData as any).domain,
                    pathSettingsMap
                );
            }
        }
        
        console.log(`🌊 Settings: Reconstructed registry:`, reconstructedRegistry);
        callback(reconstructedRegistry);
    });
}

const saveSettingsRegistry = (settingsRegistry: SettingsRegistry, callback?: {(): void}) => {
    console.log(`🌊 Settings: Saving registry:`, settingsRegistry);
    setSyncObject(SettingsRegistryStorageKey, settingsRegistry, callback)
}

/*

class SyncObjectDAO {
    async createSyncObject(name: string, value: string, overwrite: boolean): Promise<void> {
        // getSyncObject
        // fail for overwrite = false and exists
        // newSyncObject
    }
    async removeSyncObject(name: string): Promise<boolean> {
        // (getSyncObject !== null) === removed
        // chrome.storage.sync.remove
        return false; // if anything was removed
    }

    async updateSyncObject(name: string, value?: string, update?: { (syncObject: string): string }): Promise<void> {
        //getSyncObject()
        // fail throw, unless defaulted
        //setSyncObject()
    }

    // todo: decide on api as sync objects accept object types, but i have some weird turn around
    //   the best / most reliable results use JSON.stringify and JSON.parse
    async updateSyncObject<T>(name: string, value?: string, update?: { (syncObject: T): T }): Promise<void> {
        //getSyncObject()
        // fail throw, unless defaulted
        //setSyncObject()
    }
}
 */

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

    public static withTabUrlProvider(tabUrlProvider: () => Promise<string>): SettingsService {
        return new SettingsService(getSettingsRegistry, tabUrlProvider, saveSettingsRegistry)
    }

    async addSettingsForDomain(domain: string, path: string, settings: Options): Promise<void> {
        let key = domain;
        try {
            const urlobj = new URL(guardUrlWithProtocol(domain));
            if (urlobj.protocol === 'file:') {
                key = urlobj.href;
            } else {
                key = urlobj.hostname;
            }
        } catch (e) {
            // fallback
        }
        return new Promise(async (resolve, reject) => {
           const registry: SettingsRegistry = await this.getSettingsRegistryForDomain(key, true)
               .catch(reject) as unknown as SettingsRegistry;
           registry[key]?.pathSettings?.set(path, settings);
           this.saveSettingsRegistryProvider(registry, () => {
               resolve();
           });
        });
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
            if (!from.pathSettings.has(fromPath) && (!acceptExisting || from.pathSettings.size === 0)) {
                reject(fromPath)
                return;
            }
            await this.addSettingsForDomain(domain, path,
                from.pathSettings?.get(fromPath) || [...from.pathSettings?.values()][0])
            resolve();
        })
    }

    /**
     * @returns {Promise<DomainPaths>} Returns the current domain and path.
     */
    getCurrentDomainAndPaths(): Promise<DomainPaths> {
        return new Promise((resolve) => {
            this.tabUrlProvider().then(value => {
                try {
                    const urlobj = new URL(guardUrlWithProtocol(value));
                    // For file URLs, use the full URI as the domain and path
                    if (urlobj.protocol === 'file:') {
                        resolve(new DomainPaths(urlobj.href, [urlobj.pathname]));
                    } else {
                        resolve(new DomainPaths(urlobj.hostname, [urlobj.pathname]));
                    }
                } catch (e) {
                    resolve(new DomainPaths('', ['']));
                }
            });
        });
    }

    /**
     * Retrieves the settings for the given domain, defaulting path options along the way.
     */
    async getCurrentSettings(): Promise<Options> {
        return new Promise<Options>((resolve, reject) => {
            this.tabUrlProvider().then((url) => {
                let urlobj: URL;
                try {
                    urlobj = new URL(guardUrlWithProtocol(url));
                } catch (e) {
                    reject(e);
                    return;
                }
                let domain: string;
                let path: string;
                if (urlobj.protocol === 'file:') {
                    domain = urlobj.href;
                    path = urlobj.pathname;
                } else {
                    domain = urlobj.hostname;
                    path = urlobj.pathname;
                }
                this.settingsRegistryProvider(settingsRegistry => {
                    if (!(domain in settingsRegistry)) {
                        settingsRegistry[domain] = new DomainSettings(domain, new Map<string, Options>([[path, Options.getDefaultOptions()]]));
                    }
                    const domainSettings = settingsRegistry[domain];
                    if (!domainSettings.pathSettings.has(path)) {
                        // Use existing settings as defaults if available
                        const existingSettings = Array.from(domainSettings.pathSettings.values());
                        const availableOptions = existingSettings.length > 0 ? existingSettings[0] : Options.getDefaultOptions();
                        domainSettings.pathSettings.set(path, new Options(availableOptions));
                    }
                    resolve(domainSettings.pathSettings.get(path) as Options);
                });
            });
        });
    }

    async getSettingsRegistryForDomain(domain: string, defaultUndefined: boolean = true): Promise<SettingsRegistry | undefined> {
        let key = domain;
        try {
            const urlobj = new URL(guardUrlWithProtocol(domain));
            if (urlobj.protocol === 'file:') {
                key = urlobj.href;
            } else {
                key = urlobj.hostname;
            }
        } catch (e) {
            // fallback
        }
        return new Promise((resolve) => {
            this.settingsRegistryProvider(settingsRegistry => {
                if (!(key in settingsRegistry)) {
                    if (defaultUndefined) {
                        console.log(`🌊 Settings: Creating new domain ${key} with default options`);
                        settingsRegistry[key] = new DomainSettings(key, new Map<string, Options>([
                            ["", Options.getDefaultOptions()] // Root path gets default options
                        ]));
                    } else {
                        console.log("🌊 Settings: No entry for domain in the settings registry matched the desired DomainSettings");
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
        return new Promise((resolve) => {
            return this.settingsRegistryProvider((settingsRegistry: SettingsRegistry) => {
                resolve(Object.keys(settingsRegistry).map(settings => settingsRegistry[settings].getDomainPaths()))
            })
        })
    }

    async getSettingsForDomain(domain: string, defaultUndefined: boolean = true): Promise<DomainSettings | undefined> {
        let key = domain;
        try {
            const urlobj = new URL(guardUrlWithProtocol(domain));
            if (urlobj.protocol === 'file:') {
                key = urlobj.href;
            } else {
                key = urlobj.hostname;
            }
        } catch (e) {
            // fallback
        }
        const settingsRegistry: SettingsRegistry = (await this.getSettingsRegistryForDomain(key, defaultUndefined)) as SettingsRegistry;
        if (!defaultUndefined && settingsRegistry && !(key in settingsRegistry)) {
            return undefined;
        }
        return settingsRegistry[key];
    }

    async getPathOptionsForDomain(domain: string, path: string, defaultUndefined = true, useExistingInsteadOfNew = true): Promise<Options | undefined> {
        let key = domain;
        try {
            const urlobj = new URL(guardUrlWithProtocol(domain));
            if (urlobj.protocol === 'file:') {
                key = urlobj.href;
            } else {
                key = urlobj.hostname;
            }
        } catch (e) {
            // fallback
        }
        const domainSettings = await this.getSettingsForDomain(key, defaultUndefined);
        if (domainSettings === undefined || !defaultUndefined && !domainSettings?.pathSettings.has(path)) {
            return Promise.resolve(undefined);
        } else if (!domainSettings?.pathSettings.has(path)) {
            // Get existing settings from the same domain as defaults
            const existingSettings = Array.from(domainSettings?.pathSettings.values() || []);
            const availableOptions = useExistingInsteadOfNew && existingSettings.length > 0 
                ? existingSettings[0] : Options.getDefaultOptions();
            domainSettings?.pathSettings.set(path, new Options(availableOptions));
        }
        return Promise.resolve(domainSettings?.pathSettings.get(path));
    }

    async updateCurrentSettings(updatedSettings: Options | null, update: { (options: Options): Options }): Promise<void> {
        return this.tabUrlProvider().then(async (url) => {
            const urlobj = new URL(guardUrlWithProtocol(url));
            
            // Handle file URLs specially
            let domain: string;
            let path: string;
            
            if (urlobj.protocol === 'file:') {
                domain = urlobj.href;
                path = urlobj.pathname;
            } else {
                domain = urlobj.hostname;
                path = urlobj.pathname;
            }
            
            console.log(`🌊 Settings: Updating settings for ${domain}${path}`);

            const domainSettings = updatedSettings || await this.getCurrentSettings();
            console.log(`🌊 Settings: Current settings before update:`, domainSettings);
            
            const updated = update(domainSettings);
            console.log(`🌊 Settings: Updated settings:`, updated);
            
            const result = await this.addSettingsForDomain(domain, path, updated);
            console.log(`🌊 Settings: Settings saved successfully`);
            return result;
        });
    }

    /**
     * removes the selected domain settings from the settings registry
     * @param domain the url domain to remove
     * @returns [Promise<boolean>] if true, removed, false, not present, catch, internal error
     */
    async removeSettingsForDomain(domain: string): Promise<boolean> {
        let key = domain;
        try {
            const urlobj = new URL(guardUrlWithProtocol(domain));
            if (urlobj.protocol === 'file:') {
                key = urlobj.href;
            } else {
                key = urlobj.hostname;
            }
        } catch (e) {
            // fallback
        }
        return new Promise((resolve) => {
            this.settingsRegistryProvider(settingsRegistry => {
                if (key in settingsRegistry) {
                    delete settingsRegistry[key];
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
        let key = domain;
        try {
            const urlobj = new URL(guardUrlWithProtocol(domain));
            if (urlobj.protocol === 'file:') {
                key = urlobj.href;
            } else {
                key = urlobj.hostname;
            }
        } catch (e) {
            // fallback
        }
        return new Promise((resolve) => {
            this.settingsRegistryProvider(settingsRegistry => {
                if (key in settingsRegistry) {
                    const domainSettings = settingsRegistry[key];
                    if (domainSettings.pathSettings.has(path)) {
                        settingsRegistry[key].pathSettings.delete(path)
                    }

                    if (deleteDomainIfEmpty && domainSettings.pathSettings.size === 0) {
                        delete settingsRegistry[key]
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
