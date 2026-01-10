# Wave Reader Extension - Permissions Justification

**Last Updated:** January 2025  
**Extension Version:** 1.0.4  
**Manifest Version:** 3

This document provides detailed justifications for each permission requested by the Wave Reader Chrome extension, explaining why each permission is necessary and how it's used in the codebase.

---

## Overview

Wave Reader is a browser extension that helps improve reading comprehension through animated text effects. To function properly, the extension requires specific permissions to interact with web pages, store user preferences, and manage content injection.

---

## Current Permissions

```json
{
  "permissions": [
    "storage",
    "tabs"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js", "shadowContent.js"],
      "run_at": "document_start",
      "all_frames": true,
      "world": "ISOLATED"
    }
  ]
}
```

---

## Permission Details

### 1. `"storage"` Permission

**Status:** ✅ **REQUIRED**  
**Chrome Web Store Review:** Low concern

#### Justification

The `storage` permission is essential for persisting user preferences and settings across browser sessions. Wave Reader needs to:

- Save user-configured animation settings (wave speed, translation amounts, rotation amounts)
- Store domain and path-specific settings (allowing different settings per website/path)
- Remember user preferences for keyboard shortcuts, selectors, and CSS templates
- Persist the settings registry that maps domains and paths to their respective configuration

#### Usage in Codebase

**Primary Usage Locations:**
- `src/services/settings.ts`
  - `getSyncObject()` - Retrieves settings from `chrome.storage.sync`
  - `setSyncObject()` - Saves settings to `chrome.storage.sync`
  - Used for `SettingsRegistryStorageKey` to maintain domain/path settings registry

- `src/component-middleware/settings/SettingsTomes.tsx`
  - Reads/writes settings from `chrome.storage.local` for UI state
  - Stores `waveReaderSettings`, `waveReaderDomainPaths`, `waveReaderCheckboxSettings`

**Storage Structure:**
- Uses `chrome.storage.sync` for settings that should sync across devices
- Uses `chrome.storage.local` for UI state and temporary data
- Data stored includes: wave settings, domain/path mappings, selector preferences

#### Data Privacy

- **No PII Collected:** Only stores user preferences (numerical values, selectors, CSS templates)
- **No Tracking Data:** No user behavior tracking or analytics data stored
- **User Control:** All data is user-generated configuration, not automatically collected

**Recommendation:** ✅ **Keep** - Core functionality requires persistent storage

---

### 2. `"tabs"` Permission

**Status:** ✅ **REQUIRED** (but could be optimized)  
**Chrome Web Store Review:** Low concern (read-only access)

#### Justification

The `tabs` permission is required to:

- Get the current active tab's URL for domain/path-specific settings lookup
- Send messages to content scripts running in tabs (for communication between background, popup, and content scripts)
- Track active tabs for state management (knowing which tabs have wave animations active)
- Query tab information to determine which domain/path settings to load

#### Usage in Codebase

**Primary Usage Locations:**
- `src/services/settings.ts`
  - `tabUrl()` function uses `currentTab()` to get active tab URL
  - Required for domain/path-specific settings: `getCurrentSettings()`, `updateCurrentSettings()`

- `src/component-middleware/settings/robotcopy-pact-config.js`
  - `chrome.tabs.query({ active: true, currentWindow: true })` to find active tab
  - `chrome.tabs.sendMessage()` to communicate with content scripts

- `src/background-scripts/log-view-background-system.ts`
  - Tracks active tabs for going state (which tabs have wave animations running)
  - `handleUpdateGoingState()` uses `sender.tab.id` to track per-tab state

#### What We Read

- **Tab URL:** Only to determine which settings to load for that domain/path
- **Tab ID:** Only for internal message routing and state tracking
- **Tab Active Status:** Only to find the currently active tab

**What We DON'T Do:**
- ❌ We do NOT read tab titles
- ❌ We do NOT read page content
- ❌ We do NOT modify tab URLs
- ❌ We do NOT create/close tabs
- ❌ We do NOT navigate tabs

#### Potential Optimization

Could potentially use `"activeTab"` permission instead for read-only access, but `"tabs"` is needed because:
1. We send messages to tabs programmatically (not just user-initiated)
2. We track state across multiple tabs
3. Background script needs to query tabs for state management

**Recommendation:** ✅ **Keep** - Required for domain/path-specific settings and message routing

---

### 3. `"host_permissions": ["<all_urls>"]` Permission

**Status:** ✅ **REQUIRED** (but broad by necessity)  
**Chrome Web Store Review:** May require justification during review

#### Justification

The `"<all_urls>"` host permission is required because:

- Wave Reader is designed to work on **any website** the user visits
- Content scripts must be injectable on all pages to apply wave animations
- Users should be able to use the extension on any domain (news sites, blogs, documentation, social media, etc.)
- The extension doesn't know in advance which sites users will visit

#### Usage in Codebase

**Primary Usage Locations:**
- `manifest.json` - Content scripts declaration
  ```json
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js", "shadowContent.js"],
      "run_at": "document_start",
      "all_frames": true,
      "world": "ISOLATED"
    }
  ]
  ```

- Content scripts run on every page to:
  - Detect when to apply wave animations
  - Inject CSS animations based on user settings
  - Listen for keyboard shortcuts globally
  - Apply domain/path-specific settings

#### What We Access

- **DOM Access:** Only to apply CSS animations to text elements (via selectors)
- **No Data Extraction:** We do NOT read page content, extract text, or collect data
- **No Network Requests:** We do NOT make network requests to external servers
- **No Cookies:** We do NOT access or modify cookies
- **Isolated Execution:** Content scripts run in `"world": "ISOLATED"` mode, separate from page scripts

