# 🌙 Luna AI - Frontend

Luna AI é uma aplicação web moderna de chat com IA, oferecendo múltiplas personalidades e um sistema de subscrição premium.

## 🚀 Funcionalidades

- 💬 Chat com IA usando Google Gemini
- 🎭 Múltiplas personalidades (Sweet & Caring, Flirty, Submissive, Seductive)
- 💳 Sistema de pagamento com Stripe (Luna Plus)
- 🔐 Autenticação com Firebase
- 📱 Interface responsiva e moderna
- 🔄 Histórico de conversas
- ⚙️ Gestão de conta e configurações

## 📋 Pré-requisitos

- Node.js 16+ e npm
- Conta Firebase configurada
- Backend Luna rodando (ver [Luna_Backend](../Luna_Backend/README.md))

## 🛠️ Instalação Rápida

Para setup rápido, ver `SETUP.md`.

### Passos Detalhados

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
Cria um ficheiro `.env` na raiz do projeto (usa `env.template` como template):
```bash
REACT_APP_API_URL=http://127.0.0.1:5001
```

Para produção:
```bash
REACT_APP_API_URL=https://api.tudominio.com
```

3. **Configurar Firebase:**
- Copia as configurações do Firebase para `src/firebase.js`
- Vai ao Firebase Console → Project Settings → General
- Copia as configurações do "Your apps" → Web app

4. **Iniciar o servidor de desenvolvimento:**
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 📦 Build para Produção

```bash
npm run build
```

Isto cria uma pasta `build/` com os ficheiros otimizados para produção.

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── ErrorBoundary.jsx
├── pages/              # Páginas da aplicação
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── SelectPersona.jsx
│   ├── Chat.jsx
│   ├── LunaPlus.jsx
│   ├── Settings.jsx
│   └── ResetPassword.jsx
├── utils/              # Utilitários
│   └── logger.js
├── App.js              # Componente principal
├── config.js           # Configurações
├── firebase.js         # Configuração Firebase
└── index.js            # Entry point
```

## 🔧 Configuração

### Variáveis de Ambiente

- `REACT_APP_API_URL`: URL do backend API (obrigatório)

### Firebase

Configura o Firebase Authentication no ficheiro `src/firebase.js`. Ver `FIREBASE_SETUP.md` para mais detalhes.

## 🚢 Deployment

### Vercel (Recomendado)

1. Instala a Vercel CLI:
```bash
npm i -g vercel
```

2. Faz deploy:
```bash
vercel
```

3. Configura variáveis de ambiente na dashboard da Vercel

### Netlify

1. Conecta o repositório ao Netlify
2. Configura o build command: `npm run build`
3. Configura o publish directory: `build`
4. Adiciona variáveis de ambiente no painel

### Outros

Qualquer serviço que suporte React apps estática pode ser usado. Certifica-te de:
- Configurar `REACT_APP_API_URL` para o domínio de produção
- Configurar CORS no backend para permitir o teu domínio

## 🐛 Troubleshooting

### Erro de CORS
- Verifica se `REACT_APP_API_URL` está correto
- Verifica se o backend permite o teu domínio no CORS

### Erro de Firebase
- Verifica se `firebase.js` está configurado corretamente
- Verifica se as regras de segurança do Firebase estão corretas

### Build falha
- Limpa a cache: `rm -rf node_modules package-lock.json && npm install`
- Verifica se todas as dependências estão instaladas

## 📝 Scripts Disponíveis

- `npm start` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm test` - Executa testes

## 🔒 Segurança

- Nunca commites ficheiros `.env` ou configurações do Firebase
- Usa HTTPS em produção
- Configura CORS corretamente no backend
- Mantém dependências atualizadas

## 📄 Licença

Este projeto é privado e proprietário.

## 🤝 Suporte

Para questões ou problemas, consulta a documentação no diretório do projeto ou contacta a equipa de desenvolvimento.
