# app/analyzer/accessibility_scanner.py

from bs4 import BeautifulSoup

class AccessibilityScanner:

    @staticmethod
    def scan(html: str):
        soup = BeautifulSoup(html, "html.parser")
        issues = []

        # 1. Missing alt attributes
        images = soup.find_all("img")
        for img in images:
            if not img.get("alt"):
                issues.append({
                    "type": "accessibility",
                    "message": "Image missing alt attribute.",
                    "severity": "medium",
                    "recommendation": "Add descriptive alt text to all images."
                })

        # 2. Missing form labels
        inputs = soup.find_all("input")
        for input_tag in inputs:
            if not input_tag.get("id"):
                continue
            label = soup.find("label", attrs={"for": input_tag["id"]})
            if not label:
                issues.append({
                    "type": "accessibility",
                    "message": f"Input with id '{input_tag['id']}' is missing a label.",
                    "severity": "medium",
                    "recommendation": "Use a <label> with a 'for' attribute matching the input's id."
                })

        # 3. ARIA roles
        roles = soup.find_all(attrs={"role": True})
        if not roles:
            issues.append({
                "type": "accessibility",
                "message": "No ARIA roles found.",
                "severity": "low",
                "recommendation": "Consider using ARIA roles to enhance accessibility where appropriate."
            })

        return issues
