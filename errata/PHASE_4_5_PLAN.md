# Phase 4 & 5: Service Refactoring & Testing Plan

**Date**: Current Session  
**Cross-Reference**: 
- Original Component Middleware Refactor Plan
- MODDING_PLATFORM_IMPLEMENTATION_STATUS.md (log-view-machine)
- ROUTED_SEND_INTEGRATION_PLAN.md (wave-reader)

---

## Phase 0: Fix Existing Errors & Settings Component Swap (30-45 min)

### 0.1 Fix EditorWrapper Import Error
**File**: `wave-reader/src/app/components/EditorWrapper.tsx`

**Issue**: Line 2 has incorrect import path for GenericEditor
```typescript
// Current (broken)
import GenericEditor from 'log-view-machine/src/components/GenericEditor';
```

**Solution**: GenericEditor is not exported from main index. Need to:
1. Check if direct path import works with TypeScript/package setup
2. If not, create a workaround (local wrapper or different import strategy)

**Action**: Fix import to resolve the module error

### 0.2 Swap Settings Component
**Files**: 
- `wave-reader/src/components/settings.tsx` (bridge component)
- `wave-reader/src/components/App.tsx` (usage)

**Current State**:
- `settings.tsx` is a bridge that wraps SettingsTomes but doesn't pass props
- SettingsTomes accepts: `initialSettings`, `domainPaths`, `currentDomain`, `currentPath`, `onUpdateSettings`, `onDomainPathChange`, `className`
- Old Settings component expects: `initialSettings`, `onUpdateSettings`, `domain`, `path`, `onDomainPathChange`, `settingsService`

**Task**: 
1. Update `settings.tsx` to properly map props from old interface to SettingsTomes
2. Map `domain`/`path` → `currentDomain`/`currentPath`
3. Remove `settingsService` dependency (SettingsTomes handles internally via SettingsMessageHandler)
4. Ensure `onUpdateSettings` passes Settings type correctly (not Options)
5. Verify SettingsTomes can handle all required functionality

**Steps**:
1. Update `settings.tsx` to map props correctly
2. Check if App.tsx should use Settings wrapper or SettingsTomes directly
3. Test that all settings functionality works

**Validation**:
- [ ] EditorWrapper import error fixed
- [ ] Settings component props mapped correctly
- [ ] Settings functionality preserved
- [ ] No breaking changes to existing Settings usage

---

## Phase 2 (Continued): Remaining Component Refactors (5-7 hours)

### Status: 2 of 8 Components Complete
✅ **Completed**: 
- `about/AboutTome.tsx` - EditorWrapper integrated, router registered
- `settings/SettingsTomes.tsx` - EditorWrapper integrated, router ready

⏳ **Remaining** (6 components):
1. `wave-tabs/WaveTabsTomes.tsx`
2. `go-button/GoButtonTomes.tsx`
3. `selector-input/SelectorInputTomes.tsx`
4. `selector-hierarchy/SelectorHierarchyTomes.tsx`
5. `scan-for-input/ScanForInputTomes.tsx`
6. `error-boundary/ErrorBoundaryTomes.tsx`

### Common Refactoring Pattern (Established)

Each component follows this pattern:

1. **Import EditorWrapper and dependencies**
   ```typescript
   import EditorWrapper from '../../app/components/EditorWrapper';
   import { MachineRouter } from 'log-view-machine';
   import { AppTome } from '../../app/tomes/AppTome';
   ```

2. **Add router state**
   ```typescript
   const [router, setRouter] = useState<MachineRouter | null>(null);
   ```

3. **Initialize router in useEffect**
   ```typescript
   useEffect(() => {
     const appTomeRouter = AppTome.getRouter();
     setRouter(appTomeRouter);
     // Register machine if using ViewStateMachine
   }, []);
   ```

4. **Wrap return statement(s) with EditorWrapper**
   ```tsx
   return (
     <EditorWrapper
       title="Component Name"
       description="Component description"
       componentId="component-name"
       useTomeArchitecture={true}
       router={router || undefined}
       onError={(error) => console.error('Component Error:', error)}
     >
       {/* Existing component JSX */}
     </EditorWrapper>
   );
   ```

5. **Register machines with router** (if using ViewStateMachine)
   ```typescript
   if (machine && appTomeRouter && machine.setRouter) {
     machine.setRouter(appTomeRouter);
     appTomeRouter.register('ComponentMachine', machine);
     
     // Cleanup
     return () => {
       appTomeRouter.unregister('ComponentMachine');
     };
   }
   ```

