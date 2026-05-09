import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';

export default function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  
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
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', zIndex: 1000 
    }}>
      <div style={{ 
        width: '100%', maxWidth: '500px', height: '100%', 
        display: 'flex', flexDirection: 'column', 
        backgroundColor: '#111', padding: '20px', boxSizing: 'border-box' 
      }}>
        
        {/* KUSURSUZ ÜST BAR */}
        <div style={{ 
          display: 'flex', alignItems: 'center', 
          marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #334155' 
        }}>
          <button 
            onClick={() => navigate('/chats')}
            style={{ 
              background: 'transparent', border: 'none', color: '#fff', 
              fontSize: '24px', cursor: 'pointer', marginRight: '15px', padding: 0 
            }}
          >
            ←
          </button>
          <div style={{ 
            width: '45px', height: '45px', borderRadius: '50%', 
            backgroundColor: '#7c3aed', display: 'flex', justifyContent: 'center', 
            alignItems: 'center', color: '#fff', fontWeight: 'bold', 
            fontSize: '18px', marginRight: '12px' 
          }}>
            {matchedUser ? matchedUser.nickname.charAt(0).toUpperCase() : '?'}
          </div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>
            {matchedUser ? `@${matchedUser.nickname}` : 'Yükleniyor...'}
          </h3>
        </div>

        {/* MESAJLAŞMA ALANI */}
        <div style={{ 
          flex: 1, overflowY: 'auto', padding: '10px', backgroundColor: '#1e293b', 
          borderRadius: '12px', border: '1px solid #334155', marginBottom: '15px' 
        }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#888' }}>Mesajlar şifreleniyor...</p>
          ) : messages.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '50%' }}>İlk adımı sen at...</p>
          ) : (
            messages.map((msg) => {
              const msgDate = formatDateDivider(msg.createdAt);
              const showDateDivider = msgDate !== lastDateString;
              lastDateString = msgDate; 

              return (
                <div key={msg.id}>
                  
                  {/* ÇİZGİLİ TARİH AYRACI */}
                  {showDateDivider && (
                    <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
                      <span style={{ margin: '0 15px', color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        {msgDate}
                      </span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: msg.isMe ? 'flex-end' : 'flex-start', marginBottom: '15px' }}>
                    <div style={{
                      maxWidth: '70%', padding: '8px 12px',
                      borderRadius: msg.isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                      backgroundColor: msg.isMe ? '#7c3aed' : '#334155', 
                      color: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                      display: 'flex', flexDirection: 'column'
                    }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '15px', lineHeight: '1.4' }}>{msg.content}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '10px', color: msg.isMe ? '#e9d5ff' : '#cbd5e1' }}>
                          {formatTime(msg.createdAt)}
                        </span>
                        {msg.isMe && (
                          <span style={{ 
                            fontSize: '13px', 
                            color: msg.isRead ? '#38bdf8' : '#e9d5ff',
                            letterSpacing: msg.isRead ? '-2px' : '0',
                            position: 'relative',
                            right: msg.isRead ? '2px' : '0'
                          }}>
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

        {/* MESAJ GÖNDERME KUTUSU */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajını yaz..." 
            style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '15px' }}
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            style={{ backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', padding: '0 20px', fontWeight: 'bold', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', opacity: newMessage.trim() ? 1 : 0.5 }}
          >
            GÖNDER
          </button>
        </form>

      </div>
    </div>
  );
}