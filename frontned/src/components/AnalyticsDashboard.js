import React, { useState, useEffect } from 'react';

const AnalyticsDashboard = ({ videoId, darkMode }) => {
  const [analytics, setAnalytics] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [trendingData, setTrendingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [compareVideos, setCompareVideos] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!videoId) return;

      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/analytics/${videoId}`);
        const data = await response.json();

        if (!data.error) {
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
      setLoading(false);
    };

    if (videoId) {
      fetchAnalytics();
    }
  }, [videoId]);

  const fetchTrending = async (category = 'all') => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/analytics/trending/${category}`);
      const data = await response.json();
      setTrendingData(data);
    } catch (error) {
      console.error('Failed to fetch trending data:', error);
    }
  };

  const compareVideosHandler = async () => {
    if (!compareVideos.trim()) return;

    const videoIds = compareVideos.split(',').map(id => id.trim()).filter(id => id);
    if (videoIds.length < 2) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/analytics/compare/${videoIds.join(',')}`);
      const data = await response.json();

      if (!data.error) {
        setComparisonData(data);
        setActiveTab('comparison');
      }
    } catch (error) {
      console.error('Failed to compare videos:', error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getEngagementColor = (rate) => {
    if (rate >= 5) return 'text-green-500';
    if (rate >= 2) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getViralColor = (potential) => {
    switch (potential) {
      case 'High': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {analytics?.video_stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatNumber(analytics.video_stats.views)}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Views
            </div>
          </div>

          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatNumber(analytics.video_stats.likes)}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Likes
            </div>
          </div>

          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatNumber(analytics.video_stats.comments)}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Comments
            </div>
          </div>
        </div>
      )}

      {analytics?.engagement && (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
          <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Engagement Analysis
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className={`text-3xl font-bold mb-2 ${getEngagementColor(analytics.engagement.rate)}`}>
                {analytics.engagement.rate}%
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Overall Engagement Rate
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Likes per View
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {(analytics.engagement.likes_per_view * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Comments per View
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {(analytics.engagement.comments_per_view * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {analytics?.viral_analysis && (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
          <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Viral Potential Analysis
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className={`text-3xl font-bold mb-2 ${getViralColor(analytics.viral_analysis.potential)}`}>
                {analytics.viral_analysis.score}/100
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Viral Potential Score
              </div>
              <div className={`text-lg font-medium mt-2 ${getViralColor(analytics.viral_analysis.potential)}`}>
                {analytics.viral_analysis.potential} Potential
              </div>
            </div>

            <div>
              <h5 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Key Factors
              </h5>
              <div className="space-y-1">
                {analytics.viral_analysis.factors.view_threshold && (
                  <div className="flex items-center text-green-500 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    High view count
                  </div>
                )}
                {analytics.viral_analysis.factors.high_engagement && (
                  <div className="flex items-center text-green-500 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Strong engagement
                  </div>
                )}
                {analytics.viral_analysis.factors.recent_content && (
                  <div className="flex items-center text-green-500 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Recent content
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ComparisonTab = () => (
    <div className="space-y-6">
      {!comparisonData && (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
          <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Compare Multiple Videos
          </h4>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Enter Video IDs (comma-separated)
              </label>
              <input
                type="text"
                value={compareVideos}
                onChange={(e) => setCompareVideos(e.target.value)}
                placeholder="dQw4w9WgXcQ, anotherVideoId, thirdVideoId"
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>

            <button
              onClick={compareVideosHandler}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200"
            >
              Compare Videos
            </button>
          </div>
        </div>
      )}

      {comparisonData && (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
          <div className="flex items-center justify-between mb-6">
            <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Video Comparison Results
            </h4>
            <button
              onClick={() => setComparisonData(null)}
              className={`px-3 py-1 rounded text-sm ${darkMode ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Clear
            </button>
          </div>

          {comparisonData.insights && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-500/20' : 'bg-blue-50'}`}>
                <div className={`text-2xl font-bold text-blue-500`}>
                  {formatNumber(comparisonData.insights.total_views)}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Combined Views
                </div>
              </div>

              <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-500/20' : 'bg-green-50'}`}>
                <div className={`text-2xl font-bold text-green-500`}>
                  {comparisonData.insights.avg_engagement}%
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Avg Engagement
                </div>
              </div>

              <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-500/20' : 'bg-purple-50'}`}>
                <div className={`text-2xl font-bold text-purple-500`}>
                  {comparisonData.insights.viral_candidates?.length || 0}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Viral Candidates
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {Object.entries(comparisonData.comparison || {}).map(([videoId, data]) => (
              <div key={videoId} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-500 bg-gray-500/10' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {data.video_stats?.title || `Video ${videoId}`}
                  </div>
                  <div className={`text-sm ${getViralColor(data.viral_analysis?.potential)}`}>
                    {data.viral_analysis?.potential} Potential
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatNumber(data.video_stats?.views || 0)}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Views
                    </div>
                  </div>
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {data.engagement?.rate || 0}%
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Engagement
                    </div>
                  </div>
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {data.viral_analysis?.score || 0}/100
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Viral Score
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'comparison', label: 'Compare', icon: '⚖️' },
    { id: 'trending', label: 'Trending', icon: '🔥' }
  ];

  return (
    <div className={`p-6 rounded-xl border-l-4 border-l-blue-500 ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'} backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          Analytics Dashboard
          {loading && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </h3>

        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'trending') fetchTrending();
              }}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : darkMode
                    ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {!videoId && (
        <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-600/50' : 'bg-gray-100'}`}>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Generate a summary to view detailed analytics
          </p>
        </div>
      )}

      {videoId && (
        <div className="min-h-96">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'comparison' && <ComparisonTab />}
          {activeTab === 'trending' && (
            <div className={`p-6 rounded-lg text-center ${darkMode ? 'bg-gray-600/50' : 'bg-gray-100'}`}>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Trending analysis requires YouTube Data API v3 setup
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
