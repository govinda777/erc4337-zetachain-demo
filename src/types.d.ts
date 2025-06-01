/// <reference types="react" />
/// <reference types="react-router-dom" />

// CSS Modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Particle Network SDK
declare module '@particle-network/web3aa' {
  export class Particle {
    constructor(config: {
      projectId: string;
      chainId: number;
      network: string;
    });

    sendTransaction(params: { to: string; value: string }): Promise<{ hash: string }>;
    batchTransactions(transactions: Array<{ to: string; value: string }>): Promise<{ hash: string }>;
    getTransactionStatus(txHash: string): Promise<any>;
  }
}

// Ethers
declare module 'ethers' {
  export namespace utils {
    function parseEther(value: string): string;
    function formatEther(value: string): string;
  }
  export namespace providers {
    export class JsonRpcProvider {
      constructor(url: string);
      getBalance(address: string): Promise<string>;
    }
  }
}

// Environment Variables
declare global {
  interface Window {
    process: {
      env: {
        REACT_APP_ZETA_RPC_URL: string;
        REACT_APP_PARTICLE_PROJECT_ID: string;
        REACT_APP_CHAIN_ID: string;
        REACT_APP_NETWORK: string;
      }
    }
  }
}
