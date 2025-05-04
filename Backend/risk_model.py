# risk_model.py

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
import joblib

# For reproducibility
np.random.seed(42)

# Number of synthetic samples
n_samples = 300

# Generate synthetic features

# security_count: integer 0 to 5
security_count = np.random.randint(0, 6, n_samples)

# performance_count: integer 0 to 3
performance_count = np.random.randint(0, 4, n_samples)

# avg_severity: simulate three levels: low (0.3), medium (0.6), high (0.9). 
# Randomly choose one for each sample.
severity_levels = [0.3, 0.6, 0.9]
avg_severity = np.random.choice(severity_levels, n_samples)

# load_time_ms: integer between 500 and 5000 ms
load_time_ms = np.random.randint(500, 5001, n_samples)

# page_size_kb: integer between 50 and 1500 KB
page_size_kb = np.random.randint(50, 1501, n_samples)

# Now, define a risk score function for synthetic purposes:
# Let’s say higher security_count and higher avg_severity increase risk,
# as well as higher load time and larger page size.
# We'll create a weighted sum and add some random noise.

# Weights
w_sec = 10
w_perf = 8
w_sev = 20
w_load = 0.01  # per millisecond
w_size = 0.02  # per kilobyte

# Compute base risk (you can adjust the formula as needed)
risk_score = (
    w_sec * security_count +
    w_perf * performance_count +
    w_sev * avg_severity +
    w_load * load_time_ms +
    w_size * page_size_kb +
    np.random.normal(0, 5, n_samples)  # add some noise
)

# Ensure risk score is between 0 and 100
risk_score = np.clip(risk_score, 0, 100)

# Create a dataframe
data = pd.DataFrame({
    "security_count": security_count,
    "performance_count": performance_count,
    "avg_severity": avg_severity,
    "load_time_ms": load_time_ms,
    "page_size_kb": page_size_kb,
    "risk_score": risk_score
})

# Optionally, save the synthetic dataset for inspection
data.to_csv("risk_data.csv", index=False)
print("Synthetic dataset generated and saved to risk_data.csv")

# Train/test split
X = data[["security_count", "performance_count", "avg_severity", "load_time_ms", "page_size_kb"]]
y = data["risk_score"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a RandomForestRegressor model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
preds = model.predict(X_test)
mse = mean_squared_error(y_test, preds)
rmse = np.sqrt(mse)
print(f"Mean Squared Error: {mse:.2f}")
print(f"Root Mean Squared Error: {rmse:.2f}")

# Save the model to disk
joblib.dump(model, "risk_model.pkl")
print("Model trained and saved as risk_model.pkl")
