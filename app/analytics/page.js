// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// export default function AnalyticsPage() {
//   const [settlements, setSettlements] = useState([]);
//   const [analytics, setAnalytics] = useState({
//     totalTrades: 0,
//     settledTrades: 0,
//     pendingTrades: 0,
//     averageSettlementTime: 0,
//     delayedTrades: [],
//   });

//   useEffect(() => {
//     fetchAnalytics();
//   }, []);

//   const fetchAnalytics = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/settlements");
//       const data = res.data;
//       setSettlements(data);
//       calculateAnalytics(data);
//     } catch (err) {
//       console.error("Failed to fetch analytics", err);
//     }
//   };

//   const calculateAnalytics = (data) => {
//     const totalTrades = data.length;
//     const settledTrades = data.filter(t => t.status === "SETTLED").length;
//     const pendingTrades = totalTrades - settledTrades;

//     const settledTradesWithTime = data.filter(t => t.status === "SETTLED" && t.settlementTime);
//     const averageSettlementTime = settledTradesWithTime.length > 0
//       ? settledTradesWithTime.reduce((sum, t) => sum + t.settlementTime, 0) / settledTradesWithTime.length
//       : 0;

 
//     const delayedTrades = data.filter(t =>
//       t.status === "SETTLED" &&
//       t.settlementTime &&
//       t.settlementTime > 172800
//     );

//     setAnalytics({
//       totalTrades,
//       settledTrades,
//       pendingTrades,
//       averageSettlementTime,
//       delayedTrades,
//     });
//   };


//   const statusData = [
//     { name: "Settled", value: analytics.settledTrades, color: "#10B981" },
//     { name: "Pending", value: analytics.pendingTrades, color: "#F59E0B" },
//   ];

//   const trendData = settlements
//     .filter(t => t.timestamp)
//     .sort((a, b) => a.timestamp - b.timestamp)
//     .map((trade, index) => ({
//       date: new Date(trade.timestamp * 1000).toLocaleDateString(),
//       trades: index + 1,
//       settled: trade.status === "SETTLED" ? 1 : 0,
//     }));

//   const settlementTimeData = settlements
//     .filter(t => t.settlementTime)
//     .map(t => ({
//       tradeId: t.tradeId,
//       time: t.settlementTime / 3600, 
//     }));

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-semibold">Settlement Analytics</h1>
//         <p className="text-gray-400 mt-2">
//           AI-powered insights into settlement patterns and delays
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//           <p className="text-gray-400 text-sm">Total Trades</p>
//           <h3 className="text-2xl font-bold mt-2">{analytics.totalTrades}</h3>
//         </div>
//         <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//           <p className="text-gray-400 text-sm">Settlement Rate</p>
//           <h3 className="text-2xl font-bold mt-2 text-green-400">
//             {analytics.totalTrades > 0 ? Math.round((analytics.settledTrades / analytics.totalTrades) * 100) : 0}%
//           </h3>
//         </div>
//         <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//           <p className="text-gray-400 text-sm">Avg Settlement Time</p>
//           <h3 className="text-2xl font-bold mt-2">
//             {analytics.averageSettlementTime > 0 ? `${Math.round(analytics.averageSettlementTime / 3600)}h` : "N/A"}
//           </h3>
//         </div>
//         <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//           <p className="text-gray-400 text-sm">Delayed Trades</p>
//           <h3 className="text-2xl font-bold mt-2 text-red-400">
//             {analytics.delayedTrades.length}
//           </h3>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//           <h2 className="text-xl font-semibold mb-4">Settlement Status</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={statusData}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 dataKey="value"
//                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//               >
//                 {statusData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>


//         <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//           <h2 className="text-xl font-semibold mb-4">Settlement Trend</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={trendData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="trades" stroke="#3B82F6" strokeWidth={2} />
//               <Line type="monotone" dataKey="settled" stroke="#10B981" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>


//       <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//         <h2 className="text-xl font-semibold mb-4">Settlement Time Analysis</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={settlementTimeData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="tradeId" />
//             <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
//             <Tooltip formatter={(value) => [`${value.toFixed(1)} hours`, 'Settlement Time']} />
//             <Bar dataKey="time" fill="#8B5CF6" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* AI-Flagged Delays */}
//       {analytics.delayedTrades.length > 0 && (
//         <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//           <h2 className="text-xl font-semibold mb-4 text-red-400">⚠️ AI-Flagged Settlement Delays</h2>
//           <div className="space-y-4">
//             {analytics.delayedTrades.map((trade) => (
//               <div key={trade.tradeId} className="bg-red-900/20 border border-red-800 rounded p-4">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="font-semibold">Trade #{trade.tradeId}</p>
//                     <p className="text-sm text-gray-400">
//                       Settlement time: {trade.settlementTime ? `${Math.round(trade.settlementTime / 3600)} hours` : "Unknown"}
//                     </p>
//                   </div>
//                   <span className="bg-red-600 px-2 py-1 rounded text-xs">DELAYED</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";

export default function AnalyticsPage() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/trades")
      .then(res => setTrades(res.data))
      .catch(console.error);
  }, []);

  const total = trades.length;
  const settled = trades.filter(t => t.status === "SETTLED").length;
  const pending = total - settled;

  const avgTime =
    trades
      .filter(t => t.settlementTime)
      .reduce((a, b) => a + b.settlementTime, 0) /
    (settled || 1);

  const delayed = trades.filter(
    t => t.settlementTime && t.settlementTime > 172800 // > 2 days
  );

  const pieData = [
    { name: "Settled", value: settled, color: "#10B981" },
    { name: "Pending", value: pending, color: "#F59E0B" },
  ];

  const trendData = trades.map((t, i) => ({
    index: i + 1,
    settled: t.status === "SETTLED" ? 1 : 0,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Settlement Analytics</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <Stat title="Total Trades" value={total} />
        <Stat title="Settlement Rate" value={`${Math.round((settled / (total || 1)) * 100)}%`} />
        <Stat title="Avg Settlement Time" value={settled ? `${Math.round(avgTime / 3600)}h` : "N/A"} />
        <Stat title="Delayed Trades" value={delayed.length} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <ChartBox title="Settlement Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80}>
                {pieData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Settlement Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="settled" stroke="#3B82F6" />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>

      {/* AI Flags */}
      {delayed.length > 0 && (
        <div className="bg-red-900/20 border border-red-800 p-6 rounded">
          <h2 className="text-red-400 font-semibold mb-4">
            ⚠️ AI-Flagged Delays
          </h2>
          {delayed.map(t => (
            <p key={t.tradeId}>
              Trade #{t.tradeId} delayed ({Math.round(t.settlementTime / 3600)}h)
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
      <p className="text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}

function ChartBox({ title, children }) {
  return (
    <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </div>
  );
}

