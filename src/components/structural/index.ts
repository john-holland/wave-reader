// First-class structural system from log-view-machine
export {
  StructuralRouter,
  Route,
  RouteFallback,
  useRouter,
  StructuralTomeConnector,
  useStructuralTomeConnector,
  StructuralSystem,
  createStructuralSystem,
  useStructuralSystem,
  DefaultStructuralConfig,
  createStructuralConfig,
  type AppStructureConfig,
  type AppStructureNode,
  type ComponentTomeMapping,
  type RouteConfig,
  type NavigationItem,
  type RoutingConfig,
  type TomeDefinition
} from 'log-view-machine';

// Legacy exports for backward compatibility
export { default as AppRouter } from './AppRouter';
export { default as TomeConnector } from './TomeConnector';
export { useTomeConnector } from './TomeConnector';

// Configuration exports
export {
  AppStructure,
  ComponentTomeMapping,
  RoutingConfig,
  TomeConfig
} from './app-structure';
