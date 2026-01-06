🧠 Backend – Blockchain Settlement APIs

This backend service acts as a read-only bridge between the Ethereum smart contract and the rest of the system.
It reads settlement data directly from the blockchain and exposes it through REST APIs for the frontend and analytics layers.

🔒 The backend does not write to the blockchain and does not require a private key.

🧱 Tech Stack

Node.js (v18+)

Express.js

ethers.js

Hardhat (local blockchain for development)

📁 Folder Structure
backend/
├── src/
│ ├── abi/
│ │ └── SettlementTracker.json
│ ├── routes/
│ │ └── settlement.js
│ ├── services/
│ │ └── blockchainService.js
│ ├── app.js
│ └── server.js
├── .env.example
├── package.json
└── .gitignore

🔽 Pulling the Backend
git clone <REPO_URL>
cd PostTradeX/backend

📦 Install Dependencies
npm install

🔐 Environment Variables

Create a .env file inside the backend/ folder.

RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
PORT=5000

Variable Description
Variable Purpose
RPC_URL Ethereum RPC endpoint (local Hardhat or testnet)
CONTRACT_ADDRESS Deployed smart contract address
PORT Backend server port

📌 The .env file is not committed.
Refer to .env.example for required variables.

⛓️ Blockchain Requirement (Local Setup)

Before starting the backend, ensure the blockchain is running.

cd blockchain
npx hardhat node

Deploy the contract:

npx hardhat run scripts/deploy.js --network localhost

Copy the deployed contract address into backend/.env.

▶️ Running the Backend
cd backend
node src/server.js

Expected output:

Backend running on http://localhost:5000

🌐 API Endpoints
Method Endpoint Description
GET /api/trades Fetch all recorded trades
GET /api/trade/:id Fetch a trade by ID
Example
http://localhost:5000/api/trades

Response:

[]

(Empty response indicates no trades recorded yet.)

🧠 Design Notes

Read-only blockchain access via ethers.js

BigInt values normalized to JSON-safe strings

Defensive handling for missing trades

Clear separation of routes and blockchain logic

✅ Status

✔ Backend complete
✔ APIs stable
✔ Ready for frontend and analytics integration
