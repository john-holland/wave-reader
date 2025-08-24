import React, { Component, ReactNode } from 'react';
import ComponentMiddlewareErrorBoundary from '../component-middleware/error-boundary/ErrorBoundaryTomes';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    componentName?: string;
    maxRecoveryAttempts?: number;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    onRecovery?: (attempts: number) => void;
    onReset?: () => void;
    enableDevelopmentMode?: boolean;
    customErrorBoundaryId?: string;
}

// Check if we're in development mode - use a simple approach
const isDevelopment = typeof window !== 'undefined' && window.location && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

/**
 * Legacy Error Boundary Component
 * 
 * This component maintains backward compatibility while providing access to
 * the new component-middleware features. It wraps the new ErrorBoundary
 * component and provides the same API.
 */
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
        this.setState({ errorInfo });

        // Call the onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            // Use the new component-middleware error boundary
            return (
                <ComponentMiddlewareErrorBoundary
                    componentName={this.props.componentName}
                    maxRecoveryAttempts={this.props.maxRecoveryAttempts}
                    onError={this.props.onError}
                    onRecovery={this.props.onRecovery}
                    onReset={this.props.onReset}
                    enableDevelopmentMode={this.props.enableDevelopmentMode}
                    customErrorBoundaryId={this.props.customErrorBoundaryId}
                    fallback={this.props.fallback}
                >
                    {/* This won't render due to the error, but it maintains the component structure */}
                    <div style={{ display: 'none' }} />
                </ComponentMiddlewareErrorBoundary>
            );
        }

        return this.props.children;
    }
}

// Re-export the new component-middleware ErrorBoundary for direct use
export { default as ModernErrorBoundary } from '../component-middleware/error-boundary/ErrorBoundaryTomes';

// Re-export utility functions
export { 
    withErrorBoundary, 
    useErrorBoundary, 
    createErrorBoundary 
} from '../component-middleware/error-boundary/ErrorBoundaryTomes'; 