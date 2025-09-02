# Tome Metadata System with Typed Headers

## Overview
The Wave Reader extension now includes a comprehensive **Tome Metadata System** that provides typed headers for all Tomes using the **spread operator**. This system ensures consistency, type safety, and rich metadata across all Tome implementations.

## What Was Added

### 1. **Metadata Type Definitions** (`src/types/tome-metadata.ts`)
- **`TomeMetadata`**: Base interface for all Tome metadata
- **`ComponentTomeMetadata`**: Extended metadata for UI components
- **`SystemTomeMetadata`**: Extended metadata for system components
- **Utility Types**: `TomeWithMetadata<T>`, `ComponentTomeWithMetadata<T>`, `SystemTomeWithMetadata<T>`

### 2. **Helper Functions**
- **`createTomeWithMetadata`**: Creates a Tome with default metadata
- **`createComponentTomeWithMetadata`**: Creates a Component Tome with metadata
- **`createSystemTomeWithMetadata`**: Creates a System Tome with metadata

### 3. **Default Metadata Values**
- **`DEFAULT_TOME_METADATA`**: Common default values for all Tomes
- **Consistent defaults**: Version, dependencies, priority, stability, etc.

## Metadata Structure

### **Base Tome Metadata**
```typescript
export interface TomeMetadata {
  id: string;                    // Unique identifier
  name: string;                  // Human-readable name
  description: string;           // Detailed description
  version: string;               // Semantic version
  dependencies: string[];        // Required dependencies
  author?: string;               // Author/team
  createdAt?: string;            // Creation date
  lastModified?: string;         // Last modification
  tags?: string[];               // Categorization tags
  priority?: 'low' | 'normal' | 'high' | 'critical';
  stability?: 'experimental' | 'beta' | 'stable' | 'deprecated';
  configSchemaVersion?: string;  // Configuration schema version
  license?: string;              // License information
  repository?: string;           // Source location
  documentation?: string;        // Documentation URL
  support?: string;              // Support contact
  performance?: PerformanceMetadata;
  security?: SecurityMetadata;
  testing?: TestingMetadata;
  deployment?: DeploymentMetadata;
  custom?: Record<string, any>;  // Custom metadata
}
```

### **Component-Specific Metadata**
```typescript
export interface ComponentTomeMetadata extends TomeMetadata {
  componentType: 'ui' | 'service' | 'utility' | 'integration' | 'system';
  
  ui?: {
    rendersVisualElements?: boolean;
    isInteractive?: boolean;
    accessibility?: AccessibilityMetadata;
    responsive?: ResponsiveMetadata;
  };
  
  service?: {
    category?: 'data' | 'communication' | 'storage' | 'computation' | 'integration';
    isStateful?: boolean;
    isPersistent?: boolean;
    lifecycle?: 'singleton' | 'transient' | 'scoped';
  };
  
  integration?: {
    externalServices?: string[];
    apiVersions?: Record<string, string>;
    rateLimiting?: RateLimitingMetadata;
  };
}
```

### **System-Specific Metadata**
```typescript
export interface SystemTomeMetadata extends TomeMetadata {
  systemType: 'core' | 'extension' | 'plugin' | 'module' | 'framework';
  
  system?: {
    isRequired?: boolean;
    canBeUnloaded?: boolean;
    supportsHotSwapping?: boolean;
    initOrder?: number;
    isBootstrapComponent?: boolean;
  };
  
  performance?: PerformanceMetadata & {
    maxInitTime?: number;
    maxMemoryUsage?: number;
    supportsBackgroundProcessing?: boolean;
  };
}
```

## Usage Examples

### **Creating a Component Tome with Metadata**
```typescript
import { createComponentTomeWithMetadata } from '../types/tome-metadata';

export const MyComponentTome = createComponentTomeWithMetadata(
  {
    // Spread the metadata header
    id: 'my-component-tome',
    name: 'My Component Tome',
    description: 'State management for my component',
    version: '1.0.0',
    dependencies: ['log-view-machine'],
    
    // Component-specific metadata
    componentType: 'ui',
    author: 'Wave Reader Team',
    tags: ['ui-component', 'state-management'],
    priority: 'normal',
    stability: 'stable',
    
    // UI-specific metadata
    ui: {
      rendersVisualElements: true,
      isInteractive: true,
      accessibility: {
        ariaSupport: 'full',
        keyboardNavigation: true,
        screenReaderSupport: true
      }
    },
    
    // Performance metadata
    performance: {
      memoryUsage: 1.0,
      initTime: 100,
      supportsLazyLoading: true
    },
    
    // Custom metadata
    custom: {
      featureFlags: ['new-ui', 'accessibility'],
      experimentalFeatures: ['dark-mode']
    }
  },
  tomeConfig,
  createTome
);
```

