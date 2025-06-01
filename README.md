
https://www.perplexity.ai/search/me-mostre-como-implementar-o-p-mpyZMjVKTV2MaZAEtbfq.g

# ERC-4337 Smart Account Demo on ZetaChain

Este projeto demonstra uma implementação prática do protocolo ERC-4337 (Account Abstraction) na ZetaChain, utilizando a integração com o Particle Network. O objetivo é mostrar, de forma simples e intuitiva, como criar e utilizar smart accounts, realizar transações gasless, e interagir com UserOperations na ZetaChain Testnet.

---

## ✨ Funcionalidades

- **Login Social:** Criação de smart account via Google, Twitter, GitHub ou Email.
- **Smart Account (ERC-4337):** Conta inteligente compatível com o padrão ERC-4337.
- **Transações Gasless:** Envie ZETA sem pagar taxas, usando paymaster.
- **Batching:** Execute múltiplas operações em uma única UserOperation.
- **Dashboard:** Visualize saldo, endereço e histórico da smart account.
- **Status em Tempo Real:** Acompanhe o envio e confirmação de operações.

---

## 🚀 Como Executar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/erc4337-zetachain-demo.git
cd erc4337-zetachain-demo
```

### 2. Instale as dependências

```bash
yarn install
# ou
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as chaves do Particle Network (obtenha em https://dashboard.particle.network):

```
REACT_APP_PROJECT_ID=SEU_PROJECT_ID
REACT_APP_CLIENT_KEY=SEU_CLIENT_KEY
REACT_APP_APP_ID=SEU_APP_ID
```

### 4. Inicie o projeto

```bash
yarn start
# ou
npm start
```

O app estará disponível em `http://localhost:3000`.

---

## ⚙️ Configuração da ZetaChain Testnet

- **Chain ID:** 7001
- **Moeda:** ZETA
- **RPC URLs:**  
  - https://zetachain-athens-evm.blockpi.network/v1/rpc/public  
  - https://rpc.ankr.com/zetachain_evm_athens
- **Explorer:** https://athens3.explorer.zetachain.com
- **Faucet:** https://labs.zetachain.com/get-zeta

---

## 🛠️ Principais Tecnologias

- [React](https://react.dev/)
- [Ethers.js](https://docs.ethers.org/)
- [Particle Network AA SDK](https://docs.particle.network/)
- [ZetaChain Testnet](https://zetachain.com/)
- [ERC-4337 Reference Implementation](https://eips.ethereum.org/EIPS/eip-4337)

---

## 📚 Como Funciona

1. **Onboarding:** O usuário faz login social, criando uma smart account (SimpleAccount) na ZetaChain.
2. **UserOperation:** Ao enviar uma transação, o app monta uma UserOperation conforme o padrão ERC-4337.
3. **Bundler:** A operação é enviada para o bundler, que a agrupa e envia ao contrato EntryPoint.
4. **EntryPoint:** O contrato executa a UserOperation, transferindo ZETA ou executando operações em lote.
5. **Paymaster:** Opcionalmente, um paymaster pode patrocinar o gas, tornando a transação gasless para o usuário.

---

## 💡 Casos de Uso Demonstrados

- Onboarding sem seed phrase
- Transações sem necessidade de possuir ZETA
- Operações em lote (batching)
- Recuperação e segurança aprimoradas

---

## 🧪 Testando

- Use o faucet para obter ZETA de teste.
- Realize login social e crie sua smart account.
- Envie ZETA para outro endereço ou faça operações em lote.
- Experimente transações gasless patrocinadas.

---

## 📝 Referências

- [ERC-4337: Account Abstraction](https://eips.ethereum.org/EIPS/eip-4337)
- [ZetaChain Docs](https://docs.zetachain.com/)
- [Particle Network Docs](https://docs.particle.network/)

---

## 📄 Licença

MIT

---

## 🤝 Contribuições

Pull requests são bem-vindos! Sinta-se à vontade para abrir issues e sugerir melhorias.

---

**Desenvolvido para fins educacionais e demonstração do potencial de Account Abstraction na ZetaChain.**

