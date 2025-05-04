import socket, asyncio
from typing import Any, Dict
from app.analyzer.threat_intel import ThreatIntelScanner, compute_threat_score

async def get_threat_intel_for_url(url: str) -> Dict[str, Any]:
    """
    Returns a dict:
      {
        "virustotal": { …detailed VT payload… },
        "abuse_ip_db": { …detailed AbuseIPDB payload… },
        "combined_score": <int>
      }
    """
    # pull domain + resolve IP
    domain = url.split("://", 1)[-1].split("/")[0]
    try:
        ip = socket.gethostbyname(domain)
    except Exception:
        ip = None

    # call both APIs in parallel
    vt, abuse = await asyncio.gather(
        ThreatIntelScanner.check_virustotal(domain),
        ThreatIntelScanner.check_abuse_ip(ip) if ip else asyncio.sleep(0, result={"category":"unknown","confidenceScore":0})
    )

    # compute combined
    score = compute_threat_score(vt, abuse)
    return {
        "virustotal": vt,
        "abuse_ip_db": abuse,
        "combined_score": score
    }
