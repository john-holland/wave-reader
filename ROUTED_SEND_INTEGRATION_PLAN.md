# Routed Send Integration Plan
**Date**: October 2025  
**Goal**: Integrate async routed send natively into log-view-machine's Tome and ViewStateMachine architecture  
**Status**: Planning Phase

---

## 🎯 Objectives

1. Make routed send a native feature of ViewStateMachine
2. Allow services to communicate with other machines via router
3. Maintain backward compatibility with existing code
4. Support hierarchical routing patterns
5. Provide clean TypeScript types and interfaces

---

## 🏗️ Architecture Overview

### Current State (Workaround)
```typescript
// In AppTome
const routedSend = async (target, event, payload) => {
    const machine = this.router.resolve(target);
    return machine.send(event, payload);
};
const appMachine = createAppMachine(routedSend);

// In app-machine services
if (routedSend) {
    await routedSend('BackgroundProxyMachine', 'START');
}
```

### Proposed State (Native)
```typescript
// In AppTome
const appMachine = createAppMachine();
appMachine.setRouter(this.router);

// In app-machine services
const response = await context.routedSend('BackgroundProxyMachine', 'START');
// or
const response = await send.routed('BackgroundProxyMachine', 'START');
```

---

## 📋 Implementation Steps

### Phase 1: Core Infrastructure (log-view-machine)

#### Step 1.1: Add Router Interface to ViewStateMachine
**File**: `log-view-machine/src/core/ViewStateMachine.tsx`

```typescript
export interface MachineRouter {
    register(name: string, machine: any): void;
    resolve(name: string): any | null;
    send(target: string, event: string, payload?: any): Promise<any>;
}

export type RoutedSend = (target: string, event: string, payload?: any) => Promise<any>;
```

**Changes**:
- Add `router` property to ViewStateMachine class
- Add `setRouter(router: MachineRouter)` method
- Make router available to services via context

#### Step 1.2: Extend Service Context
**File**: `log-view-machine/src/core/ViewStateMachine.tsx`

```typescript
// Current service signature
services: {
    myService: async (context: any, event: any) => { ... }
}

// Proposed service signature with meta
services: {
    myService: async (context: any, event: any, meta: ServiceMeta) => { ... }
}

interface ServiceMeta {
    routedSend?: RoutedSend;
    machineId: string;
    router?: MachineRouter;
}
```

**Changes**:
- Add third parameter `meta` to service invocations
- Include `routedSend` in meta object
- Pass router reference through meta

#### Step 1.3: Update ViewStateMachine Constructor
**File**: `log-view-machine/src/core/ViewStateMachine.tsx`

```typescript
export interface ViewStateMachineConfig<TModel = any> {
    machineId: string;
    xstateConfig: any;
    tomeConfig?: any;
    predictableActionArguments?: boolean;
    router?: MachineRouter;  // NEW: Optional router
}

constructor(config: ViewStateMachineConfig<TModel>) {
    // ... existing code ...
    
    // Create routed send function if router provided
    this.setRouter(config.router);
}

setRouter(router: MachineRouter) {
    this.router = router;
    if (this.router) {
        this.routedSend = async (target, event, payload) => {
            return this.router!.send(target, event, payload);
        };
    }
}
```

#### Step 1.4: Wrap XState Services
**File**: `log-view-machine/src/core/ViewStateMachine.tsx`

