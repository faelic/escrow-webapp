# Escrow Webapp

A lean Ethereum escrow application built to demonstrate a complete on-chain payment resolution flow.

The application allows a depositor to fund escrow, an arbiter to resolve the outcome, and a beneficiary to receive funds only after approval. The frontend reflects live contract state, wallet permissions, and transaction status in real time.

Rather than overbuilding features early, the project focuses on validating the core escrow lifecycle end-to-end through a secure and minimal architecture.

---

## Engineering Focus

This project focuses on:

* smart contract permission modeling
* state-driven frontend rendering
* wallet-aware UI behavior
* transaction lifecycle handling
* secure ETH transfer patterns
* role-based action control
* frontend and contract synchronization

---

## Core Features

### Smart Contract Features

* Role-based escrow architecture using:

  * `Depositor`
  * `Beneficiary`
  * `Arbiter`
* Strict escrow lifecycle enforcement:

  * `Created`
  * `Funded`
  * `Released`
  * `Refunded`
* Depositor-only funding logic
* Arbiter-only release and refund permissions
* Constructor validation against invalid or duplicated addresses
* Event emission for escrow activity tracking:

  * `Deposited`
  * `Released`
  * `Refunded`
* Custom Solidity errors for cheaper and clearer transaction reverts
* Secure ETH transfer handling using `.call` with explicit success checks

### Frontend Features

* MetaMask wallet connection
* Automatic Sepolia network validation and switching support
* Live contract state synchronization
* Role-aware action rendering
* On-chain transaction submission and feedback handling
* Responsive UI built around a minimal dashboard workflow

---

## Escrow Lifecycle

```text
Created → Funded → Released
                    ↘
                     Refunded
```

The escrow state is enforced directly on-chain to prevent invalid transitions or unauthorized actions.

---

## Current User Flow

1. Connect MetaMask
2. Switch to Sepolia if required
3. View the live escrow state
4. If connected as the depositor, fund the escrow
5. If connected as the arbiter:

   * release funds to beneficiary
   * or refund the depositor
6. Track transaction status in the UI and on Etherscan

---

## Tech Stack

| Category           | Technology                     |
| ------------------ | ------------------------------ |
| Smart Contract     | Solidity `^0.8.28`             |
| Ethereum Framework | Hardhat                        |
| Frontend           | React 19 + Vite                |
| Web3 Library       | `ethers.js` v6                 |
| Wallet Integration | MetaMask via `window.ethereum` |
| Network            | Ethereum Sepolia               |
| Styling            | Custom CSS                     |

---

## Architecture Notes

The frontend was structured around:

* reusable UI components
* isolated wallet interaction logic
* centralized contract configuration
* role-aware rendering flows
* state-driven transaction feedback

The smart contract and frontend were intentionally kept minimal to prioritize:

* clarity
* maintainability
* secure state management
* predictable transaction behavior

The project focuses on synchronizing frontend state with live on-chain contract state while maintaining a simple and understandable user flow.

---

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

---

## Local Setup

### Install Dependencies

```bash
npm install
```

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a root `.env` file:

```env
PRIVATE_KEY=your_private_key
ALCHEMY_URL=your_sepolia_rpc_url
BENEFICIARY_ADDRESS=0x...
ARBITER_ADDRESS=0x...
```

---

## Deploy Contract

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

After deployment, update the frontend contract configuration with the deployed contract address.

---

## Security Considerations

* Contract permissions are enforced on-chain, not only at the frontend layer
* Funding actions are restricted to the depositor
* Resolution actions are restricted to the arbiter
* Escrow lifecycle transitions are protected by strict state validation
* ETH transfers use `.call` with explicit success checks
* Environment variables and private keys should never be committed

---

## Future Expansion Areas

Planned improvements include:

* multi-escrow support
* escrow factory contracts
* escrow creation directly from the frontend
* event indexing and historical analytics
* transaction activity timelines
* improved wallet UX
* notification systems
* production-grade deployment workflows

---

## Why This Project Matters

This project validates the most critical part of an escrow product first:

* secure contract logic
* permission enforcement
* wallet interaction flow
* payment resolution lifecycle

By proving the complete escrow flow through a minimal architecture, the project establishes a strong foundation for future product expansion and production-grade development.
