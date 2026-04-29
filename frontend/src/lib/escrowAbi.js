const escrowAbi = [
  {
    "inputs": [
      { "internalType": "address", "name": "_depositor", "type": "address" },
      { "internalType": "address", "name": "_beneficiary", "type": "address" },
      { "internalType": "address", "name": "_arbiter", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  { "inputs": [], "name": "InvalidAmount", "type": "error" },
  { "inputs": [], "name": "InvalidArbiter", "type": "error" },
  { "inputs": [], "name": "InvalidBeneficiary", "type": "error" },
  { "inputs": [], "name": "InvalidDepositor", "type": "error" },
  { "inputs": [], "name": "InvalidStatus", "type": "error" },
  { "inputs": [], "name": "NotArbiter", "type": "error" },
  { "inputs": [], "name": "NotDepositor", "type": "error" },
  { "inputs": [], "name": "SameAddress", "type": "error" },
  { "inputs": [], "name": "TransactionFailed", "type": "error" },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "depositor", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "Deposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "depositor", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "Refunded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "beneficiary", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "Released",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "amount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "arbiter",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "beneficiary",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "depositor",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "refund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "release",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "status",
    "outputs": [{ "internalType": "enum Escrow.Status", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export default escrowAbi;
