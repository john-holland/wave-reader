import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MachineRouter, createViewStateMachine } from 'log-view-machine';
import EditorWrapper from '../../app/components/EditorWrapper';
import { AppTome } from '../../app/tomes/AppTome';
// @ts-ignore - Template not in package exports but exists in monorepo
import { SelectorHierarchyComponentTemplate } from './templates/selector-hierarchy-component/index.js';
import { 
  ColorPanelData, 
  generateColor, 
  generateDimmedColor, 
  generateSelector,
  createColorPanelData
} from './utils';

// Styled components for the Tomes-based selector hierarchy
const SelectorHierarchyContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const HierarchyOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
`;

const ColorPanel = styled.div<{ isActive: boolean; color: string; rect: DOMRect }>`
  position: absolute;
  left: ${props => props.rect.left + window.scrollX}px;
  top: ${props => props.rect.top + window.scrollY}px;
  width: ${props => props.rect.width}px;
  height: ${props => props.rect.height}px;
  background: ${props => props.color};
  border: ${props => props.isActive ? '3px solid #005AE9' : '2px dashed #888'};
  z-index: ${props => props.isActive ? 9999 : 9998};
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.isActive ? '0 0 8px #005AE9' : 'none'};
  transition: all 0.2s ease;
  opacity: ${props => props.isActive ? 1 : 0.7};
  
  &:hover {
    transform: scale(1.02);
    box-shadow: ${props => props.isActive ? '0 0 12px #005AE9' : '0 0 8px #888'};
  }
`;

const PanelButton = styled.button<{ isActive: boolean }>`
  background: ${props => props.isActive ? '#005AE9' : '#333'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    background: ${props => props.isActive ? '#0047b3' : '#555'};
  }
`;

const RefreshButton = styled.button`
  position: fixed;
  z-index: 10000;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px;
  margin: 4px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s ease;
  
  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const ControlPanel = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 10000;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  pointer-events: auto;
  min-width: 240px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ControlTitle = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  color: #2c3e50;
`;

const ControlInstructions = styled.div`
  margin-bottom: 8px;
  font-size: 12px;
  color: #333;
  line-height: 1.4;
`;

const CurrentSelector = styled.div`
  margin-bottom: 8px;
  font-size: 12px;
  color: #005AE9;
  word-break: break-all;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
`;

const ControlActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ControlButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 100px;
  
  &.btn-primary {
    background: #005AE9;
    color: white;
    
    &:hover {
      background: #0047b3;
      transform: translateY(-1px);
    }
  }
  
  &.btn-secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
      transform: translateY(-1px);
    }
  }
`;

const ErrorOverlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid #ff6b6b;
  border-radius: 8px;
  padding: 20px;
  z-index: 10001;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const ErrorTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #ff6b6b;
  font-size: 1.5rem;
`;

const ErrorMessage = styled.p`
  margin: 0 0 15px 0;
  color: #333;
  line-height: 1.4;
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

// Interfaces
interface SelectorHierarchyTomesProps {
  initialSelector?: string;
  onConfirmSelector?: (selector: string) => void;
  onSelectorChange?: (selector: string) => void;
  className?: string;
  document?: Document;
  uiRoot?: ShadowRoot;
}

/**
 * Create SelectorHierarchy Tome Machine
 * 
 * Creates a ViewStateMachine using the template as a sub-machine for state management.
 * The template handles state logic, we create React views that read from template context.
 */
const createSelectorHierarchyTome = (props: SelectorHierarchyTomesProps, router?: MachineRouter) => {
  // Create template sub-machine for state management
  const templateMachine = SelectorHierarchyComponentTemplate.create({
    xstateConfig: {
      context: {
        model: {
          currentView: 'initializing',
          selector: props.initialSelector || '',
          latestSelector: null,
          activeSelectorColorPanels: [],
          htmlHierarchy: props.document || (typeof document !== 'undefined' ? document : null),
          dimmedPanels: [],
          confirmed: false,
          refreshKey: 0,
          error: null,
          mainElements: [],
          selection: null,
          panelState: 'idle',
          hierarchyDepth: 0,
          selectedElements: new Set(),
          excludedElements: new Set(),
          colorScheme: 'default',
          panelSize: 'medium',
          autoConfirm: false,
          showDebugInfo: false
        }
      }
    }
  });

  // Start template machine
  if (templateMachine && typeof templateMachine.start === 'function') {
    templateMachine.start();
    // Initialize
    templateMachine.send({ type: 'HIERARCHY_READY', document: props.document || document });
  }

  // Set router on template machine
  if (router && templateMachine && typeof (templateMachine as any).setRouter === 'function') {
    (templateMachine as any).setRouter(router);
    router.register('SelectorHierarchyComponent', templateMachine);
  }

  return templateMachine;
};

