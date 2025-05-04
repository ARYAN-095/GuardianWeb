import os, socket
import httpx
from dotenv import load_dotenv
from typing import Dict, List, Optional
from datetime import datetime

load_dotenv()

VT_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")
# AbuseIPDB key hardcoded below

class ThreatIntelScanner:
    ABUSE_API_KEY = "f7e4c1f923fcedea0b1aa3cdcaf87fb15052ff1d34731752bfb554c43a330dd13445db97239d780f"

    @staticmethod
    async def check_virustotal(domain: str) -> Dict:
        """Query VirusTotal for domain verdicts with detailed metadata."""
        url = f"https://www.virustotal.com/api/v3/domains/{domain}"
        headers = {"x-apikey": VT_API_KEY}

        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, headers=headers, timeout=15.0)
                resp.raise_for_status()
                data = resp.json().get("data", {}).get("attributes", {})
                
        except Exception as e:
            return {"category": "unknown", "error": str(e)}

        stats = data.get("last_analysis_stats", {})
        mal = stats.get("malicious", 0)
        total = sum(stats.values()) or 1
        score = int((mal / total) * 100)
        category = "malicious" if mal > 0 else "clean"

        last_analysis_ts = data.get("last_analysis_date")
        flagged_engines = [
            name for name, result in data.get("last_analysis_results", {}).items()
            if result.get("category") != "clean"
        ]

        return {
            "category": category,
            "malicious_count": mal,
            "total_engines": total,
            "vt_score": score,
            "last_analysis": datetime.utcfromtimestamp(last_analysis_ts).isoformat() if last_analysis_ts else None,
            "flagged_engines": flagged_engines,
        }

    @staticmethod
    async def check_abuse_ip(ip: str) -> Dict:
        """Query AbuseIPDB for IP reputation with extra metadata."""
        url = "https://api.abuseipdb.com/api/v2/check"
        headers = {
            "Key": "f7e4c1f923fcedea0b1aa3cdcaf87fb15052ff1d34731752bfb554c43a330dd13445db97239d780f",
            "Accept": "application/json"
        }
        params = {
            "ipAddress": ip,
            "maxAgeInDays": 90,
            "verbose": "true"
        }

        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, headers=headers, params=params, timeout=15.0)
                resp.raise_for_status()
                data = resp.json().get("data", {})
                
        except Exception as e:
            print(f"❌ AbuseIPDB error: {e}")
            return {"category": "unknown", "error": str(e)}

        score = data.get("abuseConfidenceScore", 0)
        category = "flagged" if score >= 50 else "clean"

        return {
        "category": category,
        "confidenceScore": score,
        "total_reports": data.get("totalReports"),
        "last_reported": data.get("lastReportedAt"),
        "country": data.get("countryName"),
        "ip": data.get("ipAddress"),
        "isp": data.get("isp"),
        "domain": data.get("domain"),
        "usage_type": data.get("usageType"),
        "is_tor": data.get("isTor"),
        "is_whitelisted": data.get("isWhitelisted"),
        "hostnames": data.get("hostnames"),
        "reports": data.get("reports"),
    }

def compute_threat_score(vt: Dict, abuse: Dict) -> int:
    """
    Combine VT score (0–100) and AbuseIPDB score (0–100)
    with a weighted formula: 70% VT, 30% AbuseIPDB.
    """
    try:
        return int(vt.get("vt_score", 0) * 0.7 + abuse.get("confidenceScore", 0) * 0.3)
    except Exception:
        return 0
