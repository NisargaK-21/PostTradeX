"use client";

import { useState, useEffect } from "react";

export default function WalletConnect() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  return (
    <div className="flex items-center gap-4">
      {account ? (
        <div className="flex items-center gap-2">
          <div className="bg-green-500 w-2 h-2 rounded-full"></div>
          <span className="text-sm text-gray-300">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
          <button
            onClick={disconnectWallet}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
}
