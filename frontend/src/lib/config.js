// Env-backed config (Vite exposes VITE_ variables via import.meta.env)
export const ESCROW_ADDRESS = import.meta.env.VITE_ESCROW_ADDRESS;
export const SEPOLIA_RPC = import.meta.env.VITE_SEPOLIA_RPC;

// Sepolia network configuration
export const SEPOLIA_CHAIN_ID = "0xaa36a7"; // Hex chain ID for Sepolia (11155111 in decimal)
export const SEPOLIA_CHAIN_ID_DECIMAL = 11155111;

// Etherscan base URL for Sepolia transaction links
export const ETHERSCAN_SEPOLIA_URL = "https://sepolia.etherscan.io";
