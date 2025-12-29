import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut, updatePassword, deleteUser, sendPasswordResetEmail } from 'firebase/auth';
import { logger } from '../utils/logger';

export default function Settings({ onBack, onLogout, onLunaPlus, isPlus }) {
  const [userEmail, setUserEmail] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email || '');
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (onLogout) onLogout();
    } catch (error) {
      logger.error('Logout error:', error);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        setPasswordSuccess('Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess('');
        }, 2000);
      }
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        try {
          await sendPasswordResetEmail(auth, auth.currentUser.email);
          setPasswordError('For security, we sent a password reset link to your email.');
        } catch (e) {
          setPasswordError('Please log out and log in again, then try changing your password.');
        }
      } else {
        setPasswordError('Failed to update password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
        if (onLogout) onLogout();
      }
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        alert('For security, please log out and log in again before deleting your account.');
      } else {
        alert('Failed to delete account. Please try again.');
      }
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#050505',
      minHeight: '100vh',
      padding: '24px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: 'white'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <button 
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#A855F7',
            fontSize: '28px',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          ←
        </button>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          Settings
        </h1>
      </div>

      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        
        {/* Account Info */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '13px', color: '#71717A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Account
          </div>
          <div style={{
            backgroundColor: '#18181B',
            padding: '16px 20px',
            borderRadius: '14px',
            border: '1px solid #27272A'
          }}>
            <div style={{ color: '#A1A1AA', fontSize: '13px', marginBottom: '4px' }}>Email</div>
            <div style={{ color: 'white', fontSize: '16px' }}>{userEmail}</div>
          </div>
        </div>

        {/* Luna Plus */}
        <div style={{ marginBottom: '32px' }}>
          <button 
            onClick={() => onLunaPlus && onLunaPlus()}
            style={{
              width: '100%',
              padding: '20px',
              background: isPlus 
                ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
                : 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: isPlus 
                ? '0 4px 20px rgba(16, 185, 129, 0.3)'
                : '0 4px 20px rgba(168, 85, 247, 0.3)',
              transition: 'transform 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isPlus ? (
              <>Luna Plus Active</>
            ) : (
              <>Upgrade to Luna Plus</>
            )}
          </button>
          {isPlus && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '12px', 
              color: '#10B981', 
              fontSize: '13px',
              fontWeight: '500'
            }}>
              Unlimited messages & all personalities
            </div>
          )}
        </div>

        {/* Options */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '13px', color: '#71717A', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Security
          </div>
          
          <button 
            onClick={() => setShowPasswordModal(true)}
            style={{
              width: '100%',
              padding: '16px 20px',
              backgroundColor: '#18181B',
              border: '1px solid #27272A',
              borderRadius: '14px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              transition: 'border-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#A855F7'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#27272A'}
          >
            <span>Change Password</span>
            <span style={{ color: '#71717A' }}>›</span>
          </button>

          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '16px 20px',
              backgroundColor: '#18181B',
              border: '1px solid #27272A',
              borderRadius: '14px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'border-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#EF4444'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#27272A'}
          >
            <span>Log out</span>
            <span style={{ color: '#71717A' }}>›</span>
          </button>
        </div>

        {/* Legal */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '13px', color: '#71717A', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Legal
          </div>
          <div style={{
            backgroundColor: '#18181B',
            borderRadius: '14px',
            border: '1px solid #27272A',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => {
                window.location.hash = 'terms';
              }}
              style={{
                width: '100%',
                padding: '14px 20px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '1px solid #27272A',
                color: '#A1A1AA',
                textAlign: 'left',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#A855F7'}
              onMouseOut={(e) => e.currentTarget.style.color = '#A1A1AA'}
            >
              Terms of Service
            </button>
            <button
              onClick={() => {
                window.location.hash = 'privacy';
              }}
              style={{
                width: '100%',
                padding: '14px 20px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#A1A1AA',
                textAlign: 'left',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#A855F7'}
              onMouseOut={(e) => e.currentTarget.style.color = '#A1A1AA'}
            >
              Privacy Policy
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <button 
          onClick={() => setShowDeleteModal(true)}
          style={{
            width: '100%',
            padding: '14px',
            background: 'none',
            border: 'none',
            color: '#EF4444',
            fontSize: '15px',
            cursor: 'pointer',
            fontWeight: '500',
            opacity: 0.8,
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
        >
          Delete Account
        </button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #18181B 0%, #0f0f11 100%)',
            padding: '32px',
            borderRadius: '20px',
            maxWidth: '400px',
            width: '100%',
            border: '1px solid #27272A'
          }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '24px', color: 'white' }}>
              Change Password
            </h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', color: '#A1A1AA', marginBottom: '8px', display: 'block' }}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  backgroundColor: '#0f0f11',
                  border: '1px solid #27272A',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', color: '#A1A1AA', marginBottom: '8px', display: 'block' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  backgroundColor: '#0f0f11',
                  border: '1px solid #27272A',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {passwordError && (
              <p style={{ color: '#EF4444', fontSize: '13px', marginBottom: '16px' }}>{passwordError}</p>
            )}
            {passwordSuccess && (
              <p style={{ color: '#10B981', fontSize: '13px', marginBottom: '16px' }}>{passwordSuccess}</p>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#27272A',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleChangePassword}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #18181B 0%, #0f0f11 100%)',
            padding: '32px',
            borderRadius: '20px',
            maxWidth: '400px',
            width: '100%',
            border: '1px solid #27272A',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px', color: 'white' }}>
              Delete Account?
            </h2>
            <p style={{ color: '#A1A1AA', lineHeight: '1.6', marginBottom: '24px' }}>
              This action cannot be undone. All your data, chat history, and subscription will be permanently deleted.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#27272A',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#EF4444',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
