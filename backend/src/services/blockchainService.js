const { ethers } = require("ethers");
const abi = require("../abi/SettlementTracker.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  provider
);

// Fetch single trade
async function getTrade(tradeId) {
  const trade = await contract.trades(tradeId);

  // If trade does not exist (buyer address is zero)
  if (!trade || trade.buyer === "0x0000000000000000000000000000000000000000") {
    return null;
  }

  return {
    tradeId: tradeId.toString(),
    buyer: trade.buyer,
    seller: trade.seller,
    status: trade.status.toString(),
    createdAt: trade.createdAt.toString(),
    settledAt: trade.settledAt.toString()
  };
}


// Fetch all trades (from events)
async function getAllTrades() {
  const events = await contract.queryFilter("TradeRecorded");

  return events.map(e => ({
  tradeId: e.args.tradeId.toString(),     // FIX
  buyer: e.args.buyer,
  seller: e.args.seller,
  timestamp: e.args.timestamp.toString() // FIX
}));

}

module.exports = {
  getTrade,
  getAllTrades,
  contract
};
