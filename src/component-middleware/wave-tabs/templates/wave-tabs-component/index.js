/**
 * Wave Tabs Component Template
 * 
 * A template for a tabbed interface component using withState for state management
 * with separate views for each tab state and routing support.
 */

import { createViewStateMachine } from 'log-view-machine';

const WaveTabsComponentTemplate = {
  id: 'wave-tabs-component',
  name: 'Wave Tabs Component',
  description: 'Tabbed interface with state management and separate views for each tab',
  version: '1.0.0',
  dependencies: ['log-view-machine'],
  
  // Template configuration
  config: {
    machineId: 'wave-tabs-component',
    xstateConfig: {
      id: 'wave-tabs-component',
      initial: 'tab-0',
      context: {
        activeTab: 0,
        tabs: [],
        tabNames: [],
        tabContents: [],
        tabStates: {},
        tabHistory: [],
        maxTabs: 10
      }
    }
  },

  // Create the template instance
  create: (config = {}) => {
    return createViewStateMachine({
      machineId: 'wave-tabs-component',
      xstateConfig: {
        ...WaveTabsComponentTemplate.config.xstateConfig,
        ...config.xstateConfig
      },
      logStates: {
        'tab-0': async (context) => {
          await context.log('Displaying tab 0');
          return context.view(renderTabView(context, 0));
        },
        
        'tab-1': async (context) => {
          await context.log('Displaying tab 1');
          return context.view(renderTabView(context, 1));
        },
        
        'tab-2': async (context) => {
          await context.log('Displaying tab 2');
          return context.view(renderTabView(context, 2));
        },
        
        'tab-3': async (context) => {
          await context.log('Displaying tab 3');
          return context.view(renderTabView(context, 3));
        },
        
        'tab-4': async (context) => {
          await context.log('Displaying tab 4');
          return context.view(renderTabView(context, 4));
        },
        
        'tab-5': async (context) => {
          await context.log('Displaying tab 5');
          return context.view(renderTabView(context, 5));
        },
        
        'tab-6': async (context) => {
          await context.log('Displaying tab 6');
          return context.view(renderTabView(context, 6));
        },
        
        'tab-7': async (context) => {
          await context.log('Displaying tab 7');
          return context.view(renderTabView(context, 7));
        },
        
        'tab-8': async (context) => {
          await context.log('Displaying tab 8');
          return context.view(renderTabView(context, 8));
        },
        
        'tab-9': async (context) => {
          await context.log('Displaying tab 9');
          return context.view(renderTabView(context, 9));
        },
        
        'tab-management': async (context) => {
          await context.log('Displaying tab management view');
          return context.view(renderTabManagementView(context));
        },
        
        'tab-configuration': async (context) => {
          await context.log('Displaying tab configuration view');
          return context.view(renderTabConfigurationView(context));
        }
      },
      
      // State machine configuration
      states: {
        'tab-0': {
          on: {
            SWITCH_TAB: [
              { target: 'tab-1', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-2', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-3', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-4', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-5', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-6', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-7', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-8', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-9', cond: 'isValidTab', actions: ['switchTab'] }
            ],
            MANAGE_TABS: { target: 'tab-management' },
            CONFIGURE_TABS: { target: 'tab-configuration' }
          }
        },
        
        'tab-1': {
          on: {
            SWITCH_TAB: [
              { target: 'tab-0', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-2', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-3', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-4', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-5', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-6', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-7', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-8', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-9', cond: 'isValidTab', actions: ['switchTab'] }
            ],
            MANAGE_TABS: { target: 'tab-management' },
            CONFIGURE_TABS: { target: 'tab-configuration' }
          }
        },
        
        'tab-2': {
          on: {
            SWITCH_TAB: [
              { target: 'tab-0', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-1', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-3', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-4', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-5', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-6', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-7', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-8', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-9', cond: 'isValidTab', actions: ['switchTab'] }
            ],
            MANAGE_TABS: { target: 'tab-management' },
            CONFIGURE_TABS: { target: 'tab-configuration' }
          }
        },
        
        'tab-3': {
          on: {
            SWITCH_TAB: [
              { target: 'tab-0', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-1', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-2', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-4', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-5', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-6', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-7', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-8', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-9', cond: 'isValidTab', actions: ['switchTab'] }
            ],
            MANAGE_TABS: { target: 'tab-management' },
            CONFIGURE_TABS: { target: 'tab-configuration' }
          }
        },
        
        'tab-4': {
          on: {
            SWITCH_TAB: [
              { target: 'tab-0', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-1', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-2', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-3', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-5', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-6', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-7', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-8', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-9', cond: 'isValidTab', actions: ['switchTab'] }
            ],
            MANAGE_TABS: { target: 'tab-management' },
            CONFIGURE_TABS: { target: 'tab-configuration' }
          }
        },
        
        'tab-5': {
          on: {
            SWITCH_TAB: [
              { target: 'tab-0', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-1', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-2', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-3', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-4', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-6', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-7', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-8', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-9', cond: 'isValidTab', actions: ['switchTab'] }
            ],
            MANAGE_TABS: { target: 'tab-management' },
            CONFIGURE_TABS: { target: 'tab-configuration' }
          }
        },
        
        'tab-6': {
          on: {
            SWITCH_TAB: [
              { target: 'tab-0', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-1', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-2', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-3', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-4', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-5', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-7', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-8', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-9', cond: 'isValidTab', actions: ['switchTab'] }
            ],
            MANAGE_TABS: { target: 'tab-management' },
            CONFIGURE_TABS: { target: 'tab-configuration' }
          }
        },
        
        'tab-7': {
          on: {
            SWITCH_TAB: [
              { target: 'tab-0', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-1', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-2', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-3', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-4', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-5', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-6', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-8', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-9', cond: 'isValidTab', actions: ['switchTab'] }
            ],
            MANAGE_TABS: { target: 'tab-management' },
            CONFIGURE_TABS: { target: 'tab-configuration' }
          }
        },
        
        'tab-8': {
          on: {
            SWITCH_TAB: [
              { target: 'tab-0', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-1', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-2', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-3', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-4', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-5', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-6', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-7', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-9', cond: 'isValidTab', actions: ['switchTab'] }
            ],
            MANAGE_TABS: { target: 'tab-management' },
            CONFIGURE_TABS: { target: 'tab-configuration' }
          }
        },
        
        'tab-9': {
          on: {
            SWITCH_TAB: [
              { target: 'tab-0', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-1', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-2', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-3', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-4', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-5', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-6', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-7', cond: 'isValidTab', actions: ['switchTab'] },
              { target: 'tab-8', cond: 'isValidTab', actions: ['switchTab'] }
            ],
            MANAGE_TABS: { target: 'tab-management' },
            CONFIGURE_TABS: { target: 'tab-configuration' }
          }
        },
        
        'tab-management': {
          on: {
            BACK_TO_TAB: { target: 'tab-0', actions: ['restoreActiveTab'] },
            ADD_TAB: { actions: ['addTab'] },
            REMOVE_TAB: { actions: ['removeTab'] },
            REORDER_TABS: { actions: ['reorderTabs'] }
          }
        },
        
        'tab-configuration': {
          on: {
            BACK_TO_TAB: { target: 'tab-0', actions: ['restoreActiveTab'] },
            SAVE_CONFIG: { actions: ['saveTabConfiguration'] },
            RESET_CONFIG: { actions: ['resetTabConfiguration'] }
          }
        }
      },
      
      // Guards
      guards: {
        isValidTab: (context, event) => {
          const targetTab = parseInt(event.targetTab);
          return targetTab >= 0 && targetTab < context.model.tabs.length;
        }
      },
      
      // Actions
      actions: {
        switchTab: async (context, event) => {
          await context.log('Switching to tab:', event.targetTab);
          const targetTab = parseInt(event.targetTab);
          
          // Add to history
          context.model.tabHistory.push(context.model.activeTab);
          if (context.model.tabHistory.length > 10) {
            context.model.tabHistory.shift();
          }
          
          context.model.activeTab = targetTab;
          
          // Notify parent component
          if (context.model.onTabChange) {
            context.model.onTabChange(targetTab);
          }
        },
        
        restoreActiveTab: async (context) => {
          await context.log('Restoring active tab');
          // This will transition back to the appropriate tab state
        },
        
        addTab: async (context, event) => {
          await context.log('Adding new tab');
          const newTab = {
            id: `tab-${context.model.tabs.length}`,
            name: event.tabName || `Tab ${context.model.tabs.length + 1}`,
            content: event.tabContent || '',
            state: event.tabState || {}
          };
          
          context.model.tabs.push(newTab);
          context.model.tabNames.push(newTab.name);
          context.model.tabContents.push(newTab.content);
          context.model.tabStates[newTab.id] = newTab.state;
        },
        
        removeTab: async (context, event) => {
          await context.log('Removing tab:', event.tabIndex);
          const tabIndex = event.tabIndex;
          
          if (tabIndex >= 0 && tabIndex < context.model.tabs.length) {
            context.model.tabs.splice(tabIndex, 1);
            context.model.tabNames.splice(tabIndex, 1);
            context.model.tabContents.splice(tabIndex, 1);
            
            // Update active tab if necessary
            if (context.model.activeTab >= context.model.tabs.length) {
              context.model.activeTab = Math.max(0, context.model.tabs.length - 1);
            }
          }
        },
        
        reorderTabs: async (context, event) => {
          await context.log('Reordering tabs');
          const { fromIndex, toIndex } = event;
          
          if (fromIndex >= 0 && fromIndex < context.model.tabs.length &&
              toIndex >= 0 && toIndex < context.model.tabs.length) {
            
            // Reorder tabs array
            const [movedTab] = context.model.tabs.splice(fromIndex, 1);
            context.model.tabs.splice(toIndex, 0, movedTab);
            
            // Reorder other arrays
            const [movedName] = context.model.tabNames.splice(fromIndex, 1);
            context.model.tabNames.splice(toIndex, 0, movedName);
            
            const [movedContent] = context.model.tabContents.splice(fromIndex, 1);
            context.model.tabContents.splice(toIndex, 0, movedContent);
            
            // Update active tab if necessary
            if (context.model.activeTab === fromIndex) {
              context.model.activeTab = toIndex;
            } else if (context.model.activeTab === toIndex) {
              context.model.activeTab = fromIndex;
            }
          }
        },
        
        saveTabConfiguration: async (context, event) => {
          await context.log('Saving tab configuration');
          
          // Save to storage
          if (context.model.messageHandler) {
            try {
              await context.model.messageHandler.sendMessage('background', {
                type: 'TAB_CONFIG_SAVED',
                configuration: {
                  tabs: context.model.tabs,
                  tabNames: context.model.tabNames,
                  tabContents: context.model.tabContents,
                  tabStates: context.model.tabStates
                },
                source: 'wave-tabs',
                target: 'background',
                traceId: Date.now().toString()
              });
            } catch (error) {
              console.warn('Could not save tab configuration:', error);
            }
          }
        },
        
        resetTabConfiguration: async (context) => {
          await context.log('Resetting tab configuration');
          
          // Reset to default configuration
          context.model.tabs = [];
          context.model.tabNames = [];
          context.model.tabContents = [];
          context.model.tabStates = {};
          context.model.activeTab = 0;
          context.model.tabHistory = [];
        }
      }
    });
  }
};

// Helper functions for rendering views
function renderTabView(context, tabIndex) {
  const tab = context.model.tabs[tabIndex];
  const isActive = context.model.activeTab === tabIndex;
  
  if (!tab) {
    return `
      <div class="wave-tabs-tab-view">
        <div class="tab-header">
          <h3>Tab ${tabIndex + 1}</h3>
          <div class="tab-actions">
            <button class="btn btn-secondary" onclick="manageTabs()">
              ⚙️ Manage Tabs
            </button>
            <button class="btn btn-secondary" onclick="configureTabs()">
              🔧 Configure
            </button>
          </div>
        </div>
        <div class="tab-content">
          <p>Tab content not available</p>
        </div>
      </div>
    `;
  }
  
  return `
    <div class="wave-tabs-tab-view ${isActive ? 'active' : ''}">
      <div class="tab-header">
        <h3>${tab.name}</h3>
        <div class="tab-actions">
          <button class="btn btn-secondary" onclick="manageTabs()">
            ⚙️ Manage Tabs
          </button>
          <button class="btn btn-secondary" onclick="configureTabs()">
            🔧 Configure
          </button>
        </div>
      </div>
      <div class="tab-content">
        ${tab.content || '<p>No content available</p>'}
      </div>
      <div class="tab-navigation">
        ${renderTabNavigation(context, tabIndex)}
      </div>
    </div>
  `;
}

function renderTabNavigation(context, currentTabIndex) {
  const tabs = context.model.tabs;
  if (tabs.length <= 1) return '';
  
  let navigation = '<div class="tab-nav-buttons">';
  
  // Previous tab button
  if (currentTabIndex > 0) {
    navigation += `
      <button class="btn btn-secondary" onclick="switchToTab(${currentTabIndex - 1})">
        ← Previous
      </button>
    `;
  }
  
  // Tab indicators
  tabs.forEach((tab, index) => {
    const isActive = index === currentTabIndex;
    navigation += `
      <button class="btn ${isActive ? 'btn-primary' : 'btn-secondary'}" 
              onclick="switchToTab(${index})">
        ${tab.name}
      </button>
    `;
  });
  
  // Next tab button
  if (currentTabIndex < tabs.length - 1) {
    navigation += `
      <button class="btn btn-secondary" onclick="switchToTab(${currentTabIndex + 1})">
        Next →
      </button>
    `;
  }
  
  navigation += '</div>';
  return navigation;
}

function renderTabManagementView(context) {
  return `
    <div class="wave-tabs-management-view">
      <div class="management-header">
        <h3>⚙️ Tab Management</h3>
        <button class="btn btn-primary" onclick="backToTab()">
          ← Back to Tab
        </button>
      </div>
      
      <div class="tab-list">
        <h4>Current Tabs:</h4>
        ${context.model.tabs.map((tab, index) => `
          <div class="tab-item">
            <span class="tab-name">${tab.name}</span>
            <div class="tab-actions">
              <button class="btn btn-sm btn-secondary" onclick="editTab(${index})">
                ✏️ Edit
              </button>
              <button class="btn btn-sm btn-danger" onclick="removeTab(${index})">
                🗑️ Remove
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="add-tab-section">
        <h4>Add New Tab:</h4>
        <input type="text" id="newTabName" placeholder="Tab name" class="tab-input">
        <textarea id="newTabContent" placeholder="Tab content" class="tab-textarea"></textarea>
        <button class="btn btn-primary" onclick="addNewTab()">
          ➕ Add Tab
        </button>
      </div>
    </div>
  `;
}

function renderTabConfigurationView(context) {
  return `
    <div class="wave-tabs-configuration-view">
      <div class="configuration-header">
        <h3>🔧 Tab Configuration</h3>
        <button class="btn btn-primary" onclick="backToTab()">
          ← Back to Tab
        </button>
      </div>
      
      <div class="configuration-options">
        <h4>General Settings:</h4>
        <div class="config-option">
          <label>Maximum Tabs:</label>
          <input type="number" id="maxTabs" value="${context.model.maxTabs}" min="1" max="20">
        </div>
        
        <div class="config-option">
          <label>Save Tab History:</label>
          <input type="checkbox" id="saveHistory" ${context.model.tabHistory.length > 0 ? 'checked' : ''}>
        </div>
        
        <div class="config-option">
          <label>Auto-save Configuration:</label>
          <input type="checkbox" id="autoSave" checked>
        </div>
      </div>
      
      <div class="configuration-actions">
        <button class="btn btn-primary" onclick="saveConfiguration()">
          💾 Save Configuration
        </button>
        <button class="btn btn-secondary" onclick="resetConfiguration()">
          🔄 Reset to Defaults
        </button>
      </div>
    </div>
  `;
}

// Export the template
export { WaveTabsComponentTemplate };
