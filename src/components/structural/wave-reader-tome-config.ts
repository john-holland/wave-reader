/**
 * Wave Reader Tome Configuration
 * 
 * This configuration defines the state machines, message routing, and component
 * relationships for the Wave Reader application using the structural system.
 * 
 * Component middleware uses this configuration through the structural system
 * for message routing and state management.
 */

// Wave Reader Main Application Tome Configuration
export const WaveReaderMainTome = {
  id: 'wave-reader-main-tome',
  name: 'Wave Reader Main Application',
  description: 'Main application state machine coordinating all wave reader components',
  version: '1.0.0',
  machines: {
    mainApp: {
      id: 'wave-reader-main',
      name: 'Wave Reader Main Controller',
      description: 'Controls the overall application state and navigation',
      xstateConfig: {
        id: 'wave-reader-main',
        initial: 'initializing',
        context: {
          currentRoute: '/',
          activeTab: 'wave-tabs',
          navigationHistory: [],
          errorState: null,
          loadingStates: {},
          subMachines: {},
          waveReaderState: {
            isActive: false,
            currentSelector: null,
            waveSettings: {
              speed: 1000,
              color: '#667eea',
              opacity: 0.8
            }
          }
        },
        states: {
          initializing: {
            on: { INITIALIZATION_COMPLETE: 'ready' },
            entry: 'setupSubMachines'
          },
          ready: {
            on: {
              NAVIGATE: 'navigating',
              TAB_CHANGE: 'tabChanging',
              WAVE_READER_START: 'waveReadingStarting',
              WAVE_READER_STOP: 'waveReadingStopping',
              WAVE_READER_UPDATE: 'waveReadingUpdating',
              ERROR: 'error',
              SUBMACHINE_EVENT: 'processingSubMachineEvent'
            }
          },
          navigating: {
            on: { NAVIGATION_COMPLETE: 'ready' },
            entry: 'updateRoute'
          },
          tabChanging: {
            on: { TAB_CHANGE_COMPLETE: 'ready' },
            entry: 'updateActiveTab'
          },
          waveReadingStarting: {
            on: { WAVE_READER_START_COMPLETE: 'ready' },
            entry: 'startWaveReader'
          },
          waveReadingStopping: {
            on: { WAVE_READER_STOP_COMPLETE: 'ready' },
            entry: 'stopWaveReader'
          },
          waveReadingUpdating: {
            on: { WAVE_READER_UPDATE_COMPLETE: 'ready' },
            entry: 'updateWaveReader'
          },
          processingSubMachineEvent: {
            on: { SUBMACHINE_EVENT_COMPLETE: 'ready' },
            entry: 'routeToSubMachine'
          },
          error: {
            on: { RECOVER: 'ready', RESET: 'initializing' },
            entry: 'handleError'
          }
        }
      }
    },
    
    // Wave Tabs Component Tome
    waveTabs: {
      id: 'wave-tabs',
      name: 'Wave Tabs Navigation',
      description: 'Manages tab navigation and content switching - uses WaveTabsTomes component middleware',
      componentPath: 'src/component-middleware/wave-tabs/WaveTabsTomes.tsx',
      xstateConfig: {
        id: 'wave-tabs',
        initial: 'idle',
        context: {
          activeTab: 'wave-tabs',
          tabHistory: ['wave-tabs'],
          tabs: [
            { id: 'wave-tabs', name: 'Wave Reader', icon: '🌊' },
            { id: 'settings', name: 'Settings', icon: '⚙️' },
            { id: 'about', name: 'About', icon: 'ℹ️' }
          ]
        },
        states: {
          idle: {
            on: {
              TAB_SELECT: 'tabSelected',
              TAB_NAVIGATE: 'navigating'
            }
          },
          tabSelected: {
            on: { TAB_SELECTION_COMPLETE: 'idle' },
            entry: 'updateActiveTab'
          },
          navigating: {
            on: { NAVIGATION_COMPLETE: 'idle' },
            entry: 'performNavigation'
          }
        }
      }
    },
    
    // Wave Reader Core Component Tome
    waveReader: {
      id: 'wave-reader',
      name: 'Wave Reader Core',
      description: 'Manages wave reading functionality and animations - uses wave-reader component middleware',
      componentPath: 'src/component-middleware/wave-reader/',
      xstateConfig: {
        id: 'wave-reader',
        initial: 'idle',
        context: {
          isActive: false,
          currentSelector: null,
          waveSettings: {
            speed: 1000,
            color: '#667eea',
            opacity: 0.8
          },
          animationState: 'stopped',
          selectedElements: [],
          readingProgress: 0
        },
        states: {
          idle: {
            on: {
              START_READING: 'starting',
              SELECTOR_UPDATE: 'selectorUpdating',
              SETTINGS_UPDATE: 'settingsUpdating'
            }
          },
          starting: {
            on: { START_COMPLETE: 'reading' },
            entry: 'initializeWaveReader'
          },
          reading: {
            on: {
              STOP_READING: 'stopping',
              PAUSE_READING: 'paused',
              SELECTOR_UPDATE: 'selectorUpdating',
              WAVE_ANIMATION_COMPLETE: 'waveComplete'
            },
            entry: 'startWaveAnimation'
          },
          paused: {
            on: {
              RESUME_READING: 'reading',
              STOP_READING: 'stopping'
            }
          },
          stopping: {
            on: { STOP_COMPLETE: 'idle' },
            entry: 'stopWaveAnimation'
          },
          selectorUpdating: {
            on: { SELECTOR_UPDATE_COMPLETE: 'idle' },
            entry: 'updateSelector'
          },
          settingsUpdating: {
            on: { SETTINGS_UPDATE_COMPLETE: 'idle' },
            entry: 'updateSettings'
          },
          waveComplete: {
            on: { CONTINUE_READING: 'reading', STOP_READING: 'stopping' },
            entry: 'handleWaveComplete'
          }
        }
      }
    },
    
    // Go Button Component Tome
    goButton: {
      id: 'go-button',
      name: 'Go Button Control',
      description: 'Manages the go button state and wave reader activation - uses GoButtonTomes component middleware',
      componentPath: 'src/component-middleware/go-button/GoButtonTomes.tsx',
      xstateConfig: {
        id: 'go-button',
        initial: 'inactive',
        context: {
          isEnabled: false,
          buttonText: 'Go',
          buttonState: 'inactive',
          clickCount: 0,
          lastClickTime: null
        },
        states: {
          inactive: {
            on: {
              ENABLE_BUTTON: 'active',
              SELECTOR_READY: 'ready'
            }
          },
          active: {
            on: {
              DISABLE_BUTTON: 'inactive',
              SELECTOR_READY: 'ready'
            }
          },
          ready: {
            on: {
              BUTTON_CLICK: 'clicked',
              DISABLE_BUTTON: 'inactive'
            }
          },
          clicked: {
            on: { CLICK_PROCESSED: 'ready' },
            entry: 'handleButtonClick'
          }
        }
      }
    },
    
    // Selector Input Component Tome
    selectorInput: {
      id: 'selector-input',
      name: 'Selector Input Management',
      description: 'Manages CSS selector input and validation - uses SelectorInputTomes component middleware',
      componentPath: 'src/component-middleware/selector-input/SelectorInputTomes.tsx',
      xstateConfig: {
        id: 'selector-input',
        initial: 'empty',
        context: {
          currentSelector: '',
          isValid: false,
          validationErrors: [],
          suggestions: [],
          lastValidSelector: null,
          inputHistory: []
        },
        states: {
          empty: {
            on: {
              INPUT_CHANGE: 'typing',
              SELECTOR_PASTE: 'validating'
            }
          },
          typing: {
            on: {
              INPUT_CHANGE: 'typing',
              INPUT_COMPLETE: 'validating',
              INPUT_CLEAR: 'empty'
            }
          },
          validating: {
            on: {
              VALIDATION_SUCCESS: 'valid',
              VALIDATION_FAILURE: 'invalid',
              INPUT_CHANGE: 'typing'
            },
            entry: 'validateSelector'
          },
          valid: {
            on: {
              INPUT_CHANGE: 'typing',
              SELECTOR_APPLY: 'applied',
              INPUT_CLEAR: 'empty'
            }
          },
          invalid: {
            on: {
              INPUT_CHANGE: 'typing',
              INPUT_CLEAR: 'empty',
              SUGGESTION_SELECT: 'validating'
            }
          },
          applied: {
            on: {
              INPUT_CHANGE: 'typing',
              INPUT_CLEAR: 'empty'
            }
          }
        }
      }
    },
    
    // Settings Component Tome
    settings: {
      id: 'settings',
      name: 'Settings Management',
      description: 'Manages application settings and configuration - uses settings component middleware',
      componentPath: 'src/component-middleware/settings/',
      xstateConfig: {
        id: 'settings',
        initial: 'loading',
        context: {
          currentSettings: {},
          defaultSettings: {},
          unsavedChanges: false,
          lastSaved: null,
          settingsCategories: ['wave', 'ui', 'performance', 'advanced']
        },
        states: {
          loading: {
            on: { SETTINGS_LOADED: 'ready' },
            entry: 'loadSettings'
          },
          ready: {
            on: {
              SETTING_CHANGE: 'modified',
              RESET_SETTINGS: 'resetting',
              IMPORT_SETTINGS: 'importing'
            }
          },
          modified: {
            on: {
              SETTING_CHANGE: 'modified',
              SAVE_SETTINGS: 'saving',
              RESET_SETTINGS: 'resetting',
              CANCEL_CHANGES: 'ready'
            }
          },
          saving: {
            on: { SAVE_COMPLETE: 'ready', SAVE_FAILED: 'modified' },
            entry: 'saveSettings'
          },
          resetting: {
            on: { RESET_COMPLETE: 'ready' },
            entry: 'resetSettings'
          },
          importing: {
            on: { IMPORT_COMPLETE: 'ready', IMPORT_FAILED: 'ready' },
            entry: 'importSettings'
          }
        }
      }
    },
    
    // About Component Tome
    about: {
      id: 'about',
      name: 'About Information',
      description: 'Manages about page and version information - uses about component middleware',
      componentPath: 'src/components/about.tsx',
      xstateConfig: {
        id: 'about',
        initial: 'loading',
        context: {
          versionInfo: {},
          changelog: [],
          contributors: [],
          license: null,
          lastUpdated: null
        },
        states: {
          loading: {
            on: { INFO_LOADED: 'ready' },
            entry: 'loadAboutInfo'
          },
          ready: {
            on: {
              REFRESH_INFO: 'loading',
              SHOW_CHANGELOG: 'showingChangelog',
              SHOW_LICENSE: 'showingLicense'
            }
          },
          showingChangelog: {
            on: { BACK_TO_ABOUT: 'ready' }
          },
          showingLicense: {
            on: { BACK_TO_ABOUT: 'ready' }
          }
        }
      }
    }
  },
  
  // Message routing configuration for component middleware
  routing: {
    // Main application routing
    mainApp: {
      'WAVE_READER_START': 'waveReader',
      'WAVE_READER_STOP': 'waveReader',
      'WAVE_READER_UPDATE': 'waveReader',
      'TAB_CHANGE': 'waveTabs',
      'NAVIGATE': 'mainApp'
    },
    
    // Wave tabs routing
    waveTabs: {
      'TAB_SELECT': 'mainApp',
      'TAB_NAVIGATE': 'mainApp'
    },
    
    // Wave reader routing
    waveReader: {
      'START_READING': 'goButton',
      'STOP_READING': 'goButton',
      'SELECTOR_UPDATE': 'selectorInput',
      'SETTINGS_UPDATE': 'settings'
    },
    
    // Go button routing
    goButton: {
      'BUTTON_CLICK': 'waveReader',
      'SELECTOR_READY': 'waveReader'
    },
    
    // Selector input routing
    selectorInput: {
      'SELECTOR_APPLY': 'waveReader',
      'VALIDATION_SUCCESS': 'goButton'
    },
    
    // Settings routing
    settings: {
      'SETTING_CHANGE': 'waveReader',
      'SETTINGS_SAVED': 'mainApp'
    }
  },
  
  // Context and shared state
  context: {
    shared: {
      waveReaderState: {
        isActive: false,
        currentSelector: null,
        waveSettings: {
          speed: 1000,
          color: '#667eea',
          opacity: 0.8
        }
      },
      navigationState: {
        currentRoute: '/',
        activeTab: 'wave-tabs',
        navigationHistory: []
      },
      errorHandling: {
        lastError: null,
        errorCount: 0,
        recoveryAttempts: 0
      }
    }
  }
};

// Export individual tome configurations for component use
export const WaveTabsTome = WaveReaderMainTome.machines.waveTabs;
export const WaveReaderTome = WaveReaderMainTome.machines.waveReader;
export const GoButtonTome = WaveReaderMainTome.machines.goButton;
export const SelectorInputTome = WaveReaderMainTome.machines.selectorInput;
export const SettingsTome = WaveReaderMainTome.machines.settings;
export const AboutTome = WaveReaderMainTome.machines.about;

// Export the main tome configuration
export default WaveReaderMainTome;
