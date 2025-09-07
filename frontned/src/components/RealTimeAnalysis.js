import React, { useState, useEffect } from 'react';

const RealTimeAnalysis = ({ videoId, darkMode }) => {
  const [realTimeData, setRealTimeData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const startRealTimeAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        // Simulate real-time analysis
        const response = await fetch(`http://127.0.0.1:8000/analyze-realtime/${videoId}`);
        const data = await response.json();
        setRealTimeData(data);
      } catch (error) {
        console.error('Real-time analysis failed:', error);
        // Fallback mock data for demo purposes
        setRealTimeData({
          sentiment_timeline: [
            { timestamp: 0, sentiment: 'positive', score: 0.3 },
            { timestamp: 30, sentiment: 'neutral', score: 0.1 },
            { timestamp: 60, sentiment: 'negative', score: -0.2 },
            { timestamp: 90, sentiment: 'positive', score: 0.4 },
            { timestamp: 120, sentiment: 'neutral', score: 0.0 },
            { timestamp: 150, sentiment: 'positive', score: 0.5 },
            { timestamp: 180, sentiment: 'negative', score: -0.3 },
            { timestamp: 210, sentiment: 'neutral', score: 0.1 },
            { timestamp: 240, sentiment: 'positive', score: 0.2 },
            { timestamp: 270, sentiment: 'positive', score: 0.6 }
          ],
          key_moments: [
            {
              timestamp: 90,
              type: 'sentiment_shift',
              description: 'Strong positive sentiment detected - key discussion point',
              confidence: 40
            },
            {
              timestamp: 180,
              type: 'negative_peak',
              description: 'Critical feedback or concern raised',
              confidence: 30
            },
            {
              timestamp: 270,
              type: 'sentiment_shift',
              description: 'Resolution or positive conclusion reached',
              confidence: 60
            }
          ],
          metrics: {
            words_per_minute: 145.2,
            engagement_score: 78,
            complexity_score: 7.2
          }
        });
      }
      setIsAnalyzing(false);
    };

    if (videoId) {
      startRealTimeAnalysis();
    }
    return () => {
      // Cleanup
    };
  }, [videoId]);

  return (
    <div className={`p-6 rounded-xl border-l-4 border-l-orange-500 ${darkMode ? 'bg-gray-700/50' : 'bg-orange-50/50'} backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Real-Time Analysis
        </h3>
        {isAnalyzing && (
          <div className="flex items-center text-orange-500">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </div>
        )}
      </div>

      {realTimeData && (
        <div className="space-y-4">
          {/* Sentiment Timeline */}
          <div>
            <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sentiment Over Time
            </h4>
            <div className="h-20 bg-gray-200 rounded-lg flex items-end justify-between px-2">
              {realTimeData.sentiment_timeline?.map((point, index) => (
                <div
                  key={index}
                  className={`w-4 rounded-t ${
                    point.sentiment === 'positive' ? 'bg-green-500' :
                    point.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                  }`}
                  style={{ height: `${Math.abs(point.score) * 100}%` }}
                  title={`Time: ${point.timestamp}s, Sentiment: ${point.sentiment}`}
                ></div>
              ))}
            </div>
          </div>

          {/* Key Moments */}
          <div>
            <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Key Moments Detected
            </h4>
            <div className="space-y-2">
              {realTimeData.key_moments?.map((moment, index) => (
                <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {moment.type} at {moment.timestamp}s
                    </span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {moment.confidence}% confidence
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {moment.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
              <div className={`text-2xl font-bold text-blue-500`}>
                {realTimeData.metrics?.words_per_minute || 0}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Words/Min
              </div>
            </div>
            <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
              <div className={`text-2xl font-bold text-green-500`}>
                {realTimeData.metrics?.engagement_score || 0}%
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Engagement
              </div>
            </div>
            <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
              <div className={`text-2xl font-bold text-purple-500`}>
                {realTimeData.metrics?.complexity_score || 0}/10
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Complexity
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeAnalysis;
