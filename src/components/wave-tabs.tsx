import React from 'react';
import WaveTabsTomes from '../component-middleware/wave-tabs/WaveTabsTomes';

// Bridge component for wave-tabs
export default function WaveTabs(props: any) {
  // Check if we're in a Chrome extension context
  const isExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
  
  // If not in extension context, render a simple container for the popup
  if (!isExtension) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        {props.children}
      </div>
    );
  }
  
  // Otherwise use the full WaveTabsTomes component
  return <WaveTabsTomes {...props} />;
}
