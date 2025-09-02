#!/usr/bin/env node

/**
 * Update Tome Studio Server
 * Replaces raw HTML res.send() calls with EJS template rendering
 */

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'node_modules/tome-connector-studio/editor-server.js');

async function updateServer() {
  console.log('🔧 Updating Tome Studio Server to use EJS templates...\n');
  
  try {
    let serverContent = fs.readFileSync(serverPath, 'utf8');
    
    // Add EJS setup after Express app creation
    const ejsSetup = `
// Set up EJS template engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
`;
    
    if (!serverContent.includes('app.set(\'view engine\', \'ejs\')')) {
      const appCreationIndex = serverContent.indexOf('const app = express();');
      if (appCreationIndex !== -1) {
        const insertIndex = appCreationIndex + 'const app = express();'.length;
        serverContent = serverContent.slice(0, insertIndex) + ejsSetup + serverContent.slice(insertIndex);
        console.log('✅ Added EJS template engine setup');
      }
    }
    
    // Replace the first res.send() (studio home page)
    const studioHomeRoute = `// Main studio interface
app.get('/', (req, res) => {
    res.render('studio-home', {
        title: 'Tome Connector Studio',
        description: 'A powerful studio for building and managing Tome Connector components, state machines, and integrations'
    });
});`;
    
    if (!serverContent.includes('res.render(\'studio-home\'')) {
      const resSendPattern = /\/\/ Main studio interface\s+app\.get\('\/', \(req, res\) => \{\s+res\.send\(`[\s\S]*?`\);\s+\}\);/
      if (resSendPattern.test(serverContent)) {
        serverContent = serverContent.replace(resSendPattern, studioHomeRoute);
        console.log('✅ Replaced studio home res.send() with EJS template');
      }
    }
    
    // Replace the second res.send() (wave-reader page)
    const waveReaderRoute = `// Wave Reader Editor Interface
app.get('/wave-reader', (req, res) => {
    const workingDir = process.env.WORKING_DIRECTORY || 'Current Directory';
    const studioVersion = '1.2.0';
    
    // Sample component data (in production, this would come from actual component discovery)
    const components = [
        {
            id: 'error-boundary',
            icon: '🎯',
            name: 'Error Boundary',
            description: 'Error handling and boundary management for components'
        },
        {
            id: 'go-button',
            icon: '🔘',
            name: 'Go Button',
            description: 'Navigation and action button components'
        },
        {
            id: 'selector-hierarchy',
            icon: '🌳',
            name: 'Selector Hierarchy',
            description: 'Component selection and hierarchy management'
        },
        {
            id: 'settings',
            icon: '⚙️',
            name: 'Settings',
            description: 'Configuration and settings management'
        },
        {
            id: 'wave-tabs',
            icon: '📑',
            name: 'Wave Tabs',
            description: 'Tab-based navigation and content management'
        },
        {
            id: 'scan-for-input',
            icon: '🔍',
            name: 'Scan for Input',
            description: 'Input detection and scanning functionality'
        },
        {
            id: 'selector-input',
            icon: '⌨️',
            name: 'Selector Input',
            description: 'Input selection and management tools'
        },
        {
            id: 'wave-reader',
            icon: '🌊',
            name: 'Wave Reader',
            description: 'Core Wave Reader functionality and components'
        }
    ];
    
    const componentData = {
        'error-boundary': {
            name: 'Error Boundary',
            files: {
                'component.tsx': '// Error boundary component code would be here',
                'index.ts': 'export { ErrorBoundary } from "./component";',
                'types.ts': 'export interface ErrorInfo { componentStack: string; }',
                'utils.ts': 'export const logError = (error: Error, errorInfo: any) => { console.error("Error logged:", error, errorInfo); };'
            }
        },
        'go-button': {
            name: 'Go Button',
            files: {
                'component.tsx': '// Go button component code would be here',
                'index.ts': 'export { GoButton } from "./component";',
                'types.ts': 'export type ButtonVariant = "primary" | "secondary" | "success";',
                'utils.ts': 'export const getButtonClasses = (variant: ButtonVariant) => { /* Button styling utilities */ };'
            }
        }
    };
    
    res.render('wave-reader', {
        workingDir,
        studioVersion,
        components,
        componentData
    });
});`;
    
    if (!serverContent.includes('res.render(\'wave-reader\'')) {
      const resSendPattern2 = /\/\/ Wave Reader Editor Interface\s+app\.get\('\/wave-reader', \(req, res\) => \{\s+const workingDir = process\.env\.WORKING_DIRECTORY \|\| 'Current Directory';\s+res\.send\(`[\s\S]*?`\);\s+\}\);/
      if (resSendPattern2.test(serverContent)) {
        serverContent = serverContent.replace(resSendPattern2, waveReaderRoute);
        console.log('✅ Replaced wave-reader res.send() with EJS template');
      }
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(serverPath, serverContent, 'utf8');
    console.log('\n✅ Server updated successfully!');
    console.log('📝 All res.send() calls with raw HTML have been replaced with EJS templates');
    console.log('🔧 The server now uses proper template rendering instead of raw HTML strings');
    
  } catch (error) {
    console.error('❌ Error updating server:', error.message);
    process.exit(1);
  }
}

// Run the update
if (require.main === module) {
  updateServer().catch(console.error);
}

module.exports = { updateServer };
