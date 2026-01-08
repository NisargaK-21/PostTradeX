// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000", // backend server
// });

// export const getSettlements = () => API.get("/settlements");
// export const getAuditLogs = () => API.get("/audit");





import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const getTrades = () => API.get("/api/trades");
export const getTradeById = (id) => API.get(`/api/trade/${id}`);
