from typing import List, Dict

class SecurityChecker:
    # Updated the structure to include an 'aliases' key.
    # This allows the checker to recognize common alternative headers.
    REQUIRED_HEADERS = {
        "Content-Security-Policy": {
            "severity": "high",
            "recommendation": "Implement a Content-Security-Policy (CSP) to prevent XSS and other injection attacks.",
            "aliases": ["content-security-policy-report-only"] # Recognizes the "report-only" version
        },
        "Strict-Transport-Security": {
            "severity": "high",
            "recommendation": "Implement HTTP Strict Transport Security (HSTS) to enforce secure (HTTPS) connections.",
            "aliases": []
        },
        "X-Frame-Options": {
            "severity": "medium",
            "recommendation": "Add X-Frame-Options to protect against 'clickjacking' attacks.",
            "aliases": []
        },
        "X-Content-Type-Options": {
            "severity": "medium",
            "recommendation": "Add X-Content-Type-Options: nosniff to prevent browsers from MIME-sniffing a response away from the declared content-type.",
            "aliases": []
        },
        "Referrer-Policy": {
            "severity": "low",
            "recommendation": "Set a Referrer-Policy to control how much referrer information is sent with requests.",
            "aliases": []
        }
        # Note: X-XSS-Protection is considered deprecated by modern browsers in favor of a strong CSP.
        # It's intentionally omitted here to avoid flagging modern sites that correctly disable it (e.g., X-XSS-Protection: 0).
    }

    @classmethod
    def check_security(cls, headers: Dict[str, str]) -> Dict[str, any]:
        """
        Checks headers for common security headers and their aliases. Returns:
        - Detected security header values.
        - Anomalies for missing headers.
        """
        results = {
            "security_headers": {},
            "anomalies": []
        }

        # Normalize all received header keys to lowercase for case-insensitive comparison.
        normalized_headers = {k.lower(): v for k, v in headers.items()}

        # Iterate through our required headers checklist.
        for header_name, meta in cls.REQUIRED_HEADERS.items():
            header_found = False
            
            # Create a list of all possible names for this header (main name + aliases).
            possible_names = [header_name.lower()] + meta.get("aliases", [])

            # Check if any of the possible names exist in the site's headers.
            for name in possible_names:
                if name in normalized_headers:
                    # If found, store its value and mark it as present.
                    results["security_headers"][header_name] = normalized_headers[name]
                    header_found = True
                    break # Stop checking for this header since we found it.

            # If after checking all possible names, none were found, flag it as missing.
            if not header_found:
                results["security_headers"][header_name] = "MISSING"
                results["anomalies"].append({
                    "type": "security",
                    "message": f"Missing recommended '{header_name}' header or a valid alternative.",
                    "severity": meta["severity"],
                    "recommendation": meta["recommendation"]
                })

        return results

 
### Key Improvements

# 1.  **Alias Support:** The checker now understands that `Content-Security-Policy-Report-Only` is a valid alternative for `Content-Security-Policy`. It will no longer incorrectly flag sites like Google for a missing CSP header.
# 2.  **Smarter Logic:** The code now iterates through a list of possible names for each header, making it more flexible and accurate.
# 3.  **Improved Recommendations:** The text for recommendations is more descriptive.
# 4.  **Modern Best Practices:** I've added a comment explaining why `X-XSS-Protection` is no longer checked for. Modern security practice is to disable it (`X-XSS-Protection: 0`) and rely on a strong Content Security Policy instead. Your scanner now correctly aligns with this modern approach.

# You can now replace the content of your `app/analyzer/security_checker.py` file with this improved code. When you run a scan on `google.com` again, you should see fewer incorrect security anomali