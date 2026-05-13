import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { MessageCircle } from 'lucide-react';

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
    <div className="page-transition" style={{ maxWidth: '520px', margin: '0 auto', padding: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
        <MessageCircle size={20} color="var(--text-primary)" />
        <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: 'var(--font-size-xl)' }}>
          Mesajlar
        </h2>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: 'var(--font-size-sm)' }}>Sohbetler yükleniyor...</p>
      ) : activeMatches.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', padding: 'var(--space-4)', backgroundColor: 'var(--surface-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Henüz kimseyle eşleşmedin. Keşif merkezine dön.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {activeMatches.map((match) => (
            <div 
              key={match.matchId}
              onClick={() => navigate(`/chat/${match.matchId}`)}
              className="interactive-element"
              style={{
                backgroundColor: 'var(--surface-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '50%', 
                backgroundColor: 'var(--accent-primary)', display: 'flex', 
                justifyContent: 'center', alignItems: 'center', 
                color: 'var(--bg-primary)', fontWeight: 'bold', fontSize: '18px', 
                marginRight: 'var(--space-3)', flexShrink: 0 
              }}>
                {match.nickname.charAt(0).toUpperCase()}
              </div>
              
              <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
                <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-medium)' }}>@{match.nickname}</h4>
                <p style={{ 
                  margin: '4px 0 0 0', 
                  color: match.unreadCount > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: match.unreadCount > 0 ? 'var(--font-weight-medium)' : 'normal',
                  fontSize: 'var(--font-size-sm)', 
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
                }}>
                  {match.lastMessage || 'Sohbete başla...'}
                </p>
              </div>

              {match.unreadCount > 0 && (
                <div style={{
                  backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)',
                  fontSize: '11px', fontWeight: 'bold', borderRadius: '50%',
                  width: '20px', height: '20px', display: 'flex',
                  justifyContent: 'center', alignItems: 'center', marginLeft: 'var(--space-2)', flexShrink: 0 
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