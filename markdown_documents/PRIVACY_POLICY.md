# Wave Reader Privacy Policy

**Last Updated:** January 2025  
**Extension Version:** 1.0.4  
**Effective Date:** January 2025

---

## Introduction

Wave Reader ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how the Wave Reader browser extension ("Extension") collects, uses, stores, and protects your information.

By using the Wave Reader extension, you agree to the collection and use of information in accordance with this policy.

## 2.0 Clause

We reserve the right to introduce a public development backend that may include some light service messaging, or additional OAuth integrations. Currently however all of the statements below about service usage are true and hold.

---

## Summary

**Wave Reader is a privacy-focused extension that:**
- ✅ Stores all data locally in your browser
- ✅ Does NOT collect, transmit, or sell your personal information
- ✅ Does NOT track your browsing behavior
- ✅ Does NOT access or store page content
- ✅ Only stores your configuration preferences
- ✅ Does NOT use third-party analytics or tracking services

---

## Information We Collect

### Data Stored Locally

Wave Reader stores the following information **only on your device** using Chrome's local storage APIs:

#### 1. User Preferences (Required for Functionality)
- **Animation Settings:**
  - Wave animation speed (numerical value)
  - Translation amounts (X-axis min/max values)
  - Rotation amounts (Y-axis min/max values)
  - Mouse follow interval settings

- **Selector Preferences:**
  - CSS selectors you configure for targeting text elements
  - Domain and path-specific selector configurations

- **Keyboard Shortcuts:**
  - Custom keyboard shortcut configurations (key combinations)

- **UI Preferences:**
  - Display settings and notification preferences
  - CSS template customizations

#### 2. Domain/Path Settings (Optional)
- **Domain-Path Mappings:**
  - Which settings to use for specific websites/pages
  - Example: `example.com/article` → uses settings profile A
  - Note: Only the domain/path structure is stored as keys, NOT page content

#### 3. Extension State (Temporary)
- Active tab state (which tabs have animations enabled)
- UI state (popup panel state)

### What We DO NOT Collect

We explicitly **DO NOT** collect or store:
- ❌ **Page Content:** We do not read, extract, or store any text or content from web pages
- ❌ **Browsing History:** We do not track which websites you visit
- ❌ **Personal Information:** We do not collect names, emails, or any identifying information
- ❌ **URLs:** URLs are only used as keys for settings lookup (not stored or transmitted)
- ❌ **User Behavior:** We do not track how you use websites or what you read
- ❌ **Search Queries:** We do not collect search terms or query parameters
- ❌ **Cookies:** We do not access or store cookies
- ❌ **Location Data:** We do not collect geolocation information
- ❌ **Device Information:** We do not collect device identifiers, IP addresses, or hardware information

---

## How We Use Your Information

All stored data is used **solely for the extension's functionality**:

### Primary Uses:
1. **Applying Your Preferences:** Using your configured settings (wave speed, selectors) to apply animations on websites you visit
2. **Domain-Specific Settings:** Loading the correct settings for each website based on your domain/path configurations
3. **Extension State Management:** Remembering which tabs have animations active
4. **UI State:** Maintaining your popup panel preferences

### Secondary Uses (Optional/Development):
- **ML-Based Recommendations:** Optional machine learning service that analyzes your settings patterns to suggest improvements
  - This operates entirely locally and scrubs any PII from URLs
  - Query parameters (like search terms) are automatically removed
  - Sensitive parameters (auth tokens, passwords, etc.) are filtered out
  - Can be disabled if desired

---

## Data Storage and Location

### Storage Methods

**Chrome Storage API:**
- Uses `chrome.storage.sync` for settings that can sync across your Chrome devices (optional, user-controlled)
- Uses `chrome.storage.local` for UI state and temporary data
- All data remains within Chrome's storage system