```typescript
private wrapServices(services: any): any {
    const wrappedServices: any = {};
    
    for (const [serviceName, serviceImpl] of Object.entries(services)) {
        wrappedServices[serviceName] = async (context: any, event: any) => {
            const meta: ServiceMeta = {
                routedSend: this.createRoutedSendForContext(),
                machineId: this.machineId,
                router: this.router,
                machine: this  // Reference to current machine for relative routing
            };
            
            // Call original service with meta
            return (serviceImpl as Function)(context, event, meta);
        };
    }
    
    return wrappedServices;
}

// Create routed send that supports relative paths
private createRoutedSendForContext(): RoutedSend {
    return async (target: string, event: string, payload?: any) => {
        if (!this.router) {
            throw new Error('Router not available for this machine');
        }
        
        // Try relative resolution first
        let machine = this.router.resolveRelative(target, this);
        
        // Fallback to absolute resolution
        if (!machine) {
            machine = this.router.resolve(target);
        }
        
        if (!machine) {
            throw new Error(`Machine ${target} not found via router`);
        }
        
        return machine.send(event, payload);
    };
}

// Use in constructor
const machineDefinition = createMachine({
    ...config.xstateConfig,
    // ... other config
}, {
    services: this.wrapServices(config.xstateConfig.services || {}),
    actions: config.xstateConfig.actions || {}
});
```

---

### Phase 2: TomeBase Integration

#### Step 2.1: Implement MachineRouter in TomeBase
**File**: `log-view-machine/src/core/TomeBase.ts`

```typescript
export class MachineRouter {
    private machines: Map<string, any> = new Map();
    
    register(name: string, machine: any): void {
        this.machines.set(name, machine);
    }
    
    resolve(name: string): any | null {
        return this.machines.get(name) || null;
    }
    
    async send(target: string, event: string, payload?: any): Promise<any> {
        const machine = this.resolve(target);
        if (!machine) {
            throw new Error(`Machine ${target} not found in router`);
        }
        return machine.send(event, payload);
    }
    
    // Support hierarchical paths like "ParentMachine.ChildMachine"
    resolveHierarchical(path: string): any | null {
        const parts = path.split('.');
        let current = this.resolve(parts[0]);
        
        for (let i = 1; i < parts.length && current; i++) {
            current = current.subMachines?.get(parts[i]);
        }
        
        return current;
    }
    
    // Resolve relative paths from a context machine
    resolveRelative(path: string, contextMachine: any): any | null {
        // Handle absolute paths (no . or ..)
        if (!path.startsWith('.')) {
            return this.resolveHierarchical(path);
        }
        
        // Handle current machine reference (.)
        if (path === '.') {
            return contextMachine;
        }
        
        // Handle parent machine reference (..)
        if (path === '..') {
            return contextMachine.parentMachine || null;
        }
        
        // Handle relative child (./ prefix)
        if (path.startsWith('./')) {
            const subPath = path.substring(2);
            return this.navigateFromMachine(contextMachine, subPath);
        }
        
        // Handle relative parent (../ prefix)
        if (path.startsWith('../')) {
            const parent = contextMachine.parentMachine;
            if (!parent) {
                throw new Error(`No parent machine found for relative path: ${path}`);
            }
            const remainingPath = path.substring(3);
            return this.navigateFromMachine(parent, remainingPath);
        }
        
        return null;
    }
    
    // Navigate from a specific machine following a path
    private navigateFromMachine(machine: any, path: string): any | null {
        if (!path) return machine;
        
        const parts = path.split('/');
        let current = machine;
        
        for (const part of parts) {
            if (part === '.') {
                continue; // Stay at current
            } else if (part === '..') {
                current = current.parentMachine;
                if (!current) return null;
            } else {
                // Navigate to sub-machine
                current = current.subMachines?.get(part);
                if (!current) return null;
            }
        }
        
        return current;
    }
}

export class TomeBase {
    protected router: MachineRouter;
    
    constructor() {
        this.router = new MachineRouter();
        // ... existing code
    }
    
    // Helper to create machines with router
    protected createMachineWithRouter<T>(
        factory: (router: MachineRouter) => T
    ): T {
        return factory(this.router);
    }
}
```

#### Step 2.2: Update TomeBase Machine Creation
**File**: `log-view-machine/src/core/TomeBase.ts`

```typescript
// Add router to ViewStateMachine config when creating machines
protected createViewStateMachine(config: ViewStateMachineConfig): ViewStateMachine {
    return new ViewStateMachine({
        ...config,
        router: this.router  // Automatically inject router
    });
}
```

---

### Phase 3: Wave Reader Updates

