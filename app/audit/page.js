"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/audit")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>

      <div className="space-y-4">
        {logs.length === 0 && (
          <p className="text-gray-400">No audit records found.</p>
        )}

        {logs.map((log, index) => (
          <div
            key={index}
            className="bg-gray-900 p-4 rounded border border-gray-800"
          >
            <p><b>Action:</b> {log.action}</p>
            <p><b>Trade ID:</b> {log.tradeId}</p>
            <p><b>Timestamp:</b> {log.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
