from flask import Flask, jsonify
from flask_cors import CORS
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import os
import time

app = Flask(__name__)
CORS(app)

@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '-1'
    return response

DATA_FILE = "settlements.json"

def load_data():
    if not os.path.exists(DATA_FILE):
        print("settlements.json missing. Regenerating data...")
        try:
            from generate_settlement_data import generate_data
            generate_data()
        except Exception as e:
            print(f"Failed to regenerate data: {e}")
            return []
            
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error reading settlements.json: {e}")
        return [] # Return empty list instead of crashing
    except Exception as e:
        print(f"Unexpected error reading data: {e}")
        return []


@app.route('/trades', methods=['GET'])
def get_trades():
    raw_data = load_data()
    trades = []
    
    # We need a DataFrame to run ML
    df_data = []

    for item in raw_data:
        t_id = int(item['tradeId'])
        status_val = str(item['status'])
        timestamp = int(item['timestamp'])
        
        # Read directly from JSON - NO HARDCODED SIMULATION
        settled_at = item.get('settledAt')
        
        status = "SETTLED" if status_val == "1" else "PENDING"
        
        if status == "SETTLED":
            if settled_at:
                settlement_time = int(settled_at) - timestamp
            else:
                # Fallback if JSON is malformed
                settlement_time = 0
                settled_at = timestamp
        else:
            # Pending: Calculate elapsed time
            current_time = int(time.time())
            settlement_time = current_time - timestamp
            settled_at = None

        trade_obj = {
            "tradeId": t_id,
            "status": status,
            "createdAt": timestamp,
            "settledAt": settled_at,
            "settlementTime": settlement_time
        }
        trades.append(trade_obj)
        
        if status == "SETTLED" and settlement_time > 0:
            df_data.append({"tradeId": t_id, "settlementTime": settlement_time})

    # ML Logic: Detect Anomalies in Settlement Time
    if len(df_data) > 0:
        df = pd.DataFrame(df_data)
        X = df[["settlementTime"]].values
        
        # Use Isolation Forest to detect anomalies
        # contamination='auto' lets the model decide, or we can stick to a fixed ratio if preferred
        clf = IsolationForest(contamination=0.1, random_state=42)
        df["anomaly"] = clf.fit_predict(X)
        
        # Map anomalies back to trades
        # -1 indicates anomaly, 1 indicates normal
        anomaly_map = dict(zip(df["tradeId"], df["anomaly"]))
        
        for trade in trades:
            t_id = trade["tradeId"]
            if t_id in anomaly_map:
                # -1 from IsolationForest means anomaly/outlier
                is_anomaly = True if anomaly_map[t_id] == -1 else False
                trade["isAnomaly"] = is_anomaly
                trade["aiFlagged"] = is_anomaly # explicit field for UI
            else:
                trade["isAnomaly"] = False
                trade["aiFlagged"] = False

    return jsonify(trades)

@app.route('/settlements', methods=['GET'])
def get_settlements():
    return get_trades()

@app.route('/audit', methods=['GET'])
def get_audit():
    return get_trades()

if __name__ == '__main__':
    print("Starting Flask AI Analytics Server (Dynamic Mode)...")
    app.run(host='0.0.0.0', port=5000, debug=True)
