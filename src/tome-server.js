import express from 'express';
import { createMachine, interpret } from 'xstate';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { safeFetch, setBackendRequestOverride } from './utils/backend-api-wrapper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Wave Reader Tome Server for SSR
class WaveReaderTomeServer {
  constructor() {
    this.app = express();
    this.backendBaseUrl = process.env.WAVE_READER_BACKEND_URL || '';
    if (!this.backendBaseUrl) {
      setBackendRequestOverride(false);
    } else {
      setBackendRequestOverride(null);
    }
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, 'public')));
    
    // Extract trace context
    this.app.use((req, res, next) => {
      const traceId = req.headers['x-trace-id'] || uuidv4();
      const spanId = req.headers['x-span-id'] || uuidv4();
      req.traceContext = { traceId, spanId };
      next();
    });
  }

  setupRoutes() {
    // Server-side rendered wave reader page
    this.app.get('/wave-reader', async (req, res) => {
      const { traceId, spanId } = req.traceContext;
      
      try {
        // Simulate server-side state machine for wave reader
        const waveReaderMachine = this.createWaveReaderMachine();
        const service = interpret(waveReaderMachine).start();
        
        // Server-side state processing
        service.send({ type: 'INITIALIZE_WAVE_READER' });
        const state = service.getSnapshot();

        // Generate SSR HTML
        const html = this.renderWaveReaderPage(state, traceId);
        
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
      } catch (error) {
        res.status(500).send('Error rendering wave reader page');
      }
    });

    // Client-side wave reader page (static template)
    this.app.get('/wave-reader-client', (req, res) => {
      const { traceId } = req.traceContext;
      
      try {
        // Serve the static wave reader template
        const templatePath = path.join(__dirname, 'component-middleware/wave-reader/templates/wave-reader-component/template.html');
        res.sendFile(templatePath);
      } catch (error) {
        res.status(500).send('Error serving wave reader template');
      }
    });

    // API endpoints for wave reader operations
    this.app.post('/api/wave-reader/start', async (req, res) => {
      const { selector, options } = req.body;
      const { traceId } = req.traceContext;
      
      try {
        const endpoint = this.backendBaseUrl
          ? `${this.backendBaseUrl}/wave-reader/start`
          : 'mock://wave-reader/start';
        const response = await safeFetch(
          endpoint,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ selector, options, traceId })
          },
          'wave/start',
          { payload: { selector, options, traceId } }
        );
        const result = await response.json();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: 'Failed to start wave reader' });
      }
    });

    this.app.post('/api/wave-reader/stop', async (req, res) => {
      const { traceId } = req.traceContext;
      
      try {
        const endpoint = this.backendBaseUrl
          ? `${this.backendBaseUrl}/wave-reader/stop`
          : 'mock://wave-reader/stop';
        const response = await safeFetch(
          endpoint,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ traceId })
          },
          'wave/stop',
          { payload: { traceId } }
        );
        const result = await response.json();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: 'Failed to stop wave reader' });
      }
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    });

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.redirect('/wave-reader');
    });
  }

  createWaveReaderMachine() {
    return createMachine({
      id: 'wave-reader',
      initial: 'idle',
      predictableActionArguments: true,
      context: {
        selector: 'p',
        selectors: [],
        going: false,
        options: {},
        traceId: null
      },
      states: {
        idle: {
          on: {
            INITIALIZE_WAVE_READER: 'loading'
          }
        },
        loading: {
          on: {
            WAVE_READER_LOADED: 'ready',
            LOAD_ERROR: 'error'
          }
        },
        ready: {
          on: {
            START_WAVE_READER: 'waving',
            UPDATE_SELECTOR: 'updating_selector',
            ADD_SELECTOR: 'adding_selector',
            REMOVE_SELECTOR: 'removing_selector'
          }
        },
        waving: {
          on: {
            STOP_WAVE_READER: 'ready',
            WAVE_ERROR: 'error'
          }
        },
        updating_selector: {
          on: {
            SELECTOR_UPDATED: 'ready',
            UPDATE_ERROR: 'error'
          }
        },
        adding_selector: {
          on: {
            SELECTOR_ADDED: 'ready',
            ADD_ERROR: 'error'
          }
        },
        removing_selector: {
          on: {
            SELECTOR_REMOVED: 'ready',
            REMOVE_ERROR: 'error'
          }
        },
        error: {
          on: {
            RETRY: 'idle'
          }
        }
      }
    });
  }

  renderWaveReaderPage(state, traceId) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Wave Reader - Motion Reader for Eye Tracking</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }

            .wave-reader-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }

            .wave-reader-header {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 30px;
                text-align: center;
            }

            .wave-reader-content {
                padding: 30px;
            }

            .selector-section {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
            }

            .selector-input {
                width: 100%;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
                margin-bottom: 15px;
            }

            .control-buttons {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }

            .btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }

            .btn-primary {
                background: #667eea;
                color: white;
            }

            .btn-primary:hover {
                background: #5a6fd8;
                transform: translateY(-2px);
            }

            .btn-success {
                background: #28a745;
                color: white;
            }

            .btn-success:hover {
                background: #218838;
                transform: translateY(-2px);
            }

            .btn-secondary {
                background: #6c757d;
                color: white;
            }

            .btn-secondary:hover {
                background: #5a6268;
                transform: translateY(-2px);
            }

            .selectors-list {
                margin-top: 20px;
            }

            .selector-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                border: 1px solid #e9ecef;
                border-radius: 6px;
                margin-bottom: 10px;
                background: white;
            }

            .trace-info {
                background: #f0f0f0;
                padding: 10px;
                border-radius: 4px;
                font-size: 12px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="wave-reader-container">
            <div class="wave-reader-header">
                <h1>🌊 Wave Reader</h1>
                <p>Motion Reader for Eye Tracking</p>
            </div>

            <div class="wave-reader-content">
                <div class="selector-section">
                    <h3>CSS Selector</h3>
                    <input type="text" class="selector-input" id="selector" 
                           placeholder="Enter CSS selector (e.g., p, h1, .content)" 
                           value="${state.context.selector || 'p'}">
                    
                    <div class="control-buttons">
                        <button class="btn btn-primary" onclick="startWaveReader()">
                            🚀 Start Reading
                        </button>
                        <button class="btn btn-success" onclick="stopWaveReader()">
                            ⏹️ Stop Reading
                        </button>
                        <button class="btn btn-secondary" onclick="addSelector()">
                            ➕ Add Selector
                        </button>
                    </div>

                    <div class="selectors-list">
                        <h4>Saved Selectors:</h4>
                        ${state.context.selectors.length === 0 ? '<p>No selectors saved yet</p>' : 
                          state.context.selectors.map(selector => `
                            <div class="selector-item">
                                <span>${selector}</span>
                                <button class="btn btn-secondary" onclick="removeSelector('${selector}')">
                                    Remove
                                </button>
                            </div>
                          `).join('')
                        }
                    </div>
                </div>

                <div class="trace-info">
                    <p>Server-Side Rendered</p>
                    <p>Trace ID: ${traceId}</p>
                    <p>State: ${state.value}</p>
                    <p>Current Selector: ${state.context.selector}</p>
                    <p>Status: ${state.context.going ? 'Reading' : 'Stopped'}</p>
                </div>
            </div>
        </div>

        <script>
            async function callBackend(endpoint, options = {}) {
                const response = await fetch(endpoint, {
                    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
                    ...options
                });

                const backendDisabled = response.headers.get('X-Backend-Disabled') === 'true';
                const payload = await response.json();

                if (backendDisabled) {
                    console.warn('Backend disabled – using mock data for', endpoint);
                }

                return { backendDisabled, payload };
            }

            async function startWaveReader() {
                const selector = document.getElementById('selector').value;
                const { payload, backendDisabled } = await callBackend('/api/wave-reader/start', {
                    method: 'POST',
                    body: JSON.stringify({ selector })
                });

                if (payload?.success) {
                    alert(`Wave reader started${backendDisabled ? ' (mocked)' : ''}!`);
                }
            }

            async function stopWaveReader() {
                const { payload, backendDisabled } = await callBackend('/api/wave-reader/stop', {
                    method: 'POST'
                });

                if (payload?.success) {
                    alert(`Wave reader stopped${backendDisabled ? ' (mocked)' : ''}!`);
                }
            }

            function addSelector() {
                const selector = document.getElementById('selector').value;
                if (selector) {
                    // Add to local state and save
                    alert('Selector added: ' + selector);
                }
            }

            function removeSelector(selector) {
                if (confirm('Remove selector: ' + selector + '?')) {
                    // Remove from local state and save
                    alert('Selector removed: ' + selector);
                }
            }
        </script>
    </body>
    </html>
    `;
  }

  /**
   * Check if a port is in use and show process information
   * @param {number} port - Port number to check
   * @returns {Object|null} Process information or null if port is free
   */
  checkPort(port) {
    try {
      // Use lsof to get PID for the port
      const lsofOutput = execSync(`lsof -ti :${port}`, { encoding: 'utf8', stdio: 'pipe' }).trim();
      
      if (!lsofOutput) {
        return null;
      }

      // Get PID from lsof output (first line)
      const pid = lsofOutput.split('\n')[0].trim();
      
      if (!pid || isNaN(pid)) {
        return null;
      }

      // Get detailed process information using ps
      try {
        // Get command name (comm)
        const commOutput = execSync(`ps -p ${pid} -o comm=`, { encoding: 'utf8', stdio: 'pipe' }).trim();
        const comm = commOutput || 'unknown';
        
        // Get full command with arguments
        const argsOutput = execSync(`ps -p ${pid} -o args=`, { encoding: 'utf8', stdio: 'pipe' }).trim();
        const args = argsOutput || 'unknown';
        
        // Extract executable path from args (first word)
        const executablePath = args.split(' ')[0] || comm;
        
        // Try to get the full path
        let fullPath = executablePath;
        
        // If the path doesn't start with /, try to resolve it
        if (!executablePath.startsWith('/')) {
          try {
            // Try which first
            const whichOutput = execSync(`which ${executablePath}`, { encoding: 'utf8', stdio: 'pipe' }).trim();
            if (whichOutput) {
              fullPath = whichOutput;
            }
          } catch {
            // If which fails, try to resolve relative paths
            try {
              // On macOS, try to get the real path using readlink (if available)
              const readlinkOutput = execSync(`readlink -f ${executablePath} 2>/dev/null || echo ${executablePath}`, { 
                encoding: 'utf8', 
                stdio: 'pipe',
                shell: true 
              }).trim();
              if (readlinkOutput && readlinkOutput !== executablePath) {
                fullPath = readlinkOutput;
              }
            } catch {
              // Keep the original path
              fullPath = executablePath;
            }
          }
        } else {
          // If it's already an absolute path, try to resolve symlinks
          try {
            const realpathOutput = execSync(`realpath ${executablePath} 2>/dev/null || echo ${executablePath}`, {
              encoding: 'utf8',
              stdio: 'pipe',
              shell: true
            }).trim();
            if (realpathOutput && realpathOutput !== executablePath) {
              fullPath = realpathOutput;
            }
          } catch {
            fullPath = executablePath;
          }
        }

        return {
          pid: pid,
          command: comm,
          fullPath: fullPath,
          args: args
        };
      } catch (error) {
        // Fallback to just PID if ps fails
        return {
          pid: pid,
          command: 'unknown',
          fullPath: 'unknown',
          args: 'unknown'
        };
      }
    } catch (error) {
      // Port is not in use or lsof failed
      return null;
    }
  }

  start(port = 3003) {
    // Check if port is already in use
    const processInfo = this.checkPort(port);
    
    if (processInfo) {
      console.error(`❌ Port ${port} is already in use!`);
      console.error(`📋 Process Information:`);
      console.error(`   PID: ${processInfo.pid}`);
      console.error(`   Command: ${processInfo.command}`);
      console.error(`   Path: ${processInfo.fullPath}`);
      console.error(`   Args: ${processInfo.args}`);
      console.error(`\n💡 To stop the process, run: kill ${processInfo.pid}`);
      console.error(`   Or use: npm run stop:servers`);
      process.exit(1);
    }

    this.app.listen(port, () => {
      console.log(`✅ Wave Reader Tome Server running on port ${port}`);
      console.log('🌐 Wave Reader page: http://localhost:3003/wave-reader (SSR)');
      console.log('🌐 Wave Reader client: http://localhost:3003/wave-reader-client (Client-side)');
    });
  }
}

// Create and start the Wave Reader Tome server
const waveReaderTomeServer = new WaveReaderTomeServer();
waveReaderTomeServer.start(3003);

export { WaveReaderTomeServer };
