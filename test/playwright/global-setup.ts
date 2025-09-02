import { chromium, FullConfig } from '@playwright/test';

/**
 * Global Setup for Template Validation Tests
 * 
 * This setup ensures:
 * - Editor server is running and accessible
 * - Template validation environment is ready
 * - Browser instances are properly configured
 */

async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up template validation test environment...');
  
  // Start the editor server if not already running
  const baseURL = 'http://localhost:3003';
  
  try {
    // Check if server is already running
    const response = await fetch(`${baseURL}/health`);
    if (response.ok) {
      console.log('✅ Editor server is already running');
    }
  } catch (error) {
    console.log('⚠️  Editor server not running, tests will start it automatically');
  }
  
  // Launch browser to verify environment
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Test basic connectivity
    await page.goto(baseURL);
    console.log('✅ Basic connectivity test passed');
    
    // Verify template endpoint
    await page.goto(`${baseURL}/wave-reader`);
    const title = await page.title();
    console.log(`✅ Template endpoint accessible, title: ${title}`);
    
  } catch (error) {
    console.error('❌ Environment setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('🎯 Template validation test environment ready!');
}

export default globalSetup;


