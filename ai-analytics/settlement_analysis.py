import json
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import matplotlib.pyplot as plt

# Load settlement data
with open("data/settlements.json") as f:
    data = json.load(f)

df = pd.DataFrame(data)

# Convert fields
df["tradeId"] = df["tradeId"].astype(int)
df["timestamp"] = df["timestamp"].astype(int)
df["status"] = df["status"].astype(int)

# Simulate settlement time
# (In real systems this comes from settlement timestamp)
df["settlement_time"] = df["timestamp"] + np.random.randint(30, 300, size=len(df))

# Settlement delay in seconds
df["delay"] = df["settlement_time"] - df["timestamp"]

# AI Model: Detect abnormal delays
model = IsolationForest(contamination=0.15, random_state=42)
df["anomaly"] = model.fit_predict(df[["delay"]])

# Flag anomalies
anomalies = df[df["anomaly"] == -1]

print("\n🚨 Abnormal Settlement Delays Detected:")
print(anomalies[["tradeId", "delay"]])

# Plot delays
plt.figure(figsize=(8, 4))
plt.scatter(df["tradeId"], df["delay"], label="Normal")
plt.scatter(anomalies["tradeId"], anomalies["delay"], color="red", label="Anomaly")
plt.xlabel("Trade ID")
plt.ylabel("Settlement Delay (seconds)")
plt.title("Settlement Delay Analysis")
plt.legend()
plt.show()
