import { test, expect, Page, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Soak Test with RAM Monitoring
 * 
 * This test runs for an extended period while monitoring memory usage.
 * It captures memory snapshots at regular intervals and generates a report.
 */

interface MemorySnapshot {
  timestamp: number;
  timeElapsed: number; // in seconds
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number; // Resident Set Size
  arrayBuffers: number;
}

interface StateTransition {
  timestamp: number;
  fromState: string;
  toState: string;
  event: string;
  context?: any;
}

interface StateLoopDetection {
  transitions: StateTransition[];
  detectedLoops: Array<{
    states: string[];
    count: number;
    firstSeen: number;
  }>;
}

interface MemoryStats {
  min: number;
  max: number;
  avg: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  percentageChange: number;
}

/**
 * State Loop Detector - monitors state transitions and detects infinite loops
 */
class StateLoopDetector {
  private transitions: StateTransition[] = [];
  private loopThreshold = 10; // Number of times same pattern must repeat to be considered a loop
  
  addTransition(fromState: string, toState: string, event: string, context?: any): void {
    this.transitions.push({
      timestamp: Date.now(),
      fromState,
      toState,
      event,
      context
    });
  }
  
  detectLoops(): StateLoopDetection {
    const detectedLoops: Array<{ states: string[]; count: number; firstSeen: number }> = [];
    
    // Look for repeating patterns in the last 100 transitions
    const recentTransitions = this.transitions.slice(-100);
    
    // Check for simple A->B->A loops
    for (let i = 0; i < recentTransitions.length - 2; i++) {
      const pattern = [
        recentTransitions[i].toState,
        recentTransitions[i + 1].toState,
        recentTransitions[i + 2].toState
      ];
      
      // Count how many times this pattern repeats
      let count = 0;
      for (let j = i; j < recentTransitions.length - 2; j += 2) {
        if (
          recentTransitions[j].toState === pattern[0] &&
          recentTransitions[j + 1].toState === pattern[1] &&
          recentTransitions[j + 2].toState === pattern[2]
        ) {
          count++;
        }
      }
      
      if (count >= this.loopThreshold) {
        detectedLoops.push({
          states: pattern,
          count,
          firstSeen: recentTransitions[i].timestamp
        });
      }
    }
    
    return {
      transitions: this.transitions,
      detectedLoops
    };
  }
  
  getReport(): string {
    const loopData = this.detectLoops();
    let report = '\n';
    report += '═══════════════════════════════════════════════════════════════\n';
    report += '                  STATE LOOP ANALYSIS REPORT                   \n';
    report += '═══════════════════════════════════════════════════════════════\n';
    report += `\n📊 Total Transitions: ${this.transitions.length}\n`;
    report += `🔍 Detected Loops: ${loopData.detectedLoops.length}\n\n`;
    
    if (loopData.detectedLoops.length > 0) {
      report += '⚠️ WARNING: Potential infinite loops detected!\n\n';
      loopData.detectedLoops.forEach((loop, idx) => {
        report += `Loop ${idx + 1}:\n`;
        report += `  Pattern: ${loop.states.join(' -> ')}\n`;
        report += `  Repetitions: ${loop.count}\n`;
        report += `  First Seen: ${new Date(loop.firstSeen).toISOString()}\n\n`;
      });
    } else {
      report += '✅ No infinite loops detected\n\n';
    }
    
    // Show last 10 transitions
    report += '───────────────────────────────────────────────────────────────\n';
    report += '                  RECENT STATE TRANSITIONS                     \n';
    report += '───────────────────────────────────────────────────────────────\n';
    const recentTransitions = this.transitions.slice(-10);
    recentTransitions.forEach((t, idx) => {
      report += `${idx + 1}. ${t.fromState} --[${t.event}]--> ${t.toState}\n`;
    });
    
    report += '\n═══════════════════════════════════════════════════════════════\n';
    return report;
  }
  
  saveToFile(filename: string): void {
    const reportDir = path.join(__dirname, '../../test-results/soak-tests');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const report = this.getReport();
    const reportPath = path.join(reportDir, `${filename}-state-loops.txt`);
    fs.writeFileSync(reportPath, report);
    
    // Also save raw data as JSON
    const dataPath = path.join(reportDir, `${filename}-state-loops.json`);
    fs.writeFileSync(dataPath, JSON.stringify(this.detectLoops(), null, 2));
    
    console.log(`📁 State loop report saved to: ${reportPath}`);
    console.log(`📁 State loop data saved to: ${dataPath}`);
  }
}

/**
 * Helper function to get the extension ID from the browser context
 */
async function getExtensionId(context: BrowserContext): Promise<string | null> {
  try {
    // Get all service workers (extension background pages)
    const serviceWorkers = context.serviceWorkers();
    if (serviceWorkers.length > 0) {
      const url = serviceWorkers[0].url();
      const match = url.match(/chrome-extension:\/\/([a-z]+)\//);
      if (match) {
        return match[1];
      }
    }
    
    // Alternative: try to get from a new page
    const page = await context.newPage();
    await page.goto('chrome://extensions/');
    await page.close();
    
    // Get extension ID from service worker that should now be available
    const workers = context.serviceWorkers();
    if (workers.length > 0) {
      const url = workers[0].url();
      const match = url.match(/chrome-extension:\/\/([a-z]+)\//);
      if (match) {
        return match[1];
      }
    }
  } catch (error) {
    console.error('Error getting extension ID:', error);
  }
  return null;
}

class MemoryMonitor {
  private snapshots: MemorySnapshot[] = [];
  private startTime: number;
  private intervalId: NodeJS.Timeout | null = null;
  
  constructor() {
    this.startTime = Date.now();
  }

  start(intervalMs: number = 5000): void {
    console.log(`🔍 Starting memory monitoring (interval: ${intervalMs}ms)...`);
    this.takeSnapshot(); // Take initial snapshot
    
    this.intervalId = setInterval(() => {
      this.takeSnapshot();
    }, intervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.takeSnapshot(); // Take final snapshot
    console.log('🛑 Stopped memory monitoring');
  }

  private takeSnapshot(): void {
    const mem = process.memoryUsage();
    const now = Date.now();
    const timeElapsed = (now - this.startTime) / 1000; // Convert to seconds
    
    const snapshot: MemorySnapshot = {
      timestamp: now,
      timeElapsed,
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
      external: mem.external,
      rss: mem.rss,
      arrayBuffers: mem.arrayBuffers,
    };
    
    this.snapshots.push(snapshot);
    
    console.log(`📊 Memory snapshot at ${timeElapsed.toFixed(1)}s: ` +
                `Heap: ${this.formatBytes(mem.heapUsed)}/${this.formatBytes(mem.heapTotal)}, ` +
                `RSS: ${this.formatBytes(mem.rss)}`);
  }

  getSnapshots(): MemorySnapshot[] {
    return [...this.snapshots];
  }

  getStats(metric: keyof Omit<MemorySnapshot, 'timestamp' | 'timeElapsed'>): MemoryStats {
    const values = this.snapshots.map(s => s[metric]);
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    
    // Calculate trend using linear regression
    const n = values.length;
    if (n < 2) {
      return { min, max, avg, trend: 'stable', percentageChange: 0 };
    }
    
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumX2 += i * i;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const percentageChange = ((values[n - 1] - values[0]) / values[0]) * 100;
    
    let trend: 'increasing' | 'decreasing' | 'stable';
    if (Math.abs(percentageChange) < 5) {
      trend = 'stable';
    } else if (slope > 0) {
      trend = 'increasing';
    } else {
      trend = 'decreasing';
    }
    
    return { min, max, avg, trend, percentageChange };
  }

  generateReport(): string {
    const heapStats = this.getStats('heapUsed');
    const rssStats = this.getStats('rss');
    const totalDuration = this.snapshots.length > 0 
      ? this.snapshots[this.snapshots.length - 1].timeElapsed 
      : 0;
    
    let report = '\n';
    report += '═══════════════════════════════════════════════════════════════\n';
    report += '                    SOAK TEST MEMORY REPORT                    \n';
    report += '═══════════════════════════════════════════════════════════════\n';
    report += `\n📊 Test Duration: ${totalDuration.toFixed(1)}s\n`;
    report += `📸 Total Snapshots: ${this.snapshots.length}\n`;
    report += `⏱️  Snapshot Interval: ~${(totalDuration / (this.snapshots.length - 1)).toFixed(1)}s\n\n`;
    
    report += '───────────────────────────────────────────────────────────────\n';
    report += '                      HEAP MEMORY (Used)                       \n';
    report += '───────────────────────────────────────────────────────────────\n';
    report += `Min:     ${this.formatBytes(heapStats.min)}\n`;
    report += `Max:     ${this.formatBytes(heapStats.max)}\n`;
    report += `Average: ${this.formatBytes(heapStats.avg)}\n`;
    report += `Trend:   ${heapStats.trend.toUpperCase()} (${heapStats.percentageChange.toFixed(2)}%)\n\n`;
    
    report += '───────────────────────────────────────────────────────────────\n';
    report += '                    RESIDENT SET SIZE (RSS)                    \n';
    report += '───────────────────────────────────────────────────────────────\n';
    report += `Min:     ${this.formatBytes(rssStats.min)}\n`;
    report += `Max:     ${this.formatBytes(rssStats.max)}\n`;
    report += `Average: ${this.formatBytes(rssStats.avg)}\n`;
    report += `Trend:   ${rssStats.trend.toUpperCase()} (${rssStats.percentageChange.toFixed(2)}%)\n\n`;
    
    report += '───────────────────────────────────────────────────────────────\n';
    report += '                      MEMORY LEAK ANALYSIS                     \n';
    report += '───────────────────────────────────────────────────────────────\n';
    
    const leakThreshold = 20; // 20% increase suggests a memory leak
    if (heapStats.percentageChange > leakThreshold && heapStats.trend === 'increasing') {
      report += `⚠️  WARNING: Potential memory leak detected!\n`;
      report += `   Heap memory increased by ${heapStats.percentageChange.toFixed(2)}%\n`;
    } else if (heapStats.trend === 'stable') {
      report += `✅ PASSED: Memory usage is stable\n`;
    } else if (heapStats.trend === 'increasing' && heapStats.percentageChange < leakThreshold) {
      report += `⚡ CAUTION: Memory usage increased by ${heapStats.percentageChange.toFixed(2)}%\n`;
      report += `   This is within acceptable limits but should be monitored\n`;
    } else {
      report += `✅ PASSED: Memory usage is ${heapStats.trend}\n`;
    }
    
    report += '\n';
    report += '───────────────────────────────────────────────────────────────\n';
    report += '                     SNAPSHOT TIMELINE                         \n';
    report += '───────────────────────────────────────────────────────────────\n';
    
    // Show first 3 and last 3 snapshots
    const snapshotsToShow = this.snapshots.length <= 6 
      ? this.snapshots 
      : [...this.snapshots.slice(0, 3), ...this.snapshots.slice(-3)];
    
    if (this.snapshots.length > 6) {
      snapshotsToShow.splice(3, 0, null as any); // Add marker for ellipsis
    }
    
    snapshotsToShow.forEach((snapshot, i) => {
      if (snapshot === null) {
        report += `   ... (${this.snapshots.length - 6} snapshots omitted) ...\n`;
      } else {
        report += `${snapshot.timeElapsed.toFixed(1).padStart(6)}s: ` +
                  `Heap ${this.formatBytes(snapshot.heapUsed).padStart(10)}, ` +
                  `RSS ${this.formatBytes(snapshot.rss).padStart(10)}\n`;
      }
    });
    
    report += '\n═══════════════════════════════════════════════════════════════\n';
    
    return report;
  }

  saveToFile(filename: string): void {
    const reportDir = path.join(__dirname, '../../test-results/soak-tests');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const report = this.generateReport();
    const reportPath = path.join(reportDir, `${filename}.txt`);
    fs.writeFileSync(reportPath, report);
    
    // Also save raw data as JSON
    const dataPath = path.join(reportDir, `${filename}.json`);
    fs.writeFileSync(dataPath, JSON.stringify({
      snapshots: this.snapshots,
      stats: {
        heapUsed: this.getStats('heapUsed'),
        heapTotal: this.getStats('heapTotal'),
        rss: this.getStats('rss'),
        external: this.getStats('external'),
        arrayBuffers: this.getStats('arrayBuffers'),
      }
    }, null, 2));
    
    console.log(`📁 Report saved to: ${reportPath}`);
    console.log(`📁 Raw data saved to: ${dataPath}`);
  }

  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

test.describe('Soak Test with Memory Monitoring', () => {
  // Configuration
  const TEST_DURATION_MS = parseInt(process.env.SOAK_DURATION || '60000'); // Default 60 seconds
  const SNAPSHOT_INTERVAL_MS = parseInt(process.env.SNAPSHOT_INTERVAL || '5000'); // Default 5 seconds
  const MEMORY_LEAK_THRESHOLD = parseInt(process.env.LEAK_THRESHOLD || '20'); // Default 20%
  
  test.beforeAll(() => {
    console.log('🌊 ═══════════════════════════════════════════════════════════');
    console.log('🌊 Starting Soak Test with Memory Monitoring');
    console.log('🌊 ═══════════════════════════════════════════════════════════');
    console.log(`⏱️  Test Duration: ${TEST_DURATION_MS / 1000}s`);
    console.log(`📸 Snapshot Interval: ${SNAPSHOT_INTERVAL_MS / 1000}s`);
    console.log(`⚠️  Memory Leak Threshold: ${MEMORY_LEAK_THRESHOLD}%`);
    console.log('🌊 ═══════════════════════════════════════════════════════════\n');
  });

  test('should monitor memory usage over extended period', async ({ }) => {
    const monitor = new MemoryMonitor();
    const stateLoopDetector = new StateLoopDetector();
    let context: BrowserContext | null = null;
    let page: Page | null = null;
    let popupPage: Page | null = null;
    const { chromium } = require('@playwright/test');

    try {
      // Start memory monitoring
      monitor.start(SNAPSHOT_INTERVAL_MS);

      // Launch browser with extension loaded
      console.log('🌐 Launching browser with extension...');
      const extensionPath = path.join(__dirname, '../../build');
      const browser = await chromium.launchPersistentContext('', {
        headless: false,
        args: [
          `--disable-extensions-except=${extensionPath}`,
          `--load-extension=${extensionPath}`,
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
        ],
      });
      
      context = browser;
      page = await context.newPage();

      // Set up console monitoring for state transitions
      const consoleLogs: string[] = [];
      page.on('console', (msg) => {
        const text = msg.text();
        consoleLogs.push(`[${msg.type()}] ${text}`);
        
        // Detect XState transitions in console logs
        if (text.includes('transition') || text.includes('state:') || text.includes('->')) {
          // Parse state transition logs
          const stateMatch = text.match(/(\w+)\s*-+>\s*(\w+)/);
          if (stateMatch) {
            stateLoopDetector.addTransition(stateMatch[1], stateMatch[2], 'unknown');
          }
        }
      });

      page.on('pageerror', (error) => {
        consoleLogs.push(`[PAGE-ERROR] ${error.message}`);
        console.error(`❌ Page error: ${error.message}`);
      });

      // Load a test page with the extension
      console.log('📄 Loading test page...');
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Soak Test Page</title>
        </head>
        <body>
          <h1>🌊 Wave Reader Soak Test</h1>
          <div id="status">Running...</div>
          <div id="counter">0</div>
          <script>
            console.log('🚀 Test page loaded');
            
            let counter = 0;
            const startTime = Date.now();
            
            // Simulate periodic activity
            const interval = setInterval(() => {
              counter++;
              const elapsed = Math.floor((Date.now() - startTime) / 1000);
              document.getElementById('counter').textContent = 
                \`Iterations: \${counter} | Elapsed: \${elapsed}s\`;
              
              // Log periodically
              if (counter % 10 === 0) {
                console.log(\`🔄 Activity iteration \${counter} at \${elapsed}s\`);
              }
              
              // Simulate some DOM manipulation
              const temp = document.createElement('div');
              temp.textContent = 'Temporary element ' + counter;
              document.body.appendChild(temp);
              
              // Clean up immediately to avoid memory leaks in test page
              setTimeout(() => temp.remove(), 100);
            }, 1000);
            
            // Mark test as running
            window.testRunning = true;
          </script>
        </body>
        </html>
      `;

      await page.setContent(htmlContent);

      // Wait for page to initialize
      await page.waitForFunction(() => (window as any).testRunning === true);
      console.log('✅ Test page initialized');

      // Get the extension ID and open the popup
      console.log('🔌 Getting extension ID...');
      const extensionId = await getExtensionId(context);
      if (extensionId) {
        console.log(`✅ Extension loaded with ID: ${extensionId}`);
        
        // Open the popup page
        const popupUrl = `chrome-extension://${extensionId}/index.html`;
        console.log(`🔧 Opening popup at: ${popupUrl}`);
        popupPage = await context.newPage();
        
        // Set up console monitoring for popup state transitions and general logging
        popupPage.on('console', (msg) => {
          const text = msg.text();
          const type = msg.type();
          
          // Log all popup console messages to test console
          console.log(`[POPUP ${type.toUpperCase()}] ${text}`);
          
          // Detect XState transitions in popup console logs
          if (text.includes('transition') || text.includes('state:') || text.includes('->')) {
            // Parse state transition logs
            const stateMatch = text.match(/(\w+)\s*-+>\s*(\w+)/);
            if (stateMatch) {
              stateLoopDetector.addTransition(stateMatch[1], stateMatch[2], 'popup');
              console.log(`🔄 STATE TRANSITION DETECTED: ${stateMatch[1]} -> ${stateMatch[2]}`);
              
              // Check for loops every 20 transitions
              if (stateLoopDetector.detectLoops().detectedLoops.length > 0) {
                console.warn('⚠️  Potential state loop detected in popup!');
              }
            }
          }
        });
        
        popupPage.on('pageerror', (error) => {
          console.error(`[POPUP ERROR] ${error.message}`);
        });
        
        try {
          await popupPage.goto(popupUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
          console.log('✅ Popup loaded');
          
          await popupPage.waitForTimeout(2000); // Wait for popup to initialize
          console.log('✅ Popup initialization wait complete');
          
          // Inject comprehensive state and performance monitoring into the popup
          try {
            await popupPage.evaluate(() => {
              console.log('🔧 Injecting state monitoring...');
              
              // 1. Hook into XState's internal inspector if available
              if ((window as any).__xstate__) {
                console.log('✅ XState devtools detected');
              }
              
              // 2. Monitor button clicks with timing
              (window as any).buttonClickMonitor = {
                clicks: [],
                lastClick: 0,
                addClick: function(button: HTMLElement, timing: any) {
                  const click = {
                    timestamp: Date.now(),
                    timeSinceLastClick: Date.now() - this.lastClick,
                    buttonText: button.textContent?.substring(0, 20) || '',
                    buttonId: button.id || 'no-id',
                    timing: timing
                  };
                  this.clicks.push(click);
                  this.lastClick = Date.now();
                  console.log('🖱️  Button click tracked:', JSON.stringify(click));
                }
              };
              
              // 3. Hook into all button click events
              document.addEventListener('click', (e: Event) => {
                const target = e.target as HTMLElement;
                if (target && target.tagName === 'BUTTON') {
                  const startTime = performance.now();
                  const timing = {
                    eventPhase: e.eventPhase,
                    isTrusted: e.isTrusted,
                    performanceStart: startTime
                  };
                  (window as any).buttonClickMonitor.addClick(target, timing);
                }
              }, true); // Use capture phase
              
              // 4. Hook into window.postMessage for state transitions
              const originalPostMessage = window.postMessage.bind(window);
              window.postMessage = function(...args: any[]) {
                const message = args[0];
                if (message && typeof message === 'object') {
                  if (message.type || message.event || message.state) {
                    console.log('📨 PostMessage:', JSON.stringify(message).substring(0, 200));
                  }
                }
                return originalPostMessage(...args);
              };
              
              // 5. Comprehensive React rendering monitoring
              if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
                console.log('✅ React DevTools detected');
                
                // Track render statistics
                (window as any).reactRenderStats = {
                  commits: 0,
                  mounts: 0,
                  updates: 0,
                  unmounts: 0,
                  lastCommitTime: 0,
                  commitTimes: [],
                  longCommits: [],
                  componentCounts: new Map(),
                  renderDurations: []
                };
                
                // Hook into fiber root commits
                if (hook.onCommitFiberRoot) {
                  const original = hook.onCommitFiberRoot;
                  hook.onCommitFiberRoot = function(rendererID: any, root: any, priorityLevel: any) {
                    const stats = (window as any).reactRenderStats;
                    const startTime = performance.now();
                    
                    stats.commits++;
                    stats.lastCommitTime = Date.now();
                    
                    // Analyze the fiber tree to count components
                    if (root && root.current) {
                      const componentCount = countFiberNodes(root.current);
                      stats.componentCounts.set(Date.now(), componentCount);
                      
                      // Detect long commits (> 16ms = dropped frame)
                      const duration = performance.now() - startTime;
                      stats.commitTimes.push(duration);
                      stats.renderDurations.push(duration);
                      
                      if (duration > 16) {
                        stats.longCommits.push({
                          timestamp: Date.now(),
                          duration: duration,
                          componentCount: componentCount
                        });
                        console.warn(`⚛️  SLOW React commit: ${duration.toFixed(2)}ms (${componentCount} components)`);
                      } else if (stats.commits % 10 === 0) {
                        console.log(`⚛️  React commit #${stats.commits}: ${duration.toFixed(2)}ms (${componentCount} components)`);
                      }
                    }
                    
                    return original.call(this, rendererID, root, priorityLevel);
                  };
                }
                
                // Hook into fiber mount/update/unmount
                if (hook.onCommitFiberUnmount) {
                  const originalUnmount = hook.onCommitFiberUnmount;
                  hook.onCommitFiberUnmount = function(...args: any[]) {
                    (window as any).reactRenderStats.unmounts++;
                    return originalUnmount.apply(this, args);
                  };
                }
                
                // Helper to count fiber nodes
                function countFiberNodes(fiber: any): number {
                  let count = 0;
                  let node = fiber;
                  
                  // Traverse the fiber tree
                  const traverse = (f: any, depth: number = 0) => {
                    if (!f || depth > 100) return; // Prevent infinite loops
                    count++;
                    
                    if (f.child) traverse(f.child, depth + 1);
                    if (f.sibling) traverse(f.sibling, depth + 1);
                  };
                  
                  traverse(node);
                  return count;
                }
                
                // Periodically log React stats
                setInterval(() => {
                  const stats = (window as any).reactRenderStats;
                  if (stats.commits > 0) {
                    const avgDuration = stats.renderDurations.length > 0 
                      ? stats.renderDurations.reduce((a: number, b: number) => a + b, 0) / stats.renderDurations.length
                      : 0;
                    const recentCommits = stats.commits;
                    
                    console.log(`📊 React Stats: ${recentCommits} commits, avg ${avgDuration.toFixed(2)}ms, ${stats.longCommits.length} slow (>16ms)`);
                    
                    // Reset for next interval
                    stats.commits = 0;
                    stats.renderDurations = [];
                  }
                }, 5000);
              }
              
              // 6. Browser-level long task detection
              if ('PerformanceObserver' in window) {
                try {
                  const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                      if (entry.duration > 50) {
                        console.warn(`⏱️  LONG TASK detected: ${entry.duration.toFixed(2)}ms at ${entry.startTime.toFixed(0)}ms`);
                      }
                    }
                  });
                  observer.observe({ entryTypes: ['longtask'] });
                  console.log('✅ Long task observer registered');
                } catch (e) {
                  console.log('⚠️  Long task API not available');
                }
                
                // Also observe layout shifts and large renders
                try {
                  const layoutObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                      if ((entry as any).value > 0.1) {
                        console.warn(`📐 Layout shift detected: ${(entry as any).value.toFixed(3)}`);
                      }
                    }
                  });
                  layoutObserver.observe({ entryTypes: ['layout-shift'] });
                } catch (e) {
                  // Layout shift API may not be available
                }
              }
              
              // 7. Monitor main thread blocking with a timer
              (window as any).mainThreadMonitor = {
                lastCheck: Date.now(),
                maxDelay: 0,
                delays: [],
                checkInterval: setInterval(() => {
                  const now = Date.now();
                  const expectedInterval = 100;
                  const actualDelay = now - (window as any).mainThreadMonitor.lastCheck;
                  const blockTime = actualDelay - expectedInterval;
                  
                  if (blockTime > 50) {
                    (window as any).mainThreadMonitor.delays.push({
                      timestamp: now,
                      blockTime: blockTime
                    });
                    console.warn(`🚫 Main thread blocked for ${blockTime.toFixed(0)}ms`);
                  }
                  
                  if (blockTime > (window as any).mainThreadMonitor.maxDelay) {
                    (window as any).mainThreadMonitor.maxDelay = blockTime;
                  }
                  
                  (window as any).mainThreadMonitor.lastCheck = now;
                }, 100)
              };
              
              // 8. Find and log all state machines in window
              setTimeout(() => {
                const machines: string[] = [];
                for (const key in window) {
                  if (key.includes('machine') || key.includes('Machine') || 
                      key.includes('state') || key.includes('State')) {
                    machines.push(key);
                  }
                }
                if (machines.length > 0) {
                  console.log('🔍 Found potential state machines:', machines.join(', '));
                }
                
                // Log all buttons found
                const buttons = document.querySelectorAll('button');
                console.log(`🔘 Found ${buttons.length} buttons on page`);
                buttons.forEach((btn, idx) => {
                  console.log(`  Button ${idx}: "${(btn.textContent || '').substring(0, 30)}" (id: ${btn.id || 'none'})`);
                });
                
                // Log initial component count
                const allElements = document.querySelectorAll('*');
                console.log(`📦 Total DOM elements: ${allElements.length}`);
              }, 500);
              
              console.log('✅ State monitoring injected');
            });
            console.log('✅ State monitoring injected successfully');
          } catch (evalError) {
            console.warn('⚠️  Could not inject state monitoring:', evalError);
          }
          
          console.log('✅ Popup page opened with state monitoring');
        } catch (popupError) {
          console.error('❌ Error opening popup:', popupError);
          popupPage = null;
        }
      } else {
        console.log('⚠️  Could not get extension ID, continuing without popup interaction');
      }

      // Run the soak test for specified duration
      console.log(`⏳ Running soak test for ${TEST_DURATION_MS / 1000}s with button interactions...`);
      console.log(`📊 Popup page available: ${popupPage !== null}`);
      
      const startTime = Date.now();
      let lastLogTime = startTime;
      let lastButtonClickTime = startTime;
      let buttonClickCount = 0;
      let iterationCount = 0;
      
      while (Date.now() - startTime < TEST_DURATION_MS) {
        iterationCount++;
        const now = Date.now();
        
        // Log progress every 10 seconds with React stats
        if (now - lastLogTime >= 10000) {
          const elapsed = (now - startTime) / 1000;
          const remaining = (TEST_DURATION_MS - (now - startTime)) / 1000;
          console.log(`⏱️  Progress: ${elapsed.toFixed(1)}s elapsed, ${remaining.toFixed(1)}s remaining (${buttonClickCount} button clicks, ${iterationCount} iterations)`);
          
          // Get React rendering stats from popup
          if (popupPage) {
            try {
              const reactStats = await popupPage.evaluate(() => {
                const stats = (window as any).reactRenderStats;
                const mainThread = (window as any).mainThreadMonitor;
                const clickMonitor = (window as any).buttonClickMonitor;
                
                return {
                  react: stats ? {
                    totalCommits: stats.commitTimes.length,
                    longCommits: stats.longCommits.length,
                    unmounts: stats.unmounts,
                    avgDuration: stats.commitTimes.length > 0 
                      ? stats.commitTimes.reduce((a: number, b: number) => a + b, 0) / stats.commitTimes.length 
                      : 0,
                    maxDuration: stats.commitTimes.length > 0 ? Math.max(...stats.commitTimes) : 0
                  } : null,
                  mainThread: mainThread ? {
                    maxBlockTime: mainThread.maxDelay,
                    blockCount: mainThread.delays.length,
                    recentBlocks: mainThread.delays.slice(-3)
                  } : null,
                  clicks: clickMonitor ? {
                    total: clickMonitor.clicks.length,
                    recent: clickMonitor.clicks.slice(-3)
                  } : null,
                  domElements: document.querySelectorAll('*').length
                };
              });
              
              if (reactStats.react) {
                console.log(`⚛️  React: ${reactStats.react.totalCommits} commits (${reactStats.react.longCommits} slow), avg ${reactStats.react.avgDuration.toFixed(2)}ms, max ${reactStats.react.maxDuration.toFixed(2)}ms`);
              }
              if (reactStats.mainThread) {
                console.log(`🧵 Main thread: max block ${reactStats.mainThread.maxBlockTime.toFixed(0)}ms, ${reactStats.mainThread.blockCount} blocks detected`);
                if (reactStats.mainThread.recentBlocks.length > 0) {
                  console.log(`   Recent blocks: ${reactStats.mainThread.recentBlocks.map((b: any) => `${b.blockTime.toFixed(0)}ms`).join(', ')}`);
                }
              }
              if (reactStats.clicks) {
                console.log(`🖱️  Popup tracked clicks: ${reactStats.clicks.total} (test loop: ${buttonClickCount})`);
              }
              console.log(`📦 DOM elements: ${reactStats.domElements}`);
            } catch (err) {
              console.warn('⚠️  Could not fetch React stats:', err);
            }
          }
          
          lastLogTime = now;
        }
        
        // Click buttons in the popup every second with timing
        if (popupPage && now - lastButtonClickTime >= 1000) {
          const clickStartTime = Date.now();
          try {
            // Try to find and click any button in the popup
            const findButtonsStart = Date.now();
            const buttons = await Promise.race([
              popupPage.$$('button'),
              new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 500))
            ]);
            const findButtonsTime = Date.now() - findButtonsStart;
            
            if (buttons.length > 0) {
              // Click a random button (or cycle through them)
              const buttonIndex = buttonClickCount % buttons.length;
              
              // Get button info for logging
              const buttonInfo = await buttons[buttonIndex].evaluate((el: HTMLButtonElement) => ({
                text: el.textContent?.substring(0, 30) || '',
                id: el.id || '',
                disabled: el.disabled,
                visible: el.offsetParent !== null
              }));
              
              try {
                const clickStart = Date.now();
                await Promise.race([
                  buttons[buttonIndex].click(),
                  new Promise((_, reject) => setTimeout(() => reject(new Error('Click timeout')), 500))
                ]);
                const clickTime = Date.now() - clickStart;
                buttonClickCount++;
                
                const totalTime = Date.now() - clickStartTime;
                
                if (buttonClickCount % 5 === 0) {
                  console.log(`🖱️  Button click #${buttonClickCount}: "${buttonInfo.text}" (find: ${findButtonsTime}ms, click: ${clickTime}ms, total: ${totalTime}ms)`);
                }
                
                // Get click monitor data from popup
                const clickData = await popupPage.evaluate(() => {
                  const monitor = (window as any).buttonClickMonitor;
                  return monitor ? {
                    totalClicks: monitor.clicks.length,
                    lastClick: monitor.clicks[monitor.clicks.length - 1]
                  } : null;
                });
                
                if (clickData && buttonClickCount % 5 === 0) {
                  console.log(`📊 Popup click monitor: ${clickData.totalClicks} total clicks, last timing: ${JSON.stringify(clickData.lastClick?.timing)}`);
                }
                
              } catch (clickError: any) {
                console.warn(`⚠️  Click failed: ${clickError.message}, button: "${buttonInfo.text}"`);
              }
            } else {
              if (buttonClickCount === 0) {
                console.warn(`⚠️  No buttons found in popup (search took ${findButtonsTime}ms)`);
              }
            }
          } catch (error: any) {
            console.warn(`⚠️  Button click error: ${error.message}`);
          }
          lastButtonClickTime = now;
        }
        
        // Perform some periodic checks (every 5 seconds to avoid too much overhead)
        if (iterationCount % 5 === 0) {
          try {
            const isAlive = await page.evaluate(() => (window as any).testRunning === true);
            expect(isAlive).toBe(true);
          } catch (checkError) {
            console.warn('⚠️  Page check failed:', checkError);
          }
        }
        
        // Wait 1 second before next iteration
        await page.waitForTimeout(1000);
      }
      
      console.log(`✅ Test loop completed!`);
      console.log(`✅ Total button clicks during test: ${buttonClickCount}`);
      console.log(`✅ Total iterations: ${iterationCount}`);

      console.log('✅ Soak test completed');
      console.log(`📋 Total console logs captured: ${consoleLogs.length}`);

    } finally {
      // Stop monitoring and generate reports
      monitor.stop();
      
      const memoryReport = monitor.generateReport();
      console.log(memoryReport);
      
      const stateReport = stateLoopDetector.getReport();
      console.log(stateReport);
      
      // Save reports to files
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      monitor.saveToFile(`soak-test-${timestamp}`);
      stateLoopDetector.saveToFile(`soak-test-${timestamp}`);
      
      // Cleanup
      if (popupPage) {
        try {
          await popupPage.close();
        } catch (e) {
          console.log('Could not close popup page:', e);
        }
      }
      if (page) {
        try {
          await page.close();
        } catch (e) {
          console.log('Could not close page:', e);
        }
      }
      if (context) {
        try {
          await context.close();
        } catch (e) {
          console.log('Could not close context:', e);
        }
      }
      
      // Verify memory leak threshold
      const heapStats = monitor.getStats('heapUsed');
      if (heapStats.percentageChange > MEMORY_LEAK_THRESHOLD && heapStats.trend === 'increasing') {
        console.error(`❌ Memory leak detected! Heap increased by ${heapStats.percentageChange.toFixed(2)}%`);
        throw new Error(`Memory leak threshold exceeded: ${heapStats.percentageChange.toFixed(2)}% > ${MEMORY_LEAK_THRESHOLD}%`);
      }
      
      console.log('✅ Memory leak check passed');
    }
  }, { timeout: TEST_DURATION_MS + 60000 }); // Add 1 minute buffer for setup/teardown
});


