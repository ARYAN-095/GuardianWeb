from playwright.sync_api import sync_playwright
import sys
from pathlib import Path
from uuid import uuid4

def capture_screenshot(url: str):
    # Define the screenshot directory – ensure it matches what you use in fetcher.py
    screenshot_dir = Path("static/screenshots")
    screenshot_dir.mkdir(parents=True, exist_ok=True)

    # Create a unique filename
    filename = f"{uuid4().hex}.png"
    filepath = screenshot_dir / filename

    # Use Playwright's synchronous API to capture a screenshot with HTTPS errors ignored
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(ignore_https_errors=True)  # ⬅️ This line is key
        page = context.new_page()
        page.goto(url, timeout=60000, wait_until="load")
        page.screenshot(path=str(filepath), full_page=True)
        browser.close()

    # Print the path to stdout so that fetcher.py can capture it
    print(str(filepath))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python get_screenshot_sync.py <url>")
    else:
        capture_screenshot(sys.argv[1])
