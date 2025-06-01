import { createContext, useContext, useState, useEffect } from 'react';
import { ParticleService } from '../services/ParticleService';
import { ParticleConfig } from '../services/ParticleService';

interface AppContextType {
  particle: any;
  isInitialized: boolean;
  error: string | null;
  initialize: (config: ParticleConfig) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = async (config: ParticleConfig) => {
    try {
      await ParticleService.getInstance().init(config);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      console.error('Failed to initialize:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize');
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      ParticleService.getInstance().disconnect();
    };
  }, []);

  return (
    <AppContext.Provider value={{ 
      particle: ParticleService.getInstance().getParticle(),
      isInitialized,
      error,
      initialize
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
