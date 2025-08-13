# tests/test_security_checker.py

from app.analyzer.security_checker import SecurityChecker

def test_missing_security_header():
    """
    Tests if the checker correctly identifies a missing security header.
    """
    # Arrange: Create sample headers missing 'X-Frame-Options'
    sample_headers = {
        "Content-Type": "text/html",
        "Content-Security-Policy": "default-src 'self'",
        # Missing X-Frame-Options
        "Strict-Transport-Security": "max-age=31536000",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    }

    # Act: Run the security check
    result = SecurityChecker.check_security(sample_headers)
    anomalies = result["anomalies"]

    # Assert: Check if the specific anomaly was found
    assert len(anomalies) == 1
    assert anomalies[0]["type"] == "security"
    assert anomalies[0]["message"] == "Missing X-Frame-Options header"
    assert anomalies[0]["severity"] == "medium"

def test_all_security_headers_present():
    """
    Tests if the checker finds no anomalies when all headers are present.
    """
    # Arrange: Create headers with all required security headers
    complete_headers = {
        "Content-Security-Policy": "default-src 'self'",
        "X-Frame-Options": "DENY",
        "Strict-Transport-Security": "max-age=31536000",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    }

    # Act: Run the security check
    result = SecurityChecker.check_security(complete_headers)

    # Assert: Check that no anomalies were found
    assert len(result["anomalies"]) == 0