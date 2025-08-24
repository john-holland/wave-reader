import React from 'react';
import { createViewStateMachine } from 'log-view-machine';

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

export const GoButtonTomes = {
  id: 'go-button-tome',
  name: 'Go Button Tome',
  description: 'State management for go button with wave animation',
  version: '1.0.0',
  
  // Create the go button tome instance
  create: (initialModel: Partial<GoButtonModel> = {}) => {
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
      machineId: 'go-button',
      xstateConfig: {
        id: 'go-button',
        initial: 'idle',
        context: {
          model: defaultModel
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
          error: {
            on: {
              RETRY: { target: 'idle', actions: ['retryOperation'] },
              RESET: { target: 'idle', actions: ['resetButton'] }
            }
          },
          disabled: {
            on: {
              ENABLE: { target: 'idle', actions: ['enableButton'] }
            }
          },
          'wave-animation': {
            on: {
              ANIMATION_COMPLETE: { target: 'going', actions: ['completeWaveAnimation'] },
              STOP: { target: 'stopping', actions: ['startStopping'] }
            }
          },
          'auto-stop': {
            on: {
              STOPPED: { target: 'idle', actions: ['completeAutoStop'] },
              CANCEL: { target: 'going', actions: ['cancelAutoStop'] }
            },
            after: {
              2000: { target: 'stopping', actions: ['startStopping'] }
            }
          },
          completed: {
            type: 'final',
            on: {
              RESET: { target: 'idle', actions: ['resetButton'] }
            }
          }
        }
      },
      
      // State handlers with logging
      logStates: {
        idle: async (context) => {
          await context.log('Go button is idle');
          return context.view(renderIdleView(context));
        },
        
        going: async (context) => {
          await context.log('Go button is active - waving');
          return context.view(renderGoingView(context));
        },
        
        stopping: async (context) => {
          await context.log('Go button is stopping');
          return context.view(renderStoppingView(context));
        },
        
        loading: async (context) => {
          await context.log('Go button is loading');
          return context.view(renderLoadingView(context));
        },
        
        error: async (context) => {
          await context.log('Go button encountered an error');
          return context.view(renderErrorView(context));
        },
        
        disabled: async (context) => {
          await context.log('Go button is disabled');
          return context.view(renderDisabledView(context));
        },
        
        'wave-animation': async (context) => {
          await context.log('Go button is in wave animation mode');
          return context.view(renderWaveAnimationView(context));
        },
        
        'auto-stop': async (context) => {
          await context.log('Go button is in auto-stop mode');
          return context.view(renderAutoStopView(context));
        },
        
        completed: async (context) => {
          await context.log('Go button operation completed');
          return context.view(renderCompletedView(context));
        }
      }
    });
  }
};

// View rendering functions
function renderIdleView(context: any) {
  const { model } = context;
  return (
    <div className="go-button-idle">
      <button 
        className={['go-button', 'go-button-idle', `go-button-${model.buttonSize}`, `go-button-${model.buttonStyle}`].join(' ')}
        disabled={model.disabled}
        aria-label={model.accessibility.ariaLabel}
        role={model.accessibility.role}
        tabIndex={model.accessibility.tabIndex}
      >
        <span className="wave-symbol">{model.waveSymbol}</span>
        <span className="button-text">{model.displayText}</span>
      </button>
      
      <div className="button-info">
        <span className="click-count">Clicks: {model.clickCount}</span>
        <span className="status">Status: Idle</span>
      </div>
    </div>
  );
}

function renderGoingView(context: any) {
  const { model } = context;
  return (
    <div className="go-button-going">
      <button 
        className={['go-button', 'go-button-going', `go-button-${model.buttonSize}`, `go-button-${model.buttonStyle}`].join(' ')}
        aria-label={model.accessibility.ariaLabel}
        role={model.accessibility.role}
        tabIndex={model.accessibility.tabIndex}
      >
        <span className="wave-symbol wave-animation">{model.waveSymbol}</span>
        <span className="button-text">{model.displayText}</span>
      </button>
      
      <div className="button-info">
        <span className="click-count">Clicks: {model.clickCount}</span>
        <span className="status">Status: Waving</span>
        <span className="wave-speed">Speed: {model.waveSpeed}</span>
      </div>
      
      <div className="wave-controls">
        <button className="control-btn" onClick={() => context.send('WAVE_ANIMATION')}>
          Adjust Speed
        </button>
        <button className="control-btn" onClick={() => context.send('AUTO_STOP')}>
          Auto Stop
        </button>
      </div>
    </div>
  );
}

