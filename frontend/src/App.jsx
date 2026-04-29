import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "./hooks/useWallet";
import { useEscrowContract } from "./hooks/useEscrowContract";
import { EscrowDetails } from "./components/EscrowDetails";
import { EscrowActions } from "./components/EscrowActions";
import { TxStatus } from "./components/TxStatus";
import { WalletPanel } from "./components/WalletPanel";

function App() {
  const { account, chainId, isConnected, error: walletError, connectWallet, disconnectWallet, switchToSepolia } = useWallet();
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const getSigner = async () => {
      if (!window.ethereum || !account) {
        if (!cancelled) setSigner(null);
        return;
      }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const s = await provider.getSigner();
        if (!cancelled) setSigner(s);
      } catch (err) {
        console.error("Failed to get signer:", err);
        if (!cancelled) setSigner(null);
      }
    };
    getSigner();
    return () => { cancelled = true; };
  }, [account]);

  const escrow = useEscrowContract(signer);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <div className="brand">
            <span className="brand-mark" />
            <span className="brand-name">Escrow</span>
          </div>

          <WalletPanel
            account={account}
            chainId={chainId}
            isConnected={isConnected}
            isCorrectNetwork={chainId === "0xaa36a7"}
            connectWallet={connectWallet}
            disconnectWallet={disconnectWallet}
            switchToSepolia={switchToSepolia}
          />
        </div>
      </header>

      <main className="app-main">
        <section className="hero-panel">
          <div className="hero-panel__content">
            <p className="section-kicker">On-chain escrow</p>
            <h1>Protected Payments Flow</h1>
            <p className="hero-copy">
              Deposit ETH into the contract, the funds are locked during the deal
              and only the arbiter can release or refund when it is time to settle.
            </p>
          </div>
        </section>

        {walletError && (
          <section className="error-banner">
            <p>{walletError}</p>
          </section>
        )}

        {escrow.error && (
          <section className="error-banner">
            <p>{escrow.error}</p>
          </section>
        )}

        {escrow.isLoading ? (
          <section className="operation-card">
            <p className="card-copy">Loading escrow data...</p>
          </section>
        ) : (
          <>
            <EscrowDetails contractData={escrow.contractData} account={account} />

            <EscrowActions
              contractData={escrow.contractData}
              account={account}
              isConnected={isConnected}
              isCorrectNetwork={chainId === "0xaa36a7"}
              deposit={escrow.deposit}
              release={escrow.release}
              refund={escrow.refund}
              txStatus={escrow.txStatus}
            />
          </>
        )}

        <TxStatus txStatus={escrow.txStatus} />
      </main>
    </div>
  );
}

export default App;
