import { createViewStateMachine } from '../mocks/log-view-machine';
import { createComponentTomeWithMetadata, ComponentTomeMetadata } from '../types/tome-metadata';

/**
 * Log View Content System Tome
 * 
 * Manages the state and behavior of the content system component
 * using log-view-machine for state management and logging.
 */

export interface ContentSystemModel {
  // System state
  isActive: boolean;
  currentState: string;
  going: boolean;
  latestOptions: any;
  
  // DOM state
  shadowDOM: {
    isInitialized: boolean;
    containerId: string | null;
    shadowRoot: any;
  };
  
  // Wave animation state
  waveAnimation: {
    isActive: boolean;
    options: any;
    cssTemplate: string | null;
    lastApplied: number | null;
  };
  
  // Selector UI state
  selectorUI: {
    isVisible: boolean;
    currentSelector: string | null;
    selectorMode: boolean;
  };
  
  // Services state
  services: {
    hierarchySelector: {
      isInitialized: boolean;
      currentSelector: string | null;
    };
    mlService: {
      isInitialized: boolean;
      lastRecommendation: any;
    };
    colorService: {
      isInitialized: boolean;
    };
  };
  
  // Message system
  messageSystem: {
    messageHistory: any[];
    lastMessage: any;
    messageQueue: any[];
  };
  
  // Session and metadata
  sessionId: string;
  stateHistory: any[];
  error: any;
  timestamp: number;
}

// Tome configuration
const tomeConfig = {
  machineId: 'log-view-content-system',
  xstateConfig: {
    id: 'log-view-content-system',
    initial: 'idle',
    context: {
      model: {} as ContentSystemModel
    },
    states: {
      idle: {
        on: {
          INITIALIZE: { target: 'initializing', actions: ['initializeSystem'] },
          START: { target: 'starting', actions: ['prepareStart'] },
          ERROR: { target: 'error', actions: ['handleError'] }
        }
      },
      initializing: {
        on: {
          INITIALIZATION_COMPLETE: { target: 'ready', actions: ['markInitialized'] },
          INITIALIZATION_FAILED: { target: 'error', actions: ['handleInitError'] }
        }
      },
      ready: {
        on: {
          START: { target: 'starting', actions: ['prepareStart'] },
          STOP: { target: 'stopping', actions: ['prepareStop'] },
          TOGGLE: { target: 'toggling', actions: ['prepareToggle'] },
          'SELECTION-MADE': { target: 'selection-mode', actions: ['showSelectorUI'] },
          'ML-RECOMMENDATION': { target: 'processing-ml', actions: ['processMLRecommendation'] },
          'WAVE-READER-START': { target: 'component-initializing', actions: ['initializeComponents'] },
          'WAVE-READER-STOP': { target: 'component-cleaning', actions: ['cleanupComponents'] },
          ERROR: { target: 'error', actions: ['handleError'] }
        }
      },
      starting: {
        on: {
          START_COMPLETE: { target: 'waving', actions: ['startWaveAnimation'] },
          START_FAILED: { target: 'error', actions: ['handleStartError'] }
        }
      },
      waving: {
        on: {
          STOP: { target: 'stopping', actions: ['prepareStop'] },
          TOGGLE: { target: 'stopping', actions: ['prepareStop'] },
          'SELECTION-MADE': { target: 'selection-mode', actions: ['showSelectorUI'] },
          'WAVE-ERROR': { target: 'error', actions: ['handleWaveError'] },
          'WAVE-READER-STOP': { target: 'component-cleaning', actions: ['cleanupComponents'] }
        }
      },
      stopping: {
        on: {
          STOP_COMPLETE: { target: 'ready', actions: ['stopWaveAnimation'] },
          STOP_FAILED: { target: 'error', actions: ['handleStopError'] }
        }
      },
      toggling: {
        on: {
          TOGGLE_COMPLETE: { target: 'ready', actions: ['completeToggle'] }
        }
      },
      'selection-mode': {
        on: {
          'SELECTION-MADE': { target: 'ready', actions: ['showSelectorUI', 'disableSelectionMode'] },
          'END-SELECTION': { target: 'ready', actions: ['disableSelectionMode'] },
          CANCEL: { target: 'ready', actions: ['cancelSelection', 'disableSelectionMode'] }
        }
      },
      'processing-ml': {
        on: {
          'ML-PROCESSED': { target: 'ready', actions: ['updateMLRecommendation'] },
          'ML-FAILED': { target: 'error', actions: ['handleMLError'] }
        }
      },
      'component-initializing': {
        on: {
          'COMPONENTS-READY': { target: 'ready', actions: ['markComponentsReady'] },
          'COMPONENTS-FAILED': { target: 'error', actions: ['handleComponentError'] }
        }
      },
      'component-cleaning': {
        on: {
          'COMPONENTS-CLEANED': { target: 'ready', actions: ['markComponentsCleaned'] },
          'COMPONENTS-CLEANUP-FAILED': { target: 'error', actions: ['handleCleanupError'] }
        }
      },
      error: {
        on: {
          RESET: { target: 'idle', actions: ['resetToIdle'] },
          RETRY: { target: 'ready', actions: ['retryOperation'] }
        }
      }
    }
  }
};

