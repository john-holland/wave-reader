import SettingsService, {DomainPaths, DomainSettings, SettingsRegistry} from "../../src/services/settings";
import SelectorService from "../../src/services/selector";
import Options from "../../src/models/options"
import { Tab } from "../../src/util/util";
import DoneCallback = jest.DoneCallback;


const withMockSettingsService = async (context: {(settingsService: SettingsService, accessRegistry: {(): SettingsRegistry}): void}): Promise<void> => {
    let proxy = { settingsRegistry: {} };
    const settings = new SettingsService(
        (callback: { (settingsRegistry: SettingsRegistry): void }): void => callback(proxy.settingsRegistry),
        () => Promise.resolve("http://www.fart.com/fart"),
        (newSettingsRegistry, callback?: {(): void}) => {
            proxy.settingsRegistry = newSettingsRegistry;
            if (callback) callback();
        })
    return new Promise(async (resolve) => {
        context(settings, () => proxy.settingsRegistry);
        resolve();
    });
}

describe("selector service", () => {
    test("assigns protocol and path heavy url to hostname", () => {
        // TODO: write
    })
    test("get current settings", (done: DoneCallback) => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const fartmap = new Map<string, Options>()
            fartmap.set("/fart", new Options({
                selectors: ["successful", "test"]
            }));
            accessRegistry()["www.fart.com"] = new DomainSettings("www.fart.com", fartmap)
            const successfulTest = (await settingsService.getCurrentSettings())?.selectors.join(" ");
            expect(successfulTest).toBe("successful test");
            done();
        })
    })

    test("update current settings", (done: DoneCallback) => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const fartmap = new Map<string, Options>()
            fartmap.set("/fart", new Options({
                selectors: ["successful", "test"]
            }));
            accessRegistry()["www.fart.com"] = new DomainSettings("www.fart.com", fartmap)
            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");

            await settingsService.updateCurrentSettings(options => {
                options.selectors.push(", this be")
                return options;
            })

            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test , this be"); // mmmmhhmmmmm!
            done();
        })
    })

    test("get settings for domain & path", (done: DoneCallback) => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const fartmap = new Map<string, Options>()
            fartmap.set("/fart", new Options({
                selectors: ["successful", "test"]
            }));
            accessRegistry()["www.fart.com"] = new DomainSettings("www.fart.com", fartmap)
            const borkmap = new Map<string, Options>()
                borkmap.set("/pizza", new Options({
                    selectors: ["thefty", "biggons", "chompers"]
                }));
                borkmap.set("/BACON", new Options({
                    selectors: ["bacon", "BACON", "BAAAAAAAAACOOON", "BBAAAA... *runs into the distance, barrels into the room skidding* ... COOOONNNN "]
                }));
            accessRegistry()["www.bork.com"] = new DomainSettings("www.bork.com", borkmap)
            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");
            expect((await settingsService.getPathOptionsForDomain("http://www.bork.com", "/pizza"))?.selectors.join(" ")).toBe("thefty biggons chompers");
            expect((await settingsService.getPathOptionsForDomain("http://www.bork.com", "/BACON"))?.selectors.join(" ")).toBe("bacon BACON BAAAAAAAAACOOON BBAAAA... *runs into the distance, barrels into the room skidding* ... COOOONNNN ");
            done();
        })
    })

    test("get settings for domain", (done: DoneCallback) => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const fartmap = new Map<string, Options>()
            fartmap.set("/fart", new Options({
                selectors: ["successful", "test"]
            }));
            accessRegistry()["www.fart.com"] = new DomainSettings("www.fart.com", fartmap)
            const borkmap = new Map<string, Options>()
            borkmap.set("/pizza", new Options({
                selectors: ["thefty", "biggons", "chompers"]
            }));
            borkmap.set("/BACON", new Options({
                selectors: ["bacon", "BACON", "BAAAAAAAAACOOON", "BBAAAA... *runs into the distance, barrels into the room skidding* ... COOOONNNN "]
            }));
            accessRegistry()["www.bork.com"] = new DomainSettings("www.bork.com", borkmap)
            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");
            expect((await settingsService.getSettingsForDomain("www.bork.com"))?.pathSettings.has("/pizza")).toBeTruthy();
            expect((await settingsService.getSettingsForDomain("www.bork.com"))?.pathSettings.has("/BACON")).toBeTruthy();
            done();
        })
    })

    test("get settings for domain no domain", (done: DoneCallback) => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const fartmap = new Map<string, Options>()
            fartmap.set("/fart", new Options({
                selectors: ["successful", "test"]
            }));
            accessRegistry()["www.fart.com"] = new DomainSettings("www.fart.com", fartmap)

            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");
            try {
                await settingsService.getSettingsForDomain("www.bork.com", false)
                expect("should not reach here").toBe("something it't not");
            } catch (e) {
                done();
            }
        })
    })

    test("add settings for domain", (done: DoneCallback) => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const fartmap = new Map<string, Options>()
            fartmap.set("/fart", new Options({
                selectors: ["successful", "test"]
            }));
            accessRegistry()["www.fart.com"] = new DomainSettings("www.fart.com", fartmap)
            const borkmap = new Map<string, Options>()
            borkmap.set("BACON", new Options({
                selectors: ["bacon", "BACON", "BAAAAAAAAACOOON", "BBAAAA... *runs into the distance, barrels into the room skidding* ... COOOONNNN "]
            }));
            accessRegistry()["www.bork.com"] = new DomainSettings("www.bork.com", borkmap);
            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");
            await settingsService.addSettingsForDomain("www.bork.com", "pizza", new Options({
                selectors: ["thefty", "biggons", "chompers"]
            }))
            expect((await settingsService.getSettingsForDomain("www.bork.com"))?.pathSettings.has("pizza")).toBeTruthy();
            expect((await settingsService.getPathOptionsForDomain("www.bork.com", "pizza"))?.selectors.join(" ")).toBe("thefty biggons chompers");
            expect((await settingsService.getSettingsForDomain("www.bork.com"))?.pathSettings.has("BACON")).toBeTruthy();

            // never before seen domain
            await settingsService.addSettingsForDomain("bacon.com", "pizza", new Options({
                selectors: ["pizza", "bacon", "does not bzzzrrrp- aaacon! BACON! BACON bacon... pizza?"]
            }))

            expect((await settingsService.getPathOptionsForDomain("bacon.com", "pizza"))?.selectors.join(" ")).toBe("pizza bacon does not bzzzrrrp- aaacon! BACON! BACON bacon... pizza?");
            done();
        })
    })

    test("add settings for domain", (done: DoneCallback) => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const fartmap = new Map<string, Options>()
            fartmap.set("/fart", new Options({
                selectors: ["successful", "test"]
            }));
            accessRegistry()["www.fart.com"] = new DomainSettings("www.fart.com", fartmap)
            const borkmap = new Map<string, Options>()
            borkmap.set("/BACON", new Options({
                selectors: ["bacon", "BACON", "BAAAAAAAAACOOON", "BBAAAA... *runs into the distance, barrels into the room skidding* ... COOOONNNN "]
            }));
            accessRegistry()["www.bork.com"] = new DomainSettings("www.bork.com", borkmap)
            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");
            await settingsService.addSettingsForDomain("www.bork.com", "/pizza", new Options({
                selectors: ["thefty", "biggons", "chompers"]
            }))
            expect((await settingsService.getSettingsForDomain("www.bork.com"))?.pathSettings.has("/pizza")).toBeTruthy();
            expect((await settingsService.getPathOptionsForDomain("http://www.bork.com", "/pizza"))?.selectors.join(" ")).toBe("thefty biggons chompers");
            await settingsService.copySettingsFromDomain((await settingsService.getSettingsForDomain("http://www.fart.com")) as unknown as DomainSettings, "/fart", "www.bork.com", "/fart", false)
            expect((await settingsService.getPathOptionsForDomain("http://www.bork.com", "/fart", false, false))?.selectors.join(" ")).toBe("successful test")
            // thaaaat's why dog farts are so bad...
            done();
        })
    })

    test("remove settings for domain", (done: DoneCallback) => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const fartmap = new Map<string, Options>()
            fartmap.set("/fart", new Options({
                selectors: ["successful", "test"]
            }));
            accessRegistry()["www.fart.com"] = new DomainSettings("www.fart.com", fartmap)
            const BACONmap = new Map<string, Options>()
            BACONmap.set("/BACON", new Options({
                selectors: ["bacon", "BACON", "BAAAAAAAAACOOON", "BBAAAA... *runs into the distance, barrels into the room skidding* ... COOOONNNN "]
            }));
            accessRegistry()["www.bork.com"] = new DomainSettings("www.bork.com", BACONmap)
            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");
            await settingsService.addSettingsForDomain("www.bork.com", "/pizza", new Options({
                selectors: ["thefty", "biggons", "chompers"]
            }))
            expect((await settingsService.getSettingsForDomain("www.bork.com"))?.pathSettings.has("/pizza")).toBeTruthy();
            expect((await settingsService.getPathOptionsForDomain("www.bork.com", "/pizza"))?.selectors.join(" ")).toBe("thefty biggons chompers");
            await settingsService.copySettingsFromDomain((await settingsService.getSettingsForDomain("www.fart.com")) as unknown as DomainSettings, "/fart", "www.bork.com", "/fart", false)
            expect((await settingsService.getPathOptionsForDomain("www.bork.com", "/fart", false, false))?.selectors.join(" ")).toBe("successful test")
            // thaaaat's why dog farts are so bad...

            await settingsService.removeSettingsForDomainPath("www.bork.com", "/pizza", false);
            // do your unit tests smell?
            expect(await settingsService.getPathOptionsForDomain("www.bork.com", "/pizza", false, false)).toBeUndefined()

            await settingsService.removeSettingsForDomain("www.fart.com")
            expect(await settingsService.getSettingsRegistryForDomain("www.fart.com", false)).toBeUndefined()
            done();
        })
    })

    test("get domains and paths", (done: DoneCallback) => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const fartmap = new Map<string, Options>()
            fartmap.set("/fart", new Options({
                selectors: ["successful", "test"]
            }));
            accessRegistry()["www.fart.com"] = new DomainSettings("www.fart.com", fartmap)
            const borkmap = new Map<string, Options>()
            borkmap.set("/BACON", new Options({
                selectors: ["bacon", "BACON", "BAAAAAAAAACOOON", "BBAAAA... *runs into the distance, barrels into the room skidding* ... COOOONNNN "]
            }));
            accessRegistry()["www.bork.com"] = new DomainSettings("www.bork.com", borkmap)
            expect((await settingsService.getCurrentSettings()).selectors.join(" ")).toBe("successful test");
            await settingsService.addSettingsForDomain("www.bork.com", "/pizza", new Options({
                selectors: ["thefty", "biggons", "chompers"]
            }))
            const domainsAndPaths = await settingsService.getDomainsAndPaths()
            expect(domainsAndPaths.find((dp: DomainPaths) => dp.domain === "www.fart.com")).toBeTruthy();
            expect(domainsAndPaths.find((dp: DomainPaths) => dp.paths.includes("/BACON"))).toBeTruthy();

            done();
        })
    })
})
