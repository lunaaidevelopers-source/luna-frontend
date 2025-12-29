import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados para reset de password
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Após login bem-sucedido, redirecionar
      onLogin();
    } catch (err) {
      let errorMessage = 'Failed to sign in. ';
      if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please create an account first.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else {
        errorMessage += err.message || 'Please check your credentials.';
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess(false);
    
    if (!resetEmail) {
      setResetError('Please enter your email address.');
      return;
    }

    setResetLoading(true);

    try {
      // Configurar URL de redirecionamento para a nossa página customizada
      const actionCodeSettings = {
        url: `${window.location.origin}`,
        handleCodeInApp: false, // Abre no browser, não na app
      };
      
      await sendPasswordResetEmail(auth, resetEmail, actionCodeSettings);
      setResetSuccess(true);
      setResetError('');
    } catch (err) {
      let errorMessage = 'Failed to send reset email. ';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else {
        errorMessage += err.message || 'Please try again later.';
      }
      setResetError(errorMessage);
      setResetSuccess(false);
    } finally {
      setResetLoading(false);
    }
  };

  const handleCloseResetPassword = () => {
    setShowResetPassword(false);
    setResetEmail('');
    setResetError('');
    setResetSuccess(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '18px 18px 18px 48px',
    marginBottom: '8px',
    borderRadius: '16px',
    border: '1px solid #27272A',
    backgroundColor: '#050505',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  };

  const inputIconStyle = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#71717A',
    pointerEvents: 'none'
  };

  const labelStyle = {
    display: 'block',
    color: '#E4E4E7',
    fontSize: '0.9rem',
    marginBottom: '10px',
    textAlign: 'left',
    paddingLeft: '2px',
    fontWeight: '600'
  };

  return (
    <div style={{ 
      backgroundColor: '#09090B', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      color: 'white',
      padding: '24px',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background gradient effect */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(180, 33, 249, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Ícone decorativo */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #B421F9 0%, #9333EA 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
          boxShadow: '0 10px 40px rgba(180, 33, 249, 0.3)',
          margin: '0 auto 32px'
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        {/* Título Principal */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '3.2rem', 
            fontWeight: '800', 
            margin: '0 0 12px 0', 
            letterSpacing: '-2px',
            lineHeight: '1.1',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #E4E4E7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome back
          </h1>
          <p style={{ 
            color: '#71717A', 
            fontSize: '1rem', 
            marginTop: '8px',
            lineHeight: '1.5'
          }}>
            Sign in to continue your journey with Luna
          </p>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div style={{
            backgroundColor: '#7F1D1D',
            color: '#FCA5A5',
            padding: '16px',
            borderRadius: '14px',
            marginBottom: '24px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: '1px solid #991B1B'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            <label style={labelStyle}>Email</label>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <svg style={inputIconStyle} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input 
                type="email" 
                placeholder="you@example.com" 
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                onFocus={(e) => {
                  e.target.style.border = '1px solid #B421F9';
                  e.target.style.boxShadow = '0 0 0 3px rgba(180, 33, 249, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid #27272A';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Password</span>
              <span 
                onClick={() => setShowResetPassword(true)}
                style={{ color: '#B421F9', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '700' }}
              >
                Forgot password?
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <svg style={inputIconStyle} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                style={{ ...inputStyle, paddingRight: '50px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                onFocus={(e) => {
                  e.target.style.border = '1px solid #B421F9';
                  e.target.style.boxShadow = '0 0 0 3px rgba(180, 33, 249, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid #27272A';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#71717A',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%',
              backgroundColor: loading ? '#6B21A8' : '#B421F9', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '20px', 
              border: 'none', 
              fontWeight: '700', 
              fontSize: '1.1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              opacity: loading ? 0.7 : 1,
              boxShadow: loading ? 'none' : '0 0 30px rgba(180, 33, 249, 0.4)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 5px 35px rgba(180, 33, 249, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 0 30px rgba(180, 33, 249, 0.4)';
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Rodapé */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: '#71717A', fontSize: '0.95rem', marginBottom: '16px' }}>
            Don't have an account? <span 
              onClick={onSwitchToRegister}
              style={{ color: '#B421F9', fontWeight: '800', cursor: 'pointer' }}
            >
              Create one
            </span>
          </p>
        </div>
      </div>

      {/* Modal de Reset de Password */}
      {showResetPassword && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={handleCloseResetPassword}>
          <div 
            style={{
              backgroundColor: '#111113',
              borderRadius: '28px',
              padding: '40px',
              maxWidth: '440px',
              width: '100%',
              border: '1px solid #27272A',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(180, 33, 249, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background glow in modal */}
            <div style={{
              position: 'absolute',
              top: '-10%',
              right: '-10%',
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(180, 33, 249, 0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            {/* Título */}
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '800', 
              marginBottom: '12px',
              marginTop: 0,
              letterSpacing: '-1px'
            }}>
              Reset Password
            </h2>
            <p style={{ 
              color: '#71717A', 
              fontSize: '1rem', 
              marginBottom: '32px',
              lineHeight: '1.5'
            }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {/* Mensagem de sucesso */}
            {resetSuccess && (
              <div style={{
                backgroundColor: '#064E3B',
                color: '#6EE7B7',
                padding: '16px',
                borderRadius: '16px',
                marginBottom: '24px',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid #065F46'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Password reset email sent! Check your inbox.
              </div>
            )}

            {/* Mensagem de erro */}
            {resetError && (
              <div style={{
                backgroundColor: '#7F1D1D',
                color: '#FCA5A5',
                padding: '16px',
                borderRadius: '16px',
                marginBottom: '24px',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid #991B1B'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {resetError}
              </div>
            )}

            {/* Form de Reset */}
            {!resetSuccess && (
              <form onSubmit={handleResetPassword}>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <svg style={inputIconStyle} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input 
                    type="email" 
                    placeholder="you@example.com" 
                    style={{ ...inputStyle, backgroundColor: '#0A0A0A' }}
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    disabled={resetLoading}
                    autoFocus
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                  <button 
                    type="button"
                    onClick={handleCloseResetPassword}
                    style={{ 
                      flex: 1,
                      backgroundColor: 'transparent', 
                      color: '#71717A', 
                      padding: '18px', 
                      borderRadius: '18px', 
                      border: '1px solid #27272A', 
                      fontWeight: '700', 
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'white'}
                    onMouseLeave={(e) => e.target.style.color = '#71717A'}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={resetLoading}
                    style={{ 
                      flex: 1,
                      backgroundColor: resetLoading ? '#6B21A8' : '#B421F9', 
                      color: 'white', 
                      padding: '18px', 
                      borderRadius: '18px', 
                      border: 'none', 
                      fontWeight: '800', 
                      fontSize: '1rem',
                      cursor: resetLoading ? 'not-allowed' : 'pointer',
                      opacity: resetLoading ? 0.7 : 1,
                      boxShadow: '0 0 20px rgba(180, 33, 249, 0.4)'
                    }}
                  >
                    {resetLoading ? 'Sending...' : 'Send link'}
                  </button>
                </div>
              </form>
            )}

            {/* Botão de fechar após sucesso */}
            {resetSuccess && (
              <button 
                onClick={handleCloseResetPassword}
                style={{ 
                  width: '100%',
                  backgroundColor: '#B421F9', 
                  color: 'white', 
                  padding: '18px', 
                  borderRadius: '18px', 
                  border: 'none', 
                  fontWeight: '800', 
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  marginTop: '10px',
                  boxShadow: '0 10px 30px rgba(180, 33, 249, 0.4)'
                }}
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
