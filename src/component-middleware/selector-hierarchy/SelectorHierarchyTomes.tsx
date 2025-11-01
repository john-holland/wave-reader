import React, { FunctionComponent, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { MachineRouter } from 'log-view-machine';
import EditorWrapper from '../../app/components/EditorWrapper';
import { AppTome } from '../../app/tomes/AppTome';

// Simple message handler for selector hierarchy
class SelectorHierarchyMessageHandler {
    private handlers: Map<string, Function>;
    
    constructor() {
        this.handlers = new Map();
    }
    
    registerHandler(type: string, handler: Function) {
        this.handlers.set(type, handler);
    }
    
    async sendMessage(type: string, data: any) {
        const handler = this.handlers.get(type);
        if (handler) {
            return await handler(data);
        }
        return null;
    }
}

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
interface ColorPanelData {
  element: HTMLElement;
  color: string;
  selector: string;
  rect: DOMRect;
}

interface HierarchyState {
  currentView: 'initializing' | 'hierarchy-analysis' | 'element-selection' | 'panel-creation' | 'selector-building' | 'validation' | 'confirmation' | 'hierarchy-exploration' | 'panel-management' | 'error-recovery' | 'debug-mode' | 'completed';
  selector: string;
  latestSelector: any;
  activeSelectorColorPanels: ColorPanelData[];
  htmlHierarchy: Document | null;
  dimmedPanels: ColorPanelData[];
  confirmed: boolean;
  refreshKey: number;
  error: string | null;
  mainElements: HTMLElement[];
  selection: any;
  panelState: 'idle' | 'creating' | 'ready' | 'error';
  hierarchyDepth: number;
  selectedElements: Set<HTMLElement>;
  excludedElements: Set<HTMLElement>;
  colorScheme: 'default' | 'warm' | 'cool';
  panelSize: 'small' | 'medium' | 'large';
  autoConfirm: boolean;
  showDebugInfo: boolean;
}

interface SelectorHierarchyTomesProps {
  initialSelector?: string;
  onConfirmSelector?: (selector: string) => void;
  onSelectorChange?: (selector: string) => void;
  className?: string;
  document?: Document;
  uiRoot?: ShadowRoot;
}

// Main component using withState pattern
const SelectorHierarchyTomes: FunctionComponent<SelectorHierarchyTomesProps> = ({
  initialSelector = '',
  onConfirmSelector,
  onSelectorChange,
  className,
  document: propDocument,
  uiRoot
}) => {
  // State management using withState pattern
  const [currentView, setCurrentView] = useState<HierarchyState['currentView']>('initializing');
  const [selector, setSelector] = useState(initialSelector);
  const [latestSelector, setLatestSelector] = useState<any>(null);
  const [activeSelectorColorPanels, setActiveSelectorColorPanels] = useState<ColorPanelData[]>([]);
  const [htmlHierarchy, setHtmlHierarchy] = useState<Document | null>(propDocument || document);
  const [dimmedPanels, setDimmedPanels] = useState<ColorPanelData[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mainElements, setMainElements] = useState<HTMLElement[]>([]);
  const [selection, setSelection] = useState<any>(null);
  const [panelState, setPanelState] = useState<'idle' | 'creating' | 'ready' | 'error'>('idle');
  const [hierarchyDepth, setHierarchyDepth] = useState(0);
  const [selectedElements, setSelectedElements] = useState<Set<HTMLElement>>(new Set());
  const [excludedElements, setExcludedElements] = useState<Set<HTMLElement>>(new Set());
  const [colorScheme, setColorScheme] = useState<'default' | 'warm' | 'cool'>('default');
  const [panelSize, setPanelSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [router, setRouter] = useState<MachineRouter | null>(null);
  
  // Refs
  const messageHandlerRef = useRef<SelectorHierarchyMessageHandler | null>(null);
  const isExtensionRef = useRef(false);

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Get router from AppTome
        const appTomeRouter = AppTome.getRouter();
        setRouter(appTomeRouter);
        
        // Check if we're running in a Chrome extension context
        const extensionContext = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
        isExtensionRef.current = Boolean(extensionContext);

        if (extensionContext) {
          // Initialize Chrome extension message handler
          const handler = new SelectorHierarchyMessageHandler();
          messageHandlerRef.current = handler;
          
          // Register message handlers
          handler.registerHandler('HIERARCHY_READY', handleHierarchyReady);
          handler.registerHandler('ELEMENTS_SELECTED', handleElementsSelected);
          handler.registerHandler('PANELS_CREATED', handlePanelsCreated);
          handler.registerHandler('ERROR_OCCURRED', handleErrorOccurred);
          
          // Initialize hierarchy
          await initializeHierarchy();
        } else {
          // Non-extension context, initialize directly
          await initializeHierarchy();
        }
        
        console.log('🔍 SelectorHierarchyTomes: Initialized');
        
      } catch (error) {
        console.error('Failed to initialize component:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setCurrentView('error-recovery');
      }
    };

    initializeComponent();
  }, []);

  // Initialize hierarchy
  const initializeHierarchy = useCallback(async () => {
    try {
      setCurrentView('initializing');
      setError(null);
      
      const doc = htmlHierarchy || document;
      
      // Get main elements
      const allElements = Array.from(doc.querySelectorAll("body *"));
      const filteredElements = allElements.filter(el => isMainElement(el as HTMLElement)) as HTMLElement[];
      
      setMainElements(filteredElements);
      setHierarchyDepth(calculateHierarchyDepth(doc.body));
      
      // Move to hierarchy analysis
      setCurrentView('hierarchy-analysis');
      
      // Auto-advance to element selection after a brief delay
      setTimeout(() => {
        setCurrentView('element-selection');
      }, 1000);
      
    } catch (error) {
      console.error('Failed to initialize hierarchy:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setCurrentView('error-recovery');
    }
  }, [htmlHierarchy]);

  // Helper functions
  const isMainElement = useCallback((el: HTMLElement) => {
    if (!el.offsetParent) return false;
    
    const rect = el.getBoundingClientRect();
    const docWidth = window.innerWidth;
    const docHeight = document.documentElement.scrollHeight;
    
    // Exclude elements that are nearly the full page
    const isNearlyFullWidth = rect.width > 0.98 * docWidth;
    const isNearlyFullHeight = rect.height > 0.95 * docHeight;
    if (isNearlyFullWidth && isNearlyFullHeight) return false;
    
    // Exclude obvious non-content elements
    const excludedTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'META', 'LINK', 'TITLE'];
    if (excludedTags.includes(el.tagName)) return false;
    
    // Basic size requirements
    if (rect.width < 20 || rect.height < 10) return false;
    
    return true;
  }, []);

  const calculateHierarchyDepth = useCallback((element: Element, currentDepth = 0): number => {
    let maxDepth = currentDepth;
    
    for (const child of element.children) {
      const childDepth = calculateHierarchyDepth(child, currentDepth + 1);
      maxDepth = Math.max(maxDepth, childDepth);
    }
    
    return maxDepth;
  }, []);

  const generateSelector = useCallback((element: HTMLElement): string => {
    let selector = element.tagName.toLowerCase();
    
    if (element.id) {
      selector += '#' + element.id;
    } else if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        selector += '.' + classes.join('.');
      }
    }
    
    // Add nth-child if needed
    if (element.parentElement) {
      const siblings = Array.from(element.parentElement.children);
      const index = siblings.indexOf(element) + 1;
      if (index > 1) {
        selector += `:nth-child(${index})`;
      }
    }
    
    return selector;
  }, []);

  const generateColor = useCallback((index: number, scheme: string): string => {
    const colors = {
      default: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
      warm: ['#ff6b6b', '#ff8e53', '#ffc75f', '#f9f871', '#ff6b9d'],
      cool: ['#4ecdc4', '#45b7d1', '#96ceb4', '#dda0dd', '#98d8c8']
    };
    
    const colorSet = colors[scheme as keyof typeof colors] || colors.default;
    return colorSet[index % colorSet.length];
  }, []);

  // Event handlers
  const handleHierarchyReady = useCallback((data: any) => {
    console.log('🔍 SelectorHierarchyTomes: Hierarchy ready:', data);
    setCurrentView('hierarchy-analysis');
  }, []);

  const handleElementsSelected = useCallback((data: any) => {
    console.log('🔍 SelectorHierarchyTomes: Elements selected:', data);
    // Handle element selection updates
  }, []);

  const handlePanelsCreated = useCallback((data: any) => {
    console.log('🔍 SelectorHierarchyTomes: Panels created:', data);
    setPanelState('ready');
  }, []);

  const handleErrorOccurred = useCallback((data: any) => {
    console.log('🔍 SelectorHierarchyTomes: Error occurred:', data);
    setError(data.message);
    setCurrentView('error-recovery');
  }, []);

  const handleElementClick = useCallback((element: HTMLElement, action: 'add' | 'remove' | 'exclude') => {
    try {
      if (action === 'add') {
        setSelectedElements(prev => new Set([...prev, element]));
        setExcludedElements(prev => {
          const newSet = new Set(prev);
          newSet.delete(element);
          return newSet;
        });
      } else if (action === 'remove') {
        setSelectedElements(prev => {
          const newSet = new Set(prev);
          newSet.delete(element);
          return newSet;
        });
      } else if (action === 'exclude') {
        setExcludedElements(prev => new Set([...prev, element]));
        setSelectedElements(prev => {
          const newSet = new Set(prev);
          newSet.delete(element);
          return newSet;
        });
      }
      
      // Update selector
      updateSelectorFromSelections();
      
    } catch (error) {
      console.error('Failed to handle element click:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, []);

  const updateSelectorFromSelections = useCallback(() => {
    try {
      const selectorParts = Array.from(selectedElements).map(el => generateSelector(el));
      const newSelector = selectorParts.join(', ');
      
      setSelector(newSelector);
      
      if (onSelectorChange) {
        onSelectorChange(newSelector);
      }
      
    } catch (error) {
      console.error('Failed to update selector:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [selectedElements, generateSelector, onSelectorChange]);

  const handleRefresh = useCallback(() => {
    console.log('🔍 SelectorHierarchyTomes: Refreshing panels');
    
    try {
      setRefreshKey(prev => prev + 1);
      setError(null);
      
      // Re-initialize hierarchy
      initializeHierarchy();
      
    } catch (error) {
      console.error('Failed to refresh:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [initializeHierarchy]);

  const handleConfirmSelector = useCallback(() => {
    console.log('🔍 SelectorHierarchyTomes: Confirming selector:', selector);
    
    try {
      if (onConfirmSelector) {
        onConfirmSelector(selector);
      }
      
      setConfirmed(true);
      setCurrentView('completed');
      
    } catch (error) {
      console.error('Failed to confirm selector:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [selector, onConfirmSelector]);

  const handleDeactivate = useCallback(() => {
    console.log('🔍 SelectorHierarchyTomes: Deactivating selector mode');
    
    try {
      setConfirmed(true);
      setCurrentView('completed');
      
    } catch (error) {
      console.error('Failed to deactivate:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, []);

  const handleRetry = useCallback(() => {
    console.log('🔍 SelectorHierarchyTomes: Retrying operation');
    
    try {
      setError(null);
      setCurrentView('element-selection');
      
    } catch (error) {
      console.error('Failed to retry:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, []);

  // Memoized values
  const activePanels = useMemo(() => {
    return Array.from(selectedElements).map((el, index) => ({
      element: el,
      color: generateColor(index, colorScheme),
      selector: generateSelector(el),
      rect: el.getBoundingClientRect()
    }));
  }, [selectedElements, generateColor, colorScheme, generateSelector]);

  const dimmedPanelsData = useMemo(() => {
    return Array.from(excludedElements).map((el, index) => ({
      element: el,
      color: generateColor(index, colorScheme) + '40', // Add transparency
      selector: generateSelector(el),
      rect: el.getBoundingClientRect()
    }));
  }, [excludedElements, generateColor, colorScheme, generateSelector]);

  // Update panels when selections change
  useEffect(() => {
    setActiveSelectorColorPanels(activePanels);
    setDimmedPanels(dimmedPanelsData);
  }, [activePanels, dimmedPanelsData]);

  // Auto-confirm if enabled
  useEffect(() => {
    if (autoConfirm && selector && selectedElements.size > 0) {
      const timer = setTimeout(() => {
        handleConfirmSelector();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [autoConfirm, selector, selectedElements.size, handleConfirmSelector]);

  // Render different views based on currentView
  if (currentView === 'initializing') {
    return (
      <SelectorHierarchyContainer className={className}>
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

  if (currentView === 'error-recovery') {
    return (
      <SelectorHierarchyContainer className={className}>
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

  if (currentView === 'completed') {
    return null; // Component is done
  }

  // Render main hierarchy interface
  return (
    <EditorWrapper
      title="Selector Hierarchy"
      description="Hierarchical view of CSS selectors and their relationships"
      componentId="selector-hierarchy-component"
      useTomeArchitecture={true}
      router={router || undefined}
      onError={(error) => console.error('SelectorHierarchy Editor Error:', error)}
    >
      <SelectorHierarchyContainer className={className}>
      {/* Refresh buttons at corners */}
      <RefreshButton style={{ top: 10, left: 10 }} onClick={handleRefresh}>⟳</RefreshButton>
      <RefreshButton style={{ top: 10, right: 10 }} onClick={handleRefresh}>⟳</RefreshButton>
      <RefreshButton style={{ bottom: 10, left: 10 }} onClick={handleRefresh}>⟳</RefreshButton>
      <RefreshButton style={{ bottom: 10, right: 10 }} onClick={handleRefresh}>⟳</RefreshButton>
      
      {/* Color panels overlay */}
      <HierarchyOverlay>
        {/* Active panels for selected elements */}
        {activeSelectorColorPanels.map((panel, index) => (
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
        
        {/* Dimmed panels for excluded elements */}
        {dimmedPanels.map((panel, index) => (
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
      
      {/* Docked control panel */}
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
    </EditorWrapper>
  );
};

export default SelectorHierarchyTomes;
