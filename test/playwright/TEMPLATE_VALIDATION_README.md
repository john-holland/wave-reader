# Template Validation Test Suite

## 🎯 Overview

This comprehensive test suite validates HTML templates for JavaScript syntax integrity, JSX contamination, and structural correctness. It's designed to catch template issues before they reach production, ensuring robust and error-free HTML generation.

## 🚀 Features

### **JavaScript Syntax Validation**
- ✅ Validates JavaScript syntax in all script tags
- ✅ Checks for unclosed objects/arrays
- ✅ Verifies proper semicolon placement
- ✅ Catches "Unexpected end of input" errors

### **JSX Contamination Detection**
- 🔍 Detects JSX syntax in server-rendered HTML
- 🔍 Identifies React-specific imports and hooks
- 🔍 Finds JSX component tags and expressions
- 🔍 Validates template processing completeness

### **Structural Validation**
- 📐 Brace and parenthesis balancing
- 📐 Quote balance verification
- 📐 Template literal syntax validation
- 📐 Object structure completeness

### **Rendering Validation**
- 🌐 Critical error detection
- 🌐 DOM element presence verification
- 🌐 Page interactivity testing
- 🌐 Cross-browser compatibility

## 🧪 Test Categories

### 1. **JavaScript Syntax Validation**
```typescript
test('should have valid JavaScript syntax in all script tags')
test('should have properly closed componentData object')
test('should have balanced braces and parentheses')
```

### 2. **JSX and React Contamination Detection**
```typescript
test('should not contain JSX syntax in server-rendered HTML')
test('should not contain React-specific imports or hooks')
```

### 3. **String and Template Literal Validation**
```typescript
test('should have balanced quotes and no unclosed strings')
test('should have valid template literal syntax')
```

### 4. **Object Structure Validation**
```typescript
test('should have complete componentData structure')
test('should have accessible component functions')
```

### 5. **Critical Rendering Validation**
```typescript
test('should load without blocking errors')
test('should have required DOM elements')
test('should be interactive and responsive')
```

### 6. **Template Processing Validation**
```typescript
test('should not contain raw JSX in final HTML')
test('should have properly processed template variables')
```

## 🚀 Running the Tests

### **Basic Test Execution**
```bash
# Run all template validation tests
npm run test:playwright -- test/playwright/template-validation.test.ts

# Run with specific configuration
npx playwright test --config=test/playwright/template-validation.config.ts
```

### **Test Execution Modes**
```bash
# Headed mode for debugging
npm run test:playwright:headed -- test/playwright/template-validation.test.ts

# UI mode for interactive testing
npm run test:playwright:ui -- test/playwright/template-validation.test.ts

# Debug mode for step-by-step execution
npm run test:playwright:debug -- test/playwright/template-validation.test.ts
```

### **Cross-Browser Testing**
```bash
# Test across all browsers
npx playwright test --config=test/playwright/template-validation.config.ts --project=chromium
npx playwright test --config=test/playwright/template-validation.config.ts --project=firefox
npx playwright test --config=test/playwright/template-validation.config.ts --project=webkit
```

## 📊 Test Results and Reporting

### **Output Locations**
- **HTML Reports**: `playwright-report/template-validation/`
- **JSON Results**: `test-results/template-validation-results.json`
- **JUnit XML**: `test-results/template-validation-results.xml`
- **Screenshots**: `test-results/template-validation/` (on failure)
- **Videos**: `test-results/template-validation/` (on failure)
- **Traces**: `test-results/template-validation/` (on failure)

### **Viewing Results**
```bash
# Open HTML report
npx playwright show-report playwright-report/template-validation/

# View test results directory
open test-results/template-validation/
```

## 🔧 Configuration

### **Environment Variables**
```bash
# Template validation mode
TEMPLATE_VALIDATION_MODE=strict

# JSX detection enabled
JSX_DETECTION_ENABLED=true

# Syntax validation level
SYNTAX_VALIDATION_LEVEL=comprehensive
```

