/**
 * Application Structure Configuration
 * 
 * Defines the hierarchical structure of components, routing configuration,
 * and tome mappings for the Wave Reader application.
 */

export const AppStructure = {
  // Root application structure
  root: {
    id: 'wave-reader-app',
    name: 'Wave Reader Application',
    type: 'application',
    routing: {
      base: '/',
      defaultRoute: '/wave-tabs'
    }
  },

  // Main navigation structure
  navigation: {
    id: 'wave-tabs',
    name: 'Wave Tabs',
    type: 'navigation',
    component: 'wave-tabs',
    tome: 'wave-tabs-tome',
    routing: {
      path: '/wave-tabs',
      children: [
        {
          id: 'wave-reader',
          name: 'Wave Reader',
          type: 'main-content',
          component: 'wave-reader',
          tome: 'wave-reader-tome',
          routing: {
            path: '/wave-tabs/wave-reader',
            children: [
              {
                id: 'go-button',
                name: 'Go Button',
                type: 'control',
                component: 'go-button',
                tome: 'go-button-tome',
                routing: {
                  path: '/wave-tabs/wave-reader/go-button'
                }
              },
              {
                id: 'selector-input',
                name: 'Selector Input',
                type: 'input',
                component: 'selector-input',
                tome: 'selector-input-tome',
                routing: {
                  path: '/wave-tabs/wave-reader/selector-input'
                }
              }
            ]
          }
        },
        {
          id: 'settings',
          name: 'Settings',
          type: 'configuration',
          component: 'settings',
          tome: 'settings-tome',
          routing: {
            path: '/wave-tabs/settings'
          }
        },
        {
          id: 'about',
          name: 'About',
          type: 'information',
          component: 'about',
          tome: 'about-tome',
          routing: {
            path: '/wave-tabs/about'
          }
        }
      ]
    }
  },

  // Background services structure
  background: {
    id: 'background-services',
    name: 'Background Services',
    type: 'service-layer',
    routing: {
      path: '/background',
      children: [
        {
          id: 'interchange',
          name: 'Interchange System',
          type: 'communication',
          component: 'interchange',
          tome: 'interchange-tome',
          routing: {
            path: '/background/interchange'
          }
        }
      ]
    }
  },

  // Content scripts structure
  content: {
    id: 'content-scripts',
    name: 'Content Scripts',
    type: 'content-layer',
    routing: {
      path: '/content',
      children: [
        {
          id: 'wave-reader-content',
          name: 'Wave Reader Content',
          type: 'content-script',
          component: 'wave-reader-content',
          tome: 'wave-reader-content-tome',
          routing: {
            path: '/content/wave-reader',
            children: [
              {
                id: 'selector-hierarchy',
                name: 'Selector Hierarchy',
                type: 'content-control',
                component: 'selector-hierarchy',
                tome: 'selector-hierarchy-tome',
                routing: {
                  path: '/content/wave-reader/selector-hierarchy'
                }
              }
            ]
          }
        }
      ]
    }
  }
};

// Component to Tome mapping
export const ComponentTomeMapping = {
  'wave-tabs': {
    componentPath: 'src/components/wave-tabs.tsx',
    tomePath: 'src/component-middleware/wave-tabs/WaveTabsTomes.tsx',
    templatePath: 'src/component-middleware/wave-tabs/templates/wave-tabs-component/'
  },
  'wave-reader': {
    componentPath: 'src/components/wave-reader.tsx',
    tomePath: 'src/component-middleware/wave-reader/WaveReaderTomes.tsx',
    templatePath: 'src/component-middleware/wave-reader/templates/wave-reader-component/'
  },
  'go-button': {
    componentPath: 'src/components/go-button.tsx',
    tomePath: 'src/component-middleware/go-button/GoButtonTomes.tsx',
    templatePath: 'src/component-middleware/go-button/templates/go-button-component/'
  },
  'selector-input': {
    componentPath: 'src/components/selector-input.tsx',
    tomePath: 'src/component-middleware/selector-input/SelectorInputTomes.tsx',
    templatePath: 'src/component-middleware/selector-input/templates/selector-input-component/'
  },
  'settings': {
    componentPath: 'src/components/settings.tsx',
    tomePath: 'src/component-middleware/settings/SettingsTomes.tsx',
    templatePath: 'src/component-middleware/settings/templates/settings-component/'
  },
  'about': {
    componentPath: 'src/components/about.tsx',
    tomePath: 'src/component-middleware/about/AboutTomes.tsx',
    templatePath: 'src/component-middleware/about/templates/about-component/'
  },
  'selector-hierarchy': {
    componentPath: 'src/components/selector-hierarchy.tsx',
    tomePath: 'src/component-middleware/selector-hierarchy/SelectorHierarchyTomes.tsx',
    templatePath: 'src/component-middleware/selector-hierarchy/templates/selector-hierarchy-component/'
  }
};

