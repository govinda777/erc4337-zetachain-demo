import React, { createContext, useContext, useState, useEffect } from 'react';
import { ParticleAA } from '@particle-network/aa-sdk';

interface ParticleContextType {
  particle: ParticleAA | null;
  initializeParticle: () => Promise<void>;
}

const ParticleContext = createContext<ParticleContextType | undefined>(undefined);

export const ParticleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [particle, setParticle] = useState<ParticleAA | null>(null);

  const initializeParticle = async () => {
    try {
      const particleInstance = new ParticleAA({
        projectId: process.env.REACT_APP_PROJECT_ID!,
        clientKey: process.env.REACT_APP_CLIENT_KEY!,
        appId: process.env.REACT_APP_APP_ID!,
        network: {
          chainId: parseInt(process.env.REACT_APP_ZETA_CHAIN_ID!),
          rpcUrl: process.env.REACT_APP_ZETA_RPC_URL!,
        },
      });
      
      await particleInstance.init();
      setParticle(particleInstance);
    } catch (error) {
      console.error('Failed to initialize Particle:', error);
    }
  };

  useEffect(() => {
    initializeParticle();
  }, []);

  return (
    <ParticleContext.Provider value={{ particle, initializeParticle }}>
      {children}
    </ParticleContext.Provider>
  );
};

export const useParticle = () => {
  const context = useContext(ParticleContext);
  if (context === undefined) {
    throw new Error('useParticle must be used within a ParticleProvider');
  }
  return context;
};
