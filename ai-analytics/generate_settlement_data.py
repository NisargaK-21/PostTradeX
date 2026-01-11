import json
import random
import time
from datetime import datetime, timedelta
import numpy as np

def generate_data():
    records = []
    base_time = datetime.now() - timedelta(days=10) # Start 10 days ago
    
    print(f"Generating synthetic trade data...")
    
    for i in range(50):
        trade_id = 1000 + i
        
        # Random trade time within the last 10 days
        trade_time_offset = random.randint(0, 10 * 24 * 3600)
        trade_time = base_time + timedelta(seconds=trade_time_offset)
        timestamp = int(trade_time.timestamp())
        
        # 80% settled, 20% pending
        if random.random() < 0.8:
            status = "1" # SETTLED
            
            # Normal settlement: 1-2 minutes (for demo) or 1-2 days
            # Let's use T+1 (1 day) as baseline for "normal"
            settlement_seconds = 24 * 3600 + random.randint(-3600, 3600) 
            
            # Inject Anomalies (High Delay) - hardcoded probability, but dynamic ID
            if random.random() < 0.1: # 10% anomalies
                settlement_seconds += random.randint(48 * 3600, 100 * 3600) # +2 to 4 days delay
            
            settled_at = timestamp + settlement_seconds
        else:
            status = "0" # PENDING
            settled_at = None 

        record = {
            "tradeId": str(trade_id),
            "buyer": f"0x{random.randint(100000,999999)}...",
            "seller": f"0x{random.randint(100000,999999)}...",
            "status": status,
            "timestamp": timestamp,
            "settledAt": settled_at if status == "1" else None
        }
        records.append(record)

    with open("settlements.json", "w") as f:
        json.dump(records, f, indent=2)
    
    print(f"✅ Generated {len(records)} trades in settlements.json")

if __name__ == "__main__":
    generate_data()
