// Estado global da aplicação
const AppState = {
  user: null,
  smartAccount: null,
  isAuthenticated: false,
  transactions: [],
  currentSection: 'landing'
};

// Dados mock da aplicação
const MOCK_DATA = {
  zetachain: {
    chainId: 7001,
    name: "ZetaChain Testnet",
    currency: "ZETA",
    explorer: "https://athens.explorer.zetachain.com"
  },
  addresses: [
    "0x742b35Cc6a3c5D4e7c4b5C0f5e5F3e5d4D3e2D1a",
    "0x853c46Ed7b4d6D5e8d5b6E0f6F4F3e6d5E4e3E2b",
    "0x964d57Fe8c5d7E6f9e6c7F0f7F5F4f7e6F5f4F3c"
  ],
  userProfiles: {
    google: { name: "João Silva", email: "joao@gmail.com", avatar: "👨‍💼" },
    twitter: { name: "Maria Santos", email: "maria@twitter.com", avatar: "👩‍💻" },
    github: { name: "Pedro Costa", email: "pedro@github.com", avatar: "👨‍💻" },
    email: { name: "Ana Lima", email: "ana@example.com", avatar: "👩‍🎓" }
  }
};

// Utilitários
const utils = {
  randomChoice: (array) => array[Math.floor(Math.random() * array.length)],
  
  generateTxHash: () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  },
  
  formatAddress: (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },
  
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  formatBalance: (balance) => {
    return `${balance.toFixed(4)} ZETA`;
  }
};

// Gerenciamento de seções
const SectionManager = {
  show: (sectionId) => {
    // Ocultar todas as seções
    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('hidden');
    });
    
    // Mostrar seção específica
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.remove('hidden');
      AppState.currentSection = sectionId;
    }
  },
  
  showLanding: () => SectionManager.show('landing'),
  showAuth: () => SectionManager.show('auth'),
  showDashboard: () => SectionManager.show('dashboard')
};

// Simulação de autenticação
const AuthManager = {
  isLoggingIn: false,
  
  async login(provider) {
    if (this.isLoggingIn) return;
    this.isLoggingIn = true;
    
    try {
      const authStatus = document.getElementById('authStatus');
      const authMessage = document.getElementById('authMessage');
      
      // Mostrar status de carregamento
      authStatus.classList.remove('hidden');
      authMessage.textContent = `Conectando com ${provider}...`;
      
      await utils.delay(1500);
      
      // Simular criação de smart account
      authMessage.textContent = 'Criando Smart Account...';
      await utils.delay(2000);
      
      // Gerar dados do usuário
      const userProfile = MOCK_DATA.userProfiles[provider];
      const smartAccountAddress = utils.randomChoice(MOCK_DATA.addresses);
      const initialBalance = Math.random() * 10 + 1; // 1-11 ZETA
      
      AppState.user = {
        ...userProfile,
        provider: provider
      };
      
      AppState.smartAccount = {
        address: smartAccountAddress,
        balance: initialBalance
      };
      
      AppState.isAuthenticated = true;
      
      authMessage.textContent = 'Smart Account criada com sucesso!';
      await utils.delay(1000);
      
      // Ocultar status de auth antes de trocar seção
      authStatus.classList.add('hidden');
      
      // Atualizar UI e ir para dashboard
      this.updateUserInfo();
      SectionManager.showDashboard();
      
    } catch (error) {
      console.error('Erro no login:', error);
      const authMessage = document.getElementById('authMessage');
      authMessage.textContent = 'Erro na autenticação. Tente novamente.';
    } finally {
      this.isLoggingIn = false;
    }
  },
  
  logout() {
    AppState.user = null;
    AppState.smartAccount = null;
    AppState.isAuthenticated = false;
    AppState.transactions = [];
    
    // Limpar histórico de transações
    this.updateTransactionHistory();
    
    // Resetar status de auth
    const authStatus = document.getElementById('authStatus');
    authStatus.classList.add('hidden');
    
    SectionManager.showLanding();
  },
  
  updateUserInfo() {
    if (!AppState.user || !AppState.smartAccount) return;
    
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userProvider = document.getElementById('userProvider');
    const accountAddress = document.getElementById('accountAddress');
    const accountBalance = document.getElementById('accountBalance');
    
    if (userAvatar) userAvatar.textContent = AppState.user.avatar;
    if (userName) userName.textContent = AppState.user.name;
    if (userEmail) userEmail.textContent = AppState.user.email;
    if (userProvider) userProvider.textContent = `Conectado via ${AppState.user.provider}`;
    if (accountAddress) accountAddress.textContent = utils.formatAddress(AppState.smartAccount.address);
    if (accountBalance) accountBalance.textContent = utils.formatBalance(AppState.smartAccount.balance);
  },
  
  updateTransactionHistory() {
    const historyElement = document.getElementById('transactionHistory');
    if (!historyElement) return;
    
    if (AppState.transactions.length === 0) {
      historyElement.innerHTML = '<div class="empty-state">Nenhuma transação ainda. Execute uma operação para ver o histórico.</div>';
      return;
    }
    
    historyElement.innerHTML = AppState.transactions.map(tx => `
      <div class="transaction-item">
        <div class="transaction-details">
          <div class="transaction-type">${tx.type}</div>
          <div class="transaction-meta">
            ${tx.amount} • ${tx.gasSponsored ? 'Gasless' : 'Com Gas'} • ${tx.timestamp}
          </div>
        </div>
        <div class="status status--success">✓</div>
      </div>
    `).join('');
  }
};

