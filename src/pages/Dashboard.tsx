import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useTransaction } from '../contexts/TransactionContext';
import { Transaction } from '../services/transactionService';
import styles from './Dashboard.module.css';

interface BatchTransaction extends Transaction {
  description?: string;
}

interface DashboardProps {
  // Add any props if needed
}

const Dashboard: React.FC<DashboardProps> = () => {
  const navigate = useNavigate();
  const { particle, isInitialized, error: appError } = useApp();
  const { transactions, sendTransaction, batchTransactions } = useTransaction();
  const [batchTransactionsList, setBatchTransactionsList] = useState<BatchTransaction[]>([]);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendTransaction = async () => {
    if (!isInitialized) {
      setError('Smart account not initialized');
      return;
    }

    try {
      setLoading(true);
      await sendTransaction(toAddress, amount);
      setToAddress('');
      setAmount('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchTransactions = async () => {
    if (!isInitialized || batchTransactionsList.length === 0) {
      return;
    }

    try {
      setLoading(true);
      await batchTransactions(batchTransactionsList);
      setBatchTransactionsList([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Batch transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToBatch = () => {
    if (!toAddress || !amount) return;
    setBatchTransactionsList((prev: BatchTransaction[]) => [...prev, {
      to: toAddress,
      value: amount,
      description: `Batch transaction ${prev.length + 1}`
    }]);
    setToAddress('');
    setAmount('');
  };

  return (
    <div className={styles.dashboard}>
      <h1>ERC-4337 Smart Account Dashboard</h1>
      
      {!isInitialized ? (
        <div className={styles.initializationStatus}>
          <p>Smart account initializing...</p>
          {appError && <div className={styles.errorMessage}>{appError}</div>}
        </div>
      ) : (
        <div className={styles.dashboardContent}>
          <div className={styles.transactionForm}>
            <div className={styles.formGroup}>
              <label htmlFor="to-address">To Address</label>
              <input
                id="to-address"
                type="text"
                value={toAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToAddress(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="amount">Amount (ETH)</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              />
            </div>
            <div className={styles.actionButtons}>
              <button 
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  handleAddToBatch();
                }} 
                disabled={loading}
                className={styles.secondaryButton}
              >
                Add to Batch
              </button>
              <button 
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  handleSendTransaction();
                }} 
                disabled={loading}
                className={styles.primaryButton}
              >
                {loading ? 'Sending...' : 'Send Transaction'}
              </button>
            </div>
          </div>

          <div className={styles.batchForm}>
            <h2>Batch Transactions</h2>
            <div className={styles.batchList}>
              {batchTransactionsList.map((tx: BatchTransaction, index: number) => (
                <div key={index} className={styles.batchItem}>
                  <p><strong>To:</strong> {tx.to}</p>
                  <p><strong>Amount:</strong> {tx.value} ETH</p>
                  <p><strong>Description:</strong> {tx.description}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                handleBatchTransactions();
              }} 
              disabled={loading}
              className={styles.primaryButton}
            >
              {loading ? 'Processing...' : 'Send Batch'}
            </button>
          </div>

          <div className={styles.transactionsList}>
            <h2>Transaction History</h2>
            {transactions.map((tx: Transaction, index: number) => (
              <div key={index} className={styles.transactionItem}>
                <p><strong>To:</strong> {tx.to}</p>
                <p><strong>Amount:</strong> {tx.value} ETH</p>
                <p><strong>Tx Hash:</strong> {tx.txHash}</p>
              </div>
            ))}
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
