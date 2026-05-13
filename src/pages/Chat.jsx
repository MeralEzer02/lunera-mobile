import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import { ChevronLeft, SendHorizonal } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider'; 

import lightBg from '../assets/bg-light.png';
import darkBg from '../assets/bg-dark.png';

export default function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme(); 
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [matchedUser, setMatchedUser] = useState(null); 
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMatchedUser = async () => {
      try {
        const response = await api.get('/Match/active');
        const match = response.data.find(m => m.matchId === parseInt(matchId));
        if (match) setMatchedUser(match);
      } catch (error) {
        console.error("Kullanıcı bilgisi alınamadı:", error);
      }
    };
    fetchMatchedUser();
  }, [matchId]);

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.length === 5 && dateStr.includes(':')) return dateStr; 
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateDivider = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const fetchMessagesSilently = useCallback(async () => {
    try {
      const response = await api.get(`/Message/${matchId}`);
      setMessages(response.data);
      
      const hasUnread = response.data.some(msg => !msg.isMe && !msg.isRead);
      if (hasUnread) {
        await api.post(`/Message/${matchId}/read`).catch(() => {});
      }
    } catch (error) {
      console.error("Mesajlar çekilemedi:", error);
    }
  }, [matchId]);

  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        await fetchMessagesSilently();
      } finally {
        setLoading(false);
      }
    };

    loadInitialMessages(); 
    const interval = setInterval(fetchMessagesSilently, 5000); 
    return () => clearInterval(interval); 
  }, [fetchMessagesSilently]); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageText = newMessage;
    setNewMessage(''); 

    const tempMessage = {
      id: Date.now(),
      isMe: true,
      content: messageText,
      createdAt: new Date().toISOString(), 
      isRead: false 
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      await api.post('/Message', {
        matchId: parseInt(matchId),
        content: messageText
      });
      fetchMessagesSilently();
    } catch (error) {
      console.error(error); 
      toast.error('Mesaj iletilemedi.');
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id)); 
    }
  };

  let lastDateString = null;

  return (
    <div className="page-transition" style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundImage: `url(${theme === 'light' ? lightBg : darkBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex', justifyContent: 'center', zIndex: 2000 
    }}>
      
      {/* SİHİRLİ BLUR KATMANI */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(10, 10, 10, 0.5)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 0
      }}></div>

      <div style={{ 
        width: '100%', maxWidth: '520px', height: '100%', 
        display: 'flex', flexDirection: 'column', 
        padding: 'var(--space-3)', boxSizing: 'border-box',
        position: 'relative', zIndex: 1
      }}>
        
        {/* ÜST BAR */}
        <div style={{ 
          display: 'flex', alignItems: 'center', 
          marginBottom: 'var(--space-3)', padding: 'var(--space-3)', 
          backgroundColor: 'var(--surface-primary)', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-soft)',
          backdropFilter: 'blur(10px)'
        }}>
          <button 
            onClick={() => navigate('/chats')}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', marginRight: 'var(--space-3)', padding: 0, display: 'flex', alignItems: 'center' }}
          >
            <ChevronLeft size={28} />
          </button>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--bg-primary)', 
            fontWeight: 'bold', fontSize: '16px', marginRight: 'var(--space-2)' 
          }}>
            {matchedUser ? matchedUser.nickname.charAt(0).toUpperCase() : '?'}
          </div>
          <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-medium)' }}>
            {matchedUser ? `@${matchedUser.nickname}` : '...'}
          </h3>
        </div>

        {/* MESAJLAŞMA ALANI */}
        <div style={{ 
          flex: 1, overflowY: 'auto', padding: 'var(--space-2)', 
          display: 'flex', flexDirection: 'column', gap: 'var(--space-2)'
        }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>Şifreleniyor...</p>
          ) : messages.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '50%', fontSize: 'var(--font-size-sm)' }}>Sohbeti başlat.</p>
          ) : (
            messages.map((msg) => {
              const msgDate = formatDateDivider(msg.createdAt);
              const showDateDivider = msgDate !== lastDateString;
              lastDateString = msgDate; 

              const bubbleTextColor = msg.isMe ? (theme === 'dark' ? '#121212' : '#ffffff') : 'var(--text-primary)';
              const timeColor = msg.isMe ? (theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)') : 'var(--text-muted)';
              const checkColor = msg.isRead 
                ? (theme === 'dark' ? '#000' : '#fff') 
                : (theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)');

              return (
                <div key={msg.id}>
                  {showDateDivider && (
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'var(--space-4) 0' }}>
                      <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }}></div>
                      <span style={{ margin: '0 var(--space-3)', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)' }}>
                        {msgDate}
                      </span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }}></div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: msg.isMe ? 'flex-end' : 'flex-start', marginBottom: 'var(--space-1)' }}>
                    {/* MESAJ BALONU */}
                    <div style={{
                      maxWidth: '75%', padding: '10px 14px',
                      borderRadius: msg.isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      backgroundColor: msg.isMe ? 'var(--accent-primary)' : 'var(--surface-primary)',
                      border: msg.isMe ? 'none' : '1px solid var(--border-subtle)',
                      color: bubbleTextColor,
                      boxShadow: 'var(--shadow-soft)',
                      display: 'flex', flexDirection: 'column'
                    }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '14px', lineHeight: '1.4' }}>{msg.content}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '10px', color: timeColor }}>
                          {formatTime(msg.createdAt)}
                        </span>
                        {msg.isMe && (
                          <span style={{ fontSize: '12px', color: checkColor, letterSpacing: msg.isRead ? '-2px' : '0', position: 'relative', right: msg.isRead ? '2px' : '0' }}>
                            {msg.isRead ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT ALANI */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesaj..." 
            style={{ 
              flex: 1, padding: '12px var(--space-3)', borderRadius: 'var(--radius-full)', 
              border: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-primary)', 
              color: 'var(--text-primary)', fontSize: 'var(--font-size-md)', outline: 'none',
              boxShadow: 'var(--shadow-soft)', backdropFilter: 'blur(10px)'
            }}
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="interactive-element"
            style={{ 
              backgroundColor: newMessage.trim() ? 'var(--accent-primary)' : 'var(--surface-hover)', 
              color: newMessage.trim() ? (theme === 'dark' ? '#121212' : '#ffffff') : 'var(--text-muted)', 
              border: '1px solid var(--border-subtle)', borderRadius: '50%', 
              width: '46px', height: '46px', display: 'flex', justifyContent: 'center', alignItems: 'center',
              cursor: newMessage.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
              boxShadow: newMessage.trim() ? 'var(--shadow-soft)' : 'none'
            }}
          >
            <SendHorizonal size={20} />
          </button>
        </form>

      </div>
    </div>
  );
}