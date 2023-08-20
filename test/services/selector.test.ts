import SettingsService, {DomainSettings, SettingsInterface, SettingsRegistry} from "../../src/services/settings";
import SelectorService from "../../src/services/selector";

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

    /**
         removeSelector(selector: string): void;
         useSelector(selector: string): boolean;
         currentSelector(): string;
     */
})