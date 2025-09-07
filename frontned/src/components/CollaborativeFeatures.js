import React, { useState, useEffect } from 'react';

const CollaborativeFeatures = ({ videoId, currentUser, darkMode }) => {
  const [collaborators, setCollaborators] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiveSession, setIsLiveSession] = useState(false);

  useEffect(() => {
    if (videoId) {
      // Simulate loading collaborative data
      loadCollaborativeData();
    }
  }, [videoId]);

  const loadCollaborativeData = () => {
    // Mock data - in real implementation, this would come from a backend
    setCollaborators([
      { id: 1, name: 'Alice Johnson', avatar: '👩‍💻', status: 'online', role: 'Lead Analyst' },
      { id: 2, name: 'Bob Smith', avatar: '👨‍🔬', status: 'online', role: 'Content Reviewer' },
      { id: 3, name: 'Carol Davis', avatar: '👩‍🎨', status: 'away', role: 'Visualizer' }
    ]);

    setComments([
      {
        id: 1,
        user: 'Alice Johnson',
        avatar: '👩‍💻',
        text: 'Great analysis! The sentiment shift at 2:30 is particularly interesting.',
        timestamp: '2 minutes ago',
        likes: 3
      },
      {
        id: 2,
        user: 'Bob Smith',
        avatar: '👨‍🔬',
        text: 'I agree. This could be a key turning point in the discussion.',
        timestamp: '1 minute ago',
        likes: 1
      }
    ]);
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        user: currentUser || 'You',
        avatar: '👤',
        text: newComment,
        timestamp: 'Just now',
        likes: 0
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const startLiveSession = () => {
    setIsLiveSession(true);
    // In real implementation, this would connect to a WebSocket or real-time service
  };

  return (
    <div className={`p-6 rounded-xl border-l-4 border-l-teal-500 ${darkMode ? 'bg-gray-700/50' : 'bg-teal-50/50'} backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <svg className="w-5 h-5 mr-2 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Collaborative Analysis
        </h3>

        <button
          onClick={startLiveSession}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isLiveSession
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-teal-500 hover:bg-teal-600 text-white'
          }`}
        >
          {isLiveSession ? 'End Live Session' : 'Start Live Session'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Active Collaborators */}
        <div>
          <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Active Collaborators ({collaborators.length})
          </h4>
          <div className="space-y-3">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{collaborator.avatar}</div>
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {collaborator.name}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {collaborator.role}
                    </div>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  collaborator.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments/Annotations */}
        <div>
          <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Discussion ({comments.length})
          </h4>

          {/* Add Comment */}
          <div className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment or annotation..."
                className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                  darkMode
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300'
                } border focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                onKeyPress={(e) => e.key === 'Enter' && addComment()}
              />
              <button
                onClick={addComment}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
              >
                Post
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
                <div className="flex items-start space-x-3">
                  <div className="text-xl">{comment.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {comment.user}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {comment.timestamp}
                      </div>
                    </div>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {comment.text}
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <button className={`text-xs ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}>
                        👍 {comment.likes}
                      </button>
                      <button className={`text-xs ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Session Indicator */}
      {isLiveSession && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Live Collaborative Session Active
              </span>
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              3 collaborators online
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeFeatures;
