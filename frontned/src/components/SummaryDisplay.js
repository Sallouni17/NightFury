import React, { useState, useEffect } from 'react';

const SummaryDisplay = ({ summary, darkMode, videoInfo, summaryLength }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if this summary is already favorited
    const favorites = JSON.parse(localStorage.getItem('youtube_summaries_favorites') || '[]');
    const currentSummary = {
      summary,
      videoInfo,
      summaryLength,
      timestamp: new Date().toISOString()
    };
    setIsFavorite(favorites.some(fav => fav.summary === summary));
  }, [summary, videoInfo, summaryLength]);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'youtube-summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('youtube_summaries_favorites') || '[]');
    const summaryData = {
      id: Date.now().toString(),
      summary,
      videoInfo,
      summaryLength,
      timestamp: new Date().toISOString(),
      favoritedAt: new Date().toISOString()
    };

    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.summary !== summary);
    } else {
      updatedFavorites = [...favorites, summaryData];
    }

    localStorage.setItem('youtube_summaries_favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={`p-6 rounded-xl border-l-4 border-gradient-to-r from-blue-500 to-purple-500 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50/50'} backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          AI Summary
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleFavorite}
            className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 flex items-center ${
              isFavorite
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : darkMode
                  ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <svg className="w-4 h-4 mr-1" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isFavorite ? 'Favorited' : 'Favorite'}
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-all duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-all duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download
          </button>
        </div>
      </div>
      <div className={`prose prose-sm max-w-none ${darkMode ? 'prose-invert' : ''}`}>
        <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{summary}</p>
      </div>
    </div>
  );
};

export default SummaryDisplay;
