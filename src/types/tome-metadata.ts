/**
 * Tome Metadata Types
 * 
 * Defines the standard metadata structure for all Tomes in the Wave Reader extension.
 * This provides type safety and consistency across all Tome implementations.
 */

export interface TomeMetadata {
  /** Unique identifier for the Tome */
  id: string;
  
  /** Human-readable name for the Tome */
  name: string;
  
  /** Detailed description of the Tome's purpose and functionality */
  description: string;
  
  /** Semantic version of the Tome */
  version: string;
  
  /** Array of dependency names that this Tome requires */
  dependencies: string[];
  
  /** Author or team responsible for the Tome */
  author?: string;
  
  /** Creation date of the Tome */
  createdAt?: string;
  
  /** Last modification date of the Tome */
  lastModified?: string;
  
  /** Tags for categorization and search */
  tags?: string[];
  
  /** Priority level for initialization order */
  priority?: 'low' | 'normal' | 'high' | 'critical';
  
  /** Whether the Tome is experimental or stable */
  stability?: 'experimental' | 'beta' | 'stable' | 'deprecated';
  
  /** Configuration schema version for validation */
  configSchemaVersion?: string;
  
  /** License information */
  license?: string;
  
  /** Repository or source location */
  repository?: string;
  
  /** Documentation URL */
  documentation?: string;
  
  /** Support contact information */
  support?: string;
  
  /** Performance characteristics */
  performance?: {
    /** Estimated memory usage in MB */
    memoryUsage?: number;
    /** Estimated initialization time in ms */
    initTime?: number;
    /** Whether the Tome supports lazy loading */
    supportsLazyLoading?: boolean;
  };
  
  /** Security considerations */
  security?: {
    /** Whether the Tome requires elevated permissions */
    requiresElevatedPermissions?: boolean;
    /** Whether the Tome handles sensitive data */
    handlesSensitiveData?: boolean;
    /** Security level: low, medium, high, critical */
    level?: 'low' | 'medium' | 'high' | 'critical';
  };
  
  /** Testing information */
  testing?: {
    /** Test coverage percentage */
    coverage?: number;
    /** Whether the Tome has integration tests */
    hasIntegrationTests?: boolean;
    /** Whether the Tome has unit tests */
    hasUnitTests?: boolean;
    /** Test suite location */
    testSuite?: string;
  };
  
  /** Deployment information */
  deployment?: {
    /** Whether the Tome is enabled by default */
    enabledByDefault?: boolean;
    /** Whether the Tome can be disabled at runtime */
    canBeDisabled?: boolean;
    /** Whether the Tome supports hot reloading */
    supportsHotReload?: boolean;
    /** Environment requirements */
    environments?: ('development' | 'staging' | 'production')[];
  };
  
  /** Custom metadata specific to the Tome */
  custom?: Record<string, any>;
}

/**
 * Extended Tome Metadata with Component-Specific Information
 */
export interface ComponentTomeMetadata extends TomeMetadata {
  /** Component type classification */
  componentType: 'ui' | 'service' | 'utility' | 'integration' | 'system';
  
  /** UI-specific metadata */
  ui?: {
    /** Whether the component renders visual elements */
    rendersVisualElements?: boolean;
    /** Whether the component is interactive */
    isInteractive?: boolean;
    /** Accessibility features */
    accessibility?: {
      /** ARIA support level */
      ariaSupport?: 'basic' | 'full' | 'extended';
      /** Keyboard navigation support */
      keyboardNavigation?: boolean;
      /** Screen reader support */
      screenReaderSupport?: boolean;
    };
    /** Responsive design support */
    responsive?: {
      /** Mobile support level */
      mobileSupport?: 'none' | 'basic' | 'full';
      /** Tablet support level */
      tabletSupport?: 'none' | 'basic' | 'full';
      /** Desktop support level */
      desktopSupport?: 'none' | 'basic' | 'full';
    };
  };
  
  /** Service-specific metadata */
  service?: {
    /** Service category */
    category?: 'data' | 'communication' | 'storage' | 'computation' | 'integration';
    /** Whether the service is stateful */
    isStateful?: boolean;
    /** Whether the service is persistent */
    isPersistent?: boolean;
    /** Service lifecycle */
    lifecycle?: 'singleton' | 'transient' | 'scoped';
  };
  
