import React from 'react';
import ScanForInputTomes from '../component-middleware/scan-for-input/ScanForInputTomes';

// Bridge component for scan-for-input
export default function ScanForInput(props: any) {
  return <ScanForInputTomes {...props} />;
}
