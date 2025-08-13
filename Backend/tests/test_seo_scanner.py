# tests/test_seo_scanner.py

from app.analyzer.seo_scanner import SEOScanner

def test_seo_scanner_multiple_issues():
    """
    Tests if the SEO scanner correctly identifies multiple issues from sample HTML.
    """
    # Arrange: Create sample HTML with a short title and no meta description
    sample_html = """
    <html>
      <head>
        <title>Hi</title>
      </head>
      <body>
        <h1>Main Heading</h1>
        <h1>Another Main Heading</h1>
      </body>
    </html>
    """
    
    # Act: Run the SEO scan
    issues, metadata = SEOScanner.scan(sample_html, "http://example.com")
    
    # Assert: Check for the expected issues
    assert len(issues) == 4
    
    # Create a set of the messages for easy checking
    issue_messages = {issue['message'] for issue in issues}
    
    assert "Missing or short <title> tag." in issue_messages
    assert "Missing or short meta description." in issue_messages
    assert "Multiple <h1> tags found." in issue_messages
    assert "Missing canonical URL." in issue_messages