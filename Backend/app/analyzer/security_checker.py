from typing import List, Dict

class SecurityChecker:
    # Required security headers and recommendations
    REQUIRED_HEADERS = {
        "Content-Security-Policy": {
            "severity": "high",
            "recommendation": "Implement Content-Security-Policy to prevent XSS attacks."
        },
        "X-Frame-Options": {
            "severity": "medium",
            "recommendation": "Add X-Frame-Options to protect against clickjacking."
        },
        "Strict-Transport-Security": {
            "severity": "high",
            "recommendation": "Implement HSTS to enforce secure (HTTPS) connections."
        },
        "X-Content-Type-Options": {
            "severity": "medium",
            "recommendation": "Add X-Content-Type-Options to prevent MIME-sniffing."
        },
        "Referrer-Policy": {
            "severity": "low",
            "recommendation": "Set Referrer-Policy to control how much referrer information is shared."
        }
    }

    @classmethod
    def check_security(cls, headers: Dict[str, str]) -> Dict[str, any]:
        """
        Checks headers for common security headers and returns:
        - Detected security header values
        - Anomalies (missing headers)
        """
        results = {
            "security_headers": {},
            "anomalies": []
        }

        # Normalize header keys for case-insensitive comparison
        normalized_headers = {k.lower(): v for k, v in headers.items()}

        for header, meta in cls.REQUIRED_HEADERS.items():
            header_lc = header.lower()
            if header_lc in normalized_headers:
                results["security_headers"][header] = normalized_headers[header_lc]
            else:
                results["security_headers"][header] = "MISSING"
                results["anomalies"].append({
                    "type": "security",
                    "message": f"Missing {header} header",
                    "severity": meta["severity"],
                    "recommendation": meta["recommendation"]
                })

        return results
