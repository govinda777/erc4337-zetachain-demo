export interface Transaction {
  hash: string;
  to: string;
  amount: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

export interface Account {
  address: string;
  balance: string;
  loginProvider: string;
}

export interface ParticleConfig {
  projectId: string;
  clientKey: string;
  appId: string;
  network: {
    chainId: number;
    rpcUrl: string;
  };
}

export interface UserOperation {
  sender: string;
  nonce: number;
  initCode: string;
  callData: string;
  callGasLimit: number;
  verificationGasLimit: number;
  preVerificationGas: number;
  maxFeePerGas: number;
  maxPriorityFeePerGas: number;
  paymasterAndData: string;
  signature: string;
}
