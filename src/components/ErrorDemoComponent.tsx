import React, { useState } from 'react';
import { ErrorBoundary } from './error-boundary';

// Component that will throw an error
const BuggyComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('🐛 BuggyComponent encountered an error!');
  }
  
  return (
    <div style={{ 
      padding: '1rem', 
      background: '#e8f5e8', 
      border: '2px solid #4caf50', 
      borderRadius: '8px',
      margin: '1rem 0'
    }}>
      <h4>✅ BuggyComponent is working normally</h4>
      <p>This component is functioning correctly when shouldThrow is false.</p>
    </div>
  );
};

// Component that might fail during async operations
const AsyncComponent: React.FC<{ shouldFail: boolean }> = ({ shouldFail }) => {
  const [data, setData] = useState<string>('Loading...');
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (shouldFail) {
          // Simulate an async error
          await new Promise((_, reject) => 
            setTimeout(() => reject(new Error('🌊 Async operation failed!')), 1000)
          );
        } else {
          // Simulate successful async operation
          await new Promise(resolve => setTimeout(resolve, 1000));
          setData('Data loaded successfully! 🎉');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      }
    };

    fetchData();
  }, [shouldFail]);

  if (error) {
    throw new Error(`AsyncComponent failed: ${error}`);
  }

  return (
    <div style={{ 
      padding: '1rem', 
      background: '#e3f2fd', 
      border: '2px solid #2196f3', 
      borderRadius: '8px',
      margin: '1rem 0'
    }}>
      <h4>🔄 AsyncComponent Status</h4>
      <p>{data}</p>
    </div>
  );
};

// Main demo component
const ErrorDemoComponent: React.FC = () => {
  const [buggyState, setBuggyState] = useState(false);
  const [asyncState, setAsyncState] = useState(false);
  const [showNested, setShowNested] = useState(false);

  return (
    <div className="error-demo-component">
      <div className="demo-header">
        <h3>🎭 Error Boundary Demo Scenarios</h3>
        <p>Explore different ways the error boundary can catch and handle errors.</p>
      </div>

      <div className="demo-section">
        <h4>1. Render Error Demo</h4>
        <p>Toggle the buggy component to see how render errors are caught:</p>
        
        <div className="demo-controls">
          <button 
            className="btn btn-primary"
            onClick={() => setBuggyState(!buggyState)}
          >
            {buggyState ? '🔄 Reset Buggy Component' : '🐛 Trigger Buggy Component'}
          </button>
        </div>

        <ErrorBoundary>
          <BuggyComponent shouldThrow={buggyState} />
        </ErrorBoundary>
      </div>

      <div className="demo-section">
        <h4>2. Async Error Demo</h4>
        <p>Test how async errors are handled by the error boundary:</p>
        
        <div className="demo-controls">
          <button 
            className="btn btn-warning"
            onClick={() => setAsyncState(!asyncState)}
          >
            {asyncState ? '🔄 Reset Async Component' : '⚡ Trigger Async Failure'}
          </button>
        </div>

        <ErrorBoundary>
          <AsyncComponent shouldFail={asyncState} />
        </ErrorBoundary>
      </div>

      <div className="demo-section">
        <h4>3. Nested Error Boundaries</h4>
        <p>Demonstrate how nested error boundaries work:</p>
        
        <div className="demo-controls">
          <button 
            className="btn btn-info"
            onClick={() => setShowNested(!showNested)}
          >
            {showNested ? '🔒 Hide Nested Demo' : '🔓 Show Nested Demo'}
          </button>
        </div>

        {showNested && (
          <div className="nested-demo">
            <h5>Outer Error Boundary:</h5>
            <ErrorBoundary>
              <div style={{ 
                padding: '1rem', 
                background: '#fff3e0', 
                border: '2px solid #ff9800', 
                borderRadius: '8px',
                margin: '1rem 0'
              }}>
                <h6>🟡 Outer Component (Working)</h6>
                <p>This component is wrapped by the outer error boundary.</p>
                
                <h5>Inner Error Boundary:</h5>
                <ErrorBoundary>
                  <div style={{ 
                    padding: '1rem', 
                    background: '#fce4ec', 
                    border: '2px solid #e91e63', 
                    borderRadius: '8px',
                    margin: '1rem 0'
                  }}>
                    <h6>🔴 Inner Component (Working)</h6>
                    <p>This component is wrapped by the inner error boundary.</p>
                    
                    <button 
                      className="btn btn-danger"
                      onClick={() => {
                        throw new Error('💥 Inner component error!');
                      }}
                    >
                      💥 Trigger Inner Error
                    </button>
                  </div>
                </ErrorBoundary>
              </div>
            </ErrorBoundary>
          </div>
        )}
      </div>

      <div className="demo-section">
        <h4>4. Error Boundary Features</h4>
        <div className="features-grid">
          <div className="feature-item">
            <h5>🛡️ Error Isolation</h5>
            <p>Errors in one component don't crash the entire app</p>
          </div>
          <div className="feature-item">
            <h5>🎨 Fallback UI</h5>
            <p>Custom error messages and recovery options</p>
          </div>
          <div className="feature-item">
            <h5>📝 Error Logging</h5>
            <p>Detailed error information for debugging</p>
          </div>
          <div className="feature-item">
            <h5>🔄 Recovery Options</h5>
            <p>Try again, dismiss, or reload functionality</p>
          </div>
        </div>
      </div>

      <div className="demo-footer">
        <p><strong>💡 Tip:</strong> Open the browser console to see error logging in action!</p>
      </div>
    </div>
  );
};

export default ErrorDemoComponent;
