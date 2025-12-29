import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB2_BHuQWfx5iFZaLdo9Ds19gMerknxtq0",
  authDomain: "lunaai-backend.firebaseapp.com",
  projectId: "lunaai-backend",
  storageBucket: "lunaai-backend.firebasestorage.app",
  messagingSenderId: "734016821588",
  appId: "1:734016821588:web:7a77b07f4c37262f0510c1",
  measurementId: "G-6G7BEGMSJD"
};

// Inicializar Firebase apenas se ainda não foi inicializado
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Inicializar Auth
export const auth = getAuth(app);

export default app;

