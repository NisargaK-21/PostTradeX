Blockchain Module – Settlement Tracker
Overview

This module implements the blockchain layer of the project.
Its purpose is to act as an immutable and tamper-proof source of truth for post-trade settlement status.

The smart contract records:

Trade creation

Settlement updates

Timestamps (on-chain)

Other layers (backend, frontend, AI/ML) read from this contract.
No business logic or analytics is performed on-chain.

Role of Blockchain in This Project

Stores settlement state immutably

Emits events for real-time tracking

Enables auditability and transparency

Removes reliance on a single centralized database

Blockchain is used only where trust and immutability are required.

Tech Stack

Solidity ^0.8.19

Hardhat v2.22.2

ethers.js v5

Node.js (recommended: v18 or v20)

Folder Structure
blockchain/
├── contracts/
│   └── SettlementTracker.sol
├── scripts/
│   └── deploy.js
├── hardhat.config.js
├── package.json
├── package-lock.json
└── README.md

Smart Contract
Contract: SettlementTracker.sol

The contract:

Maintains a mapping of tradeId → Trade

Tracks settlement status (PENDING, SETTLED)

Emits events on state changes

Key Events

TradeRecorded

SettlementUpdated

These events are consumed by the backend.

Installation & Setup

Run the following commands inside the blockchain/ folder:

npm init -y
npm install --save-dev hardhat@2.22.2
npx hardhat
npm install --save-dev @nomiclabs/hardhat-ethers ethers@5


When initializing Hardhat:

Choose JavaScript project

Say NO to installing hardhat-toolbox

Compile the Contract
npx hardhat compile


This generates:

ABI

Bytecode

Artifacts required by backend

Deploy the Contract (Local)
npx hardhat run scripts/deploy.js


Example output:

SettlementTracker deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3


Save:

Contract address

ABI (artifacts/contracts/SettlementTracker.sol/SettlementTracker.json)

Integration Notes for Other Teams
Backend Team

Use contract ABI + address

Listen to TradeRecorded and SettlementUpdated events

Read settlement state using public mappings

Frontend Team

Do not interact directly with blockchain

Consume backend APIs only

AI / ML Team

Analyze timestamps and settlement durations

No on-chain computation required

Design Decisions

Minimal smart contract by design

No access control (demo + research use)

No financial assets handled

Read-only usage by other layers

This keeps the blockchain layer:

Safe

Explainable

Hackathon-appropriate