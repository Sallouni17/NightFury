import React, { useState, useEffect, useRef } from 'react';

const CollaborationWorkspace = ({ videoId, darkMode }) => {
  const [workspace, setWorkspace] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState('');
  const [newDiscussion, setNewDiscussion] = useState('');
  const [activeTab, setActiveTab] = useState('annotations');
  const [loading, setLoading] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);

  const discussionRef = useRef(null);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/workspace/${videoId}`);
        const data = await response.json();

        if (!data.error) {
          setWorkspace(data);
          setMembers(data.members || []);
        }
      } catch (error) {
        console.error('Failed to fetch workspace:', error);
      }
    };

    const fetchAnnotations = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/workspace/${videoId}/annotations`);
        const data = await response.json();

        if (!data.error) {
          setAnnotations(data.annotations || []);
        }
      } catch (error) {
        console.error('Failed to fetch annotations:', error);
      }
    };

    const fetchDiscussions = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/workspace/${videoId}/discussions`);
        const data = await response.json();

        if (!data.error) {
          setDiscussions(data.discussions || []);
        }
      } catch (error) {
        console.error('Failed to fetch discussions:', error);
      }
    };

    if (videoId) {
      fetchWorkspace();
      fetchAnnotations();
      fetchDiscussions();
    }
  }, [videoId]);

  useEffect(() => {
    if (discussionRef.current) {
      discussionRef.current.scrollTop = discussionRef.current.scrollHeight;
    }
  }, [discussions]);

  const createWorkspace = async () => {
    if (!videoId) return;

    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/workspace/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_id: videoId,
          title: `Workspace for ${videoId}`,
          description: 'Collaborative workspace for video analysis'
        })
      });

      const data = await response.json();

      if (!data.error) {
        setWorkspace(data);
        setMembers(['Anonymous User']); // Add anonymous user as first member
      }
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
    setLoading(false);
  };

  const addAnnotation = async () => {
    if (!newAnnotation.trim() || !workspace) return;

    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/workspace/${videoId}/annotations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'anonymous_user',
          content: newAnnotation,
          timestamp: new Date().toISOString(),
          type: 'text'
        })
      });

      const data = await response.json();

      if (!data.error) {
        setAnnotations(prev => [...prev, data]);
        setNewAnnotation('');
      }
    } catch (error) {
      console.error('Failed to add annotation:', error);
    }
    setLoading(false);
  };

  const addDiscussion = async () => {
    if (!newDiscussion.trim() || !workspace) return;

    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/workspace/${videoId}/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'anonymous_user',
          message: newDiscussion,
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();

      if (!data.error) {
        setDiscussions(prev => [...prev, data]);
        setNewDiscussion('');
      }
    } catch (error) {
      console.error('Failed to add discussion:', error);
    }
    setLoading(false);
  };

  const inviteMember = async () => {
    if (!inviteEmail.trim() || !workspace) return;

    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/workspace/${videoId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail,
          invited_by: 'anonymous_user'
        })
      });

      const data = await response.json();

      if (!data.error) {
        setInviteEmail('');
        // Add the invited member to the local state
        setMembers(prev => [...prev, inviteEmail]);
      }
    } catch (error) {
      console.error('Failed to invite member:', error);
    }
    setLoading(false);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getAnnotationTypeIcon = (type) => {
    switch (type) {
      case 'highlight': return '🟡';
      case 'note': return '📝';
      case 'question': return '❓';
      default: return '💬';
    }
  };

  const AnnotationsTab = () => (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
        <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Add New Annotation
        </h4>

        <div className="space-y-3">
          <textarea
            value={newAnnotation}
            onChange={(e) => setNewAnnotation(e.target.value)}
            placeholder="Add your annotation or note..."
            rows={3}
            className={`w-full px-3 py-2 rounded-lg border resize-none ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />

          <button
            onClick={addAnnotation}
            disabled={!newAnnotation.trim() || loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200"
          >
            {loading ? 'Adding...' : 'Add Annotation'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {annotations.length === 0 ? (
          <div className={`p-8 rounded-lg text-center ${darkMode ? 'bg-gray-600/50' : 'bg-gray-100'}`}>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              No annotations yet. Be the first to add one!
            </p>
          </div>
        ) : (
          annotations.map((annotation) => (
            <div
              key={annotation.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedAnnotation === annotation.id
                  ? darkMode
                    ? 'border-blue-400 bg-blue-500/20'
                    : 'border-blue-400 bg-blue-50'
                  : darkMode
                    ? 'border-gray-500 bg-gray-600/30'
                    : 'border-gray-200 bg-white/50'
              }`}
              onClick={() => setSelectedAnnotation(
                selectedAnnotation === annotation.id ? null : annotation.id
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{getAnnotationTypeIcon(annotation.type)}</span>
                  <div className="flex-1">
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {annotation.user_name || `User ${annotation.user_id}`}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      {formatTimestamp(annotation.timestamp)}
                    </div>
                    <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {annotation.content}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {annotation.likes && (
                    <div className={`flex items-center space-x-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span>{annotation.likes}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedAnnotation === annotation.id && (
                <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                  <div className="flex space-x-2">
                    <button className={`px-3 py-1 rounded text-sm ${
                      darkMode ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}>
                      👍 Like
                    </button>
                    <button className={`px-3 py-1 rounded text-sm ${
                      darkMode ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}>
                      💬 Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const DiscussionsTab = () => (
    <div className="space-y-4">
      <div
        ref={discussionRef}
        className={`h-96 overflow-y-auto p-4 rounded-lg border ${
          darkMode ? 'bg-gray-600/50 border-gray-500' : 'bg-white/50 border-gray-200'
        }`}
      >
        {discussions.length === 0 ? (
          <div className="text-center py-8">
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              No discussions yet. Start the conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div key={discussion.id} className="flex space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  darkMode ? 'bg-gray-500' : 'bg-gray-300'
                }`}>
                  {(discussion.user_name || `User ${discussion.user_id}`).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {discussion.user_name || `User ${discussion.user_id}`}
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatTimestamp(discussion.timestamp)}
                    </span>
                  </div>
                  <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {discussion.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newDiscussion}
            onChange={(e) => setNewDiscussion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addDiscussion()}
            placeholder="Type your message..."
            className={`flex-1 px-3 py-2 rounded-lg border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          <button
            onClick={addDiscussion}
            disabled={!newDiscussion.trim() || loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );

  const MembersTab = () => (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
        <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Invite New Member
        </h4>

        <div className="flex space-x-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter email address..."
            className={`flex-1 px-3 py-2 rounded-lg border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          <button
            onClick={inviteMember}
            disabled={!inviteEmail.trim() || loading}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200"
          >
            {loading ? 'Inviting...' : 'Invite'}
          </button>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'}`}>
        <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Workspace Members ({members.length})
        </h4>

        <div className="space-y-3">
          {members.map((member, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                darkMode ? 'bg-gray-500' : 'bg-gray-300'
              }`}>
                {typeof member === 'string' ? member.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {typeof member === 'string' ? member : `User ${member}`}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {index === 0 ? 'Workspace Owner' : 'Member'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'annotations', label: 'Annotations', icon: '📝' },
    { id: 'discussions', label: 'Discussions', icon: '💬' },
    { id: 'members', label: 'Members', icon: '👥' }
  ];

  return (
    <div className={`p-6 rounded-xl border-l-4 border-l-green-500 ${darkMode ? 'bg-gray-700/50' : 'bg-green-50/50'} backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
          </svg>
          Collaboration Workspace
          {loading && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </h3>

        {!workspace && (
          <button
            onClick={createWorkspace}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200"
          >
            Create Workspace
          </button>
        )}

        {workspace && (
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded text-xs ${
              isRealTimeEnabled
                ? 'bg-green-500 text-white'
                : darkMode
                  ? 'bg-gray-600 text-gray-300'
                  : 'bg-gray-200 text-gray-700'
            }`}>
              {isRealTimeEnabled ? '🟢 Live' : '⚪ Offline'}
            </div>
            <button
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                isRealTimeEnabled
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isRealTimeEnabled ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        )}
      </div>

      {!workspace ? (
        <div className={`p-8 rounded-lg text-center ${darkMode ? 'bg-gray-600/50' : 'bg-gray-100'}`}>
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h4 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No Workspace Yet
          </h4>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Create a collaborative workspace to start annotating and discussing this video with others.
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
                    ? 'bg-green-500 text-white'
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
            {activeTab === 'annotations' && <AnnotationsTab />}
            {activeTab === 'discussions' && <DiscussionsTab />}
            {activeTab === 'members' && <MembersTab />}
          </div>
        </>
      )}
    </div>
  );
};

export default CollaborationWorkspace;
