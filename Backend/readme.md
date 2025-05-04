# Website Analyzer — Backend
A FastAPI-based service for scanning websites for security, performance, SEO, accessibility, threat intelligence, and AI-powered insights.


________________________________________
🚀 Tech Stack

•	Python 3.10+
•	FastAPI for building the HTTP API
•	Uvicorn as the ASGI server
•	Motor (AsyncIO MongoDB driver) for database operations
•	HTTPX for asynchronous HTTP requests
•	Playwright for capturing screenshots
•	BeautifulSoup for HTML parsing
•	Transformers (T5/Flan-T5) for AI summarization and suggestions
•	dotenv for managing environment variables
•	slowapi for rate limiting
•	pydantic for data validation



________________________________________
🗂️ Directory Structure

app/
├── main.py                     # Entry point for the FastAPI application
├── models.py                   # Pydantic models for request/response validation
├── analyzer/                   # Core analysis logic
│   ├── fetcher.py              # Fetch website data and screenshots
│   ├── security_checker.py     # Security checks
│   ├── performance_monitor.py  # Performance checks
│   ├── malware_scanner.py      # Malware detection
│   ├── contextual_analyzer.py  # Context-based anomaly adjustments
│   ├── nlp_utils.py            # NLP utilities for AI recommendations
│   ├── seo_scanner.py          # SEO analysis
│   ├── accessibility_scanner.py # Accessibility checks
│   ├── threat_intel.py         # Threat intelligence integration
│   ├── ai_utils.py             # AI-powered utilities
│   └── utils.py                # Helper functions
├── genai/
│   └── ai_assistant.py         # AI assistant for advanced recommendations
├── database/
│   └── db_manager.py           # MongoDB database manager
└── image_classifier.py         # Image classification logic
________________________________________




⚙️ Setup & Installation

1.	Clone the repository and create a virtual environment:
bash
RunCopy code
1git clone <repo-url>
2cd backend
3python -m venv venv
4source venv/bin/activate  # On Windows: venv\Scripts\activate

2.	Install dependencies:
bash
RunCopy code
1pip install -r requirements.txt

3.	Set up environment variables: Create a .env file in the backend directory with the following:
RunCopy code
1MONGO_URI=mongodb://localhost:27017
2VIRUSTOTAL_API_KEY=<your_vt_key>
3ABUSEIPDB_API_KEY=<your_abuseipdb_key>

4.	Run the server:
bash
RunCopy code
1uvicorn app.main:app --reload
________________________________________



📡 API Endpoints
POST /analyze
Request:
json
RunCopy code
1{ "url": "https://example.com" }
Response: Includes detailed analysis results such as risk score, anomalies, recommendations, and more.
GET /history/{domain}
Response: Returns the last 10 scans for the specified domain.
GET /health
Response:
json
RunCopy code
1{ "status": "healthy", "timestamp": "..." }
________________________________________



🔄 Data Flow
1.	Fetch: Retrieve website data using HTTPX.
2.	Screenshot: Capture using Playwright.
3.	Analyze: Perform security, performance, SEO, and accessibility checks.
4.	Threat Intel: Gather data from VirusTotal and AbuseIPDB.
5.	Store: Save results in MongoDB.
6.	Return: Enriched JSON response with analysis results.
________________________________________



🗒️ Notes
•	Rate Limiting: 5 requests per minute per IP.
•	CORS: Open for development; adjust in production.
•	Error Handling: Non-200 responses are flagged as unknown.
•	Customization: Integrate custom AI models via AIAssistant.
________________________________________



   🤖 Built with care for comprehensive website analysis.

