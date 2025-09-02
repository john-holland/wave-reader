#!/usr/bin/env node

/**
 * Test JSX Syntax Error
 * Tests the template validator with the exact JSX code that's causing issues in tome-studio
 */

const TemplateValidator = require('./template-validator');

// The exact problematic JSX code from tome-studio line 290
const problematicJSX = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
    <title>JSX Error Test</title>
</head>
<body>
    <h1>Component with JSX</h1>
    
    <script>
        // This is the exact JSX code that was causing the syntax error
        const componentCode = \`
        export const GoButton: React.FC<GoButtonProps> = ({
          onClick,
          disabled = false,
          children,
          variant = 'primary'
        }) => {
          const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
          const variantClasses = {
            primary: 'bg-blue-500 hover:bg-blue-600 text-white',
            secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
            success: 'bg-green-500 hover:bg-green-600 text-white'
          };

          return (
            <button
              className={\`\${baseClasses} \${variantClasses[variant]}\`}
              onClick={onClick}
              disabled={disabled}
            >
              {children}
            </button>
          );
        };
        \`;
        
        console.log('Component code loaded');
    </script>
</body>
</html>`;

async function testJSXError() {
  console.log('🧪 Testing JSX Syntax Error Detection...\n');
  
  const validator = new TemplateValidator();
  
  console.log('📝 Testing problematic JSX template:');
  console.log('─'.repeat(60));
  
  const validation = validator.validateTemplate(problematicJSX);
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
  
  // Specific JSX error checks
  console.log('\n🔍 Specific JSX Error Checks:');
  
  const jsxIssues = [
    { pattern: 'className={`${baseClasses} ${variantClasses[variant]}`}', description: 'JSX className with template literals' },
    { pattern: 'onClick={onClick}', description: 'JSX event handler' },
    { pattern: 'disabled={disabled}', description: 'JSX disabled prop' },
    { pattern: '{children}', description: 'JSX children prop' },
    { pattern: 'React.FC<', description: 'React component type' },
    { pattern: 'const baseClasses =', description: 'JSX component logic' }
  ];
  
  jsxIssues.forEach(issue => {
    const found = problematicJSX.includes(issue.pattern);
    console.log(`  ${found ? '❌' : '✅'} ${issue.description}: ${found ? 'Found (BAD)' : 'Not found (GOOD)'}`);
  });
  
  console.log('\n🎯 Summary:');
  if (validation.isValid) {
    console.log('✅ Template is valid (this should NOT happen with JSX code)');
  } else {
    console.log('❌ Template has JSX syntax errors (this is EXPECTED)');
    console.log(`   Score: ${validation.score}/100`);
    
    if (validation.errors.some(e => e.includes('JSX'))) {
      console.log('✅ JSX syntax errors were correctly detected');
    } else {
      console.log('❌ JSX syntax errors were NOT detected (validator needs improvement)');
    }
  }
}

// Run the test
if (require.main === module) {
  testJSXError().catch(console.error);
}

module.exports = { testJSXError };
