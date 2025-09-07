import React, { useState, useEffect } from 'react';

const GamificationPanel = ({ darkMode }) => {
  const [profile, setProfile] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/game/profile/anonymous_user`);
        const data = await response.json();

        if (!data.error) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/game/leaderboard`);
        const data = await response.json();

        if (!data.error) {
          setLeaderboard(data.leaderboard || []);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      }
    };

    const fetchAchievements = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/game/achievements/anonymous_user`);
        const data = await response.json();

        if (!data.error) {
          setAchievements(data.achievements || []);
        }
      } catch (error) {
        console.error('Failed to fetch achievements:', error);
      }
    };

    const fetchRecentActivity = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/game/activity/anonymous_user`);
        const data = await response.json();

        if (!data.error) {
          setRecentActivity(data.activity || []);
        }
      } catch (error) {
        console.error('Failed to fetch recent activity:', error);
      }
    };

    if (true) { // Always fetch for anonymous user
      fetchProfile();
      fetchLeaderboard();
      fetchAchievements();
      fetchRecentActivity();
    }
  }, []); // No dependencies needed for anonymous user

  const claimReward = async (achievementId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/game/claim/anonymous_user/${achievementId}`, {
        method: 'POST'
      });

      const data = await response.json();

      if (!data.error) {
        // Refresh profile and achievements
        fetchProfile();
        fetchAchievements();
      }
    } catch (error) {
      console.error('Failed to claim reward:', error);
    }
    setLoading(false);
  };

  const getLevelProgress = (xp) => {
    const currentLevel = Math.floor(xp / 1000) + 1;
    const currentLevelXP = xp % 1000;
    const nextLevelXP = 1000;
    const progress = (currentLevelXP / nextLevelXP) * 100;

    return { currentLevel, currentLevelXP, nextLevelXP, progress };
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getAchievementIcon = (type) => {
    switch (type) {
      case 'video_summaries': return '📹';
      case 'social_shares': return '📤';
      case 'collaborations': return '🤝';
      case 'streak': return '🔥';
      case 'quality': return '⭐';
      default: return '🏆';
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500 border-yellow-500';
      case 'epic': return 'text-purple-500 border-purple-500';
      case 'rare': return 'text-blue-500 border-blue-500';
      case 'common': return 'text-gray-500 border-gray-500';
      default: return 'text-gray-500 border-gray-500';
    }
  };

  const ProfileTab = () => {
    if (!profile) return null;

    const levelInfo = getLevelProgress(profile.xp);

    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
              darkMode ? 'bg-gray-500' : 'bg-gray-300'
            }`}>
              {profile.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h4 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {profile.username || 'Anonymous User'}
              </h4>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Level {levelInfo.currentLevel} • {profile.xp} XP
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Level {levelInfo.currentLevel}
                </span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {levelInfo.currentLevelXP}/{levelInfo.nextLevelXP} XP
                </span>
              </div>
              <div className={`w-full bg-gray-200 rounded-full h-2 ${darkMode ? 'bg-gray-700' : ''}`}>
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${levelInfo.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-500/20' : 'bg-blue-50'}`}>
                <div className={`text-2xl font-bold text-blue-500`}>
                  {profile.stats?.videos_summarized || 0}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Videos Summarized
                </div>
              </div>

              <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-500/20' : 'bg-green-50'}`}>
                <div className={`text-2xl font-bold text-green-500`}>
                  {profile.stats?.shares || 0}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Social Shares
                </div>
              </div>

              <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-500/20' : 'bg-purple-50'}`}>
                <div className={`text-2xl font-bold text-purple-500`}>
                  {profile.stats?.collaborations || 0}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Collaborations
                </div>
              </div>

              <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-500/20' : 'bg-orange-50'}`}>
                <div className={`text-2xl font-bold text-orange-500`}>
                  {profile.stats?.streak || 0}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Day Streak
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
          <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Activity
          </h4>

          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-500/20' : 'bg-gray-100'}`}>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  No recent activity yet. Start summarizing videos to earn points!
                </p>
              </div>
            ) : (
              recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="text-lg">{getAchievementIcon(activity.type)}</div>
                  <div className="flex-1">
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {activity.description}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`font-bold text-green-500`}>
                    +{activity.points} XP
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const LeaderboardTab = () => (
    <div className="space-y-4">
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
        <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Global Leaderboard
        </h4>

        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <div className={`p-8 rounded-lg text-center ${darkMode ? 'bg-gray-500/20' : 'bg-gray-100'}`}>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                No leaderboard data available yet.
              </p>
            </div>
          ) : (
            leaderboard.map((player, index) => (
              <div
                key={player.user_id}
                className={`p-4 rounded-lg border ${
                  player.user_id === 'anonymous_user'
                    ? darkMode
                      ? 'border-blue-400 bg-blue-500/20'
                      : 'border-blue-400 bg-blue-50'
                    : darkMode
                      ? 'border-gray-500 bg-gray-600/30'
                      : 'border-gray-200 bg-white/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getRankIcon(index + 1)}</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        #{index + 1}
                      </span>
                    </div>

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      darkMode ? 'bg-gray-500' : 'bg-gray-300'
                    }`}>
                      {player.username?.charAt(0).toUpperCase() || 'U'}
                    </div>

                    <div>
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {player.username || `User ${player.user_id}`}
                        {player.user_id === 'anonymous_user' && (
                          <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                            You
                          </span>
                        )}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Level {Math.floor(player.xp / 1000) + 1}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {player.xp.toLocaleString()} XP
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {player.stats?.videos_summarized || 0} videos
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const AchievementsTab = () => (
    <div className="space-y-4">
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
        <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Your Achievements
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.length === 0 ? (
            <div className="col-span-full">
              <div className={`p-8 rounded-lg text-center ${darkMode ? 'bg-gray-500/20' : 'bg-gray-100'}`}>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  No achievements unlocked yet. Keep summarizing videos to earn them!
                </p>
              </div>
            </div>
          ) : (
            achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedAchievement === achievement.id
                    ? getRarityColor(achievement.rarity)
                    : darkMode
                      ? 'border-gray-500 bg-gray-600/30 hover:border-gray-400'
                      : 'border-gray-200 bg-white/50 hover:border-gray-300'
                }`}
                onClick={() => setSelectedAchievement(
                  selectedAchievement === achievement.id ? null : achievement.id
                )}
              >
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{getAchievementIcon(achievement.type)}</div>
                  <h5 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {achievement.name}
                  </h5>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {achievement.description}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded inline-block ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    +{achievement.reward_xp} XP
                  </div>

                  {achievement.unlocked && !achievement.claimed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        claimReward(achievement.id);
                      }}
                      disabled={loading}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded font-medium transition-all duration-200"
                    >
                      {loading ? 'Claiming...' : 'Claim'}
                    </button>
                  )}

                  {achievement.claimed && (
                    <div className="text-green-500 text-sm font-medium">
                      ✓ Claimed
                    </div>
                  )}
                </div>

                {selectedAchievement === achievement.id && (
                  <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <strong>How to unlock:</strong> {achievement.unlock_condition}
                    </div>
                    {achievement.progress && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress.current}/{achievement.progress.target}</span>
                        </div>
                        <div className={`w-full bg-gray-200 rounded-full h-1 ${darkMode ? 'bg-gray-700' : ''}`}>
                          <div
                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((achievement.progress.current / achievement.progress.target) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'achievements', label: 'Achievements', icon: '⭐' }
  ];

  return (
    <div className={`p-6 rounded-xl border-l-4 border-l-purple-500 ${darkMode ? 'bg-gray-700/50' : 'bg-purple-50/50'} backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Gamification Hub
          {loading && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </h3>

        {profile && (
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}>
              Level {getLevelProgress(profile.xp).currentLevel}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'
            }`}>
               {profile?.xp?.toLocaleString() || '0'} XP
            </div>
          </div>
        )}
      </div>

      {true ? ( // Always show for anonymous user
        <div className={`p-8 rounded-lg text-center ${darkMode ? 'bg-gray-600/50' : 'bg-gray-100'}`}>
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h4 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            User Profile Required
          </h4>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Please log in to access the gamification features and track your progress.
          </p>
        </div>
      ) : (
        <>
          <div className="flex space-x-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
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

          <div className="min-h-96">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'leaderboard' && <LeaderboardTab />}
            {activeTab === 'achievements' && <AchievementsTab />}
          </div>
        </>
      )}
    </div>
  );
};

export default GamificationPanel;
