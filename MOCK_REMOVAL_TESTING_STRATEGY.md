# Mock Removal Testing Strategy for log-view-machine Integration

## Overview

This document outlines the comprehensive strategy for removing mocks and integrating the real `log-view-machine` package across both projects. The goal is to eliminate debugging issues caused by mock implementations while maintaining robust testing capabilities.

## Current State Analysis

### Mock Usage in wave-reader
- **Location**: `src/mocks/log-view-machine.ts`
- **Webpack Alias**: Currently pointing to real package (`../log-view-machine/dist/index.esm.js`)
- **Files Using Mock**: 44 files across the project
- **Mock Functions**: 15+ mock implementations

### Real Package Analysis
- **Location**: `/Users/johnholland/Developers/log-view-machine`
- **Build Status**: ✅ Built (dist/ directory exists)
- **Exports Available**: 15+ real exports including:
  - `ViewStateMachine`, `createViewStateMachine`
  - `StructuralSystem`, `createStructuralSystem`
  - `TomeManager`, `createTomeConfig`
  - `StructuralRouter`, `useRouter`
  - And more...

## Mock vs Real Package Comparison

### Current Mock Implementations
```typescript
// Mock functions with console warnings
export function createViewStateMachine(config: any) {
  console.warn('🚨 MOCK createViewStateMachine: This is a MOCK implementation!');
  return {
    send: async (message: any) => ({ success: true, data: message }),
    subscribe: (callback: (state: any) => void) => ({ unsubscribe: () => {} }),
    getState: () => ({ value: 'idle', context: { isActive: false } }),
    start: async () => Promise.resolve()
  };
}
```

### Real Package Exports
```typescript
// Real implementations with full functionality
export { ViewStateMachine, createViewStateMachine, createProxyRobotCopyStateMachine } from './core/ViewStateMachine';
export { StructuralSystem, createStructuralSystem, useStructuralSystem } from './core/StructuralSystem';
export { TomeManager } from './core/TomeManager';
export { createTomeConfig, FishBurgerTomeConfig, EditorTomeConfig } from './core/TomeConfig';
// ... 15+ more real exports
```

## Testing Strategy

### Phase 1: Environment-Based Mock Switching

#### 1.1 Webpack Configuration Update
```javascript
// webpack.common.js
resolve: {
  alias: {
    "log-view-machine": process.env.NODE_ENV === 'test' 
      ? path.resolve(__dirname, "src/mocks/log-view-machine.ts")
      : path.resolve(__dirname, "../log-view-machine/dist/index.esm.js")
  }
}
```

#### 1.2 Test Environment Detection
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^log-view-machine$': '<rootDir>/src/mocks/log-view-machine.ts'
  }
};
```

### Phase 2: Gradual Migration by Component

#### 2.1 Low-Risk Components First
- **Content Scripts**: `log-view-content-system-tome.ts`
- **Shadow DOM**: `log-view-shadow-system-tome.ts`
- **Background Scripts**: `log-view-background-system.ts`

#### 2.2 High-Risk Components Last
- **App Components**: `app.tsx`
- **Structural Components**: `wave-reader-structural-config.ts`
- **Message Routers**: `wave-reader-message-router.ts`

### Phase 3: Testing Implementation

#### 3.1 Unit Tests for Mock Removal
```typescript
// test/mock-removal.test.ts
describe('Mock Removal Tests', () => {
  test('should use real package in production', () => {
    process.env.NODE_ENV = 'production';
    const { createViewStateMachine } = require('log-view-machine');
    expect(createViewStateMachine).not.toBe(undefined);
    expect(createViewStateMachine.toString()).not.toContain('MOCK');
  });

  test('should use mock in test environment', () => {
    process.env.NODE_ENV = 'test';
    const { createViewStateMachine } = require('log-view-machine');
    expect(createViewStateMachine.toString()).toContain('MOCK');
  });
});
```

#### 3.2 Integration Tests
```typescript
// test/integration/real-package.test.ts
describe('Real Package Integration', () => {
  test('should create real ViewStateMachine', async () => {
    const { createViewStateMachine } = require('log-view-machine');
    const machine = createViewStateMachine({
      initial: 'idle',
      states: {
        idle: { on: { START: 'running' } },
        running: { on: { STOP: 'idle' } }
      }
    });
    
    expect(machine).toBeDefined();
    expect(typeof machine.send).toBe('function');
    expect(typeof machine.subscribe).toBe('function');
  });
});
```

#### 3.3 Playwright Tests with Real Package
```typescript
// test/playwright/real-package-integration.test.ts
test('should work with real log-view-machine in browser', async ({ page }) => {
  await page.goto('file:///path/to/test.html');
  
  const result = await page.evaluate(() => {
    const { createViewStateMachine } = window.logViewMachine;
    const machine = createViewStateMachine({ /* config */ });
    return machine.getState();
  });
  
  expect(result).toBeDefined();
  expect(result.value).toBe('idle');
});
```

## Implementation Plan

### Step 1: Create Environment Detection Utility
```typescript
// src/utils/environment.ts
export const isTestEnvironment = () => process.env.NODE_ENV === 'test';
export const isDevelopmentEnvironment = () => process.env.NODE_ENV === 'development';
export const isProductionEnvironment = () => process.env.NODE_ENV === 'production';

