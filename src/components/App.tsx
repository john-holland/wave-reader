import React, { FunctionComponent, useEffect, useState, useCallback, useRef } from 'react';
import { ErrorBoundary } from './error-boundary';
import SettingsTomes from '../component-middleware/settings/SettingsTomes';
import AboutTome from '../component-middleware/about/AboutTome';
import { getSyncObject, setSyncObject } from '../util/sync';
import { guardLastError } from "../util/util";
import configured from '../config/config';
import SettingsService from "../services/settings";
import MLSettingsService from "../services/ml-settings-service";
import { SelectorsDefaultFactory } from "../models/defaults";
import Options from "../models/options";
import Wave from "../models/wave";
import { StartMessage, StopMessage, ToggleMessage, MessageFactory, MessageUtility } from "../models/messages/simplified-messages";
import { 
  WaveReaderMessageRouter,
  useWaveReaderMessageRouter
} from './structural';
import { createProxyRobotCopyStateMachine, createTomeConfig, createViewStateMachine, TomeClient, createRobotCopy } from 'log-view-machine';
import { ProxyMachineAdapter, ViewMachineAdapter } from '../adapters/machine-adapters';
import { SyncSystem } from '../systems/sync';
import {
  ModalContainer,
  ModalHeader,
  HeaderTitle,
  HeaderActions,
  StartWaveButton,
  CollapseButton,
  TabNavigation,
  TabButton,
  TabContent,
  HowToContent
} from './styled/AppStyles';

// Import machine configurations (these will be created separately)
// import { AppMachine, BackgroundProxyMachine, AppTome } from '../machines/app-machines';

// Global refresh function for manual state sync
let globalRefreshFunction: (() => void) | null = null;

// Function to send messages to content script
const sendExtensionMessage = async (message: any) => {
  try {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      const response = await chrome.runtime.sendMessage(message);
      return response;
    } else {
      console.warn('Chrome runtime not available');
      return { success: false, error: 'Chrome runtime not available' };
    }
  } catch (error: any) {
    console.error('Failed to send message to content script:', error);
    return { success: false, error: error.message };
  }
};

// Placeholder for machine instances - these will be imported from the machines file
const AppMachine = {
  getState: () => ({ value: 'idle' }),
  getContext: () => ({}),
  send: (event: any) => console.log('AppMachine send:', event),
  on: (event: string, handler: Function) => {},
  off: (event: string, handler: Function) => {},
  subscribe: (callback: Function) => ({ unsubscribe: () => {} }),
  getHealth: () => ({ status: 'healthy', lastHeartbeat: Date.now(), errorCount: 0, uptime: 0 })
};

const BackgroundProxyMachine = {
  getState: () => ({ value: 'idle' }),
  getContext: () => ({}),
  send: (event: any) => console.log('BackgroundProxyMachine send:', event),
  on: (event: string, handler: Function) => {},
  off: (event: string, handler: Function) => {},
  subscribe: (callback: Function) => ({ unsubscribe: () => {} }),
  getHealth: () => ({ status: 'healthy', lastHeartbeat: Date.now(), errorCount: 0, uptime: 0 })
};

const AppTome = {
  start: () => console.log('AppTome started'),
  on: (event: string, handler: Function) => {},
  off: (event: string, handler: Function) => {}
};

