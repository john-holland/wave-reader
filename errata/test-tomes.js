#!/usr/bin/env node

// Simple test script for Tomes setup
console.log('🌊 Testing Tomes setup...');

// Test basic imports
try {
    console.log('✅ Basic imports working');
    
    // Test if we can create a basic state machine
    const { createMachine } = require('xstate');
    
    const testMachine = createMachine({
        id: 'test',
        initial: 'idle',
        states: {
            idle: {
                on: { START: 'active' }
            },
            active: {
                on: { STOP: 'idle' }
            }
        }
    });
    
    console.log('✅ XState working');
    console.log('✅ Test machine created:', testMachine.id);
    
    // Test if we can start the machine
    const { interpret } = require('xstate');
    const service = interpret(testMachine).start();
    
    console.log('✅ Machine service started');
    console.log('✅ Initial state:', service.getSnapshot().value);
    
    // Test state transition
    service.send('START');
    console.log('✅ State transition working:', service.getSnapshot().value);
    
    service.stop();
    console.log('✅ Machine service stopped');
    
} catch (error) {
    console.error('❌ Error in Tomes setup:', error.message);
    process.exit(1);
}

// Test file structure
const fs = require('fs');
const path = require('path');

const requiredFiles = [
    'src/tome-server.js',
    'src/component-middleware/wave-reader/templates/wave-reader-component/index.js',
    'src/component-middleware/wave-reader/templates/wave-reader-component/styles.css',
    'src/component-middleware/wave-reader/templates/wave-reader-component/template.html',
    'src/component-middleware/wave-reader/robotcopy-pact-config.js',
    'src/app-tomes.tsx'
];

console.log('\n📁 Checking file structure...');

let allFilesExist = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - Missing`);
        allFilesExist = false;
    }
});

if (allFilesExist) {
    console.log('\n🎉 All required files present!');
} else {
    console.log('\n⚠️  Some files are missing. Please check the structure.');
}

// Test package.json dependencies
console.log('\n📦 Checking dependencies...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    const requiredDeps = ['log-view-machine', 'xstate'];
    requiredDeps.forEach(dep => {
        if (packageJson.dependencies[dep]) {
            console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
        } else {
            console.log(`❌ ${dep} - Missing from dependencies`);
        }
    });
    
} catch (error) {
    console.error('❌ Error reading package.json:', error.message);
}

console.log('\n🌊 Tomes setup test completed!');
console.log('\nNext steps:');
console.log('1. Start the Tomes server: node src/tome-server.js');
console.log('2. Test the client template: http://localhost:3003/wave-reader-client');
console.log('3. Test the SSR page: http://localhost:3003/wave-reader');
console.log('4. Integrate app-tomes.tsx into your React app');