  /** Integration-specific metadata */
  integration?: {
    /** External service dependencies */
    externalServices?: string[];
    /** API version requirements */
    apiVersions?: Record<string, string>;
    /** Rate limiting information */
    rateLimiting?: {
      /** Requests per second */
      requestsPerSecond?: number;
      /** Burst capacity */
      burstCapacity?: number;
    };
  };
}

/**
 * System Tome Metadata for Core System Components
 */
export interface SystemTomeMetadata extends TomeMetadata {
  /** System component classification */
  systemType: 'core' | 'extension' | 'plugin' | 'module' | 'framework';
  
  /** System-level metadata */
  system?: {
    /** Whether the component is required for system operation */
    isRequired?: boolean;
    /** Whether the component can be unloaded */
    canBeUnloaded?: boolean;
    /** Whether the component supports hot swapping */
    supportsHotSwapping?: boolean;
    /** System initialization order */
    initOrder?: number;
    /** Whether the component is part of the bootstrap process */
    isBootstrapComponent?: boolean;
  };
  
  /** Performance requirements */
  performance?: TomeMetadata['performance'] & {
    /** Maximum acceptable initialization time */
    maxInitTime?: number;
    /** Maximum acceptable memory usage */
    maxMemoryUsage?: number;
    /** Whether the component supports background processing */
    supportsBackgroundProcessing?: boolean;
  };
}

/**
 * Utility type to create a Tome with metadata
 */
export type TomeWithMetadata<T = any> = TomeMetadata & {
  /** Tome configuration and creation logic */
  config: T;
  
  /** Create function to instantiate the Tome */
  create: (initialModel?: any) => T;
};

/**
 * Utility type to create a Component Tome with metadata
 */
export type ComponentTomeWithMetadata<T = any> = ComponentTomeMetadata & {
  /** Tome configuration and creation logic */
  config: T;
  
  /** Create function to instantiate the Tome */
  create: (initialModel?: any) => T;
};

/**
 * Utility type to create a System Tome with metadata
 */
export type SystemTomeWithMetadata<T = any> = SystemTomeMetadata & {
  /** Tome configuration and creation logic */
  config: T;
  
  /** Create function to instantiate the Tome */
  create: (initialModel?: any) => T;
};

/**
 * Default metadata values for common Tome properties
 */
export const DEFAULT_TOME_METADATA: Partial<TomeMetadata> = {
  version: '1.0.0',
  dependencies: ['log-view-machine'],
  priority: 'normal',
  stability: 'stable',
  configSchemaVersion: '1.0',
  license: 'MIT',
  performance: {
    supportsLazyLoading: true
  },
  security: {
    requiresElevatedPermissions: false,
    handlesSensitiveData: false,
    level: 'low'
  },
  testing: {
    hasUnitTests: false,
    hasIntegrationTests: false
  },
  deployment: {
    enabledByDefault: true,
    canBeDisabled: true,
    supportsHotReload: false,
    environments: ['development', 'staging', 'production']
  }
};

/**
 * Helper function to create a Tome with default metadata
 */
export function createTomeWithMetadata<T>(
  metadata: Partial<TomeMetadata>,
  config: T,
  createFn: (initialModel?: any) => any
): TomeWithMetadata<T> {
  return {
    ...DEFAULT_TOME_METADATA,
    ...metadata,
    config,
    create: createFn
  } as TomeWithMetadata<T>;
}

/**
 * Helper function to create a Component Tome with default metadata
 */
export function createComponentTomeWithMetadata<T>(
  metadata: Partial<ComponentTomeMetadata>,
  config: T,
  createFn: (initialModel?: any) => any
): ComponentTomeWithMetadata<T> {
  return {
    ...DEFAULT_TOME_METADATA,
    componentType: 'ui',
    ...metadata,
    config,
    create: createFn
  } as ComponentTomeWithMetadata<T>;
}

/**
 * Helper function to create a System Tome with default metadata
 */
export function createSystemTomeWithMetadata<T>(
  metadata: Partial<SystemTomeMetadata>,
  config: T,
  createFn: (initialModel?: any) => any
): SystemTomeWithMetadata<T> {
  return {
    ...DEFAULT_TOME_METADATA,
    systemType: 'core',
    ...metadata,
    config,
    create: createFn
  } as SystemTomeWithMetadata<T>;
}
