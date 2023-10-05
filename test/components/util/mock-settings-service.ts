import SettingsService, {SettingsRegistry} from "../../../src/services/settings";

export const withMockSettingsService = async <T>(context: {(settingsService: SettingsService, accessRegistry: {(): SettingsRegistry}): T | undefined}, url: string = "http://www.fart.com/fart"): Promise<T | undefined> => {
    let proxy = { settingsRegistry: {} };
    let returnValue: T | undefined = undefined;
    const settings = new SettingsService(
        (callback: { (settingsRegistry: SettingsRegistry): void }): void => callback(proxy.settingsRegistry),
        () => Promise.resolve(url),
        (newSettingsRegistry, callback?: ({(): T} | {(): void})) => {
            proxy.settingsRegistry = newSettingsRegistry;
            if (callback) callback();
        })
    return new Promise(async (resolve) => {
        resolve(context(settings, () => proxy.settingsRegistry));
    });
}
