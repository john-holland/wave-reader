#!/usr/bin/env node

/**
 * Console-based Wave Cycle Test
 * 
 * This test can be run directly in the browser console after loading the extension
 * No external dependencies required
 */

console.log('🌊 Wave Cycle Test - Console Version');
console.log('=====================================');

// Test configuration
const TEST_CYCLES = 10;
const CYCLE_DELAY = 2000; // 2 seconds between cycles
const INIT_TIMEOUT = 10000; // 10 seconds timeout for initialization

// Test results storage
let testResults = [];
let currentCycle = 0;

// Helper function to get loop detection stats
async function getLoopStats() {
    return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage({
                type: 'GET_LOOP_STATS'
            }, (response) => {
                resolve(response || {});
            });
        } else {
            // Fallback for testing
            resolve({
                currentState: 'unknown',
                recentEvents: Math.floor(Math.random() * 5),
                recentStates: Math.floor(Math.random() * 3),
                eventFrequency: {},
                stateFrequency: {}
            });
        }
    });
}

// Helper function to wait for a specific state
async function waitForState(expectedState, timeout = 5000) {
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

// Helper function to send events to the state machine
function sendEvent(eventType) {
    if (window.AppMachine) {
        window.AppMachine.send(eventType);
        console.log(`🌊 Sent ${eventType} event to AppMachine`);
        return true;
    } else {
        console.log(`⚠️ AppMachine not found on window object`);
        return false;
    }
}

// Single cycle test
async function runSingleCycle(cycleNumber) {
    console.log(`\n🔄 Cycle ${cycleNumber}/${TEST_CYCLES}`);
    
    // Clear loop detection cache before each cycle for accurate per-cycle stats
    if (typeof window !== 'undefined' && window.clearLoopDetection) {
        window.clearLoopDetection();
        console.log(`  🧹 Cleared loop detection cache for cycle ${cycleNumber}`);
    }
    
    const cycleStartTime = Date.now();
    
    try {
        // Get initial stats
        const initialStats = await getLoopStats();
        console.log(`  📊 Initial Stats: Events=${initialStats.recentEvents || 0}, States=${initialStats.recentStates || 0}, State=${initialStats.currentState || 'unknown'}`);
        
        // Start wave
        console.log(`  📤 Starting wave...`);
        const startSuccess = sendEvent('START');
        
        if (startSuccess) {
            // Wait for initialization
            console.log(`  ⏳ Waiting for initialization...`);
            const initSuccess = await waitForState('ready', INIT_TIMEOUT);
            
            if (initSuccess) {
                // Get stats after start
                const afterStartStats = await getLoopStats();
                console.log(`  📊 After Start: Events=${afterStartStats.recentEvents || 0}, States=${afterStartStats.recentStates || 0}, State=${afterStartStats.currentState || 'unknown'}`);
                
                // Wait a bit for stability
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Stop wave
                console.log(`  📤 Stopping wave...`);
                const stopSuccess = sendEvent('STOP');
                
                if (stopSuccess) {
                    // Wait for stop
                    const stopComplete = await waitForState('idle', 5000);
                    
                    if (stopComplete) {
                        // Get final stats
                        const finalStats = await getLoopStats();
                        console.log(`  📊 Final Stats: Events=${finalStats.recentEvents || 0}, States=${finalStats.recentStates || 0}, State=${finalStats.currentState || 'unknown'}`);
                        
                        const cycleTime = Date.now() - cycleStartTime;
                        console.log(`  ⏱️ Cycle ${cycleNumber} completed in ${cycleTime}ms`);
                        
                        // Determine success
                        const success = (finalStats.recentEvents || 0) < 20 && (finalStats.recentStates || 0) < 10;
                        console.log(`  ${success ? '✅' : '❌'} Cycle ${cycleNumber} ${success ? 'PASSED' : 'FAILED'}`);
                        
                        return {
                            cycle: cycleNumber,
                            success: success,
                            initial: initialStats,
                            afterStart: afterStartStats,
                            final: finalStats,
                            duration: cycleTime
                        };
                    } else {
                        console.log(`  ❌ Stop timeout - wave did not return to idle state`);
                        return {
                            cycle: cycleNumber,
                            success: false,
                            error: 'Stop timeout',
                            duration: Date.now() - cycleStartTime
                        };
                    }
                } else {
                    console.log(`  ❌ Failed to send STOP event`);
                    return {
                        cycle: cycleNumber,
                        success: false,
                        error: 'Stop event failed',
                        duration: Date.now() - cycleStartTime
                    };
                }
            } else {
                console.log(`  ❌ Initialization timeout - wave did not reach ready state`);
                return {
                    cycle: cycleNumber,
                    success: false,
                    error: 'Initialization timeout',
                    duration: Date.now() - cycleStartTime
                };
            }
        } else {
            console.log(`  ❌ Failed to send START event`);
            return {
                cycle: cycleNumber,
                success: false,
                error: 'Start event failed',
                duration: Date.now() - cycleStartTime
            };
        }
    } catch (error) {
        console.log(`  ❌ Cycle ${cycleNumber} failed with error:`, error.message);
        return {
            cycle: cycleNumber,
            success: false,
            error: error.message,
            duration: Date.now() - cycleStartTime
        };
    }
}

// Main test function
async function runWaveCycleTest() {
    console.log('🌊 Starting Wave Cycle Test...');
    console.log(`📋 Configuration: ${TEST_CYCLES} cycles, ${CYCLE_DELAY}ms delay, ${INIT_TIMEOUT}ms timeout`);
    
    testResults = [];
    currentCycle = 0;
    
    // Check if AppMachine is available
    if (!window.AppMachine) {
        console.log('❌ AppMachine not found on window object');
        console.log('💡 Make sure the wave-reader extension is loaded and the app is initialized');
        return;
    }
    
    console.log('✅ AppMachine found, starting test...');
    
    for (let i = 1; i <= TEST_CYCLES; i++) {
        currentCycle = i;
        const result = await runSingleCycle(i);
        testResults.push(result);
        
        // Wait between cycles
        if (i < TEST_CYCLES) {
            console.log(`  ⏳ Waiting ${CYCLE_DELAY}ms before next cycle...`);
            await new Promise(resolve => setTimeout(resolve, CYCLE_DELAY));
        }
    }
    
    // Analyze results
    console.log('\n🌊 Test Results Summary:');
    console.log('========================');
    
    const successfulCycles = testResults.filter(r => r.success).length;
    const failedCycles = testResults.filter(r => !r.success).length;
    const avgDuration = testResults.reduce((sum, r) => sum + r.duration, 0) / testResults.length;
    const maxEvents = Math.max(...testResults.map(r => r.final?.recentEvents || 0));
    const maxStates = Math.max(...testResults.map(r => r.final?.recentStates || 0));
    
    console.log(`Total Cycles: ${TEST_CYCLES}`);
    console.log(`Successful: ${successfulCycles}`);
    console.log(`Failed: ${failedCycles}`);
    console.log(`Success Rate: ${(successfulCycles / TEST_CYCLES * 100).toFixed(1)}%`);
    console.log(`Average Duration: ${avgDuration.toFixed(0)}ms`);
    console.log(`Max Events: ${maxEvents}`);
    console.log(`Max States: ${maxStates}`);
    
    // Show failed cycles
    const failedResults = testResults.filter(r => !r.success);
    if (failedResults.length > 0) {
        console.log('\n❌ Failed Cycles:');
        failedResults.forEach(result => {
            console.log(`  Cycle ${result.cycle}: ${result.error || 'Unknown error'}`);
        });
    }
    
    // Determine if test passed
    const testPassed = successfulCycles >= TEST_CYCLES * 0.8 && maxEvents < 20 && maxStates < 10;
    console.log(`\n🎯 Test ${testPassed ? 'PASSED' : 'FAILED'}`);
    console.log(`- Success Rate: ${successfulCycles >= TEST_CYCLES * 0.8 ? '✅' : '❌'} (${(successfulCycles / TEST_CYCLES * 100).toFixed(1)}%)`);
    console.log(`- Event Threshold: ${maxEvents < 20 ? '✅' : '❌'} (Max: ${maxEvents})`);
    console.log(`- State Threshold: ${maxStates < 10 ? '✅' : '❌'} (Max: ${maxStates})`);
    
    return {
        passed: testPassed,
        results: testResults,
        summary: {
            totalCycles: TEST_CYCLES,
            successful: successfulCycles,
            failed: failedCycles,
            successRate: (successfulCycles / TEST_CYCLES * 100).toFixed(1),
            averageDuration: avgDuration.toFixed(0),
            maxEvents: maxEvents,
            maxStates: maxStates
        }
    };
}

// Export functions for use in browser console
window.waveCycleTest = {
    run: runWaveCycleTest,
    runSingle: runSingleCycle,
    getStats: getLoopStats,
    sendEvent: sendEvent,
    results: () => testResults
};

console.log('🌊 Wave Cycle Test loaded!');
console.log('💡 Usage:');
console.log('  - waveCycleTest.run() - Run full 10-cycle test');
console.log('  - waveCycleTest.runSingle(1) - Run single cycle');
console.log('  - waveCycleTest.getStats() - Get current loop detection stats');
console.log('  - waveCycleTest.sendEvent("START") - Send event to state machine');
console.log('  - waveCycleTest.results() - View test results');