### Component-Specific Refactoring Details

#### 2.1 WaveTabsTomes.tsx (1-1.5 hours)

**File**: `wave-reader/src/component-middleware/wave-tabs/WaveTabsTomes.tsx`

**Component Type**: React Functional Component with state management (no ViewStateMachine)

**Current Structure**:
- Uses React hooks (useState, useEffect)
- Has Chrome extension message handler
- No machine instance to register

**Refactoring Steps**:

1. **Add imports** (after line 2):
   ```typescript
   import { MachineRouter } from 'log-view-machine';
   import EditorWrapper from '../../app/components/EditorWrapper';
   import { AppTome } from '../../app/tomes/AppTome';
   ```

2. **Add router state** (after line 357):
   ```typescript
   const [router, setRouter] = useState<MachineRouter | null>(null);
   ```

3. **Initialize router** (in initializeComponent, after line 366):
   ```typescript
   // Get router from AppTome
   const appTomeRouter = AppTome.getRouter();
   setRouter(appTomeRouter);
   ```

4. **Find main return statement** (around line 805 based on SettingsTomes pattern):
   - Wrap entire return with EditorWrapper
   - Handle any conditional returns (similar to SettingsTomes pattern)

5. **EditorWrapper props**:
   ```tsx
   <EditorWrapper
     title="Wave Tabs"
     description="Tabbed interface for managing multiple views and content"
     componentId="wave-tabs-component"
     useTomeArchitecture={true}
     router={router || undefined}
     onError={(error) => console.error('WaveTabs Editor Error:', error)}
   >
   ```

**Special Considerations**:
- No machine to register (uses React state only)
- May have multiple return paths (check for conditional returns)
- Verify Chrome storage integration still works

**Validation**:
- [ ] EditorWrapper renders correctly
- [ ] Router available
- [ ] Tabs functionality preserved
- [ ] Chrome extension features work

---

#### 2.2 GoButtonTomes.tsx (45 min - 1 hour)

**File**: `wave-reader/src/component-middleware/go-button/GoButtonTomes.tsx`

**Component Type**: ViewStateMachine with logStates pattern

**Current Structure**:
- Uses `createViewStateMachine` with `logStates` configuration
- Exported via `createComponentTomeWithMetadata`
- Multiple states: idle, going, stopping, loading, auto-stop, wave-animation, disabled, error

**Refactoring Steps**:

1. **Add imports** (after line 2):
   ```typescript
   import { MachineRouter } from 'log-view-machine';
   import EditorWrapper from '../../app/components/EditorWrapper';
   import { AppTome } from '../../app/tomes/AppTome';
   ```

2. **Wrap the exported component** (around line 222-299):
   - The component is exported via `createComponentTomeWithMetadata`
   - Need to create a wrapper React component that:
     - Gets router from AppTome
     - Registers the machine with router
     - Wraps machine render with EditorWrapper

3. **Create wrapper component** (after line 299):
   ```typescript
   const GoButtonTomeWrapper: FunctionComponent<any> = (props) => {
     const [router, setRouter] = useState<MachineRouter | null>(null);
     const [machine, setMachine] = useState<any>(null);
     
     useEffect(() => {
       const appTomeRouter = AppTome.getRouter();
       setRouter(appTomeRouter);
       
       // Get machine from GoButtonTomes
       const goButtonMachine = GoButtonTomes.machine || GoButtonTomes; // Adjust based on actual export
       
       if (appTomeRouter && goButtonMachine && goButtonMachine.setRouter) {
         goButtonMachine.setRouter(appTomeRouter);
         appTomeRouter.register('GoButtonMachine', goButtonMachine);
       }
       
       setMachine(goButtonMachine);
       
       return () => {
         if (appTomeRouter && goButtonMachine) {
           appTomeRouter.unregister('GoButtonMachine');
         }
       };
     }, []);
     
     if (!machine) {
       return (
         <EditorWrapper
           title="Go Button"
           description="Button component for starting wave animations"
           componentId="go-button-component"
           useTomeArchitecture={true}
           router={router || undefined}
           onError={(error) => console.error('GoButton Editor Error:', error)}
         >
           <div>Loading...</div>
         </EditorWrapper>
       );
     }
     
     return (
       <EditorWrapper
         title="Go Button"
         description="Button component for starting wave animations"
         componentId="go-button-component"
         useTomeArchitecture={true}
         router={router || undefined}
         onError={(error) => console.error('GoButton Editor Error:', error)}
       >
         {machine.render ? machine.render() : <GoButtonTomes {...props} />}
       </EditorWrapper>
     );
   };
   
   export default GoButtonTomeWrapper;
   ```

