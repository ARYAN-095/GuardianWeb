# app/analyzer/seo_scanner.py

from bs4 import BeautifulSoup

class SEOScanner:

    @staticmethod
    def scan(html: str, url: str):
        soup = BeautifulSoup(html, "html.parser")
        issues = []
        metadata = {}

        # 1. Title tag
        title_tag = soup.title.string if soup.title else None
        metadata["title"] = title_tag
        if not title_tag or len(title_tag.strip()) < 10:
            issues.append({
                "type": "seo",
                "message": "Missing or short <title> tag.",
                "severity": "medium",
                "recommendation": "Add a descriptive <title> tag with 10+ characters."
            })

        # 2. Meta description
        desc = soup.find("meta", attrs={"name": "description"})
        desc_content = desc["content"] if desc and "content" in desc.attrs else None
        metadata["meta_description"] = desc_content
        if not desc_content or len(desc_content.strip()) < 50:
            issues.append({
                "type": "seo",
                "message": "Missing or short meta description.",
                "severity": "medium",
                "recommendation": "Add a meta description of at least 50 characters."
            })

        # 3. Canonical tag
        canonical = soup.find("link", rel="canonical")
        metadata["canonical"] = canonical["href"] if canonical and "href" in canonical.attrs else None
        if not canonical:
            issues.append({
                "type": "seo",
                "message": "Missing canonical URL.",
                "severity": "low",
                "recommendation": "Include a <link rel='canonical'> to avoid duplicate content issues."
            })

        # 4. H1 tag
        h1s = soup.find_all("h1")
        metadata["h1_count"] = str(len(h1s))
        if len(h1s) == 0:
            issues.append({
                "type": "seo",
                "message": "Missing <h1> tag.",
                "severity": "medium",
                "recommendation": "Add a primary <h1> heading to describe the page topic."
            })
        elif len(h1s) > 1:
            issues.append({
                "type": "seo",
                "message": "Multiple <h1> tags found.",
                "severity": "low",
                "recommendation": "Use only one <h1> tag for better SEO clarity."
            })

        return issues, metadata
