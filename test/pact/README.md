# Pact Tests for Tome Studio Server-Side Rendering

This directory contains Pact tests that validate the contract between the tome-studio server and the wave-reader client, specifically focusing on server-side rendering quality and template validation.

## Overview

The Pact tests ensure that:
1. **HTML templates are properly rendered** without syntax errors
2. **Template variables are processed** server-side, not sent as raw text
3. **CSP (Content Security Policy) is properly configured**
4. **JavaScript content is properly escaped** and valid
5. **API endpoints return expected data** in the correct format

## Test Structure

### 1. Template Validator (`template-validator.js`)
A utility class that validates HTML templates for:
- Basic HTML structure (DOCTYPE, html, head, body tags)
- Template syntax errors (unescaped braces, template literals)
- JavaScript syntax validation
- CSP compliance
- Security considerations

### 2. Consumer Tests (`tome-studio-rendering.pact.js`)
Defines the expected contract between consumer and provider:
- Expected HTML structure
- Required CSP configuration
- Template processing requirements
- API endpoint specifications

### 3. Provider Tests (`tome-studio-provider.test.js`)
Actually runs the tome-studio server and validates:
- Real HTML output against expectations
- Template processing quality
- CSP configuration
- API endpoint behavior

## Running the Tests

### Install Dependencies
```bash
npm install
```

### Run All Pact Tests
```bash
npm run test:pact
```

### Run Provider Tests Only
```bash
npm run test:pact:provider
```

### Run Consumer Tests Only
```bash
npm run test:pact:consumer
```

## What the Tests Catch

### Template Syntax Errors
- Raw template variables like `{setting.value}` that should be processed
- Unescaped template literals like `${variable}`
- Malformed JavaScript in script tags

### CSP Issues
- Missing Content Security Policy meta tags
- CSP that doesn't allow inline scripts
- CSP that doesn't allow unsafe-eval

### HTML Structure Issues
- Missing DOCTYPE declarations
- Incomplete HTML tags
- Malformed HTML structure

### API Contract Issues
- Missing or incorrect API endpoints
- Wrong response formats
- Missing required fields

## Example Test Output

When tests pass, you'll see:
```
✅ Template Validation Report: {
  "summary": {
    "isValid": true,
    "errorCount": 0,
    "warningCount": 0,
    "score": 100
  }
}
```

When tests fail, you'll see detailed error reports:
```
❌ Template Validation Report: {
  "summary": {
    "isValid": false,
    "errorCount": 2,
    "warningCount": 1,
    "score": 70
  },
  "details": {
    "errors": [
      "Found raw template variable {setting.value} - should be processed",
      "Missing Content Security Policy meta tag"
    ],
    "warnings": [
      "Found potentially problematic braces: {component.name}"
    ]
  },
  "recommendations": [
    "Fix all errors before deploying to production",
    "Ensure all template variables are properly processed server-side",
    "Add proper Content Security Policy meta tags"
  ]
}
```

## Fixing Common Issues

### Template Variables Not Processed
If you see errors like `Found raw template variable {setting.value}`:
1. Check the server-side template processing
2. Ensure template variables are replaced before sending HTML
3. Use proper template engines or string replacement

### CSP Violations
If you see CSP-related errors:
1. Add CSP meta tags to HTML templates
2. Ensure CSP allows necessary features (`'unsafe-inline'`, `'unsafe-eval'`)
3. Test CSP configuration in the browser

### JavaScript Syntax Errors
If you see JavaScript syntax errors:
1. Check for unescaped template literals in script tags
2. Validate JavaScript syntax before embedding in HTML
3. Use proper escaping for dynamic content

## Integration with CI/CD

These tests can be integrated into your CI/CD pipeline to:
- Catch template rendering issues before deployment
- Ensure API contracts are maintained
- Validate security configurations
- Maintain quality standards

## Contributing

When adding new tests:
1. Follow the existing test structure
2. Add comprehensive validation in the TemplateValidator
3. Include both positive and negative test cases
4. Document any new validation rules