// Routing configuration
export const RoutingConfig = {
  // Route definitions
  routes: [
    {
      path: '/',
      redirect: '/wave-tabs'
    },
    {
      path: '/wave-tabs',
      component: 'wave-tabs',
      children: [
        {
          path: '/wave-tabs/wave-reader',
          component: 'wave-reader',
          children: [
            {
              path: '/wave-tabs/wave-reader/go-button',
              component: 'go-button'
            },
            {
              path: '/wave-tabs/wave-reader/selector-input',
              component: 'selector-input'
            }
          ]
        },
        {
          path: '/wave-tabs/settings',
          component: 'settings'
        },
        {
          path: '/wave-tabs/about',
          component: 'about'
        }
      ]
    },
    {
      path: '/background',
      component: 'background',
      children: [
        {
          path: '/background/interchange',
          component: 'interchange'
        }
      ]
    },
    {
      path: '/content',
      component: 'content',
      children: [
        {
          path: '/content/wave-reader',
          component: 'wave-reader-content',
          children: [
            {
              path: '/content/wave-reader/selector-hierarchy',
              component: 'selector-hierarchy'
            }
          ]
        }
      ]
    }
  ],

  // Navigation configuration
  navigation: {
    primary: [
      {
        id: 'wave-tabs',
        label: 'Wave Tabs',
        path: '/wave-tabs',
        icon: '🌊',
        children: [
          {
            id: 'wave-reader',
            label: 'Wave Reader',
            path: '/wave-tabs/wave-reader',
            icon: '📖'
          },
          {
            id: 'settings',
            label: 'Settings',
            path: '/wave-tabs/settings',
            icon: '⚙️'
          },
          {
            id: 'about',
            label: 'About',
            path: '/wave-tabs/about',
            icon: 'ℹ️'
          }
        ]
      }
    ],
    secondary: [
      {
        id: 'background',
        label: 'Background',
        path: '/background',
        icon: '🔧'
      },
      {
        id: 'content',
        label: 'Content',
        path: '/content',
        icon: '📄'
      }
    ]
  }
};

// Tome configuration
export const TomeConfig = {
  // Tome definitions with their machine configurations
  tomes: {
    'wave-tabs-tome': {
      machineId: 'wave-tabs',
      description: 'Main navigation and tab management',
      states: ['idle', 'active', 'navigating'],
      events: ['TAB_SELECT', 'TAB_ADD', 'TAB_REMOVE']
    },
    'wave-reader-tome': {
      machineId: 'wave-reader',
      description: 'Main wave reading functionality',
      states: ['idle', 'reading', 'paused', 'stopped'],
      events: ['START_READING', 'PAUSE_READING', 'STOP_READING']
    },
    'go-button-tome': {
      machineId: 'go-button',
      description: 'Go button control with wave animation',
      states: ['idle', 'going', 'stopping', 'loading', 'error'],
      events: ['GO', 'STOP', 'LOAD', 'ERROR']
    },
    'selector-input-tome': {
      machineId: 'selector-input',
      description: 'Selector input and management',
      states: ['idle', 'inputting', 'validating', 'saving'],
      events: ['INPUT_CHANGE', 'VALIDATE', 'SAVE', 'CLEAR']
    },
    'settings-tome': {
      machineId: 'settings',
      description: 'Application settings and configuration',
      states: ['idle', 'editing', 'saving', 'resetting'],
      events: ['EDIT', 'SAVE', 'RESET', 'CANCEL']
    },
    'about-tome': {
      machineId: 'about',
      description: 'About information and help',
      states: ['idle', 'expanded', 'help'],
      events: ['EXPAND', 'SHOW_HELP', 'COLLAPSE']
    },
    'selector-hierarchy-tome': {
      machineId: 'selector-hierarchy',
      description: 'Selector hierarchy management',
      states: ['idle', 'building', 'editing', 'saving'],
      events: ['BUILD', 'EDIT', 'SAVE', 'CLEAR']
    }
  },

  // Machine state configurations
  machineStates: {
    'wave-tabs': {
      idle: {
        description: 'No active tab operations',
        actions: ['initialize', 'setupEventListeners']
      },
      active: {
        description: 'Tab is active and functional',
        actions: ['renderContent', 'handleTabEvents']
      },
      navigating: {
        description: 'Transitioning between tabs',
        actions: ['animateTransition', 'updateRoute']
      }
    },
    'go-button': {
      idle: {
        description: 'Button is ready for interaction',
        actions: ['renderButton', 'setupClickHandlers']
      },
      going: {
        description: 'Button is in active state',
        actions: ['startWaveAnimation', 'updateDisplay']
      },
      stopping: {
        description: 'Button is stopping operations',
        actions: ['stopWaveAnimation', 'cleanup']
      }
    }
  }
};

// Export the complete structure
export default {
  AppStructure,
  ComponentTomeMapping,
  RoutingConfig,
  TomeConfig
};
