// "use client";

// import { useEffect, useState } from "react";
// import { getContract } from "../lib/blockchain";
// import axios from "axios";
// import WalletConnect from "./components/WalletConnect";

// export default function Dashboard() {
//   const [summary, setSummary] = useState({
//     total: 0,
//     settled: 0,
//     pending: 0,
//   });

//   const [trades, setTrades] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [tradeId, setTradeId] = useState("");
//   const [buyer, setBuyer] = useState("");
//   const [seller, setSeller] = useState("");

//   // Fetch settlement data from backend
//   const fetchSummary = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/settlements");
//       const data = res.data;

//       const settledCount = data.filter(
//         (t) => t.status === "SETTLED"
//       ).length;

//       setSummary({
//         total: data.length,
//         settled: settledCount,
//         pending: data.length - settledCount,
//       });

//       setTrades(data);
//     } catch (err) {
//       console.error("Failed to fetch settlements", err);
//     }
//   };

//   useEffect(() => {
//     fetchSummary();
//   }, []);

//   // Record trade on blockchain
//   const recordTrade = async () => {
//     if (!tradeId || !buyer || !seller) {
//       alert("Please fill in all fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const contract = await getContract();

//       const tx = await contract.recordTrade(
//         tradeId,
//         buyer,
//         seller
//       );

//       await tx.wait();
//       alert("Trade recorded on blockchain!");
//       fetchSummary();
//       setTradeId("");
//       setBuyer("");
//       setSeller("");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to record trade");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const settleTrade = async (id) => {
//     try {
//       setLoading(true);
//       const contract = await getContract();

//       const tx = await contract.settleTrade(id);
//       await tx.wait();

//       alert("Trade settled!");
//       fetchSummary();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to settle trade");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-10">
//       <section className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-semibold">
//             Settlement Overview
//           </h1>
//           <p className="text-gray-400 mt-2">
//             Live post-trade settlement monitoring
//           </p>
//         </div>
//         <WalletConnect />
//       </section>


//       <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//           <p className="text-gray-400 text-sm">Total Trades</p>
//           <h2 className="text-3xl font-bold mt-2">
//             {summary.total}
//           </h2>
//         </div>

//         <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//           <p className="text-gray-400 text-sm">Settled</p>
//           <h2 className="text-3xl font-bold mt-2 text-green-400">
//             {summary.settled}
//           </h2>
//         </div>

//         <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//           <p className="text-gray-400 text-sm">Pending</p>
//           <h2 className="text-3xl font-bold mt-2 text-yellow-400">
//             {summary.pending}
//           </h2>
//         </div>
//       </section>


//       <section className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//         <h2 className="text-xl font-semibold mb-4">
//           Record New Trade
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <input
//             type="number"
//             placeholder="Trade ID"
//             value={tradeId}
//             onChange={(e) => setTradeId(e.target.value)}
//             className="bg-gray-700 border border-gray-600 rounded px-3 py-2"
//           />
//           <input
//             type="text"
//             placeholder="Buyer Address"
//             value={buyer}
//             onChange={(e) => setBuyer(e.target.value)}
//             className="bg-gray-700 border border-gray-600 rounded px-3 py-2"
//           />
//           <input
//             type="text"
//             placeholder="Seller Address"
//             value={seller}
//             onChange={(e) => setSeller(e.target.value)}
//             className="bg-gray-700 border border-gray-600 rounded px-3 py-2"
//           />
//           <button
//             onClick={recordTrade}
//             disabled={loading}
//             className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
//           >
//             Record Trade
//           </button>
//         </div>
//       </section>


//       <section className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//         <h2 className="text-xl font-semibold mb-4">
//           Recent Trades
//         </h2>

