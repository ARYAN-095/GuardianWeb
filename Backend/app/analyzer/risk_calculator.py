# app/analyzer/risk_calculator.py
import joblib
import numpy as np
import pandas as pd
from typing import Dict

# Load the model once at startup
risk_model = joblib.load("risk_model.pkl")

def predict_risk_score(features: Dict) -> int:
    feature_names = ["security_count", "performance_count", "avg_severity", "load_time_ms", "page_size_kb"]
    # Use a pandas DataFrame to align feature names
    X = pd.DataFrame([[features.get(f, 0) for f in feature_names]], columns=feature_names)
    return int(risk_model.predict(X)[0])
