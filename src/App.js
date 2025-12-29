import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { API_URL } from './config';
import { logger } from './utils/logger';
import './App.css';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import SelectPersona from './pages/SelectPersona';
import Chat from './pages/Chat';
import LunaPlus from './pages/LunaPlus';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedLuna, setSelectedLuna] = useState(null);
  const [isPlus, setIsPlus] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar se há código de reset na URL (vindo do Firebase)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oobCode = urlParams.get('oobCode');
    const apiKey = urlParams.get('apiKey');
    const mode = urlParams.get('mode');
    const paymentStatus = urlParams.get('payment');
    const hash = window.location.hash.substring(1); // Remove #
    
    // Detectar se é um link de reset do Firebase
    if (oobCode && (apiKey || mode === 'resetPassword')) {
      setCurrentPage('resetPassword');
      return;
    }
    
    // Verificar hash para páginas legais
    if (hash === 'terms') {
      setCurrentPage('terms');
      return;
    }
    if (hash === 'privacy') {
      setCurrentPage('privacy');
      return;
    }
    
    // Verificar se há sucesso de pagamento
    if (paymentStatus === 'success' && user) {
      // Atualizar status de subscrição
      fetch(`${API_URL}/api/v1/payment/subscription-status?userId=${user.uid}`)
        .then(res => res.json())
        .then(data => {
          setIsPlus(data.isSubscribed || false);
          setCurrentPage('selectPersona');
        })
        .catch(err => logger.error('Erro ao verificar subscrição:', err));
    }
  }, [user]);
  
  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash === 'terms') {
        setCurrentPage('terms');
      } else if (hash === 'privacy') {
        setCurrentPage('privacy');
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Monitorar estado de autenticação e verificar subscrição
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      // Verificar status de subscrição quando o utilizador faz login
      if (user) {
        try {
          const response = await fetch(`${API_URL}/api/v1/payment/subscription-status?userId=${user.uid}`);
          if (response.ok) {
            const data = await response.json();
            setIsPlus(data.isSubscribed || false);
          }
        } catch (err) {
          logger.error('Erro ao verificar subscrição:', err);
        }
      } else {
        setIsPlus(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Redirecionar quando o utilizador faz login/register (apenas se acabou de fazer login)
  useEffect(() => {
    if (!user && ['selectPersona', 'chat', 'lunaPlus'].includes(currentPage)) {
      setCurrentPage('landing');
    }
  }, [user, currentPage]);

  // Navigation handlers
  const handleStart = () => {
    setCurrentPage('register');
  };

  const handleLogin = () => {
    setCurrentPage('login');
  };

  const handleSwitchToRegister = () => {
    setCurrentPage('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentPage('login');
  };

  const handleRegister = () => {
    // Após register, verificar se é Plus
    // Se não for Plus, mostrar página Luna Plus primeiro
    if (!isPlus) {
      setCurrentPage('lunaPlus');
    } else {
      setCurrentPage('selectPersona');
    }
  };

  const handleLoginSuccess = () => {
    // Após login, verificar se é Plus
    // Se não for Plus, mostrar página Luna Plus primeiro
    if (!isPlus) {
      setCurrentPage('lunaPlus');
    } else {
      setCurrentPage('selectPersona');
    }
  };

  const handleSelectPersona = (persona) => {
    setSelectedLuna(persona);
    setCurrentPage('chat');
  };

  const handleUpgrade = () => {
    setCurrentPage('lunaPlus');
  };

  const handleLunaPlusSuccess = () => {
    setIsPlus(true);
    setCurrentPage('selectPersona');
  };

  const handleBackFromLunaPlus = () => {
    // Se o utilizador estiver logado, voltar para selectPersona, senão voltar para landing
    if (user) {
      setCurrentPage('selectPersona');
    } else {
      setCurrentPage('landing');
    }
  };

  const handleBackToPersonaSelection = () => {
    setCurrentPage('selectPersona');
  };

  const handleGoToLanding = () => {
    setCurrentPage('landing');
  };

  const handleLimitReached = () => {
    setCurrentPage('lunaPlus');
  };

  const handleResetPasswordSuccess = () => {
    setCurrentPage('login');
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleOpenSettings = () => {
    setCurrentPage('settings');
  };

  const handleBackFromSettings = () => {
    setCurrentPage('selectPersona');
  };

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div style={{ 
        backgroundColor: '#09090B', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white'
      }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Render current page
  switch (currentPage) {
    case 'landing':
      return <Landing onStart={handleStart} onLogin={handleLogin} />;
    
    case 'login':
      return <Login onLogin={handleLoginSuccess} onSwitchToRegister={handleSwitchToRegister} />;
    
    case 'register':
      return <Register onRegister={handleRegister} onSwitchToLogin={handleSwitchToLogin} />;
    
    case 'selectPersona':
      return (
        <SelectPersona 
          onSelect={handleSelectPersona} 
          onUpgrade={handleUpgrade}
          isPlus={isPlus}
          onLogout={handleGoToLanding}
          onSettings={handleOpenSettings}
        />
      );
    
    case 'chat':
      return (
        <Chat 
          selectedLuna={selectedLuna} 
          onBack={handleBackToPersonaSelection} 
          onLimitReached={handleLimitReached}
          onSettings={handleOpenSettings}
        />
      );
    
    case 'lunaPlus':
      return (
        <LunaPlus 
          onBack={handleBackFromLunaPlus} 
          onSuccess={handleLunaPlusSuccess}
          onSettings={handleOpenSettings}
        />
      );
    
    case 'settings':
      return (
        <Settings 
          onBack={handleBackFromSettings}
          onLogout={handleGoToLanding}
          onLunaPlus={handleUpgrade}
          isPlus={isPlus}
        />
      );
    
    case 'resetPassword':
      return <ResetPassword onSuccess={handleResetPasswordSuccess} />;
    
    case 'terms':
      return <Terms onBack={user ? () => setCurrentPage('settings') : () => setCurrentPage('landing')} />;
    
    case 'privacy':
      return <Privacy onBack={user ? () => setCurrentPage('settings') : () => setCurrentPage('landing')} />;
    
    default:
      return <Landing onStart={handleStart} onLogin={handleLogin} />;
  }
}



export default App;