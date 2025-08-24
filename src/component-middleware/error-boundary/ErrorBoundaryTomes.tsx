/**
 * Error Boundary Tomes
 * 
 * Integration layer for the error boundary component-middleware system.
 * Provides React components and utilities for using error boundaries in wave-reader.
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import ErrorBoundaryComponentTemplate from './templates/error-boundary-component';

// Check if we're in development mode
const isDevelopment = typeof window !== 'undefined' && window.location && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

/**
 * Error Boundary Component Props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  maxRecoveryAttempts?: number;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRecovery?: (attempts: number) => void;
  onReset?: () => void;
  enableDevelopmentMode?: boolean;
  customErrorBoundaryId?: string;
}

/**
 * Error Boundary Component State
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  recoveryAttempts: number;
  isDevelopment: boolean;
}

/**
 * React Error Boundary Component
 * 
 * Wraps the component-middleware error boundary template in a React component
 * that can be used throughout the wave-reader application.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorBoundaryId: string;
  private template: any;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    // Generate unique ID for this error boundary instance
    this.errorBoundaryId = props.customErrorBoundaryId || 
      `error-boundary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    this.state = {
      hasError: false,
      recoveryAttempts: 0,
      isDevelopment: props.enableDevelopmentMode !== false && isDevelopment
    };

    // Initialize the component-middleware template
    this.template = ErrorBoundaryComponentTemplate.create({
      xstateConfig: {
        context: {
          componentName: props.componentName || 'Unknown Component',
          errorBoundaryId: this.errorBoundaryId,
          maxRecoveryAttempts: props.maxRecoveryAttempts || 3,
          isDevelopment: this.state.isDevelopment
        }
      }
    });
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Only log errors in development mode
    if (isDevelopment) {
      console.error('🌊 ErrorBoundary caught an error:', error);
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log errors in development mode
    if (isDevelopment) {
      console.error('🌊 ErrorBoundary error details:', errorInfo);
      console.error('🌊 ErrorBoundary error:', error);
    }

    this.setState({ errorInfo });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update the template state
    this.template.send('CATCH_ERROR', { error, errorInfo });
  }

  private handleRecovery = async () => {
    const { recoveryAttempts } = this.state;
    const maxAttempts = this.props.maxRecoveryAttempts || 3;

    if (recoveryAttempts < maxAttempts) {
      // Attempt recovery
      this.setState(prevState => ({
        recoveryAttempts: prevState.recoveryAttempts + 1
      }));

      // Call the onRecovery callback if provided
      if (this.props.onRecovery) {
        this.props.onRecovery(recoveryAttempts + 1);
      }

      // Send recovery event to template
      this.template.send('ATTEMPT_RECOVERY');

      // Try to reset the error state
      setTimeout(() => {
        this.setState({
          hasError: false,
          error: undefined,
          errorInfo: undefined
        });
      }, 1000);
    }
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      recoveryAttempts: 0
    });

    // Call the onReset callback if provided
    if (this.props.onReset) {
      this.props.onReset();
    }

    // Send reset event to template
    this.template.send('RESET_ERROR');
  };

  private handleDismiss = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined
    });

    // Send dismiss event to template
    this.template.send('DISMISS_ERROR');
  };

  private toggleDevelopmentMode = () => {
    this.setState(prevState => ({
      isDevelopment: !prevState.isDevelopment
    }));

    // Send toggle development event to template
    this.template.send('TOGGLE_DEVELOPMENT');
  };

  render() {
    if (this.state.hasError) {
      // Use our modern generic editor style with component-middleware integration
      return this.props.fallback || (
        <div className="generic-editor error-editor">
          <header className="editor-header error-header">
            <h1 className="editor-title">🌊 Wave Reader Error</h1>
            <p className="editor-description">
              Something went wrong with {this.props.componentName || 'the component'}
            </p>
          </header>
          
          <main className="editor-main">
            <div className="error-content">
              <div className="error-icon">⚠️</div>
              <h2>Component Error Detected</h2>
              <p>
                An error occurred while rendering this component. The error boundary has caught it 
                and prevented the entire app from crashing.
              </p>
              
              <div className="error-actions">
                <button 
                  className="btn btn-primary"
                  onClick={this.handleRecovery}
                  disabled={this.state.recoveryAttempts >= (this.props.maxRecoveryAttempts || 3)}
                >
                  🔄 Try Again 
                  {this.state.recoveryAttempts > 0 && (
                    <span> ({this.state.recoveryAttempts}/{this.props.maxRecoveryAttempts || 3})</span>
                  )}
                </button>
                
                <button 
                  className="btn btn-secondary"
                  onClick={this.handleDismiss}
                >
                  ✕ Dismiss
                </button>
                
                <button 
                  className="btn btn-info"
                  onClick={this.toggleDevelopmentMode}
                >
                  🔍 {this.state.isDevelopment ? 'Hide' : 'Show'} Details
                </button>
              </div>
              
              <div className="error-info">
                <h4>Common Causes:</h4>
                <ul>
                  <li>CSS injection issues in Shadow DOM</li>
                  <li>React component mounting problems</li>
                  <li>Browser compatibility issues</li>
                  <li>Network or resource loading failures</li>
                  <li>JavaScript runtime errors</li>
                </ul>
              </div>
              
              {this.state.isDevelopment && (this.state.error || this.state.errorInfo) && (
                <details className="error-details" open>
                  <summary className="error-summary">
                    🔍 Error Details (Development Mode)
                  </summary>
                  <div className="error-stack-container">
                    {this.state.error && (
                      <div className="error-stack-section">
                        <h4>Error Message:</h4>
                        <pre className="error-stack">
                          {this.state.error.toString()}
                        </pre>
                      </div>
                    )}
                    
                    {this.state.errorInfo?.componentStack && (
                      <div className="error-stack-section">
                        <h4>Component Stack:</h4>
                        <pre className="error-stack">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                    
                    <div className="error-stack-section">
                      <h4>Error Time:</h4>
                      <p>{new Date().toLocaleString()}</p>
                    </div>
                    
                    <div className="error-stack-section">
                      <h4>Recovery Attempts:</h4>
                      <p>{this.state.recoveryAttempts} / {this.props.maxRecoveryAttempts || 3}</p>
                    </div>
                    
                    <div className="error-stack-section">
                      <h4>Error Boundary ID:</h4>
                      <p>{this.errorBoundaryId}</p>
                    </div>
                  </div>
                </details>
              )}
              
              {this.state.recoveryAttempts >= (this.props.maxRecoveryAttempts || 3) && (
                <div className="error-info max-retries-warning">
                  <h4>⚠️ Maximum Recovery Attempts Reached</h4>
                  <p>
                    The error boundary has attempted to recover {this.state.recoveryAttempts} times 
                    but the component continues to fail. Consider investigating the root cause 
                    or implementing a more robust error handling strategy.
                  </p>
                  <button 
                    className="btn btn-warning"
                    onClick={this.handleReset}
                  >
                    🔄 Reset and Try Again
                  </button>
                </div>
              )}
            </div>
          </main>
          
          <footer className="editor-footer">
            <p>🔗 Wave Reader Error Boundary - Keeping your app stable</p>
          </footer>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-Order Component for wrapping components with error boundaries
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * Hook for using error boundary functionality in functional components
 */
export function useErrorBoundary() {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = React.useState<ErrorInfo | null>(null);

  const catchError = React.useCallback((error: Error, errorInfo: ErrorInfo) => {
    setHasError(true);
    setError(error);
    setErrorInfo(errorInfo);
    
    if (isDevelopment) {
      console.error('🌊 useErrorBoundary caught an error:', error);
      console.error('🌊 useErrorBoundary error details:', errorInfo);
    }
  }, []);

  const resetError = React.useCallback(() => {
    setHasError(false);
    setError(null);
    setErrorInfo(null);
  }, []);

  return {
    hasError,
    error,
    errorInfo,
    catchError,
    resetError
  };
}

/**
 * Utility function for creating error boundaries with specific configurations
 */
export function createErrorBoundary(config: {
  componentName?: string;
  maxRecoveryAttempts?: number;
  enableDevelopmentMode?: boolean;
  customErrorBoundaryId?: string;
}) {
  return function ErrorBoundaryWrapper({ children, ...props }: ErrorBoundaryProps) {
    return (
      <ErrorBoundary {...config} {...props}>
        {children}
      </ErrorBoundary>
    );
  };
}

/**
 * Default export for the ErrorBoundary component
 */
export default ErrorBoundary;
