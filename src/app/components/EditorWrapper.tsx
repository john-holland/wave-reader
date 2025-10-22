import React from 'react';

interface EditorWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  componentId?: string;
  useTomeArchitecture?: boolean;
  onError?: (error: Error) => void;
}

/**
 * EditorWrapper Component
 * 
 * A simple wrapper that provides the GenericEditor interface
 * while being compatible with the current React setup
 */
const EditorWrapper: React.FC<EditorWrapperProps> = ({
  title,
  description,
  children,
  componentId,
  useTomeArchitecture = false,
  onError
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
          {useTomeArchitecture ? '🔗 Tome Architecture Enabled' : '📝 Standard Mode'}
          {componentId && ` | Component: ${componentId}`}
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
          🔗 Wave Reader Editor | State: Ready | 
          {useTomeArchitecture ? ' Tome Architecture' : ' Standard Mode'}
        </p>
      </footer>
    </div>
  );
};

export default EditorWrapper;
