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

    test("update current settings", async () => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            accessRegistry()["fart"] = new DomainSettings("fart", new Map<string, Options>({
                "fart": new Options({
                    selectors: ["successful", "test"]
                })
            }))
            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");

            await settingsService.updateCurrentSettings(options => {
                options.selectors.push(", this be")
            })

            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test, this be"); // mmmmhhmmmmm!
        })
    })

    test("get settings for domain & path", async () => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            accessRegistry()["fart"] = new DomainSettings("fart", new Map<string, Options>({
                "fart": new Options({
                    selectors: ["successful", "test"]
                })
            }))
            accessRegistry()["bork.com"] = new DomainSettings("bork.com", new Map<string, Options>({
                "pizza": new Options({
                    selectors: ["thefty", "biggons", "chompers"]
                }),
                "BACON": new Options({
                    selectors: ["bacon", "BACON", "BAAAAAAAAACOOON", "BBAAAA... *runs into the distance, barrels into the room skidding* ... COOOONNNN "]
                })
            }))
            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");
            expect((await settingsService.getSettingsForDomain("bork.com", "pizza")).selectors.join(" ")).toBe("thefty biggons chompers");
            expect((await settingsService.getSettingsForDomain("bork.com", "BACON")).selectors.join(" ")).toBe("bacon BACON BAAAAAAAAACOOON BBAAAA... *runs into the distance, barrels into the room skidding* ... COOOONNNN ");
        })
    })

    test("get settings for domain", async () => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            accessRegistry()["fart"] = new DomainSettings("fart", new Map<string, Options>({
                "fart": new Options({
                    selectors: ["successful", "test"]
                })
            }))
            accessRegistry()["bork.com"] = new DomainSettings("bork.com", new Map<string, Options>({
                "pizza": new Options({
                    selectors: ["thefty", "biggons", "chompers"]
                }),
                "BACON": new Options({
                    selectors: ["bacon", "BACON", "BAAAAAAAAACOOON", "BBAAAA... *runs into the distance, barrels into the room skidding* ... COOOONNNN "]
                })
            }))
            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");
            expect((await settingsService.getSettingsForDomain("bork.com")).pathSettings.has("pizza")).toBeTruthy();
            expect((await settingsService.getSettingsForDomain("bork.com")).pathSettings.has("BACON")).toBeTruthy();
        })
    })

    test("get settings for domain no domain", async () => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            accessRegistry()["fart"] = new DomainSettings("fart", new Map<string, Options>({
                "fart": new Options({
                    selectors: ["successful", "test"]
                })
            }))

            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");
            expect(await settingsService.getSettingsForDomain("bork.com")).toBeUndefined();
        })
    })

    test("add settings for domain", async () => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            accessRegistry()["fart"] = new DomainSettings("fart", new Map<string, Options>({
                "fart": new Options({
                    selectors: ["successful", "test"]
                })
            }))
            accessRegistry()["bork.com"] = new DomainSettings("bork.com", new Map<string, Options>({
                "BACON": new Options({
                    selectors: ["bacon", "BACON", "BAAAAAAAAACOOON", "BBAAAA... *runs into the distance, barrels into the room skidding* ... COOOONNNN "]
                })
            }))
            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");
            await settingsService.addSettingsForDomain("bork.com", "pizza", new Options({
                selectors: ["thefty", "biggons", "chompers"]
            }))
            expect((await settingsService.getSettingsForDomain("bork.com")).pathSettings.has("pizza")).toBeTruthy();
            expect((await settingsService.getSettingsForDomain("bork.com", "pizza")).selectors.join(" ")).toBe("thefty biggons chompers");
            expect((await settingsService.getSettingsForDomain("bork.com")).pathSettings.has("BACON")).toBeTruthy();

            // never before seen domain
            await settingsService.addSettingsForDomain("bacon.com", "pizza", new Options({
                selectors: ["pizza", "bacon", "does not bzzzrrrp- aaacon! BACON! BACON bacon... pizza?"]
            }))

            expect((await settingsService.getSettingsForDomain("bacon.com", "pizza")).selectors.join(" ")).toBe("pizza bacon does not bzzzrrrp- aaacon! BACON! BACON bacon... pizza?");
        })
    })
    test("add settings for domain", async () => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            accessRegistry()["fart"] = new DomainSettings("fart", new Map<string, Options>({
                "fart": new Options({
                    selectors: ["successful", "test"]
                })
            }))
            accessRegistry()["bork.com"] = new DomainSettings("bork.com", new Map<string, Options>({
                "BACON": new Options({
                    selectors: ["bacon", "BACON", "BAAAAAAAAACOOON", "BBAAAA... *runs into the distance, barrels into the room skidding* ... COOOONNNN "]
                })
            }))
            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");
            await settingsService.addSettingsForDomain("bork.com", "pizza", new Options({
                selectors: ["thefty", "biggons", "chompers"]
            }))
            expect((await settingsService.getSettingsForDomain("bork.com")).pathSettings.has("pizza")).toBeTruthy();
            expect((await settingsService.getSettingsForDomain("bork.com", "pizza")).selectors.join(" ")).toBe("thefty biggons chompers");
            await settingsService.copySettingsFromDomain(await settingsService.getSettingsForDomain("fart"), "fart", "bork.com", "fart", false)
            expect(settingsService.getSettingsForDomain("bork.com", "fart", false, false).selectors.join(" ")).toBe("successful test")
            // thaaaat's why dog farts are so bad...
        })
    })

    test("remove settings for domain", async () => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            accessRegistry()["fart"] = new DomainSettings("fart", new Map<string, Options>({
                "fart": new Options({
                    selectors: ["successful", "test"]
                })
            }))
            accessRegistry()["bork.com"] = new DomainSettings("bork.com", new Map<string, Options>({
                "BACON": new Options({
                    selectors: ["bacon", "BACON", "BAAAAAAAAACOOON", "BBAAAA... *runs into the distance, barrels into the room skidding* ... COOOONNNN "]
                })
            }))
            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");
            await settingsService.addSettingsForDomain("bork.com", "pizza", new Options({
                selectors: ["thefty", "biggons", "chompers"]
            }))
            expect((await settingsService.getSettingsForDomain("bork.com")).pathSettings.has("pizza")).toBeTruthy();
            expect((await settingsService.getSettingsForDomain("bork.com", "pizza")).selectors.join(" ")).toBe("thefty biggons chompers");
            await settingsService.copySettingsFromDomain(await settingsService.getSettingsForDomain("fart"), "fart", "bork.com", "fart", false)
            expect(settingsService.getSettingsForDomain("bork.com", "fart", false, false).selectors.join(" ")).toBe("successful test")
            // thaaaat's why dog farts are so bad...

            await settingsService.removeSettingsForDomain("bork.com", "fart", false);
            // do your unit tests smell?
            expect(settingsService.getSettingsForDomain("bork.com", "fart", false, false)).toBeUndefined()

            await settingsService.removeSettingsForDomain("fart")
            expect(await settingsService.getSettingsRegistryForDomain("fart")).toBeUndefined()
        })
    })
})