**Special Considerations**:
- Component exported via metadata factory - may need different wrapping approach
- Check if machine is accessible after export
- May need to refactor export pattern to expose machine instance

**Validation**:
- [ ] EditorWrapper renders correctly
- [ ] Machine registered with router
- [ ] Button states work correctly
- [ ] Wave animation triggers properly

---

#### 2.3 SelectorInputTomes.tsx (45 min - 1 hour)

**File**: `wave-reader/src/component-middleware/selector-input/SelectorInputTomes.tsx`

**Component Type**: React Functional Component (likely similar to SettingsTomes)

**Current Structure**:
- Uses styled-components
- Has simple message handler
- React state management

**Refactoring Steps**:

1. **Add imports** (after line 2):
   ```typescript
   import { MachineRouter } from 'log-view-machine';
   import EditorWrapper from '../../app/components/EditorWrapper';
   import { AppTome } from '../../app/tomes/AppTome';
   ```

2. **Find component definition** (search for `FunctionComponent` or `export default`)
   - Add router state
   - Initialize router in useEffect
   - Wrap return with EditorWrapper

3. **EditorWrapper props**:
   ```tsx
   <EditorWrapper
     title="Selector Input"
     description="Input field for CSS selector specification"
     componentId="selector-input-component"
     useTomeArchitecture={true}
     router={router || undefined}
     onError={(error) => console.error('SelectorInput Editor Error:', error)}
   >
   ```

**Special Considerations**:
- Likely simple component with single return
- Verify selector input functionality preserved
- Check if it needs to communicate with other machines

**Validation**:
- [ ] EditorWrapper renders correctly
- [ ] Input field works
- [ ] Selector validation works
- [ ] Router available if needed

---

#### 2.4 SelectorHierarchyTomes.tsx (1-1.5 hours)

**File**: `wave-reader/src/component-middleware/selector-hierarchy/SelectorHierarchyTomes.tsx`

**Component Type**: Unknown - need to check structure

**Refactoring Steps** (standard pattern):

1. **Analyze component structure**:
   - Check if uses ViewStateMachine
   - Check if uses React state
   - Identify return statement(s)

2. **Apply standard refactoring pattern**:
   - Add imports
   - Add router state
   - Initialize router
   - Wrap with EditorWrapper
   - Register machine if applicable

3. **EditorWrapper props**:
   ```tsx
   <EditorWrapper
     title="Selector Hierarchy"
     description="Hierarchical view of CSS selectors and their relationships"
     componentId="selector-hierarchy-component"
     useTomeArchitecture={true}
     router={router || undefined}
     onError={(error) => console.error('SelectorHierarchy Editor Error:', error)}
   >
   ```

**Special Considerations**:
- Hierarchy components may have complex state
- May need to preserve tree structure
- Verify hierarchy rendering works

**Validation**:
- [ ] EditorWrapper renders correctly
- [ ] Hierarchy tree displays correctly
- [ ] Selection/interaction works
- [ ] Router available if needed

---

#### 2.5 ScanForInputTomes.tsx (45 min - 1 hour)

**File**: `wave-reader/src/component-middleware/scan-for-input/ScanForInputTomes.tsx`

**Component Type**: Unknown - need to check structure

**Refactoring Steps** (standard pattern):

1. **Analyze component structure**
2. **Apply standard refactoring pattern**
3. **EditorWrapper props**:
   ```tsx
   <EditorWrapper
     title="Scan for Input"
     description="Keyboard shortcut scanner and input detection"
     componentId="scan-for-input-component"
     useTomeArchitecture={true}
     router={router || undefined}
     onError={(error) => console.error('ScanForInput Editor Error:', error)}
   >
   ```

**Special Considerations**:
- Keyboard scanning requires careful handling
- May need to preserve keyboard event listeners
- Verify scan functionality works after wrapping

**Validation**:
- [ ] EditorWrapper renders correctly
- [ ] Keyboard scanning works
- [ ] Input detection works
- [ ] Router available if needed

---

#### 2.6 ErrorBoundaryTomes.tsx (1 hour)

**File**: `wave-reader/src/component-middleware/error-boundary/ErrorBoundaryTomes.tsx`

**Component Type**: React Class Component with ErrorBoundary pattern

**Current Structure**:
- Class component extending React.Component
- Uses ErrorBoundaryComponentTemplate (ViewStateMachine)
- Already has error handling built-in

