# tests/test_performance_monitor.py

import pytest
from app.analyzer.performance_monitor import PerformanceMonitor

# This is the list of test cases. Each tuple contains:
# (input_response_time, expected_number_of_anomalies, expected_severity)
performance_test_cases = [
    # Test Case 1: Excellent performance
    (0.8, 0, None),
    
    # Test Case 2: Good, but borderline poor performance
    (2.5, 1, "medium"),
    
    # Test Case 3: Poor performance
    (3.5, 1, "high"),
    
    # Test Case 4: Extremely poor performance
    (10.0, 1, "high"),
    
    # Test Case 5: Perfect performance (boundary)
    (1.0, 0, None)
]

# The @pytest.mark.parametrize decorator tells pytest to run the test below
# once for each item in our `performance_test_cases` list.
@pytest.mark.parametrize("response_time, expected_count, expected_severity", performance_test_cases)
def test_performance_monitor_with_various_times(response_time, expected_count, expected_severity):
    """
    Tests the performance monitor with different response times to ensure
    it produces the correct number and severity of anomalies for each case.
    """
    # Act: Run the performance check with the current test case's response time
    anomalies = PerformanceMonitor.check_performance(response_time)

    # Assert: Check if the number of anomalies is what we expect for this case
    assert len(anomalies) == expected_count

    # If we expected an anomaly, also check if its severity is correct
    if expected_count > 0:
        assert anomalies[0]["severity"] == expected_severity