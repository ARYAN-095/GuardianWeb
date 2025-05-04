# app/analyzer/enhanced_fetcher.py

import re
from typing import Dict
import httpx

class EnhancedFetcher:
    @staticmethod
    async def get_actual_headers(url: str) -> Dict:
        """Get headers without following redirects"""
        async with httpx.AsyncClient() as client:
            response = await client.head(
                url,
                follow_redirects=False,
                timeout=10.0
            )
            return dict(response.headers)

    @staticmethod
    def parse_html_stats(html: str) -> Dict:
        """More accurate HTML content analysis"""
        return {
            "page_size_kb": len(html) / 1024,
            "image_count": len(re.findall(r'<img\s+[^>]*src\s*=', html, re.I)),
            "script_count": len(re.findall(r'<script\b[^>]*>', html, re.I)),
            "stylesheet_count": len(re.findall(r'<link\s+[^>]*rel\s*=\s*["\']stylesheet["\']', html, re.I))
        }