export const shouldUseMock = () => {
  return isTestEnvironment() || process.env.USE_MOCK === 'true';
};
```

### Step 2: Update Webpack Configuration
```javascript
// webpack.common.js
const shouldUseMock = process.env.NODE_ENV === 'test' || process.env.USE_MOCK === 'true';

resolve: {
  alias: {
    "log-view-machine": shouldUseMock
      ? path.resolve(__dirname, "src/mocks/log-view-machine.ts")
      : path.resolve(__dirname, "../log-view-machine/dist/index.esm.js")
  }
}
```

### Step 3: Create Migration Script
```bash
#!/bin/bash
# scripts/migrate-to-real-package.sh

echo "🔄 Starting migration to real log-view-machine package..."

# Step 1: Test with mocks
echo "📋 Testing with mocks..."
npm test

# Step 2: Test with real package in development
echo "📋 Testing with real package in development..."
NODE_ENV=development npm run build
npm run test:integration

# Step 3: Test with real package in production
echo "📋 Testing with real package in production..."
NODE_ENV=production npm run build
npm run test:production

echo "✅ Migration complete!"
```

### Step 4: Create Test Coverage for Mock Removal
```typescript
// test/coverage/mock-removal-coverage.test.ts
describe('Mock Removal Coverage', () => {
  test('should have 100% coverage for real package functions', () => {
    const { createViewStateMachine } = require('log-view-machine');
    
    // Test all exported functions
    expect(createViewStateMachine).toBeDefined();
    expect(typeof createViewStateMachine).toBe('function');
    
    // Test function behavior
    const machine = createViewStateMachine({});
    expect(machine).toBeDefined();
    expect(typeof machine.send).toBe('function');
    expect(typeof machine.subscribe).toBe('function');
    expect(typeof machine.getState).toBe('function');
    expect(typeof machine.start).toBe('function');
  });
});
```

## Risk Assessment

### High Risk Areas
1. **App.tsx**: Main application entry point
2. **Background Scripts**: Chrome extension background context
3. **Content Scripts**: Page context execution
4. **Message Passing**: Inter-component communication

### Medium Risk Areas
1. **Structural Components**: Configuration and routing
2. **Tome Integration**: State management
3. **Testing Infrastructure**: Test environment setup

### Low Risk Areas
1. **Utility Functions**: Helper functions
2. **Type Definitions**: Interface definitions
3. **Configuration Files**: Build and config files

## Rollback Strategy

### Immediate Rollback
```bash
# Revert to mock immediately
export USE_MOCK=true
npm run build
```

### Git Rollback
```bash
# Rollback to last working commit
git revert <commit-hash>
git push origin main
```

### Environment-Specific Rollback
```javascript
// webpack.common.js - Emergency fallback
resolve: {
  alias: {
    "log-view-machine": process.env.EMERGENCY_MOCK === 'true'
      ? path.resolve(__dirname, "src/mocks/log-view-machine.ts")
      : path.resolve(__dirname, "../log-view-machine/dist/index.esm.js")
  }
}
```

## Success Criteria

### Functional Requirements
- [ ] All tests pass with real package
- [ ] No console warnings about mocks in production
- [ ] All Chrome extension functionality works
- [ ] Background/content script communication works
- [ ] State management functions correctly

### Performance Requirements
- [ ] Build time remains acceptable
- [ ] Bundle size increase is minimal
- [ ] Runtime performance is maintained
- [ ] Memory usage is stable

### Quality Requirements
- [ ] Code coverage remains at 90%+
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] All integration tests pass

## Monitoring and Validation

### Continuous Monitoring
```typescript
// src/monitoring/package-usage.ts
export const monitorPackageUsage = () => {
  const { createViewStateMachine } = require('log-view-machine');
  
  // Check if we're using real package
  const isRealPackage = !createViewStateMachine.toString().includes('MOCK');
  
  if (!isRealPackage && process.env.NODE_ENV === 'production') {
    console.error('🚨 CRITICAL: Using mock package in production!');
    // Send alert to monitoring system
  }
  
  return isRealPackage;
};
```

### Validation Tests
```typescript
// test/validation/package-validation.test.ts
describe('Package Validation', () => {
  test('should use real package in production', () => {
    process.env.NODE_ENV = 'production';
    const isReal = monitorPackageUsage();
    expect(isReal).toBe(true);
  });
  
  test('should use mock in test environment', () => {
    process.env.NODE_ENV = 'test';
    const isReal = monitorPackageUsage();
    expect(isReal).toBe(false);
  });
});
```

## Conclusion

This strategy provides a comprehensive approach to removing mocks while maintaining testing capabilities. The phased approach minimizes risk while ensuring thorough validation at each step. The rollback strategy provides safety nets for quick recovery if issues arise.

The key is to start with low-risk components and gradually migrate to high-risk areas, with extensive testing at each phase. The environment-based switching allows for easy rollback and testing in different contexts.
