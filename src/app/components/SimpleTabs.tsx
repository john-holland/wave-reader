import React from 'react';

interface Tab {
  id: string;
  name: string;
  content: React.ReactNode;
}

interface SimpleTabsProps {
  activeTab: string;
  tabs: Tab[];
  onTabChange: (tabId: string) => void;
}

export const SimpleTabs: React.FC<SimpleTabsProps> = ({ activeTab, tabs, onTabChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tab Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        backgroundColor: 'white',
        borderRadius: '8px 8px 0 0'
      }}>
        {tabs.find(tab => tab.id === activeTab)?.content || (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            No content available for this tab
          </div>
        )}
      </div>
      
      {/* Tab Headers - Now at the bottom */}
      <div style={{
        display: 'flex',
        borderTop: '1px solid #ddd',
        backgroundColor: '#f8f9fa',
        borderRadius: '0 0 8px 8px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? '#007bff' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              transition: 'all 0.2s ease',
              borderRadius: activeTab === tab.id ? '0 0 8px 8px' : '0'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SimpleTabs;
