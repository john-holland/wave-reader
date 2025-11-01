import React, { ErrorInfo } from 'react';
import type { MachineRouter } from 'log-view-machine';
// GenericEditor is not exported from main package due to CSS dependencies
// Import directly from source - this works in monorepo setup
// @ts-expect-error - GenericEditor not in package exports, but available in monorepo
import GenericEditor from 'log-view-machine/src/components/GenericEditor';

interface EditorWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  componentId?: string;
  useTomeArchitecture?: boolean;
  onError?: (error: Error, errorInfo?: ErrorInfo) => void;
  router?: MachineRouter;
}

/**
 * EditorWrapper Component
 * 
 * Enhanced wrapper that uses GenericEditor from log-view-machine
 * for mod compatibility and provides router integration for routed send support.
 * 
 * This wrapper maintains backward compatibility while adding:
 * - Mod compatibility via GenericEditor
 * - Router integration for inter-machine communication
 * - Tome architecture support
 */
const EditorWrapper: React.FC<EditorWrapperProps> = ({
  title,
  description,
  children,
  componentId,
  useTomeArchitecture = false,
  onError,
  router
}) => {
  // Use GenericEditor when tome architecture is enabled for full mod compatibility
  if (useTomeArchitecture) {
    return (
      <GenericEditor
        title={title}
        description={description}
        componentId={componentId}
        useTomeArchitecture={true}
        onError={onError}
      >
        {children}
      </GenericEditor>
    );
  }

  // Fallback to simple wrapper for non-tome mode (backward compatibility)
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
          📝 Standard Mode
          {componentId && ` | Component: ${componentId}`}
          {router && ' | Router: Available'}
        </div>
      </header>
      
      <main className="editor-main" style={{
        padding: '0',
        backgroundColor: 'white'
      }}>
        <div className="editor-content">
          {children}
        </div>
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
          🔗 Wave Reader Editor | State: Ready | Standard Mode
        </p>
      </footer>
    </div>
  );
};

export default EditorWrapper;