**Refactoring Steps**:

1. **Add imports** (after line 8):
   ```typescript
   import { MachineRouter } from 'log-view-machine';
   import EditorWrapper from '../../app/components/EditorWrapper';
   import { AppTome } from '../../app/tomes/AppTome';
   ```

2. **Modify render method** (around line 169-298):
   - Wrap the return with EditorWrapper
   - Get router from AppTome (may need to convert to hooks or use instance method)

3. **Handle router in class component**:
   ```typescript
   // Add property
   private router: MachineRouter | null = null;
   
   // Initialize in componentDidMount or constructor
   componentDidMount() {
     this.router = AppTome.getRouter();
     
     // Register template machine if accessible
     if (this.template && this.router) {
       if (this.template.setRouter) {
         this.template.setRouter(this.router);
       }
       this.router.register(`ErrorBoundary-${this.errorBoundaryId}`, this.template);
     }
   }
   
   componentWillUnmount() {
     if (this.router && this.template) {
       this.router.unregister(`ErrorBoundary-${this.errorBoundaryId}`);
     }
   }
   ```

4. **Wrap render return**:
   ```tsx
   render() {
     if (this.state.hasError) {
       return (
         <EditorWrapper
           title="Error Boundary"
           description="Error handling and boundary management"
           componentId={`error-boundary-${this.errorBoundaryId}`}
           useTomeArchitecture={true}
           router={this.router || undefined}
           onError={(error) => {
             this.props.onError?.(error, this.state.errorInfo || {} as ErrorInfo);
           }}
         >
           {/* Existing error UI */}
         </EditorWrapper>
       );
     }
     
     return (
       <EditorWrapper
         title="Error Boundary"
         description="Error handling and boundary management"
         componentId={`error-boundary-${this.errorBoundaryId}`}
         useTomeArchitecture={true}
         router={this.router || undefined}
         onError={(error) => {
           this.props.onError?.(error, this.state.errorInfo || {} as ErrorInfo);
         }}
       >
         {this.props.children}
       </EditorWrapper>
     );
   }
   ```

**Special Considerations**:
- Class component - router handling different from functional components
- Error boundary catches errors - ensure EditorWrapper doesn't interfere
- Template machine needs registration
- May need to test error catching still works

**Validation**:
- [ ] EditorWrapper renders correctly
- [ ] Error boundary still catches errors
- [ ] Error UI displays correctly
- [ ] Template machine registered
- [ ] Router available

---

### Phase 2 (Continued) Validation Checklist

For each component:

- [ ] Imports added (EditorWrapper, MachineRouter, AppTome)
- [ ] Router state added and initialized
- [ ] Component wrapped with EditorWrapper
- [ ] useTomeArchitecture={true} set
- [ ] Router prop passed
- [ ] Machine registered with router (if applicable)
- [ ] Cleanup/unregister on unmount (if applicable)
- [ ] Component functionality preserved
- [ ] No breaking changes
- [ ] EditorWrapper renders correctly in browser
- [ ] Router accessible in component

### Estimated Time per Component

- WaveTabsTomes: 1-1.5 hours (multiple return paths)
- GoButtonTomes: 45 min - 1 hour (export pattern complexity)
- SelectorInputTomes: 45 min - 1 hour (straightforward)
- SelectorHierarchyTomes: 1-1.5 hours (complexity TBD)
- ScanForInputTomes: 45 min - 1 hour (straightforward)
- ErrorBoundaryTomes: 1 hour (class component)

**Total Phase 2 (Continued)**: 5-7 hours

---

## Phase 4: Service Refactoring - Routed Send Migration (4-6 hours)

### 4.1 Analysis: Current Service Patterns

**Cross-Reference**: Modding Platform Phase 2 (Wave Reader Editor Refactor) mentions service refactoring as part of making components mod-compatible.

**Current Issues Found**:
1. **Direct machine access in templates** (2 occurrences):
   - `about/templates/about-page-component/index.js:51` - Uses `machine.parentMachine.getSubMachine('donation-page-machine')`
   - `about/robotcopy-pact-config.js:126` - Uses `machine.parentMachine.getSubMachine('about-page-machine')`

2. **withState handlers pattern** (in AboutTome.tsx):
   - Handlers receive `{context, event, send, log, transition, machine, view, graphql}` 
   - No `meta` parameter available
   - Need to add meta support or convert to services

3. **XState actions in robotcopy-pact-config.js**:
   - Actions receive `{context, event, send, log, transition, machine}`
   - No meta parameter available
   - Need migration strategy

