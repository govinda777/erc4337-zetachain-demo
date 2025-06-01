import { useState, useCallback } from 'react';
import { Transaction } from '../types';
import { transactionService } from '../services/transactionService';

export const useTransaction = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTransaction = useCallback((tx: Transaction) => {
    setTransactions(prev => [...prev, tx]);
  }, []);

  const updateTransactionStatus = useCallback(async (hash: string) => {
    try {
      const status = await transactionService.getTransactionStatus(hash);
      setTransactions(prev =>
        prev.map(tx =>
          tx.hash === hash ? { ...tx, status } : tx
        )
      );
    } catch (err) {
      console.error('Failed to update transaction status:', err);
    }
  }, []);

  const sendTransaction = useCallback(async (to: string, amount: string) => {
    try {
      setIsSending(true);
      setError(null);

      const hash = await transactionService.sendTransaction(to, amount);
      
      addTransaction({
        hash,
        to,
        amount,
        status: 'pending',
        timestamp: Date.now(),
      });

      // Poll for transaction status
      const interval = setInterval(async () => {
        await updateTransactionStatus(hash);
      }, 5000);

      return hash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [addTransaction, updateTransactionStatus]);

  const batchTransactions = useCallback(async (txs: Transaction[]) => {
    try {
      setIsSending(true);
      setError(null);

      const hashes = await transactionService.batchTransactions(txs);
      
      txs.forEach((tx, index) => {
        addTransaction({
          ...tx,
          hash: hashes[index],
          status: 'pending',
          timestamp: Date.now(),
        });
      });

      // Poll for all transaction statuses
      const interval = setInterval(async () => {
        await Promise.all(
          hashes.map(hash => updateTransactionStatus(hash))
        );
      }, 5000);

      return hashes;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Batch transaction failed');
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [addTransaction, updateTransactionStatus]);

  return {
    transactions,
    isSending,
    error,
    sendTransaction,
    batchTransactions,
    updateTransactionStatus,
  };
};
