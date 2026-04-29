import { useEffect, useState } from "react";
import { SEPOLIA_RPC } from "../lib/config";

export function useWallet() {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");
  const [error, setError] = useState("");

  const isConnected = Boolean(account);

  useEffect(() => {
    if (!window.ethereum) {
      setTimeout(() => {
        setError("MetaMask is not installed. Please install it to use this app.");
      }, 0);
      return;
    }

    async function syncWalletState() {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        setAccount(accounts[0] || "");
        setChainId(currentChainId || "");
        setError("");
      } catch (err) {
        console.error("Failed to sync wallet state:", err);
      }
    }

    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        setAccount("");
        setChainId("");
      } else {
        setAccount(accounts[0]);
      }
    }

    function handleChainChanged(newChainId) {
      setChainId(newChainId);
    }

    syncWalletState();

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  async function connectWallet() {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install it to use this app.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      setAccount(accounts[0] || "");
      setChainId(currentChainId || "");
      setError("");
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setError("Failed to connect wallet. Please try again.");
    }
  }

  async function switchToSepolia() {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      });
    } catch (err) {
      // If the chain hasn't been added yet, add it
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia Test Network",
                nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
                rpcUrls: [SEPOLIA_RPC],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
        } catch (addErr) {
          console.error("Failed to add Sepolia network:", addErr);
          setError("Failed to switch to Sepolia. Please add it manually.");
        }
      } else {
        console.error("Failed to switch network:", err);
        setError("Failed to switch network. Please try manually.");
      }
    }
  }

  function disconnectWallet() {
    setAccount("");
    setChainId("");
    setError("");
  }

  return {
    account,
    chainId,
    isConnected,
    error,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
  };
}