// Log states for view rendering
const logStates = {
  idle: async (context: any) => {
    await context.log('Content system in idle state - ready for initialization');
    return context.view(renderIdleView(context));
  },
  
  initializing: async (context: any) => {
    await context.log('Content system initializing - setting up DOM and services');
    return context.view(renderInitializingView(context));
  },
  
  ready: async (context: any) => {
    await context.log('Content system ready - wave reader available');
    return context.view(renderReadyView(context));
  },
  
  starting: async (context: any) => {
    await context.log('Content system starting - preparing wave animation');
    return context.view(renderStartingView(context));
  },
  
  waving: async (context: any) => {
    await context.log('Content system waving - animation active');
    return context.view(renderWavingView(context));
  },
  
  stopping: async (context: any) => {
    await context.log('Content system stopping - cleaning up animation');
    return context.view(renderStoppingView(context));
  },
  
  toggling: async (context: any) => {
    await context.log('Content system toggling - switching states');
    return context.view(renderTogglingView(context));
  },
  
  'selection-mode': async (context: any) => {
    await context.log('Content system in selection mode - choose elements');
    return context.view(renderSelectionModeView(context));
  },
  
  'processing-ml': async (context: any) => {
    await context.log('Content system processing ML recommendation');
    return context.view(renderProcessingMLView(context));
  },
  
  'component-initializing': async (context: any) => {
    await context.log('Content system initializing components');
    return context.view(renderComponentInitializingView(context));
  },
  
  'component-cleaning': async (context: any) => {
    await context.log('Content system cleaning up components');
    return context.view(renderComponentCleaningView(context));
  },
  
  error: async (context: any) => {
    await context.log('Content system error - needs attention');
    return context.view(renderErrorView(context));
  }
};

