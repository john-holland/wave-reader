import SettingsService from '../../src/services/settings';
import Options from '../../src/models/options';
import DomainSettings from '../../src/services/settings';

describe('SettingsService', () => {
    let settingsService: SettingsService;
    let mockStorage: { [key: string]: any } = {};
    let mockTabUrl = 'https://example.com/test';

    beforeEach(() => {
        // Reset mock storage
        mockStorage = {};
        
        // Mock Chrome storage API
        (global as any).chrome = {
            storage: {
                sync: {
                    get: jest.fn((key: string, callback: (result: any) => void) => {
                        const result = mockStorage[key] ? { [key]: mockStorage[key] } : {};
                        callback(result);
                    }),
                    set: jest.fn((data: any, callback?: () => void) => {
                        Object.assign(mockStorage, data);
                        if (callback) callback();
                    })
                }
            },
            runtime: {
                sendMessage: jest.fn()
            }
        };

        // Mock tab URL provider
        const mockTabUrlProvider = () => Promise.resolve(mockTabUrl);
        
        settingsService = SettingsService.withTabUrlProvider(mockTabUrlProvider);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Settings Persistence', () => {
        it('should save and retrieve settings without overwriting', async () => {
            // Create initial settings
            const initialSettings = new Options();
            initialSettings.wave.selector = 'p';
            initialSettings.wave.waveSpeed = 5;
            initialSettings.selectors = ['p', 'div'];

            // Save settings
            await settingsService.addSettingsForDomain('example.com', '/test', initialSettings);

            // Verify settings were saved
            const retrievedSettings = await settingsService.getCurrentSettings();
            expect(retrievedSettings.wave.selector).toBe('p');
            expect(retrievedSettings.wave.waveSpeed).toBe(5);
            expect(retrievedSettings.selectors).toEqual(['p', 'div']);
        });

        it('should preserve existing settings when adding new paths', async () => {
            // Add settings for first path
            const firstSettings = new Options();
            firstSettings.wave.selector = 'p';
            firstSettings.wave.waveSpeed = 3;
            await settingsService.addSettingsForDomain('example.com', '/path1', firstSettings);

            // Add settings for second path
            const secondSettings = new Options();
            secondSettings.wave.selector = 'div';
            secondSettings.wave.waveSpeed = 7;
            await settingsService.addSettingsForDomain('example.com', '/path2', secondSettings);

            // Verify both paths have their respective settings
            const path1Settings = await settingsService.getPathOptionsForDomain('example.com', '/path1');
            const path2Settings = await settingsService.getPathOptionsForDomain('example.com', '/path2');

            expect(path1Settings?.wave.selector).toBe('p');
            expect(path1Settings?.wave.waveSpeed).toBe(3);
            expect(path2Settings?.wave.selector).toBe('div');
            expect(path2Settings?.wave.waveSpeed).toBe(7);
        });

        it('should use existing domain settings as defaults for new paths', async () => {
            // Add settings for root path
            const rootSettings = new Options();
            rootSettings.wave.selector = 'article';
            rootSettings.wave.waveSpeed = 4;
            rootSettings.selectors = ['article', 'section'];
            await settingsService.addSettingsForDomain('example.com', '', rootSettings);

            // Get settings for a new path - should use root settings as defaults
            const newPathSettings = await settingsService.getCurrentSettings();
            expect(newPathSettings.wave.selector).toBe('article');
            expect(newPathSettings.wave.waveSpeed).toBe(4);
            expect(newPathSettings.selectors).toEqual(['article', 'section']);
        });

        it('should handle Map serialization correctly', async () => {
            // Create settings with multiple paths
            const settings1 = new Options();
            settings1.wave.selector = 'p';
            await settingsService.addSettingsForDomain('example.com', '/path1', settings1);

            const settings2 = new Options();
            settings2.wave.selector = 'div';
            await settingsService.addSettingsForDomain('example.com', '/path2', settings2);

            // Verify the Map was serialized correctly by checking storage
            expect(mockStorage['wave_reader__settings_registry']).toBeDefined();
            const storedData = JSON.parse(mockStorage['wave_reader__settings_registry']);
            
            // Check that the domain exists and has pathSettings
            expect(storedData['example.com']).toBeDefined();
            expect(storedData['example.com'].pathSettings).toBeDefined();
            
            // Check that both paths are stored
            expect(storedData['example.com'].pathSettings['/path1']).toBeDefined();
            expect(storedData['example.com'].pathSettings['/path2']).toBeDefined();
        });

        it('should reconstruct Map objects correctly from storage', async () => {
            // Simulate stored data
            const mockStoredData = {
                'example.com': {
                    domain: 'example.com',
                    pathSettings: {
                        '/path1': {
                            wave: { selector: 'p', waveSpeed: 3 },
                            selectors: ['p', 'div']
                        },
                        '/path2': {
                            wave: { selector: 'div', waveSpeed: 7 },
                            selectors: ['div', 'span']
                        }
                    }
                }
            };

            mockStorage['wave_reader__settings_registry'] = JSON.stringify(mockStoredData);

            // Get settings - should reconstruct the Map correctly
            const settings = await settingsService.getCurrentSettings();
            
            // Verify the Map was reconstructed
            const domainSettings = await settingsService.getSettingsForDomain('example.com');
            expect(domainSettings?.pathSettings).toBeInstanceOf(Map);
            expect(domainSettings?.pathSettings.size).toBe(2);
            
            // Check that both paths are accessible
            const path1Settings = domainSettings?.pathSettings.get('/path1');
            const path2Settings = domainSettings?.pathSettings.get('/path2');
            
            expect(path1Settings?.wave.selector).toBe('p');
            expect(path2Settings?.wave.selector).toBe('div');
        });

        it('should not overwrite existing settings when updating', async () => {
            // Create initial settings
            const initialSettings = new Options();
            initialSettings.wave.selector = 'p';
            initialSettings.wave.waveSpeed = 3;
            initialSettings.selectors = ['p', 'div'];
            
            await settingsService.addSettingsForDomain('example.com', '/test', initialSettings);

            // Update only specific properties
            await settingsService.updateCurrentSettings(null, (options) => {
                options.wave.waveSpeed = 5; // Only change wave speed
                return options;
            });

            // Verify other properties weren't overwritten
            const updatedSettings = await settingsService.getCurrentSettings();
            expect(updatedSettings.wave.selector).toBe('p'); // Should still be 'p'
            expect(updatedSettings.wave.waveSpeed).toBe(5); // Should be updated
            expect(updatedSettings.selectors).toEqual(['p', 'div']); // Should still be the same
        });

        it('should handle file URLs correctly', async () => {
            // Mock file URL
            mockTabUrl = 'file:///Users/test/document.html';
            
            const fileSettings = new Options();
            fileSettings.wave.selector = 'body';
            fileSettings.wave.waveSpeed = 2;
            
            // Add settings for the file URL path
            await settingsService.addSettingsForDomain('file:///Users/test/document.html', '/Users/test/document.html', fileSettings);
            
            // Verify settings are saved and retrieved correctly
            const retrievedSettings = await settingsService.getPathOptionsForDomain('file:///Users/test/document.html', '/Users/test/document.html');
            expect(retrievedSettings?.wave.selector).toBe('body'); // Should be the custom selector we set
            expect(retrievedSettings?.wave.waveSpeed).toBe(2);
        });
    });

    describe('Settings Registry', () => {
        it('should create new domain with default settings when domain does not exist', async () => {
            const settings = await settingsService.getCurrentSettings();
            
            // Should have default options
            expect(settings).toBeInstanceOf(Options);
            expect(settings.wave.selector).toBeDefined();
        });

        it('should handle multiple domains independently', async () => {
            // Add settings for first domain
            const domain1Settings = new Options();
            domain1Settings.wave.selector = 'p';
            await settingsService.addSettingsForDomain('domain1.com', '/path', domain1Settings);

            // Add settings for second domain
            const domain2Settings = new Options();
            domain2Settings.wave.selector = 'div';
            await settingsService.addSettingsForDomain('domain2.com', '/path', domain2Settings);

            // Verify domains are independent
            const storedData = JSON.parse(mockStorage['wave_reader__settings_registry']);
            expect(storedData['domain1.com']).toBeDefined();
            expect(storedData['domain2.com']).toBeDefined();
            expect(storedData['domain1.com'].pathSettings['/path'].wave.selector).toBe('p');
            expect(storedData['domain2.com'].pathSettings['/path'].wave.selector).toBe('div');
        });
    });
});
