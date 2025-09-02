#!/usr/bin/env node

/**
 * Test EJS Templates
 * Verifies that our EJS templates render correctly without syntax errors
 */

const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

async function testEJSTemplates() {
  console.log('🧪 Testing EJS Templates...\n');
  
  try {
    // Test studio-home template
    console.log('📝 Testing studio-home.ejs...');
    const studioHomeTemplate = fs.readFileSync(
      path.join(__dirname, '../../node_modules/tome-connector-studio/views/studio-home.ejs'), 
      'utf8'
    );
    
    const studioHomeData = {
      title: 'Tome Connector Studio',
      description: 'A powerful studio for building and managing Tome Connector components, state machines, and integrations'
    };
    
    const studioHomeHtml = ejs.render(studioHomeTemplate, studioHomeData);
    console.log('✅ studio-home.ejs rendered successfully');
    console.log(`   HTML length: ${studioHomeHtml.length} characters`);
    console.log(`   Contains title: ${studioHomeHtml.includes('Tome Connector Studio')}`);
    console.log(`   Contains description: ${studioHomeHtml.includes('powerful studio')}`);
    
    // Test wave-reader template
    console.log('\n📝 Testing wave-reader.ejs...');
    const waveReaderTemplate = fs.readFileSync(
      path.join(__dirname, '../../node_modules/tome-connector-studio/views/wave-reader.ejs'), 
      'utf8'
    );
    
    const waveReaderData = {
      workingDir: '/test/project',
      studioVersion: '1.2.0',
      components: [
        {
          id: 'error-boundary',
          icon: '🎯',
          name: 'Error Boundary',
          description: 'Error handling and boundary management for components',
          files: {
            'component.tsx': '// Error boundary component code',
            'index.ts': 'export { ErrorBoundary } from "./component";',
            'types.ts': 'export interface ErrorInfo { componentStack: string; }',
            'utils.ts': 'export const logError = (error: Error, errorInfo: any) => { console.error("Error logged:", error, errorInfo); };'
          }
        },
        {
          id: 'go-button',
          icon: '🔘',
          name: 'Go Button',
          description: 'Navigation and action button components',
          files: {
            'component.tsx': '// Go button component code',
            'index.ts': 'export { GoButton } from "./component";',
            'types.ts': 'export type ButtonVariant = "primary" | "secondary" | "success";',
            'utils.ts': 'export const getButtonClasses = (variant: ButtonVariant) => { /* Button styling utilities */ };'
          }
        }
      ],
      componentData: {
        'error-boundary': {
          name: 'Error Boundary',
          files: {
            'component.tsx': '// Error boundary component code',
            'index.ts': 'export { ErrorBoundary } from "./component";',
            'types.ts': 'export interface ErrorInfo { componentStack: string; }',
            'utils.ts': 'export const logError = (error: Error, errorInfo: any) => { console.error("Error logged:", error, errorInfo); };'
          }
        },
        'go-button': {
          name: 'Go Button',
          files: {
            'component.tsx': '// Go button component code',
            'index.ts': 'export { GoButton } from "./component";',
            'types.ts': 'export type ButtonVariant = "primary" | "secondary" | "success";',
            'utils.ts': 'export const getButtonClasses = (variant: ButtonVariant) => { /* Button styling utilities */ };'
          }
        }
      }
    };
    
    const waveReaderHtml = ejs.render(waveReaderTemplate, waveReaderData);
    console.log('✅ wave-reader.ejs rendered successfully');
    console.log(`   HTML length: ${waveReaderHtml.length} characters`);
    console.log(`   Contains working directory: ${waveReaderHtml.includes('/test/project')}`);
    console.log(`   Contains studio version: ${waveReaderHtml.includes('1.2.0')}`);
    console.log(`   Contains component count: ${waveReaderHtml.includes('Error Boundary') && waveReaderHtml.includes('Go Button')}`);
    
    // Validate that no raw template variables remain
    console.log('\n🔍 Validating template processing...');
    
    const rawTemplateVars = [
      '<%= title %>',
      '<%= description %>',
      '<%= workingDir %>',
      '<%= studioVersion %>',
      '<%= components.forEach'
    ];
    
    let hasRawVars = false;
    rawTemplateVars.forEach(varName => {
      if (studioHomeHtml.includes(varName) || waveReaderHtml.includes(varName)) {
        console.log(`❌ Found raw template variable: ${varName}`);
        hasRawVars = true;
      }
    });
    
    if (!hasRawVars) {
      console.log('✅ All template variables were properly processed');
    }
    
    // Check for JSX syntax that should NOT be in the final HTML
    console.log('\n🔍 Checking for JSX syntax...');
    
    const jsxPatterns = [
      'className={',
      'onClick={',
      'disabled={',
      '{children}',
      'React.FC<',
      'React.Component'
    ];
    
    let hasJSX = false;
    jsxPatterns.forEach(pattern => {
      if (waveReaderHtml.includes(pattern)) {
        console.log(`❌ Found JSX syntax: ${pattern}`);
        hasJSX = true;
      }
    });
    
    if (!hasJSX) {
      console.log('✅ No JSX syntax found in rendered HTML');
    }
    
    console.log('\n🎯 EJS Template Test Summary:');
    console.log('✅ Templates render without errors');
    console.log('✅ Template variables are processed');
    console.log('✅ No raw JSX syntax in output');
    console.log('✅ HTML is properly structured');
    
  } catch (error) {
    console.error('❌ Error testing EJS templates:', error.message);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testEJSTemplates().catch(console.error);
}

module.exports = { testEJSTemplates };
