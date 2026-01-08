// const { ethers } = require("ethers");
// const abi = require("../abi/SettlementTracker.json");

// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// const contract = new ethers.Contract(
//   process.env.CONTRACT_ADDRESS,
//   abi,
//   provider
// );

// // Fetch single trade
// async function getTrade(tradeId) {
//   const trade = await contract.trades(tradeId);

//   // If trade does not exist (buyer address is zero)
//   if (!trade || trade.buyer === "0x0000000000000000000000000000000000000000") {
//     return null;
//   }

//   return {
//     tradeId: tradeId.toString(),
//     buyer: trade.buyer,
//     seller: trade.seller,
//     status: trade.status.toString(),
//     createdAt: trade.createdAt.toString(),
//     settledAt: trade.settledAt.toString()
//   };
// }


// // Fetch all trades (from events)
// async function getAllTrades() {
//   const events = await contract.queryFilter("TradeRecorded");

//   return events.map(e => ({
//   tradeId: e.args.tradeId.toString(),     // FIX
//   buyer: e.args.buyer,
//   seller: e.args.seller,
//   timestamp: e.args.timestamp.toString() // FIX
// }));

// }

// module.exports = {
//   getTrade,
//   getAllTrades,
//   contract
// };





const { ethers } = require("ethers");
const abi = require("../abi/SettlementTracker.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  provider
);

// Fetch all trades using events
async function getAllTrades() {
  const recordedEvents = await contract.queryFilter("TradeRecorded");
  const settledEvents = await contract.queryFilter("TradeSettled");

  const settledMap = {};
  settledEvents.forEach(e => {
    settledMap[e.args.tradeId.toString()] = e.args.timestamp.toString();
  });

  return recordedEvents.map(e => {
    const tradeId = e.args.tradeId.toString();
    return {
      tradeId,
      buyer: e.args.buyer,
      seller: e.args.seller,
      status: settledMap[tradeId] ? "SETTLED" : "PENDING",
      timestamp: e.args.timestamp.toString(),
      settlementTime: settledMap[tradeId]
        ? Number(settledMap[tradeId]) - Number(e.args.timestamp)
        : null
    };
  });
}

module.exports = {
  getAllTrades
};
