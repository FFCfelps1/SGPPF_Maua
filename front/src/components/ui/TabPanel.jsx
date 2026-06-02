import { useState } from 'react';

export default function TabPanel({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tab-panel">
      <div className="tab-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-btn ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}
