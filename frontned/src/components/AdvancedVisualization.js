import React, { useState, useEffect } from 'react';

const AdvancedVisualization = ({ analysis, darkMode, videoId }) => {
  const [activeView, setActiveView] = useState('wordcloud');
  const [advancedData, setAdvancedData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fallback mock data for demo purposes
  const mockAnalysis = {
    key_phrases: [
      { word: 'technology', frequency: 12, importance_score: 0.8 },
      { word: 'innovation', frequency: 8, importance_score: 0.6 },
      { word: 'future', frequency: 6, importance_score: 0.5 },
      { word: 'development', frequency: 5, importance_score: 0.4 },
      { word: 'solution', frequency: 4, importance_score: 0.3 },
      { word: 'challenge', frequency: 3, importance_score: 0.2 },
      { word: 'opportunity', frequency: 3, importance_score: 0.2 },
      { word: 'growth', frequency: 2, importance_score: 0.1 }
    ],
    sentiment: {
      pos: 0.45,
      neg: 0.15,
      neu: 0.40
    },
    topics: [
      { topic: 'technology', confidence: 0.8 },
      { topic: 'business', confidence: 0.6 },
      { topic: 'innovation', confidence: 0.4 }
    ]
  };

  useEffect(() => {
    const fetchAdvancedData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/analyze-advanced/${videoId}`);
        const data = await response.json();
        setAdvancedData(data);
      } catch (error) {
        console.error('Advanced analysis failed:', error);
        // Fallback to mock data if API fails
        setAdvancedData({
          key_phrases: [
            { word: 'technology', frequency: 12, importance_score: 0.8 },
            { word: 'innovation', frequency: 8, importance_score: 0.6 },
            { word: 'future', frequency: 6, importance_score: 0.5 },
            { word: 'development', frequency: 5, importance_score: 0.4 },
            { word: 'solution', frequency: 4, importance_score: 0.3 },
            { word: 'challenge', frequency: 3, importance_score: 0.2 },
            { word: 'opportunity', frequency: 3, importance_score: 0.2 },
            { word: 'growth', frequency: 2, importance_score: 0.1 }
          ],
          sentiment: {
            pos: 0.45,
            neg: 0.15,
            neu: 0.40
          },
          topics: [
            { topic: 'technology', confidence: 0.8 },
            { topic: 'business', confidence: 0.6 },
            { topic: 'innovation', confidence: 0.4 }
          ]
        });
      }
      setLoading(false);
    };

    if (videoId) {
      fetchAdvancedData();
    }
  }, [videoId]);

  const currentAnalysis = advancedData || analysis || {
    key_phrases: [
      { word: 'technology', frequency: 12, importance_score: 0.8 },
      { word: 'innovation', frequency: 8, importance_score: 0.6 },
      { word: 'future', frequency: 6, importance_score: 0.5 },
      { word: 'development', frequency: 5, importance_score: 0.4 },
      { word: 'solution', frequency: 4, importance_score: 0.3 },
      { word: 'challenge', frequency: 3, importance_score: 0.2 },
      { word: 'opportunity', frequency: 3, importance_score: 0.2 },
      { word: 'growth', frequency: 2, importance_score: 0.1 }
    ],
    sentiment: {
      pos: 0.45,
      neg: 0.15,
      neu: 0.40
    },
    topics: [
      { topic: 'technology', confidence: 0.8 },
      { topic: 'business', confidence: 0.6 },
      { topic: 'innovation', confidence: 0.4 }
    ]
  };

  const WordCloud = () => {
    const words = currentAnalysis.key_phrases || [];

    return (
      <div className="flex flex-wrap justify-center items-center min-h-64 p-4">
        {words.slice(0, 20).map((word, index) => {
          const size = Math.max(12, Math.min(48, word.frequency * 8));
          const colors = ['text-blue-500', 'text-green-500', 'text-purple-500', 'text-red-500', 'text-yellow-500'];

          return (
            <span
              key={index}
              className={`${colors[index % colors.length]} font-bold mx-2 my-1 transition-all duration-300 hover:scale-110 cursor-pointer`}
              style={{
                fontSize: `${size}px`,
                opacity: 0.7 + (word.importance_score * 0.3)
              }}
              title={`${word.word}: ${word.frequency} times`}
            >
              {word.word}
            </span>
          );
        })}
      </div>
    );
  };

  const SentimentChart = () => {
    const sentiment = currentAnalysis.sentiment || {};

    return (
      <div className="space-y-4">
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray={`${sentiment.pos * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-green-500">
                  {Math.round(sentiment.pos * 100)}%
                </span>
              </div>
            </div>
            <div className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Positive
            </div>
          </div>

          <div className="text-center">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray={`${sentiment.neg * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-red-500">
                  {Math.round(sentiment.neg * 100)}%
                </span>
              </div>
            </div>
            <div className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Negative
            </div>
          </div>

          <div className="text-center">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="2"
                  strokeDasharray={`${sentiment.neu * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-500">
                  {Math.round(sentiment.neu * 100)}%
                </span>
              </div>
            </div>
            <div className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Neutral
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TopicNetwork = () => {
    const topics = currentAnalysis.topics || [];

    return (
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {topics.map((topic, index) => {
          const size = Math.max(60, Math.min(120, topic.confidence * 100));
          const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];

          return (
            <div
              key={index}
              className={`${colors[index % colors.length]} rounded-full flex items-center justify-center text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-300`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                fontSize: `${Math.max(12, size / 8)}px`
              }}
            >
              {topic.topic}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`p-6 rounded-xl border-l-4 border-l-indigo-500 ${darkMode ? 'bg-gray-700/50' : 'bg-indigo-50/50'} backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <svg className="w-5 h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Advanced Visualizations
          {loading && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </h3>

        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('wordcloud')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
              activeView === 'wordcloud'
                ? 'bg-indigo-500 text-white'
                : darkMode
                  ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Word Cloud
          </button>
          <button
            onClick={() => setActiveView('sentiment')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
              activeView === 'sentiment'
                ? 'bg-indigo-500 text-white'
                : darkMode
                  ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sentiment
          </button>
          <button
            onClick={() => setActiveView('topics')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
              activeView === 'topics'
                ? 'bg-indigo-500 text-white'
                : darkMode
                  ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Topics
          </button>
        </div>
      </div>

      <div className="min-h-64">
        {activeView === 'wordcloud' && <WordCloud />}
        {activeView === 'sentiment' && <SentimentChart />}
        {activeView === 'topics' && <TopicNetwork />}
      </div>
    </div>
  );
};

export default AdvancedVisualization;
