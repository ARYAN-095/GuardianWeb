import sys
import asyncio
import socket
import os
import logging
from datetime import datetime
from typing import List, Optional, Dict

from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from urllib.parse import urlparse

from app.analyzer.fetcher import WebsiteFetcher
from app.analyzer.security_checker import SecurityChecker
from app.analyzer.performance_monitor import PerformanceMonitor
from app.analyzer.malware_scanner import MalwareScanner
from app.analyzer.contextual_analyzer import ContextualAnalyzer
from app.analyzer.risk_calculator import predict_risk_score
from app.analyzer.nlp_utils import summarize_anomalies
from app.image_classifier import classify_screenshot
from app.analyzer.utils import RecommendationEngine
from app.database.db_manager import db_manager
from app.models import (
    AnalyzeRequest, ExtendedAnalyzeResponse, ScanComparison, Anomaly,SEOMetadata,ThreatIntel
)
from app.analyzer.seo_scanner import SEOScanner
from app.analyzer.accessibility_scanner import AccessibilityScanner
from app.analyzer.threat_intel import ThreatIntelScanner, compute_threat_score
from app.analyzer.ai_utils import gen_anomaly_summary, gen_fix_snippet
from urllib.parse import unquote

# Windows asyncio policy
if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# FastAPI setup
app = FastAPI(
    title="Website Anomaly Detector",
    description="API for detecting security and performance anomalies in websites",
    version="1.0.0"
)

# CORS (so your React/Vite app can call /analyze)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

# Logging & rate limiting
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)


def normalize_url(url: str) -> str:
    p = urlparse(url)
    if not p.scheme:
        return f"https://{url}"
    return url


