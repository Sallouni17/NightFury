import React from 'react';

const AnalysisDisplay = ({ analysis, darkMode, metadata }) => {
  if (!analysis) return null;

  const getSentimentColor = (label) => {
    switch (label) {
      case 'POSITIVE': return 'text-green-500';
      case 'NEGATIVE': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSentimentBg = (label) => {
    switch (label) {
      case 'POSITIVE': return darkMode ? 'bg-green-900/20' : 'bg-green-50';
      case 'NEGATIVE': return darkMode ? 'bg-red-900/20' : 'bg-red-50';
      default: return darkMode ? 'bg-gray-700/20' : 'bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sentiment Analysis */}
      <div className={`p-6 rounded-xl border-l-4 border-l-blue-500 ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'} backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Sentiment Analysis
          </h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentBg(analysis.sentiment?.sentiment_label)} ${getSentimentColor(analysis.sentiment?.sentiment_label)}`}>
            {analysis.sentiment?.sentiment_label || 'NEUTRAL'}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {(analysis.sentiment?.compound_score * 100).toFixed(0)}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Overall Score
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {(analysis.sentiment?.pos * 100).toFixed(0)}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Positive
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {(analysis.sentiment?.neg * 100).toFixed(0)}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Negative
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-500">
              {(analysis.sentiment?.neu * 100).toFixed(0)}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Neutral
            </div>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className={`p-6 rounded-xl border-l-4 border-l-purple-500 ${darkMode ? 'bg-gray-700/50' : 'bg-purple-50/50'} backdrop-blur-sm`}>
        <h3 className={`text-xl font-semibold flex items-center mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          Key Topics
        </h3>

        <div className="flex flex-wrap gap-2">
          {analysis.topics?.map((topic, index) => (
            <div
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-800'
              }`}
            >
              {topic.topic} ({(topic.confidence * 100).toFixed(0)}%)
            </div>
          ))}
        </div>
      </div>

      {/* Key Phrases */}
      <div className={`p-6 rounded-xl border-l-4 border-l-green-500 ${darkMode ? 'bg-gray-700/50' : 'bg-green-50/50'} backdrop-blur-sm`}>
        <h3 className={`text-xl font-semibold flex items-center mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Key Phrases
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {analysis.key_phrases?.slice(0, 8).map((phrase, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-center ${
                darkMode ? 'bg-gray-600/50' : 'bg-white/50'
              }`}
            >
              <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {phrase.word}
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {phrase.frequency} times
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence Score */}
      <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50/50 border-gray-200'} backdrop-blur-sm`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Analysis Confidence
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Overall reliability of the AI analysis
            </div>
            {/* GPU Acceleration Indicator */}
            {metadata?.gpu_accelerated && (
              <div className="flex items-center text-green-500 text-sm font-medium mt-1">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                GPU Accelerated Processing
              </div>
            )}
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {(analysis.confidence_score * 100).toFixed(0)}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Confidence
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
