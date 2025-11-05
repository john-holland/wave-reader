import React, { ErrorInfo } from 'react';
import type { MachineRouter } from 'log-view-machine';
// Use extracted ErrorBoundary directly - no ace-editor dependency
// @ts-expect-error - ErrorBoundary available in monorepo, or use package export: import { ErrorBoundary } from 'log-view-machine'
import { ErrorBoundary } from 'log-view-machine/src/components/ErrorBoundary';

interface EditorWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  componentId?: string;
  onError?: (error: Error, errorInfo?: ErrorInfo) => void;
  router?: MachineRouter;
}

/**
 * EditorWrapper Component
 * 
 * Lightweight wrapper with ErrorBoundary - always uses tome architecture.
 * For editor UI features, use LazyEditor component instead.
 * 
 * This wrapper has zero ace-editor dependency and is tree-shakeable.
 */
const EditorWrapper: React.FC<EditorWrapperProps> = ({
  title,
  description,
  children,
  componentId,
  onError,
  router
}) => {
  return (
    <div className="generic-editor" data-state="ready">
      <header className="editor-header" style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderBottom: '1px solid #dee2e6',
        borderRadius: '8px 8px 0 0'
      }}>
        <h1 className="editor-title" style={{
          margin: '0 0 5px 0',
          fontSize: '1.25rem',
          color: '#333'
        }}>
          {title}
        </h1>
        <p className="editor-description" style={{
          margin: '0',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          {description}
        </p>
        <div className="editor-status" style={{
          fontSize: '12px',
          marginTop: '5px',
          opacity: 0.7,
          color: '#007bff'
        }}>
          📝 Tome Architecture
          {componentId && ` | Component: ${componentId}`}
          {router && ' | Router: Available'}
        </div>
      </header>
      
      <main className="editor-main" style={{
        padding: '0',
        backgroundColor: 'white'
      }}>
        <ErrorBoundary onError={onError}>
          <div className="editor-content">
            {children}
          </div>
        </ErrorBoundary>
      </main>
      
      <footer className="editor-footer" style={{
        backgroundColor: '#f8f9fa',
        padding: '10px 15px',
        borderTop: '1px solid #dee2e6',
        borderRadius: '0 0 8px 8px',
        fontSize: '12px',
        color: '#666'
      }}>
        <p style={{ margin: 0 }}>
          🔗 Wave Reader | Tome Architecture Enabled | {router && 'Router: Available'}
        </p>
      </footer>
    </div>
  );
};

export default EditorWrapper;
