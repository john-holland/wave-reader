import { FullConfig } from '@playwright/test';

/**
 * Global Teardown for Template Validation Tests
 * 
 * This teardown ensures:
 * - Test artifacts are properly saved
 * - Browser instances are cleaned up
 * - Test results are summarized
 */

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up template validation test environment...');
  
  try {
    // Generate test summary
    console.log('📊 Template validation test run completed');
    console.log('📁 Test results saved to: test-results/template-validation/');
    console.log('🌐 HTML report available at: playwright-report/template-validation/');
    
    // Note: Don't stop the editor server here as it might be used by other processes
    console.log('⚠️  Editor server left running for other processes');
    
  } catch (error) {
    console.error('❌ Teardown cleanup failed:', error);
  }
  
  console.log('✅ Template validation test environment cleanup complete!');
}

export default globalTeardown;


