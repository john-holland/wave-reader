import { createStructuralConfig, AppStructureConfig } from '../../mocks/log-view-machine';
import WaveReaderMainTome from './wave-reader-tome-config';

/**
 * Wave Reader Structural System Configuration
 * 
 * This configuration defines how the structural system integrates with the
 * existing wave-reader components and provides message routing between them.
 */

export const WaveReaderStructuralConfig: AppStructureConfig = createStructuralConfig({
  // Application structure definition
  AppStructure: {
    id: 'wave-reader-app',
    name: 'Wave Reader Application',
    description: 'Chrome extension for wave reading with structural system integration',
    version: '1.0.0',
    type: 'chrome-extension'
  },

  // Component to tome mapping
  ComponentTomeMapping: {
    'wave-tabs': {
      componentPath: 'src/components/wave-tabs.tsx',
      tomePath: 'src/components/structural/wave-reader-tome-config.ts',
      templatePath: 'src/components/structural/templates/wave-tabs/',
      tomeId: 'wave-tabs',
      description: 'Wave tabs navigation component'
    },
    'wave-reader': {
      componentPath: 'src/components/wave-reader.tsx',
      tomePath: 'src/components/structural/wave-reader-tome-config.ts',
      templatePath: 'src/components/structural/templates/wave-reader/',
      tomeId: 'wave-reader',
      description: 'Core wave reader functionality'
    },
    'go-button': {
      componentPath: 'src/components/go-button.tsx',
      tomePath: 'src/components/structural/wave-reader-tome-config.ts',
      templatePath: 'src/components/structural/templates/go-button/',
      tomeId: 'go-button',
      description: 'Go button control component'
    },
    'selector-input': {
      componentPath: 'src/components/selector-input.tsx',
      tomePath: 'src/components/structural/wave-reader-tome-config.ts',
      templatePath: 'src/components/structural/templates/selector-input/',
      tomeId: 'selector-input',
      description: 'CSS selector input component'
    },
    'settings': {
      componentPath: 'src/components/settings.tsx',
      tomePath: 'src/components/structural/wave-reader-tome-config.ts',
      templatePath: 'src/components/structural/templates/settings/',
      tomeId: 'settings',
      description: 'Settings management component'
    },
    'about': {
      componentPath: 'src/components/about.tsx',
      tomePath: 'src/components/structural/wave-reader-tome-config.ts',
      templatePath: 'src/components/structural/templates/about/',
      tomeId: 'about',
      description: 'About information component'
    }
  },

  // Routing configuration
  RoutingConfig: {
    routes: [
      {
        path: '/',
        component: 'wave-tabs',
        name: 'Home',
        description: 'Main wave reader interface'
      },
      {
        path: '/wave-tabs',
        component: 'wave-tabs',
        name: 'Wave Tabs',
        description: 'Wave tabs navigation'
      },
      {
        path: '/wave-reader',
        component: 'wave-reader',
        name: 'Wave Reader',
        description: 'Core wave reading functionality',
        children: [
          {
            path: '/wave-reader/go-button',
            component: 'go-button',
            name: 'Go Button',
            description: 'Wave reader activation button'
          },
          {
            path: '/wave-reader/selector-input',
            component: 'selector-input',
            name: 'Selector Input',
            description: 'CSS selector input field'
          }
        ]
      },
      {
        path: '/settings',
        component: 'settings',
        name: 'Settings',
        description: 'Application settings and configuration'
      },
      {
        path: '/about',
        component: 'about',
        name: 'About',
        description: 'About information and version details'
      }
    ],
    defaultRoute: '/wave-tabs',
    fallbackRoute: '/wave-tabs'
  },

  // Tome configuration integration
  TomeConfig: {
    tomes: {
      'wave-reader-main-tome': {
        machineId: 'wave-reader-main',
        description: 'Main wave reader application state machine',
        states: [
          'initializing', 'ready', 'navigating', 'tabChanging',
          'waveReadingStarting', 'waveReadingStopping', 'waveReadingUpdating',
          'processingSubMachineEvent', 'error'
        ],
        events: [
          'INITIALIZATION_COMPLETE', 'NAVIGATE', 'TAB_CHANGE',
          'WAVE_READER_START', 'WAVE_READER_STOP', 'WAVE_READER_UPDATE',
          'ERROR', 'SUBMACHINE_EVENT', 'RECOVER', 'RESET'
        ]
      },
      'wave-tabs-tome': {
        machineId: 'wave-tabs',
        description: 'Wave tabs navigation state machine',
        states: ['idle', 'tabSelected', 'navigating'],
        events: ['TAB_SELECT', 'TAB_NAVIGATE', 'TAB_SELECTION_COMPLETE', 'NAVIGATION_COMPLETE']
      },
      'wave-reader-tome': {
        machineId: 'wave-reader',
        description: 'Wave reader core functionality state machine',
        states: [
          'idle', 'starting', 'reading', 'paused', 'stopping',
          'selectorUpdating', 'settingsUpdating', 'waveComplete'
        ],
        events: [
          'START_READING', 'STOP_READING', 'PAUSE_READING', 'RESUME_READING',
          'SELECTOR_UPDATE', 'SETTINGS_UPDATE', 'WAVE_ANIMATION_COMPLETE',
          'START_COMPLETE', 'STOP_COMPLETE', 'SELECTOR_UPDATE_COMPLETE',
          'SETTINGS_UPDATE_COMPLETE', 'CONTINUE_READING'
        ]
      },
      'go-button-tome': {
        machineId: 'go-button',
        description: 'Go button control state machine',
        states: ['inactive', 'active', 'ready', 'clicked'],
        events: ['ENABLE_BUTTON', 'DISABLE_BUTTON', 'SELECTOR_READY', 'BUTTON_CLICK', 'CLICK_PROCESSED']
      },
      'selector-input-tome': {
        machineId: 'selector-input',
        description: 'Selector input management state machine',
        states: ['empty', 'typing', 'validating', 'valid', 'invalid', 'applied'],
        events: [
          'INPUT_CHANGE', 'SELECTOR_PASTE', 'INPUT_COMPLETE', 'INPUT_CLEAR',
          'VALIDATION_SUCCESS', 'VALIDATION_FAILURE', 'SELECTOR_APPLY', 'SUGGESTION_SELECT'
        ]
      },
      'settings-tome': {
        machineId: 'settings',
        description: 'Settings management state machine',
        states: ['loading', 'ready', 'modified', 'saving', 'resetting', 'importing'],
        events: [
          'SETTINGS_LOADED', 'SETTING_CHANGE', 'SAVE_SETTINGS', 'RESET_SETTINGS',
          'IMPORT_SETTINGS', 'SAVE_COMPLETE', 'SAVE_FAILED', 'RESET_COMPLETE',
          'IMPORT_COMPLETE', 'IMPORT_FAILED', 'CANCEL_CHANGES'
        ]
      },
      'about-tome': {
        machineId: 'about',
        description: 'About information state machine',
        states: ['loading', 'ready', 'showingChangelog', 'showingLicense'],
        events: ['INFO_LOADED', 'REFRESH_INFO', 'SHOW_CHANGELOG', 'SHOW_LICENSE', 'BACK_TO_ABOUT']
      }
    }
  },

  // Message routing configuration
  MessageRouting: {
    // Global message routing rules
    global: {
      'WAVE_READER_START': { target: 'wave-reader', priority: 'high' },
      'WAVE_READER_STOP': { target: 'wave-reader', priority: 'high' },
      'WAVE_READER_UPDATE': { target: 'wave-reader', priority: 'normal' },
      'TAB_CHANGE': { target: 'wave-tabs', priority: 'normal' },
      'NAVIGATE': { target: 'main-app', priority: 'normal' },
      'ERROR': { target: 'main-app', priority: 'critical' }
    },

    // Component-specific routing
    components: {
      'wave-tabs': {
        'TAB_SELECT': { target: 'main-app', priority: 'normal' },
        'TAB_NAVIGATE': { target: 'main-app', priority: 'normal' }
      },
      'wave-reader': {
        'START_READING': { target: 'go-button', priority: 'high' },
        'STOP_READING': { target: 'go-button', priority: 'high' },
        'SELECTOR_UPDATE': { target: 'selector-input', priority: 'normal' },
        'SETTINGS_UPDATE': { target: 'settings', priority: 'normal' }
      },
      'go-button': {
        'BUTTON_CLICK': { target: 'wave-reader', priority: 'high' },
        'SELECTOR_READY': { target: 'wave-reader', priority: 'normal' }
      },
      'selector-input': {
        'SELECTOR_APPLY': { target: 'wave-reader', priority: 'high' },
        'VALIDATION_SUCCESS': { target: 'go-button', priority: 'normal' }
      },
      'settings': {
        'SETTING_CHANGE': { target: 'wave-reader', priority: 'normal' },
        'SETTINGS_SAVED': { target: 'main-app', priority: 'normal' }
      }
    },

    // Priority levels for message handling
    priorities: {
      'critical': { timeout: 1000, retryCount: 3 },
      'high': { timeout: 2000, retryCount: 2 },
      'normal': { timeout: 5000, retryCount: 1 },
      'low': { timeout: 10000, retryCount: 0 }
    }
  },

  // Performance and monitoring configuration
  Performance: {
    // State machine performance settings
    stateMachines: {
      maxInitTime: 2000,
      maxStateTransitionTime: 500,
      maxEventProcessingTime: 1000
    },

    // Message routing performance
    messageRouting: {
      maxRoutingTime: 100,
      maxQueueSize: 1000,
      enableBatching: true,
      batchSize: 10,
      batchTimeout: 50
    },

    // Monitoring and metrics
    monitoring: {
      enableMetrics: true,
      enableTracing: true,
      enableHealthChecks: true,
      healthCheckInterval: 30000
    }
  },

  // Error handling and recovery
  ErrorHandling: {
    // Global error handling
    global: {
      maxErrorCount: 10,
      errorRecoveryTimeout: 5000,
      enableAutoRecovery: true,
      enableErrorReporting: true
    },

    // Component-specific error handling
    components: {
      'wave-reader': {
        maxErrorCount: 5,
        recoveryStrategy: 'restart',
        fallbackState: 'idle'
      },
      'selector-input': {
        maxErrorCount: 3,
        recoveryStrategy: 'reset',
        fallbackState: 'empty'
      },
      'settings': {
        maxErrorCount: 2,
        recoveryStrategy: 'reload',
        fallbackState: 'loading'
      }
    }
  }
});

// Export the configuration
export default WaveReaderStructuralConfig;
