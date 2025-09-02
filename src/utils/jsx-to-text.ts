import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

export interface JSXToTextOptions {
  /** Whether to preserve expressions as {variable} format */
  preserveExpressions?: boolean;
  /** Whether to include whitespace between elements */
  preserveWhitespace?: boolean;
  /** Custom handler for JSX expressions */
  expressionHandler?: (expression: string) => string;
}

export class JSXToTextConverter {
  private options: Required<JSXToTextOptions>;

  constructor(options: JSXToTextOptions = {}) {
    this.options = {
      preserveExpressions: true,
      preserveWhitespace: false,
      expressionHandler: (expr) => `{${expr}}`,
      ...options
    };
  }

  /**
   * Removes JSX comments from the source code
   */
  private removeJSXComments(jsxCode: string): string {
    return jsxCode.replace(/{\/\*[\s\S]*?\*\/}/g, '');
  }

  /**
   * Converts JSX code to plain text
   */
  convert(jsxCode: string): string {
    try {
      // Remove JSX comments before parsing
      const cleanJSX = this.removeJSXComments(jsxCode);
      
      const ast = parse(cleanJSX, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });

      let textContent = '';
      let lastNodeEnd = 0;
      let lastHadContent = false;
      let lastWasSelfClosing = false;

      traverse(ast, {
        JSXText: (path) => {
          const value = path.node.value;
          if (value.trim()) {
            // Add space if this follows content from a previous element and doesn't start with punctuation
            // But don't add space if the last element was a self-closing element that shouldn't add spacing
            if (lastHadContent && textContent.length > 0 && !/^[!.,;:?]/.test(value.trim()) && !this.options.preserveWhitespace && !lastWasSelfClosing) {
              textContent += ' ';
            }
            textContent += value;
            lastHadContent = true;
            lastWasSelfClosing = false;
          } else if (this.options.preserveWhitespace) {
            textContent += value;
          }
        },

        JSXExpressionContainer: (path) => {
          // Check for whitespace before this expression
          if (path.node.start && lastNodeEnd > 0) {
            const betweenText = cleanJSX.slice(lastNodeEnd, path.node.start);
            if (betweenText.trim() === '' && betweenText.includes(' ') && !this.options.preserveWhitespace) {
              textContent += ' ';
            }
          }

          const expression = path.node.expression;
          let exprText = '';

          // For complex expressions, use the source text to preserve formatting
          if (expression.start && expression.end) {
            exprText = cleanJSX.slice(expression.start, expression.end);
          } else {
            // Fallback to processed text for simple cases
            if (expression.type === 'Identifier') {
              exprText = expression.name;
            } else if (expression.type === 'StringLiteral') {
              exprText = `"${expression.value}"`;
            } else if (expression.type === 'NumericLiteral') {
              exprText = expression.value.toString();
            } else if (expression.type === 'BooleanLiteral') {
              exprText = expression.value.toString();
            } else if (expression.type === 'NullLiteral') {
              exprText = 'null';
            } else if (expression.type === 'TemplateLiteral') {
              exprText = this.processTemplateLiteral(expression);
            } else if (expression.type === 'CallExpression') {
              exprText = this.processCallExpression(expression);
            } else if (expression.type === 'MemberExpression') {
              exprText = this.processMemberExpression(expression);
            } else if (expression.type === 'BinaryExpression') {
              exprText = this.processBinaryExpression(expression);
            } else if (expression.type === 'ConditionalExpression') {
              exprText = this.processConditionalExpression(expression);
            } else if (expression.type === 'ParenthesizedExpression') {
              exprText = `(${this.getExpressionText(expression.expression)})`;
            } else {
              exprText = '...';
            }
          }

          if (this.options.preserveExpressions) {
            textContent += this.options.expressionHandler(exprText);
          }

          lastNodeEnd = path.node.end || 0;
          lastHadContent = true;
          lastWasSelfClosing = false;
        },

        JSXElement: (path) => {
          // Add space between adjacent JSX elements if there was whitespace in the source
          // But don't add spaces for self-closing elements like br, hr, img
          if (path.node.start && lastNodeEnd > 0) {
            const betweenText = cleanJSX.slice(lastNodeEnd, path.node.start);
            if (betweenText.trim() === '' && betweenText.includes(' ') && !this.options.preserveWhitespace) {
              // Check if this is a self-closing element that shouldn't add spacing
              const isSelfClosing = path.node.openingElement.selfClosing;
              let tagName = '';
              if (path.node.openingElement.name.type === 'JSXIdentifier') {
                tagName = path.node.openingElement.name.name;
              }
              const noSpacingTags = ['br', 'hr', 'img', 'input', 'meta', 'link'];
              
              if (!isSelfClosing || !noSpacingTags.includes(tagName)) {
                textContent += ' ';
              }
            }
          }
          lastNodeEnd = path.node.end || 0;
          
          // Track if this was a self-closing element that shouldn't add spacing
          const isSelfClosing = path.node.openingElement.selfClosing;
          let tagName = '';
          if (path.node.openingElement.name.type === 'JSXIdentifier') {
            tagName = path.node.openingElement.name.name;
          }
          const noSpacingTags = ['br', 'hr', 'img', 'input', 'meta', 'link'];
          lastWasSelfClosing = isSelfClosing && noSpacingTags.includes(tagName);
          
          // Don't set lastHadContent here as we need to see if the element actually contains content
        }
      });

      // Clean up multiple spaces and normalize whitespace
      if (!this.options.preserveWhitespace) {
        textContent = textContent.replace(/\s+/g, ' ').trim();
      }
      return textContent;
    } catch (error) {
      console.error('Failed to parse JSX:', error);
      return jsxCode; // Fallback to original code
    }
  }

  private processTemplateLiteral(template: any): string {
    let result = '';
    for (let i = 0; i < template.quasis.length; i++) {
      result += template.quasis[i].value.raw;
      if (i < template.expressions.length) {
        const expr = template.expressions[i];
        if (expr.type === 'Identifier') {
          result += `{${expr.name}}`;
        } else {
          result += `{${this.getExpressionText(expr)}}`;
        }
      }
    }
    return result;
  }

  private processCallExpression(call: any): string {
    let result = '';
    if (call.callee.type === 'Identifier') {
      result += call.callee.name;
    } else if (call.callee.type === 'MemberExpression') {
      result += this.processMemberExpression(call.callee);
    }
    result += '(';
    result += call.arguments.map((arg: any) => this.getExpressionText(arg)).join(', ');
    result += ')';
    return result;
  }

  private processMemberExpression(member: any): string {
    let result = '';
    if (member.object.type === 'Identifier') {
      result += member.object.name;
    } else if (member.object.type === 'MemberExpression') {
      result += this.processMemberExpression(member.object);
    }
    
    if (member.property.type === 'Identifier') {
      result += `.${member.property.name}`;
    } else if (member.property.type === 'StringLiteral') {
      result += `["${member.property.value}"]`;
    } else if (member.property.type === 'NumericLiteral') {
      result += `[${member.property.value}]`;
    }
    
    return result;
  }

  private processBinaryExpression(binary: any): string {
    const left = this.getExpressionText(binary.left);
    const right = this.getExpressionText(binary.right);
    return `${left} ${binary.operator} ${right}`;
  }

  private processConditionalExpression(conditional: any): string {
    const test = this.getExpressionText(conditional.test);
    const consequent = this.getExpressionText(conditional.consequent);
    const alternate = this.getExpressionText(conditional.alternate);
    return `${test} ? ${consequent} : ${alternate}`;
  }

  private getExpressionText(expr: any): string {
    if (expr.type === 'Identifier') return expr.name;
    if (expr.type === 'StringLiteral') return `"${expr.value}"`;
    if (expr.type === 'NumericLiteral') return expr.value.toString();
    if (expr.type === 'BooleanLiteral') return expr.value.toString();
    if (expr.type === 'NullLiteral') return 'null';
    if (expr.type === 'TemplateLiteral') return this.processTemplateLiteral(expr);
    if (expr.type === 'CallExpression') return this.processCallExpression(expr);
    if (expr.type === 'MemberExpression') return this.processMemberExpression(expr);
    if (expr.type === 'BinaryExpression') return this.processBinaryExpression(expr);
    if (expr.type === 'ConditionalExpression') return this.processConditionalExpression(expr);
    if (expr.type === 'ParenthesizedExpression') return `(${this.getExpressionText(expr.expression)})`;
    return '...';
  }
}

/**
 * Simple function for quick JSX-to-text conversion
 */
export function jsxToText(jsxCode: string, options?: JSXToTextOptions): string {
  const converter = new JSXToTextConverter(options);
  return converter.convert(jsxCode);
}
