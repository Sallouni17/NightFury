from typing import Dict, Any, List
import analysis

def analyze_realtime_segments(text: str) -> Dict[str, Any]:
    """Analyze transcript in real-time segments for timeline visualization"""
    try:
        # Split transcript into segments for timeline analysis
        words = text.split()
        segment_size = len(words) // 10  # 10 segments
        segments = []

        for i in range(10):
            start_idx = i * segment_size
            end_idx = (i + 1) * segment_size if i < 9 else len(words)
            segment_text = " ".join(words[start_idx:end_idx])

            if segment_text.strip():
                # Analyze sentiment for this segment
                segment_sentiment = analysis.analyze_sentiment(segment_text)
                segments.append({
                    "timestamp": i * 30,  # Assuming 30 seconds per segment
                    "text": segment_text[:100] + "..." if len(segment_text) > 100 else segment_text,
                    "sentiment": segment_sentiment
                })

        # Key moments detection (simple approach)
        key_moments = []
        for i, segment in enumerate(segments):
            if segment["sentiment"]["compound_score"] > 0.3 or segment["sentiment"]["compound_score"] < -0.3:
                key_moments.append({
                    "timestamp": segment["timestamp"],
                    "type": "sentiment_shift" if segment["sentiment"]["compound_score"] > 0.3 else "negative_peak",
                    "description": f"Strong {segment['sentiment']['sentiment_label'].lower()} sentiment detected",
                    "confidence": abs(segment["sentiment"]["compound_score"]) * 100
                })

        # Calculate metrics
        total_words = len(words)
        estimated_duration = len(text.split()) * 0.2  # Rough estimate: 0.2 seconds per word
        words_per_minute = (total_words / estimated_duration) * 60 if estimated_duration > 0 else 0

        return {
            "sentiment_timeline": [
                {
                    "timestamp": segment["timestamp"],
                    "sentiment": segment["sentiment"]["sentiment_label"].lower(),
                    "score": segment["sentiment"]["compound_score"]
                } for segment in segments
            ],
            "key_moments": key_moments[:3],  # Top 3 key moments
            "metrics": {
                "words_per_minute": round(words_per_minute, 1),
                "engagement_score": min(100, round(abs(sum(s["sentiment"]["compound_score"] for s in segments)) * 50 + 50)),
                "complexity_score": min(10, round(len(set(words)) / len(words) * 10)) if words else 0
            }
        }
    except Exception as e:
        return {"error": str(e)}
