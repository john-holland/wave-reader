# Wave Reader Extension - Playwright Testing

This directory contains Playwright tests for the Wave Reader browser extension. The tests are designed to verify that the extension works correctly in a Chromium browser with the extension loaded.

## Setup

### Prerequisites

1. **Node.js and npm** - Make sure you have Node.js installed
2. **Playwright** - Already installed as a dev dependency
3. **Chromium** - Playwright will automatically install the required browser

### Installation

The setup is already complete! Playwright and Chromium have been installed automatically.

## Test Structure

```
test/playwright/
├── README.md              # This file
├── extension.test.ts      # Main test suite
├── extension-utils.ts     # Utility functions for testing
├── test.html             # Test page with various content scenarios
└── run-tests.js          # Test runner script
```

## Running Tests

### Quick Start

```bash
# Run all tests
npm run test:playwright

# Run tests with UI (interactive)
npm run test:playwright:ui

# Run tests in headed mode (visible browser)
npm run test:playwright:headed

# Run tests in debug mode
npm run test:playwright:debug
```

### Using the Test Runner

```bash
# Run the custom test runner
node test/playwright/run-tests.js
```

### Manual Test Execution

```bash
# Build the extension first
npm run build

# Run Playwright tests
npx playwright test
```

## Test Page

The `test.html` file provides a comprehensive test environment with:

- **Multiple content sections** with different text types
- **Interactive test controls** for manual testing
- **Status indicators** to show test progress
- **Various text formats** (bold, italic, highlighted)
- **Long-form content** for testing reading scenarios

### Test Controls

The test page includes buttons to test different aspects of the extension:

- **Test Mouse Wave** - Tests mouse-following wave animation
- **Test CSS Template** - Tests template-based CSS animations
- **Test Toggle** - Tests the toggle functionality
- **Test Performance** - Tests performance monitoring
- **Clear Status** - Resets the status indicator

## Test Coverage

The test suite covers:

### Core Functionality
- ✅ Extension loading and initialization
- ✅ Content script injection
- ✅ Mouse wave animation
- ✅ CSS template animations
- ✅ Toggle functionality
- ✅ Performance monitoring

### Browser Integration
- ✅ Extension manifest validation
- ✅ Content script loading
- ✅ Console log monitoring
- ✅ Mouse movement simulation
- ✅ Page interaction testing

### Performance Testing
- ✅ Memory usage monitoring
- ✅ Performance metrics collection
- ✅ Animation smoothness testing
- ✅ Resource cleanup verification

## Configuration

### Playwright Config

The `playwright.config.ts` file is configured specifically for extension testing:

- **Chromium browser** with extension loading capabilities
- **Security flags disabled** for local testing
- **Extension path** pointing to the `build` directory
- **Custom launch arguments** for optimal extension testing

### Extension Loading

The configuration automatically:
- Loads the extension from the `build` directory
- Disables other extensions for clean testing
- Sets up proper security flags for local development
- Configures browser arguments for optimal performance

## Debugging

### Debug Mode

```bash
npm run test:playwright:debug
```

This opens the Playwright Inspector where you can:
- Step through tests
- Inspect the browser state
- Debug extension behavior
- View console logs

### UI Mode

```bash
npm run test:playwright:ui
```

This opens the Playwright UI where you can:
- Run tests interactively
- View test results
- Debug failed tests
- Monitor test execution

### Console Logs

The tests monitor console logs for extension activity:
- Look for logs starting with `🌊` (Wave Reader logs)
- Monitor performance metrics
- Check for error messages
- Verify extension initialization

## Troubleshooting

### Common Issues

1. **Extension not loading**
   - Ensure the extension is built (`npm run build`)
   - Check that `build/manifest.json` exists
   - Verify the extension path in `playwright.config.ts`

2. **Tests failing**
   - Check browser console for errors
   - Verify extension content scripts are loading
   - Ensure test page is accessible

3. **Performance issues**
   - Monitor memory usage in browser dev tools
   - Check for memory leaks in extension
   - Verify cleanup functions are working

### Debug Commands

```bash
# Check if extension is built
ls -la build/

# Verify manifest
cat build/manifest.json

# Run single test
npx playwright test extension.test.ts --grep "should load extension"

# Run with verbose output
npx playwright test --reporter=verbose
```

## Contributing

When adding new tests:

1. **Follow the existing pattern** in `extension.test.ts`
2. **Use the utility functions** from `extension-utils.ts`
3. **Add appropriate assertions** for new functionality
4. **Update this README** if adding new test categories
5. **Test in both headed and headless modes**

### Test Guidelines

- **Isolated tests** - Each test should be independent
- **Proper cleanup** - Clean up resources after tests
- **Clear assertions** - Use descriptive test names
- **Error handling** - Test both success and failure scenarios
- **Performance monitoring** - Include performance checks where relevant

## Browser Support

Currently tested with:
- **Chromium** (via Playwright)
- **Extension-enabled** browser context
- **Local file access** for test pages

Future support planned for:
- **Firefox** (when extension support is added)
- **Safari** (when extension support is added)
- **Multiple browser profiles** for comprehensive testing 