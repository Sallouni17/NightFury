import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from collections import defaultdict
import uuid

class GamificationEngine:
    def __init__(self):
        self.user_profiles: Dict[str, Dict[str, Any]] = {}
        self.achievements: Dict[str, Dict[str, Any]] = {}
        self.leaderboards: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        self.daily_challenges: List[Dict[str, Any]] = []
        self.user_stats: Dict[str, Dict[str, Any]] = defaultdict(dict)

        self._initialize_achievements()
        self._initialize_challenges()

    def _initialize_achievements(self):
        """Initialize the achievement system"""
        self.achievements = {
            "first_summary": {
                "id": "first_summary",
                "name": "First Steps",
                "description": "Create your first video summary",
                "icon": "🎯",
                "points": 10,
                "category": "milestone"
            },
            "speed_demon": {
                "id": "speed_demon",
                "name": "Speed Demon",
                "description": "Summarize 5 videos in under 30 seconds each",
                "icon": "⚡",
                "points": 25,
                "category": "performance"
            },
            "social_butterfly": {
                "id": "social_butterfly",
                "name": "Social Butterfly",
                "description": "Share 10 summaries on social media",
                "icon": "🦋",
                "points": 30,
                "category": "social"
            },
            "collaborator": {
                "id": "collaborator",
                "name": "Team Player",
                "description": "Participate in 5 collaborative workspaces",
                "icon": "🤝",
                "points": 20,
                "category": "collaboration"
            },
            "analyst": {
                "id": "analyst",
                "name": "Deep Analyst",
                "description": "Use advanced analysis on 20 videos",
                "icon": "🔍",
                "points": 35,
                "category": "analysis"
            },
            "trendsetter": {
                "id": "trendsetter",
                "name": "Trendsetter",
                "description": "Be the first to analyze a video that goes viral",
                "icon": "📈",
                "points": 50,
                "category": "special"
            },
            "quality_expert": {
                "id": "quality_expert",
                "name": "Quality Expert",
                "description": "Maintain 95%+ accuracy rating on summaries",
                "icon": "⭐",
                "points": 40,
                "category": "quality"
            }
        }

    def _initialize_challenges(self):
        """Initialize daily/weekly challenges"""
        self.daily_challenges = [
            {
                "id": "daily_summaries",
                "title": "Summary Sprint",
                "description": "Create 5 video summaries today",
                "reward_points": 15,
                "type": "daily",
                "target": 5,
                "metric": "summaries_created"
            },
            {
                "id": "social_sharing",
                "title": "Share the Knowledge",
                "description": "Share 3 summaries on social media",
                "reward_points": 20,
                "type": "daily",
                "target": 3,
                "metric": "social_shares"
            },
            {
                "id": "collaboration_challenge",
                "title": "Collaborate & Conquer",
                "description": "Join 2 collaborative workspaces",
                "reward_points": 25,
                "type": "weekly",
                "target": 2,
                "metric": "workspaces_joined"
            }
        ]

    def get_or_create_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Get or create a user profile"""
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = {
                "user_id": user_id,
                "username": f"User_{user_id[:8]}",
                "level": 1,
                "experience_points": 0,
                "total_points": 0,
                "achievements": [],
                "stats": {
                    "summaries_created": 0,
                    "videos_analyzed": 0,
                    "social_shares": 0,
                    "workspaces_joined": 0,
                    "annotations_added": 0,
                    "discussions_started": 0,
                    "accuracy_rating": 100.0
                },
                "current_challenges": {},
                "badges": [],
                "joined_at": datetime.now().isoformat(),
                "last_active": datetime.now().isoformat()
            }

        return self.user_profiles[user_id]

    def award_points(self, user_id: str, points: int, reason: str) -> Dict[str, Any]:
        """Award points to a user"""
        profile = self.get_or_create_user_profile(user_id)

        profile["experience_points"] += points
        profile["total_points"] += points

        # Check for level up
        old_level = profile["level"]
        new_level = (profile["experience_points"] // 100) + 1

        leveled_up = False
        if new_level > old_level:
            profile["level"] = new_level
            leveled_up = True

        # Update last active
        profile["last_active"] = datetime.now().isoformat()

        return {
            "points_awarded": points,
            "new_total": profile["total_points"],
            "leveled_up": leveled_up,
            "new_level": new_level if leveled_up else old_level,
            "reason": reason
        }

    def check_achievements(self, user_id: str) -> List[Dict[str, Any]]:
        """Check if user has unlocked any new achievements"""
        profile = self.get_or_create_user_profile(user_id)
        new_achievements = []

        for achievement_id, achievement in self.achievements.items():
            if achievement_id not in profile["achievements"]:
                if self._check_achievement_criteria(user_id, achievement_id):
                    profile["achievements"].append(achievement_id)
                    new_achievements.append(achievement)

                    # Award achievement points
                    self.award_points(user_id, achievement["points"], f"Achievement unlocked: {achievement['name']}")

        return new_achievements

    def _check_achievement_criteria(self, user_id: str, achievement_id: str) -> bool:
        """Check if user meets achievement criteria"""
        profile = self.user_profiles[user_id]
        stats = profile["stats"]

        criteria = {
            "first_summary": stats["summaries_created"] >= 1,
            "speed_demon": stats.get("fast_summaries", 0) >= 5,
            "social_butterfly": stats["social_shares"] >= 10,
            "collaborator": stats["workspaces_joined"] >= 5,
            "analyst": stats.get("advanced_analyses", 0) >= 20,
            "trendsetter": stats.get("viral_predictions_correct", 0) >= 1,
            "quality_expert": stats["accuracy_rating"] >= 95.0
        }

        return criteria.get(achievement_id, False)

    def update_user_stats(self, user_id: str, stat_name: str, value: int = 1):
        """Update user statistics"""
        profile = self.get_or_create_user_profile(user_id)

        if stat_name not in profile["stats"]:
            profile["stats"][stat_name] = 0

        profile["stats"][stat_name] += value

        # Check for new achievements
        new_achievements = self.check_achievements(user_id)

        return {
            "stat_updated": stat_name,
            "new_value": profile["stats"][stat_name],
            "new_achievements": new_achievements
        }

    def get_daily_challenges(self, user_id: str) -> List[Dict[str, Any]]:
        """Get daily challenges for a user"""
        profile = self.get_or_create_user_profile(user_id)

        challenges_with_progress = []

        for challenge in self.daily_challenges:
            challenge_id = challenge["id"]
            current_progress = profile["stats"].get(challenge["metric"], 0)
            target = challenge["target"]
            completed = current_progress >= target

            challenges_with_progress.append({
                **challenge,
                "current_progress": current_progress,
                "completed": completed,
                "progress_percentage": min(100, (current_progress / target) * 100)
            })

        return challenges_with_progress

    def complete_challenge(self, user_id: str, challenge_id: str) -> Dict[str, Any]:
        """Mark a challenge as completed and award points"""
        profile = self.get_or_create_user_profile(user_id)

        # Find the challenge
        challenge = next((c for c in self.daily_challenges if c["id"] == challenge_id), None)

        if not challenge:
            return {"error": "Challenge not found"}

        # Check if already completed today
        if profile["current_challenges"].get(challenge_id):
            return {"error": "Challenge already completed"}

        # Mark as completed
        profile["current_challenges"][challenge_id] = datetime.now().isoformat()

        # Award points
        points_result = self.award_points(user_id, challenge["reward_points"], f"Challenge completed: {challenge['title']}")

        return {
            "challenge_completed": challenge_id,
            "reward": challenge["reward_points"],
            "points_result": points_result
        }

    def get_leaderboard(self, category: str = "total_points", limit: int = 10) -> List[Dict[str, Any]]:
        """Get leaderboard for a specific category"""
        if category not in self.leaderboards or not self.leaderboards[category]:
            # Rebuild leaderboard
            sorted_users = sorted(
                self.user_profiles.values(),
                key=lambda x: x.get("total_points", 0) if category == "total_points" else x["stats"].get(category, 0),
                reverse=True
            )
            self.leaderboards[category] = sorted_users[:limit]

        return self.leaderboards[category][:limit]

    def get_user_rankings(self, user_id: str) -> Dict[str, Any]:
        """Get user's ranking in various categories"""
        if user_id not in self.user_profiles:
            return {"error": "User not found"}

        rankings = {}

        for category in ["total_points", "summaries_created", "social_shares", "workspaces_joined"]:
            leaderboard = self.get_leaderboard(category, limit=1000)  # Get more to find user rank

            for rank, user in enumerate(leaderboard, 1):
                if user["user_id"] == user_id:
                    rankings[category] = {
                        "rank": rank,
                        "value": user.get("total_points", 0) if category == "total_points" else user["stats"].get(category, 0),
                        "total_competitors": len(leaderboard)
                    }
                    break

        return rankings

    def get_gamification_summary(self, user_id: str) -> Dict[str, Any]:
        """Get complete gamification summary for a user"""
        profile = self.get_or_create_user_profile(user_id)
        new_achievements = self.check_achievements(user_id)

        return {
            "profile": profile,
            "daily_challenges": self.get_daily_challenges(user_id),
            "rankings": self.get_user_rankings(user_id),
            "new_achievements": new_achievements,
            "next_level_progress": {
                "current_xp": profile["experience_points"],
                "next_level_xp": (profile["level"]) * 100,
                "progress_percentage": ((profile["experience_points"] % 100) / 100) * 100
            }
        }

# Global gamification instance
gamification = GamificationEngine()
