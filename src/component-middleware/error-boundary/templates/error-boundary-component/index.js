/**
 * Error Boundary Component Template
 * 
 * A template for an error boundary component that catches JavaScript errors
 * and provides a fallback UI with recovery options.
 */

import { createViewStateMachine } from '../../../../../../log-view-machine/src/core/ViewStateMachine.tsx';

const ErrorBoundaryComponentTemplate = {
  id: 'error-boundary-component',
  name: 'Error Boundary Component',
  description: 'React error boundary with fallback UI and recovery options',
  version: '1.0.0',
  dependencies: ['log-view-machine'],
  
  // Template configuration
  config: {
    machineId: 'error-boundary-component',
    xstateConfig: {
      id: 'error-boundary-component',
      initial: 'normal',
      context: {
        hasError: false,
        error: null,
        errorInfo: null,
        errorTime: null,
        recoveryAttempts: 0,
        maxRecoveryAttempts: 3,
        isDevelopment: false,
        componentName: 'Unknown Component',
        errorBoundaryId: null
      }
    }
  },

  // Create the template instance
  create: (config = {}) => {
    return createViewStateMachine({
      machineId: 'error-boundary-component',
      xstateConfig: {
        ...ErrorBoundaryComponentTemplate.config.xstateConfig,
        ...config.xstateConfig
      },
      logStates: {
        normal: async (context) => {
          await context.log('Error boundary in normal state - no errors detected');
          return context.view(renderNormalView(context));
        },
        
        error: async (context) => {
          await context.log('Error boundary caught an error - displaying fallback UI');
          return context.view(renderErrorView(context));
        },
        
        recovering: async (context) => {
          await context.log('Attempting to recover from error');
          return context.view(renderRecoveringView(context));
        },
        
        maxRetriesExceeded: async (context) => {
          await context.log('Maximum recovery attempts exceeded');
          return context.view(renderMaxRetriesView(context));
        },
        
        development: async (context) => {
          await context.log('Development mode - showing detailed error information');
          return context.view(renderDevelopmentView(context));
        }
      }
    });
  },

  // Template methods
  methods: {
    // Catch an error and transition to error state
    catchError: (error, errorInfo) => {
      return {
        type: 'CATCH_ERROR',
        error,
        errorInfo,
        errorTime: new Date().toISOString()
      };
    },

    // Attempt to recover from error
    attemptRecovery: () => {
      return {
        type: 'ATTEMPT_RECOVERY'
      };
    },

    // Reset error state
    resetError: () => {
      return {
        type: 'RESET_ERROR'
      };
    },

    // Dismiss error
    dismissError: () => {
      return {
        type: 'DISMISS_ERROR'
      };
    },

    // Show development details
    toggleDevelopment: () => {
      return {
        type: 'TOGGLE_DEVELOPMENT'
      };
    }
  },

  // Template events
  events: {
    CATCH_ERROR: {
      target: 'error',
      actions: ['setError', 'logError', 'incrementRecoveryAttempts']
    },
    
    ATTEMPT_RECOVERY: [
      {
        target: 'recovering',
        cond: 'canAttemptRecovery',
        actions: ['attemptRecovery']
      },
      {
        target: 'maxRetriesExceeded',
        cond: 'maxRetriesExceeded',
        actions: ['logMaxRetries']
      }
    ],
    
    RESET_ERROR: {
      target: 'normal',
      actions: ['resetErrorState', 'resetRecoveryAttempts']
    },
    
    DISMISS_ERROR: {
      target: 'normal',
      actions: ['dismissError']
    },
    
    TOGGLE_DEVELOPMENT: {
      target: 'development',
      actions: ['toggleDevelopmentMode']
    }
  },

  // Template actions
  actions: {
    setError: (context, event) => {
      context.error = event.error;
      context.errorInfo = event.errorInfo;
      context.errorTime = event.errorTime;
      context.hasError = true;
    },
    
    logError: (context, event) => {
      if (context.isDevelopment) {
        console.error('🌊 ErrorBoundary caught an error:', event.error);
        console.error('🌊 ErrorBoundary error details:', event.errorInfo);
      }
    },
    
    incrementRecoveryAttempts: (context) => {
      context.recoveryAttempts += 1;
    },
    
    attemptRecovery: (context) => {
      // Attempt to recover by resetting error state
      context.hasError = false;
      context.error = null;
      context.errorInfo = null;
    },
    
    resetErrorState: (context) => {
      context.hasError = false;
      context.error = null;
      context.errorInfo = null;
      context.errorTime = null;
    },
    
    resetRecoveryAttempts: (context) => {
      context.recoveryAttempts = 0;
    },
    
    dismissError: (context) => {
      context.hasError = false;
      context.error = null;
      context.errorInfo = null;
      context.errorTime = null;
    },
    
    toggleDevelopmentMode: (context) => {
      context.isDevelopment = !context.isDevelopment;
    }
  },

  // Template guards
  guards: {
    canAttemptRecovery: (context) => {
      return context.recoveryAttempts < context.maxRecoveryAttempts;
    },
    
    maxRetriesExceeded: (context) => {
      return context.recoveryAttempts >= context.maxRecoveryAttempts;
    }
  }
};

