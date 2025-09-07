import React from 'react';
import { createViewStateMachine } from '../../mocks/log-view-machine';
import { createComponentTomeWithMetadata } from '../../types/tome-metadata';

/**
 * Go Button Tome
 * 
 * Manages the state and behavior of the go button component
 * using log-view-machine for state management and logging.
 */

export interface GoButtonModel {
  displayText: string;
  going: boolean;
  waveAnimation: boolean;
  buttonSize: 'small' | 'normal' | 'large';
  waveSymbol: string;
  disabled: boolean;
  loading: boolean;
  error: any;
  clickCount: number;
  lastClickTime: string | null;
  autoStop: boolean;
  autoStopDelay: number;
  waveSpeed: 'slow' | 'normal' | 'fast';
  buttonStyle: 'default' | 'primary' | 'secondary';
  accessibility: {
    ariaLabel: string;
    role: string;
    tabIndex: number;
  };
}

// Tome configuration
const tomeConfig = {
      machineId: 'go-button',
      xstateConfig: {
        id: 'go-button',
        initial: 'idle',
        context: {
      model: {} as GoButtonModel
        },
        states: {
          idle: {
            on: {
              GO: { target: 'going', actions: ['startGoing'] },
              DISABLE: { target: 'disabled', actions: ['disableButton'] },
              LOAD: { target: 'loading', actions: ['startLoading'] },
              ERROR: { target: 'error', actions: ['handleError'] }
            }
          },
          going: {
            on: {
              STOP: { target: 'stopping', actions: ['startStopping'] },
              AUTO_STOP: { target: 'auto-stop', actions: ['startAutoStop'] },
              WAVE_ANIMATION: { target: 'wave-animation', actions: ['startWaveAnimation'] },
              ERROR: { target: 'error', actions: ['handleError'] }
            },
            after: {
              5000: { target: 'auto-stop', actions: ['startAutoStop'] }
            }
          },
          stopping: {
            on: {
              STOPPED: { target: 'idle', actions: ['completeStop'] },
              ERROR: { target: 'error', actions: ['handleError'] }
            }
          },
          loading: {
            on: {
              LOADED: { target: 'idle', actions: ['completeLoading'] },
              ERROR: { target: 'error', actions: ['handleError'] }
            }
          },
      'auto-stop': {
        on: {
          STOPPED: { target: 'idle', actions: ['completeAutoStop'] },
          ERROR: { target: 'error', actions: ['handleError'] }
            }
          },
          'wave-animation': {
            on: {
          STOP: { target: 'stopping', actions: ['startStopping'] },
          ERROR: { target: 'error', actions: ['handleError'] }
        }
      },
      disabled: {
        on: {
          ENABLE: { target: 'idle', actions: ['enableButton'] },
          ERROR: { target: 'error', actions: ['handleError'] }
        }
      },
      error: {
        on: {
          RESET: { target: 'idle', actions: ['resetToIdle'] },
          RETRY: { target: 'idle', actions: ['retryOperation'] }
        }
      }
    }
  }
};

// Create function for the Tome
const createTome = (initialModel: Partial<GoButtonModel> = {}) => {
  const defaultModel: GoButtonModel = {
    displayText: 'go!',
    going: false,
    waveAnimation: false,
    buttonSize: 'normal',
    waveSymbol: '🌊',
    disabled: false,
    loading: false,
    error: null,
    clickCount: 0,
    lastClickTime: null,
    autoStop: false,
    autoStopDelay: 5000,
    waveSpeed: 'normal',
    buttonStyle: 'default',
    accessibility: {
      ariaLabel: 'Go button for wave animation',
      role: 'button',
      tabIndex: 0
    },
    ...initialModel
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
    logStates: {
      idle: async (context: any) => {
        await context.log('Go button in idle state - ready for interaction');
        return context.view({
          type: 'button',
          component: 'GoButton',
          props: { ...context.model, state: 'idle' },
          priority: 1
        });
      },
      
      going: async (context: any) => {
        await context.log('Go button in going state - wave animation active');
        return context.view({
          type: 'button',
          component: 'GoButton',
          props: { ...context.model, state: 'going' },
          priority: 2
        });
      },
      
      stopping: async (context: any) => {
        await context.log('Go button in stopping state - cleaning up animation');
        return context.view({
          type: 'button',
          component: 'GoButton',
          props: { ...context.model, state: 'stopping' },
          priority: 2
        });
      },
      
      loading: async (context: any) => {
        await context.log('Go button in loading state - processing request');
        return context.view({
          type: 'button',
          component: 'GoButton',
          props: { ...context.model, state: 'loading' },
          priority: 2
        });
      },
      
      'auto-stop': async (context: any) => {
        await context.log('Go button in auto-stop state - automatic cleanup');
        return context.view({
          type: 'button',
          component: 'GoButton',
          props: { ...context.model, state: 'auto-stop' },
          priority: 2
        });
      },
      
      'wave-animation': async (context: any) => {
        await context.log('Go button in wave-animation state - visual effects active');
        return context.view({
          type: 'button',
          component: 'GoButton',
          props: { ...context.model, state: 'wave-animation' },
          priority: 3
        });
      },
      
      disabled: async (context: any) => {
        await context.log('Go button in disabled state - not interactive');
        return context.view({
          type: 'button',
          component: 'GoButton',
          props: { ...context.model, state: 'disabled' },
          priority: 1
        });
      },
      
      error: async (context: any) => {
        await context.log('Go button in error state - needs attention');
        return context.view({
          type: 'notification',
          component: 'GoButtonError',
          props: { ...context.model, state: 'error' },
          priority: 4
        });
      }
    }
  });
};

// Create the Tome with metadata using the spread operator
export const GoButtonTomes = createComponentTomeWithMetadata(
  {
    // Spread the metadata header
    id: 'go-button-tome',
    name: 'Go Button Tome',
    description: 'State management for go button with wave animation',
    version: '1.0.0',
    dependencies: ['log-view-machine'],
    
    // Component-specific metadata
    componentType: 'ui',
    author: 'Wave Reader Team',
    createdAt: '2024-01-01',
    lastModified: new Date().toISOString().split('T')[0],
    tags: ['go-button', 'wave-animation', 'ui-component', 'state-management'],
    priority: 'normal',
    stability: 'stable',
    
    // UI-specific metadata
    ui: {
      rendersVisualElements: true,
      isInteractive: true,
      accessibility: {
        ariaSupport: 'full',
        keyboardNavigation: true,
        screenReaderSupport: true
      },
      responsive: {
        mobileSupport: 'full',
        tabletSupport: 'full',
        desktopSupport: 'full'
      }
    },
    
    // Performance metadata
    performance: {
      memoryUsage: 0.5,
      initTime: 50,
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
      coverage: 90,
      hasUnitTests: true,
      hasIntegrationTests: true,
      testSuite: 'src/test/component-middleware/go-button/'
    },
    
    // Deployment metadata
    deployment: {
      enabledByDefault: true,
      canBeDisabled: true,
      supportsHotReload: true,
      environments: ['development', 'staging', 'production']
    },
    
    // Custom metadata
    custom: {
      waveAnimationSupport: true,
      accessibilityCompliant: true,
      responsiveDesign: true,
      themeable: true
    }
  },
  tomeConfig,
  createTome
);

export default GoButtonTomes;
