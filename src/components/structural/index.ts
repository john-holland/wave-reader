// Export log-view-machine structural system components
export {
  StructuralSystem,
  createStructuralSystem,
  useStructuralSystem,
  StructuralTomeConnector,
  useStructuralTomeConnector,
  StructuralRouter,
  Route,
  RouteFallback,
  useRouter
} from 'log-view-machine';

// Export wave-reader specific structural components
export { WaveReaderMainTome, WaveReaderStructuralConfig } from './wave-reader-structural-config';
export { WaveReaderMessageRouter, waveReaderMessageRouter } from './wave-reader-message-router';
export { useWaveReaderMessageRouter } from './useWaveReaderMessageRouter';

// Export individual tome configurations
export {
  WaveReaderMainTome as WaveReaderMainTome,
  WaveTabsTome,
  WaveReaderTome,
  GoButtonTome,
  SelectorInputTome,
  SettingsTome,
  AboutTome
} from './wave-reader-tome-config';

// Export tome integration bridge
export {
  TomeIntegrationBridge,
  useTomeIntegrationBridge,
  type TomeBridgeConfig
} from './tome-integration-bridge';

// Export component integration examples
export {
  ComponentIntegrationExample,
  EnhancedGoButton,
  EnhancedWaveTabs
} from './component-integration-example';

// Export message types
export type {
  WaveReaderMessage,
  MessageRoutingResult
} from './wave-reader-message-router';

// Export app router (renamed to avoid conflicts)
export { useRouter as useAppRouter } from './AppRouter';
