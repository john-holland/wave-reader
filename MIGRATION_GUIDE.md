# Migration Guide: From Old app.tsx to New Tome Architecture

## Quick Start

### Option 1: Use the Refactored Version (Recommended for Testing)

The refactored app is already available in `src/app-refactored.tsx`:

```typescript
// src/app-refactored.tsx already imports the new architecture
import AppComponent from './app/components/App';
export default AppComponent;
```

To use it in your build, update your webpack entry point to use `app-refactored.tsx` instead of `app.tsx`.

### Option 2: Test Side-by-Side

Keep both versions and switch between them:

```typescript
// Toggle between old and new
const USE_NEW_ARCHITECTURE = true;

import OldApp from './app';
import NewApp from './app-refactored';

export default USE_NEW_ARCHITECTURE ? NewApp : OldApp;
```

## Migration Steps

### Step 1: Verify Dependencies

Ensure these are installed:
```bash
npm install
# or
yarn install
```

Required packages:
- `log-view-machine`
- `xstate`
- `react`
- `styled-components`

### Step 2: Update Webpack Configuration

Update `webpack.common.js` or your entry point configuration:

```javascript
// Before
entry: './src/app.tsx'

// After (for testing)
entry: './src/app-refactored.tsx'
```

### Step 3: Build and Test

```bash
# Build the project
npm run build

# or for development
npm run develop
```

### Step 4: Test in Chrome Extension

1. Load the extension in Chrome
2. Open the popup
3. Verify all functionality:
   - [ ] Initialization works
   - [ ] UI renders correctly
   - [ ] Start/stop/toggle buttons work
   - [ ] Settings can be accessed
   - [ ] Tab navigation works
   - [ ] State persists correctly
   - [ ] Chrome storage sync works

### Step 5: Verify Key Functionality

Test these critical features:

#### Initialization
- Extension popup opens
- Initial state loads from storage
- Background script communication works
- No console errors

#### Wave Control
- Start button starts wave
- Stop button stops wave
- Toggle button toggles correctly
- Keyboard shortcut works
- State persists across popup open/close

#### State Management
- Selector updates work
- Settings save correctly
- Tab navigation functions
- Collapse/expand works
- State syncs with content script

#### Error Handling
- Errors display properly
- Retry button works
- Reset button works
- No crashes on error

## Key Differences

### Old Architecture (app.tsx)

```typescript
// Monolithic component with everything mixed
const App = () => {
  const [state, setState] = useState(...);
  
  // Inline machine definitions
  const machine = createMachine({...});
  
  // Inline render logic
  return <div>...</div>;
};
```

### New Architecture (app/components/App.tsx)

```typescript
// Clean component using Tome
const App = () => {
  const [viewKey, setViewKey] = useState(AppTome.getViewKey());
  
  useEffect(() => {
    const unsubscribe = AppTome.observeViewKey(setViewKey);
    AppTome.initialize();
    return unsubscribe;
  }, []);
  
  return AppTome.render() || <div>Loading...</div>;
};
```

## Troubleshooting

### Issue: AppTome not found

**Solution**: Ensure the import path is correct:
```typescript
import { AppTome } from '../tomes/AppTome';
```

### Issue: Chrome API not available

**Solution**: The Background Proxy Machine handles this gracefully. Check console for warnings.

### Issue: State not persisting

**Solution**: Verify Chrome storage permissions in `manifest.json`:
```json
{
  "permissions": ["storage"]
}
```

### Issue: Views not updating

**Solution**: Ensure you're subscribed to view key changes:
```typescript
useEffect(() => {
  const unsubscribe = AppTome.observeViewKey(setCurrentViewKey);
  return unsubscribe;
}, []);
```

### Issue: Build errors

