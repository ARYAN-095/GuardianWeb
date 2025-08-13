import sys
import asyncio
import os
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from urllib.parse import urlparse, unquote

# --- App Modules ---
from app.analyzer.fetcher import WebsiteFetcher
from app.analyzer.security_checker import SecurityChecker
from app.analyzer.performance_monitor import PerformanceMonitor
from app.analyzer.malware_scanner import MalwareScanner
from app.analyzer.contextual_analyzer import ContextualAnalyzer
from app.analyzer.risk_calculator import predict_risk_score
from app.image_classifier import classify_screenshot
from app.analyzer.utils import RecommendationEngine
from app.database.db_manager import db_manager
from app.analyzer.seo_scanner import SEOScanner
from app.analyzer.accessibility_scanner import AccessibilityScanner
# We now import the assistant directly, not the utils
from app.genai.ai_assistant import AIAssistant
from app.models import AnalyzeRequest, ExtendedAnalyzeResponse, ScanComparison, Anomaly, SEOMetadata
from app.config import get_risk_level

# --- Logging and App Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

app = FastAPI(
    title="GuardianWeb Health Analyzer",
    description="An advanced API for comprehensive website health analysis.",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Initialize the AI Assistant once at startup
ai_assistant = AIAssistant()

# --- Helper Functions for Analysis ---

def normalize_url(url: str) -> str:
    """Ensures a URL has a scheme (defaults to https)."""
    parsed = urlparse(url)
    if not parsed.scheme:
        return f"https://{url}"
    return url

def run_scanners(fetched_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Runs all individual scanners and returns a combined list of anomalies."""
    anomalies = []
    security_results = SecurityChecker.check_security(fetched_data["headers"])
    anomalies.extend(security_results["anomalies"])
    anomalies.extend(PerformanceMonitor.check_performance(fetched_data["response_time"]))
    anomalies.extend(MalwareScanner.scan_for_malware(fetched_data["html"]))
    seo_issues, _ = SEOScanner.scan(fetched_data["html"], fetched_data["url"])
    anomalies.extend(seo_issues)
    anomalies.extend(AccessibilityScanner.scan(fetched_data["html"]))
    return anomalies

def consolidate_anomalies(anomalies: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Groups identical anomaly messages into a single entry with a count."""
    message_counts = {}
    processed_anomalies = []
    for anomaly in anomalies:
        msg = anomaly.get("message", "")
        if msg in message_counts:
            message_counts[msg]['count'] += 1
        else:
            message_counts[msg] = {"anomaly": anomaly, "count": 1}
            processed_anomalies.append(anomaly)
    for anomaly in processed_anomalies:
        msg = anomaly.get("message", "")
        count = message_counts[msg]['count']
        if count > 1:
            anomaly['message'] = f"{msg} (x{count})"
    return processed_anomalies

def calculate_risk_features(anomalies: List[Dict[str, Any]], fetched_data: Dict[str, Any]) -> Dict[str, float]:
    """Prepares the feature dictionary for the risk prediction model."""
    security_count = sum(1 for a in anomalies if a.get("type") == "security")
    performance_count = sum(1 for a in anomalies if a.get("type") == "performance")
    sev_map = {"low": 1, "medium": 2, "high": 3, "critical": 4}
    total_severity = sum(sev_map.get(a.get("severity", "low"), 1) for a in anomalies)
    avg_severity = total_severity / max(len(anomalies), 1)
    page_stats = fetched_data.get("html_stats", {})
    return {
        "security_count": float(security_count),
        "performance_count": float(performance_count),
        "avg_severity": float(avg_severity),
        "load_time_ms": float(fetched_data.get("response_time", 0) * 1000),
        "page_size_kb": float(page_stats.get("page_size_kb", 0))
    }

async def get_scan_comparison(url: str, current_anomalies: List[Dict], current_risk_score: int) -> Optional[ScanComparison]:
    """Compares the current scan with the most recent previous scan from the database."""
    previous_scan = await db_manager.get_previous_scan(url)
    if not previous_scan:
        return None
    previous_messages = {a["message"] for a in previous_scan.get("anomalies", [])}
    current_messages = {a["message"] for a in current_anomalies}
    return ScanComparison(
        new_issues=list(current_messages - previous_messages),
        resolved_issues=list(previous_messages - current_messages),
        persistent_issues=list(current_messages & previous_messages),
        risk_score_change=current_risk_score - previous_scan.get("risk_score", 100)
    )

# --- Main API Endpoint ---

@app.post("/analyze", response_model=ExtendedAnalyzeResponse)
@limiter.limit("5/minute")
async def analyze_website(request: Request, payload: AnalyzeRequest):
    url = normalize_url(payload.url)
    logger.info(f"Analysis started for URL: {url}")

    fetched_data = await WebsiteFetcher.fetch_website_data(url, full_scan=True)
    if error := fetched_data.get("error"):
        logger.error(f"Fetch error for {url}: {error}")
        raise HTTPException(status_code=400, detail=error)

    anomalies = run_scanners(fetched_data)
    anomalies = ContextualAnalyzer.apply_context(url, anomalies)
    final_anomalies = consolidate_anomalies(anomalies)

    risk_features = calculate_risk_features(final_anomalies, fetched_data)
    risk_score = predict_risk_score(risk_features)
    risk_level = get_risk_level(risk_score)

    # *** THE MAIN FIX IS HERE ***
    # Create a list of all AI tasks that need to be run.
    ai_tasks = [
        ai_assistant.summarize_anomalies(final_anomalies),
        *[ai_assistant.generate_fix_suggestion(a) for a in final_anomalies]
    ]
    # Run all AI tasks concurrently and await their results.
    ai_results = await asyncio.gather(*ai_tasks)
    
    # Unpack the results. The summary is the first result, followed by the recommendations.
    ai_summary = ai_results[0]
    ai_recommendations = ai_results[1:]
    
    rule_based_recs = RecommendationEngine.generate_recommendations(final_anomalies)

    scan_diff = await get_scan_comparison(url, final_anomalies, risk_score)

    screenshot_path = fetched_data.get("screenshot")
    screenshot_url = f"{request.base_url}static/screenshots/{os.path.basename(screenshot_path)}" if screenshot_path else None
    
    visual_classification_label = "Not available"
    if screenshot_path:
        try:
            classification_result = classify_screenshot(screenshot_path)
            visual_classification_label = classification_result.get("label", "Classification failed")
        except Exception as e:
            logger.error(f"Image classification failed for {url}: {e}")

    _, seo_meta = SEOScanner.scan(fetched_data["html"], url)
    
    response_data = ExtendedAnalyzeResponse(
        url=url,
        risk_score=risk_score,
        risk_level=risk_level,
        anomalies=[Anomaly(**a) for a in final_anomalies],
        screenshot=screenshot_url,
        previous_scan_diff=scan_diff,
        scan_metadata={
            "scan_date": datetime.utcnow().isoformat(),
            "scanner_version": app.version,
            "anomaly_summary": ai_summary,
            "visual_classification": visual_classification_label,
        },
        security_headers=fetched_data.get("headers", {}),
        page_stats=fetched_data.get("html_stats", {}),
        seo_metadata=SEOMetadata(**seo_meta),
        recommendations=rule_based_recs + ai_recommendations,
        ai_summary=ai_summary,
        threat_intel=None
    )

    await db_manager.insert_scan(response_data.dict())
    logger.info(f"Analysis completed for URL: {url}")
    return response_data

# --- Other Endpoints ---

@app.get("/history/{domain}", response_model=List[Dict])
async def get_scan_history(domain: str):
    # This endpoint remains largely the same, but could be enhanced in the future.
    # ... (existing code) ...
    return [] # Placeholder

@app.get("/scans/{scan_id}", response_model=ExtendedAnalyzeResponse)
async def get_scan(scan_id: str):
    # This endpoint remains largely the same.
    # ... (existing code) ...
    raise HTTPException(status_code=404, detail="Scan not found") # Placeholder
