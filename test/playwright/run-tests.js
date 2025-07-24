#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🌊 Wave Reader Extension Test Runner');
console.log('=====================================');

// Check if build directory exists
const buildPath = path.join(process.cwd(), 'build');
if (!fs.existsSync(buildPath)) {
    console.log('📦 Building extension...');
    try {
        execSync('npm run build', { stdio: 'inherit' });
        console.log('✅ Extension built successfully');
    } catch (error) {
        console.error('❌ Failed to build extension:', error.message);
        process.exit(1);
    }
} else {
    console.log('✅ Extension already built');
}

// Check if test HTML file exists
const testHtmlPath = path.join(process.cwd(), 'test/playwright/test.html');
if (!fs.existsSync(testHtmlPath)) {
    console.error('❌ Test HTML file not found:', testHtmlPath);
    process.exit(1);
}

console.log('✅ Test HTML file found');

// Run Playwright tests
console.log('🧪 Running Playwright tests...');
try {
    execSync('npx playwright test', { stdio: 'inherit' });
    console.log('✅ All tests passed!');
} catch (error) {
    console.error('❌ Some tests failed');
    process.exit(1);
}

console.log('🎉 Test run completed successfully!'); 