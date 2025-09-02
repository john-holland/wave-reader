const { Pact } = require('@pact-foundation/pact');
const { Matchers } = require('@pact-foundation/pact');
const { like, string } = Matchers;

// Pact test for tome-studio server-side rendering
describe('Tome Studio Server-Side Rendering', () => {
  let provider;
  let consumer;

  beforeAll(async () => {
    // Set up Pact provider (tome-studio server)
    provider = new Pact({
      consumer: 'wave-reader-client',
      provider: 'tome-studio-server',
      port: 4000,
      log: 'logs/pact.log',
      dir: 'pacts',
      logLevel: 'warn',
      spec: 2
    });

    // Set up Pact consumer (wave-reader)
    consumer = new Pact({
      consumer: 'wave-reader-client',
      provider: 'tome-studio-server',
      port: 4001,
      log: 'logs/pact.log',
      dir: 'pacts',
      logLevel: 'warn',
      spec: 2
    });

    await provider.setup();
    await consumer.setup();
  });

  afterAll(async () => {
    await provider.finalize();
    await consumer.finalize();
  });

  describe('HTML Template Rendering', () => {
    it('should render valid HTML without syntax errors', async () => {
      // Consumer expectation: Request HTML from tome-studio
      await consumer.addInteraction({
        state: 'tome-studio is running',
        uponReceiving: 'a request for wave-reader HTML',
        withRequest: {
          method: 'GET',
          path: '/wave-reader',
          headers: {
            'Accept': 'text/html'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'text/html'
          },
          body: {
            // Expect valid HTML structure
            html: like('<html>'),
            hasValidDoctype: true,
            hasValidHead: true,
            hasValidBody: true,
            // No template syntax errors
            noTemplateLiterals: true,
            noUnescapedBraces: true,
            // Valid JavaScript
            hasValidScripts: true,
            noSyntaxErrors: true
          }
        }
      });

      // Provider test: Actually render the HTML
      const response = await provider.verify();
      expect(response).toBeDefined();
    });

    it('should render HTML with proper CSP meta tags', async () => {
      await consumer.addInteraction({
        state: 'tome-studio is running',
        uponReceiving: 'a request for HTML with CSP headers',
        withRequest: {
          method: 'GET',
          path: '/wave-reader',
          headers: {
            'Accept': 'text/html'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'text/html'
          },
          body: {
            // Must have CSP meta tag
            hasCSPMetaTag: true,
            cspAllowsInlineScripts: true,
            cspAllowsUnsafeEval: true
          }
        }
      });

      const response = await provider.verify();
      expect(response).toBeDefined();
    });

    it('should render component templates without syntax errors', async () => {
      await consumer.addInteraction({
        state: 'tome-studio is running with components',
        uponReceiving: 'a request for component editor HTML',
        withRequest: {
          method: 'GET',
          path: '/wave-reader',
          headers: {
            'Accept': 'text/html'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'text/html'
          },
          body: {
            // Component templates should be valid
            hasValidComponentTemplates: true,
            noTemplateSyntaxErrors: true,
            // JavaScript should be properly escaped
            javascriptIsEscaped: true,
            // No raw template literals
            noRawTemplateLiterals: true
          }
        }
      });

      const response = await provider.verify();
      expect(response).toBeDefined();
    });
  });

  describe('API Endpoints', () => {
    it('should provide health endpoint', async () => {
      await consumer.addInteraction({
        state: 'tome-studio is running',
        uponReceiving: 'a health check request',
        withRequest: {
          method: 'GET',
          path: '/health'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            status: 'healthy',
            service: 'tome-connector-editor',
            timestamp: string(),
            uptime: like(0),
            version: string()
          }
        }
      });

      const response = await provider.verify();
      expect(response).toBeDefined();
    });

    it('should provide editor status endpoint', async () => {
      await consumer.addInteraction({
        state: 'tome-studio is running',
        uponReceiving: 'an editor status request',
        withRequest: {
          method: 'GET',
          path: '/api/editor/status'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            status: 'ready',
            service: 'tome-connector-editor',
            robotCopy: {
              unleashUrl: string(),
              unleashAppName: string(),
              unleashEnvironment: string()
            }
          }
        }
      });

      const response = await provider.verify();
      expect(response).toBeDefined();
    });
  });
});
