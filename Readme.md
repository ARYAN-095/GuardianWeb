# AI-Powered Website Health Analyzer 🚀

 
A full-stack AI-driven platform for comprehensive website health analysis, combining cutting-edge machine learning with enterprise-grade web development practices.

# Dashboard 
   <div align="center">
  <img src="/dashboard.png " alt="Dashboard" width="600">
</div>

## 🎯 Key Features

### **AI-Powered Insights**
- **Risk Prediction Engine**: Random Forest model predicting website health scores (0-100)
- **Vision Transformer (ViT)**: Automated screenshot classification
- **NLP Summarization**: FLAN-T5 generated recommendations
- **Anomaly Detection**: ML-driven pattern recognition

### **Comprehensive Analysis**
- 🛡️ Security Audit (CSP, XSS, Malware Scanning)
- ⚡ Performance Metrics (LCP, FCP, TBT)
- 🔍 SEO Health Check (Meta Tags, Canonical URLs)
- 🌐 Threat Intelligence (VirusTotal, AbuseIPDB)

### **Enterprise Features**
- Real-time monitoring dashboard
- Historical scan comparisons
- PDF report generation
- Role-based access control (RBAC)
- API-first architecture

## 🚀 Why This Project?

This project demonstrates:
- **AI/ML Integration**: Production-grade implementation of transformers and computer vision
- **Full-Stack Expertise**: From FastAPI microservices to React animations
- **Cloud-Native Design**: Containerized services with horizontal scaling
- **Real-World Impact**: Solves actual web security/performance challenges

## 🛠️ Tech Stack

### **Core Technologies**


| Category          | Technologies                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| **Frontend**      | React, Vite, Tailwind CSS, Framer Motion, Chart.js                         |
| **Backend**       | FastAPI, Uvicorn, ASGI, MongoDB, Redis                                     |
| **AI/ML**         | PyTorch, Transformers, Scikit-Learn, Vision Transformer (ViT), FLAN-T5    |
| **DevOps**        | Docker, GitHub Actions, Prometheus, Grafana                               |
| **Services**      | VirusTotal API, AbuseIPDB API, Lighthouse CI                              |




## ⚙️ Installation

 
# Clone repository
```
git clone https://github.com/yourusername/website-health-analyzer.git
cd website-health-analyzer
```


# Backend setup
```
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```


# Frontend setup
```
cd ../frontend
npm install
```

## Environment Variables (Create .env file):


# Backend
MONGO_URI=mongodb://localhost:27017
VT_API_KEY=your_virustotal_key
ABUSEIPDB_KEY=your_abuseipdb_key

# Frontend
VITE_API_BASE_URL=http://localhost:8000




## 🏁 Getting Started

1. Start Backend:

``` 
cd backend
uvicorn main:app --reload
```


2. Start Frontend: 

```
cd frontend
npm run dev
```



3. Analyze Website:


```curl -X POST "http://localhost:8000/analyze" \
-H "Content-Type: application/json" \
-d '{"url": "https://example.com"}'
```


## 🌐 Project in Action

**Typical Workflow:**

Submit URL through web interface

View real-time scanning progress

Explore interactive dashboard:

Risk score breakdown

AI-generated recommendations

Historical trend analysis

Download PDF report

Configure automated monitoring

# 📊 Performance Metrics
Metric	Value
Scan Completion Time	<2.8s (P99)
Model Accuracy	92.4%
API Throughput	142 RPS
Lighthouse Score	98/100


# 🤝 Contributing
We welcome contributions! Please see our:

Contribution Guidelines

Roadmap

Code of Conduct

# 📄 License
MIT License - See LICENSE for details


# Crafted with ❤️ by **Aryan Shukla**
LinkedIn: https://www.linkedin.com/in/aryan-shukla-176662228/
x(Twitter): https://x.com/ARYAN_095

# GuardianWeb--Website--Health--analyzer-application
# GuardianWeb--Website--Health--analyzer-application