function renderStoppingView(context: any) {
  const { model } = context;
  return (
    <div className="go-button-stopping">
      <button 
        className={['go-button', 'go-button-stopping', `go-button-${model.buttonSize}`, `go-button-${model.buttonStyle}`].join(' ')}
        disabled
        aria-label={model.accessibility.ariaLabel}
        role={model.accessibility.role}
        tabIndex={model.accessibility.tabIndex}
      >
        <span className="wave-symbol">{model.waveSymbol}</span>
        <span className="button-text">{model.displayText}</span>
      </button>
      
      <div className="button-info">
        <span className="click-count">Clicks: {model.clickCount}</span>
        <span className="status">Status: Stopping...</span>
      </div>
      
      <div className="stopping-progress">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <span className="progress-text">Stopping wave animation...</span>
      </div>
    </div>
  );
}

function renderLoadingView(context: any) {
  const { model } = context;
  return (
    <div className="go-button-loading">
      <button 
        className={['go-button', 'go-button-loading', `go-button-${model.buttonSize}`, `go-button-${model.buttonStyle}`].join(' ')}
        disabled
        aria-label={model.accessibility.ariaLabel}
        role={model.accessibility.role}
        tabIndex={model.accessibility.tabIndex}
      >
        <span className="wave-symbol">{model.waveSymbol}</span>
        <span className="button-text">{model.displayText}</span>
      </button>
      
      <div className="button-info">
        <span className="click-count">Clicks: {model.clickCount}</span>
        <span className="status">Status: Loading...</span>
      </div>
      
      <div className="loading-spinner">
        <div className="spinner"></div>
        <span className="loading-text">Loading...</span>
      </div>
    </div>
  );
}

