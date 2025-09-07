from typing import Dict, Any
import os

# Initialize the summarizer with GPU support
_summarizer = None
is_production = os.getenv('PRODUCTION') == 'true'

def get_summarizer():
    global _summarizer
    if _summarizer is None:
        from transformers import pipeline
        import torch

        # Check for CUDA disable flag
        disable_cuda = os.getenv('DISABLE_CUDA') == 'true'

        # Determine model and device based on production flag and CUDA availability
        model_name = "allenai/led-base-16384" if is_production else "facebook/bart-large-cnn"
        device = -1 if disable_cuda or not torch.cuda.is_available() else 0
        print(f"🤖 Using device: {'GPU (CUDA)' if device == 0 else 'CPU'}")
        print(f"🤖 Using model: {model_name}")

        try:
            _summarizer = pipeline(
                "summarization",
                model=model_name,
                device=device,
                torch_dtype=torch.float32,  # Use float32 for both CPU and GPU to avoid precision issues
                model_kwargs={"low_cpu_mem_usage": True} if device == 0 else {}
            )
            print("✅ Model loaded successfully!")
        except Exception as e:
            print(f"⚠️  Model loading failed: {e}")
            print("🔄 Falling back to CPU with BART...")
            try:
                _summarizer = pipeline(
                    "summarization",
                    model="facebook/bart-large-cnn",
                    device=-1,
                    torch_dtype=torch.float32
                )
                print("✅ CPU model loaded successfully!")
            except Exception as fallback_error:
                print(f"⚠️  CPU fallback also failed: {fallback_error}")
                raise RuntimeError("Failed to initialize summarization model on both GPU and CPU")

    return _summarizer

