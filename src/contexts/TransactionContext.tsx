import { createContext, useContext, useState, useEffect } from 'react';
import { TransactionService } from '../services/transactionService';
import { Transaction } from '../services/transactionService';

interface TransactionContextType {
  transactions: Transaction[];
  sendTransaction: (to: string, amount: string) => Promise<string>;
  batchTransactions: (transactions: Transaction[]) => Promise<string[]>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const sendTransaction = async (to: string, amount: string): Promise<string> => {
    try {
      const txHash = await TransactionService.getInstance().sendTransaction(to, amount);
      setTransactions(prev => [...prev, { to, value: amount }]);
      return txHash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  const batchTransactions = async (txs: Transaction[]): Promise<string[]> => {
    try {
      const txHashes = await TransactionService.getInstance().batchTransactions(txs);
      setTransactions(prev => [...prev, ...txs]);
      return txHashes;
    } catch (error) {
      console.error('Batch transaction failed:', error);
      throw error;
    }
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      sendTransaction,
      batchTransactions
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};
