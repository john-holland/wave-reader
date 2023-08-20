import SettingsService, {DomainSettings, SettingsRegistry} from "../../src/services/settings";
import SelectorService from "../../src/services/selector";
import Options from "../../src/models/options"


const withMockSettingsService = (context: {(settingsService: SettingsService, accessRegistry: {(): SettingsRegistry}): void}) => {
    let settingsRegistry = {};
    const settings = new SettingsService(
        (callback: {settingsRegistry: SettingsRegistry}) => settingsRegistry,
        () => Promise.resolve("fart"),
        (newSettingsRegistry, callback: {(): void}) => {
            settingsRegistry = newSettingsRegistry;
            callback();
        })
    context(settings, () => settingsRegistry);
}

describe("selector service", () => {
    test("get current settings", async () => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            accessRegistry()["fart"] = new DomainSettings("fart", new Map<string, Options>({
                "fart": new Options({
                    selectors: ["successful", "test"]
                })
            }))
            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");
        })
    })

    /**
     updateCurrentSettings(update: { (options: Options): Options });
     getSettingsForDomain(domain: string): DomainSettings | undefined;
     addSettingsForDomain(domain: string, path: string, settings: Options): void;
     getSettingsForDomain(domain: string, path: string): Options;
     copySettingsToDomain(from: DomainSettings, domain: string, path: string);
     */
})