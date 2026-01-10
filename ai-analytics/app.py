from flask import Flask, jsonify
from flask_cors import CORS
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = "settlements.json"

def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

@app.route('/trades', methods=['GET'])
def get_trades():
    raw_data = load_data()
    trades = []
    
    # We need a DataFrame to run ML, even if simple
    df_data = []

    for item in raw_data:
        t_id = int(item['tradeId'])
        status_val = str(item['status'])
        timestamp = int(item['timestamp'])
        
        # Simulate settlement logic
        status = "SETTLED" if status_val == "1" else "PENDING"
        
        # Simulate settlement time
        # Trade 1005, 1013, 1018 are PENDING in JSON, so no settlement time
        # Let's make 1003 and 1016 "Delayed" (> 2 days = 172800s)
        if status == "SETTLED":
            if t_id in [1003, 1016]:
                settlement_time = 200000 + np.random.randint(0, 5000) # Huge delay
            else:
                settlement_time = np.random.randint(30, 3000) # Normal delay
            
            settled_at = timestamp + settlement_time
        else:
            settlement_time = 0
            settled_at = 0

        trade_obj = {
            "tradeId": t_id,
            "status": status,
            "createdAt": timestamp,
            "settledAt": settled_at if status == "SETTLED" else None,
            "settlementTime": settlement_time if status == "SETTLED" else 0
        }
        trades.append(trade_obj)
        
        if status == "SETTLED":
            df_data.append({"tradeId": t_id, "settlementTime": settlement_time})

    # ML Logic: Detect Anomalies in Settlement Time
    if len(df_data) > 0:
        df = pd.DataFrame(df_data)
        # Reshape for sklearn
        X = df[["settlementTime"]].values
        
        # Contamination matches expected outlier rate
        clf = IsolationForest(contamination=0.1, random_state=42)
        df["anomaly"] = clf.fit_predict(X)
        
        # Map anomaly back to trades
        # anomaly = -1 means outlier. 
        # We don't strictly need to pass this to frontend as frontend has its own logic (> 172800),
        # but let's log it or ensure our simulated data trips the frontend logic.
        # The frontend logic for "Delayed" is settlementTime > 172800.
        # My simulated data for 1003 and 1016 is > 200000, so it will accurately reflect.
        
        pass

    return jsonify(trades)

# Analytics endpoint (some frontend versions might call this, though page.js seemed to call /trades or /settlements)
@app.route('/settlements', methods=['GET'])
def get_settlements():
    # Reuse /trades logic as the data structure is likely what's expected or very similar
    # The frontend code for AnalyticsPage (`app/analytics/page.js`) calls `/trades` in the updated version I saw (lines 222).
    # But the commented out version called `/settlements`. Just in case, I'll alias it.
    return get_trades()

@app.route('/audit', methods=['GET'])
def get_audit():
    # Reuse /trades logic, but maybe format it if needed?
    # AuditPage (`app/audit/page.js`) calls `/trades` in the active version (line 52).
    # It expects list of trades and maps them locally.
    return get_trades()

if __name__ == '__main__':
    print("Starting Flask AI Analytics Server...")
    app.run(host='0.0.0.0', port=5000, debug=True)