@app.post("/analyze", response_model=ExtendedAnalyzeResponse)
@limiter.limit("5/minute")
async def analyze_website(request: Request, payload: AnalyzeRequest):
    url = normalize_url(payload.url)
    logger.info(f"Starting analysis for URL: {url}")

    # 1) FETCH
    fetched = await WebsiteFetcher.fetch_website_data(url, full_scan=True)
    if fetched.get("error"):
        logger.error(f"Fetch error: {fetched['error']}")
        raise HTTPException(400, detail=fetched["error"])

    # 2) SECURITY
    sec_res = SecurityChecker.check_security(fetched["headers"])
    anomalies = sec_res["anomalies"]                           

    # 3) PERFORMANCE
    anomalies.extend(PerformanceMonitor.check_performance(fetched["response_time"]))

    # 4) MALWARE
    anomalies.extend(MalwareScanner.scan_for_malware(fetched["html"]))

    # 5) CONTEXTUAL ADJUSTMENTS
    anomalies = ContextualAnalyzer.apply_context(url, anomalies)

    # 6) NLP SUMMARY + GENAI RECOMMENDATIONS
    anomaly_summary = gen_anomaly_summary(anomalies)
    ai_recommendations = [gen_fix_snippet(a) for a in anomalies]

    # 7) RISK CALCULATION
    sec_count = sum(1 for a in anomalies if a["type"] == "security")
    perf_count = sum(1 for a in anomalies if a["type"] == "performance")
    sev_map = {"low": 1, "medium": 2, "high": 3}
    avg_sev = sum(sev_map.get(a["severity"], 1) for a in anomalies) / max(len(anomalies), 1)

    stats = fetched.get("html_stats", {})
    features = {
        "security_count": sec_count,
        "performance_count": perf_count,
        "avg_severity": avg_sev,
        "load_time_ms": int(fetched["response_time"] * 1000),
        "page_size_kb": int(stats.get("page_size_kb", 0))
    }
    risk_score = predict_risk_score(features)

    if risk_score <= 90 and risk_score > 70:
      risk_level = "high"
    elif risk_score <= 70 and risk_score > 50:
      risk_level = "medium"
    elif risk_score <= 50:
      risk_level = "low"
    else:
      risk_level = "critical"


    # 8) PREVIOUS SCAN DIFF
    prev = await db_manager.get_previous_scan(url)
    scan_diff = None
    if prev:
        prev_msgs = {a["message"] for a in prev["anomalies"]}
        curr_msgs = {a["message"] for a in anomalies}
        scan_diff = ScanComparison(
            new_issues=list(curr_msgs - prev_msgs),
            resolved_issues=list(prev_msgs - curr_msgs),
            persistent_issues=list(curr_msgs & prev_msgs),
            risk_score_change=risk_score - prev.get("risk_score", 100)
        )

    # 9) SCREENSHOT
    screenshot_path = fetched.get("screenshot")
    screenshot_url = f"{request.base_url}static/screenshots/{os.path.basename(screenshot_path)}" if screenshot_path else None

    # 10) IMAGE CLASSIFICATION
    visual_classification_result = None
    if screenshot_path:
        try:
            visual_classification_result = classify_screenshot(screenshot_path)
        except Exception:
            logger.exception("Image classification failed")

    # 11) SEO & ACCESSIBILITY
    seo_issues, seo_meta = SEOScanner.scan(fetched["html"], url)
    anomalies.extend(seo_issues)
    acc_issues = AccessibilityScanner.scan(fetched["html"])
    anomalies.extend(acc_issues)

    # 12) Threat Intelligence
    domain = url.split("://", 1)[-1].split("/")[0]
    try:
        ip = socket.gethostbyname(domain)
    except:
        ip = None

    vt_result, abuse_result = await asyncio.gather(
        ThreatIntelScanner.check_virustotal(domain),
        ThreatIntelScanner.check_abuse_ip(ip) if ip else {"category": "unknown", "confidenceScore": 0}
    )
    ti_score = compute_threat_score(vt_result, abuse_result)
    threat_intel = {
        "virustotal": vt_result,
        "abuse_ip_db": abuse_result,
        "combined_score": ti_score
    }

    # 13) Recommendations
    recs = RecommendationEngine.generate_recommendations(anomalies)

    anomaly_summary = gen_anomaly_summary(anomalies)


    # 14) Build Response
    result = ExtendedAnalyzeResponse(
        url=url,
        risk_score=risk_score,
        risk_level=risk_level,
        anomalies=[Anomaly(**a) for a in anomalies],
        screenshot=screenshot_url,
        previous_scan_diff=scan_diff,
        
        scan_metadata={
            "scan_date": datetime.utcnow().isoformat(),
            "scanner_version": "1.0.0",
            "anomaly_summary": anomaly_summary,
            "visual_classification": str(visual_classification_result or "Unknown"),
            "ai_summary": anomaly_summary
        },
        security_headers=fetched.get("headers", {}),
        page_stats=fetched.get("html_stats", {}),
        seo_metadata=SEOMetadata(**seo_meta),
        threat_intel=ThreatIntel(**threat_intel),
        recommendations=recs + ai_recommendations,
        ai_summary=anomaly_summary 
    )

    await db_manager.insert_scan(result.dict())
    logger.info(f"Completed analysis for URL: {url}")
    return result


@app.get("/history/{domain}", response_model=List[Dict])
async def get_scan_history(domain: str):
    """Return the last‐10 scans for a given domain."""
    cursor = db_manager.db.scans.find({"url": domain}).sort("created_at", -1).limit(10)
    history = []
    async for scan in cursor:
        history.append({
            "timestamp": scan["created_at"].isoformat(),
            "risk_score": scan["risk_score"],
            "anomaly_summary": scan["scan_metadata"]["anomaly_summary"]
        })
    return history

 

@app.get("/scans/{scan_id}", response_model=ExtendedAnalyzeResponse)
async def get_scan(scan_id: str):
    """Get stored scan results by scan ID (ISO timestamp)"""
    # URL-decode the scan ID
    decoded_scan_id = unquote(scan_id)
    
    # Find scan by exact timestamp match
    scan = await db_manager.db.scans.find_one(
        {"scan_metadata.scan_date": decoded_scan_id},
        {"_id": 0}  # Exclude MongoDB ID
    )
    
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    return scan