**Storage Location:**
- All data is stored **locally on your device**
- If Chrome Sync is enabled (user's choice), settings may sync to your other Chrome browsers
- Sync is controlled entirely by Chrome and your account settings

**No External Storage:**
- ❌ We do NOT transmit data to external servers
- ❌ We do NOT use cloud storage services
- ❌ We do NOT send data to third-party services

---

## Data Sharing and Disclosure

### We Do Not Share Your Data

Wave Reader **does not share, sell, rent, or disclose** your information to:
- ❌ Third-party services or APIs
- ❌ Advertising networks
- ❌ Analytics platforms
- ❌ Data brokers or aggregators
- ❌ Any external servers or services

### Exceptions (Legal Requirements)

We may disclose information only if required by law:
- In response to valid legal requests (court orders, subpoenas)
- To protect our rights or comply with legal obligations
- However, since all data is stored locally, we would have no data to provide without your device access

---

## Third-Party Services

### No Third-Party Integrations

Wave Reader does **not integrate with** third-party services:
- ❌ No Google Analytics
- ❌ No Facebook Pixel
- ❌ No advertising networks
- ❌ No external analytics platforms
- ❌ No remote APIs (except optional development backend, disabled in production)

### Optional Development Features

Some development/debugging features reference external services (DataDog, OpenTelemetry), but these are:
- Only available in development builds
- Disabled by default
- Not included in production releases
- Never transmit user data

---

## Permissions Explained

Wave Reader requests the following permissions and explains why:

### 1. `"storage"` Permission
- **Why:** To save your preferences and settings
- **What we access:** Chrome's storage API only
- **Privacy impact:** Low - only stores your configuration, no external access

### 2. `"tabs"` Permission
- **Why:** To get the current tab's URL for loading domain-specific settings
- **What we access:** Tab URL and ID only (for settings lookup)
- **What we DON'T access:** Page content, browsing history, tab titles
- **Privacy impact:** Low - only reads URL for settings routing

### 3. `"host_permissions": ["<all_urls>"]` Permission
- **Why:** To inject content scripts on any website you visit
- **What we access:** DOM elements (to apply CSS animations via selectors)
- **What we DON'T access:** Page content, text, cookies, passwords
- **Privacy impact:** Medium - necessary for universal functionality
- **Security:** Content scripts run in isolated world, cannot access page JavaScript

See our [Permissions Justification Document](./markdown_documents/PERMISSIONS_JUSTIFICATION.md) for detailed explanations.

---

## Your Rights and Choices

### Access Your Data
- All data is stored in Chrome's storage - you can view it using Chrome DevTools
- Location: `chrome://extensions` → Developer mode → Inspect views → Application tab → Storage

### Delete Your Data
- **Method 1:** Uninstall the extension (removes all stored data)
- **Method 2:** Use Chrome storage APIs directly
- **Method 3:** Reset extension settings in the extension popup

### Control Sync
- Chrome Sync is controlled by your Chrome account settings
- If sync is disabled, all data stays on your device only

### Disable Features
- You can disable domain/path-specific settings
- You can disable ML recommendations (if implemented)
- All features are opt-in or clearly visible

---

## Data Security

### Security Measures

**Local Storage Security:**
- All data is stored using Chrome's secure storage APIs
- Data is isolated to the extension's storage namespace
- Chrome's built-in security protects stored data

**Code Security:**
- Extension runs in isolated execution context
- Content scripts cannot access page JavaScript (isolated world)
- No `eval()` or dynamic code execution
- CSP (Content Security Policy) compliant

**No Network Transmission:**
- Extension makes no network requests
- No data leaves your device
- No external API calls (in production builds)

### Limitations

- Security depends on Chrome's storage security
- If your device is compromised, extension data could be accessed
- We recommend keeping your browser and operating system updated

---

## Children's Privacy

Wave Reader is not intended for children under 13. We do not knowingly collect information from children. If you are a parent or guardian and believe your child has provided us with information, please contact us to have it removed.

Since we don't collect personal information, this is largely not applicable, but we state it for completeness.

---

## International Users

### Data Location
- All data is stored locally on your device
- If Chrome Sync is enabled, data may sync to Google's servers (subject to Google's privacy policy)
- We do not control Chrome Sync - that's a Google feature

### GDPR Compliance
For users in the EU/EEA:
- ✅ We do not collect personal data
- ✅ All processing happens locally on your device
- ✅ You can delete all data by uninstalling the extension
- ✅ No data is transmitted outside your control
- ✅ No third-party data processors

**Right to Deletion:** Uninstall the extension to delete all data immediately.

**Right to Access:** All data is accessible via Chrome DevTools (see "Your Rights" section).

---

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Changes will be:
- Posted in this document
- Versioned with the extension version
- Highlighted with "Last Updated" date

**Material Changes:**
- If we start collecting new types of data, we'll notify users via extension update notes
- If we change how data is used, we'll provide clear notice

**Your Continued Use:**
- Continued use after changes indicates acceptance
- You can always uninstall if you disagree with changes

---

## Contact Information

### Privacy Inquiries

For privacy-related questions or concerns:

**Extension Author:** John Holland  
**Repository:** [GitHub - wave-reader](https://github.com/john-holland/wave-reader)  
**Issues:** Please use GitHub Issues for privacy questions

**Response Time:** We aim to respond to privacy inquiries within 7 business days.

---

## Technical Details

### Extension Architecture

**Isolated Execution:**
- Content scripts run in `"world": "ISOLATED"` mode
- Cannot access page JavaScript or page variables
- Only injects CSS animations, no code injection

**Local Processing:**
- All ML/analytics processing happens locally
- No server-side processing
- No remote computation

**PII Scrubbing:**
- ML service automatically removes sensitive URL parameters
- Filters: tokens, auth, passwords, session IDs, tracking parameters
- Removes long alphanumeric strings that could be tokens

### Data Retention

**Storage Duration:**
- Settings persist until you delete them or uninstall the extension
- No automatic expiration or deletion
- You control all data retention

**After Uninstallation:**
- All extension data is deleted immediately
- Chrome removes all stored data automatically
- No residual data remains

---

## Open Source

Wave Reader is open source. The source code is publicly available, allowing you to:
- Review exactly what data is collected and how it's used
- Verify our privacy claims
- Contribute improvements

**Source Code:** Available on GitHub  
**License:** MIT License

---

## Additional Resources

- [Chrome Extension Privacy Best Practices](https://developer.chrome.com/docs/extensions/mv3/user_privacy/)
- [Chrome Storage API Documentation](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Permissions Justification Document](./markdown_documents/PERMISSIONS_JUSTIFICATION.md)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.4 | January 2025 | Initial privacy policy published |

---

**Your privacy matters to us. If you have any questions about this policy or our data practices, please contact us through GitHub Issues.**

---

*This privacy policy applies to Wave Reader browser extension version 1.0.4 and later.*
*2.0 Clause not yet ennacted!*
*Eat wheat!*

