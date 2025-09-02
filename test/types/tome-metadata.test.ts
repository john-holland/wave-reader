import {
  TomeMetadata,
  ComponentTomeMetadata,
  SystemTomeMetadata,
  createTomeWithMetadata,
  createComponentTomeWithMetadata,
  createSystemTomeWithMetadata,
  DEFAULT_TOME_METADATA
} from '../../src/types/tome-metadata';

describe('Tome Metadata System', () => {
  describe('Type Definitions', () => {
    test('TomeMetadata interface should have required properties', () => {
      const metadata: TomeMetadata = {
        id: 'test-tome',
        name: 'Test Tome',
        description: 'A test tome for testing',
        version: '1.0.0',
        dependencies: ['log-view-machine']
      };

      expect(metadata.id).toBe('test-tome');
      expect(metadata.name).toBe('Test Tome');
      expect(metadata.description).toBe('A test tome for testing');
      expect(metadata.version).toBe('1.0.0');
      expect(metadata.dependencies).toEqual(['log-view-machine']);
    });

    test('ComponentTomeMetadata should extend TomeMetadata with component-specific properties', () => {
      const componentMetadata: ComponentTomeMetadata = {
        id: 'test-component-tome',
        name: 'Test Component Tome',
        description: 'A test component tome',
        version: '1.0.0',
        dependencies: ['log-view-machine'],
        componentType: 'ui',
        ui: {
          rendersVisualElements: true,
          isInteractive: true,
          accessibility: {
            ariaSupport: 'full',
            keyboardNavigation: true,
            screenReaderSupport: true
          }
        }
      };

      expect(componentMetadata.componentType).toBe('ui');
      expect(componentMetadata.ui?.rendersVisualElements).toBe(true);
      expect(componentMetadata.ui?.accessibility?.ariaSupport).toBe('full');
    });

    test('SystemTomeMetadata should extend TomeMetadata with system-specific properties', () => {
      const systemMetadata: SystemTomeMetadata = {
        id: 'test-system-tome',
        name: 'Test System Tome',
        description: 'A test system tome',
        version: '1.0.0',
        dependencies: ['log-view-machine'],
        systemType: 'core',
        system: {
          isRequired: true,
          canBeUnloaded: false,
          initOrder: 1
        }
      };

      expect(systemMetadata.systemType).toBe('core');
      expect(systemMetadata.system?.isRequired).toBe(true);
      expect(systemMetadata.system?.initOrder).toBe(1);
    });
  });

  describe('Helper Functions', () => {
    test('createTomeWithMetadata should create a tome with default metadata', () => {
      const config = { machineId: 'test' };
      const createFn = (initialModel: any) => ({ config, model: initialModel });

      const tome = createTomeWithMetadata(
        {
          id: 'test-tome',
          name: 'Test Tome',
          description: 'Test description',
          version: '2.0.0'
        },
        config,
        createFn
      );

      expect(tome.id).toBe('test-tome');
      expect(tome.name).toBe('Test Tome');
      expect(tome.description).toBe('Test description');
      expect(tome.version).toBe('2.0.0');
      expect(tome.config).toBe(config);
      expect(tome.create).toBe(createFn);
      
      // Should have default metadata
      expect(tome.priority).toBe('normal');
      expect(tome.stability).toBe('stable');
      expect(tome.license).toBe('MIT');
    });

    test('createComponentTomeWithMetadata should create a component tome with metadata', () => {
      const config = { machineId: 'test-component' };
      const createFn = (initialModel: any) => ({ config, model: initialModel });

      const tome = createComponentTomeWithMetadata(
        {
          id: 'test-component-tome',
          name: 'Test Component Tome',
          description: 'Test component description',
          version: '1.5.0',
          componentType: 'service',
          service: {
            category: 'data',
            isStateful: true,
            lifecycle: 'singleton'
          }
        },
        config,
        createFn
      );

      expect(tome.componentType).toBe('service');
      expect(tome.service?.category).toBe('data');
      expect(tome.service?.isStateful).toBe(true);
      expect(tome.service?.lifecycle).toBe('singleton');
      
      // Should have default metadata
      expect(tome.priority).toBe('normal');
      expect(tome.stability).toBe('stable');
    });

    test('createSystemTomeWithMetadata should create a system tome with metadata', () => {
      const config = { machineId: 'test-system' };
      const createFn = (initialModel: any) => ({ config, model: initialModel });

      const tome = createSystemTomeWithMetadata(
        {
          id: 'test-system-tome',
          name: 'Test System Tome',
          description: 'Test system description',
          version: '3.0.0',
          systemType: 'framework',
          priority: 'critical',
          system: {
            isRequired: true,
            canBeUnloaded: false,
            supportsHotSwapping: true
          }
        },
        config,
        createFn
      );

      expect(tome.systemType).toBe('framework');
      expect(tome.priority).toBe('critical');
      expect(tome.system?.isRequired).toBe(true);
      expect(tome.system?.supportsHotSwapping).toBe(true);
    });
  });

  describe('Default Metadata', () => {
    test('DEFAULT_TOME_METADATA should have sensible defaults', () => {
      expect(DEFAULT_TOME_METADATA.version).toBe('1.0.0');
      expect(DEFAULT_TOME_METADATA.dependencies).toEqual(['log-view-machine']);
      expect(DEFAULT_TOME_METADATA.priority).toBe('normal');
      expect(DEFAULT_TOME_METADATA.stability).toBe('stable');
      expect(DEFAULT_TOME_METADATA.license).toBe('MIT');
      expect(DEFAULT_TOME_METADATA.performance?.supportsLazyLoading).toBe(true);
      expect(DEFAULT_TOME_METADATA.security?.level).toBe('low');
      expect(DEFAULT_TOME_METADATA.deployment?.enabledByDefault).toBe(true);
    });
  });

  describe('Metadata Validation', () => {
    test('should handle optional metadata properties', () => {
      const minimalMetadata: TomeMetadata = {
        id: 'minimal-tome',
        name: 'Minimal Tome',
        description: 'Minimal description',
        version: '1.0.0',
        dependencies: []
      };

      expect(minimalMetadata.author).toBeUndefined();
      expect(minimalMetadata.tags).toBeUndefined();
      expect(minimalMetadata.custom).toBeUndefined();
    });

    test('should support custom metadata', () => {
      const customMetadata: TomeMetadata = {
        id: 'custom-tome',
        name: 'Custom Tome',
        description: 'Custom description',
        version: '1.0.0',
        dependencies: ['log-view-machine'],
        custom: {
          featureFlags: ['beta', 'experimental'],
          experimentalFeatures: ['ai-powered', 'real-time'],
          deploymentRegion: 'us-west-2'
        }
      };

      expect(customMetadata.custom?.featureFlags).toContain('beta');
      expect(customMetadata.custom?.experimentalFeatures).toContain('ai-powered');
      expect(customMetadata.custom?.deploymentRegion).toBe('us-west-2');
    });
  });

  describe('Performance Metadata', () => {
    test('should support performance characteristics', () => {
      const performanceMetadata: TomeMetadata = {
        id: 'performance-tome',
        name: 'Performance Tome',
        description: 'Performance-focused tome',
        version: '1.0.0',
        dependencies: ['log-view-machine'],
        performance: {
          memoryUsage: 5.2,
          initTime: 200,
          supportsLazyLoading: false
        }
      };

      expect(performanceMetadata.performance?.memoryUsage).toBe(5.2);
      expect(performanceMetadata.performance?.initTime).toBe(200);
      expect(performanceMetadata.performance?.supportsLazyLoading).toBe(false);
    });
  });

  describe('Security Metadata', () => {
    test('should support security information', () => {
      const securityMetadata: TomeMetadata = {
        id: 'security-tome',
        name: 'Security Tome',
        description: 'Security-focused tome',
        version: '1.0.0',
        dependencies: ['log-view-machine'],
        security: {
          requiresElevatedPermissions: true,
          handlesSensitiveData: true,
          level: 'high'
        }
      };

      expect(securityMetadata.security?.requiresElevatedPermissions).toBe(true);
      expect(securityMetadata.security?.handlesSensitiveData).toBe(true);
      expect(securityMetadata.security?.level).toBe('high');
    });
  });
});
