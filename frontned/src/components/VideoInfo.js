import React from 'react';

const VideoInfo = ({ videoInfo, darkMode }) => {
  if (!videoInfo) return null;

  return (
    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'} border ${darkMode ? 'border-gray-600' : 'border-blue-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
          </div>
          <div>
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Video ID: {videoInfo.video_id}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Transcript: {videoInfo.transcript_available ? 'Available' : 'Not Available'} • Language: {videoInfo.language}
            </p>
          </div>
        </div>
        <a
          href={videoInfo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all duration-200 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
          Watch
        </a>
      </div>
    </div>
  );
};

export default VideoInfo;
