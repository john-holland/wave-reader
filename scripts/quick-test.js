#!/usr/bin/env node

const { spawn } = require('child_process');

async function runTests() {
    console.log('🚀 Starting Playwright test runner...');
    console.log('📁 Working directory:', process.cwd());
    console.log('⏰ Timeout: 30 seconds');
    console.log('─'.repeat(50));

    const playwrightCmd = 'npx';
    const playwrightArgs = [
        'playwright', 
        'test', 
        'test/playwright/popup-background-tab-communication.test.ts', 
        '--timeout=30000'
    ];

    console.log(`💻 Command: ${playwrightCmd} ${playwrightArgs.join(' ')}`);
    console.log('─'.repeat(50));

    return new Promise((resolve, reject) => {
        const child = spawn(playwrightCmd, playwrightArgs, {
            stdio: ['inherit', 'pipe', 'pipe'],
            shell: true,
            cwd: process.cwd()
        });

        let stdout = '';
        let stderr = '';
        let isCompleted = false;

        console.log('🔄 Process started, PID:', child.pid);

        // Capture and log stdout
        child.stdout.on('data', (data) => {
            const output = data.toString();
            stdout += output;
            process.stdout.write(`[STDOUT] ${output}`);
        });

        // Capture and log stderr
        child.stderr.on('data', (data) => {
            const output = data.toString();
            stderr += output;
            process.stderr.write(`[STDERR] ${output}`);
        });

        // Handle process completion
        child.on('close', (code, signal) => {
            if (isCompleted) return;
            isCompleted = true;
            
            console.log('\n' + '─'.repeat(50));
            console.log(`✅ Process completed!`);
            console.log(`   Exit Code: ${code}`);
            console.log(`   Signal: ${signal || 'none'}`);
            console.log(`   PID: ${child.pid}`);
            
            if (code === 0) {
                console.log('🎉 Tests passed successfully!');
            } else {
                console.log('❌ Tests failed or timed out');
            }
            
            resolve({ code, signal, stdout, stderr });
        });

        child.on('error', (error) => {
            if (isCompleted) return;
            isCompleted = true;
            
            console.error('\n❌ Process error:', error.message);
            reject(error);
        });

        // 30 second timeout
        const timeout = setTimeout(() => {
            if (isCompleted) return;
            
            console.log('\n⏰ 30 second timeout reached - killing process');
            console.log(`   Killing PID: ${child.pid}`);
            
            child.kill('SIGTERM');
            
            // Force kill after 5 seconds
            setTimeout(() => {
                if (!isCompleted) {
                    console.log('🔪 Force killing process...');
                    child.kill('SIGKILL');
                    isCompleted = true;
                    resolve({ code: 124, signal: 'SIGKILL', stdout, stderr, timeout: true });
                }
            }, 5000);
        }, 30000);

        // Clean up timeout if process completes normally
        child.on('close', () => {
            clearTimeout(timeout);
        });

        // Handle process termination signals
        process.on('SIGINT', () => {
            console.log('\n🛑 Received SIGINT. Terminating tests...');
            child.kill('SIGTERM');
            process.exit(130);
        });

        process.on('SIGTERM', () => {
            console.log('\n🛑 Received SIGTERM. Terminating tests...');
            child.kill('SIGTERM');
            process.exit(143);
        });
    });
}

// Run the async function
runTests()
    .then(result => {
        console.log('\n📊 Final Result:', result);
        process.exit(result.code || 0);
    })
    .catch(error => {
        console.error('\n💥 Script error:', error);
        process.exit(1);
    });
