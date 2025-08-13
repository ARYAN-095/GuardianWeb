# app/analyzer/fetcher.py

import asyncio
import base64
import subprocess
from pathlib import Path
import httpx
import time
import re
import logging
import sys
from typing import Dict, Optional

logger = logging.getLogger(__name__)
BASE_DIR = Path(__file__).resolve().parent
SCREENSHOT_DIR = Path("static/screenshots")


class WebsiteFetcher:
    USER_AGENT = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    )
    DEFAULT_TIMEOUT = 30.0

    @staticmethod
    async def get_screenshot(url: str) -> Optional[str]:
        try:
            SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
            result = subprocess.run(
                [sys.executable, str(BASE_DIR / "get_screenshot_sync.py"), url],
                capture_output=True,
                check=True,
                text=True
            )
            screenshot_path = result.stdout.strip()
            logger.info(f"Screenshot saved to: {screenshot_path}")

            if not Path(screenshot_path).exists():
                logger.error(f"Screenshot file not found: {screenshot_path}")
                return None
            return str(screenshot_path)
        except subprocess.CalledProcessError as e:
            logger.error(f"Screenshot subprocess failed: {e.stderr}")
            return None
        except Exception as e:
            logger.exception("Unexpected error while capturing screenshot.")
            return None

    @classmethod
    async def fetch_website_data(cls, url: str, full_scan: bool = False) -> Dict:
       start_time = time.monotonic()
       result = {
          "url": url,
          "html": "",
          "headers": {},
          "response_time": 0,
          "screenshot": None,
          "html_stats": {},
          "anomalies": [],
          "error": None
       }

       try:
        # set follow_redirects=True in AsyncClient constructor for old httpx
        async with httpx.AsyncClient(
            timeout=cls.DEFAULT_TIMEOUT,
            verify=False,
            follow_redirects=True
        ) as client:
            response = await client.get(
                url,
                headers={"User-Agent": cls.USER_AGENT}
          )
            response.raise_for_status()

            result.update({
                "html": response.text,
                "headers": dict(response.headers),
                "status_code": response.status_code
           })

        result["response_time"] = round(time.monotonic() - start_time, 2)
        result["html_stats"] = await cls._analyze_html_content(result["html"])

        if full_scan:
            screenshot_path = await cls.get_screenshot(url)
            if screenshot_path:
                 result["screenshot"] = screenshot_path
            else:
                logger.error("Screenshot capture failed.")
                result["error"] = "Screenshot capture failed."

       except httpx.HTTPStatusError as e:
          result["error"] = f"HTTP {e.response.status_code} error for {url}"
          logger.error(result["error"])
       except httpx.RequestError as e:
           result["error"] = f"Request exception: {repr(e)}"
           logger.error(f"Request failed for {url}: {repr(e)}")
       except Exception as e:
           result["error"] = f"Unexpected error: {repr(e)}"
           logger.exception(f"Unexpected error fetching {url}")

       return result


    @staticmethod
    async def _analyze_html_content(html: str) -> dict:
        return {
            "page_size_kb": len(html) / 1024,
            "image_count": len(WebsiteFetcher._find_html_tags(html, "img")),
            "script_count": len(WebsiteFetcher._find_html_tags(html, "script")),
            "stylesheet_count": len(WebsiteFetcher._find_html_links(html, "stylesheet")),
            "form_count": len(WebsiteFetcher._find_html_tags(html, "form"))
        }

    @staticmethod
    def _find_html_tags(html: str, tag_name: str) -> list:
        return re.findall(fr'<{tag_name}\b[^>]*>', html, re.IGNORECASE)

    @staticmethod
    def _find_html_links(html: str, rel_type: str) -> list:
        return re.findall(
            fr'<link\s+[^>]*rel\s*=\s*["\']{rel_type}["\'][^>]*>',
            html, re.IGNORECASE
        )
