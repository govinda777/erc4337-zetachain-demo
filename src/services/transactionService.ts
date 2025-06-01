import { utils, providers } from 'ethers';
import { particleService } from './ParticleService';
import { configService } from './configService';

interface Transaction {
  to: string;
  value: string;
  txHash?: string;
}

export class TransactionService {
  private static instance: TransactionService;
  private transactions: Transaction[] = [];

  private constructor() {}

  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  public async initialize(): Promise<void> {
    await particleService.initialize();
  }

  public async sendTransaction(to: string, amount: string): Promise<string> {
    try {
      const particle = particleService.getParticle();
      const tx = await particle.sendTransaction({
        to,
        value: utils.parseEther(amount)
      });

      this.transactions.push({
        to,
        value: amount,
        txHash: tx.hash
      });

      return tx.hash;
    } catch (error) {
      throw new Error(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async batchTransactions(transactions: Transaction[]): Promise<void> {
    try {
      const particle = particleService.getParticle();
      const batchTx = await particle.batchTransactions(transactions.map(tx => ({
        to: tx.to,
        value: utils.parseEther(tx.value)
      })));

      transactions.forEach(tx => {
        this.transactions.push({
          ...tx,
          txHash: batchTx.hash
        });
      });
    } catch (error) {
      throw new Error(`Batch transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  public async getTransactionStatus(txHash: string): Promise<any> {
    try {
      const particle = particleService.getParticle();
      return await particle.getTransactionStatus(txHash);
    } catch (error) {
      throw new Error(`Failed to get transaction status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getBalance(address: string): Promise<string> {
    try {
      const provider = new providers.JsonRpcProvider(configService.getZetaRpcUrl());
      const balance = await provider.getBalance(address);
      return utils.formatEther(balance);
    } catch (error) {
      throw new Error(`Failed to get balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const transactionService = TransactionService.getInstance();
