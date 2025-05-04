import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from pathlib import Path
from typing import Dict, Optional, List


# Correct import of db_manager
from app.database.db_manager import db_manager


class RiskModel:
    SEVERITY_WEIGHTS = {'low': 1, 'medium': 2, 'high': 3}
    
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.features = [
            'security_count', 
            'performance_count',
            'avg_severity',
            'load_time_ms',
            'page_size_kb'
        ]

    async def prepare_data(self) -> pd.DataFrame:
        """Collect and format training data from database"""
        scans = await db_manager.get_scans(limit=10000)
        rows = []
        for scan in scans:
            anomalies = scan.get('anomalies', [])
            stats = scan.get('page_stats', {})

            sec_cnt  = sum(1 for a in anomalies if a['type']=='security')
            perf_cnt = sum(1 for a in anomalies if a['type']=='performance')
            sev_vals = [self.SEVERITY_WEIGHTS.get(a['severity'],1) for a in anomalies]
            avg_sev  = sum(sev_vals)/len(sev_vals) if sev_vals else 0

            rows.append({
                'security_count':   sec_cnt,
                'performance_count':perf_cnt,
                'avg_severity':     avg_sev,
                'load_time_ms':     stats.get('load_time_ms',0),
                'page_size_kb':     stats.get('page_size_kb',0),
                'risk_score':       scan.get('risk_score',0)
            })

        return pd.DataFrame(rows)

    async def train(self, test_size: float = 0.2) -> Dict[str, float]:
        """Train and persist the RandomForest model."""
        df = await self.prepare_data()
        if df.empty:
            return {'mse': None, 'r2_score': None}

        X = df[self.features]
        y = df['risk_score']

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )

        self.model.fit(X_train, y_train)

        # ensure the model directory exists
        model_path = Path("app/models")
        model_path.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.model, model_path / "risk_model.pkl")

        preds = self.model.predict(X_test)
        return {
            'mse': mean_squared_error(y_test, preds),
            'r2_score': self.model.score(X_test, y_test)
        }

    def predict(self, features: Dict) -> int:
        """Load the persisted model and predict a risk score."""
        model_file = Path("app/models/risk_model.pkl")
        if not model_file.exists():
            raise FileNotFoundError("Risk model not found; train first.")
        model = joblib.load(model_file)
        arr = np.array([[features.get(f,0) for f in self.features]])
        return int(model.predict(arr)[0])
    

risk_model = RiskModel()

def predict_risk_score(features: dict) -> int:
    return risk_model.predict(features)    
