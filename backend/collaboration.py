import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from collections import defaultdict
import uuid

class CollaborativeWorkspace:
    def __init__(self):
        self.workspaces: Dict[str, Dict[str, Any]] = {}
        self.active_sessions: Dict[str, List[str]] = defaultdict(list)
        self.annotations: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        self.discussions: Dict[str, List[Dict[str, Any]]] = defaultdict(list)

    def create_workspace(self, video_id: str, creator: str = "anonymous") -> str:
        """Create a new collaborative workspace for a video"""
        workspace_id = str(uuid.uuid4())

        self.workspaces[workspace_id] = {
            "id": workspace_id,
            "video_id": video_id,
            "creator": creator,
            "created_at": datetime.now().isoformat(),
            "participants": [creator],
            "settings": {
                "allow_annotations": True,
                "allow_discussions": True,
                "max_participants": 10,
                "auto_save": True
            },
            "metadata": {
                "video_title": "",
                "duration": 0,
                "current_time": 0,
                "status": "active"
            }
        }

        return workspace_id

    def join_workspace(self, workspace_id: str, user: str) -> Dict[str, Any]:
        """Join an existing collaborative workspace"""
        if workspace_id not in self.workspaces:
            return {"error": "Workspace not found"}

        workspace = self.workspaces[workspace_id]

        if user not in workspace["participants"]:
            if len(workspace["participants"]) >= workspace["settings"]["max_participants"]:
                return {"error": "Workspace is full"}

            workspace["participants"].append(user)

        return {
            "workspace": workspace,
            "annotations": self.annotations[workspace_id],
            "discussions": self.discussions[workspace_id],
            "participants_count": len(workspace["participants"])
        }

    def add_annotation(self, workspace_id: str, user: str, annotation: Dict[str, Any]) -> Dict[str, Any]:
        """Add an annotation to the workspace"""
        if workspace_id not in self.workspaces:
            return {"error": "Workspace not found"}

        annotation_entry = {
            "id": str(uuid.uuid4()),
            "user": user,
            "timestamp": datetime.now().isoformat(),
            "type": annotation.get("type", "note"),  # note, highlight, question, insight
            "content": annotation.get("content", ""),
            "video_time": annotation.get("video_time", 0),
            "position": annotation.get("position", {}),  # For UI positioning
            "votes": 0,
            "replies": []
        }

        self.annotations[workspace_id].append(annotation_entry)

        return {
            "annotation_id": annotation_entry["id"],
            "total_annotations": len(self.annotations[workspace_id])
        }

    def add_discussion(self, workspace_id: str, user: str, message: str, parent_id: Optional[str] = None) -> Dict[str, Any]:
        """Add a discussion message to the workspace"""
        if workspace_id not in self.workspaces:
            return {"error": "Workspace not found"}

        discussion_entry = {
            "id": str(uuid.uuid4()),
            "user": user,
            "timestamp": datetime.now().isoformat(),
            "message": message,
            "parent_id": parent_id,
            "replies": [],
            "reactions": defaultdict(int)
        }

        if parent_id:
            # Find parent message and add as reply
            for discussion in self.discussions[workspace_id]:
                if discussion["id"] == parent_id:
                    discussion["replies"].append(discussion_entry)
                    break
        else:
            self.discussions[workspace_id].append(discussion_entry)

        return {
            "message_id": discussion_entry["id"],
            "total_messages": len(self.discussions[workspace_id])
        }

    def get_workspace_summary(self, workspace_id: str) -> Dict[str, Any]:
        """Get a summary of workspace activity"""
        if workspace_id not in self.workspaces:
            return {"error": "Workspace not found"}

        workspace = self.workspaces[workspace_id]
        annotations = self.annotations[workspace_id]
        discussions = self.discussions[workspace_id]

        # Calculate engagement metrics
        total_annotations = len(annotations)
        total_discussions = len(discussions)
        total_participants = len(workspace["participants"])

        # Get most active participants
        participant_activity = defaultdict(int)
        for annotation in annotations:
            participant_activity[annotation["user"]] += 1
        for discussion in discussions:
            participant_activity[discussion["user"]] += 1

        most_active = sorted(participant_activity.items(), key=lambda x: x[1], reverse=True)[:3]

        # Get recent activity
        recent_annotations = sorted(annotations, key=lambda x: x["timestamp"], reverse=True)[:5]
        recent_discussions = sorted(discussions, key=lambda x: x["timestamp"], reverse=True)[:5]

        return {
            "workspace_info": workspace,
            "engagement_metrics": {
                "total_annotations": total_annotations,
                "total_discussions": total_discussions,
                "total_participants": total_participants,
                "avg_annotations_per_participant": round(total_annotations / max(total_participants, 1), 2),
                "most_active_participants": most_active
            },
            "recent_activity": {
                "annotations": recent_annotations,
                "discussions": recent_discussions
            },
            "collaboration_score": min(100, (total_annotations + total_discussions * 2) * 5)
        }

    def export_workspace(self, workspace_id: str) -> Dict[str, Any]:
        """Export workspace data for sharing or backup"""
        if workspace_id not in self.workspaces:
            return {"error": "Workspace not found"}

        return {
            "workspace": self.workspaces[workspace_id],
            "annotations": self.annotations[workspace_id],
            "discussions": self.discussions[workspace_id],
            "export_timestamp": datetime.now().isoformat(),
            "version": "1.0"
        }

class LiveCollaborationManager:
    def __init__(self):
        self.active_users: Dict[str, Dict[str, Any]] = {}
        self.user_sessions: Dict[str, str] = {}  # user_id -> session_id

    def user_joined(self, user_id: str, session_id: str, user_info: Dict[str, Any]):
        """Handle user joining a live session"""
        self.active_users[user_id] = {
            "session_id": session_id,
            "user_info": user_info,
            "joined_at": datetime.now().isoformat(),
            "last_activity": datetime.now().isoformat(),
            "status": "active"
        }
        self.user_sessions[user_id] = session_id

    def user_left(self, user_id: str):
        """Handle user leaving a live session"""
        if user_id in self.active_users:
            self.active_users[user_id]["status"] = "inactive"
            self.active_users[user_id]["left_at"] = datetime.now().isoformat()

    def update_activity(self, user_id: str):
        """Update user's last activity timestamp"""
        if user_id in self.active_users:
            self.active_users[user_id]["last_activity"] = datetime.now().isoformat()

    def get_active_users(self, session_id: str) -> List[Dict[str, Any]]:
        """Get list of active users in a session"""
        return [
            user for user in self.active_users.values()
            if user["session_id"] == session_id and user["status"] == "active"
        ]

    def broadcast_message(self, session_id: str, message: Dict[str, Any], sender_id: str):
        """Broadcast a message to all users in a session"""
        # In a real implementation, this would use WebSocket broadcasting
        active_users = self.get_active_users(session_id)

        message["timestamp"] = datetime.now().isoformat()
        message["sender"] = sender_id

        # Here we would send the message to all active users via WebSocket
        print(f"Broadcasting message to {len(active_users)} users in session {session_id}")

        return {
            "broadcasted_to": len(active_users),
            "message_id": str(uuid.uuid4()),
            "timestamp": message["timestamp"]
        }

# Global instances
workspace_manager = CollaborativeWorkspace()
live_manager = LiveCollaborationManager()
