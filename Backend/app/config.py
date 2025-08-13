# app/config.py

def get_risk_level(score: int) -> str:
    """Determines the risk level string based on a numeric score."""
    if score >= 90:
        return "low"
    elif score >= 70:
        return "medium"
    elif score >= 50:
        return "high"
    else:
        return "critical"