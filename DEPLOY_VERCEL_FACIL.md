# 🎨 Deploy Frontend no Vercel - Fácil

## 🚀 Passo a Passo Simples

### 1. Criar Conta no Vercel

1. Vai para [vercel.com](https://vercel.com)
2. Clica em **"Sign Up"**
3. Escolhe **"Continue with GitHub"**
4. Autoriza o Vercel a acessar teus repositórios

---

### 2. Importar Projeto

1. Depois de fazer login, clica em **"Add New..."**
2. Seleciona **"Project"**
3. Vais ver a lista dos teus repositórios do GitHub
4. Procura e clica em **`luna-frontend`**

---

### 3. Configurar (Já Vem Pronto!)

O Vercel detecta automaticamente que é React. Deixa tudo como está:

- **Framework Preset:** Create React App ✅
- **Root Directory:** (deixar vazio) ✅
- **Build Command:** `npm run build` ✅
- **Output Directory:** `build` ✅
- **Install Command:** `npm install` ✅

**NÃO PRECISAS MUDAR NADA!** Só clicar em "Deploy" depois.

---

### 4. Adicionar Variável de Ambiente

**ANTES de clicar "Deploy":**

1. Clica em **"Environment Variables"** (ou expande essa secção)
2. Clica em **"+ Add"**
3. Adiciona:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://luna-backend.onrender.com` 
     *(ou a URL real do teu backend no Render)*

---

### 5. Fazer Deploy

1. Clica no botão **"Deploy"** (canto inferior direito)
2. Aguarda 2-5 minutos
3. Quando terminar, aparece uma URL tipo: `https://luna-frontend.vercel.app`

---

### 6. Testar

1. Clica na URL que apareceu
2. Deve abrir a aplicação Luna AI
3. Testa fazer login/registro

---

## ✅ Pronto!

Agora tens:
- **Backend:** `https://luna-backend.onrender.com`
- **Frontend:** `https://luna-frontend.vercel.app`

---

## 🔄 Atualizar URLs (Importante!)

Depois de ter a URL do frontend:

### No Render (Backend):
1. Vai para o teu serviço no Render
2. Settings → Environment
3. Atualiza `FRONTEND_URLS` com a URL real do Vercel:
   ```
   https://luna-frontend.vercel.app
   ```
4. Salva

### No Vercel (Frontend):
1. Vai para o projeto no Vercel
2. Settings → Environment Variables
3. Verifica que `REACT_APP_API_URL` tem a URL correta do backend

---

## 🆘 Problemas?

### Build falha
- Verifica logs no Vercel
- Verifica que `package.json` está correto

### Erro de conexão com backend
- Verifica que `REACT_APP_API_URL` está correto
- Verifica que o backend está online (testa `/health`)

### Erro de CORS
- Verifica que `FRONTEND_URLS` no Render tem a URL do Vercel

---

## 💡 Dica

O Vercel faz deploy automático sempre que fazes push para o GitHub! 

Só precisas configurar uma vez. Depois, sempre que atualizares o código e fizeres push, o Vercel atualiza automaticamente.

---

**É só isto! Muito simples! 🎉**



