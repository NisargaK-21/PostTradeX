# Backend – Blockchain Settlement APIs

This backend service provides a read-only interface to the Ethereum smart contract.  
It reads settlement data directly from the blockchain and exposes it via REST APIs for other system components.

The backend does not write to the blockchain and does not require a private key.

---

## Tech Stack

- Node.js (v18+)
- Express.js
- ethers.js
- Hardhat

---

## Folder Structure

```text
backend/
├── src/
│   ├── abi/
│   │   └── SettlementTracker.json
│   ├── routes/
│   │   └── settlement.js
│   ├── services/
│   │   └── blockchainService.js
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── .gitignore
```

## Pulling the Backend

     git clone <REPO_URL>
     cd PostTradeX/backend

## Install Dependencies

     npm install

## Environment Variables

     Create a .env file inside the backend/ folder.

       RPC_URL=http://127.0.0.1:8545
       CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
       PORT=5000

## Running the Backend

     node src/server.js

## API Endpoints

## API Endpoints

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/api/trades`    | Fetch all trades  |
| GET    | `/api/trade/:id` | Fetch trade by ID |
