import { createViewStateMachine } from '../mocks/log-view-machine';
import { createComponentTomeWithMetadata, ComponentTomeMetadata } from '../types/tome-metadata';

// Shadow System Model Interface
export interface ShadowSystemModel {
  shadowRoot: ShadowRoot | null;
  shadowStyleElement: HTMLStyleElement | null;
  selectorUiRoot: HTMLDivElement | null;
  going: boolean;
  latestOptions: any;
  mouseX: number;
  mouseY: number;
  mouseFollowInterval: any;
  lastCss: string;
  lastMouseX: number;
  lastMouseY: number;
  lastMouseTime: number;
  currentAnimationDuration: number | null;
  sessionId: string;
  messageHistory: any[];
}

// Shadow System States
const shadowStates = {
  base: {
    on: {
      start: 'waving',
      stop: 'stopped',
      toggle: 'toggling',
      'mouse-move': 'tracking',
      'selection-mode': 'selecting'
    }
  },
  waving: {
    on: {
      stop: 'stopped',
      'mouse-move': 'tracking',
      'selection-mode': 'selecting'
    }
  },
  stopped: {
    on: {
      start: 'waving',
      toggle: 'toggling',
      'selection-mode': 'selecting'
    }
  },
  tracking: {
    on: {
      'mouse-stop': 'waving',
      stop: 'stopped',
      'selection-mode': 'selecting'
    }
  },
  selecting: {
    on: {
      'selection-made': 'waving',
      cancel: 'waving'
    }
  },
  toggling: {
    on: {
      'toggle-complete': 'waving'
    }
  }
};

// Shadow System Tome Configuration
const tomeConfig = {
  machineId: 'shadow-system-tome',
  xstateConfig: {
    id: 'shadow-system-tome',
    initial: 'base',
    states: shadowStates,
    context: {
      shadowRoot: null,
      shadowStyleElement: null,
      selectorUiRoot: null,
      going: false,
      latestOptions: null,
      mouseX: 0,
      mouseY: 0,
      mouseFollowInterval: null,
      lastCss: '',
      lastMouseX: 0,
      lastMouseY: 0,
      lastMouseTime: Date.now(),
      currentAnimationDuration: null,
      sessionId: '',
      messageHistory: []
    }
  }
};

// Shadow System Tome Creation Function
const createShadowSystemTome = (initialModel: Partial<ShadowSystemModel> = {}) => {
  const model: ShadowSystemModel = {
    shadowRoot: null,
    shadowStyleElement: null,
    selectorUiRoot: null,
    going: false,
    latestOptions: null,
    mouseX: 0,
    mouseY: 0,
    mouseFollowInterval: null,
    lastCss: '',
    lastMouseX: 0,
    lastMouseY: 0,
    lastMouseTime: Date.now(),
    currentAnimationDuration: null,
    sessionId: `shadow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    messageHistory: [],
    ...initialModel
  };

  return createViewStateMachine(tomeConfig);
};

// Shadow System Tome with Metadata
export const LogViewShadowSystemTomes = createComponentTomeWithMetadata(
  {
    id: 'log-view-shadow-system-tome',
    name: 'Log-View-Machine Shadow System Tome',
    description: 'State management for shadow DOM system with mouse tracking and wave animations',
    version: '1.0.0',
    dependencies: ['log-view-machine'],
    componentType: 'system',
    author: 'Wave Reader Team',
    createdAt: '2024-01-01',
    lastModified: new Date().toISOString().split('T')[0],
    tags: ['shadow-dom', 'mouse-tracking', 'wave-animation', 'state-management'],
    priority: 'high',
    stability: 'stable',
    performance: {
      memoryUsage: 1024,
      initTime: 100,
      supportsLazyLoading: true
    },
    security: {
      requiresElevatedPermissions: false,
      handlesSensitiveData: false,
      level: 'low'
    },
    testing: {
      coverage: 90,
      hasUnitTests: true,
      hasIntegrationTests: true,
      testSuite: 'jest'
    },
    deployment: {
      enabledByDefault: true,
      canBeDisabled: true,
      supportsHotReload: true,
      environments: ['development', 'production']
    },
    service: {
      category: 'integration',
      isStateful: true,
      isPersistent: true,
      lifecycle: 'singleton'
    },
    custom: {
      shadowDomEnabled: true,
      mouseTrackingEnabled: true,
      waveAnimationEnabled: true,
      selectorHierarchyEnabled: true
    }
  },
  tomeConfig,
  createShadowSystemTome
);

export default LogViewShadowSystemTomes;