**Solution**: Check that all TypeScript paths are correct:
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "*": ["*"]
    }
  }
}
```

## Rollback Plan

If you need to rollback to the old architecture:

### Option 1: Quick Rollback (Webpack)

```javascript
// webpack.common.js
entry: './src/app.tsx'  // Use old version
```

### Option 2: Remove New Files

If needed, you can remove the new architecture:
```bash
rm -rf src/app/
```

The old `app.tsx` remains untouched.

## Feature Parity Checklist

Verify these features work identically:

- [ ] **Initialization**
  - [ ] Loads from Chrome storage
  - [ ] Syncs with content script
  - [ ] Syncs with background script
  
- [ ] **Wave Control**
  - [ ] Start button
  - [ ] Stop button
  - [ ] Toggle button
  - [ ] Keyboard shortcut
  
- [ ] **UI**
  - [ ] Tab navigation
  - [ ] Collapse/expand
  - [ ] Settings display
  - [ ] About display
  - [ ] Error display
  
- [ ] **State Management**
  - [ ] Selector updates
  - [ ] Settings save
  - [ ] State persistence
  - [ ] Chrome storage sync
  
- [ ] **Communication**
  - [ ] Background script messages
  - [ ] Content script messages
  - [ ] State refresh
  - [ ] Heartbeat sync

## Performance Comparison

### Expected Improvements

1. **Initial Render**: Similar or slightly faster
2. **State Updates**: Faster (observable pattern)
3. **Memory Usage**: Lower (better cleanup)
4. **Bundle Size**: Similar (modular tree-shaking possible)

### Monitoring

Add performance monitoring:

```typescript
// In development mode
if (process.env.NODE_ENV === 'development') {
  performance.mark('app-init-start');
  await AppTome.initialize();
  performance.mark('app-init-end');
  
  performance.measure('app-init', 'app-init-start', 'app-init-end');
  const measure = performance.getEntriesByName('app-init')[0];
  console.log(`AppTome initialization: ${measure.duration}ms`);
}
```

## Support

### Getting Help

1. **Check Documentation**
   - `src/app/README.md` - Architecture documentation
   - `APP_REFACTOR_SUMMARY.md` - Implementation summary
   - This file - Migration guide

2. **Debug Mode**
   Enable debug logging:
   ```typescript
   // In AppTome.ts
   const DEBUG = true;
   ```

3. **Console Logs**
   Look for these prefixes:
   - `🌊 AppTome:` - Tome operations
   - `🌊 App Machine:` - Machine state changes
   - `🌊 Background Proxy:` - Chrome API calls
   - `🌊 App Component:` - React component events

### Common Questions

**Q: Can I use parts of the new architecture with the old app.tsx?**
A: Yes, the base utilities (`ViewStack`, `TomeBase`) are standalone and can be used independently.

**Q: Do I need to migrate all at once?**
A: No, you can run the new architecture side-by-side and migrate gradually.

**Q: Will this break my Chrome extension?**
A: No, if configured correctly. The new architecture is designed to be a drop-in replacement.

**Q: What about my custom components?**
A: They should work as-is. The new architecture doesn't change how custom components are imported or used.

**Q: How do I add new features?**
A: Follow the patterns in `src/app/README.md`. Create machines for logic, tomes for presentation, and integrate with React components.

## Success Indicators

You'll know the migration is successful when:

✅ No console errors
✅ All buttons work as expected
✅ State persists correctly
✅ No performance degradation
✅ Chrome extension functions normally
✅ Tests pass (if you have them)

## Timeline

Recommended migration schedule:

1. **Week 1**: Test new architecture in development
2. **Week 2**: Run side-by-side comparison
3. **Week 3**: Beta test with limited users
4. **Week 4**: Full migration

## Conclusion

The new Tome architecture provides:
- Better code organization
- Improved maintainability
- Clearer separation of concerns
- Foundation for future enhancements

Migration is straightforward and can be done incrementally with minimal risk.

---

**Need Help?** Check the documentation or review the implementation in `src/app/`

**Report Issues:** Document any problems with the new architecture for quick resolution

**Good Luck!** 🚀

