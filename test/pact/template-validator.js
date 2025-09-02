/**
 * Template Validator for Tome Studio HTML Templates
 * Validates server-side rendered HTML for syntax errors, CSP compliance, and template safety
 */

class TemplateValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  /**
   * Validate HTML template for common issues
   */
  validateTemplate(html, options = {}) {
    this.errors = [];
    this.warnings = [];
    this.info = [];

    // Basic HTML structure validation
    this.validateHtmlStructure(html);
    
    // Template syntax validation
    this.validateTemplateSyntax(html);
    
    // JavaScript syntax validation
    this.validateJavaScript(html);
    
    // CSP compliance validation
    this.validateCSPCompliance(html);
    
    // Security validation
    this.validateSecurity(html, options);

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      info: this.info,
      score: this.calculateScore()
    };
  }

  /**
   * Validate basic HTML structure
   */
  validateHtmlStructure(html) {
    // Check for proper DOCTYPE
    if (!html.includes('<!DOCTYPE html>')) {
      this.errors.push('Missing DOCTYPE declaration');
    }

    // Check for proper HTML tags
    if (!html.includes('<html')) {
      this.errors.push('Missing <html> tag');
    }

    if (!html.includes('<head')) {
      this.errors.push('Missing <head> tag');
    }

    if (!html.includes('<body')) {
      this.errors.push('Missing <body> tag');
    }

    // Check for proper closing tags
    if (!html.includes('</html>')) {
      this.errors.push('Missing </html> closing tag');
    }
  }

  /**
   * Validate template syntax for common errors
   */
  validateTemplateSyntax(html) {
    // Check for EJS template variables that should be processed server-side
    const ejsTemplatePattern = /<%=?[^%>]+%>/g;
    const ejsMatches = html.match(ejsTemplatePattern);
    
    if (ejsMatches) {
      this.errors.push(`Found unprocessed EJS template variables: ${ejsMatches.join(', ')}`);
    }

    // Check for unescaped braces that might cause syntax errors
    const unescapedBracesPattern = /(?<!\\\\)\{[^}]*\}/g;
    const braceMatches = html.match(unescapedBracesPattern);
    
    if (braceMatches) {
      this.warnings.push(`Found potentially problematic braces: ${braceMatches.join(', ')}`);
    }

    // Check for common template syntax issues (only outside of script tags)
    const htmlWithoutScriptsForVars = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    
    if (htmlWithoutScriptsForVars.includes('{setting.value}')) {
      this.errors.push('Found raw template variable {setting.value} - should be processed');
    }

    if (htmlWithoutScriptsForVars.includes('{component.name}')) {
      this.errors.push('Found raw template variable {component.name} - should be processed');
    }

    // Check for raw JSX syntax that should be processed server-side
    if (html.includes('<button') && html.includes('className={') && html.includes('{children}')) {
      this.errors.push('Found raw JSX syntax in HTML template - should be processed server-side');
    }

    if (html.includes('onClick={') && html.includes('disabled={')) {
      this.errors.push('Found raw JSX event handlers in HTML template - should be processed server-side');
    }

    // Check for React component syntax
    if (html.includes('React.FC<') || html.includes('React.Component')) {
      this.errors.push('Found raw React component definitions in HTML template - should be processed server-side');
    }

    // JavaScript template literals are OK - they're processed client-side
    // Only flag them if they appear outside of <script> tags
    const scriptPattern = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let scriptMatch;
    let hasScriptTags = false;
    
    while ((scriptMatch = scriptPattern.exec(html)) !== null) {
      hasScriptTags = true;
      const scriptContent = scriptMatch[1];
      
      // Check for JavaScript template literals in script tags (these are OK)
      const jsTemplateLiterals = scriptContent.match(/\$\{[^}]+\}/g);
      if (jsTemplateLiterals) {
        // These are valid JavaScript template literals, not errors
        this.info.push(`Found ${jsTemplateLiterals.length} JavaScript template literals in script tags (valid)`);
      }
    }
    
    // Note: Template literals ${} are valid JavaScript syntax and should not be flagged as errors
    // They can appear in various contexts including inline event handlers, data attributes, etc.

    // No need to filter errors since we're not generating false positives about template literals
  }

  /**
   * Validate JavaScript syntax in HTML
   */
  validateJavaScript(html) {
    // Extract script tags
    const scriptPattern = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let scriptMatch;
    
    while ((scriptMatch = scriptPattern.exec(html)) !== null) {
      const scriptContent = scriptMatch[1];
      
      // Check for common JavaScript syntax issues
      // Note: ${} template literals are valid JavaScript, not errors
      // Only flag actual syntax problems

      // Check for malformed JavaScript
      try {
        // Basic syntax check - this is limited but catches obvious issues
        if (scriptContent.includes('function') || scriptContent.includes('const') || scriptContent.includes('let')) {
          // Try to parse as JavaScript (basic validation)
          new Function(scriptContent);
        }
      } catch (error) {
        this.errors.push(`JavaScript syntax error: ${error.message}`);
      }
    }
  }

  /**
   * Validate CSP compliance
   */
  validateCSPCompliance(html) {
    // Check for CSP meta tag
    const cspMetaPattern = /<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/i;
    
    if (!cspMetaPattern.test(html)) {
      this.errors.push('Missing Content Security Policy meta tag');
    } else {
      // Check if CSP allows inline scripts
      const cspContent = html.match(/content=["']([^"']*)["']/i);
      if (cspContent && cspContent[1]) {
        const csp = cspContent[1];
        
        if (!csp.includes("'unsafe-inline'")) {
          this.warnings.push('CSP does not allow inline scripts - may cause CSP violations');
        }
        
        if (!csp.includes("'unsafe-eval'")) {
          this.warnings.push('CSP does not allow eval - may cause CSP violations');
        }
      }
    }
  }

  /**
   * Validate security aspects
   */
  validateSecurity(html, options = {}) {
    // Check for potential XSS vectors
    if (html.includes('innerHTML') && html.includes('${')) {
      this.warnings.push('Potential XSS risk: innerHTML with template variables');
    }

    // Check for inline event handlers
    if (html.includes('onclick=') || html.includes('onload=')) {
      this.warnings.push('Found inline event handlers - consider using addEventListener');
    }

    // Check for eval usage
    if (html.includes('eval(')) {
      this.errors.push('Found eval() usage - security risk');
    }
  }

  /**
   * Calculate validation score
   */
  calculateScore() {
    const totalChecks = 10; // Approximate number of validation checks
    const errorPenalty = this.errors.length * 2;
    const warningPenalty = this.warnings.length * 0.5;
    
    return Math.max(0, Math.round((totalChecks - errorPenalty - warningPenalty) / totalChecks * 100));
  }

  /**
   * Generate detailed validation report
   */
  generateReport() {
    return {
      summary: {
        isValid: this.errors.length === 0,
        errorCount: this.errors.length,
        warningCount: this.warnings.length,
        score: this.calculateScore()
      },
      details: {
        errors: this.errors,
        warnings: this.warnings
      },
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * Generate recommendations based on validation results
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.errors.length > 0) {
      recommendations.push('Fix all errors before deploying to production');
    }

    if (this.warnings.length > 0) {
      recommendations.push('Review warnings and address security concerns');
    }

    if (this.errors.some(e => e.includes('template literal'))) {
      recommendations.push('Ensure all template variables are properly processed server-side');
    }

    if (this.errors.some(e => e.includes('CSP'))) {
      recommendations.push('Add proper Content Security Policy meta tags');
    }

    return recommendations;
  }
}

module.exports = TemplateValidator;
