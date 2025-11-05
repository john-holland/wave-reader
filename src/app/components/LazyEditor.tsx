import React, { Suspense, ErrorInfo } from 'react';
import type { MachineRouter } from 'log-view-machine';
// @ts-expect-error - GenericEditor not in package exports, but available in monorepo
const GenericEditor = React.lazy(() => import('log-view-machine/src/components/GenericEditor'));

interface LazyEditorProps {
  title: string;
  description: string;
  children: React.ReactNode;
  componentId?: string;
  onError?: (error: Error, errorInfo?: ErrorInfo) => void;
  router?: MachineRouter;
}

/**
 * LazyEditor Component
 * 
 * Separate lazy-loaded wrapper around GenericEditor for when editor UI is needed.
 * This component is code-split and only loaded when explicitly imported/used.
 * 
 * React.Suspense automatically handles the lazy loading and shows fallback while loading.
 * Use this instead of EditorWrapper when you need the full editor features.
 */
export const LazyEditor: React.FC<LazyEditorProps> = ({
  title,
  description,
  children,
  componentId,
  onError,
  router
}) => {
  return (
    <Suspense fallback={
      <div className="generic-editor" data-state="loading">
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading editor...</div>
      </div>
    }>
      <GenericEditor
        title={title}
        description={description}
        componentId={componentId}
        onError={onError}
      >
        {children}
      </GenericEditor>
    </Suspense>
  );
};

export default LazyEditor;



