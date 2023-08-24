import SettingsService, {DomainSettings, SettingsDAOInterface, SettingsRegistry} from "../../src/services/settings";
import SelectorService from "../../src/services/selector";
import {SelectorDefault} from "../../src/models/defaults";
import DoneCallback = jest.DoneCallback;
import Options from "../../src/models/options";
import Wave from "../../src/models/wave";

type Proxy = {
    settingsRegistry: SettingsRegistry
}
const withMockSettingsService = async (context: {(settingsService: SettingsService, accessRegistry: {(): SettingsRegistry}): void}): Promise<void> => {
    let proxy: Proxy = { settingsRegistry: {} };

    const fartmap = new Map<string, Options>()
    fartmap.set("/fart", new Options());
    proxy.settingsRegistry["www.fart.com"] = new DomainSettings("www.fart.com", fartmap)

    const settings = new SettingsService(
        (callback: { (settingsRegistry: SettingsRegistry): void }): void => callback(proxy.settingsRegistry),
        () => Promise.resolve("http://www.fart.com/fart"),
        (newSettingsRegistry: SettingsRegistry, callback?: {(): void}) => {
            proxy.settingsRegistry = newSettingsRegistry;
            if (callback) callback();
        })
    return new Promise(async (resolve) => {
        context(settings, () => proxy.settingsRegistry);
        resolve();
    });
}

describe("selector service", () => {
    test("adds a selector", (done: DoneCallback) => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const service = new SelectorService(settingsService)
            await service.addSelector("test selector push");
            await service.useSelector("test selector expect")

            expect(await service.currentSelector()).toBe("test selector expect")
            expect((await service.getSelectors()).includes("test selector push")).toBeTruthy()
            done();
        })
    })

    test("remove a selector", (done: DoneCallback) => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const service = new SelectorService(settingsService)
            await service.addSelector("test selector push");
            await service.addSelector("test selector expect");
            await service.useSelector("test selector push");
            await service.removeSelector("test selector push");

            expect(await service.currentSelector()).toBe("test selector expect")
            expect((await service.getSelectors()).includes("test selector push")).toBeFalsy()
            done();
        })
    })

    test("use a selector", (done: DoneCallback) => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const service = new SelectorService(settingsService)
            await service.addSelector("test selector push");
            await service.addSelector("test selector expect");
            expect(await service.currentSelector()).toBe(SelectorDefault)
            await service.useSelector("test selector expect");

            expect(await service.currentSelector()).toBe("test selector expect")
            expect((await service.getSelectors()).includes("test selector push")).toBeTruthy()
            done();
        })
    })

    test("current selector",(done: DoneCallback) => {
        withMockSettingsService(async (settingsService: SettingsService, accessRegistry) => {
            const service = new SelectorService(settingsService)
            await service.addSelector("test selector push");
            await service.addSelector("test selector expect");
            expect(await service.currentSelector()).toBe(SelectorDefault);
            await service.useSelector("test selector expect");
            expect(await service.currentSelector()).toBe("test selector expect");
            await service.removeSelector("test selector expect");
            expect(await service.currentSelector()).toBe("test selector push");

            expect((await service.getSelectors()).includes(SelectorDefault)).toBeTruthy()

            await service.removeSelector("test selector push");
            expect(await service.currentSelector()).toBe(SelectorDefault);
            done();
        })
    })
})
