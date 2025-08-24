import React, { useState } from 'react';
import { ErrorBoundary } from './error-boundary';

interface ErrorTestComponentProps {
  shouldError?: boolean;
}

const ErrorTestComponent: React.FC<ErrorTestComponentProps> = ({ shouldError = false }) => {
  const [triggerError, setTriggerError] = useState(shouldError);
  const [errorType, setErrorType] = useState<'render' | 'runtime' | 'async'>('render');

  // This will cause a render error
  if (triggerError && errorType === 'render') {
    throw new Error('🌊 Render Error: This is a simulated render error in the Wave Reader ErrorTestComponent');
  }

  const handleRuntimeError = () => {
    if (errorType === 'runtime') {
      throw new Error('🌊 Runtime Error: This is a simulated runtime error');
    }
  };

  const handleAsyncError = async () => {
    if (errorType === 'async') {
      // Simulate an async error
      await new Promise(resolve => setTimeout(resolve, 100));
      throw new Error('🌊 Async Error: This is a simulated async error');
    }
  };

  const simulateError = (type: 'render' | 'runtime' | 'async') => {
    setErrorType(type);
    setTriggerError(true);

    if (type === 'runtime') {
      // Use setTimeout to trigger error in next tick
      setTimeout(() => {
        handleRuntimeError();
      }, 0);
    } else if (type === 'async') {
      handleAsyncError();
    }
  };

  return (
    <div className="error-test-component">
      <div className="test-header">
        <h3>🧪 Wave Reader Error Boundary Test</h3>
        <p>This component is designed to test the error boundary functionality in Wave Reader.</p>
      </div>

      <div className="test-controls">
        <h4>Test Different Error Types:</h4>

        <div className="error-buttons">
          <button
            className="btn btn-danger"
            onClick={() => simulateError('render')}
          >
            🚨 Trigger Render Error
          </button>

          <button
            className="btn btn-warning"
            onClick={() => simulateError('runtime')}
          >
            ⚡ Trigger Runtime Error
          </button>

          <button
            className="btn btn-info"
            onClick={() => simulateError('async')}
          >
            🔄 Trigger Async Error
          </button>
        </div>

        <div className="test-info">
          <p><strong>Render Error:</strong> Throws during component render</p>
          <p><strong>Runtime Error:</strong> Throws during event handling</p>
          <p><strong>Async Error:</strong> Throws during async operations</p>
        </div>
      </div>

      <div className="component-status">
        <h4>Component Status:</h4>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">Error State:</span>
            <span className="status-value">🟢 Normal</span>
          </div>
          <div className="status-item">
            <span className="status-label">Error Type:</span>
            <span className="status-value">{errorType}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Last Action:</span>
            <span className="status-value">None</span>
          </div>
        </div>
      </div>

      <div className="test-description">
        <h4>How Error Boundaries Work in Wave Reader:</h4>
        <ul>
          <li><strong>Error Catching:</strong> Catches JavaScript errors anywhere in the component tree</li>
          <li><strong>Fallback UI:</strong> Renders a fallback UI instead of the crashed component</li>
          <li><strong>Error Logging:</strong> Logs error information for debugging</li>
          <li><strong>Recovery:</strong> Provides options to retry or reload the component</li>
          <li><strong>Wave Reader Specific:</strong> Handles CSS injection, Shadow DOM, and browser compatibility issues</li>
        </ul>
      </div>
    </div>
  );
};

// Export a wrapped version that demonstrates the error boundary
const ErrorTestComponentWithBoundary: React.FC<ErrorTestComponentProps> = (props) => {
  return (
    <ErrorBoundary>
      <ErrorTestComponent {...props} />
    </ErrorBoundary>
  );
};

export default ErrorTestComponentWithBoundary;
