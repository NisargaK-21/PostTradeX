import json
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import time

try:
    with open("settlements.json", "r") as f:
        raw_data = json.load(f)
    print(f"Loaded {len(raw_data)} records")

    trades = []
    df_data = []

    for item in raw_data:
        t_id = int(item['tradeId'])
        status_val = str(item['status'])
        timestamp = int(item['timestamp'])
        settled_at = item.get('settledAt')
        
        status = "SETTLED" if status_val == "1" else "PENDING"
        
        if status == "SETTLED":
            if settled_at:
                settlement_time = int(settled_at) - timestamp
            else:
                settlement_time = 0
        else:
            current_time = int(time.time())
            settlement_time = current_time - timestamp

        if status == "SETTLED" and settlement_time > 0:
            df_data.append({"tradeId": t_id, "settlementTime": settlement_time})

    print(f"Data for ML: {len(df_data)} records")
    
    if len(df_data) > 0:
        df = pd.DataFrame(df_data)
        X = df[["settlementTime"]].values
        
        print("Running IsolationForest...")
        clf = IsolationForest(contamination=0.1, random_state=42)
        df["anomaly"] = clf.fit_predict(X)
        print("IsolationForest completed.")
        
except Exception as e:
    print(f"CRASH: {e}")
    import traceback
    traceback.print_exc()
