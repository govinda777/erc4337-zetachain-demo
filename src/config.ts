import { configService } from './services/configService';

// Initialize config service with environment variables
const config = {
  zetaRpcUrl: (window as any)?.process?.env?.REACT_APP_ZETA_RPC_URL || '',
  projectId: (window as any)?.process?.env?.REACT_APP_PARTICLE_PROJECT_ID || '',
  chainId: parseInt((window as any)?.process?.env?.REACT_APP_CHAIN_ID || '1'),
  network: (window as any)?.process?.env?.REACT_APP_NETWORK || 'mainnet'
};

configService.initialize(config);

export default config;
