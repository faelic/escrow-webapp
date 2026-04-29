export function EscrowDetails({ contractData, account }) {
  const { depositor, beneficiary, arbiter, amount, statusText } = contractData;

  const getUserRole = () => {
    if (!account) return "Not Connected";
    const normalized = account.toLowerCase();
    if (normalized === depositor) return "Depositor";
    if (normalized === beneficiary) return "Beneficiary";
    if (normalized === arbiter) return "Arbiter";
    return "Viewer";
  };

  const truncateAddress = (addr) => {
    if (!addr) return "—";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="summary-card summary-card--full">
      <div className="card-header">
        <div>
          <p className="section-kicker">Overview</p>
          <h2>Current Escrow</h2>
        </div>
        <span className={`status-pill status-${statusText.toLowerCase()}`}>
          {statusText}
        </span>
      </div>

      <div className="summary-list">
        <div className="summary-row">
          <span>Status</span>
          <strong>{statusText}</strong>
        </div>

        <div className="summary-row">
          <span>Amount Locked</span>
          <strong>{parseFloat(amount).toFixed(4)} ETH</strong>
        </div>

        <div className="summary-row">
          <span>Depositor</span>
          <strong title={depositor}>{truncateAddress(depositor)}</strong>
        </div>

        <div className="summary-row">
          <span>Beneficiary</span>
          <strong title={beneficiary}>{truncateAddress(beneficiary)}</strong>
        </div>

        <div className="summary-row">
          <span>Arbiter</span>
          <strong title={arbiter}>{truncateAddress(arbiter)}</strong>
        </div>

        <div className="summary-row">
          <span>Connected Wallet</span>
          <strong>{account ? truncateAddress(account) : "Not connected"}</strong>
        </div>

        <div className="summary-row">
          <span>Your Role</span>
          <strong>{getUserRole()}</strong>
        </div>
      </div>
    </div>
  );
}
