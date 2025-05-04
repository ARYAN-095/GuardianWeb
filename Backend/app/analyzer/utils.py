from app.ml.risk_model import RiskModel
from typing import List, Dict
from app.ml.risk_model import predict_risk_score 

    
 # app/analyzer/utils.py

class RecommendationEngine:
    # Full header → (friendly text, config snippet)
    HEADER_ADVICE = {
        "Content-Security-Policy": (
            "Prevent XSS by restricting sources of scripts/styles/etc.",
            "Content-Security-Policy: default-src 'self';"
        ),
        "X-Frame-Options": (
            "Protect against clickjacking by controlling framing policy.",
            "X-Frame-Options: DENY"
        ),
        "Strict-Transport-Security": (
            "Enforce HTTPS on all requests to your domain.",
            "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload"
        ),
        "Permissions-Policy": (
            "Limit which powerful browser features your site can use.",
            "Permissions-Policy: geolocation=(self), camera=()"
        ),
        "X-XSS-Protection": (
            "Block reflected XSS attacks in legacy browsers.",
            "X-XSS-Protection: 1; mode=block"
        ),
        "X-Content-Type-Options": (
            "Prevent MIME‑sniffing by enforcing declared content types.",
            "X-Content-Type-Options: nosniff"
        ),
        "Referrer-Policy": (
            "Control how much referrer information is sent.",
            "Referrer-Policy: strict-origin-when-cross-origin"
        )
    }

    @staticmethod
    def generate_recommendations(anomalies):
        recs = []
        for a in anomalies:
            msg = a.get("message", "")
            # if it's a missing‑header anomaly, pick up its snippet
            if msg.startswith("Missing ") and msg.endswith(" header"):
                header = msg.split()[1]  # e.g. "Content-Security-Policy"
                if header in RecommendationEngine.HEADER_ADVICE:
                    friendly, snippet = RecommendationEngine.HEADER_ADVICE[header]
                    recs.append(f"{friendly}  Config snippet: `{snippet}`")
                    continue

            # otherwise fall back to whatever recommendation text the anomaly carried
            if a.get("recommendation"):
                recs.append(a["recommendation"])

        # dedupe and preserve input order
        seen = set()
        final = []
        for r in recs:
            if r not in seen:
                seen.add(r)
                final.append(r)
        return final