const AppComponent: FunctionComponent = () => {
    const [selector, setSelector] = useState('p');
    const [saved, setSaved] = useState(true);
    const [going, setGoing] = useState(false);
    const [selectors, setSelectors] = useState<string[]>([]);
    const [currentView, setCurrentView] = useState('main');
    const [isExtension, setIsExtension] = useState(false);
    const [settings, setSettings] = useState<Options | null>(null);
    const [showNotifications, setShowNotifications] = useState(true);
    
    // New state for modal structure
    const [activeTab, setActiveTab] = useState<'how-to' | 'settings' | 'about'>('how-to');
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Add state for reactive UI updates
    const [appMachineState, setAppMachineState] = useState(AppMachine.getState());
    const [proxyMachineState, setProxyMachineState] = useState(BackgroundProxyMachine.getState());
    const [appMachineContext, setAppMachineContext] = useState(AppMachine.getContext());
    const [proxyMachineContext, setProxyMachineContext] = useState(BackgroundProxyMachine.getContext());
    
    // State for tome rendering
    const [tomeRenderKey, setTomeRenderKey] = useState(0);
    
    // Set up UI component communication
    const handleUIComponentEvent = (event: any) => {
        console.log('🌊 App Component: UI component event received', event);
        
        // Route UI events to appropriate tomes
        switch (event.source) {
            case 'wave-tabs':
                console.log('🌊 App Component: Routing to WaveTabs Tome');
                // You can access the tome through the AppTome
                break;
            case 'settings':
                console.log('🌊 App Component: Routing to Settings Tome');
                // You can access the tome through the AppTome
                break;
            default:
                console.log('🌊 App Component: Unknown UI component', event.source);
        }
    };

    // Initialize services
    const settingsService = new SettingsService();
    const mlSettingsService = new MLSettingsService();

    const syncState = async () => {
        // Simplified sync state - just update local state
        console.log('🌊 App: Syncing state');
    }

    // Function to refresh state from content script
    const refreshStateFromContentScript = async () => {
        try {
                console.log('🌊 App: Triggered state refresh from content script');
        } catch (error) {
            console.error('🌊 App: Failed to trigger state refresh', error);
        }
    }

    // Set the global refresh function
    globalRefreshFunction = refreshStateFromContentScript;

    useEffect(() => {
        // Initialize AppMachine with viewModel
        const viewModel = {
            selector,
            saved,
            going,
            selectors,
            currentView,
            isExtension,
            settings,
            showNotifications
        };
        
        // Register and start the tome
        AppTome.start();

        // Initialize the AppMachine with circuit breaker
        if ((window as any).appInitializationInProgress) {
            console.warn('🔄 APP INITIALIZE: Already in progress, ignoring duplicate call');
            console.trace('🔄 Duplicate INITIALIZE call stack:');
            return;
        }
        
        console.log('🌊 App: Will send INITIALIZE event after machine starts');
        console.trace('🔄 INITIALIZE call stack from main component:');
        
        
        // Set up ISubMachine event listeners to demonstrate the platform capabilities
        // Only set up the started listener once to prevent multiple INITIALIZE calls
        if (!(window as any).appMachineStartedListenerSet) {
            (window as any).appMachineStartedListenerSet = true;
            AppMachine.on('started', (data: any) => {
                console.log('🌊 App Machine started:', data);
                // Only send INITIALIZE if not already in progress
                if (!(window as any).appInitializationInProgress) {
                    (window as any).appInitializationInProgress = true;
                    AppMachine.send('INITIALIZE');
                } else {
                    console.log('🌊 App Machine started: INITIALIZE already in progress, skipping');
                }
            });
        }
        
        AppMachine.on('stopped', (data: any) => {
            console.log('🌊 App Machine stopped:', data);
        });
        
        AppMachine.on('error', (data: any) => {
            console.error('🌊 App Machine error:', data);
            // Reset circuit breaker on error
            (window as any).appInitializationInProgress = false;
        });
        
        // Listen for initialization completion to reset circuit breaker
        AppMachine.on('stateChanged', (data: any) => {
            if (data.state === 'ready' || data.state === 'error') {
                console.log('🌊 App: Initialization completed, resetting circuit breaker');
                (window as any).appInitializationInProgress = false;
            }
        });
        
        BackgroundProxyMachine.on('started', (data: any) => {
            console.log('🌊 Background Proxy Machine started:', data);
        });
        
        BackgroundProxyMachine.on('error', (data: any) => {
            console.error('🌊 Background Proxy Machine error:', data);
        });
        
        console.log('🌊 AppTome: Initialized with viewModel:', viewModel);
        console.log('🌊 AppTome: Machine health status:', {
            appMachine: AppMachine.getHealth(),
            backgroundProxy: BackgroundProxyMachine.getHealth()
        });
        
        // Set up state change listeners for reactive UI
        const handleAppMachineStateChange = (data: any) => {
            console.log('🌊 App Component: App machine state changed', data);
            setAppMachineState(AppMachine.getState());
            setAppMachineContext(AppMachine.getContext());
            // Trigger tome re-render
            setTomeRenderKey(prev => prev + 1);
        };
        
        const handleProxyMachineStateChange = (data: any) => {
            console.log('🌊 App Component: Proxy machine state changed', data);
            setProxyMachineState(BackgroundProxyMachine.getState());
            setProxyMachineContext(BackgroundProxyMachine.getContext());
        };
        
        // Subscribe to state changes
        const appSubscription = AppMachine.subscribe?.(handleAppMachineStateChange);
        const proxySubscription = BackgroundProxyMachine.subscribe?.(handleProxyMachineStateChange);
        
        // Subscribe to tome events for reactive rendering
        const handleTomeRender = (data: any) => {
            console.log('🌊 App Component: Tome render event', data);
            setTomeRenderKey(prev => prev + 1);
        };
        
        (AppTome as any).on('render', handleTomeRender);
        
        return () => {
            appSubscription?.unsubscribe?.();
            proxySubscription?.unsubscribe?.();
            (AppTome as any).off('render', handleTomeRender);
        };
    }, []);

    // Helper functions for tab management
    const handleTabChange = (tab: 'how-to' | 'settings' | 'about') => {
        AppMachine.send({ type: 'TAB_CHANGE', tab });
    };

    const handleToggleCollapse = () => {
        AppMachine.send({ type: 'TOGGLE_COLLAPSE' });
    };

    const handleStartWave = () => {
        AppMachine.send({ type: 'START' });
    };

    // Debug functions for loop detection
    const handleShowLoopStats = () => {
        const stats = (window as any).getLoopDetectionStats();
        console.log('🔄 Loop Detection Stats:', stats);
        alert(`Loop Detection Stats:\n\nEvents: ${stats.middleware_0?.recentEvents || 0}\nStates: ${stats.middleware_0?.recentStates || 0}\nCurrent: ${stats.middleware_0?.currentState || 'unknown'}\n\nCheck console for full details.`);
    };

    const handleClearLoopStats = () => {
        (window as any).clearLoopDetection();
        console.log('🔄 Loop detection stats cleared');
    };

    // Auto-report loop detection stats to background.js every 1ms with throttling
    React.useEffect(() => {
        let lastReportTime = 0;
        let lastState = '';
        let lastEventCount = 0;
        let lastStateCount = 0;
        
        const interval = setInterval(() => {
            const stats = (window as any).getLoopDetectionStats();
            if (stats && stats.middleware_0) {
                const { recentEvents, recentStates, currentState, eventFrequency, stateFrequency } = stats.middleware_0;
                const now = Date.now();
                
                // Throttle: Only report if there's actual change or every 100ms minimum
                const hasStateChange = currentState !== lastState;
                const hasEventChange = recentEvents !== lastEventCount;
                const hasStateCountChange = recentStates !== lastStateCount;
                const timeSinceLastReport = now - lastReportTime;
                
                if ((hasStateChange || hasEventChange || hasStateCountChange || timeSinceLastReport > 100) && 
                    (recentEvents > 0 || recentStates > 0)) {
                    
                    // Update tracking variables
                    lastState = currentState;
                    lastEventCount = recentEvents;
                    lastStateCount = recentStates;
                    lastReportTime = now;
                    
                    // Send to background script for logging
                    try {
                        if (typeof chrome !== 'undefined' && chrome.runtime) {
                            chrome.runtime.sendMessage({
                                type: 'LOOP_DETECTION_STATS',
                                data: {
                                    timestamp: now,
                                    currentState,
                                    recentEvents,
                                    recentStates,
                                    eventFrequency,
                                    stateFrequency,
                                    source: 'popup',
                                    hasStateChange,
                                    hasEventChange,
                                    hasStateCountChange
                                }
                            }, (response) => {
                                if (chrome.runtime.lastError) {
                                    // Fallback to console if background isn't available
                                    console.log('🔄 Auto-Stats (fallback):', {
                                        currentState,
                                        recentEvents,
                                        recentStates,
                                        eventFrequency,
                                        stateFrequency
                                    });
                                }
                            });
                        } else {
                            // Fallback to console if chrome API isn't available
                            console.log('🔄 Auto-Stats (fallback):', {
                                currentState,
                                recentEvents,
                                recentStates,
                                eventFrequency,
                                stateFrequency
                            });
                        }
                    } catch (error) {
                        console.log('🔄 Auto-Stats (error):', error);
                    }
                }
            }
        }, 1); // Every 1ms for maximum granularity monitoring

        return () => clearInterval(interval);
    }, []);

    return (
        <ErrorBoundary>
            <ModalContainer>
                <ModalHeader>
                    <HeaderTitle>🌊 Wave Reader</HeaderTitle>
                    <HeaderActions>
                        <StartWaveButton onClick={handleStartWave}>
                            {going ? 'Stop Wave' : 'Start Wave'}
                        </StartWaveButton>
                        <CollapseButton 
                            onClick={handleToggleCollapse}
                            title={isCollapsed ? 'Expand tabs' : 'Collapse tabs'}
                        >
                            {isCollapsed ? '⇲' : '⇳'}
                        </CollapseButton>
                        <button 
                            onClick={handleShowLoopStats}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                marginLeft: '4px'
                            }}
                            title="Show loop detection stats"
                        >
                            🔄 Stats
                        </button>
                        <button 
                            onClick={handleClearLoopStats}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                marginLeft: '2px'
                            }}
                            title="Clear loop detection stats"
                        >
                            🧹 Clear
                        </button>
                    </HeaderActions>
                </ModalHeader>
                
                {!isCollapsed && (
                    <>
                        <TabNavigation>
                            <TabButton 
                                isActive={activeTab === 'how-to'}
                                onClick={() => handleTabChange('how-to')}
                            >
                                How to
                            </TabButton>
                            <TabButton 
                                isActive={activeTab === 'settings'}
                                onClick={() => handleTabChange('settings')}
                            >
                                Settings
                            </TabButton>
                            <TabButton 
                                isActive={activeTab === 'about'}
                                onClick={() => handleTabChange('about')}
                            >
                                About
                            </TabButton>
                        </TabNavigation>
                        
                        <TabContent>
                            {activeTab === 'how-to' && (
                                <HowToContent>
                                    <h3>🌊 How to Use Wave Reader</h3>
                                    <p>Click "Start Wave" to animate the page and help with reading comprehension.</p>
                                    <p>
                                        <strong>Keyboard Shortcut:</strong> 
                                        <span className="shortcut">Alt + S</span> to toggle page animation
                                    </p>
                                    <p>
                                        The wave animation applies gentle wobble effects to text elements, 
                                        helping your eyes follow the content more naturally and reducing eye strain.
                                    </p>
                                </HowToContent>
                            )}
                            
                            {activeTab === 'settings' && (
                                <SettingsTomes />
                            )}
                            
                            {activeTab === 'about' && (
                                <AboutTome />
                            )}
                        </TabContent>
                    </>
                )}
            </ModalContainer>
        </ErrorBoundary>
    );
}

export default AppComponent;

