import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParticle } from './ParticleContext';
import { ethers } from 'ethers';

interface AccountContextType {
  account: string | null;
  balance: string;
  login: (provider: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { particle } = useParticle();
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (provider: string) => {
    try {
      if (!particle) throw new Error('Particle not initialized');

      setIsLoading(true);
      setError(null);

      // Login with social provider
      const loginResult = await particle.login(provider);
      
      // Get account address
      const accountAddress = await particle.getAccountAddress();
      setAccount(accountAddress);

      // Get initial balance
      const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_ZETA_RPC_URL!);
      const balance = await provider.getBalance(accountAddress);
      setBalance(ethers.formatEther(balance));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (!particle) return;
      await particle.logout();
      setAccount(null);
      setBalance('0');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AccountContext.Provider value={{ account, balance, login, logout, isLoading, error }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
