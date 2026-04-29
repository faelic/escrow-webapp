import { useState, useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import escrowAbi from "../lib/escrowAbi";
import { ESCROW_ADDRESS, SEPOLIA_RPC } from "../lib/config";

export function useEscrowContract(signer) {
  const [contractData, setContractData] = useState({
    depositor: "",
    beneficiary: "",
    arbiter: "",
    amount: "0",
    status: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [txStatus, setTxStatus] = useState({
    status: "idle", // idle | pending | confirmed | failed
    hash: "",
    message: "",
  });

  // Read-only provider for contract reads (doesn't require MetaMask)
  const readProvider = useMemo(() => new ethers.JsonRpcProvider(SEPOLIA_RPC), []);

  // Create contract instance (read-only or with signer)
  const getContract = useCallback(
    (providerOrSigner) => {
      return new ethers.Contract(ESCROW_ADDRESS, escrowAbi, providerOrSigner);
    },
    []
  );

  // Shared loader: fetch live contract data using read-only provider
  const fetchContractData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const contract = getContract(readProvider);

      const [depositor, beneficiary, arbiter, amount, status] =
        await Promise.all([
          contract.depositor(),
          contract.beneficiary(),
          contract.arbiter(),
          contract.amount(),
          contract.status(),
        ]);

      setContractData({
        depositor: depositor.toLowerCase(),
        beneficiary: beneficiary.toLowerCase(),
        arbiter: arbiter.toLowerCase(),
        amount: ethers.formatEther(amount),
        status: Number(status),
      });
    } catch (err) {
      console.error("Failed to fetch contract data:", err);
      setError("Failed to load escrow data. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, [getContract, readProvider]);

  // Deposit ETH into escrow (requires signer)
  const deposit = useCallback(
    async (amountInEth) => {
      if (!signer) {
        setError("Wallet not connected");
        return;
      }

      try {
        setTxStatus({
          status: "pending",
          hash: "",
          message: "Confirm transaction in your wallet...",
        });

        const contract = getContract(signer);
        const tx = await contract.deposit({
          value: ethers.parseEther(amountInEth),
        });

        setTxStatus({
          status: "pending",
          hash: tx.hash,
          message: "Transaction pending...",
        });

        await tx.wait();

        setTxStatus({
          status: "confirmed",
          hash: tx.hash,
          message: "Deposit successful!",
        });

        await fetchContractData();
      } catch (err) {
        console.error("Deposit failed:", err);
        setTxStatus({
          status: "failed",
          hash: "",
          message: err.reason || err.message || "Transaction failed",
        });
      }
    },
    [signer, getContract, fetchContractData]
  );

  // Release funds to beneficiary (requires signer, arbiter only)
  const release = useCallback(async () => {
    if (!signer) {
      setError("Wallet not connected");
      return;
    }

    try {
      setTxStatus({
        status: "pending",
        hash: "",
        message: "Confirm transaction in your wallet...",
      });

      const contract = getContract(signer);
      const tx = await contract.release();

      setTxStatus({
        status: "pending",
        hash: tx.hash,
        message: "Transaction pending...",
      });

      await tx.wait();

      setTxStatus({
        status: "confirmed",
        hash: tx.hash,
        message: "Funds released successfully!",
      });

      await fetchContractData();
    } catch (err) {
      console.error("Release failed:", err);
      setTxStatus({
        status: "failed",
        hash: "",
        message: err.reason || err.message || "Transaction failed",
      });
    }
  }, [signer, getContract, fetchContractData]);

  // Refund funds to depositor (requires signer, arbiter only)
  const refund = useCallback(async () => {
    if (!signer) {
      setError("Wallet not connected");
      return;
    }

    try {
      setTxStatus({
        status: "pending",
        hash: "",
        message: "Confirm transaction in your wallet...",
      });

      const contract = getContract(signer);
      const tx = await contract.refund();

      setTxStatus({
        status: "pending",
        hash: tx.hash,
        message: "Transaction pending...",
      });

      await tx.wait();

      setTxStatus({
        status: "confirmed",
        hash: tx.hash,
        message: "Funds refunded successfully!",
      });

      await fetchContractData();
    } catch (err) {
      console.error("Refund failed:", err);
      setTxStatus({
        status: "failed",
        hash: "",
        message: err.reason || err.message || "Transaction failed",
      });
    }
  }, [signer, getContract, fetchContractData]);

  // Fetch data on mount (uses read-only provider, no MetaMask needed)
  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const contract = getContract(readProvider);

        const [depositor, beneficiary, arbiter, amount, status] =
          await Promise.all([
            contract.depositor(),
            contract.beneficiary(),
            contract.arbiter(),
            contract.amount(),
            contract.status(),
          ]);

        if (!cancelled) {
          setContractData({
            depositor: depositor.toLowerCase(),
            beneficiary: beneficiary.toLowerCase(),
            arbiter: arbiter.toLowerCase(),
            amount: ethers.formatEther(amount),
            status: Number(status),
          });
        }
      } catch (err) {
        console.error("Failed to fetch contract data:", err);
        if (!cancelled) {
          setError("Failed to load escrow data. Check your connection.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    return () => { cancelled = true; };
  }, [getContract, readProvider]);

  // Map status enum to human-readable text
  const getStatusText = (statusCode) => {
    const statusMap = ["Created", "Funded", "Released", "Refunded"];
    return statusMap[statusCode] || "Unknown";
  };

  return {
    contractData: { ...contractData, statusText: getStatusText(contractData.status) },
    isLoading,
    error,
    txStatus,
    deposit,
    release,
    refund,
    refresh: fetchContractData,
  };
}
