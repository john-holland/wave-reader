# 🌊 Soak Test with Memory Monitoring

## Overview

The soak test is designed to run the Wave Reader extension for extended periods while monitoring memory usage. This helps detect memory leaks and ensure stability over time.

## Features

- **Real-time Memory Monitoring**: Captures memory snapshots at regular intervals
- **Memory Leak Detection**: Analyzes trends to detect potential memory leaks
- **Detailed Reports**: Generates comprehensive reports with statistics and analysis
- **Configurable Duration**: Run tests from 30 seconds to multiple hours
- **Multiple Presets**: Quick, medium, long, and stress test configurations

## Quick Start

### Using npm scripts (Recommended)

```bash
# Quick test (30 seconds)
npm run test:soak:quick

# Default test (1 minute)
npm run test:soak

# Medium test (5 minutes)
npm run test:soak:medium

# Long test (30 minutes)
npm run test:soak:long

# Stress test (1 hour)
npm run test:soak:stress
```

### Using the script directly

```bash
# Run with default settings (60 seconds, 5-second intervals)
./scripts/run-soak-test.sh

# Custom duration and interval
./scripts/run-soak-test.sh --duration 120000 --interval 10000

# Show help
./scripts/run-soak-test.sh --help
```

## Configuration

### Environment Variables

You can set these environment variables to customize the test:

- `SOAK_DURATION`: Test duration in milliseconds (default: 60000)
- `SNAPSHOT_INTERVAL`: Interval between memory snapshots in milliseconds (default: 5000)
- `LEAK_THRESHOLD`: Memory increase percentage that triggers a failure (default: 20)

### Command-line Options

```bash
-d, --duration MILLISECONDS    Test duration in milliseconds
-i, --interval MILLISECONDS    Snapshot interval in milliseconds
-t, --threshold PERCENTAGE     Memory leak threshold percentage

Presets:
--quick                        30s duration, 2s interval
--medium                       5min duration, 10s interval
--long                         30min duration, 30s interval
--stress                       1hr duration, 1min interval
```

## Understanding the Reports

### Report Sections

1. **Test Duration**: Total time the test ran
2. **Heap Memory (Used)**: Statistics about heap memory usage
   - Min/Max/Average values
   - Trend analysis (increasing/decreasing/stable)
   - Percentage change over the test period

3. **Resident Set Size (RSS)**: Total memory allocated by the process
   - Similar statistics as heap memory
   - RSS includes heap, stack, and other memory allocations

4. **Memory Leak Analysis**: Automated analysis that flags potential issues
   - ✅ PASSED: Memory is stable or within acceptable limits
   - ⚡ CAUTION: Memory increased but within threshold
   - ⚠️ WARNING: Potential memory leak detected

5. **Snapshot Timeline**: Detailed view of memory usage over time

### Report Location

Reports are saved in two formats:

- **Text Report**: `test-results/soak-tests/soak-test-TIMESTAMP.txt`
- **JSON Data**: `test-results/soak-tests/soak-test-TIMESTAMP.json`

The JSON file contains raw data that can be used for further analysis or visualization.

## Interpreting Results

### Stable Memory Usage (Good)
```
Trend: STABLE (2.34%)
```
Memory usage stays relatively constant. This is ideal.

### Acceptable Growth (Caution)
```
Trend: INCREASING (12.56%)
```
Memory is growing but under the threshold (default 20%). Monitor this.

### Memory Leak (Warning)
```
Trend: INCREASING (35.78%)
⚠️ WARNING: Potential memory leak detected!
```
Memory grew beyond the acceptable threshold. Investigation needed.

## Best Practices

### When to Run Soak Tests

1. **Before Releases**: Run a long or stress test to ensure stability
2. **After Major Changes**: Verify that new code doesn't introduce leaks
3. **Regular Testing**: Schedule periodic soak tests (e.g., nightly builds)
4. **Performance Investigation**: When users report slowdowns or crashes

### Recommended Test Durations

- **Development**: Quick test (30s) for rapid feedback
- **Pre-commit**: Default test (1 minute) to catch obvious issues
- **CI/CD**: Medium test (5 minutes) for comprehensive checks
- **Release Validation**: Long test (30 minutes) or stress test (1 hour)

### Interpreting Trends

- **Stable**: ±5% change - Normal memory fluctuations
- **Increasing < 20%**: Minor growth, likely acceptable
- **Increasing > 20%**: Potential memory leak, needs investigation
- **Decreasing**: Usually indicates good garbage collection

## Troubleshooting

### Test Times Out

If the test times out, try:
- Reducing the test duration
- Increasing the Playwright timeout in `playwright.config.ts`
- Checking system resources

### High Memory Usage

If memory usage is consistently high:
1. Check the baseline memory (first snapshot)
2. Compare with other tests
3. Profile the application for memory-intensive operations

### False Positives

Memory can naturally increase during:
- Caching operations
- Loading resources
- Building up state

Use longer test durations to see if memory stabilizes after initial growth.

## Advanced Usage

### Custom Test Scenarios

You can modify `test/playwright/soak-test-memory.test.ts` to:
- Load specific pages or content
- Simulate user interactions
- Test specific features
- Add browser extension testing

### Integration with CI/CD

```yaml
# Example GitHub Actions workflow
- name: Run Soak Test
  run: npm run test:soak:medium
  env:
    LEAK_THRESHOLD: 15
```

### Analyzing JSON Data

The JSON output can be imported into data analysis tools:

```javascript
const data = require('./test-results/soak-tests/soak-test-TIMESTAMP.json');
const snapshots = data.snapshots;

// Calculate memory growth rate
const firstHeap = snapshots[0].heapUsed;
const lastHeap = snapshots[snapshots.length - 1].heapUsed;
const growthRate = (lastHeap - firstHeap) / firstHeap;
```

## Memory Metrics Explained

### Heap Used
The actual memory being used by JavaScript objects. This is the most important metric for detecting memory leaks.

### Heap Total
Total allocated heap memory. Can grow as V8 requests more memory from the system.

### RSS (Resident Set Size)
Total memory allocated by the Node.js process, including:
- Heap memory
- Code segment
- Stack
- C++ objects

### External
Memory used by C++ objects bound to JavaScript objects.

### Array Buffers
Memory allocated for ArrayBuffers and SharedArrayBuffers.

## Examples

### Example 1: Quick Development Check
```bash
# Fast feedback during development
npm run test:soak:quick
```

### Example 2: Custom Configuration
```bash
# 2-minute test with 3-second snapshots and strict threshold
SOAK_DURATION=120000 SNAPSHOT_INTERVAL=3000 LEAK_THRESHOLD=10 npm run test:soak
```

### Example 3: Overnight Stress Test
```bash
# Run overnight with hourly snapshots
./scripts/run-soak-test.sh --duration 28800000 --interval 3600000
# 8 hours with hourly snapshots
```

## Contributing

If you find issues or have suggestions for improving the soak test:

1. Check existing reports in `test-results/soak-tests/`
2. Document your findings
3. Submit an issue or PR with improvements

## References

- [Node.js Memory Management](https://nodejs.org/api/process.html#processmemoryusage)
- [V8 Memory Management](https://v8.dev/blog/trash-talk)
- [Playwright Testing](https://playwright.dev/)
- [Memory Leak Detection Patterns](https://web.dev/memory/)

---

**Happy Testing! 🌊**