**Key Insight**: Services (invoke services in XState) automatically receive `meta` as third parameter, but `withState` handlers and XState actions do not.

### 4.2 Strategy: Two-Path Migration

#### Path A: Update withState Handlers to Include Meta (Preferred)
**Files**: Component tome files using withState pattern
- `about/AboutTome.tsx` - 4 withState handlers
- Check other components for withState usage

**Implementation**:
- Modify ViewStateMachine.withState() to include meta in handler signature
- Update handlers to use `meta.routedSend` instead of direct machine access

```typescript
// Before
.withState('loading', async ({ context, event, send, log, machine, view }: any) => {
  machine.parentMachine.getSubMachine('other').send('EVENT');
});

// After  
.withState('loading', async ({ context, event, send, log, machine, view, meta }: any) => {
  if (meta?.routedSend) {
    await meta.routedSend('OtherMachine', 'EVENT');
  }
});
```

**Required Changes**:
1. Update `ViewStateMachine.withState()` method in `log-view-machine/src/core/ViewStateMachine.tsx`
2. Update all withState handlers in component-middleware components
3. Ensure backward compatibility (meta optional)

#### Path B: Convert Actions to Services (For Templates)
**Files**: Template files with action-based patterns
- `about/templates/about-page-component/index.js`
- `about/robotcopy-pact-config.js`

**Implementation**:
- Convert XState actions to invoke services where possible
- Services automatically receive meta parameter

```typescript
// Before (action)
actions: {
  initialize: async (context, event, send, log, transition, machine) => {
    machine.parentMachine.getSubMachine('donation-page-machine').send('CHECK_STATUS');
  }
}

// After (service)
services: {
  initializeService: async (context, event, meta) => {
    if (meta.routedSend) {
      await meta.routedSend('DonationPageMachine', 'CHECK_STATUS');
    }
  }
}
```

**Alternative for Actions**: If actions must remain as actions (XState requirement):
- Access router from machine: `machine.router.send(target, event, payload)`
- Ensure machine has router set via `machine.setRouter(router)`

### 4.3 Migration Steps

#### Step 4.3.1: Extend withState to Support Meta (1-2 hours)
**File**: `log-view-machine/src/core/ViewStateMachine.tsx`

**Changes**:
- Modify `withState()` method to pass meta to handlers
- Add meta to handler signature (make optional for backward compatibility)
- Ensure meta includes routedSend, router, machine reference

**Code Pattern**:
```typescript
withState(stateName: string, handler: (context: StateContext & { meta?: ServiceMeta }) => any) {
  // Create meta object
  const meta: ServiceMeta = {
    routedSend: this.routedSend,
    machineId: this.machineId,
    router: this.router,
    machine: this
  };
  
  // Call handler with meta
  return handler({ ...stateContext, meta });
}
```

**Testing**:
- Verify existing withState handlers still work (backward compatible)
- Test meta availability in new handlers
- Verify routedSend works in handlers

#### Step 4.3.2: Update AboutTome withState Handlers (1 hour)
**File**: `wave-reader/src/component-middleware/about/AboutTome.tsx`

**Specific Changes**:
1. Add `meta` parameter to all 4 withState handlers
2. Replace any direct machine access with `meta.routedSend`
3. Use relative paths where appropriate

**Handler Updates**:
- `withState('idle', ...)` - Add meta, check for any direct machine calls
- `withState('loading', ...)` - Add meta, verify GraphQL still works
- `withState('error', ...)` - Add meta (may not need routed send)
- `withState('reporting', ...)` - Add meta, check for machine access

**Pattern**:
```typescript
.withState('loading', async ({ context, event, send, log, machine, view, graphql, meta }: any) => {
  // Check if we need to communicate with other machines
  // If yes, use meta.routedSend instead of direct access
  if (meta?.routedSend) {
    // Example: await meta.routedSend('DonationPageMachine', 'CHECK_STATUS');
  }
  
  // Existing GraphQL code remains unchanged
  const result = await graphql.query(DONATION_STATUS_QUERY, {...});
  // ...
});
```

#### Step 4.3.3: Update Template Actions (1-2 hours)
**Files**: 
- `about/templates/about-page-component/index.js`
- `about/robotcopy-pact-config.js`

**Option 1: Convert to Services** (Preferred if possible):
- Convert XState actions to invoke services
- Services receive meta automatically

**Option 2: Use Router from Machine** (If actions must remain):
- Access router: `machine.router.send(target, event, payload)`
- Ensure router is set on machine instance

**Specific Changes**:

