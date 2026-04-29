import { useState } from "react";

export function EscrowActions({ contractData, account, isConnected, isCorrectNetwork, deposit, release, refund, txStatus }) {
  const [depositAmount, setDepositAmount] = useState("");
  const { depositor, arbiter, status } = contractData;

  const normalizedAccount = account?.toLowerCase();
  const isDepositor = normalizedAccount === depositor;
  const isArbiter = normalizedAccount === arbiter;
  const isFunded = status === 1;
  const canAct = isConnected && isCorrectNetwork;

  const handleDeposit = (e) => {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    deposit(depositAmount);
    setDepositAmount("");
  };

  const isActionDisabled = txStatus.status === "pending";

  return (
    <div className="operations-grid">
      {/* Deposit Section */}
      <section className="operation-card">
        <div className="card-header">
          <div>
            <p className="section-kicker">Deposit</p>
            <h2>Fund Escrow</h2>
          </div>
        </div>

        <p className="card-copy">
          The depositor sends ETH into the escrow contract to activate the
          agreement.
        </p>

        {isConnected && !isCorrectNetwork && (
          <p className="role-warning">Switch to Sepolia to use escrow functions.</p>
        )}

        <form onSubmit={handleDeposit}>
          <label htmlFor="depositAmount" className="input-label">
            Amount in ETH
          </label>
          <input
            id="depositAmount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.50"
            className="text-input"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            disabled={!canAct || !isDepositor || status !== 0 || isActionDisabled}
          />

          <button
            type="submit"
            className="primary-button full-width"
            disabled={!canAct || !isDepositor || status !== 0 || !depositAmount || isActionDisabled}
          >
            {txStatus.status === "pending" && !isArbiter ? "Processing..." : "Deposit Funds"}
          </button>
        </form>

        {!isConnected && (
          <p className="role-warning">Connect Wallet to Deposit</p>
        )}

        {canAct && !isDepositor && status === 0 && (
          <p className="role-warning">Only the depositor can fund this escrow.</p>
        )}
      </section>

      {/* Arbiter Decision Section */}
      <section className="operation-card">
        <div className="card-header">
          <div>
            <p className="section-kicker">Resolve</p>
            <h2>Arbiter Decision</h2>
          </div>
        </div>

        <p className="card-copy">
          Once funded, the arbiter can release funds to the beneficiary or
          refund the depositor.
        </p>

        {isConnected && !isCorrectNetwork && (
          <p className="role-warning">Switch to Sepolia to use arbiter functions.</p>
        )}

        <div className="action-stack">
          <button
            type="button"
            className="secondary-button full-width"
            disabled={!canAct || !isArbiter || !isFunded || isActionDisabled}
            onClick={release}
          >
            {txStatus.status === "pending" ? "Processing..." : "Release Funds"}
          </button>

          <button
            type="button"
            className="refund-button full-width"
            disabled={!canAct || !isArbiter || !isFunded || isActionDisabled}
            onClick={refund}
          >
            {txStatus.status === "pending" ? "Processing..." : "Refund Depositor"}
          </button>
        </div>

        {!isConnected && (
          <p className="role-warning">Connect Wallet to Resolve</p>
        )}

        {canAct && !isArbiter && isFunded && (
          <p className="role-warning">Only the arbiter can make decisions.</p>
        )}

        {canAct && status !== 0 && status !== 1 && (
          <p className="role-warning">This escrow has already been {contractData.statusText.toLowerCase()}.</p>
        )}
      </section>
    </div>
  );
}
