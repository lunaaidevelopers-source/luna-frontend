import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function Register({ onRegister, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is18Plus, setIs18Plus] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!is18Plus) {
      setError('You must confirm that you are 18 or older.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Após registo bem-sucedido, redirecionar
      onRegister();
    } catch (err) {
      let errorMessage = 'Failed to create account. ';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak.';
      } else {
        errorMessage += err.message;
      }
      setError(errorMessage);
      setLoading(false);
    }
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
        maxWidth: '420px',
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
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
            Create account
          </h1>
          <p style={{ 
            color: '#71717A', 
            fontSize: '1rem', 
            marginTop: '8px',
            lineHeight: '1.5'
          }}>
            Start your journey with Luna today
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
            
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
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

            <label style={labelStyle}>Confirm Password</label>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <svg style={inputIconStyle} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                style={{ ...inputStyle, paddingRight: '50px' }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? (
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

          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '32px',
              padding: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              cursor: 'pointer'
            }}
            onClick={() => setIs18Plus(!is18Plus)}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              border: `2px solid ${is18Plus ? '#B421F9' : '#3F3F46'}`,
              backgroundColor: is18Plus ? '#B421F9' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}>
              {is18Plus && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: '0.95rem', color: is18Plus ? '#E4E4E7' : '#71717A', fontWeight: '500' }}>
              I confirm I am 18 or older
            </span>
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Rodapé */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: '#71717A', fontSize: '0.95rem', marginBottom: '16px' }}>
            Already have an account? <span 
              onClick={onSwitchToLogin}
              style={{ color: '#B421F9', fontWeight: '800', cursor: 'pointer' }}
            >
              Login
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
