const express = require("express");
const cors = require("cors");

const settlementRoutes = require("./routes/settlement");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", settlementRoutes);

module.exports = app;