#### Step 3.1: Update AppTome
**File**: `wave-reader/src/app/tomes/AppTome.tsx`

**Before**:
```typescript
const routedSend = async (target, event, payload) => {
    const machine = this.router.resolve(target);
    return machine.send(event, payload);
};
const appMachine = createAppMachine(routedSend);
```

**After**:
```typescript
const appMachine = createAppMachine();
appMachine.setRouter(this.router);  // Or pass in config
```

#### Step 3.2: Update app-machine Services
**File**: `wave-reader/src/app/machines/app-machine.ts`

**Before**:
```typescript
export const createAppMachine = (routedSend?: RoutedSend) => {
    return createViewStateMachine({
        services: {
            startService: async (context) => {
                if (routedSend) {
                    await routedSend('BackgroundProxyMachine', 'START');
                }
            }
        }
    });
};
```

**After**:
```typescript
export const createAppMachine = () => {
    return createViewStateMachine({
        services: {
            startService: async (context, event, meta) => {
                // Option A: Via meta
                if (meta.routedSend) {
                    await meta.routedSend('BackgroundProxyMachine', 'START');
                }
                
                // Option B: Via context (if we inject it)
                // await context.routedSend('BackgroundProxyMachine', 'START');
            }
        }
    });
};
```

---

## 🧭 Relative Path Routing

### Path Syntax

The router supports filesystem-like relative path navigation:

| Path | Description | Example |
|------|-------------|---------|
| `MachineName` | Absolute path to registered machine | `BackgroundProxyMachine` |
| `Parent.Child` | Hierarchical absolute path | `AppMachine.SettingsMachine` |
| `.` | Current machine (self-reference) | `.` |
| `..` | Parent machine | `..` |
| `./SubMachine` | Sub-machine of current machine | `./TabsMachine` |
| `../SiblingMachine` | Sibling machine (via parent) | `../BackgroundProxy` |
| `../../GrandparentMachine` | Grandparent machine | `../../AppMachine` |
| `../SiblingMachine/ChildMachine` | Complex relative path | `../Settings/Theme` |

### Usage Examples

```typescript
// In a service, sending to different machines:
services: {
    myService: async (context, event, meta) => {
        // Absolute path - top-level registered machine
        await meta.routedSend('BackgroundProxyMachine', 'START');
        
        // Hierarchical absolute path
        await meta.routedSend('AppMachine.SettingsMachine', 'UPDATE');
        
        // Current machine (self-send)
        await meta.routedSend('.', 'REFRESH');
        
        // Parent machine
        await meta.routedSend('..', 'NOTIFY_PARENT');
        
        // Sub-machine of current machine
        await meta.routedSend('./TabsMachine', 'SWITCH_TAB', { tab: 'settings' });
        
        // Sibling machine (go to parent, then to sibling)
        await meta.routedSend('../BackgroundProxyMachine', 'START');
        
        // Complex path - sibling's child
        await meta.routedSend('../SettingsMachine/ThemeMachine', 'CHANGE_THEME');
        
        // Grandparent
        await meta.routedSend('../..', 'GLOBAL_EVENT');
    }
}
```

### Machine Hierarchy Example

```
TomeBase (Router)
├── AppMachine
│   ├── TabsMachine
│   │   └── TabMachine
│   ├── SettingsMachine
│   │   ├── ThemeMachine
│   │   └── KeyboardMachine
│   └── AboutMachine
└── BackgroundProxyMachine
```

From `TabMachine`'s perspective:
- `.` → TabMachine (self)
- `..` → TabsMachine (parent)
- `../..` → AppMachine (grandparent)
- `../../SettingsMachine` → AppMachine's SettingsMachine (uncle)
- `../../SettingsMachine/ThemeMachine` → ThemeMachine (cousin)
- `../../BackgroundProxyMachine` → Error (BackgroundProxy is not a child of AppMachine)
- `BackgroundProxyMachine` → BackgroundProxyMachine (absolute path works!)

### Resolution Logic