#### User Benefit

Users expect the extension to work on:
- News websites (news.example.com)
- Blog platforms (blog.example.com)
- Documentation sites (docs.example.com)
- Social media (social.example.com)
- E-commerce sites
- Any website they choose to read on

Restricting to specific domains would severely limit utility.

#### Chrome Web Store Review

When submitting to Chrome Web Store, this permission may trigger a review. **Justification for review:**
> "Wave Reader applies CSS animations to improve reading comprehension. It must work on all websites because users read content across diverse domains. The extension only modifies DOM styling for text elements via CSS selectors - it does not extract, transmit, or store page content. All functionality is user-initiated via keyboard shortcuts."

**Recommendation:** ✅ **Keep** - Essential for universal functionality, but document thoroughly for review

---

## Removed Permissions

### `"scripting"` Permission (Previously Requested)

**Status:** ❌ **REMOVED** - Not currently used

#### Analysis

The `scripting` permission was previously declared but investigation shows:
- **No active usage** in current codebase
- Content scripts are injected via `manifest.json` `content_scripts` declaration (no dynamic injection)
- No `chrome.scripting.executeScript()` or `chrome.scripting.executeCSS()` calls found
- Historical references in old code have been replaced by manifest-based injection

**Current Implementation:**
- Content scripts are declaratively injected via manifest
- No dynamic script injection needed
- All functionality works with manifest-declared content scripts

**Recommendation:** ✅ **Removed** - No longer necessary with manifest-based content script injection

---

## Permission Summary Table

| Permission | Status | Justification | Risk Level | User Impact |
|------------|--------|---------------|------------|-------------|
| `storage` | ✅ Required | Persist user settings and preferences | Low | Core functionality |
| `tabs` | ✅ Required | Get current tab URL for domain-specific settings | Low | Essential for settings |
| `<all_urls>` | ✅ Required | Inject content scripts on all websites | Medium | Universal functionality |
| `scripting` | ❌ Removed | Not used - content scripts via manifest | N/A | Unnecessary permission |

---

## Data Handling and Privacy

### What Data is Stored

1. **User Preferences Only:**
   - Animation settings (wave speed, translation/rotation amounts)
   - CSS selectors for targeting text elements
   - Domain/path-specific settings mappings
   - Keyboard shortcut configurations

2. **No Personal Data:**
   - ❌ No page content
   - ❌ No URLs (except as keys for settings lookup)
   - ❌ No browsing history
   - ❌ No user behavior tracking
   - ❌ No analytics data

### Data Transmission

- **No External Transmission:** All data stays local in browser storage
- **Sync Storage:** Settings can sync across devices via Chrome sync (optional, user-controlled)
- **No Third-Party Servers:** Extension makes no network requests

### Security Considerations

- **Isolated Execution:** Content scripts run in isolated world, cannot access page JavaScript
- **CSP Compliant:** Extension avoids `eval()` and uses CSP-safe APIs
- **No Code Injection:** All CSS is generated from templates, no arbitrary code execution
- **Minimal Permissions:** Only requests permissions actually needed

---

## Chrome Web Store Submission Notes

### Permission Justification Text

When submitting to Chrome Web Store, use this justification:

> **Storage Permission:** Required to persist user-configured animation settings (wave speed, selectors, CSS templates) and domain/path-specific preferences. Only stores user preferences - no personal data or page content is stored.
>
> **Tabs Permission:** Required to get the current tab's URL for loading domain/path-specific settings and to send messages between extension components. Only reads tab URL and ID - does not access page content or track browsing history.
>
> **Host Permissions (<all_urls>):** Required because Wave Reader must work on any website users visit to apply reading assistance animations. Content scripts only inject CSS animations via selectors - they do not extract, transmit, or store page content. All functionality is user-initiated via keyboard shortcuts.

### Review Considerations

- Be prepared to explain why universal access is necessary
- Emphasize that content is not extracted or transmitted
- Highlight that functionality is user-initiated (keyboard shortcuts)
- Note that execution is isolated and CSP-compliant

---

## Future Permission Considerations

### Potential Additions

1. **`"activeTab"` Alternative:**
   - Could potentially replace some `tabs` permission usage
   - However, background script needs programmatic access, so `tabs` is still required

2. **Optional Permissions:**
   - Consider making some functionality opt-in via optional permissions
   - However, core functionality requires current permissions

### Optimization Opportunities

1. **Domain-Specific Injection:**
   - Could potentially use `optional_permissions` for specific domains
   - However, user experience would be degraded (permission prompts on each new domain)

2. **Host Permissions Scope:**
   - Chrome Web Store may accept `<all_urls>` with strong justification
   - Alternative: Request permissions on-demand, but this degrades UX significantly

---

## References

- [Chrome Extension Permissions Documentation](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/)
- [Manifest V3 Permissions](https://developer.chrome.com/docs/extensions/mv3/manifest/permissions/)
- [Content Scripts Isolation](https://developer.chrome.com/docs/extensions/mv3/content_scripts/#isolated_world)
- [Chrome Web Store Review Process](https://developer.chrome.com/docs/webstore/review-process/)

---

## Document Maintenance

**Last Reviewed:** January 2025  
**Next Review:** When permissions change or Chrome Web Store policies update  
**Maintained By:** Development Team

If permissions are added, removed, or usage patterns change, update this document accordingly.