function renderErrorView(context: any) {
  const { model } = context;
  return (
    <div className="go-button-error">
      <button 
        className={['go-button', 'go-button-error', `go-button-${model.buttonSize}`, `go-button-${model.buttonStyle}`].join(' ')}
        aria-label={model.accessibility.ariaLabel}
        role={model.accessibility.role}
        tabIndex={model.accessibility.tabIndex}
      >
        <span className="wave-symbol">⚠️</span>
        <span className="button-text">Error</span>
      </button>
      
      <div className="button-info">
        <span className="click-count">Clicks: {model.clickCount}</span>
        <span className="status">Status: Error</span>
      </div>
      
      {model.error && (
        <div className="error-details">
          <h4>Error Details</h4>
          <p className="error-message">{model.error.message || 'Unknown error'}</p>
          <p className="error-details">{model.error.details || 'No details available'}</p>
          <p className="error-recoverable">
            Recoverable: {model.error.recoverable ? 'Yes' : 'No'}
          </p>
        </div>
      )}
      
      <div className="error-actions">
        <button className="control-btn" onClick={() => context.send('RETRY')}>
          🔄 Retry
        </button>
        <button className="control-btn" onClick={() => context.send('RESET')}>
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

function renderDisabledView(context: any) {
  const { model } = context;
  return (
    <div className="go-button-disabled">
      <button 
        className={['go-button', 'go-button-disabled', `go-button-${model.buttonSize}`, `go-button-${model.buttonStyle}`].join(' ')}
        disabled
        aria-label={model.accessibility.ariaLabel}
        role={model.accessibility.role}
        tabIndex={model.accessibility.tabIndex}
      >
        <span className="wave-symbol">🚫</span>
        <span className="button-text">{model.displayText}</span>
      </button>
      
      <div className="button-info">
        <span className="click-count">Clicks: {model.clickCount}</span>
        <span className="status">Status: Disabled</span>
      </div>
      
      <div className="disabled-message">
        <p>Button is currently disabled</p>
        <button className="control-btn" onClick={() => context.send('ENABLE')}>
          Enable
        </button>
      </div>
    </div>
  );
}

function renderWaveAnimationView(context: any) {
  const { model } = context;
  return (
    <div className="go-button-wave-animation">
      <button 
        className={['go-button', 'go-button-wave-animation', `go-button-${model.buttonSize}`, `go-button-${model.buttonStyle}`].join(' ')}
        aria-label={model.accessibility.ariaLabel}
        role={model.accessibility.role}
        tabIndex={model.accessibility.tabIndex}
      >
        <span className="wave-symbol wave-animation-fast">{model.waveSymbol}</span>
        <span className="button-text">Waving Fast</span>
      </button>
      
      <div className="button-info">
        <span className="click-count">Clicks: {model.clickCount}</span>
        <span className="status">Status: Wave Animation</span>
        <span className="wave-speed">Speed: {model.waveSpeed}</span>
      </div>
      
      <div className="animation-controls">
        <button className="control-btn" onClick={() => context.send('WAVE_ANIMATION')}>
          Adjust Speed
        </button>
        <button className="control-btn" onClick={() => context.send('STOP')}>
          Stop Animation
        </button>
      </div>
      
      <div className="wave-visualization">
        <div className="wave-container">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
      </div>
    </div>
  );
}

function renderAutoStopView(context: any) {
  const { model } = context;
  return (
    <div className="go-button-auto-stop">
      <button 
        className={['go-button', 'go-button-auto-stop', `go-button-${model.buttonSize}`, `go-button-${model.buttonStyle}`].join(' ')}
        aria-label={model.accessibility.ariaLabel}
        role={model.accessibility.role}
        tabIndex={model.accessibility.tabIndex}
      >
        <span className="wave-symbol wave-animation">{model.waveSymbol}</span>
        <span className="button-text">{model.displayText}</span>
      </button>
      
      <div className="button-info">
        <span className="click-count">Clicks: {model.clickCount}</span>
        <span className="status">Status: Auto-Stopping</span>
        <span className="countdown">Stopping in: <span id="countdown-timer">2</span>s</span>
      </div>
      
      <div className="auto-stop-controls">
        <button className="control-btn" onClick={() => context.send('CANCEL')}>
          Cancel Auto-Stop
        </button>
        <button className="control-btn" onClick={() => context.send('STOP')}>
          Stop Now
        </button>
      </div>
      
      <div className="auto-stop-progress">
        <div className="progress-bar">
          <div className="progress-fill auto-stop-fill"></div>
        </div>
        <span className="progress-text">Auto-stopping in progress...</span>
      </div>
    </div>
  );
}

function renderCompletedView(context: any) {
  const { model } = context;
  return (
    <div className="go-button-completed">
      <button 
        className={['go-button', 'go-button-completed', `go-button-${model.buttonSize}`, `go-button-${model.buttonStyle}`].join(' ')}
        aria-label={model.accessibility.ariaLabel}
        role={model.accessibility.role}
        tabIndex={model.accessibility.tabIndex}
      >
        <span className="wave-symbol">✅</span>
        <span className="button-text">Completed</span>
      </button>
      
      <div className="button-info">
        <span className="click-count">Clicks: {model.clickCount}</span>
        <span className="status">Status: Completed</span>
        <span className="completion-time">
          Completed at: {new Date().toLocaleTimeString()}
        </span>
      </div>
      
      <div className="completion-summary">
        <h4>Operation Summary</h4>
        <p>Total clicks: {model.clickCount}</p>
        <p>Last operation: {model.lastClickTime ? new Date(model.lastClickTime).toLocaleTimeString() : 'Unknown'}</p>
        <p>Status: Successfully completed</p>
      </div>
      
      <div className="completion-actions">
        <button className="control-btn" onClick={() => context.send('RESET')}>
          🔄 Reset Button
        </button>
        <button className="control-btn" onClick={() => context.send('GO')}>
          🚀 Start New
        </button>
      </div>
    </div>
  );
}

export default GoButtonTomes;
