# app/analyzer/content_comparator.py
import difflib

def compare_content(old_html: str, new_html: str) -> dict:
    """
    Compares two HTML texts. Returns the ratio of similarity.
    """
    seq = difflib.SequenceMatcher(None, old_html, new_html)
    similarity_ratio = seq.ratio()  # 1.0 means identical, 0 means completely different
    return {
        "similarity": similarity_ratio,
        "message": f"Content similarity is {similarity_ratio * 100:.2f}%"
    }
