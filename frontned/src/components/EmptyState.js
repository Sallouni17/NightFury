import React from 'react';

const EmptyState = ({ darkMode }) => {
  return (
    <div className={`p-8 rounded-xl border-2 border-dashed ${darkMode ? 'border-gray-600 bg-gray-700/20' : 'border-gray-300 bg-gray-50/50'} text-center`}>
      <svg className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Your summary will appear here
      </p>
      <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Paste a YouTube URL and click summarize
      </p>
    </div>
  );
};

export default EmptyState;
