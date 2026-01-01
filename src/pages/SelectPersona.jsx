import React from 'react';
import { PERSONAS } from '../constants';

export default function SelectPersona({ onSelect, onUpgrade, isPlus, onLogout, onSettings }) {
  // Processar personas para aplicar estado de bloqueio baseado no status Plus
  const personas = PERSONAS.map(p => ({
    ...p,
    locked: (p.id === 'submissive' || p.id === 'seductive') ? !isPlus : false
  }));

  return (
    <div style={{ 
      backgroundColor: '#050505', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '40px 20px',
      color: 'white',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative'
    }}>
      {/* Top Navigation */}
      <div style={{
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px'
      }}>
        <button 
          onClick={onSettings}
          style={{
            backgroundColor: 'transparent',
            color: '#A855F7',
            border: '1px solid #27272A',
            padding: '12px',
            borderRadius: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.1)';
            e.currentTarget.style.borderColor = '#A855F7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#27272A';
          }}
          title="Settings"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>

      <h1 style={{ fontSize: '3.2rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-2.5px' }}>
        Select your Luna
      </h1>
      <p style={{ color: '#52525B', fontSize: '1.1rem', marginBottom: '50px', fontWeight: '500' }}>
        Choose the personality that fits you best
      </p>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px', 
        width: '100%', 
        maxWidth: '420px' 
      }}>
        {personas.map((p) => (
          <div 
            key={p.id}
            onClick={() => p.locked ? onUpgrade() : onSelect(p)}
            style={{
              backgroundColor: '#0F0F11',
              borderRadius: '28px',
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '22px',
              cursor: "pointer",
              border: '1px solid #1D1D20',
              position: 'relative',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
            onMouseEnter={(e) => {
              const glowColor = p.locked ? '#B421F9' : p.color; 
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.borderColor = glowColor;
              e.currentTarget.style.boxShadow = `0 15px 35px rgba(0,0,0,0.6), 0 0 25px ${glowColor}44`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = '#1D1D20';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Foto da Persona */}
            <div style={{
              width: '95px',
              height: '95px',
              borderRadius: '22px',
              overflow: 'hidden',
              position: 'relative',
              border: `2px solid ${p.locked ? '#27272A' : '#1D1D20'}`,
            }}>
              <img 
                src={p.image} 
                alt={p.name} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  filter: p.locked ? 'grayscale(1) blur(2px)' : 'none',
                  opacity: p.locked ? 0.4 : 1,
                  transition: 'all 0.4s ease'
                }} 
              />
              {p.locked && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem',
                  filter: 'drop-shadow(0 0 8px rgba(180, 33, 249, 0.8))'
                }}>
                  🔒
                </div>
              )}
            </div>

            <div style={{ textAlign: 'left', flex: 1 }}>
              <h3 style={{ 
                margin: '0 0 6px 0', 
                fontSize: '1.4rem', 
                fontWeight: '700',
                color: p.locked ? '#A1A1AA' : 'white',
                letterSpacing: '-0.5px'
              }}>
                {p.name}
              </h3>
              <p style={{ margin: 0, color: '#52525B', fontSize: '0.95rem', fontWeight: '500' }}>
                {p.vibe}
              </p>
            </div>

            {p.locked && (
              <span style={{
                backgroundColor: '#B421F9',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: '900',
                padding: '4px 10px',
                borderRadius: '8px',
                position: 'absolute',
                top: '12px',
                right: '12px',
                boxShadow: '0 0 15px rgba(180, 33, 249, 0.5)'
              }}>
                PLUS
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <p style={{ color: '#3F3F46', fontSize: '0.9rem', fontWeight: '500' }}>
          {isPlus ? "You are a Luna Plus Member ✨" : "Experience more with"} <br/>
          {!isPlus && (
            <span 
              onClick={() => onUpgrade && onUpgrade()}
              style={{ 
                color: '#B421F9', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                marginTop: '8px', 
                display: 'inline-block',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#EC4899'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#B421F9'}
            >
              Upgrade to Luna Plus
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
