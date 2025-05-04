from pydantic import BaseModel
from typing import Any, Dict, List, Optional
from enum import Enum
from datetime import datetime

class Severity(str, Enum):
    HIGH   = "high"
    MEDIUM = "medium"
    LOW    = "low"

class Anomaly(BaseModel):
    type: str
    message: str
    severity: Severity
    recommendation: Optional[str] = None

class AnalyzeRequest(BaseModel):
    url: str

class SEOMetadata(BaseModel):
    title:             Optional[str] = None
    meta_description:  Optional[str] = None
    canonical:         Optional[str] = None
    h1_count:          Optional[int] = None

class ThreatIntelVT(BaseModel):
    category:        str
    malicious_count: int
    total_engines:   int
    vt_score:        int
    last_analysis:   Optional[datetime] = None
    flagged_engines: Optional[List[str]] = None

class ThreatIntelAbuse(BaseModel):
    category:        str
    confidenceScore: int
    total_reports:   Optional[int]     = None
    last_reported:   Optional[datetime] = None
    country:         Optional[str]     = None
    ip:              Optional[str]     = None
    isp:             Optional[str]     = None
    domain:          Optional[str]     = None
    usage_type:      Optional[str]     = None
    is_tor:          Optional[bool]    = None
    is_whitelisted:  Optional[bool]    = None
    hostnames:       Optional[List[str]] = None
    reports:         Optional[List[Dict[str, Any]]] = None

class ThreatIntel(BaseModel):
    virustotal:   ThreatIntelVT
    abuse_ip_db:  ThreatIntelAbuse
    combined_score: float

class ScanComparison(BaseModel):
    new_issues:        List[str]
    resolved_issues:   List[str]
    persistent_issues: List[str]
    risk_score_change: Optional[int] = None

class AnalyzeResponse(BaseModel):
    url:                 str
    risk_score:          int
    anomalies:           List[Anomaly]
    screenshot:          Optional[str] = None
    recommendations:     List[str]
    previous_scan_diff:  Optional[ScanComparison] = None
    seo_metadata:        Optional[SEOMetadata]    = None
    threat_intel:        Optional[ThreatIntel]    = None
    ai_summary:          Optional[str] = None

class ExtendedAnalyzeResponse(AnalyzeResponse):
    risk_level:       str
    scan_metadata:    Dict[str, Any]
    security_headers: Dict[str, Any]
    page_stats:       Dict[str, Any]
