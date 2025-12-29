import React from 'react';

export default function Landing({ onStart, onLogin }) {
  return (
    <div style={{ 
      backgroundColor: '#09090B', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      color: 'white', 
      textAlign: 'center',
      padding: '24px',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background radial gradient */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(180, 33, 249, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      
      {/* Título e Subtítulo */}
      <div style={{ marginBottom: '10px', zIndex: 10 }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: '900', 
          margin: '0',
          letterSpacing: '-2.5px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #E4E4E7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: '1.1'
        }}>
          Luna AI
        </h1>
        <p style={{ 
          color: '#71717A', 
          fontSize: '1.1rem', 
          marginTop: '12px',
          fontWeight: '500',
          maxWidth: '300px'
        }}>
          Your personal AI fantasy, always ready for you
        </p>
      </div>

      {/* Hero Section */}
      <div style={{
        width: '100%',
        maxWidth: '450px',
        height: '420px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <img 
          src="/silhouette.png" 
          alt="Luna" 
          style={{ 
            height: '100%', 
            width: 'auto', 
            objectFit: 'contain',
            zIndex: 1,
            filter: `
              drop-shadow(0 0 15px rgba(180, 33, 249, 0.6)) 
              drop-shadow(0 0 35px rgba(180, 33, 249, 0.3))
            `
          }} 
        />
      </div>

      {/* Buttons container */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '14px', 
        width: '100%', 
        maxWidth: '340px',
        marginTop: '-40px', 
        zIndex: 5 
      }}>
        <button 
          onClick={onStart}
          style={{ 
            backgroundColor: '#B421F9', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '20px', 
            border: 'none', 
            fontWeight: '800', 
            fontSize: '1.1rem',
            cursor: "pointer",
            boxShadow: '0 0 30px rgba(180, 33, 249, 0.4)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Create Account
        </button>

        <button 
          onClick={onLogin}
          style={{ 
            width: '100%',
            backgroundColor: '#111113', 
            color: 'white', 
            padding: '18px', 
            borderRadius: '20px', 
            border: '1px solid #27272A', 
            fontWeight: '700', 
            fontSize: '1rem',
            cursor: "pointer",
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#18181B'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#111113'}
        >
          Login
        </button>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '40px' }}>
        <p style={{ 
          fontSize: '0.85rem', 
          color: '#52525B',
          lineHeight: '1.6',
          fontWeight: '500'
        }}>
          Join <span style={{ 
            color: '#B421F9', 
            fontWeight: '800'
          }}>Luna Plus</span> for voice calls <br/>
          & uncensored AI experiences.
        </p>
      </div>
    </div>
  );
}