// React view renderers that read from template machine context
const renderReactView = (machine: any, props: SelectorHierarchyTomesProps): React.ReactNode => {
  // Get current state and model from template machine
  const machineAny = machine as { machine?: { state?: { value?: string; context?: any } } };
  const currentState = machineAny?.machine?.state?.value || 'initializing';
  const context = machineAny?.machine?.state?.context || {};
  const model = context.model || {};
  
  const {
    selector = props.initialSelector || '',
    error = null,
    selectedElements = new Set(),
    excludedElements = new Set(),
    activeSelectorColorPanels = [],
    dimmedPanels = [],
    colorScheme = 'default',
    mainElements = [],
    hierarchyDepth = 0,
    showDebugInfo = false
  } = model;

  // Generate panel data using shared utilities
  const activePanels: ColorPanelData[] = createColorPanelData(
    selectedElements as Set<HTMLElement>, 
    colorScheme, 
    false
  );

  const dimmedPanelsData: ColorPanelData[] = createColorPanelData(
    excludedElements as Set<HTMLElement>, 
    colorScheme, 
    true
  );

  // Event handlers that send to machine
  const handleElementClick = (element: HTMLElement, action: 'add' | 'remove' | 'exclude') => {
    machine.send({
      type: 'ELEMENTS_SELECTED',
      elements: [element],
      action
    });
  };

  const handleConfirmSelector = () => {
    const machineAny = machine as any;
    const currentState = machineAny?.machine?.state?.value;
    const context = machineAny?.machine?.state?.context || {};
    const selector = context.model?.selector || '';
    
    // Send CONFIRMED event if in confirmation state, otherwise transition there first
    if (currentState === 'confirmation') {
      machine.send({ type: 'CONFIRMED' });
    } else if (currentState === 'selector-building' || currentState === 'validation') {
      // Transition to confirmation state first
      machine.send({ type: 'VALIDATION_PASSED' });
    } else {
      // Try to build selector first
      machine.send({ type: 'SELECTOR_BUILD' });
    }
    
    props.onConfirmSelector?.(selector);
  };

  const handleDeactivate = () => {
    // Send RESET event to restart (moves to 'initializing' state)
    machine.send({ type: 'RESET' });
  };

  const handleRefresh = () => {
    // Send RESET event to restart the component
    machine.send({ type: 'RESET' });
  };

  const handleRetry = () => {
    machine.send({ type: 'RETRY' });
  };

  // Render based on template machine state
  if (currentState === 'initializing') {
    return (
      <SelectorHierarchyContainer className={props.className}>
        <div className="selector-hierarchy-initializing">
          <div className="initialization-header">
            <h3>🔍 Initializing Selector Hierarchy</h3>
            <div className="spinner"></div>
          </div>
          <div className="initialization-content">
            <p>Analyzing DOM structure...</p>
            <p>Preparing element selection interface...</p>
            <p>Setting up color schemes and panels...</p>
          </div>
          <div className="initialization-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '25%' }}></div>
            </div>
            <span className="progress-text">25% Complete</span>
          </div>
        </div>
      </SelectorHierarchyContainer>
    );
  }

  if (currentState === 'error-recovery') {
    return (
      <SelectorHierarchyContainer className={props.className}>
        <ErrorOverlay>
          <ErrorTitle>⚠️ Selector Error</ErrorTitle>
          <ErrorMessage>{error || 'Unknown error occurred'}</ErrorMessage>
          <ErrorActions>
            <ControlButton onClick={handleRetry}>🔄 Retry</ControlButton>
            <ControlButton className="btn-secondary" onClick={handleDeactivate}>❌ Close</ControlButton>
          </ErrorActions>
        </ErrorOverlay>
      </SelectorHierarchyContainer>
    );
  }

  if (currentState === 'completed') {
    return null; // Component is done
  }

  // Main hierarchy interface view (for hierarchy-analysis, element-selection, etc.)
  return (
    <SelectorHierarchyContainer className={props.className}>
      {/* Single refresh button */}
      <RefreshButton style={{ top: 10, right: 10 }} onClick={handleRefresh}>⟳</RefreshButton>
      
      {/* Color panels overlay */}
      <HierarchyOverlay>
        {activePanels.map((panel, index) => (
          <ColorPanel
            key={`active-${index}-${panel.element}`}
            isActive={true}
            color={panel.color}
            rect={panel.rect}
            onClick={() => handleElementClick(panel.element, 'remove')}
          >
            <PanelButton isActive={true}>-</PanelButton>
          </ColorPanel>
        ))}
        {dimmedPanelsData.map((panel, index) => (
          <ColorPanel
            key={`dimmed-${index}-${panel.element}`}
            isActive={false}
            color={panel.color}
            rect={panel.rect}
            onClick={() => handleElementClick(panel.element, 'add')}
          >
            <PanelButton isActive={false}>+</PanelButton>
          </ColorPanel>
        ))}
      </HierarchyOverlay>
      
      {/* Control panel */}
      <ControlPanel>
        <ControlTitle>Selector Mode</ControlTitle>
        <ControlInstructions>
          Click + to add, - to remove. Click ⟳ to refresh.
        </ControlInstructions>
        <CurrentSelector>
          {selector || 'No selector yet'}
        </CurrentSelector>
        <ControlActions>
          <ControlButton className="btn-primary" onClick={handleConfirmSelector}>
            Confirm
          </ControlButton>
          <ControlButton className="btn-secondary" onClick={handleDeactivate}>
            Deactivate Selector Mode
          </ControlButton>
        </ControlActions>
      </ControlPanel>
    </SelectorHierarchyContainer>
  );
};

