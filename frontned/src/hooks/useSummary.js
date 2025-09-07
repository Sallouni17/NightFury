import { useState } from 'react';
import axios from 'axios';

const useSummary = () => {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [summaryLength, setSummaryLength] = useState("medium");
  const [summaryStyle, setSummaryStyle] = useState("paragraph");
  const [analysis, setAnalysis] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const extractVideoId = (url) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === 'youtu.be') {
        return parsedUrl.pathname.slice(1);
      } else if (parsedUrl.hostname.includes('youtube.com')) {
        return parsedUrl.searchParams.get('v');
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleSummarize = async () => {
    if (!url) return alert("Please enter a YouTube URL");

    const videoId = extractVideoId(url);
    if (!videoId) return alert("Invalid YouTube URL. Please enter a valid YouTube link.");

    setLoading(true);
    setSummary("");
    setVideoInfo(null);

    try {
      console.log('Making request to backend...');
      const res = await axios.post("http://127.0.0.1:8000/summarize", {
        video_id: videoId,
        length: summaryLength,
        style: summaryStyle
      }, {
        timeout: 60000, // 60 second timeout for CPU processing
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Request successful:', res.status);

      if (res.data.summary) {
        setSummary(res.data.summary);
        setVideoInfo(res.data.video_info);
        setAnalysis(res.data.analysis);
        setMetadata(res.data.metadata);

        // Save to history
        const summaryData = {
          id: Date.now().toString(),
          url: url,
          summary: res.data.summary,
          videoInfo: res.data.video_info,
          summaryLength: summaryLength,
          summaryStyle: summaryStyle,
          analysis: res.data.analysis,
          timestamp: new Date().toISOString()
        };

        const existingHistory = JSON.parse(localStorage.getItem('youtube_summaries_history') || '[]');
        const updatedHistory = [summaryData, ...existingHistory].slice(0, 50); // Keep last 50 summaries
        localStorage.setItem('youtube_summaries_history', JSON.stringify(updatedHistory));

      } else {
        setSummary("No summary available. Try another video.");
      }
    } catch (err) {
      console.error('Full error details:', err);
      if (err.code === 'NETWORK_ERROR') {
        setSummary("Network Error: Cannot connect to backend server. Please ensure the backend is running on port 8000. Try refreshing the page.");
      } else if (err.code === 'ECONNABORTED') {
        setSummary("Processing Timeout: The video is taking longer than expected to process. This may happen with longer videos or when using CPU processing. Please try again or use a shorter video.");
      } else if (err.response && err.response.data && err.response.data.error) {
        setSummary(`Error: ${err.response.data.error}`);
      } else if (err.message) {
        setSummary(`Error: ${err.message}`);
      } else {
        setSummary("Error: Could not summarize this video. Please check the console for details.");
      }
    }

    setLoading(false);
  };

  return {
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
  };
};

export default useSummary;