**File**: `about/templates/about-page-component/index.js` (Line 51)
```javascript
// Before
actions: {
  initialize: async (context, event, send, log, transition, machine) => {
    machine.parentMachine.getSubMachine('donation-page-machine').send('CHECK_STATUS');
  }
}

// After (Option 1 - Service)
services: {
  initializeService: async (context, event, meta) => {
    if (meta?.routedSend) {
      await meta.routedSend('DonationPageMachine', 'CHECK_STATUS');
    }
  }
}

// After (Option 2 - Router)
actions: {
  initialize: async (context, event, send, log, transition, machine) => {
    if (machine.router) {
      await machine.router.send('DonationPageMachine', 'CHECK_STATUS', {});
    }
  }
}
```

**File**: `about/robotcopy-pact-config.js` (Line 126)
```javascript
// Before
donationStatusUpdated: {
  type: 'function',
  fn: ({context, event, send, log, transition, machine}: any) => {
    machine.parentMachine.getSubMachine('about-page-machine').send('DONATION_STATUS_UPDATED', {...});
  }
}

// After (Option 2 - Router, since it's in config)
donationStatusUpdated: {
  type: 'function',
  fn: ({context, event, send, log, transition, machine}: any) => {
    if (machine.router) {
      machine.router.send('AboutMachine', 'DONATION_STATUS_UPDATED', {
        donated: event.donated,
        hasEasterEggs: event.hasEasterEggs
      });
    }
  }
}
```

#### Step 4.3.4: Register Machines with Router (30 min)
**Files**: Component tome files

**Changes**:
- Ensure all machines created in components are registered with AppTome router
- Use consistent naming convention (e.g., 'AboutMachine', 'SettingsMachine')
- Document machine names for reference

**Naming Convention**:
- Component machines: `{ComponentName}Machine` (e.g., `AboutMachine`, `SettingsMachine`)
- Sub-machines: `{ParentMachine}.{SubMachine}` (e.g., `AppMachine.SettingsMachine`)

**Verification**:
- Check AboutTome: Machine registered as 'AboutMachine' ✅
- Check SettingsTomes: If using machine, register appropriately
- Document all registered machine names

### 4.4 Validation Checklist
- [ ] All direct `getSubMachine()` calls removed
- [ ] All `parentMachine.getSubMachine()` calls replaced
- [ ] Routed send used for all inter-machine communication
- [ ] Relative paths (`..`, `./`) work correctly
- [ ] Error handling for missing machines
- [ ] Router registration verified for all component machines
- [ ] Backward compatibility maintained for existing handlers

---

## Phase 5: Testing & Validation (3-4 hours)

### 5.1 Mod Compatibility Testing (1-1.5 hours)
**Cross-Reference**: Modding Platform Phase 1 (Linter Integration) ensures mods can be validated. EditorWrapper enables mod compatibility via GenericEditor.

#### 5.1.1 EditorWrapper Integration Tests
**Test Cases**:
1. **Component Wrapping**: Verify each component-middleware component renders inside EditorWrapper
2. **GenericEditor Features**: Test that mod compatibility features work:
   - Component editing interface appears when `useTomeArchitecture=true`
   - Review modal accessible
   - Linter integration works (references Phase 1.5 from mod plan)
3. **Error Handling**: Verify error boundary catches component errors
4. **Router Integration**: Confirm router prop is passed correctly

**Test Components**:
- AboutTome ✅ (already refactored)
- SettingsTomes ✅ (already refactored)
- WaveTabsTomes (when refactored)
- Remaining 5 components (when refactored)

**Manual Test Steps**:
1. Open each component in browser
2. Verify EditorWrapper renders with correct title/description
3. Toggle `useTomeArchitecture` prop
4. Verify GenericEditor UI appears when enabled
5. Test error boundary by introducing error in component
6. Verify router prop is logged/available

#### 5.1.2 Linter Integration Testing
**Cross-Reference**: MODDING_PLATFORM_IMPLEMENTATION_STATUS.md Phase 1.5 (Review Modal UI)

**Test Scenarios**:
1. **Linter Execution**:
   - Open component in GenericEditor (with useTomeArchitecture=true)
   - Click "Run Linter" or trigger linter automatically
   - Verify linter API call succeeds
   - Verify results displayed in review modal

2. **Lint Results Display**:
   - Test with component containing intentional errors (eval, chrome.*)
   - Verify errors shown with correct severity (red/yellow/blue)
   - Verify file:line:column format displayed
   - Test expandable details for each issue

