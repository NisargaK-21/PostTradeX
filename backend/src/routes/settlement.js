// const express = require("express");
// const router = express.Router();
// const {
//   getTrade,
//   getAllTrades
// } = require("../services/blockchainService");

// const { getAllTrades } = require("../services/blockchainService");

// // GET /trades
// router.get("/trades", async (req, res) => {
//   try {
//     const trades = await getAllTrades();
//     res.json(trades);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /trade/:id
// router.get("/trade/:id", async (req, res) => {
//   try {
//     const trade = await getTrade(req.params.id);
// if (!trade) {
//   return res.status(404).json({ message: "Trade not found" });
// }

// res.json(trade);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Export settlements for AI analytics
// router.get("/analytics/export", async (req, res) => {
//   try {
//     const trades = await getAllTrades();
//     res.json(trades);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// module.exports = router;





const express = require("express");
const router = express.Router();
const { getAllTrades } = require("../services/blockchainService");

router.get("/settlements", async (req, res) => {
  try {
    const trades = await getAllTrades();
    res.json(trades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
