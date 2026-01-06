"use client";

import { useEffect, useState } from "react";
import { getContract } from "../lib/blockchain";
import axios from "axios";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    total: 0,
    settled: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(false);

  // Fetch settlement data from backend
  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://localhost:5000/settlements");
      const data = res.data;

      const settledCount = data.filter(
        (t) => t.status === "SETTLED"
      ).length;

      setSummary({
        total: data.length,
        settled: settledCount,
        pending: data.length - settledCount,
      });
    } catch (err) {
      console.error("Failed to fetch settlements", err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // Record trade on blockchain
  const recordTrade = async () => {
    try {
      setLoading(true);
      const contract = await getContract();

      const tx = await contract.recordTrade(
        Date.now(), // unique tradeId
        "0x000000000000000000000000000000000000dEaD",
        "0x000000000000000000000000000000000000bEEF"
      );

      await tx.wait();
      alert("Trade recorded on blockchain!");
      fetchSummary();
    } catch (err) {
      console.error(err);
      alert("Failed to record trade");
    } finally {
      setLoading(false);
    }
  };

  // Settle trade on blockchain
  const settleTrade = async () => {
    try {
      setLoading(true);
      const contract = await getContract();

      const tx = await contract.settleTrade(1); // example tradeId
      await tx.wait();

      alert("Trade settled!");
      fetchSummary();
    } catch (err) {
      console.error(err);
      alert("Failed to settle trade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-semibold">
          Settlement Overview
        </h1>
        <p className="text-gray-400 mt-2">
          Live post-trade settlement monitoring
        </p>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Total Trades</p>
          <h2 className="text-3xl font-bold mt-2">
            {summary.total}
          </h2>
        </div>

        <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Settled</p>
          <h2 className="text-3xl font-bold mt-2 text-green-400">
            {summary.settled}
          </h2>
        </div>

        <div className="bg-[#121826] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Pending</p>
          <h2 className="text-3xl font-bold mt-2 text-yellow-400">
            {summary.pending}
          </h2>
        </div>
      </section>

      {/* Blockchain Actions */}
      <section className="bg-[#121826] border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Blockchain Actions
        </h2>

        <div className="flex gap-4">
          <button
            onClick={recordTrade}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Record Trade
          </button>

          <button
            onClick={settleTrade}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Settle Trade
          </button>
        </div>

        {loading && (
          <p className="text-gray-400 mt-4">
            Waiting for blockchain confirmation...
          </p>
        )}
      </section>
    </div>
  );
}
