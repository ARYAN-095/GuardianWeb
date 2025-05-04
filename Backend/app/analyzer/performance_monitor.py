from typing import List, Dict

class PerformanceMonitor:
    # Thresholds in seconds
    THRESHOLDS = {
        "excellent": 1.0,
        "good": 2.0,
        "poor": 3.0
    }

    @classmethod
    def check_performance(cls, response_time: float) -> List[Dict]:
        """Analyze website performance metrics"""
        anomalies = []
        
        if response_time > cls.THRESHOLDS["poor"]:
            anomalies.append({
                "type": "performance",
                "message": f"Critical load time: {response_time}s",
                "severity": "high"
            })
        elif response_time > cls.THRESHOLDS["good"]:
            anomalies.append({
                "type": "performance",
                "message": f"Suboptimal load time: {response_time}s",
                "severity": "medium"
            })
            
        return anomalies