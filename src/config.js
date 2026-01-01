// Configuração da API
// As variáveis de ambiente no React precisam começar com REACT_APP_
export const API_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:5001' 
    : 'https://luna-backend-zvwc.onrender.com');

