import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Template Validation Tests
 * 
 * This configuration is optimized for:
 * - Template syntax validation
 * - HTML structure verification
 * - JavaScript syntax checking
 * - Cross-browser compatibility testing
 */

export default defineConfig({
  testDir: './',
  testMatch: '**/template-validation.test.ts',
  
  // Run tests in parallel for efficiency
  workers: process.env.CI ? 1 : undefined,
  
  // Retry failed tests to handle flaky template issues
  retries: process.env.CI ? 2 : 1,
  
  // Timeout for template processing and validation
  timeout: 30000,
  
  // Global setup and teardown
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report/template-validation' }],
    ['json', { outputFile: 'test-results/template-validation-results.json' }],
    ['junit', { outputFile: 'test-results/template-validation-results.xml' }]
  ],
  
  // Use multiple browsers to catch template issues across different engines
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Headless for CI, headed for debugging
        headless: process.env.CI ? true : false
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        headless: process.env.CI ? true : false
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        headless: process.env.CI ? true : true
      },
    },
  ],
  
  // Web server configuration for template testing
  webServer: {
    command: 'cd ../.. && npm run start:editor',
    url: 'http://localhost:3003/wave-reader',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes for server startup
  },
  
  // Test environment setup
  use: {
    // Base URL for all tests
    baseURL: 'http://localhost:3003',
    
    // Screenshot on failure for debugging template issues
    screenshot: 'only-on-failure',
    
    // Video recording for debugging
    video: 'retain-on-failure',
    
    // Trace for debugging complex template issues
    trace: 'retain-on-failure',
    
    // Viewport for consistent testing
    viewport: { width: 1280, height: 720 },
    
    // Ignore HTTPS errors for local development
    ignoreHTTPSErrors: true,
    
    // Extra HTTP headers for testing
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Cache-Control': 'no-cache',
    },
  },
  
  // Environment variables for template testing
  env: {
    TEMPLATE_VALIDATION_MODE: 'strict',
    JSX_DETECTION_ENABLED: 'true',
    SYNTAX_VALIDATION_LEVEL: 'comprehensive',
  },
  
  // Test output directory
  outputDir: 'test-results/template-validation/',
  
  // Global test timeout
  globalTimeout: 600000, // 10 minutes
  
  // Expect timeout for individual assertions
  expect: {
    timeout: 10000, // 10 seconds for template validation
  },
  
  // Snapshot configuration for template comparison
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
  
  // Metadata for test reporting
  metadata: {
    templateValidation: {
      version: '1.0.0',
      description: 'Comprehensive template validation test suite',
      features: [
        'JavaScript syntax validation',
        'JSX contamination detection',
        'Brace/parenthesis balancing',
        'String literal validation',
        'Object structure verification',
        'Template processing validation'
      ]
    }
  }
});


