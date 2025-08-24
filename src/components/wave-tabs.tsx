import React from 'react';
import WaveTabsTomes from '../component-middleware/wave-tabs/WaveTabsTomes';

// Bridge component for wave-tabs
export default function WaveTabs(props: any) {
  return <WaveTabsTomes {...props} />;
}