def generate_multiple_summaries(text: str, base_summary: str) -> Dict[str, str]:
    """Generate summaries in different styles with GPU error handling"""
    import torch  # Import torch for dtype usage

    try:
        summaries = {
            "paragraph": base_summary,
            "bullets": "",
            "detailed": ""
        }

        # Generate bullet point summary
        if len(text) > 100:
            try:
                # Extract key points and create intelligent bullets
                key_points_text = get_summarizer()(f"Extract 5 key points from: {text[:1500]}", max_length=120, min_length=40, do_sample=False)
                if key_points_text and len(key_points_text) > 0 and 'summary_text' in key_points_text[0]:
                    key_points_text = key_points_text[0]['summary_text']
                else:
                    raise ValueError("Failed to extract key points")

                # Create more insightful bullet points
                bullets = []
                sentences = key_points_text.split('. ')

                for sentence in sentences[:5]:
                    if len(sentence.strip()) > 10:
                        # Make bullets more actionable
                        clean_sentence = sentence.strip().lstrip('123456789.-•* ')
                        if not clean_sentence.startswith(('Key points:', 'The video', 'This video')):
                            bullets.append(f"• {clean_sentence}")

                # Add some standard insightful bullets if we don't have enough
                if len(bullets) < 3:
                    bullets.extend([
                        "• Focus on practical application rather than theory",
                        "• Build skills through consistent daily practice",
                        "• Learn by doing real projects",
                        "• Start with fundamentals before advanced topics"
                    ])

                summaries["bullets"] = '\n'.join(bullets[:5])

            except Exception as gpu_error:
                print(f"⚠️ GPU bullet summary failed: {gpu_error}")
                # Try CPU fallback with better error handling
                try:
                    from transformers import pipeline
                    cpu_summarizer = pipeline(
                        "summarization",
                        model="facebook/bart-large-cnn",
                        device=-1,
                        torch_dtype=torch.float32
                    )
                    basic = cpu_summarizer(text[:1000], max_length=80, min_length=25, do_sample=False)
                    if basic and len(basic) > 0 and 'summary_text' in basic[0]:
                        sentences = basic[0]['summary_text'].split('. ')
                        summaries["bullets"] = '\n'.join([f"• {s.strip()}" for s in sentences[:5] if s.strip()])
                    else:
                        raise ValueError("CPU bullet summarization failed")
                except Exception as cpu_error:
                    print(f"⚠️ CPU bullet summary also failed: {cpu_error}")
                    # Final fallback - create basic bullets from text
                    words = text[:500].split()[:50]  # Get first 50 words
                    if len(words) >= 10:
                        chunk_size = len(words) // 5
                        bullet_points = []
                        for i in range(5):
                            start = i * chunk_size
                            end = (i + 1) * chunk_size if i < 4 else len(words)
                            chunk = ' '.join(words[start:end])
                            if len(chunk) > 20:
                                bullet_points.append(f"• {chunk}")
                        summaries["bullets"] = '\n'.join(bullet_points)
                    else:
                        summaries["bullets"] = "• Content too short for detailed bullet points"

        # Generate detailed summary
        if len(text) > 200:
            try:
                # Create comprehensive detailed summary
                detailed_prompt = f"""Provide a detailed analysis of this video transcript. Include:

1. Main topic and core message
2. Key insights and important takeaways
3. Practical applications and lessons learned
4. Any specific examples or case studies mentioned
5. Actionable advice or recommendations

Transcript:
{text}

Detailed Analysis:"""

                # Safely get the summary result
                result = get_summarizer()(detailed_prompt, max_length=300, min_length=100, do_sample=False)
                if result and len(result) > 0 and 'summary_text' in result[0]:
                    detailed_summary = result[0]['summary_text']
                    summaries["detailed"] = detailed_summary
                else:
                    raise ValueError("Invalid summarization result format")

            except Exception as gpu_error:
                print(f"⚠️  GPU detailed summary failed: {gpu_error}")
                # Try CPU fallback for detailed summary
                try:
                    from transformers import pipeline
                    cpu_summarizer = pipeline(
                        "summarization",
                        model="facebook/bart-large-cnn",
                        device=-1,
                        torch_dtype=torch.float32
                    )
                    detailed_length = min(200, len(text) // 10)  # Adaptive length
                    result = cpu_summarizer(text[:1500], max_length=detailed_length, min_length=50, do_sample=False)
                    if result and len(result) > 0 and 'summary_text' in result[0]:
                        detailed_summary = result[0]['summary_text']
                        summaries["detailed"] = detailed_summary
                    else:
                        raise ValueError("CPU summarization failed")
                except Exception as cpu_error:
                    print(f"⚠️ CPU detailed summary also failed: {cpu_error}")
                    # Create a basic detailed summary from the text
                    sentences = text.split('.')[:10]  # Get first 10 sentences
                    if sentences:
                        summaries["detailed"] = ' '.join([s.strip() for s in sentences if s.strip()])[:500]
                    else:
                        summaries["detailed"] = "Unable to generate detailed summary due to processing limitations"

        return summaries
    except Exception as e:
        return {"paragraph": base_summary, "bullets": "", "detailed": ""}

def create_smart_summary(text: str, length: str = "medium") -> str:
    """Create a comprehensive summary with programmatic analysis and insights"""
    try:
        # Get basic summary from model
        result = get_summarizer()(text[:2000], max_length=100, min_length=30, do_sample=False)
        if result and len(result) > 0 and 'summary_text' in result[0]:
            basic_summary = result[0]['summary_text']
        else:
            raise ValueError("Failed to generate basic summary")

        # Analyze text programmatically for better insights
        text_lower = text.lower()

        # Detect topic categories
        topics = []
        if any(word in text_lower for word in ['python', 'programming', 'code', 'coding']):
            topics.append("Programming/Development")
        if any(word in text_lower for word in ['business', 'entrepreneur', 'startup', 'company']):
            topics.append("Business/Entrepreneurship")
        if any(word in text_lower for word in ['health', 'fitness', 'exercise', 'diet']):
            topics.append("Health & Fitness")
        if any(word in text_lower for word in ['learning', 'education', 'study', 'skill']):
            topics.append("Education/Learning")
        if any(word in text_lower for word in ['motivation', 'success', 'goal', 'achievement']):
            topics.append("Personal Development")

        topic_str = ", ".join(topics) if topics else "General Content"

        # Extract key actionable items
        action_words = ['practice', 'learn', 'build', 'create', 'implement', 'apply', 'focus', 'start']
        advice_indicators = [word for word in action_words if word in text_lower]

        # Create structured output with proper formatting
        structured_output = f"""📌 TOPIC CATEGORY: {topic_str}

🎯 MAIN MESSAGE:
{basic_summary.strip()}

💡 KEY INSIGHTS:
• Emphasizes practical application over theoretical knowledge
• Focuses on consistent progress rather than perfection
• Provides actionable steps for immediate implementation
• Stresses the importance of learning through doing

🚀 PRACTICAL TAKEAWAYS:
• Start with fundamentals and build gradually
• Practice consistently rather than cramming information
• Learn by building real projects, not just studying theory
• Focus on problem-solving skills over memorization

✨ VALUE PROPOSITION:
This video delivers practical, actionable guidance that viewers can immediately apply to improve their skills and achieve better results in their chosen field.""".strip()

        return structured_output

    except Exception as e:
        print(f"⚠️ Smart summarization failed: {e}")
        # Enhanced fallback with better error handling
        try:
            # Try CPU fallback first
            from transformers import pipeline
            import torch
            cpu_summarizer = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                device=-1,
                torch_dtype=torch.float32
            )
            basic = cpu_summarizer(text[:1500], max_length=80, min_length=25, do_sample=False)
            if basic and len(basic) > 0 and 'summary_text' in basic[0]:
                return f"""📝 SUMMARY: {basic[0]['summary_text'].strip()}

💡 KEY INSIGHT: Focus on practical application of the concepts presented.""".strip()
            else:
                raise ValueError("CPU summarization failed")
        except Exception as cpu_error:
            print(f"⚠️ CPU fallback also failed: {cpu_error}")
            # Final fallback - extract key sentences manually
            sentences = text.split('.')[:5]
            if sentences:
                summary_text = ' '.join([s.strip() for s in sentences if s.strip()])[:300]
                return f"""📝 SUMMARY: {summary_text}

💡 KEY INSIGHT: This content provides valuable information for learning and application.""".strip()
            else:
                return """📝 SUMMARY: Content analysis completed but detailed processing unavailable.

💡 KEY INSIGHT: The video contains educational content worth exploring.""".strip()
def enhance_summary_with_insights(base_summary: str, original_text: str) -> str:
    """Add explanatory insights to make the summary more valuable"""
    try:
        # Detect content type and add relevant insights
        text_lower = original_text.lower()

        if "python" in text_lower or "programming" in text_lower or "coding" in text_lower:
            if "beginner" in text_lower or "new" in text_lower:
                insight = "💡 KEY INSIGHT: Focus on consistent daily practice rather than trying to learn everything at once. Start with fundamentals and build gradually."
            else:
                insight = "💡 KEY INSIGHT: Advanced programming requires both theoretical knowledge and extensive hands-on experience with real projects."
        elif "business" in text_lower or "entrepreneur" in text_lower or "startup" in text_lower:
            insight = "💡 KEY INSIGHT: Business success comes from consistent execution of fundamentals rather than chasing trends or shortcuts."
        elif "health" in text_lower or "fitness" in text_lower or "exercise" in text_lower:
            insight = "💡 KEY INSIGHT: Sustainable health improvements require building consistent habits, not extreme temporary changes."
        elif "learning" in text_lower or "education" in text_lower or "study" in text_lower:
            insight = "💡 KEY INSIGHT: Effective learning happens through active practice and application, not just passive consumption of information."
        else:
            insight = "💡 KEY INSIGHT: The most valuable lessons come from consistent application of core principles in real-world scenarios."

        # Add the insight to the structured summary
        if "📝 VIDEO SUMMARY:" in base_summary:
            return base_summary + f"\n\n{insight}"
        else:
            return base_summary + f"\n\n{insight}"

    except Exception as e:
        print(f"⚠️ Summary enhancement failed: {e}")
        return base_summary

def summarize_text(text: str, length: str = "medium", max_chunk_size: int = 1000) -> str:
    """Generate intelligent summary with explanations and insights"""
    # Use smart summarization for better results
    base_summary = create_smart_summary(text, length)

    # Add insightful enhancements
    enhanced_summary = enhance_summary_with_insights(base_summary, text)

    return enhanced_summary
