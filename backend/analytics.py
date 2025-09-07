import asyncio
import aiohttp
from typing import List, Dict, Any
import json
from datetime import datetime, timedelta
import os

class YouTubeAnalytics:
    def __init__(self):
        self.api_key = os.getenv('YOUTUBE_API_KEY', '')
        self.base_url = 'https://www.googleapis.com/youtube/v3'

    async def get_video_stats(self, video_id: str) -> Dict[str, Any]:
        """Get real-time video statistics from YouTube API"""
        if not self.api_key:
            return {"error": "YouTube API key not configured"}

        url = f"{self.base_url}/videos"
        params = {
            'part': 'statistics,snippet',
            'id': video_id,
            'key': self.api_key
        }

        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    if data['items']:
                        item = data['items'][0]
                        return {
                            'title': item['snippet']['title'],
                            'channel': item['snippet']['channelTitle'],
                            'views': int(item['statistics'].get('viewCount', 0)),
                            'likes': int(item['statistics'].get('likeCount', 0)),
                            'comments': int(item['statistics'].get('commentCount', 0)),
                            'duration': item['snippet'].get('duration', ''),
                            'published_at': item['snippet']['publishedAt']
                        }
        return {"error": "Failed to fetch video stats"}

    async def get_channel_info(self, channel_id: str) -> Dict[str, Any]:
        """Get channel information and subscriber count"""
        if not self.api_key:
            return {"error": "YouTube API key not configured"}

        url = f"{self.base_url}/channels"
        params = {
            'part': 'statistics,snippet',
            'id': channel_id,
            'key': self.api_key
        }

        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    if data['items']:
                        item = data['items'][0]
                        return {
                            'name': item['snippet']['title'],
                            'subscribers': int(item['statistics'].get('subscriberCount', 0)),
                            'videos': int(item['statistics'].get('videoCount', 0)),
                            'description': item['snippet']['description'][:200]
                        }
        return {"error": "Failed to fetch channel info"}

    def calculate_engagement_rate(self, views: int, likes: int, comments: int) -> float:
        """Calculate video engagement rate"""
        if views == 0:
            return 0.0
        return round(((likes + comments) / views) * 100, 2)

    def predict_viral_potential(self, stats: Dict[str, Any]) -> Dict[str, Any]:
        """Predict viral potential based on current stats"""
        views = stats.get('views', 0)
        engagement = self.calculate_engagement_rate(
            views,
            stats.get('likes', 0),
            stats.get('comments', 0)
        )

        # Simple viral prediction algorithm
        viral_score = 0

        if views > 1000000:
            viral_score += 30
        elif views > 100000:
            viral_score += 20
        elif views > 10000:
            viral_score += 10

        if engagement > 5:
            viral_score += 25
        elif engagement > 2:
            viral_score += 15
        elif engagement > 1:
            viral_score += 5

        # Time-based factor (newer videos have higher potential)
        published_date = stats.get('published_at', '')
        days_old = 30  # default value
        if published_date:
            try:
                pub_date = datetime.fromisoformat(published_date.replace('Z', '+00:00'))
                days_old = (datetime.now(pub_date.tzinfo) - pub_date).days
                if days_old < 7:
                    viral_score += 20
                elif days_old < 30:
                    viral_score += 10
            except:
                pass

        viral_potential = "Low"
        if viral_score > 50:
            viral_potential = "High"
        elif viral_score > 25:
            viral_potential = "Medium"

        return {
            'score': viral_score,
            'potential': viral_potential,
            'engagement_rate': engagement,
            'factors': {
                'view_threshold': views > 10000,
                'high_engagement': engagement > 2,
                'recent_content': days_old < 30 if 'days_old' in locals() else False
            }
        }