// Main component using ViewStateMachine pattern
const SelectorHierarchyTomes: FunctionComponent<SelectorHierarchyTomesProps> = ({
  initialSelector = '',
  onConfirmSelector,
  onSelectorChange,
  className,
  document: propDocument,
  uiRoot
}) => {
  // Machine and rendering state
  const [machine, setMachine] = useState<any>(null);
  const [renderKey, setRenderKey] = useState(-1);
  const [router, setRouter] = useState<MachineRouter | null>(null);

  // Initialize machine
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Get router from AppTome
        const appTomeRouter = AppTome.getRouter();
        setRouter(appTomeRouter);
        
        // Create machine instance
        const tomeMachine = createSelectorHierarchyTome({
          initialSelector,
          onConfirmSelector,
          onSelectorChange,
          className,
          document: propDocument,
          uiRoot
        }, appTomeRouter);
        
        setMachine(tomeMachine);
        
        // Observe view key changes for re-renders
        let unsubscribe: (() => void) | null = null;
        const machineAny = tomeMachine as any;
        if (machineAny && typeof machineAny.observeViewKey === 'function') {
          unsubscribe = machineAny.observeViewKey(setRenderKey);
        } else {
          // Fallback: subscribe to machine state changes
          const subscription = tomeMachine.subscribe?.((state: any) => {
            setRenderKey(prev => prev + 1);
          });
          if (subscription && typeof subscription === 'function') {
            unsubscribe = subscription;
          } else if (subscription && typeof subscription === 'object' && 'unsubscribe' in subscription) {
            unsubscribe = () => (subscription as any).unsubscribe();
          }
        }
        
        console.log('🔍 SelectorHierarchyTomes: Machine initialized');
        
        // Cleanup
        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
          if (appTomeRouter && tomeMachine) {
            appTomeRouter.unregister('SelectorHierarchyComponent');
          }
        };
      } catch (error) {
        console.error('Failed to initialize machine:', error);
      }
    };

    initializeComponent();
  }, [initialSelector]);

  // Render using machine
  if (!machine) {
    return (
      <EditorWrapper
        title="Selector Hierarchy"
        description="Hierarchical view of CSS selectors and their relationships"
        componentId="selector-hierarchy-component"
        router={router || undefined}
        onError={(error) => console.error('SelectorHierarchy Editor Error:', error)}
      >
        <div>Loading selector hierarchy...</div>
      </EditorWrapper>
    );
  }

  // Render React view from machine state
  return (
    <EditorWrapper
      title="Selector Hierarchy"
      description="Hierarchical view of CSS selectors and their relationships"
      componentId="selector-hierarchy-component"
      router={router || undefined}
      key={renderKey}
      onError={(error) => console.error('SelectorHierarchy Editor Error:', error)}
    >
      {renderReactView(machine, {
        initialSelector,
        onConfirmSelector,
        onSelectorChange,
        className,
        document: propDocument,
        uiRoot
      })}
    </EditorWrapper>
  );
};

export default SelectorHierarchyTomes;