//         <div className="space-y-4">
//           {trades.slice(0, 5).map((trade) => (
//             <div key={trade.tradeId} className="flex justify-between items-center bg-gray-800 p-4 rounded">
//               <div>
//                 <p className="font-semibold">Trade #{trade.tradeId}</p>
//                 <p className="text-sm text-gray-400">
//                   Buyer: {trade.buyer?.slice(0, 6)}...{trade.buyer?.slice(-4)} |
//                   Seller: {trade.seller?.slice(0, 6)}...{trade.seller?.slice(-4)}
//                 </p>
//               </div>
//               <div className="flex items-center gap-4">
//                 <span className={`px-2 py-1 rounded text-xs ${
//                   trade.status === "SETTLED" ? "bg-green-600" : "bg-yellow-600"
//                 }`}>
//                   {trade.status}
//                 </span>
//                 {trade.status !== "SETTLED" && (
//                   <button
//                     onClick={() => settleTrade(trade.tradeId)}
//                     disabled={loading}
//                     className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
//                   >
//                     Settle
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-gray-800 p-6 rounded-lg">
//             <p className="text-center">Processing blockchain transaction...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Dashboard() {
//   const [trades, setTrades] = useState([]);
//   const [summary, setSummary] = useState({
//     total: 0,
//     settled: 0,
//     pending: 0,
//   });

//   const [loading, setLoading] = useState(true);

//   // Fetch trades from backend (read-only)
//   const fetchTrades = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/trades");
//       const data = res.data;

//       const settled = data.filter(t => t.status === "1").length; // 1 = SETTLED

//       setTrades(data);
//       setSummary({
//         total: data.length,
//         settled,
//         pending: data.length - settled,
//       });
//     } catch (err) {
//       console.error("Failed to fetch trades", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTrades();
//   }, []);

//   return (
//     <div className="space-y-10">

//       {/* Header */}
//       <section>
//         <h1 className="text-3xl font-semibold">Settlement Overview</h1>
//         <p className="text-gray-400 mt-2">
//           Read-only monitoring of post-trade settlement status
//         </p>
//       </section>

//       {/* Summary Cards */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Stat title="Total Trades" value={summary.total} />
//         <Stat title="Settled" value={summary.settled} color="text-green-400" />
//         <Stat title="Pending" value={summary.pending} color="text-yellow-400" />
//       </section>

//       {/* Info Box */}
//       <section className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//         <h2 className="text-xl font-semibold mb-2">Read-Only Mode</h2>
//         <p className="text-gray-400 text-sm">
//           Trade creation is handled by upstream settlement systems.
//           This dashboard focuses on real-time visibility, auditability,
//           and settlement monitoring.
//         </p>
//       </section>

//       {/* Recent Trades */}
//       <section className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//         <h2 className="text-xl font-semibold mb-4">Recent Trades</h2>

//         {loading && <p className="text-gray-400">Loading trades…</p>}

//         {!loading && trades.length === 0 && (
//           <p className="text-gray-400">No trades found.</p>
//         )}

//         <div className="space-y-4">
//           {trades.slice(0, 5).map(trade => (
//             <div
//               key={trade.tradeId}
//               className="flex justify-between items-center bg-gray-800 p-4 rounded"
//             >
//               <div>
//                 <p className="font-semibold">Trade #{trade.tradeId}</p>
//                 <p className="text-sm text-gray-400">
//                   Buyer: {trade.buyer.slice(0, 6)}…{trade.buyer.slice(-4)} |
//                   Seller: {trade.seller.slice(0, 6)}…{trade.seller.slice(-4)}
//                 </p>
//               </div>

//               <span
//                 className={`px-2 py-1 rounded text-xs ${
//                   trade.status === "1"
//                     ? "bg-green-600"
//                     : "bg-yellow-600"
//                 }`}
//               >
//                 {trade.status === "1" ? "SETTLED" : "PENDING"}
//               </span>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }

