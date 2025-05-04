# app/analyzer/contextual_analyzer.py
class ContextualAnalyzer:
    KNOWN_SAFE_SITES = {
        'wikipedia.org': {
            'allowed_missing_headers': ['X-Frame-Options'],
            'expected_load_time': 800  # in ms
        }
    }

    @classmethod
    def apply_context(cls, url: str, anomalies: list) -> list:
        """
        Adjust anomalies based on site context.
        """
        domain = next((d for d in cls.KNOWN_SAFE_SITES if d in url), None)
        if not domain:
            return anomalies

        for anomaly in anomalies:
            if (anomaly['type'] == 'security' and 
                anomaly['message'].startswith('Missing') and
                any(h in anomaly['message'] for h in cls.KNOWN_SAFE_SITES[domain]['allowed_missing_headers'])):
                anomaly['severity'] = 'low'
                anomaly['context_note'] = 'Commonly omitted on this trusted site'
        return anomalies
