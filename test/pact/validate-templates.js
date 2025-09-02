#!/usr/bin/env node

/**
 * Simple Template Validation Script
 * Tests the template validator with sample HTML to ensure it works correctly
 */

const TemplateValidator = require('./template-validator');

// Sample HTML templates to test
const testTemplates = {
  valid: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
    <title>Valid Template</title>
</head>
<body>
    <h1>Hello World</h1>
    <script>
        function hello() {
            console.log('Hello from valid template');
        }
    </script>
</body>
</html>`,
  
  invalid: `
<html>
<head>
    <title>Invalid Template</title>
</head>
<body>
    <h1>Hello {setting.value}</h1>
    <script>
        function hello() {
            console.log('Hello from \${variable}');
        }
    </script>
</body>
</html>`,
  
  withTemplateLiterals: `
<!DOCTYPE html>
<html>
<head>
    <title>Template Literals</title>
</head>
<body>
    <h1>Hello {component.name}</h1>
    <p>Value: {setting.value}</p>
    <script>
        const message = \`Hello \${user.name}\`;
        console.log(message);
    </script>
</body>
</html>`
};

// Test the validator
async function testTemplateValidator() {
  console.log('🧪 Testing Template Validator...\n');
  
  const validator = new TemplateValidator();
  
  for (const [name, html] of Object.entries(testTemplates)) {
    console.log(`📝 Testing: ${name.toUpperCase()}`);
    console.log('─'.repeat(50));
    
    const validation = validator.validateTemplate(html);
    const report = validator.generateReport();
    
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
    
    console.log('\n');
  }
  
  console.log('🎯 Template validation test completed!');
}

// Run the test
if (require.main === module) {
  testTemplateValidator().catch(console.error);
}

module.exports = { testTemplateValidator };
