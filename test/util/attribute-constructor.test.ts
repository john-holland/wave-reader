import {Deferred} from "../../src/util/deferred";
import {describe, expect, test} from '@jest/globals'
import Options from "../../src/models/options";

describe('Attribute Constructor', () => {
    test('copies default partial', (done: () => void) => {
        const settingsWithNotificationsFalse = { ...Options.getDefaultOptions(), ...{ showNotifications: false  }};
        const settings = new Options(settingsWithNotificationsFalse)
        expect(settings.showNotifications).toBe(false);
        done();
    });

    test('copies built in partial defaults', (done: () => void) => {
        const settings = new Options(Options.getDefaultOptions())
        expect(settings.showNotifications).toBe(true);
        done();
    });
});