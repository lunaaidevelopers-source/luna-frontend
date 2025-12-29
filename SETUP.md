# 🚀 Setup Rápido - Luna Frontend

## 1. Instalação

```bash
npm install
```

## 2. Configurar Variáveis de Ambiente

Cria `.env` na raiz:
```bash
REACT_APP_API_URL=http://127.0.0.1:5001
```

## 3. Configurar Firebase

Edita `src/firebase.js` com as tuas credenciais do Firebase:
- Vai ao Firebase Console → Project Settings → General
- Copia as configurações do "Your apps" → Web app

## 4. Iniciar

```bash
npm start
```

Abre `http://localhost:3000`

---

## 🔑 Reset de Password

Se o link do email não funcionar:

1. Clica no link do email (abre página branca do Firebase)
2. Copia o código da URL (procura por `oobCode=`)
3. Vai para `http://localhost:3000`
4. Cola o código quando pedido
5. Define nova password

---

## 📦 Build para Produção

```bash
npm run build
```

Ver `README.md` para mais detalhes.

