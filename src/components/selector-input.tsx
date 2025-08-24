import React from 'react';
import SelectorInputTomes from '../component-middleware/selector-input/SelectorInputTomes';

// Bridge component for selector-input
export default function SelectorInput(props: any) {
  return <SelectorInputTomes {...props} />;
}
