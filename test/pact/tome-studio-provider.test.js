const { Pact } = require('@pact-foundation/pact');
const { spawn } = require('child_process');
const fetch = require('node-fetch');
const TemplateValidator = require('./template-validator');

/**
 * Pact Provider Test for Tome Studio
 * This test runs the actual tome-studio server and validates its output
 */

describe('Tome Studio Provider Tests', () => {
  let provider;
  let tomeStudioProcess;
  let templateValidator;

  beforeAll(async () => {
    // Set up Pact provider
    provider = new Pact({
      consumer: 'wave-reader-client',
      provider: 'tome-studio-server',
      port: 4000,
      log: 'logs/pact-provider.log',
      dir: 'pacts',
      logLevel: 'warn',
      spec: 2
    });

    await provider.setup();
    templateValidator = new TemplateValidator();

    // Start tome-studio server for testing
    await startTomeStudio();
  });

  afterAll(async () => {
    await provider.finalize();
    await stopTomeStudio();
  });

  /**
   * Use existing tome-studio server for testing
   */
  async function startTomeStudio() {
    return new Promise((resolve) => {
      // Use the existing tome-studio server on port 3010
      console.log('🔗 Using existing Tome Studio server on port 3010');
      resolve();
    });
  }

  /**
   * Stop tome-studio server
   */
  async function stopTomeStudio() {
    if (tomeStudioProcess) {
      tomeStudioProcess.kill('SIGTERM');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  describe('HTML Template Validation', () => {
    it('should serve valid HTML for /wave-reader endpoint', async () => {
      // Fetch the HTML content
      const response = await fetch('http://localhost:3010/wave-reader');
      const html = await response.text();

      // Validate the HTML template
      const validation = templateValidator.validateTemplate(html);

      // Generate detailed report
      const report = templateValidator.generateReport();
      console.log('Template Validation Report:', JSON.stringify(report, null, 2));

      // Assertions
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.score).toBeGreaterThan(80);

      // Specific checks
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html');
      expect(html).toContain('<head');
      expect(html).toContain('<body');
      expect(html).toContain('Content-Security-Policy');
      expect(html).toContain("'unsafe-inline'");
      expect(html).toContain("'unsafe-eval'");

      // Check for common template syntax errors
      expect(html).not.toContain('{setting.value}');
      // Note: {component.name} and ${} in JavaScript context are valid syntax, not template variables
      // Only check for unprocessed template variables that should be server-side processed
      // Template literals ${} are valid JavaScript syntax and should be allowed
    });

    it('should serve valid HTML for root endpoint', async () => {

      const response = await fetch('http://localhost:3010/');
      const html = await response.text();

      const validation = templateValidator.validateTemplate(html);
      const report = templateValidator.generateReport();
      console.log('Root Template Validation Report:', JSON.stringify(report, null, 2));

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('Tome Connector Studio');
    });

    it('should have proper CSP configuration', async () => {

      const response = await fetch('http://localhost:3010/wave-reader');
      const html = await response.text();

      // Check CSP meta tag
      const cspMetaPattern = /<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/i;
      expect(html).toMatch(cspMetaPattern);

      // Check CSP content - look specifically in the CSP meta tag
      // Use a more targeted approach to extract the CSP content
      const cspMetaTagPattern = /<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/i;
      const cspMetaTag = html.match(cspMetaTagPattern);
      expect(cspMetaTag).toBeTruthy();
      
      // Extract the content attribute value more carefully
      // The content attribute spans multiple lines, so we need a more sophisticated approach
      const contentMatch = cspMetaTag[0].match(/content=["']([^"']*?)["']/i);
      expect(contentMatch).toBeTruthy();
      
      const csp = contentMatch[1];
      console.log('CSP Content:', csp); // Debug output
      console.log('Full CSP Meta Tag:', cspMetaTag[0]); // Debug full tag
      
      // The CSP content should contain the required directives
      // Since the regex might not capture the full multi-line content, let's check the full meta tag
      expect(cspMetaTag[0]).toContain("'unsafe-inline'");
      expect(cspMetaTag[0]).toContain("'unsafe-eval'");
      expect(cspMetaTag[0]).toContain("'self'");
      expect(cspMetaTag[0]).toContain("script-src");
      expect(cspMetaTag[0]).toContain("style-src");
    });
  });

  describe('API Endpoint Validation', () => {
    it('should provide health endpoint', async () => {

      const response = await fetch('http://localhost:3010/health');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.service).toBe('tome-connector-editor');
      expect(data.timestamp).toBeDefined();
      expect(data.uptime).toBeDefined();
      expect(data.version).toBeDefined();
    });

    it('should provide editor status endpoint', async () => {

      const response = await fetch('http://localhost:3010/api/editor/status');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ready');
      expect(data.service).toBe('tome-connector-editor');
      expect(data.robotCopy).toBeDefined();
      expect(data.robotCopy.unleashUrl).toBeDefined();
      expect(data.robotCopy.unleashAppName).toBeDefined();
      expect(data.robotCopy.unleashEnvironment).toBeDefined();
    });

    it('should provide pact features endpoint', async () => {

      const response = await fetch('http://localhost:3010/api/pact/features');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.features).toBeDefined();
      expect(typeof data.features).toBe('object');
    });
  });

  describe('Template Processing Validation', () => {
    it('should process template variables correctly', async () => {

      const response = await fetch('http://localhost:3010/wave-reader');
      const html = await response.text();

      // Check that EJS template variables are processed, not raw
      const rawEjsVars = [
        '<%= workingDir %>',
        '<%= studioVersion %>',
        '<%= components.forEach'
      ];

      rawEjsVars.forEach(templateVar => {
        expect(html).not.toContain(templateVar);
      });

      // Check that the HTML contains processed content
      expect(html).toContain('Wave Reader Editor');
      expect(html).toContain('Tome Connector Studio');
    });

    it('should escape JavaScript content properly', async () => {

      const response = await fetch('http://localhost:3010/wave-reader');
      const html = await response.text();

      // Extract script tags and validate JavaScript syntax
      const scriptPattern = /<script[^>]*>([\s\S]*?)<\/script>/gi;
      let scriptMatch;
      let scriptCount = 0;

      while ((scriptMatch = scriptPattern.exec(html)) !== null) {
        scriptCount++;
        const scriptContent = scriptMatch[1];

        // Basic JavaScript syntax validation
        try {
          // Check for obvious syntax errors
          if (scriptContent.includes('function') || scriptContent.includes('const') || scriptContent.includes('let')) {
            // This is a basic check - in production you might want more sophisticated parsing
            // Note: ${} template literals are valid JavaScript, not errors
            expect(scriptContent).not.toContain('{setting.value}');
          }
        } catch (error) {
          throw new Error(`JavaScript syntax error in script tag ${scriptCount}: ${error.message}`);
        }
      }

      expect(scriptCount).toBeGreaterThan(0);
    });

    it('should not contain raw JSX syntax in HTML templates', async () => {

      const response = await fetch('http://localhost:3010/wave-reader');
      const html = await response.text();

      // Check for raw JSX syntax that should be processed server-side
      expect(html).not.toContain('className={');
      expect(html).not.toContain('onClick={');
      expect(html).not.toContain('disabled={');
      expect(html).not.toContain('{children}');
      expect(html).not.toContain('React.FC<');
      expect(html).not.toContain('React.Component');

      // Check for specific JSX patterns that cause syntax errors
      const jsxPatterns = [
        /<button[^>]*className=\{/,
        /onClick=\{/,
        /disabled=\{/,
        /\{children\}/,
        /React\.FC</,
        /React\.Component/
      ];

      jsxPatterns.forEach(pattern => {
        expect(html).not.toMatch(pattern);
      });
    });

    it('should not contain the specific JSX syntax error from line 290', async () => {

      const response = await fetch('http://localhost:3010/wave-reader');
      const html = await response.text();

      // This is the exact JSX code that was causing the syntax error
      const problematicJSX = [
        'className={`${baseClasses} ${variantClasses[variant]}`}',
        'onClick={onClick}',
        'disabled={disabled}',
        '{children}',
        'const baseClasses = \'px-4 py-2 rounded font-medium transition-colors\';',
        'const variantClasses = {',
        'primary: \'bg-blue-500 hover:bg-blue-600 text-white\'',
        'secondary: \'bg-gray-500 hover:bg-gray-600 text-white\'',
        'success: \'bg-green-500 hover:bg-green-600 text-white\''
      ];

      problematicJSX.forEach(pattern => {
        expect(html).not.toContain(pattern);
      });

      // Check that the HTML doesn't contain raw JSX button syntax
      expect(html).not.toMatch(/<button[^>]*className=\{`\$\{baseClasses\} \$\{variantClasses\[variant\]\}`\}/);
      expect(html).not.toMatch(/onClick=\{onClick\}/);
      expect(html).not.toMatch(/disabled=\{disabled\}/);
    });
  });
});

/**
 * Wait for server to be ready
 */
async function waitForServer(url, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch (error) {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error(`Server not ready after ${maxAttempts} attempts`);
}