1. **Check if path starts with `.`** → Use relative resolution
2. **Try relative resolution** from current machine context
3. **Fallback to absolute resolution** if relative fails
4. **Throw error** if machine not found

This allows mixing absolute and relative paths in the same codebase for maximum flexibility.

---

## 🎨 API Design Options

### Option A: Via Meta Parameter (Recommended)
**Pros**:
- Clean separation of concerns
- Doesn't pollute context
- TypeScript friendly
- Easier to test

```typescript
services: {
    myService: async (context, event, meta) => {
        const response = await meta.routedSend('Target', 'EVENT');
    }
}
```

### Option B: Via Context Injection
**Pros**:
- Shorter syntax
- Familiar pattern

**Cons**:
- Mixes data and methods in context
- Harder to type

```typescript
services: {
    myService: async (context, event) => {
        const response = await context.routedSend('Target', 'EVENT');
    }
}
```

### Option C: Via Machine Reference
**Pros**:
- Most explicit
- Clear ownership

**Cons**:
- Verbose
- Requires machine reference

```typescript
services: {
    myService: async (context, event, meta) => {
        const response = await meta.machine.router.send('Target', 'EVENT');
    }
}
```

**Recommendation**: Use Option A (meta parameter) for clarity and TypeScript support.

---

## 🧪 Testing Strategy

### Unit Tests
1. Test MachineRouter registration and resolution
2. Test routed send with existing machines
3. Test routed send with missing machines (error handling)
4. Test hierarchical path resolution (Parent.Child)
5. Test relative path resolution:
   - Current machine (`.`)
   - Parent machine (`..`)
   - Sub-machine (`./SubMachine`)
   - Sibling machine (`../Sibling`)
   - Complex paths (`../../Grandparent`, `../Sibling/Child`)
6. Test error cases:
   - `..` with no parent
   - `../` with invalid sibling name
   - Mixed valid/invalid path segments

### Integration Tests
1. Create two ViewStateMachines with router
2. Send events between them via services (absolute paths)
3. Create hierarchical machine structure (parent with sub-machines)
4. Test relative path routing between machines
5. Verify state transitions occur correctly
6. Test error propagation
7. Test mixing absolute and relative paths

### Wave Reader Tests
1. Test AppMachine → BackgroundProxyMachine communication (absolute)
2. Test relative path routing in nested machines
3. Verify state synchronization
4. Test graceful fallback when proxy not available
5. Test complex scenarios:
   - TabMachine sending to SettingsMachine via `../SettingsMachine`
   - Deep nesting with multiple `..` references
   - Self-send with `.` for internal events

---

## 📝 Type Definitions

### Core Types (log-view-machine)
```typescript
// Router interface
export interface MachineRouter {
    register(name: string, machine: any): void;
    resolve(name: string): any | null;
    resolveHierarchical(path: string): any | null;
    send(target: string, event: string, payload?: any): Promise<any>;
}

// Routed send function type
export type RoutedSend = (
    target: string,
    event: string,
    payload?: any
) => Promise<any>;

// Service meta parameter
export interface ServiceMeta {
    routedSend?: RoutedSend;
    machineId: string;
    router?: MachineRouter;
    machine?: any;  // Reference to current machine for relative routing
}

// Service function signature
export type ServiceFunction<TContext = any, TEvent = any> = (
    context: TContext,
    event: TEvent,
    meta: ServiceMeta
) => Promise<any>;
```

---

## 🔄 Migration Path

### Step 1: Add Support (Backward Compatible)
- Add router support to ViewStateMachine
- Make it optional
- Existing code continues to work

### Step 2: Update Wave Reader
- Update AppTome to use new pattern
- Update app-machine services
- Test thoroughly

### Step 3: Document Pattern
- Update log-view-machine README
- Add examples to documentation
- Create migration guide

### Step 4: Deprecate Old Pattern (Optional)
- Mark manual routedSend passing as deprecated
- Provide migration warning in logs
- Remove in future major version

---

## ✅ Acceptance Criteria

