#!/usr/bin/env node

/**
 * Simple Wave Cycle Test
 * 
 * A simpler version that uses the browser console to trigger wave cycles
 * This test is easier to run and debug
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function simpleWaveCycleTest() {
    console.log('🌊 Starting Simple Wave Cycle Test...');
    
    const extensionPath = path.resolve(__dirname, 'build');
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    try {
        const page = await browser.newPage();
        await page.goto('https://example.com');
        
        // Wait for extension to load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('🌊 Extension loaded, starting simple cycle test...');
        
        // Function to execute wave cycle via console
        async function executeWaveCycle(cycleNumber) {
            console.log(`\n🔄 Cycle ${cycleNumber}/10`);
            
            // Get initial stats
            const initialStats = await page.evaluate(() => {
                return new Promise((resolve) => {
                    chrome.runtime.sendMessage({
                        type: 'GET_LOOP_STATS'
                    }, (response) => {
                        resolve(response || {});
                    });
                });
            });
            
            console.log(`  📊 Initial stats:`, initialStats);
            
            // Start wave by sending INITIALIZE event
            await page.evaluate(() => {
                // Access the global AppMachine if available
                if (window.AppMachine) {
                    window.AppMachine.send('START');
                    console.log('🌊 Sent START event to AppMachine');
                } else {
                    console.log('⚠️ AppMachine not found on window');
                }
            });
            
            // Wait for wave to start
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Get stats after start
            const afterStartStats = await page.evaluate(() => {
                return new Promise((resolve) => {
                    chrome.runtime.sendMessage({
                        type: 'GET_LOOP_STATS'
                    }, (response) => {
                        resolve(response || {});
                    });
                });
            });
            
            console.log(`  📊 After start stats:`, afterStartStats);
            
            // Stop wave
            await page.evaluate(() => {
                if (window.AppMachine) {
                    window.AppMachine.send('STOP');
                    console.log('🌊 Sent STOP event to AppMachine');
                }
            });
            
            // Wait for wave to stop
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Get final stats
            const finalStats = await page.evaluate(() => {
                return new Promise((resolve) => {
                    chrome.runtime.sendMessage({
                        type: 'GET_LOOP_STATS'
                    }, (response) => {
                        resolve(response || {});
                    });
                });
            });
            
            console.log(`  📊 Final stats:`, finalStats);
            
            return {
                cycle: cycleNumber,
                initial: initialStats,
                afterStart: afterStartStats,
                final: finalStats
            };
        }
        
        // Run 10 cycles
        const results = [];
        for (let i = 1; i <= 10; i++) {
            const result = await executeWaveCycle(i);
            results.push(result);
            
            // Wait between cycles
            if (i < 10) {
                console.log(`  ⏳ Waiting 1 second before next cycle...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        // Analyze results
        console.log('\n🌊 Test Results Summary:');
        console.log('========================');
        
        results.forEach((result, index) => {
            console.log(`\nCycle ${index + 1}:`);
            console.log(`  Initial Events: ${result.initial.recentEvents || 0}`);
            console.log(`  After Start Events: ${result.afterStart.recentEvents || 0}`);
            console.log(`  Final Events: ${result.final.recentEvents || 0}`);
            console.log(`  Initial States: ${result.initial.recentStates || 0}`);
            console.log(`  After Start States: ${result.afterStart.recentStates || 0}`);
            console.log(`  Final States: ${result.final.recentStates || 0}`);
        });
        
        // Check for issues
        const maxEvents = Math.max(...results.map(r => r.final.recentEvents || 0));
        const maxStates = Math.max(...results.map(r => r.final.recentStates || 0));
        
        console.log('\n🎯 Analysis:');
        console.log(`Max Events: ${maxEvents}`);
        console.log(`Max States: ${maxStates}`);
        
        if (maxEvents > 20) {
            console.log('⚠️ High event frequency detected - possible loop');
        }
        if (maxStates > 10) {
            console.log('⚠️ High state frequency detected - possible loop');
        }
        
        const testPassed = maxEvents < 20 && maxStates < 10;
        console.log(`\nTest ${testPassed ? 'PASSED' : 'FAILED'}`);
        
        return {
            passed: testPassed,
            results: results,
            maxEvents: maxEvents,
            maxStates: maxStates
        };
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        return { passed: false, error: error.message };
    } finally {
        await browser.close();
    }
}

// Run the test if this script is executed directly
if (require.main === module) {
    simpleWaveCycleTest()
        .then(result => {
            console.log('\n🌊 Simple test completed');
            process.exit(result.passed ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Test runner failed:', error);
            process.exit(1);
        });
}

module.exports = { simpleWaveCycleTest };

