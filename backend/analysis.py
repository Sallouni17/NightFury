from typing import List, Dict, Any
import re
from collections import Counter

def analyze_sentiment(text: str) -> Dict[str, Any]:
    """Analyze sentiment using simple text analysis"""
    try:
        positive_words = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'best', 'perfect', 'awesome']
        negative_words = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing', 'poor', 'fail', 'wrong']

        words = text.lower().split()
        positive_count = sum(1 for word in words if word in positive_words)
        negative_count = sum(1 for word in words if word in negative_words)

        total_sentiment_words = positive_count + negative_count
        if total_sentiment_words == 0:
            sentiment_score = 0
        else:
            sentiment_score = (positive_count - negative_count) / total_sentiment_words

        # Determine sentiment label
        if sentiment_score > 0.1:
            label = "POSITIVE"
        elif sentiment_score < -0.1:
            label = "NEGATIVE"
        else:
            label = "NEUTRAL"

        return {
            "compound_score": sentiment_score,
            "pos": positive_count / len(words) if words else 0,
            "neg": negative_count / len(words) if words else 0,
            "neu": (len(words) - total_sentiment_words) / len(words) if words else 1,
            "sentiment_label": label,
            "sentiment_confidence": abs(sentiment_score)
        }
    except Exception as e:
        return {"error": f"Sentiment analysis failed: {str(e)}"}

def extract_topics(text: str) -> List[Dict[str, Any]]:
    """Extract key topics using keyword analysis"""
    try:
        # Define topic keywords
        topic_keywords = {
            "technology": ["tech", "software", "computer", "digital", "app", "web", "code", "programming", "ai", "machine learning"],
            "business": ["business", "company", "market", "finance", "money", "profit", "sales", "customer", "strategy"],
            "education": ["learn", "study", "course", "tutorial", "teach", "school", "university", "knowledge", "skill"],
            "entertainment": ["fun", "game", "movie", "music", "show", "entertainment", "celebrity", "hollywood"],
            "health": ["health", "medical", "doctor", "disease", "treatment", "fitness", "exercise", "diet"],
            "science": ["science", "research", "experiment", "discovery", "theory", "physics", "chemistry", "biology"]
        }

        words = text.lower().split()
        topic_scores = {}

        for topic, keywords in topic_keywords.items():
            score = sum(1 for word in words if word in keywords)
            if score > 0:
                topic_scores[topic] = score

        # Return top 3 topics
        sorted_topics = sorted(topic_scores.items(), key=lambda x: x[1], reverse=True)
        topics = []
        for topic, score in sorted_topics[:3]:
            confidence = min(score / 10, 1.0)  # Normalize confidence
            topics.append({
                "topic": topic,
                "confidence": confidence
            })

        # If no topics found, add general
        if not topics:
            topics = [{"topic": "general", "confidence": 0.5}]

        return topics
    except Exception as e:
        return [{"topic": "general", "confidence": 0.5}]

def extract_key_phrases(text: str) -> List[Dict[str, Any]]:
    """Extract key phrases and important terms"""
    try:
        # Simple keyword extraction using frequency
        words = re.findall(r'\b\w+\b', text.lower())
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'}

        filtered_words = [word for word in words if len(word) > 3 and word not in stop_words]
        word_freq = Counter(filtered_words)

        # Get top keywords
        keywords = []
        for word, freq in word_freq.most_common(8):
            keywords.append({
                "word": word,
                "frequency": freq,
                "importance_score": freq / len(filtered_words) if filtered_words else 0
            })

        return keywords
    except Exception as e:
        return []
