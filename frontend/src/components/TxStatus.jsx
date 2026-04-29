import { ETHERSCAN_SEPOLIA_URL } from "../lib/config";

export function TxStatus({ txStatus }) {
  const { status, hash, message } = txStatus;

  if (status === "idle") {
    return (
      <section className="operation-card activity-card">
        <div className="card-header">
          <div>
            <p className="section-kicker">Activity</p>
            <h2>Transaction Status</h2>
          </div>
        </div>
        <p className="card-copy">
          No transaction submitted yet. All wallet prompts, confirmations and
          contract activity will appear here.
        </p>
      </section>
    );
  }

  const getStatusClass = () => {
    switch (status) {
      case "pending": return "status-pending";
      case "confirmed": return "status-confirmed";
      case "failed": return "status-failed";
      default: return "";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "pending": return "⏳";
      case "confirmed": return "✅";
      case "failed": return "❌";
      default: return "";
    }
  };

  return (
    <section className={`operation-card activity-card ${getStatusClass()}`}>
      <div className="card-header">
        <div>
          <p className="section-kicker">Activity</p>
          <h2>Transaction Status</h2>
        </div>
        <span className="status-icon">{getStatusIcon()}</span>
      </div>

      <p className="card-copy">{message}</p>

      {hash && (
        <a
          href={`${ETHERSCAN_SEPOLIA_URL}/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="tx-link"
        >
          View on Etherscan ↗
        </a>
      )}
    </section>
  );
}
