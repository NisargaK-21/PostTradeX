"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/settlements")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Settlement Analytics</h1>

      <div className="bg-gray-900 p-6 rounded">
        <h2 className="mb-4 font-semibold">Settlement Trend</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats}>
            <XAxis dataKey="tradeId" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