### Must Have
- [ ] MachineRouter implemented in TomeBase
- [ ] ViewStateMachine supports router injection
- [ ] Services receive meta with routedSend
- [ ] Wave Reader refactored to use new pattern
- [ ] All existing tests pass
- [ ] New tests for router functionality

### Should Have
- [ ] TypeScript types properly exported
- [ ] Documentation updated
- [ ] Example code in docs
- [ ] Migration guide for existing users

### Nice to Have
- [x] Hierarchical path resolution (Parent.Child)
- [x] Relative path resolution (., .., ./, ../)
- [ ] Router middleware support
- [ ] Event logging/debugging
- [ ] Performance metrics

---

## 🎯 Success Metrics

1. **Code Quality**: No TypeScript errors, clean API
2. **Performance**: Negligible overhead vs manual approach
3. **Developer Experience**: Easier to use than manual routing
4. **Test Coverage**: >90% coverage for router code
5. **Documentation**: Clear examples and migration guide

---

## 🚧 Potential Challenges

### Challenge 1: XState Service Wrapping
**Issue**: XState may not support third parameter to services
**Solution**: Use service factories or wrapper pattern

### Challenge 2: TypeScript Inference
**Issue**: TypeScript may struggle with generic service types
**Solution**: Explicit type parameters and helper functions

### Challenge 3: Backward Compatibility
**Issue**: Breaking changes for existing users
**Solution**: Make router optional, deprecate slowly

### Challenge 4: Circular Dependencies
**Issue**: Machines referencing each other
**Solution**: Lazy resolution, registration phase separation

---

## 📚 References

- XState Documentation: https://xstate.js.org/docs/guides/services.html
- Current TomeBase Implementation: `log-view-machine/src/core/TomeBase.ts`
- Current ViewStateMachine: `log-view-machine/src/core/ViewStateMachine.tsx`
- Wave Reader AppTome: `wave-reader/src/app/tomes/AppTome.tsx`

---

## 🗓️ Timeline Estimate

- **Phase 1** (Core Infrastructure): 5-7 hours
  - Base router: 2-3 hours
  - Relative path resolution: 2-3 hours
  - Service wrapping: 1 hour
- **Phase 2** (TomeBase Integration): 2-3 hours  
- **Phase 3** (Wave Reader Updates): 1-2 hours
- **Testing & Documentation**: 3-4 hours
  - Unit tests: 1-2 hours
  - Integration tests: 1 hour
  - Documentation: 1 hour
- **Total**: 11-16 hours (1.5-2 days)

**Note**: Relative path routing adds ~2 hours to implementation and ~1 hour to testing

---

## 🎉 Expected Benefits

### Core Benefits
1. **Cleaner Code**: No more manual routedSend creation
2. **Better Types**: Native TypeScript support
3. **Easier Testing**: Mock router easily
4. **Scalability**: Foundation for complex routing patterns
5. **Maintainability**: Centralized routing logic
6. **Reusability**: Pattern works across all projects using log-view-machine

### Relative Path Routing Benefits
7. **Location Independence**: Machines can be moved in hierarchy without changing their internal routing logic
8. **Encapsulation**: Sub-machines don't need to know about the global machine registry
9. **Intuitive Navigation**: Filesystem-like paths are familiar to developers
10. **Reduced Coupling**: Machines reference neighbors relatively, not by absolute names
11. **Refactoring Safety**: Rename parent machines without breaking child references
12. **Self-Documentation**: Paths show relationships (`.` = self, `..` = parent, etc.)

---

## 🏁 Next Steps

1. Review this plan with team/stakeholders
2. Create feature branch: `feature/native-routed-send`
3. Implement Phase 1 (Core Infrastructure)
4. Write tests for Phase 1
5. Implement Phase 2 (TomeBase)
6. Update Wave Reader (Phase 3)
7. Documentation and examples
8. Code review and merge

---

**Plan Status**: ✅ Ready for Implementation  
**Priority**: High (enables cleaner machine communication patterns)  
**Risk Level**: Medium (requires changes to core library)  
**Impact**: High (benefits all future Tome-based applications)

