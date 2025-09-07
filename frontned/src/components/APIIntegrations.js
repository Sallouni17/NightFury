import React, { useState } from 'react';

const APIIntegrations = ({ darkMode }) => {
  const [integrations, setIntegrations] = useState({
    notion: false,
    slack: false,
    discord: false,
    zapier: false,
    googleDocs: false,
    evernote: false
  });

  const toggleIntegration = (service) => {
    setIntegrations(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const integrationOptions = [
    {
      name: 'notion',
      label: 'Notion',
      description: 'Export summaries directly to Notion pages',
      icon: '📝',
      color: 'bg-gray-800'
    },
    {
      name: 'slack',
      label: 'Slack',
      description: 'Send summaries to Slack channels',
      icon: '💬',
      color: 'bg-purple-600'
    },
    {
      name: 'discord',
      label: 'Discord',
      description: 'Post summaries to Discord servers',
      icon: '🎮',
      color: 'bg-indigo-600'
    },
    {
      name: 'zapier',
      label: 'Zapier',
      description: 'Connect with 3,000+ apps via Zapier',
      icon: '🔗',
      color: 'bg-orange-500'
    },
    {
      name: 'googleDocs',
      label: 'Google Docs',
      description: 'Create Google Docs with summaries',
      icon: '📄',
      color: 'bg-blue-600'
    },
    {
      name: 'evernote',
      label: 'Evernote',
      description: 'Save summaries to Evernote notebooks',
      icon: '📓',
      color: 'bg-green-600'
    }
  ];

  return (
    <div className={`p-6 rounded-xl border-l-4 border-l-cyan-500 ${darkMode ? 'bg-gray-700/50' : 'bg-cyan-50/50'} backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <svg className="w-5 h-5 mr-2 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
          API Integrations
        </h3>

        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {Object.values(integrations).filter(Boolean).length} of {Object.keys(integrations).length} connected
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrationOptions.map((option) => (
          <div
            key={option.name}
            className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              integrations[option.name]
                ? `border-cyan-500 ${darkMode ? 'bg-cyan-900/20' : 'bg-cyan-50'}`
                : darkMode
                  ? 'border-gray-600 bg-gray-600/20 hover:bg-gray-600/30'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
            onClick={() => toggleIntegration(option.name)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{option.icon}</div>
                <div>
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {option.label}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {integrations[option.name] ? 'Connected' : 'Not connected'}
                  </div>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                integrations[option.name]
                  ? 'bg-cyan-500 border-cyan-500'
                  : darkMode
                    ? 'border-gray-500'
                    : 'border-gray-300'
              }`}>
                {integrations[option.name] && (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>

            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {option.description}
            </p>

            {integrations[option.name] && (
              <div className="mt-3 pt-3 border-t border-cyan-500/20">
                <button className="w-full py-2 px-3 bg-cyan-500 hover:bg-cyan-600 text-white text-sm rounded-md transition-all duration-200">
                  Configure
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Integration Status */}
      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
        <div className="flex items-center justify-between">
          <div>
            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Integration Status
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Webhook endpoints and API keys configured
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              Object.values(integrations).some(Boolean) ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className={`text-sm font-medium ${
              Object.values(integrations).some(Boolean) ? 'text-green-500' : 'text-gray-500'
            }`}>
              {Object.values(integrations).some(Boolean) ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* API Usage Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
          <div className={`text-xl font-bold text-cyan-500`}>1,247</div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            API Calls Today
          </div>
        </div>
        <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
          <div className={`text-xl font-bold text-green-500`}>99.9%</div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Uptime
          </div>
        </div>
        <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
          <div className={`text-xl font-bold text-purple-500`}>24ms</div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Avg Response
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIIntegrations;
