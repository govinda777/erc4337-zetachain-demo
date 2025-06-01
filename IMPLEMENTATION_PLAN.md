# Plano de Implementação - ERC-4337 Smart Account Demo

## 1. Problemas Identificados

### Problemas Atuais
- Problemas com o hook `useParticle` no TransactionService
- Dificuldades na atualização do Dashboard
- Necessidade de melhor gerenciamento de estado global
- Falta de tratamento adequado de erros
- Código não modular suficiente

## 2. Solução Proposta

### A. Reestruturação do TransactionService

```typescript
// src/services/ParticleService.ts
export class ParticleService {
  private static instance: ParticleService;
  private particle: any;
  
  private constructor() {}
  
  public static getInstance(): ParticleService {
    if (!ParticleService.instance) {
      ParticleService.instance = new ParticleService();
    }
    return ParticleService.instance;
  }
  
  public async init(config: ParticleConfig): Promise<void> {
    this.particle = new ParticleAA(config);
    await this.particle.init();
  }
}

// src/services/TransactionService.ts
export class TransactionService {
  private static instance: TransactionService;
  private particle: any;
  
  private constructor() {
    this.particle = ParticleService.getInstance().getParticle();
  }
  
  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }
  
  async sendTransaction(to: string, amount: string): Promise<string> {
    const operation = {
      to,
      value: ethers.parseEther(amount),
      data: '0x',
    };
    return this.particle.sendTransaction(operation);
  }
}
```

### B. Contexto Global

```typescript
// src/contexts/AppContext.tsx
interface AppContextType {
  particle: any;
  isInitialized: boolean;
  error: string | null;
  initialize: (config: ParticleConfig) => Promise<void>;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const initialize = async (config: ParticleConfig) => {
    try {
      await ParticleService.getInstance().init(config);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize');
    }
  };
  
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
```

### C. Atualização do Dashboard

```typescript
// src/pages/Dashboard.tsx
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { particle, isInitialized, error } = useApp();
  const { transactions, sendTransaction, batchTransactions } = useTransaction();
  const [batchTransactionsList, setBatchTransactionsList] = useState<BatchTransaction[]>([]);
  const [isBatching, setIsBatching] = useState(false);
  
  const handleSendTransaction = async (to: string, amount: string) => {
    if (!isInitialized) return;
    try {
      await sendTransaction(to, amount);
    } catch (err) {
      console.error('Transaction failed:', err);
    }
  };
  
  const handleBatchTransactions = async () => {
    if (!isInitialized || batchTransactionsList.length === 0) return;
    setIsBatching(true);
    try {
      const txs = batchTransactionsList.map(tx => ({
        to: tx.to,
        amount: tx.amount,
        description: tx.description
      }));
      await batchTransactions(txs);
      setBatchTransactionsList([]);
    } catch (err) {
      console.error('Batch transaction failed:', err);
    } finally {
      setIsBatching(false);
    }
  };
};
```

## 3. Próximos Passos

### A. Testes
- Atualizar testes unitários para usar novo contexto
- Adicionar testes específicos para batch de transações
- Testar fluxo completo de inicialização
- Testar casos de erro e retry mechanism

### B. Documentação
- Atualizar README com novas funcionalidades
- Adicionar guias de configuração detalhados
- Documentar fluxo de inicialização
- Criar guia de desenvolvimento

### C. Otimizações
- Implementar cache para transações
- Adicionar retry mechanism para operações falhas
- Melhorar tratamento de erros
- Implementar logging
- Otimizar performance

## 4. Cronograma

### Semana 1
- Implementar reestruturação do TransactionService
- Criar novo contexto global
- Atualizar componentes principais

### Semana 2
- Implementar testes unitários
- Adicionar testes E2E
- Otimizar performance

### Semana 3
- Finalizar documentação
- Implementar otimizações
- Realizar testes de integração
- Corrigir bugs

### Semana 4
- Revisão final
- Testes de usabilidade
- Deploy
- Documentação final

## 5. Considerações Finais

A nova arquitetura proposta oferece:
- Melhor gerenciamento de estado global
- Código mais modular e testável
- Melhor tratamento de erros
- Suporte nativo para batch de transações
- Melhor integração com Particle Network
- Suporte para múltiplas redes (ZetaChain e outras)

Este plano deve ser seguido de forma iterativa, com revisões frequentes e ajustes conforme necessário.
