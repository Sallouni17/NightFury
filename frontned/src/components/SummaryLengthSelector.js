import React from 'react';

const SummaryLengthSelector = ({ summaryLength, setSummaryLength, darkMode }) => {
  const options = [
    { value: "short", label: "Short", desc: "~50 words" },
    { value: "medium", label: "Medium", desc: "~100 words" },
    { value: "long", label: "Long", desc: "~150 words" }
  ];

  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Summary Length
      </label>
      <div className="flex space-x-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setSummaryLength(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              summaryLength === option.value
                ? 'bg-blue-500 text-white shadow-md'
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div>{option.label}</div>
            <div className={`text-xs ${summaryLength === option.value ? 'text-blue-100' : 'text-gray-500'}`}>
              {option.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SummaryLengthSelector;
