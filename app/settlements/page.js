// "use client";
// import { useEffect, useState } from "react";
// import { getSettlements } from "../../lib/api";
// import { getContract } from "../../lib/blockchain";
// import axios from "axios";

// export default function Settlements() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState("ALL");

//   const fetchSettlements = async () => {
//     try {
//       const res = await getSettlements();
//       setData(res.data);
//     } catch (err) {
//       console.error("Failed to fetch settlements", err);
//     }
//   };

//   useEffect(() => {
//     fetchSettlements();
//   }, []);

//   const settleTrade = async (tradeId) => {
//     try {
//       setLoading(true);
//       const contract = await getContract();

//       const tx = await contract.settleTrade(tradeId);
//       await tx.wait();

//       alert("Trade settled successfully!");
//       fetchSettlements();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to settle trade");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredData = data.filter((trade) => {
//     if (filter === "ALL") return true;
//     return trade.status === filter;
//   });

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "SETTLED":
//         return "bg-green-600";
//       case "PENDING":
//         return "bg-yellow-600";
//       case "FAILED":
//         return "bg-red-600";
//       default:
//         return "bg-gray-600";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-semibold">Settlement Details</h1>
//           <p className="text-gray-400 mt-2">
//             Comprehensive view of all trade settlements
//           </p>
//         </div>
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="bg-gray-700 border border-gray-600 rounded px-3 py-2"
//         >
//           <option value="ALL">All Status</option>
//           <option value="PENDING">Pending</option>
//           <option value="SETTLED">Settled</option>
//           <option value="FAILED">Failed</option>
//         </select>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredData.map((trade) => (
//           <div key={trade.tradeId} className="bg-[#121826] border border-gray-800 rounded-xl p-6">
//             <div className="flex justify-between items-start mb-4">
//               <h3 className="text-lg font-semibold">Trade #{trade.tradeId}</h3>
//               <span className={`px-2 py-1 rounded text-xs ${getStatusColor(trade.status)}`}>
//                 {trade.status}
//               </span>
//             </div>

//             <div className="space-y-2 text-sm">
//               <div>
//                 <p className="text-gray-400">Buyer</p>
//                 <p className="font-mono text-xs">
//                   {trade.buyer?.slice(0, 10)}...{trade.buyer?.slice(-8)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-gray-400">Seller</p>
//                 <p className="font-mono text-xs">
//                   {trade.seller?.slice(0, 10)}...{trade.seller?.slice(-8)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-gray-400">Amount</p>
//                 <p>{trade.amount || "N/A"}</p>
//               </div>
//               <div>
//                 <p className="text-gray-400">Timestamp</p>
//                 <p>{trade.timestamp ? new Date(trade.timestamp * 1000).toLocaleString() : "N/A"}</p>
//               </div>
//             </div>

//             {trade.status === "PENDING" && (
//               <button
//                 onClick={() => settleTrade(trade.tradeId)}
//                 disabled={loading}
//                 className="w-full mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
//               >
//                 {loading ? "Processing..." : "Settle Trade"}
//               </button>
//             )}
//           </div>
//         ))}
//       </div>

//       {filteredData.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-gray-400">No settlements found matching the filter.</p>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { getTrades } from "../../lib/api";

