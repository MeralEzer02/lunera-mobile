import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import { getErrorMessage } from '../utils/getErrorMessage';
import { Radar, Send, X, Check, Inbox, Navigation } from 'lucide-react';

export default function Matches() {
  const [matchData, setMatchData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('incoming');

  const fetchPendingRequests = async () => {
    try {
      const response = await api.get('/Match/pending');
      setPendingRequests(response.data);
    } catch (error) {
      console.error("İstekler çekilemedi:", error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await api.get('/Match/pending');
        setPendingRequests(response.data);
      } catch (error) {
        console.error("İlk yükleme hatası:", error);
      }
    };
    loadInitialData();
  }, []);

  const visibleRequests = pendingRequests.filter(req => {
    const hideTime = new Date(req.expiresAt);
    hideTime.setHours(hideTime.getHours() + 5);
    return new Date() <= hideTime; 
  });

  const incomingRequests = visibleRequests.filter(req => req.isSentByMe === false);
  const outgoingRequests = visibleRequests.filter(req => req.isSentByMe === true);

  const findNewMatch = async () => {
    setLoading(true);
    setMatchData(null); 
    
    try {
      const response = await api.post('/Match/find');
      setMatchData(response.data);
      toast.success('Sistemin seçtiği kullanıcı ekranda!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!matchData) return;
    setActionLoading(true);

    try {
      const response = await api.post(`/Match/request/${matchData.matchedUser.id}`);
      
      if (response.data.isMutual) {
        toast.success('Çift taraflı eşleşme sağlandı! Artık mesajlaşabilirsiniz.', { duration: 4000 });
      } else {
        toast.success('İstek karşı tarafa iletildi. Onay bekleniyor.');
      }

      setMatchData(null); 
      fetchPendingRequests();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptPending = async (matchId) => {
    try {
      await api.post(`/Match/${matchId}/accept`);
      toast.success('Eşleşme sağlandı! Artık mesajlaşabilirsiniz.');
      fetchPendingRequests();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="page-transition" style={{ maxWidth: '520px', margin: '0 auto', padding: 'var(--space-4)', paddingBottom: '100px' }}>
      
      {/* ÜST BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 'var(--font-size-xl)' }}>Keşif Merkezi</h2>
      </div>
      
      {/* RADAR ALANI */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
        <button 
          onClick={findNewMatch} 
          disabled={loading || actionLoading}
          className="interactive-element"
          style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--accent-primary)', 
            color: 'var(--bg-primary)', border: 'none', borderRadius: 'var(--radius-md)', 
            cursor: 'pointer', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', 
            width: '100%', boxShadow: 'var(--shadow-soft)' 
          }}
        >
          <Radar size={20} />
          {loading ? 'Sistem Taranıyor...' : 'Yeni Bağlantı Bul'}
        </button>
      </div>

      {!matchData && !loading && (
        <div style={{ textAlign: 'center', backgroundColor: 'var(--surface-primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backdropFilter: 'blur(10px)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Radarda kimse yok. Aramaya başla.
          </p>
        </div>
      )}

      {matchData && matchData.matchedUser && (
        <div style={{ border: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-soft)', marginBottom: 'var(--space-5)', backdropFilter: 'blur(10px)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--bg-primary)', fontWeight: 'bold', fontSize: '24px', marginBottom: 'var(--space-3)' }}>
            {matchData.matchedUser.nickname ? matchData.matchedUser.nickname.charAt(0).toUpperCase() : '?'}
          </div>
          <h3 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--text-primary)', fontSize: 'var(--font-size-lg)' }}>@{matchData.matchedUser.nickname || "Anonim"}</h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: '1.5', fontStyle: 'italic' }}>
            "{matchData.matchedUser.bio || "Gizemli biri, kendinden bahsetmemiş..."}"
          </p>
          
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <button onClick={handleSendRequest} disabled={actionLoading} className="interactive-element" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '12px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-sm)' }}>
              <Send size={16} /> İSTEK GÖNDER
            </button>
            <button onClick={() => setMatchData(null)} disabled={actionLoading} className="interactive-element" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'var(--surface-hover)', color: 'var(--text-primary)', padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
              <X size={16} /> GEÇ
            </button>
          </div>
        </div>
      )}

      <hr style={{ borderColor: 'var(--border-subtle)', borderStyle: 'solid', margin: 'var(--space-5) 0', opacity: 0.5 }} />

      {/* ŞIK SEKME (TAB) MENÜSÜ */}
      <div style={{ display: 'flex', backgroundColor: 'var(--surface-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-1)', marginBottom: 'var(--space-4)', border: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setActiveTab('incoming')}
          className="interactive-element"
          style={{ 
            flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: 'none', 
            backgroundColor: activeTab === 'incoming' ? 'var(--surface-hover)' : 'transparent', 
            color: activeTab === 'incoming' ? 'var(--text-primary)' : 'var(--text-muted)', 
            fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: 'var(--font-size-sm)'
          }}
        >
          <Inbox size={16} /> Gelenler {incomingRequests.length > 0 && `(${incomingRequests.length})`}
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          className="interactive-element"
          style={{ 
            flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: 'none', 
            backgroundColor: activeTab === 'outgoing' ? 'var(--surface-hover)' : 'transparent', 
            color: activeTab === 'outgoing' ? 'var(--text-primary)' : 'var(--text-muted)', 
            fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: 'var(--font-size-sm)'
          }}
        >
          <Navigation size={16} /> Gönderdiklerim
        </button>
      </div>

      {/* SEKME İÇERİKLERİ */}
      <div style={{ minHeight: '200px' }}>
        
        {/* GELENLER EKRANI */}
        {activeTab === 'incoming' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {incomingRequests.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', textAlign: 'center', backgroundColor: 'var(--surface-primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>Seni bekleyen kimse yok.</p>
            ) : (
              incomingRequests.map(req => {
                const isExpired = new Date(req.expiresAt) <= new Date();
                return (
                  <div key={req.matchId} style={{ border: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isExpired ? 0.5 : 1 }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', textDecoration: isExpired ? 'line-through' : 'none', fontSize: 'var(--font-size-md)' }}>@{req.nickname}</h4>
                      <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: isExpired ? 'var(--text-muted)' : 'var(--accent-primary)' }}>{isExpired ? 'Fırsat kaçtı' : 'Seni bekliyor'}</p>
                    </div>
                    <button 
                      onClick={() => !isExpired && handleAcceptPending(req.matchId)}
                      disabled={isExpired}
                      className="interactive-element"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: isExpired ? 'var(--surface-hover)' : 'var(--text-primary)', color: isExpired ? 'var(--text-muted)' : 'var(--bg-primary)', padding: '8px 12px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: isExpired ? 'not-allowed' : 'pointer', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-xs)' }}
                    >
                      {isExpired ? 'SÜRE DOLDU' : <><Check size={14} /> KABUL ET</>}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* GÖNDERİLENLER EKRANI */}
        {activeTab === 'outgoing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {outgoingRequests.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', textAlign: 'center', backgroundColor: 'var(--surface-primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>Henüz kimseye istek göndermedin.</p>
            ) : (
              outgoingRequests.map(req => {
                const isExpired = new Date(req.expiresAt) <= new Date();
                return (
                  <div key={req.matchId} style={{ border: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isExpired ? 0.5 : 1 }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', textDecoration: isExpired ? 'line-through' : 'none', fontSize: 'var(--font-size-md)' }}>@{req.nickname}</h4>
                      <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{isExpired ? 'Zaman aşımı' : 'Cevap bekleniyor...'}</p>
                    </div>
                    <div style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-secondary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-xs)' }}>
                      {isExpired ? 'İPTAL OLDU' : 'BEKLENİYOR'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
}