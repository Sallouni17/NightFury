import React, { useState, useEffect } from 'react';

const UserHistory = ({ darkMode, onSelectSummary }) => {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    // Load history and favorites from localStorage
    const savedHistory = localStorage.getItem('youtube_summaries_history');
    const savedFavorites = localStorage.getItem('youtube_summaries_favorites');

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (summary) => {
    const isFavorite = favorites.some(fav => fav.id === summary.id);
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.id !== summary.id);
    } else {
      newFavorites = [...favorites, { ...summary, favoritedAt: new Date().toISOString() }];
    }

    setFavorites(newFavorites);
    localStorage.setItem('youtube_summaries_favorites', JSON.stringify(newFavorites));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('youtube_summaries_history');
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('youtube_summaries_favorites');
  };

  const currentData = activeTab === 'history' ? history : favorites;

  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-white/20'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Your Summaries
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-blue-500 text-white'
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            History ({history.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'favorites'
                ? 'bg-red-500 text-white'
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Favorites ({favorites.length})
          </button>
        </div>
      </div>

      {currentData.length === 0 ? (
        <div className="text-center py-8">
          <svg className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {activeTab === 'history' ? 'No summaries yet' : 'No favorites yet'}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {activeTab === 'history' ? 'Your summarized videos will appear here' : 'Save summaries as favorites to see them here'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentData.map((item, index) => (
            <div
              key={item.id || index}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                darkMode ? 'bg-gray-700/30 border-gray-600 hover:bg-gray-700/50' : 'bg-gray-50/50 border-gray-200 hover:bg-gray-100/50'
              }`}
              onClick={() => onSelectSummary && onSelectSummary(item)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item.videoInfo?.title || 'YouTube Video'}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(item.timestamp).toLocaleDateString()} • {item.summaryLength} summary
                      </p>
                    </div>
                  </div>
                  <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.summary}
                  </p>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item);
                    }}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      favorites.some(fav => fav.id === item.id)
                        ? 'text-red-500 hover:text-red-600'
                        : darkMode
                          ? 'text-gray-400 hover:text-gray-300'
                          : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill={favorites.some(fav => fav.id === item.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(item.summary);
                    }}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center pt-4">
            <button
              onClick={activeTab === 'history' ? clearHistory : clearFavorites}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                darkMode
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              Clear {activeTab === 'history' ? 'History' : 'Favorites'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHistory;
