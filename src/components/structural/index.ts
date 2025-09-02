// Structural system components for Wave Reader
// Full structural system integration with log-view-machine

// Export createViewStateMachine from log-view-machine
export { createViewStateMachine } from 'log-view-machine';

// Export structural system components
export { 
  StructuralSystem, 
  createStructuralSystem,
  useStructuralSystem 
} from 'log-view-machine';

// Export structural tome connector
export { 
  StructuralTomeConnector,
  useStructuralTomeConnector 
} from 'log-view-machine';

// Export structural router
export { 
  StructuralRouter,
  Route,
  RouteFallback,
  useRouter 
} from 'log-view-machine';

// Export structural config utilities
export { 
  createStructuralConfig,
  type AppStructureConfig 
} from 'log-view-machine';

// Export existing structural components
export {
  AppStructure,
  ComponentTomeMapping,
  RoutingConfig,
  TomeConfig
} from './app-structure';

// Export the structural example
export { default as StructuralExample } from './StructuralExample';

// Export TomeConnector for component integration
export { default as TomeConnector, useTomeConnector } from './TomeConnector';

// Export AppRouter for routing
export { default as AppRouter, useRouter as useAppRouter } from './AppRouter';

// Export new wave-reader structural system
export { default as WaveReaderMainTome } from './wave-reader-tome-config';
export { default as WaveReaderStructuralConfig } from './wave-reader-structural-config';
export { default as WaveReaderMessageRouter, waveReaderMessageRouter } from './wave-reader-message-router';
export { default as useWaveReaderMessageRouter } from './useWaveReaderMessageRouter';

// Export individual tome configurations
export {
  WaveTabsTome,
  WaveReaderTome,
  GoButtonTome,
  SelectorInputTome,
  SettingsTome,
  AboutTome
} from './wave-reader-tome-config';

// Export message types and interfaces
export type {
  WaveReaderMessage,
  MessageRoutingResult
} from './wave-reader-message-router';
