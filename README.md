# Escrow Webapp

Ship money only when the deal is truly done.  
This project is a lean Ethereum escrow app built to prove the core flow end to end.  
One wallet funds the contract, one arbiter resolves the outcome, and the UI stays honest about who can act.  
It was deliberately developed to meet an MVP goal first: secure the payment flow before expanding the product surface.  
If you want the smallest useful escrow product that actually moves ETH on-chain, this is it.

## MVP Goal

This application was developed to meet a **minimum viable product (MVP)** goal:
- prove a working on-chain escrow flow
- enforce role-based permissions at the smart contract level
- allow a depositor to fund escrow
- allow an arbiter to release or refund funds
- expose the full flow through a usable React frontend

## MVP Scope

The MVP includes:
- A single deployed `Escrow` smart contract
- Three explicit roles:
  - `Depositor`
  - `Beneficiary`
  - `Arbiter`
- A strict escrow lifecycle:
  - `Created`
  - `Funded`
  - `Released`
  - `Refunded`
- MetaMask wallet connection
- Sepolia network validation and switching support
- Read-only contract state display in the frontend
- Role-aware action controls in the frontend
- On-chain transaction submission and feedback

## Tech Stack

| Category | Technology |
|---|---|
| Smart contract | Solidity `^0.8.28` |
| Ethereum dev framework | Hardhat |
| Frontend | React 19 + Vite |
| Web3 library | `ethers.js` v6 |
| Wallet integration | MetaMask via `window.ethereum` |
| Network | Sepolia |
| Styling | Custom CSS |


## Features Implemented

### Smart Contract Features
- Role-based escrow design with `depositor`, `beneficiary`, and `arbiter`
- Constructor validation for invalid or duplicated addresses
- Depositor-only funding
- Arbiter-only release
- Arbiter-only refund
- Status-based transition enforcement
- Event emission for:
  - `Deposited`
  - `Released`
  - `Refunded`
- Custom errors for clearer and cheaper reverts

## Current User Flow

1. Connect MetaMask
2. Ensure the wallet is on Sepolia
3. View the live escrow state
4. If connected as depositor, fund the escrow
5. If connected as arbiter, release or refund once funded
6. Track the transaction outcome in the UI and on Etherscan

## Project Structure

```text
escrow-webapp/
├── contracts/
│   └── Escrow.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── Escrow.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Local Setup

### Root project

```bash
npm install
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a root `.env` file for deployment:

```env
PRIVATE_KEY=your_private_key
ALCHEMY_URL=your_sepolia_rpc_url
BENEFICIARY_ADDRESS=0x...
ARBITER_ADDRESS=0x...
```

## Deploy

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

After deployment, update the frontend contract address/config if needed.

## Security Notes

- Contract permissions are enforced on-chain, not only in the UI
- Only the depositor can fund
- Only the arbiter can resolve
- Escrow actions are protected by state checks
- ETH transfers use `.call` with success validation
- Private keys should never be committed

## What this is not yet

This MVP does **not** yet target:
- multiple escrow instances
- escrow creation from the frontend
- advanced event indexing/history
- production-grade wallet UX
- backend services
- factory contracts

Those belong to the next version, not the MVP.

## Why this project matters

This MVP proves the hardest part first:
**the contract logic, the wallet flow, and the payment resolution path all work together.**

That makes it a strong base for:
- v2 product expansion
- factory/multi-escrow architecture
- better UX polish
- production deployment work
