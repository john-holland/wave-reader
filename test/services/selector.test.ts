import SettingsService, {DomainSettings, SettingsInterface, SettingsRegistry} from "../../src/services/settings";
import SelectorService from "../../src/services/selector";
import {SelectorDefault} from "../../src/models/defaults";

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
    test("adds a selector", async () => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const service = new SelectorService(settingsService)
            await service.addSelector("test selector push");
            await service.useSelector("test selector expect")

            expect(await service.currentSelector()).toBe("test selector expect")
            expect(await service.getSelectors().includes("test selector push")).toBeTruthy()
        })
    })

    test("remove a selector", async () => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const service = new SelectorService(settingsService)
            await service.addSelector("test selector push");
            await service.addSelector("test selector expect");
            await service.useSelector("test selector push");
            await service.removeSelector("test selector push");

            expect(await service.currentSelector()).toBe("test selector expect")
            expect(await service.getSelectors().includes("test selector push")).toBeTruthy()
        })
    })

    test("use a selector", async () => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const service = new SelectorService(settingsService)
            await service.addSelector("test selector push");
            await service.addSelector("test selector expect");
            expect(service.currentSelector()).toBe(SelectorDefault)
            await service.useSelector("test selector expect");

            expect(await service.currentSelector()).toBe("test selector expect")
            expect(await service.getSelectors().includes("test selector push")).toBeTruthy()
        })
    })

    test("current selector", async () => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const service = new SelectorService(settingsService)
            await service.addSelector("test selector push");
            await service.addSelector("test selector expect");
            expect(service.currentSelector()).toBe(SelectorDefault);
            await service.useSelector("test selector expect");
            expect(service.currentSelector()).toBe("test selector expect");
            await service.removeSelector("test selector expect");
            expect(service.currentSelector()).toBe("test selector push");

            expect(await service.getSelectors().includes(SelectorDefault)).toBeTruthy()

            await service.removeSelector("test selector push");
            expect(service.currentSelector()).toBe(SelectorDefault);
        })
    })
})