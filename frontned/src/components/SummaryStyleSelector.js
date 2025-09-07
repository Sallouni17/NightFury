import React from 'react';

const SummaryStyleSelector = ({ summaryStyle, setSummaryStyle, darkMode }) => {
  const styles = [
    {
      value: "paragraph",
      label: "Paragraph",
      desc: "Traditional paragraph format",
      icon: "📄"
    },
    {
      value: "bullets",
      label: "Bullet Points",
      desc: "Key points in bullet format",
      icon: "📝"
    },
    {
      value: "detailed",
      label: "Detailed",
      desc: "More comprehensive summary",
      icon: "📖"
    }
  ];

  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Summary Style
      </label>
      <div className="flex space-x-2">
        {styles.map((style) => (
          <button
            key={style.value}
            onClick={() => setSummaryStyle(style.value)}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex-1 ${
              summaryStyle === style.value
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center mb-1">
              <span className="text-lg mr-2">{style.icon}</span>
              <span>{style.label}</span>
            </div>
            <div className={`text-xs ${summaryStyle === style.value ? 'text-purple-100' : 'text-gray-500'}`}>
              {style.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SummaryStyleSelector;