// Simulação de transações
const TransactionManager = {
  isProcessing: false,
  
  async executeTransaction(type) {
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    try {
      const transactionStatus = document.getElementById('transactionStatus');
      const transactionResult = document.getElementById('transactionResult');
      
      if (!transactionStatus || !transactionResult) {
        console.error('Elementos de transação não encontrados');
        return;
      }
      
      // Preparar UI
      transactionStatus.classList.remove('hidden');
      transactionResult.classList.add('hidden');
      this.resetSteps();
      
      // Simular processo de transação
      await this.simulateUserOperation();
      await this.simulateBundler();
      await this.simulateEntryPoint();
      await this.simulateConfirmation();
      
      // Gerar resultado
      const txHash = utils.generateTxHash();
      const transaction = this.createTransaction(type, txHash);
      
      AppState.transactions.unshift(transaction);
      AppState.smartAccount.balance -= 0.001; // Deduzir valor enviado
      
      // Mostrar resultado
      const txHashElement = document.getElementById('txHash');
      const explorerLink = document.getElementById('explorerLink');
      
      if (txHashElement) txHashElement.textContent = utils.formatAddress(txHash);
      if (explorerLink) explorerLink.href = `${MOCK_DATA.zetachain.explorer}/tx/${txHash}`;
      
      transactionResult.classList.remove('hidden');
      
      // Atualizar UI
      AuthManager.updateUserInfo();
      AuthManager.updateTransactionHistory();
      
    } catch (error) {
      console.error('Erro na execução da transação:', error);
    } finally {
      this.isProcessing = false;
    }
  },
  
  async simulateUserOperation() {
    await this.setStepStatus('step1', 'active');
    await utils.delay(1000);
    await this.setStepStatus('step1', 'completed');
  },
  
  async simulateBundler() {
    await this.setStepStatus('step2', 'active');
    await utils.delay(1500);
    await this.setStepStatus('step2', 'completed');
  },
  
  async simulateEntryPoint() {
    await this.setStepStatus('step3', 'active');
    await utils.delay(2000);
    await this.setStepStatus('step3', 'completed');
  },
  
  async simulateConfirmation() {
    await this.setStepStatus('step4', 'active');
    await utils.delay(1000);
    await this.setStepStatus('step4', 'completed');
  },
  
  async setStepStatus(stepId, status) {
    const step = document.getElementById(stepId);
    if (!step) return;
    
    const statusIcon = step.querySelector('.step-status');
    if (!statusIcon) return;
    
    step.classList.remove('active', 'completed');
    
    if (status === 'active') {
      step.classList.add('active');
      statusIcon.textContent = '⏳';
    } else if (status === 'completed') {
      step.classList.add('completed');
      statusIcon.textContent = '✅';
    }
  },
  
  resetSteps() {
    ['step1', 'step2', 'step3', 'step4'].forEach(stepId => {
      const step = document.getElementById(stepId);
      if (!step) return;
      
      const statusIcon = step.querySelector('.step-status');
      if (statusIcon) {
        step.classList.remove('active', 'completed');
        statusIcon.textContent = '⏳';
      }
    });
  },
  
  createTransaction(type, hash) {
    const typeMap = {
      send: { type: 'Envio ZETA', amount: '0.001 ZETA', gasSponsored: false },
      batch: { type: 'Operação em Lote', amount: '0.002 ZETA', gasSponsored: false },
      gasless: { type: 'Transação Gasless', amount: '0.001 ZETA', gasSponsored: true }
    };
    
    const txData = typeMap[type] || typeMap.send;
    
    return {
      hash,
      ...txData,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      status: 'confirmed'
    };
  }
};

// Gerenciamento de tema
const ThemeManager = {
  init() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Verificar se localStorage está disponível
    let currentTheme = 'light';
    try {
      currentTheme = localStorage.getItem('theme') || 'light';
    } catch (e) {
      console.warn('localStorage não disponível, usando tema padrão');
    }
    
    this.setTheme(currentTheme);
    
    themeToggle.addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-color-scheme') === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
    });
  },
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
    
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('Não foi possível salvar tema no localStorage');
    }
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
};

// Event Listeners
function setupEventListeners() {
  // Botão iniciar demo
  const startDemo = document.getElementById('startDemo');
  if (startDemo) {
    startDemo.addEventListener('click', () => {
      SectionManager.showAuth();
    });
  }
  
  // Botões de autenticação
  document.querySelectorAll('.auth-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const provider = e.currentTarget.getAttribute('data-provider');
      if (provider) {
        AuthManager.login(provider);
      }
    });
  });
  
  // Botão de logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      AuthManager.logout();
    });
  }
  
  // Botões de transação
  document.querySelectorAll('.transaction-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.currentTarget.getAttribute('data-type');
      if (type) {
        TransactionManager.executeTransaction(type);
      }
    });
  });
}

// Inicialização da aplicação
function initApp() {
  try {
    // Configurar tema
    ThemeManager.init();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Mostrar seção inicial
    SectionManager.showLanding();
    
    console.log('🚀 ERC-4337 ZetaChain Demo iniciado!');
    console.log('📱 Aplicação pronta para demonstrar Account Abstraction na ZetaChain');
    
  } catch (error) {
    console.error('Erro na inicialização da aplicação:', error);
  }
}

// Inicializar quando DOM estiver carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Exportar para debug (opcional)
window.AppDebug = {
  state: AppState,
  auth: AuthManager,
  transactions: TransactionManager,
  sections: SectionManager,
  theme: ThemeManager,
  utils: utils
};