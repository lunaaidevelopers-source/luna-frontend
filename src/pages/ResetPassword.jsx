import React, { useState, useEffect } from 'react';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../firebase';

export default function ResetPassword({ onSuccess }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [oobCode, setOobCode] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    // Obter o código de reset da URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('oobCode');
    const apiKey = urlParams.get('apiKey');
    const mode = urlParams.get('mode');

    // Detectar link de reset do Firebase
    // O Firebase pode enviar: ?mode=resetPassword&oobCode=...&apiKey=... (quando vem do continueUrl)
    // OU: ?oobCode=...&apiKey=... (quando vem direto)
    if (code && (apiKey || mode === 'resetPassword')) {
      setOobCode(code);
      // Verificar se o código é válido
      verifyPasswordResetCode(auth, code)
        .then(() => {
          setVerifying(false);
        })
        .catch((err) => {
          setError('Invalid or expired reset link. Please request a new one.');
          setVerifying(false);
          setShowManualInput(true); // Mostrar opção manual se falhar
        });
    } else if (code) {
      // Se há código mas não há apiKey nem mode, ainda tentamos (pode ser formato diferente)
      setOobCode(code);
      verifyPasswordResetCode(auth, code)
        .then(() => {
          setVerifying(false);
        })
        .catch((err) => {
          setError('Invalid or expired reset link. Please request a new one.');
          setVerifying(false);
          setShowManualInput(true);
        });
    } else {
      // Se não há código na URL, mostrar opção para inserir manualmente
      setVerifying(false);
      setShowManualInput(true);
    }
  }, []);

  const handleManualCodeSubmit = async () => {
    if (!manualCode.trim()) {
      setError('Please enter the reset code.');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      await verifyPasswordResetCode(auth, manualCode.trim());
      setOobCode(manualCode.trim());
      setShowManualInput(false);
      setVerifying(false);
    } catch (err) {
      setError('Invalid or expired reset code. Please check the code from your email and try again.');
      setVerifying(false);
    }
  };

  // Calcular força da password
  useEffect(() => {
    if (newPassword.length === 0) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (newPassword.length >= 6) strength += 1;
    if (newPassword.length >= 8) strength += 1;
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) strength += 1;
    if (/\d/.test(newPassword)) strength += 1;
    if (/[^a-zA-Z\d]/.test(newPassword)) strength += 1;

    setPasswordStrength(strength);
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!oobCode) {
      setError('Invalid reset code.');
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      // Sucesso - redirecionar para login
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      let errorMessage = 'Failed to reset password. ';
      if (err.code === 'auth/expired-action-code') {
        errorMessage = 'This reset link has expired. Please request a new one.';
      } else if (err.code === 'auth/invalid-action-code') {
        errorMessage = 'Invalid reset link. Please request a new one.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else {
        errorMessage += err.message || 'Please try again.';
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return '#EF4444'; // Red
    if (passwordStrength <= 2) return '#F59E0B'; // Orange
    if (passwordStrength <= 3) return '#3B82F6'; // Blue
    return '#10B981'; // Green
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    return 'Strong';
  };

  const inputStyle = {
    width: '100%',
    padding: '18px 50px 18px 18px',
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

  const inputFocusStyle = {
    border: '1px solid #B421F9',
    boxShadow: '0 0 0 3px rgba(180, 33, 249, 0.1)',
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

  if (verifying) {
    return (
      <div style={{ 
        backgroundColor: '#09090B', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'white',
        padding: '20px',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          {/* Ícone de loading animado */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            border: '4px solid #27272A',
            borderTopColor: '#B421F9',
            animation: 'spin 1s linear infinite'
          }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
            Verifying reset link
          </h2>
          <p style={{ color: '#71717A', fontSize: '0.95rem' }}>
            Please wait while we verify your reset link...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

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
        background: 'radial-gradient(circle, rgba(180, 33, 249, 0.1) 0%, transparent 70%)',
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
          boxShadow: '0 10px 40px rgba(180, 33, 249, 0.3)'
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 11.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>

        {/* Título */}
        <div style={{ textAlign: 'left', marginBottom: '40px' }}>
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
            Reset Password
          </h1>
          <p style={{ 
            color: '#71717A', 
            fontSize: '1rem', 
            marginTop: '8px',
            lineHeight: '1.5'
          }}>
            Create a new secure password for your account
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

        {/* Input manual do código (se não vier na URL) */}
        {showManualInput && !oobCode && (
          <div style={{
            backgroundColor: '#111113',
            padding: '24px',
            borderRadius: '20px',
            marginBottom: '24px',
            border: '1px solid #27272A'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '16px', color: '#E4E4E7' }}>
              🔑 Insere o Código de Reset
            </h3>
            
            <div style={{ 
              backgroundColor: '#1A1A1A', 
              padding: '16px', 
              borderRadius: '12px', 
              marginBottom: '20px',
              border: '1px solid #27272A'
            }}>
              <p style={{ color: '#E4E4E7', fontSize: '0.95rem', fontWeight: '600', marginBottom: '12px' }}>
                📋 Passos Simples:
              </p>
              <div style={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#B421F9', fontWeight: 'bold', minWidth: '24px' }}>1.</span>
                  <span>Quando clicares no link do email, abre a <strong style={{ color: '#E4E4E7' }}>página branca do Firebase</strong></span>
                </div>
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#B421F9', fontWeight: 'bold', minWidth: '24px' }}>2.</span>
                  <span>Olha para o <strong style={{ color: '#E4E4E7' }}>topo do browser</strong> (barra de endereços)</span>
                </div>
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#B421F9', fontWeight: 'bold', minWidth: '24px' }}>3.</span>
                  <span>Procura por <code style={{ backgroundColor: '#27272A', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem', color: '#B421F9', fontFamily: 'monospace' }}>oobCode=</code> na URL</span>
                </div>
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#B421F9', fontWeight: 'bold', minWidth: '24px' }}>4.</span>
                  <span>Copia <strong style={{ color: '#86EFAC' }}>TUDO</strong> que vem depois de <code style={{ backgroundColor: '#27272A', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>oobCode=</code></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#B421F9', fontWeight: 'bold', minWidth: '24px' }}>5.</span>
                  <span>Cola aqui em baixo e clica em "Verify Code"</span>
                </div>
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#0A0A0A', 
              padding: '14px', 
              borderRadius: '10px', 
              marginBottom: '20px',
              border: '1px solid #27272A'
            }}>
              <p style={{ color: '#71717A', fontSize: '0.85rem', marginBottom: '8px', fontWeight: '600' }}>
                💡 Exemplo:
              </p>
              <div style={{ fontSize: '0.8rem', color: '#52525B', fontFamily: 'monospace', lineHeight: '1.6' }}>
                URL: <span style={{ color: '#71717A' }}>...firebaseapp.com/__/auth/action?</span>
                <br/>
                <span style={{ color: '#71717A' }}>mode=resetPassword&</span>
                <span style={{ color: '#B421F9' }}>oobCode=</span>
                <span style={{ color: '#86EFAC', fontWeight: 'bold' }}>ABC123XYZ456DEF789</span>
                <span style={{ color: '#71717A' }}>&apiKey=...</span>
                <br/><br/>
                <span style={{ color: '#E4E4E7' }}>→ Copia apenas: </span>
                <span style={{ color: '#86EFAC', fontWeight: 'bold', fontSize: '0.9rem' }}>ABC123XYZ456DEF789</span>
              </div>
            </div>
            <label style={{ 
              display: 'block', 
              color: '#E4E4E7', 
              fontSize: '0.9rem', 
              marginBottom: '10px', 
              fontWeight: '600' 
            }}>
              Código de Reset:
            </label>
            <input
              type="text"
              placeholder="Cola o código aqui (ex: ABC123XYZ456DEF789)"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              style={{
                ...inputStyle,
                marginBottom: '20px',
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                backgroundColor: '#0A0A0A',
                border: '1px solid #27272A',
                padding: '18px'
              }}
              disabled={verifying}
              autoFocus
            />
            <button
              type="button"
              onClick={handleManualCodeSubmit}
              disabled={verifying || !manualCode.trim()}
              style={{
                width: '100%',
                backgroundColor: verifying || !manualCode.trim() ? '#6B21A8' : '#B421F9',
                color: 'white',
                padding: '16px',
                borderRadius: '16px',
                border: 'none',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: verifying || !manualCode.trim() ? 'not-allowed' : 'pointer',
                opacity: verifying || !manualCode.trim() ? 0.7 : 1,
                boxShadow: '0 0 20px rgba(180, 33, 249, 0.3)'
              }}
            >
              {verifying ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>
        )}

        {/* Form (só mostra se tiver código válido) */}
        {oobCode && (
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            {/* New Password */}
            <label style={labelStyle}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter your new password" 
                style={{
                  ...inputStyle,
                  ...(newPassword && inputFocusStyle)
                }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                autoFocus
                onFocus={(e) => {
                  e.target.style.border = '1px solid #B421F9';
                  e.target.style.boxShadow = '0 0 0 3px rgba(180, 33, 249, 0.1)';
                }}
                onBlur={(e) => {
                  if (!newPassword) {
                    e.target.style.border = '1px solid #27272A';
                    e.target.style.boxShadow = 'none';
                  }
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

            {/* Password Strength Indicator */}
            {newPassword && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '0.85rem', color: '#71717A' }}>Password strength</span>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: '600',
                    color: getPasswordStrengthColor()
                  }}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div style={{
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: '#27272A',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(passwordStrength / 5) * 100}%`,
                    backgroundColor: getPasswordStrengthColor(),
                    transition: 'all 0.3s ease',
                    borderRadius: '2px'
                  }} />
                </div>
              </div>
            )}
            
            {/* Confirm Password */}
            <label style={labelStyle}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="Confirm your new password" 
                style={{
                  ...inputStyle,
                  ...(confirmPassword && inputFocusStyle)
                }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                onFocus={(e) => {
                  e.target.style.border = '1px solid #B421F9';
                  e.target.style.boxShadow = '0 0 0 3px rgba(180, 33, 249, 0.1)';
                }}
                onBlur={(e) => {
                  if (!confirmPassword) {
                    e.target.style.border = '1px solid #27272A';
                    e.target.style.boxShadow = 'none';
                  }
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

          {/* Botão */}
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
                Resetting password...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Reset Password
              </>
            )}
          </button>
        </form>
        )}

        {/* Mensagem se não tiver código */}
        {!oobCode && !showManualInput && (
          <div style={{
            backgroundColor: '#111113',
            padding: '24px',
            borderRadius: '20px',
            marginBottom: '24px',
            border: '1px solid #27272A',
            textAlign: 'center'
          }}>
            <p style={{ color: '#71717A', fontSize: '0.95rem', marginBottom: '16px' }}>
              No reset code found. Please click the link from your email or enter the code manually.
            </p>
            <button
              onClick={() => setShowManualInput(true)}
              style={{
                backgroundColor: '#B421F9',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Enter Code Manually
            </button>
          </div>
        )}

        {/* Link para voltar ao login */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: '#71717A', fontSize: '0.95rem' }}>
            Remember your password?{' '}
            <span 
              onClick={() => {
                if (onSuccess) {
                  onSuccess();
                } else {
                  window.location.href = '/login';
                }
              }}
              style={{ 
                color: '#B421F9', 
                fontWeight: '700', 
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#C084FC'}
              onMouseLeave={(e) => e.target.style.color = '#B421F9'}
            >
              Sign in
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
