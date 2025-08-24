import React from 'react';
import SelectorHierarchyTomes from '../component-middleware/selector-hierarchy/SelectorHierarchyTomes';

// Bridge component for selector-hierarchy
export default function SelectorHierarchy(props: any) {
  return <SelectorHierarchyTomes {...props} />;
}
