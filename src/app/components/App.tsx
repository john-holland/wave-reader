import React, { FunctionComponent, useEffect, useState } from 'react';
import { ErrorBoundary } from '../../components/error-boundary';
import { AppTome } from '../tomes/AppTome';
import {
  ModalContainer,
  ModalHeader,
  HeaderTitle,
  HeaderActions,
  StartWaveButton,
  CollapseButton
} from '../../components/styled/AppStyles';

/**
 * App Component
 * 
 * Clean React entry point for the Wave Reader application
 * Uses the AppTome with observable pattern for reactive rendering
 */
const AppComponent: FunctionComponent = () => {
  // Use the observable pattern to track view changes
  const [currentViewKey, setCurrentViewKey] = useState(AppTome.getViewKey());
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Subscribe to view key changes
    const unsubscribe = AppTome.observeViewKey(setCurrentViewKey);
    
    // Initialize the tome
    AppTome.initialize()
      .then(() => {
        console.log('🌊 App Component: AppTome initialized successfully');
        setIsInitialized(true);
      })
      .catch((err) => {
        console.error('🌊 App Component: Failed to initialize AppTome', err);
        setError(err.message || 'Failed to initialize');
        setIsInitialized(true); // Set to true to show error state
      });
    
    // Cleanup on unmount
    return () => {
      unsubscribe();
      AppTome.cleanup();
    };
  }, []);
  
  // Debug log for view key changes
  useEffect(() => {
    console.log('🌊 App Component: View key changed:', currentViewKey);
  }, [currentViewKey]);
  
  return (
    <ErrorBoundary>
      <ModalContainer>
        <ModalHeader>
          <HeaderTitle>Wave Reader</HeaderTitle>
          <HeaderActions>
            <StartWaveButton onClick={() => {
              console.log('🌊 App Component: Start button clicked');
              AppTome.send('AppMachine', 'START');
            }}>
              Start
            </StartWaveButton>
            <CollapseButton onClick={() => {
              console.log('🌊 App Component: Collapse button clicked');
              AppTome.send('AppMachine', 'COLLAPSE');
            }}>
              ⚙️
            </CollapseButton>
          </HeaderActions>
        </ModalHeader>
        
        <div style={{ padding: '20px' }}>
          {!isInitialized && (
            <div>
              <p>Loading...</p>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                .spinner {
                  animation: spin 1s linear infinite;
                  display: inline-block;
                }
              `}</style>
              <div className="spinner">⏳</div>
            </div>
          )}
          
          {isInitialized && error && (
            <div style={{ color: 'red' }}>
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          )}
          
          {isInitialized && !error && (
            <div>
              {AppTome.render() || <div>No content available</div>}
            </div>
          )}
        </div>
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f0f0f0',
            borderTop: '1px solid #ccc',
            fontSize: '12px'
          }}>
            <strong>Debug Info:</strong>
            <div>View Key: {currentViewKey}</div>
            <div>Initialized: {isInitialized ? 'Yes' : 'No'}</div>
            <div>Error: {error || 'None'}</div>
          </div>
        )}
      </ModalContainer>
    </ErrorBoundary>
  );
};

export default AppComponent;

