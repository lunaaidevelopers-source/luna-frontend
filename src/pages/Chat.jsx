import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { API_URL } from '../config';
import { logger } from '../utils/logger';

export default function Chat({ selectedLuna, onBack, onLimitReached, onSettings }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Carregar histórico quando o componente monta
  useEffect(() => {
    const loadHistory = async () => {
      const user = auth.currentUser;
      
      if (!user) {
        setMessages([{ sender: 'luna', text: `Hi there! I'm your ${selectedLuna?.name || 'Luna'}. How can I make your day better? ✨` }]);
        setLoadingHistory(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/v1/chat/history?userId=${user.uid}&persona=${encodeURIComponent(selectedLuna?.name || 'Luna')}`
        );
        
        if (!response.ok) {
          setMessages([{ sender: 'luna', text: `Hi there! I'm your ${selectedLuna?.name || 'Luna'}. How can I make your day better? ✨` }]);
          setLoadingHistory(false);
          return;
        }
        
        const data = await response.json();
        
        if (data.messages && data.messages.length > 0) {
          const historyMessages = [];
          data.messages.forEach(msg => {
            historyMessages.push({ sender: 'user', text: msg.message });
            historyMessages.push({ sender: 'luna', text: msg.reply });
          });
          setMessages(historyMessages);
        } else {
          setMessages([{ sender: 'luna', text: `Hi there! I'm your ${selectedLuna?.name || 'Luna'}. How can I make your day better? ✨` }]);
        }
      } catch (error) {
        logger.error('Error loading history:', error);
        setMessages([{ sender: 'luna', text: `Hi there! I'm your ${selectedLuna?.name || 'Luna'}. How can I make your day better? ✨` }]);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, [selectedLuna]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const user = auth.currentUser;
    if (!user) {
      alert('Please log in to send messages');
      return;
    }

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentInput, 
          persona: selectedLuna?.name || 'Luna',
          userId: user.uid
        }),
      });

      setIsTyping(false);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Tratar limite diário
        if (response.status === 403 && errorData.limit_reached) {
          setMessages(prev => [...prev, { 
            sender: 'luna', 
            text: errorData.message || "You've reached your daily limit. Please upgrade to Luna Plus for unlimited messages!" 
          }]);
          if (onLimitReached) onLimitReached();
          return;
        }

        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'luna', text: data.reply }]);
    } catch (error) {
      logger.error('Error sending message:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        sender: 'luna', 
        text: "I'm having trouble connecting right now. Please check your internet or try again later. 🥺" 
      }]);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm('Are you sure you want to clear this conversation? This cannot be undone.')) return;
    
    const user = auth.currentUser;
    if (!user) return;
    
    try {
        const personaName = selectedLuna?.name || 'Luna';
        const response = await fetch(`${API_URL}/api/v1/chat/history?userId=${user.uid}&persona=${encodeURIComponent(personaName)}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to clear chat');
        
        // Reset local state
        setMessages([{ sender: 'luna', text: `Hi there! I'm your ${personaName}. How can I make your day better? ✨` }]);
        
    } catch (error) {
        logger.error('Error clearing chat:', error);
        alert('Failed to clear chat history. Please try again.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      backgroundColor: '#050505',
      color: 'white',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Header */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #27272A', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: 'rgba(5, 5, 5, 0.95)',
        backdropFilter: 'blur(10px)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onBack}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#A1A1AA', 
              fontSize: '24px', 
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ←
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              overflow: 'hidden',
              border: '2px solid #A855F7'
            }}>
              <img 
                src={selectedLuna?.image} 
                alt={selectedLuna?.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{selectedLuna?.name || 'Luna'}</h2>
              <div style={{ fontSize: '12px', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#4ADE80', borderRadius: '50%' }}></span>
                Online
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
            {/* Trash Button */}
            <button
                onClick={handleClearChat}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#71717A',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.color = '#EF4444';
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.color = '#71717A';
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Clear Conversation"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>

            <button 
                onClick={onSettings}
                style={{ 
                background: 'none', 
                border: 'none', 
                color: '#A1A1AA', 
                cursor: 'pointer',
                padding: '8px'
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </button>
        </div>
      </div>

      {/* Mensagens */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '100px 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#0A0A0A' }}>
        {loadingHistory && (
          <div style={{ color: '#71717A', textAlign: 'center', padding: '20px' }}>
            Loading chat history...
          </div>
        )}
        {!loadingHistory && messages.map((m, i) => (
          <div 
            key={i} 
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              display: 'flex',
              flexDirection: 'column',
              maxWidth: m.isLimitReached ? '90%' : '75%',
              gap: '4px'
            }}
          >
            {/* Mensagem especial de limite atingido - CENTRADA E GRANDE */}
            {m.isLimitReached ? (
              <>
                {/* Fundo escuro */}
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  zIndex: 999
                }} />
                {/* Popup */}
                <div style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'linear-gradient(135deg, #1a0a2e 0%, #16082e 50%, #0d0a1a 100%)',
                  padding: '50px 60px',
                  borderRadius: '28px',
                  border: '2px solid rgba(168, 85, 247, 0.5)',
                  boxShadow: '0 8px 60px rgba(168, 85, 247, 0.4), 0 0 100px rgba(168, 85, 247, 0.1)',
                  textAlign: 'center',
                  zIndex: 1000,
                  minWidth: '420px',
                  maxWidth: '90vw'
                }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>💔</div>
                <div style={{ 
                  fontSize: '26px', 
                  fontWeight: 'bold', 
                  color: '#E9D5FF',
                  marginBottom: '16px'
                }}>
                  You've used all 20 free messages today!
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  color: '#A78BFA',
                  marginBottom: '30px',
                  lineHeight: '2'
                }}>
                  Upgrade to <span style={{ color: '#F472B6', fontWeight: 'bold' }}>Luna Plus</span> for:
                  <br/>✨ Unlimited messages
                  <br/>💜 Access to ALL Luna personalities
                  <br/>🔥 Priority responses
                </div>
                <button
                  onClick={() => onLimitReached && onLimitReached()}
                  style={{
                    background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '18px 50px',
                    borderRadius: '35px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 6px 30px rgba(168, 85, 247, 0.5)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ✨ Get Luna Plus Now
                </button>
                </div>
              </>
            ) : (
              /* Mensagem normal */
              <div style={{
                backgroundColor: m.isError 
                  ? '#7F1D1D' 
                  : (m.sender === 'user' ? '#B421F9' : '#1F1F23'),
                padding: '12px 16px',
                borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                color: m.isError ? '#FCA5A5' : 'white',
                fontSize: '15px',
                lineHeight: '1.4',
                wordWrap: 'break-word',
                boxShadow: m.sender === 'user' 
                  ? '0 2px 8px rgba(180, 33, 249, 0.2)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.3)',
                border: m.isError 
                  ? '1px solid rgba(248, 113, 113, 0.3)'
                  : (m.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.05)')
              }}>
                {m.isError && '⚠️ '}
                {m.text}
              </div>
            )}
            {m.sender === 'user' && !m.isLimitReached && (
              <div style={{
                alignSelf: 'flex-end',
                fontSize: '11px',
                color: '#71717A',
                paddingRight: '4px',
                marginTop: '-4px'
              }}>
                You
              </div>
            )}
            {m.sender === 'luna' && !m.isLimitReached && (
              <div style={{
                alignSelf: 'flex-start',
                fontSize: '11px',
                color: '#71717A',
                paddingLeft: '4px',
                marginTop: '-4px'
              }}>
                {selectedLuna?.name || 'Luna'}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div style={{ 
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#71717A',
            fontSize: '14px',
            paddingLeft: '4px'
          }}>
            <div style={{
              display: 'flex',
              gap: '4px',
              padding: '8px 12px',
              backgroundColor: '#1F1F23',
              borderRadius: '18px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <span style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                backgroundColor: '#71717A',
                animation: 'typing 1.4s infinite'
              }}></span>
              <span style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                backgroundColor: '#71717A',
                animation: 'typing 1.4s infinite 0.2s'
              }}></span>
              <span style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                backgroundColor: '#71717A',
                animation: 'typing 1.4s infinite 0.4s'
              }}></span>
            </div>
            <span>{selectedLuna?.name || 'Luna'} is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '20px', backgroundColor: '#09090B' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#111', color: 'white' }}
            placeholder="Type a message..."
          />
          <button onClick={handleSend} style={{ padding: '10px 20px', backgroundColor: '#A855F7', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}