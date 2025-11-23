# Wave Cycle Tests

This directory contains tests to verify that the wave start/stop cycle works correctly and doesn't cause loops or hanging issues.

## Test Files

### 1. `test-wave-cycle.js` - Full Automated Test
- Uses Puppeteer to automate browser testing
- Tests 10 complete start/stop cycles
- Measures timing and loop detection stats
- Provides detailed reporting

**Usage:**
```bash
npm install puppeteer  # if not already installed
node test-wave-cycle.js
```

### 2. `test-wave-cycle-simple.js` - Simple Automated Test
- Simpler version using browser console
- Easier to debug and modify
- Tests wave cycles via console commands

**Usage:**
```bash
node test-wave-cycle-simple.js
```

### 3. `test-wave-cycle-manual.html` - Manual Testing Interface
- Interactive HTML page for manual testing
- Real-time loop detection stats
- Step-by-step cycle testing
- Visual feedback and logging

**Usage:**
1. Open `test-wave-cycle-manual.html` in a browser
2. Load the wave-reader extension
3. Use the interface to test wave cycles manually

## What the Tests Verify

### ✅ Success Criteria
- **No Hanging**: Wave starts and stops within reasonable time (2-5 seconds)
- **No Loops**: Loop detection shows reasonable event/state counts
- **Consistent Behavior**: All 10 cycles behave similarly
- **Proper Cleanup**: No memory leaks or lingering state

### 📊 Metrics Tracked
- **Initialization Time**: Time from start command to ready state
- **Event Frequency**: Number of events per cycle
- **State Frequency**: Number of state changes per cycle
- **Success Rate**: Percentage of successful cycles
- **Loop Detection**: Identification of excessive event/state repetition

### 🚨 Warning Thresholds
- **High Event Frequency**: > 20 events per cycle
- **High State Frequency**: > 10 state changes per cycle
- **Slow Initialization**: > 10 seconds to start
- **Low Success Rate**: < 80% successful cycles

## Expected Results After Fix

With the loop detection fixes applied, you should see:

```
🌊 Test Results Summary:
========================
Total Cycles: 10
Successful: 10
Failed: 0
Success Rate: 100.0%
Average Init Time: ~2000ms
Max Init Time: ~3000ms
Min Init Time: ~1500ms

🔄 Loop Detection Analysis:
Average Events per Cycle: ~5
Average States per Cycle: ~3
Max Events in Cycle: ~8
Max States in Cycle: ~5

🎯 Test Conclusion:
Test PASSED
- Success Rate: ✅ (100.0%)
- Loop Detection: ✅ (Max events: 8, Max states: 5)
```

## Troubleshooting

### If Tests Fail

1. **Check Extension Loading**
   - Ensure the extension is properly built (`npm run build`)
   - Verify the extension loads in the browser

2. **Check Loop Detection**
   - Look for high event/state frequencies
   - Check for stuck states or infinite loops

3. **Check Timing**
   - Initialization should complete within 10 seconds
   - Each cycle should complete within 30 seconds

4. **Check Console Logs**
   - Look for error messages
   - Check for circuit breaker activations
   - Verify INITIALIZE events are not duplicated

### Common Issues

- **Extension Not Loading**: Check build output and manifest.json
- **High Event Frequency**: May indicate a loop in state machine
- **Slow Initialization**: May indicate blocking operations
- **Inconsistent Results**: May indicate race conditions

## Integration with CI/CD

To integrate these tests with CI/CD:

```bash
# Install dependencies
npm install puppeteer

# Run automated test
node test-wave-cycle.js

# Check exit code (0 = passed, 1 = failed)
echo $?
```

The test will exit with code 0 if all tests pass, or code 1 if any tests fail.

