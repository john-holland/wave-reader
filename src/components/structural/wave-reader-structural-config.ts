import { createStructuralConfig } from 'log-view-machine';
import WaveReaderMainTome from './wave-reader-tome-config';

/**
 * Wave Reader Structural System Configuration
 * 
 * This configuration defines how the structural system integrates with the
 * existing wave-reader components and provides message routing between them.
 */

export const WaveReaderStructuralConfig = createStructuralConfig({
  // Application structure definition
  AppStructure: {
    id: 'wave-reader-app',
    name: 'Wave Reader Application',
    type: 'application',
    routing: {
      path: '/'
    }
  },

  // Component to tome mapping
  ComponentTomeMapping: {
    'wave-tabs': {
      componentPath: 'src/components/wave-tabs.tsx',
      tomePath: 'src/components/structural/wave-reader-tome-config.ts',
      templatePath: 'src/components/structural/templates/wave-tabs/'
    },
    'wave-reader': {
      componentPath: 'src/components/wave-reader.tsx',
      tomePath: 'src/components/structural/wave-reader-tome-config.ts',
      templatePath: 'src/components/structural/templates/wave-reader/'
    },
    'go-button': {
      componentPath: 'src/components/go-button.tsx',
      tomePath: 'src/components/structural/wave-reader-tome-config.ts',
      templatePath: 'src/components/structural/templates/go-button/'
    },
    'selector-input': {
      componentPath: 'src/components/selector-input.tsx',
      tomePath: 'src/components/structural/wave-reader-tome-config.ts',
      templatePath: 'src/components/structural/templates/selector-input/'
    },
    'settings': {
      componentPath: 'src/components/settings.tsx',
      tomePath: 'src/components/structural/wave-reader-tome-config.ts',
      templatePath: 'src/components/structural/templates/settings/'
    },
    'about': {
      componentPath: 'src/components/about.tsx',
      tomePath: 'src/components/structural/wave-reader-tome-config.ts',
      templatePath: 'src/components/structural/templates/about/'
    }
  },

  // Routing configuration
  RoutingConfig: {
    routes: [
      {
        path: '/',
        component: 'wave-tabs'
      },
      {
        path: '/wave-tabs',
        component: 'wave-tabs'
      },
      {
        path: '/wave-reader',
        component: 'wave-reader',
        children: [
          {
            path: '/wave-reader/go-button',
            component: 'go-button'
          },
          {
            path: '/wave-reader/selector-input',
            component: 'selector-input'
          }
        ]
      },
      {
        path: '/settings',
        component: 'settings'
      },
      {
        path: '/about',
        component: 'about'
      }
    ],
    navigation: {
      primary: [
        {
          id: 'wave-tabs',
          label: 'Wave Tabs',
          path: '/wave-tabs',
          icon: '🌊'
        },
        {
          id: 'wave-reader',
          label: 'Wave Reader',
          path: '/wave-reader',
          icon: '📖'
        }
      ],
      secondary: [
        {
          id: 'settings',
          label: 'Settings',
          path: '/settings',
          icon: '⚙️'
        },
        {
          id: 'about',
          label: 'About',
          path: '/about',
          icon: 'ℹ️'
        }
      ]
    }
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
  }
});

// Export the configuration
export default WaveReaderStructuralConfig;