// Create function for the Tome
const createTome = (initialModel: Partial<ContentSystemModel> = {}) => {
  const defaultModel: ContentSystemModel = {
    // System state
    isActive: false,
    currentState: 'idle',
    going: false,
    latestOptions: null,
    
    // DOM state
    shadowDOM: {
      isInitialized: false,
      containerId: null,
      shadowRoot: null
    },
    
    // Wave animation state
    waveAnimation: {
      isActive: false,
      options: null,
      cssTemplate: null,
      lastApplied: null
    },
    
    // Selector UI state
    selectorUI: {
      isVisible: false,
      currentSelector: null,
      selectorMode: false
    },
    
    // Services state
    services: {
      hierarchySelector: {
        isInitialized: false,
        currentSelector: null
      },
      mlService: {
        isInitialized: false,
        lastRecommendation: null
      },
      colorService: {
        isInitialized: false
      }
    },
    
    // Message system
    messageSystem: {
      messageHistory: [],
      lastMessage: null,
      messageQueue: []
    },
    
    // Session and metadata
    sessionId: `content-system-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    stateHistory: [],
    error: null,
    timestamp: Date.now()
  };

  return createViewStateMachine({
    machineId: tomeConfig.machineId,
    xstateConfig: {
      ...tomeConfig.xstateConfig,
      context: {
        ...tomeConfig.xstateConfig.context,
        model: { ...defaultModel, ...initialModel }
      }
    },
    logStates
  });
};

// Create the Tome with metadata using the spread operator
export const LogViewContentSystemTomes = createComponentTomeWithMetadata(
  {
    // Spread the metadata header
    id: 'log-view-content-system-tome',
    name: 'Log-View-Machine Content System Tome',
    description: 'State management for content system with wave animations and DOM interactions',
    version: '1.0.0',
    dependencies: ['log-view-machine'],
    
    // Component-specific metadata
    componentType: 'system',
    author: 'Wave Reader Team',
    createdAt: '2024-01-01',
    lastModified: new Date().toISOString().split('T')[0],
    tags: ['content-system', 'wave-animation', 'dom-management', 'state-management'],
    priority: 'high',
    stability: 'stable',
    
    // Performance metadata
    performance: {
      memoryUsage: 2.5,
      initTime: 150,
      supportsLazyLoading: true
    },
    
    // Security metadata
    security: {
      requiresElevatedPermissions: false,
      handlesSensitiveData: false,
      level: 'low'
    },
    
    // Testing metadata
    testing: {
      coverage: 85,
      hasUnitTests: true,
      hasIntegrationTests: true,
      testSuite: 'src/test/content-scripts/'
    },
    
    // Deployment metadata
    deployment: {
      enabledByDefault: true,
      canBeDisabled: false,
      supportsHotReload: true,
      environments: ['development', 'staging', 'production']
    },
    
         // Service-specific metadata
     service: {
       category: 'integration',
       isStateful: true,
       isPersistent: true,
       lifecycle: 'singleton'
     },
    
    // Custom metadata
    custom: {
      waveAnimationSupport: true,
      shadowDOMSupport: true,
      messageRouting: true,
      mlIntegration: true
    }
  },
  tomeConfig,
  createTome
);

// View rendering functions
function renderIdleView(context: any) {
  const { model } = context;
  return {
    type: 'content',
    component: 'ContentSystemStatus',
    props: {
      status: 'idle',
      message: 'Content system idle - ready for initialization',
      systems: {
        content: model.isActive,
        shadow: model.shadowDOM.isInitialized,
        services: model.services
      }
    },
    priority: 1,
    timestamp: model.timestamp
  };
}

function renderInitializingView(context: any) {
  const { model } = context;
  return {
    type: 'content',
    component: 'ContentSystemInitializing',
    props: {
      status: 'initializing',
      message: 'Setting up DOM and services',
      progress: {
        shadowDOM: model.shadowDOM.isInitialized,
        services: Object.values(model.services).some((s: any) => s.isInitialized)
      }
    },
    priority: 2,
    timestamp: model.timestamp
  };
}

function renderReadyView(context: any) {
  const { model } = context;
  return {
    type: 'content',
    component: 'ContentSystemReady',
    props: {
      status: 'ready',
      message: 'Wave reader ready for operation',
      waveAnimation: model.waveAnimation,
      selectorUI: model.selectorUI,
      going: model.going
    },
    priority: 2,
    timestamp: model.timestamp
  };
}

function renderStartingView(context: any) {
  const { model } = context;
  return {
    type: 'content',
    component: 'ContentSystemStarting',
    props: {
      status: 'starting',
      message: 'Preparing wave animation',
      options: model.latestOptions
    },
    priority: 3,
    timestamp: model.timestamp
  };
}

function renderWavingView(context: any) {
  const { model } = context;
  return {
    type: 'content',
    component: 'ContentSystemWaving',
    props: {
      status: 'waving',
      message: 'Wave animation active',
      waveAnimation: model.waveAnimation,
      options: model.latestOptions
    },
    priority: 4,
    timestamp: model.timestamp
  };
}

function renderStoppingView(context: any) {
  const { model } = context;
  return {
    type: 'content',
    component: 'ContentSystemStopping',
    props: {
      status: 'stopping',
      message: 'Cleaning up wave animation'
    },
    priority: 3,
    timestamp: model.timestamp
  };
}

function renderTogglingView(context: any) {
  const { model } = context;
  return {
    type: 'content',
    component: 'ContentSystemToggling',
    props: {
      status: 'toggling',
      message: 'Switching system states'
    },
    priority: 2,
    timestamp: model.timestamp
  };
}

function renderSelectionModeView(context: any) {
  const { model } = context;
  return {
    type: 'overlay',
    component: 'ContentSystemSelectionMode',
    props: {
      status: 'selection-mode',
      message: 'Choose elements to read',
      selectorUI: model.selectorUI
    },
    priority: 5,
    timestamp: model.timestamp
  };
}

function renderProcessingMLView(context: any) {
  const { model } = context;
  return {
    type: 'content',
    component: 'ContentSystemProcessingML',
    props: {
      status: 'processing-ml',
      message: 'Processing ML recommendation',
      mlService: model.services.mlService
    },
    priority: 3,
    timestamp: model.timestamp
  };
}

function renderComponentInitializingView(context: any) {
  const { model } = context;
  return {
    type: 'content',
    component: 'ContentSystemComponentInitializing',
    props: {
      status: 'component-initializing',
      message: 'Initializing wave reader components',
      services: model.services
    },
    priority: 3,
    timestamp: model.timestamp
  };
}

function renderComponentCleaningView(context: any) {
  const { model } = context;
  return {
    type: 'content',
    component: 'ContentSystemComponentCleaning',
    props: {
      status: 'component-cleaning',
      message: 'Cleaning up wave reader components'
    },
    priority: 3,
    timestamp: model.timestamp
  };
}

function renderErrorView(context: any) {
  const { model } = context;
  return {
    type: 'notification',
    component: 'ContentSystemError',
    props: {
      status: 'error',
      message: 'Content system error - check logs',
      error: model.error || 'Unknown error'
    },
    priority: 6,
    timestamp: model.timestamp
  };
}

// Export for testing
export default LogViewContentSystemTomes;
