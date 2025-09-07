"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import SummaryLengthSelector from "../components/SummaryLengthSelector";
import VideoInput from "../components/VideoInput";
import VideoInfo from "../components/VideoInfo";
import SummaryDisplay from "../components/SummaryDisplay";
import UserHistory from "../components/UserHistory";
import EmptyState from "../components/EmptyState";
import AnalysisDisplay from "../components/AnalysisDisplay";
import SummaryStyleSelector from "../components/SummaryStyleSelector";
import RealTimeAnalysis from "../components/RealTimeAnalysis";
import AdvancedVisualization from "../components/AdvancedVisualization";
import CollaborativeFeatures from "../components/CollaborativeFeatures";
import APIIntegrations from "../components/APIIntegrations";
import SocialSharing from "../components/SocialSharing";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import CollaborationWorkspace from "../components/CollaborationWorkspace";
import GamificationPanel from "../components/GamificationPanel";
import useSummary from "../hooks/useSummary";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('main'); // 'main', 'history', 'advanced', 'social', 'analytics', 'collaboration', 'gamification'
  const {
    url,
    setUrl,
    summary,
    loading,
    videoInfo,
    summaryLength,
    setSummaryLength,
    summaryStyle,
    setSummaryStyle,
    analysis,
    metadata,
    handleSummarize
  } = useSummary();

  const handleSelectSummary = (selectedSummary) => {
    setUrl(selectedSummary.url);
    // Note: We can't directly set the summary and videoInfo from history
    // as they need to be regenerated, but we can pre-fill the URL
    setCurrentView('main');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'} transition-all duration-500`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              <span className={darkMode ? 'text-white' : 'text-gray-900'}>YouTube</span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Summaries</span>
            </h2>
            <p className={`text-lg md:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Transform long videos into concise summaries with AI. Just paste your YouTube URL and get instant insights.
            </p>
          </div>

          {/* Main Content Card */}
          <div className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-white/20'} overflow-hidden`}>
            <div className="p-8 md:p-12">
              {/* View Toggle */}
              <div className="flex justify-center mb-8">
                <div className={`flex flex-wrap justify-center gap-1 rounded-lg p-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <button
                    onClick={() => setCurrentView('main')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currentView === 'main'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : darkMode
                          ? 'text-gray-300 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Summarizer
                  </button>
                  <button
                    onClick={() => setCurrentView('history')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currentView === 'history'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : darkMode
                          ? 'text-gray-300 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    History
                  </button>
                  <button
                    onClick={() => setCurrentView('advanced')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currentView === 'advanced'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : darkMode
                          ? 'text-gray-300 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Advanced
                  </button>
                  <button
                    onClick={() => setCurrentView('social')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currentView === 'social'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : darkMode
                          ? 'text-gray-300 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Social
                  </button>
                  <button
                    onClick={() => setCurrentView('analytics')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currentView === 'analytics'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : darkMode
                          ? 'text-gray-300 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Analytics
                  </button>
                  <button
                    onClick={() => setCurrentView('collaboration')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currentView === 'collaboration'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : darkMode
                          ? 'text-gray-300 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Collaborate
                  </button>
                  <button
                    onClick={() => setCurrentView('gamification')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currentView === 'gamification'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : darkMode
                          ? 'text-gray-300 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Achievements
                  </button>
                </div>
              </div>

              {currentView === 'main' ? (
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Input Section */}
                  <div className="space-y-6">
                    <SummaryLengthSelector
                      summaryLength={summaryLength}
                      setSummaryLength={setSummaryLength}
                      darkMode={darkMode}
                    />

                    <SummaryStyleSelector
                      summaryStyle={summaryStyle}
                      setSummaryStyle={setSummaryStyle}
                      darkMode={darkMode}
                    />

                    <VideoInput
                      url={url}
                      setUrl={setUrl}
                      darkMode={darkMode}
                    />

                    <button
                      onClick={handleSummarize}
                      className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating Summary...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Summarize Video
                        </>
                      )}
                    </button>
                  </div>

                  {/* Summary Section */}
                  <div className="space-y-6">
                    {summary ? (
                      <>
                        {/* Video Info */}
                        {videoInfo && (
                          <VideoInfo
                            videoInfo={videoInfo}
                            darkMode={darkMode}
                          />
                        )}

                        {/* Summary */}
                        <SummaryDisplay
                          summary={summary}
                          darkMode={darkMode}
                          videoInfo={videoInfo}
                          summaryLength={summaryLength}
                        />

                        {/* Enhanced AI Analysis */}
                        <AnalysisDisplay
                          analysis={analysis}
                          darkMode={darkMode}
                          metadata={metadata}
                        />
                      </>
                    ) : (
                      <EmptyState darkMode={darkMode} />
                    )}
                  </div>
                </div>
              ) : currentView === 'history' ? (
                <UserHistory
                  darkMode={darkMode}
                  onSelectSummary={handleSelectSummary}
                />
              ) : currentView === 'advanced' ? (
                <div className="space-y-6">
                  <RealTimeAnalysis
                    videoId={videoInfo?.video_id}
                    darkMode={darkMode}
                  />
                  <AdvancedVisualization
                    analysis={analysis}
                    darkMode={darkMode}
                    videoId={videoInfo?.video_id}
                  />
                </div>
              ) : currentView === 'social' ? (
                <SocialSharing
                  videoId={videoInfo?.video_id}
                  summary={summary}
                  videoInfo={videoInfo}
                  darkMode={darkMode}
                />
              ) : currentView === 'analytics' ? (
                <AnalyticsDashboard
                  videoId={videoInfo?.video_id}
                  darkMode={darkMode}
                />
              ) : currentView === 'collaboration' ? (
                <CollaborationWorkspace
                  videoId={videoInfo?.video_id}
                  darkMode={darkMode}
                />
              ) : currentView === 'gamification' ? (
                <GamificationPanel
                  darkMode={darkMode}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
