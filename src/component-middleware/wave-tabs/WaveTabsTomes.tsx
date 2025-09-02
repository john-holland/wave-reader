import React, { FunctionComponent, useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { WaveTabsMessageHandler } from './robotcopy-pact-config';

// Styled components for the Tomes-based wave tabs
const WaveTabsContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const WaveTabsHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  border-radius: 8px 8px 0 0;
  text-align: center;
  
  h2 {
    margin: 0 0 8px 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const WaveTabsContent = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-radius: 0 0 8px 8px;
`;

const TabView = styled.div<{ isActive: boolean }>`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.isActive ? '#667eea' : 'transparent'};
  
  ${props => props.isActive && `
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
  `}
`;

const TabHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #dee2e6;
`;

const TabTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
`;

const TabActions = styled.div`
  display: flex;
  gap: 8px;
`;

const TabContent = styled.div`
  padding: 24px;
  min-height: 200px;
`;

const TabNavigation = styled.div`
  padding: 16px 24px;
  background: #f8f9fa;
  border-radius: 0 0 8px 8px;
  border-top: 1px solid #dee2e6;
`;

const TabNavButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 8px 16px;
  margin: 4px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  text-align: center;
  
  &.btn-primary {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #5a6fd8, #6a4c93);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
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
  
  &.btn-danger {
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #ff5252, #e53e3e);
      transform: translateY(-1px);
    }
  }
  
  &.btn-sm {
    padding: 4px 8px;
    font-size: 12px;
  }
`;

const TabManagementView = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const ManagementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e9ecef;
`;

const ManagementTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
`;

const TabList = styled.div`
  margin-bottom: 24px;
`;

const TabListTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  color: #2c3e50;
`;

const TabItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.1);
  }
`;

const TabName = styled.span`
  font-weight: 500;
  color: #495057;
`;

const TabItemActions = styled.div`
  display: flex;
  gap: 8px;
`;

const AddTabSection = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 2px dashed #dee2e6;
`;

const AddTabTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  color: #2c3e50;
`;

const TabInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TabTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TabConfigurationView = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const ConfigurationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e9ecef;
`;

const ConfigurationTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
`;

const ConfigurationOptions = styled.div`
  margin-bottom: 24px;
`;

const ConfigurationOptionsTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  color: #2c3e50;
`;

const ConfigOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
`;

const ConfigOptionLabel = styled.label`
  font-weight: 500;
  color: #495057;
`;

const ConfigOptionInput = styled.input`
  &.number {
    width: 80px;
    padding: 8px;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    text-align: center;
  }
  
  &.checkbox {
    width: 20px;
    height: 20px;
    accent-color: #667eea;
  }
`;

const ConfigurationActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

// Tab interface
interface Tab {
  id: string;
  name: string;
  content: string;
  state: Record<string, any>;
}

// Props interface
interface WaveTabsTomesProps {
  children?: React.ReactNode;
  initialTabs?: Tab[];
  maxTabs?: number;
  onTabChange?: (tabIndex: number) => void;
  onTabAdd?: (tab: Tab) => void;
  onTabRemove?: (tabId: string) => void;
  className?: string;
}

// Main component using withState pattern
const WaveTabsTomes: FunctionComponent<WaveTabsTomesProps> = ({
  children,
  initialTabs = [],
  maxTabs = 10,
  onTabChange,
  onTabAdd,
  onTabRemove,
  className
}) => {
  // State management using withState pattern
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [tabNames, setTabNames] = useState<string[]>(initialTabs.map(tab => tab.name));
  const [tabContents, setTabContents] = useState<string[]>(initialTabs.map(tab => tab.content));
  const [tabStates, setTabStates] = useState<Record<string, any>>({});
  const [tabHistory, setTabHistory] = useState<number[]>([]);
  const [currentView, setCurrentView] = useState<'tab' | 'management' | 'configuration'>('tab');
  const [messageHandler, setMessageHandler] = useState<WaveTabsMessageHandler | null>(null);
  const [isExtension, setIsExtension] = useState(false);

  // Refs
  const tabHistoryRef = useRef<number[]>([]);

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      // Check if we're running in a Chrome extension context
      const extensionContext = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
      setIsExtension(Boolean(extensionContext));

      if (extensionContext) {
        // Initialize Chrome extension message handler
        const handler = new WaveTabsMessageHandler();
        setMessageHandler(handler);
        
        // Load saved tabs from Chrome storage
        if (chrome.storage && chrome.storage.local) {
          try {
            const result = await chrome.storage.local.get(['waveReaderTabs', 'waveReaderTabConfig']);
            
            if (result.waveReaderTabs) {
              setTabs(result.waveReaderTabs);
              setTabNames(result.waveReaderTabs.map((tab: Tab) => tab.name));
              setTabContents(result.waveReaderTabs.map((tab: Tab) => tab.content));
              setTabStates(result.waveReaderTabs.reduce((acc: Record<string, any>, tab: Tab) => {
                acc[tab.id] = tab.state;
                return acc;
              }, {}));
            }
          } catch (error) {
            console.warn('Failed to load tabs from Chrome storage:', error);
          }
        }
      }
      
      console.log('📑 WaveTabsTomes: Initialized for Chrome extension context');
    };

    initializeComponent();
  }, []);

  // Handle Chrome extension messaging
  const sendExtensionMessage = async (message: any) => {
    if (!isExtension || !messageHandler) {
      console.warn('📑 WaveTabsTomes: Not in extension context or message handler not ready');
      return null;
    }

    try {
      return await messageHandler.sendMessage('background', message);
    } catch (error) {
      console.error('📑 WaveTabsTomes: Failed to send extension message:', error);
      return null;
    }
  };

  // Event handlers
  const handleTabChange = useCallback((tabIndex: number) => {
    console.log('📑 WaveTabsTomes: Switching to tab:', tabIndex);
    
    // Add to history
    const newHistory = [...tabHistory, activeTab];
    if (newHistory.length > 10) {
      newHistory.shift();
    }
    setTabHistory(newHistory);
    tabHistoryRef.current = newHistory;
    
    setActiveTab(tabIndex);
    
    // Notify parent component
    if (onTabChange) {
      onTabChange(tabIndex);
    }
  }, [activeTab, tabHistory, onTabChange]);

  const handleManageTabs = useCallback(() => {
    console.log('📑 WaveTabsTomes: Opening tab management');
    setCurrentView('management');
  }, []);

  const handleConfigureTabs = useCallback(() => {
    console.log('📑 WaveTabsTomes: Opening tab configuration');
    setCurrentView('configuration');
  }, []);

  const handleBackToTab = useCallback(() => {
    console.log('📑 WaveTabsTomes: Returning to tab view');
    setCurrentView('tab');
  }, []);

  const handleAddTab = useCallback(async (tabName: string, tabContent: string) => {
    console.log('📑 WaveTabsTomes: Adding new tab:', tabName);
    
    if (tabs.length >= maxTabs) {
      console.warn('Maximum number of tabs reached');
      return;
    }
    
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      name: tabName,
      content: tabContent,
      state: {}
    };
    
    const newTabs = [...tabs, newTab];
    setTabs(newTabs);
    setTabNames([...tabNames, tabName]);
    setTabContents([...tabContents, tabContent]);
    setTabStates({ ...tabStates, [newTab.id]: {} });
    
    // Notify parent component
    if (onTabAdd) {
      onTabAdd(newTab);
    }
    
    // Save to storage
    if (isExtension) {
      try {
        await sendExtensionMessage({
          type: 'TAB_ADDED',
          tab: newTab,
          source: 'wave-tabs',
          target: 'background',
          traceId: Date.now().toString()
        });
        
        // Save to Chrome storage
        if (chrome.storage && chrome.storage.local) {
          await chrome.storage.local.set({ waveReaderTabs: newTabs });
        }
      } catch (error) {
        console.warn('Failed to save tab to extension:', error);
      }
    }
    
    // Switch to the new tab
    handleTabChange(newTabs.length - 1);
  }, [tabs, tabNames, tabContents, tabStates, maxTabs, onTabAdd, isExtension]);

  const handleRemoveTab = useCallback(async (tabIndex: number) => {
    console.log('📑 WaveTabsTomes: Removing tab:', tabIndex);
    
    if (tabIndex >= 0 && tabIndex < tabs.length) {
      const tabToRemove = tabs[tabIndex];
      const newTabs = tabs.filter((_, index) => index !== tabIndex);
      const newTabNames = tabNames.filter((_, index) => index !== tabIndex);
      const newTabContents = tabContents.filter((_, index) => index !== tabIndex);
      
      setTabs(newTabs);
      setTabNames(newTabNames);
      setTabContents(newTabContents);
      
      // Update active tab if necessary
      if (activeTab >= newTabs.length) {
        const newActiveTab = Math.max(0, newTabs.length - 1);
        setActiveTab(newActiveTab);
        if (onTabChange) {
          onTabChange(newActiveTab);
        }
      }
      
      // Notify parent component
      if (onTabRemove) {
        onTabRemove(tabToRemove.id);
      }
      
      // Save to storage
      if (isExtension) {
        try {
          await sendExtensionMessage({
            type: 'TAB_REMOVED',
            tabId: tabToRemove.id,
            source: 'wave-tabs',
            target: 'background',
            traceId: Date.now().toString()
          });
          
          // Save to Chrome storage
          if (chrome.storage && chrome.storage.local) {
            await chrome.storage.local.set({ waveReaderTabs: newTabs });
          }
        } catch (error) {
          console.warn('Failed to remove tab from extension:', error);
        }
      }
    }
  }, [tabs, tabNames, tabContents, activeTab, onTabChange, onTabRemove, isExtension]);

  const handleSaveConfiguration = useCallback(async () => {
    console.log('📑 WaveTabsTomes: Saving tab configuration');
    
    // Save to storage
    if (isExtension) {
      try {
        await sendExtensionMessage({
          type: 'TAB_CONFIG_SAVED',
          configuration: {
            tabs,
            tabNames,
            tabContents,
            tabStates,
            maxTabs
          },
          source: 'wave-tabs',
          target: 'background',
          traceId: Date.now().toString()
        });
        
        // Save to Chrome storage
        if (chrome.storage && chrome.storage.local) {
          await chrome.storage.local.set({ 
            waveReaderTabs: tabs,
            waveReaderTabConfig: { maxTabs }
          });
        }
      } catch (error) {
        console.warn('Failed to save configuration to extension:', error);
      }
    }
    
    // Return to tab view
    setCurrentView('tab');
  }, [tabs, tabNames, tabContents, tabStates, maxTabs, isExtension]);

  const handleResetConfiguration = useCallback(async () => {
    console.log('📑 WaveTabsTomes: Resetting tab configuration');
    
    // Reset to default configuration
    setTabs([]);
    setTabNames([]);
    setTabContents([]);
    setTabStates({});
    setActiveTab(0);
    setTabHistory([]);
    
    // Save to storage
    if (isExtension) {
      try {
        await sendExtensionMessage({
          type: 'TAB_CONFIG_RESET',
          source: 'wave-tabs',
          target: 'background',
          traceId: Date.now().toString()
        });
        
        // Clear Chrome storage
        if (chrome.storage && chrome.storage.local) {
          await chrome.storage.local.remove(['waveReaderTabs', 'waveReaderTabConfig']);
        }
      } catch (error) {
        console.warn('Failed to reset configuration in extension:', error);
      }
    }
    
    // Return to tab view
    setCurrentView('tab');
  }, [isExtension]);

  // Render management view
  if (currentView === 'management') {
    return (
      <WaveTabsContainer className={className}>
        <WaveTabsHeader>
          <h2>⚙️ Tab Management</h2>
          <p>Manage your tabs and content</p>
        </WaveTabsHeader>
        
        <WaveTabsContent>
          <TabManagementView>
            <ManagementHeader>
              <ManagementTitle>Tab Management</ManagementTitle>
              <Button className="btn btn-primary" onClick={handleBackToTab}>
                ← Back to Tab
              </Button>
            </ManagementHeader>
            
            <TabList>
              <TabListTitle>Current Tabs:</TabListTitle>
              {tabs.map((tab, index) => (
                <TabItem key={tab.id}>
                  <TabName>{tab.name}</TabName>
                  <TabItemActions>
                    <Button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleTabChange(index)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveTab(index)}
                    >
                      🗑️ Remove
                    </Button>
                  </TabItemActions>
                </TabItem>
              ))}
            </TabList>
            
            <AddTabSection>
              <AddTabTitle>Add New Tab:</AddTabTitle>
              <TabInput
                id="newTabName"
                placeholder="Tab name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const nameInput = e.target as HTMLInputElement;
                    const contentInput = document.getElementById('newTabContent') as HTMLTextAreaElement;
                    if (nameInput.value.trim()) {
                      handleAddTab(nameInput.value.trim(), contentInput?.value || '');
                      nameInput.value = '';
                      if (contentInput) contentInput.value = '';
                    }
                  }
                }}
              />
              <TabTextarea
                id="newTabContent"
                placeholder="Tab content"
              />
              <Button 
                className="btn btn-primary"
                onClick={() => {
                  const nameInput = document.getElementById('newTabName') as HTMLInputElement;
                  const contentInput = document.getElementById('newTabContent') as HTMLTextAreaElement;
                  if (nameInput.value.trim()) {
                    handleAddTab(nameInput.value.trim(), contentInput?.value || '');
                    nameInput.value = '';
                    if (contentInput) contentInput.value = '';
                  }
                }}
              >
                ➕ Add Tab
              </Button>
            </AddTabSection>
          </TabManagementView>
        </WaveTabsContent>
      </WaveTabsContainer>
    );
  }

  // Render configuration view
  if (currentView === 'configuration') {
    return (
      <WaveTabsContainer className={className}>
        <WaveTabsHeader>
          <h2>🔧 Tab Configuration</h2>
          <p>Configure tab settings and preferences</p>
        </WaveTabsHeader>
        
        <WaveTabsContent>
          <TabConfigurationView>
            <ConfigurationHeader>
              <ConfigurationTitle>Tab Configuration</ConfigurationTitle>
              <Button className="btn btn-primary" onClick={handleBackToTab}>
                ← Back to Tab
              </Button>
            </ConfigurationHeader>
            
            <ConfigurationOptions>
              <ConfigurationOptionsTitle>General Settings:</ConfigurationOptionsTitle>
              <ConfigOption>
                <ConfigOptionLabel>Maximum Tabs:</ConfigOptionLabel>
                <ConfigOptionInput
                  type="number"
                  className="number"
                  value={maxTabs}
                  min={1}
                  max={20}
                  onChange={(e) => {
                    // This would update the maxTabs state
                    console.log('Max tabs changed to:', e.target.value);
                  }}
                />
              </ConfigOption>
              
              <ConfigOption>
                <ConfigOptionLabel>Save Tab History:</ConfigOptionLabel>
                <ConfigOptionInput
                  type="checkbox"
                  className="checkbox"
                  checked={tabHistory.length > 0}
                  onChange={(e) => {
                    // This would toggle history saving
                    console.log('History saving toggled:', e.target.checked);
                  }}
                />
              </ConfigOption>
              
              <ConfigOption>
                <ConfigOptionLabel>Auto-save Configuration:</ConfigOptionLabel>
                <ConfigOptionInput
                  type="checkbox"
                  className="checkbox"
                  defaultChecked
                  onChange={(e) => {
                    // This would toggle auto-save
                    console.log('Auto-save toggled:', e.target.checked);
                  }}
                />
              </ConfigOption>
            </ConfigurationOptions>
            
            <ConfigurationActions>
              <Button className="btn btn-primary" onClick={handleSaveConfiguration}>
                💾 Save Configuration
              </Button>
              <Button className="btn btn-secondary" onClick={handleResetConfiguration}>
                🔄 Reset to Defaults
              </Button>
            </ConfigurationActions>
          </TabConfigurationView>
        </WaveTabsContent>
      </WaveTabsContainer>
    );
  }

  // Render main tab view
  return (
    <WaveTabsContainer className={className}>
      <WaveTabsHeader>
        <h2>📑 Wave Tabs</h2>
        <p>Manage your content with tabs</p>
      </WaveTabsHeader>
      
      <WaveTabsContent>
        {/* Render children if provided, otherwise fall back to internal tab management */}
        {children ? (
          <div className="wave-tabs-children">
            {children}
          </div>
        ) : tabs.length === 0 ? (
          <TabView isActive={false}>
            <TabHeader>
              <TabTitle>No Tabs Available</TabTitle>
              <TabActions>
                <Button className="btn btn-secondary" onClick={handleManageTabs}>
                  ⚙️ Manage Tabs
                </Button>
                <Button className="btn btn-secondary" onClick={handleConfigureTabs}>
                  🔧 Configure
                </Button>
              </TabActions>
            </TabHeader>
            <TabContent>
              <p>No tabs configured yet. Use the management view to add your first tab.</p>
            </TabContent>
          </TabView>
        ) : (
          <TabView isActive={true}>
            <TabHeader>
              <TabTitle>{tabs[activeTab]?.name || `Tab ${activeTab + 1}`}</TabTitle>
              <TabActions>
                <Button className="btn btn-secondary" onClick={handleManageTabs}>
                  ⚙️ Manage Tabs
                </Button>
                <Button className="btn btn-secondary" onClick={handleConfigureTabs}>
                  🔧 Configure
                </Button>
              </TabActions>
            </TabHeader>
            
            <TabContent>
              {tabs[activeTab]?.content || <p>No content available for this tab</p>}
            </TabContent>
            
            <TabNavigation>
              <TabNavButtons>
                {activeTab > 0 && (
                  <Button 
                    className="btn btn-secondary"
                    onClick={() => handleTabChange(activeTab - 1)}
                  >
                    ← Previous
                  </Button>
                )}
                
                {tabs.map((tab, index) => (
                  <Button
                    key={tab.id}
                    className={`btn ${index === activeTab ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleTabChange(index)}
                  >
                    {tab.name}
                  </Button>
                ))}
                
                {activeTab < tabs.length - 1 && (
                  <Button 
                    className="btn btn-secondary"
                    onClick={() => handleTabChange(activeTab + 1)}
                  >
                    Next →
                  </Button>
                )}
              </TabNavButtons>
            </TabNavigation>
          </TabView>
        )}
      </WaveTabsContent>
    </WaveTabsContainer>
  );
};

export default WaveTabsTomes;
