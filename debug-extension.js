const { execSync } = require('child_process');
const path = require('path');

async function debugExtension() {
    console.log('🔧 Building extension...');
    try {
        execSync('npm run build', { stdio: 'inherit' });
        console.log('✅ Extension built successfully');
    } catch (error) {
        console.error('❌ Failed to build extension:', error);
        return;
    }

    console.log('🌐 Launching Chrome with extension in developer mode...');
    
    const extensionPath = path.resolve(__dirname, './build');
    const testPagePath = path.resolve(__dirname, 'test/playwright/test.html');
    
    const chromeArgs = [
        '--load-extension=' + extensionPath,
        '--disable-extensions-except=' + extensionPath,
        '--disable-web-security',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--enable-logging',
        '--log-level=0',
        '--v=1',
        '--enable-extensions',
        '--allow-legacy-extension-manifests',
        '--enable-experimental-web-platform-features',
        '--user-data-dir=' + path.join(__dirname, 'chrome-debug-profile'),
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-default-apps',
        '--disable-popup-blocking',
        '--disable-translate',
        '--disable-background-networking',
        '--disable-sync',
        '--metrics-recording-only',
        '--no-report-upload',
        '--disable-background-mode',
        '--disable-component-extensions-with-background-pages',
        testPagePath
    ];

    const chromeCommand = `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ${chromeArgs.join(' ')}`;
    
    console.log('🚀 Starting Chrome with extension...');
    console.log('📁 Extension path:', extensionPath);
    console.log('🌐 Test page:', testPagePath);
    console.log('');
    console.log('🔧 Chrome will open with the extension loaded in developer mode.');
    console.log('🎯 You can now:');
    console.log('   - Test keyboard shortcuts (Alt+W, Ctrl+Shift+W)');
    console.log('   - Use the extension popup');
    console.log('   - Check browser console for logs');
    console.log('   - Debug animation issues');
    console.log('   - Access chrome://extensions/ to see the extension');
    console.log('');
    console.log('🌐 Chrome will stay open until you close it manually.');
    console.log('📝 Press Ctrl+C in this terminal to stop the debug session.');
    console.log('');
    
    try {
        execSync(chromeCommand, { stdio: 'inherit' });
    } catch (error) {
        console.error('❌ Failed to launch Chrome:', error.message);
        console.log('💡 Make sure Google Chrome is installed at /Applications/Google Chrome.app/');
    }
}

debugExtension().catch(console.error); 