// View rendering functions
function renderNormalView(context) {
  return `
    <div class="error-boundary-normal">
      <div class="normal-content">
        <div class="status-indicator">
          <span class="status-icon">✅</span>
          <span class="status-text">Component is running normally</span>
        </div>
        <p class="normal-description">
          This error boundary is actively monitoring for errors and will catch any JavaScript errors that occur in its child components.
        </p>
        <div class="boundary-info">
          <h4>Error Boundary Status:</h4>
          <ul>
            <li><strong>State:</strong> Normal</li>
            <li><strong>Recovery Attempts:</strong> ${context.model.recoveryAttempts}</li>
            <li><strong>Component:</strong> ${context.model.componentName}</li>
            <li><strong>ID:</strong> ${context.model.errorBoundaryId || 'Auto-generated'}</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

function renderErrorView(context) {
  return `
    <div class="generic-editor error-editor">
      <header class="editor-header error-header">
        <h1 class="editor-title">🌊 Wave Reader Error</h1>
        <p class="editor-description">Something went wrong with the component</p>
      </header>
      
      <main class="editor-main">
        <div class="error-content">
          <div class="error-icon">⚠️</div>
          <h2>Component Error Detected</h2>
          <p>An error occurred while rendering this component. The error boundary has caught it and prevented the entire app from crashing.</p>
          
          <div class="error-actions">
            <button class="btn btn-primary" onclick="attemptRecovery()">
              🔄 Try Again (${context.model.maxRecoveryAttempts - context.model.recoveryAttempts} attempts left)
            </button>
            <button class="btn btn-secondary" onclick="dismissError()">
              ✕ Dismiss
            </button>
            <button class="btn btn-info" onclick="toggleDevelopment()">
              🔍 ${context.model.isDevelopment ? 'Hide' : 'Show'} Details
            </button>
          </div>
          
          <div class="error-info">
            <h4>Common Causes:</h4>
            <ul>
              <li>CSS injection issues in Shadow DOM</li>
              <li>React component mounting problems</li>
              <li>Browser compatibility issues</li>
              <li>Network or resource loading failures</li>
              <li>JavaScript runtime errors</li>
            </ul>
          </div>
          
          ${context.model.isDevelopment && (context.model.error || context.model.errorInfo) ? `
            <details class="error-details" open>
              <summary class="error-summary">
                🔍 Error Details (Development Mode)
              </summary>
              <div class="error-stack-container">
                ${context.model.error ? `
                  <div class="error-stack-section">
                    <h4>Error Message:</h4>
                    <pre class="error-stack">${context.model.error.toString()}</pre>
                  </div>
                ` : ''}
                
                ${context.model.errorInfo?.componentStack ? `
                  <div class="error-stack-section">
                    <h4>Component Stack:</h4>
                    <pre class="error-stack">${context.model.errorInfo.componentStack}</pre>
                  </div>
                ` : ''}
                
                <div class="error-stack-section">
                  <h4>Error Time:</h4>
                  <p>${new Date(context.model.errorTime).toLocaleString()}</p>
                </div>
                
                <div class="error-stack-section">
                  <h4>Recovery Attempts:</h4>
                  <p>${context.model.recoveryAttempts} / ${context.model.maxRecoveryAttempts}</p>
                </div>
              </div>
            </details>
          ` : ''}
        </div>
      </main>
      
      <footer class="editor-footer">
        <p>🔗 Wave Reader Error Boundary - Keeping your app stable</p>
      </footer>
    </div>
  `;
}

function renderRecoveringView(context) {
  return `
    <div class="error-boundary-recovering">
      <div class="recovering-content">
        <div class="recovering-icon">🔄</div>
        <h3>Attempting Recovery...</h3>
        <p>Attempt ${context.model.recoveryAttempts} of ${context.model.maxRecoveryAttempts}</p>
        <div class="recovering-spinner"></div>
        <p class="recovering-note">
          The error boundary is attempting to recover from the error. 
          If successful, the component will return to normal operation.
        </p>
      </div>
    </div>
  `;
}

function renderMaxRetriesView(context) {
  return `
    <div class="generic-editor error-editor max-retries">
      <header class="editor-header error-header">
        <h1 class="editor-title">🚨 Recovery Failed</h1>
        <p class="editor-description">Maximum recovery attempts exceeded</p>
      </header>
      
      <main class="editor-main">
        <div class="error-content">
          <div class="error-icon">💥</div>
          <h2>Component Recovery Failed</h2>
          <p>The error boundary has attempted to recover ${context.model.maxRecoveryAttempts} times but the component continues to fail.</p>
          
          <div class="error-actions">
            <button class="btn btn-primary" onclick="resetError()">
              🔄 Reset and Try Again
            </button>
            <button class="btn btn-warning" onclick="dismissError()">
              ✕ Dismiss Permanently
            </button>
            <button class="btn btn-info" onclick="toggleDevelopment()">
              🔍 ${context.model.isDevelopment ? 'Hide' : 'Show'} Details
            </button>
          </div>
          
          <div class="error-info">
            <h4>Recovery Status:</h4>
            <ul>
              <li><strong>Total Attempts:</strong> ${context.model.recoveryAttempts}</li>
              <li><strong>Max Attempts:</strong> ${context.model.maxRecoveryAttempts}</li>
              <li><strong>Last Error:</strong> ${context.model.errorTime ? new Date(context.model.errorTime).toLocaleString() : 'Unknown'}</li>
              <li><strong>Component:</strong> ${context.model.componentName}</li>
            </ul>
          </div>
          
          ${context.model.isDevelopment ? `
            <details class="error-details" open>
              <summary class="error-summary">
                🔍 Full Error History (Development Mode)
              </summary>
              <div class="error-stack-container">
                ${context.model.error ? `
                  <div class="error-stack-section">
                    <h4>Latest Error:</h4>
                    <pre class="error-stack">${context.model.error.toString()}</pre>
                  </div>
                ` : ''}
                
                <div class="error-stack-section">
                  <h4>Recovery Timeline:</h4>
                  <p>Multiple recovery attempts were made but the component continues to fail.</p>
                  <p>Consider investigating the root cause of the error or implementing a more robust error handling strategy.</p>
                </div>
              </div>
            </details>
          ` : ''}
        </div>
      </main>
      
      <footer class="editor-footer">
        <p>🔗 Wave Reader Error Boundary - Recovery Failed</p>
      </footer>
    </div>
  `;
}

function renderDevelopmentView(context) {
  return `
    <div class="generic-editor error-editor development">
      <header class="editor-header error-header">
        <h1 class="editor-title">🔧 Development Mode</h1>
        <p class="editor-description">Detailed error information and debugging tools</p>
      </header>
      
      <main class="editor-main">
        <div class="error-content">
          <div class="error-icon">🔍</div>
          <h2>Development Debugging View</h2>
          <p>This view provides comprehensive error information for developers.</p>
          
          <div class="error-actions">
            <button class="btn btn-primary" onclick="attemptRecovery()">
              🔄 Attempt Recovery
            </button>
            <button class="btn btn-secondary" onclick="resetError()">
              ✕ Reset Error
            </button>
            <button class="btn btn-info" onclick="toggleDevelopment()">
              🔍 Exit Development Mode
            </button>
          </div>
          
          <div class="development-info">
            <h4>Error Boundary State:</h4>
            <div class="state-grid">
              <div class="state-item">
                <span class="state-label">Has Error:</span>
                <span class="state-value">${context.model.hasError ? 'Yes' : 'No'}</span>
              </div>
              <div class="state-item">
                <span class="state-label">Recovery Attempts:</span>
                <span class="state-value">${context.model.recoveryAttempts}</span>
              </div>
              <div class="state-item">
                <span class="state-label">Max Attempts:</span>
                <span class="state-value">${context.model.maxRecoveryAttempts}</span>
              </div>
              <div class="state-item">
                <span class="state-label">Component Name:</span>
                <span class="state-value">${context.model.componentName}</span>
              </div>
              <div class="state-item">
                <span class="state-label">Boundary ID:</span>
                <span class="state-value">${context.model.errorBoundaryId || 'Auto-generated'}</span>
              </div>
              <div class="state-item">
                <span class="state-label">Development Mode:</span>
                <span class="state-value">${context.model.isDevelopment ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>
          
          ${context.model.error || context.model.errorInfo ? `
            <details class="error-details" open>
              <summary class="error-summary">
                🔍 Complete Error Information
              </summary>
              <div class="error-stack-container">
                ${context.model.error ? `
                  <div class="error-stack-section">
                    <h4>Error Object:</h4>
                    <pre class="error-stack">${JSON.stringify(context.model.error, Object.getOwnPropertyNames(context.model.error), 2)}</pre>
                  </div>
                ` : ''}
                
                ${context.model.errorInfo ? `
                  <div class="error-stack-section">
                    <h4>Error Info:</h4>
                    <pre class="error-stack">${JSON.stringify(context.model.errorInfo, null, 2)}</pre>
                  </div>
                ` : ''}
                
                ${context.model.errorTime ? `
                  <div class="error-stack-section">
                    <h4>Error Timestamp:</h4>
                    <p>${new Date(context.model.errorTime).toISOString()}</p>
                  </div>
                ` : ''}
              </div>
            </details>
          ` : ''}
        </div>
      </main>
      
      <footer class="editor-footer">
        <p>🔗 Wave Reader Error Boundary - Development Mode</p>
      </footer>
    </div>
  `;
}

export default ErrorBoundaryComponentTemplate;
