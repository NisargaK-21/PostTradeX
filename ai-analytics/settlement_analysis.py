import json
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import matplotlib.pyplot as plt
import os

# Load settlement data
try:
    with open("settlements.json", "r") as f:
        data = json.load(f)
except FileNotFoundError:
    print("settlements.json not found. Run generate_settlement_data.py first.")
    exit(1)

if not data:
    print("No data in settlements.json")
    exit(1)

df = pd.DataFrame(data)

# Convert fields
df["tradeId"] = df["tradeId"].astype(str) # Keep tradeId as string for better labeling
df["timestamp"] = pd.to_numeric(df["timestamp"])

# Filter for settled trades only for anomaly detection
settled_df = df[df["status"] == "1"].copy()
# Handle potential missing or null settledAt
settled_df = settled_df.dropna(subset=["settledAt"])
settled_df["settledAt"] = pd.to_numeric(settled_df["settledAt"])

# Calculate settlement delay in seconds
settled_df["delay"] = settled_df["settledAt"] - settled_df["timestamp"]

print(f"Total Trades: {len(df)}")
print(f"Settled Trades: {len(settled_df)}")
print(f"Pending Trades: {len(df) - len(settled_df)}")

if len(settled_df) > 0:
    # AI Model: Detect abnormal delays
    # contamination=0.1 means we expect ~10% anomalies
    model = IsolationForest(contamination=0.1, random_state=42)
    settled_df["anomaly"] = model.fit_predict(settled_df[["delay"]])

    # Flag anomalies (-1 is anomaly)
    anomalies = settled_df[settled_df["anomaly"] == -1]

    print("\n🚨 Abnormal Settlement Delays Detected (ML - Isolation Forest):")
    print(anomalies[["tradeId", "delay"]])
    print(f"\nTotal Anomalies Found: {len(anomalies)}")

    # Plot delays
    plt.figure(figsize=(10, 6))
    
    # Plot normal points
    normal = settled_df[settled_df["anomaly"] == 1]
    plt.scatter(normal["tradeId"], normal["delay"], c='blue', alpha=0.6, label="Normal")
    
    # Plot anomalies
    plt.scatter(anomalies["tradeId"], anomalies["delay"], c='red', s=50, label="Anomaly")
    
    plt.xlabel("Trade ID")
    plt.ylabel("Settlement Delay (seconds)")
    plt.title("Settlement Delay Analysis (Real Data)")
    plt.xticks(rotation=45, fontsize=8)
    
    # Only show x-ticks if there are not too many
    if len(settled_df) > 50:
        plt.xticks([])
        
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.5)
    plt.tight_layout()
    try:
        plt.show()
    except Exception as e:
        print(f"Could not display plot: {e}")
else:
    print("No settled trades to analyze.")
