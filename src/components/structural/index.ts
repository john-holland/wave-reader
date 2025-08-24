// Structural system components
// Note: Full structural system from log-view-machine not yet available in published package
// Using createViewStateMachine that is available

// Export createViewStateMachine from log-view-machine
export { createViewStateMachine } from 'log-view-machine';

// Export existing structural components
export {
  AppStructure,
  ComponentTomeMapping,
  RoutingConfig,
  TomeConfig
} from './app-structure';

// Export the structural example
export { default as StructuralExample } from './StructuralExample';

// TODO: When structural system is available in log-view-machine, update to include:
// - StructuralRouter
// - StructuralTomeConnector  
// - StructuralSystem
// - createStructuralConfig
// - And all associated types
