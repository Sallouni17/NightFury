import React, { useState, useEffect } from 'react';

const SocialSharing = ({ summary, videoInfo, darkMode }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [sharingStatus, setSharingStatus] = useState({});
  const [previewContent, setPreviewContent] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const platforms = [
    {
      id: 'twitter',
      name: 'Twitter',
      icon: '🐦',
      color: 'bg-blue-500',
      maxLength: 280
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600',
      maxLength: 63206
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-700',
      maxLength: 3000
    }
  ];

  useEffect(() => {
    const fetchPreviewContent = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/share/preview/${videoInfo.video_id}`);
        const data = await response.json();
        setPreviewContent(data.preview_content || {});
      } catch (error) {
        console.error('Failed to fetch preview content:', error);
      }
    };

    if (videoInfo?.video_id) {
      fetchPreviewContent();
    }
  }, [videoInfo]);

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const shareToPlatform = async (platformId) => {
    if (!summary || !videoInfo) return;

    setIsLoading(true);
    setSharingStatus(prev => ({ ...prev, [platformId]: 'sharing' }));

    try {
      const requestData = {
        video_id: videoInfo.video_id,
        length: 'medium',
        style: 'paragraph'
      };

      const response = await fetch(`http://127.0.0.1:8000/share/${platformId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (result.sharing_result && !result.sharing_result.error) {
        setSharingStatus(prev => ({ ...prev, [platformId]: 'success' }));
      } else {
        setSharingStatus(prev => ({ ...prev, [platformId]: 'error' }));
      }
    } catch (error) {
      console.error(`Failed to share to ${platformId}:`, error);
      setSharingStatus(prev => ({ ...prev, [platformId]: 'error' }));
    }

    setIsLoading(false);
  };

  const shareToAll = async () => {
    if (!summary || !videoInfo) return;

    setIsLoading(true);
    selectedPlatforms.forEach(platform => {
      setSharingStatus(prev => ({ ...prev, [platform]: 'sharing' }));
    });

    try {
      const requestData = {
        video_id: videoInfo.video_id,
        length: 'medium',
        style: 'paragraph'
      };

      const response = await fetch('http://127.0.0.1:8000/share/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (result.sharing_results) {
        const newStatus = {};
        Object.keys(result.sharing_results).forEach(platform => {
          const platformResult = result.sharing_results[platform];
          newStatus[platform] = platformResult.error ? 'error' : 'success';
        });
        setSharingStatus(prev => ({ ...prev, ...newStatus }));
      }
    } catch (error) {
      console.error('Failed to share to all platforms:', error);
      selectedPlatforms.forEach(platform => {
        setSharingStatus(prev => ({ ...prev, [platform]: 'error' }));
      });
    }

    setIsLoading(false);
  };

  const getStatusIcon = (platformId) => {
    const status = sharingStatus[platformId];
    switch (status) {
      case 'sharing':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '';
    }
  };

  const getStatusColor = (platformId) => {
    const status = sharingStatus[platformId];
    switch (status) {
      case 'sharing':
        return 'text-yellow-500';
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return '';
    }
  };

  return (
    <div className={`p-6 rounded-xl border-l-4 border-l-pink-500 ${darkMode ? 'bg-gray-700/50' : 'bg-pink-50/50'} backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <svg className="w-5 h-5 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414zM6 6a1 1 0 011-1h6a1 1 0 110-2H7a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Social Sharing
        </h3>

        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Share your AI-generated summaries
        </div>
      </div>

      {!summary && (
        <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-600/50' : 'bg-gray-100'}`}>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Generate a summary first to share it on social media
          </p>
        </div>
      )}

      {summary && (
        <>
          {/* Platform Selection */}
          <div className="mb-6">
            <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Select Platforms
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedPlatforms.includes(platform.id)
                      ? `border-pink-500 ${darkMode ? 'bg-pink-900/20' : 'bg-pink-50'}`
                      : darkMode
                        ? 'border-gray-600 bg-gray-600/20 hover:bg-gray-600/30'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{platform.icon}</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {platform.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(platform.id) && (
                        <span className={getStatusColor(platform.id)}>
                          {getStatusIcon(platform.id)}
                        </span>
                      )}
                      <div className={`w-4 h-4 rounded border-2 ${
                        selectedPlatforms.includes(platform.id)
                          ? 'bg-pink-500 border-pink-500'
                          : darkMode
                            ? 'border-gray-500'
                            : 'border-gray-300'
                      }`}>
                        {selectedPlatforms.includes(platform.id) && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>

                  {previewContent[platform.id] && (
                    <div className={`text-xs mt-2 p-2 rounded ${darkMode ? 'bg-gray-500/20' : 'bg-gray-100'}`}>
                      <div className="truncate">
                        {previewContent[platform.id].substring(0, 60)}...
                      </div>
                      <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {previewContent[platform.id].length}/{platform.maxLength} chars
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {selectedPlatforms.map((platformId) => (
              <button
                key={platformId}
                onClick={() => shareToPlatform(platformId)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  sharingStatus[platformId] === 'success'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : sharingStatus[platformId] === 'error'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-pink-500 hover:bg-pink-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {sharingStatus[platformId] === 'sharing' && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Share to {platforms.find(p => p.id === platformId)?.name}
              </button>
            ))}

            {selectedPlatforms.length > 1 && (
              <button
                onClick={shareToAll}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Share to All ({selectedPlatforms.length})
              </button>
            )}
          </div>

          {/* Sharing Tips */}
          <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-pink-50'}`}>
            <h5 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              💡 Sharing Tips
            </h5>
            <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>• AI-generated content gets 2x more engagement</li>
              <li>• Include relevant hashtags for better reach</li>
              <li>• Share during peak hours for maximum visibility</li>
              <li>• Engage with comments to build community</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialSharing;