export default function Settlements() {
  const [trades, setTrades] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("recent");

  const fetchTrades = async () => {
    try {
      const res = await getTrades();
      setTrades(res.data);
    } catch (err) {
      console.error("Failed to load settlements", err);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const filtered = trades
    .filter(t => filter === "ALL" ? true : t.status === filter)
    .filter(t => 
      searchTerm === "" || 
      t.tradeId.toString().includes(searchTerm) ||
      t.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.seller.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = {
    total: trades.length,
    settled: trades.filter(t => t.status === "SETTLED" || t.status === "1").length,
    pending: trades.filter(t => t.status === "PENDING" || t.status === "0").length,
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10 -z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139, 92, 246, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'grid-move 25s linear infinite'
        }}></div>
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="space-y-6 relative z-10">
        
        {/* Header Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 blur-3xl animate-pulse"></div>
          <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xl shadow-lg">
                    📋
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Settlement Registry
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                      Complete trade settlement records and analytics
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-3">
                <StatPill label="Total" value={stats.total} color="purple" />
                <StatPill label="Settled" value={stats.settled} color="green" />
                <StatPill label="Pending" value={stats.pending} color="yellow" />
              </div>
            </div>
          </div>
        </section>

        {/* Control Panel */}
        <section className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20"></div>
          <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search Bar */}
              <div className="flex-1 w-full md:max-w-md relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center">
                  <svg className="absolute left-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by Trade ID, Buyer, or Seller..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-700/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-slate-700/70 transition-all placeholder-gray-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 text-gray-400 hover:text-white transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Filter & View Controls */}
              <div className="flex gap-3 flex-wrap">
                {/* Status Filter */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                  <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="relative bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 cursor-pointer hover:bg-slate-700/70 transition-all appearance-none pr-10"
                  >
                    <option value="ALL">🔍 All Status</option>
                    <option value="PENDING">⏳ Pending</option>
                    <option value="SETTLED">✅ Settled</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Sort */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="relative bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 cursor-pointer hover:bg-slate-700/70 transition-all appearance-none pr-10"
                  >
                    <option value="recent">📅 Most Recent</option>
                    <option value="oldest">🕐 Oldest First</option>
                    <option value="id">🔢 By ID</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* View Toggle */}
                <div className="flex bg-slate-700/50 border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-2 rounded-lg transition-all ${
                      viewMode === "grid" 
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg" 
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2 rounded-lg transition-all ${
                      viewMode === "list" 
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg" 
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={fetchTrades}
                  className="relative group px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-sm font-medium hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg hover:shadow-purple-500/50 hover:scale-105"
                >
                  <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Results Count */}
            {searchTerm && (
              <div className="mt-4 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-sm text-blue-300">
                Found <span className="font-bold">{filtered.length}</span> result{filtered.length !== 1 ? 's' : ''} for "{searchTerm}"
              </div>
            )}
          </div>
        </section>

        {/* Trade Cards */}
        {filtered.length === 0 ? (
          <section className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-gray-700 rounded-3xl blur opacity-20"></div>
            <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-3xl p-16 shadow-2xl text-center">
              <div className="text-8xl mb-6 opacity-30 animate-bounce">🔍</div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">No Settlements Found</h3>
              <p className="text-gray-500">Try adjusting your filters or search criteria</p>
            </div>
          </section>
        ) : (
          <section className={`grid gap-4 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {filtered.map((trade, idx) => (
              viewMode === "grid" ? (
                <TradeCardGrid key={trade.tradeId} trade={trade} index={idx} />
              ) : (
                <TradeCardList key={trade.tradeId} trade={trade} index={idx} />
              )
            ))}
          </section>
        )}
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(60px); }
        }
      `}</style>
    </div>
  );
}

function StatPill({ label, value, color }) {
  const colors = {
    purple: 'from-purple-600/30 to-purple-800/30 border-purple-500/30 text-purple-300',
    green: 'from-green-600/30 to-green-800/30 border-green-500/30 text-green-300',
    yellow: 'from-yellow-600/30 to-yellow-800/30 border-yellow-500/30 text-yellow-300',
  };

  return (
    <div className={`backdrop-blur-sm bg-gradient-to-br ${colors[color]} border rounded-xl px-4 py-2 text-center min-w-[80px] hover:scale-105 transition-transform`}>
      <p className="text-xs opacity-70 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold mt-0.5">{value}</p>
    </div>
  );
}

function TradeCardGrid({ trade, index }) {
  const isSettled = trade.status === "SETTLED" || trade.status === "1";
  
  return (
    <div 
      className="group relative"
      style={{ 
        animation: 'fade-in-up 0.5s ease-out',
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500"></div>
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-sm font-bold shadow-lg group-hover:rotate-6 transition-transform">
              #{trade.tradeId}
            </div>
            <div>
              <h3 className="font-bold text-lg">Trade #{trade.tradeId}</h3>
              <p className="text-xs text-gray-500">ID: {trade.tradeId.toString().padStart(8, '0')}</p>
            </div>
          </div>
          <StatusBadge isSettled={isSettled} />
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"></div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-lg bg-green-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs">🟢</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 mb-1">Buyer Address</p>
              <p className="text-sm font-mono text-blue-300 bg-blue-950/30 px-2 py-1 rounded truncate">
                {trade.buyer}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs">🟠</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 mb-1">Seller Address</p>
              <p className="text-sm font-mono text-purple-300 bg-purple-950/30 px-2 py-1 rounded truncate">
                {trade.seller}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></span>
            Blockchain Verified
          </div>
          <button className="text-xs text-purple-400 hover:text-purple-300 transition flex items-center gap-1">
            View Details
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function TradeCardList({ trade, index }) {
  const isSettled = trade.status === "SETTLED" || trade.status === "1";
  
  return (
    <div 
      className="group relative"
      style={{ 
        animation: 'slide-in 0.5s ease-out',
        animationDelay: `${index * 30}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:border-purple-500/30">
        <div className="flex items-center gap-6 flex-wrap">
          
          {/* Trade ID */}
          <div className="flex items-center gap-3 min-w-[140px]">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-sm font-bold shadow-lg group-hover:rotate-6 transition-transform">
              #{trade.tradeId}
            </div>
            <div>
              <p className="text-xs text-gray-500">Trade ID</p>
              <p className="font-bold text-lg">{trade.tradeId}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-12 w-px bg-white/10 hidden md:block"></div>

          {/* Addresses */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
            <div>
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <span>🟢</span> Buyer
              </p>
              <p className="text-sm font-mono text-blue-300 bg-blue-950/30 px-3 py-1.5 rounded-lg truncate">
                {trade.buyer}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <span>🟠</span> Seller
              </p>
              <p className="text-sm font-mono text-purple-300 bg-purple-950/30 px-3 py-1.5 rounded-lg truncate">
                {trade.seller}
              </p>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center gap-3 ml-auto">
            <StatusBadge isSettled={isSettled} />
            <button className="p-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition group">
              <svg className="w-5 h-5 text-purple-300 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

function StatusBadge({ isSettled }) {
  return (
    <div
      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all ${
        isSettled
          ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-green-500/50"
          : "bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-yellow-500/50 animate-pulse"
      }`}
    >
      {isSettled && <span className="mr-1">✓</span>}
      {isSettled ? "SETTLED" : "PENDING"}
    </div>
  );
}