3. **Submission Blocking**:
   - Create component with lint errors
   - Attempt to submit for review
   - Verify "Submit for Review" button disabled
   - Verify helpful error message shown

4. **Warning Handling**:
   - Create component with only warnings (no errors)
   - Attempt to submit
   - Verify confirmation dialog appears
   - Verify submission allowed after confirmation

**Test Files Needed**:
- Create test mod component with intentional errors:
  ```typescript
  // test-component-with-errors.tsx
  eval('dangerous code');
  chrome.runtime.sendMessage({...}); // Should be error
  setTimeout('string code', 100); // Should be warning
  ```

### 5.2 Routed Send Testing (1-1.5 hours)

#### 5.2.1 Inter-Machine Communication Tests
**Test Scenarios**:

1. **Absolute Path Routing**:
   ```typescript
   await meta.routedSend('BackgroundProxyMachine', 'START');
   ```
   **Test Steps**:
   - Set up test component with machine registered
   - Call routedSend with absolute path
   - Verify machine resolves correctly
   - Verify event delivered
   - Verify response received (if applicable)

2. **Relative Path Routing**:
   ```typescript
   await meta.routedSend('..', 'NOTIFY_PARENT');
   await meta.routedSend('../SettingsMachine', 'UPDATE');
   ```
   **Test Steps**:
   - Set up parent-child machine hierarchy
   - Test `..` resolves to parent
   - Test `../SiblingMachine` resolves to sibling
   - Test `./ChildMachine` resolves to child
   - Verify events delivered correctly

3. **Hierarchical Routing**:
   ```typescript
   await meta.routedSend('AppMachine.SettingsMachine', 'UPDATE');
   ```
   **Test Steps**:
   - Register machines with hierarchical names
   - Test dot-notation paths resolve
   - Test deep hierarchy (3+ levels)
   - Verify resolution performance

#### 5.2.2 Error Handling Tests
**Test Cases**:

1. **Missing Machine**: 
   ```typescript
   await meta.routedSend('NonExistentMachine', 'EVENT');
   ```
   - Should throw error with helpful message
   - Error should not crash component
   - Error should be logged appropriately

2. **Invalid Paths**:
   - Test `../../../../..` (too many levels up)
   - Test empty string `''`
   - Test invalid characters
   - Verify appropriate error handling

3. **Router Not Available**:
   - Test behavior when router not set on machine
   - Verify graceful degradation
   - Verify helpful error message

#### 5.2.3 Router Registration Tests
**Test Cases**:

1. **Machine Registration**: 
   - Component mounts → machine registers with router
   - Verify registration name matches expected
   - Component unmounts → machine unregisters
   - Router state remains consistent

2. **Registration Conflicts**:
   - Attempt to register machine with duplicate name
   - Verify error or overwrite behavior
   - Document expected behavior

3. **Router Access**:
   - Verify AppTome.getRouter() returns router
   - Test router available in all component contexts
   - Verify router persists across re-renders

### 5.3 Integration Testing (1 hour)

#### 5.3.1 Component Lifecycle Tests
**Test Cases**:

1. **Mount/Unmount**:
   - Component mounts → machine registers with router
   - Component unmounts → machine unregisters
   - Router state remains consistent
   - No memory leaks

2. **Re-render Handling**:
   - Component re-renders → router registration persists
   - No duplicate registrations
   - State preserved across re-renders

#### 5.3.2 App Context Integration
**Test Cases**:

1. **Router Availability**:
   - All components can access router via AppTome
   - Router initialized before components mount
   - Router persists throughout app lifecycle

2. **Cross-Component Communication**:
   - Settings component sends event to About component
   - Verify routed send works between components
   - Test bidirectional communication
   - Verify event delivery timing

#### 5.3.3 State Persistence Tests
**Test Cases**:

1. **Component State**:
   - Verify component state persists during navigation
   - Test state recovery after unmount/remount
   - Verify no state leakage between components

2. **Machine State**:
   - Machine context persists
   - State transitions work correctly
   - Events trigger correct state changes

### 5.4 End-to-End Scenario Tests (30 min)

#### 5.4.1 User Workflows
**Test Scenarios**:

1. **Component Editing Workflow** (Mod Compatibility):
   - User opens Settings component
   - EditorWrapper shows mod interface
   - User makes changes
   - Linter runs automatically
   - User reviews changes in modal
   - User submits for review
   - Verify submission blocked if errors exist

2. **Inter-Component Communication Workflow**:
   - User updates settings
   - Settings component sends event to BackgroundProxyMachine via routed send
   - Background updates applied
   - UI reflects changes
   - Verify no direct machine access used

