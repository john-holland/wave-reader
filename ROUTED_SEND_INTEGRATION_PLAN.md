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
    this.router = config.router;
    
    // Create routed send function if router provided
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
                routedSend: this.routedSend,
                machineId: this.machineId,
                router: this.router
            };
            
            // Call original service with meta
            return (serviceImpl as Function)(context, event, meta);
        };
    }
    
    return wrappedServices;
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
4. Test hierarchical path resolution

### Integration Tests
1. Create two ViewStateMachines with router
2. Send events between them via services
3. Verify state transitions occur correctly
4. Test error propagation

### Wave Reader Tests
1. Test AppMachine → BackgroundProxyMachine communication
2. Verify state synchronization
3. Test graceful fallback when proxy not available

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
- [ ] Hierarchical path resolution (Parent.Child)
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

- **Phase 1** (Core Infrastructure): 4-6 hours
- **Phase 2** (TomeBase Integration): 2-3 hours  
- **Phase 3** (Wave Reader Updates): 1-2 hours
- **Testing & Documentation**: 2-3 hours
- **Total**: 9-14 hours (1.5-2 days)

---

## 🎉 Expected Benefits

1. **Cleaner Code**: No more manual routedSend creation
2. **Better Types**: Native TypeScript support
3. **Easier Testing**: Mock router easily
4. **Scalability**: Foundation for complex routing patterns
5. **Maintainability**: Centralized routing logic
6. **Reusability**: Pattern works across all projects using log-view-machine

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

