#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

/**
 * Runs Playwright tests with a timeout and captures output
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} testPath - Path to test file
 */
async function runTestsWithTimeout(timeoutMs = 30000, testPath = 'test/playwright/popup-background-tab-communication.test.ts') {
    console.log(`🚀 Starting Playwright tests with ${timeoutMs}ms timeout...`);
    console.log(`📁 Test file: ${testPath}`);
    console.log('─'.repeat(60));

    const playwrightCmd = 'npx';
    const playwrightArgs = [
        'playwright', 
        'test', 
        testPath, 
        '--timeout=30'
    ];

    console.log(`💻 Command: ${playwrightCmd} ${playwrightArgs.join(' ')}`);
    console.log('─'.repeat(60));

    const childProcess = spawn(playwrightCmd, playwrightArgs, {
        stdio: ['inherit', 'pipe', 'pipe'],
        cwd: process.cwd(),
        shell: true
    });

    let stdout = '';
    let stderr = '';
    let isCompleted = false;

    // Capture output
    childProcess.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        process.stdout.write(output); // Real-time output
    });

    childProcess.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        process.stderr.write(output); // Real-time error output
    });

    // Handle process completion
    childProcess.on('close', (code, signal) => {
        isCompleted = true;
        console.log('\n' + '─'.repeat(60));
        console.log(`✅ Process completed with code: ${code}, signal: ${signal}`);
        
        // Summary
        console.log('\n📊 Test Summary:');
        console.log(`   Exit Code: ${code}`);
        console.log(`   Signal: ${signal || 'none'}`);
        console.log(`   Completed: ${isCompleted ? 'Yes' : 'No'}`);
        
        if (code === 0) {
            console.log('🎉 Tests passed successfully!');
        } else {
            console.log('❌ Tests failed or timed out');
        }
        
        process.exit(code);
    });

    childProcess.on('error', (error) => {
        console.error('\n❌ Process error:', error.message);
        process.exit(1);
    });

    // Set timeout
    const timeoutId = setTimeout(() => {
        if (!isCompleted) {
            console.log(`\n⏰ Timeout reached (${timeoutMs}ms). Terminating process...`);
            
            // Kill the process tree
            childProcess.kill('SIGTERM');
            
            // Force kill after 5 seconds if still running
            setTimeout(() => {
                if (!isCompleted) {
                    console.log('🔪 Force killing process...');
                    childProcess.kill('SIGKILL');
                }
            }, 5000);
            
            console.log('\n📊 Timeout Summary:');
            console.log(`   Timeout: ${timeoutMs}ms`);
            console.log(`   Completed: ${isCompleted ? 'Yes' : 'No'}`);
            console.log('❌ Tests timed out');
            
            process.exit(124); // Exit code 124 typically indicates timeout
        }
    }, timeoutMs);

    // Clean up timeout if process completes normally
    childProcess.on('close', () => {
        clearTimeout(timeoutId);
    });

    // Handle process termination
    process.on('SIGINT', () => {
        console.log('\n🛑 Received SIGINT. Terminating tests...');
        childProcess.kill('SIGTERM');
        process.exit(130);
    });

    process.on('SIGTERM', () => {
        console.log('\n🛑 Received SIGTERM. Terminating tests...');
        childProcess.kill('SIGTERM');
        process.exit(143);
    });
}

// Parse command line arguments
const args = process.argv.slice(2);
const timeoutArg = args.find(arg => arg.startsWith('--timeout='));
const testPathArg = args.find(arg => arg.endsWith('.test.ts'));

const timeout = timeoutArg ? parseInt(timeoutArg.split('=')[1]) : 30000;
const testPath = testPathArg || 'test/playwright/popup-background-tab-communication.test.ts';

// Run the tests
runTestsWithTimeout(timeout, testPath).catch(error => {
    console.error('❌ Script error:', error);
    process.exit(1);
});
