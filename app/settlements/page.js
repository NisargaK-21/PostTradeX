"use client";
import { useEffect, useState } from "react";
import { getSettlements } from "../../lib/api";


export default function Settlements() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getSettlements().then(res => setData(res.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Settlement Overview</h1>

      <div className="mt-6 space-y-4">
        {data.map((s, i) => (
          <div key={i} className="bg-gray-900 p-4 rounded">
            <p>Trade ID: {s.tradeId}</p>
            <p>Status: {s.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
