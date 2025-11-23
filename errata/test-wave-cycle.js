#!/usr/bin/env node

/**
 * Wave Cycle Test
 * 
 * This test starts and stops the wave 10 times to verify:
 * - No hanging or loops during initialization
 * - Proper cleanup between cycles
 * - Consistent behavior across multiple cycles
 * - Loop detection stats are reasonable
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testWaveCycle() {
    console.log('🌊 Starting Wave Cycle Test...');
    
    const extensionPath = path.resolve(__dirname, 'build');
    const browser = await puppeteer.launch({
        headless: false, // Set to true for CI/CD
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    try {
        // Get the extension page
        const pages = await browser.pages();
        const extensionPage = pages[0];
        
        // Navigate to a test page
        await extensionPage.goto('https://example.com');
        
        // Wait for extension to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('🌊 Extension loaded, starting cycle test...');
        
        // Function to get loop detection stats from background script
        async function getLoopStats() {
            return await extensionPage.evaluate(() => {
                return new Promise((resolve) => {
                    chrome.runtime.sendMessage({
                        type: 'GET_LOOP_STATS'
                    }, (response) => {
                        resolve(response || {});
                    });
                });
            });
        }
        
        // Function to click start wave button
        async function startWave() {
            try {
                // Look for start wave button in the extension popup
                const startButton = await extensionPage.$('button:contains("Start Wave")');
                if (startButton) {
                    await startButton.click();
                    console.log('✅ Start Wave button clicked');
                } else {
                    // Try alternative selectors
                    const altButton = await extensionPage.$('[data-testid="start-wave"]');
                    if (altButton) {
                        await altButton.click();
                        console.log('✅ Start Wave button clicked (alt selector)');
                    } else {
                        console.log('⚠️ Start Wave button not found');
                    }
                }
            } catch (error) {
                console.log('⚠️ Error clicking start wave:', error.message);
            }
        }
        
        // Function to click stop wave button
        async function stopWave() {
            try {
                const stopButton = await extensionPage.$('button:contains("Stop Wave")');
                if (stopButton) {
                    await stopButton.click();
                    console.log('✅ Stop Wave button clicked');
                } else {
                    const altButton = await extensionPage.$('[data-testid="stop-wave"]');
                    if (altButton) {
                        await altButton.click();
                        console.log('✅ Stop Wave button clicked (alt selector)');
                    } else {
                        console.log('⚠️ Stop Wave button not found');
                    }
                }
            } catch (error) {
                console.log('⚠️ Error clicking stop wave:', error.message);
            }
        }
        
        // Function to wait for state change
        async function waitForStateChange(expectedState, timeout = 5000) {
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                const stats = await getLoopStats();
                if (stats.currentState === expectedState) {
                    return true;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return false;
        }
        
        // Test results
        const testResults = {
            totalCycles: 10,
            successfulCycles: 0,
            failedCycles: 0,
            averageInitTime: 0,
            maxInitTime: 0,
            minInitTime: Infinity,
            loopDetections: [],
            errors: []
        };
        
        console.log(`🌊 Running ${testResults.totalCycles} start/stop cycles...`);
        
        for (let cycle = 1; cycle <= testResults.totalCycles; cycle++) {
            console.log(`\n🔄 Cycle ${cycle}/${testResults.totalCycles}`);
            
            try {
                const cycleStartTime = Date.now();
                
                // Start the wave
                console.log(`  📤 Starting wave...`);
                await startWave();
                
                // Wait for initialization to complete
                const initStartTime = Date.now();
                const initSuccess = await waitForStateChange('ready', 10000);
                const initTime = Date.now() - initStartTime;
                
                if (initSuccess) {
                    console.log(`  ✅ Wave started successfully (${initTime}ms)`);
                    
                    // Update timing stats
                    testResults.averageInitTime += initTime;
                    testResults.maxInitTime = Math.max(testResults.maxInitTime, initTime);
                    testResults.minInitTime = Math.min(testResults.minInitTime, initTime);
                    
                    // Wait a bit to ensure stability
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Stop the wave
                    console.log(`  📤 Stopping wave...`);
                    await stopWave();
                    
                    // Wait for stop to complete
                    const stopSuccess = await waitForStateChange('idle', 5000);
                    
                    if (stopSuccess) {
                        console.log(`  ✅ Wave stopped successfully`);
                        testResults.successfulCycles++;
                    } else {
                        console.log(`  ❌ Wave stop failed`);
                        testResults.failedCycles++;
                        testResults.errors.push(`Cycle ${cycle}: Stop failed`);
                    }
                } else {
                    console.log(`  ❌ Wave start failed (timeout after ${initTime}ms)`);
                    testResults.failedCycles++;
                    testResults.errors.push(`Cycle ${cycle}: Start timeout`);
                }
                
                // Get loop detection stats for this cycle
                const loopStats = await getLoopStats();
                testResults.loopDetections.push({
                    cycle,
                    stats: loopStats,
                    timestamp: new Date().toISOString()
                });
                
                // Log any concerning loop detection results
                if (loopStats.recentEvents > 10) {
                    console.log(`  ⚠️ High event frequency detected: ${loopStats.recentEvents} events`);
                }
                if (loopStats.recentStates > 5) {
                    console.log(`  ⚠️ High state frequency detected: ${loopStats.recentStates} state changes`);
                }
                
                const totalCycleTime = Date.now() - cycleStartTime;
                console.log(`  ⏱️ Cycle ${cycle} completed in ${totalCycleTime}ms`);
                
                // Wait between cycles
                if (cycle < testResults.totalCycles) {
                    console.log(`  ⏳ Waiting 2 seconds before next cycle...`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
                
            } catch (error) {
                console.log(`  ❌ Cycle ${cycle} failed with error:`, error.message);
                testResults.failedCycles++;
                testResults.errors.push(`Cycle ${cycle}: ${error.message}`);
            }
        }
        
        // Calculate final statistics
        testResults.averageInitTime = testResults.averageInitTime / testResults.successfulCycles;
        
        // Print test results
        console.log('\n🌊 Wave Cycle Test Results:');
        console.log('================================');
        console.log(`Total Cycles: ${testResults.totalCycles}`);
        console.log(`Successful: ${testResults.successfulCycles}`);
        console.log(`Failed: ${testResults.failedCycles}`);
        console.log(`Success Rate: ${((testResults.successfulCycles / testResults.totalCycles) * 100).toFixed(1)}%`);
        console.log(`Average Init Time: ${testResults.averageInitTime.toFixed(0)}ms`);
        console.log(`Max Init Time: ${testResults.maxInitTime}ms`);
        console.log(`Min Init Time: ${testResults.minInitTime === Infinity ? 'N/A' : testResults.minInitTime + 'ms'}`);
        
        if (testResults.errors.length > 0) {
            console.log('\n❌ Errors:');
            testResults.errors.forEach(error => console.log(`  - ${error}`));
        }
        
        // Analyze loop detection results
        console.log('\n🔄 Loop Detection Analysis:');
        const avgEvents = testResults.loopDetections.reduce((sum, item) => sum + (item.stats.recentEvents || 0), 0) / testResults.loopDetections.length;
        const avgStates = testResults.loopDetections.reduce((sum, item) => sum + (item.stats.recentStates || 0), 0) / testResults.loopDetections.length;
        const maxEvents = Math.max(...testResults.loopDetections.map(item => item.stats.recentEvents || 0));
        const maxStates = Math.max(...testResults.loopDetections.map(item => item.stats.recentStates || 0));
        
        console.log(`Average Events per Cycle: ${avgEvents.toFixed(1)}`);
        console.log(`Average States per Cycle: ${avgStates.toFixed(1)}`);
        console.log(`Max Events in Cycle: ${maxEvents}`);
        console.log(`Max States in Cycle: ${maxStates}`);
        
        // Determine if test passed
        const testPassed = testResults.successfulCycles >= testResults.totalCycles * 0.8; // 80% success rate
        const noExcessiveLoops = maxEvents < 20 && maxStates < 10; // Reasonable loop thresholds
        
        console.log('\n🎯 Test Conclusion:');
        console.log(`Test ${testPassed && noExcessiveLoops ? 'PASSED' : 'FAILED'}`);
        console.log(`- Success Rate: ${testPassed ? '✅' : '❌'} (${((testResults.successfulCycles / testResults.totalCycles) * 100).toFixed(1)}%)`);
        console.log(`- Loop Detection: ${noExcessiveLoops ? '✅' : '❌'} (Max events: ${maxEvents}, Max states: ${maxStates})`);
        
        return {
            passed: testPassed && noExcessiveLoops,
            results: testResults
        };
        
    } catch (error) {
        console.error('❌ Test failed with error:', error);
        return {
            passed: false,
            error: error.message
        };
    } finally {
        await browser.close();
    }
}

// Run the test if this script is executed directly
if (require.main === module) {
    testWaveCycle()
        .then(result => {
            console.log('\n🌊 Test completed');
            process.exit(result.passed ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Test runner failed:', error);
            process.exit(1);
        });
}

module.exports = { testWaveCycle };

