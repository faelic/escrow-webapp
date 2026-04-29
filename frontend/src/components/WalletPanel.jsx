export function WalletPanel({ account, chainId, isConnected, isCorrectNetwork, connectWallet, disconnectWallet, switchToSepolia }) {
  const getNetworkName = (chainId) => {
    switch (chainId) {
      case "0xaa36a7": return "Sepolia";
      case "0x1": return "Ethereum Mainnet";
      default: return "Unknown Network";
    }
  };

  return (
    <>
      <button
        type="button"
        className="wallet-button"
        onClick={isConnected ? disconnectWallet : connectWallet}
      >
        {isConnected
          ? `${account.slice(0, 6)}...${account.slice(-4)}`
          : "Connect Wallet"}
      </button>

      {isConnected && !isCorrectNetwork && (
        <section className="network-warning">
          <p className="network-warning__label">Wrong Network</p>
          <p className="network-warning__text">
            You are currently connected to <strong>{getNetworkName(chainId)}</strong>. Please
            switch your wallet to <strong>Sepolia</strong> to use this app.
          </p>
          <button className="primary-button" onClick={switchToSepolia} style={{marginTop: "12px"}}>
            Switch to Sepolia
          </button>
        </section>
      )}
    </>
  );
}