### **Creating a System Tome with Metadata**
```typescript
import { createSystemTomeWithMetadata } from '../types/tome-metadata';

export const MySystemTome = createSystemTomeWithMetadata(
  {
    // Spread the metadata header
    id: 'my-system-tome',
    name: 'My System Tome',
    description: 'Core system functionality',
    version: '1.0.0',
    dependencies: ['log-view-machine'],
    
    // System-specific metadata
    systemType: 'core',
    priority: 'critical',
    stability: 'stable',
    
    // System requirements
    system: {
      isRequired: true,
      canBeUnloaded: false,
      initOrder: 1,
      isBootstrapComponent: true
    },
    
    // Performance requirements
    performance: {
      maxInitTime: 200,
      maxMemoryUsage: 5.0,
      supportsBackgroundProcessing: true
    }
  },
  systemConfig,
  createSystemTome
);
```

## Benefits of the Metadata System

### **1. Type Safety**
- **Compile-time validation**: TypeScript ensures metadata consistency
- **IntelliSense support**: Full autocomplete for metadata properties
- **Error prevention**: Catches metadata errors at build time

### **2. Consistency**
- **Standardized structure**: All Tomes follow the same metadata pattern
- **Default values**: Common properties have sensible defaults
- **Naming conventions**: Consistent property naming across all Tomes

### **3. Rich Information**
- **Performance metrics**: Memory usage, initialization time, lazy loading support
- **Security details**: Permission requirements, data handling, security level
- **Testing information**: Coverage, test types, test suite location
- **Deployment options**: Environment support, hot reloading, runtime configuration

### **4. Developer Experience**
- **Self-documenting**: Metadata provides comprehensive component information
- **Easy discovery**: Developers can understand Tome capabilities from metadata
- **Debugging support**: Rich metadata aids in troubleshooting and optimization

### **5. System Integration**
- **Runtime inspection**: Metadata can be accessed at runtime for system analysis
- **Health monitoring**: Performance and stability metadata for system health checks
- **Dependency management**: Clear dependency information for system initialization

## Metadata Categories

### **Performance Metadata**
```typescript
performance: {
  memoryUsage: 2.5,           // Estimated memory usage in MB
  initTime: 150,               // Estimated initialization time in ms
  supportsLazyLoading: true    // Whether lazy loading is supported
}
```

### **Security Metadata**
```typescript
security: {
  requiresElevatedPermissions: false,  // Whether elevated permissions are needed
  handlesSensitiveData: false,         // Whether sensitive data is processed
  level: 'low'                         // Security level: low, medium, high, critical
}
```

### **Testing Metadata**
```typescript
testing: {
  coverage: 85,                        // Test coverage percentage
  hasUnitTests: true,                  // Whether unit tests exist
  hasIntegrationTests: true,           // Whether integration tests exist
  testSuite: 'src/test/component/'    // Test suite location
}
```

### **Deployment Metadata**
```typescript
deployment: {
  enabledByDefault: true,              // Whether enabled by default
  canBeDisabled: true,                 // Whether can be disabled at runtime
  supportsHotReload: true,             // Whether hot reloading is supported
  environments: ['dev', 'staging', 'prod']  // Supported environments
}
```

## Migration Guide

### **From Old Tome Structure**
```typescript
// Old way
export const MyTome = {
  id: 'my-tome',
  name: 'My Tome',
  description: 'Description',
  version: '1.0.0',
  dependencies: ['log-view-machine'],
  create: (initialModel) => { /* ... */ }
};

// New way with metadata
export const MyTome = createComponentTomeWithMetadata(
  {
    id: 'my-tome',
    name: 'My Tome',
    description: 'Description',
    version: '1.0.0',
    dependencies: ['log-view-machine'],
    // ... rich metadata
  },
  config,
  createFn
);
```

### **Adding Metadata to Existing Tomes**
1. **Import the helper function**: `import { createComponentTomeWithMetadata } from '../types/tome-metadata'`
2. **Extract configuration**: Move existing config to a separate variable
3. **Extract create function**: Move existing create logic to a separate function
4. **Wrap with metadata**: Use the helper function with rich metadata
5. **Add component-specific metadata**: Include UI, service, or system metadata as appropriate

## Future Enhancements

### **Metadata Validation**
- **Schema validation**: JSON Schema validation for metadata
- **Runtime validation**: Validate metadata at runtime
- **Custom validators**: Component-specific validation rules

### **Metadata Discovery**
- **Registry system**: Central registry of all Tome metadata
- **Search and filtering**: Find Tomes by metadata criteria
- **Dependency analysis**: Analyze Tome dependencies and relationships

### **Performance Monitoring**
- **Real-time metrics**: Collect actual performance data
- **Trend analysis**: Track performance over time
- **Alerting**: Notify when performance thresholds are exceeded

### **Documentation Generation**
- **Auto-documentation**: Generate docs from metadata
- **API documentation**: Create API docs from Tome metadata
- **Change tracking**: Track metadata changes over time

## Conclusion

The new Tome Metadata System provides:
- **Type Safety**: Compile-time validation and IntelliSense support
- **Rich Information**: Comprehensive metadata for all Tome aspects
- **Consistency**: Standardized structure across all Tome implementations
- **Developer Experience**: Better documentation and debugging support
- **System Integration**: Runtime metadata access for system analysis

This system positions the Wave Reader extension for better maintainability, documentation, and system integration while providing developers with rich, type-safe metadata for all Tome components.
