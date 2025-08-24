import AttributeConstructor from "../util/attribute-constructor";
import Wave from "./wave";
import { KeyChord } from "../components/util/user-input";
import {
    WaveAnimationControlDefault,
    ShowNotificationsDefault,
    GoingDefault,
    WaveAnimationControl,
    WaveDefaultFactory,
    KeyChordDefaultFactory,
    SelectorsDefaultFactory
} from "./defaults"
import {State} from "../util/state";

export class WaveToggleConfig extends AttributeConstructor<WaveToggleConfig> {
    // a 1-4ish length array of keys
    keyChord: KeyChord = KeyChordDefaultFactory()

    public constructor(attributes: Partial<WaveToggleConfig> = {}) {
        super(attributes);
        this.keyChord = attributes.keyChord || this.keyChord
    }

    static getDefaultConfig(): WaveToggleConfig {
        return new WaveToggleConfig()
    }
}

export const DeepEquals = (a: unknown, b: unknown): boolean => {
    if (typeof a !== 'object' && a === b) {
        return true;
    }

    const aString = JSON.stringify(a);
    const bString = JSON.stringify(b);

    const aObj = JSON.parse(aString);
    const bObj = JSON.parse(bString);

    if (typeof a !== typeof b) {
        console.log("array mismatch for property: aString: " + aString + ", bString: " + bString);
        
        return false;
    }

    if ((typeof a === "boolean" || typeof a === "number" || typeof a === "string") && a !== b) {
        console.log("array mismatch for property: aString: " + aString + ", bString: " + bString);
        return false;
    }

    if (Array.isArray(aObj) && ((Array.isArray(aObj) != Array.isArray(bObj))
        || Object.keys(aObj).find(prop => !(prop in bObj)) ||
           Object.keys(bObj).find(prop => !(prop in aObj)))) {
        console.log("array mismatch for property: aString: " + aString + ", bString: " + bString);
        return false;
    }

    for (const prop in aObj) {
        if (Array.isArray(aObj[prop]) || Array.isArray(bObj[prop])) {
            if (aObj[prop].find((ap: any, i: number) => Array.isArray(bObj[prop]) && !Object.is(ap, bObj[prop][i]))) {
                console.log(" array mismatch for property: " + prop);
                return false;
            }
        } else {
            if (!DeepEquals(aObj[prop], bObj[prop])) {
                console.log(" array mismatch for property: " + prop);
                return false;
            }
        }
    }

    return true;
}

// Domain/path-specific settings interface
export interface DomainPathSettings {
    domain: string;
    path: string;
    settings: Partial<Options>;
    lastUpdated: number;
    usageCount: number;
    userRating: number;
}

export default class Options extends AttributeConstructor<Options> {
    defaultSettings: boolean = false;
    state: State | undefined = undefined;
    showNotifications: boolean = ShowNotificationsDefault;
    going: boolean = GoingDefault;
    waveAnimationControl: WaveAnimationControl = WaveAnimationControlDefault;
    wave: Wave = WaveDefaultFactory();
    toggleKeys: WaveToggleConfig = WaveToggleConfig.getDefaultConfig();
    selectors: string[] = SelectorsDefaultFactory();
    domainPathSettings: Map<string, DomainPathSettings> = new Map();

    constructor(props: Partial<Options> = {}) {
        super(undefined);
        // typescript auto-fills defaults here, if this is the desired behavior
        super.assign(props);
        // rehydrate the wave property as it surprisingly loses type after deserialization
        this.wave = new Wave(this.wave);
    }

    public static getDefaultOptions(): Options {
        return new Options();
    }

    public static OptionsEqual(a: Options, b: Options) {
        return DeepEquals(a, b);
    }

    /**
     * Get or create domain/path-specific settings
     */
    public getDomainPathSettings(domain: string, path: string): Partial<Options> {
        const key = this.generateDomainPathKey(domain, path);
        const existing = this.domainPathSettings.get(key);
        
        if (existing) {
            // Increment usage count
            existing.usageCount++;
            existing.lastUpdated = Date.now();
            return existing.settings;
        }
        
        // Return default settings if none exist
        return {};
    }

    /**
     * Set domain/path-specific settings
     */
    public setDomainPathSettings(domain: string, path: string, settings: Partial<Options>): void {
        const key = this.generateDomainPathKey(domain, path);
        const existing = this.domainPathSettings.get(key);
        
        if (existing) {
            // Update existing settings
            existing.settings = { ...existing.settings, ...settings };
            existing.lastUpdated = Date.now();
            existing.usageCount++;
        } else {
            // Create new domain/path settings
            this.domainPathSettings.set(key, {
                domain,
                path,
                settings: { ...settings },
                lastUpdated: Date.now(),
                usageCount: 1,
                userRating: 5 // Default high rating for new settings
            });
        }
    }

    /**
     * Generate a unique key for domain/path combination
     */
    private generateDomainPathKey(domain: string, path: string): string {
        return `${domain}${path}`;
    }

    /**
     * Get all domain/path settings
     */
    public getAllDomainPathSettings(): DomainPathSettings[] {
        return Array.from(this.domainPathSettings.values());
    }

    /**
     * Remove domain/path settings
     */
    public removeDomainPathSettings(domain: string, path: string): boolean {
        const key = this.generateDomainPathKey(domain, path);
        return this.domainPathSettings.delete(key);
    }

    /**
     * Update user rating for domain/path settings
     */
    public updateDomainPathRating(domain: string, path: string, rating: number): void {
        const key = this.generateDomainPathKey(domain, path);
        const existing = this.domainPathSettings.get(key);
        
        if (existing) {
            existing.userRating = Math.max(1, Math.min(5, rating)); // Clamp between 1-5
            existing.lastUpdated = Date.now();
        }
    }
}
