import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { API_URL } from '../config';

export default function LunaPlus({ onBack, onSuccess, onSettings }) {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const benefits = [
    { title: 'All premium Personalities', iconPath: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" },
    { title: 'Unlimited, Uncensored Chat', iconPath: "M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25-9 3.694-9 8.25c0 2.324.908 4.421 2.39 5.968l-.51 2.55a.75.75 0 0 0 .963.868l2.96-1.185c1.1.286 2.26.449 3.45.449Z" },
    // Removed voice replies/calls and images/media sharing per product decision
  ];

  const plans = [
    { id: 'yearly', name: 'Yearly', price: '€9.99', period: '/month' },
    { id: 'three_months', name: 'Three months', price: '€12.99', period: '/month' },
    { id: 'monthly', name: 'Monthly', price: '€14.99', period: '/month' }
  ];

  // Verificar se há sucesso de pagamento na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');
    
    if (paymentStatus === 'success' && sessionId) {
      // Pagamento bem-sucedido - atualizar estado e redirecionar
      if (onSuccess) {
        onSuccess();
      }
      // Limpar URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancelled') {
      setError('Payment was cancelled. Please try again if you want to subscribe.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [onSuccess]);

  const handleSubscribe = async () => {
    const user = auth.currentUser;
    
    if (!user) {
      setError('You must be logged in to subscribe.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Criar sessão de checkout
      const response = await fetch(`${API_URL}/api/v1/payment/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          planId: selectedPlan
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirecionar para o Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError(err.message || 'Failed to start payment process. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#09090B', minHeight: '100vh', color: 'white', 
      fontFamily: 'Inter, sans-serif', padding: '40px 24px', 
      display: 'flex', flexDirection: 'column', alignItems: 'center' 
    }}>
      {/* Header com Botão Skip e Settings */}
      <div style={{ width: '100%', maxWidth: '500px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <button onClick={onBack} style={{ 
          background: 'none', 
          border: '1px solid #27272A', 
          color: '#71717A', 
          fontSize: '0.9rem',
          padding: '10px 20px',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#A855F7';
          e.currentTarget.style.borderColor = '#A855F7';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#71717A';
          e.currentTarget.style.borderColor = '#27272A';
        }}
        >Maybe Later</button>
        <button 
          onClick={onSettings}
          style={{ 
            background: 'transparent', 
            border: '1px solid #27272A', 
            color: '#A855F7', 
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '12px',
            transition: 'all 0.2s',
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>

      {/* Título e Subtítulo */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '12px', lineHeight: '1.1', letterSpacing: '-1px' }}>
          Unlock the full<br/>Luna Experience
        </h1>
        <p style={{ color: '#71717A', fontSize: '1.1rem' }}>
          Go Plus for exclusive features & endless conversations
        </p>
      </div>

      {/* Benefícios */}
      <div style={{ 
        display: 'flex', flexDirection: 'column', gap: '22px', 
        marginBottom: '50px', width: 'fit-content' 
      }}>
        {benefits.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <svg style={{ width: '22px', height: '22px', color: '#A855F7' }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d={b.iconPath} />
            </svg>
            <span style={{ fontSize: '1.1rem', fontWeight: '500', color: '#E4E4E7' }}>{b.title}</span>
          </div>
        ))}
      </div>

      {/* Planos Selecionáveis */}
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <h3 style={{ 
          fontSize: '0.85rem', color: '#52525B', fontWeight: '800', 
          textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '20px', textAlign: 'center' 
        }}>
          CHOOSE YOUR PLAN
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '35px' }}>
          {plans.map((p) => (
            <div 
              key={p.id}
              onClick={() => setSelectedPlan(p.id)}
              style={{
                backgroundColor: '#111113',
                borderRadius: '22px',
                padding: '22px',
                border: `2px solid ${selectedPlan === p.id ? '#A855F7' : '#1D1D20'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: selectedPlan === p.id ? '0 0 20px rgba(168, 85, 247, 0.15)' : 'none'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>{p.name}</span>
                <span style={{ fontSize: '1rem', color: '#71717A' }}>{p.price} {p.period}</span>
              </div>
              <div style={{ 
                width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #3F3F46',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: selectedPlan === p.id ? '#A855F7' : 'transparent',
                borderColor: selectedPlan === p.id ? '#A855F7' : '#3F3F46'
              }}>
                {selectedPlan === p.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'white' }} />}
              </div>
            </div>
          ))}
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
            gap: '10px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Botão de Upgrade */}
        <button 
          onClick={handleSubscribe}
          disabled={loading}
          style={{
            width: '100%', 
            backgroundColor: loading ? '#6B21A8' : '#A855F7', 
            color: 'white', 
            border: 'none', 
            padding: '20px', 
            borderRadius: '24px', 
            fontSize: '1.2rem', 
            fontWeight: '800', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            boxShadow: '0 10px 30px rgba(168, 85, 247, 0.35)',
            transition: 'transform 0.2s ease',
            opacity: loading ? 0.7 : 1
          }}
          onMouseDown={(e) => {
            if (!loading) e.currentTarget.style.transform = 'scale(0.97)';
          }}
          onMouseUp={(e) => {
            if (!loading) e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {loading ? 'Processing...' : 'Get Luna Plus'}
        </button>

        <p style={{ color: '#52525B', fontSize: '0.85rem', textAlign: 'center', marginTop: '20px' }}>
          Cancel anytime. Terms apply
        </p>
      </div>
    </div>
  );
}