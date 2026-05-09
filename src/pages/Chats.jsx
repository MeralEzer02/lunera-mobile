import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function Chats() {
  const [activeMatches, setActiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchActiveMatches = async () => {
    try {
      const response = await api.get('/Match/active');
      setActiveMatches(response.data);
    } catch (error) {
      console.error("Aktif eşleşmeler çekilemedi:", error);
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      await fetchActiveMatches();
      setLoading(false);
    };
    
    loadInitial();

    const interval = setInterval(fetchActiveMatches, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: '#fff', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px', textAlign: 'left' }}>
        Mesajlar 💬
      </h2>

      {loading ? (
        <p style={{ color: '#888', textAlign: 'center' }}>Sohbetler yükleniyor...</p>
      ) : activeMatches.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', marginTop: '50px' }}>
          Henüz kimseyle eşleşmedin. Keşif merkezine dön!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeMatches.map((match) => (
            <div 
              key={match.matchId}
              onClick={() => navigate(`/chat/${match.matchId}`)}
              style={{
                backgroundColor: '#111',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '15px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#111'}
            >
              {/* Profil Yuvarlağı */}
              <div style={{ 
                width: '45px', 
                height: '45px', 
                borderRadius: '50%', 
                backgroundColor: '#7c3aed', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                color: '#fff', 
                fontWeight: 'bold',
                fontSize: '18px',
                marginRight: '15px',
                flexShrink: 0 
              }}>
                {match.nickname.charAt(0).toUpperCase()}
              </div>
              
              {/* İsim ve Son Mesaj (textAlign: 'left' ile sola çiviliyoruz) */}
              <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
                <h4 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>@{match.nickname}</h4>
                <p style={{ 
                  margin: 0, 
                  color: match.unreadCount > 0 ? '#e8ecf0' : '#777',
                  fontWeight: match.unreadCount > 0 ? '500' : 'normal',
                  fontSize: '13px', 
                  marginTop: '4px', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  maxWidth: '100%' 
                }}>
                  {match.lastMessage}
                </p>
              </div>

              {/* Okunmamış Mesaj Sayısı */}
              {match.unreadCount > 0 && (
                <div style={{
                  backgroundColor: '#7c3aed',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '24px', 
                  height: '24px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: '10px',
                  flexShrink: 0 
                }}>
                  {match.unreadCount}
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}