import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

// Check if we're in development mode - use a simple approach
const isDevelopment = typeof window !== 'undefined' && window.location && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Only log errors in development mode
        if (isDevelopment) {
            console.error('🌊 ErrorBoundary caught an error:', error);
        }
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Only log errors in development mode
        if (isDevelopment) {
            console.error('🌊 ErrorBoundary error details:', errorInfo);
            console.error('🌊 ErrorBoundary error:', error);
        }
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.fallback || (
                <div style={{
                    padding: '20px',
                    border: '1px solid #ff6b6b',
                    borderRadius: '8px',
                    backgroundColor: '#fff5f5',
                    color: '#d63031',
                    margin: '10px',
                    fontSize: '14px',
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10001,
                    maxWidth: '400px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#d63031' }}>
                        🌊 Wave Reader Error
                    </h3>
                    <p style={{ margin: '0 0 10px 0' }}>
                        Something went wrong with the selector UI. This might be due to:
                    </p>
                    <ul style={{ margin: '0 0 10px 0', paddingLeft: '20px' }}>
                        <li>CSS injection issues in Shadow DOM</li>
                        <li>React component mounting problems</li>
                        <li>Browser compatibility issues</li>
                    </ul>
                    <button 
                        onClick={() => this.setState({ hasError: false })}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#d63031',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            marginRight: '8px'
                        }}
                    >
                        Try Again
                    </button>
                    <button 
                        onClick={() => this.setState({ hasError: false, error: undefined })}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        Dismiss
                    </button>
                    {isDevelopment && this.state.error && (
                        <details style={{ marginTop: '10px', fontSize: '12px' }}>
                            <summary style={{ cursor: 'pointer', color: '#d63031' }}>
                                Error Details
                            </summary>
                            <pre style={{ 
                                margin: '10px 0 0 0', 
                                padding: '10px', 
                                backgroundColor: '#f8f9fa',
                                borderRadius: '4px',
                                fontSize: '11px',
                                overflow: 'auto',
                                maxHeight: '200px'
                            }}>
                                {this.state.error.toString()}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
} 