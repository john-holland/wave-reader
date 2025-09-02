#!/usr/bin/env node

/**
 * Test Tome Studio HTML Output
 * Fetches actual HTML from tome-studio and validates it using our template validator
 */

const TemplateValidator = require('./template-validator');

async function testTomeStudioOutput() {
  console.log('🧪 Testing Tome Studio HTML Output...\n');
  
  const validator = new TemplateValidator();
  const baseUrl = 'http://localhost:3010'; // Use the port where tome-studio is running
  
  try {
    // Test health endpoint first
    console.log('🔍 Checking server health...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    
    if (!healthResponse.ok) {
      throw new Error(`Server not healthy: ${healthResponse.status} ${healthResponse.statusText}`);
    }
    
    const healthData = await healthResponse.json();
    console.log(`✅ Server healthy: ${healthData.status} (${healthData.service})`);
    
    // Test wave-reader endpoint
    console.log('\n📝 Testing /wave-reader endpoint...');
    const waveReaderResponse = await fetch(`${baseUrl}/wave-reader`);
    
    if (!waveReaderResponse.ok) {
      throw new Error(`Wave reader endpoint failed: ${waveReaderResponse.status} ${waveReaderResponse.statusText}`);
    }
    
    const html = await waveReaderResponse.text();
    console.log(`✅ HTML received (${html.length} characters)`);
    
    // Validate the HTML
    console.log('\n🔍 Validating HTML template...');
    const validation = validator.validateTemplate(html);
    const report = validator.generateReport();
    
    // Display results
    console.log(`\n📊 Validation Results:`);
    console.log(`Status: ${validation.isValid ? '✅ VALID' : '❌ INVALID'}`);
    console.log(`Score: ${validation.score}/100`);
    console.log(`Errors: ${validation.errors.length}`);
    console.log(`Warnings: ${validation.warnings.length}`);
    
    if (validation.errors.length > 0) {
      console.log('\n❌ Errors:');
      validation.errors.forEach(error => console.log(`  • ${error}`));
    }
    
    if (validation.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      validation.warnings.forEach(warning => console.log(`  • ${warning}`));
    }
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach(rec => console.log(`  • ${rec}`));
    }
    
    // Check for specific issues we've seen
    console.log('\n🔍 Checking for known issues:');
    
    const knownIssues = [
      { pattern: '{setting.value}', description: 'Raw template variable' },
      { pattern: '{component.name}', description: 'Raw template variable' },
      { pattern: '${', description: 'Template literal syntax' },
      { pattern: 'Content-Security-Policy', description: 'CSP meta tag' },
      { pattern: "'unsafe-inline'", description: 'CSP allows inline scripts' },
      { pattern: "'unsafe-eval'", description: 'CSP allows eval' }
    ];
    
    knownIssues.forEach(issue => {
      const found = html.includes(issue.pattern);
      console.log(`  ${found ? '✅' : '❌'} ${issue.description}: ${found ? 'Found' : 'Missing'}`);
    });
    
    // Summary
    console.log('\n🎯 Summary:');
    if (validation.isValid) {
      console.log('✅ HTML template is valid and ready for production');
    } else {
      console.log('❌ HTML template has issues that need to be fixed');
      console.log(`   Score: ${validation.score}/100`);
    }
    
  } catch (error) {
    console.error('\n❌ Error testing tome-studio output:', error.message);
    console.log('\n💡 Make sure tome-studio is running on port 3010');
    console.log('   Run: npx tome-studio --port 3010');
  }
}

// Run the test
if (require.main === module) {
  testTomeStudioOutput().catch(console.error);
}

module.exports = { testTomeStudioOutput };