### **Test Timeouts**
- **Individual Test**: 30 seconds
- **Assertion**: 10 seconds
- **Global**: 10 minutes
- **Server Startup**: 2 minutes

## 🐛 Debugging Template Issues

### **Common Issues and Solutions**

#### 1. **"Unexpected end of input" Error**
```typescript
// Problem: Unclosed object in template
const componentData = {
  name: 'Component',
  // Missing closing brace!

// Solution: Ensure proper object closure
const componentData = {
  name: 'Component'
}; // Add closing brace and semicolon
```

#### 2. **JSX Contamination**
```typescript
// Problem: JSX in server-rendered HTML
<div>{component.name}</div>

// Solution: Process template to remove JSX
<div>${component.name}</div>
```

#### 3. **Brace Imbalance**
```typescript
// Problem: Mismatched braces
if (condition) {
  doSomething();
  // Missing closing brace

// Solution: Balance all braces
if (condition) {
  doSomething();
}
```

### **Debugging Commands**
```bash
# Run single test with verbose output
npx playwright test --config=test/playwright/template-validation.config.ts --grep="should have valid JavaScript syntax" --debug

# Generate trace for debugging
npx playwright test --config=test/playwright/template-validation.config.ts --trace=on
```

## 📝 Adding New Validation Tests

### **Template for New Test**
```typescript
test('should validate [specific aspect]', async ({ page }) => {
  // 1. Navigate to page
  await page.goto('http://localhost:3003/wave-reader');
  
  // 2. Perform validation
  const result = await page.evaluate(() => {
    // Your validation logic here
    return { valid: true, reason: 'Validation passed' };
  });
  
  // 3. Assert results
  expect(result.valid).toBe(true);
});
```

### **Validation Patterns**
```typescript
// Syntax validation
new Function(scriptContent);

// Pattern matching
const pattern = /your-regex-pattern/g;
const matches = content.match(pattern);

// DOM validation
const element = await page.locator('#selector');
expect(await element.count()).toBeGreaterThan(0);
```

## 🔄 Continuous Integration

### **GitHub Actions Example**
```yaml
- name: Run Template Validation Tests
  run: |
    cd wave-reader
    npm run test:playwright -- test/playwright/template-validation.test.ts
    npx playwright show-report playwright-report/template-validation/
```

### **Pre-commit Hook**
```bash
#!/bin/bash
# .git/hooks/pre-commit
echo "Running template validation tests..."
npm run test:playwright -- test/playwright/template-validation.test.ts
if [ $? -ne 0 ]; then
  echo "❌ Template validation failed. Please fix issues before committing."
  exit 1
fi
echo "✅ Template validation passed."
```

## 🎯 Best Practices

### **1. Test Early, Test Often**
- Run template validation tests during development
- Integrate into CI/CD pipeline
- Use pre-commit hooks for immediate feedback

### **2. Comprehensive Coverage**
- Test all template endpoints
- Validate across different browsers
- Check for edge cases and error conditions

### **3. Clear Error Reporting**
- Provide detailed error messages
- Include context and suggestions
- Generate actionable test reports

### **4. Performance Considerations**
- Run tests in parallel when possible
- Use appropriate timeouts
- Optimize test execution order

## 🆘 Troubleshooting

### **Common Test Failures**

#### **Server Not Running**
```bash
# Start editor server
cd log-view-machine
npm run start:editor
```

#### **Port Conflicts**
```bash
# Check port usage
lsof -i :3003
# Kill conflicting process
kill -9 <PID>
```

#### **Browser Issues**
```bash
# Reinstall browsers
npx playwright install
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Template Validation Best Practices](https://example.com)
- [JavaScript Syntax Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [HTML Template Standards](https://html.spec.whatwg.org/)

---

**🎯 Remember**: Template validation is your first line of defense against production issues. Catch problems early, validate thoroughly, and maintain robust HTML generation! 🚀


