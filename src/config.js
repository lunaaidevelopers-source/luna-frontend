// Configuração da API
// As variáveis de ambiente no React precisam começar com REACT_APP_
export const API_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:5001/lunaai-backend/us-central1/api' 
    : 'https://us-central1-lunaai-backend.cloudfunctions.net/api');

