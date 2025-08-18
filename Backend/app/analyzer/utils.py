# app/analyzer/utils.py

import yaml
from pathlib import Path
from typing import List, Dict, Any

class RecommendationEngine:
    """
    A rule-driven engine that provides detailed, structured recommendations
    based on a knowledge base defined in an external YAML file.
    """
    _rules = None

    @classmethod
    def _load_rules(cls):
        """Loads the recommendation rules from the YAML file once."""
        if cls._rules is None:
            try:
                rules_path = Path(__file__).resolve().parent.parent.parent / "recommendations.yml"
                with open(rules_path, "r") as f:
                    cls._rules = yaml.safe_load(f)
            except FileNotFoundError:
                # In case the file is missing, operate with an empty rule set.
                cls._rules = {}
            except Exception as e:
                # Log this error in a real application
                print(f"Error loading recommendation rules: {e}")
                cls._rules = {}

    @classmethod
    def generate_recommendations(cls, anomalies: List[Dict[str, Any]]) -> List[str]:
        """
        Generates a list of recommendations for a given list of anomalies.
        It prioritizes specific, rule-based advice from the knowledge base
        and falls back to the default recommendation on the anomaly itself.
        """
        cls._load_rules()
        recommendations = []
        seen_recommendations = set()

        for anomaly in anomalies:
            recommendation_text = None
            anomaly_id = anomaly.get("id")

            # 1. Prioritize rule-based advice using the anomaly ID
            if anomaly_id and anomaly_id in cls._rules:
                rule = cls._rules[anomaly_id]
                # Format the structured rule into a user-friendly string
                rec_parts = [
                    f"**{rule.get('title', 'Recommendation')}**",
                    rule.get('description', ''),
                ]
                if snippet := rule.get('snippet'):
                    rec_parts.append(f"Example Fix: `{snippet}`")
                if link := rule.get('link'):
                    rec_parts.append(f"Learn more: {link}")
                
                recommendation_text = "\n".join(filter(None, rec_parts))

            # 2. Fallback to the default recommendation if no rule is found
            elif "recommendation" in anomaly:
                recommendation_text = anomaly["recommendation"]

            # 3. Add to the final list, ensuring no duplicates
            if recommendation_text and recommendation_text not in seen_recommendations:
                recommendations.append(recommendation_text)
                seen_recommendations.add(recommendation_text)

        return recommendations