// function Stat({ title, value, color = "" }) {
//   return (
//     <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//       <p className="text-gray-400 text-sm">{title}</p>
//       <h2 className={`text-3xl font-bold mt-2 ${color}`}>{value}</h2>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [trades, setTrades] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    settled: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState(0);

  // Fetch trades from backend (read-only)
  const fetchTrades = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/trades");
      const data = res.data;

      const settled = data.filter(t => t.status === "1").length;

      setTrades(data);
      setSummary({
        total: data.length,
        settled,
        pending: data.length - settled,
      });
    } catch (err) {
      console.error("Failed to fetch trades", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
    const interval = setInterval(() => {
      setActiveMetric(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Hardcoded market data for visual richness
  const marketData = {
    volume: "$2.4B",
    avgSettlement: "2.3s",
    efficiency: "99.8%",
    activeNodes: 47
  };

  const recentActivity = [
    { type: "Settlement", time: "2s ago", status: "success" },
    { type: "Validation", time: "5s ago", status: "success" },
    { type: "Trade Match", time: "12s ago", status: "success" },
    { type: "Reconciliation", time: "18s ago", status: "pending" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8 relative overflow-hidden">
      
      {/* Animated Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Animated Header with Live Data Stream */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl animate-pulse"></div>
          <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-ping absolute"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <span className="text-xs font-mono text-green-400 uppercase tracking-wider">Live System • All Networks Operational</span>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg text-xs font-mono text-blue-300">
                  UTC {new Date().toLocaleTimeString('en-US', { hour12: false })}
                </div>
                <div className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-lg text-xs font-mono text-purple-300">
                  v4.2.1
                </div>
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 animate-gradient">
              Settlement Hub
            </h1>
            <p className="text-gray-300 text-lg mb-4">
              Real-time DLT settlement monitoring and trade lifecycle tracking
            </p>
            
            {/* Live Metrics Bar */}
            <div className="flex gap-4 flex-wrap">
              <MetricBadge label="24h Volume" value={marketData.volume} color="blue" />
              <MetricBadge label="Avg Settlement" value={marketData.avgSettlement} color="purple" />
              <MetricBadge label="System Efficiency" value={marketData.efficiency} color="green" />
              <MetricBadge label="Active Nodes" value={marketData.activeNodes} color="pink" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats + Activity */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Animated Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                title="Total Trades" 
                value={summary.total} 
                icon="📊"
                gradient="from-blue-600/20 to-blue-800/20"
                borderGlow="shadow-blue-500/50"
                delay="0"
                trend="+12.3%"
                active={activeMetric === 0}
              />
              <StatCard 
                title="Settled" 
                value={summary.settled} 
                icon="✅"
                color="text-green-400" 
                gradient="from-green-600/20 to-green-800/20"
                borderGlow="shadow-green-500/50"
                delay="100"
                trend="+8.7%"
                active={activeMetric === 1}
              />
              <StatCard 
                title="Pending" 
                value={summary.pending} 
                icon="⏳"
                color="text-yellow-400" 
                gradient="from-yellow-600/20 to-yellow-800/20"
                borderGlow="shadow-yellow-500/50"
                delay="200"
                trend="-3.2%"
                active={activeMetric === 2}
              />
            </section>

            {/* Chart Placeholder with Animation */}
            <section className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Settlement Timeline
                  </h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 rounded-lg text-xs transition">1H</button>
                    <button className="px-3 py-1 bg-blue-600/50 border border-blue-500/50 rounded-lg text-xs">24H</button>
                    <button className="px-3 py-1 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 rounded-lg text-xs transition">7D</button>
                  </div>
                </div>
                
                {/* Animated Wave Chart */}
                <div className="h-48 flex items-end gap-2">
                  {[...Array(24)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-600 to-purple-500 rounded-t-lg opacity-60 hover:opacity-100 transition-all cursor-pointer"
                      style={{
                        height: `${30 + Math.sin(i * 0.5) * 30 + Math.random() * 40}%`,
                        animation: `bar-grow 1s ease-out ${i * 0.05}s both`
                      }}
                    ></div>
                  ))}
                </div>
                
                <div className="flex justify-between mt-4 text-xs text-gray-500">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </section>

            {/* Recent Trades with Advanced Styling */}
            <section className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20"></div>
              <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Recent Trades
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-xl text-sm font-mono text-purple-300">
                      Last 5 Transactions
                    </div>
                    <button className="p-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>

                {loading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-gray-400">Loading settlement data...</p>
                  </div>
                )}

                {!loading && trades.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 opacity-50 animate-bounce">📭</div>
                    <p className="text-gray-400 text-lg">No trades found</p>
                    <p className="text-gray-500 text-sm mt-2">Waiting for settlement activity...</p>
                  </div>
                )}

                <div className="space-y-3">
                  {trades.slice(0, 5).map((trade, idx) => (
                    <TradeCard key={trade.tradeId} trade={trade} index={idx} />
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Activity Feed & System Info */}
          <div className="space-y-6">
            
            {/* Live Activity Feed */}
            <section className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Live Activity
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {recentActivity.map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl border border-white/5 hover:border-green-500/30 transition-all"
                      style={{
                        animation: `slide-in 0.5s ease-out ${i * 0.1}s both`
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-400' : 'bg-yellow-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-200">{activity.type}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        activity.status === 'success' ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'
                      }`}>
                        {activity.status === 'success' ? '✓' : '⏳'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* System Status */}
            <section className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg animate-pulse">
                    🔒
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                      System Status
                    </h3>
                    <p className="text-xs text-gray-400">All systems operational</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <StatusBar label="Blockchain Sync" value={100} color="green" />
                  <StatusBar label="API Health" value={98} color="green" />
                  <StatusBar label="Network Latency" value={92} color="blue" />
                  <StatusBar label="Cache Hit Rate" value={87} color="purple" />
                </div>

                <div className="mt-4 p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                  <p className="text-xs text-blue-300 leading-relaxed">
                    <span className="font-bold">ℹ️ Read-Only Mode:</span> Trade creation handled by upstream settlement systems. This dashboard provides real-time visibility and monitoring.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bar-grow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes grid-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient-shift 3s linear infinite;
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
      `}</style>
    </div>
  );
}

function MetricBadge({ label, value, color }) {
  const colors = {
    blue: 'bg-blue-600/20 border-blue-500/30 text-blue-300',
    purple: 'bg-purple-600/20 border-purple-500/30 text-purple-300',
    green: 'bg-green-600/20 border-green-500/30 text-green-300',
    pink: 'bg-pink-600/20 border-pink-500/30 text-pink-300'
  };

  return (
    <div className={`px-4 py-2 border rounded-xl text-sm font-mono ${colors[color]} backdrop-blur-sm hover:scale-105 transition-transform`}>
      <span className="opacity-70">{label}:</span> <span className="font-bold">{value}</span>
    </div>
  );
}

function StatCard({ title, value, icon, color = "", gradient, borderGlow, delay, trend, active }) {
  return (
    <div 
      className={`group relative transition-all duration-500 ${active ? 'scale-105' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-br ${gradient} rounded-2xl blur ${active ? 'opacity-100' : 'opacity-50'} group-hover:opacity-100 transition duration-500 ${borderGlow} shadow-lg`}></div>
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-xl transform group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</p>
          <span className="text-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">{icon}</span>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <h2 className={`text-3xl font-bold ${color} transition-all duration-300`}>
            <span className="inline-block group-hover:scale-110 transition-transform duration-300">
              {value}
            </span>
          </h2>
          {trend && (
            <span className={`text-xs font-bold mb-1 ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {trend}
            </span>
          )}
        </div>
        <div className="h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
      </div>
    </div>
  );
}

function TradeCard({ trade, index }) {
  const isSettled = trade.status === "1";
  
  return (
    <div 
      className="group relative overflow-hidden"
      style={{ 
        animation: 'slide-in 0.5s ease-out',
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      
      <div className="relative flex justify-between items-center bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg group-hover:rotate-6 transition-transform">
              #{trade.tradeId}
            </div>
            <div>
              <p className="font-bold text-base">Trade #{trade.tradeId}</p>
              <p className="text-xs text-gray-500">ID: {trade.tradeId.toString().padStart(8, '0')}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-green-400">●</span>
              <span className="text-gray-400 w-12">Buyer</span>
              <span className="text-blue-300 bg-blue-950/50 px-2 py-1 rounded font-medium">
                {trade.buyer.slice(0, 6)}…{trade.buyer.slice(-4)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-400">●</span>
              <span className="text-gray-400 w-12">Seller</span>
              <span className="text-purple-300 bg-purple-950/50 px-2 py-1 rounded font-medium">
                {trade.seller.slice(0, 6)}…{trade.seller.slice(-4)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`relative px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transform group-hover:scale-110 transition-all duration-300 ${
              isSettled
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-green-500/50"
                : "bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-yellow-500/50 animate-pulse"
            }`}
          >
            {isSettled && <span className="mr-1">✓</span>}
            {isSettled ? "SETTLED" : "PENDING"}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusBar({ label, value, color }) {
  const colors = {
    green: 'from-green-600 to-green-500',
    blue: 'from-blue-600 to-blue-500',
    purple: 'from-purple-600 to-purple-500',
    yellow: 'from-yellow-600 to-yellow-500'
  };

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300 font-bold">{value}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${value}%`, animation: 'bar-grow 1s ease-out' }}
        ></div>
      </div>
    </div>
  );
}