3. **Error Recovery Workflow**:
   - Component throws error
   - Error boundary catches it
   - User sees error UI
   - User can retry or dismiss
   - Component recovers gracefully

### 5.5 Performance Testing (30 min)
**Test Cases**:

1. **Router Resolution Performance**:
   - Measure time to resolve machine paths
   - Test with deep hierarchies (5+ levels)
   - Verify no performance degradation
   - Target: < 1ms per resolution

2. **Multiple Component Rendering**:
   - Test app with all 8 components mounted
   - Verify no memory leaks
   - Test router performance with many registered machines
   - Monitor heap size over time

3. **Linter Performance** (Cross-Reference: Mod Plan):
   - Test linter runs in < 1 second for typical component
   - Verify caching works (per mod plan Phase 1.3)
   - Test with large component files (10k+ lines)
   - Verify cache hit rate > 80%

### 5.6 Documentation & Validation Checklist

#### Documentation Updates Needed:
- [ ] Update component-middleware README with router integration pattern
- [ ] Document machine naming conventions
- [ ] Create examples of routed send usage
- [ ] Document error handling patterns
- [ ] Update architecture diagrams with router integration

#### Final Validation Checklist:
- [ ] All components wrapped with EditorWrapper
- [ ] All direct machine access replaced with routed send
- [ ] Router integration verified for all components
- [ ] Mod compatibility features working (linting, review)
- [ ] Error handling robust
- [ ] Performance acceptable (< 1ms router resolution, < 1s linter)
- [ ] No memory leaks detected
- [ ] Documentation complete
- [ ] All tests passing

### 5.7 Cross-Reference with Modding Platform Plan

**Alignment with MODDING_PLATFORM_IMPLEMENTATION_STATUS.md**:

1. **Phase 1 (Linter Integration)**: 
   - Our EditorWrapper uses GenericEditor which integrates with linter
   - Testing validates linter runs on component code
   - Review modal testing validates Phase 1.5 requirements
   - Performance testing validates caching (Phase 1.3)

2. **Phase 2 (Wave Reader Editor Refactor)**:
   - Our Phase 4 (Service Refactoring) aligns with making components mod-compatible
   - Router integration supports the refactored architecture
   - Service patterns match refactor goals

3. **Phase 4 (Legacy Code Cleanup)**:
   - Our service refactoring removes legacy direct machine access patterns
   - Aligns with cleanup goals
   - Documentation helps prevent future legacy patterns

4. **Future Phases (Marketplace, OAuth)**:
   - Mod-compatible components (via EditorWrapper) ready for marketplace submission
   - Testing ensures components meet submission requirements
   - Linter integration ensures security requirements met

### 5.8 Test Execution Plan

#### Priority 1: Critical Path Tests
1. EditorWrapper renders correctly
2. Routed send works between machines
3. Router registration/unregistration
4. Linter integration in GenericEditor

#### Priority 2: Integration Tests
1. Cross-component communication
2. Error handling and recovery
3. State persistence

#### Priority 3: Performance Tests
1. Router resolution speed
2. Linter performance
3. Memory leak detection

---

## Estimated Time Summary

- **Phase 4**: 4-6 hours
  - Step 4.3.1: 1-2 hours (withState meta support)
  - Step 4.3.2: 1 hour (AboutTome handlers)
  - Step 4.3.3: 1-2 hours (Template actions)
  - Step 4.3.4: 30 min (Router registration)
  - Validation: 30 min

- **Phase 5**: 3-4 hours
  - Mod Compatibility Testing: 1-1.5 hours
  - Routed Send Testing: 1-1.5 hours
  - Integration Testing: 1 hour
  - End-to-End Tests: 30 min
  - Performance Testing: 30 min

**Total Phases 4 & 5**: 7-10 hours

---

## Dependencies

### Required Before Phase 4:
- ✅ Phase 1: EditorWrapper enhanced
- ✅ Phase 2: Components refactored (at least AboutTome and SettingsTomes)
- ✅ Phase 3: Router integration in AppTome

### Required Before Phase 5:
- ✅ Phase 4: Service refactoring complete
- ⚠️ All 8 components refactored (can test incrementally)

---

## Risk Mitigation

1. **Backward Compatibility**: Make meta optional in withState handlers
2. **Template Actions**: Have fallback strategy if conversion fails
3. **Performance**: Monitor router resolution time, optimize if needed
4. **Testing Coverage**: Prioritize critical paths, add edge cases incrementally

